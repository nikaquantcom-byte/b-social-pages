import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Filter, MapPin, Calendar, Users, Star, Grid, List, Tag, TrendingUp, Compass } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { ALL_CATEGORIES } from "@/data/categories";
import { useJoin } from "@/context/JoinContext";
import { tagEngine } from "@/lib/tagEngine";

export default function TestUdforsk() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { isJoined } = useJoin();

  const trendingTags = useMemo(() => {
    return tagEngine.getTrendingTags(events, 15);
  }, [events]);

  const relatedTags = useMemo(() => {
    if (!selectedTag) return [];
    return tagEngine.getRelatedTags(selectedTag, events, 8);
  }, [selectedTag, events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedTag) {
      filtered = tagEngine.filterByTag(filtered, selectedTag);
    }
    if (selectedCategory) {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          (e.interest_tags || []).some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [events, searchTerm, selectedCategory, selectedTag]);

  const crossPageLinks = useMemo(() => {
    if (!selectedTag) return [];
    const links: { label: string; href: string; icon: string }[] = [];
    const firmaEvents = events.filter(
      (e) => e.category === "firma" && (e.interest_tags || []).includes(selectedTag)
    );
    if (firmaEvents.length > 0) {
      links.push({ label: `${firmaEvents.length} firmaer med #${selectedTag}`, href: "/firma", icon: "firma" });
    }
    const henvisEvents = events.filter(
      (e) => e.category === "henvisning" && (e.interest_tags || []).includes(selectedTag)
    );
    if (henvisEvents.length > 0) {
      links.push({ label: `${henvisEvents.length} henvisninger med #${selectedTag}`, href: "/kort", icon: "kort" });
    }
    return links;
  }, [selectedTag, events]);

  return (
    <div className="min-h-screen bg-[#0a1929] pb-24">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="text-[#4ECDC4]" size={28} />
          <h1 className="text-2xl font-bold text-white">Udforsk</h1>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="S\u00f8g events, steder, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#4ECDC4]/50"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/60 text-sm">{filteredEvents.length} resultater</p>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "text-white/40"}`}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "text-white/40"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={14} className="text-[#4ECDC4]" />
          <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Trending tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map(({ tag, count }) => (
            <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedTag === tag
                  ? "bg-[#4ECDC4] text-[#0a1929] shadow-lg shadow-[#4ECDC4]/25"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}>
              #{tag} <span className="opacity-60">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {selectedTag && (
        <div className="px-4 mb-4">
          {relatedTags.length > 0 && (
            <div className="mb-3">
              <span className="text-white/40 text-xs">Relaterede tags:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {relatedTags.map(({ tag }) => (
                  <button key={tag} onClick={() => setSelectedTag(tag)}
                    className="px-2 py-0.5 rounded text-[10px] bg-[#4ECDC4]/10 text-[#4ECDC4] hover:bg-[#4ECDC4]/20">
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          {crossPageLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {crossPageLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4ECDC4]/10 text-[#4ECDC4] text-xs hover:bg-[#4ECDC4]/20 transition-colors cursor-pointer">
                    {link.icon === "firma" ? <Users size={12} /> : <MapPin size={12} />}
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !selectedCategory ? "bg-[#4ECDC4] text-[#0a1929]" : "bg-white/5 text-white/60"
            }`}>Alle</button>
          {ALL_CATEGORIES.map((cat) => (
            <button key={cat.value} onClick={() => setSelectedCategory(selectedCategory === cat.value ? null : cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value ? "bg-[#4ECDC4] text-[#0a1929]" : "bg-white/5 text-white/60"
              }`}>{cat.label}</button>
          ))}
        </div>
      </div>

      <div className={`px-4 ${viewMode === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}`}>
        {filteredEvents.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className={`bg-white/5 rounded-xl overflow-hidden border border-white/5 hover:border-[#4ECDC4]/30 transition-all ${
              viewMode === "list" ? "flex gap-3" : ""
            }`}>
              <div className={`relative ${viewMode === "list" ? "w-24 h-24 flex-shrink-0" : "aspect-[4/3]"}`}>
                <img src={getEventImage(event)} alt={event.title || ""} className="w-full h-full object-cover" />
                {isJoined(event.id) && (
                  <div className="absolute top-1 right-1 bg-[#4ECDC4] rounded-full p-0.5">
                    <Star size={10} className="text-[#0a1929]" />
                  </div>
                )}
              </div>
              <div className="p-3 flex-1">
                <h3 className="text-white text-sm font-semibold line-clamp-2">{event.title}</h3>
                {event.date && (
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                    <Calendar size={10} />{formatDanishDate(event.date)}
                  </p>
                )}
                {event.location && (
                  <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                    <MapPin size={10} /><span className="line-clamp-1">{event.location}</span>
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  {(event.interest_tags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-[#4ECDC4]/10 text-[#4ECDC4]">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/40">Ingen events fundet</p>
          <p className="text-xs text-white/25 mt-1">Pr\u00f8v en anden s\u00f8gning eller kategori</p>
        </div>
      )}
    </div>
  );
}
