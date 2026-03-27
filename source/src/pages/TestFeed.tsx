import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate, getCategoryEmoji, getTimeBasedGreeting } from "@/lib/eventHelpers";
import { Search, PenSquare, ChevronRight, Bell } from "lucide-react";

const FRIENDS = [
  { name: "Anna", initial: "A" },
  { name: "Mads", initial: "M" },
  { name: "Sofie", initial: "S" },
  { name: "Jonas", initial: "J" },
];

const NEWS_ITEMS = [
  { source: "Nordjyske Sport", time: "1 dag siden", title: "Lyspunktet skal findes på lægterne efter nordjyske skuffelser på isen", img: "https://images.unsplash.com/photo-1461896836934-ber7bb95ed4b?w=80&auto=format&fit=crop" },
  { source: "DR Sporten", time: "1 dag siden", title: "Mads Pedersen skal jagte tredje sejr i træk i belgisk klassiker", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=80&auto=format&fit=crop" },
  { source: "Nordjyske Sport", time: "3 dage siden", title: "Nordjyske erfarer: Lucas Andersen har ny klub på plads", img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=80&auto=format&fit=crop" },
  { source: "Nordjyske Sport", time: "16. mar.", title: "Opbakningen til kriseramt klub er i fremgang", img: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0e?w=80&auto=format&fit=crop" },
  { source: "Nordjyske Sport", time: "17. mar.", title: "Hobro sælger profil til Norge", img: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=80&auto=format&fit=crop" },
  { source: "DR Sporten", time: "3 timer siden", title: "Riemer havde to 'spioner' i Tjekkiet for at lure Europas højeste landshold", img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=80&auto=format&fit=crop" },
];

const POPULAR_TAGS = ["#Cykling", "#Løb", "#Fodbold", "#Ski"];

export default function TestFeed() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  const greeting = getTimeBasedGreeting();

  // Group events by category
  const eventsByCategory: Record<string, typeof events> = {};
  events.forEach(event => {
    const cat = event.category || "Andet";
    if (!eventsByCategory[cat]) eventsByCategory[cat] = [];
    eventsByCategory[cat].push(event);
  });

  const categories = Object.keys(eventsByCategory).filter(c => eventsByCategory[c].length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white flex items-center justify-center">
        <div className="text-white/60">Loader events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans">
      <div className="flex gap-6 max-w-7xl mx-auto px-4 py-6">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">{greeting}</h1>
              <p className="text-white/50 text-sm mt-1">Her er hvad der sker i dine netværk</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  placeholder="Søg events, steder..."
                  className="bg-white/10 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48"
                />
              </div>
              <button className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20">
                <PenSquare size={16} />
              </button>
            </div>
          </div>

          {/* Friends */}
          <div className="flex gap-6 mb-8">
            {FRIENDS.map(f => (
              <div key={f.name} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {f.initial}
                </div>
                <span className="text-xs text-white/60">{f.name}</span>
              </div>
            ))}
          </div>

          {/* Categories */}
          {categories.length === 0 ? (
            <div className="text-white/40 text-center py-12">Ingen events fundet</div>
          ) : (
            categories.map(category => (
              <div key={category} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span>{getCategoryEmoji(category)}</span>
                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </h2>
                  <Link href={`/udforsk?tag=${category.toLowerCase()}`}>
                    <span className="text-sm text-white/50 hover:text-cyan-400 flex items-center gap-1 cursor-pointer">
                      Se alle <ChevronRight size={14} />
                    </span>
                  </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {eventsByCategory[category].slice(0, 4).map(event => (
                    <Link key={event.id} href={`/event/${event.id}`}>
                      <div className="flex-shrink-0 w-52 bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="relative h-32 bg-white/10">
                          <img
                            src={getEventImage(event)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-cyan-400 text-xs mb-1">{formatDanishDate(event.date)}</p>
                          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{event.title}</h3>
                          {event.tags && event.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-xs text-white/40">#{tag} </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          {/* News */}
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={14} className="text-cyan-400" />
              <span className="text-xs font-bold tracking-widest text-white/60 uppercase">Nyheder til dig</span>
            </div>
            <div className="space-y-3">
              {NEWS_ITEMS.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/40 mb-1">{item.source} • {item.time}</p>
                    <p className="text-xs font-medium leading-tight line-clamp-2">{item.title}</p>
                  </div>
                  <img src={item.img} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-xs text-white/50 bg-white/5 rounded-xl hover:bg-white/10">Se alle nyheder</button>
          </div>

          {/* Popular Tags */}
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="text-xs font-bold tracking-widest text-white/60 uppercase mb-3">Populære Tags</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map(tag => (
                <Link key={tag} href={`/udforsk?tag=${tag.replace('#', '').toLowerCase()}`}>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 hover:bg-cyan-500/20 hover:text-cyan-400 cursor-pointer">{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
