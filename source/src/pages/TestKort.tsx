import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import { Search, MapPin, Filter, List, Navigation, Layers, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { getUserTags, filterEventsForMap, getTagNode } from "@/lib/tagEngine";
import { TAG_TREE } from "@/lib/tagTree";

export default function TestKort() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: getEvents,
  });
  const [showList, setShowList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>(getUserTags());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Filter events using superhjerne
  const filteredEvents = useMemo(() => {
    let filtered = filterEventsForMap(events, activeTags);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.interest_tags || []).some(t => t.includes(q))
      );
    }
    return filtered;
  }, [events, activeTags, searchQuery]);

  // Events with valid coordinates
  const geoEvents = useMemo(() =>
    filteredEvents.filter(e => e.latitude && e.longitude),
  [filteredEvents]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const loadLeaflet = () => {
      if ((window as any).L) { initMap(); return; }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap();
      document.head.appendChild(script);
    };
    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;
      const map = L.map(mapRef.current, {
        center: [55.95, 10.5],
        zoom: 7,
        zoomControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '\u00a9 OpenStreetMap contributors',
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 100);
    };
    loadLeaflet();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    geoEvents.forEach(event => {
      const icon = L.divIcon({
        html: '<div class="b-pin-dot"><div class="b-pin-pulse"></div></div>',
        className: "b-pin",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const marker = L.marker([event.latitude, event.longitude], { icon })
        .addTo(map)
        .on("click", () => setSelectedEvent(event));
      marker.bindTooltip(event.title, { className: "leaflet-dark-tooltip", direction: "top", offset: [0, -16] });
      markersRef.current.push(marker);
    });
    if (geoEvents.length > 1) {
      const bounds = L.latLngBounds(geoEvents.map(e => [e.latitude, e.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    } else if (geoEvents.length === 1) {
      map.flyTo([geoEvents[0].latitude, geoEvents[0].longitude], 13, { duration: 0.5 });
    }
  }, [geoEvents]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0e23] text-white">
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <h1 className="text-2xl font-bold">Kort</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="search"
              placeholder="S\u00f8g p\u00e5 kortet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-64 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
            />
          </div>
          <button onClick={() => setShowList(!showList)} className={`p-2 rounded-lg ${showList ? "bg-[#4ECDC4]/15 text-[#4ECDC4]" : "bg-white/8 text-white/60"}`}>
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 px-6 pb-3 overflow-x-auto scrollbar-hide">
        {TAG_TREE.slice(0, 10).map(tag => (
          <button key={tag.tag} onClick={() => toggleTag(tag.tag)} className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            activeTags.includes(tag.tag) ? "bg-[#4ECDC4] text-white" : "bg-white/8 text-white/60 hover:bg-white/15"
          }`}>
            {tag.emoji} {tag.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1" style={{ height: "calc(100vh - 140px)" }}>
        <div className="relative flex-1">
          <div ref={mapRef} className="w-full h-full" />
          {selectedEvent && (
            <div className="absolute bottom-4 left-4 right-4 bg-[#0a0e23]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-w-sm">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-2 right-2 text-white/40 hover:text-white">
                <X size={16} />
              </button>
              <Link href={`/event/${selectedEvent.id}`}>
                <img src={getEventImage(selectedEvent)} alt={selectedEvent.title} className="w-full h-32 object-cover rounded-xl mb-3" />
                <h3 className="font-bold text-base mb-1">{selectedEvent.title}</h3>
                <p className="text-xs text-white/50 mb-1">{formatDanishDate(selectedEvent.date)}</p>
                <p className="text-xs text-[#4ECDC4]">{selectedEvent.location}</p>
                <div className="flex gap-1 mt-2">
                  {(selectedEvent.interest_tags || []).slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/60">#{tag}</span>
                  ))}
                </div>
              </Link>
            </div>
          )}
        </div>

        {showList && (
          <div className="w-80 bg-[#0a0e23]/80 backdrop-blur border-l border-white/5 overflow-y-auto px-3 py-4">
            <h3 className="text-sm font-semibold text-white/70 mb-3">Events i n\u00e6rheden ({filteredEvents.length})</h3>
            {filteredEvents.slice(0, 20).map(event => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  if (mapInstanceRef.current && event.latitude && event.longitude) {
                    mapInstanceRef.current.flyTo([event.latitude, event.longitude], 14, { duration: 0.5 });
                  }
                }}
                className="w-full flex gap-3 py-2 border-t border-white/5 first:border-0 hover:bg-white/5 rounded-lg transition-colors px-1 text-left"
              >
                <img src={getEventImage(event)} alt={event.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-white/40">{formatDanishDate(event.date)}</p>
                  <p className="text-xs text-[#4ECDC4] truncate">{event.location}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .b-pin { background: none !important; border: none !important; }
        .b-pin-dot {
          width: 20px; height: 20px;
          background: #4ECDC4;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 12px rgba(78, 205, 196, 0.6), 0 2px 8px rgba(0,0,0,0.4);
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .b-pin-dot:hover { transform: scale(1.3); }
        .b-pin-pulse {
          position: absolute;
          top: -6px; left: -6px;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(78, 205, 196, 0.4);
          animation: b-pulse 2s ease-out infinite;
        }
        @keyframes b-pulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .leaflet-dark-tooltip {
          background: rgba(10,14,35,0.9) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
          font-size: 12px !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .leaflet-dark-tooltip::before {
          border-top-color: rgba(10,14,35,0.9) !important;
        }
      `}</style>
    </div>
  );
}
