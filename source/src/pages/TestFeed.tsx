import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Search, Bell, Plus, Heart, MessageCircle, Share2, MapPin, Calendar, Users, Star, ChevronRight, Bookmark, TrendingUp, Pencil, X } from "lucide-react";
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

/* --- Inline Tag Editor Modal --- */
function TagEditorModal({ open, onClose, activeTags, onSave }: {
  open: boolean; onClose: () => void;
  activeTags: string[]; onSave: (tags: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(activeTags));
  const [search, setSearch] = useState("");
  const toggle = (tag: string) => {
    const next = new Set(selected);
    next.has(tag) ? next.delete(tag) : next.add(tag);
    setSelected(next);
  };
  const results = search ? searchAllTags(search) : [];
  useEffect(() => { setSelected(new Set(activeTags)); }, [activeTags]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#0a0e23]/95 border border-white/10 rounded-t-2xl p-5 pb-8 max-h-[75vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Dit Feed</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={20}/></button>
        </div>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input type="search" placeholder="S\u00f8g interesser..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50" />
        </div>
        {search && results.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-white/40 mb-2">S\u00f8geresultater</p>
            <div className="flex flex-wrap gap-1.5">
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
          <div key={cat.tag} className="mb-3">
            <p className="text-xs text-white/40 mb-1.5">{cat.emoji} {cat.label}</p>
            <div className="flex flex-wrap gap-1.5">
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
        <button onClick={() => { const tags = [...selected]; onSave(tags); onClose(); }}
          className="w-full mt-4 py-2.5 rounded-xl font-semibold text-sm bg-[#4ECDC4] text-white shadow-lg hover:bg-[#3dbdb5] transition-all">
          Gem feed-tags ({selected.size} valgt)
        </button>
      </div>
    </div>
  );
}

export default function TestFeed() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  const { joinedIds, toggleJoin } = useJoin();
  const [searchQuery, setSearchQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [userTags, setLocalTags] = useState<string[]>(getUserTags());

  useEffect(() => {
    const handler = (e: any) => setLocalTags(e.detail || []);
    window.addEventListener("bsocial-tags-changed", handler);
    return () => window.removeEventListener("bsocial-tags-changed", handler);
  }, []);

  const handleSaveTags = useCallback((tags: string[]) => {
    setUserTags(tags);
    setLocalTags(tags);
  }, []);

  // Superhjerne: build personalized tag sections
  const tagSections = useMemo(() => buildTagFeed(events, userTags), [events, userTags]);

  // Scored "Til dig" events
  const personalEvents = useMemo(() => {
    if (userTags.length === 0) return events.slice(0, 8);
    return [...events].sort((a, b) => scoreEvent(b, userTags) - scoreEvent(a, userTags)).slice(0, 8);
  }, [events, userTags]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 8);
  }, [events]);

  // Search filter
  const filteredSocial = useMemo(() => {
    if (!searchQuery) return OPLEVELSER_NAER_DIG;
    const q = searchQuery.toLowerCase();
    return OPLEVELSER_NAER_DIG.filter(i =>
      i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) ||
      (i.description && i.description.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const greeting = new Date().getHours() < 12 ? "God morgen" : new Date().getHours() < 18 ? "God eftermiddag" : "God aften";

  return (
    <div className="min-h-screen nature-bg">
      {/* Desktop top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0e23]/80 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">Feed</h1>
            {/* Editable tag pills */}
            {userTags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {userTags.slice(0, 4).map(t => {
                  const node = getTagNode(t);
                  return <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-[#4ECDC4]/15 text-[#4ECDC4] font-medium">#{node?.label || t}</span>;
                })}
                {userTags.length > 4 && <span className="text-xs text-white/40">+{userTags.length - 4}</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="search" placeholder="S\u00f8g events, steder..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-64 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50" />
            </div>
            <button onClick={() => setEditorOpen(true)} className="p-2 rounded-lg bg-white/8 text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4] transition-all" title="Rediger feed-tags">
              <Pencil size={16} />
            </button>
            <Link href="/event/new" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4ECDC4] text-white font-semibold text-sm hover:bg-[#3dbdb5] transition-colors">
              <Plus size={16} /> Opret Event
            </Link>
          </div>
        </div>
      </header>

      {/* Tag Editor Modal */}
      <TagEditorModal open={editorOpen} onClose={() => setEditorOpen(false)} activeTags={userTags} onSave={handleSaveTags} />

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Greeting + edit */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{greeting}</h2>
            {userTags.length === 0 && (
              <button onClick={() => setEditorOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4ECDC4]/15 text-[#4ECDC4] hover:bg-[#4ECDC4]/25 transition-all">
                + V\u00e6lg interesser
              </button>
            )}
          </div>

          {/* Stories / Ambassadors */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {AMBASSADORS.slice(0, 8).map((amb: Ambassador) => (
              <div key={amb.name} className="flex flex-col items-center gap-1 min-w-[64px]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44a08d] p-0.5">
                  <img src={amb.avatar} alt={amb.name} className="w-full h-full rounded-full object-cover border-2 border-[#0a0e23]" />
                </div>
                <span className="text-xs text-white/60 truncate w-16 text-center">{amb.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* TAG SECTIONS - Superhjerne personalized feed */}
          {tagSections.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#4ECDC4] flex items-center gap-1.5">
                  <Star size={14} /> Til dig
                </h3>
                <button onClick={() => setEditorOpen(true)} className="text-xs text-white/40 hover:text-[#4ECDC4] transition-colors flex items-center gap-1">
                  <Pencil size={12} /> Rediger
                </button>
              </div>
              {tagSections.map(section => (
                <div key={section.tag} className="space-y-3">
                  <h4 className="text-sm font-medium text-white/80">{section.emoji} {section.label}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {section.events.slice(0, 4).map(event => (
                      <Link key={event.id} href={`/event/${event.id}`}
                        className="group bg-white/5 rounded-xl overflow-hidden border border-white/8 hover:border-[#4ECDC4]/30 transition-all">
                        <div className="h-28 overflow-hidden">
                          <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-white truncate">{event.title}</p>
                          <p className="text-xs text-white/50 mt-0.5">{formatDanishDate(event.date)}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {(event.interest_tags || []).slice(0, 2).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-[#4ECDC4]/10 text-[#4ECDC4]">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Social Feed */}
          {filteredSocial.map((item: SocialActivity) => (
            <div key={item.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/8">
              {item.image && (
                <div className="h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#44a08d] flex items-center justify-center text-white text-xs font-bold">
                    {item.title[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-white/40">{item.category}</p>
                  </div>
                </div>
                {item.description && <p className="text-sm text-white/60 mb-3">{item.description}</p>}
                <div className="flex items-center gap-4 text-white/40 text-xs">
                  <span className="flex items-center gap-1"><Heart size={14} /> {item.likes || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={14} /> {item.comments || 0}</span>
                  <Share2 size={14} className="ml-auto" />
                  <Bookmark size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column - Sidebar widgets */}
        <div className="space-y-5">
          {/* Kommende Events */}
          <div className="bg-white/5 rounded-xl border border-white/8 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Kommende Events</h3>
              <Link href="/udforsk" className="text-xs text-[#4ECDC4]">Se alle</Link>
            </div>
            {upcomingEvents.slice(0, 4).map(event => (
              <Link key={event.id} href={`/event/${event.id}`}
                className="flex gap-3 py-2 border-t border-white/5 first:border-0 hover:bg-white/5 rounded-lg transition-colors px-1">
                <img src={getEventImage(event)} alt={event.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{event.title}</p>
                  <p className="text-xs text-white/40">{formatDanishDate(event.date)}</p>
                  <p className="text-xs text-white/30 flex items-center gap-0.5"><MapPin size={10} /> {event.location}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Popul\u00e6re Tags - connected to superhjerne */}
          <div className="bg-white/5 rounded-xl border border-white/8 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Popul\u00e6re Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {TAG_TREE.slice(0, 12).map(tag => (
                <button key={tag.tag}
                  onClick={() => { const cur = getUserTags(); if (!cur.includes(tag.tag)) handleSaveTags([...cur, tag.tag]); }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    userTags.includes(tag.tag) ? "bg-[#4ECDC4] text-white" : "bg-white/8 text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4]"
                  }`}>
                  {tag.emoji} #{tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Firma + Henvisning links */}
          <div className="bg-white/5 rounded-xl border border-white/8 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-white mb-2">For virksomheder</h3>
            <Link href="/firma" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-[#4ECDC4]/10 text-white/70 hover:text-[#4ECDC4] text-sm transition-all">
              <TrendingUp size={14} /> #firma - Dashboard
            </Link>
            <Link href="/henvisning" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-[#4ECDC4]/10 text-white/70 hover:text-[#4ECDC4] text-sm transition-all">
              <Users size={14} /> #henvisning - Bliv ambassad\u00f8r
            </Link>
          </div>

          {/* Foreslaaede Profiler */}
          <div className="bg-white/5 rounded-xl border border-white/8 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Foresl\u00e5ede Profiler</h3>
            {AMBASSADORS.slice(0, 3).map((amb: Ambassador) => (
              <div key={amb.name} className="flex items-center gap-3 py-2">
                <img src={amb.avatar} alt={amb.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{amb.name}</p>
                  <p className="text-xs text-white/40 truncate">{amb.bio}</p>
                </div>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-[#4ECDC4]/15 text-[#4ECDC4] hover:bg-[#4ECDC4]/25">F\u00f8lg</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
