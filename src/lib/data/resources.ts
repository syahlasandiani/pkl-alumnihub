import { createClient } from "@/lib/supabase/server";

export interface AlumniResource {
  id?: string;
  creator_id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  created_at?: string;
}

export async function getResources() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    return [];
  }

  return data;
}

export async function createResource(resource: Omit<AlumniResource, 'id' | 'created_at'>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("resources")
    .insert(resource)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
