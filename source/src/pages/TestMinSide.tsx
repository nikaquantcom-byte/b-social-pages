import { useState } from "react";
import { Link } from "wouter";
import { Settings, Edit3, Calendar, MapPin, Heart, Bookmark, Users, Camera, LogOut, ChevronRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { useJoin } from "@/context/JoinContext";

export default function TestMinSide() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  const { joinedIds } = useJoin();
  const [activeTab, setActiveTab] = useState("events");

  const joinedEvents = events.filter((e) => joinedIds.has(e.id));

  const tabs = [
    { id: "events", label: "Mine Events", count: joinedEvents.length },
    { id: "saved", label: "Gemt", count: 12 },
    { id: "tags", label: "Mine Tags", count: 8 },
  ];

  return (
    <div className="min-h-screen nature-bg">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-[#4ECDC4]/30 via-[#0a0e23] to-[#0a0e23]" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end gap-6 -mt-16">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-[#4ECDC4]/20 border-4 border-[#0a0e23] flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-bold text-[#4ECDC4]">N</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-[#4ECDC4] flex items-center justify-center">
                <Camera size={14} className="text-black" />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">Nic Bjergby</h1>
                  <p className="text-sm text-white/40 mt-0.5">{"@nicbjergby \u00b7 K\u00f8benhavn"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-white/8 text-sm text-white/70 hover:bg-white/12 flex items-center gap-2">
                    <Edit3 size={14} />
                    Rediger profil
                  </button>
                  <button className="p-2 rounded-xl bg-white/8 hover:bg-white/12">
                    <Settings size={18} className="text-white/60" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-6 pb-4 border-b border-white/8">
            <div className="text-center">
              <p className="text-lg font-bold">24</p>
              <p className="text-xs text-white/40">Events</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">156</p>
              <p className="text-xs text-white/40">{"F\u00f8lgere"}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">89</p>
              <p className="text-xs text-white/40">{"F\u00f8lger"}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">4.8</p>
              <p className="text-xs text-white/40 flex items-center gap-0.5"><Star size={10} className="text-[#4ECDC4]" /> Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Bio & Quick links */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-2">Om mig</h3>
              <p className="text-sm text-white/50">{"Naturelsker og eventarrang\u00f8r i K\u00f8benhavn. Elsker vandring, yoga og at m\u00f8de nye mennesker."}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Natur", "Yoga", "Vandring", "Foto", "Musik"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-[#4ECDC4]/10 text-[#4ECDC4] text-[11px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3">Genveje</h3>
              <div className="space-y-1">
                <Link href="/test" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-white/40" />
                    <span className="text-sm text-white/60">Kalender</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                </Link>
                <Link href="/test" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Bookmark size={16} className="text-white/40" />
                    <span className="text-sm text-white/60">Gemte events</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                </Link>
                <Link href="/test" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Heart size={16} className="text-white/40" />
                    <span className="text-sm text-white/60">Favoritter</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                </Link>
                <Link href="/test" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Settings size={16} className="text-white/40" />
                    <span className="text-sm text-white/60">Indstillinger</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Tabs content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#4ECDC4]/15 text-[#4ECDC4]"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Events grid */}
            {activeTab === "events" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(joinedEvents.length > 0 ? joinedEvents : events.slice(0, 6)).map((event) => (
                  <Link key={event.id} href={`/test/event/${event.id}`} className="glass-card rounded-xl overflow-hidden group">
                    <div className="relative aspect-[16/9]">
                      <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <p className="text-sm font-semibold group-hover:text-[#4ECDC4] transition-colors">{event.title}</p>
                        <p className="text-[11px] text-white/50 mt-0.5">{formatDanishDate(event.date)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="text-center py-12">
                <Bookmark size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40">Dine gemte events vises her</p>
              </div>
            )}

            {activeTab === "tags" && (
              <div className="glass-card rounded-2xl p-6">
                <p className="text-sm text-white/50 mb-4">{"Tags du f\u00f8lger:"}</p>
                <div className="flex flex-wrap gap-2">
                  {["Natur", "Yoga", "Musik", "Vandring", "Foto", "Mad", "Kunst", "Sport"].map((tag) => (
                    <span key={tag} className="px-4 py-2 rounded-xl bg-[#4ECDC4]/10 text-[#4ECDC4] text-sm cursor-pointer hover:bg-[#4ECDC4]/20 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
