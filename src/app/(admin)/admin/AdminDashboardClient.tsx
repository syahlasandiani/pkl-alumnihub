"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteArticle, deleteEvent, deleteResource } from "./actions";
import GlassCard from "@/components/ui/GlassCard";
import CTAButton from "@/components/ui/CTAButton";
import { createClient } from "@/lib/supabase/client";
import { Users, Calendar, FileText, Paperclip, CheckCircle, ShieldAlert, PlusCircle } from "lucide-react";

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
    desc: "Umumkan event baru.",
    href: "/admin/create-event",
    icon: Calendar,
  },
  {
    title: "Buat Konten",
    desc: "Tulis artikel/post.",
    href: "/admin/create-post",
    icon: FileText,
  },
  {
    title: "Upload Resource",
    desc: "Bagikan dokumen.",
    href: "/admin/upload-resource",
    icon: Paperclip,
  },
  {
    title: "Kelola Verifikasi",
    desc: "Cek pengajuan.",
    href: "/admin/verifications",
    icon: ShieldAlert,
  },
];

export default function AdminDashboardClient({ stats, data }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  // Setup Realtime Subscriptions
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => router.refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => router.refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, () => router.refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => router.refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'verification_requests' }, () => router.refresh())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

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
    { label: "Total Artikel", value: stats.articles, tab: "articles" as TabType, color: "bg-blue-500/30 border-blue-400/40 hover:bg-blue-500/40", icon: FileText },
    { label: "Total Event", value: stats.events, tab: "events" as TabType, color: "bg-emerald-500/30 border-emerald-400/40 hover:bg-emerald-500/40", icon: Calendar },
    { label: "Total Resource", value: stats.resources, tab: "resources" as TabType, color: "bg-amber-500/30 border-amber-400/40 hover:bg-amber-500/40", icon: Paperclip },
    { label: "Akun Verified", value: stats.users, tab: "users" as TabType, color: "bg-purple-500/30 border-purple-400/40 hover:bg-purple-500/40", icon: CheckCircle },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 mt-4">
        
        {/* TOP SECTION: 4 Stats Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                onClick={() => setActiveTab(item.tab)}
                className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-lg shadow-black/10 backdrop-blur-md border ${item.color}`}
              >
                <div className="relative z-10 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-white font-medium text-sm drop-shadow-md">{item.label}</p>
                    <div className="p-2 bg-white/20 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-white drop-shadow-md tracking-tight">{item.value}</h3>
                </div>
                {/* Decorative background shape */}
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none mix-blend-overlay"></div>
              </div>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="group">
                <GlassCard className="p-4 flex items-center gap-4 hover:bg-white/10 transition-colors border-white/10 h-full">
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#7dd3d3]/20 group-hover:text-[#7dd3d3] text-white/60 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white group-hover:text-[#7dd3d3] transition-colors">{action.title}</h4>
                    <p className="text-xs text-white/50 line-clamp-1">{action.desc}</p>
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>

        {/* MIDDLE SECTION: Activity Tables */}
        <GlassCard className="p-6 md:p-8 overflow-hidden flex flex-col flex-1 min-h-[500px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="typo-card-title text-white capitalize">
                Aktivitas Terbaru
              </h2>
              <p className="mt-1 text-sm text-white/60 typo-body">
                Kelola data entitas dan pantau aktivitas secara real-time.
              </p>
            </div>
            
            {/* Tabs for Table */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto custom-scrollbar">
              {['users', 'events', 'articles', 'resources'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab 
                      ? "bg-[#7dd3d3] text-slate-900 shadow-sm" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto pr-2 custom-scrollbar flex-1">
            <table className="w-full text-left text-sm text-white min-w-[800px]">
              <thead className="bg-white/5 text-white/70">
                <tr>
                  {activeTab === "users" && (
                    <>
                      <th className="px-4 py-3 rounded-tl-xl font-medium">Nama</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 rounded-tr-xl font-medium">Status</th>
                    </>
                  )}
                  {activeTab === "events" && (
                    <>
                      <th className="px-4 py-3 rounded-tl-xl font-medium">Nama Event</th>
                      <th className="px-4 py-3 font-medium">Pembuat</th>
                      <th className="px-4 py-3 font-medium">Tipe</th>
                      <th className="px-4 py-3 font-medium">Tanggal Dibuat</th>
                      <th className="px-4 py-3 rounded-tr-xl font-medium">Aksi</th>
                    </>
                  )}
                  {activeTab === "articles" && (
                    <>
                      <th className="px-4 py-3 rounded-tl-xl font-medium">Judul Konten</th>
                      <th className="px-4 py-3 font-medium">Pembuat</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Tanggal Dibuat</th>
                      <th className="px-4 py-3 rounded-tr-xl font-medium">Aksi</th>
                    </>
                  )}
                  {activeTab === "resources" && (
                    <>
                      <th className="px-4 py-3 rounded-tl-xl font-medium">Judul Resource</th>
                      <th className="px-4 py-3 font-medium">Pembuat</th>
                      <th className="px-4 py-3 font-medium">Tanggal Dibuat</th>
                      <th className="px-4 py-3 font-medium">Dokumen</th>
                      <th className="px-4 py-3 rounded-tr-xl font-medium">Aksi</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data[activeTab].length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-white/40">
                      Tidak ada data {activeTab}.
                    </td>
                  </tr>
                ) : (
                  data[activeTab].map((row: any) => (
                    <tr key={row.id} className="transition-colors hover:bg-white/5">
                      {activeTab === "users" && (
                        <>
                          <td className="px-4 py-4 font-medium">{row.display_name}</td>
                          <td className="px-4 py-4 text-white/60">{row.email || "-"}</td>
                          <td className="px-4 py-4">
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
                          <td className="px-4 py-4 font-medium max-w-[200px] truncate" title={row.title}>
                            {row.title}
                          </td>
                          <td className="px-4 py-4 text-white/60">{row.creator_name}</td>
                          <td className="px-4 py-4">
                            <span className="capitalize">{row.type}</span>
                          </td>
                          <td className="px-4 py-4 text-white/60">
                            {new Date(row.created_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleDelete(row.id, "events")}
                              disabled={isDeleting === row.id}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg"
                            >
                              {isDeleting === row.id ? "Menghapus..." : "Hapus"}
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === "articles" && (
                        <>
                          <td className="px-4 py-4 font-medium max-w-[200px] truncate" title={row.title}>
                            {row.title}
                          </td>
                          <td className="px-4 py-4 text-white/60">{row.creator_name}</td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-semibold px-2 py-1 bg-white/10 rounded-md">
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-white/60">
                            {new Date(row.created_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleDelete(row.id, "articles")}
                              disabled={isDeleting === row.id}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg"
                            >
                              {isDeleting === row.id ? "Menghapus..." : "Hapus"}
                            </button>
                          </td>
                        </>
                      )}
                      {activeTab === "resources" && (
                        <>
                          <td className="px-4 py-4 font-medium max-w-[200px] truncate" title={row.title}>
                            {row.title}
                          </td>
                          <td className="px-4 py-4 text-white/60">{row.creator_name}</td>
                          <td className="px-4 py-4 text-white/60">
                            {new Date(row.created_at).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-4">
                            {row.file_url ? (
                              <a
                                href={row.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#7dd3d3] hover:text-white transition-colors flex items-center gap-1"
                              >
                                <Paperclip className="w-3 h-3" /> Unduh
                              </a>
                            ) : (
                              <span className="text-xs text-white/40">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleDelete(row.id, "resources")}
                              disabled={isDeleting === row.id}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg"
                            >
                              {isDeleting === row.id ? "Menghapus..." : "Hapus"}
                            </button>
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
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
