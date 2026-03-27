import { useState, useEffect, useMemo } from "react";
import FirmaLayout from "@/components/FirmaLayout";
import { Link } from "wouter";
import { Users, Eye, MousePointerClick, UserPlus, CalendarPlus, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Megaphone, BarChart3, Clock, Newspaper, ExternalLink, Loader2 } from "lucide-react";
import { fetchNews, formatNewsTime, type NewsItem } from "@/lib/newsEngine";

const STATS = [
  { label: "Følgere", value: "1.247", change: "+12%", up: true, icon: Users },
  { label: "Event-visninger", value: "8.432", change: "+23%", up: true, icon: Eye },
  { label: "Klik", value: "643", change: "+8%", up: true, icon: MousePointerClick },
  { label: "Tilmeldinger", value: "89", change: "-3%", up: false, icon: UserPlus },
];

const CAMPAIGNS = [
  { id: 1, title: "Sommertræning i parken", status: "aktiv", reach: "2.340", clicks: "187" },
  { id: 2, title: "MTB tur - Rebild", status: "aktiv", reach: "1.890", clicks: "145" },
  { id: 3, title: "Yoga på stranden", status: "draft", reach: "-", clicks: "-" },
  { id: 4, title: "Løbeklub opstart", status: "afsluttet", reach: "4.210", clicks: "312" },
];

const WEEKLY = [
  { day: "Man", views: 890 },
  { day: "Tir", views: 1240 },
  { day: "Ons", views: 980 },
  { day: "Tor", views: 1560 },
  { day: "Fre", views: 2100 },
  { day: "Lør", views: 1890 },
  { day: "Søn", views: 1340 },
];

