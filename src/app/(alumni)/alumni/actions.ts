"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper: Ambil dan validasi user + profile
async function getValidatedUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: "Tidak terautentikasi. Silakan login ulang.", supabase: null, user: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, verification_status, account_status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.account_status !== "ACTIVE") {
    return { error: "Akun tidak aktif.", supabase: null, user: null };
  }

  const isAllowed = profile.role === "ADMIN" || profile.verification_status === "VERIFIED";
  if (!isAllowed) {
    return { error: "Hanya Alumni Verified yang dapat melakukan aksi ini.", supabase: null, user: null };
  }

  return { error: null, supabase, user };
}

// =====================================================
// UPLOAD FILE KE STORAGE (server-side, bypass RLS)
// =====================================================
export async function uploadFileToStorage(
  bucket: string,
  filePath: string,
  fileBase64: string,
  contentType: string
): Promise<{ url: string | null; error: string | null }> {
  const { error: authErr, supabase } = await getValidatedUser();
  if (authErr || !supabase) return { url: null, error: authErr || "Auth error" };

  const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, { contentType, upsert: false });

  if (uploadError) {
    console.error("[uploadFileToStorage] error:", uploadError);
    return { url: null, error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { url: publicUrl, error: null };
}

// =====================================================
// CREATE ARTIKEL
// =====================================================
export async function createArticleAction(formData: {
  title: string;
  content: string;
  cover_url: string | null;
  author_name: string;
}) {
  const { error: authErr, supabase, user } = await getValidatedUser();
  if (authErr || !supabase || !user) return { error: authErr || "Auth error" };

  const { error } = await supabase.from("articles").insert({
    creator_id: user.id,
    author_name: formData.author_name,
    title: formData.title,
    content: formData.content,
    cover_url: formData.cover_url,
    published_at: new Date().toISOString(),
    status: "PUBLISHED",
  });

  if (error) {
    console.error("[createArticleAction] error:", error);
    return { error: `${error.message} (code: ${error.code})` };
  }

  revalidatePath("/alumni");
  revalidatePath("/learning-hub");
  return { success: true };
}

// =====================================================
// CREATE EVENT
// =====================================================
export async function createEventAction(formData: {
  title: string;
  type: string;
  event_date: string;
  event_time: string;
  description: string;
  location?: string | null;
  link?: string | null;
  image_url?: string | null;
}) {
  const { error: authErr, supabase, user } = await getValidatedUser();
  if (authErr || !supabase || !user) return { error: authErr || "Auth error" };

  const { error } = await supabase.from("events").insert({
    creator_id: user.id,
    title: formData.title,
    type: formData.type,
    event_date: formData.event_date,
    event_time: formData.event_time,
    description: formData.description,
    location: formData.type === "offline" ? formData.location || null : null,
    link: formData.type === "online" ? formData.link || null : null,
    image_url: formData.image_url || null,
    status: "PUBLISHED",
  });

  if (error) {
    console.error("[createEventAction] error:", error);
    return { error: `${error.message} (code: ${error.code})` };
  }

  revalidatePath("/alumni");
  revalidatePath("/learning-hub");
  return { success: true };
}

// =====================================================
// CREATE RESOURCE
// =====================================================
export async function createResourceAction(formData: {
  title: string;
  description?: string | null;
  category: string;
  visibility: string;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
}) {
  const { error: authErr, supabase, user } = await getValidatedUser();
  if (authErr || !supabase || !user) return { error: authErr || "Auth error" };

  const { error } = await supabase.from("resources").insert({
    creator_id: user.id,
    title: formData.title,
    description: formData.description || null,
    category: formData.category,
    visibility: formData.visibility,
    file_url: formData.file_url,
    file_type: formData.file_type || null,
    file_size: formData.file_size || null,
    status: "PUBLISHED",
  });

  if (error) {
    console.error("[createResourceAction] error:", error);
    return { error: `${error.message} (code: ${error.code})` };
  }

  revalidatePath("/alumni");
  revalidatePath("/learning-hub");
  return { success: true };
}

// =====================================================
// UPDATE ARTIKEL
// =====================================================
export async function updateArticleAction(id: string, formData: {
  title: string;
  content: string;
  cover_url: string | null;
}) {
  const { error: authErr, supabase, user } = await getValidatedUser();
  if (authErr || !supabase || !user) return { error: authErr || "Auth error" };

  const { error } = await supabase
    .from("articles")
    .update({ title: formData.title, content: formData.content, cover_url: formData.cover_url })
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) {
    console.error("[updateArticleAction] error:", error);
    return { error: `${error.message} (code: ${error.code})` };
  }
  revalidatePath("/alumni");
  revalidatePath("/learning-hub");
  return { success: true };
}

