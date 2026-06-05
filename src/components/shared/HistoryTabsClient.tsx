"use client";

import { useState, useEffect } from "react";
import { FileText, Calendar, Paperclip, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import GlassConfirmDialog from "@/components/ui/GlassConfirmDialog";
import { deleteArticleAction, deleteEventAction, deleteResourceAction } from "@/app/(alumni)/alumni/actions";
import { useRouter } from "next/navigation";

type TabType = "events" | "articles" | "resources";

interface HistoryTabsClientProps {
  articles: any[];
  events: any[];
  resources: any[];
}

export default function HistoryTabsClient({ articles, events, resources }: HistoryTabsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("events");
  const router = useRouter();

  const [localArticles, setLocalArticles] = useState(articles);
  const [localEvents, setLocalEvents] = useState(events);
  const [localResources, setLocalResources] = useState(resources);

  useEffect(() => {
    setLocalArticles(articles);
  }, [articles]);

  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  useEffect(() => {
    setLocalResources(resources);
  }, [resources]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: TabType; title: string } | null>(null);

  const tabs = [
    { id: "events", label: "Event", icon: Calendar, count: localEvents.length },
    { id: "articles", label: "Konten", icon: FileText, count: localArticles.length },
    { id: "resources", label: "Resource", icon: Paperclip, count: localResources.length },
  ];

  const handleDeleteClick = (type: TabType, id: string, title: string) => {
    setDeleteItem({ id, type, title });
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      if (deleteItem.type === "articles") {
        await deleteArticleAction(deleteItem.id);
        setLocalArticles(prev => prev.filter(item => item.id !== deleteItem.id));
      } else if (deleteItem.type === "events") {
        await deleteEventAction(deleteItem.id);
        setLocalEvents(prev => prev.filter(item => item.id !== deleteItem.id));
      } else if (deleteItem.type === "resources") {
        await deleteResourceAction(deleteItem.id);
        setLocalResources(prev => prev.filter(item => item.id !== deleteItem.id));
      }

      router.refresh();
    } catch (err: any) {
      console.error("Error deleting item:", err);
      alert(`Gagal menghapus item: ${err?.message || err}`);
    } finally {
      setDeleteOpen(false);
      setDeleteItem(null);
    }
  };

  return (
    <div>
      <GlassConfirmDialog
        open={deleteOpen}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus postingan "${deleteItem?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />

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
            {localEvents.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">Belum ada Event yang dibuat.</p>
            ) : (
              localEvents.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{event.title}</h4>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(event.created_at).toLocaleDateString("id-ID")} • {event.type === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/alumni/edit-event/${event.id}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#7dd3d3] transition-colors"
                      title="Edit Event"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick("events", event.id, event.title)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors"
                      title="Hapus Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold px-2 py-1 bg-[#7dd3d3]/20 text-[#7dd3d3] rounded-md">
                      {event.status || "PUBLISHED"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "articles" && (
          <div className="space-y-4">
            {localArticles.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">Belum ada Konten yang dibuat.</p>
            ) : (
              localArticles.map((article) => (
                <div key={article.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{article.title}</h4>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(article.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/alumni/edit-post/${article.id}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#7dd3d3] transition-colors"
                      title="Edit Konten"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick("articles", article.id, article.title)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors"
                      title="Hapus Konten"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold px-2 py-1 bg-[#7dd3d3]/20 text-[#7dd3d3] rounded-md">
                      {article.status || "PUBLISHED"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-4">
            {localResources.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-8">Belum ada Resource yang diupload.</p>
            ) : (
              localResources.map((resource) => (
                <div key={resource.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{resource.title}</h4>
                    <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
                      {new Date(resource.created_at).toLocaleDateString("id-ID")} 
                      <span>•</span>
                      <span className="uppercase">{resource.file_type}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/alumni/edit-resource/${resource.id}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#7dd3d3] transition-colors"
                      title="Edit Resource"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick("resources", resource.id, resource.title)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors"
                      title="Hapus Resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {resource.file_url ? (
                      <a href={resource.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#7dd3d3] hover:text-white transition">
                        Buka <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-1 bg-white/10 text-white/60 rounded-md">
                        File Hilang
                      </span>
                    )}
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

