import { useState, useMemo, useEffect, useCallback } from \"react\";
import { Link } from \"wouter\";
import { Search, Bell, Plus, Heart, MessageCircle, Share2, MapPin, Calendar, Users, Star, ChevronRight, Bookmark, TrendingUp, Pencil, X, Newspaper, ExternalLink } from \"lucide-react\";
import { useQuery } from \"@tanstack/react-query\";
import type { Event } from \"@/lib/data\";
import { getEvents } from \"@/lib/data\";
import { getEventImage, formatDanishDate } from \"@/lib/eventHelpers\";
import { useTags } from \"@/context/TagContext\";
import { OPLEVELSER_NAER_DIG, AMBASSADORS } from \"@/data/feedData\";
import type { SocialActivity, Ambassador } from \"@/data/feedData\";
import { useJoin } from \"@/context/JoinContext\";
import { getUserTags, setUserTags, buildTagFeed, scoreEvent, searchAllTags, getTagNode, type TagSection } from \"@/lib/tagEngine\";
import { TAG_TREE, type TagNode } from \"@/lib/tagTree\";
import { fetchNews, buildNewsSections, formatNewsTime, type NewsItem, type NewsSection } from \"@/lib/newsEngine\";
import NewsSidebar from \"@/components/NewsSidebar\";

