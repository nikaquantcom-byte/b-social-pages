import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── RapidAPI Real-Time Events Search — MAXIMUM IMPORT ─────────────────────
// Pro plan: 10K calls/mo, 5 req/sec
// Strategy: query × date × pagination = massive coverage

const RAPIDAPI_HOST = "real-time-events-search.p.rapidapi.com";

// ─── Query matrix: category keywords × major cities per country ────────────
// Each query costs 1 API call. We want MAXIMUM coverage.

// Event type keywords (English works globally on Google Events)
const EVENT_QUERIES = [
  // Concerts & Music
  "concerts", "live music", "festival", "music festival", "jazz concert",
  "rock concert", "electronic music", "DJ event", "opera", "symphony",
  // Sports
  "football match", "soccer game", "basketball game", "tennis tournament",
  "cycling race", "marathon", "triathlon", "boxing match", "MMA fight",
  // Culture & Museums
  "museum exhibition", "art exhibition", "gallery opening", "theater",
  "comedy show", "stand-up comedy", "ballet", "dance performance",
  // Food & Drink
  "food festival", "wine tasting", "beer festival", "street food market",
  "cooking class", "restaurant event", "food truck festival",
  // Outdoor & Nature
  "hiking event", "mountain bike event", "outdoor festival", "camping event",
  "nature walk", "bird watching", "trail running", "kayaking event",
  // Amusement & Family
  "theme park", "amusement park", "zoo event", "aquarium event",
  "family event", "kids event", "circus", "carnival",
  // Wellness & Fitness
  "yoga class", "fitness event", "outdoor gym", "crossfit event",
  "meditation workshop", "wellness retreat", "pilates class",
  // Markets & Shopping
  "flea market", "christmas market", "farmers market", "craft market",
  "antique fair", "night market",
  // Workshops & Learning
  "workshop", "masterclass", "seminar", "conference", "tech meetup",
  "startup event", "networking event", "hackathon",
  // Nightlife
  "nightclub event", "party", "rave", "club night", "karaoke night",
  // Film & Entertainment
  "movie premiere", "film festival", "cinema event", "outdoor cinema",
  "gaming event", "esports tournament",
  // Seasonal & Special
  "new year event", "summer festival", "spring event", "halloween event",
  "pride event", "carnival parade",
];

