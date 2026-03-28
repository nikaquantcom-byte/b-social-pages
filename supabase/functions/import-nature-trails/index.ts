/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://rbengtfrthqdfbcdcugp.supabase.co";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlaceInsert {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  main_categories: string[];
  tags: string[];
  smart_tags: string[];
  metadata: Record<string, unknown>;
  rating_avg: null;
  rating_count: null;
}

interface HotspotConfig {
  name: string;
  lat: number;
  lng: number;
  country_code: string;
  country_name: string;
  region: string;
  city: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COUNTRY_NAMES: Record<string, string> = {
  DK: "Denmark",
  SE: "Sweden",
  NO: "Norway",
  DE: "Germany",
  AT: "Austria",
  CH: "Switzerland",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  GB: "United Kingdom",
  US: "United States",
  AU: "Australia",
};

const INATURALIST_HOTSPOTS: HotspotConfig[] = [
  // DK
  { name: "Thy National Park", lat: 56.95, lng: 8.22, country_code: "DK", country_name: "Denmark", region: "Jutland", city: "Thisted" },
  { name: "Mols Bjerge National Park", lat: 56.22, lng: 10.58, country_code: "DK", country_name: "Denmark", region: "Central Jutland", city: "Ebeltoft" },
  { name: "Skjoldungernes Land National Park", lat: 55.67, lng: 11.95, country_code: "DK", country_name: "Denmark", region: "Zealand", city: "Roskilde" },
  { name: "Wadden Sea National Park", lat: 55.05, lng: 8.45, country_code: "DK", country_name: "Denmark", region: "South Jutland", city: "Ribe" },
  // SE
  { name: "Sarek National Park", lat: 67.28, lng: 17.72, country_code: "SE", country_name: "Sweden", region: "Lapland", city: "Jokkmokk" },
  { name: "Abisko National Park", lat: 68.35, lng: 18.83, country_code: "SE", country_name: "Sweden", region: "Lapland", city: "Abisko" },
  { name: "Tyresta National Park", lat: 59.17, lng: 18.23, country_code: "SE", country_name: "Sweden", region: "Stockholm", city: "Tyresö" },
  // NO
  { name: "Jotunheimen National Park", lat: 61.63, lng: 8.30, country_code: "NO", country_name: "Norway", region: "Innlandet", city: "Lom" },
  { name: "Rondane National Park", lat: 61.93, lng: 10.03, country_code: "NO", country_name: "Norway", region: "Innlandet", city: "Otta" },
  { name: "Lofoten Wildlife Area", lat: 68.15, lng: 14.50, country_code: "NO", country_name: "Norway", region: "Nordland", city: "Svolvær" },
  // DE
  { name: "Black Forest National Park", lat: 47.95, lng: 8.10, country_code: "DE", country_name: "Germany", region: "Baden-Württemberg", city: "Freudenstadt" },
  { name: "Bavarian Forest National Park", lat: 48.95, lng: 13.40, country_code: "DE", country_name: "Germany", region: "Bavaria", city: "Zwiesel" },
  { name: "Saxon Switzerland National Park", lat: 50.93, lng: 14.25, country_code: "DE", country_name: "Germany", region: "Saxony", city: "Bad Schandau" },
  // FR
  { name: "Camargue Natural Reserve", lat: 43.50, lng: 4.55, country_code: "FR", country_name: "France", region: "Provence-Alpes-Côte d'Azur", city: "Arles" },
  { name: "Mercantour National Park", lat: 44.08, lng: 7.12, country_code: "FR", country_name: "France", region: "Provence-Alpes-Côte d'Azur", city: "Nice" },
  { name: "Cévennes National Park", lat: 44.25, lng: 3.58, country_code: "FR", country_name: "France", region: "Occitanie", city: "Florac" },
  // ES
  { name: "Doñana National Park", lat: 36.98, lng: -6.44, country_code: "ES", country_name: "Spain", region: "Andalusia", city: "Almonte" },
  { name: "Picos de Europa National Park", lat: 43.18, lng: -4.85, country_code: "ES", country_name: "Spain", region: "Asturias", city: "Cangas de Onís" },
  // IT
  { name: "Gran Paradiso National Park", lat: 45.52, lng: 7.20, country_code: "IT", country_name: "Italy", region: "Aosta Valley", city: "Cogne" },
  { name: "Abruzzo, Lazio and Molise National Park", lat: 41.76, lng: 13.84, country_code: "IT", country_name: "Italy", region: "Abruzzo", city: "Pescasseroli" },
  // GB
  { name: "Scottish Highlands Wildlife Area", lat: 57.10, lng: -5.10, country_code: "GB", country_name: "United Kingdom", region: "Scotland", city: "Fort William" },
  { name: "Lake District National Park", lat: 54.45, lng: -3.07, country_code: "GB", country_name: "United Kingdom", region: "England", city: "Ambleside" },
  { name: "Snowdonia National Park", lat: 53.07, lng: -3.89, country_code: "GB", country_name: "United Kingdom", region: "Wales", city: "Betws-y-Coed" },
  // US
  { name: "Yellowstone National Park", lat: 44.60, lng: -110.50, country_code: "US", country_name: "United States", region: "Wyoming", city: "West Yellowstone" },
  { name: "Yosemite National Park", lat: 37.75, lng: -119.59, country_code: "US", country_name: "United States", region: "California", city: "Yosemite Valley" },
  { name: "Everglades National Park", lat: 25.29, lng: -80.90, country_code: "US", country_name: "United States", region: "Florida", city: "Homestead" },
  // AU
  { name: "Blue Mountains National Park", lat: -33.72, lng: 150.31, country_code: "AU", country_name: "Australia", region: "New South Wales", city: "Katoomba" },
  { name: "Kakadu National Park", lat: -12.84, lng: 132.39, country_code: "AU", country_name: "Australia", region: "Northern Territory", city: "Jabiru" },
];

// Countries supported for Waymarked Trails / Overpass in priority order
const WAYMARKED_COUNTRIES_PRIORITY = ["DK", "SE", "NO", "DE", "AT", "CH", "FR", "ES", "IT", "GB"];

// Default selections
const DEFAULT_WAYMARKED_COUNTRIES = ["DK", "SE", "NO"];
const DEFAULT_INATURALIST_HOTSPOT_COUNT = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deduplicateKey(name: string, lat: number, lng: number): string {
  return `${name.toLowerCase().trim()}|${lat.toFixed(4)}|${lng.toFixed(4)}`;
}

// ---------------------------------------------------------------------------
// iNaturalist
// ---------------------------------------------------------------------------

interface INatObservation {
  id: number;
  taxon?: {
    name?: string;
    preferred_common_name?: string;
    iconic_taxon_name?: string;
  };
  quality_grade?: string;
  place_guess?: string;
}

interface INatResponse {
  results?: INatObservation[];
  total_results?: number;
}

async function fetchINaturalistHotspot(hotspot: HotspotConfig): Promise<PlaceInsert | null> {
  const url =
    `https://api.inaturalist.org/v1/observations` +
    `?lat=${hotspot.lat}&lng=${hotspot.lng}&radius=50` +
    `&quality_grade=research&order=desc&order_by=votes` +
    `&per_page=100&iconic_taxa=Mammalia,Aves,Reptilia,Amphibia`;

  let data: INatResponse;
  try {
    const resp = await fetch(url, {
      headers: { "Accept": "application/json" },
    });
    if (!resp.ok) {
      console.warn(`iNaturalist non-200 for ${hotspot.name}: ${resp.status}`);
      return null;
    }
    data = await resp.json() as INatResponse;
  } catch (err) {
    console.warn(`iNaturalist fetch error for ${hotspot.name}:`, err);
    return null;
  }

  const results = data.results ?? [];
  const totalResults = data.total_results ?? results.length;

  // Collect species names, deduplicated, ordered by first occurrence (highest votes)
  const speciesSet = new Set<string>();
  const speciesNames: string[] = [];
  const taxaCounts: Record<string, number> = {};

  for (const obs of results) {
    if (!obs.taxon) continue;
    const commonName = obs.taxon.preferred_common_name;
    const sciName = obs.taxon.name;
    const displayName = commonName || sciName;
    if (displayName && !speciesSet.has(displayName.toLowerCase())) {
      speciesSet.add(displayName.toLowerCase());
      speciesNames.push(displayName);
    }
    const iconic = obs.taxon.iconic_taxon_name ?? "Unknown";
    taxaCounts[iconic] = (taxaCounts[iconic] ?? 0) + 1;
  }

  const topSpecies = speciesNames.slice(0, 10);
  const speciesCount = speciesNames.length;

  const speciesList = topSpecies.length > 0
    ? topSpecies.slice(0, 5).join(", ")
    : "various wildlife species";

  const description =
    `Hotspot for wildlife observation. Notable species: ${speciesList}. ` +
    `${totalResults} research-grade observations.`;

  // Build tags from species names (lowercase, no spaces)
  const speciesTags = topSpecies
    .map((s) => s.toLowerCase().replace(/\s+/g, "_"))
    .slice(0, 10);

  const tags = ["wildlife", "dyr", "naturobservation", ...speciesTags];

  return {
    name: hotspot.name,
    description,
    latitude: hotspot.lat,
    longitude: hotspot.lng,
    city: hotspot.city,
    region: hotspot.region,
    country: hotspot.country_name,
    main_categories: ["natur"],
    tags,
    smart_tags: ["NATUR", "WILDLIFE", "OBSERVATION"],
    metadata: {
      source: "inaturalist",
      species_count: speciesCount,
      top_species: topSpecies,
      observation_count: totalResults,
      iconic_taxa: taxaCounts,
    },
    rating_avg: null,
    rating_count: null,
  };
}

// ---------------------------------------------------------------------------
// Overpass / Waymarked Trails
// ---------------------------------------------------------------------------

interface OverpassElement {
  type: string;
  id: number;
  center?: { lat: number; lon: number };
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

async function fetchOverpass(query: string): Promise<OverpassElement[]> {
  const endpoint = "https://overpass-api.de/api/interpreter";
  let resp: Response;
  try {
    resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });
  } catch (err) {
    console.warn("Overpass fetch error:", err);
    return [];
  }
  if (!resp.ok) {
    console.warn(`Overpass non-200: ${resp.status}`);
    return [];
  }
  try {
    const data = await resp.json() as OverpassResponse;
    return data.elements ?? [];
  } catch {
    console.warn("Overpass JSON parse error");
    return [];
  }
}

