import FirmaLayout from "@/components/FirmaLayout";
import { useState } from "react";
import {
  Users,
  UserPlus,
  Briefcase,
  Heart,
  MapPin,
  Clock,
  Search,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Check,
  Star,
  Filter,
  Eye,
  MessageSquare,
  Tag,
  Sparkles,
} from "lucide-react";

type EmploymentType = "volunteer" | "part_time" | "full_time" | "project";
type PositionStatus = "open" | "closed" | "draft";

interface Position {
  id: number;
  title: string;
  description: string;
  employmentType: EmploymentType;
  isVolunteer: boolean;
  city: string;
  tags: string[];
  status: PositionStatus;
  applicants: number;
  matchedCandidates: number;
  createdAt: string;
}

interface Candidate {
  name: string;
  avatar: string;
  city: string;
  tags: string[];
  matchScore: number;
  availableFor: EmploymentType[];
}

const ROLE_TAGS = ["Instruktør", "Turleder", "Fotograf", "Eventplanlægger", "Koordinator", "Træner", "Guide", "Frivillig leder"];
const SKILL_TAGS = ["Førstehjælp", "SoMe", "Kommunikation", "Planlægning", "Outdoor erfaring", "Ledelse", "IT", "Marketing"];
const INTEREST_TAGS = ["Cykling", "Løb", "Vandring", "Yoga", "MTB", "Svømning", "Padel", "Klatring", "Fitness", "Crossfit"];
const LOCATION_TAGS = ["Aalborg", "Aarhus", "København", "Odense", "Hjørring", "Thisted", "Silkeborg", "Randers"];

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  volunteer: "Frivillig",
  part_time: "Deltid",
  full_time: "Fuldtid",
  project: "Projektbaseret",
};

