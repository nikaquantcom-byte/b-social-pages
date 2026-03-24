import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { AALBORG_INSPIRATION } from "@/data/feedData";
import { ALL_PLACES, CATEGORY_META } from "@/data/places";
import type { Place } from "@/data/places";

export default function Inspiration() {
  const [, setLocation] = useLocation();

  // Get a diverse selection of places
  const featuredPlaces: Place[] = [];
  const categories = ["strand", "shelter", "mtb", "vandring", "havnebad", "naturlegeplads", "klatring", "hundeskov", "naturpark"] as const;
  for (const cat of categories) {
    const items = ALL_PLACES.filter(p => p.category === cat);
    if (items.length) {
      featuredPlaces.push(items[0]);
      if (items.length > 1) featuredPlaces.push(items[1]);
    }
  }

  return (
    <div
      className="relative min-h-svh pb-12"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(10,14,35,0.80) 0%, rgba(10,14,35,0.90) 100%),
          url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
      }}
      data-testid="inspiration-page"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 pt-12 pb-3 px-5 flex items-center gap-3" style={{ background: "linear-gradient(to bottom, rgba(10,14,35,0.95) 60%, transparent)" }}>
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center flex-shrink-0"
          data-testid="button-back"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <h1 className="text-white text-xl font-bold">Inspiration</h1>
          <p className="text-white/40 text-xs">Opdag oplevelser i dit område</p>
        </div>
      </div>

      <div className="px-5 space-y-6 mt-2">
        {/* Lokale highlights */}
        <section>
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[11px]">🏙️</span>
            Lokale highlights
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {AALBORG_INSPIRATION.filter(i => i.type === "sted").map((item) => (
              <div key={item.id} className="rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/20">
                <div className="relative h-[140px]">
                  <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-bold leading-tight">{item.title}</h3>
                    <p className="text-white/50 text-[10px] mt-0.5 line-clamp-2">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Festivals */}
        <section>
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[11px]">🎵</span>
            Festivaler i Nordjylland
          </h2>
          <div className="space-y-3">
            {AALBORG_INSPIRATION.filter(i => i.type === "festival").map((item) => (
              <div key={item.id} className="rounded-2xl overflow-hidden glass-card group cursor-pointer shadow-lg shadow-black/20">
                <div className="relative h-[160px]">
                  <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-purple-500/80 backdrop-blur-sm text-white text-[10px] font-semibold">
                    Festival
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-base font-bold leading-tight">{item.title}</h3>
                    <p className="text-white/60 text-xs mt-1">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Steder i hele Danmark */}
        <section>
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center text-[11px]">🌿</span>
            Steder i hele Danmark
          </h2>
          <div className="space-y-3">
            {featuredPlaces.slice(0, 12).map((place) => {
              const meta = CATEGORY_META[place.category];
              return (
                <div key={place.id} className="flex gap-3 glass-card rounded-2xl p-3 cursor-pointer hover:bg-white/10 transition-all">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-white text-sm font-semibold truncate">{place.name}</h3>
                      {place.free && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] text-[9px] font-bold flex-shrink-0">Gratis</span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs line-clamp-1">{place.subtitle}</p>
                    <span className="text-white/30 text-[10px] mt-1">{meta.emoji} {meta.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
