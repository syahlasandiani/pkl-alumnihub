import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import EditEventClient from "./EditEventClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function AlumniEditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Event Data — pastikan event milik user ini
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("creator_id", user.id)
    .single();

  if (error || !event) {
    return (
      <div className="p-8 text-center text-white">Event tidak ditemukan atau bukan milik kamu.</div>
    );
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href="/alumni" label="Kembali ke Dashboard" className="mb-6" />

        <SectionHeading
          title="Edit Event"
          subtitle="Perbarui informasi event yang sudah kamu buat."
        />

        <GlassCard className="mt-8 p-6">
          <EditEventClient userId={user.id} initialData={event} />
        </GlassCard>
      </div>
    </section>
  );
}
