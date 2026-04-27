"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ExperienceItem = {
  id?: string;
  type: string;
  title: string;
  organization: string;
  role_name: string;
  start_year: string;
  end_year: string;
  achievement_year: string;
  description: string;
};

type AlumniProfileFormProps = {
  userId: string;
  profile: {
    full_name: string;
    nickname: string;
    email: string;
    phone: string;
    avatar_url: string;
    gender: string;
    study_status: string;
    intake_year: string;
    graduation_year: string;
    program: string;
    institution: string;
    city: string;
    current_position: string;
    current_company: string;
    field_of_work: string;
    short_bio: string;
    linkedin_url: string;
    instagram_url: string;
    website_url: string;
    is_public: boolean;
    show_email: boolean;
    show_phone: boolean;
    show_city: boolean;
  };
  experiences: ExperienceItem[];
};

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="h-px flex-1 bg-white/15" />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-xs text-white/70">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-xl"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-xs text-white/70">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-xl"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <p className="mb-2 text-xs text-white/70">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl"
      >
        <option value="" className="text-black">
          Pilih...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-black">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-white/80">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
    </label>
  );
}

const EXPERIENCE_TYPE_OPTIONS = [
  { label: "Pekerjaan", value: "WORK" },
  { label: "Prestasi", value: "ACHIEVEMENT" },
];

