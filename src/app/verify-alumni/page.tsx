import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import VerifyAlumniPageClient, {
  type VerifyState,
} from "@/components/auth/VerifyAlumniPageClient";

export default async function VerifyAlumniPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/verify-alumni");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("display_name, verification_status, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Jika belum ada di tabel profiles, gunakan fallback dari auth
    profile = {
      display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      verification_status: "NONE",
      role: "USER"
    };
  }

  // admin / verified tidak perlu masuk form verify lagi
  if (profile.role === "ADMIN" || profile.verification_status === "VERIFIED") {
    redirect("/alumni");
  }

  const { data: latestRequest } = await supabase
    .from("verification_requests")
    .select("full_name, intake_year, program, institution, status, admin_note")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let initialState: VerifyState = "NONE";

  if (latestRequest?.status === "PENDING") {
    initialState = "PENDING";
  } else if (latestRequest?.status === "REJECTED") {
    initialState = "REJECTED";
  }

  return (
    <VerifyAlumniPageClient
      initialState={initialState}
      initialFullName={latestRequest?.full_name ?? profile.display_name ?? ""}
      initialIntakeYear={latestRequest?.intake_year?.toString() ?? ""}
      initialProgram={latestRequest?.program ?? ""}
      initialInstitution={latestRequest?.institution ?? ""}
      adminNote={latestRequest?.admin_note ?? null}
    />
  );
}