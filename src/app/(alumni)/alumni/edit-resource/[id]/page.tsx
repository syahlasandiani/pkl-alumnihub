import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import EditResourceClient from "@/components/alumni/EditResourceClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

interface EditResourcePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
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

  // Fetch existing resource details
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !resource) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  // Ensure owner or admin
  if (resource.creator_id !== user.id && !isAdmin) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href={isAdmin ? "/admin" : "/alumni/history"} label="Kembali ke Riwayat" className="mb-6" />

        <SectionHeading
          title="Edit Resource"
          subtitle="Perbarui deskripsi, kategori, visibilitas, atau bagikan file dokumen baru."
        />

        <GlassCard className="mt-8 p-6">
          <EditResourceClient 
            userId={user.id} 
            isAdmin={isAdmin} 
            resource={resource}
          />
        </GlassCard>
      </div>
    </section>
  );
}
