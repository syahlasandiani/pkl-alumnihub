"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type UserRole = "USER" | "ADMIN";
type AccountStatus = "ACTIVE" | "DISABLED";
type VerificationStatus = "NONE" | "PENDING" | "REJECTED" | "VERIFIED";

type AppUser = {
  id: string;
  email: string | null;
  username: string;
  role: UserRole;
  account_status: AccountStatus;
  verification_status: VerificationStatus;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AppUser | null;
  session: Session | null;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function prettifyNameFromEmail(email: string) {
  const base = email.split("@")[0] || "User";

  return base
    .replace(/[._-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mapSupabaseUser(u: SupabaseUser | null): AppUser | null {
  if (!u) return null;

  const metaName =
    (u.user_metadata?.display_name as string | undefined) ||
    (u.user_metadata?.full_name as string | undefined) ||
    (u.user_metadata?.name as string | undefined);

  const username =
    metaName?.trim() || (u.email ? prettifyNameFromEmail(u.email) : "User");

  return {
    id: u.id,
    email: u.email ?? null,
    username,
    role: "USER",
    account_status: "ACTIVE",
    verification_status: "NONE",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);

  // Cache to avoid redundant profile fetches for same user id
  const profileCacheRef = useRef<{ id: string; data: Partial<AppUser> } | null>(null);

  const enrichWithProfile = useCallback(
    async (baseUser: AppUser | null): Promise<AppUser | null> => {
      if (!baseUser) return null;

      // Return cached profile if same user
      if (profileCacheRef.current?.id === baseUser.id) {
        return { ...baseUser, ...profileCacheRef.current.data };
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role, account_status, verification_status, display_name")
        .eq("id", baseUser.id)
        .maybeSingle();

      if (error || !data) {
        return baseUser;
      }

      const profileData: Partial<AppUser> = {
        username: data.display_name?.trim() || baseUser.username,
        role: (data.role as UserRole) ?? "USER",
        account_status: (data.account_status as AccountStatus) ?? "ACTIVE",
        verification_status:
          (data.verification_status as VerificationStatus) ?? "NONE",
      };

      // Cache it
      profileCacheRef.current = { id: baseUser.id, data: profileData };

      return { ...baseUser, ...profileData };
    },
    [supabase]
  );

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const currentSession = data.session ?? null;

    setSession(currentSession);

    const base = mapSupabaseUser(currentSession?.user ?? null);
    const enriched = await enrichWithProfile(base);

    setUser(enriched);
  }, [supabase, enrichWithProfile]);

  useEffect(() => {
    // Initial load — use getSession() (fast, no network call)
    refresh();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s ?? null);

        // On sign out, clear immediately — no need to fetch profile
        if (event === "SIGNED_OUT" || !s?.user) {
          setUser(null);
          profileCacheRef.current = null;
          return;
        }

        // Invalidate cache on sign in (new user)
        if (event === "SIGNED_IN") {
          profileCacheRef.current = null;
        }

        const base = mapSupabaseUser(s.user);
        const enriched = await enrichWithProfile(base);
        setUser(enriched);
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const isAuthenticated = !!session;

  const logout = useCallback(async () => {
    // Clear state immediately for instant UI feedback
    setSession(null);
    setUser(null);
    profileCacheRef.current = null;

    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }, [supabase, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      session,
      logout,
      refresh,
    }),
    [isAuthenticated, user, session, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }

  return ctx;
}