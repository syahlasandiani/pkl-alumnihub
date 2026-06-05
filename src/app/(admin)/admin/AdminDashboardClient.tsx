"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteArticle, deleteEvent, deleteResource } from "./actions";
import GlassCard from "@/components/ui/GlassCard";
import CTAButton from "@/components/ui/CTAButton";

type TabType = "users" | "events" | "articles" | "resources";

interface AdminDashboardClientProps {
  stats: {
    users: number;
    events: number;
    articles: number;
    resources: number;
    pendingVerifications?: number;
  };
  data: {
    users: any[];
    events: any[];
    articles: any[];
    resources: any[];
  };
}

const quickActions = [
  {
    title: "Buat Event",
    desc: "Tulis & umumkan event komunitas baru.",
    href: "/admin/create-event",
  },
  {
    title: "Buat Konten",
    desc: "Tulis artikel atau post komunitas baru.",
    href: "/admin/create-post",
  },
  {
    title: "Upload Resource",
    desc: "Bagikan dokumen atau resource belajar baru.",
    href: "/admin/upload-resource",
  },
  {
    title: "Kelola Verifikasi",
    desc: "Lihat dan proses pengajuan verifikasi alumni.",
    href: "/admin/verifications",
  },
];

export default function AdminDashboardClient({
  stats,
  data,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, type: TabType) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;
    setIsDeleting(id);
    try {
      if (type === "articles") await deleteArticle(id);
      if (type === "events") await deleteEvent(id);
      if (type === "resources") await deleteResource(id);
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const statCards = [
    { label: "Total Users", value: stats.users, tab: "users" as TabType },
    { label: "Total Events", value: stats.events, tab: "events" as TabType },
    { label: "Total Artikel", value: stats.articles, tab: "articles" as TabType },
    { label: "Total Resources", value: stats.resources, tab: "resources" as TabType },
  ];

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] items-stretch mt-4">
        {/* Kolom Kiri: Header & Tabel Aktivitas */}
        <div className="flex flex-col gap-6 h-full">
          {/* Panel Admin Header Card */}
          <GlassCard className="p-8">
            <h1 className="typo-section-title text-white">Panel Admin</h1>
            <p className="mt-2 text-sm text-white/70 typo-body">
              Pantau verifikasi, moderasi komunitas, dan aktivitas sistem dari satu tempat.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/60">
              <span className="text-white/95">Administrator</span>
              <span>•</span>
              <span>Akses penuh sistem</span>
            </div>
          </GlassCard>

          {/* Aktivitas Terbaru Table Card */}
          <GlassCard className="p-8 overflow-hidden flex flex-col flex-1 min-h-[500px]">
            <h2 className="typo-card-title text-white capitalize">
              Aktivitas Terbaru - {activeTab}
            </h2>
            <p className="mt-1 text-sm text-white/60 typo-body">
              Daftar data terbaru untuk entitas {activeTab}.
            </p>

            <div className="mt-6 overflow-auto pr-2 custom-scrollbar flex-1">
              <table className="w-full text-left text-sm text-white">
                <thead className="sticky top-0 bg-slate-900/80 text-white/70 backdrop-blur-md">
                  <tr>
                    {activeTab === "users" && (
                      <>
                        <th className="px-4 py-3 rounded-tl-xl">Nama</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3 rounded-tr-xl">Status</th>
                      </>
                    )}
                    {activeTab === "events" && (
                      <>
                        <th className="px-4 py-3 rounded-tl-xl">Nama Event</th>
                        <th className="px-4 py-3">Pembuat</th>
                        <th className="px-4 py-3">Tipe</th>
                        <th className="px-4 py-3 rounded-tr-xl">Aksi</th>
                      </>
                    )}
                    {activeTab === "articles" && (
                      <>
                        <th className="px-4 py-3 rounded-tl-xl">Judul Konten</th>
                        <th className="px-4 py-3">Pembuat</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 rounded-tr-xl">Aksi</th>
                      </>
                    )}
                    {activeTab === "resources" && (
                      <>
                        <th className="px-4 py-3 rounded-tl-xl">Judul Resource</th>
                        <th className="px-4 py-3">Pembuat</th>
                        <th className="px-4 py-3 rounded-tr-xl">Aksi</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data[activeTab].length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-white/50">
                        Tidak ada data {activeTab}.
                      </td>
                    </tr>
                  ) : (
                    data[activeTab].map((row: any) => (
                      <tr key={row.id} className="transition-colors hover:bg-white/5">
                        {activeTab === "users" && (
                          <>
                            <td className="px-4 py-3 font-medium">{row.display_name}</td>
                            <td className="px-4 py-3 text-white/60">{row.email || "-"}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                row.verification_status === 'VERIFIED' ? 'bg-green-500/20 text-green-300' :
                                row.verification_status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-white/10 text-white/60'
                              }`}>
                                {row.verification_status}
                              </span>
                            </td>
                          </>
                        )}
                        {activeTab === "events" && (
                          <>
                            <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={row.title}>
                              {row.title}
                            </td>
                            <td className="px-4 py-3 text-white/60">{row.creator_name}</td>
                            <td className="px-4 py-3">{row.type}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(row.id, "events")}
                                disabled={isDeleting === row.id}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                {isDeleting === row.id ? "Menghapus..." : "Hapus"}
                              </button>
                            </td>
                          </>
                        )}
                        {activeTab === "articles" && (
                          <>
                            <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={row.title}>
                              {row.title}
                            </td>
                            <td className="px-4 py-3 text-white/60">{row.creator_name}</td>
                            <td className="px-4 py-3">{row.status}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(row.id, "articles")}
                                disabled={isDeleting === row.id}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                {isDeleting === row.id ? "Menghapus..." : "Hapus"}
                              </button>
                            </td>
                          </>
                        )}
                        {activeTab === "resources" && (
                          <>
                            <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={row.title}>
                              {row.title}
                            </td>
                            <td className="px-4 py-3 text-white/60">{row.creator_name}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {row.file_url && (
                                  <a
                                    href={row.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#7dd3d3] hover:text-white"
                                  >
                                    Unduh
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDelete(row.id, "resources")}
                                  disabled={isDeleting === row.id}
                                  className="text-xs text-red-400 hover:text-red-300"
                                >
                                  {isDeleting === row.id ? "Menghapus..." : "Hapus"}
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
        </div>

        {/* Kolom Kanan: Fokus Hari Ini & Quick Actions */}
        <div className="flex flex-col gap-6 h-full">
          {/* Fokus Hari Ini Card */}
          <GlassCard className="p-8">
            <h2 className="typo-card-title text-white mb-2">Fokus Hari Ini</h2>
            <p className="text-sm text-white/60 mb-4 typo-body">
              Saring aktivitas terbaru berdasarkan statistik di bawah ini:
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {statCards.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex flex-col items-start rounded-2xl border p-4 transition text-left cursor-pointer ${
                    activeTab === item.tab
                      ? "border-[#7dd3d3] bg-[#7dd3d3]/20 shadow-[0_0_15px_rgba(125,211,211,0.2)]"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className={`text-2xl font-semibold ${
                    activeTab === item.tab ? "text-[#c8ffff]" : "text-white"
                  }`}>
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-white/50">{item.label}</p>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 flex items-center justify-between mb-4">
              <span>Pengajuan Pending:</span>
              <span className="font-bold text-[#c8ffff]">{stats.pendingVerifications || 0}</span>
            </div>

            <CTAButton
              href="/admin/verifications"
              className="w-full"
            >
              Buka Verifikasi
            </CTAButton>
          </GlassCard>

          {/* Quick Actions Stacked (seperti Alumni Dashboard) */}
          <div className="space-y-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group block transition hover:translate-y-[-4px]"
              >
                <GlassCard className="flex flex-col p-6 bg-white/5 hover:bg-white/10 transition-colors h-full">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#7dd3d3] transition-colors">
                    {action.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{action.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                    BUKA
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}
