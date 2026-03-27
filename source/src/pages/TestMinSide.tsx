import { useState, useEffect } from \"react\";
import { Link } from \"wouter\";
import { Settings, Pencil, Calendar, MapPin, Heart, Bookmark, Users, Camera, LogOut, ChevronRight, Star, X, Newspaper, ExternalLink, Trash2 } from \"lucide-react\";
import { useQuery } from \"@tanstack/react-query\";
import type { Event } from \"@/lib/data\";
import { getEvents } from \"@/lib/data\";
import { getEventImage, formatDanishDate } from \"@/lib/eventHelpers\";
import { useJoin } from \"@/context/JoinContext\";
import { getUserTags, setUserTags, getTagNode, searchAllTags } from \"@/lib/tagEngine\";
import { TAG_TREE } from \"@/lib/tagTree\";
import { getSavedNews, removeSavedNews, formatNewsTime, type NewsItem } from \"@/lib/newsEngine\";
import NewsSidebar from \"@/components/NewsSidebar\";

export default function TestMinSide() {
  const { data: events = [] } = useQuery({
    queryKey: [\"/api/events\"],
    queryFn: getEvents,
  });

  const { isJoined } = useJoin();
  const [activeTab, setActiveTab] = useState(\"events\");
  const [myTags, setMyTags] = useState(getUserTags());
  const [editingTags, setEditingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState(\"\");
  const [savedNews, setSavedNews] = useState(getSavedNews());

  useEffect(() => {
    const tagHandler = (e: any) => setMyTags(e.detail || []);
    const newsHandler = (e: any) => setSavedNews(e.detail || []);
    window.addEventListener(\"bsocial-tags-changed\", tagHandler);
    window.addEventListener(\"bsocial-saved-news-changed\", newsHandler);
    return () => {
      window.removeEventListener(\"bsocial-tags-changed\", tagHandler);
      window.removeEventListener(\"bsocial-saved-news-changed\", newsHandler);
    };
  }, []);

  const joinedEvents = events.filter((e) => isJoined(e.id));
  
  const tabs = [
    { id: \"events\", label: \"Mine Events\", count: joinedEvents.length },
    { id: \"saved\", label: \"Gemt\", count: savedNews.length },
    { id: \"tags\", label: \"Mine Tags\", count: myTags.length },
  ];

  const toggleTag = (tag: string) => {
    const next = myTags.includes(tag) ? myTags.filter(t => t !== tag) : [...myTags, tag];
    setUserTags(next);
    setMyTags(next);
  };

  const searchResults = tagSearch ? searchAllTags(tagSearch) : [];

  return (
    <div className=\"min-h-screen bg-[#0a0f1a] text-white font-sans flex flex-col\">
      <div className=\"flex-1 flex overflow-hidden\">
        {/* Left Column - Profile Content */}
        <div className=\"flex-1 px-6 py-8 overflow-y-auto custom-scrollbar border-r border-white/10\">
          {/* Profile Header */}
          <div className=\"relative mb-12\">
            <div className=\"h-48 rounded-3xl bg-gradient-to-br from-[#4ECDC4]/20 to-purple-500/20 border border-white/5 overflow-hidden\">
              <div className=\"absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200')] bg-cover bg-center opacity-30\" />
            </div>
            
            <div className=\"absolute -bottom-8 left-8 flex items-end gap-6\">
              <div className=\"relative\">
                <div className=\"w-32 h-32 rounded-3xl border-4 border-[#0a0f1a] overflow-hidden bg-white/10 backdrop-blur-md\">
                  <img src=\"https://ui-avatars.com/api/?name=Nicolaj&background=4ECDC4&color=0a0f1a&size=256\" alt=\"Profile\" className=\"w-full h-full object-cover\" />
                </div>
                <button className=\"absolute bottom-2 right-2 p-2 bg-[#4ECDC4] text-[#0a0f1a] rounded-xl shadow-lg hover:scale-110 transition-transform\">
                  <Camera size={16} />
                </button>
              </div>
              
              <div className=\"mb-2 pb-2\">
                <h1 className=\"text-3xl font-black\">Nicolaj</h1>
                <p className=\"text-white/40 text-sm\">@nicolaj · Aalborg, Danmark</p>
              </div>
            </div>

            <div className=\"absolute bottom-0 right-0 flex gap-2\">
              <button className=\"p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all\">
                <Settings size={20} />
              </button>
              <button className=\"px-6 py-3 bg-[#4ECDC4] text-[#0a0f1a] rounded-2xl font-bold hover:bg-[#3dbdb5] transition-all flex items-center gap-2\">
                <Pencil size={18} /> Rediger Profil
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className=\"flex gap-12 mb-12 px-2\">
            <div>
              <span className=\"block text-2xl font-bold\">12</span>
              <span className=\"text-[10px] uppercase tracking-widest text-white/30 font-bold\">følger</span>
            </div>
            <div>
              <span className=\"block text-2xl font-bold\">48</span>
              <span className=\"text-[10px] uppercase tracking-widest text-white/30 font-bold\">følgere</span>
            </div>
            <div>
              <span className=\"block text-2xl font-bold\">{myTags.length}</span>
              <span className=\"text-[10px] uppercase tracking-widest text-white/30 font-bold\">tags</span>
            </div>
          </div>

          {/* Tabs */}
          <div className=\"flex gap-8 border-b border-white/5 mb-8\">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-white' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {tab.label} ({tab.count})
                {activeTab === tab.id && <div className=\"absolute bottom-0 left-0 right-0 h-1 bg-[#4ECDC4] rounded-full\" />}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className=\"min-h-[400px]\">
            {activeTab === \"events\" && (
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
                {joinedEvents.length === 0 ? (
                  <div className=\"col-span-full py-20 text-center text-white/20\">
                    <Calendar size={48} className=\"mx-auto mb-4 opacity-50\" />
                    <p className=\"mb-6\">Du har ikke tilmeldt dig nogen events endnu</p>
                    <Link href=\"/test/udforsk\" className=\"inline-block px-8 py-3 bg-[#4ECDC4] text-[#0a0f1a] rounded-2xl font-bold hover:bg-[#3dbdb5] transition-all\">
                      Udforsk events
                    </Link>
                  </div>
                ) : (
                  joinedEvents.map(event => (
                    <div key={event.id} className=\"group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 transition-all\">
                      <div className=\"aspect-video relative\">
                        <img src={getEventImage(event)} alt={event.title} className=\"w-full h-full object-cover\" />
                      </div>
                      <div className=\"p-4\">
                        <h3 className=\"font-bold mb-2\">{event.title}</h3>
                        <div className=\"flex items-center gap-4 text-[10px] text-white/40\">
                          <span className=\"flex items-center gap-1\"><Calendar size={12} /> {formatDanishDate(event.date)}</span>
                          <span className=\"flex items-center gap-1\"><MapPin size={12} /> {event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === \"saved\" && (
              <div className=\"space-y-4\">
                {savedNews.length === 0 ? (
                  <div className=\"py-20 text-center text-white/20\">
                    <Bookmark size={48} className=\"mx-auto mb-4 opacity-50\" />
                    <p>Du har ikke gemt nogen nyheder endnu</p>
                  </div>
                ) : (
                  savedNews.map(news => (
                    <div key={news.link} className=\"group relative bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 hover:bg-white/8 transition-all\">
                      {news.image && (
                        <div className=\"w-24 h-24 rounded-xl overflow-hidden flex-shrink-0\">
                          <img src={news.image} alt=\"\" className=\"w-full h-full object-cover opacity-80\" />
                        </div>
                      )}
                      <div className=\"flex-1 min-w-0 flex flex-col justify-center\">
                        <a href={news.link} target=\"_blank\" rel=\"noopener noreferrer\">
                          <h4 className=\"font-bold text-sm mb-2 group-hover:text-[#4ECDC4] transition-colors line-clamp-2\">{news.title}</h4>
                        </a>
                        <div className=\"flex items-center gap-2 text-[10px] text-white/40\">
                          <span>{news.sourceEmoji} {news.source}</span>
                          <span>•</span>
                          <span>{formatNewsTime(news.pubDate)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeSavedNews(news.link)}
                        className=\"absolute top-4 right-4 p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100\"
                        title=\"Fjern gemt\"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === \"tags\" && (
              <div className=\"space-y-8\">
                <div className=\"flex items-center justify-between\">
                  <h2 className=\"text-lg font-bold\">{myTags.length} interesser valgt</h2>
                  <button 
                    onClick={() => setEditingTags(!editingTags)}
                    className=\"px-4 py-2 rounded-xl text-xs font-bold bg-[#4ECDC4]/10 text-[#4ECDC4] hover:bg-[#4ECDC4]/20 transition-all\"
                  >
                    {editingTags ? \"Færdig\" : \"Rediger\" }
                  </button>
                </div>

                <div className=\"flex flex-wrap gap-2\">
                  {myTags.map(tag => {
                    const node = getTagNode(tag);
                    return (
                      <div key={tag} className=\"flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-xs font-medium\">
                        <span>{node?.emoji} #{node?.label || tag}</span>
                        {editingTags && (
                          <button onClick={() => toggleTag(tag)} className=\"hover:text-red-400 transition-colors\"><X size={12} /></button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {editingTags && (
                  <div className=\"pt-8 border-t border-white/5\">
                    <div className=\"relative mb-6\">
                      <Search size={14} className=\"absolute left-3 top-1/2 -translate-y-1/2 text-white/40\" />
                      <input 
                        type=\"search\" 
                        placeholder=\"Søg tags...\" 
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        className=\"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50\" 
                      />
                    </div>

                    {tagSearch && searchResults.length > 0 ? (
                      <div className=\"flex flex-wrap gap-2\">
                        {searchResults.map(t => (
                          <button 
                            key={t.tag}
                            onClick={() => toggleTag(t.tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              myTags.includes(t.tag) ? \"bg-[#4ECDC4] text-[#0a0f1a]\" : \"bg-white/5 text-white/70 hover:bg-white/10\"
                            }`}
                          >
                            {t.emoji} #{t.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className=\"space-y-8\">
                        {TAG_TREE.slice(0, 8).map(cat => (
                          <div key={cat.tag}>
                            <h3 className=\"text-[10px] uppercase tracking-widest text-white/30 font-black mb-4\">{cat.emoji} {cat.label}</h3>
                            <div className=\"flex flex-wrap gap-2\">
                              {[cat, ...(cat.children?.slice(0, 4) || [])].map(t => (
                                <button 
                                  key={t.tag}
                                  onClick={() => toggleTag(t.tag)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    myTags.includes(t.tag) ? \"bg-[#4ECDC4] text-[#0a0f1a]\" : \"bg-white/5 text-white/70 hover:bg-white/10\"
                                  }`}
                                >
                                  #{t.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className=\"w-80 px-6 py-8 space-y-8 overflow-y-auto hidden lg:block custom-scrollbar\">
          {/* News Sidebar Banner */}
          <NewsSidebar />

          {/* Settings Quick Links */}
          <div className=\"bg-white/5 border border-white/10 rounded-2xl p-5\">
            <h3 className=\"text-sm font-bold mb-4\">Indstillinger</h3>
            <div className=\"space-y-2\">
              <button className=\"w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs font-medium hover:bg-white/10 transition-all\">
                Privatliv <ChevronRight size={14} className=\"text-white/20\" />
              </button>
              <button className=\"w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs font-medium hover:bg-white/10 transition-all\">
                Notifikationer <ChevronRight size={14} className=\"text-white/20\" />
              </button>
              <button className=\"w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs font-medium hover:bg-red-400/10 text-red-400 transition-all\">
                Log ud <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{\`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      \`}</style>
    </div>
  );
}
