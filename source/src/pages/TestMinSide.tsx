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
  const { isJoined } = useJoin();
  const [activeTab, setActiveTab] = useState("events");
  const [myTags, setMyTags] = useState<string[]>(getUserTags());
  const [editingTags, setEditingTags] = useState(false);
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    const handler = (e: any) => setMyTags(e.detail || []);
    window.addEventListener("bsocial-tags-changed", handler);
    return () => window.removeEventListener("bsocial-tags-changed", handler);
  }, []);

  const joinedEvents = events.filter((e) => isJoined(e.id));

  const tabs = [
    { id: "events", label: "Mine Events", count: joinedEvents.length },
    { id: "saved", label: "Gemt", count: 12 },
    { id: "tags", label: "Mine Tags", count: myTags.length },
  ];

  const toggleTag = (tag: string) => {
    const next = myTags.includes(tag)
      ? myTags.filter(t => t !== tag)
      : [...myTags, tag];
    setUserTags(next);
    setMyTags(next);
  };

  const searchResults = tagSearch ? searchAllTags(tagSearch) : [];

  return (
    <div className="min-h-screen bg-[#0a1929] pb-24">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-[#4ECDC4]/30 to-[#0a1929]" />
        <div className="px-6 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-[#4ECDC4] flex items-center justify-center text-3xl font-bold text-[#0a1929] border-4 border-[#0a1929]">
              N
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-xl font-bold text-white">Nicolaj</h1>
              <p className="text-white/50 text-sm">@nicolaj · Aalborg, Danmark</p>
            </div>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <span className="text-white/60"><strong className="text-white">12</strong> følger</span>
            <span className="text-white/60"><strong className="text-white">48</strong> følger</span>
            <span className="text-white/60"><strong className="text-white">{myTags.length}</strong> tags</span>
          </div>
          <button className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/60 hover:bg-white/10 transition-all flex items-center gap-1">
            <Settings size={12} /> Indstillinger
          </button>
        </div>
      </div>

      {/* My Tags as pills */}
      {myTags.length > 0 && (
        <div className="px-6 mt-4 flex flex-wrap gap-2">
          {myTags.map(tag => {
            const node = getTagNode(tag);
            return (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-[#4ECDC4]/15 text-[#4ECDC4]">
                {node?.emoji} #{node?.label || tag}
              </span>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 mt-6 px-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-[#4ECDC4] text-[#4ECDC4]"
                : "border-transparent text-white/50 hover:text-white/70"
            }`}>
            {tab.label} <span className="ml-1 text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {activeTab === "events" && (
          <div className="space-y-3">
            {joinedEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={40} className="mx-auto text-white/20 mb-3" />
                <p className="text-white/40">Du har ikke tilmeldt dig nogen events endnu</p>
                <Link href="/udforsk" className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#4ECDC4] text-white text-sm font-medium">
                  Udforsk events
                </Link>
              </div>
            ) : joinedEvents.map(event => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <div className="flex gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/8 transition-all">
                  <img src={getEventImage(event)} alt={event.title || ""} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="text-white text-sm font-semibold">{event.title}</h3>
                    <p className="text-white/40 text-xs mt-0.5">{formatDanishDate(event.date)}</p>
                    <p className="text-white/30 text-xs">{event.location}</p>
                  </div>
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
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/60 text-sm">{myTags.length} interesser valgt</p>
              <button onClick={() => setEditingTags(!editingTags)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4ECDC4]/15 text-[#4ECDC4] hover:bg-[#4ECDC4]/25 transition-all flex items-center gap-1">
                <Pencil size={12} /> {editingTags ? "Færdig" : "Rediger"}
              </button>
            </div>

            {/* Current tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {myTags.map(tag => {
                const node = getTagNode(tag);
                return (
                  <div key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#4ECDC4]/15 text-[#4ECDC4]">
                    {node?.emoji} #{node?.label || tag}
                    {editingTags && (
                      <button onClick={() => toggleTag(tag)} className="hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add more tags */}
            {editingTags && (
              <div className="mt-4">
                <input
                  type="search"
                  placeholder="Søg tags..."
                  value={tagSearch}
                  onChange={e => setTagSearch(e.target.value)}
                  className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50 mb-3"
                />
                {tagSearch && searchResults.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {searchResults.map(t => (
                      <button key={t.tag} onClick={() => toggleTag(t.tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          myTags.includes(t.tag)
                            ? "bg-[#4ECDC4] text-white"
                            : "bg-white/8 text-white/70 hover:bg-white/15"
                        }`}>
                        {t.emoji} #{t.label}
                      </button>
                    ))}
                  </div>
                )}
                {!tagSearch && TAG_TREE.slice(0, 8).map(cat => (
                  <div key={cat.tag} className="mb-4">
                    <p className="text-white/40 text-xs font-medium mb-2">{cat.emoji} {cat.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {[cat, ...(cat.children?.slice(0, 4) || [])].map(t => (
                        <button key={t.tag} onClick={() => toggleTag(t.tag)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            myTags.includes(t.tag)
                              ? "bg-[#4ECDC4] text-white"
                              : "bg-white/8 text-white/70 hover:bg-white/15"
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
              <div className="text-center py-12">
                <Star size={40} className="mx-auto text-white/20 mb-3" />
                <p className="text-white/40">Du har ikke valgt nogen interesser endnu</p>
                <button onClick={() => setEditingTags(true)} className="mt-3 px-4 py-2 rounded-xl bg-[#4ECDC4] text-white text-sm font-medium">Vælg interesser</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