// Major cities per country — the query includes city name for geo-targeting
const COUNTRY_CITIES: Record<string, string[]> = {
  // Scandinavia (priority)
  DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde", "Helsingør", "Silkeborg", "Herning", "Fredericia", "Viborg", "Næstved", "Svendborg", "Frederikshavn"],
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Linköping", "Örebro", "Västerås", "Helsingborg", "Norrköping", "Lund"],
  NO: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø", "Drammen", "Kristiansand", "Fredrikstad", "Ålesund"],
  FI: ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu", "Jyväskylä", "Lahti", "Rovaniemi"],
  // Western Europe
  DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig", "Dresden", "Hannover"],
  NL: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen", "Tilburg", "Maastricht"],
  BE: ["Brussels", "Antwerp", "Ghent", "Bruges", "Liège", "Leuven", "Namur"],
  AT: ["Vienna", "Salzburg", "Innsbruck", "Graz", "Linz", "Klagenfurt"],
  CH: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Lucerne", "Interlaken"],
  // Southern Europe
  ES: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao", "Malaga", "Granada", "San Sebastian", "Ibiza", "Palma de Mallorca"],
  FR: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Strasbourg", "Lille", "Nantes", "Montpellier"],
  IT: ["Rome", "Milan", "Florence", "Venice", "Naples", "Turin", "Bologna", "Verona", "Palermo", "Genoa"],
  // British Isles
  GB: ["London", "Manchester", "Edinburgh", "Birmingham", "Glasgow", "Liverpool", "Bristol", "Leeds", "Brighton", "Cardiff"],
  IE: ["Dublin", "Cork", "Galway", "Limerick", "Belfast", "Killarney"],
  // Central/Eastern Europe
  PL: ["Warsaw", "Krakow", "Wroclaw", "Gdansk", "Poznan", "Lodz", "Katowice"],
  CZ: ["Prague", "Brno", "Ostrava", "Pilsen", "Olomouc"],
  // Americas
  US: ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami", "Austin", "Nashville", "Denver", "Seattle", "Portland", "Boston", "New Orleans", "Las Vegas"],
  CA: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Quebec City"],
  MX: ["Mexico City", "Cancun", "Guadalajara", "Monterrey", "Playa del Carmen", "Oaxaca"],
  BR: ["São Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Belo Horizonte", "Curitiba"],
  CL: ["Santiago", "Valparaiso", "Concepcion"],
  PE: ["Lima", "Cusco", "Arequipa"],
  // Others
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Cairns"],
  NZ: ["Auckland", "Wellington", "Queenstown", "Christchurch", "Rotorua"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah"],
  ZA: ["Cape Town", "Johannesburg", "Durban", "Pretoria"],
  TR: ["Istanbul", "Ankara", "Antalya", "Izmir", "Cappadocia", "Bodrum"],
};

// Country code to name mapping for geo context
const COUNTRY_NAMES: Record<string, string> = {
  DK: "Denmark", SE: "Sweden", NO: "Norway", FI: "Finland",
  DE: "Germany", NL: "Netherlands", BE: "Belgium", AT: "Austria", CH: "Switzerland",
  ES: "Spain", FR: "France", IT: "Italy",
  GB: "United Kingdom", IE: "Ireland",
  PL: "Poland", CZ: "Czech Republic",
  US: "United States", CA: "Canada", MX: "Mexico",
  BR: "Brazil", CL: "Chile", PE: "Peru",
  AU: "Australia", NZ: "New Zealand",
  AE: "United Arab Emirates", ZA: "South Africa", TR: "Turkey",
};

// Date filters to maximize coverage
const DATE_FILTERS = ["today", "tomorrow", "week", "weekend", "next_week", "month", "next_month"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface RapidAPIEvent {
  event_id?: string;
  name?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  is_virtual?: boolean;
  thumbnail?: string;
  link?: string;
  venue?: {
    name?: string;
    full_address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  tags?: string[];
  language?: string;
  ticket_links?: { source?: string; link?: string }[];
}

interface ImportResult {
  source: string;
  query: string;
  date_filter: string;
  fetched: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

// ─── Category mapping ─────────────────────────────────────────────────────────

function categorizeEvent(query: string, event: RapidAPIEvent): { category: string; tags: string[]; indoor_outdoor: string } {
  const q = query.toLowerCase();
  const name = (event.name || "").toLowerCase();
  const desc = (event.description || "").toLowerCase();
  const combined = `${q} ${name} ${desc}`;
  const tags: string[] = event.tags || [];

  // Music
  if (/concert|live music|festival|jazz|rock|electronic|dj|opera|symphony|musik/i.test(combined)) {
    return { category: "Musik & Koncerter", tags: [...tags, "musik", "koncert", "live"], indoor_outdoor: combined.includes("outdoor") ? "outdoor" : "indoor" };
  }
  // Sports
  if (/football|soccer|basketball|tennis|cycling|marathon|triathlon|boxing|mma|sport/i.test(combined)) {
    return { category: "Sport", tags: [...tags, "sport", "konkurrence"], indoor_outdoor: "outdoor" };
  }
  // Culture
  if (/museum|exhibition|gallery|theater|theatre|comedy|stand-up|ballet|dance|kultur/i.test(combined)) {
    return { category: "Kultur & Kunst", tags: [...tags, "kultur", "kunst"], indoor_outdoor: "indoor" };
  }
  // Food
  if (/food|wine|beer|street food|cooking|restaurant|tasting|gastro/i.test(combined)) {
    return { category: "Mad & Drikke", tags: [...tags, "mad", "gastronomi"], indoor_outdoor: "indoor" };
  }
  // Outdoor & Nature
  if (/hiking|mountain bike|outdoor|camping|nature|trail|kayak|bird watch/i.test(combined)) {
    return { category: "Natur & Friluftsliv", tags: [...tags, "natur", "friluftsliv", "outdoor"], indoor_outdoor: "outdoor" };
  }
  // Amusement & Family
  if (/theme park|amusement|zoo|aquarium|family|kids|circus|carnival/i.test(combined)) {
    return { category: "Familie & Børn", tags: [...tags, "familie", "børn"], indoor_outdoor: "outdoor" };
  }
  // Wellness
  if (/yoga|fitness|gym|crossfit|meditation|wellness|pilates/i.test(combined)) {
    return { category: "Sundhed & Wellness", tags: [...tags, "fitness", "wellness"], indoor_outdoor: "indoor" };
  }
  // Markets
  if (/market|flea|christmas|farmers|craft|antique|night market/i.test(combined)) {
    return { category: "Markeder & Shopping", tags: [...tags, "marked", "shopping"], indoor_outdoor: "outdoor" };
  }
  // Workshops
  if (/workshop|masterclass|seminar|conference|meetup|hackathon|networking/i.test(combined)) {
    return { category: "Workshops & Læring", tags: [...tags, "læring", "workshop"], indoor_outdoor: "indoor" };
  }
  // Nightlife
  if (/nightclub|party|rave|club night|karaoke/i.test(combined)) {
    return { category: "Natteliv", tags: [...tags, "natteliv", "fest"], indoor_outdoor: "indoor" };
  }
  // Film
  if (/movie|film|cinema|gaming|esport/i.test(combined)) {
    return { category: "Film & Underholdning", tags: [...tags, "film", "underholdning"], indoor_outdoor: "indoor" };
  }

  return { category: "Events", tags: [...tags, "event"], indoor_outdoor: "indoor" };
}

// ─── Fetch from RapidAPI ──────────────────────────────────────────────────────

async function fetchRapidAPIEvents(
  apiKey: string,
  query: string,
  dateFilter: string,
  startOffset: number = 0,
  isVirtual: boolean = false,
): Promise<RapidAPIEvent[]> {
  const url = new URL("https://real-time-events-search.p.rapidapi.com/search-events");
  url.searchParams.set("query", query);
  url.searchParams.set("date", dateFilter);
  url.searchParams.set("is_virtual", String(isVirtual));
  if (startOffset > 0) url.searchParams.set("start", String(startOffset));

  const resp = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`RapidAPI ${resp.status}: ${text.slice(0, 200)}`);
  }

  const data = await resp.json();
  return data.data || data.events || data.results || [];
}

// ─── Country detection from event data ────────────────────────────────────────

function detectCountry(event: RapidAPIEvent, queryCity: string, queryCountryCode: string): string {
  // Try venue country first
  const venueCountry = event.venue?.country?.toUpperCase();
  if (venueCountry) {
    // Map common country names to codes
    const nameToCode: Record<string, string> = {
      "DENMARK": "DK", "UNITED STATES": "US", "USA": "US", "GERMANY": "DE",
      "FRANCE": "FR", "UNITED KINGDOM": "GB", "UK": "GB", "SPAIN": "ES",
      "ITALY": "IT", "NETHERLANDS": "NL", "BELGIUM": "BE", "AUSTRIA": "AT",
      "SWITZERLAND": "CH", "SWEDEN": "SE", "NORWAY": "NO", "FINLAND": "FI",
      "IRELAND": "IE", "POLAND": "PL", "CZECH REPUBLIC": "CZ", "CZECHIA": "CZ",
      "CANADA": "CA", "MEXICO": "MX", "BRAZIL": "BR", "CHILE": "CL",
      "PERU": "PE", "AUSTRALIA": "AU", "NEW ZEALAND": "NZ",
      "UNITED ARAB EMIRATES": "AE", "UAE": "AE", "SOUTH AFRICA": "ZA", "TURKEY": "TR",
    };
    if (venueCountry.length === 2) return venueCountry;
    if (nameToCode[venueCountry]) return nameToCode[venueCountry];
  }
  // Fall back to query context
  return queryCountryCode;
}

// ─── Main import logic ────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

Deno.serve(async (req) => {
  try {
    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://rbengtfrthqdfbcdcugp.supabase.co";
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RAPIDAPI_KEY) throw new Error("RAPIDAPI_KEY not set");
    if (!SUPABASE_SERVICE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Parse options from request body
    let maxCalls = 500; // Default: use up to 500 API calls per run
    let priorityCountries = ["DK", "SE", "NO", "DE", "NL", "GB", "FR", "ES", "IT", "US"];
    let queriesPerCity = 8; // How many query categories per city
    let dateFilters = ["week", "month", "next_month"];

    try {
      const body = await req.json();
      if (body.max_calls) maxCalls = Math.min(body.max_calls, 5000);
      if (body.priority_countries) priorityCountries = body.priority_countries;
      if (body.queries_per_city) queriesPerCity = body.queries_per_city;
      if (body.date_filters) dateFilters = body.date_filters;
    } catch { /* no body, use defaults */ }

    const results: ImportResult[] = [];
    let totalApiCalls = 0;
    let totalInserted = 0;
    let totalFetched = 0;
    const seenEventIds = new Set<string>();

    // Get existing event titles to avoid duplicates
    const { data: existingEvents } = await supabase
      .from("events")
      .select("title, date, location")
      .eq("source", "rapidapi");
    const existingSet = new Set(
      (existingEvents || []).map(e => `${e.title}|${e.date}|${e.location}`.toLowerCase())
    );

    // Build the query plan: prioritize Scandinavia, then spread globally
    const queryPlan: { query: string; city: string; country: string; dateFilter: string }[] = [];

    // Shuffle queries to get variety
    const shuffledQueries = [...EVENT_QUERIES].sort(() => Math.random() - 0.5);

    // Priority countries get more queries
    for (const countryCode of priorityCountries) {
      const cities = COUNTRY_CITIES[countryCode] || [];
      for (const city of cities) {
        const querySlice = shuffledQueries.slice(0, queriesPerCity);
        for (const q of querySlice) {
          for (const df of dateFilters) {
            queryPlan.push({
              query: `${q} in ${city}`,
              city,
              country: countryCode,
              dateFilter: df,
            });
          }
        }
      }
    }

    // Non-priority countries get fewer queries
    const otherCountries = Object.keys(COUNTRY_CITIES).filter(c => !priorityCountries.includes(c));
    for (const countryCode of otherCountries) {
      const cities = (COUNTRY_CITIES[countryCode] || []).slice(0, 3); // Top 3 cities only
      for (const city of cities) {
        const querySlice = shuffledQueries.slice(0, 3); // 3 queries only
        for (const q of querySlice) {
          queryPlan.push({
            query: `${q} in ${city}`,
            city,
            country: countryCode,
            dateFilter: "month", // Only month for non-priority
          });
        }
      }
    }

    // Shuffle plan to distribute load
    const shuffledPlan = queryPlan.sort(() => Math.random() - 0.5);

    console.log(`[RapidAPI] Query plan: ${shuffledPlan.length} total queries, max ${maxCalls} API calls`);

    // Execute queries up to maxCalls limit
    for (const item of shuffledPlan) {
      if (totalApiCalls >= maxCalls) {
        console.log(`[RapidAPI] Reached max ${maxCalls} API calls, stopping.`);
        break;
      }

      try {
        // Rate limit: 5 req/sec on Pro → 220ms between calls
        await sleep(220);

        const events = await fetchRapidAPIEvents(RAPIDAPI_KEY, item.query, item.dateFilter);
        totalApiCalls++;
        totalFetched += events.length;

        if (events.length === 0) continue;

        // Also paginate if we got results (page 2)
        let allEvents = [...events];
        if (events.length >= 10 && totalApiCalls < maxCalls) {
          await sleep(220);
          const page2 = await fetchRapidAPIEvents(RAPIDAPI_KEY, item.query, item.dateFilter, 10);
          totalApiCalls++;
          allEvents = [...allEvents, ...page2];
          totalFetched += page2.length;
        }

        const toInsert: any[] = [];
        let skipped = 0;

        for (const event of allEvents) {
          // Deduplicate by event_id
          const eid = event.event_id || `${event.name}-${event.start_time}`;
          if (seenEventIds.has(eid)) { skipped++; continue; }
          seenEventIds.add(eid);

          // Skip if no name or date
          if (!event.name || !event.start_time) { skipped++; continue; }

          // Check existing
          const key = `${event.name}|${event.start_time?.split("T")[0] || ""}|${event.venue?.full_address || event.venue?.city || ""}`.toLowerCase();
          if (existingSet.has(key)) { skipped++; continue; }
          existingSet.add(key);

          const { category, tags, indoor_outdoor } = categorizeEvent(item.query, event);
          const countryCode = detectCountry(event, item.city, item.country);

          toInsert.push({
            title: event.name.slice(0, 255),
            description: (event.description || `${event.name} — ${category}`).slice(0, 2000),
            location: event.venue?.full_address || event.venue?.city || item.city,
            image_url: event.thumbnail || null,
            date: event.start_time,
            category,
            max_participants: 500,
            created_by: null,
            latitude: event.venue?.latitude || null,
            longitude: event.venue?.longitude || null,
            price: null,
            interest_tags: [...new Set(tags)].slice(0, 10),
            suitable_for_modes: ["solo", "par", "gruppe"],
            weather_suitable: indoor_outdoor === "outdoor" ? ["sol", "overskyet"] : ["alle"],
            indoor_outdoor,
            category_level: 1,
            min_required_participants: 1,
            source: "rapidapi",
            status: "active",
            country: countryCode,
          });
        }

        // Batch insert
        if (toInsert.length > 0) {
          const { error } = await supabase.from("events").insert(toInsert);
          if (error) {
            console.error(`[RapidAPI] Insert error for "${item.query}": ${error.message}`);
            results.push({
              source: "rapidapi",
              query: item.query,
              date_filter: item.dateFilter,
              fetched: allEvents.length,
              inserted: 0,
              skipped,
              errors: [error.message],
            });
          } else {
            totalInserted += toInsert.length;
            results.push({
              source: "rapidapi",
              query: item.query,
              date_filter: item.dateFilter,
              fetched: allEvents.length,
              inserted: toInsert.length,
              skipped,
              errors: [],
            });
          }
        }

        // Log progress every 50 calls
        if (totalApiCalls % 50 === 0) {
          console.log(`[RapidAPI] Progress: ${totalApiCalls} API calls, ${totalInserted} inserted, ${totalFetched} fetched`);
        }

      } catch (err) {
        console.error(`[RapidAPI] Error for "${item.query}": ${err.message}`);
        totalApiCalls++;
        results.push({
          source: "rapidapi",
          query: item.query,
          date_filter: item.dateFilter,
          fetched: 0,
          inserted: 0,
          skipped: 0,
          errors: [err.message],
        });
      }
    }

    const summary = {
      total_api_calls: totalApiCalls,
      total_fetched: totalFetched,
      total_inserted: totalInserted,
      total_queries_in_plan: shuffledPlan.length,
      max_calls_limit: maxCalls,
      results_sample: results.filter(r => r.inserted > 0).slice(0, 20),
      errors_sample: results.filter(r => r.errors.length > 0).slice(0, 10),
    };

    console.log(`[RapidAPI] DONE: ${totalApiCalls} calls, ${totalFetched} fetched, ${totalInserted} inserted`);

    return new Response(JSON.stringify(summary, null, 2), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[RapidAPI] Fatal error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
