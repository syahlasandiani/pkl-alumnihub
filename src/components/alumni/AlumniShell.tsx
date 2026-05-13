import Link from "next/link";
import React from "react";

type AlumniShellProps = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actionLabel?: string;
  actionHref?: string;
  topRightNode?: React.ReactNode;
  children: React.ReactNode;
};

export default function AlumniShell({
  title,
  subtitle,
  backHref,
  backLabel,
  actionLabel,
  actionHref,
  topRightNode,
  children,
}: AlumniShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-bg.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/45 backdrop-[1px]" />

      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 rounded-full border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                  P
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white">Puslapdik</p>
                  <p className="text-[11px] text-white/60">Kemendikdasmen</p>
                </div>
              </div>

              <nav className="flex items-center gap-6 text-sm text-white/75">
                <Link href="/" className="hover:text-white">
                  Beranda
                </Link>
                <Link href="/alumni" className="text-white">
                  Alumni
                </Link>
              </nav>
            </div>
          </header>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            {backHref && backLabel ? (
              <Link
                href={backHref}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl transition hover:bg-white/15 hover:text-white"
              >
                ← {backLabel}
              </Link>
            ) : null}

            {topRightNode ? (
              topRightNode
            ) : actionLabel && actionHref ? (
              <Link
                href={actionHref}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl transition hover:bg-white/15"
              >
                {actionLabel}
              </Link>
            ) : null}
          </div>

          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  {title}
                </h1>
              )}
              {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
            </div>
          )}

          {children}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/75 px-6 py-10 text-white/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">Puslapdik</p>
            <p className="mt-2 text-sm text-white/60">Kemendikdasmen</p>
          </div>
          <div>
            <p className="font-semibold text-white">Kontak Kami</p>
            <p className="mt-2 text-sm text-white/65">
              Gedung C Lantai 13
              <br />
              Jl. Jenderal Sudirman, Senayan
              <br />
              Jakarta Pusat 10270
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Tautan Terkait</p>
            <p className="mt-2 text-sm text-white/65">
              Kemendikdasmen
              <br />
              Setjen Kemendikdasmen
              <br />
              Ditjen PAUD dan Dikdasmen
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Program</p>
            <p className="mt-2 text-sm text-white/65">
              Afirmasi Pendidikan Menengah
              <br />
              Beasiswa Unggulan
              <br />
              Beasiswa Pendidikan Indonesia
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}