/* ═══════════════════════════════════════════════
   B-Social Feed Data — 3 lag
   Sektion A: Inspiration ("Verden derude") — Aalborg-fokuseret
   Sektion B: Oplevelser nær dig (Gratis, Kategori 1)
   Sektion C: Oplevelser (Betalt, Kategori 2) — uses events.json
   + Ambassadører
   ═══════════════════════════════════════════════ */

/* ── INSPIRATION: smukke steder tæt på ── */
export interface InspirationItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  distance: string;
  tags: string[];
}

export const INSPIRATION: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Aalborg Havnefront",
    subtitle: "Havnefronten i solskin — perfekt til en gåtur",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    distance: "0.5 km",
    tags: ["gåtur", "natur", "havnen"],
  },
  {
    id: "insp-2",
    title: "Rold Skov vandrerute",
    subtitle: "Danmarks eneste sprækkedal og stille stier",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop",
    distance: "12 km",
    tags: ["vandring", "skov", "natur"],
  },
  {
    id: "insp-3",
    title: "Utzon Center",
    subtitle: "Arkitektur, udstillinger og udsigt over fjorden",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&auto=format&fit=crop",
    distance: "1 km",
    tags: ["kunst", "kultur", "arkitektur"],
  },
  {
    id: "insp-4",
    title: "Limfjorden ved solnedgang",
    subtitle: "Tag en tur ud og se solen gå ned over fjorden",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop",
    distance: "3 km",
    tags: ["natur", "ro", "foto"],
  },
  {
    id: "insp-5",
    title: "Lindholm Høje",
    subtitle: "Vikingegravplads med udsigt over hele Aalborg",
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=600",
    distance: "4 km",
    tags: ["historie", "natur", "vandring"],
  },
  {
    id: "insp-6",
    title: "Fjordstien",
    subtitle: "Stille cykelsti langs vandet — frisk luft garanteret",
    image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&auto=format&fit=crop",
    distance: "2 km",
    tags: ["cykling", "natur", "motion"],
  },
];

/* ── OPLEVELSER NÆR DIG: gratis, lavbarriere aktiviteter ── */
export interface SocialActivity {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  emoji: string;
  image: string;
  location: string;
  distance: string;
  spots: { current: number; total: number };
  tags: string[];
  category: string;
  price?: number;
}

