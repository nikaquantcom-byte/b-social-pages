import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { Settings, Calendar, Heart, MapPin, TrendingUp, Award, Users } from "lucide-react";
import { useJoin } from "@/context/JoinContext";

export default function TestMinSide() {
  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  
  const { joinedEvents } = useJoin();
  const myEvents = events.filter(e => joinedEvents.has(e.id));

  const userStats = {
    name: "Nicolaj",
    location: "Aalborg, Danmark",
    joined: "Januar 2026",
    eventsAttended: myEvents.length,
    friendsCount: 42,
    interests: ["Cykling", "Løb", "Musik", "Outdoor", "Ski"],
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white pb-20">
      {/* Header */}
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
            {userStats.name[0]}
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

      {/* Stats Cards */}
      <div className="px-4 -mt-10">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <Calendar className="mx-auto mb-2 text-[#4ECDC4]" size={24} />
            <p className="text-2xl font-bold">{userStats.eventsAttended}</p>
            <p className="text-xs text-white/50">Events</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <Users className="mx-auto mb-2 text-[#4ECDC4]" size={24} />
            <p className="text-2xl font-bold">{userStats.friendsCount}</p>
            <p className="text-xs text-white/50">Venner</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <Award className="mx-auto mb-2 text-[#4ECDC4]" size={24} />
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-white/50">Badges</p>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <h3 className="text-sm font-bold text-white/60 uppercase mb-3">Mine Interesser</h3>
          <div className="flex flex-wrap gap-2">
            {userStats.interests.map(interest => (
              <span key={interest} className="px-3 py-1 bg-[#4ECDC4]/20 text-[#4ECDC4] rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* My Events */}
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white/60 uppercase">Mine Events</h3>
            <Link href="/udforsk">
              <span className="text-xs text-[#4ECDC4] hover:underline">Find flere</span>
            </Link>
          </div>
          
          {myEvents.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto mb-3 text-white/20" size={48} />
              <p className="text-white/40 text-sm mb-4">Du har ikke tilmeldt dig events endnu</p>
              <Link href="/udforsk">
                <button className="px-4 py-2 bg-[#4ECDC4] text-white rounded-xl text-sm font-medium hover:bg-[#3dbdb5]">
                  Udforsk Events
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myEvents.slice(0, 5).map(event => (
                <Link key={event.id} href={`/event/${event.id}`}>
                  <div className="flex gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <img
                      src={getEventImage(event)}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs text-white/50">{formatDanishDate(event.date)}</p>
                      <p className="text-xs text-white/40 line-clamp-1">{event.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link href="/udforsk">
            <button className="w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left">
              <TrendingUp className="mb-2 text-[#4ECDC4]" size={20} />
              <p className="font-medium text-sm">Udforsk Events</p>
              <p className="text-xs text-white/40">Find nye oplevelser</p>
            </button>
          </Link>
          <Link href="/kort">
            <button className="w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left">
              <MapPin className="mb-2 text-[#4ECDC4]" size={20} />
              <p className="font-medium text-sm">Kort</p>
              <p className="text-xs text-white/40">Events nær dig</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
