import type { ReactNode } from "react";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/backgrounds/login-bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-2 gap-10">
          {/* Left */}
          <GlassCard className="p-12 shadow-2xl">
            <div className="flex items-center gap-3">
                <Image
                    src="/assets/brands/puslapdik.png"
                    alt="Puslapdik"
                    width={44}
                    height={44}
                    className="object-contain"
                    priority
                />

                <div className="leading-tight">
                    <div className="text-white text-lg font-semibold">Alumni Hub</div>
                    <div className="text-white/60 text-sm">Puslapdik Kemendikdasmen</div>
                </div>
            </div>

            <div className="mt-14">
              <h1 className="text-4xl font-semibold text-white leading-tight">
                Masuk untuk berinteraksi
              </h1>

              <p className="mt-4 text-white/70 leading-relaxed max-w-md">
                Komentar, like, dan akses fitur Alumni Hub tersedia setelah kamu login.
                Jika kamu alumni/awardee, ajukan verifikasi untuk membuka fitur tambahan.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  { title: "Public User", desc: "Bisa komentar & like di forum." },
                  {
                    title: "Alumni Verified",
                    desc: "Bisa buat thread, event, konten, dan upload resource.",
                  },
                  { title: "Admin", desc: "Verifikasi alumni & moderasi konten." },
                ].map((x) => (
                  <div
                    key={x.title}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4"
                  >
                    <div className="text-white font-medium">{x.title}</div>
                    <div className="text-white/60 text-sm mt-1">{x.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 text-white/40 text-sm">
              Alumni Hub Anjay
            </div>
          </GlassCard>

          {/* Right */}
          <GlassCard className="p-12 shadow-2xl">{children}</GlassCard>
        </div>
      </div>
    </section>
  );
}