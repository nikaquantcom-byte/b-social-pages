/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://rbengtfrthqdfbcdcugp.supabase.co";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function supabaseUpsertBatch(records: Record<string, unknown>[]): Promise<number> {
  if (records.length === 0) return 0;
  const batchSize = 100;
  let inserted = 0;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY!,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(batch),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Supabase insert error:", err);
    } else {
      inserted += batch.length;
    }
  }
  return inserted;
}

// ---------------------------------------------------------------------------
// Deduplication helpers
// ---------------------------------------------------------------------------

function deduplicateRecords(records: Record<string, unknown>[]): Record<string, unknown>[] {
  const seen = new Set<string>();
  return records.filter((r) => {
    const key = `${String(r.name).toLowerCase().trim()}|${Number(r.latitude).toFixed(4)}|${Number(r.longitude).toFixed(4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Source 1: Queue-Times
// ---------------------------------------------------------------------------

async function importQueueTimes(deadline: number): Promise<{ inserted: number; errors: string[] }> {
  const errors: string[] = [];
  const records: Record<string, unknown>[] = [];

  // Fetch park list
  let parksResp: Response;
  try {
    parksResp = await fetch("https://queue-times.com/en-US/parks.json", {
      headers: { "Accept": "application/json" },
    });
  } catch (e) {
    return { inserted: 0, errors: [`Failed to fetch parks list: ${e}`] };
  }

  if (!parksResp.ok) {
    return { inserted: 0, errors: [`Parks list returned ${parksResp.status}`] };
  }

  type QTPark = { id: number; name: string; country: string; continent: string; latitude: number; longitude: number; timezone: string };
  type QTGroup = { name: string; parks: QTPark[] };

  let groups: QTGroup[] = [];
  try {
    groups = await parksResp.json() as QTGroup[];
  } catch (e) {
    return { inserted: 0, errors: [`Failed to parse parks list: ${e}`] };
  }

  const allParks: QTPark[] = groups.flatMap((g) => (g.parks || []).map((p) => ({ ...p, operator: g.name })));

  // Process all parks for base records; only fetch ride data for first 20
  for (let idx = 0; idx < allParks.length; idx++) {
    if (Date.now() >= deadline - 5000) break;

    const park = allParks[idx] as QTPark & { operator?: string };
    const lat = parseFloat(String(park.latitude));
    const lon = parseFloat(String(park.longitude));
    if (isNaN(lat) || isNaN(lon)) continue;

    let ridesData: unknown[] = [];
    let ridesCount = 0;

    if (idx < 20) {
      await sleep(500);
      try {
        const rr = await fetch(`https://queue-times.com/parks/${park.id}/queue_times.json`, {
          headers: { "Accept": "application/json" },
        });
        if (rr.ok) {
          const body = await rr.json() as { lands?: { name: string; rides: { name: string; wait_time: number; is_open: boolean; last_updated: string }[] }[] };
          const lands = body.lands || [];
          ridesData = lands.flatMap((l) =>
            (l.rides || []).map((r) => ({
              land: l.name,
              name: r.name,
              wait_time: r.wait_time,
              is_open: r.is_open,
              last_updated: r.last_updated,
            }))
          );
          ridesCount = ridesData.length;
        }
      } catch (e) {
        errors.push(`Rides fetch error for park ${park.id}: ${e}`);
      }
    }

    records.push({
      name: park.name,
      description: null,
      latitude: lat,
      longitude: lon,
      city: null,
      region: null,
      country: park.country || null,
      main_categories: ["familie", "underholdning"],
      tags: ["forlystelsespark", "temapark", "ventetider"],
      smart_tags: ["FAMILIE", "FORLYSTELSESPARK", "LIVE_DATA"],
      metadata: {
        source: "queue-times",
        park_id: park.id,
        rides_count: ridesCount,
        operator: (park as { operator?: string }).operator || null,
        rides: ridesData,
        timezone: park.timezone || null,
        continent: park.continent || null,
      },
      rating_avg: null,
      rating_count: null,
    });
  }

  const unique = deduplicateRecords(records);
  const inserted = await supabaseUpsertBatch(unique);
  return { inserted, errors };
}

// ---------------------------------------------------------------------------
// Source 2: ThemeParks.wiki
// ---------------------------------------------------------------------------