const EMPLOYMENT_COLORS: Record<EmploymentType, string> = {
  volunteer: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  part_time: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  full_time: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  project: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

const STATUS_COLORS: Record<PositionStatus, string> = {
  open: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  closed: "bg-white/5 text-muted-foreground border-white/10",
  draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

const MOCK_POSITIONS: Position[] = [
  { id: 1, title: "Frivillig turleder - MTB", description: "Vi søger en entusiastisk turleder til vores ugentlige MTB-ture i Rebild.", employmentType: "volunteer", isVolunteer: true, city: "Aalborg", tags: ["Turleder", "MTB", "Outdoor erfaring", "Førstehjælp"], status: "open", applicants: 7, matchedCandidates: 23, createdAt: "2026-03-20" },
  { id: 2, title: "Yoga-instruktør (deltid)", description: "Certificeret yoga-instruktør til outdoor-sessioner.", employmentType: "part_time", isVolunteer: false, city: "Aarhus", tags: ["Instruktør", "Yoga", "Kommunikation"], status: "open", applicants: 12, matchedCandidates: 45, createdAt: "2026-03-18" },
  { id: 3, title: "Event-fotograf", description: "Fotograf til at dække vores outdoor-events.", employmentType: "project", isVolunteer: false, city: "København", tags: ["Fotograf", "SoMe", "Kommunikation"], status: "draft", applicants: 0, matchedCandidates: 34, createdAt: "2026-03-25" },
  { id: 4, title: "Frivillig eventkoordinator", description: "Hjælp med at planlægge og afvikle lokale løbe-events.", employmentType: "volunteer", isVolunteer: true, city: "Aalborg", tags: ["Eventplanlægger", "Løb", "Planlægning", "Ledelse"], status: "closed", applicants: 15, matchedCandidates: 38, createdAt: "2026-02-10" },
];

const MOCK_CANDIDATES: Candidate[] = [
  { name: "Mads J.", avatar: "M", city: "Aalborg", tags: ["Turleder", "MTB", "Outdoor erfaring", "Cykling"], matchScore: 96, availableFor: ["volunteer", "part_time"] },
  { name: "Sofie K.", avatar: "S", city: "Aarhus", tags: ["Instruktør", "Yoga", "Kommunikation", "Fitness"], matchScore: 92, availableFor: ["part_time", "full_time"] },
  { name: "Lars P.", avatar: "L", city: "Aalborg", tags: ["Turleder", "Løb", "Førstehjælp", "Vandring"], matchScore: 88, availableFor: ["volunteer"] },
  { name: "Emma H.", avatar: "E", city: "København", tags: ["Fotograf", "SoMe", "Marketing", "Kommunikation"], matchScore: 85, availableFor: ["project", "full_time"] },
  { name: "Mikkel R.", avatar: "M", city: "Hjørring", tags: ["Eventplanlægger", "Planlægning", "Ledelse", "Cykling"], matchScore: 82, availableFor: ["volunteer", "part_time"] },
  { name: "Anna B.", avatar: "A", city: "Odense", tags: ["Træner", "Fitness", "Crossfit", "Førstehjælp"], matchScore: 78, availableFor: ["part_time", "full_time"] },
];

// Tag chip component
function TagChip({ label, selected, onClick }: { label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
        selected
          ? "bg-primary/20 text-primary border-primary/30"
          : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}

// Tag category selector
function TagCategorySelector({
  title,
  icon,
  tags,
  selectedTags,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleTags = expanded ? tags : tags.slice(0, 5);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visibleTags.map((tag) => (
          <TagChip
            key={tag}
            label={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => onToggle(tag)}
          />
        ))}
        {tags.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-2.5 py-1 rounded-full text-xs text-primary hover:bg-primary/10 transition-colors"
          >
            {expanded ? "Vis færre" : `+${tags.length - 5} mere`}
          </button>
        )}
      </div>
    </div>
  );
}

// Match score ring
function MatchRing({ score }: { score: number }) {
  const c = 2 * Math.PI * 16;
  const offset = c - (score / 100) * c;
  const color = score >= 90 ? "#4ECDC4" : score >= 80 ? "#60a5fa" : "#fbbf24";
  return (
    <div className="relative w-10 h-10">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">{score}</span>
      </div>
    </div>
  );
}

export default function FirmaRekruttering() {
  const [activeTab, setActiveTab] = useState<"positions" | "candidates" | "create">("positions");
  const [positions] = useState<Position[]>(MOCK_POSITIONS);
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [filterType, setFilterType] = useState<EmploymentType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<EmploymentType>("volunteer");
  const [newCity, setNewCity] = useState("");
  const [newTags, setNewTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setNewTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 5 ? [...prev, tag] : prev);
  };

  const filteredPositions = positions.filter((p) => {
    if (filterType !== "all" && p.employmentType !== filterType) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getMatchedCandidates = (pos: Position) => {
    return candidates
      .map((c) => ({
        ...c,
        matchScore: c.tags.filter((t) => pos.tags.includes(t)).length * 25 + (c.city === pos.city ? 10 : 0),
      }))
      .filter((c) => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  return (
    <FirmaLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users size={24} className="text-primary" />
              Rekruttering
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Find frivillige og lønnede medarbejdere via tag-matching</p>
          </div>
          <button
            onClick={() => setActiveTab("create")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Opret rolle
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{positions.filter((p) => p.status === "open").length}</div>
            <div className="text-xs text-muted-foreground mt-1">Åbne roller</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{positions.filter((p) => p.isVolunteer).length}</div>
            <div className="text-xs text-muted-foreground mt-1">Frivillige</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{positions.reduce((a, p) => a + p.applicants, 0)}</div>
            <div className="text-xs text-muted-foreground mt-1">Ansøgere</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{candidates.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Matchede profiler</div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg w-fit">
          {(["positions", "candidates", "create"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "positions" ? "Dine roller" : tab === "candidates" ? "Find kandidater" : "Opret rolle"}
            </button>
          ))}
        </div>

        {/* POSITIONS TAB */}
        {activeTab === "positions" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Søg i roller..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex gap-1.5">
                {(["all", "volunteer", "part_time", "full_time", "project"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      filterType === type
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                    }`}
                  >
                    {type === "all" ? "Alle" : EMPLOYMENT_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* Position list */}
            <div className="space-y-3">
              {filteredPositions.map((pos) => (
                <div
                  key={pos.id}
                  className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:bg-white/5 ${
                    selectedPosition?.id === pos.id ? "ring-1 ring-primary/50" : ""
                  }`}
                  onClick={() => setSelectedPosition(selectedPosition?.id === pos.id ? null : pos)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{pos.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${EMPLOYMENT_COLORS[pos.employmentType]}`}>
                          {EMPLOYMENT_LABELS[pos.employmentType]}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_COLORS[pos.status]}`}>
                          {pos.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{pos.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {pos.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={12} />{pos.city}</span>
                        <span className="flex items-center gap-1"><UserPlus size={12} />{pos.applicants} ansøgere</span>
                        <span className="flex items-center gap-1"><Sparkles size={12} />{pos.matchedCandidates} matches</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{pos.createdAt}</span>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${selectedPosition?.id === pos.id ? "rotate-180" : ""}`} />
                  </div>

                  {/* Expanded: show matched candidates */}
                  {selectedPosition?.id === pos.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        Bedste kandidat-matches
                      </h4>
                      <div className="space-y-2">
                        {getMatchedCandidates(pos).slice(0, 4).map((c) => (
                          <div key={c.name} className="flex items-center justify-between p-2 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{c.avatar}</div>
                              <div>
                                <p className="text-sm font-medium">{c.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-0.5"><MapPin size={10} />{c.city}</span>
                                  <span>{c.availableFor.map((t) => EMPLOYMENT_LABELS[t]).join(", ")}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {c.tags.filter((t) => pos.tags.includes(t)).map((t) => (
                                  <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-primary/15 text-primary">{t}</span>
                                ))}
                              </div>
                              <MatchRing score={Math.min(c.matchScore, 99)} />
                              <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                <MessageSquare size={14} className="text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANDIDATES TAB */}
        {activeTab === "candidates" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Search size={16} className="text-primary" />
                Søg efter kandidater via tags
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Vælg tags for at finde de bedste matches blandt B-Social brugere</p>
              <div className="space-y-4">
                <TagCategorySelector title="Rolle" icon={<Briefcase size={14} />} tags={ROLE_TAGS} selectedTags={newTags} onToggle={toggleTag} />
                <TagCategorySelector title="Kompetencer" icon={<Star size={14} />} tags={SKILL_TAGS} selectedTags={newTags} onToggle={toggleTag} />
                <TagCategorySelector title="Interesser" icon={<Heart size={14} />} tags={INTEREST_TAGS} selectedTags={newTags} onToggle={toggleTag} />
                <TagCategorySelector title="Lokation" icon={<MapPin size={14} />} tags={LOCATION_TAGS} selectedTags={newTags} onToggle={toggleTag} />
              </div>
              {newTags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Valgte tags ({newTags.length}/5)</span>
                    <button onClick={() => setNewTags([])} className="text-xs text-muted-foreground hover:text-foreground">Ryd alle</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {newTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 flex items-center gap-1"
                      >
                        {tag} <X size={10} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Candidate results */}
            {newTags.length > 0 && (
              <div className="glass-card rounded-xl">
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    Matchede kandidater
                    <span className="text-xs text-muted-foreground font-normal">({candidates.filter((c) => c.tags.some((t) => newTags.includes(t))).length} fundet)</span>
                  </h3>
                </div>
                <div className="divide-y divide-white/5">
                  {candidates
                    .map((c) => ({ ...c, matchScore: c.tags.filter((t) => newTags.includes(t)).length * 25 }))
                    .filter((c) => c.matchScore > 0)
                    .sort((a, b) => b.matchScore - a.matchScore)
                    .map((c) => (
                      <div key={c.name} className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{c.avatar}</div>
                          <div>
                            <p className="text-sm font-medium">{c.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-0.5"><MapPin size={10} />{c.city}</span>
                              <span>{c.availableFor.map((t) => EMPLOYMENT_LABELS[t]).join(", ")}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {c.tags.map((t) => (
                                <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  newTags.includes(t) ? "bg-primary/15 text-primary font-medium" : "bg-white/5 text-muted-foreground"
                                }`}>{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MatchRing score={Math.min(c.matchScore, 99)} />
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Kontakt">
                            <MessageSquare size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CREATE TAB */}
        {activeTab === "create" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus size={16} className="text-primary" />
                Opret ny rolle
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Titel</label>
                  <input
                    type="text"
                    placeholder="F.eks. 'Frivillig turleder' eller 'Yoga-instruktør'"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Beskrivelse</label>
                  <textarea
                    placeholder="Beskriv rollen og hvad I søger..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(EMPLOYMENT_LABELS) as EmploymentType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setNewType(type)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                            newType === type
                              ? EMPLOYMENT_COLORS[type]
                              : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                          }`}
                        >
                          {type === "volunteer" && <Heart size={12} className="inline mr-1" />}
                          {type !== "volunteer" && <Briefcase size={12} className="inline mr-1" />}
                          {EMPLOYMENT_LABELS[type]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">By</label>
                    <div className="flex flex-wrap gap-1.5">
                      {LOCATION_TAGS.slice(0, 6).map((city) => (
                        <button
                          key={city}
                          onClick={() => setNewCity(city)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            newCity === city
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                          }`}
                        >
                          <MapPin size={10} className="inline mr-0.5" />
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tag selection for new role */}
                <div>
                  <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Tag size={14} className="text-primary" />
                    Tags (vælg op til 5)
                  </label>
                  <div className="space-y-4">
                    <TagCategorySelector title="Rolle" icon={<Briefcase size={14} />} tags={ROLE_TAGS} selectedTags={newTags} onToggle={toggleTag} />
                    <TagCategorySelector title="Kompetencer" icon={<Star size={14} />} tags={SKILL_TAGS} selectedTags={newTags} onToggle={toggleTag} />
                    <TagCategorySelector title="Interesser" icon={<Heart size={14} />} tags={INTEREST_TAGS} selectedTags={newTags} onToggle={toggleTag} />
                  </div>
                  {newTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {newTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 flex items-center gap-1"
                        >
                          {tag} <X size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preview matched candidates */}
                {newTags.length > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Sparkles size={14} className="text-primary" />
                      Estimeret match: {candidates.filter((c) => c.tags.some((t) => newTags.includes(t))).length} kandidater
                    </h4>
                    <div className="flex -space-x-2">
                      {candidates
                        .filter((c) => c.tags.some((t) => newTags.includes(t)))
                        .slice(0, 5)
                        .map((c) => (
                          <div key={c.name} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                            {c.avatar}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Publicer rolle
                  </button>
                  <button className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                    Gem som kladde
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FirmaLayout>
  );
}
