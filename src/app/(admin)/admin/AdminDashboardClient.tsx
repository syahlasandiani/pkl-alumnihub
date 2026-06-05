"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  deleteArticle,
  deleteEvent,
  deleteResource,
  refreshAdminEvents,
  refreshAdminResources,
  refreshAdminStats,
} from "./actions";
import GlassCard from "@/components/ui/GlassCard";
import CTAButton from "@/components/ui/CTAButton";

type TabType = "users" | "events" | "articles" | "resources";

interface Stats {
  users: number;
  events: number;
  articles: number;
  resources: number;
  pendingVerifications: number;
  verifiedUsers: number;
}

interface AdminDashboardClientProps {
  stats: Stats;
  data: {
    users: any[];
    events: any[];
    articles: any[];
    resources: any[];
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboardClient({
  stats: initialStats,
  data: initialData,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [data, setData] = useState(initialData);
  const [realtimeStatus, setRealtimeStatus] = useState<"connected" | "connecting" | "error">("connecting");

  // ─── Realtime ─────────────────────────────────────────────────────────────
  const refreshData = useCallback(async (changedTable: "events" | "resources") => {
    try {
      const [newData, newStats] = await Promise.all([
        changedTable === "events" ? refreshAdminEvents() : refreshAdminResources(),
        refreshAdminStats(),
      ]);
      setData((prev) => ({ ...prev, [changedTable]: newData }));
      setStats(newStats);
    } catch (err) {
      console.error("Gagal refresh:", err);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => refreshData("events"))
      .on("postgres_changes", { event: "*", schema: "public", table: "resources" }, () => refreshData("resources"))
      .on("postgres_changes", { event: "*", schema: "public", table: "articles" }, async () => {
        setStats(await refreshAdminStats());
      })
      .subscribe((s) => {
        if (s === "SUBSCRIBED") setRealtimeStatus("connected");
        else if (s === "CHANNEL_ERROR") setRealtimeStatus("error");
      });
    return () => { supabase.removeChannel(channel); };
  }, [refreshData]);

  // ─── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string, type: Exclude<TabType, "users">) => {
    if (!confirm("Yakin hapus item ini?")) return;
    setIsDeleting(id);
    try {
      if (type === "articles") await deleteArticle(id);
      if (type === "events") await deleteEvent(id);
      if (type === "resources") await deleteResource(id);
      setData((prev) => ({ ...prev, [type]: prev[type].filter((r: any) => r.id !== id) }));
      setStats(await refreshAdminStats());
    } catch (e: any) {
      alert("Gagal: " + e.message);
    } finally {
      setIsDeleting(null);
    }
  };

  // ─── Stat card config ──────────────────────────────────────────────────────
  const statCards = [
    {
      key: "articles" as keyof Stats,
      tab: "articles" as TabType,
      label: "Total Artikel",
      sublabel: "Konten dipublikasikan",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      ),
      color: {
        card: "from-violet-600/30 via-violet-500/10 to-transparent",
        border: "border-violet-500/35",
        activeBorder: "border-violet-400/60",
        icon: "bg-violet-500/20 text-violet-300",
        value: "text-violet-200",
        badge: "bg-violet-500/20 text-violet-300",
        glow: "shadow-violet-500/25",
      },
    },
    {
      key: "events" as keyof Stats,
      tab: "events" as TabType,
      label: "Total Event",
      sublabel: "Event aktif & selesai",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      color: {
        card: "from-teal-600/30 via-teal-500/10 to-transparent",
        border: "border-teal-500/35",
        activeBorder: "border-teal-400/60",
        icon: "bg-teal-500/20 text-teal-300",
        value: "text-teal-200",
        badge: "bg-teal-500/20 text-teal-300",
        glow: "shadow-teal-500/25",
      },
    },
    {
      key: "resources" as keyof Stats,
      tab: "resources" as TabType,
      label: "Total Resource",
      sublabel: "Dokumen & materi belajar",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
      color: {
        card: "from-amber-600/30 via-amber-500/10 to-transparent",
        border: "border-amber-500/35",
        activeBorder: "border-amber-400/60",
        icon: "bg-amber-500/20 text-amber-300",
        value: "text-amber-200",
        badge: "bg-amber-500/20 text-amber-300",
        glow: "shadow-amber-500/25",
      },
    },
    {
      key: "verifiedUsers" as keyof Stats,
      tab: "users" as TabType,
      label: "Akun Terverifikasi",
      sublabel: `dari ${stats.users} total user`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
      color: {
        card: "from-emerald-600/30 via-emerald-500/10 to-transparent",
        border: "border-emerald-500/35",
        activeBorder: "border-emerald-400/60",
        icon: "bg-emerald-500/20 text-emerald-300",
        value: "text-emerald-200",
        badge: "bg-emerald-500/20 text-emerald-300",
        glow: "shadow-emerald-500/25",
      },
    },
  ];

  const tabs = [
    { key: "users" as TabType, label: "Users", count: stats.users },
    { key: "events" as TabType, label: "Events", count: stats.events },
    { key: "articles" as TabType, label: "Artikel", count: stats.articles },
    { key: "resources" as TabType, label: "Resources", count: stats.resources },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          BAGIAN 1 — HEADER PANEL ADMIN
      ══════════════════════════════════════════════════════════════════════ */}
      <GlassCard className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#7dd3d3]/15 border border-[#7dd3d3]/25">
              <svg className="w-6 h-6 text-[#7dd3d3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panel Admin</h1>
              <p className="text-sm text-white/50 mt-0.5">
                Kontrol penuh sistem — verifikasi, moderasi, dan manajemen konten
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Realtime status */}
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              realtimeStatus === "connected" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
              : realtimeStatus === "error" ? "bg-red-500/15 text-red-300 border border-red-500/25"
              : "bg-white/10 text-white/40 border border-white/10"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                realtimeStatus === "connected" ? "bg-emerald-400 animate-pulse"
                : realtimeStatus === "error" ? "bg-red-400"
                : "bg-white/30 animate-pulse"
              }`} />
              {realtimeStatus === "connected" ? "Live" : realtimeStatus === "error" ? "Error" : "Connecting..."}
            </div>
            {/* Pending verifikasi */}
            {stats.pendingVerifications > 0 && (
              <CTAButton href="/admin/verifications" className="text-xs px-4 py-2">
                ⚠️ {stats.pendingVerifications} Pending Verifikasi
              </CTAButton>
            )}
          </div>
        </div>
      </GlassCard>

      {/* ══════════════════════════════════════════════════════════════════════
          BAGIAN 2 — 4 STAT CARDS HORIZONTAL
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => {
          const isActive = activeTab === card.tab;
          const value = stats[card.key];
          return (
            <button
              key={String(card.key)}
              onClick={() => setActiveTab(card.tab)}
              className={`group relative text-left rounded-2xl border p-5 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-0.5 ${
                isActive
                  ? `${card.color.activeBorder} bg-gradient-to-br ${card.color.card} shadow-lg ${card.color.glow}`
                  : `${card.color.border} bg-white/5 hover:bg-white/8 hover:shadow-md`
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.color.icon}`}>
                  {card.icon}
                </div>
                {isActive && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.color.badge}`}>
                    Aktif
                  </span>
                )}
              </div>
              <p className={`text-4xl font-bold tracking-tight mb-1 ${isActive ? card.color.value : "text-white"}`}>
                {value}
              </p>
              <p className="text-sm font-semibold text-white/70">{card.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{card.sublabel}</p>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BAGIAN 3 — TABEL AKTIVITAS LENGKAP
      ══════════════════════════════════════════════════════════════════════ */}
      <GlassCard className="p-0 mb-6 overflow-hidden">
        {/* Tab header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white">Data &amp; Manajemen</h2>
            <p className="text-xs text-white/40 mt-0.5">Kelola seluruh data sistem dari satu tempat</p>
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-[#7dd3d3] text-slate-900 shadow"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                }`}
              >
                {tab.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.key ? "bg-slate-900/20 text-slate-800" : "bg-white/10 text-white/60"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white min-w-[640px]">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                {activeTab === "users" && (
                  <>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Nama</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Email</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Status Verifikasi</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Terdaftar</th>
                  </>
                )}
                {activeTab === "events" && (
                  <>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Nama Event</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Pembuat</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Tipe</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Dibuat</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Aksi</th>
                  </>
                )}
                {activeTab === "articles" && (
                  <>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Judul Artikel</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Pembuat</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Status</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Dibuat</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Aksi</th>
                  </>
                )}
                {activeTab === "resources" && (
                  <>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Judul Resource</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Pembuat</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Kategori</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Dibuat</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35">Aksi</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data[activeTab].length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-white/25">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span className="text-sm">Belum ada data {activeTab}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data[activeTab].map((row: any) => (
                  <tr key={row.id} className="hover:bg-white/4 transition-colors">
                    {activeTab === "users" && (
                      <>
                        <td className="px-6 py-4 font-medium text-white/90">{row.display_name || "—"}</td>
                        <td className="px-6 py-4 text-white/45 text-xs">{row.email || <span className="italic">Tidak tersedia</span>}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.verification_status === "VERIFIED" ? "bg-emerald-500/15 text-emerald-300"
                            : row.verification_status === "PENDING" ? "bg-amber-500/15 text-amber-300"
                            : "bg-white/8 text-white/45"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              row.verification_status === "VERIFIED" ? "bg-emerald-400"
                              : row.verification_status === "PENDING" ? "bg-amber-400"
                              : "bg-white/30"
                            }`} />
                            {row.verification_status || "NONE"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/35 text-xs">{formatDate(row.created_at)}</td>
                      </>
                    )}
                    {activeTab === "events" && (
                      <>
                        <td className="px-6 py-4 font-medium text-white/90 max-w-[240px] truncate" title={row.title}>{row.title}</td>
                        <td className="px-6 py-4 text-white/45 text-xs">{row.creator_name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-teal-500/15 px-2.5 py-1 text-xs font-medium text-teal-300">{row.type || "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-white/35 text-xs">{formatDate(row.created_at)}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(row.id, "events")} disabled={isDeleting === row.id}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition disabled:opacity-40">
                            {isDeleting === row.id ? "..." : "Hapus"}
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === "articles" && (
                      <>
                        <td className="px-6 py-4 font-medium text-white/90 max-w-[240px] truncate" title={row.title}>{row.title}</td>
                        <td className="px-6 py-4 text-white/45 text-xs">{row.creator_name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-300">{row.status || "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-white/35 text-xs">{formatDate(row.created_at)}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(row.id, "articles")} disabled={isDeleting === row.id}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition disabled:opacity-40">
                            {isDeleting === row.id ? "..." : "Hapus"}
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === "resources" && (
                      <>
                        <td className="px-6 py-4 font-medium text-white/90 max-w-[240px] truncate" title={row.title}>{row.title}</td>
                        <td className="px-6 py-4 text-white/45 text-xs">{row.creator_name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-300">{row.category || "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-white/35 text-xs">{formatDate(row.created_at)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {row.file_url && (
                              <a href={row.file_url} target="_blank" rel="noopener noreferrer"
                                className="rounded-lg border border-[#7dd3d3]/30 bg-[#7dd3d3]/10 px-3 py-1.5 text-xs font-medium text-[#7dd3d3] hover:bg-[#7dd3d3]/20 transition">
                                Unduh
                              </a>
                            )}
                            <button onClick={() => handleDelete(row.id, "resources")} disabled={isDeleting === row.id}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition disabled:opacity-40">
                              {isDeleting === row.id ? "..." : "Hapus"}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ══════════════════════════════════════════════════════════════════════
          BAGIAN 4 — AKSI CEPAT ADMIN
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        {[
          { title: "Buat Event", desc: "Umumkan event baru", href: "/admin/create-event", borderHover: "hover:border-teal-500/40", textHover: "group-hover:text-teal-300",
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          },
          { title: "Buat Konten", desc: "Tulis artikel baru", href: "/admin/create-post", borderHover: "hover:border-violet-500/40", textHover: "group-hover:text-violet-300",
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>
          },
          { title: "Upload Resource", desc: "Bagikan materi belajar", href: "/admin/upload-resource", borderHover: "hover:border-amber-500/40", textHover: "group-hover:text-amber-300",
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          },
          { title: "Verifikasi Alumni", desc: "Proses pengajuan masuk", href: "/admin/verifications", borderHover: "hover:border-emerald-500/40", textHover: "group-hover:text-emerald-300",
            icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
          },
        ].map((action) => (
          <Link key={action.title} href={action.href}
            className={`group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-200 hover:bg-white/8 hover:-translate-y-0.5 hover:shadow-lg ${action.borderHover}`}>
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl bg-white/8 text-white/50 transition-colors ${action.textHover}`}>
                {action.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest text-white/25 group-hover:text-white/50 transition-colors flex items-center gap-0.5`}>
                Buka <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
            <div>
              <h3 className={`text-sm font-bold text-white transition-colors ${action.textHover}`}>{action.title}</h3>
              <p className="text-xs text-white/35 mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
