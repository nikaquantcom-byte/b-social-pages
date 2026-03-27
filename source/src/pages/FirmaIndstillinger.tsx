import { useState } from "react";
import { ArrowLeft, Building2, CreditCard, Users, FileText, Bell, Globe, Shield, BarChart3, Target, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

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

function SettingsRow({ icon: Icon, label, value, onClick, badge }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value?: string;
  onClick?: () => void;
  badge?: { text: string; color: string };
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors"
    >
      <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center">
        <Icon size={16} className="text-white/60" />
      </div>
      <span className="flex-1 text-left text-sm font-medium text-white/80">{label}</span>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
          {badge.text}
        </span>
      )}
      {value && <span className="text-white/30 text-xs">{value}</span>}
      <ChevronRight size={14} className="text-white/20" />
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

export default function FirmaIndstillinger() {
  const [, setLocation] = useLocation();
  const { user, profile } = useAuth();
  
  // State for toggles
  const [autoPublish, setAutoPublish] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  const companyName = "Aalborg Outdoor Events";
  const subscription = "Premium";
  const verified = true;

  return (
    <div
      className="relative min-h-svh pb-8"
      style={{ background: "#0D1220" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-30 pt-12 pb-3 px-5 flex items-center gap-3" style={{ background: "linear-gradient(to bottom, rgba(10,14,35,0.95) 60%, transparent)" }}>
        <button onClick={() => setLocation("/firma")} className="w-9 h-9 rounded-full glass-card flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white text-xl font-bold">Firma Indstillinger</h1>
      </div>

      <div className="px-5 mt-2 space-y-5">
        {/* Company Info Card */}
        <div className="glass-card-strong rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#4ECDC4] to-[#059669] flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-base">{companyName}</h3>
                {verified && <CheckCircle2 size={16} className="text-[#4ECDC4]" />}
              </div>
              <p className="text-white/40 text-xs mt-0.5">CVR: 12345678 · Aalborg, Danmark</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#4ECDC4]/15 text-[#4ECDC4]">
                  {subscription}
                </span>
                <span className="text-white/30 text-[10px]">· 45 events udgivet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Settings */}
        <SettingsGroup title="Firma">
          <SettingsRow 
            icon={Building2} 
            label="Firma oplysninger" 
            value="Rediger" 
          />
          <SettingsRow 
            icon={Shield} 
            label="Verifikation" 
            badge={{ text: "Verificeret", color: "bg-[#4ECDC4]/15 text-[#4ECDC4]" }}
          />
          <SettingsRow 
            icon={Users} 
            label="Team medlemmer" 
            value="3 brugere" 
          />
        </SettingsGroup>

        {/* Subscription & Billing */}
        <SettingsGroup title="Abonnement & Betaling">
          <SettingsRow 
            icon={CreditCard} 
            label="Abonnement" 
            value={subscription} 
          />
          <SettingsRow 
            icon={FileText} 
            label="Betalingshistorik" 
          />
          <SettingsRow 
            icon={CreditCard} 
            label="Betalingsmetode" 
            value="Visa ···· 4242" 
          />
        </SettingsGroup>

        {/* Features & Automation */}
        <SettingsGroup title="Funktioner">
          <ToggleRow 
            icon={Target} 
            label="Auto-publicer events" 
            enabled={autoPublish} 
            onToggle={() => setAutoPublish(!autoPublish)} 
          />
          <ToggleRow 
            icon={BarChart3} 
            label="Avanceret analytics" 
            enabled={analyticsEnabled} 
            onToggle={() => setAnalyticsEnabled(!analyticsEnabled)} 
          />
          <ToggleRow 
            icon={Bell} 
            label="Email notifikationer" 
            enabled={emailNotifications} 
            onToggle={() => setEmailNotifications(!emailNotifications)} 
          />
        </SettingsGroup>

        {/* Preferences */}
        <SettingsGroup title="Præferencer">
          <SettingsRow 
            icon={Globe} 
            label="Sprog" 
            value="Dansk" 
          />
        </SettingsGroup>

        {/* App info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-white/20 text-[10px]">B-Social Business v1.0</p>
          <p className="text-white/15 text-[10px]">Lavet med kærlighed i Danmark</p>
        </div>
      </div>
    </div>
  );
}
