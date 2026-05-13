// src/components/home/LearningHubSection.tsx
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import HubCard from "@/components/learning-hub/HubCard";
import { CalendarDays, BookOpen, FileText } from "lucide-react";

export default function LearningHubSection() {
  const items = [
    {
      title: "Event Alumni",
      description: "Webinar, mentoring, sharing session, dan kolaborasi.",
      href: "/learning-hub/events",
      icon: CalendarDays,
    },
    {
      title: "Konten Unggulan",
      description: "Artikel persiapan, karier, akademik, komunitas.",
      href: "/learning-hub/articles",
      icon: BookOpen,
    },
    {
      title: "Resources",
      description: "Template, contoh essay, dan panduan berkas.",
      href: "/learning-hub/resources",
      icon: FileText,
    },
  ];

  return (
    <section id="learning-hub" className="px-6 scroll-mt-32 py-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Learning Hub"
          subtitle="Pusat pembelajaran komunitas: event, konten unggulan, dan resources."
          align="left"
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <HubCard key={item.title} {...item} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/learning-hub"
            className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-3 font-semibold hover:opacity-90 transition"
          >
            Masuk Learning Hub <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}