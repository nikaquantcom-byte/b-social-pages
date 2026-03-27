import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Search, Filter, MapPin, Calendar, Users, Star, Grid, List, Tag, TrendingUp, Compass, Newspaper, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { ALL_CATEGORIES } from "@/data/categories";
import { useJoin } from "@/context/JoinContext";
import { tagEngine } from "@/lib/tagEngine";
import { fetchNews, formatNewsTime, type NewsItem } from "@/lib/newsEngine";

export default function TestUdforsk() {
  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const { isJoined } = useJoin();

  // Fetch news on mount
  useEffect(() => {
    setNewsLoading(true);
    fetchNews()
      .then(items => {
        setAllNews(items);
        setNewsLoading(false);
      })
      .catch(() => setNewsLoading(false));
  }, []);

  const trendingTags = useMemo(() => {
    return tagEngine.getTrendingTags(events, 15);
  }, [events]);

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

  // News matched to selected tag
  const matchedNews = useMemo(() => {
    if (!selectedTag) return [];
    const q = selectedTag.toLowerCase();
    return allNews.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.description?.toLowerCase().includes(q) ||
      (n.matchedTags && n.matchedTags.some(t => t.toLowerCase().includes(q)))
    ).slice(0, 5);
  }, [allNews, selectedTag]);

  return (
    <div className="min-h-screen bg-[#0a1929] pb-24">
      {/* Desktop Header */}
      <div className="px-4 pt-6 pb-4 bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="text-[#4ECDC4]" size={28} />
            <h1 className="text-2xl font-bold text-white">Udforsk</h1>
          </div>
          
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Søg events, steder, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#4ECDC4]/50"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-all ${viewMode === "grid" ? "bg-[#4ECDC4] text-[#0a1929]" : "text-white/40 hover:text-white"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-all ${viewMode === "list" ? "bg-[#4ECDC4] text-[#0a1929]" : "text-white/40 hover:text-white"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !selectedCategory ? "bg-[#4ECDC4] text-[#0a1929]" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Alle
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.value ? "bg-[#4ECDC4] text-[#0a1929]" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Events Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <div className={`glass-card rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform ${viewMode === "list" ? "flex" : ""}`}>
                  <div className={`relative ${viewMode === "list" ? "w-32 h-32" : "aspect-video"}`}>
                    <img
                      src={getEventImage(event)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {isJoined(event.id) && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-[#4ECDC4] text-[#0a1929] text-[10px] font-bold rounded-lg shadow-lg">
                        DELTAGER
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDanishDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
              <Compass className="mx-auto text-white/20 mb-4" size={48} />
              <p className="text-white/60">Ingen events fundet</p>
            </div>
          )}

          {/* NEWS SECTION AT THE BOTTOM */}
          {selectedTag && (
            <div className="mt-12 border-t border-white/10 pt-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#4ECDC4]/10">
                    <Newspaper className="text-[#4ECDC4]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nyheder om #{selectedTag}</h2>
                    <p className="text-xs text-white/40">Hold dig opdateret på dine interesser</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[#4ECDC4] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#4ECDC4] tracking-wider uppercase">LIVE</span>
                </div>
              </div>

              {newsLoading ? (
                <div className="flex items-center gap-2 text-white/40 text-sm animate-pulse py-12 justify-center">
                  <Loader2 className="animate-spin" size={20} />
                  Henter de seneste nyheder...
                </div>
              ) : matchedNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedNews.map((news) => (
                    <a
                      key={news.link}
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card p-4 rounded-xl flex gap-4 hover:bg-white/10 transition-all border border-white/5"
                    >
                      {news.image && (
                        <img src={news.image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white/90 line-clamp-2 mb-1 leading-snug">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                          <span className="flex items-center gap-1">
                            {news.sourceEmoji} {news.source}
                          </span>
                          <span>•</span>
                          <span>{formatNewsTime(news.pubDate)}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 rounded-2xl p-8 text-center border border-dashed border-white/10">
                  <p className="text-white/40 text-sm">Ingen aktuelle nyheder om #{selectedTag} lige nu.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-[#4ECDC4]" size={20} />
              <h2 className="text-lg font-bold text-white">Populære Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTag === tag ? "bg-[#4ECDC4] text-[#0a1929] shadow-lg shadow-[#4ECDC4]/25" : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  #{tag} <span className="text-[10px] opacity-40 ml-1">({count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
