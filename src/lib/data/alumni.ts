import { createClient } from "@/lib/supabase/server";

export async function getAlumni() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alumni_profiles")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching all alumni:", error);
    return [];
  }

  return data;
}

export async function getAlumniByLimit(limit: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alumni_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Error fetching alumni with limit ${limit}:`, error);
    return [];
  }

  return data;
}

export async function getAlumniDetail(id: string) {
  const supabase = await createClient();
  
  // Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from("alumni_profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (profileError) {
    console.error("Error fetching alumni profile:", profileError);
    return null;
  }

  // Fetch Experiences
  const { data: experiences, error: expError } = await supabase
    .from("alumni_experiences")
    .select("*")
    .eq("user_id", id)
    .order("start_year", { ascending: false });

  if (expError) {
    console.error("Error fetching alumni experiences:", expError);
  }

  return {
    ...profile,
    experiences: experiences || []
  };
}

export async function getAlumniProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alumni_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching alumni profile:", error);
  }

  return data;
}

export async function getAlumniExperiences(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alumni_experiences")
    .select("*")
    .eq("user_id", userId)
    .order("start_year", { ascending: false });

  if (error) {
    console.error("Error fetching alumni experiences:", error);
    return [];
  }

  return data;
}

export async function getAlumniDashboardStats(userId: string) {
  const supabase = await createClient();

  // 1. Count Articles
  const { count: articlesCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", userId);

  // 2. Count Resources
  const { count: resourcesCount } = await supabase
    .from("resources")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", userId);

  // 3. Count Events
  const { count: eventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", userId);

  // 4. Count Threads (Placeholder)
  const threadsCount = 0;

  // 5. Get Recent Activities
  const [articles, resources, events] = await Promise.all([
    supabase.from("articles").select("title, created_at").eq("creator_id", userId).order("created_at", { ascending: false }).limit(2),
    supabase.from("resources").select("title, created_at").eq("creator_id", userId).order("created_at", { ascending: false }).limit(2),
    supabase.from("events").select("title, created_at").eq("creator_id", userId).order("created_at", { ascending: false }).limit(2),
  ]);

  const activities = [
    ...(articles.data || []).map(a => ({ title: `Artikel: ${a.title}`, meta: `Konten • ${new Date(a.created_at).toLocaleDateString()}`, date: new Date(a.created_at) })),
    ...(resources.data || []).map(r => ({ title: `Resource: ${r.title}`, meta: `Resource • ${new Date(r.created_at).toLocaleDateString()}`, date: new Date(r.created_at) })),
    ...(events.data || []).map(e => ({ title: `Event: ${e.title}`, meta: `Event • ${new Date(e.created_at).toLocaleDateString()}`, date: new Date(e.created_at) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return {
    stats: [
      { label: "Konten", value: articlesCount || 0 },
      { label: "Resource", value: resourcesCount || 0 },
      { label: "Event Aktif", value: eventsCount || 0 },
      { label: "Thread", value: threadsCount },
    ],
    activities
  };
}
