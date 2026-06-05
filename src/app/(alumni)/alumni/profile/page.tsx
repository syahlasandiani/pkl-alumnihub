import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import AlumniProfileForm from "@/components/alumni/AlumniProfileForm";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";

export default async function AlumniProfilePage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch existing profile
  const { data: profile } = await supabase
    .from("alumni_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch base profile to know verification status
  const { data: baseProfile } = await supabase
    .from("profiles")
    .select("verification_status")
    .eq("id", user.id)
    .single();
  
  const isVerified = baseProfile?.verification_status === "VERIFIED";

  // Fetch existing experiences
  const { data: experiences } = await supabase
    .from("alumni_experiences")
    .select("*")
    .eq("user_id", user.id)
    .order("start_year", { ascending: false });

  const defaultProfile = {
    full_name: user.user_metadata?.display_name || "",
    nickname: "",
    email: user.email || "",
    avatar_url: "",
    gender: "male",
    study_status: "active",
    degree_level: "S1",
    intake_year: "",
    graduation_year: "",
    program: "",
    institution: "",
    city: "",
    current_position: "",
    current_company: "",
    field_of_work: "",
    short_bio: "",
    linkedin_url: "",
    instagram_url: "",
    website_url: "",
  };

  return (
    <section className="px-6 min-h-[calc(100vh-96px)]">
      <div className="mx-auto max-w-6xl w-full pt-6 pb-24">
        <BackCTA href="/alumni" label="Kembali ke Dashboard" className="mb-6" />

        <SectionHeading
          title="Edit Profil"
          subtitle="Kelola profil profesional kamu untuk direktori alumni."
        />

        <div className="mt-8">
          <AlumniProfileForm
            userId={user.id}
            profile={profile || defaultProfile}
            experiences={experiences || []}
            isVerified={isVerified}
          />
        </div>
      </div>
    </section>
  );
}