function buildHikingQuery(cc: string): string {
  return `[out:json][timeout:60];
area["ISO3166-1"="${cc}"]->.a;
relation["route"="hiking"]["name"](area.a);
out center 200;`;
}

function buildMtbQuery(cc: string): string {
  return `[out:json][timeout:60];
area["ISO3166-1"="${cc}"]->.a;
relation["route"="mtb"]["name"](area.a);
out center 200;`;
}

function buildPilgrimageQuery(): string {
  return `[out:json][timeout:60];
relation["route"="pilgrimage"]["name"];
out center 100;`;
}

function elementCenter(el: OverpassElement): { lat: number; lng: number } | null {
  if (el.center) return { lat: el.center.lat, lng: el.center.lon };
  if (el.lat !== undefined && el.lon !== undefined) return { lat: el.lat, lng: el.lon };
  return null;
}

function parseDistance(tags: Record<string, string>): number | null {
  const raw = tags["distance"] ?? tags["length"];
  if (!raw) return null;
  const num = parseFloat(raw.replace(/[^\d.]/g, ""));
  return isNaN(num) ? null : num;
}

function overpassToHikingPlace(el: OverpassElement, countryCode: string): PlaceInsert | null {
  const tags = el.tags ?? {};
  const name = tags["name"];
  if (!name) return null;

  const center = elementCenter(el);
  if (!center) return null;

  const countryName = COUNTRY_NAMES[countryCode] ?? countryCode;
  const distance = parseDistance(tags);
  const network = tags["network"] ?? null;
  const operator = tags["operator"] ?? null;
  const ref = tags["ref"] ?? null;
  const distanceStr = distance ? ` Distance: ${distance} km.` : "";

  return {
    name,
    description: `Hiking route: ${name}.${distanceStr} ${network ? `Network: ${network}.` : ""}`.trim(),
    latitude: center.lat,
    longitude: center.lng,
    city: tags["addr:city"] ?? "",
    region: tags["addr:state"] ?? tags["addr:region"] ?? "",
    country: countryName,
    main_categories: ["natur", "aktiv_sport"],
    tags: ["vandring", "vandrerute", "hiking"],
    smart_tags: ["NATUR", "VANDRING", "RUTE"],
    metadata: {
      source: "waymarked-trails",
      osm_id: el.id,
      route_type: "hiking",
      distance: distance,
      network: network,
      operator: operator,
      ref: ref,
    },
    rating_avg: null,
    rating_count: null,
  };
}

