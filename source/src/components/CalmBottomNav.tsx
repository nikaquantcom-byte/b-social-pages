import { Home, Compass, MapPin, MessageCircle, User } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";

// Sub-pages that belong to Min Side
const MIN_SIDE_SUBS = ["/indstillinger", "/kalender", "/overblik", "/noter", "/historik", "/inspiration"];

const navItems = [
  { key: "nav.feed", icon: Home, href: "/feed" },
  { key: "nav.udforsk", icon: Compass, href: "/udforsk" },
  { key: "nav.kort", icon: MapPin, href: "/kort" },
  { key: "nav.beskeder", icon: MessageCircle, href: "/beskeder" },
  { key: "nav.min_side", icon: User, href: "/min-side" },
];

export function CalmBottomNav() {
  const { t } = useTranslation();
  const [location] = useLocation();

  return (
    <nav
      className="glass-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[9999] safe-area-pb"
      data-testid="bottom-nav"
    >
      <div className="flex items-center justify-around px-1 pt-3 pb-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href
            || location.startsWith(item.href + "/")
            || (item.href === "/min-side" && MIN_SIDE_SUBS.some(s => location === s || location.startsWith(s + "/")));

          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-${t(item.key).toLowerCase().replace(" ", "-")}`}
              className="flex flex-col items-center gap-1 px-2 py-1 group transition-all duration-200"
            >
              <div
                className={`relative flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#4ECDC4]/20"
                    : "group-hover:bg-white/5"
                }`}
                style={isActive ? { boxShadow: "0 0 12px rgba(78, 205, 196, 0.3)" } : undefined}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-all duration-200 ${
                    isActive ? "text-[#4ECDC4]" : "text-white/50 group-hover:text-white/80"
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4ECDC4]" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-[#4ECDC4]" : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
