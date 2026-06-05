"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlumniInput, AlumniTextarea } from "@/components/alumni/AlumniField";
import AlumniAlert from "@/components/ui/AlumniAlert";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";

interface UploadResourceClientProps {
  userId: string;
  isAdmin?: boolean;
}

type ResourceVisibility = "PUBLIC" | "MEMBERS_ONLY";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
];

const RESOURCE_CATEGORIES = [
  "Essay",
  "CV",
  "Interview",
  "Scholarship Guide",
  "Template",
  "Other",
];

export default function UploadResourceClient({
  userId,
  isAdmin,
}: UploadResourceClientProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    visibility: "PUBLIC" as ResourceVisibility,
  });

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

  function getFileExtension(selectedFile: File) {
    return selectedFile.name.split(".").pop()?.toLowerCase() || "";
  }

  function validateFile(selectedFile: File) {
    const fileExt = getFileExtension(selectedFile);

    if (!ACCEPTED_EXTENSIONS.includes(fileExt)) {
      showAlert(
        "error",
        "Format File Tidak Didukung!",
        "Gunakan file dengan format PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, atau ZIP."
      );
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      showAlert(
        "error",
        "File Terlalu Besar!",
        "Ukuran file maksimal yang diperbolehkan adalah 25MB."
      );
      return false;
    }

    return true;
  }

  function handleSelectedFile(selectedFile?: File) {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setFile(selectedFile);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    handleSelectedFile(e.target.files?.[0]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    handleSelectedFile(e.dataTransfer.files?.[0]);
  }

  function clearFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim() || !file) {
      showAlert(
        "error",
        "Belum Lengkap!",
        "Harap isi judul dan pilih file yang ingin diupload."
      );
      return;
    }

    setLoading(true);

    try {
      const fileExt = getFileExtension(file);
      const safeName = file.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "")
        .toLowerCase();

      const filePath = `${userId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("resources").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("resources").insert({
        creator_id: userId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        file_url: publicUrl,
        file_type: fileExt,
        file_size: file.size,
        visibility: form.visibility,
        category: form.category,
        status: "PUBLISHED",
      });

      if (insertError) throw insertError;

      showAlert(
        "success",
        "Upload Berhasil!",
        "Resource kamu telah berhasil diupload dan sekarang bisa diakses melalui Learning Hub."
      );
    } catch (error: any) {
      console.error(error);
      showAlert(
        "error",
        "Oops!",
        error?.message || "Gagal mengupload resource. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <AlumniInput
            label="Judul Resource*"
            placeholder="Masukkan judul resource"
            value={form.title}
            onChange={(value) => setForm({ ...form, title: value })}
          />

          <AlumniTextarea
            label="Deskripsi Resource"
            placeholder="Masukkan deskripsi resource (opsional)"
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-white/85">Kategori</p>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#7dd3d3]"
              >
                {RESOURCE_CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-slate-900 text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-white/85">Visibilitas</p>
              <select
                value={form.visibility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visibility: e.target.value as ResourceVisibility,
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#7dd3d3]"
              >
                <option value="PUBLIC" className="bg-slate-900 text-white">
                  Public
                </option>
                <option
                  value="MEMBERS_ONLY"
                  className="bg-slate-900 text-white"
                >
                  Members Only
                </option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/85">Upload File*</p>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed transition-all ${
                file
                  ? "border-[#7dd3d3] bg-[#7dd3d3]/5"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                onChange={handleFileChange}
              />

              {!file ? (
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-transform group-hover:scale-110">
                    <Upload className="h-8 w-8 text-white/40 group-hover:text-white" />
                  </div>

                  <p className="text-lg font-medium text-white/90">
                    Drag & drop file atau klik untuk memilih
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    Maksimal 25MB • Format: PDF, DOC, DOCX, XLS, XLSX, PPT,
                    PPTX, ZIP
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7dd3d3]/20">
                    <FileText className="h-8 w-8 text-[#7dd3d3]" />
                  </div>

                  <p className="max-w-md break-words text-lg font-bold text-white">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-[#7dd3d3]">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Terpilih
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="mt-6 flex items-center gap-2 text-xs font-bold text-red-400 transition hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                    Ganti File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || !file}
            className="flex items-center gap-3 rounded-2xl bg-[#7dd3d3] px-12 py-4 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:scale-[1.02] hover:bg-[#6ec2c2] active:scale-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              "Sedang Mengupload..."
            ) : (
              <>
                Upload Resource
                <CheckCircle2 className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}