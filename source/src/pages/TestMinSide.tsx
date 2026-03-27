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

  const userStats = {
    name: "Nicolaj",
    location: "Aalborg, Danmark",
    joined: "Januar 2026",
    friendsCount: 42,
    interests: ["Cykling", "Løb", "Musik", "Outdoor", "Ski"],
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

      <div className="px-4 -mt-10">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
            <Calendar className="mx-auto mb-2 text-[#4ECDC4]" size={24} />
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-xs text-white/50">Events</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
            <Users className="mx-auto mb-2 text-[#4ECDC4]" size={24} />
            <p className="text-2xl font-bold">{userStats.friendsCount}</p>
            <p className="text-xs text-white/50">Venner</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
            <Award className="mx-auto mb-2 text-[#4ECDC4]" size={24} />
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-white/50">Badges</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <h3 className="text-sm font-bold text-white/60 uppercase mb-3">Mine Interesser</h3>
          <div className="flex flex-wrap gap-2">
            {userStats.interests.map(interest => (
              <span key={interest} className="px-3 py-1.5 bg-[#4ECDC4]/15 text-[#4ECDC4] rounded-full text-sm font-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white/60 uppercase">Kommende Events</h3>
            <Link href="/udforsk">
              <span className="text-xs text-[#4ECDC4] hover:underline cursor-pointer">Se alle</span>
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <div className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <img
                    src={getEventImage(event)}
                    alt={event.title}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                    <p className="text-xs text-[#4ECDC4]">{formatDanishDate(event.date)}</p>
                    <p className="text-xs text-white/40 line-clamp-1">{event.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link href="/udforsk">
            <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
              <TrendingUp className="mb-2 text-[#4ECDC4]" size={20} />
              <p className="font-medium text-sm">Udforsk</p>
              <p className="text-xs text-white/40">Find nye oplevelser</p>
            </div>
          </Link>
          <Link href="/kort">
            <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
              <MapPin className="mb-2 text-[#4ECDC4]" size={20} />
              <p className="font-medium text-sm">Kort</p>
              <p className="text-xs text-white/40">Events nær dig</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