function overpassToMtbPlace(el: OverpassElement, countryCode: string): PlaceInsert | null {
  const tags = el.tags ?? {};
  const name = tags["name"];
  if (!name) return null;

  const center = elementCenter(el);
  if (!center) return null;

  const countryName = COUNTRY_NAMES[countryCode] ?? countryCode;
  const distance = parseDistance(tags);
  const network = tags["network"] ?? null;
  const operator = tags["operator"] ?? null;
  const ref = tags["ref"] ?? null;
  const distanceStr = distance ? ` Distance: ${distance} km.` : "";

  return {
    name,
    description: `Mountain bike route: ${name}.${distanceStr} ${network ? `Network: ${network}.` : ""}`.trim(),
    latitude: center.lat,
    longitude: center.lng,
    city: tags["addr:city"] ?? "",
    region: tags["addr:state"] ?? tags["addr:region"] ?? "",
    country: countryName,
    main_categories: ["aktiv_sport"],
    tags: ["mountainbike", "mtb", "cykelrute"],
    smart_tags: ["AKTIV_SPORT", "MTB", "RUTE"],
    metadata: {
      source: "waymarked-trails",
      osm_id: el.id,
      route_type: "mtb",
      distance: distance,
      network: network,
      operator: operator,
      ref: ref,
    },
    rating_avg: null,
    rating_count: null,
  };
}

