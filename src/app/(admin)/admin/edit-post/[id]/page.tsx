import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import EditPostClient from "./EditPostClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  const profile = await getMyProfile();
  const isAdmin = profile?.role === "ADMIN";

  if (!isAdmin) {
    redirect("/");
  }

  // Fetch Article Data
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !article) {
    return (
      <div className="p-8 text-center text-white">Konten tidak ditemukan.</div>
    );
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href="/admin" label="Kembali ke Dashboard Admin" className="mb-6" />

        <SectionHeading
          title="Edit Konten"
          subtitle="Perbarui artikel atau pengumuman komunitas."
        />

        <GlassCard className="mt-8 p-6">
          <EditPostClient userId={user.id} initialData={article} />
        </GlassCard>
      </div>
    </section>
  );
}
