import { useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Filter, List, Navigation, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";

export default function TestKort() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  const [showList, setShowList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen nature-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0e23]/80 border-b border-white/8">
        <div className="max-w-full px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold">Kort</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                placeholder={"S\u00f8g p\u00e5 kortet..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-64 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
              />
            </div>
            <button
              onClick={() => setShowList(!showList)}
              className={`p-2 rounded-lg ${showList ? "bg-[#4ECDC4]/15 text-[#4ECDC4]" : "bg-white/8 text-white/60"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Map + sidebar layout */}
      <div className="flex-1 flex">
        {/* Map area */}
        <div className="flex-1 relative bg-[#0a0e23]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-[#4ECDC4]" />
              </div>
              <p className="text-white/40 text-sm">Interaktivt kort</p>
              <p className="text-white/25 text-xs mt-1">{"Leaflet map indl\u00e6ses her"}</p>
            </div>
          </div>
          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-white/15 transition-colors">
              <Navigation size={18} className="text-white/60" />
            </button>
            <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:bg-white/15 transition-colors">
              <Layers size={18} className="text-white/60" />
            </button>
            <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/60 hover:bg-white/15 text-lg font-bold">+</button>
            <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/60 hover:bg-white/15 text-lg font-bold">-</button>
          </div>
        </div>

        {/* Side panel - event list */}
        {showList && (
          <aside className="w-80 border-l border-white/8 bg-[#0a0e23]/90 backdrop-blur-xl overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-3">{"Events i n\u00e6rheden"} ({events.length})</h3>
              <div className="space-y-2">
                {events.slice(0, 15).map((event) => (
                  <Link key={event.id} href={`/test/event/${event.id}`} className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-[#4ECDC4] transition-colors">{event.title}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{formatDanishDate(event.date)}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-[#4ECDC4]" />
                        <span className="text-[10px] text-white/30 truncate">{event.location}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
