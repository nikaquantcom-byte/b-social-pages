import FirmaLayout from "@/components/FirmaLayout";
import { useState, useEffect, useMemo } from "react";
import {
  Check,
  ArrowRight,
  Receipt,
  Zap,
  Crown,
  Building2,
  Heart,
  TrendingUp,
  Sparkles,
  Loader2,
  Percent,
  Gift,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

type Plan = "starter" | "vaekst" | "partner";

interface PlanDef {
  id: Plan;
  name: string;
  tagline: string;
  price: string;
  revenueShare: string;
  revenueSharePct: number;
  highlight?: boolean;
  icon: typeof Heart;
  color: string;
  features: string[];
  idealFor: string;
}

const PLANS: PlanDef[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Helt gratis — altid",
    price: "0 kr/md",
    revenueShare: "0%",
    revenueSharePct: 0,
    icon: Heart,
    color: "text-emerald-400",
    features: [
      "Op til 3 aktive events",
      "Basis statistik",
      "Firmaprofil",
      "Tag-targeting (basis)",
    ],
    idealFor: "Små foreninger, klubber, frivillige",
  },
  {
    id: "vaekst",
    name: "Vækst",
    tagline: "Ingen faste omkostninger",
    price: "0 kr/md",
    revenueShare: "5%",
    revenueSharePct: 5,
    highlight: true,
    icon: Zap,
    color: "text-[#4ECDC4]",
    features: [
      "Ubegrænsede events",
      "Fuld analytics dashboard",
      "Avanceret tag-targeting",
      "Promoted events (betalt reach)",
      "Email support",
    ],
    idealFor: "Voksende virksomheder, padel-centre, yoga-studier",
  },
  {
    id: "partner",
    name: "Partner",
    tagline: "Lavere rate for volumen",
    price: "0 kr/md",
    revenueShare: "3%",
    revenueSharePct: 3,
    icon: Crown,
    color: "text-purple-400",
    features: [
      "Alt i Vækst",
      "Dedicated account manager",
      "Custom integrationer",
      "API-adgang",
      "Multi-lokation support",
      "Prioriteret support",
    ],
    idealFor: "Større arrangører, festivaler, kæder",
  },
];

interface RevenueMonth {
  month: string;
  revenue: number;
  bsocialShare: number;
  status: "settled" | "pending";
}

