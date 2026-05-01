import { notFound } from "next/navigation";
import Link from "next/link";
import { getAlumniDetail } from "@/lib/data/alumni";

export default async function AlumniDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const alumni = await getAlumniDetail(id);

  if (!alumni) {
    notFound();
  }

  const workExperiences = alumni.experiences.filter((exp: any) => exp.type === "WORK");
  const achievements = alumni.experiences.filter((exp: any) => exp.type === "ACHIEVEMENT");

  return (
    <main className="relative text-white selection:bg-white/20">
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        {/* Tombol Kembali */}
        <Link
          href="/alumni-directory"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium transition hover:bg-white/20 backdrop-blur-md"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </Link>

        {/* Header Profile Card */}
        <div className="mb-8 rounded-[32px] border border-white/15 bg-white/10 p-10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
              {alumni.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={alumni.avatar_url}
                  alt={alumni.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold uppercase text-white/20">
                  {alumni.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-white">
                {alumni.full_name}
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {alumni.institution || "Universitas Alumni"} • Alumni BU {alumni.intake_year || ""}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-medium text-white/50">{alumni.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Informasi Umum */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-sm font-bold text-white">Informasi Umum</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox label="Tahun Masuk" value={alumni.intake_year} />
              <DetailBox label="Tahun Lulus" value={alumni.graduation_year} />
              <DetailBox label="Jenis Kelamin" value={alumni.gender === 'male' ? 'Laki-laki' : alumni.gender === 'female' ? 'Perempuan' : '-'} />
              <DetailBox label="Status" value={alumni.study_status === 'graduated' ? 'Lulus' : alumni.study_status === 'active' ? 'Aktif' : '-'} />
              <DetailBox label="Provinsi" value={alumni.city || "-"} />
              <DetailBox label="Kota/Kabupaten" value={alumni.city || "-"} />
            </div>
          </section>

          {/* Pekerjaan */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-sm font-bold text-white">Pekerjaan</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox label="Perusahaan" value={alumni.current_company || "-"} />
              <DetailBox label="Posisi" value={alumni.current_position || "-"} />
              <DetailBox label="Tahun Mulai" value={workExperiences[0]?.start_year || "-"} />
              <DetailBox label="Tahun Selesai" value={workExperiences[0]?.end_year || "-"} />
            </div>
          </section>

          {/* Pengalaman */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-sm font-bold text-white">Pengalaman</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox 
                label="Pengalaman" 
                value={achievements.length > 0 ? achievements[0].title : "Project / organisasi / volunteer singkat."} 
              />
              <DetailBox 
                label="Tahun" 
                value={achievements.length > 0 ? achievements[0].achievement_year : "2023"} 
              />
            </div>
          </section>

          {/* Prestasi */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-sm font-bold text-white">Prestasi</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox 
                label="Prestasi" 
                value={achievements.length > 1 ? achievements[1].title : "-"} 
              />
              <DetailBox 
                label="Tahun" 
                value={achievements.length > 1 ? achievements[1].achievement_year : "-"} 
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DetailBox({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
      <p className="mb-1 text-[10px] font-medium text-white/40">{label}</p>
      <p className="text-sm font-semibold text-white">{value || "-"}</p>
    </div>
  );
}