async function importThemeParksWiki(deadline: number): Promise<{ inserted: number; errors: string[] }> {
  const errors: string[] = [];
  const records: Record<string, unknown>[] = [];

  let destResp: Response;
  try {
    destResp = await fetch("https://api.themeparks.wiki/v1/destinations", {
      headers: { "Accept": "application/json" },
    });
  } catch (e) {
    return { inserted: 0, errors: [`Failed to fetch destinations: ${e}`] };
  }

  if (!destResp.ok) {
    return { inserted: 0, errors: [`Destinations returned ${destResp.status}`] };
  }

  type WikiParkRef = { id: string; name: string };
  type WikiDestination = { id: string; name: string; slug: string; parks?: WikiParkRef[] };
  type WikiDestinationsResp = { destinations: WikiDestination[] };

  let destBody: WikiDestinationsResp;
  try {
    destBody = await destResp.json() as WikiDestinationsResp;
  } catch (e) {
    return { inserted: 0, errors: [`Failed to parse destinations: ${e}`] };
  }

  const destinations = destBody.destinations || [];

  for (const dest of destinations) {
    if (Date.now() >= deadline - 5000) break;

    await sleep(500);

    type WikiEntity = {
      id: string;
      name: string;
      slug?: string;
      location?: { latitude?: number; longitude?: number };
      timezone?: string;
      parks?: WikiParkRef[];
    };

    let entity: WikiEntity | null = null;
    try {
      const er = await fetch(`https://api.themeparks.wiki/v1/entity/${dest.id}`, {
        headers: { "Accept": "application/json" },
      });
      if (er.ok) {
        entity = await er.json() as WikiEntity;
      } else {
        errors.push(`Entity ${dest.id} returned ${er.status}`);
      }
    } catch (e) {
      errors.push(`Entity fetch error ${dest.id}: ${e}`);
    }

    const lat = entity?.location?.latitude ?? null;
    const lon = entity?.location?.longitude ?? null;
    if (lat === null || lon === null || isNaN(Number(lat)) || isNaN(Number(lon))) continue;

    const parkIds = (dest.parks || entity?.parks || []).map((p) => p.id);

    records.push({
      name: dest.name,
      description: null,
      latitude: Number(lat),
      longitude: Number(lon),
      city: null,
      region: null,
      country: null,
      main_categories: ["familie", "underholdning"],
      tags: ["forlystelsespark", "temapark", "ventetider"],
      smart_tags: ["FAMILIE", "FORLYSTELSESPARK", "LIVE_DATA"],
      metadata: {
        source: "themeparks-wiki",
        entity_id: dest.id,
        slug: dest.slug,
        park_ids: parkIds,
        timezone: entity?.timezone || null,
      },
      rating_avg: null,
      rating_count: null,
    });

    // Also import individual parks if they have location data
    for (const park of dest.parks || []) {
      if (Date.now() >= deadline - 5000) break;
      await sleep(500);

      let parkEntity: WikiEntity | null = null;
      try {
        const pr = await fetch(`https://api.themeparks.wiki/v1/entity/${park.id}`, {
          headers: { "Accept": "application/json" },
        });
        if (pr.ok) {
          parkEntity = await pr.json() as WikiEntity;
        }
      } catch (e) {
        errors.push(`Park entity fetch error ${park.id}: ${e}`);
        continue;
      }

      const plat = parkEntity?.location?.latitude ?? null;
      const plon = parkEntity?.location?.longitude ?? null;
      if (plat === null || plon === null || isNaN(Number(plat)) || isNaN(Number(plon))) continue;

      records.push({
        name: park.name,
        description: null,
        latitude: Number(plat),
        longitude: Number(plon),
        city: null,
        region: null,
        country: null,
        main_categories: ["familie", "underholdning"],
        tags: ["forlystelsespark", "temapark", "ventetider"],
        smart_tags: ["FAMILIE", "FORLYSTELSESPARK", "LIVE_DATA"],
        metadata: {
          source: "themeparks-wiki",
          entity_id: park.id,
          slug: parkEntity?.slug || null,
          park_ids: [],
          parent_destination_id: dest.id,
          timezone: parkEntity?.timezone || null,
        },
        rating_avg: null,
        rating_count: null,
      });
    }
  }

  const unique = deduplicateRecords(records);
  const inserted = await supabaseUpsertBatch(unique);
  return { inserted, errors };
}

// ---------------------------------------------------------------------------
// Source 3: Refuges.info
// ---------------------------------------------------------------------------

const REFUGES_BBOXES = [
  { name: "Alps", bbox: "5.5,43.5,17.5,48.5" },
  { name: "Pyrenees", bbox: "-2,42,3.5,43.5" },
];

const REFUGES_TYPE_MAP: Record<string, string> = {
  refuge: "Refuge",
  cabane: "Hytte",
  bivouac: "Bivuak",
  gite: "Gite",
};