export default function FirmaFakturering() {
  const { user, companyId } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan>("starter");
  const [loading, setLoading] = useState(true);
  const [changingPlan, setChangingPlan] = useState(false);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [revenueHistory, setRevenueHistory] = useState<RevenueMonth[]>([]);

  // Load company plan from Supabase
  useEffect(() => {
    async function load() {
      if (!user?.id) { setLoading(false); return; }

      // Fetch company
      let cId = companyId;
      if (!cId) {
        const { data } = await supabase
          .from("companies")
          .select("id, plan")
          .eq("created_by", user.id)
          .limit(1)
          .single();
        if (data) {
          cId = data.id;
          const p = data.plan as Plan;
          if (["starter", "vaekst", "partner"].includes(p)) setCurrentPlan(p);
        }
      } else {
        const { data } = await supabase
          .from("companies")
          .select("plan")
          .eq("id", cId)
          .single();
        if (data) {
          const p = data.plan as Plan;
          if (["starter", "vaekst", "partner"].includes(p)) setCurrentPlan(p);
        }
      }

      // Try to load revenue data (table may not exist yet)
      try {
        const { data: revData } = await supabase
          .from("company_revenue")
          .select("month, revenue, bsocial_share, status")
          .eq("company_id", cId)
          .order("month", { ascending: false })
          .limit(12);

        if (revData && revData.length > 0) {
          setRevenueHistory(revData.map((r: any) => ({
            month: r.month,
            revenue: r.revenue || 0,
            bsocialShare: r.bsocial_share || 0,
            status: r.status || "settled",
          })));
          // Current month revenue
          const now = new Date();
          const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
          const currentEntry = revData.find((r: any) => r.month === currentMonth);
          if (currentEntry) setMonthlyRevenue(currentEntry.revenue || 0);
        }
      } catch {
        // Table doesn't exist yet — that's fine
      }

      setLoading(false);
    }
    load();
  }, [user?.id, companyId]);

  const currentPlanDef = PLANS.find((p) => p.id === currentPlan)!;
  const bsocialShare = Math.round(monthlyRevenue * (currentPlanDef.revenueSharePct / 100));

  async function handlePlanChange(newPlan: Plan) {
    if (newPlan === currentPlan || changingPlan) return;
    setChangingPlan(true);

    const cId = companyId;
    if (cId) {
      await supabase
        .from("companies")
        .update({ plan: newPlan })
        .eq("id", cId);
    }

    setCurrentPlan(newPlan);
    setChangingPlan(false);
  }

  if (loading) {
    return (
      <FirmaLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </FirmaLayout>
    );
  }

  return (
    <FirmaLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Fakturering</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Du betaler kun når du tjener penge. Alle pakker er gratis at starte.
          </p>
        </div>

        {/* Revenue share banner */}
        <div className="glass-card rounded-xl p-5 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Percent size={24} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{currentPlanDef.name}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/15 text-primary border border-primary/20">
                    {currentPlanDef.revenueShare} revenue share
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentPlanDef.revenueSharePct === 0
                    ? "Ingen omkostninger — hverken faste eller variable"
                    : `B-Social tager ${currentPlanDef.revenueShare} af billetindtægter via platformen`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                <Gift size={12} />
                GRATIS
              </span>
            </div>
          </div>
        </div>

        {/* Monthly revenue overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Din omsætning denne måned</p>
            <p className="text-2xl font-bold">{monthlyRevenue.toLocaleString("da-DK")} kr</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">B-Social andel ({currentPlanDef.revenueShare})</p>
            <p className="text-2xl font-bold">{bsocialShare.toLocaleString("da-DK")} kr</p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Dit udbytte</p>
            <p className="text-2xl font-bold text-emerald-400">{(monthlyRevenue - bsocialShare).toLocaleString("da-DK")} kr</p>
          </div>
        </div>

        {/* Competitor comparison */}
        <div className="glass-card rounded-xl p-4 border border-blue-500/10 bg-blue-500/5">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-300">Sammenlign med alternativer</p>
              <p className="text-xs text-muted-foreground mt-1">
                Hos Billetto betaler du 2% + 7 kr per billet. Hos Eventbrite op til 6,95% + 4,49 kr per billet.
                <br />
                Hos B-Social betaler du kun {currentPlanDef.revenueShare} — og kun af det du sælger via os. Ingen faste gebyrer, ingen per-billet-tillæg.
              </p>
            </div>
          </div>
        </div>

        {/* Plans grid */}
        <div>
          <h2 className="font-semibold mb-1">Vælg din pakke</h2>
          <p className="text-xs text-muted-foreground mb-4">Alle pakker er gratis at starte. Opgrader eller nedgrader når som helst.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`glass-card rounded-xl p-5 flex flex-col relative transition-all ${
                    plan.highlight ? "border border-primary/30 ring-1 ring-primary/20" : ""
                  } ${isCurrent ? "ring-1 ring-primary/40" : ""}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                      Mest populær
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className={plan.color} />
                    <h3 className="font-bold">{plan.name}</h3>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{plan.tagline}</p>

                  {/* Price & revenue share */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">0 kr</span>
                      <span className="text-xs text-muted-foreground">/md</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Sparkles size={12} className={plan.color} />
                      <span className="text-sm font-semibold">
                        {plan.revenueSharePct === 0
                          ? "Ingen revenue share"
                          : `${plan.revenueShare} af omsætning via B-Social`}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 flex-1 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-white/5 mb-4">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <TrendingUp size={10} />
                      Perfekt til: {plan.idealFor}
                    </p>
                  </div>

                  {isCurrent ? (
                    <div className="px-3 py-2.5 rounded-lg bg-primary/10 text-primary text-sm text-center font-medium flex items-center justify-center gap-2">
                      <Check size={14} />
                      Nuværende pakke
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={changingPlan}
                      className="px-3 py-2.5 rounded-lg bg-white/5 text-sm text-foreground hover:bg-white/10 transition-colors text-center flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {changingPlan ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ArrowRight size={14} />
                      )}
                      {PLANS.findIndex((p) => p.id === plan.id) > PLANS.findIndex((p) => p.id === currentPlan)
                        ? "Opgrader"
                        : "Skift til denne"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue history / invoices */}
        <div className="glass-card rounded-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Receipt size={16} className="text-primary" />
              Omsætningshistorik
            </h2>
          </div>
          {revenueHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Måned</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Omsætning</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">B-Social andel</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Dit udbytte</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {revenueHistory.map((r) => (
                    <tr key={r.month} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium">{r.month}</td>
                      <td className="px-4 py-3 text-right">{r.revenue.toLocaleString("da-DK")} kr</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{r.bsocialShare.toLocaleString("da-DK")} kr</td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-medium">{(r.revenue - r.bsocialShare).toLocaleString("da-DK")} kr</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${
                          r.status === "settled"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                            : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                        }`}>
                          {r.status === "settled" ? "Afregnet" : "Afventer"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Receipt size={28} className="mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground font-medium">Ingen fakturering endnu</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Du betaler først når du har omsætning via B-Social. Opret events og begynd at sælge!
              </p>
            </div>
          )}
        </div>

        {/* Value proposition footer */}
        <div className="glass-card rounded-xl p-5 bg-gradient-to-r from-primary/5 to-purple-500/5 border border-white/5">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Du betaler kun når du tjener penge</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Alle pakker er 100% gratis at starte. B-Social tjener kun, når du tjener.
                Ingen bindingsperiode, ingen skjulte gebyrer, ingen overraskelser.
                Start gratis og opgrader når din forretning vokser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FirmaLayout>
  );
}
