import { Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
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
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { path: "/firma", label: "Overblik", icon: LayoutDashboard },
  { path: "/firma/events", label: "Events", icon: CalendarPlus },
  { path: "/firma/targeting", label: "Tag-targeting", icon: Target },
  { path: "/firma/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/firma/fakturering", label: "Fakturering", icon: CreditCard },
];

export default function FirmaLayout({ children }: { children: React.ReactNode }) {
  const [location] = useHashLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="firma-layout">
      {/* Mobile header */}
      <header className="firma-mobile-header">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-white/10">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-primary" />
          <span className="font-semibold">B-Social Firma</span>
        </div>
        <div className="w-9" />
      </header>

      {/* Sidebar */}
      <aside className={`firma-sidebar ${mobileOpen ? "firma-sidebar-open" : ""}`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ChevronLeft size={16} /> Tilbage til B-Social
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Building2 size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">B-Social Firma</h2>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path || (item.path !== "/firma" && location.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 w-full">
            <LogOut size={18} />
            Log ud
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="firma-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <main className="firma-main">
        {children}
      </main>
    </div>
  );
}
