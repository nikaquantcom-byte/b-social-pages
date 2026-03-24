import { useState } from "react";
import { Link } from "wouter";
import { Settings, Calendar, Heart, Star, ChevronRight, MapPin, Compass, Users, BookOpen } from "lucide-react";
import { useTags } from "@/context/TagContext";
import { CalmBottomNav } from "@/components/CalmBottomNav";
import { useLocation } from "wouter";

/* ═══════════════════════════════════════════════
   MIN SIDE — Gæste-profil (Figma Make version)
   Stats, velkomst-kort, genveje
   ═══════════════════════════════════════════════ */

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 glass-card rounded-2xl p-3 text-center">
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-white/40 text-[10px] mt-0.5">{label}</p>
    </div>
  );
}

function ShortcutRow({ icon: Icon, label, href, color = "text-[#4ECDC4]" }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  color?: string;
}) {
  const [, setLocation] = useLocation();
  return (
    <button
      onClick={() => setLocation(href)}
      className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-white/5 transition-all"
      data-testid={`shortcut-${label.toLowerCase().replace(/\s/g, '-')}`}
    >
      <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
      <span className="flex-1 text-white/80 text-sm font-medium text-left">{label}</span>
      <ChevronRight size={14} className="text-white/20" />
    </button>
  );
}

export default function MinSide() {
  const { city, selectedTags } = useTags();
  const [, setLocation] = useLocation();

  return (
    <div
      className="relative min-h-svh pb-24"
      style={{ background: "#0D1220" }}
      data-testid="min-side-page"
    >
      {/* Accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(78,205,196,0.08) 0%, transparent 70%)" }} />

      {/* ── Header ── */}
      <div className="pt-12 px-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-xl font-bold">Min Side</h1>
          <button onClick={() => setLocation("/indstillinger")} className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/15 transition-colors" data-testid="button-settings">
            <Settings size={18} className="text-white/70" />
          </button>
        </div>

        {/* ── Guest profile card ── */}
        <div className="glass-card rounded-3xl p-5 mb-5">
          <div className="flex items-center gap-4">
            {/* Mint avatar with "G" */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4ECDC4] to-[#3dbdb5] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">G</span>
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg">Gæst</h2>
              <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                <MapPin size={10} /> {city || "Danmark"}
              </p>
            </div>
          </div>

          {/* Tags from onboarding */}
          {selectedTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedTags.slice(0, 6).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-[#4ECDC4]/10 text-[#4ECDC4] text-[10px] font-medium">
                  {tag}
                </span>
              ))}
              {selectedTags.length > 6 && (
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-[10px]">
                  +{selectedTags.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Stats row ── */}
        <div className="flex gap-2.5 mb-5">
          <StatCard value="0" label="Events deltaget" />
          <StatCard value="0" label="Events oprettet" />
          <StatCard value="0" label="Favoritter" />
        </div>

        {/* ── Welcome card ── */}
        <div className="glass-card rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">👋</span>
            <h3 className="text-white font-semibold text-sm">Velkommen til B-Social</h3>
          </div>
          <p className="text-white/40 text-xs leading-relaxed mb-4">
            Log ind for at deltage i events, gemme favoritter og møde nye mennesker.
          </p>
          <Link href="/auth">
            <button className="w-full py-3 rounded-xl bg-[#4ECDC4] text-white font-semibold text-sm hover:bg-[#3dbdb5] transition-colors">
              Log ind eller opret konto
            </button>
          </Link>
        </div>

        {/* ── Genveje ── */}
        <div className="mb-5">
          <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 px-1">Genveje</h3>
          <div className="glass-card rounded-2xl divide-y divide-white/5">
            <ShortcutRow icon={Compass} label="Udforsk oplevelser" href="/udforsk" />
            <ShortcutRow icon={MapPin} label="Kort over Danmark" href="/kort" />
            <ShortcutRow icon={Calendar} label="Kalender" href="/kalender" color="text-blue-400" />
            <ShortcutRow icon={Heart} label="Mine favoritter" href="/favoritter" color="text-pink-400" />
            <ShortcutRow icon={Users} label="Find mennesker" href="/udforsk" color="text-amber-400" />
            <ShortcutRow icon={BookOpen} label="Om B-Social" href="/om" color="text-purple-400" />
          </div>
        </div>
      </div>

      <CalmBottomNav />
    </div>
  );
}
