import { useLocation } from "wouter";
import {
  Bell, BellRing, Calendar, MessageCircle, UserPlus, UserCheck, Tag, ChevronRight, CheckCheck, Inbox,
} from "lucide-react";
import { useNotifications, type Notification, type NotificationType } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from 'react-i18next';

/* ── Icon + color per notification type ── */
const TYPE_META: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  event_invite:    { icon: Calendar,       color: "text-[#4ECDC4]", bg: "bg-[#4ECDC4]/15" },
  friend_request:  { icon: UserPlus,       color: "text-purple-400", bg: "bg-purple-400/15" },
  friend_accepted: { icon: UserCheck,      color: "text-green-400",  bg: "bg-green-400/15" },
  new_message:     { icon: MessageCircle,  color: "text-blue-400",   bg: "bg-blue-400/15" },
  event_reminder:  { icon: BellRing,       color: "text-amber-400",  bg: "bg-amber-400/15" },
  tag_match:       { icon: Tag,            color: "text-[#f97316]",  bg: "bg-[#f97316]/15" },
};

/* ── Date grouping helpers ── */
function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function groupLabel(dateStr: string, t: (key: string) => string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const todayStart = startOfDay(now);
  const dStart = startOfDay(d);
  const diff = todayStart - dStart;

  if (diff <= 0) return t('notifications.today');
  if (diff <= 86400000) return t('notifications.yesterday');
  if (diff <= 7 * 86400000) return t('notifications.this_week');
  return t('notifications.older');
}

function timeAgo(dateStr: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const s = Math.floor((now - d) / 1000);
  if (s < 60) return t('notifications.just_now');
  if (s < 3600) return t('notifications.minutes_ago', { count: Math.floor(s / 60) });
  if (s < 86400) return t('notifications.hours_ago', { count: Math.floor(s / 3600) });
  if (s < 172800) return t('notifications.yesterday');
  return new Date(dateStr).toLocaleDateString("da-DK", { day: "numeric", month: "short" });
}

type GroupedNotifications = { label: string; items: Notification[] }[];

function groupNotifications(notifications: Notification[], t: (key: string) => string): GroupedNotifications {
  const order = [t('notifications.today'), t('notifications.yesterday'), t('notifications.this_week'), t('notifications.older')];
  const groups: Record<string, Notification[]> = {};
  for (const n of notifications) {
    const label = groupLabel(n.created_at, t);
    (groups[label] ??= []).push(n);
  }
  return order.filter(l => groups[l]?.length).map(label => ({ label, items: groups[label] }));
}

/* ── Single notification row ── */
function NotificationRow({ n, onClick }: { n: Notification; onClick: () => void }) {
  const { t } = useTranslation();
  const meta = TYPE_META[n.type] || TYPE_META.event_invite;
  const Icon = meta.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all rounded-xl ${
        n.is_read ? "opacity-60 hover:opacity-80" : "hover:bg-white/5"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={meta.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium truncate ${n.is_read ? "text-white/60" : "text-white"}`}>
            {n.title}
          </p>
          {!n.is_read && (
            <span className="w-2 h-2 rounded-full bg-[#4ECDC4] flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-white/40 truncate mt-0.5">{n.body}</p>
        <p className="text-[10px] text-white/25 mt-1">{timeAgo(n.created_at, t)}</p>
      </div>
      <ChevronRight size={14} className="text-white/20 flex-shrink-0 mt-3" />
    </button>
  );
}

/* ── Page ── */
export default function Notifikationer() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const grouped = groupNotifications(notifications, t);

  function handleClick(n: Notification) {
    if (!n.is_read) markAsRead(n.id);
    const link = n.data?.link;
    if (link) setLocation(link);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e23] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#4ECDC4]/30 border-t-[#4ECDC4] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn()) {
    return (
      <div className="min-h-screen bg-[#0a0e23] flex flex-col items-center justify-center px-6">
        <Inbox size={48} className="text-white/20 mb-4" />
        <p className="text-white/50 text-sm">{t('notifications.login_to_see')}</p>
        <button
          onClick={() => setLocation("/auth")}
          className="mt-4 px-6 py-2.5 rounded-2xl bg-[#4ECDC4] text-white font-semibold text-sm"
        >
          {t('notifications.log_in')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e23] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <p className="text-white/40 text-xs mt-0.5">{unreadCount} {t('notifications.unread')}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 text-white/60 text-xs hover:bg-white/12 transition-all"
          >
            <CheckCheck size={14} />
            {t('notifications.mark_all_read')}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#4ECDC4]/30 border-t-[#4ECDC4] rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Bell size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm font-medium">{t('notifications.no_notifications')}</p>
            <p className="text-white/25 text-xs mt-1">{t('notifications.we_will_notify')}</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.label} className="mb-6">
              <h2 className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-2">
                {group.label}
              </h2>
              <div className="space-y-0.5">
                {group.items.map(n => (
                  <NotificationRow key={n.id} n={n} onClick={() => handleClick(n)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