function overpassToPilgrimagePlace(el: OverpassElement): PlaceInsert | null {
  const tags = el.tags ?? {};
  const name = tags["name"];
  if (!name) return null;

  const center = elementCenter(el);
  if (!center) return null;

  // Try to determine country from tags
  const rawCountry = tags["addr:country"] ?? tags["country"] ?? "";
  const countryName = COUNTRY_NAMES[rawCountry] ?? rawCountry || "Unknown";
  const distance = parseDistance(tags);
  const network = tags["network"] ?? null;
  const operator = tags["operator"] ?? null;
  const ref = tags["ref"] ?? null;
  const distanceStr = distance ? ` Distance: ${distance} km.` : "";

  return {
    name,
    description: `Pilgrimage route: ${name}.${distanceStr}`.trim(),
    latitude: center.lat,
    longitude: center.lng,
    city: tags["addr:city"] ?? "",
    region: tags["addr:state"] ?? tags["addr:region"] ?? "",
    country: countryName,
    main_categories: ["natur", "kultur"],
    tags: ["pilgrimsrute", "camino", "vandring"],
    smart_tags: ["NATUR", "PILGRIM", "VANDRING", "RUTE"],
    metadata: {
      source: "waymarked-trails",
      osm_id: el.id,
      route_type: "pilgrimage",
      distance: distance,
      network: network,
      operator: operator,
      ref: ref,
    },
    rating_avg: null,
    rating_count: null,
  };
}