export const OPLEVELSER_NAER_DIG: SocialActivity[] = [
  {
    id: "social-1",
    title: "Kaffe-meetup på Nordkraft",
    description: "Mød nye mennesker over en kop kaffe",
    longDescription: "Hyggeligt kaffe-møde på Café Nordkraft i hjertet af Aalborg. Alle er velkomne — det handler bare om at mødes og snakke. Vi sidder i loungeområdet på 1. sal.",
    emoji: "☕",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    location: "Café Nordkraft",
    distance: "0.3 km",
    spots: { current: 1, total: 4 },
    tags: ["kaffe", "social", "hygge"],
    category: "Kaffe",
  },
  {
    id: "social-2",
    title: "Gåtur langs Limfjorden",
    description: "Stille tur med udsigt over fjorden",
    longDescription: "En rolig gåtur langs Limfjorden fra Utzon Center mod Vestre Bådehavn. Tempoet er stille — perfekt til at lære nye mennesker at kende med fjorden som kulisse.",
    emoji: "🚶",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
    location: "Utzon Center",
    distance: "0.5 km",
    spots: { current: 3, total: 6 },
    tags: ["gåtur", "natur", "social"],
    category: "Natur",
  },
  {
    id: "social-3",
    title: "MTB i Hammer Bakker",
    description: "Begyndervenlig MTB-tur i skoven",
    longDescription: "Fælles MTB-tur på de grønne spor i Hammer Bakker. Vi kører i roligt tempo og holder pauser. Perfekt for nybegyndere der vil prøve MTB med selskab.",
    emoji: "🚵",
    image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=600",
    location: "Hammer Bakker",
    distance: "8 km",
    spots: { current: 2, total: 5 },
    tags: ["mtb", "sport", "natur"],
    category: "Sport",
  },
  {
    id: "social-4",
    title: "Brætspilsaften på Caféen",
    description: "Settlers + snacks — alle niveauer",
    longDescription: "Hyggelig brætspilsaften på Aalborg Brætspilscafé. Vi starter med Settlers of Catan og ser hvad der sker. Alle niveauer velkomne — caféen har 500+ spil.",
    emoji: "🎲",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600",
    location: "Brætspilscaféen",
    distance: "0.8 km",
    spots: { current: 3, total: 6 },
    tags: ["gaming", "social", "hygge"],
    category: "Spil",
  },
  {
    id: "social-5",
    title: "Yoga i Kildeparken",
    description: "Gratis yoga udendørs — alle niveauer",
    longDescription: "Afslappende yoga-session i Kildeparken. Vi mødes ved den store græsplæne. Medbring yogamåtte eller håndklæde. Alle niveauer velkomne, også begyndere.",
    emoji: "🧘",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
    location: "Kildeparken",
    distance: "1.2 km",
    spots: { current: 5, total: 12 },
    tags: ["yoga", "sport", "natur"],
    category: "Sport",
  },
  {
    id: "social-6",
    title: "Madmarked Streetfood",
    description: "Fællesspisning fra hele verden",
    longDescription: "Mød op til fællesspisning på Streetfood Aalborg i Nordkraft. Hver vælger sin egen mad fra de mange boder — vi deler bare bordet og hyggen.",
    emoji: "🍜",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
    location: "Streetfood Aalborg",
    distance: "0.4 km",
    spots: { current: 4, total: 8 },
    tags: ["mad", "social", "hygge"],
    category: "Mad & Drikke",
  },
  {
    id: "social-7",
    title: "Fodbold 5-mands",
    description: "Mangler 1 spiller til hygge-bold",
    longDescription: "Hyggelig 5-mands fodbold i Kildeparken. Ingen krav til niveau — det vigtigste er at have det sjovt. Medbring bare sportssko.",
    emoji: "⚽",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600",
    location: "Kildeparken",
    distance: "1.2 km",
    spots: { current: 4, total: 5 },
    tags: ["sport", "fodbold", "motion"],
    category: "Sport",
  },
  {
    id: "social-8",
    title: "Løbetur langs havnen",
    description: "5 km i stille tempo",
    longDescription: "En afslappet løbetur langs Aalborg Havnefront. Vi holder et stille tempo så alle kan være med. Fra Utzon Center til Vestre Bådehavn og retur.",
    emoji: "🏃",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600",
    location: "Havnefronten",
    distance: "0.5 km",
    spots: { current: 2, total: 5 },
    tags: ["løb", "motion", "social"],
    category: "Sport",
  },
  {
    id: "social-9",
    title: "Cykeltur til Nibe",
    description: "Roligt tempo langs fjorden",
    longDescription: "Afslappet cykeltur fra Aalborg til Nibe langs Limfjorden. Ca. 30 km — vi holder pauser undervejs. Medbring vand.",
    emoji: "🚴",
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600",
    location: "Aalborg → Nibe",
    distance: "0 km (start her)",
    spots: { current: 1, total: 4 },
    tags: ["cykling", "natur", "motion"],
    category: "Sport",
  },
  // ═══ NYE KATEGORIER — 5 nye events ═══
  {
    id: "social-10",
    title: "Fotowalk ved Limfjorden",
    description: "Fang lyset over fjorden med kamera eller mobil",
    longDescription: "Fælles fotowalk langs Limfjorden fra Utzon Center mod vest. Vi fanger solnedgangen og deler tips. Alle niveauer — mobil er helt fint.",
    emoji: "📸",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600",
    location: "Utzon Center",
    distance: "0.5 km",
    spots: { current: 2, total: 8 },
    tags: ["fotografering", "kreativt", "natur"],
    category: "Kreativt",
  },
  {
    id: "social-11",
    title: "Vinterbadning ved Bådehavnen",
    description: "Kold dukkert og varm kakao bagefter",
    longDescription: "Mød op til vinterbadning ved Vestre Bådehavn. Vi hopper i sammen og varmer os i saunaen bagefter. Ingen erfaring nødvendig — bare mod!",
    emoji: "🥶",
    image: "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=600",
    location: "Vestre Bådehavn",
    distance: "1 km",
    spots: { current: 5, total: 10 },
    tags: ["vinterbadning", "fitness", "fællesskab"],
    category: "Fitness",
  },
  {
    id: "social-12",
    title: "Pub Quiz på Søgaards",
    description: "Test din viden — hold på 2-6 personer",
    longDescription: "Ugentlig pub quiz på Søgaards Bryghus. Spørgsmål fra alt fra popkultur til geografi. Kom alene eller med venner — vi sætter folk sammen.",
    emoji: "🧠",
    image: "https://images.unsplash.com/photo-1546427660-eb346c344ba5?w=600",
    location: "Søgaards Bryghus",
    distance: "0.3 km",
    spots: { current: 3, total: 6 },
    tags: ["quiz", "events", "social"],
    category: "Events",
  },
  {
    id: "social-13",
    title: "Startup Meetup NOVI",
    description: "Netværk med iværksættere fra Nordjylland",
    longDescription: "Månedligt meetup på NOVI Innovation. Korte talks, networking og sparring. Perfekt for startups, freelancere og tech-folk.",
    emoji: "🚀",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600",
    location: "NOVI Innovation",
    distance: "5 km",
    spots: { current: 8, total: 25 },
    tags: ["startup", "karriere", "netværk"],
    category: "Karriere",
  },
  {
    id: "social-14",
    title: "Kajak-tur Aalborg Fjord",
    description: "Padl langs kysten — begyndervenligt",
    longDescription: "Fælles kajak-tur på Limfjorden. Vi låner kajakker fra Aalborg Kajakklub. Begyndere får intro. Medbring tørt tøj og godt humør.",
    emoji: "🛨",
    image: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=600",
    location: "Aalborg Kajakklub",
    distance: "1.5 km",
    spots: { current: 2, total: 6 },
    tags: ["kajak", "outdoor", "natur"],
    category: "Outdoor",
    price: 150,
  },
];

