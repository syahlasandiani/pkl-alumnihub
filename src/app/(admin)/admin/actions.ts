"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminDashboardStats() {
  const supabase = await createClient();
  
  const [
    { count: usersCount },
    { count: eventsCount },
    { count: articlesCount },
    { count: resourcesCount },
    { count: pendingVerificationsCount },
    { count: verifiedUsersCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("verification_requests").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("verification_status", "VERIFIED"),
  ]);

  return {
    users: usersCount || 0,
    events: eventsCount || 0,
    articles: articlesCount || 0,
    resources: resourcesCount || 0,
    pendingVerifications: pendingVerificationsCount || 0,
    verifiedUsers: verifiedUsersCount || 0,
  };
}

export async function getAdminUsers() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, display_name, verification_status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !profiles) return [];

  const profileIds = profiles.map((p) => p.id);
  const { data: alumniProfiles } = await supabase
    .from("alumni_profiles")
    .select("user_id, email")
    .in("user_id", profileIds);

  const emailMap = new Map(
    alumniProfiles?.map((ap) => [ap.user_id, ap.email]) || []
  );

  return profiles.map((p) => ({
    id: p.id,
    display_name: p.display_name,
    verification_status: p.verification_status,
    email: emailMap.get(p.id) || null,
    created_at: p.created_at,
  }));
}

export async function getAdminEvents() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, type, status, created_at, creator_id")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !events) return [];

  const creatorIds = Array.from(new Set(events.map((e: any) => e.creator_id).filter(Boolean)));
  let profileMap = new Map();
  if (creatorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", creatorIds);
    profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
  }
  
  return events.map((d: any) => ({
    id: d.id,
    title: d.title,
    type: d.type,
    status: d.status,
    creator_name: profileMap.get(d.creator_id)?.display_name || "Unknown",
    created_at: d.created_at
  }));
}

export async function getAdminArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, author_name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return [];
  
  return data.map((d: any) => ({
    id: d.id,
    title: d.title,
    creator_name: d.author_name || "Unknown",
    status: d.status,
    created_at: d.created_at
  }));
}

export async function getAdminResources() {
  const supabase = await createClient();
  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, title, file_url, category, status, created_at, creator_id")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !resources) return [];

  const creatorIds = Array.from(new Set(resources.map((r: any) => r.creator_id).filter(Boolean)));
  let profileMap = new Map();
  if (creatorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", creatorIds);
    profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
  }
  
  return resources.map((d: any) => ({
    id: d.id,
    title: d.title,
    file_url: d.file_url,
    category: d.category,
    status: d.status,
    creator_name: profileMap.get(d.creator_id)?.display_name || "Unknown",
    created_at: d.created_at
  }));
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteResource(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

// Server actions untuk dipanggil setelah realtime event dari client
export async function refreshAdminEvents() {
  return getAdminEvents();
}

export async function refreshAdminResources() {
  return getAdminResources();
}

export async function refreshAdminStats() {
  return getAdminDashboardStats();
}