/* --- Inline Tag Editor Modal --- */
function TagEditorModal({ open, onClose, activeTags, onSave }: { open: boolean; onClose: () => void; activeTags: string[]; onSave: (tags: string[]) => void; }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(activeTags));
  const [search, setSearch] = useState(\"\");

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
    <div className=\"fixed inset-0 z-50 flex items-end justify-center\" onClick={onClose}>
      <div className=\"absolute inset-0 bg-black/60 backdrop-blur-sm\" />
      <div className=\"relative w-full max-w-lg bg-[#0a0e23]/95 border border-white/10 rounded-t-2xl p-5 pb-8 max-h-[70vh] overflow-y-auto\" onClick={e => e.stopPropagation()}>
        <div className=\"flex items-center justify-between mb-6\">
          <h2 className=\"text-lg font-bold text-white\">Dit Feed</h2>
          <button onClick={onClose} className=\"p-2 text-white/40 hover:text-white transition-colors\"><X size={20} /></button>
        </div>

        <div className=\"relative mb-6\">
          <Search size={14} className=\"absolute left-3 top-1/2 -translate-y-1/2 text-white/30\" />
          <input 
            type=\"search\" 
            placeholder=\"Søg interesser...\" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className=\"w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50\"
          />
        </div>

        {search && results.length > 0 && (
          <div className=\"mb-6\">
            <h3 className=\"text-[10px] uppercase tracking-wider text-white/30 mb-3\">Søgeresultater</h3>
            <div className=\"flex flex-wrap gap-2\">
              {results.map(t => (
                <button 
                  key={t.tag}
                  onClick={() => toggle(t.tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(t.tag) ? \"bg-[#4ECDC4] text-white shadow-lg\" : \"bg-white/8 text-white/70 hover:bg-white/15\"}`}
                >
                  {t.emoji} #{t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!search && TAG_TREE.map(cat => (
          <div key={cat.tag} className=\"mb-6\">
            <h3 className=\"text-[10px] uppercase tracking-wider text-white/30 mb-3\">{cat.emoji} {cat.label}</h3>
            <div className=\"flex flex-wrap gap-2\">
              <button 
                onClick={() => toggle(cat.tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(cat.tag) ? \"bg-[#4ECDC4] text-white shadow-lg\" : \"bg-white/8 text-white/70 hover:bg-white/15\"}`}
              >
                #{cat.label}
              </button>
              {cat.children?.slice(0, 6).map(ch => (
                <button 
                  key={ch.tag}
                  onClick={() => toggle(ch.tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selected.has(ch.tag) ? \"bg-[#4ECDC4] text-white shadow-lg\" : \"bg-white/8 text-white/70 hover:bg-white/15\"}`}
                >
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
          className=\"w-full mt-4 py-2.5 rounded-xl font-semibold text-sm bg-[#4ECDC4] text-white shadow-lg hover:bg-[#3dbdb5] transition-all\"
        >
          Gem feed-tags ({selected.size} valgt)
        </button>
      </div>
    </div>
  );
}

export default function TestFeed() {
  const { data: events = [] } = useQuery({
    queryKey: [\"/api/events\"],
    queryFn: getEvents,
  });

  const { joinEvent, leaveEvent, isJoined } = useJoin();
  const [searchQuery, setSearchQuery] = useState(\"\");
  const [editorOpen, setEditorOpen] = useState(false);
  const [userTags, setLocalTags] = useState(getUserTags());

  useEffect(() => {
    const handler = (e: any) => setLocalTags(e.detail || []);
    window.addEventListener(\"bsocial-tags-changed\", handler);
    return () => window.removeEventListener(\"bsocial-tags-changed\", handler);
  }, []);

  const handleSaveTags = useCallback((tags: string[]) => {
    setUserTags(tags);
    setLocalTags(tags);
  }, []);

  const tagSections = useMemo(() => buildTagFeed(events, userTags), [events, userTags]);

  const greeting = new Date().getHours() < 12 ? \"God morgen\" : new Date().getHours() < 18 ? \"God eftermiddag\" : \"God aften\";

  return (
    <div className=\"min-h-screen bg-[#0a0f1a] text-white font-sans flex flex-col\">
      {/* Desktop top bar */}
      <div className=\"h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0f1a]/80 backdrop-blur-md sticky top-0 z-30\">
        <div className=\"flex items-center gap-8\">
          <h1 className=\"text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent\">Feed</h1>
          
          {/* Editable tag pills */}
          {userTags.length > 0 && (
            <div className=\"flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/5\">
              <button 
                onClick={() => setEditorOpen(true)}
                className=\"flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#4ECDC4]/10 text-[#4ECDC4] hover:bg-[#4ECDC4]/20 transition-all\"
              >
                {userTags.slice(0, 3).map(t => {
                  const node = getTagNode(t);
                  return <span key={t}>#{node?.label || t}</span>;
                })}
                {userTags.length > 3 && <span>+{userTags.length - 3}</span>}
                <Pencil size={10} />
              </button>
            </div>
          )}
        </div>

        <div className=\"flex items-center gap-4\">
          <div className=\"relative\">
            <Search size={14} className=\"absolute left-3 top-1/2 -translate-y-1/2 text-white/40\" />
            <input 
              type=\"search\" 
              placeholder=\"Søg events, steder...\" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className=\"bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-64 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50\"
            />
          </div>
          <button className=\"p-2 rounded-lg bg-white/8 text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4] transition-all relative\">
            <Bell size={18} />
            <span className=\"absolute top-2 right-2 w-2 h-2 bg-[#4ECDC4] rounded-full border-2 border-[#0a0f1a]\" />
          </button>
          <button className=\"bg-[#4ECDC4] hover:bg-[#3dbdb5] text-[#0a0f1a] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2\">
            <Plus size={18} />
            Opret Event
          </button>
        </div>
      </div>

      <div className=\"flex-1 flex overflow-hidden\">
        <TagEditorModal open={editorOpen} onClose={() => setEditorOpen(false)} activeTags={userTags} onSave={handleSaveTags} />

        {/* Left column - Main feed */}
        <div className=\"flex-1 max-w-2xl px-6 py-8 border-r border-white/10 overflow-y-auto custom-scrollbar\">
          {/* Greeting */}
          <div className=\"mb-8\">
            <h2 className=\"text-3xl font-bold mb-1\">{greeting}</h2>
            <p className=\"text-white/40\">Her er hvad der sker i dine netværk</p>
          </div>

          {/* Stories / Ambassadors */}
          <div className=\"flex gap-4 overflow-x-auto pb-6 mb-8 no-scrollbar\">
            {AMBASSADORS.slice(0, 8).map((amb: Ambassador) => (
              <button key={amb.id} className=\"flex-shrink-0 flex flex-col items-center gap-2 group\">
                <div className=\"w-16 h-16 rounded-full p-1 border-2 border-[#4ECDC4] group-hover:scale-105 transition-all\">
                  <img src={amb.image} alt={amb.name} className=\"w-full h-full rounded-full object-cover\" />
                </div>
                <span className=\"text-[10px] text-white/60 group-hover:text-white transition-colors\">{amb.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* TAG SECTIONS - Superhjerne personalized feed */}
          {tagSections.length > 0 && (
            <div className=\"space-y-12\">
              <div className=\"flex items-center justify-between\">
                <h3 className=\"text-lg font-bold\">Til dig</h3>
                <button onClick={() => setEditorOpen(true)} className=\"text-xs text-white/40 hover:text-[#4ECDC4] transition-colors flex items-center gap-1\">
                  <Pencil size={12} /> Rediger
                </button>
              </div>

              {tagSections.map(section => (
                <div key={section.tag} className=\"space-y-4\">
                  <div className=\"flex items-center gap-2\">
                    <span className=\"w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg\">{section.emoji}</span>
                    <h4 className=\"font-bold\">{section.label}</h4>
                  </div>
                  
                  <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                    {section.events.slice(0, 4).map(event => (
                      <Link key={event.id} href={`/event/${event.id}`}>
                        <div className=\"group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 transition-all cursor-pointer\">
                          <div className=\"aspect-video relative\">
                            <img src={getEventImage(event)} alt={event.title} className=\"w-full h-full object-cover\" />
                            <div className=\"absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold\">
                              {formatDanishDate(event.date)}
                            </div>
                          </div>
                          <div className=\"p-4\">
                            <h5 className=\"font-bold text-sm mb-2 group-hover:text-[#4ECDC4] transition-colors\">{event.title}</h5>
                            <div className=\"flex flex-wrap gap-1.5\">
                              {(event.interest_tags || []).slice(0, 2).map(tag => (
                                <span key={tag} className=\"text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded\">#{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Social Feed Items */}
          <div className=\"mt-12 space-y-8\">
            <h3 className=\"text-lg font-bold\">Socialt Feed</h3>
            {OPLEVELSER_NAER_DIG.slice(0, 5).map((item: SocialActivity) => (
              <div key={item.id} className=\"bg-white/5 border border-white/10 rounded-2xl overflow-hidden\">
                <div className=\"p-4 flex items-center gap-3\">
                  <div className=\"w-10 h-10 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center text-[#4ECDC4] font-bold\">
                    {item.title[0]}
                  </div>
                  <div>
                    <h4 className=\"text-sm font-bold\">{item.title}</h4>
                    <span className=\"text-[10px] text-white/40\">{item.category}</span>
                  </div>
                </div>
                {item.image && (
                  <div className=\"aspect-square relative\">
                    <img src={item.image} alt={item.title} className=\"w-full h-full object-cover\" />
                  </div>
                )}
                <div className=\"p-4\">
                  {item.description && <p className=\"text-sm text-white/70 mb-4\">{item.description}</p>}
                  <div className=\"flex items-center gap-4\">
                    <button className=\"flex items-center gap-1.5 text-white/40 hover:text-[#4ECDC4] transition-colors\">
                      <Heart size={18} /> <span className=\"text-xs font-medium\">{item.likes || 0}</span>
                    </button>
                    <button className=\"flex items-center gap-1.5 text-white/40 hover:text-[#4ECDC4] transition-colors\">
                      <MessageCircle size={18} /> <span className=\"text-xs font-medium\">{item.comments || 0}</span>
                    </button>
                    <button className=\"ml-auto text-white/40 hover:text-white transition-colors\">
                      <Bookmark size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Sidebar widgets */}
        <div className=\"w-80 px-6 py-8 space-y-8 overflow-y-auto hidden lg:block custom-scrollbar\">
          {/* News Sidebar Banner */}
          <NewsSidebar />

          {/* Kommende Events */}
          <div className=\"bg-white/5 border border-white/10 rounded-2xl p-5\">
            <div className=\"flex items-center justify-between mb-4\">
              <h3 className=\"text-sm font-bold\">Kommende Events</h3>
              <Link href=\"/test/udforsk\" className=\"text-[10px] text-[#4ECDC4] hover:underline\">Se alle</Link>
            </div>
            <div className=\"space-y-4\">
              {events.slice(0, 4).map(event => (
                <div key={event.id} className=\"flex gap-3 group cursor-pointer\">
                  <div className=\"w-12 h-12 rounded-lg overflow-hidden flex-shrink-0\">
                    <img src={getEventImage(event)} alt={event.title} className=\"w-full h-full object-cover\" />
                  </div>
                  <div className=\"min-w-0\">
                    <h4 className=\"text-xs font-bold truncate group-hover:text-[#4ECDC4] transition-colors\">{event.title}</h4>
                    <p className=\"text-[10px] text-white/40 mt-0.5\">{formatDanishDate(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Populære Tags */}
          <div className=\"bg-white/5 border border-white/10 rounded-2xl p-5\">
            <h3 className=\"text-sm font-bold mb-4\">Populære Tags</h3>
            <div className=\"flex flex-wrap gap-2\">
              {TAG_TREE.slice(0, 12).map(tag => (
                <button 
                  key={tag.tag}
                  onClick={() => {
                    const cur = getUserTags();
                    if (!cur.includes(tag.tag)) handleSaveTags([...cur, tag.tag]);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
                    userTags.includes(tag.tag) ? \"bg-[#4ECDC4] text-[#0a0f1a]\" : \"bg-white/5 text-white/60 hover:bg-[#4ECDC4]/15 hover:text-[#4ECDC4]\"
                  }`}
                >
                  {tag.emoji} #{tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* For virksomheder */}
          <div className=\"bg-gradient-to-br from-[#4ECDC4]/20 to-[#4ECDC4]/5 border border-[#4ECDC4]/20 rounded-2xl p-5\">
            <h3 className=\"text-sm font-bold mb-2\">For virksomheder</h3>
            <p className=\"text-[10px] text-white/60 mb-4\">Nå ud til dine kunder gennem oplevelser.</p>
            <div className=\"space-y-2\">
              <Link href=\"/firma\" className=\"flex items-center justify-between p-2 bg-white/5 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-all\">
                Dashboard <ChevronRight size={12} />
              </Link>
              <Link href=\"/henvisning\" className=\"flex items-center justify-between p-2 bg-white/5 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-all\">
                Bliv ambassadør <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style>{\`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      \`}</style>
    </div>
  );
}