// ---------------------------------------------------------------------------
// Supabase upsert
// ---------------------------------------------------------------------------

async function upsertPlaces(places: PlaceInsert[]): Promise<{ inserted: number; errors: number }> {
  if (!SUPABASE_KEY) {
    console.error("SUPABASE_SERVICE_ROLE_KEY not set");
    return { inserted: 0, errors: places.length };
  }
  if (places.length === 0) return { inserted: 0, errors: 0 };

  // Batch in groups of 50 to avoid request size limits
  const BATCH = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < places.length; i += BATCH) {
    const batch = places.slice(i, i + BATCH);
    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/places`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          // upsert on name + coordinates to handle deduplication at DB level
          "Prefer": "resolution=ignore-duplicates,return=representation",
        },
        body: JSON.stringify(batch),
      });
      if (!resp.ok) {
        const body = await resp.text();
        console.warn(`Supabase upsert error (${resp.status}):`, body);
        errors += batch.length;
      } else {
        inserted += batch.length;
      }
    } catch (err) {
      console.warn("Supabase upsert exception:", err);
      errors += batch.length;
    }
  }

  return { inserted, errors };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse body
  let body: { sources?: string[]; countries?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine — use defaults
  }

  const requestedSources: string[] = body.sources ?? ["inaturalist", "waymarked-trails"];
  const requestedCountries: string[] = body.countries ?? [];

  const runINat = requestedSources.includes("inaturalist");
  const runWaymarked = requestedSources.includes("waymarked-trails");

  // Deadline: 58s from now (leave 2s buffer for final response)
  const deadline = Date.now() + 58_000;
  function timeLeft(): number {
    return deadline - Date.now();
  }
  function isExpired(): boolean {
    return timeLeft() <= 0;
  }

  const summary: Record<string, unknown> = {
    started_at: new Date().toISOString(),
    sources_requested: requestedSources,
    countries_requested: requestedCountries,
  };

  // Global dedup set (name + coords)
  const seenKeys = new Set<string>();
  const allPlaces: PlaceInsert[] = [];

  // ---------------------------------------------------------------------------
  // Source 1: iNaturalist
  // ---------------------------------------------------------------------------
  if (runINat && !isExpired()) {
    // Determine which hotspots to process
    let hotspots: HotspotConfig[];

    if (requestedCountries.length > 0) {
      hotspots = INATURALIST_HOTSPOTS.filter((h) =>
        requestedCountries.includes(h.country_code)
      );
    } else {
      // Default: first DEFAULT_INATURALIST_HOTSPOT_COUNT from the list
      hotspots = INATURALIST_HOTSPOTS.slice(0, DEFAULT_INATURALIST_HOTSPOT_COUNT);
    }

    let inatInserted = 0;
    let inatSkipped = 0;
    let inatErrors = 0;
    const inatPlaces: PlaceInsert[] = [];

    for (let i = 0; i < hotspots.length; i++) {
      if (isExpired()) {
        console.warn("Deadline reached during iNaturalist processing");
        break;
      }

      const hotspot = hotspots[i];
      console.log(`iNaturalist: fetching ${hotspot.name} (${i + 1}/${hotspots.length})`);

      const place = await fetchINaturalistHotspot(hotspot);

      if (place) {
        const key = deduplicateKey(place.name, place.latitude, place.longitude);
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          inatPlaces.push(place);
        } else {
          inatSkipped++;
        }
      } else {
        inatErrors++;
      }

      // Rate limit: 1s between calls (skip after last)
      if (i < hotspots.length - 1 && !isExpired()) {
        await sleep(1000);
      }
    }

    // Upsert to Supabase
    const { inserted, errors } = await upsertPlaces(inatPlaces);
    inatInserted = inserted;
    inatErrors += errors;
    allPlaces.push(...inatPlaces);

    summary["inaturalist"] = {
      hotspots_processed: hotspots.length,
      places_collected: inatPlaces.length,
      inserted: inatInserted,
      skipped_duplicates: inatSkipped,
      errors: inatErrors,
    };
  }

  // ---------------------------------------------------------------------------
  // Source 2: Waymarked Trails (Overpass API)
  // ---------------------------------------------------------------------------
  if (runWaymarked && !isExpired()) {
    // Determine which countries to process
    let countries: string[];

    if (requestedCountries.length > 0) {
      // Filter to only supported countries, maintain priority order
      countries = WAYMARKED_COUNTRIES_PRIORITY.filter((cc) =>
        requestedCountries.includes(cc)
      );
      // Also include any requested countries not in the priority list
      const extra = requestedCountries.filter(
        (cc) => !WAYMARKED_COUNTRIES_PRIORITY.includes(cc)
      );
      countries = [...countries, ...extra];
    } else {
      countries = DEFAULT_WAYMARKED_COUNTRIES;
    }

    let waymarkInserted = 0;
    let waymarkSkipped = 0;
    let waymarkErrors = 0;
    const waymarkPlaces: PlaceInsert[] = [];
    const countryStats: Record<string, { hiking: number; mtb: number }> = {};

    // Process each country: hiking + mtb
    for (let ci = 0; ci < countries.length; ci++) {
      if (isExpired()) {
        console.warn("Deadline reached during Waymarked country processing");
        break;
      }

      const cc = countries[ci];
      countryStats[cc] = { hiking: 0, mtb: 0 };
      console.log(`Overpass hiking: ${cc}`);

      // Hiking routes
      const hikingElements = await fetchOverpass(buildHikingQuery(cc));
      for (const el of hikingElements) {
        const place = overpassToHikingPlace(el, cc);
        if (!place) continue;
        const key = deduplicateKey(place.name, place.latitude, place.longitude);
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          waymarkPlaces.push(place);
          countryStats[cc].hiking++;
        } else {
          waymarkSkipped++;
        }
      }

      if (isExpired()) break;

      // Rate limit: 2s between Overpass calls
      await sleep(2000);

      console.log(`Overpass MTB: ${cc}`);

      // MTB routes
      const mtbElements = await fetchOverpass(buildMtbQuery(cc));
      for (const el of mtbElements) {
        const place = overpassToMtbPlace(el, cc);
        if (!place) continue;
        const key = deduplicateKey(place.name, place.latitude, place.longitude);
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          waymarkPlaces.push(place);
          countryStats[cc].mtb++;
        } else {
          waymarkSkipped++;
        }
      }

      // Rate limit between countries
      if (ci < countries.length - 1 && !isExpired()) {
        await sleep(2000);
      }
    }

    // Pilgrimage routes (global, only if time allows)
    let pilgrimCount = 0;
    if (!isExpired()) {
      await sleep(2000);
      console.log("Overpass pilgrimage routes (global)");
      const pilgrimElements = await fetchOverpass(buildPilgrimageQuery());
      for (const el of pilgrimElements) {
        const place = overpassToPilgrimagePlace(el);
        if (!place) continue;
        const key = deduplicateKey(place.name, place.latitude, place.longitude);
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          waymarkPlaces.push(place);
          pilgrimCount++;
        } else {
          waymarkSkipped++;
        }
      }
    }

    // Upsert to Supabase
    const { inserted, errors } = await upsertPlaces(waymarkPlaces);
    waymarkInserted = inserted;
    waymarkErrors += errors;
    allPlaces.push(...waymarkPlaces);

    summary["waymarked_trails"] = {
      countries_processed: Object.keys(countryStats),
      country_stats: countryStats,
      pilgrimage_routes: pilgrimCount,
      places_collected: waymarkPlaces.length,
      inserted: waymarkInserted,
      skipped_duplicates: waymarkSkipped,
      errors: waymarkErrors,
    };
  }

  summary["total_places"] = allPlaces.length;
  summary["completed_at"] = new Date().toISOString();
  summary["timed_out"] = isExpired();

  return new Response(JSON.stringify(summary, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
