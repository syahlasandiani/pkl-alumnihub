import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import EditEventClient from "@/components/alumni/EditEventClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
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

  // Fetch existing event details
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  // Ensure owner or admin
  if (event.creator_id !== user.id && !isAdmin) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href={isAdmin ? "/admin" : "/alumni/history"} label="Kembali ke Riwayat" className="mb-6" />

        <SectionHeading
          title="Edit Event"
          subtitle="Perbarui webinar, mentoring, atau acara lainnya untuk alumni."
        />

        <GlassCard className="mt-8 p-6">
          <EditEventClient 
            userId={user.id} 
            isAdmin={isAdmin} 
            event={event}
          />
        </GlassCard>
      </div>
    </section>
  );
}
