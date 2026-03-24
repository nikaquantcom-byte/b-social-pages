/* ═══════════════════════════════════════════════
   B-Social — DE 10 LÅSTE HOVEDKATEGORIER
   Hele appen bruger disse: Udforsk, Kort, CategoryDetail, Onboarding
   ═══════════════════════════════════════════════ */

export interface Category {
  key: string;
  label: string;
  emoji: string;
  image: string;
  color: string;
  hex: string;
  subcategories?: { label: string; emoji: string; key: string }[];
}

/* ── Sæson-detection ── */
function getCurrentSeason(): "foraar" | "sommer" | "efteraar" | "vinter" {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "foraar";
  if (month >= 6 && month <= 8) return "sommer";
  if (month >= 9 && month <= 11) return "efteraar";
  return "vinter";
}

export function getSeasonLabel(): string {
  const s = getCurrentSeason();
  switch (s) {
    case "foraar": return "Forår";
    case "sommer": return "Sommer";
    case "efteraar": return "Efterår";
    case "vinter": return "Vinter";
  }
}

/* ═══════════════════════════════════════════════
   DE 10 LÅSTE KATEGORIER
   ═══════════════════════════════════════════════ */

export const ALL_CATEGORIES: Category[] = [
  {
    key: "events",
    label: "Events & fællesskab",
    emoji: "🎉",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
    color: "from-yellow-500/70 to-yellow-900/80",
    hex: "#eab308",
    subcategories: [
      { label: "Festivaler", emoji: "🎪", key: "festival" },
      { label: "Stand-up", emoji: "🎤", key: "stand-up" },
      { label: "Quiz-aftener", emoji: "🧠", key: "quiz" },
      { label: "Loppemarkeder", emoji: "🛍️", key: "loppemarked" },
      { label: "Fællesspisning", emoji: "🍲", key: "faellesspisning" },
      { label: "Netværk", emoji: "🤝", key: "netvaerk" },
      { label: "Singles", emoji: "💖", key: "singles" },
      { label: "Frivilligt", emoji: "🤲", key: "frivilligt" },
    ],
  },
  {
    key: "logi",
    label: "Logi & base",
    emoji: "🏕️",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
    color: "from-amber-700/70 to-amber-900/80",
    hex: "#b45309",
    subcategories: [
      { label: "Shelter", emoji: "⛺", key: "shelter" },
      { label: "Camping", emoji: "🏕️", key: "camping" },
      { label: "Vandrerhjem", emoji: "🏠", key: "vandrerhjem" },
      { label: "Hytter", emoji: "🛖", key: "hytter" },
      { label: "Glamping", emoji: "✨", key: "glamping" },
      { label: "Bål & overnatning", emoji: "🔥", key: "baal" },
    ],
  },
  {
    key: "ture",
    label: "Ture & eventyr",
    emoji: "🥾",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
    color: "from-green-600/70 to-green-900/80",
    hex: "#16a34a",
    subcategories: [
      { label: "Vandring", emoji: "🥾", key: "vandring" },
      { label: "Cykelture", emoji: "🚴", key: "cykling" },
      { label: "MTB", emoji: "🚵", key: "mtb" },
      { label: "Kajak & SUP", emoji: "🛶", key: "kajak" },
      { label: "Geocaching", emoji: "📍", key: "geocaching" },
      { label: "Orienteringsløb", emoji: "🗺️", key: "orienteringsloeb" },
      { label: "Bushcraft", emoji: "🏕️", key: "overlevelse" },
    ],
  },
  {
    key: "natur",
    label: "Natur & friluftsliv",
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    color: "from-emerald-600/70 to-emerald-900/80",
    hex: "#10B981",
    subcategories: [
      { label: "Skov", emoji: "🌲", key: "skov" },
      { label: "Strand", emoji: "🏖️", key: "strand" },
      { label: "Nationalpark", emoji: "🌿", key: "nationalpark" },
      { label: "Fiskeri", emoji: "🎣", key: "fiskeri" },
      { label: "Fuglekiggeri", emoji: "🐦", key: "fuglekiggeri" },
      { label: "Hundeskov", emoji: "🐕", key: "hundeskov" },
      { label: "Dyrespotting", emoji: "🦌", key: "dyrespotting" },
      { label: "Badning", emoji: "🏊", key: "badning" },
    ],
  },
  {
    key: "aktiv",
    label: "Aktiv & sport",
    emoji: "⚽",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400",
    color: "from-blue-600/70 to-blue-900/80",
    hex: "#3b82f6",
    subcategories: [
      { label: "Fodbold", emoji: "⚽", key: "fodbold" },
      { label: "Løb", emoji: "🏃", key: "loeb" },
      { label: "Fitness", emoji: "💪", key: "fitness" },
      { label: "Svømning", emoji: "🏊", key: "svoemning" },
      { label: "Kampsport", emoji: "🥊", key: "kampsport" },
      { label: "Klatring", emoji: "🧗", key: "klatring" },
      { label: "Tennis & padel", emoji: "🎾", key: "tennis" },
      { label: "Dans", emoji: "💃", key: "dans" },
    ],
  },
  {
    key: "mad",
    label: "Mad & hangouts",
    emoji: "🍽️",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    color: "from-amber-600/70 to-amber-900/80",
    hex: "#f59e0b",
    subcategories: [
      { label: "Street Food", emoji: "🍜", key: "streetfood" },
      { label: "Madlavning", emoji: "👩‍🍳", key: "madlavning" },
      { label: "Grill", emoji: "🥩", key: "grillaften" },
      { label: "Ølsmagning", emoji: "🍺", key: "oelsmagning" },
      { label: "Vinsmagning", emoji: "🍷", key: "vinsmagning" },
      { label: "Caféer", emoji: "☕", key: "cafe" },
      { label: "Restauranter", emoji: "🍽️", key: "restaurant" },
      { label: "Food Markets", emoji: "🏪", key: "foodmarket" },
    ],
  },
  {
    key: "kultur",
    label: "Oplevelser & kultur",
    emoji: "🎭",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400",
    color: "from-purple-600/70 to-purple-900/80",
    hex: "#a855f7",
    subcategories: [
      { label: "Museer", emoji: "🏛️", key: "museum" },
      { label: "Teater", emoji: "🎭", key: "teater" },
      { label: "Koncerter", emoji: "🎤", key: "koncert" },
      { label: "Kunst", emoji: "🎨", key: "kunst" },
      { label: "Fotografering", emoji: "📸", key: "fotografering" },
      { label: "Musik", emoji: "🎵", key: "musik" },
      { label: "Kreativt", emoji: "🖌️", key: "kreativt" },
    ],
  },
  {
    key: "rejser",
    label: "Rejser & transport",
    emoji: "🚆",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400",
    color: "from-sky-600/70 to-sky-900/80",
    hex: "#0284c7",
    subcategories: [
      { label: "Tog", emoji: "🚆", key: "tog" },
      { label: "Samkørsel", emoji: "🚗", key: "samkoersel" },
      { label: "Cykelruter", emoji: "🚴", key: "cykelruter" },
      { label: "Færge", emoji: "⛴️", key: "faerge" },
      { label: "Road Trip", emoji: "🛣️", key: "roadtrip" },
      { label: "Fly-deals", emoji: "✈️", key: "flydeals" },
    ],
  },
  {
    key: "communities",
    label: "Communities & clubs",
    emoji: "👥",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
    color: "from-red-500/70 to-red-900/80",
    hex: "#dc2626",
    subcategories: [
      { label: "Bogklub", emoji: "📚", key: "bogklub" },
      { label: "Brætspil", emoji: "🎲", key: "braetspil" },
      { label: "Gaming", emoji: "🎮", key: "gaming" },
      { label: "Sprogcafé", emoji: "🗣️", key: "spraakcafe" },
      { label: "Tech & coding", emoji: "💻", key: "tech" },
      { label: "Startup", emoji: "🚀", key: "startup" },
      { label: "Filmklub", emoji: "🎬", key: "filmaften" },
      { label: "Ridning", emoji: "🐎", key: "ridning" },
    ],
  },
  {
    key: "wellness",
    label: "Wellness & balance",
    emoji: "🧘",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    color: "from-teal-500/70 to-teal-900/80",
    hex: "#14b8a6",
    subcategories: [
      { label: "Yoga", emoji: "🧘", key: "yoga" },
      { label: "Meditation", emoji: "🧘", key: "meditation" },
      { label: "Sauna", emoji: "🧖", key: "sauna" },
      { label: "Vinterbadning", emoji: "🥶", key: "vinterbadning" },
      { label: "Breathwork", emoji: "🌬️", key: "breathwork" },
      { label: "Mindfulness", emoji: "🌿", key: "mindfulness" },
    ],
  },
];

