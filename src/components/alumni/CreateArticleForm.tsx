"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AlumniInput, AlumniTextarea } from "./AlumniField";
import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X, Send, Bold, Italic, Underline } from "lucide-react";
import AlumniAlert from "@/components/ui/AlumniAlert";

export default function CreateArticleForm() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: "",
    content: "",
    author_name: user?.username || "",
    published_date: "",
    published_time: "",
  });

  // Alert State
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setCover(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // VALIDASI FIELD
    if (!form.title || !form.content || !form.author_name || !form.published_date || !form.published_time) {
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Belum Lengkap!',
        message: 'Harap isi semua kolom yang bertanda bintang (*) sebelum mempublish.'
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      let coverUrl = "";

      if (cover) {
        const fileExt = cover.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("articles").upload(filePath, cover);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("articles").getPublicUrl(filePath);
        coverUrl = publicUrl;
      }

      // Handle Timezone: Combine date and time, then ensure it's treated as local time
      const localDateTime = new Date(`${form.published_date}T${form.published_time}:00`);
      const publishedAt = localDateTime.toISOString();
      
      const { error: insertError } = await supabase
        .from("articles")
        .insert({
          creator_id: user.id,
          title: form.title,
          content: form.content,
          cover_url: coverUrl,
          author_name: form.author_name,
          published_at: publishedAt,
        });

      if (insertError) throw insertError;

      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Berhasil!',
        message: 'Artikel kamu telah berhasil dipublish dan siap dibaca oleh komunitas.'
      });
    } catch (err: any) {
      console.error(err);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Oops!',
        message: err.message || 'Gagal mempublish artikel. Silakan coba lagi.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlumniAlert 
        {...alert} 
        onClose={() => setAlert({ ...alert, isOpen: false })} 
        onConfirm={() => {
          if (alert.type === 'success') {
            router.push("/alumni");
            router.refresh();
          }
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-8 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          {/* LEFT: COVER UPLOAD */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-white/85">Cover</p>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-[28px] border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-[#7dd3d3]/50 hover:bg-white/10"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              
              {previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCover(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <ImagePlus className="mb-4 h-12 w-12 text-white/20 group-hover:text-[#7dd3d3] transition-colors" />
                  <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                    Drag & drop gambar atau klik untuk memilih
                  </p>
                  <p className="mt-2 text-[10px] text-white/30 uppercase tracking-widest">
                    Format: JPG, PNG • Ukuran max 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: CONTENT DETAILS */}
          <div className="space-y-6">
            <AlumniInput
              label="Judul*"
              placeholder="Masukkan judul konten"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/85">Deskripsi Konten*</p>
                <div className="flex items-center gap-1">
                  <button type="button" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white"><Bold className="h-3 w-3" /></button>
                  <button type="button" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white"><Italic className="h-3 w-3" /></button>
                  <button type="button" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white"><Underline className="h-3 w-3" /></button>
                </div>
              </div>
              <AlumniTextarea
                label=""
                placeholder="Tulis deskripsi konten di sini..."
                value={form.content}
                onChange={(v) => setForm({ ...form, content: v })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <AlumniInput
                label="Penulis*"
                placeholder="Nama penulis"
                value={form.author_name}
                onChange={(v) => setForm({ ...form, author_name: v })}
              />
              <AlumniInput
                label="Tanggal Rilis*"
                type="date"
                value={form.published_date}
                onChange={(v) => setForm({ ...form, published_date: v })}
              />
              <AlumniInput
                label="Waktu Rilis*"
                type="time"
                value={form.published_time}
                onChange={(v) => setForm({ ...form, published_time: v })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 rounded-2xl bg-[#7dd3d3] px-14 py-4 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:bg-[#6ec2c2] hover:scale-[1.02] active:scale-100 disabled:opacity-50"
          >
            {loading ? "Publishing..." : (
              <>
                Publish
                <Send className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