export default function AlumniProfileForm({
  userId,
  profile: initialProfile,
  experiences: initialExperiences,
}: AlumniProfileFormProps) {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState(initialProfile);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    initialExperiences.length > 0
      ? initialExperiences
      : [
          {
            type: "WORK",
            title: "",
            organization: "",
            role_name: "",
            start_year: "",
            end_year: "",
            achievement_year: "",
            description: "",
          },
        ]
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const completion = useMemo(() => {
    const checklist = [
      Boolean(profile.avatar_url),
      Boolean(profile.full_name),
      Boolean(profile.short_bio),
      Boolean(profile.current_position || profile.current_company),
      Boolean(profile.linkedin_url || profile.website_url || profile.instagram_url),
      experiences.some((item) => item.title.trim().length > 0),
    ];
    const done = checklist.filter(Boolean).length;
    return Math.round((done / checklist.length) * 100);
  }, [profile, experiences]);

  function updateExperience(index: number, patch: Partial<ExperienceItem>) {
    setExperiences((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addExperience() {
    setExperiences((prev) => [
      ...prev,
      {
        type: "WORK",
        title: "",
        organization: "",
        role_name: "",
        start_year: "",
        end_year: "",
        achievement_year: "",
        description: "",
      },
    ]);
  }

  function removeExperience(index: number) {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        user_id: userId,
        full_name: profile.full_name,
        nickname: profile.nickname || null,
        email: profile.email || null,
        phone: profile.phone || null,
        avatar_url: profile.avatar_url || null,
        gender: profile.gender || null,
        study_status: profile.study_status || null,
        intake_year: profile.intake_year ? Number(profile.intake_year) : null,
        graduation_year: profile.graduation_year ? Number(profile.graduation_year) : null,
        program: profile.program || null,
        institution: profile.institution || null,
        city: profile.city || null,
        current_position: profile.current_position || null,
        current_company: profile.current_company || null,
        field_of_work: profile.field_of_work || null,
        short_bio: profile.short_bio || null,
        linkedin_url: profile.linkedin_url || null,
        instagram_url: profile.instagram_url || null,
        website_url: profile.website_url || null,
        is_public: profile.is_public,
        show_email: profile.show_email,
        show_phone: profile.show_phone,
        show_city: profile.show_city,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from("alumni_profiles")
        .upsert(payload, { onConflict: "user_id" });

      if (profileError) throw profileError;

      const cleanExperiences = experiences
        .filter(
          (item) =>
            item.title.trim() ||
            item.organization.trim() ||
            item.role_name.trim() ||
            item.description.trim()
        )
        .map((item) => ({
          user_id: userId,
          type: item.type,
          title: item.title || "Tanpa judul",
          organization: item.organization || null,
          role_name: item.role_name || null,
          start_year: item.start_year ? Number(item.start_year) : null,
          end_year: item.end_year ? Number(item.end_year) : null,
          achievement_year: item.achievement_year ? Number(item.achievement_year) : null,
          description: item.description || null,
        }));

      const { error: deleteError } = await supabase
        .from("alumni_experiences")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      if (cleanExperiences.length > 0) {
        const { error: expError } = await supabase
          .from("alumni_experiences")
          .insert(cleanExperiences);

        if (expError) throw expError;
      }

      setMessage("Profil berhasil disimpan.");
    } catch (error: any) {
      setMessage(error?.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Lengkapi Profil</h1>
            <p className="mt-1 text-sm text-white/70">
              Lengkapi data diri dan pengalaman untuk memperkuat profil alumni.
            </p>
          </div>

          <div className="min-w-[180px]">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-white/70">Progress</span>
              <span className="font-semibold text-white">{completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7dd3d3] via-[#5eb8b8] to-[#1a5a6d]"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        {message ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            {message}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <SectionTitle title="Data Diri" />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-2xl font-semibold text-white">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                (profile.full_name || "A").charAt(0).toUpperCase()
              )}
            </div>
            <p className="mt-4 text-center text-xs text-white/60">
              Untuk sekarang avatar memakai URL agar nyambung cepat ke backend kamu.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="URL Foto Profil"
              value={profile.avatar_url}
              onChange={(v) => setProfile((prev) => ({ ...prev, avatar_url: v }))}
              placeholder="https://..."
            />
            <Input
              label="Nama Lengkap"
              value={profile.full_name}
              onChange={(v) => setProfile((prev) => ({ ...prev, full_name: v }))}
            />
            <Input
              label="Nama Panggilan"
              value={profile.nickname}
              onChange={(v) => setProfile((prev) => ({ ...prev, nickname: v }))}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(v) => setProfile((prev) => ({ ...prev, email: v }))}
            />
            <Input
              label="No. HP"
              value={profile.phone}
              onChange={(v) => setProfile((prev) => ({ ...prev, phone: v }))}
            />
            <Input
              label="Kota"
              value={profile.city}
              onChange={(v) => setProfile((prev) => ({ ...prev, city: v }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <SectionTitle title="Informasi Umum" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Tahun Masuk"
            value={profile.intake_year}
            onChange={(v) => setProfile((prev) => ({ ...prev, intake_year: v }))}
            type="number"
          />
          <Input
            label="Tahun Lulus"
            value={profile.graduation_year}
            onChange={(v) => setProfile((prev) => ({ ...prev, graduation_year: v }))}
            type="number"
          />
          <Select
            label="Jenis Kelamin"
            value={profile.gender}
            onChange={(v) => setProfile((prev) => ({ ...prev, gender: v }))}
            options={[
              { label: "Laki-laki", value: "MALE" },
              { label: "Perempuan", value: "FEMALE" },
            ]}
          />
          <Select
            label="Status Studi"
            value={profile.study_status}
            onChange={(v) => setProfile((prev) => ({ ...prev, study_status: v }))}
            options={[
              { label: "Aktif", value: "ACTIVE" },
              { label: "Lulus", value: "GRADUATED" },
              { label: "Cuti", value: "ON_LEAVE" },
            ]}
          />
          <Input
            label="Program"
            value={profile.program}
            onChange={(v) => setProfile((prev) => ({ ...prev, program: v }))}
          />
          <Input
            label="Institusi / Kampus"
            value={profile.institution}
            onChange={(v) => setProfile((prev) => ({ ...prev, institution: v }))}
          />
          <Input
            label="Posisi Saat Ini"
            value={profile.current_position}
            onChange={(v) => setProfile((prev) => ({ ...prev, current_position: v }))}
          />
          <Input
            label="Perusahaan / Instansi"
            value={profile.current_company}
            onChange={(v) => setProfile((prev) => ({ ...prev, current_company: v }))}
          />
          <Input
            label="Bidang Pekerjaan"
            value={profile.field_of_work}
            onChange={(v) => setProfile((prev) => ({ ...prev, field_of_work: v }))}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Bio Singkat"
            value={profile.short_bio}
            onChange={(v) => setProfile((prev) => ({ ...prev, short_bio: v }))}
            placeholder="Ceritakan singkat perjalanan akademik atau profesionalmu."
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <SectionTitle title="Tautan Profesional" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="LinkedIn"
            value={profile.linkedin_url}
            onChange={(v) => setProfile((prev) => ({ ...prev, linkedin_url: v }))}
            placeholder="https://linkedin.com/in/..."
          />
          <Input
            label="Instagram"
            value={profile.instagram_url}
            onChange={(v) => setProfile((prev) => ({ ...prev, instagram_url: v }))}
            placeholder="https://instagram.com/..."
          />
          <Input
            label="Website / Portofolio"
            value={profile.website_url}
            onChange={(v) => setProfile((prev) => ({ ...prev, website_url: v }))}
            placeholder="https://..."
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle title="Pengalaman" />
          <button
            type="button"
            onClick={addExperience}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-xl hover:bg-white/15"
          >
            Tambah Pengalaman
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {experiences.map((item, index) => (
            <div
              key={`${item.id ?? "new"}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white">
                  Pengalaman {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80"
                >
                  Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Select
                  label="Tipe"
                  value={item.type}
                  onChange={(v) => updateExperience(index, { type: v })}
                  options={EXPERIENCE_TYPE_OPTIONS}
                />
                <Input
                  label="Judul"
                  value={item.title}
                  onChange={(v) => updateExperience(index, { title: v })}
                  placeholder="Software Engineer / Juara 1 / dll"
                />
                <Input
                  label="Organisasi"
                  value={item.organization}
                  onChange={(v) => updateExperience(index, { organization: v })}
                />
                <Input
                  label="Peran"
                  value={item.role_name}
                  onChange={(v) => updateExperience(index, { role_name: v })}
                />
                <Input
                  label="Tahun Mulai"
                  type="number"
                  value={item.start_year}
                  onChange={(v) => updateExperience(index, { start_year: v })}
                />
                <Input
                  label="Tahun Selesai"
                  type="number"
                  value={item.end_year}
                  onChange={(v) => updateExperience(index, { end_year: v })}
                />
                <Input
                  label="Tahun Prestasi"
                  type="number"
                  value={item.achievement_year}
                  onChange={(v) => updateExperience(index, { achievement_year: v })}
                />
              </div>

              <div className="mt-4">
                <Textarea
                  label="Deskripsi"
                  value={item.description}
                  onChange={(v) => updateExperience(index, { description: v })}
                  placeholder="Tambahkan deskripsi singkat."
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <SectionTitle title="Privasi Profil" />
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Toggle
            label="Tampilkan profil di direktori alumni"
            checked={profile.is_public}
            onChange={(v) => setProfile((prev) => ({ ...prev, is_public: v }))}
          />
          <Toggle
            label="Tampilkan email"
            checked={profile.show_email}
            onChange={(v) => setProfile((prev) => ({ ...prev, show_email: v }))}
          />
          <Toggle
            label="Tampilkan nomor HP"
            checked={profile.show_phone}
            onChange={(v) => setProfile((prev) => ({ ...prev, show_phone: v }))}
          />
          <Toggle
            label="Tampilkan kota"
            checked={profile.show_city}
            onChange={(v) => setProfile((prev) => ({ ...prev, show_city: v }))}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl transition hover:bg-white/15 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </div>
    </div>
  );
}