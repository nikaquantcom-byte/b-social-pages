import { useState } from "react";
import { Search, MessageCircle, Users, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CalmBottomNav } from "@/components/CalmBottomNav";
import { Link } from "wouter";

/* ═══════════════════════════════════════════════
   BESKEDER — Gæste-placeholder
   Log ind for at se dine beskeder
   ═══════════════════════════════════════════════ */

export default function Beskeder() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"direkte" | "grupper">("direkte");

  return (
    <div
      className="relative min-h-svh pb-24"
      style={{ background: "#0D1220" }}
      data-testid="beskeder-page"
    >
      {/* ── Header ── */}
      <div className="pt-14 pb-4 px-5">
        <h1 className="text-white text-xl font-bold mb-4">{t('chat.messages')}</h1>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder={t('chat.search_messages')}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/40"
            data-testid="beskeder-search"
          />
        </div>

        {/* Tabs: Direkte / Grupper */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("direkte")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "direkte"
                ? "bg-[#4ECDC4]/20 text-[#4ECDC4] border border-[#4ECDC4]/30"
                : "glass-card text-white/50 hover:text-white/70"
            }`}
          >
            <MessageCircle size={14} />
            {t('chat.direct')}
          </button>
          <button
            onClick={() => setActiveTab("grupper")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "grupper"
                ? "bg-[#4ECDC4]/20 text-[#4ECDC4] border border-[#4ECDC4]/30"
                : "glass-card text-white/50 hover:text-white/70"
            }`}
          >
            <Users size={14} />
            {t('chat.groups')}
          </button>
        </div>
      </div>

      {/* ── Guest message ── */}
      <div className="px-5 mt-8">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-[#4ECDC4]/60" />
          </div>
          <h2 className="text-white font-semibold text-base mb-2">{t('auth.login_required')}</h2>
          <p className="text-white/40 text-xs leading-relaxed mb-6">
            {t('auth.login_required_desc')}
          </p>
          <Link href="/auth">
            <button className="w-full py-3.5 rounded-xl bg-[#4ECDC4] text-white font-semibold text-sm hover:bg-[#3dbdb5] transition-colors">
              {t('auth.login')}
            </button>
          </Link>
        </div>
      </div>

      <CalmBottomNav />
    </div>
  );
}
