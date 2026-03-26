import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Filter, MapPin, Calendar, Users, Star, Grid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { ALL_CATEGORIES } from "@/data/categories";
import { useJoin } from "@/context/JoinContext";

export default function TestUdforsk() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  const { joinedIds, toggleJoin } = useJoin();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["Alle", ...ALL_CATEGORIES.map(c => c.label)];

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeCategory !== "Alle") {
      filtered = filtered.filter(e => e.category === activeCategory);
    }
    return filtered;
  }, [events, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen nature-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0e23]/80 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold">Udforsk</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                placeholder="S\u00f8g events, steder, kategorier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-80 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
              />
            </div>
            <div className="flex bg-white/8 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-white/15" : ""}`}
              >
                <Grid size={16} className="text-white/60" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-white/15" : ""}`}
              >
                <List size={16} className="text-white/60" />
              </button>
            </div>
          </div>
        </div>
        {/* Category tabs */}
        <div className="max-w-6xl mx-auto px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto scroll-x-hidden">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#4ECDC4] text-black"
                    : "bg-white/8 text-white/50 hover:bg-white/12"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/test/event/${event.id}`} className="glass-card rounded-2xl overflow-hidden group hover:ring-1 hover:ring-[#4ECDC4]/30 transition-all">
                <div className="relative aspect-[4/3]">
                  <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-semibold line-clamp-1">{event.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar size={11} className="text-white/50" />
                      <span className="text-[11px] text-white/50">{formatDanishDate(event.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#4ECDC4]" />
                      <span className="text-xs text-white/50 truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-white/40" />
                      <span className="text-xs text-white/40">{event.attendees || 0}</span>
                    </div>
                  </div>
                  {event.category && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/8 text-[10px] text-white/40">
                      {event.category}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/test/event/${event.id}`} className="glass-card rounded-xl p-4 flex gap-4 group hover:ring-1 hover:ring-[#4ECDC4]/30 transition-all">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold group-hover:text-[#4ECDC4] transition-colors">{event.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-white/40" />
                      <span className="text-xs text-white/40">{formatDanishDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-white/40" />
                      <span className="text-xs text-white/40">{event.location}</span>
                    </div>
                  </div>
                  {event.description && <p className="text-xs text-white/40 mt-2 line-clamp-2">{event.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/40">Ingen events fundet</p>
          </div>
        )}
      </div>
    </div>
  );
}
