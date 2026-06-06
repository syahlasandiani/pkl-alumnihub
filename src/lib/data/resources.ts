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

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("status", "PUBLISHED")
    .eq("visibility", "PUBLIC")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching resources:", error);
    return [];
  }

  const creatorIds = data.map(r => r.creator_id).filter(Boolean);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role")
    .in("id", creatorIds);
    
  const roleMap = new Map(profiles?.map(p => [p.id, p.role]) || []);

  return data.map(r => ({
    ...r,
    profiles: { role: roleMap.get(r.creator_id) || "USER" }
  }));
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