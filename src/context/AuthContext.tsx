"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client"; // ✅ ganti ini

type AppUser = {
  id: string;
  email: string | null;
  username: string;
  role?: "USER" | "ADMIN";
  verification_status?: "NONE" | "PENDING" | "REJECTED" | "VERIFIED";
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
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // ✅ bikin supabase client sekali
  const supabase = useMemo(() => createClient(), []);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);

  async function refresh() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session ?? null);
    setUser(mapSupabaseUser(data.session?.user ?? null));
  }

  useEffect(() => {
    refresh();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setUser(mapSupabaseUser(s?.user ?? null));
    });

    return () => {
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const isAuthenticated = !!session;

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);

    router.push("/");
    router.refresh(); // ✅ penting
  }

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, user, session, logout, refresh }),
    [isAuthenticated, user, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}