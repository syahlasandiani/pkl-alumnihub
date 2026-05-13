import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  const redirectToLogin = () => {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  };

  const redirectHome = () => NextResponse.redirect(new URL("/", req.url));

  // /me → redirect langsung ke /alumni (dashboard unified)
  if (pathname === "/me" || pathname.startsWith("/me/")) {
    if (!user) return redirectToLogin();
    return NextResponse.redirect(new URL("/alumni", req.url));
  }

  const needsProfileCheck =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/alumni") ||
    pathname.startsWith("/verify-alumni");

  let profile:
    | {
      role?: string | null;
      verification_status?: string | null;
      account_status?: string | null;
    }
    | null
    | undefined;

  if (needsProfileCheck) {
    if (!user) return redirectToLogin();

    const { data } = await supabase
      .from("profiles")
      .select("role, verification_status, account_status")
      .eq("id", user.id)
      .single();

    profile = data;

    if (profile && profile.account_status && profile.account_status !== "ACTIVE") {
      return redirectHome();
    }
  }

  if (pathname.startsWith("/admin")) {
    if (profile?.role !== "ADMIN") {
      return redirectHome();
    }
  }

  if (pathname === "/alumni") {
    return res;
  }

  const alumniPrivilegedRoutes = [
   "/alumni/create-event",
   "/alumni/upload-resource",
   "/alumni/create-post",
   "/alumni/profile",
  ];

  const isPrivilegedAlumniRoute = alumniPrivilegedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivilegedAlumniRoute) {
    const isAdmin = profile?.role === "ADMIN";
    const isVerified = profile?.verification_status === "VERIFIED";

    if (!isAdmin && !isVerified) {
      return NextResponse.redirect(new URL("/alumni", req.url));
    }
  }

  if (pathname.startsWith("/verify-alumni")) {
    const isAdmin = profile?.role === "ADMIN";
    const isVerified = profile?.verification_status === "VERIFIED";

    if (isAdmin || isVerified) {
      return NextResponse.redirect(new URL("/alumni", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/alumni/:path*", "/verify-alumni", "/me/:path*", "/me"],
};