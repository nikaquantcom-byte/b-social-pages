import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { Settings, Calendar, Heart, MapPin, TrendingUp, Award, Users } from "lucide-react";

export default function TestMinSide() {
  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  // Show upcoming events as suggestions
  const upcomingEvents = events.slice(0, 5);

  // Derive dynamic interests from event tags
  const topInterests = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    events.forEach(e => {
      (e.interest_tags || []).forEach((t: string) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [events]);

  // Derive unique categories count as "badges"
  const uniqueCategories = useMemo(() => {
    const cats = new Set(events.map(e => e.category).filter(Boolean));
    return cats.size;
  }, [events]);

  const userStats = {
    name: "Nicolaj",
    location: "Aalborg, Danmark",
    joined: "Januar 2026",
    friendsCount: 42,
    interests: topInterests.length > 0 ? topInterests : ["Cykling", "Løb", "Musik", "Outdoor", "Ski"],
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white pb-20">
      <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44A08D] p-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Min Side</h1>
          <Link href="/firma/indstillinger">
            <button className="p-2 bg-white/20 rounded-xl hover:bg-white/30">
              <Settings size={20} />
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#4ECDC4] text-3xl font-bold">
            N
          </div>
          <div>
            <h2 className="text-2xl font-bold">{userStats.name}</h2>
            <p className="text-white/80 flex items-center gap-1 text-sm">
              <MapPin size={14} /> {userStats.location}
            </p>
            <p className="text-white/60 text-xs mt-1">Medlem siden {userStats.joined}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="glass-card rounded-2xl p-4 text-center">
            <Calendar size={20} className="mx-auto mb-2 text-[#4ECDC4]" />
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-xs text-white/50">Events</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <Users size={20} className="mx-auto mb-2 text-[#4ECDC4]" />
            <p className="text-2xl font-bold">{userStats.friendsCount}</p>
            <p className="text-xs text-white/50">Venner</p>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <Award size={20} className="mx-auto mb-2 text-[#4ECDC4]" />
            <p className="text-2xl font-bold">{uniqueCategories}</p>
            <p className="text-xs text-white/50">Kategorier</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
            <Heart size={16} className="text-[#4ECDC4]" /> Dine interesser
          </h3>
          <div className="flex flex-wrap gap-2">
            {userStats.interests.map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-[#4ECDC4]/15 text-[#4ECDC4] rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#4ECDC4]" /> Kommende Events
            </h3>
            <Link href="/udforsk" className="text-xs text-[#4ECDC4]">Se alle</Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <Link key={event.id} href={`/event/${event.id}`} className="flex gap-3 hover:bg-white/5 rounded-xl p-1.5 -mx-1.5 transition-colors">
                <img src={getEventImage(event)} alt={event.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-white/40">{formatDanishDate(event.date)}</p>
                  <p className="text-xs text-[#4ECDC4] truncate">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/udforsk" className="glass-card rounded-2xl p-4 hover:ring-1 hover:ring-[#4ECDC4]/30 transition-all">
            <Calendar size={24} className="text-[#4ECDC4] mb-2" />
            <p className="font-semibold text-sm">Udforsk</p>
            <p className="text-xs text-white/40">Find nye events</p>
          </Link>
          <Link href="/kort" className="glass-card rounded-2xl p-4 hover:ring-1 hover:ring-[#4ECDC4]/30 transition-all">
            <MapPin size={24} className="text-[#4ECDC4] mb-2" />
            <p className="font-semibold text-sm">Kort</p>
            <p className="text-xs text-white/40">Events i nærheden</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