async function importRefuges(deadline: number): Promise<{ inserted: number; errors: string[] }> {
  const errors: string[] = [];
  const records: Record<string, unknown>[] = [];
  const typePoints = "refuge,cabane,bivouac,gite";

  for (const region of REFUGES_BBOXES) {
    if (Date.now() >= deadline - 5000) break;

    await sleep(500);

    const url = `https://www.refuges.info/api/bbox?bbox=${region.bbox}&type_points=${encodeURIComponent(typePoints)}`;

    let resp: Response;
    try {
      resp = await fetch(url, { headers: { "Accept": "application/json" } });
    } catch (e) {
      errors.push(`Failed to fetch refuges (${region.name}): ${e}`);
      continue;
    }

    if (!resp.ok) {
      errors.push(`Refuges ${region.name} returned ${resp.status}`);
      continue;
    }

    type RefugePoint = {
      id: number;
      nom: string;
      type?: { valeur?: string };
      coord?: { lat?: number; long?: number; alt?: number };
      lien?: string;
      commentaire?: string;
      massif?: { nom?: string };
    };
    type RefugesResp = { features?: { properties: RefugePoint }[]; [key: string]: unknown } | RefugePoint[];

    let body: RefugesResp;
    try {
      body = await resp.json() as RefugesResp;
    } catch (e) {
      errors.push(`Failed to parse refuges (${region.name}): ${e}`);
      continue;
    }

    // The API may return GeoJSON FeatureCollection or a plain array
    let points: RefugePoint[] = [];
    if (Array.isArray(body)) {
      points = body as RefugePoint[];
    } else if (body && typeof body === "object" && "features" in body && Array.isArray((body as { features: unknown[] }).features)) {
      points = ((body as { features: { properties: RefugePoint }[] }).features).map((f) => f.properties);
    } else if (body && typeof body === "object") {
      // Try top-level object with numeric keys (some APIs return this)
      const vals = Object.values(body as Record<string, unknown>);
      for (const v of vals) {
        if (Array.isArray(v)) {
          points = v as RefugePoint[];
          break;
        }
      }
    }

    for (const point of points) {
      if (Date.now() >= deadline - 5000) break;

      const lat = parseFloat(String(point.coord?.lat));
      const lon = parseFloat(String(point.coord?.long));
      if (isNaN(lat) || isNaN(lon)) continue;

      const typeValeur = (point.type?.valeur || "").toLowerCase();
      const mappedType = REFUGES_TYPE_MAP[typeValeur] || typeValeur || "Refuge";
      const altitude = point.coord?.alt ?? null;
      const massifName = point.massif?.nom || null;

      records.push({
        name: point.nom,
        description: (point as { commentaire?: string }).commentaire || null,
        latitude: lat,
        longitude: lon,
        city: null,
        region: massifName || region.name,
        country: "France",
        main_categories: ["natur", "overnatning"],
        tags: ["bjerghytte", "refuge", "vandring", "alpin"],
        smart_tags: ["NATUR", "HYTTE", "VANDRING", "ALPIN"],
        metadata: {
          source: "refuges-info",
          refuge_id: point.id,
          altitude,
          type: mappedType,
          url: point.lien || null,
          region: region.name,
        },
        rating_avg: null,
        rating_count: null,
      });
    }
  }

  const unique = deduplicateRecords(records);
  const inserted = await supabaseUpsertBatch(unique);
  return { inserted, errors };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { sources?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // default to all sources
  }

  const allSources = ["queue-times", "themeparks-wiki", "refuges-info"];
  const sources: string[] = (body.sources && Array.isArray(body.sources) && body.sources.length > 0)
    ? body.sources.filter((s) => allSources.includes(s))
    : allSources;

  // 60s timeout guard — leave 5s buffer for final response
  const deadline = Date.now() + 55_000;

  const summary: Record<string, { inserted: number; errors: string[]; timedOut?: boolean }> = {};

  for (const source of sources) {
    if (Date.now() >= deadline) {
      summary[source] = { inserted: 0, errors: [], timedOut: true };
      continue;
    }
    try {
      if (source === "queue-times") {
        summary[source] = await importQueueTimes(deadline);
      } else if (source === "themeparks-wiki") {
        summary[source] = await importThemeParksWiki(deadline);
      } else if (source === "refuges-info") {
        summary[source] = await importRefuges(deadline);
      }
    } catch (e) {
      summary[source] = { inserted: 0, errors: [`Unhandled error: ${e}`] };
    }
  }

  const totalInserted = Object.values(summary).reduce((acc, s) => acc + (s.inserted || 0), 0);

  return new Response(
    JSON.stringify({ ok: true, totalInserted, summary }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});
