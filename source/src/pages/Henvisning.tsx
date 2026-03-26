import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, Check, Users, MousePointerClick, DollarSign, TrendingUp, Loader2, LogIn, Link2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface DashboardStats {
  code: string;
  commission_pct: number;
  total_referrals: number;
  total_clicks: number;
  total_paid_dkk: number;
  total_pending_dkk: number;
  stripe_onboarding_complete: boolean;
}

export default function Henvisning() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [notInfluencer, setNotInfluencer] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadStats();
  }, [user]);

  async function loadStats() {
    const { data, error } = await supabase
      .from("influencer_dashboard")
      .select("*")
      .eq("user_id", user!.id)
      .single();
    if (error || !data) {
      setNotInfluencer(true);
    } else {
      setStats({
        code: data.code,
        commission_pct: data.commission_pct,
        total_referrals: Number(data.total_referrals),
        total_clicks: Number(data.total_clicks),
        total_paid_dkk: Number(data.total_paid_dkk),
        total_pending_dkk: Number(data.total_pending_dkk),
        stripe_onboarding_complete: data.stripe_onboarding_complete,
      });
    }
    setLoading(false);
  }

  const referralLink = stats ? `https://b-social.net/?ref=${stats.code}` : "";

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const conversionRate = stats && stats.total_clicks > 0
    ? ((stats.total_referrals / stats.total_clicks) * 100).toFixed(1)
    : "0";

  // Not logged in - show nice CTA
  if (!user) {
    return (
      <div className="min-h-svh bg-[#0a0e23] text-white flex flex-col">
        <div className="pt-12 px-5">
          <button onClick={() => window.history.back()} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 max-w-sm">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4ECDC4]/20 to-[#4ECDC4]/5 border border-[#4ECDC4]/20 flex items-center justify-center mx-auto">
              <Link2 size={36} className="text-[#4ECDC4]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Henvisningsprogram</h1>
              <p className="text-white/50 text-sm leading-relaxed">Tjen penge ved at dele B-Social. F\u00e5 kommission hver gang en person du henviser betaler.</p>
            </div>
            <div className="space-y-3 w-full">
              <button onClick={() => setLocation("/auth")} className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold text-base hover:bg-[#3dbdb5] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#4ECDC4]/20 flex items-center justify-center gap-2">
                <LogIn size={18} />
                Log ind for at komme i gang
              </button>
              <button onClick={() => setLocation("/feed")} className="w-full py-3 rounded-2xl bg-white/5 text-white/50 text-sm font-medium hover:bg-white/10 transition-all">
                Tilbage til Feed
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <p className="text-[#4ECDC4] text-lg font-bold">20%</p>
                <p className="text-white/40 text-[10px]">Kommission</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <p className="text-[#4ECDC4] text-lg font-bold">Permanent</p>
                <p className="text-white/40 text-[10px]">Binding</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <p className="text-[#4ECDC4] text-lg font-bold">Auto</p>
                <p className="text-white/40 text-[10px]">Udbetaling</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-[#0a0e23]">
        <Loader2 className="animate-spin text-[#4ECDC4]" size={32} />
      </div>
    );
  }

  if (notInfluencer) {
    return (
      <div className="min-h-svh bg-[#0a0e23] text-white flex flex-col">
        <div className="pt-12 px-5">
          <button onClick={() => window.history.back()} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5 max-w-sm">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto">
              <Users size={36} className="text-white/30" />
            </div>
            <div>
              <h1 className="text-xl font-bold mb-2">Bliv influencer</h1>
              <p className="text-white/50 text-sm leading-relaxed">Du er ikke registreret som influencer endnu. Kontakt B-Social for at blive en del af henvisningsprogrammet og begynde at tjene kommission.</p>
            </div>
            <button onClick={() => setLocation("/feed")} className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold">
              Tilbage til Feed
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[#0a0e23] text-white">
      <div className="pt-12 px-5 pb-4">
        <button onClick={() => window.history.back()} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold">Henvisningspanel</h1>
        <p className="text-white/50 text-sm mt-1">Del dit link og tjen kommission</p>
      </div>
      <div className="px-5 space-y-4 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <p className="text-white/60 text-xs font-medium">Dit henvisningslink</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 text-sm text-white/80 truncate">{referralLink}</div>
            <button onClick={copyLink} className="px-4 py-2.5 rounded-xl bg-[#4ECDC4] text-white text-sm font-medium flex items-center gap-1.5 shrink-0">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Kopieret" : "Kopier"}
            </button>
          </div>
          <p className="text-white/30 text-xs">Kommission: {stats!.commission_pct}% af al omsaetning</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {[{ icon: MousePointerClick, val: stats!.total_clicks, label: "Klik", d: 0.1 },
            { icon: Users, val: stats!.total_referrals, label: "Henviste brugere", d: 0.15 },
            { icon: TrendingUp, val: `${conversionRate}%`, label: "Konverteringsrate", d: 0.2 },
            { icon: DollarSign, val: `${stats!.total_paid_dkk.toFixed(0)} kr`, label: "Udbetalt", d: 0.25 },
          ].map(({ icon: Icon, val, label, d }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d }} className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <Icon size={20} className="text-[#4ECDC4] mb-2" />
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-white/50 text-xs">{label}</p>
            </motion.div>
          ))}
        </div>
        {stats!.total_pending_dkk > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-2xl bg-[#4ECDC4]/10 border border-[#4ECDC4]/20">
            <p className="text-[#4ECDC4] text-sm font-medium">Afventer udbetaling</p>
            <p className="text-white text-2xl font-bold mt-1">{stats!.total_pending_dkk.toFixed(2)} kr</p>
          </motion.div>
        )}
        {!stats!.stripe_onboarding_complete && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-400 text-sm font-medium">Stripe Connect</p>
            <p className="text-white/50 text-xs mt-1">Opret din Stripe-konto for automatiske udbetalinger.</p>
            <button className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium" onClick={() => alert("Stripe Connect onboarding kommer snart")}>Opret Stripe-konto</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
