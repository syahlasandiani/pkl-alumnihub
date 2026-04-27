import AlumniShell from "@/components/alumni/AlumniShell";
import {
  AlumniInput,
  AlumniTextarea,
} from "@/components/alumni/AlumniField";

export default function UploadResourcePage() {
  return (
    <AlumniShell
      title="Upload Resource"
      subtitle="Bagikan dokumen, template, atau file pembelajaran dengan alumni lainnya."
      backHref="/alumni"
      backLabel="Kembali ke Dashboard"
      actionLabel="Upload"
      actionHref="/alumni/upload-resource"
    >
      <section className="rounded-[30px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <div className="space-y-5">
          <AlumniInput
            label="Judul Resource*"
            placeholder="Masukkan judul resource"
          />

          <AlumniTextarea
            label="Deskripsi Resource"
            placeholder="Masukkan deskripsi resource (optional)"
          />

          <div>
            <p className="mb-2 text-sm text-white/85">Upload File*</p>
            <div className="flex min-h-[220px] items-center justify-center rounded-[26px] border border-dashed border-white/15 bg-white/5 text-center">
              <div>
                <p className="text-lg text-white/85">
                  Drag & drop file atau klik untuk memilih
                </p>
                <p className="mt-2 text-sm text-white/45">
                  Maksimal 25MB • Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX,
                  ZIP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AlumniShell>
  );
}