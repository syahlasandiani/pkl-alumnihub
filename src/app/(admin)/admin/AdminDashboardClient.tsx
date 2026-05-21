"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteArticle, deleteEvent, deleteResource } from "./actions";

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
    desc: "Buat dan umumkan event komunitas baru.",
    href: "/alumni/create-event",
  },
  {
    title: "Buat Konten",
    desc: "Tulis artikel atau post komunitas.",
    href: "/alumni/create-post",
  },
  {
    title: "Upload Resource",
    desc: "Bagikan dokumen atau resource.",
    href: "/alumni/upload-resource",
  },
  {
    title: "Kelola Verifikasi",
    desc: "Lihat dan proses pengajuan alumni.",
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
      // Let Server Action revalidate path which refreshes data
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
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl transition hover:bg-white/15"
          >
            <p className="text-base font-semibold text-white">{action.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              {action.desc}
            </p>
            <p className="mt-5 text-sm font-semibold text-[#c8ffff]">Buka →</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Left Column: Summary Cards */}
        <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl xl:col-span-1 h-fit">
          <h2 className="text-xl font-semibold text-white">Ringkasan Sistem</h2>
          <p className="mt-1 text-sm text-white/70">
            Pilih kategori untuk melihat aktivitas.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {statCards.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-start rounded-2xl border px-4 py-4 transition text-left ${
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
                <p className="mt-1 text-sm text-white/60">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Table */}
        <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl xl:col-span-2 overflow-hidden flex flex-col h-fit max-h-[600px]">
          <h2 className="text-xl font-semibold text-white capitalize">
            Aktivitas Terbaru - {activeTab}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Daftar data terbaru untuk entitas {activeTab}.
          </p>

          <div className="mt-5 overflow-auto pr-2 custom-scrollbar flex-1">
            <table className="w-full text-left text-sm text-white">
              <thead className="sticky top-0 bg-white/10 text-white/70 backdrop-blur-md">
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
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-white/5"
                    >
                      {activeTab === "users" && (
                        <>
                          <td className="px-4 py-3 font-medium">
                            {row.display_name}
                          </td>
                          <td className="px-4 py-3 text-white/60">
                            {row.email || "-"}
                          </td>
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
                          <td className="px-4 py-3 text-white/60">
                            {row.creator_name}
                          </td>
                          <td className="px-4 py-3">{row.type}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {/* Event edit not explicitly requested, but we can add delete */}
                              <button
                                onClick={() => handleDelete(row.id, "events")}
                                disabled={isDeleting === row.id}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                {isDeleting === row.id ? "Menghapus..." : "Hapus"}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === "articles" && (
                        <>
                          <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={row.title}>
                            {row.title}
                          </td>
                          <td className="px-4 py-3 text-white/60">
                            {row.creator_name}
                          </td>
                          <td className="px-4 py-3">{row.status}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              {/* Route for edit might not exist, but let's provide standard pattern */}
                              {/* <Link href={`/alumni/edit-post/${row.id}`} className="text-xs text-[#7dd3d3] hover:text-white">Edit</Link> */}
                              <button
                                onClick={() => handleDelete(row.id, "articles")}
                                disabled={isDeleting === row.id}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                {isDeleting === row.id ? "Menghapus..." : "Hapus"}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === "resources" && (
                        <>
                          <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={row.title}>
                            {row.title}
                          </td>
                          <td className="px-4 py-3 text-white/60">
                            {row.creator_name}
                          </td>
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
        </div>
      </section>
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
