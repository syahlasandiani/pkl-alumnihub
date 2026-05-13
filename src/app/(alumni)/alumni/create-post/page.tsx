import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/rbac/getProfile";
import CreatePostClient from "@/components/alumni/CreatePostClient";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";

export default async function CreatePostPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  const profile = await getMyProfile();
  if (!profile || profile.verification_status !== "VERIFIED") {
    redirect("/alumni");
  }

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href="/alumni" label="Kembali ke Dashboard" className="mb-6" />

        <SectionHeading
          title="Buat Konten"
          subtitle="Tulis artikel, panduan, atau cerita pengalamanmu."
        />

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          <CreatePostClient userId={user.id} authorName={profile.display_name || "Alumni"} />
        </div>
      </div>
    </section>
  );
}
