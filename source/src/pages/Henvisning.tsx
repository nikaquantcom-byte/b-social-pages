import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Copy, Check, Users, MousePointerClick, DollarSign, TrendingUp, Loader2, LogIn, Link2, ArrowLeft, Gift, Tag, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTags } from "@/context/TagContext";
import { supabase, fetchEvents, type Event } from "@/lib/supabase";
import { getReferralTagMatch, getTagNode } from "@/lib/tagEngine";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

interface DashboardStats {
  code: string;
  commission_pct: number;
  total_referrals: number;
  total_clicks: number;
  total_paid_dkk: number;
  total_pending_dkk: number;
  stripe_onboarding_complete: boolean;
}

interface ReferredUser {
  id: string;
  name: string | null;
  avatar_url: string | null;
  interests: string[] | null;
  created_at: string;
}

export default function Henvisning() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, profile } = useAuth();
  const { selectedTags } = useTags();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [notInfluencer, setNotInfluencer] = useState(false);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [sharedEvents, setSharedEvents] = useState<Event[]>([]);

  const myTags = profile?.interests || selectedTags || [];

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
      setLoading(false);
      return;
    }
    setStats({
      code: data.code,
      commission_pct: data.commission_pct,
      total_referrals: Number(data.total_referrals),
      total_clicks: Number(data.total_clicks),
      total_paid_dkk: Number(data.total_paid_dkk),
      total_pending_dkk: Number(data.total_pending_dkk),
      stripe_onboarding_complete: data.stripe_onboarding_complete,
    });

    // Load referred users with their tags
    const { data: refs } = await supabase
      .from("referrals")
      .select("referred_user_id")
      .eq("referrer_id", user!.id);
    if (refs && refs.length > 0) {
      const ids = refs.map((r: any) => r.referred_user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, interests, created_at")
        .in("id", ids)
        .order("created_at", { ascending: false })
        .limit(10);
      if (profiles) setReferredUsers(profiles);
    }

    // Load events matching referrer's tags for "shared events" section
    if (myTags.length > 0) {
      const events = await fetchEvents();
      const tagSet = new Set(myTags.map((tag: string) => tag.toLowerCase()));
      const matched = events.filter((e) =>
        e.interest_tags?.some((tag) => tagSet.has(tag.toLowerCase()))
      ).slice(0, 4);
      setSharedEvents(matched);
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
            <h1 className="text-3xl font-bold text-white mb-3">{t('referral.program_title')}</h1>
            <p className="text-white/50 text-base leading-relaxed max-w-sm mx-auto">
              {t('referral.program_description')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { value: "20%", label: t('referral.commission') },
              { value: t('referral.permanent'), label: t('referral.binding') },
              { value: t('referral.auto'), label: t('referral.payout') },
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
            {t('referral.log_in_to_start')}
          </button>
          <button
            onClick={() => setLocation("/feed")}
            className="w-full py-3 rounded-2xl bg-white/5 text-white/50 text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            {t('referral.back_to_feed')}
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
          <h1 className="text-2xl font-bold text-white mb-3">{t('referral.become_influencer')}</h1>
          <p className="text-white/50 mb-8">{t('referral.not_influencer_yet')}</p>
          <button
            onClick={() => setLocation("/feed")}
            className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold"
          >{t('referral.back_to_feed')}</button>
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
            <h1 className="text-lg font-bold">{t('referral.dashboard_title')}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Referral link card */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/60 text-sm font-medium">{t('referral.your_referral_link')}</p>
            <span className="text-xs bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/20 px-2 py-1 rounded-full">
              {stats!.commission_pct}% {t('referral.commission')}
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
              {copied ? t('referral.copied') : t('referral.copy')}
            </button>
          </div>
        </div>

        {/* Your tag profile */}
        {myTags.length > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Tag size={16} className="text-[#4ECDC4]" />
              {t('referral.your_tag_profile')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {myTags.map((tag: string) => {
                const node = getTagNode(tag);
                return (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/20">
                    {node?.emoji && <span className="mr-1">{node.emoji}</span>}
                    {node?.label || tag}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: MousePointerClick, label: t('referral.clicks'), value: stats!.total_clicks, color: "text-blue-400" },
            { icon: Users, label: t('referral.referred_users'), value: stats!.total_referrals, color: "text-green-400" },
            { icon: TrendingUp, label: t('referral.conversion'), value: `${conversionRate}%`, color: "text-purple-400" },
            { icon: DollarSign, label: t('referral.paid_out'), value: `${stats!.total_paid_dkk.toFixed(0)} kr`, color: "text-[#4ECDC4]" },
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

        {/* Referred users with tag match */}
        {referredUsers.length > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-2xl mb-6 overflow-hidden">
            <div className="p-5 border-b border-white/8">
              <h3 className="font-semibold flex items-center gap-2">
                <Users size={16} className="text-green-400" />
                {t('referral.referred_users')}
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {referredUsers.map((ru) => {
                const matchPct = myTags.length > 0 && ru.interests
                  ? getReferralTagMatch(myTags, ru.interests)
                  : 0;
                const sharedTags = ru.interests?.filter((tag) =>
                  myTags.some((mt: string) => mt.toLowerCase() === tag.toLowerCase())
                ) || [];

                return (
                  <div key={ru.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {ru.avatar_url ? (
                        <img src={ru.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                          {(ru.name || "?")[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{ru.name || t('referral.anonymous')}</p>
                        {sharedTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {sharedTags.slice(0, 3).map((tag) => {
                              const node = getTagNode(tag);
                              return (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#4ECDC4]/10 text-[#4ECDC4]">
                                  {node?.emoji} {node?.label || tag}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    {matchPct > 0 && (
                      <div className="text-right">
                        <div className={`text-sm font-bold ${matchPct >= 70 ? "text-green-400" : matchPct >= 40 ? "text-yellow-400" : "text-white/50"}`}>
                          {matchPct}%
                        </div>
                        <div className="text-[10px] text-white/40">tag match</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shared-tag events to promote */}
        {sharedEvents.length > 0 && (
          <div className="bg-white/5 border border-white/8 rounded-2xl mb-6 overflow-hidden">
            <div className="p-5 border-b border-white/8">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar size={16} className="text-[#4ECDC4]" />
                {t('referral.events_matching_tags')}
              </h3>
              <p className="text-xs text-white/40 mt-1">{t('referral.share_events_tip')}</p>
            </div>
            <div className="divide-y divide-white/5">
              {sharedEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setLocation(`/event/${ev.id}`)}
                  className="w-full px-5 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  {ev.image_url ? (
                    <img src={ev.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white/30 flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ev.title}</p>
                    <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                      <span>{new Date(ev.date).toLocaleDateString("da-DK", { day: "numeric", month: "short" })}</span>
                      {ev.interest_tags?.slice(0, 2).map((tag) => {
                        const node = getTagNode(tag);
                        return (
                          <span key={tag} className="px-1.5 py-0.5 rounded-full bg-[#4ECDC4]/10 text-[#4ECDC4] text-[10px]">
                            {node?.emoji} {node?.label || tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pending payout */}
        {stats!.total_pending_dkk > 0 && (
          <div className="bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <span className="text-white/70 text-sm">{t('referral.pending_payout')}</span>
            <span className="text-[#4ECDC4] font-bold text-lg">{stats!.total_pending_dkk.toFixed(2)} kr</span>
          </div>
        )}

        {/* Stripe Connect */}
        {!stats!.stripe_onboarding_complete && (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-2">Stripe Connect</h3>
            <p className="text-white/50 text-sm mb-4">{t('referral.stripe_description')}</p>
            <button
              onClick={() => alert(t('referral.stripe_coming_soon'))}
              className="px-6 py-3 rounded-xl bg-[#4ECDC4] text-white font-medium text-sm hover:bg-[#3dbdb5] transition-all"
            >
              {t('referral.create_stripe_account')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
                          }
