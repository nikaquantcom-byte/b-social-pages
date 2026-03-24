// Local data layer — reads from static events.json
// Replaces all Supabase fetch calls so the app works without a valid API key

import eventsData from "@/data/events.json";

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url: string | null;
  date: string;
  category: string;
  max_participants: number;
  created_by: string | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  price: number | null;
  interest_tags: string[] | null;
  suitable_for_modes: string[] | null;
  weather_suitable: string[] | null;
  indoor_outdoor: string | null;
  category_level: number | null;
};

// The JSON is already sorted by created_at; sort by date ascending for display
const ALL_EVENTS: Event[] = (eventsData as Event[]).sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

/** Return all events, sorted by date ascending */
export function getEvents(): Event[] {
  return ALL_EVENTS;
}

/** Return a single event by id, or null if not found */
export function getEventById(id: string): Event | null {
  return ALL_EVENTS.find((e) => e.id === id) ?? null;
}

/** Return events filtered by interest tags */
export function getEventsByTags(tags: string[]): Event[] {
  if (tags.length === 0) return ALL_EVENTS;
  return ALL_EVENTS.filter(
    (e) =>
      e.interest_tags?.some((t) => tags.includes(t)) ||
      tags.some((tag) => (e.category || "").toLowerCase().includes(tag))
  );
}

// Re-export Profile type so pages that import it from supabase.ts still compile
// after we switch them to import from data.ts
export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  full_name: string | null;
  location: string | null;
  city: string | null;
  interests: string[] | null;
  vibe_tags: string[] | null;
  created_at: string;
  updated_at: string | null;
};
