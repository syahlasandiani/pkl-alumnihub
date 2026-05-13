"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import BackCTA from "@/components/ui/BackCTA";
import GlassPill from "@/components/ui/GlassPill";
import GlassDialog from "@/components/ui/GlassDialog";
import { createClient } from "@/lib/supabase/client"; // ✅ ganti ini

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

function fallbackName(email?: string | null) {
  if (!email) return "User";
  const base = email.split("@")[0] || "User";
  return base
    .replace(/[._-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function LoginPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const next = sp.get("next") || "/";

  const supabase = createClient(); // ✅ bikin client di component (client-side)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(
    () => email.trim().length > 0 && password.trim().length >= 6,
    [email, password]
  );

  const [successOpen, setSuccessOpen] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [failMsg, setFailMsg] = useState(
    "Akun tidak ditemukan. Pastikan email dan password benar."
  );
  const [welcomeName, setWelcomeName] = useState("User");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();

        if (msg.includes("confirm") || msg.includes("verified")) {
          setFailMsg(
            "Email kamu belum terverifikasi. Silakan cek inbox dan klik link verifikasi dulu."
          );
          setFailOpen(true);
          return;
        }

        if (msg.includes("invalid login credentials")) {
          setFailMsg("Akun tidak ditemukan. Pastikan email dan password benar.");
          setFailOpen(true);
          return;
        }

        setFailMsg(`Gagal! ${error.message}`);
        setFailOpen(true);
        return;
      }

      // ✅ penting: refresh router agar server component kebaca cookie baru
      router.refresh();

      const { data } = await supabase.auth.getUser();
      const u = data?.user;

      const meta: any = u?.user_metadata || {};
      const name =
        (meta.display_name as string | undefined)?.trim() ||
        (meta.full_name as string | undefined)?.trim() ||
        fallbackName(u?.email);

      setWelcomeName(name);
      setSuccessOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <BackCTA className="mb-8" />

      <h2 className="text-3xl font-semibold text-white">Masuk</h2>
      <div className="mt-2 h-px w-16 bg-white/40" />
      <p className="mt-4 text-white/70">
        Masukkan email dan password untuk login ke akun kamu. Jika belum punya akun, kamu dapat mendaftar terlebih dahulu.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              autoComplete="current-password"
            />
            <GlassPill type="button" onClick={() => setShow((s) => !s)}>
              {show ? "Hide" : "Show"}
            </GlassPill>
          </div>
        </Field>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full h-12 rounded-2xl border border-white/15 bg-white/15 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/15 text-white font-medium transition"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <div className="pt-2 text-white/70 text-sm">
          Belum punya akun?{" "}
          <Link
            className="text-white hover:underline"
            href={`/register?next=${encodeURIComponent(next)}`}
          >
            Daftar
          </Link>
        </div>
      </form>

      <GlassDialog
        open={successOpen}
        tone="success"
        title="Berhasil Login!"
        message={`Selamat Datang, ${welcomeName}!`}
        ctaLabel="Oke"
        onClose={() => {
          setSuccessOpen(false);
          router.push(next);
          router.refresh(); // ✅ biar server state ikut kebaca
        }}
      />

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