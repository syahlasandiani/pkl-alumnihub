import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import EditPostClient from "@/components/alumni/EditPostClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  const profile = await getMyProfile();
  const isAdmin = profile?.role === "ADMIN";
  const isVerified = profile?.verification_status === "VERIFIED";

  if (!profile || (!isVerified && !isAdmin)) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  // Fetch existing post details
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  // Ensure owner or admin
  if (article.creator_id !== user.id && !isAdmin) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href={isAdmin ? "/admin" : "/alumni/history"} label="Kembali ke Riwayat" className="mb-6" />

        <SectionHeading
          title="Edit Konten"
          subtitle="Perbarui artikel, panduan, atau cerita pengalamanmu."
        />

        <GlassCard className="mt-8 p-6">
          <EditPostClient 
            userId={user.id} 
            authorName={profile.display_name || "Alumni"} 
            isAdmin={isAdmin} 
            article={article}
          />
        </GlassCard>
      </div>
    </section>
  );
}
