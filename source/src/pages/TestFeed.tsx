import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Search, Bell, Plus, Heart, MessageCircle, Share2, MapPin, Calendar, Users, Star, ChevronRight, Bookmark, TrendingUp, Pencil, X, Newspaper, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { useTags } from "@/context/TagContext";
import { OPLEVELSER_NAER_DIG, AMBASSADORS } from "@/data/feedData";
import type { SocialActivity, Ambassador } from "@/data/feedData";
import { useJoin } from "@/context/JoinContext";
import { getUserTags, setUserTags, buildTagFeed, scoreEvent, searchAllTags, getTagNode, type TagSection } from "@/lib/tagEngine";
import { TAG_TREE, type TagNode } from "@/lib/tagTree";
import { fetchNews, buildNewsSections, formatNewsTime, type NewsItem, type NewsSection } from "@/lib/newsEngine";

/* --- Inline Tag Editor Modal --- */
function TagEditorModal({ open, onClose, activeTags, onSave }: {
  open: boolean;
  onClose: () => void;
  activeTags: string[];
  onSave: (tags: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(activeTags));
  const [search, setSearch] = useState("");

  const toggle = (tag: string) => {
    const next = new Set(selected);
    next.has(tag) ? next.delete(tag) : next.add(tag);
    setSelected(next);
  };

  const results = search ? searchAllTags(search) : [];

  useEffect(() => {
    setSelected(new Set(activeTags));
  }, [activeTags]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#0a0e23]/95 border border-white/10 rounded-t-2xl p-5 pb-8 max-h-[70vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        
        <h2 className="text-lg font-bold text-white">Dit Feed</h2>
        
        <div className="relative mt-3 mb-4">
          <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
          <input 
            type="search" 
            placeholder="Søg interesser..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
          />
        </div>

        {search && results.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[10px] uppercase tracking-wider text-white/40 mb-2 px-1">Søgeresultater</h3>
            <div className="flex flex-wrap gap-2">
              {results.map(t => (
                <button key={t.tag} onClick={() => toggle(t.tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(t.tag) ? "bg-[#4ECDC4] text-white shadow-lg" : "bg-white/8 text-white/70 hover:bg-white/15"}`}>
                  {t.emoji} #{t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!search && TAG_TREE.map(cat => (
          <div key={cat.tag} className="mb-4 last:mb-0">
            <h3 className="text-[10px] uppercase tracking-wider text-white/40 mb-2 px-1">{cat.emoji} {cat.label}</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => toggle(cat.tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(cat.tag) ? "bg-[#4ECDC4] text-white shadow-lg" : "bg-white/8 text-white/70 hover:bg-white/15"}`}>
                #{cat.label}
              </button>
              {cat.children?.slice(0,6).map(ch => (
                <button key={ch.tag} onClick={() => toggle(ch.tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(ch.tag) ? "bg-[#4ECDC4] text-white shadow-lg" : "bg-white/8 text-white/70 hover:bg-white/15"}`}>
                  #{ch.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button 
          onClick={() => {
            const tags = [...selected];
            onSave(tags);
            onClose();
          }}
          className="w-full mt-4 py-2.5 rounded-xl font-semibold text-sm bg-[#4ECDC4] text-white shadow-lg hover:bg-[#3dbdb5] transition-all">
          Gem feed-tags ({selected.size} valgt)
        </button>
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 animate-pulse">
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-white/10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
              <div className="flex gap-2 pt-1">
                <div className="h-4 bg-white/5 rounded w-12" />
                <div className="h-4 bg-white/5 rounded w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TestFeed() {
  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  const { joinEvent, leaveEvent, isJoined } = useJoin();
  const [searchQuery, setSearchQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [userTags, setLocalTags] = useState(getUserTags());
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const handler = (e: any) => setLocalTags(e.detail || []);
    window.addEventListener("bsocial-tags-changed", handler);
    return () => window.removeEventListener("bsocial-tags-changed", handler);
  }, []);

  // Fetch news on mount
  useEffect(() => {
    fetchNews().then(items => {
      setAllNews(items);
      setNewsLoading(false);
    }).catch(() => setNewsLoading(false));
  }, []);

  const handleSaveTags = useCallback((tags: string[]) => {
    setUserTags(tags);
    setLocalTags(tags);
  }, []);

  // Superhjerne: build personalized tag sections
  const tagSections = useMemo(() => buildTagFeed(events, userTags), [events, userTags]);
  
  // News sections matched to user tags
  const newsSections = useMemo(() => buildNewsSections(allNews, userTags), [allNews, userTags]);

  // Mixed latest section (news + events)
  const mixedLatest = useMemo(() => {
    const latestNews = allNews.slice(0, 5);
    // In a real app we would combine with events and sort by date
    // For now we just show the news
    return latestNews;
  }, [allNews]);

  const greeting = new Date().getHours() < 12 ? "God morgen" : new Date().getHours() < 18 ? "God eftermiddag" : "God aften";

  return (
    <div className="min-h-screen bg-[#0a0e23] text-white">
      {/* Desktop top bar */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0e23]/80 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-xl font-bold tracking-tight">Feed</h1>
        
        {/* Editable tag pills */}
        <div className="flex items-center gap-2">
          {userTags.length > 0 && (
            <div className="flex items-center gap-1.5 mr-4 overflow-hidden" onClick={() => setEditorOpen(true)}>
              {userTags.slice(0, 4).map(t => {
                const node = getTagNode(t);
                return <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/50 cursor-pointer hover:border-[#4ECDC4]/30">#{node?.label || t}</span>;
              })}
              {userTags.length > 4 && <span className="text-[10px] text-white/30">+{userTags.length - 4}</span>}
            </div>
          )}
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
            <input 
              type="search" 
              placeholder="Søg events, steder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-64 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
            />
          </div>
          <button onClick={() => setEditorOpen(true)} className="p-2 rounded-lg bg-white/8 text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4] transition-all" title="Rediger feed-tags">
            <Pencil size={18} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button className="flex items-center gap-2 px-4 py-2 bg-[#4ECDC4] text-[#0a1929] rounded-xl font-semibold text-sm shadow-lg shadow-[#4ECDC4]/20 hover:bg-[#3dbdb5] transition-all">
            <Plus size={18} />
            Opret Event
          </button>
        </div>
      </div>

      <TagEditorModal open={editorOpen} onClose={() => setEditorOpen(false)} activeTags={userTags} onSave={handleSaveTags} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        
        {/* Left column - Main feed */}
        <div className="space-y-8">
          
          {/* Greeting + edit */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{greeting}</h2>
              <p className="text-white/40 text-sm mt-0.5">Her er hvad der sker i dine netværk</p>
            </div>
            {userTags.length === 0 && (
              <button onClick={() => setEditorOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4ECDC4]/15 text-[#4ECDC4] hover:bg-[#4ECDC4]/25 transition-all">
                + Vælg interesser
              </button>
            )}
          </div>

          {/* Stories / Ambassadors */}
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {AMBASSADORS.slice(0, 8).map((amb: Ambassador) => (
              <div key={amb.id} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#FF6B6B] to-[#4ECDC4]">
                  <img src={amb.avatar} alt={amb.name} className="w-full h-full rounded-full border-2 border-[#0a0e23] object-cover" />
                </div>
                <span className="text-[10px] text-white/60 font-medium">{amb.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Seneste Nyt (Blandet sektion) */}
          {mixedLatest.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#4ECDC4]" />
                  Seneste
                </h3>
              </div>
              <div className="space-y-3">
                {mixedLatest.map(news => (
                  <a key={news.id} href={news.link} target="_blank" rel="noopener noreferrer" 
                    className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group">
                    {news.image && (
                      <img src={news.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#4ECDC4] transition-colors">{news.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-white/40">
                        <span>{news.sourceEmoji} {news.source}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{formatNewsTime(news.pubDate)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {news.matchedTags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 rounded bg-[#4ECDC4]/10 text-[#4ECDC4] text-[9px] font-medium">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* TAG SECTIONS - Superhjerne personalized feed */}
          {tagSections.length > 0 && (
            <div className="space-y-10">
              <div className="flex items-center justify-between px-1 border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#4ECDC4]">Til dig</h3>
                <button onClick={() => setEditorOpen(true)} className="text-xs text-white/40 hover:text-[#4ECDC4] transition-colors flex items-center gap-1">
                  <Pencil size={12} />
                  Rediger
                </button>
              </div>

              {tagSections.map(section => (
                <section key={section.tag} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="font-bold flex items-center gap-2">
                      <span className="text-lg">{section.emoji}</span>
                      {section.label}
                    </h4>
                    <ChevronRight size={16} className="text-white/20" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {section.events.slice(0, 4).map(event => (
                      <div key={event.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 transition-all group cursor-pointer">
                        <div className="h-32 relative">
                          <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold">
                            {formatDanishDate(event.date)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h5 className="font-bold text-sm line-clamp-1 group-hover:text-[#4ECDC4] transition-colors">{event.title}</h5>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {(event.interest_tags || []).slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] text-white/40">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* NEWS SECTIONS - Tag-matched news from RSS */}
          {newsSections.length > 0 && (
            <div className="space-y-8 mt-12 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 px-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#4ECDC4]">Nyheder til dig</h3>
                <span className="px-1.5 py-0.5 rounded bg-[#FF6B6B] text-[8px] font-black text-white animate-pulse"> LIVE </span>
              </div>

              {newsSections.map(section => (
                <section key={section.tag} className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="font-bold flex items-center gap-2 text-white/70">
                      <span>{section.emoji}</span>
                      {section.label}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {section.items.slice(0, 3).map(news => (
                      <a key={news.id} href={news.link} target="_blank" rel="noopener noreferrer" 
                        className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-all group">
                        {news.image && (
                          <img src={news.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 opacity-60 group-hover:opacity-100 transition-all" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-[#4ECDC4] transition-colors">{news.title}</h5>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-white/30">
                            <span>{news.sourceEmoji} {news.source}</span>
                            <span>•</span>
                            <span>{formatNewsTime(news.pubDate)}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* News loading state */}
          {newsLoading && userTags.length > 0 && (
            <div className="space-y-6">
               <div className="flex items-center gap-2 px-1">
                <div className="w-20 h-4 bg-white/5 rounded animate-pulse" />
              </div>
              <NewsSkeleton />
            </div>
          )}

          {/* Social Feed */}
          <div className="space-y-6 mt-8">
            {OPLEVELSER_NAER_DIG.slice(0, 5).map((item: SocialActivity) => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {item.image && (
                  <div className="h-64 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#4ECDC4] flex items-center justify-center text-[#0a1929] font-bold">{item.title[0]}</div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-[10px] text-white/40">{item.category}</p>
                    </div>
                  </div>
                  {item.description && <p className="text-sm text-white/70 leading-relaxed mb-4">{item.description}</p>}
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button className="flex items-center gap-2 text-white/40 hover:text-[#FF6B6B] transition-colors">
                      <Heart size={18} />
                      <span className="text-xs">{item.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-white/40 hover:text-[#4ECDC4] transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-xs">{item.comments || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right column - Sidebar widgets */}
        <div className="hidden lg:block space-y-8">
          
          {/* Kommende Events */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Kommende Events</h3>
              <Link href="/udforsk" className="text-[10px] text-[#4ECDC4] hover:underline">Se alle</Link>
            </div>
            <div className="space-y-4">
              {events.slice(0, 4).map(event => (
                <div key={event.id} className="flex gap-3 group cursor-pointer">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all">
                    <img src={getEventImage(event)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold truncate group-hover:text-[#4ECDC4] transition-colors">{event.title}</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">{formatDanishDate(event.date)}</p>
                    <p className="text-[10px] text-white/30 truncate">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Populære Tags - connected to superhjerne */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Populære Tags</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_TREE.slice(0, 12).map(tag => (
                <button 
                  key={tag.tag}
                  onClick={() => {
                    const cur = getUserTags();
                    if (!cur.includes(tag.tag)) handleSaveTags([...cur, tag.tag]);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    userTags.includes(tag.tag) 
                    ? "bg-[#4ECDC4] text-white" 
                    : "bg-white/8 text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4]"
                  }`}>
                  {tag.emoji} #{tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Firma + Henvisning links */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">For virksomheder</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/firma" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 transition-all group">
                <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">#firma - Dashboard</span>
                <ChevronRight size={14} className="text-white/20 group-hover:text-[#4ECDC4] transition-all" />
              </Link>
              <Link href="/henvisning" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 transition-all group">
                <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">#henvisning - Bliv ambassadør</span>
                <ChevronRight size={14} className="text-white/20 group-hover:text-[#4ECDC4] transition-all" />
              </Link>
            </div>
          </div>

          {/* Foreslaaede Profiler */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-4">Foreslåede Profiler</h3>
            <div className="space-y-4">
              {AMBASSADORS.slice(0, 3).map((amb: Ambassador) => (
                <div key={amb.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={amb.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold leading-none">{amb.name}</h4>
                      <p className="text-[10px] text-white/40 mt-1 truncate w-24">{amb.bio}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-white/8 text-[10px] font-bold hover:bg-[#4ECDC4] hover:text-[#0a1929] transition-all">Følg</button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
