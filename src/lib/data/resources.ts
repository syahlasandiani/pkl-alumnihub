import { createClient } from "@/lib/supabase/server";

export type ResourceVisibility = "PUBLIC" | "MEMBERS_ONLY";
export type ResourceStatus = "PUBLISHED" | "ARCHIVED" | "HIDDEN";

export interface AlumniResource {
  id?: string;
  creator_id: string;
  title: string;
  description?: string | null;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
  visibility?: ResourceVisibility;
  category?: string | null;
  status?: ResourceStatus;
  created_at?: string;
  profiles?: { role: string } | null;
}

export async function getResources() {
  const supabase = await createClient();

  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "PUBLISHED")
    .eq("visibility", "PUBLIC")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    return [];
  }

  if (resources && resources.length > 0) {
    const creatorIds = Array.from(new Set(resources.map(r => r.creator_id)));
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, role")
      .in("id", creatorIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
    return resources.map(r => ({
      ...r,
      profiles: profileMap.get(r.creator_id) || null
    }));
  }

  return resources || [];
}

export async function createResource(
  resource: Omit<AlumniResource, "id" | "created_at">
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("resources")
    .insert({
      ...resource,
      visibility: resource.visibility ?? "PUBLIC",
      status: resource.status ?? "PUBLISHED",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}