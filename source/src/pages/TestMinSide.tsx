import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Settings, Pencil, Calendar, MapPin, Heart, Bookmark, Users, Camera, LogOut, ChevronRight, Star, X, Newspaper, ExternalLink, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { useJoin } from "@/context/JoinContext";
import { getUserTags, setUserTags, getTagNode, searchAllTags } from "@/lib/tagEngine";
import { TAG_TREE } from "@/lib/tagTree";
import { getSavedNews, removeSavedNews, formatNewsTime, type NewsItem } from "@/lib/newsEngine";

export default function TestMinSide() {
  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  const { isJoined } = useJoin();
  const [activeTab, setActiveTab] = useState("events");
  const [myTags, setMyTags] = useState(getUserTags());
  const [editingTags, setEditingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [savedNews, setSavedNews] = useState<NewsItem[]>(getSavedNews());

  useEffect(() => {
    const tagHandler = (e: any) => setMyTags(e.detail || []);
    const newsHandler = (e: any) => setSavedNews(e.detail || []);
    
    window.addEventListener("bsocial-tags-changed", tagHandler);
    window.addEventListener("bsocial-saved-news-changed", newsHandler);
    
    return () => {
      window.removeEventListener("bsocial-tags-changed", tagHandler);
      window.removeEventListener("bsocial-saved-news-changed", newsHandler);
    };
  }, []);

  const joinedEvents = events.filter((e) => isJoined(e.id));

  const tabs = [
    { id: "events", label: "Mine Events", count: joinedEvents.length },
    { id: "saved", label: "Gemt", count: savedNews.length },
    { id: "tags", label: "Mine Tags", count: myTags.length },
  ];

  const toggleTag = (tag: string) => {
    const next = myTags.includes(tag) ? myTags.filter(t => t !== tag) : [...myTags, tag];
    setUserTags(next);
    setMyTags(next);
  };

  const searchResults = tagSearch ? searchAllTags(tagSearch) : [];

  return (
    <div className="min-h-screen bg-[#0a1929] pb-24">
      {/* Profile Header */}
      <div className="px-4 pt-12 pb-8 text-center border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent pointer-events-none" />
        
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#45B7AF] p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-[#0a1929] flex items-center justify-center text-3xl font-bold text-white">
              N
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1e2535] border border-white/10 text-white/70 hover:text-white transition-all shadow-lg">
            <Camera size={14} />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Nicolaj</h1>
        <p className="text-white/40 text-sm mb-6">@nicolaj · Aalborg, Danmark</p>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-white font-bold">12</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">følger</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">48</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">følgere</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">{myTags.length}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">tags</div>
          </div>
        </div>

        <div className="flex gap-2 max-w-sm mx-auto">
          <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <Settings size={16} />
            Indstillinger
          </button>
        </div>
      </div>

      {/* My Tags as pills */}
      <div className="px-4 py-6">
        {myTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {myTags.map(tag => {
              const node = getTagNode(tag);
              return (
                <div key={tag} className="px-3 py-1.5 rounded-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 text-[#4ECDC4] text-xs font-medium flex items-center gap-1">
                  {node?.emoji} #{node?.label || tag}
                </div>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/5 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#4ECDC4] text-[#4ECDC4]"
                  : "border-transparent text-white/50 hover:text-white/70"
              }`}
            >
              {tab.label} <span className="opacity-40 ml-1">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "events" && (
            <>
              {joinedEvents.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <Calendar className="mx-auto text-white/20 mb-3" size={32} />
                  <p className="text-white/40 text-sm mb-4">Du har ikke tilmeldt dig nogen events endnu</p>
                  <Link href="/udforsk">
                    <button className="px-4 py-2 rounded-lg bg-[#4ECDC4]/10 text-[#4ECDC4] text-xs font-medium hover:bg-[#4ECDC4]/20 transition-all">
                      Udforsk events
                    </button>
                  </Link>
                </div>
              ) : (
                joinedEvents.map(event => (
                  <Link key={event.id} href={`/event/${event.id}`}>
                    <div className="glass-card p-4 rounded-xl flex gap-4 hover:bg-white/10 transition-all border border-white/5">
                      <img src={getEventImage(event)} className="w-16 h-16 rounded-lg object-cover" alt="" />
                      <div>
                        <h3 className="text-white font-bold text-sm mb-1">{event.title}</h3>
                        <div className="flex items-center gap-3 text-[10px] text-white/40 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDanishDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </>
          )}

          {activeTab === "saved" && (
            <div className="space-y-4">
              {savedNews.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <Bookmark className="mx-auto text-white/20 mb-3" size={32} />
                  <p className="text-white/40 text-sm">Du har ikke gemt nogen nyheder endnu</p>
                </div>
              ) : (
                savedNews.map(news => (
                  <div key={news.link} className="glass-card p-4 rounded-xl flex gap-4 border border-white/5 relative group">
                    {news.image && (
                      <img src={news.image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="" />
                    )}
                    <div className="flex-1 min-w-0 pr-8">
                      <a href={news.link} target="_blank" rel="noopener noreferrer">
                        <h4 className="text-sm font-semibold text-white/90 line-clamp-2 mb-1 leading-snug hover:text-[#4ECDC4] transition-colors">
                          {news.title}
                        </h4>
                      </a>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <span className="flex items-center gap-1">
                          {news.sourceEmoji} {news.source}
                        </span>
                        <span>•</span>
                        <span>{formatNewsTime(news.pubDate)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeSavedNews(news.link)}
                      className="absolute top-4 right-4 p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Fjern gemt"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "tags" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold">{myTags.length} interesser valgt</h2>
                <button
                  onClick={() => setEditingTags(!editingTags)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4ECDC4]/15 text-[#4ECDC4] hover:bg-[#4ECDC4]/25 transition-all flex items-center gap-1"
                >
                  {editingTags ? "Færdig" : "Rediger"}
                </button>
              </div>

              {/* Current tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {myTags.map(tag => {
                  const node = getTagNode(tag);
                  return (
                    <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
                      {node?.emoji} #{node?.label || tag}
                      {editingTags && (
                        <button onClick={() => toggleTag(tag)} className="hover:text-red-400 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add more tags */}
              {editingTags && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <input
                    type="search"
                    placeholder="Søg tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50 mb-3"
                  />
                  {tagSearch && searchResults.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {searchResults.map(t => (
                        <button
                          key={t.tag}
                          onClick={() => toggleTag(t.tag)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            myTags.includes(t.tag) ? "bg-[#4ECDC4] text-white" : "bg-white/8 text-white/70 hover:bg-white/15"
                          }`}
                        >
                          {t.emoji} #{t.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {!tagSearch && TAG_TREE.slice(0, 8).map(cat => (
                    <div key={cat.tag} className="mb-4 last:mb-0">
                      <div className="text-[10px] uppercase tracking-wider text-white/30 font-bold mb-2 flex items-center gap-1">
                        {cat.emoji} {cat.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[cat, ...(cat.children?.slice(0, 4) || [])].map(t => (
                          <button
                            key={t.tag}
                            onClick={() => toggleTag(t.tag)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                              myTags.includes(t.tag) ? "bg-[#4ECDC4] text-white" : "bg-white/8 text-white/70 hover:bg-white/15"
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

              {myTags.length === 0 && !editingTags && (
                <div className="text-center py-8">
                  <p className="text-white/40 text-sm">Du har ikke valgt nogen interesser endnu</p>
                  <button
                    onClick={() => setEditingTags(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#4ECDC4] text-white text-sm font-medium"
                  >
                    Vælg interesser
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
