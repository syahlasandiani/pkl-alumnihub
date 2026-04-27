import AlumniShell from "@/components/alumni/AlumniShell";
import {
  AlumniInput,
  AlumniTextarea,
} from "@/components/alumni/AlumniField";

export default function AlumniProfilePage() {
  return (
    <AlumniShell
      title="Lengkapi Profil"
      subtitle="Lengkapi data diri dan pengalaman untuk memperkuat profil alumni."
      backHref="/alumni"
      backLabel="Kembali ke Dashboard"
      actionLabel="Simpan Profil"
      actionHref="/alumni/profile"
    >
      <section className="rounded-[30px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-white">Pengalaman</h2>
            <p className="mt-1 text-sm text-white/65">
              Terakhir diperbaharui pada 19 November 2025
            </p>
          </div>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white"
          >
            Tambah +
          </button>
        </div>

        <div className="mt-5 text-sm text-white/80">
          <span className="mr-4">Tipe Pengalaman</span>
          <label className="mr-4">
            <input
              type="radio"
              name="experience"
              className="mr-2"
              defaultChecked
            />
            Pekerjaan
          </label>
          <label>
            <input type="radio" name="experience" className="mr-2" />
            Prestasi
          </label>
        </div>

        <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Prestasi #1</h3>
            <button type="button" className="text-sm text-white/70">
              Hapus
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AlumniInput label="Nama Kompetisi*" placeholder="Placeholder" />
            <AlumniInput label="Tahun*" placeholder="Placeholder" />
          </div>

          <div className="mt-4">
            <AlumniTextarea
              label="Deskripsi (Optional)"
              placeholder="Placeholder"
            />
          </div>

          <p className="mt-4 text-xs text-white/45">Total item: 1</p>
        </div>
      </section>
    </AlumniShell>
  );
}