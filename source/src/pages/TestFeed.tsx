import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Bell, Plus, Heart, MessageCircle, Share2, MapPin, Calendar, Users, Star, ChevronRight, Bookmark, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { useTags } from "@/context/TagContext";
import { searchTags } from "@/lib/tagTree";
import { OPLEVELSER_NAER_DIG, AMBASSADORS } from "@/data/feedData";
import type { SocialActivity, Ambassador } from "@/data/feedData";
import { useJoin } from "@/context/JoinContext";

export default function TestFeed() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  const { joinedIds, toggleJoin } = useJoin();
  const [searchQuery, setSearchQuery] = useState("");

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 8);
  }, [events]);

  return (
    <div className="min-h-screen nature-bg">
      {/* Desktop top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0e23]/80 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">Feed</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                placeholder="S\u00f8g events, steder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-64 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
              />
            </div>
            <button className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/12 transition-colors">
              <Bell size={18} className="text-white/60" />
            </button>
            <button className="h-9 px-4 rounded-xl bg-[#4ECDC4] text-black text-sm font-medium flex items-center gap-2 hover:bg-[#45b8b0] transition-colors">
              <Plus size={16} />
              Opret Event
            </button>
          </div>
        </div>
      </header>

      {/* Main content - 2 column layout */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main feed */}
          <div className="lg:col-span-2 space-y-5">
            {/* Stories / Ambassadors */}
            <div className="flex gap-3 overflow-x-auto pb-2 scroll-x-hidden">
              {AMBASSADORS.slice(0, 8).map((amb: Ambassador) => (
                <div key={amb.id} className="flex flex-col items-center gap-1.5 min-w-[72px]">
                  <div className="w-14 h-14 rounded-full ring-2 ring-[#4ECDC4]/50 p-0.5">
                    <img src={amb.avatar} alt={amb.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-[10px] text-white/50 truncate w-16 text-center">{amb.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Social Feed */}
            {OPLEVELSER_NAER_DIG.map((item: SocialActivity) => (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
                {item.image && (
                  <div className="relative aspect-[16/9]">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#4ECDC4]">{item.title[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-white/40">{item.category}</p>
                    </div>
                  </div>
                  {item.description && <p className="text-sm text-white/60 mb-3 line-clamp-2">{item.description}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-white/40 hover:text-[#4ECDC4] transition-colors">
                        <Heart size={16} />
                        <span className="text-xs">{item.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors">
                        <MessageCircle size={16} />
                        <span className="text-xs">{item.comments || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors">
                        <Share2 size={16} />
                      </button>
                    </div>
                    <button className="text-white/40 hover:text-[#4ECDC4] transition-colors">
                      <Bookmark size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column - Sidebar widgets */}
          <div className="space-y-5 hidden lg:block">
            {/* Upcoming Events widget */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Kommende Events</h3>
                <Link href="/test/udforsk" className="text-[#4ECDC4] text-xs">Se alle</Link>
              </div>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 4).map((event) => (
                  <Link key={event.id} href={`/test/event/${event.id}`} className="flex gap-3 group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-[#4ECDC4] transition-colors">{event.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{formatDanishDate(event.date)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-white/30" />
                        <span className="text-[10px] text-white/30 truncate">{event.location}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Tags widget */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3">Populære Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["Natur", "Musik", "Kunst", "Mad", "Sport", "Yoga", "Vandring", "Foto"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-white/8 text-xs text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4] cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested People widget */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3">Foreslåede Profiler</h3>
              <div className="space-y-3">
                {AMBASSADORS.slice(0, 3).map((amb: Ambassador) => (
                  <div key={amb.id} className="flex items-center gap-3">
                    <img src={amb.avatar} alt={amb.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{amb.name}</p>
                      <p className="text-xs text-white/40 truncate">{amb.bio}</p>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-[#4ECDC4]/15 text-[#4ECDC4] text-xs font-medium hover:bg-[#4ECDC4]/25 transition-colors">
                      Følg
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
