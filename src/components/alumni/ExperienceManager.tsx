"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Experience = {
  id: string;
  type: string;
  title: string;
  organization: string;
  start_year: number | null;
  end_year: number | null;
  description: string;
};

export default function ExperienceManager({ userId }: { userId: string }) {
  const supabase = createClient();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    type: "WORK",
    title: "",
    organization: "",
    start_year: "",
    end_year: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExperiences();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchExperiences() {
    setLoading(true);
    const { data, error } = await supabase
      .from("alumni_experiences")
      .select("*")
      .eq("user_id", userId)
      .order("start_year", { ascending: false });

    if (!error && data) {
      setExperiences(data);
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({
      type: "WORK",
      title: "",
      organization: "",
      start_year: "",
      end_year: "",
      description: "",
    });
    setEditingId(null);
    setIsOpen(false);
  }

  function handleEdit(exp: Experience) {
    setForm({
      type: exp.type || "WORK",
      title: exp.title || "",
      organization: exp.organization || "",
      start_year: exp.start_year?.toString() || "",
      end_year: exp.end_year?.toString() || "",
      description: exp.description || "",
    });
    setEditingId(exp.id);
    setIsOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus pengalaman ini?")) return;
    
    await supabase.from("alumni_experiences").delete().eq("id", id);
    fetchExperiences();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      user_id: userId,
      type: form.type,
      title: form.title,
      organization: form.organization,
      start_year: form.start_year ? parseInt(form.start_year) : null,
      end_year: form.end_year ? parseInt(form.end_year) : null,
      description: form.description,
    };

    if (editingId) {
      await supabase.from("alumni_experiences").update(payload).eq("id", editingId);
    } else {
      await supabase.from("alumni_experiences").insert([payload]);
    }

    setSaving(false);
    resetForm();
    fetchExperiences();
  }

  const inputClass = "w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20";

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Pengalaman & Pekerjaan</h2>
          <p className="mt-1 text-sm text-white/60">Kelola riwayat karir dan organisasi kamu.</p>
        </div>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <Plus size={16} />
            Tambah
          </button>
        )}
      </div>

      {isOpen && (
        <form onSubmit={onSubmit} className="mb-8 rounded-2xl border border-[#7dd3d3]/20 bg-[#7dd3d3]/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">{editingId ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}</h3>
            <button type="button" onClick={resetForm} className="text-white/50 hover:text-white"><X size={16}/></button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs text-white/60">Tipe</label>
              <select 
                className={inputClass}
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option className="bg-slate-900" value="WORK">Pekerjaan</option>
                <option className="bg-slate-900" value="ORGANIZATION">Organisasi</option>
                <option className="bg-slate-900" value="EDUCATION">Pendidikan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/60">Posisi / Judul</label>
              <input required className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Software Engineer" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs text-white/60">Instansi / Perusahaan</label>
              <input required className={inputClass} value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} placeholder="Google Indonesia" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/60">Tahun Mulai</label>
              <input type="number" className={inputClass} value={form.start_year} onChange={e => setForm({...form, start_year: e.target.value})} placeholder="2020" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/60">Tahun Selesai (Kosongkan jika masih)</label>
              <input type="number" className={inputClass} value={form.end_year} onChange={e => setForm({...form, end_year: e.target.value})} placeholder="2023" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs text-white/60">Deskripsi Singkat</label>
              <textarea rows={3} className={`${inputClass} h-auto py-3 resize-none`} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Deskripsikan peran kamu..." />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button disabled={saving} type="submit" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan Pengalaman"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-white/40" /></div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 py-10">
          <p className="text-sm text-white/40">Belum ada pengalaman yang ditambahkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map(exp => (
            <div key={exp.id} className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-5 transition hover:bg-white/10 sm:flex-row sm:items-start">
              <div>
                <div className="mb-1 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/80">
                  {exp.type === "WORK" ? "PEKERJAAN" : exp.type === "ORGANIZATION" ? "ORGANISASI" : "PENDIDIKAN"}
                </div>
                <h4 className="text-base font-semibold text-white">{exp.title}</h4>
                <p className="text-sm font-medium text-white/70">{exp.organization}</p>
                <p className="mt-0.5 text-xs text-white/40">
                  {exp.start_year || "?"} — {exp.end_year || "Sekarang"}
                </p>
                {exp.description && (
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{exp.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <button onClick={() => handleEdit(exp)} className="rounded-lg bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white" title="Edit">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(exp.id)} className="rounded-lg bg-red-500/10 p-2 text-red-300 hover:bg-red-500/20" title="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}