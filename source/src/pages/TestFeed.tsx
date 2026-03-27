import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";

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
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">B-Social Feed</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <Link key={event.id} href={`/event/${event.id}`}>
              <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 transition-all cursor-pointer">
                <div className="aspect-video relative">
                  <img 
                    src={getEventImage(event)} 
                    alt={event.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold">
                    {formatDanishDate(event.date)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 group-hover:text-[#4ECDC4] transition-colors">{event.title}</h3>
                  <p className="text-xs text-white/60 line-clamp-2">{event.description}</p>
                  {event.price != null && (
                    <div className="mt-2 text-[#4ECDC4] text-sm font-bold">
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
