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

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error.message, error.details, error.hint);
    return [];
  }

  if (events && events.length > 0) {
    const creatorIds = Array.from(new Set(events.map(e => e.creator_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, role")
      .in("id", creatorIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    return events.map(e => ({
      ...e,
      profiles: profileMap.get(e.creator_id) || null
    }));
  }

  return events || [];
}

export async function getEventDetail(id: string) {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "PUBLISHED")
    .single();

  if (error || !event) {
    console.error("Error fetching event detail:", error);
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", event.creator_id)
    .single();

  return {
    ...event,
    profiles: profile || null
  };
}