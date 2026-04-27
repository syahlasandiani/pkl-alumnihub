"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GlassConfirmDialog from "@/components/ui/GlassConfirmDialog";

type NavKey = "beranda" | "jadwal" | "alumni" | "learning-hub" | "faq";

type NavLink = {
  key: NavKey;
  name: string;
  section: NavKey;
};

export default function Header() {
  const pathname = usePathname() || "/";
  const { isAuthenticated, logout, user } = useAuth();

  const isHome = pathname === "/";
  const isAlumniPage = pathname.startsWith("/alumni-directory") || pathname === "/alumni-directory";
  const isLearningHubPage = pathname.startsWith("/learning-hub");
  const isFaqPage = pathname.startsWith("/faq");

  const navLinks: NavLink[] = useMemo(
    () => [
      { key: "beranda", name: "Beranda", section: "beranda" },
      { key: "jadwal", name: "Jadwal", section: "jadwal" },
      { key: "alumni", name: "Alumni", section: "alumni" },
      { key: "learning-hub", name: "Learning Hub", section: "learning-hub" },
      { key: "faq", name: "FAQ", section: "faq" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState<NavKey>("beranda");
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const sections: NavKey[] = ["beranda", "jadwal", "alumni", "learning-hub", "faq"];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  const hrefFor = (section: NavKey) => {
    if (section === "alumni") return "/alumni-directory";
    if (section === "learning-hub") return "/learning-hub";
    if (section === "faq") return "/faq";
    return `/#${section}`;
  };

  const isActive = (link: NavLink) => {
    if (isAlumniPage) return link.key === "alumni";
    if (isLearningHubPage) return link.key === "learning-hub";
    if (isFaqPage) return link.key === "faq";
    if (isHome) return activeSection === link.section;
    return link.key === "beranda";
  };

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 26 }}
        className="fixed top-0 left-0 right-0 z-50 px-6"
      >
        <nav
          className="mt-6 w-full rounded-full border border-white/20 px-8 py-2"
          style={{
            background: "rgba(156, 156, 156, 0.2)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/brands/puslapdik.png"
                alt="Logo Puslapdik"
                width={36}
                height={36}
                className="object-contain"
              />
              <div className="text-white">
                <p className="font-bold text-sm leading-tight">Puslapdik</p>
                <p className="text-xs leading-tight opacity-80">Kemendikdasmen</p>
              </div>
            </Link>

            {/* Nav */}
            <div className="flex items-center gap-6">
              <ul className="flex items-center gap-7">
                {navLinks.map((link) => {
                  const active = isActive(link);

                  return (
                    <li key={link.key} className="relative">
                      <Link
                        href={hrefFor(link.section)}
                        className={`text-sm font-medium transition-colors ${
                          active ? "text-white" : "text-white/70 hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>

                      {active && (
                        <motion.div
                          className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-white"
                          layoutId="underline"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="h-6 w-px bg-white/20" />

              {/* Auth */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/alumni"
                    className="flex items-center gap-3 text-white/85 transition hover:text-white"
                    title="Buka Dashboard Alumni"
                  >
                    <div className="rounded-full bg-white/10 p-2">
                      <User size={16} />
                    </div>
                    <span className="max-w-[160px] truncate text-sm font-medium">
                      {user?.username || "User"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setConfirmLogoutOpen(true)}
                    className="flex items-center gap-2 text-sm font-medium text-red-300 transition-colors hover:text-red-200"
                    title="Keluar"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Confirm Logout */}
      <GlassConfirmDialog
        open={confirmLogoutOpen}
        title="Kamu yakin ingin keluar?"
        message="Kamu akan logout dari sesi ini dan perlu login lagi untuk mengakses fitur member."
        confirmLabel={logoutLoading ? "Keluar..." : "Yakin"}
        cancelLabel="Tidak"
        onCancel={() => {
          if (logoutLoading) return;
          setConfirmLogoutOpen(false);
        }}
        onConfirm={async () => {
          if (logoutLoading) return;
          setLogoutLoading(true);
          try {
            await logout();
          } finally {
            setLogoutLoading(false);
            setConfirmLogoutOpen(false);
          }
        }}
      />
    </>
  );
}