"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import BackCTA from "@/components/ui/BackCTA";
import GlassPill from "@/components/ui/GlassPill";
import GlassDialog from "@/components/ui/GlassDialog";
import CTAButton from "@/components/ui/CTAButton";
import { createClient } from "@/lib/supabase/client";


const inputClass =
  "w-full h-12 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md px-4 text-white placeholder:text-white/40 outline-none focus:border-white/30";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-white/70 text-sm">{label}</label>
      {children}
    </div>
  );
}

import { Suspense } from "react";

function RegisterForm() {
  const supabase = createClient(); 
  
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // dialogs
  const [checkEmailOpen, setCheckEmailOpen] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [failMsg, setFailMsg] = useState("Gagal! Coba lagi ya.");

  const isValid = useMemo(() => {
    if (!agree) return false;
    if (name.trim().length < 2) return false;
    if (email.trim().length === 0) return false;
    if (pw.trim().length < 6) return false;
    if (pw !== pw2) return false;
    return true;
  }, [agree, name, email, pw, pw2]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pw,
        options: {
          data: {
            display_name: name.trim(), // ✅ ini yang dipakai login + navbar
          },
          // optional (recommended): redirect setelah klik link verifikasi
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/login?next=${encodeURIComponent(next)}`
              : undefined,
        },
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();

        // supabase free tier sering kena limit email kalau spam register
        if (msg.includes("rate") || msg.includes("limit")) {
          setFailMsg(
            "Terlalu banyak percobaan kirim email. Tunggu beberapa saat untuk coba lagi."
          );
          setFailOpen(true);
          return;
        }

        setFailMsg(`Gagal! ${error.message}`);
        setFailOpen(true);
        return;
      }

      // sukses: tampilkan popup cek email
      setCheckEmailOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <BackCTA className="mb-8" />

      <h2 className="text-3xl font-semibold text-white">Daftar Akun</h2>
      <div className="mt-2 h-px w-16 bg-white/40" />
      <p className="mt-4 text-white/70">
        Buat akun untuk mulai berinteraksi. Alumni bisa ajukan verifikasi setelah
        login.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Field label="Nama">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            autoComplete="name"
          />
        </Field>

        <Field label="Email">
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@contoh.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Password">
          <div className="flex items-center gap-3">
            <input
              className={`${inputClass} flex-1`}
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
            />
            <GlassPill type="button" onClick={() => setShow((s) => !s)}>
              {show ? "Hide" : "Show"}
            </GlassPill>
          </div>
        </Field>

        <Field label="Ulangi Password">
          <input
            className={inputClass}
            type={show ? "text" : "password"}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            placeholder="Harus sama"
            autoComplete="new-password"
          />
        </Field>

        <CTAButton
          type="submit"
          disabled={!isValid}
          loading={loading}
          className="w-full h-12"
        >
          Daftar
        </CTAButton>

        <div className="pt-2 text-white/70 text-sm">
          Sudah punya akun?{" "}
          <Link
            className="text-white hover:underline"
            href={`/login?next=${encodeURIComponent(next)}`}
          >
            Masuk
          </Link>
        </div>
      </form>

      {/* ✅ popup cek email */}
      <GlassDialog
        open={checkEmailOpen}
        tone="info"
        title="Cek Email Kamu"
        message={
          <>
            <div className="space-y-2">
              <p>
                Kami sudah kirim link verifikasi ke{" "}
                <span className="text-white font-medium">{email.trim()}</span>.
              </p>
              <p>
                Klik link tersebut untuk mengaktifkan akun, lalu kembali ke
                halaman login.
              </p>
              <div className="mt-3 text-white/70 text-sm">
                Tips:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Cek folder Spam/Promotions.</li>
                  <li>Pastikan email yang kamu masukkan benar.</li>
                  <li>
                    Kalau perlu, tunggu 1–2 menit sebelum coba daftar ulang.
                  </li>
                </ul>
              </div>
            </div>
          </>
        }
        ctaLabel="Oke"
        onClose={() => setCheckEmailOpen(false)}
      />

      {/* gagal register */}
      <GlassDialog
        open={failOpen}
        tone="danger"
        title="Gagal!"
        message={failMsg}
        ctaLabel="Oke"
        onClose={() => setFailOpen(false)}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-white/50 py-10 text-center">Memuat form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}