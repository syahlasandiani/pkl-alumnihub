"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlumniInput, AlumniTextarea } from "@/components/alumni/AlumniField";
import AlumniAlert from "@/components/ui/AlumniAlert";

interface EditEventClientProps {
  userId: string;
  initialData: any;
}

export default function EditEventClient({ userId, initialData }: EditEventClientProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: initialData.title || "",
    type: initialData.type || "online",
    event_date: initialData.event_date || "",
    event_time: initialData.event_time || "",
    description: initialData.description || "",
    location: initialData.location || "",
    link: initialData.link || "",
    status: initialData.status || "PUBLISHED",
  });

  const [alert, setAlert] = useState({ isOpen: false, type: "info" as any, title: "", message: "" });
  function showAlert(type: any, title: string, message: string) {
    setAlert({ isOpen: true, type, title, message });
  }

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { setBannerFile(null); return; }
    if (!file.type.startsWith("image/")) {
      showAlert("error", "Format Tidak Valid!", "Banner event harus berupa file gambar.");
      e.target.value = ""; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert("error", "File Terlalu Besar!", "Ukuran banner maksimal 5MB.");
      e.target.value = ""; return;
    }
    setBannerFile(file);
  }

  async function uploadBanner() {
    if (!bannerFile) return initialData.image_url;
    const fileExt = bannerFile.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `banners/${fileName}`;
    const { error: uploadError } = await supabase.storage.from("events").upload(filePath, bannerFile);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("events").getPublicUrl(filePath);
    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.event_date || !form.event_time || !form.description.trim()) {
      showAlert("error", "Belum Lengkap!", "Harap isi semua kolom yang bertanda bintang (*).");
      return;
    }
    setLoading(true);

    try {
      const imageUrl = await uploadBanner();
      const { error } = await supabase
        .from("events")
        .update({
          title: form.title.trim(),
          type: form.type,
          event_date: form.event_date,
          event_time: form.event_time,
          description: form.description.trim(),
          location: form.type === "offline" ? form.location?.trim() || null : null,
          link: form.type === "online" ? form.link?.trim() || null : null,
          status: form.status,
          image_url: imageUrl,
        })
        .eq("id", initialData.id);

      if (error) throw error;
      showAlert("success", "Berhasil!", "Event berhasil diperbarui.");
    } catch (error: any) {
      showAlert("error", "Gagal!", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlumniAlert {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} onConfirm={() => {
        if (alert.type === "success") router.push("/admin");
      }} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <AlumniInput label="Judul Event*" placeholder="Masukkan judul event" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          
          <div>
            <p className="mb-2 text-sm text-white/85">Jenis Event*</p>
            <div className="flex gap-8 text-sm text-white/80">
              <label className="group flex cursor-pointer items-center">
                <input type="radio" name="type" value="online" checked={form.type === "online"} onChange={() => setForm({ ...form, type: "online" })} className="hidden" />
                <div className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${form.type === "online" ? "border-[#7dd3d3] bg-[#7dd3d3]/20" : "border-white/20"}`}>
                  {form.type === "online" && <div className="h-2 w-2 rounded-full bg-[#7dd3d3]" />}
                </div> Online
              </label>
              <label className="group flex cursor-pointer items-center">
                <input type="radio" name="type" value="offline" checked={form.type === "offline"} onChange={() => setForm({ ...form, type: "offline" })} className="hidden" />
                <div className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${form.type === "offline" ? "border-[#7dd3d3] bg-[#7dd3d3]/20" : "border-white/20"}`}>
                  {form.type === "offline" && <div className="h-2 w-2 rounded-full bg-[#7dd3d3]" />}
                </div> Offline
              </label>
            </div>
          </div>

          {form.type === "online" ? (
            <AlumniInput label="Link Webinar / Meeting (Opsional)" placeholder="https://zoom.us/j/..." value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
          ) : (
            <AlumniInput label="Lokasi Event (Opsional)" placeholder="Masukkan alamat" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <AlumniInput label="Tanggal Event*" type="date" value={form.event_date} onChange={(v) => setForm({ ...form, event_date: v })} />
            <AlumniInput label="Waktu Event*" type="time" value={form.event_time} onChange={(v) => setForm({ ...form, event_time: v })} />
          </div>

          <div>
            <p className="mb-2 text-sm text-white/85">Banner Event (Opsional)</p>
            <div className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 px-6 pb-6 pt-5">
              <div className="space-y-2 text-center">
                <div className="flex justify-center text-sm text-white/60">
                  <label htmlFor="banner-upload" className="relative cursor-pointer rounded-md font-medium text-[#7dd3d3] hover:text-[#c8ffff] focus-within:outline-none">
                    <span>{bannerFile ? bannerFile.name : (initialData.image_url ? "Ganti File (Sudah ada banner)" : "Upload file")}</span>
                    <input id="banner-upload" type="file" className="sr-only" accept="image/*" onChange={handleBannerChange} />
                  </label>
                </div>
                <p className="text-xs text-white/50">PNG, JPG, atau JPEG maksimal 5MB</p>
              </div>
            </div>
          </div>

          <AlumniTextarea label="Deskripsi Event*" placeholder="Jelaskan tentang acara ini..." value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="rounded-2xl bg-[#7dd3d3] px-10 py-4 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:bg-[#6ec2c2] disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </>
  );
}
