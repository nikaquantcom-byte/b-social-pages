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

type Period = "i dag" | "uge" | "m\u00e5ned" | "alt";

const CAMPAIGN_DATA = [
  { name: "Sommertr\u00e6ning i parken", impressions: 2340, clicks: 187, saves: 45, signups: 23, ctr: "8.0%" },
  { name: "MTB tur - Rebild", impressions: 1890, clicks: 145, saves: 38, signups: 18, ctr: "7.7%" },
  { name: "Paddle Tennis turnering", impressions: 3100, clicks: 234, saves: 56, signups: 32, ctr: "7.5%" },
  { name: "L\u00f8beklub opstart", impressions: 4210, clicks: 312, saves: 89, signups: 67, ctr: "7.4%" },
];

const TAG_PERFORMANCE = [
  { tag: "Cykling", impressions: 4230, conversions: 89, rate: "2.1%" },
  { tag: "Fitness", impressions: 3890, conversions: 67, rate: "1.7%" },
  { tag: "Outdoor", impressions: 2340, conversions: 45, rate: "1.9%" },
  { tag: "L\u00f8b", impressions: 2100, conversions: 38, rate: "1.8%" },
  { tag: "Yoga", impressions: 1560, conversions: 23, rate: "1.5%" },
];

const GEO_DATA = [
  { city: "Aalborg", users: 3456, pct: 42 },
  { city: "Thisted", users: 1234, pct: 15 },
  { city: "Hj\u00f8rring", users: 987, pct: 12 },
  { city: "Frederikshavn", users: 856, pct: 10 },
  { city: "Hobro", users: 645, pct: 8 },
  { city: "Nyk\u00f8bing M", users: 534, pct: 7 },
  { city: "Anden", users: 488, pct: 6 },
];

export default function FirmaAnalytics() {
  const [period, setPeriod] = useState<Period>("uge");

  return (
    <FirmaLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground text-sm mt-1">Detaljeret indsigt i dine kampagners performance.</p>
          </div>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(["i dag", "uge", "m\u00e5ned", "alt"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  period === p ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Campaign performance table */}
        <div className="glass-card rounded-xl">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              Kampagne-performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Kampagne</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Impressions</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Klik</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Favoritter</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Tilmeld.</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {CAMPAIGN_DATA.map((c) => (
                  <tr key={c.name} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{c.impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{c.clicks}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{c.saves}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{c.signups}</td>
                    <td className="px-4 py-3 text-right text-primary font-medium">{c.ctr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tag performance */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Tag-performance
            </h3>
            <div className="space-y-3">
              {TAG_PERFORMANCE.map((t) => (
                <div key={t.tag} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm w-16">{t.tag}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(t.impressions / 4230) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 ml-4">
                    <span className="text-xs text-muted-foreground w-16 text-right">{t.impressions.toLocaleString()}</span>
                    <span className="text-xs text-primary w-12 text-right">{t.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geo distribution */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              Geografisk fordeling
            </h3>
            <div className="space-y-3">
              {GEO_DATA.map((g) => (
                <div key={g.city} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm w-28">{g.city}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${g.pct * 2.4}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <span className="text-xs text-muted-foreground w-12 text-right">{g.users.toLocaleString()}</span>
                    <span className="text-xs text-foreground w-8 text-right">{g.pct}%</span>
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
