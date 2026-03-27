-- Migration: 20260327_005_event_status_and_cleanup.sql
-- Description: Add status and source columns to events table

-- 1. Add status column
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'cancelled', 'ended'));
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events (status) WHERE status IN ('active', 'draft');

-- 2. Add source column
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual' CHECK (source IN ('manual', 'api', 'import'));
CREATE INDEX IF NOT EXISTS idx_events_source ON public.events (source);

-- 3. Backfill: mark all existing past events as 'ended'
UPDATE public.events SET status = 'ended' WHERE date < now() AND status = 'active';

-- 4. Compound index for active future events
CREATE INDEX IF NOT EXISTS idx_events_status_date ON public.events (status, date) WHERE status = 'active';

-- 5. Auto-cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_ended_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.events SET status = 'ended' WHERE status = 'active' AND date < now();
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;
GRANT EXECUTE ON FUNCTION public.cleanup_ended_events() TO service_role;

-- 6. Update the events_with_participants view
DROP VIEW IF EXISTS public.events_with_participants;
CREATE VIEW public.events_with_participants AS
SELECT
  e.id,
  e.title,
  e.description,
  e.location,
  e.image_url,
  e.date,
  e.category,
  e.max_participants,
  e.created_by,
  e.created_at,
  e.status,
  e.source,
  json_agg(json_build_object('user_id', ep.user_id, 'joined_at', ep.joined_at)) FILTER (WHERE ep.id IS NOT NULL) AS participants,
  COUNT(ep.id)::bigint AS participant_count
FROM public.events e
LEFT JOIN public.event_participants ep ON ep.event_id = e.id
GROUP BY e.id, e.title, e.description, e.location, e.image_url, e.date, e.category, e.max_participants, e.created_by, e.created_at, e.status, e.source;
