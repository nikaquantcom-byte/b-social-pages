import FirmaLayout from "@/components/FirmaLayout";
import { Link } from "wouter";
import {
  Users,
  Eye,
  MousePointerClick,
  UserPlus,
  CalendarPlus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";

const STATS = [
  { label: "F\u00f8lgere", value: "1.247", change: "+12%", up: true, icon: Users },
  { label: "Event-visninger", value: "8.432", change: "+23%", up: true, icon: Eye },
  { label: "Klik", value: "643", change: "+8%", up: true, icon: MousePointerClick },
  { label: "Tilmeldinger", value: "89", change: "-3%", up: false, icon: UserPlus },
];

const CAMPAIGNS = [
  { id: 1, title: "Sommertr\u00e6ning i parken", status: "aktiv", reach: "2.340", clicks: "187" },
  { id: 2, title: "MTB tur - Rebild", status: "aktiv", reach: "1.890", clicks: "145" },
  { id: 3, title: "Yoga p\u00e5 stranden", status: "draft", reach: "-", clicks: "-" },
  { id: 4, title: "L\u00f8beklub opstart", status: "afsluttet", reach: "4.210", clicks: "312" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    aktiv: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    afsluttet: "bg-white/5 text-muted-foreground border-white/10",
    promoted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${colors[status] || colors.draft}`}>
      {status}
    </span>
  );
}

export default function FirmaDashboard() {
  return (
    <FirmaLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Overblik</h1>
            <p className="text-muted-foreground text-sm mt-1">Velkommen tilbage. Her er din virksomheds performance.</p>
          </div>
          <Link href="/firma/events" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} />
            Opret event
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Active campaigns */}
        <div className="glass-card rounded-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold">Aktive kampagner</h2>
            <Link href="/firma/events" className="text-primary text-sm hover:underline">
              Se alle
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {CAMPAIGNS.map((c) => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarPlus size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground">R\u00e6kkevidde: {c.reach}</span>
                      <span className="text-xs text-muted-foreground">Klik: {c.clicks}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Top tags denne uge
            </h3>
            <div className="space-y-2">
              {["Cykling", "L\u00f8b", "Outdoor", "Yoga", "Vandring"].map((tag, i) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm">{tag}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-primary/20 w-24">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${100 - i * 18}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{[342, 287, 234, 189, 156][i]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-3">Seneste aktivitet</h3>
            <div className="space-y-3">
              {[
                { text: "Ny tilmelding til 'Sommertr\u00e6ning i parken'", time: "2 min siden" },
                { text: "Event 'MTB tur - Rebild' n\u00e5ede 1.500 visninger", time: "1 time siden" },
                { text: "3 nye f\u00f8lgere denne uge", time: "3 timer siden" },
                { text: "Kampagne 'L\u00f8beklub opstart' afsluttet", time: "1 dag siden" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FirmaLayout>
  );
}
