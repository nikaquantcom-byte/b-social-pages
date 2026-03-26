import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Copy, Check, Users, MousePointerClick, DollarSign, TrendingUp, Loader2 } from "lucide-react";
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
    if (!user) return;
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

  if (!user) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-[#0a0e23]">
        <p className="text-white/50">Log ind for at se dit henvisningspanel</p>
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
      <div className="min-h-svh flex flex-col items-center justify-center bg-[#0a0e23] px-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
            <Users size={32} className="text-white/30" />
          </div>
          <h1 className="text-white text-xl font-bold">Ikke tilg\u00e6ngelig</h1>
          <p className="text-white/50 text-sm">Du er ikke registreret som influencer endnu. Kontakt B-Social for at komme i gang.</p>
          <button
            onClick={() => setLocation("/feed")}
            className="mt-4 px-6 py-3 rounded-2xl bg-[#4ECDC4] text-white font-semibold"
          >
            Tilbage til Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[#0a0e23] text-white">
      {/* Header */}
      <div className="pt-12 px-5 pb-4">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center mb-4"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold">Henvisningspanel</h1>
        <p className="text-white/50 text-sm mt-1">Del dit link og tjen kommission</p>
      </div>

      <div className="px-5 space-y-4 pb-8">
        {/* Referral Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3"
        >
          <p className="text-white/60 text-xs font-medium">Dit henvisningslink</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 text-sm text-white/80 truncate">
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              className="px-4 py-2.5 rounded-xl bg-[#4ECDC4] text-white text-sm font-medium flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Kopieret" : "Kopi\u00e9r"}
            </button>
          </div>
          <p className="text-white/30 text-xs">Kommission: {stats!.commission_pct}% af al omsætning</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <MousePointerClick size={20} className="text-[#4ECDC4] mb-2" />
            <p className="text-2xl font-bold">{stats!.total_clicks}</p>
            <p className="text-white/50 text-xs">Klik</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <Users size={20} className="text-[#4ECDC4] mb-2" />
            <p className="text-2xl font-bold">{stats!.total_referrals}</p>
            <p className="text-white/50 text-xs">Henviste brugere</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <TrendingUp size={20} className="text-[#4ECDC4] mb-2" />
            <p className="text-2xl font-bold">{conversionRate}%</p>
            <p className="text-white/50 text-xs">Konverteringsrate</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <DollarSign size={20} className="text-[#4ECDC4] mb-2" />
            <p className="text-2xl font-bold">{stats!.total_paid_dkk.toFixed(0)} kr</p>
            <p className="text-white/50 text-xs">Udbetalt</p>
          </motion.div>
        </div>

        {/* Pending earnings */}
        {stats!.total_pending_dkk > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-[#4ECDC4]/10 border border-[#4ECDC4]/20"
          >
            <p className="text-[#4ECDC4] text-sm font-medium">Afventer udbetaling</p>
            <p className="text-white text-2xl font-bold mt-1">{stats!.total_pending_dkk.toFixed(2)} kr</p>
          </motion.div>
        )}

        {/* Stripe Connect status */}
        {!stats!.stripe_onboarding_complete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-amber-400 text-sm font-medium">Stripe Connect</p>
            <p className="text-white/50 text-xs mt-1">Opret din Stripe-konto for automatiske udbetalinger.</p>
            <button
              className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium"
              onClick={() => {
                // TODO: Call worker endpoint to get Stripe Connect onboarding URL
                alert("Stripe Connect onboarding kommer snart");
              }}
            >
              Opret Stripe-konto
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
