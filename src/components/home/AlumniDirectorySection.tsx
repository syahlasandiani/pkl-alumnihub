// src/components/home/AlumniDirectorySection.tsx
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import AlumniCard from "@/components/alumni/AlumniCard";
import { alumniMock } from "@/lib/data/mock/alumni.mock";

export default function AlumniDirectorySection() {
  return (
    <section id="alumni" className="px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Direktori Alumni"
          subtitle="Preview alumni Beasiswa Unggulan. Untuk daftar lengkap & statistik, buka halaman Direktori."
          align="center"
        />

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {alumniMock.slice(0, 8).map((alumni) => (
            <AlumniCard key={alumni.id} alumni={alumni} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/alumni-directory"
            className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-3 font-semibold hover:opacity-90 transition"
          >
            Lihat Semua Alumni <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}