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
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {        attribution: "\u00a9 OSM \u00a9 CARTO",
        attribution: '© OpenStreetMap contributors',      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 100);
    };
    loadLeaflet();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    geoEvents.forEach(event => {
      const icon = L.divIcon({
        html: `<div style="width:12px;height:12px;background:#4ECDC4;border:2px solid #0a0e23;border-radius:50%;box-shadow:0 0 8px rgba(78,205,196,0.5)"></div>`,
        className: "",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      const marker = L.marker([event.latitude, event.longitude], { icon })
        .addTo(map)
        .on("click", () => setSelectedEvent(event));
      marker.bindTooltip(event.title, { className: "leaflet-dark-tooltip", direction: "top", offset: [0, -8] });
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
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="min-h-screen nature-bg flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0e23]/80 border-b border-white/8">
        <div className="max-w-full px-6 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold">Kort</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="search" placeholder={"S\u00f8g p\u00e5 kortet..."} value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white/90 placeholder:text-white/30 w-64 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50" />
            </div>
            <button onClick={() => setShowList(!showList)}
              className={`p-2 rounded-lg ${showList ? "bg-[#4ECDC4]/15 text-[#4ECDC4]" : "bg-white/8 text-white/60"}`}>
              <List size={18} />
            </button>
          </div>
        </div>
        <div className="px-6 pb-2 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {TAG_TREE.slice(0, 10).map(tag => (
            <button key={tag.tag} onClick={() => toggleTag(tag.tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTags.includes(tag.tag) ? "bg-[#4ECDC4] text-white" : "bg-white/8 text-white/60 hover:bg-white/15"
              }`}>
              {tag.emoji} {tag.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <div ref={mapRef} className="absolute inset-0" style={{ background: "#1a1a2e" }} />
          {selectedEvent && (
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#0a0e23]/95 backdrop-blur-lg rounded-xl border border-white/10 p-4 max-w-md">
              <button onClick={() => setSelectedEvent(null)} className="absolute top-2 right-2 text-white/40 hover:text-white">
                <X size={16} />
              </button>
              <div className="flex gap-3">
                <img src={getEventImage(selectedEvent)} alt={selectedEvent.title} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <Link href={`/event/${selectedEvent.id}`} className="text-sm font-medium text-white hover:text-[#4ECDC4]">{selectedEvent.title}</Link>
                  <p className="text-xs text-white/50 mt-0.5">{formatDanishDate(selectedEvent.date)}</p>
                  <p className="text-xs text-white/40 flex items-center gap-0.5 mt-0.5"><MapPin size={10} /> {selectedEvent.location}</p>
                  <div className="flex gap-1 mt-1">
                    {(selectedEvent.interest_tags || []).slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-[#4ECDC4]/10 text-[#4ECDC4]">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showList && (
          <div className="w-80 bg-[#0a0e23]/90 backdrop-blur-lg border-l border-white/8 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3">{"Events i n\u00e6rheden"} ({filteredEvents.length})</h3>
              {filteredEvents.slice(0, 20).map(event => (
                <button key={event.id} onClick={() => {
                  setSelectedEvent(event);
                  if (mapInstanceRef.current && event.latitude && event.longitude) {
                    mapInstanceRef.current.flyTo([event.latitude, event.longitude], 14, { duration: 0.5 });
                  }
                }} className="w-full flex gap-3 py-2 border-t border-white/5 first:border-0 hover:bg-white/5 rounded-lg transition-colors px-1 text-left">
                  <img src={getEventImage(event)} alt={event.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{event.title}</p>
                    <p className="text-xs text-white/40">{formatDanishDate(event.date)}</p>
                    <p className="text-xs text-white/30 flex items-center gap-0.5"><MapPin size={10} /> {event.location}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
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
