import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Copy, Check, Users, MousePointerClick, DollarSign, TrendingUp, Loader2, LogIn, Link2, ArrowLeft, Gift } from "lucide-react";
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

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D1220] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4ECDC4]/30 to-[#4ECDC4]/10 border border-[#4ECDC4]/20 mb-6">
              <Link2 size={36} className="text-[#4ECDC4]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Henvisningsprogram</h1>
            <p className="text-white/50 text-base leading-relaxed max-w-sm mx-auto">
              Tjen penge ved at dele B-Social. Få kommission hver gang en person du henviser betaler.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: "20%", label: "Kommission" },
              { value: "Permanent", label: "Binding" },
              { value: "Auto", label: "Udbetaling" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
                <div className="text-[#4ECDC4] font-bold text-lg mb-1">{item.value}</div>
                <div className="text-white/40 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setLocation("/auth")}
            className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold text-base hover:bg-[#3dbdb5] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#4ECDC4]/20 flex items-center justify-center gap-2 mb-3"
          >
            <LogIn size={18} />
            Log ind for at komme i gang
          </button>
          <button
            onClick={() => setLocation("/feed")}
            className="w-full py-3 rounded-2xl bg-white/5 text-white/50 text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Tilbage til Feed
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1220] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#4ECDC4]" />
      </div>
    );
  }

  if (notInfluencer) {
    return (
      <div className="min-h-screen bg-[#0D1220] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 mb-6">
            <Gift size={36} className="text-white/40" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Bliv influencer</h1>
          <p className="text-white/50 mb-8">Du er ikke registreret som influencer endnu. Kontakt B-Social for at blive en del af henvisningsprogrammet.</p>
          <button
            onClick={() => setLocation("/feed")}
            className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold"
          >Tilbage til Feed</button>
        </motion.div>
      </div>
    );
  }

  // Full dashboard
  return (
    <div className="min-h-screen bg-[#0D1220] text-white">
      {/* Header */}
      <div className="border-b border-white/8 bg-[#0D1220]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => setLocation("/feed")}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <Link2 size={20} className="text-[#4ECDC4]" />
            <h1 className="text-lg font-bold">Henvisningspanel</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Referral link card */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60 text-sm font-medium">Dit henvisningslink</p>
            <span className="text-xs bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/20 px-2 py-1 rounded-full">
              {stats!.commission_pct}% kommission
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white/70 text-sm font-mono truncate border border-white/8">
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#4ECDC4] text-white font-medium text-sm hover:bg-[#3dbdb5] transition-all whitespace-nowrap"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Kopieret!" : "Kopier"}
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: MousePointerClick, label: "Klik", value: stats!.total_clicks, color: "text-blue-400" },
            { icon: Users, label: "Henviste brugere", value: stats!.total_referrals, color: "text-green-400" },
            { icon: TrendingUp, label: "Konvertering", value: `${conversionRate}%`, color: "text-purple-400" },
            { icon: DollarSign, label: "Udbetalt", value: `${stats!.total_paid_dkk.toFixed(0)} kr`, color: "text-[#4ECDC4]" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 border border-white/8 rounded-2xl p-5"
            >
              <Icon size={20} className={`${color} mb-3`} />
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-white/50 text-xs">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Pending payout */}
        {stats!.total_pending_dkk > 0 && (
          <div className="bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <span className="text-white/70 text-sm">Afventer udbetaling</span>
            <span className="text-[#4ECDC4] font-bold text-lg">{stats!.total_pending_dkk.toFixed(2)} kr</span>
          </div>
        )}

        {/* Stripe Connect */}
        {!stats!.stripe_onboarding_complete && (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-2">Stripe Connect</h3>
            <p className="text-white/50 text-sm mb-4">Opret din Stripe-konto for automatiske udbetalinger.</p>
            <button
              onClick={() => alert("Stripe Connect onboarding kommer snart")}
              className="px-6 py-3 rounded-xl bg-[#4ECDC4] text-white font-medium text-sm hover:bg-[#3dbdb5] transition-all"
            >
              Opret Stripe-konto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
