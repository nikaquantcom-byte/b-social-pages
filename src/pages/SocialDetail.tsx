import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Share2, Heart, MapPin, Users } from "lucide-react";
import { getSocialActivityById } from "@/data/feedData";
import { useJoin } from "@/context/JoinContext";

export default function SocialDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { joinEvent, leaveEvent, isJoined } = useJoin();
  const [favorited, setFavorited] = useState(false);

  const activity = id ? getSocialActivityById(id) : null;
  const joined = activity ? isJoined(activity.id) : false;

  const handleJoin = () => {
    if (!activity) return;
    if (joined) {
      leaveEvent(activity.id);
    } else {
      joinEvent(activity.id, activity.title);
    }
  };

  if (!activity) {
    return (
      <div
        className="min-h-svh flex flex-col items-center justify-center px-6"
        style={{ background: "hsl(230,35%,8%)" }}
      >
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-white/60 text-base">Oplevelse ikke fundet</p>
        <button
          onClick={() => setLocation("/feed")}
          className="mt-4 px-6 py-2.5 rounded-2xl bg-[#4ECDC4] text-white font-medium text-sm"
        >
          Tilbage til feed
        </button>
      </div>
    );
  }

  const spotsCurrent = activity.spots.current + (joined ? 1 : 0);
  const remaining = activity.spots.total - spotsCurrent;
  const pct = Math.round((spotsCurrent / activity.spots.total) * 100);
  const almostFull = remaining <= 1;

  // Generate fake participant avatars
  const participantAvatars = [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&auto=format&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&crop=face",
  ].slice(0, activity.spots.current);

  return (
    <div
      className="relative min-h-svh"
      style={{ background: "hsl(230,35%,8%)" }}
      data-testid="social-detail-page"
    >
      {/* Hero image */}
      <div className="relative h-72">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e23] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-12">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
            data-testid="button-back"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: activity.title, url: window.location.href });
                }
              }}
              className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
              data-testid="button-share"
            >
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={() => setFavorited(!favorited)}
              className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
              data-testid="button-favorite"
            >
              <Heart
                size={16}
                className={favorited ? "text-red-400 fill-red-400" : "text-white"}
              />
            </button>
          </div>
        </div>

        {/* Category + Price badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
            {activity.emoji} {activity.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-1 rounded-full bg-[#4ECDC4]/90 text-white text-sm font-semibold">
            Gratis
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-5 pb-32">
        <h1 className="text-white text-2xl font-bold leading-tight mb-4">{activity.title}</h1>

        {/* Info pills */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <MapPin size={15} className="text-[#4ECDC4] flex-shrink-0" />
            <span>{activity.location} · {activity.distance}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Users size={15} className="text-[#4ECDC4] flex-shrink-0" />
            <span>{spotsCurrent}/{activity.spots.total} deltagere tilmeldt</span>
          </div>
        </div>

        {/* Participant avatars */}
        {participantAvatars.length > 0 && (
          <div className="flex items-center gap-1 mb-5">
            <div className="flex -space-x-2">
              {participantAvatars.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt={`Deltager ${i + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0e23] object-cover"
                />
              ))}
            </div>
            <span className="text-white/40 text-xs ml-2">
              {remaining > 0 ? `${remaining} pladser tilbage` : "Fuldt"}
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="glass-card rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-xs flex items-center gap-1">
              <Users size={11} />
              {spotsCurrent}/{activity.spots.total} er klar
            </span>
            <span className={`text-xs font-semibold ${almostFull ? "text-orange-400" : "text-[#4ECDC4]"}`}>
              {almostFull
                ? remaining === 0 ? "Fuldt booket" : "Du er den sidste der mangler"
                : `${remaining} pladser tilbage`}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${almostFull ? "bg-orange-400" : "bg-[#4ECDC4]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="glass-card rounded-2xl p-4 mb-5">
          <h3 className="text-white font-semibold text-sm mb-2">Om oplevelsen</h3>
          <p className="text-white/60 text-sm leading-relaxed">{activity.longDescription}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {activity.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 pb-8 glass-nav">
        <button
          onClick={handleJoin}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
            joined
              ? "bg-white/10 text-white/60 border border-white/10 hover:bg-white/15"
              : "bg-[#4ECDC4] text-white hover:bg-[#3dbdb5] active:scale-98 shadow-lg shadow-[#4ECDC4]/20"
          }`}
          data-testid="button-deltag"
        >
          {joined ? "Afmeld" : "Deltag"}
        </button>
      </div>
    </div>
  );
}
