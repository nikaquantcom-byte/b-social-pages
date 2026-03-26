import FirmaLayout from "@/components/FirmaLayout";
import { useState } from "react";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  Heart,
  UserPlus,
  TrendingUp,
  Calendar,
  MapPin,
} from "lucide-react";

type Period = "i dag" | "uge" | "måned" | "alt";

const DAILY_VIEWS = [
  { day: "Man", views: 1640 }, { day: "Tir", views: 1890 },
  { day: "Ons", views: 1420 }, { day: "Tor", views: 2100 },
  { day: "Fre", views: 2450 }, { day: "Lør", views: 1980 },
  { day: "Søn", views: 1060 },
];

const CAMPAIGN_DATA = [
  { name: "Sommertræning i parken", impressions: 2340, clicks: 187, saves: 45, signups: 23, ctr: "8.0%" },
  { name: "MTB tur - Rebild", impressions: 1890, clicks: 145, saves: 38, signups: 18, ctr: "7.7%" },
  { name: "Paddle Tennis turnering", impressions: 3100, clicks: 234, saves: 56, signups: 32, ctr: "7.5%" },
  { name: "Løbeklub opstart", impressions: 4210, clicks: 312, saves: 89, signups: 67, ctr: "7.4%" },
];

const TAG_PERFORMANCE = [
  { tag: "Cykling", impressions: 4230, conversions: 89, rate: "2.1%" },
  { tag: "Fitness", impressions: 3890, conversions: 67, rate: "1.7%" },
  { tag: "Outdoor", impressions: 2340, conversions: 45, rate: "1.9%" },
  { tag: "Løb", impressions: 2100, conversions: 38, rate: "1.8%" },
  { tag: "Yoga", impressions: 1560, conversions: 23, rate: "1.5%" },
];

const GEO_DATA = [
  { city: "Aalborg", users: 3456, pct: 42 },
  { city: "Thisted", users: 1234, pct: 15 },
  { city: "Hjørring", users: 987, pct: 12 },
  { city: "Frederikshavn", users: 856, pct: 10 },
  { city: "Hobro", users: 645, pct: 8 },
  { city: "Nykøbing M", users: 534, pct: 7 },
  { city: "Anden", users: 488, pct: 6 },
];

const FUNNEL = [
  { label: "Impressions", value: 11540, pct: "100%" },
  { label: "Klik", value: 878, pct: "7.6%" },
  { label: "Favoritter", value: 228, pct: "2.0%" },
  { label: "Tilmeldinger", value: 140, pct: "1.2%" },
];

const HEATMAP_DATA = [
  [3, 5, 8, 4, 6, 2, 1],
  [5, 7, 9, 6, 8, 4, 2],
  [8, 9, 7, 8, 10, 6, 3],
  [4, 6, 5, 7, 6, 3, 2],
];
const HEATMAP_TIMES = ["Morgen", "Middag", "Eftermiddag", "Aften"];
const HEATMAP_DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export default function FirmaAnalytics() {
  const [period, setPeriod] = useState<Period>("uge");
  const maxView = Math.max(...DAILY_VIEWS.map((d) => d.views));
  const points = DAILY_VIEWS.map((d, i) => `${(i / 6) * 280 + 10},${140 - (d.views / maxView) * 120}`).join(" ");
  const areaPoints = points + " 290,140 10,140";

  return (
    <FirmaLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground text-sm mt-1">Detaljeret indsigt i dine kampagners performance.</p>
          </div>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(["i dag", "uge", "måned", "alt"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${period === p ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Impressions", value: "11.540", icon: Eye, change: "+18%" },
            { label: "Klik", value: "878", icon: MousePointerClick, change: "+12%" },
            { label: "Gem som favorit", value: "228", icon: Heart, change: "+25%" },
            { label: "Tilmeldinger", value: "140", icon: UserPlus, change: "+9%" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className="text-primary" />
                  <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* SVG Line Chart */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold mb-3">Visninger (7 dage)</h3>
          <svg viewBox="0 0 300 160" className="w-full h-40">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={areaPoints} fill="url(#areaGrad)" />
            <polyline points={points} fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinejoin="round" />
            {DAILY_VIEWS.map((d, i) => (
              <g key={d.day}>
                <circle cx={(i / 6) * 280 + 10} cy={140 - (d.views / maxView) * 120} r="4" fill="#4ECDC4" />
                <text x={(i / 6) * 280 + 10} y={155} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">{d.day}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Engagement Funnel */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold mb-4">Engagement Funnel</h3>
          <div className="space-y-2">
            {FUNNEL.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="w-24 text-right">
                  <p className="text-sm font-medium">{step.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{step.label}</p>
                </div>
                <div className="flex-1 h-8 rounded-lg overflow-hidden bg-white/5">
                  <div className="h-full rounded-lg bg-primary/60 flex items-center justify-end pr-2 transition-all" style={{ width: `${100 - i * 25}%` }}>
                    <span className="text-xs font-medium text-white">{step.pct}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold mb-3">Bedste post-tidspunkter</h3>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-1 min-w-[400px]">
              <div />
              {HEATMAP_DAYS.map((d) => (<div key={d} className="text-xs text-muted-foreground text-center py-1">{d}</div>))}
              {HEATMAP_TIMES.map((time, ti) => (
                <>
                  <div key={time} className="text-xs text-muted-foreground flex items-center">{time}</div>
                  {HEATMAP_DATA[ti].map((val, di) => (
                    <div key={`${ti}-${di}`} className="aspect-square rounded-md flex items-center justify-center text-xs" style={{ backgroundColor: `rgba(78, 205, 196, ${val / 10})` }}>
                      {val}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign performance table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold">Kampagne-performance</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-white/10">
                <th className="text-left px-4 py-2">Kampagne</th>
                <th className="text-left px-4 py-2">Impressions</th>
                <th className="text-left px-4 py-2">Klik</th>
                <th className="text-left px-4 py-2">Favoritter</th>
                <th className="text-left px-4 py-2">Tilmeld.</th>
                <th className="text-left px-4 py-2">CTR</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGN_DATA.map((c) => (
                <tr key={c.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-2 text-sm">{c.name}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{c.impressions.toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{c.clicks}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{c.saves}</td>
                  <td className="px-4 py-2 text-sm text-muted-foreground">{c.signups}</td>
                  <td className="px-4 py-2 text-sm text-primary">{c.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tag performance */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-3">Tag-performance</h3>
            <div className="space-y-3">
              {TAG_PERFORMANCE.map((t) => (
                <div key={t.tag} className="flex items-center justify-between">
                  <span className="text-sm">{t.tag}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{t.impressions.toLocaleString()}</span>
                    <span className="text-xs text-primary font-medium">{t.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geo distribution */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-3">Geografisk fordeling</h3>
            <div className="space-y-2">
              {GEO_DATA.map((g) => (
                <div key={g.city} className="flex items-center justify-between">
                  <span className="text-sm">{g.city}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-primary/20 w-20">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${g.pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">{g.users.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground w-8 text-right">{g.pct}%</span>
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
