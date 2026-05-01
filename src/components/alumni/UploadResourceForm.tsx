"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AlumniInput, AlumniTextarea } from "./AlumniField";
import { createClient } from "@/lib/supabase/client";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import AlumniAlert from "@/components/ui/AlumniAlert";

export default function UploadResourceForm() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
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
      if (selectedFile.size > 25 * 1024 * 1024) {
        setAlert({
          isOpen: true,
          type: 'error',
          title: 'File Terlalu Besar!',
          message: 'Ukuran file maksimal yang diperbolehkan adalah 25MB.'
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.size > 25 * 1024 * 1024) {
        setAlert({
          isOpen: true,
          type: 'error',
          title: 'File Terlalu Besar!',
          message: 'Ukuran file maksimal yang diperbolehkan adalah 25MB.'
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // VALIDASI FIELD
    if (!form.title || !file) {
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Belum Lengkap!',
        message: 'Harap isi judul dan pilih file yang ingin diupload.'
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("resources")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("resources")
        .insert({
          creator_id: user.id,
          title: form.title,
          description: form.description,
          file_url: publicUrl,
          file_type: fileExt,
          file_size: file.size,
        });

      if (insertError) throw insertError;

      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Upload Berhasil!',
        message: 'Resource kamu telah berhasil diupload dan sekarang bisa diunduh oleh alumni lain.'
      });
    } catch (err: any) {
      console.error(err);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Oops!',
        message: err.message || 'Gagal mengupload resource. Silakan coba lagi.'
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
        <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <AlumniInput
            label="Judul Resource*"
            placeholder="Masukkan judul resource"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />

          <AlumniTextarea
            label="Deskripsi Resource"
            placeholder="Masukkan deskripsi resource (opsional)"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <div className="space-y-2">
            <p className="text-sm text-white/85">Upload File*</p>
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed transition-all ${
                file ? 'border-[#7dd3d3] bg-[#7dd3d3]/5' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
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
                    Maksimal 25MB • Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7dd3d3]/20">
                    <FileText className="h-8 w-8 text-[#7dd3d3]" />
                  </div>
                  <p className="text-lg font-bold text-white">
                    {file.name}
                  </p>
                  <p className="mt-1 text-sm text-[#7dd3d3]">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Terpilih
                  </p>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-6 flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition"
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
            className="flex items-center gap-3 rounded-2xl bg-[#7dd3d3] px-12 py-4 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:bg-[#6ec2c2] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-100"
          >
            {loading ? "Sedang Mengupload..." : (
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
