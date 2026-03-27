export const CATEGORY_EMOJI: Record<string, string> = {
  musik: "🎵",
  koncert: "🎤",
  sport: "⚽",
  natur: "🌲",
  kaffe: "☕",
  yoga: "🧘",
  kunst: "🎨",
  mad: "🍽️",
  fitness: "💪",
  dans: "💃",
  film: "🎬",
  gaming: "🎮",
  strand: "🏖️",
  skov: "🌲",
  festival: "🎪",
  cykling: "🚴",
  løb: "🏃",
  vandring: "🥾",
  fotografering: "📸",
  meditation: "🧘",
  kultur: "🎭",
  restaurant: "🍽️",
  bar: "🍺",
  cafe: "☕",
  outdoor: "🌿",
  bøger: "📚",
  streetfood: "🌮",
  shopping: "🛍️",
  teater: "🎭",
  fodbold: "⚽",
  basketball: "🏀",
  ski: "⛷️",
  snowboard: "🏂",
  svømning: "🏊",
  kampsport: "🥋",
  vandsport: "🤿",
};

export function getCategoryEmoji(category: string): string {
  if (!category) return "✨";
  const lower = category.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return "✨";
}

const FALLBACK_IMAGES: Record<string, string> = {
  musik: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop",
  koncert: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop",
  sport: "https://images.unsplash.com/photo-1461896836934-ber7bb95ed4b?w=400&auto=format&fit=crop",
  fitness: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&auto=format&fit=crop",
  natur: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&fit=crop",
  vandring: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&fit=crop",
  skov: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&fit=crop",
  kunst: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop",
  kultur: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop",
  kaffe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop",
  cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop",
  festival: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop",
  cykling: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop",
  løb: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&auto=format&fit=crop",
  maraton: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&auto=format&fit=crop",
  trail: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&auto=format&fit=crop",
  fodbold: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop",
  basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop",
  ski: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop",
  outdoor: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&auto=format&fit=crop",
  svømning: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&auto=format&fit=crop",
  mad: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop",
  teater: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&auto=format&fit=crop",
  yoga: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&auto=format&fit=crop",
  dans: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop",
};

export function getEventImage(event: { image_url?: string | null; category?: string | null }): string {
  if (event.image_url) return event.image_url;
  const cat = (event.category || "").toLowerCase();
  for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
    if (cat.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop";
}

export function formatDanishDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("da-DK", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "God morgen";
  if (hour < 17) return "God eftermiddag";
  return "God aften";
}

export const ALL_TAGS = [
  "kaffe","yoga","løbetur","musik","sport","natur","kunst","madlavning",
  "outdoor","fitness","dans","fotografering","film","teater","gaming",
  "vandring","cykling","te","koncert","festival","fodbold","basketball",
  "bøger","streetfood","restaurant","bar","cafe","shopping","meditation",
  "strand","skov","galleri"
];
