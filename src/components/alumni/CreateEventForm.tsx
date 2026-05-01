"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AlumniInput, AlumniTextarea } from "./AlumniField";
import { createClient } from "@/lib/supabase/client";
import AlumniAlert from "@/components/ui/AlumniAlert";

export default function CreateEventForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    type: "online",
    event_date: "",
    event_time: "",
    description: "",
    location: "",
    link: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // VALIDASI FIELD
    if (!form.title || !form.event_date || !form.event_time || !form.description) {
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Belum Lengkap!',
        message: 'Harap isi semua kolom yang bertanda bintang (*) sebelum membuat event.'
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const { error: insertError } = await supabase
        .from("events")
        .insert({
          creator_id: user.id,
          title: form.title,
          type: form.type,
          event_date: form.event_date,
          event_time: form.event_time,
          description: form.description,
          location: form.type === "offline" ? form.location : null,
          link: form.type === "online" ? form.link : null,
        });

      if (insertError) throw insertError;

      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Berhasil!',
        message: 'Event kamu telah berhasil dibuat dan sudah muncul di agenda komunitas.'
      });
    } catch (err: any) {
      console.error(err);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Oops!',
        message: err.message || 'Gagal membuat event. Silakan coba lagi.'
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5 rounded-[30px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <AlumniInput
            label="Judul Event*"
            placeholder="Masukkan judul event"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />

          <div>
            <p className="mb-2 text-sm text-white/85">Jenis Event*</p>
            <div className="flex gap-8 text-sm text-white/80">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="online"
                  checked={form.type === "online"}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${form.type === 'online' ? 'border-[#7dd3d3] bg-[#7dd3d3]/20' : 'border-white/20'}`}>
                  {form.type === 'online' && <div className="w-2 h-2 rounded-full bg-[#7dd3d3]" />}
                </div>
                Online
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="offline"
                  checked={form.type === "offline"}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${form.type === 'offline' ? 'border-[#7dd3d3] bg-[#7dd3d3]/20' : 'border-white/20'}`}>
                  {form.type === 'offline' && <div className="w-2 h-2 rounded-full bg-[#7dd3d3]" />}
                </div>
                Offline
              </label>
            </div>
          </div>

          {form.type === "online" ? (
            <AlumniInput
              label="Link Webinar / Meeting (Opsional)"
              placeholder="https://zoom.us/j/..."
              value={form.link}
              onChange={(v) => setForm({ ...form, link: v })}
            />
          ) : (
            <AlumniInput
              label="Lokasi Event (Opsional)"
              placeholder="Masukkan alamat atau nama tempat"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <AlumniInput
              label="Tanggal Event*"
              type="date"
              value={form.event_date}
              onChange={(v) => setForm({ ...form, event_date: v })}
            />
            <AlumniInput
              label="Waktu Event*"
              type="time"
              value={form.event_time}
              onChange={(v) => setForm({ ...form, event_time: v })}
            />
          </div>

          <AlumniTextarea
            label="Deskripsi Event*"
            placeholder="Jelaskan tentang acara ini..."
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-[#7dd3d3] px-10 py-4 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#7dd3d3]/20 transition hover:bg-[#6ec2c2] disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Buat Event Sekarang"}
          </button>
        </div>
      </form>
    </>
  );
}