/* ── Helper: get social activity by id ── */
export function getSocialActivityById(id: string): SocialActivity | null {
  return OPLEVELSER_NAER_DIG.find(a => a.id === id) || null;
}

/* ── AALBORG INSPIRATION ── */
export interface AalborgInspiration {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: "sted" | "festival";
  tags: string[];
}

export const AALBORG_INSPIRATION: AalborgInspiration[] = [
  {
    id: "aalborg-1",
    title: "Aalborg Havnefront",
    subtitle: "Vandkanten, Utzon Center og liv langs fjorden",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    type: "sted",
    tags: ["gåtur", "havnen", "natur"],
  },
  {
    id: "aalborg-2",
    title: "Lindholm Høje",
    subtitle: "Vikingegravplads med 700 grave og udsigt",
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=600",
    type: "sted",
    tags: ["historie", "vikinger", "vandring"],
  },
  {
    id: "aalborg-3",
    title: "Utzon Center",
    subtitle: "Arkitektur, design og udsigt over fjorden",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&auto=format&fit=crop",
    type: "sted",
    tags: ["kunst", "kultur", "arkitektur"],
  },
  {
    id: "aalborg-4",
    title: "Aalborg Karneval",
    subtitle: "Nordeuropas største karneval · Maj 2026",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop",
    type: "festival",
    tags: ["festival", "musik", "fest"],
  },
  {
    id: "aalborg-5",
    title: "Nibe Festival",
    subtitle: "Musik, fællesskab og sommer · Juni 2026",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop",
    type: "festival",
    tags: ["festival", "musik", "sommer"],
  },
  {
    id: "aalborg-6",
    title: "Fjordstien",
    subtitle: "Cykel- og gangsti langs Limfjorden",
    image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&auto=format&fit=crop",
    type: "sted",
    tags: ["cykling", "natur", "motion"],
  },
  {
    id: "aalborg-7",
    title: "Rold Skov",
    subtitle: "Danmarks eneste sprækkedal og stille stier",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop",
    type: "sted",
    tags: ["vandring", "skov", "natur"],
  },
  {
    id: "aalborg-8",
    title: "Limfjorden",
    subtitle: "Solnedgang og stilhed over fjorden",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop",
    type: "sted",
    tags: ["natur", "ro", "foto"],
  },
];

/* ── AMBASSADØRER: folk der gør det ── */
export interface Ambassador {
  id: string;
  name: string;
  avatar: string;
  action: string;
  emoji: string;
}

export const AMBASSADORS: Ambassador[] = [
  {
    id: "amb-1",
    name: "Anna",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop&crop=face",
    action: "Gik havnetur med 2 nye",
    emoji: "🚶‍♀️",
  },
  {
    id: "amb-2",
    name: "Mads",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&crop=face",
    action: "Brætspilaften med 5",
    emoji: "🎲",
  },
  {
    id: "amb-3",
    name: "Sofie",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&crop=face",
    action: "Lavede fællesspisning",
    emoji: "🍲",
  },
  {
    id: "amb-4",
    name: "Jonas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&crop=face",
    action: "5-mands fodbold med fremmede",
    emoji: "⚽",
  },
];

/* ── VENNERS OPLEVELSER ── */
export interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  action: string;
  event: string;
}

export const FRIENDS_ACTIVITIES: FriendActivity[] = [
  { id: "fa1", name: "Anna", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop&crop=face", action: "deltager i", event: "Gåtur langs Limfjorden" },
  { id: "fa2", name: "Mads", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&crop=face", action: "oprettede", event: "Brætspilsaften på Caféen" },
  { id: "fa3", name: "Sofie", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&crop=face", action: "deltager i", event: "Yoga i Kildeparken" },
  { id: "fa4", name: "Jonas", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&crop=face", action: "søger folk til", event: "Fodbold 5-mands" },
  { id: "fa5", name: "Emil", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&crop=face", action: "deltager i", event: "Kaffe-meetup Nordkraft" },
];
