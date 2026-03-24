import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Bell, MapPin, ChevronRight, Users, Heart, X, Plus, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { fetchNewestPlaces, type Place } from "@/lib/supabase";
import { getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { useTags } from "@/context/TagContext";
import { FeedTagEditor } from "@/components/FeedTagEditor";
import { CalmBottomNav } from "@/components/CalmBottomNav";
import { searchTags } from "@/lib/tagTree";
import { ALL_CATEGORIES } from "@/data/categories";

import { OPLEVELSER_NAER_DIG, AMBASSADORS } from "@/data/feedData";
import type { SocialActivity, Ambassador } from "@/data/feedData";
import { useJoin } from "@/context/JoinContext";
import { toast } from "@/hooks/use-toast";

/* ═══════════════════════════════════════════════
   FEED — Figma Make version
   ═══════════════════════════════════════════════ */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "God morgen";
  if (h >= 12 && h < 18) return "God eftermiddag";
  return "God aften";
}

/* ── Horizontal event card (compact, for scroll rows) ── */
function HorizontalEventCard({ activity }: { activity: SocialActivity }) {
  const { joinEvent, leaveEvent, isJoined } = useJoin();
  const joined = isJoined(activity.id);

  return (
    <Link href={`/social/${activity.id}`}>
      <div className="min-w-[260px] max-w-[260px] rounded-2xl overflow-hidden glass-card flex-shrink-0 cursor-pointer hover:bg-white/8 transition-all" data-testid={`hcard-${activity.id}`}>
        <div className="relative h-36">
          <img src={activity.image} alt={activity.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${activity.price ? "bg-amber-500/90" : "bg-[#4ECDC4]"}`}>
            {activity.price ? `${activity.price} kr` : "Gratis"}
          </span>
          <div className="absolute bottom-2.5 left-3 right-3">
            <h3 className="text-white text-sm font-bold leading-tight line-clamp-2">{activity.title}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={10} className="text-white/50" />
              <span className="text-white/50 text-[10px]">{activity.location}</span>
              <span className="text-white/30 text-[10px]">{activity.distance}</span>
            </div>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users size={10} className="text-white/40" />
            <span className="text-white/40 text-[10px]">{activity.spots.current}/{activity.spots.total}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (joined) leaveEvent(activity.id);
              else joinEvent(activity.id, activity.title);
            }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
              joined
                ? "bg-white/10 text-white/60"
                : "bg-[#4ECDC4]/20 text-[#4ECDC4] hover:bg-[#4ECDC4]/30"
            }`}
          >
            {joined ? "Tilmeldt ✓" : "Deltag"}
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ── Premium event card (horizontal scroll) ── */
function PremiumEventCard({ event }: { event: Event }) {
  const price = event.price || 0;
  return (
    <Link href={`/event/${event.id}`}>
      <div className="min-w-[200px] max-w-[200px] rounded-2xl overflow-hidden glass-card flex-shrink-0 cursor-pointer hover:bg-white/8 transition-all" data-testid={`event-${event.id}`}>
        <div className="relative h-28">
          <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white ${price > 0 ? "bg-amber-500/90" : "bg-[#4ECDC4]"}`}>
            {price > 0 ? `${price} kr` : "Gratis"}
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h3 className="text-white text-xs font-bold line-clamp-2 leading-tight">{event.title}</h3>
          </div>
        </div>
        <div className="px-2.5 py-2">
          <span className="text-white/40 text-[10px]">{formatDanishDate(event.date)}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Newest place row ── */
function NewPlaceRow({ place }: { place: Place }) {
  const catEmoji: Record<string, string> = {
    natur: "🌿", aktiv_sport: "🏃", mad_hangout: "🍽️", sport: "⚽",
    kultur: "🎭", musik: "🎵", strand: "🏖️", badning: "🏊",
    hund: "🐕", shelter: "⛺", fiskeri: "🎣", outdoor: "🌲", loeb: "🏃", mtb: "🚵", vandring: "🥾",
  };
  const emoji = catEmoji[place.main_categories?.[0] || ""] || "📍";
  return (
    <Link href={`/sted/${place.id}`}>
      <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
        <div className="w-9 h-9 rounded-lg bg-[#4ECDC4]/10 flex items-center justify-center text-lg flex-shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-xs font-semibold line-clamp-1">{place.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-white/35 text-[10px] flex items-center gap-0.5"><MapPin size={7} />{place.city}</span>
            <span className="text-white/35 text-[10px] flex items-center gap-0.5"><Star size={7} className="text-amber-400 fill-amber-400" />{place.rating_avg?.toFixed(1)}</span>
          </div>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-[#4ECDC4]/15 text-[#4ECDC4] text-[8px] font-bold flex-shrink-0">Ny</span>
      </div>
    </Link>
  );
}

/* ── Create event modal ── */
const KAT_OPTIONS = ["Sport", "Kultur", "Natur", "Musik", "Mad & Drikke", "Spil"];
const KAT_EMOJI: Record<string, string> = { Sport: "⚽", Kultur: "🎭", Natur: "🌿", Musik: "🎵", "Mad & Drikke": "🍽️", Spil: "🎲" };

function CreateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (a: SocialActivity) => void }) {
  const [titel, setTitel] = useState("");
  const [kategori, setKategori] = useState("Sport");
  const [sted, setSted] = useState("");
  const [maxDelt, setMaxDelt] = useState(5);
  const [beskrivelse, setBeskrivelse] = useState("");
  const canSubmit = titel.trim().length > 0 && sted.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    const newActivity: SocialActivity = {
      id: `user-${Date.now()}`,
      title: titel.trim(),
      description: beskrivelse.trim() || `Ny oplevelse i ${sted.trim()}`,
      longDescription: beskrivelse.trim() || `Ny oplevelse oprettet af dig i ${sted.trim()}`,
      emoji: KAT_EMOJI[kategori] || "✨",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop",
      location: sted.trim(),
      distance: "0 km",
      spots: { current: 0, total: maxDelt },
      tags: [kategori.toLowerCase()],
      category: kategori,
    };
    onCreate(newActivity);
    toast({ title: "Din oplevelse er oprettet!" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-[430px] rounded-t-3xl p-5 pb-8" style={{ background: "linear-gradient(to bottom, #1a1f2e, #0D1220)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-lg font-bold">Opret oplevelse</h2>
          <button onClick={onClose} className="p-1"><X size={20} className="text-white/50" /></button>
        </div>
        <div className="space-y-3">
          <input value={titel} onChange={e => setTitel(e.target.value)} placeholder="Titel" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50" />
          <select value={kategori} onChange={e => setKategori(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm focus:outline-none appearance-none">
            {KAT_OPTIONS.map(k => <option key={k} value={k} className="bg-[#1a1f2e] text-white">{KAT_EMOJI[k]} {k}</option>)}
          </select>
          <input value={sted} onChange={e => setSted(e.target.value)} placeholder="Sted" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50" />
          <input type="number" value={maxDelt} onChange={e => setMaxDelt(Math.max(1, Number(e.target.value)))} min={1} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm focus:outline-none" />
          <textarea value={beskrivelse} onChange={e => setBeskrivelse(e.target.value)} placeholder="Beskrivelse (valgfri)" rows={2} className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none resize-none" />
          <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${canSubmit ? "bg-[#4ECDC4] text-white" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>
            Opret
          </button>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════ FEED ═══════════════════ */
export default function Feed() {
  const { selectedTags, priceTier, city } = useTags();
  const [tagEditorOpen, setTagEditorOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [userEvents, setUserEvents] = useState<SocialActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("alle");

  const { data: localEvents } = useQuery<Event[]>({
    queryKey: ["events-local"],
    queryFn: () => Promise.resolve(getEvents()),
  });

  const { data: newestPlaces } = useQuery<Place[]>({
    queryKey: ["supabase-newest-places"],
    queryFn: () => fetchNewestPlaces(5),
    staleTime: 5 * 60 * 1000,
  });

  /* ── Category filter pills ── */
  const categoryPills = [
    { key: "alle", label: "Alle", emoji: "✨" },
    ...ALL_CATEGORIES.slice(0, 5).map(c => ({ key: c.key, label: c.label, emoji: c.emoji })),
  ];

  /* ── Gratis oplevelser (social) ── */
  const filteredSocial = useMemo(() => {
    let list = [...userEvents, ...OPLEVELSER_NAER_DIG];

    // Category filter
    if (activeCategory !== "alle") {
      const cat = ALL_CATEGORIES.find(c => c.key === activeCategory);
      if (cat) {
        const catKeys = [cat.key, ...(cat.subcategories || []).map(s => s.key)];
        list = list.filter(s => s.tags.some(t => catKeys.includes(t)));
      }
    }

    // Tag filter
    if (selectedTags.length > 0) {
      list = list.filter(s => s.tags.some(t => selectedTags.includes(t)));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const tagResults = searchTags(q);
      const expandedTerms = [q, ...tagResults.map(t => t.tag.toLowerCase()), ...tagResults.map(t => t.label.toLowerCase())];
      list = list.filter(s =>
        expandedTerms.some(term =>
          s.title.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term) ||
          s.location.toLowerCase().includes(term) ||
          s.tags.some(t => t.toLowerCase().includes(term))
        )
      );
    }

    return list;
  }, [selectedTags, userEvents, searchQuery, activeCategory]);

  /* ── All events for "Populære nær dig" ── */
  const popularEvents = useMemo(() => {
    const all = localEvents || [];
    return all.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 10);
  }, [localEvents]);

  return (
    <div
      className="relative min-h-svh pb-24"
      style={{ background: "#0D1220" }}
      data-testid="feed-page"
    >
      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(78,205,196,0.08) 0%, transparent 70%)" }} />

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 pt-12 pb-3 px-5" style={{ background: "linear-gradient(to bottom, #0D1220 80%, transparent)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white text-xl font-bold">{getGreeting()}</h1>
            <p className="text-white/40 text-xs mt-0.5">Udforsk oplevelser i dag</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/15 transition-colors" data-testid="button-notifications">
              <Bell size={18} className="text-white/70" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">3</span>
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Søg efter oplevelser..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/40 transition-all"
            data-testid="feed-search"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-white/40" />
            </button>
          )}
        </div>

        {/* ── Category pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categoryPills.map(pill => (
            <button
              key={pill.key}
              onClick={() => setActiveCategory(pill.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === pill.key
                  ? "bg-[#4ECDC4] text-white shadow-md shadow-[#4ECDC4]/20"
                  : "glass-card text-white/60 hover:text-white/80 hover:bg-white/10"
              }`}
              data-testid={`pill-${pill.key}`}
            >
              <span className="text-sm">{pill.emoji}</span>
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 mt-1">

        {/* ═══ GRATIS OPLEVELSER — horizontal scroll ═══ */}
        <section>
          <div className="flex items-center justify-between px-5 mb-3">
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-[#4ECDC4]" />
              <h2 className="text-white font-semibold text-sm">Gratis oplevelser</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#4ECDC4]/15 text-[#4ECDC4] text-[10px] font-bold">{filteredSocial.length} aktive</span>
          </div>
          {filteredSocial.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
              {filteredSocial.slice(0, 8).map(a => <HorizontalEventCard key={a.id} activity={a} />)}
            </div>
          ) : (
            <div className="px-5">
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-white/40 text-xs">
                  {searchQuery ? `Ingen resultater for "${searchQuery}"` : "Ingen oplevelser matcher dine tags"}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ═══ POPULÆRE NÆR DIG — horizontal scroll ═══ */}
        {popularEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between px-5 mb-3">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <h2 className="text-white font-semibold text-sm">Populære nær dig</h2>
              </div>
              <Link href="/udforsk">
                <span className="text-white/30 text-xs flex items-center gap-0.5 hover:text-white/60 cursor-pointer">
                  Se alle <ChevronRight size={12} />
                </span>
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
              {popularEvents.map(e => <PremiumEventCard key={e.id} event={e} />)}
            </div>
          </section>
        )}

        {/* ═══ NYT I DIT OMRÅDE ═══ */}
        {newestPlaces && newestPlaces.length > 0 && (
          <section className="px-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">🆕</span>
              <h2 className="text-white font-semibold text-sm">Nyt i dit område</h2>
            </div>
            <div className="glass-card rounded-2xl divide-y divide-white/5">
              {newestPlaces.map(place => <NewPlaceRow key={place.id} place={place} />)}
            </div>
          </section>
        )}
      </div>

      <FeedTagEditor open={tagEditorOpen} onClose={() => setTagEditorOpen(false)} />
      <CalmBottomNav />

      {/* FAB — create */}
      <div className="fixed bottom-24 right-5 z-[1000]">
        <button
          onClick={() => setCreateOpen(true)}
          className="w-14 h-14 rounded-full bg-[#4ECDC4] shadow-lg shadow-[#4ECDC4]/30 flex items-center justify-center hover:bg-[#3dbdb5] transition-all active:scale-95"
          data-testid="fab-create"
        >
          <Plus size={26} className="text-white" />
        </button>
      </div>

      {createOpen && (
        <CreateModal onClose={() => setCreateOpen(false)} onCreate={a => setUserEvents(prev => [a, ...prev])} />
      )}
    </div>
  );
}
