import FirmaLayout from "@/components/FirmaLayout";
import { useState } from "react";
import {
  Plus,
  Search,
  CalendarPlus,
  MapPin,
  Clock,
  Tag,
  Image,
  Megaphone,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

type EventStatus = "draft" | "aktiv" | "afsluttet" | "promoted";

interface FirmaEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  status: EventStatus;
  tags: string[];
  views: number;
  signups: number;
  image?: string;
}

const MOCK_EVENTS: FirmaEvent[] = [
  { id: 1, title: "Sommertr\u00e6ning i parken", date: "2026-04-15", location: "Aalborg, Kildeparken", status: "aktiv", tags: ["Fitness", "Outdoor"], views: 2340, signups: 45, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300" },
  { id: 2, title: "MTB tur - Rebild", date: "2026-04-20", location: "Rebild Bakker", status: "aktiv", tags: ["Cykling", "MTB", "Natur"], views: 1890, signups: 28, image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=300" },
  { id: 3, title: "Yoga p\u00e5 stranden", date: "2026-05-01", location: "Blokhus Strand", status: "draft", tags: ["Yoga", "Wellness"], views: 0, signups: 0 },
  { id: 4, title: "L\u00f8beklub opstart", date: "2026-03-01", location: "Aalborg Storcenter", status: "afsluttet", tags: ["L\u00f8b"], views: 4210, signups: 67 },
  { id: 5, title: "Paddle Tennis turnering", date: "2026-04-28", location: "Aalborg Padel", status: "promoted", tags: ["Padel", "Turnering"], views: 3100, signups: 32 },
];

function StatusBadge({ status }: { status: EventStatus }) {
  const colors: Record<EventStatus, string> = {
    aktiv: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    afsluttet: "bg-white/5 text-muted-foreground border-white/10",
    promoted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${colors[status]}`}>
      {status === "promoted" ? "\u2728 promoted" : status}
    </span>
  );
}

export default function FirmaEvents() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<EventStatus | "alle">("alle");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = MOCK_EVENTS.filter((e) => {
    if (filterStatus !== "alle" && e.status !== filterStatus) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <FirmaLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-muted-foreground text-sm mt-1">Administrer dine events og kampagner.</p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Opret event
          </button>
        </div>

        {/* Create event form (toggle) */}
        {showCreate && (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Nyt event</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Titel</label>
                <input type="text" placeholder="Event titel..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Dato</label>
                <input type="date" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Lokation</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                  <input type="text" placeholder="Adresse..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tags</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
                  <input type="text" placeholder="Tilf\u00f8j tags..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground mb-1 block">Beskrivelse</label>
                <textarea rows={3} placeholder="Beskriv dit event..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Billede</label>
                <div className="border border-dashed border-white/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Image size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Klik for at uploade billede</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                Gem som kladde
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-600/90">
                Publicer event
              </button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-muted-foreground text-sm hover:text-foreground">
                Annuller
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="S\u00f8g events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {(["alle", "aktiv", "draft", "promoted", "afsluttet"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s ? "bg-primary/15 text-primary" : "bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "alle" ? "Alle" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Events list */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1fr_120px_140px_80px_80px_100px_40px] gap-4 px-4 py-3 text-xs text-muted-foreground font-medium border-b border-white/10">
            <span>Event</span>
            <span>Dato</span>
            <span>Lokation</span>
            <span>Visninger</span>
            <span>Tilmeld.</span>
            <span>Status</span>
            <span></span>
          </div>
          <div className="divide-y divide-white/5">
            {filtered.map((event) => (
              <div key={event.id} className="px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="lg:grid lg:grid-cols-[1fr_120px_140px_80px_80px_100px_40px] lg:gap-4 lg:items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {event.image ? (
                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <CalendarPlus size={18} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <div className="flex gap-1 mt-1">
                        {event.tags.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground hidden lg:block">{event.date}</span>
                  <span className="text-sm text-muted-foreground hidden lg:block truncate">{event.location}</span>
                  <span className="text-sm hidden lg:block">{event.views.toLocaleString()}</span>
                  <span className="text-sm hidden lg:block">{event.signups}</span>
                  <div className="hidden lg:block"><StatusBadge status={event.status} /></div>
                  <div className="hidden lg:flex gap-1">
                    <button className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground">
                      <Megaphone size={14} />
                    </button>
                  </div>
                </div>
                {/* Mobile meta */}
                <div className="flex items-center gap-4 mt-2 lg:hidden">
                  <span className="text-xs text-muted-foreground">{event.date}</span>
                  <span className="text-xs text-muted-foreground">{event.location}</span>
                  <StatusBadge status={event.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FirmaLayout>
  );
}
