import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Search, Bell, Plus, Heart, MessageCircle, Share2, MapPin, Calendar, Users, Star, ChevronRight, Bookmark, TrendingUp, Pencil, X, Newspaper, ExternalLink, Activity } from "lucide-react";
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
function TagEditorModal({ open, onClose, activeTags, onSave }: { open: boolean; onClose: () => void; activeTags: string[]; onSave: (tags: string[]) => void; }) {
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
      <div className="relative w-full max-w-lg bg-[#0a0e23]/95 border border-white/10 rounded-t-2xl p-5 pb-8 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Dit Feed</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="search" placeholder="Søg interesser..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50" />
        </div>
        {search && results.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-1">Søgeresultater</h3>
            <div className="flex flex-wrap gap-2">
              {results.map(t => (
                <button key={t.tag} onClick={() => toggle(t.tag)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(t.tag) ? "bg-[#4ECDC4] text-white shadow-lg shadow-[#4ECDC4]/25" : "bg-white/8 text-white/70 hover:bg-white/15"}`}>
                  {t.emoji} #{t.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {!search && TAG_TREE.map(cat => (
          <div key={cat.tag} className="mb-6 last:mb-0">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-1">{cat.emoji} {cat.label}</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => toggle(cat.tag)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(cat.tag) ? "bg-[#4ECDC4] text-white shadow-lg" : "bg-white/8 text-white/70 hover:bg-white/15"}`}>
                #{cat.label}
              </button>
              {cat.children?.slice(0,6).map(ch => (
                <button key={ch.tag} onClick={() => toggle(ch.tag)} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(ch.tag) ? "bg-[#4ECDC4] text-white shadow-lg" : "bg-white/8 text-white/70 hover:bg-white/15"}`}>
                  #{ch.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => { const tags = [...selected]; onSave(tags); onClose(); }} className="w-full mt-4 py-2.5 rounded-xl font-semibold text-sm bg-[#4ECDC4] text-white shadow-lg hover:bg-[#3dbdb5] transition-all">
          Gem feed-tags ({selected.size} valgt)
        </button>
      </div>
    </div>
  );
}

export default function TestFeed() {
  const { data: events = [] } = useQuery({ queryKey: ["/api/events"], queryFn: getEvents, });
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

  const tagSections = useMemo(() => buildTagFeed(events, userTags), [events, userTags]);
  const newsSections = useMemo(() => buildNewsSections(allNews, userTags), [allNews, userTags]);

  const greeting = new Date().getHours() < 12 ? "God morgen" : new Date().getHours() < 18 ? "God eftermiddag" : "God aften";

  return (
    <div className="min-h-screen bg-[#0a0e23] pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-6 lg:px-8 lg:pt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Feed Content */}
        <div className="flex-1 space-y-8">
          
          {/* Top Search Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{greeting}</h1>
              <p className="text-white/50 text-sm">Her er hvad der sker i dine netværk</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="search" 
                  placeholder="Søg events, steder..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50 transition-all"
                />
              </div>
              <button 
                onClick={() => setEditorOpen(true)}
                className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4] transition-all border border-white/10"
                title="Rediger feed-tags"
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>

          {/* Stories / Ambassadors */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {AMBASSADORS.slice(0, 8).map((amb: Ambassador) => (
              <div key={amb.id} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#4ECDC4] to-[#45b7af] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full border-2 border-[#0a0e23] overflow-hidden bg-white/10 flex items-center justify-center text-xl font-bold text-white">
                    {amb.name[0]}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-white/60 group-hover:text-white transition-colors">{amb.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* TAG SECTIONS - Events focus */}
          <div className="space-y-10">
            {tagSections.length > 0 ? (
              tagSections.map(section => (
                <section key={section.tag} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{section.emoji}</span>
                      <h2 className="text-lg font-bold text-white tracking-tight">{section.label}</h2>
                    </div>
                    <Link href="/udforsk" className="text-xs font-bold text-[#4ECDC4] hover:underline flex items-center gap-1">
                      Se alle <ChevronRight size={14} />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.events.slice(0, 4).map(event => (
                      <Link key={event.id} href={`/event/${event.id}`}>
                        <div className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer flex gap-4 p-3">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
                            {event.image ? (
                              <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={event.title} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20"><Activity size={24} /></div>
                            )}
                          </div>
                          <div className="flex-1 py-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#4ECDC4] uppercase tracking-wider mb-1">
                                <Calendar size={10} />
                                {formatDanishDate(event.date)}
                              </div>
                              <h3 className="text-sm font-bold text-white leading-snug group-hover:text-[#4ECDC4] transition-colors line-clamp-2">{event.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {event.interest_tags?.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-white/40 group-hover:bg-[#4ECDC4]/10 group-hover:text-[#4ECDC4] transition-colors">#{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="py-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/40 text-sm mb-4">Ingen interesser valgt endnu</p>
                <button onClick={() => setEditorOpen(true)} className="px-4 py-2 rounded-xl bg-[#4ECDC4] text-[#0a0e23] text-xs font-bold shadow-lg shadow-[#4ECDC4]/20">Vælg interesser</button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Banner Area - News Attraction */}
        <aside className="lg:w-80 space-y-8">
          
          {/* LIVE NEWS BANNER */}
          <div className="glass-card bg-gradient-to-br from-[#4ECDC4]/10 to-transparent p-5 rounded-2xl border border-[#4ECDC4]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Newspaper size={80} className="rotate-12" /></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-[#4ECDC4] animate-pulse" />
                <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Nyheder til dig</h2>
              </div>

              {newsLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl" />
                  ))}
                </div>
              ) : newsSections.length > 0 ? (
                <div className="space-y-5">
                  {newsSections.flatMap(s => s.items).slice(0, 6).map((news, idx) => (
                    <a key={idx} href={news.link} target="_blank" rel="noopener noreferrer" className="block group">
                      <div className="flex gap-3 items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">
                            <span>{news.sourceEmoji} {news.source}</span>
                            <span>•</span>
                            <span>{formatNewsTime(news.pubDate)}</span>
                          </div>
                          <h4 className="text-[11px] font-bold text-white/80 group-hover:text-[#4ECDC4] transition-colors leading-relaxed line-clamp-2">
                            {news.title}
                          </h4>
                        </div>
                        {news.image && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                            <img src={news.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                  <Link href="/udforsk" className="block w-full py-2.5 text-center rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white/60 transition-all border border-white/5">
                    Se alle nyheder
                  </Link>
                </div>
              ) : (
                <p className="text-[10px] text-white/30 text-center py-4 italic">Ingen aktuelle nyheder til din målgruppe.</p>
              )}
            </div>
          </div>

          {/* Quick Stats / Trending Tags */}
          <div className="glass-card p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Populære Tags</h3>
            <div className="flex flex-wrap gap-2">
              {TAG_TREE.slice(0, 10).map(tag => (
                <button 
                  key={tag.tag}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-white/5 text-white/50 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4] transition-all"
                >
                  #{tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* For businesses */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-white/5 to-transparent border border-white/10">
            <h3 className="text-xs font-bold text-white mb-2">B-Social for virksomheder</h3>
            <p className="text-[10px] text-white/40 mb-4 leading-relaxed">Boost dit fællesskab og nå ud til flere aktive brugere.</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/firma" className="px-3 py-2 rounded-lg bg-[#4ECDC4]/10 text-[#4ECDC4] text-[9px] font-bold text-center hover:bg-[#4ECDC4]/20 transition-all">Dashboard</Link>
              <Link href="/henvisning" className="px-3 py-2 rounded-lg bg-white/5 text-white/60 text-[9px] font-bold text-center hover:bg-white/10 transition-all">Ambassadør</Link>
            </div>
          </div>

        </aside>

      </div>

      <TagEditorModal 
        open={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        activeTags={userTags} 
        onSave={handleSaveTags} 
      />
    </div>
  );
}
