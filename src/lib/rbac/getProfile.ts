import { createServerClient } from "@/lib/supabase/server";

export async function getMyProfile() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, verification_status, display_name, avatar_url, bio, account_status")
    .eq("id", user.id)
    .single();

  return profile ?? null;
}