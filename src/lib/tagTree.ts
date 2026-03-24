/* ═══════════════════════════════════════════════
   B-Social Tag Tree — Komplet med underkategorier
   Når brugeren skriver "cykling" → Race, MTB, Gravel osv.
   ═══════════════════════════════════════════════ */

export interface TagNode {
  tag: string;
  emoji: string;
  label: string;
  children?: TagNode[];
}

export const TAG_TREE: TagNode[] = [
  // ── SPORT ──
  {
    tag: "cykling", emoji: "🚴", label: "Cykling", children: [
      { tag: "racercykling", emoji: "🏎️", label: "Racercykling" },
      { tag: "mtb", emoji: "🚵", label: "Mountainbike" },
      { tag: "gravel", emoji: "🛤️", label: "Gravel" },
      { tag: "landevejscykling", emoji: "🛣️", label: "Landevej" },
      { tag: "bycykling", emoji: "🚲", label: "Bycykling" },
      { tag: "bmx", emoji: "🤸", label: "BMX" },
      { tag: "cykelløb", emoji: "🏁", label: "Cykelløb" },
    ]
  },
  {
    tag: "løb", emoji: "🏃", label: "Løb", children: [
      { tag: "løbetur", emoji: "🏃", label: "Løbetur" },
      { tag: "trail", emoji: "🌲", label: "Trail running" },
      { tag: "maraton", emoji: "🏅", label: "Maraton" },
      { tag: "halvmaraton", emoji: "🥈", label: "Halvmaraton" },
      { tag: "5k", emoji: "🎯", label: "5K løb" },
      { tag: "intervalløb", emoji: "⚡", label: "Intervalløb" },
      { tag: "parkrun", emoji: "🌳", label: "Parkrun" },
    ]
  },
  {
    tag: "fodbold", emoji: "⚽", label: "Fodbold", children: [
      { tag: "fodbold-5v5", emoji: "⚽", label: "5-mands" },
      { tag: "fodbold-11v11", emoji: "⚽", label: "11-mands" },
      { tag: "futsal", emoji: "🏟️", label: "Futsal" },
      { tag: "strandfodbold", emoji: "🏖️", label: "Strandfodbold" },
    ]
  },
  {
    tag: "ski", emoji: "⛷️", label: "Ski", children: [
      { tag: "alpin", emoji: "⛷️", label: "Alpin" },
      { tag: "freestyle-ski", emoji: "🤸", label: "Freestyle" },
      { tag: "off-piste", emoji: "🏔️", label: "Off-piste" },
      { tag: "langrend", emoji: "🎿", label: "Langrend" },
      { tag: "telemark", emoji: "⛰️", label: "Telemark" },
      { tag: "skitouring", emoji: "🥾", label: "Skitouring" },
    ]
  },
  {
    tag: "snowboard", emoji: "🏂", label: "Snowboard", children: [
      { tag: "freestyle-snowboard", emoji: "🤸", label: "Freestyle" },
      { tag: "freeride", emoji: "🏔️", label: "Freeride" },
      { tag: "park-snowboard", emoji: "🎢", label: "Park" },
    ]
  },
  {
    tag: "svømning", emoji: "🏊", label: "Svømning", children: [
      { tag: "frisvømning", emoji: "🏊", label: "Frisvømning" },
      { tag: "havsvømning", emoji: "🌊", label: "Havsvømning" },
      { tag: "havnebad", emoji: "🏊", label: "Havnebad" },
      { tag: "vinterbadning", emoji: "🥶", label: "Vinterbadning" },
      { tag: "vandpolo", emoji: "🤽", label: "Vandpolo" },
    ]
  },
  {
    tag: "fitness", emoji: "💪", label: "Fitness", children: [
      { tag: "styrketræning", emoji: "🏋️", label: "Styrketræning" },
      { tag: "crossfit", emoji: "🔥", label: "CrossFit" },
      { tag: "calisthenics", emoji: "🤸", label: "Calisthenics" },
      { tag: "hiit", emoji: "⚡", label: "HIIT" },
      { tag: "funktionel", emoji: "🏃", label: "Funktionel træning" },
    ]
  },
  {
    tag: "kampsport", emoji: "🥊", label: "Kampsport", children: [
      { tag: "boksning", emoji: "🥊", label: "Boksning" },
      { tag: "mma", emoji: "🤼", label: "MMA" },
      { tag: "jiu-jitsu", emoji: "🥋", label: "Jiu-Jitsu" },
      { tag: "karate", emoji: "🥋", label: "Karate" },
      { tag: "taekwondo", emoji: "🦶", label: "Taekwondo" },
      { tag: "kickboxing", emoji: "🦵", label: "Kickboxing" },
    ]
  },
  {
    tag: "vandsport", emoji: "🌊", label: "Vandsport", children: [
      { tag: "surfing", emoji: "🏄", label: "Surfing" },
      { tag: "sup", emoji: "🛶", label: "SUP" },
      { tag: "kajak", emoji: "🛶", label: "Kajak" },
      { tag: "kano", emoji: "🛶", label: "Kano" },
      { tag: "sejlads", emoji: "⛵", label: "Sejlads" },
      { tag: "wakeboard", emoji: "🏄", label: "Wakeboard" },
      { tag: "dykning", emoji: "🤿", label: "Dykning" },
      { tag: "kitesurfing", emoji: "🪁", label: "Kitesurfing" },
    ]
  },
  {
    tag: "basketball", emoji: "🏀", label: "Basketball", children: [
      { tag: "streetball", emoji: "🏀", label: "Streetball" },
      { tag: "3v3", emoji: "🏀", label: "3v3" },
    ]
  },
  {
    tag: "tennis", emoji: "🎾", label: "Tennis", children: [
      { tag: "padel", emoji: "🏓", label: "Padel" },
      { tag: "badminton", emoji: "🏸", label: "Badminton" },
      { tag: "bordtennis", emoji: "🏓", label: "Bordtennis" },
      { tag: "squash", emoji: "🎾", label: "Squash" },
    ]
  },
  {
    tag: "golf", emoji: "⛳", label: "Golf", children: [
      { tag: "disc-golf", emoji: "🥏", label: "Disc Golf" },
      { tag: "minigolf", emoji: "⛳", label: "Minigolf" },
    ]
  },
  {
    tag: "klatring", emoji: "🧗", label: "Klatring", children: [
      { tag: "bouldering", emoji: "🧗", label: "Bouldering" },
      { tag: "indendørs-klatring", emoji: "🏢", label: "Indendørs" },
      { tag: "friluftsklatring", emoji: "⛰️", label: "Udendørs" },
    ]
  },
  {
    tag: "rulleskøjter", emoji: "🛼", label: "Rulleskøjter", children: [
      { tag: "inline-skating", emoji: "🛼", label: "Inline" },
      { tag: "skateboard", emoji: "🛹", label: "Skateboard" },
      { tag: "longboard", emoji: "🛹", label: "Longboard" },
    ]
  },
  {
    tag: "ridning", emoji: "🏇", label: "Ridning", children: [
      { tag: "dressur", emoji: "🏇", label: "Dressur" },
      { tag: "spring", emoji: "🏇", label: "Spring" },
      { tag: "terrænridning", emoji: "🐎", label: "Terrænridning" },
    ]
  },

  // ── GAMING ──
  {
    tag: "gaming", emoji: "🎮", label: "Gaming", children: [
      { tag: "pc-gaming", emoji: "🖥️", label: "PC Gaming" },
      { tag: "console", emoji: "🎮", label: "Konsol" },
      { tag: "mobilspil", emoji: "📱", label: "Mobilspil" },
      { tag: "vr-gaming", emoji: "🥽", label: "VR Gaming" },
      { tag: "fps", emoji: "🔫", label: "FPS / Shooters" },
      { tag: "mmorpg", emoji: "⚔️", label: "MMORPG" },
      { tag: "strategi", emoji: "🧠", label: "Strategi" },
      { tag: "racing-spil", emoji: "🏎️", label: "Racing" },
      { tag: "sportsspil", emoji: "⚽", label: "Sportsspil" },
      { tag: "retro-gaming", emoji: "👾", label: "Retro" },
      { tag: "esport", emoji: "🏆", label: "E-sport" },
      { tag: "brætspil", emoji: "🎲", label: "Brætspil" },
      { tag: "rollespil", emoji: "🐉", label: "Rollespil / D&D" },
      { tag: "kortspil", emoji: "🃏", label: "Kortspil" },
      { tag: "lan-party", emoji: "🖧", label: "LAN Party" },
    ]
  },

  // ── MUSIK ──
  {
    tag: "musik", emoji: "🎵", label: "Musik", children: [
      { tag: "koncert", emoji: "🎤", label: "Koncert" },
      { tag: "festival", emoji: "🎪", label: "Festival" },
      { tag: "rock", emoji: "🎸", label: "Rock" },
      { tag: "pop", emoji: "🎶", label: "Pop" },
      { tag: "elektronisk", emoji: "🎧", label: "Elektronisk / DJ" },
      { tag: "jazz", emoji: "🎷", label: "Jazz" },
      { tag: "klassisk", emoji: "🎻", label: "Klassisk" },
      { tag: "hip-hop", emoji: "🎤", label: "Hip-hop / Rap" },
      { tag: "country", emoji: "🤠", label: "Country" },
      { tag: "metal", emoji: "🤘", label: "Metal" },
      { tag: "akustisk", emoji: "🪕", label: "Akustisk" },
      { tag: "kor", emoji: "🎼", label: "Kor / Sang" },
      { tag: "jam-session", emoji: "🎸", label: "Jam session" },
      { tag: "dj", emoji: "💿", label: "DJ / Mixing" },
    ]
  },

  // ── DANS ──
  {
    tag: "dans", emoji: "💃", label: "Dans", children: [
      { tag: "salsa", emoji: "💃", label: "Salsa" },
      { tag: "bachata", emoji: "💃", label: "Bachata" },
      { tag: "hip-hop-dans", emoji: "🕺", label: "Hip-hop dans" },
      { tag: "swing", emoji: "🕺", label: "Swing" },
      { tag: "tango", emoji: "💃", label: "Tango" },
      { tag: "ballet", emoji: "🩰", label: "Ballet" },
      { tag: "folkedans", emoji: "👯", label: "Folkedans" },
      { tag: "zumba", emoji: "🏋️", label: "Zumba" },
      { tag: "linedance", emoji: "🤠", label: "Linedance" },
    ]
  },

  // ── NATUR ──
  {
    tag: "natur", emoji: "🌲", label: "Natur", children: [
      { tag: "vandring", emoji: "🥾", label: "Vandring" },
      { tag: "skov", emoji: "🌲", label: "Skov" },
      { tag: "strand", emoji: "🏖️", label: "Strand" },
      { tag: "shelter", emoji: "🏕️", label: "Shelter" },
      { tag: "nationalpark", emoji: "🌿", label: "Nationalpark" },
      { tag: "fiskeri", emoji: "🎣", label: "Fiskeri" },
      { tag: "fuglekiggeri", emoji: "🐦", label: "Fuglekiggeri" },
      { tag: "camping", emoji: "⛺", label: "Camping" },
      { tag: "bål", emoji: "🔥", label: "Bål & udendørs" },
      { tag: "svampejagt", emoji: "🍄", label: "Svampejagt" },
      { tag: "stjerneturen", emoji: "⭐", label: "Stjernekig" },
      { tag: "gåtur", emoji: "🚶", label: "Gåtur" },
      { tag: "naturlegeplads", emoji: "🌲", label: "Naturlegeplads" },
    ]
  },

  // ── MAD & DRIKKE ──
  {
    tag: "mad", emoji: "🍽️", label: "Mad & Drikke", children: [
      { tag: "madlavning", emoji: "👩‍🍳", label: "Madlavning" },
      { tag: "bagning", emoji: "🍰", label: "Bagning" },
      { tag: "streetfood", emoji: "🌮", label: "Streetfood" },
      { tag: "sushi", emoji: "🍣", label: "Sushi" },
      { tag: "grillaften", emoji: "🥩", label: "Grill" },
      { tag: "vegansk", emoji: "🥬", label: "Vegansk" },
      { tag: "vinsmagning", emoji: "🍷", label: "Vinsmagning" },
      { tag: "ølsmagning", emoji: "🍺", label: "Ølsmagning" },
      { tag: "cocktails", emoji: "🍹", label: "Cocktails" },
      { tag: "kaffe", emoji: "☕", label: "Kaffe" },
      { tag: "te", emoji: "🍵", label: "Te" },
      { tag: "restaurant", emoji: "🍽️", label: "Restaurant" },
      { tag: "cafe", emoji: "☕", label: "Café" },
      { tag: "bar", emoji: "🍺", label: "Bar" },
      { tag: "foodmarket", emoji: "🏪", label: "Food Market" },
    ]
  },

  // ── KUNST & KULTUR ──
  {
    tag: "kunst", emoji: "🎨", label: "Kunst & Kultur", children: [
      { tag: "maleri", emoji: "🖌️", label: "Maleri" },
      { tag: "skulptur", emoji: "🗿", label: "Skulptur" },
      { tag: "galleri", emoji: "🖼️", label: "Galleri" },
      { tag: "museum", emoji: "🏛️", label: "Museum" },
      { tag: "teater", emoji: "🎭", label: "Teater" },
      { tag: "musical", emoji: "🎭", label: "Musical" },
      { tag: "stand-up", emoji: "🎤", label: "Stand-up" },
      { tag: "impro", emoji: "🎪", label: "Impro" },
      { tag: "poesi", emoji: "📝", label: "Poesi / Spoken Word" },
      { tag: "keramik", emoji: "🏺", label: "Keramik" },
      { tag: "strik", emoji: "🧶", label: "Strik & Håndarbejde" },
    ]
  },

  // ── FOTO & FILM ──
  {
    tag: "fotografering", emoji: "📸", label: "Foto & Film", children: [
      { tag: "portræt", emoji: "📸", label: "Portræt" },
      { tag: "landskab", emoji: "🏞️", label: "Landskab" },
      { tag: "gadebilleder", emoji: "🏙️", label: "Gadefoto" },
      { tag: "drone", emoji: "🛸", label: "Drone" },
      { tag: "film", emoji: "🎬", label: "Film" },
      { tag: "dokumentar", emoji: "📹", label: "Dokumentar" },
      { tag: "vlogging", emoji: "📹", label: "Vlogging" },
    ]
  },

  // ── YOGA & WELLNESS ──
  {
    tag: "yoga", emoji: "🧘", label: "Yoga & Wellness", children: [
      { tag: "hatha", emoji: "🧘", label: "Hatha" },
      { tag: "vinyasa", emoji: "🧘", label: "Vinyasa" },
      { tag: "yin", emoji: "🌙", label: "Yin" },
      { tag: "hot-yoga", emoji: "🔥", label: "Hot Yoga" },
      { tag: "meditation", emoji: "🧘", label: "Meditation" },
      { tag: "mindfulness", emoji: "🌿", label: "Mindfulness" },
      { tag: "sauna", emoji: "🧖", label: "Sauna" },
      { tag: "spa", emoji: "💆", label: "Spa" },
      { tag: "breathwork", emoji: "🌬️", label: "Breathwork" },
    ]
  },

  // ── SOCIAL ──
  {
    tag: "social", emoji: "👋", label: "Social", children: [
      { tag: "netværk", emoji: "🤝", label: "Netværk" },
      { tag: "singles", emoji: "💖", label: "Singles" },
      { tag: "hygge", emoji: "🕯️", label: "Hygge" },
      { tag: "book-club", emoji: "📚", label: "Bogklub" },
      { tag: "språkcafe", emoji: "🗣️", label: "Sprogcafé" },
      { tag: "quiz", emoji: "🧠", label: "Quiz aften" },
      { tag: "filmaften", emoji: "🎬", label: "Filmaften" },
      { tag: "picnic", emoji: "🧺", label: "Picnic" },
      { tag: "fællesspisning", emoji: "🍲", label: "Fællesspisning" },
    ]
  },

  // ── FAMILIE ──
  {
    tag: "familie", emoji: "👨‍👩‍👧‍👦", label: "Familie", children: [
      { tag: "leg", emoji: "🎠", label: "Legeplads" },
      { tag: "zoo", emoji: "🦁", label: "Zoo / Dyrepark" },
      { tag: "forlystelsespark", emoji: "🎢", label: "Forlystelsespark" },
      { tag: "børneteater", emoji: "🎭", label: "Børneteater" },
      { tag: "familievandring", emoji: "🥾", label: "Familievandring" },
      { tag: "svømmeland", emoji: "🏊", label: "Svømmeland" },
      { tag: "naturlegeplads", emoji: "🌲", label: "Naturlegeplads" },
    ]
  },

  // ── OUTDOOR ADVENTURE ──
  {
    tag: "outdoor", emoji: "🌿", label: "Outdoor", children: [
      { tag: "overlevelse", emoji: "🏕️", label: "Overlevelse / Bushcraft" },
      { tag: "geocaching", emoji: "📍", label: "Geocaching" },
      { tag: "orienteringsløb", emoji: "🗺️", label: "Orienteringsløb" },
      { tag: "rafting", emoji: "🚣", label: "Rafting" },
      { tag: "zip-line", emoji: "🏔️", label: "Zip-line" },
      { tag: "treetop", emoji: "🌳", label: "Treetop / Klatrepark" },
      { tag: "paintball", emoji: "🔫", label: "Paintball" },
      { tag: "archery", emoji: "🏹", label: "Bueskydning" },
    ]
  },

  // ── TECH & LÆRING ──
  {
    tag: "tech", emoji: "💻", label: "Tech & Læring", children: [
      { tag: "programmering", emoji: "👨‍💻", label: "Programmering" },
      { tag: "ai", emoji: "🤖", label: "AI / Machine Learning" },
      { tag: "webdesign", emoji: "🌐", label: "Webdesign" },
      { tag: "startup", emoji: "🚀", label: "Startup" },
      { tag: "workshop", emoji: "🛠️", label: "Workshop" },
      { tag: "foredrag", emoji: "🎙️", label: "Foredrag" },
      { tag: "hackathon", emoji: "💻", label: "Hackathon" },
      { tag: "3d-print", emoji: "🖨️", label: "3D Print" },
      { tag: "elektronik", emoji: "🔌", label: "Elektronik / Arduino" },
    ]
  },

  // ── BØGER & SKRIVNING ──
  {
    tag: "bøger", emoji: "📚", label: "Bøger", children: [
      { tag: "bogklub", emoji: "📖", label: "Bogklub" },
      { tag: "skrivning", emoji: "✍️", label: "Skrivning" },
      { tag: "lydbøger", emoji: "🎧", label: "Lydbøger" },
      { tag: "bibliotek", emoji: "🏛️", label: "Bibliotek" },
    ]
  },

  // ── FRIVILLIGT ──
  {
    tag: "frivilligt", emoji: "🤲", label: "Frivilligt", children: [
      { tag: "strandrensning", emoji: "🏖️", label: "Strandrensning" },
      { tag: "genbrugsbutik", emoji: "♻️", label: "Genbrug" },
      { tag: "dyreinternat", emoji: "🐕", label: "Dyreinternat" },
      { tag: "mentoring", emoji: "🎓", label: "Mentoring" },
    ]
  },

  // ── SHOPPING & MARKEDER ──
  {
    tag: "shopping", emoji: "🛍️", label: "Shopping", children: [
      { tag: "loppemarked", emoji: "🏪", label: "Loppemarked" },
      { tag: "julemarked", emoji: "🎄", label: "Julemarked" },
      { tag: "designmarked", emoji: "✨", label: "Designmarked" },
      { tag: "bondens-marked", emoji: "🥕", label: "Bondens marked" },
      { tag: "vintage", emoji: "👗", label: "Vintage" },
    ]
  },

  // ── MOTOR ──
  {
    tag: "motor", emoji: "🏎️", label: "Motor", children: [
      { tag: "go-kart", emoji: "🏎️", label: "Go-Kart" },
      { tag: "motorcykel", emoji: "🏍️", label: "Motorcykel" },
      { tag: "billøb", emoji: "🏁", label: "Billøb" },
      { tag: "classic-cars", emoji: "🚗", label: "Klassiske biler" },
    ]
  },

  // ── DYR ──
  {
    tag: "dyr", emoji: "🐾", label: "Dyr", children: [
      { tag: "hundetur", emoji: "🐕", label: "Hundetur" },
      { tag: "hundeskov", emoji: "🐕", label: "Hundeskov" },
      { tag: "hundedressur", emoji: "🦮", label: "Hundedressur" },
      { tag: "ridning-tur", emoji: "🐎", label: "Ridning" },
      { tag: "dyrespotting", emoji: "🦌", label: "Dyrespotting" },
    ]
  },

  // ── REJSER & TRANSPORT ──
  {
    tag: "rejser", emoji: "🚆", label: "Rejser & Transport", children: [
      { tag: "tog", emoji: "🚆", label: "Tog" },
      { tag: "samkoersel", emoji: "🚗", label: "Samkørsel" },
      { tag: "cykelruter", emoji: "🚴", label: "Cykelruter" },
      { tag: "faerge", emoji: "⛴️", label: "Færge" },
      { tag: "roadtrip", emoji: "🛣️", label: "Road Trip" },
      { tag: "flydeals", emoji: "✈️", label: "Fly-deals" },
      { tag: "interrail", emoji: "🚂", label: "Interrail" },
      { tag: "bus", emoji: "🚌", label: "Bus" },
      { tag: "el-loebehjul", emoji: "🛴", label: "El-løbehjul" },
    ]
  },

  // ── LOGI & BASE ──
  {
    tag: "logi", emoji: "🏕️", label: "Logi & Base", children: [
      { tag: "shelter", emoji: "⛺", label: "Shelter" },
      { tag: "camping", emoji: "🏕️", label: "Camping" },
      { tag: "vandrerhjem", emoji: "🏠", label: "Vandrerhjem" },
      { tag: "hytter", emoji: "🛖", label: "Hytter" },
      { tag: "glamping", emoji: "✨", label: "Glamping" },
      { tag: "baal", emoji: "🔥", label: "Bål & overnatning" },
      { tag: "teltplads", emoji: "⛺", label: "Teltplads" },
      { tag: "primitiv-overnatning", emoji: "🌲", label: "Primitiv overnatning" },
    ]
  },
];

