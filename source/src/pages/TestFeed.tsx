import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { Search, PenSquare, ChevronRight, Bell, Loader2, ExternalLink, SlidersHorizontal } from "lucide-react";
import { fetchNews, formatNewsTime, type NewsItem } from "@/lib/newsEngine";
import { buildTagFeed, scoreEvent, getTrendingTags, getTagNode, type TagSection } from "@/lib/tagEngine";
import { useAuth } from "@/context/AuthContext";
import { useTags } from "@/context/TagContext";
import { FeedTagEditor } from "@/components/FeedTagEditor";

const FRIENDS = [
  { name: "Anna", initial: "A" },
  { name: "Mads", initial: "M" },
  { name: "Sofie", initial: "S" },
  { name: "Jonas", initial: "J" },
];

function getPersonalizedGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "God morgen" : hour < 17 ? "God eftermiddag" : "God aften";
  return name ? `${timeGreeting}, ${name}` : `${timeGreeting}, opdagelsesrejsende`;
}

export default function Feed() {
  const { profile } = useAuth();
  const { selectedTags, city } = useTags();
  const [tagEditorOpen, setTagEditorOpen] = useState(false);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  useEffect(() => {
    setNewsLoading(true);
    fetchNews()
      .then(items => { setAllNews(items); setNewsLoading(false); })
      .catch(() => setNewsLoading(false));
  }, []);

  const relevantNews = useMemo(() => {
    return allNews.slice(0, 6);
  }, [allNews]);

  const greeting = getPersonalizedGreeting(profile?.name);

  // Build tag-based feed sections using tagEngine
  const tagSections = useMemo(() => {
    if (events.length === 0 || selectedTags.length === 0) return [];
    const sections = buildTagFeed(events, selectedTags);
    // Sort events within each section by relevance score
    return sections.map(section => ({
      ...section,
      events: [...section.events].sort((a, b) => scoreEvent(b, selectedTags) - scoreEvent(a, selectedTags)),
    }));
  }, [events, selectedTags]);

  // Trending tags from real event data
  const trendingTags = useMemo(() => {
    return getTrendingTags(events, 12);
  }, [events]);

  // Subtitle line
  const subtitle = profile
    ? `${city || profile.city || "Danmark"} · ${selectedTags.length} tags valgt`
    : "Her er hvad der sker i dine netværk";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e23] flex items-center justify-center">
        <p className="text-white/50">Loader events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e23] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{greeting}</h1>
            <p className="text-white/50 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTagEditorOpen(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Rediger tags"
            >
              <SlidersHorizontal size={18} className="text-white/60" />
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" placeholder="Søg events, steder..." className="bg-white/10 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48" />
            </div>
            <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10">
              <Bell size={18} className="text-white/60" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {FRIENDS.map(f => (
            <div key={f.name} className="flex flex-col items-center gap-1 min-w-[56px]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#556270] flex items-center justify-center text-white font-semibold text-lg">
                {f.initial}
              </div>
              <span className="text-[10px] text-white/50">{f.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div>
            {tagSections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/40 mb-3">Ingen events matcher dine tags</p>
                <button
                  onClick={() => setTagEditorOpen(true)}
                  className="text-sm text-[#4ECDC4] hover:underline"
                >
                  Vælg tags for at se personlige forslag
                </button>
              </div>
            ) : (
              tagSections.map(section => (
                <div key={section.tag} className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      {section.emoji}&nbsp;&nbsp;{section.label}
                    </h2>
                    <Link href="/udforsk" className="text-xs text-[#4ECDC4] hover:underline flex items-center gap-1">
                      <span>Se alle</span> <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {section.events.map(event => (
                      <Link key={event.id} href={`/event/${event.id}`} className="glass-card rounded-xl overflow-hidden hover:ring-1 hover:ring-[#4ECDC4]/30 transition-all group min-w-[180px] max-w-[220px] flex-shrink-0">
                        <img src={getEventImage(event)} alt={event.title} className="w-full h-28 object-cover" onError={(e) => { const target = e.target as HTMLImageElement; target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop"; }} />
                        <div className="p-3">
                          <p className="text-[10px] text-white/40 mb-1">{formatDanishDate(event.date)}</p>
                          <h3 className="text-sm font-semibold leading-snug line-clamp-2">{event.title}</h3>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {event.interest_tags && event.interest_tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-[9px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded-full">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="space-y-6">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                Nyheder til dig
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">LIVE</span>
              </h3>
              {newsLoading ? (
                <div className="flex items-center gap-2 text-white/40 text-sm py-4">
                  <Loader2 size={14} className="animate-spin" />
                  Henter nyheder...
                </div>
              ) : relevantNews.length > 0 ? (
                <div className="space-y-3">
                  {relevantNews.map((news, i) => (
                    <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 group hover:bg-white/5 rounded-lg p-1.5 -mx-1.5 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white/30 mb-0.5">
                          {news.sourceEmoji} {news.source} &bull; {formatNewsTime(news.pubDate)}
                        </p>
                        <p className="text-xs font-medium text-white/80 line-clamp-2 group-hover:text-white transition-colors">{news.title}</p>
                      </div>
                      <ExternalLink size={12} className="text-white/20 group-hover:text-white/50 mt-1 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-xs py-4">Ingen aktuelle nyheder.</p>
              )}
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-3">Populære Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(({ tag, count }) => {
                  const node = getTagNode(tag);
                  return (
                    <span key={tag} className="text-xs bg-white/5 text-white/50 px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer transition-colors">
                      {node?.emoji || "🏷️"} #{node?.label || tag}
                      <span className="ml-1 text-white/25">{count}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FeedTagEditor open={tagEditorOpen} onClose={() => setTagEditorOpen(false)} />
    </div>
  );
}
