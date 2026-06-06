import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import EditEventClient from "./EditEventClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function AdminEditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  const profile = await getMyProfile();
  const isAdmin = profile?.role === "ADMIN";

  if (!isAdmin) {
    redirect("/");
  }

  // Fetch Event Data
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !event) {
    return (
      <div className="p-8 text-center text-white">Event tidak ditemukan.</div>
    );
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href="/admin" label="Kembali ke Dashboard Admin" className="mb-6" />

        <SectionHeading
          title="Edit Event"
          subtitle="Perbarui informasi event komunitas."
        />

        <GlassCard className="mt-8 p-6">
          <EditEventClient userId={user.id} initialData={event} />
        </GlassCard>
      </div>
    </section>
  );
}