const UPCOMING_EVENTS = [
  { title: "Sommertræning i parken", date: "2026-04-15", daysUntil: 20 },
  { title: "MTB tur - Rebild", date: "2026-04-20", daysUntil: 25 },
  { title: "Paddle Tennis turnering", date: "2026-04-28", daysUntil: 33 },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    aktiv: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    afsluttet: "bg-white/5 text-muted-foreground border-white/10",
    promoted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${colors[status] || colors.afsluttet}`}>
      {status}
    </span>
  );
}

function WeeklyChart() {
  const maxViews = Math.max(...WEEKLY.map((d) => d.views));
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-sm font-semibold text-white/60 mb-6 uppercase tracking-wider">Visninger denne uge</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {WEEKLY.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
            <div 
              className="w-full rounded-t-lg transition-all relative" 
              style={{ height: `${(d.views / maxViews) * 100}%`, background: 'rgba(78,205,196,0.4)' }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1e2535] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/10">
                {d.views}
              </div>
            </div>
            <span className="text-[10px] text-white/40">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EngagementRing() {
  const views = 8432;
  const clicks = 643;
  const rate = ((clicks / views) * 100).toFixed(1);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (parseFloat(rate) / 100) * circumference;

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold text-white/60 mb-6 uppercase tracking-wider w-full">Engagement Rate</h3>
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="45" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
          <circle cx="64" cy="64" r="45" stroke="#4ECDC4" strokeWidth="10" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-white">{rate}%</span>
        </div>
      </div>
      <p className="text-[10px] text-white/40">{clicks} klik / {views.toLocaleString()} visninger</p>
    </div>
  );
}

export default function FirmaDashboard() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  useEffect(() => {
    setNewsLoading(true);
    fetchNews()
      .then(items => {
        setAllNews(items);
        setNewsLoading(false);
      })
      .catch(() => setNewsLoading(false));
  }, []);

  const relevantNews = useMemo(() => {
    const targetTags = ["cykling", "løb", "outdoor", "fitness", "sport"];
    return allNews.filter(n => 
      n.matchedTags?.some(t => targetTags.includes(t.toLowerCase()))
    ).slice(0, 3);
  }, [allNews]);

  return (
    <FirmaLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Overblik</h1>
            <p className="text-white/40">Velkommen tilbage. Her er din virksomheds performance.</p>
          </div>
          <button className="bg-[#4ECDC4] hover:bg-[#3dbdb5] text-[#0a1929] px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#4ECDC4]/20 flex items-center gap-2 w-fit">
            <Plus size={20} />
            Opret event
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-white/5 text-white/60">
                    <Icon size={20} />
                  </div>
                  <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.up ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly chart + Engagement ring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WeeklyChart />
              <EngagementRing />
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="glass-card p-4 rounded-xl text-center hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <CalendarPlus size={20} />
                </div>
                <div className="text-xs font-bold text-white mb-1">Opret event</div>
                <div className="text-[10px] text-white/30">Nyt event eller aktivitet</div>
              </button>
              <button className="glass-card p-4 rounded-xl text-center hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Megaphone size={20} />
                </div>
                <div className="text-xs font-bold text-white mb-1">Start kampagne</div>
                <div className="text-[10px] text-white/30">Boost dine events</div>
              </button>
              <button className="glass-card p-4 rounded-xl text-center hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <BarChart3 size={20} />
                </div>
                <div className="text-xs font-bold text-white mb-1">Se analytics</div>
                <div className="text-[10px] text-white/30">Detaljeret indsigt</div>
              </button>
              <button className="glass-card p-4 rounded-xl text-center hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UserPlus size={20} />
                </div>
                <div className="text-xs font-bold text-white mb-1">Rekruttering</div>
                <div className="text-[10px] text-white/30">Find frivillige & medarbejdere</div>
              </button>
            </div>

            {/* Upcoming events */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white">Kommende events</h3>
                <button className="text-[10px] font-bold text-[#4ECDC4] uppercase tracking-wider">Se alle</button>
              </div>
              <div className="divide-y divide-white/5">
                {UPCOMING_EVENTS.map((event) => (
                  <div key={event.title} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="text-sm font-bold text-white mb-1">{event.title}</div>
                      <div className="text-[10px] text-white/40 flex items-center gap-2">
                        <Clock size={12} /> {event.date}
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-white/60 uppercase tracking-tighter">
                      om {event.daysUntil} dage
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active campaigns */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-bold text-white">Aktive kampagner</h2>
                <button className="text-xs text-[#4ECDC4] font-medium">Se alle</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAMPAIGNS.filter(c => c.status === "aktiv").map((c) => (
                  <div key={c.id} className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#4ECDC4]/30 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4ECDC4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4">
                      <StatusBadge status={c.status} />
                      <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <h3 className="font-bold text-white mb-4 line-clamp-1">{c.title}</h3>
                    <div className="flex gap-6">
                      <div>
                        <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Rækkevidde</div>
                        <div className="text-lg font-bold text-white">{c.reach}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Klik</div>
                        <div className="text-lg font-bold text-white">{c.clicks}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-8">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={16} className="text-[#4ECDC4]" />
                Top tags denne uge
              </h3>
              <div className="space-y-4">
                {["Cykling", "Løb", "Outdoor", "Yoga", "Vandring"].map((tag, i) => (
                  <div key={tag} className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-white/80">{tag}</span>
                      <span className="text-white/40 text-[10px] tracking-widest">{[342, 287, 234, 189, 156][i]}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#45B7AF] rounded-full"
                        style={{ width: `${(342 - (i * 40)) / 342 * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NYHEDER TIL DIN MÅLGRUPPE WIDGET */}
            <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Newspaper size={16} className="text-[#4ECDC4]" />
                  Nyheder til din målgruppe
                </h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#4ECDC4]/10">
                  <span className="w-1 h-1 rounded-full bg-[#4ECDC4] animate-pulse" />
                  <span className="text-[8px] font-bold text-[#4ECDC4] uppercase">LIVE</span>
                </div>
              </div>

              {newsLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-white/30 text-xs">
                  <Loader2 className="animate-spin" size={20} />
                  Henter branche-nyheder...
                </div>
              ) : relevantNews.length > 0 ? (
                <div className="space-y-4">
                  {relevantNews.map((news) => (
                    <a 
                      key={news.link} 
                      href={news.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all group"
                    >
                      <div className="flex items-center gap-2 text-[9px] text-white/30 font-bold uppercase tracking-widest mb-2">
                        <span>{news.sourceEmoji} {news.source}</span>
                        <span>•</span>
                        <span>{formatNewsTime(news.pubDate)}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white/80 group-hover:text-[#4ECDC4] transition-colors leading-snug line-clamp-2">
                        {news.title}
                      </h4>
                    </a>
                  ))}
                  <button className="w-full py-2 text-[10px] font-bold text-white/40 hover:text-white transition-colors border-t border-white/5 mt-2">
                    Se flere nyheder
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                  <p className="text-white/30 text-[10px]">Ingen aktuelle nyheder til din målgruppe.</p>
                </div>
              )}
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Seneste aktivitet</h3>
              <div className="space-y-6">
                {[
                  { text: "Ny tilmelding til 'Sommertræning i parken'", time: "2 min siden" },
                  { text: "Event 'MTB tur - Rebild' nåede 1.500 visninger", time: "1 time siden" },
                  { text: "3 nye følgere denne uge", time: "3 timer siden" },
                  { text: "Kampagne 'Løbeklub opstart' afsluttet", time: "1 dag siden" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-white/80 leading-relaxed mb-1">{item.text}</div>
                      <div className="text-[10px] text-white/30 font-medium">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FirmaLayout>
  );
}
