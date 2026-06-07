"use client";

import { useRef, useState } from "react";
import { AlumniInput, AlumniTextarea } from "@/components/alumni/AlumniField";
import AlumniAlert from "@/components/ui/AlumniAlert";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import { updateResourceAction, uploadFileToStorage } from "@/app/(alumni)/alumni/actions";

interface EditResourceClientProps {
  userId: string;
  initialData: any;
}

const RESOURCE_CATEGORIES = ["Essay", "CV", "Interview", "Scholarship Guide", "Template", "Other"];

export default function EditResourceClient({ userId, initialData }: EditResourceClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "Other",
    visibility: initialData.visibility || "PUBLIC",
  });

  const [alert, setAlert] = useState({ isOpen: false, type: "info" as any, title: "", message: "" });
  function showAlert(type: any, title: string, message: string) {
    setAlert({ isOpen: true, type, title, message });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > 25 * 1024 * 1024) {
      showAlert("error", "File Terlalu Besar!", "Maksimal 25MB.");
      return;
    }
    setFile(selectedFile);
  }

  async function uploadNewFile(): Promise<{ url: string; ext: string | null; size: number } | null> {
    if (!file) return null;
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const filePath = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { url, error } = await uploadFileToStorage("resources", filePath, base64, file.type || "application/octet-stream");
    if (error) throw new Error(`Gagal upload file: ${error}`);
    const ext = file.name.split(".").pop()?.toLowerCase() || null;
    return { url: url!, ext, size: file.size };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      showAlert("error", "Belum Lengkap!", "Judul wajib diisi.");
      return;
    }
    setLoading(true);

    try {
      let fileUrl = initialData.file_url;
      let fileType = initialData.file_type;
      let fileSize = initialData.file_size;

      if (file) {
        const uploaded = await uploadNewFile();
        if (uploaded) { fileUrl = uploaded.url; fileType = uploaded.ext; fileSize = uploaded.size; }
      }

      const result = await updateResourceAction(initialData.id, {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        visibility: form.visibility,
        file_url: fileUrl,
        file_type: fileType,
        file_size: fileSize,
      });

      if (result.error) throw new Error(result.error);
      showAlert("success", "Berhasil!", "Resource berhasil diperbarui.");
    } catch (error: any) {
      showAlert("error", "Oops!", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlumniAlert {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} onConfirm={() => {
        if (alert.type === "success") window.location.href = "/alumni";
      }} />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <AlumniInput label="Judul Resource*" placeholder="Masukkan judul" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <AlumniTextarea label="Deskripsi Resource" placeholder="Opsional" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-white/85">Kategori</p>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none">
                {RESOURCE_CATEGORIES.map((c) => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div>
              <p className="mb-2 text-sm text-white/85">Visibilitas</p>
              <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none">
                <option value="PUBLIC" className="bg-slate-900">Public</option>
                <option value="MEMBERS_ONLY" className="bg-slate-900">Members Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/85">Upload File Baru (Abaikan jika tidak ingin mengganti file)</p>
            <div onClick={() => fileInputRef.current?.click()} className="group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/10 bg-white/5 hover:border-white/20 transition-all">
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              {!file ? (
                <div className="flex flex-col items-center p-6 text-center">
                  <Upload className="h-8 w-8 text-white/40 group-hover:text-white mb-2" />
                  <p className="text-sm text-white/90">{initialData.file_url ? "Klik untuk mengganti file saat ini" : "Klik untuk upload file"}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <FileText className="h-8 w-8 text-[#7dd3d3] mb-2" />
                  <p className="text-sm font-bold text-white">{file.name}</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 text-xs text-red-400">Batalkan Ganti File</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="flex items-center gap-3 rounded-2xl bg-[#7dd3d3] px-12 py-4 text-sm font-bold text-[#0f172a] shadow-lg transition hover:bg-[#6ec2c2] disabled:opacity-50">
            {loading ? "Menyimpan..." : <><CheckCircle2 className="h-5 w-5" /> Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </>
  );
}
