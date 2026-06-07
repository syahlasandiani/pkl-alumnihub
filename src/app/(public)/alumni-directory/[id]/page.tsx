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
                {alumni.institution || "Universitas"} {alumni.degree_level ? `• ${alumni.degree_level}` : ""}
              </p>
              <div className="mt-4 flex gap-4">
                {alumni.linkedin_url && (
                  <a href={alumni.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-[#7dd3d3] hover:underline">LinkedIn</a>
                )}
                {alumni.instagram_url && (
                  <a href={alumni.instagram_url} target="_blank" rel="noreferrer" className="text-xs text-[#7dd3d3] hover:underline">Instagram</a>
                )}
                {alumni.website_url && (
                  <a href={alumni.website_url} target="_blank" rel="noreferrer" className="text-xs text-[#7dd3d3] hover:underline">Website</a>
                )}
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-medium text-white/50">{alumni.email || "-"}</p>
              <p className="text-xs font-medium text-white/50 mt-1">{alumni.city || "Kota Tidak Diketahui"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Informasi Umum */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-sm font-bold text-white">Informasi Pendidikan</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailBox label="Jenjang" value={alumni.degree_level || "-"} />
              <DetailBox label="Institusi / Kampus" value={alumni.institution || "-"} />
              <DetailBox label="Program Studi" value={alumni.program || "-"} />
              <DetailBox label="Tahun Lulus" value={alumni.graduation_year || "-"} />
            </div>
          </section>

          {/* Pekerjaan */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-sm font-bold text-white">Pekerjaan Saat Ini</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox label="Perusahaan / Instansi" value={alumni.current_company || "-"} />
              <DetailBox label="Posisi" value={alumni.current_position || "-"} />
            </div>
          </section>

          {/* Pengalaman */}
          {workExperiences.length > 0 && (
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-sm font-bold text-white">Riwayat Pengalaman</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="space-y-4">
                {workExperiences.map((exp: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-semibold text-white">{exp.title}</h3>
                      <p className="text-xs text-[#7dd3d3] mt-1 sm:mt-0">{exp.start_year || "-"} s/d {exp.end_year || "Sekarang"}</p>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{exp.organization || "-"} {exp.role_name ? `• ${exp.role_name}` : ""}</p>
                    {exp.description && <p className="text-xs text-white/50">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prestasi */}
          {achievements.length > 0 && (
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-sm font-bold text-white">Riwayat Prestasi</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="space-y-4">
                {achievements.map((exp: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-semibold text-white">{exp.title}</h3>
                      <p className="text-xs text-[#7dd3d3] mt-1 sm:mt-0">Tahun {exp.achievement_year || "-"}</p>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{exp.organization || "-"} {exp.role_name ? `• ${exp.role_name}` : ""}</p>
                    {exp.description && <p className="text-xs text-white/50">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function DetailBox({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
      <p className="mb-1 text-[10px] font-medium text-white/40">{label}</p>
      <div className="text-sm font-semibold text-white">{value || "-"}</div>
    </div>
  );
}
