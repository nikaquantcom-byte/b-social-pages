import { useState, useMemo, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, ChevronRight, X, Users, Heart, TrendingUp, Star, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/lib/data";
import { getEvents } from "@/lib/data";
import { fetchPlacesWithLimit, type Place } from "@/lib/supabase";
import { getCategoryEmoji, getEventImage, formatDanishDate } from "@/lib/eventHelpers";
import { useTags } from "@/context/TagContext";
import { CalmBottomNav } from "@/components/CalmBottomNav";
import { searchTags, getParentCategories, TAG_TREE } from "@/lib/tagTree";
import { OPLEVELSER_NAER_DIG } from "@/data/feedData";
import type { SocialActivity } from "@/data/feedData";
import { ALL_PINS } from "@/pages/Kort";
import { ALL_CATEGORIES } from "@/data/categories";
import type { Category } from "@/data/categories";

const BRUGERE = [
  { name: "Anna", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop&crop=face" },
  { name: "Mads", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&crop=face" },
  { name: "Sofie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&crop=face" },
  { name: "Jonas", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&crop=face" },
  { name: "Emil", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&crop=face" },
  { name: "Lise", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&crop=face" },
  { name: "Peter", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&crop=face" },
];

/* Category tiles removed — replaced with compact chips */

/* ── Horizontal scroll event card ── */
function PopularCard({ event }: { event: Event }) {
  const isGratis = !event.price || event.price === 0;
  return (
    <Link href={`/event/${event.id}`}>
      <div className="min-w-[170px] max-w-[170px] rounded-2xl overflow-hidden glass-card cursor-pointer hover:scale-[1.02] transition-transform flex-shrink-0">
        <div className="relative h-28">
          <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isGratis ? "bg-[#4ECDC4]/80 text-white" : "bg-amber-500/80 text-white"}`}>
            {isGratis ? "Gratis" : `${event.price} kr`}
          </span>
        </div>
        <div className="p-2.5">
          <h3 className="text-white text-xs font-semibold line-clamp-2 leading-tight">{event.title}</h3>
          <p className="text-white/40 text-[10px] mt-0.5 flex items-center gap-1">
            {getCategoryEmoji(event.category || "")} {event.category}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ── Wide card for "Sker snart" calendar list ── */
function CalendarListCard({ event }: { event: Event }) {
  const isGratis = !event.price || event.price === 0;
  return (
    <Link href={`/event/${event.id}`}>
      <div className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:bg-white/8 transition-all flex gap-3 pr-3">
        <div className="relative w-20 h-20 flex-shrink-0">
          <img src={getEventImage(event)} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex flex-col justify-center py-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-white/50">{getCategoryEmoji(event.category || "")} {event.category}</span>
            <span className={`px-1.5 py-0 rounded-full text-[10px] font-semibold ${isGratis ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-amber-500/20 text-amber-400"}`}>
              {isGratis ? "Gratis" : `${event.price} kr`}
            </span>
          </div>
          <h3 className="text-white text-sm font-semibold line-clamp-1">{event.title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-white/40 text-[11px]">{formatDanishDate(event.date)}</span>
            {event.location && (
              <span className="flex items-center gap-0.5 text-white/30 text-[11px]">
                <MapPin size={9} />{event.location.split(",")[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Trending social item ── */
function TrendingCard({ activity }: { activity: SocialActivity }) {
  return (
    <Link href={`/social/${activity.id}`}>
      <div className="glass-card rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/8 transition-all">
        <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/15 flex items-center justify-center flex-shrink-0 text-xl">
          {activity.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-semibold">{activity.title}</h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-white/40 text-[10px]"><MapPin size={8} />{activity.location}</span>
            <span className="flex items-center gap-0.5 text-white/40 text-[10px]"><Users size={8} />{activity.spots.current}/{activity.spots.total}</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#4ECDC4] text-white text-[9px] font-bold flex-shrink-0">Gratis</span>
      </div>
    </Link>
  );
}

/* ── Supabase places card ── */
const PLACE_CATEGORY_IMAGES: Record<string, string> = {
  natur: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  aktiv_sport: "https://images.unsplash.com/photo-1461896836934-bd45ba3ff2b3?w=400",
  mad_hangout: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
  sport: "https://images.unsplash.com/photo-1461896836934-bd45ba3ff2b3?w=400",
  kultur: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400",
  musik: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
};

function PlaceCard({ place }: { place: Place }) {
  const catImg = PLACE_CATEGORY_IMAGES[place.main_categories?.[0] || "natur"] || PLACE_CATEGORY_IMAGES.natur;
  const catEmoji: Record<string, string> = { natur: "🌿", aktiv_sport: "🏃", mad_hangout: "🍽️", sport: "⚽", kultur: "🎭", musik: "🎵" };
  const emoji = catEmoji[place.main_categories?.[0] || "natur"] || "📍";
  return (
    <Link href={`/sted/${place.id}`}>
      <div className="min-w-[200px] max-w-[200px] rounded-2xl overflow-hidden glass-card cursor-pointer hover:scale-[1.02] transition-transform flex-shrink-0" data-testid={`place-card-${place.id}`}>
        <div className="relative h-28">
          <img src={catImg} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#4ECDC4]/80 text-white text-[10px] font-semibold">
            {emoji} {place.main_categories?.[0] || "Sted"}
          </span>
        </div>
        <div className="p-2.5">
          <h3 className="text-white text-xs font-semibold line-clamp-1 leading-tight">{place.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-white/60 text-[10px]">{place.rating_avg?.toFixed(1) || "–"}</span>
              <span className="text-white/30 text-[9px]">({place.rating_count || 0})</span>
            </div>
            <span className="text-white/30">·</span>
            <span className="text-white/40 text-[10px]">{place.city}</span>
          </div>
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {place.tags.slice(0, 3).map(t => (
                <span key={t} className="px-1.5 py-0.5 rounded-full bg-white/8 text-white/40 text-[8px]">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

const DB_FILTERS: { key: string | null; label: string; emoji: string }[] = [
  { key: null, label: "Alle", emoji: "✨" },
  { key: "natur", label: "Natur", emoji: "🌿" },
  { key: "strand", label: "Strand", emoji: "🏖️" },
  { key: "hundeskov", label: "Hundeskov", emoji: "🐕" },
  { key: "sport", label: "Sport", emoji: "🏃" },
  { key: "kultur", label: "Kultur", emoji: "🎭" },
  { key: "mad", label: "Mad", emoji: "🍽️" },
];

const PLACE_CAT_EMOJI: Record<string, string> = {
  natur: "🌿", aktiv_sport: "🏃", mad_hangout: "🍽️", sport: "⚽", kultur: "🎭", musik: "🎵",
  strand: "🏖️", badning: "🏊", hundeskov: "🐕", hund: "🐕", shelter: "⛺", fiskeri: "🎣",
  loeb: "🏃", mtb: "🚵", vandring: "🥾", mad: "🍽️", fitness: "💪", outdoor: "🌲",
};

function SupabasePlacesSection() {
  const [dbFilter, setDbFilter] = useState<string | null>(null);
  const { data: places, isLoading } = useQuery<Place[]>({
    queryKey: ["supabase-places-50"],
    queryFn: () => fetchPlacesWithLimit(50),
    staleTime: 5 * 60 * 1000,
  });

  const filteredPlaces = useMemo(() => {
    if (!places) return [];
    if (!dbFilter) return places;
    return places.filter(p => {
      const cats = (p.main_categories || []).map(c => c.toLowerCase());
      const tags = (p.tags || []).map(t => t.toLowerCase());
      const all = [...cats, ...tags];
      return all.some(t => t.includes(dbFilter));
    });
  }, [places, dbFilter]);

  if (isLoading) return (
    <section className="px-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">📍</span>
        <h2 className="text-white font-semibold text-sm">Steder i dit område</h2>
      </div>
      <div className="flex items-center gap-2 text-white/40 text-xs">
        <Loader2 size={14} className="animate-spin" /> Henter steder...
      </div>
    </section>
  );

  if (!places || places.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between px-5 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">📍</span>
          <h2 className="text-white font-semibold text-sm">Steder i dit område</h2>
          <span className="px-1.5 py-0.5 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] text-[9px] font-bold">{places.length}</span>
        </div>
        <Link href="/kort">
          <span className="text-white/30 text-xs flex items-center gap-0.5 hover:text-white/60 transition-colors cursor-pointer">
            Kort <ChevronRight size={12} />
          </span>
        </Link>
      </div>
      {/* v25 Category filter chips */}
      <div className="flex gap-1.5 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
        {DB_FILTERS.map((f) => (
          <button
            key={f.key || "alle"}
            onClick={() => setDbFilter(f.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              dbFilter === f.key
                ? "bg-[#4ECDC4] text-white shadow-lg shadow-[#4ECDC4]/20"
                : "glass-card text-white/60 hover:text-white"
            }`}
            data-testid={`db-filter-${f.key || "alle"}`}
          >
            <span className="text-xs">{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>
      {/* Place cards grid */}
      <div className="grid grid-cols-2 gap-2.5 px-5">
        {filteredPlaces.slice(0, 20).map(p => {
          const mainCat = p.main_categories?.[0] || "natur";
          const emoji = PLACE_CAT_EMOJI[mainCat] || "📍";
          return (
            <Link key={p.id} href={`/sted/${p.id}`}>
              <div className="glass-card rounded-2xl p-3 cursor-pointer hover:bg-white/10 transition-all" data-testid={`db-place-${p.id}`}>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg mb-2">
                  {emoji}
                </div>
                <h3 className="text-white text-xs font-semibold line-clamp-1 leading-tight">{p.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-white/60 text-[10px]">{p.rating_avg?.toFixed(1) || "–"}</span>
                  </div>
                  <span className="text-white/30">·</span>
                  <span className="text-white/40 text-[10px] truncate">{p.city}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {filteredPlaces.length === 0 && (
        <div className="px-5 py-4 text-center">
          <span className="text-white/40 text-xs">Ingen steder i denne kategori</span>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════ UDFORSK ═══════════════════ */
export default function Udforsk() {
  const { selectedTags } = useTags();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: events } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => Promise.resolve(getEvents()),
  });

  const allEvents = events || [];

  /* ── Filter events by active category or search (TAG-TREE AWARE) ── */
  const filtered = useMemo(() => {
    // Expand search query through tag tree
    const q = search.toLowerCase().trim();
    let expandedTerms: string[] = q ? [q] : [];
    if (q) {
      const tagResults = searchTags(q);
      expandedTerms = [q, ...tagResults.map(t => t.tag.toLowerCase()), ...tagResults.map(t => t.label.toLowerCase())];
    }
    
    return allEvents.filter((e) => {
      const matchSearch = !q ||
        expandedTerms.some(term =>
          (e.title || "").toLowerCase().includes(term) ||
          (e.description || "").toLowerCase().includes(term) ||
          (e.location || "").toLowerCase().includes(term) ||
          (e.interest_tags || []).some(t => t.toLowerCase().includes(term)) ||
          (e.category || "").toLowerCase().includes(term)
        );
      const matchCat = !activeCategory ||
        (e.interest_tags || []).some(t => t.toLowerCase().includes(activeCategory)) ||
        (e.category || "").toLowerCase().includes(activeCategory);
      return matchSearch && matchCat;
    });
  }, [allEvents, search, activeCategory]);

  const popular = [...filtered].sort((a, b) => (b.max_participants || 0) - (a.max_participants || 0)).slice(0, 10);
  const comingSoon = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 6);
  const trendingSocial = OPLEVELSER_NAER_DIG.slice(0, 4);

  function pickTag(tag: string) {
    setActiveCategory(tag);
    setSearch("");
    setSearchFocused(false);
    searchRef.current?.blur();
  }

  return (
    <div
      className="relative min-h-svh pb-24"
      style={{
        background: "#0D1220",
      }}
      data-testid="udforsk-page"
    >
      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(78,205,196,0.08) 0%, transparent 70%)" }} />

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 pt-12 pb-3 px-5" style={{ background: "linear-gradient(to bottom, #0D1220 80%, transparent)" }}>
        <div className="mb-3">
          <h1 className="text-white text-2xl font-bold">Udforsk</h1>
          <p className="text-white/50 text-sm">Find din næste oplevelse</p>
        </div>

        {/* Big search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Søg events, steder, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/50"
            data-testid="input-search"
          />
          {(search || searchFocused) && (
            <button onClick={() => { setSearch(""); setSearchFocused(false); setActiveCategory(null); searchRef.current?.blur(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ SEARCH OVERLAY: tags when focused ═══ */}
      {searchFocused && !search && (
        <div className="px-5 pb-4">
          <p className="text-white/50 text-[11px] uppercase tracking-wider font-semibold mb-2.5">Hvad fanger dig?</p>
          <div className="flex flex-wrap gap-2">
            {getParentCategories().map((dt) => (
              <button key={dt.tag} onClick={() => pickTag(dt.tag)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full glass-card text-white/70 text-xs font-medium hover:bg-white/10 hover:text-white transition-all">
                <span>{dt.emoji}</span>
                <span>{dt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SEARCH ACTIVE: grouped results ═══ */}
      {search && (
        <div className="px-5 pb-4 space-y-4">
          {/* Kategorier */}
          {(() => {
            const results = searchTags(search);
            if (results.length === 0) return null;
            return (
              <div>
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Kategorier</p>
                <div className="flex flex-wrap gap-2">
                  {results.slice(0, 6).map((t) => {
                    const isParentCat = TAG_TREE.some(p => p.tag === t.tag);
                    return (
                      <button key={t.tag} onClick={() => pickTag(t.tag)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/15 transition-all ${
                          isParentCat ? "glass-card text-white/90 border-white/20" : "bg-white/5 text-white/70 hover:text-white"
                        }`}>
                        <span>{t.emoji}</span>
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Events */}
          {filtered.length > 0 && (
            <div>
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Events</p>
              <div className="space-y-2">
                {filtered.slice(0, 3).map(e => <CalendarListCard key={e.id} event={e} />)}
              </div>
              {filtered.length > 3 && (
                <button className="text-[#4ECDC4] text-xs font-medium mt-2">Se alle {filtered.length} events →</button>
              )}
            </div>
          )}

          {/* Steder */}
          {(() => {
            const q = search.toLowerCase();
            const tagResults = searchTags(q);
            const expandedPlaceTerms = [q, ...tagResults.map(t => t.tag.toLowerCase()), ...tagResults.map(t => t.label.toLowerCase())];
            const matchedPlaces = ALL_PINS.filter(p => expandedPlaceTerms.some(term => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term) || (p.tags && p.tags.some(t => t.toLowerCase().includes(term))))).slice(0, 3);
            if (matchedPlaces.length === 0) return null;
            const catEmoji: Record<string, string> = { sport: "⚽", kultur: "🎭", natur: "🌿", musik: "🎵", mad: "🍽️", spil: "🎲", events: "🎉", mtb: "🚵", vandring: "🥾", loeb: "🏃", hund: "🐕", fiskeri: "🎣", badning: "🏊", shelter: "⛺", dyrespot: "🦌", kreativt: "🖌️", fitness: "💪", outdoor: "🌲", socialt: "❤️", karriere: "💼", tech: "💻", rejser: "🚆", logi: "🏕️", wellness: "🧘", communities: "👥", ture: "🥾", aktiv: "⚽" };
            return (
              <div>
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Steder</p>
                <div className="space-y-2">
                  {matchedPlaces.map(p => (
                    <Link key={p.id} href="/kort">
                      <div className="flex items-center gap-3 p-2.5 rounded-xl glass-card hover:bg-white/8 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">{catEmoji[p.category] || "📍"}</div>
                        <div>
                          <span className="text-white text-xs font-medium block">{p.name}</span>
                          <span className="text-white/40 text-[10px]">{p.category}</span>
                        </div>
                        <MapPin size={12} className="ml-auto text-white/30" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Brugere */}
          {(() => {
            const q = search.toLowerCase();
            const matchedUsers = BRUGERE.filter(b => b.name.toLowerCase().includes(q)).slice(0, 3);
            if (matchedUsers.length === 0) return null;
            return (
              <div>
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Brugere</p>
                <div className="space-y-2">
                  {matchedUsers.map(b => (
                    <div key={b.name} className="flex items-center gap-3 p-2.5 rounded-xl glass-card hover:bg-white/8 transition-colors cursor-pointer">
                      <img src={b.avatar} alt={b.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-white text-xs font-medium">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* No results */}
          {filtered.length === 0 && searchTags(search).length === 0 && (
            <div className="text-center py-8">
              <span className="text-3xl">🔍</span>
              <p className="text-white/50 text-sm mt-2">Ingen resultater for "{search}"</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ MAIN DISCOVERY CONTENT (no search) ═══ */}
      {!search && !searchFocused && (
        <div className="space-y-6 mt-1">

          {/* Active category indicator */}
          {activeCategory && (
            <div className="mx-5 flex items-center justify-between glass-card rounded-2xl px-4 py-2.5">
              <span className="text-white text-sm font-medium">{getCategoryEmoji(activeCategory)} Viser: {activeCategory}</span>
              <button onClick={() => setActiveCategory(null)} className="text-[#4ECDC4] text-xs font-medium">Vis alle ×</button>
            </div>
          )}

          {/* ══ Kategori-chips — kompakte, scrollbare ══ */}
          {!activeCategory && (
            <section className="px-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">🗂️</span>
                <h2 className="text-white font-semibold text-sm">Kategorier</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setLocation(`/kategori/${cat.key}`)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card hover:bg-white/10 transition-all text-left"
                    data-testid={`cat-chip-${cat.key}`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-white/80 text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ═══ STEDER FRA DATABASEN ═══ */}
          {!activeCategory && <SupabasePlacesSection />}

          {/* ── Trending nær dig ── */}
          <section className="px-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-[#4ECDC4]" />
              <h2 className="text-white font-semibold text-sm">Trending nær dig</h2>
            </div>
            <div className="space-y-2">
              {trendingSocial.map((s) => <TrendingCard key={s.id} activity={s} />)}
            </div>
          </section>

          {/* ── Populære oplevelser: horizontal scroll ── */}
          {popular.length > 0 && (
            <section>
              <div className="flex items-center justify-between px-5 mb-2.5">
                <h2 className="text-white font-semibold text-sm">🔥 Populære oplevelser</h2>
                <span className="text-white/30 text-xs flex items-center gap-0.5">Se alle <ChevronRight size={12} /></span>
              </div>
              <div className="flex gap-3 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
                {popular.map(e => <PopularCard key={e.id} event={e} />)}
              </div>
            </section>
          )}

          {/* ── Sker snart: calendar-style list ── */}
          {comingSoon.length > 0 && (
            <section className="px-5">
              <h2 className="text-white font-semibold text-sm mb-3">📅 Sker snart</h2>
              <div className="space-y-2">
                {comingSoon.map(e => <CalendarListCard key={e.id} event={e} />)}
              </div>
            </section>
          )}

          {/* Empty state */}
          {activeCategory && filtered.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center px-5">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-white/60 text-sm">Ingen oplevelser fundet</p>
              <button onClick={() => setActiveCategory(null)} className="mt-2 text-[#4ECDC4] text-sm font-medium">Vis alle kategorier</button>
            </div>
          )}
        </div>
      )}

      <CalmBottomNav />
    </div>
  );
}