// =====================================================
// UPDATE EVENT
// =====================================================
export async function updateEventAction(id: string, formData: {
  title: string;
  type: string;
  event_date: string;
  event_time: string;
  description: string;
  location?: string | null;
  link?: string | null;
  image_url?: string | null;
  status?: string;
}) {
  const { error: authErr, supabase, user } = await getValidatedUser();
  if (authErr || !supabase || !user) return { error: authErr || "Auth error" };

  const { error } = await supabase
    .from("events")
    .update({
      title: formData.title,
      type: formData.type,
      event_date: formData.event_date,
      event_time: formData.event_time,
      description: formData.description,
      location: formData.type === "offline" ? formData.location || null : null,
      link: formData.type === "online" ? formData.link || null : null,
      image_url: formData.image_url || null,
      status: formData.status || "PUBLISHED",
    })
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) {
    console.error("[updateEventAction] error:", error);
    return { error: `${error.message} (code: ${error.code})` };
  }
  revalidatePath("/alumni");
  revalidatePath("/learning-hub");
  return { success: true };
}

// =====================================================
// UPDATE RESOURCE
// =====================================================
export async function updateResourceAction(id: string, formData: {
  title: string;
  description?: string | null;
  category: string;
  visibility: string;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
}) {
  const { error: authErr, supabase, user } = await getValidatedUser();
  if (authErr || !supabase || !user) return { error: authErr || "Auth error" };

  const { error } = await supabase
    .from("resources")
    .update({
      title: formData.title,
      description: formData.description || null,
      category: formData.category,
      visibility: formData.visibility,
      file_url: formData.file_url,
      file_type: formData.file_type || null,
      file_size: formData.file_size || null,
    })
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) {
    console.error("[updateResourceAction] error:", error);
    return { error: `${error.message} (code: ${error.code})` };
  }
  revalidatePath("/alumni");
  revalidatePath("/learning-hub");
  return { success: true };
}

// =====================================================
// SAVE ALUMNI PROFILE
// =====================================================
export async function saveProfileAction(formData: {
  full_name: string;
  email?: string | null;
  avatar_url?: string | null;
  degree_level?: string | null;
  graduation_year?: number | null;
  program?: string | null;
  institution?: string | null;
  city?: string | null;
  current_position?: string | null;
  current_company?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  website_url?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Tidak terautentikasi." };

  const payload = { user_id: user.id, ...formData, updated_at: new Date().toISOString() };

  const { data: existing } = await supabase
    .from("alumni_profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("alumni_profiles").update(payload).eq("user_id", user.id)
    : await supabase.from("alumni_profiles").insert(payload);

  if (error) {
    console.error("[saveProfileAction] error:", error);
    return { error: `${error.message} (code: ${error.code})` };
  }

  // Sync display_name in base profiles table
  await supabase.from("profiles").update({ display_name: formData.full_name }).eq("id", user.id);

  revalidatePath("/alumni/profile");
  revalidatePath("/alumni-directory");
  return { success: true };
}

// =====================================================
// SAVE ALUMNI EXPERIENCES
// =====================================================
export async function saveExperiencesAction(experiences: Array<{
  type: string;
  title: string;
  organization?: string | null;
  role_name?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  achievement_year?: number | null;
  description?: string | null;
}>) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Tidak terautentikasi." };

  // Hapus semua dulu, lalu insert ulang (untuk simpelnya sync array)
  const { error: deleteError } = await supabase
    .from("alumni_experiences")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("[saveExperiencesAction] delete error:", deleteError);
    return { error: deleteError.message };
  }

  const clean = experiences
    .filter((item) => item.title?.trim())
    .map((item) => ({ user_id: user.id, ...item }));

  if (clean.length > 0) {
    const { error: insertError } = await supabase.from("alumni_experiences").insert(clean);
    if (insertError) {
      console.error("[saveExperiencesAction] insert error:", insertError);
      return { error: insertError.message };
    }
  }

  revalidatePath("/alumni/profile");
  revalidatePath("/alumni-directory");
  return { success: true };
}
