import FirmaLayout from "@/components/FirmaLayout";
import { useState, useEffect, useMemo } from "react";
import { Target, Users, Search, ChevronRight, Check, X, Sparkles, MapPin, Info, Save, Download, Loader2 } from "lucide-react";
import { TAG_TREE } from "@/lib/tagTree";
import { estimateFirmaReach } from "@/lib/tagEngine";
import { supabase } from "@/lib/supabase";

interface TagWithReach {
  name: string;
  tag: string;
  emoji: string;
  reach: number;
  selected: boolean;
}

interface TagCategory {
  name: string;
  emoji: string;
  tag: string;
  tags: TagWithReach[];
}

interface MatchingPersona {
  navn: string;
  interesser: string[];
  lokation: string;
  avatar: string;
  match: number;
}

export default function FirmaTargeting() {
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [search, setSearch] = useState("");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<{ name: string; tags: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [allUserTags, setAllUserTags] = useState<string[][]>([]);
  const [matchingPersonas, setMatchingPersonas] = useState<MatchingPersona[]>([]);

  // Fetch real profile data from Supabase and build categories from TAG_TREE
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Fetch all profiles with their interests
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, name, interests, city, avatar_url");

      if (error) {
        console.error("FirmaTargeting: error fetching profiles", error);
        setLoading(false);
        return;
      }

      const allProfiles = profiles || [];
      setTotalUsers(allProfiles.length);

      // Collect all user tag arrays for reach estimation
      const userTagArrays = allProfiles
        .map(p => p.interests as string[] | null)
        .filter((tags): tags is string[] => Array.isArray(tags) && tags.length > 0);
      setAllUserTags(userTagArrays);

      // Count how many profiles have each tag in their interests
      const tagCounts = new Map<string, number>();
      for (const tags of userTagArrays) {
        for (const t of tags) {
          const key = t.toLowerCase();
          tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
        }
      }

      // Build categories from TAG_TREE with real reach counts
      const built: TagCategory[] = TAG_TREE.map(parent => ({
        name: parent.label,
        emoji: parent.emoji,
        tag: parent.tag,
        tags: (parent.children || []).map(child => ({
          name: child.label,
          tag: child.tag,
          emoji: child.emoji,
          reach: tagCounts.get(child.tag.toLowerCase()) || 0,
          selected: false,
        })),
      }));

      setCategories(built);

      // Store sample personas from actual profiles
      const samplePersonas: MatchingPersona[] = allProfiles
        .filter(p => p.name && Array.isArray(p.interests) && p.interests.length > 0)
        .slice(0, 5)
        .map(p => ({
          navn: p.name || "Bruger",
          interesser: (p.interests as string[]).slice(0, 3),
          lokation: (p.city as string) || "Nordjylland",
          avatar: (p.name as string)?.[0]?.toUpperCase() || "?",
          match: 0,
        }));
      setMatchingPersonas(samplePersonas);

      // Expand first non-empty category by default
      const firstWithReach = built.find(c => c.tags.some(t => t.reach > 0));
      if (firstWithReach) setExpandedCat(firstWithReach.name);
      else if (built.length > 0) setExpandedCat(built[0].name);

      setLoading(false);
    }

    loadData();
  }, []);

  // Load saved presets
  useEffect(() => {
    try {
      const saved = localStorage.getItem("targeting-presets");
      if (saved) setPresets(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggleTag = (catName: string, tagKey: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.name === catName
          ? { ...cat, tags: cat.tags.map(t => t.tag === tagKey ? { ...t, selected: !t.selected } : t) }
          : cat
      )
    );
  };

  const selectedTags = useMemo(
    () => categories.flatMap(c => c.tags.filter(t => t.selected)),
    [categories]
  );

  // Calculate real reach using tagEngine
  const totalReach = useMemo(() => {
    if (selectedTags.length === 0) return 0;
    const firmaTags = selectedTags.map(t => t.tag);
    return estimateFirmaReach(firmaTags, allUserTags);
  }, [selectedTags, allUserTags]);

  // Update persona match scores when selection changes
  const personas = useMemo(() => {
    if (selectedTags.length === 0) return matchingPersonas.map(p => ({ ...p, match: 0 }));
    const selectedSet = new Set(selectedTags.map(t => t.tag.toLowerCase()));
    return matchingPersonas.map(p => {
      const userTags = p.interesser.map(i => i.toLowerCase());
      const overlap = userTags.filter(t => selectedSet.has(t)).length;
      const match = Math.round((overlap / Math.max(userTags.length, 1)) * 100);
      return { ...p, match };
    }).sort((a, b) => b.match - a.match);
  }, [selectedTags, matchingPersonas]);

  const savePreset = () => {
    if (!presetName || selectedTags.length === 0) return;
    const newPresets = [...presets, { name: presetName, tags: selectedTags.map(t => t.tag) }];
    setPresets(newPresets);
    localStorage.setItem("targeting-presets", JSON.stringify(newPresets));
    setPresetName("");
  };

  const loadPreset = (preset: { name: string; tags: string[] }) => {
    const presetSet = new Set(preset.tags);
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        tags: cat.tags.map(t => ({ ...t, selected: presetSet.has(t.tag) })),
      }))
    );
  };

  const clearAll = () => {
    setCategories(prev =>
      prev.map(cat => ({ ...cat, tags: cat.tags.map(t => ({ ...t, selected: false })) }))
    );
  };

  return (
    <FirmaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tag-targeting</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vælg målgruppe-tags for dine kampagner og se estimeret rækkevidde.
            {totalUsers > 0 && <span className="ml-1">({totalUsers.toLocaleString()} brugere i databasen)</span>}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary mr-2" />
            <span className="text-muted-foreground text-sm">Henter brugerdata...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tag selector */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Søg tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary"
                />
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

              {/* Categories from TAG_TREE */}
              {categories
                .filter(cat => !search || cat.tags.some(t => t.name.toLowerCase().includes(search.toLowerCase())))
                .map((cat) => (
                  <div key={cat.tag} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    <button
                      onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium text-sm">
                        {cat.emoji} {cat.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {cat.tags.filter(t => t.selected).length} valgt
                        </span>
                        <ChevronRight size={14} className={`transition-transform ${expandedCat === cat.name ? "rotate-90" : ""}`} />
                      </div>
                    </button>
                    {expandedCat === cat.name && (
                      <div className="px-4 pb-4 flex flex-wrap gap-2">
                        {cat.tags
                          .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
                          .map((tag) => (
                            <button
                              key={tag.tag}
                              onClick={() => toggleTag(cat.name, tag.tag)}
                              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                                tag.selected
                                  ? "bg-primary/20 border-primary text-primary"
                                  : "bg-white/5 border-white/10 hover:border-white/20"
                              }`}
                            >
                              {tag.selected && <Check size={10} className="inline mr-1" />}
                              {tag.emoji} {tag.name}
                              <span className="ml-1 text-muted-foreground">
                                ({tag.reach.toLocaleString()})
                              </span>
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
                    <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-red-400">
                      <X size={12} className="inline" /> Ryd
                    </button>
                  )}
                </div>
                {selectedTags.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Ingen tags valgt endnu. Klik på tags til venstre.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map((t) => (
                      <span key={t.tag} className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
                        {t.emoji} {t.name}
                        <button onClick={() => {
                          const cat = categories.find(c => c.tags.some(tag => tag.tag === t.tag));
                          if (cat) toggleTag(cat.name, t.tag);
                        }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Reach meter — real data */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Estimeret rækkevidde</span>
                    <span className="text-sm font-bold text-primary">{totalReach.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full transition-all"
                      style={{ width: `${totalUsers > 0 ? Math.min((totalReach / totalUsers) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    af {totalUsers.toLocaleString()} brugere i databasen
                  </p>
                </div>

                {/* Save preset */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Gem som preset..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={savePreset}
                      disabled={!presetName || selectedTags.length === 0}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs disabled:opacity-30"
                    >
                      <Save size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Personas — real profiles */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2"><Sparkles size={14} /> Matchende personas</h3>
                {personas.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Ingen brugerdata tilgængelig.</p>
                ) : (
                  personas.map((p) => (
                    <div key={p.navn} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        {p.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{p.navn}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {p.interesser.join(", ")} – <MapPin size={10} className="inline" /> {p.lokation}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ${p.match > 50 ? "text-green-400" : p.match > 0 ? "text-yellow-400" : "text-muted-foreground"}`}>
                        {p.match}%
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Info */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs text-blue-400 flex items-start gap-2">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  Tags og rækkevidde er baseret på rigtige brugerdata fra B-Social platformen.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FirmaLayout>
  );
              }
