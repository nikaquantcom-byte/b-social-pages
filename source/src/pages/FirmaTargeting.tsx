import FirmaLayout from "@/components/FirmaLayout";
import { useState, useEffect } from "react";
import { Target, Users, Search, ChevronRight, Check, X, Sparkles, MapPin, Info, Save, Download, Plus } from "lucide-react";

interface TagCategory {
  name: string;
  tags: { name: string; reach: number; selected: boolean }[];
}

const INITIAL_CATEGORIES: TagCategory[] = [
  { name: "Sport & Fitness", tags: [
    { name: "Cykling", reach: 847, selected: false }, { name: "Løb", reach: 1234, selected: false },
    { name: "MTB", reach: 623, selected: false }, { name: "Yoga", reach: 456, selected: false },
    { name: "Svømning", reach: 312, selected: false }, { name: "Fitness", reach: 1890, selected: false },
    { name: "Padel", reach: 278, selected: false }, { name: "Crossfit", reach: 189, selected: false },
  ] },
  { name: "Natur & Outdoor", tags: [
    { name: "Vandring", reach: 567, selected: false }, { name: "Camping", reach: 345, selected: false },
    { name: "Fiskeri", reach: 234, selected: false }, { name: "Kajak", reach: 178, selected: false },
    { name: "Klatring", reach: 156, selected: false }, { name: "Shelter", reach: 289, selected: false },
  ] },
  { name: "Social & Kultur", tags: [
    { name: "Brætspil", reach: 423, selected: false }, { name: "Madlavning", reach: 356, selected: false },
    { name: "Musik", reach: 678, selected: false }, { name: "Kunst", reach: 234, selected: false },
    { name: "Fotografi", reach: 189, selected: false },
  ] },
  { name: "Aldersgruppe", tags: [
    { name: "18-25", reach: 2345, selected: false }, { name: "26-35", reach: 3456, selected: false },
    { name: "36-50", reach: 2890, selected: false }, { name: "50+", reach: 1234, selected: false },
  ] },
];

const PERSONAS = [
  { navn: "Mads, 31", interesser: ["Cykling", "MTB"], lokation: "Aalborg", avatar: "M", match: 94 },
  { navn: "Sofie, 27", interesser: ["Yoga", "Wellness"], lokation: "Hjørring", avatar: "S", match: 87 },
  { navn: "Lars, 45", interesser: ["Løb", "Fitness"], lokation: "Thisted", avatar: "L", match: 79 },
];

export default function FirmaTargeting() {
  const [categories, setCategories] = useState<TagCategory[]>(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>("Sport & Fitness");
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<{ name: string; tags: string[] }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("targeting-presets");
    if (saved) setPresets(JSON.parse(saved));
  }, []);

  const toggleTag = (catName: string, tagName: string) => {
    setCategories((prev) => prev.map((cat) => cat.name === catName ? { ...cat, tags: cat.tags.map((t) => (t.name === tagName ? { ...t, selected: !t.selected } : t)) } : cat));
  };

  const selectedTags = categories.flatMap((c) => c.tags.filter((t) => t.selected));
  const totalReach = selectedTags.reduce((sum, t) => sum + t.reach, 0);

  const savePreset = () => {
    if (!presetName || selectedTags.length === 0) return;
    const newPresets = [...presets, { name: presetName, tags: selectedTags.map((t) => t.name) }];
    setPresets(newPresets);
    localStorage.setItem("targeting-presets", JSON.stringify(newPresets));
    setPresetName("");
  };

  const loadPreset = (preset: { name: string; tags: string[] }) => {
    setCategories((prev) => prev.map((cat) => ({ ...cat, tags: cat.tags.map((t) => ({ ...t, selected: preset.tags.includes(t.name) })) })));
  };

  const clearAll = () => {
    setCategories((prev) => prev.map((cat) => ({ ...cat, tags: cat.tags.map((t) => ({ ...t, selected: false })) })));
  };

  return (
    <FirmaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tag-targeting</h1>
          <p className="text-muted-foreground text-sm mt-1">Vælg målgruppe-tags for dine kampagner og se estimeret rækkevidde.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tag selector */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input type="text" placeholder="Søg tags..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary" />
            </div>

            {/* Presets */}
            {presets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button key={p.name} onClick={() => loadPreset(p)} className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Download size={10} className="inline mr-1" />{p.name}
                  </button>
                ))}
              </div>
            )}

            {/* Categories */}
            {categories.filter((cat) => !search || cat.tags.some((t) => t.name.toLowerCase().includes(search.toLowerCase()))).map((cat) => (
              <div key={cat.name} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <button onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                  <span className="font-medium text-sm">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{cat.tags.filter((t) => t.selected).length} valgt</span>
                    <ChevronRight size={14} className={`transition-transform ${expandedCat === cat.name ? "rotate-90" : ""}`} />
                  </div>
                </button>
                {expandedCat === cat.name && (
                  <div className="px-4 pb-4 flex flex-wrap gap-2">
                    {cat.tags.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase())).map((tag) => (
                      <button key={tag.name} onClick={() => toggleTag(cat.name, tag.name)} className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        tag.selected ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}>
                        {tag.selected && <Check size={10} className="inline mr-1" />}
                        {tag.name}
                        <span className="ml-1 text-muted-foreground">({tag.reach.toLocaleString()})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected tags & reach */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm flex items-center gap-2"><Target size={14} /> Valgte tags</h3>
                {selectedTags.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-red-400"><X size={12} className="inline" /> Ryd</button>
                )}
              </div>
              {selectedTags.length === 0 ? (
                <p className="text-xs text-muted-foreground">Ingen tags valgt endnu. Klik på tags til venstre.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map((t) => (
                    <span key={t.name} className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
                      {t.name}
                      <button onClick={() => {
                        const cat = categories.find((c) => c.tags.some((tag) => tag.name === t.name));
                        if (cat) toggleTag(cat.name, t.name);
                      }}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}

              {/* Reach meter */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Estimeret rækkevidde</span>
                  <span className="text-sm font-bold text-primary">{totalReach.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all" style={{ width: `${Math.min((totalReach / 10000) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">af ~10.000 brugere i Nordjylland</p>
              </div>

              {/* Save preset */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input type="text" placeholder="Gem som preset..." value={presetName} onChange={(e) => setPresetName(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-primary" />
                  <button onClick={savePreset} disabled={!presetName || selectedTags.length === 0} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs disabled:opacity-30">
                    <Save size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Personas */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
              <h3 className="font-medium text-sm flex items-center gap-2"><Sparkles size={14} /> Matchende personas</h3>
              {PERSONAS.map((p) => (
                <div key={p.navn} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{p.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{p.navn}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.interesser.join(", ")} - <MapPin size={10} className="inline" /> {p.lokation}</p>
                  </div>
                  <span className="text-xs font-medium text-green-400">{p.match}%</span>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs text-blue-400 flex items-start gap-2">
                <Info size={14} className="mt-0.5 shrink-0" />
                Tags bruges til at målrette dine kampagner og events mod de rette brugergrupper.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FirmaLayout>
  );
}
