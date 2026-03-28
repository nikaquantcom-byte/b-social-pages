import { useState } from "react";
import { ArrowLeft, User, Bell, Shield, Globe, LogOut, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

import { useTranslation } from 'react-i18next';

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mb-2 px-1">{title}</h2>
      <div className="glass-card-strong rounded-2xl overflow-hidden divide-y divide-white/5">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon: Icon, label, value, onClick, danger }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
      data-testid={`settings-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${danger ? "bg-red-500/15" : "bg-white/8"}`}>
        <Icon size={16} className={danger ? "text-red-400" : "text-white/60"} />
      </div>
      <span className={`flex-1 text-left text-sm font-medium ${danger ? "text-red-400" : "text-white/80"}`}>{label}</span>
      {value && <span className="text-white/30 text-xs">{value}</span>}
      {!danger && <ChevronRight size={14} className="text-white/20" />}
    </button>
  );
}

function ToggleRow({ icon: Icon, label, enabled, onToggle }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
      data-testid={`toggle-${label.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center">
        <Icon size={16} className="text-white/60" />
      </div>
      <span className="flex-1 text-left text-sm font-medium text-white/80">{label}</span>
      <div className={`w-10 h-6 rounded-full transition-colors duration-200 relative ${enabled ? "bg-[#4ECDC4]" : "bg-white/15"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </div>
    </button>
  );
}

export default function Indstillinger() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { signOut, user, profile } = useAuth();
  const [notifikationer, setNotifikationer] = useState(true);
  const [privatProfil, setPrivatProfil] = useState(false);

  const displayName = profile?.name || user?.email?.split("@")[0] || t('settings.default_user');
  const userEmail = profile?.email || user?.email || "";

  return (
    <div
      className="relative min-h-svh pb-24"
      style={{ background: "#0D1220" }}
      data-testid="indstillinger-page"
    >
      <div className="sticky top-0 z-30 pt-12 pb-3 px-5 flex items-center gap-3" style={{ background: "linear-gradient(to bottom, rgba(10,14,35,0.95) 60%, transparent)" }}>
        <button onClick={() => setLocation("/min-side")} className="w-9 h-9 rounded-full glass-card flex items-center justify-center"><ArrowLeft size={18} className="text-white" /></button>
        <h1 className="text-white text-xl font-bold">{t('settings.title')}</h1>
      </div>

      <div className="px-5 mt-2 space-y-5">
        {/* Profile preview */}
        <div className="glass-card-strong rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#4ECDC4] to-[#059669] flex items-center justify-center">
            <span className="text-white text-lg font-bold">{displayName[0].toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">{displayName}</h3>
            <p className="text-white/40 text-xs">{userEmail}</p>
          </div>
        </div>

        {/* Account */}
        <SettingsGroup title={t('settings.account')}>
          <SettingsRow icon={User} label={t('settings.edit_profile')} value={displayName} />
          <ToggleRow icon={Bell} label={t('settings.notifications')} enabled={notifikationer} onToggle={() => setNotifikationer(!notifikationer)} />
          <ToggleRow icon={Shield} label={t('settings.private_profile')} enabled={privatProfil} onToggle={() => setPrivatProfil(!privatProfil)} />
        </SettingsGroup>

        {/* Preferences */}
        <SettingsGroup title={t('settings.preferences')}>
          <SettingsRow icon={Globe} label={t('settings.language')} value={t('settings.danish')} />
        </SettingsGroup>

        {/* Danger zone */}
        <SettingsGroup title="">
          <SettingsRow icon={LogOut} label={t('settings.log_out')} onClick={signOut} danger />
        </SettingsGroup>

        {/* App info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-white/20 text-[10px]">{t('settings.app_version', { version: '1.0' })}</p>
          <p className="text-white/15 text-[10px]">{t('settings.made_with_love')}</p>
        </div>
      </div>
    </div>
  );
}
