import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Home, Compass, MapPin, MessageCircle, User, Bell, Search, Plus, Building2 } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Feed", icon: Home, href: "/" },
  { label: "Udforsk", icon: Compass, href: "/udforsk" },
  { label: "Kort", icon: MapPin, href: "/kort" },
  { label: "Beskeder", icon: MessageCircle, href: "/beskeder" },
  { label: "Min Side", icon: User, href: "/min-side" },
];

export default function DesktopAppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useHashLocation();

  return (
    <div className="dsk-app dark">
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="dsk-sidebar">
        <div className="p-5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4ECDC4]/20 flex items-center justify-center">
              <span className="text-[#4ECDC4] font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-sm">B-Social</span>
          </div>
        </div>

        <nav className="flex-1 px-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5 ${
                  isActive
                    ? "bg-[#4ECDC4]/15 text-[#4ECDC4] font-medium"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-[#4ECDC4]/20" : ""
                }`}
                  style={isActive ? { boxShadow: "0 0 12px rgba(78,205,196,0.3)" } : undefined}
                >
                  <Icon size={18} />
                </div>
                {item.label}
              </Link>
            );
          })}
          {/* Kunde section link */}
          <Link
            href="/firma"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mt-6 ${
              location.startsWith("/firma")
                ? "bg-[#4ECDC4]/15 text-[#4ECDC4] font-medium"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Building2 size={18} />
            </div>
            Kunde
          </Link>
        </nav>

        <div className="p-4 text-white/20 text-xs">
          v1.0 beta
        </div>
      </aside>

      {/* Main content */}
      <main className="dsk-main">
        {children}
      </main>

      {/* Mobile bottom nav - visible only on mobile */}
      <div className="dsk-bottom-nav glass-nav">
        <div className="flex items-center justify-around h-16">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-3 ${
                  isActive ? "text-[#4ECDC4]" : "text-white/40"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-[#4ECDC4] mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
