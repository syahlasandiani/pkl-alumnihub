import { createClient } from "@/lib/supabase/server";

export interface AlumniEvent {
  id?: string;
  creator_id: string;
  title: string;
  type: "online" | "offline" | string;
  event_date: string;
  event_time: string;
  description?: string | null;
  location?: string | null;
  link?: string | null;
  image_url?: string | null;
  created_at?: string;
  status?: "PUBLISHED" | "CANCELLED" | "ARCHIVED" | "HIDDEN";
  profiles?: { role: string } | null;
}

export async function getEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("event_date", { ascending: true });

  if (error || !data) {
    console.error("Error fetching events:", error);
    return [];
  }

  const creatorIds = data.map(e => e.creator_id).filter(Boolean);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role")
    .in("id", creatorIds);
    
  const roleMap = new Map(profiles?.map(p => [p.id, p.role]) || []);

  return data.map(e => ({
    ...e,
    profiles: { role: roleMap.get(e.creator_id) || "USER" }
  }));
}

export async function getEventDetail(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "PUBLISHED")
    .single();

  if (error || !data) {
    console.error("Error fetching event detail:", error);
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.creator_id)
    .single();

  return { ...data, profiles: profile || { role: "USER" } };
}