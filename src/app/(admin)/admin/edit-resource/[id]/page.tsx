import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import EditResourceClient from "./EditResourceClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function AdminEditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  const profile = await getMyProfile();
  const isAdmin = profile?.role === "ADMIN";

  if (!isAdmin) {
    redirect("/");
  }

  // Fetch Resource Data
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !resource) {
    return (
      <div className="p-8 text-center text-white">Resource tidak ditemukan.</div>
    );
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href="/admin" label="Kembali ke Dashboard Admin" className="mb-6" />

        <SectionHeading
          title="Edit Resource"
          subtitle="Perbarui dokumen atau resource pembelajaran."
        />

        <GlassCard className="mt-8 p-6">
          <EditResourceClient userId={user.id} initialData={resource} />
        </GlassCard>
      </div>
    </section>
  );
}
