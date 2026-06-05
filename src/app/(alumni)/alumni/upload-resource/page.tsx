import { redirect } from "next/navigation";
import BackCTA from "@/components/ui/BackCTA";
import UploadResourceClient from "@/components/alumni/UploadResourceClient";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import { canUploadResource } from "@/lib/rbac/access";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";

export default async function UploadResourcePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getMyProfile();
  const isAdmin = profile?.role === "ADMIN";

  if (!profile || !canUploadResource(profile)) {
    redirect(isAdmin ? "/admin" : "/alumni");
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href={isAdmin ? "/admin" : "/alumni"} label="Kembali ke Dashboard" className="mb-6" />

        <SectionHeading
          title="Upload Resource"
          subtitle="Bagikan dokumen pembelajaran, template, atau referensi yang bermanfaat untuk komunitas alumni."
        />

        <GlassCard className="mt-8 p-6">
          <UploadResourceClient userId={user.id} isAdmin={isAdmin} />
        </GlassCard>
      </div>
    </section>
  );
}