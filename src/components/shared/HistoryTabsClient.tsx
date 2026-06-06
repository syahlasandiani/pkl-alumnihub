"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, Paperclip, ExternalLink, Edit2, Trash2 } from "lucide-react";
import { deleteArticle, deleteEvent, deleteResource } from "@/app/(admin)/admin/actions";

type TabType = "events" | "articles" | "resources";

interface HistoryTabsClientProps {
  articles: any[];
  events: any[];
  resources: any[];
}

export default function HistoryTabsClient({ articles, events, resources }: HistoryTabsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("events");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const tabs = [
    { id: "events", label: "Event", icon: Calendar, count: events.length },
    { id: "articles", label: "Konten", icon: FileText, count: articles.length },
    { id: "resources", label: "Resource", icon: Paperclip, count: resources.length },
  ];

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

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 mb-6 pb-2 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? "border-[#7dd3d3] text-[#7dd3d3]"
                  : "border-transparent text-white/50 hover:text-white/80 hover:border-white/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {activeTab === "events" && (
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">Belum ada Event yang dibuat.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {event.title}
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#7dd3d3]/20 text-[#7dd3d3] rounded-md uppercase">
                        {event.status || "PUBLISHED"}
                      </span>
                    </h4>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(event.created_at).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })} • {event.type === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/edit-event/${event.id}`}
                      className="p-2 text-white/60 hover:text-[#7dd3d3] hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id, "events")}
                      disabled={isDeleting === event.id}
                      className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Hapus Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "articles" && (
          <div className="space-y-4">
            {articles.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">Belum ada Konten yang dibuat.</p>
            ) : (
              articles.map((article) => (
                <div key={article.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {article.title}
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#7dd3d3]/20 text-[#7dd3d3] rounded-md uppercase">
                        {article.status || "PUBLISHED"}
                      </span>
                    </h4>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(article.created_at).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/edit-post/${article.id}`}
                      className="p-2 text-white/60 hover:text-[#7dd3d3] hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Konten"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, "articles")}
                      disabled={isDeleting === article.id}
                      className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Hapus Konten"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-4">
            {resources.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">Belum ada Resource yang diupload.</p>
            ) : (
              resources.map((resource) => (
                <div key={resource.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {resource.title}
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 text-white/60 rounded-md uppercase">
                        {resource.file_type || "FILE"}
                      </span>
                    </h4>
                    <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
                      {new Date(resource.created_at).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })} 
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {resource.file_url && (
                      <a 
                        href={resource.file_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 text-[#7dd3d3] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Buka File"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      href={`/admin/edit-resource/${resource.id}`}
                      className="p-2 text-white/60 hover:text-[#7dd3d3] hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit Resource"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(resource.id, "resources")}
                      disabled={isDeleting === resource.id}
                      className="p-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Hapus Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
