-- =============================================================================
-- Migration: 20260327_002_add_gin_indexes.sql
-- Description: Add GIN indexes on all text array columns used for tag matching.
-- =============================================================================

-- events table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_events_interest_tags
  ON public.events USING gin(interest_tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_events_suitable_for_modes
  ON public.events USING gin(suitable_for_modes);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_events_weather_suitable
  ON public.events USING gin(weather_suitable);

-- places table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_places_tags
  ON public.places USING gin(tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_places_smart_tags
  ON public.places USING gin(smart_tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_places_main_categories
  ON public.places USING gin(main_categories);

-- routes table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_routes_tags
  ON public.routes USING gin(tags);

-- profiles table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_profiles_interests
  ON public.profiles USING gin(interests);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_profiles_vibe_tags
  ON public.profiles USING gin(vibe_tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_profiles_active_time_slots
  ON public.profiles USING gin(active_time_slots);

-- activity_templates table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_activity_templates_interest_tags
  ON public.activity_templates USING gin(interest_tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_activity_templates_vibe_tags
  ON public.activity_templates USING gin(vibe_tags);

-- notes table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_notes_tags
  ON public.notes USING gin(tags);

-- user_profiles table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_user_profiles_interests
  ON public.user_profiles USING gin(interests);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_user_profiles_smart_preferences
  ON public.user_profiles USING gin(smart_preferences);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_user_profiles_preferred_intensity
  ON public.user_profiles USING gin(preferred_intensity);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_gin_user_profiles_preferred_vibes
  ON public.user_profiles USING gin(preferred_vibes);
