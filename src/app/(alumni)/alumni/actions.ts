"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteArticleAction(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: article } = await supabase.from("articles").select("creator_id").eq("id", id).single();
  if (!article) throw new Error("Postingan tidak ditemukan");

  if (article.creator_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "ADMIN") {
      throw new Error("Unauthorized deletion");
    }
  }

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/alumni");
  revalidatePath("/alumni/history");
}

export async function deleteEventAction(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: event } = await supabase.from("events").select("creator_id").eq("id", id).single();
  if (!event) throw new Error("Event tidak ditemukan");

  if (event.creator_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "ADMIN") {
      throw new Error("Unauthorized deletion");
    }
  }

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/alumni");
  revalidatePath("/alumni/history");
}

export async function deleteResourceAction(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: resource } = await supabase.from("resources").select("creator_id").eq("id", id).single();
  if (!resource) throw new Error("Resource tidak ditemukan");

  if (resource.creator_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "ADMIN") {
      throw new Error("Unauthorized deletion");
    }
  }

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/alumni");
  revalidatePath("/alumni/history");
}

export async function updateArticleAction(
  id: string,
  data: { title: string; content: string; cover_url?: string | null }
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: article } = await supabase.from("articles").select("creator_id").eq("id", id).single();
  if (!article) throw new Error("Postingan tidak ditemukan");

  if (article.creator_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "ADMIN") {
      throw new Error("Unauthorized update");
    }
  }

  const { error } = await supabase
    .from("articles")
    .update({
      title: data.title,
      content: data.content,
      cover_url: data.cover_url
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/alumni");
  revalidatePath("/alumni/history");
}

export async function updateEventAction(id: string, data: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: event } = await supabase.from("events").select("creator_id").eq("id", id).single();
  if (!event) throw new Error("Event tidak ditemukan");

  if (event.creator_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "ADMIN") {
      throw new Error("Unauthorized update");
    }
  }

  const { error } = await supabase
    .from("events")
    .update({
      title: data.title,
      type: data.type,
      event_date: data.event_date,
      event_time: data.event_time,
      description: data.description,
      location: data.location,
      link: data.link,
      image_url: data.image_url
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/alumni");
  revalidatePath("/alumni/history");
}

export async function updateResourceAction(id: string, data: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: resource } = await supabase.from("resources").select("creator_id").eq("id", id).single();
  if (!resource) throw new Error("Resource tidak ditemukan");

  if (resource.creator_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "ADMIN") {
      throw new Error("Unauthorized update");
    }
  }

  const { error } = await supabase
    .from("resources")
    .update({
      title: data.title,
      description: data.description,
      file_url: data.file_url,
      file_type: data.file_type,
      file_size: data.file_size,
      visibility: data.visibility,
      category: data.category
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/alumni");
  revalidatePath("/alumni/history");
}