/* ── Flatten: get all tags as flat array ── */
export function getAllTagsFlat(): TagNode[] {
  const flat: TagNode[] = [];
  for (const parent of TAG_TREE) {
    flat.push({ tag: parent.tag, emoji: parent.emoji, label: parent.label });
    if (parent.children) {
      for (const child of parent.children) {
        flat.push(child);
      }
    }
  }
  return flat;
}

/* ── Search: type "cykling" → get parent + all children ── */
/** Smart match: short queries (≤3 chars) use word-start matching to avoid
 *  false positives like "tog" matching "fo-tog-rafering". Longer queries
 *  use standard substring matching. */
function smartMatch(text: string, q: string): boolean {
  const t = text.toLowerCase();
  if (q.length <= 3) {
    // Must start a word: beginning of string, after a hyphen, after a space, or exact match
    return t === q || t.startsWith(q) || t.includes("-" + q) || t.includes(" " + q);
  }
  return t.includes(q);
}

export function searchTags(query: string): TagNode[] {
  if (!query.trim()) return TAG_TREE.map(p => ({ tag: p.tag, emoji: p.emoji, label: p.label }));

  const q = query.toLowerCase().trim();
  const results: TagNode[] = [];
  const seen = new Set<string>();

  for (const parent of TAG_TREE) {
    const parentMatch =
      smartMatch(parent.tag, q) ||
      smartMatch(parent.label, q);

    if (parentMatch) {
      // Show parent + ALL children
      if (!seen.has(parent.tag)) {
        results.push({ tag: parent.tag, emoji: parent.emoji, label: parent.label });
        seen.add(parent.tag);
      }
      if (parent.children) {
        for (const child of parent.children) {
          if (!seen.has(child.tag)) {
            results.push(child);
            seen.add(child.tag);
          }
        }
      }
    } else if (parent.children) {
      // Check children individually
      for (const child of parent.children) {
        if (
          smartMatch(child.tag, q) ||
          smartMatch(child.label, q)
        ) {
          // Show parent first, then matching child
          if (!seen.has(parent.tag)) {
            results.push({ tag: parent.tag, emoji: parent.emoji, label: parent.label });
            seen.add(parent.tag);
          }
          if (!seen.has(child.tag)) {
            results.push(child);
            seen.add(child.tag);
          }
        }
      }
    }
  }

  return results;
}

/* ── Get children of a tag ── */
export function getChildren(tag: string): TagNode[] {
  const parent = TAG_TREE.find(p => p.tag === tag);
  return parent?.children || [];
}

/* ── Get parent categories only ── */
export function getParentCategories(): TagNode[] {
  return TAG_TREE.map(p => ({ tag: p.tag, emoji: p.emoji, label: p.label }));
}
