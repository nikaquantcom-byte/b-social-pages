import FirmaLayout from "@/components/FirmaLayout";
import { useState } from "react";
import {
  Target,
  Users,
  Search,
  ChevronRight,
  Check,
  X,
  Sparkles,
  MapPin,
  Info,
} from "lucide-react";

interface TagCategory {
  name: string;
  tags: { name: string; reach: number; selected: boolean }[];
}

const INITIAL_CATEGORIES: TagCategory[] = [
  {
    name: "Sport & Fitness",
    tags: [
      { name: "Cykling", reach: 847, selected: false },
      { name: "L\u00f8b", reach: 1234, selected: false },
      { name: "MTB", reach: 623, selected: false },
      { name: "Yoga", reach: 456, selected: false },
      { name: "Sv\u00f8mning", reach: 312, selected: false },
      { name: "Fitness", reach: 1890, selected: false },
      { name: "Padel", reach: 278, selected: false },
      { name: "Crossfit", reach: 189, selected: false },
    ],
  },
  {
    name: "Natur & Outdoor",
    tags: [
      { name: "Vandring", reach: 567, selected: false },
      { name: "Camping", reach: 345, selected: false },
      { name: "Fiskeri", reach: 234, selected: false },
      { name: "Kajak", reach: 178, selected: false },
      { name: "Klatring", reach: 156, selected: false },
      { name: "Shelter", reach: 289, selected: false },
    ],
  },
  {
    name: "Social & Kultur",
    tags: [
      { name: "Br\u00e6tspil", reach: 423, selected: false },
      { name: "Madlavning", reach: 356, selected: false },
      { name: "Musik", reach: 678, selected: false },
      { name: "Kunst", reach: 234, selected: false },
      { name: "Fotografi", reach: 189, selected: false },
    ],
  },
  {
    name: "Aldersgruppe",
    tags: [
      { name: "18-25", reach: 2345, selected: false },
      { name: "26-35", reach: 3456, selected: false },
      { name: "36-50", reach: 2890, selected: false },
      { name: "50+", reach: 1234, selected: false },
    ],
  },
];

export default function FirmaTargeting() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>("Sport & Fitness");

  const toggleTag = (catName: string, tagName: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === catName
          ? { ...cat, tags: cat.tags.map((t) => (t.name === tagName ? { ...t, selected: !t.selected } : t)) }
          : cat
      )
    );
  };

  const selectedTags = categories.flatMap((c) => c.tags.filter((t) => t.selected));
  const totalReach = selectedTags.reduce((sum, t) => sum + t.reach, 0);

  return (
    <FirmaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tag-targeting</h1>
          <p className="text-muted-foreground text-sm mt-1">V\u00e6lg m\u00e5lgruppe-tags for dine kampagner og se estimeret r\u00e6kkevidde.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tag selector */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="S\u00f8g tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {categories.map((cat) => {
              const filteredTags = search
                ? cat.tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
                : cat.tags;
              if (filteredTags.length === 0) return null;
              const isExpanded = expandedCat === cat.name;

              return (
                <div key={cat.name} className="glass-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedCat(isExpanded ? null : cat.name)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium text-sm">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {cat.tags.filter((t) => t.selected).length} valgt
                      </span>
                      <ChevronRight size={16} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredTags.map((tag) => (
                        <button
                          key={tag.name}
                          onClick={() => toggleTag(cat.name, tag.name)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            tag.selected
                              ? "bg-primary/15 border border-primary/30 text-primary"
                              : "bg-white/5 border border-white/5 text-foreground hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {tag.selected && <Check size={14} />}
                            <span>{tag.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{tag.reach.toLocaleString()} brugere</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reach summary sidebar */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4 sticky top-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target size={16} className="text-primary" />
                Estimeret r\u00e6kkevidde
              </h3>

              {selectedTags.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">V\u00e6lg tags for at se estimeret r\u00e6kkevidde</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-primary">{totalReach.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">potentielle brugere</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {selectedTags.map((tag) => (
                      <div key={tag.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>{tag.name}</span>
                        </div>
                        <span className="text-muted-foreground">{tag.reach.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      <p>R\u00e6kkevidde er et estimat baseret p\u00e5 brugere i Nordjylland med matchende interesser.</p>
                    </div>
                  </div>

                  <button className="w-full mt-4 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Anvend p\u00e5 kampagne
                  </button>
                </>
              )}
            </div>

            {/* Auto-suggest */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                Auto-forslag
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Baseret p\u00e5 dine events foresl\u00e5r vi:</p>
              <div className="space-y-2">
                {["Cykling", "Outdoor", "26-35"].map((tag) => (
                  <button key={tag} className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition-colors flex items-center justify-between">
                    <span>{tag}</span>
                    <Plus size={14} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FirmaLayout>
  );
}

function Plus({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
