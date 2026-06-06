"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlumniInput, AlumniTextarea } from "@/components/alumni/AlumniField";
import AlumniAlert from "@/components/ui/AlumniAlert";

interface EditPostClientProps {
  userId: string;
  initialData: any;
}

export default function EditPostClient({ userId, initialData }: EditPostClientProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alert, setAlert] = useState({ isOpen: false, type: "info" as any, title: "", message: "" });
  function showAlert(type: any, title: string, message: string) {
    setAlert({ isOpen: true, type, title, message });
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { setCoverFile(null); return; }
    if (!file.type.startsWith("image/")) {
      showAlert("error", "Format Tidak Valid!", "Cover harus berupa file gambar.");
      e.target.value = ""; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert("error", "File Terlalu Besar!", "Ukuran cover maksimal 5MB.");
      e.target.value = ""; return;
    }
    setCoverFile(file);
  }

  async function uploadCover() {
    if (!coverFile) return initialData.cover_url;
    const fileExt = coverFile.name.split(".").pop();
    const safeName = coverFile.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase();
    const filePath = `${userId}/${Date.now()}-${safeName || `cover.${fileExt}`}`;
    const { error: uploadError } = await supabase.storage.from("articles").upload(filePath, coverFile);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(filePath);
    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showAlert("error", "Belum Lengkap!", "Judul dan isi konten wajib diisi.");
      return;
    }
    setIsSubmitting(true);

    try {
      const coverUrl = await uploadCover();
      const { error } = await supabase
        .from("articles")
        .update({
          title: title.trim(),
          content: content.trim(),
          cover_url: coverUrl,
        })
        .eq("id", initialData.id);

      if (error) throw error;
      showAlert("success", "Berhasil!", "Konten berhasil diperbarui.");
    } catch (error: any) {
      showAlert("error", "Oops!", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AlumniAlert {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} onConfirm={() => {
        if (alert.type === "success") router.push("/admin");
      }} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <AlumniInput label="Judul Konten*" placeholder="Masukkan judul" value={title} onChange={setTitle} />
          
          <div>
            <p className="mb-2 text-sm text-white/85">Gambar Cover (Opsional)</p>
            <div className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 px-6 pb-6 pt-5">
              <div className="space-y-1 text-center">
                <div className="flex justify-center text-sm text-white/60">
                  <label htmlFor="cover-upload" className="relative cursor-pointer rounded-md font-medium text-[#7dd3d3] hover:text-[#c8ffff] focus-within:outline-none">
                    <span>{coverFile ? coverFile.name : (initialData.cover_url ? "Ganti file (Sudah ada cover)" : "Upload file")}</span>
                    <input id="cover-upload" type="file" className="sr-only" accept="image/*" onChange={handleCoverChange} />
                  </label>
                </div>
                <p className="text-xs text-white/50">PNG, JPG, atau JPEG maksimal 5MB</p>
              </div>
            </div>
          </div>

          <AlumniTextarea label="Isi Konten*" placeholder="Tulis konten..." value={content} onChange={setContent} />
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting} className="rounded-full border border-white/10 bg-[#7dd3d3] px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#c8ffff] disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </>
  );
}
