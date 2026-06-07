import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import EditResourceClient from "./EditResourceClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function AlumniEditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Resource Data — pastikan resource milik user ini
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("creator_id", user.id)
    .single();

  if (error || !resource) {
    return (
      <div className="p-8 text-center text-white">Resource tidak ditemukan atau bukan milik kamu.</div>
    );
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href="/alumni" label="Kembali ke Dashboard" className="mb-6" />

        <SectionHeading
          title="Edit Resource"
          subtitle="Perbarui resource yang sudah kamu upload."
        />

        <GlassCard className="mt-8 p-6">
          <EditResourceClient userId={user.id} initialData={resource} />
        </GlassCard>
      </div>
    </section>
  );
}
