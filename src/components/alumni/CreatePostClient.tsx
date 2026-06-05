"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlumniInput, AlumniTextarea } from "@/components/alumni/AlumniField";
import AlumniAlert from "@/components/ui/AlumniAlert";

interface CreatePostClientProps {
  userId: string;
  authorName: string;
  isAdmin?: boolean;
}

export default function CreatePostClient({
  userId,
  authorName,
  isAdmin,
}: CreatePostClientProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  function showAlert(
    type: "success" | "error" | "info",
    title: string,
    message: string
  ) {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
    });
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setCoverFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert(
        "error",
        "Format Tidak Valid!",
        "Cover harus berupa file gambar."
      );
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      showAlert(
        "error",
        "File Terlalu Besar!",
        "Ukuran cover maksimal 5MB."
      );
      e.target.value = "";
      return;
    }

    setCoverFile(file);
  }

  async function uploadCover() {
    if (!coverFile) return null;

    const fileExt = coverFile.name.split(".").pop();
    const safeName = coverFile.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .toLowerCase();

    const filePath = `${userId}/${Date.now()}-${safeName || `cover.${fileExt}`}`;

    const { error: uploadError } = await supabase.storage
      .from("articles")
      .upload(filePath, coverFile, {
        contentType: coverFile.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("articles").getPublicUrl(filePath);

    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      showAlert(
        "error",
        "Belum Lengkap!",
        "Judul dan isi konten wajib diisi."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const coverUrl = await uploadCover();

      const { error: insertError } = await supabase.from("articles").insert({
        creator_id: userId,
        author_name: authorName,
        title: title.trim(),
        content: content.trim(),
        cover_url: coverUrl,
        published_at: new Date().toISOString(),
        status: "PUBLISHED",
      });

      if (insertError) throw insertError;

      showAlert(
        "success",
        "Berhasil!",
        "Konten kamu telah berhasil dipublikasikan."
      );
    } catch (error: any) {
      console.error(error);
      showAlert(
        "error",
        "Oops!",
        error?.message || "Gagal mempublikasikan konten. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AlumniAlert
        {...alert}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        onConfirm={() => {
          if (alert.type === "success") {
            window.location.href = isAdmin ? "/admin" : "/alumni";
          }
        }}
      />
      <form onSubmit={handleSubmit} className="space-y-6">

      <div className="space-y-5">
        <AlumniInput
          label="Judul Konten*"
          placeholder="Masukkan judul yang menarik..."
          value={title}
          onChange={setTitle}
        />

        <div>
          <p className="mb-2 text-sm text-white/85">Gambar Cover (Opsional)</p>

          <div className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 px-6 pb-6 pt-5">
            <div className="space-y-1 text-center">
              {coverFile ? (
                <div className="mb-2 text-sm font-medium text-white">
                  {coverFile.name}
                </div>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-white/40"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              <div className="flex justify-center text-sm text-white/60">
                <label
                  htmlFor="cover-upload"
                  className="relative cursor-pointer rounded-md font-medium text-[#7dd3d3] hover:text-[#c8ffff] focus-within:outline-none"
                >
                  <span>{coverFile ? "Ganti file" : "Upload file"}</span>

                  <input
                    id="cover-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                </label>
              </div>

              <p className="text-xs text-white/50">
                PNG, JPG, atau JPEG maksimal 5MB
              </p>
            </div>
          </div>
        </div>

        <AlumniTextarea
          label="Isi Konten*"
          placeholder="Tulis artikel atau kontenmu di sini..."
          value={content}
          onChange={setContent}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border border-white/10 bg-[#7dd3d3] px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#c8ffff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Mempublikasikan..." : "Publish Konten"}
        </button>
      </div>
    </form>
    </>
  );
}