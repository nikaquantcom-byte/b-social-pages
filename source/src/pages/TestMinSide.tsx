import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Settings, Pencil, Calendar, MapPin, Heart, Bookmark, Users, Camera, LogOut, ChevronRight, Star, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { useJoin } from "@/context/JoinContext";
import { getUserTags, setUserTags, getTagNode, searchAllTags } from "@/lib/tagEngine";
import { TAG_TREE } from "@/lib/tagTree";

export default function TestMinSide() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  const { joinedIds } = useJoin();
  const [activeTab, setActiveTab] = useState("events");
  const [myTags, setMyTags] = useState<string[]>(getUserTags());
  const [editingTags, setEditingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    const handler = (e: any) => setMyTags(e.detail || []);
    window.addEventListener("bsocial-tags-changed", handler);
    return () => window.removeEventListener("bsocial-tags-changed", handler);
  }, []);

  const joinedEvents = events.filter((e) => joinedIds.has(e.id));

  const tabs = [
    { id: "events", label: "Mine Events", count: joinedEvents.length },
    { id: "saved", label: "Gemt", count: 12 },
    { id: "tags", label: "Mine Tags", count: myTags.length },
  ];

  const toggleTag = (tag: string) => {
    const next = myTags.includes(tag) ? myTags.filter(t => t !== tag) : [...myTags, tag];
    setUserTags(next);
    setMyTags(next);
  };

  const searchResults = tagSearch ? searchAllTags(tagSearch) : [];

  return (
    <div className="min-h-screen nature-bg">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-[#4ECDC4]/30 via-[#0a0e23] to-[#0a0e23]" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-end gap-6 -mt-16">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-[#4ECDC4]/20 border-4 border-[#0a0e23] flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-bold text-[#4ECDC4]">N</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#4ECDC4] flex items-center justify-center text-white shadow-lg">
                <Camera size={14} />
              </button>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-white">Nicolaj</h1>
              <p className="text-sm text-white/50">@nicolaj · Aalborg, Danmark</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-white/60"><strong className="text-white">12</strong> følger</span>
                <span className="text-white/60"><strong className="text-white">48</strong> følger</span>
                <span className="text-white/60"><strong className="text-white">{myTags.length}</strong> tags</span>
              </div>
            </div>
            <div className="ml-auto pb-2 flex gap-2">
              <Link href="/auth" className="px-4 py-2 rounded-xl bg-white/8 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors flex items-center gap-1.5">
                <Settings size={14} /> Indstillinger
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* My Tags as pills */}
      {myTags.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mt-4">
          <div className="flex flex-wrap gap-1.5">
            {myTags.map(tag => {
              const node = getTagNode(tag);
              return (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#4ECDC4]/15 text-[#4ECDC4]">
                  {node?.emoji} #{node?.label || tag}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-1 border-b border-white/8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id ? "border-[#4ECDC4] text-[#4ECDC4]" : "border-transparent text-white/50 hover:text-white/70"
              }`}>
              {tab.label} <span className="ml-1 text-xs opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {activeTab === "events" && (
          <div className="space-y-3">
            {joinedEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={40} className="mx-auto text-white/20 mb-3" />
                <p className="text-white/40">Du har ikke tilmeldt dig nogen events endnu</p>
                <Link href="/udforsk" className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#4ECDC4] text-white text-sm font-medium">Udforsk events</Link>
              </div>
            ) : joinedEvents.map(event => (
              <Link key={event.id} href={`/event/${event.id}`}
                className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-[#4ECDC4]/30 transition-all">
                <img src={getEventImage(event)} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{event.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{formatDanishDate(event.date)}</p>
                  <p className="text-xs text-white/30 flex items-center gap-0.5"><MapPin size={10} /> {event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="text-center py-12">
            <Bookmark size={40} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/40">Dine gemte events vises her</p>
          </div>
        )}

        {activeTab === "tags" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">{myTags.length} interesser valgt</p>
              <button onClick={() => setEditingTags(!editingTags)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4ECDC4]/15 text-[#4ECDC4] hover:bg-[#4ECDC4]/25 transition-all flex items-center gap-1">
                <Pencil size={12} /> {editingTags ? "Færdig" : "Rediger"}
              </button>
            </div>

            {/* Current tags */}
            <div className="flex flex-wrap gap-2">
              {myTags.map(tag => {
                const node = getTagNode(tag);
                return (
                  <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4ECDC4]/15 text-[#4ECDC4] text-sm font-medium">
                    {node?.emoji} #{node?.label || tag}
                    {editingTags && (
                      <button onClick={() => toggleTag(tag)} className="hover:text-red-400 transition-colors"><X size={14} /></button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add more tags */}
            {editingTags && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/8">
                <input type="search" placeholder="Søg tags..." value={tagSearch}
                  onChange={e => setTagSearch(e.target.value)}
                  className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50 mb-3" />
                {tagSearch && searchResults.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {searchResults.map(t => (
                      <button key={t.tag} onClick={() => toggleTag(t.tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          myTags.includes(t.tag) ? "bg-[#4ECDC4] text-white" : "bg-white/8 text-white/70 hover:bg-white/15"
                        }`}>
                        {t.emoji} #{t.label}
                      </button>
                    ))}
                  </div>
                )}
                {!tagSearch && TAG_TREE.slice(0, 8).map(cat => (
                  <div key={cat.tag} className="mb-2">
                    <p className="text-xs text-white/30 mb-1">{cat.emoji} {cat.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[cat, ...(cat.children?.slice(0, 4) || [])].map(t => (
                        <button key={t.tag} onClick={() => toggleTag(t.tag)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            myTags.includes(t.tag) ? "bg-[#4ECDC4] text-white" : "bg-white/8 text-white/70 hover:bg-white/15"
                          }`}>
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
                <Star size={40} className="mx-auto text-white/20 mb-3" />
                <p className="text-white/40">Du har ikke valgt nogen interesser endnu</p>
                <button onClick={() => setEditingTags(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#4ECDC4] text-white text-sm font-medium">Vælg interesser</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
