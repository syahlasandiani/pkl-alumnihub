"use client";

import { useMemo, useState, useRef } from "react";
import AlumniAlert from "@/components/ui/AlumniAlert";
import GlassCard from "@/components/ui/GlassCard";
import CTAButton from "@/components/ui/CTAButton";
import { saveProfileAction, saveExperiencesAction, uploadFileToStorage } from "@/app/(alumni)/alumni/actions";

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
    avatar_url: string;
    gender: string;
    study_status: string;
    intake_year: string;
    graduation_year: string;
    degree_level: string;
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
  };
  experiences: ExperienceItem[];
  isVerified?: boolean;
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
        value={value ?? ""}
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
        value={value ?? ""}
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
        value={value ?? ""}
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

const EXPERIENCE_TYPE_OPTIONS = [
  { label: "Pekerjaan", value: "WORK" },
  { label: "Prestasi", value: "ACHIEVEMENT" },
];

const DEGREE_LEVEL_OPTIONS = [
  { label: "S1", value: "S1" },
  { label: "S2", value: "S2" },
  { label: "S3", value: "S3" },
];

export default function AlumniProfileForm({
  userId,
  profile: initialProfile,
  experiences: initialExperiences,
  isVerified = false,
}: AlumniProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar_url);
  const [saving, setSaving] = useState(false);

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

  const completion = useMemo(() => {
    const checklist = [
      Boolean(profile.avatar_url || avatarFile),
      Boolean(profile.full_name),
      Boolean(profile.current_position || profile.current_company),
      Boolean(profile.linkedin_url || profile.website_url || profile.instagram_url),
      experiences.some((item) => item.title.trim().length > 0),
    ];
    const done = checklist.filter(Boolean).length;
    return Math.round((done / checklist.length) * 100);
  }, [profile, avatarFile, experiences]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

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
    if (!profile.full_name) {
      setAlert({ isOpen: true, type: 'error', title: 'Belum Lengkap!', message: 'Harap isi Nama Lengkap kamu.' });
      return;
    }

    setSaving(true);

    try {
      let finalAvatarUrl = profile.avatar_url;

      if (avatarFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const { url, error } = await uploadFileToStorage('avatars', fileName, base64, avatarFile.type);
        if (error) throw new Error(`Gagal upload avatar: ${error}`);
        finalAvatarUrl = url || "";
      }

      const profilePayload = {
        full_name: profile.full_name,
        email: profile.email || null,
        avatar_url: finalAvatarUrl || null,
        degree_level: profile.degree_level || null,
        graduation_year: profile.graduation_year ? Number(profile.graduation_year) : null,
        program: profile.program || null,
        institution: profile.institution || null,
        city: profile.city || null,
        current_position: profile.current_position || null,
        current_company: profile.current_company || null,
        linkedin_url: profile.linkedin_url || null,
        instagram_url: profile.instagram_url || null,
        website_url: profile.website_url || null,
      };

      const profileRes = await saveProfileAction(profilePayload);
      if (profileRes.error) throw new Error(profileRes.error);

      const cleanExperiences = experiences
        .filter((item) => item.title.trim() || item.organization.trim() || item.role_name.trim() || item.description.trim())
        .map((item) => ({
          type: item.type,
          title: item.title || "Tanpa judul",
          organization: item.organization || null,
          role_name: item.role_name || null,
          start_year: item.start_year ? Number(item.start_year) : null,
          end_year: item.end_year ? Number(item.end_year) : null,
          achievement_year: item.achievement_year ? Number(item.achievement_year) : null,
          description: item.description || null,
        }));

      const expRes = await saveExperiencesAction(cleanExperiences);
      if (expRes.error) throw new Error(expRes.error);

      setAlert({
        isOpen: true,
        type: 'success',
        title: 'Profil Tersimpan!',
        message: 'Perubahan profil kamu telah berhasil disimpan di direktori alumni.'
      });
    } catch (error: any) {
      console.error(error);
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Oops!',
        message: error?.message || 'Gagal menyimpan profil. Silakan coba lagi.'
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AlumniAlert 
        {...alert} 
        onClose={() => setAlert({ ...alert, isOpen: false })} 
      />

      <div className="space-y-8">
        <GlassCard className="p-6">
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
        </GlassCard>

        <GlassCard className="p-6">
          <SectionTitle title="Data Diri" />
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-2xl font-semibold text-white transition hover:bg-white/15"
              >
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (profile.full_name || "A").charAt(0).toUpperCase()
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <p className="mt-4 text-center text-xs text-white/60">
                Klik lingkaran di atas untuk upload foto profil.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Nama Lengkap"
                value={profile.full_name}
                onChange={(v) => setProfile((prev) => ({ ...prev, full_name: v }))}
              />
              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(v) => setProfile((prev) => ({ ...prev, email: v }))}
              />
              <Input
                label="Kota"
                value={profile.city}
                onChange={(v) => setProfile((prev) => ({ ...prev, city: v }))}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden">
          {!isVerified && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="text-[#c8ffff] font-semibold text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Fitur Terkunci
              </span>
              <span className="text-white/80 text-sm max-w-sm text-center">Tunggu hingga pengajuan verifikasi disetujui admin untuk mengelola informasi umum pendidikan dan pekerjaan.</span>
            </div>
          )}
          <SectionTitle title="Informasi Umum" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Jenjang"
              value={profile.degree_level}
              onChange={(v) => setProfile((prev) => ({ ...prev, degree_level: v }))}
              options={DEGREE_LEVEL_OPTIONS}
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
              label="Tahun Lulus"
              value={profile.graduation_year}
              onChange={(v) => setProfile((prev) => ({ ...prev, graduation_year: v }))}
              type="number"
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
          </div>
        </GlassCard>

        <GlassCard className="p-6">
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
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden">
          {!isVerified && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-[26px]">
              <span className="text-[#c8ffff] font-semibold text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Fitur Terkunci
              </span>
              <span className="text-white/80 text-sm max-w-sm text-center">Akun Alumni Verified dibutuhkan untuk membagikan riwayat pengalaman profesional dan prestasi.</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <SectionTitle title="Pengalaman" />
            <CTAButton variant="secondary" onClick={addExperience} disabled={!isVerified}>
              Tambah Pengalaman
            </CTAButton>
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
        </GlassCard>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <CTAButton onClick={handleSave} loading={saving}>
            Simpan Profil
          </CTAButton>
        </div>
      </div>
    </>
  );
}