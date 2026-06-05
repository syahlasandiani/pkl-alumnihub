import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import CreatePostClient from "@/components/alumni/CreatePostClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function CreatePostPage() {
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
          title="Buat Konten"
          subtitle="Tulis artikel, panduan, atau cerita pengalamanmu."
        />

        <GlassCard className="mt-8 p-6">
          <CreatePostClient userId={user.id} authorName={profile.display_name || "Alumni"} isAdmin={isAdmin} />
        </GlassCard>
      </div>
    </section>
  );
}
