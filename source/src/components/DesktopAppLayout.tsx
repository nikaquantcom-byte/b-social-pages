import { Link } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Home, Compass, MapPin, MessageCircle, User, Bell, Search, Plus } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Feed", icon: Home, href: "/test" },
  { label: "Udforsk", icon: Compass, href: "/test/udforsk" },
  { label: "Kort", icon: MapPin, href: "/test/kort" },
  { label: "Beskeder", icon: MessageCircle, href: "/test/beskeder" },
  { label: "Min Side", icon: User, href: "/test/min-side" },
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
            const isActive = location === item.href || (item.href !== "/test" && location.startsWith(item.href));
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
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-5">
          <Link href="/test" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white/50">
            <span>v1.0 beta</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="dsk-main">
        {children}
      </main>

      {/* Mobile bottom nav - visible only on mobile */}
      <nav className="dsk-bottom-nav glass-nav">
        <div className="flex items-center justify-around px-1 pt-3 pb-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/test" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-2 py-1 group transition-all duration-200"
              >
                <div
                  className={`relative flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200 ${
                    isActive ? "bg-[#4ECDC4]/20" : "group-hover:bg-white/5"
                  }`}
                  style={isActive ? { boxShadow: "0 0 12px rgba(78, 205, 196, 0.3)" } : undefined}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`transition-colors ${
                      isActive ? "text-[#4ECDC4]" : "text-white/40 group-hover:text-white/60"
                    }`}
                  />
                </div>
                <span className={`text-[10px] transition-colors ${
                  isActive ? "text-[#4ECDC4] font-medium" : "text-white/30"
                }`}>
                  {item.label}
                </span>
                {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#4ECDC4]" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
