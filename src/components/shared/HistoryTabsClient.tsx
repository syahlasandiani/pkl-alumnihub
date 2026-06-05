"use client";

import { useState } from "react";
import { FileText, Calendar, Paperclip, ExternalLink } from "lucide-react";

type TabType = "events" | "articles" | "resources";

interface HistoryTabsClientProps {
  articles: any[];
  events: any[];
  resources: any[];
}

export default function HistoryTabsClient({ articles, events, resources }: HistoryTabsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("events");

  const tabs = [
    { id: "events", label: "Event", icon: Calendar, count: events.length },
    { id: "articles", label: "Konten", icon: FileText, count: articles.length },
    { id: "resources", label: "Resource", icon: Paperclip, count: resources.length },
  ];

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
                <div key={event.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{event.title}</h4>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(event.created_at).toLocaleDateString("id-ID")} • {event.type === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-[#7dd3d3]/20 text-[#7dd3d3] rounded-md">
                    {event.status || "PUBLISHED"}
                  </span>
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
                <div key={article.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{article.title}</h4>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(article.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-[#7dd3d3]/20 text-[#7dd3d3] rounded-md">
                    {article.status || "PUBLISHED"}
                  </span>
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
                <div key={resource.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{resource.title}</h4>
                    <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
                      {new Date(resource.created_at).toLocaleDateString("id-ID")} 
                      <span>•</span>
                      <span className="uppercase">{resource.file_type}</span>
                    </p>
                  </div>
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
