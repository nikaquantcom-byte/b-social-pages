import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { Search } from "lucide-react";

export default function TestFeed() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white flex items-center justify-center">
        <div className="text-white/60">Loader events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d8f] via-[#0a0f1a] to-[#0a0f1a]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')] bg-cover bg-center opacity-10" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Oplev verden sammen
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Find events, aktiviteter og oplevelser i hele Danmark
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Søg events, steder, tags..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Alle Events</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <Link key={event.id} href={`/event/${event.id}`}>
              <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 hover:border-cyan-500/50 transition-all cursor-pointer">
                <div className="aspect-video relative">
                  <img 
                    src={getEventImage(event)}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-lg text-xs font-bold">
                    {formatDanishDate(event.date)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/60 line-clamp-2 mb-4">
                    {event.description}
                  </p>
                  {event.price != null && (
                    <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-bold">
                      {event.price > 0 ? `${event.price} kr` : 'Gratis'}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
