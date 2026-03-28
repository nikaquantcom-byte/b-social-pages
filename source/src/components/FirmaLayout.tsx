import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CalendarPlus,
  Target,
  BarChart3,
  CreditCard,
  Building2,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
  ArrowLeft,
    Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { path: "/firma", labelKey: "firma.nav_overview", icon: LayoutDashboard },
  { path: "/firma/events", labelKey: "firma.nav_events", icon: CalendarPlus },
    { path: "/firma/rekruttering", labelKey: "firma.nav_recruitment", icon: Users },
  { path: "/firma/targeting", labelKey: "firma.nav_tag_targeting", icon: Target },
  { path: "/firma/analytics", labelKey: "firma.nav_analytics", icon: BarChart3 },
  { path: "/firma/fakturering", labelKey: "firma.nav_billing", icon: CreditCard },
  { path: "/firma/indstillinger", labelKey: "firma.nav_settings", icon: Settings },
];

export default function FirmaLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const NOTIFICATIONS = [
    { id: 1, text: t('firma.notif_new_signup'), time: t('firma.notif_time_2min'), unread: true },
    { id: 2, text: t('firma.notif_event_views'), time: t('firma.notif_time_1hour'), unread: true },
    { id: 3, text: t('firma.notif_new_followers'), time: t('firma.notif_time_3hours'), unread: false },
    { id: 4, text: t('firma.notif_invoice_paid'), time: t('firma.notif_time_1day'), unread: false },
  ];
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-white/10 flex flex-col transform transition-transform duration-200 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}>
        {/* Logo & firma */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">AktivNord Padel</p>
                <p className="text-xs text-muted-foreground">{t('firma.pro_plan')}</p>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === "/firma"
              ? location === "/firma"
              : location.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-primary/20" : ""
                }`}
                  style={isActive ? { boxShadow: "0 0 12px rgba(78,205,196,0.25)" } : undefined}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/test"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <ArrowLeft size={17} strokeWidth={1.8} />
            </div>
            {t('firma.back_to_app')}
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <LogOut size={17} strokeWidth={1.8} />
            </div>
            {t('firma.log_out')}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 size={14} />
            <span>AktivNord Padel</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">Pro</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-sm">{t('firma.notifications')}</span>
                    <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-white/5 transition-colors ${
                        n.unread ? "" : "opacity-60"
                      }`}>
                        <div className="flex items-start gap-2">
                          {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                          {!n.unread && <div className="w-1.5 h-1.5 mt-1.5 shrink-0" />}
                          <div>
                            <p className="text-xs leading-snug">{n.text}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-white/10">
                    <button className="text-xs text-primary hover:underline">{t('firma.mark_all_read')}</button>
                  </div>
                </div>
              )}
            </div>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              AP
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
