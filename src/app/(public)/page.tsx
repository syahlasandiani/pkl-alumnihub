import Hero from "@/components/home/Hero";
import ScheduleSection from "@/components/home/ScheduleSection";
import AlumniDirectorySection from "@/components/home/AlumniDirectorySection";
import LearningHubSection from "@/components/home/LearningHubSection";
import FaqSection from "@/components/home/FaqSection";
import { getAlumniByLimit } from "@/lib/data/alumni";

export default async function Home() {
  const alumni = await getAlumniByLimit(8);

  return (
    <div className="space-y-32 md:space-y-44 pb-28">
      <Hero />
      <ScheduleSection />
      <AlumniDirectorySection initialData={alumni} />
      <LearningHubSection />
      <FaqSection />
    </div>
  );
}