/** Lookup by key */
export function getCategoryByKey(key: string): Category | undefined {
  return ALL_CATEGORIES.find(c => c.key === key);
}

/** Get all subcategories flat */
export function getAllSubcategories(): { label: string; emoji: string; key: string; parent: string }[] {
  return ALL_CATEGORIES.flatMap(c =>
    (c.subcategories || []).map(sub => ({ ...sub, parent: c.key }))
  );
}

/** Get all labels for onboarding interest picker */
export function getAllInterestLabels(): { label: string; emoji: string; category: string }[] {
  const interests: { label: string; emoji: string; category: string }[] = [];
  for (const cat of ALL_CATEGORIES) {
    interests.push({ label: cat.label, emoji: cat.emoji, category: cat.key });
    for (const sub of cat.subcategories || []) {
      interests.push({ label: sub.label, emoji: sub.emoji, category: cat.key });
    }
  }
  return interests;
}

/** Pin header images for Kort */
export function getPinHeaderImage(categoryKey: string): string {
  const cat = getCategoryByKey(categoryKey);
  if (cat) return cat.image.replace("w=400", "w=600");
  const legacy: Record<string, string> = {
    mtb: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600",
    vandring: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
    loeb: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600",
    hund: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
    fiskeri: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600",
    badning: "https://images.unsplash.com/photo-1519314793478-81a89b69502e?w=600",
    shelter: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
    dyrespot: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600",
    sport: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600",
    musik: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600",
    spil: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600",
    kreativt: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600",
    fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
    outdoor: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
    socialt: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    karriere: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600",
    tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  };
  return legacy[categoryKey] || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600";
}
