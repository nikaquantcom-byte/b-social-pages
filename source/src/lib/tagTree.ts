/* ═══════════════════════════════════════════════
   B-Social Tag Tree — 3-niveau hierarki
   OVERKATEGORI → KATEGORI → UNDERKATEGORI
   Eksempel: Motion & Fitness → Cykling → racercykling, mtb, gravel …
   ═══════════════════════════════════════════════ */

export interface TagNode {
  tag: string;
  emoji: string;
  label: string;
  children?: TagNode[];
}

export const TAG_TREE: TagNode[] = [
  // ══════════════════════════════════════════════
  // 1. MOTION & FITNESS
  // ══════════════════════════════════════════════
  {
    tag: "motion-fitness",
    emoji: "🏃",
    label: "Motion & Fitness",
    children: [
      {
        tag: "løb", emoji: "🏃", label: "Løb", children: [
          { tag: "maraton", emoji: "🏅", label: "Maraton" },
          { tag: "trailløb", emoji: "🌲", label: "Trailløb" },
          { tag: "halvmaraton", emoji: "🥈", label: "Halvmaraton" },
          { tag: "5k", emoji: "🎯", label: "5K" },
          { tag: "intervalløb", emoji: "⚡", label: "Intervalløb" },
          { tag: "parkrun", emoji: "🌳", label: "Parkrun" },
          { tag: "crossfit-løb", emoji: "🔥", label: "CrossFit" },
        ],
      },
      {
        tag: "cykling", emoji: "🚴", label: "Cykling", children: [
          { tag: "racercykling", emoji: "🏎️", label: "Racercykling" },
          { tag: "mtb", emoji: "🚵", label: "Mountainbike" },
          { tag: "gravel", emoji: "🛤️", label: "Gravel" },
          { tag: "landevejscykling", emoji: "🛣️", label: "Landevejscykling" },
          { tag: "bmx", emoji: "🤸", label: "BMX" },
          { tag: "cykelløb", emoji: "🏁", label: "Cykelløb" },
        ],
      },
      {
        tag: "bold", emoji: "⚽", label: "Bold", children: [
          { tag: "fodbold", emoji: "⚽", label: "Fodbold" },
          { tag: "basketball", emoji: "🏀", label: "Basketball" },
          { tag: "volleyball", emoji: "🏐", label: "Volleyball" },
          { tag: "tennis", emoji: "🎾", label: "Tennis" },
          { tag: "håndbold", emoji: "🤾", label: "Håndbold" },
          { tag: "padel", emoji: "🏓", label: "Padel" },
          { tag: "badminton", emoji: "🏸", label: "Badminton" },
        ],
      },
      {
        tag: "svømning", emoji: "🏐", label: "Svømning", children: [
          { tag: "frisvømning", emoji: "🏐", label: "Frisvømning" },
          { tag: "havsvømning", emoji: "🌊", label: "Havsvømning" },
          { tag: "havnebad", emoji: "🏐", label: "Havnebad" },
          { tag: "vinterbadning", emoji: "🥶", label: "Vinterbadning" },
        ],
      },
      {
        tag: "fitness", emoji: "💪", label: "Fitness", children: [
          { tag: "styrketræning", emoji: "🏋️", label: "Styrketræning" },
          { tag: "crossfit", emoji: "🔥", label: "CrossFit" },
          { tag: "calisthenics", emoji: "🤸", label: "Calisthenics" },
          { tag: "hiit", emoji: "⚡", label: "HIIT" },
          { tag: "pilates", emoji: "🧘", label: "Pilates" },
        ],
      },
      {
        tag: "kampsport", emoji: "🥊", label: "Kampsport", children: [
          { tag: "boksning", emoji: "🥊", label: "Boksning" },
          { tag: "mma", emoji: "🤼", label: "MMA" },
          { tag: "jiu-jitsu", emoji: "🥋", label: "Jiu-Jitsu" },
          { tag: "karate", emoji: "🥋", label: "Karate" },
          { tag: "taekwondo", emoji: "🦶", label: "Taekwondo" },
          { tag: "kickboxing", emoji: "🦵", label: "Kickboxing" },
        ],
      },
      {
        tag: "vandsport", emoji: "🌊", label: "Vandsport", children: [
          { tag: "surfing", emoji: "🏄", label: "Surfing" },
          { tag: "sup", emoji: "🚣", label: "SUP" },
          { tag: "kajak", emoji: "🚣", label: "Kajak" },
          { tag: "kano", emoji: "🚣", label: "Kano" },
          { tag: "sejlads", emoji: "⛵", label: "Sejlads" },
          { tag: "wakeboard", emoji: "🏄", label: "Wakeboard" },
          { tag: "dykning", emoji: "🤿", label: "Dykning" },
          { tag: "kitesurfing", emoji: "🪁", label: "Kitesurfing" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════
  // 2. NATUR & OUTDOOR
  // ══════════════════════════════════════════════
  {
    tag: "natur-outdoor",
    emoji: "🌲",
    label: "Natur & Outdoor",
    children: [
      {
        tag: "vandring", emoji: "🥾", label: "Vandring", children: [
          { tag: "dagture", emoji: "🥾", label: "Dagture" },
          { tag: "flerdag", emoji: "🎒", label: "Flerdagsture" },
          { tag: "bjergvandring", emoji: "🏔️", label: "Bjergvandring" },
          { tag: "nationalpark", emoji: "🌿", label: "Nationalpark" },
        ],
      },
      {
        tag: "camping", emoji: "⛺", label: "Camping", children: [
          { tag: "shelter", emoji: "🏕️", label: "Shelter" },
          { tag: "telt", emoji: "⛺", label: "Telt" },
          { tag: "autocamping", emoji: "🚐", label: "Autocamping" },
          { tag: "glamping", emoji: "✨", label: "Glamping" },
          { tag: "primitiv-overnatning", emoji: "🌲", label: "Primitiv overnatning" },
        ],
      },
      {
        tag: "klatring", emoji: "🧗", label: "Klatring", children: [
          { tag: "indendørs", emoji: "🏢", label: "Indendørs" },
          { tag: "udendørs", emoji: "⛰️", label: "Udendørs" },
          { tag: "boulder", emoji: "🧗", label: "Boulder" },
        ],
      },
      {
        tag: "fiskeri", emoji: "🎣", label: "Fiskeri", children: [
          { tag: "lystfiskeri", emoji: "🎣", label: "Lystfiskeri" },
          { tag: "havfiskeri", emoji: "🌊", label: "Havfiskeri" },
          { tag: "fluefiskeri", emoji: "🪰", label: "Fluefiskeri" },
        ],
      },
      {
        tag: "jagt", emoji: "🦌", label: "Jagt", children: [
          { tag: "riffeljagt", emoji: "🎯", label: "Riffeljagt" },
          { tag: "buejagt", emoji: "🏹", label: "Buejagt" },
        ],
      },
      {
        tag: "outdoor", emoji: "🌿", label: "Outdoor", children: [
          { tag: "overlevelse", emoji: "🏕️", label: "Overlevelse" },
          { tag: "geocaching", emoji: "📍", label: "Geocaching" },
          { tag: "orienteringsløb", emoji: "🗺️", label: "Orienteringsløb" },
          { tag: "rafting", emoji: "🚣", label: "Rafting" },
          { tag: "paintball", emoji: "🔫", label: "Paintball" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════
  // 3. MUSIK & KULTUR
  // ══════════════════════════════════════════════
  {
    tag: "musik-kultur",
    emoji: "🎵",
    label: "Musik & Kultur",
    children: [
      {
        tag: "koncert", emoji: "🎤", label: "Koncert", children: [
          { tag: "rock", emoji: "🎸", label: "Rock" },
          { tag: "pop", emoji: "🎶", label: "Pop" },
          { tag: "jazz", emoji: "🎷", label: "Jazz" },
          { tag: "klassisk", emoji: "🎻", label: "Klassisk" },
          { tag: "metal", emoji: "🤘", label: "Metal" },
          { tag: "edm", emoji: "🎧", label: "EDM" },
          { tag: "hip-hop", emoji: "🎤", label: "Hip-hop" },
          { tag: "indie", emoji: "🎸", label: "Indie" },
        ],
      },
      {
        tag: "festival", emoji: "🎪", label: "Festival", children: [
          { tag: "musikfestival", emoji: "🎵", label: "Musikfestival" },
          { tag: "madfestival", emoji: "🍽️", label: "Madfestival" },
          { tag: "kulturfestival", emoji: "🎭", label: "Kulturfestival" },
          { tag: "filmfestival", emoji: "🎬", label: "Filmfestival" },
        ],
      },
      {
        tag: "teater", emoji: "🎭", label: "Teater", children: [
          { tag: "drama", emoji: "🎭", label: "Drama" },
          { tag: "komedie", emoji: "😂", label: "Komedie" },
          { tag: "børneteater", emoji: "🧸", label: "Børneteater" },
          { tag: "musical", emoji: "🎵", label: "Musical" },
          { tag: "stand-up", emoji: "🎤", label: "Stand-up" },
        ],
      },
      {
        tag: "kunst", emoji: "🎨", label: "Kunst", children: [
          { tag: "galleri", emoji: "🖼️", label: "Galleri" },
          { tag: "museum", emoji: "🏙️", label: "Museum" },
          { tag: "street-art", emoji: "🎨", label: "Street Art" },
          { tag: "udstilling", emoji: "🖼️", label: "Udstilling" },
          { tag: "keramik", emoji: "🏺", label: "Keramik" },
        ],
      },
      {
        tag: "film", emoji: "🎬", label: "Film", children: [
          { tag: "biograf", emoji: "🎬", label: "Biograf" },
          { tag: "udendørs-kino", emoji: "🌙", label: "Udendørs kino" },
          { tag: "premiere", emoji: "⭐", label: "Premiere" },
          { tag: "filmklub", emoji: "📽️", label: "Filmklub" },
          { tag: "dokumentar", emoji: "📹", label: "Dokumentar" },
        ],
      },
      {
        tag: "dans", emoji: "💃", label: "Dans", children: [
          { tag: "salsa", emoji: "💃", label: "Salsa" },
          { tag: "bachata", emoji: "💃", label: "Bachata" },
          { tag: "hip-hop-dans", emoji: "🕺", label: "Hip-hop dans" },
          { tag: "swing", emoji: "🕺", label: "Swing" },
          { tag: "tango", emoji: "💃", label: "Tango" },
          { tag: "ballet", emoji: "🩰", label: "Ballet" },
          { tag: "zumba", emoji: "🏋️", label: "Zumba" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════
  // 4. MAD & DRIKKE
  // ══════════════════════════════════════════════
  {
    tag: "mad-drikke",
    emoji: "🍽️",
    label: "Mad & Drikke",
    children: [
      {
        tag: "restaurant", emoji: "🍽️", label: "Restaurant", children: [
          { tag: "dansk", emoji: "🇩🇰", label: "Dansk" },
          { tag: "italiensk", emoji: "🇮🇹", label: "Italiensk" },
          { tag: "asiatisk", emoji: "🥢", label: "Asiatisk" },
          { tag: "vegansk", emoji: "🥬", label: "Vegansk" },
          { tag: "brunch", emoji: "🥞", label: "Brunch" },
        ],
      },
      {
        tag: "bar", emoji: "🍸", label: "Bar", children: [
          { tag: "cocktailbar", emoji: "🍹", label: "Cocktailbar" },
          { tag: "ølbar", emoji: "🍺", label: "Ølbar" },
          { tag: "vinbar", emoji: "🍷", label: "Vinbar" },
          { tag: "natklub", emoji: "🪩", label: "Natklub" },
        ],
      },
      {
        tag: "café", emoji: "☕", label: "Café", children: [
          { tag: "specialkaffe", emoji: "☕", label: "Specialkaffe" },
          { tag: "brunch-café", emoji: "🥐", label: "Brunch-café" },
          { tag: "takeaway", emoji: "🥡", label: "Takeaway" },
        ],
      },
      {
        tag: "marked", emoji: "🏪", label: "Marked", children: [
          { tag: "madfestival-marked", emoji: "🍽️", label: "Madfestival" },
          { tag: "streetfood", emoji: "🌮", label: "Streetfood" },
          { tag: "bøndermarked", emoji: "🥕", label: "Bøndermarked" },
        ],
      },
      {
        tag: "madlavning", emoji: "👩‍🍳", label: "Madlavning", children: [
          { tag: "kursus-mad", emoji: "📋", label: "Kursus" },
          { tag: "workshop-mad", emoji: "🛠️", label: "Workshop" },
          { tag: "pop-up-dinner", emoji: "🍽️", label: "Pop-up dinner" },
          { tag: "grillaften", emoji: "🥩", label: "Grillaften" },
          { tag: "sushi", emoji: "🍣", label: "Sushi" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════
  // 5. SOCIAL & HOBBY
  // ══════════════════════════════════════════════
  {
    tag: "social-hobby",
    emoji: "👋",
    label: "Social & Hobby",
    children: [
      {
        tag: "gaming", emoji: "🎮", label: "Gaming", children: [
          { tag: "pc-gaming", emoji: "🖥️", label: "PC Gaming" },
          { tag: "console", emoji: "🎮", label: "Konsol" },
          { tag: "vr-gaming", emoji: "🥽", label: "VR Gaming" },
          { tag: "esport", emoji: "🏆", label: "E-sport" },
          { tag: "brætspil", emoji: "🎲", label: "Brætspil" },
          { tag: "rollespil", emoji: "🐉", label: "Rollespil" },
          { tag: "lan-party", emoji: "🖧", label: "LAN Party" },
        ],
      },
      {
        tag: "frivilligt", emoji: "🫲", label: "Frivilligt", children: [
          { tag: "strandrensning", emoji: "🏖️", label: "Strandrensning" },
          { tag: "genbrugsbutik", emoji: "♻️", label: "Genbrugsbutik" },
          { tag: "dyreinternat", emoji: "🐕", label: "Dyreinternat" },
          { tag: "mentoring", emoji: "🎓", label: "Mentoring" },
        ],
      },
      {
        tag: "netværk", emoji: "🤝", label: "Netværk", children: [
          { tag: "startup", emoji: "🚀", label: "Startup" },
          { tag: "kreativt", emoji: "🎨", label: "Kreativt" },
          { tag: "professionelt", emoji: "💼", label: "Professionelt" },
          { tag: "speed-dating", emoji: "💕", label: "Speed-dating" },
          { tag: "singles", emoji: "💖", label: "Singles" },
        ],
      },
      {
        tag: "familie", emoji: "👨‍👩‍👧‍👦", label: "Familie", children: [
          { tag: "børnevenligt", emoji: "👶", label: "Børnevenligt" },
          { tag: "leg", emoji: "🎠", label: "Leg" },
          { tag: "zoo", emoji: "🦁", label: "Zoo" },
          { tag: "forlystelsespark", emoji: "🏙️", label: "Forlystelsespark" },
          { tag: "børneteater-fam", emoji: "🎭", label: "Børneteater" },
          { tag: "familievandring", emoji: "🥾", label: "Familievandring" },
          { tag: "seniorer", emoji: "👴", label: "Seniorer" },
        ],
      },
      {
        tag: "fotografering", emoji: "📸", label: "Fotografering", children: [
          { tag: "portræt", emoji: "📸", label: "Portræt" },
          { tag: "landskab", emoji: "🏞️", label: "Landskab" },
          { tag: "gadebilleder", emoji: "🏙️", label: "Gadebilleder" },
          { tag: "drone", emoji: "🛸", label: "Drone" },
          { tag: "film-foto", emoji: "🎬", label: "Film" },
          { tag: "vlogging", emoji: "📹", label: "Vlogging" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════
  // 6. LÆRING & UDVIKLING
  // ══════════════════════════════════════════════
  {
    tag: "læring-udvikling",
    emoji: "📚",
    label: "Læring & Udvikling",
    children: [
      {
        tag: "workshop", emoji: "🛠️", label: "Workshop", children: [
          { tag: "kreativt-ws", emoji: "🎨", label: "Kreativt" },
          { tag: "teknologi-ws", emoji: "💻", label: "Teknologi" },
          { tag: "business-ws", emoji: "💼", label: "Business" },
          { tag: "håndværk", emoji: "🔨", label: "Håndværk" },
        ],
      },
      {
        tag: "foredrag", emoji: "🎤️", label: "Foredrag", children: [
          { tag: "inspiration", emoji: "✨", label: "Inspiration" },
          { tag: "videnskab", emoji: "🔬", label: "Videnskab" },
          { tag: "politik", emoji: "🏙️", label: "Politik" },
          { tag: "ted-talks", emoji: "🎤", label: "TED Talks" },
        ],
      },
      {
        tag: "kursus", emoji: "📋", label: "Kursus", children: [
          { tag: "online", emoji: "💻", label: "Online" },
          { tag: "fysisk", emoji: "🏫", label: "Fysisk" },
          { tag: "certificering", emoji: "📜", label: "Certificering" },
        ],
      },
      {
        tag: "tech", emoji: "💻", label: "Tech", children: [
          { tag: "programmering", emoji: "👨‍💻", label: "Programmering" },
          { tag: "ai", emoji: "🤖", label: "AI" },
          { tag: "webdesign", emoji: "🌐", label: "Webdesign" },
          { tag: "hackathon", emoji: "💻", label: "Hackathon" },
        ],
      },
      {
        tag: "bøger", emoji: "📚", label: "Bøger", children: [
          { tag: "bogklub", emoji: "📖", label: "Bogklub" },
          { tag: "skrivning", emoji: "✍️", label: "Skrivning" },
          { tag: "lydbøger", emoji: "🎧", label: "Lydbøger" },
          { tag: "bibliotek", emoji: "🏙️", label: "Bibliotek" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════
  // 7. WELLNESS & BALANCE
  // ══════════════════════════════════════════════
  {
    tag: "wellness-balance",
    emoji: "🧘",
    label: "Wellness & Balance",
    children: [
      {
        tag: "yoga", emoji: "🧘", label: "Yoga", children: [
          { tag: "hatha", emoji: "🧘", label: "Hatha" },
          { tag: "vinyasa", emoji: "🧘", label: "Vinyasa" },
          { tag: "yin", emoji: "🌙", label: "Yin" },
          { tag: "hot-yoga", emoji: "🔥", label: "Hot Yoga" },
        ],
      },
      {
        tag: "meditation", emoji: "🧘", label: "Meditation", children: [
          { tag: "mindfulness", emoji: "🌿", label: "Mindfulness" },
          { tag: "guidet", emoji: "🎧", label: "Guidet" },
          { tag: "retreat", emoji: "🏡", label: "Retreat" },
        ],
      },
      {
        tag: "sauna", emoji: "🧖", label: "Sauna", children: [
          { tag: "vinterbadning-sauna", emoji: "🥶", label: "Vinterbadning" },
          { tag: "spa", emoji: "💆", label: "Spa" },
          { tag: "wellness-dag", emoji: "🌸", label: "Wellness-dag" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════
  // 8. REJSER & TRANSPORT
  // ══════════════════════════════════════════════
  {
    tag: "rejser-transport",
    emoji: "🚆",
    label: "Rejser & Transport",
    children: [
      {
        tag: "rejser", emoji: "✈️", label: "Rejser", children: [
          { tag: "tog", emoji: "🚆", label: "Tog" },
          { tag: "samkørsel", emoji: "🚗", label: "Samkørsel" },
          { tag: "cykelruter", emoji: "🚴", label: "Cykelruter" },
          { tag: "færge", emoji: "⛴️", label: "Færge" },
          { tag: "roadtrip", emoji: "🛣️", label: "Road Trip" },
          { tag: "flydeals", emoji: "✈️", label: "Fly-deals" },
          { tag: "interrail", emoji: "🚂", label: "Interrail" },
        ],
      },
      {
        tag: "logi", emoji: "🏕️", label: "Logi", children: [
          { tag: "shelter-logi", emoji: "⛺", label: "Shelter" },
          { tag: "vandrerhjem", emoji: "🏠", label: "Vandrerhjem" },
          { tag: "hytter", emoji: "🛖", label: "Hytter" },
          { tag: "glamping-logi", emoji: "✨", label: "Glamping" },
        ],
      },
    ],
  },
];

/* ── Helper: smart match for short vs long queries ── */
function smartMatch(text: string, q: string): boolean {
  const t = text.toLowerCase();
  if (q.length <= 3) {
    return t === q || t.startsWith(q) || t.includes("-" + q) || t.includes(" " + q);
  }
  return t.includes(q);
}

/* ── Flatten: get all tags as flat array (all 3 levels) ── */
export function getAllTagsFlat(): TagNode[] {
  const flat: TagNode[] = [];
  for (const over of TAG_TREE) {
    flat.push({ tag: over.tag, emoji: over.emoji, label: over.label });
    if (over.children) {
      for (const kat of over.children) {
        flat.push({ tag: kat.tag, emoji: kat.emoji, label: kat.label });
        if (kat.children) {
          for (const under of kat.children) {
            flat.push(under);
          }
        }
      }
    }
  }
  return flat;
}

/* ── Search: search across all 3 levels ── */
export function searchTags(query: string): TagNode[] {
  if (!query.trim()) return TAG_TREE.map(p => ({ tag: p.tag, emoji: p.emoji, label: p.label }));

  const q = query.toLowerCase().trim();
  const results: TagNode[] = [];
  const seen = new Set<string>();

  function addIfNew(node: TagNode) {
    if (!seen.has(node.tag)) {
      results.push({ tag: node.tag, emoji: node.emoji, label: node.label });
      seen.add(node.tag);
    }
  }

  for (const over of TAG_TREE) {
    const overMatch = smartMatch(over.tag, q) || smartMatch(over.label, q);

    if (overMatch) {
      // Match on overkategori → show it + all kategorier + all underkategorier
      addIfNew(over);
      if (over.children) {
        for (const kat of over.children) {
          addIfNew(kat);
          if (kat.children) {
            for (const under of kat.children) {
              addIfNew(under);
            }
          }
        }
      }
      continue;
    }

    // Check kategorier
    if (over.children) {
      for (const kat of over.children) {
        const katMatch = smartMatch(kat.tag, q) || smartMatch(kat.label, q);

        if (katMatch) {
          // Match on kategori → show overkategori + kategori + all underkategorier
          addIfNew(over);
          addIfNew(kat);
          if (kat.children) {
            for (const under of kat.children) {
              addIfNew(under);
            }
          }
        } else if (kat.children) {
          // Check underkategorier
          for (const under of kat.children) {
            if (smartMatch(under.tag, q) || smartMatch(under.label, q)) {
              // Match on underkategori → show overkategori + kategori + matching underkategori
              addIfNew(over);
              addIfNew(kat);
              addIfNew(under);
            }
          }
        }
      }
    }
  }

  return results;
}

/* ── Get children of a tag (works at any level) ── */
export function getChildren(tag: string): TagNode[] {
  // Check overkategorier
  for (const over of TAG_TREE) {
    if (over.tag === tag) return over.children || [];
    // Check kategorier
    if (over.children) {
      for (const kat of over.children) {
        if (kat.tag === tag) return kat.children || [];
      }
    }
  }
  return [];
}

/* ── Get parent categories (kategorier — the middle level) ── */
export function getParentCategories(): TagNode[] {
  const cats: TagNode[] = [];
  for (const over of TAG_TREE) {
    if (over.children) {
      for (const kat of over.children) {
        cats.push({ tag: kat.tag, emoji: kat.emoji, label: kat.label });
      }
    }
  }
  return cats;
}

/* ── Get overkategorier (top-level only) ── */
export function getOverkategorier(): TagNode[] {
  return TAG_TREE.map(o => ({ tag: o.tag, emoji: o.emoji, label: o.label }));
           }
