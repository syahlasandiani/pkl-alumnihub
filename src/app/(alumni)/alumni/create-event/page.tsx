import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import CreateEventClient from "@/components/alumni/CreateEventClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function CreateEventPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  const profile = await getMyProfile();
  const isAdmin = profile?.role === "ADMIN";
  const isVerified = profile?.verification_status === "VERIFIED";

  if (!profile || (!isVerified && !isAdmin)) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href={isAdmin ? "/admin" : "/alumni"} label="Kembali ke Dashboard" className="mb-6" />

        <SectionHeading
          title="Buat Event"
          subtitle="Buat webinar, mentoring, atau acara lainnya untuk alumni."
        />

        <GlassCard className="mt-8 p-6">
          <CreateEventClient userId={user.id} isAdmin={isAdmin} />
        </GlassCard>
      </div>
    </section>
  );
}