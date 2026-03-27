-- =============================================================================
-- Migration: 20260327_001_fix_broken_functions.sql
-- Description: Fix 3 broken database functions with incorrect column references
--
-- Bugs fixed:
--   1. get_missing_participant_events  -> references user_interests.interest_tag
--                                        (correct column name: interest)
--   2. get_personal_suggestions        -> references event_suggestions.profile_id
--                                        (correct column name: user_id)
--   3. generate_suggestions_for_user   -> references events.start_time
--                                        (correct column name: date)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- FIX 1: get_missing_participant_events
-- Bug: references user_interests.interest_tag - column is actually named interest
-- -----------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.get_missing_participant_events(uuid);

CREATE OR REPLACE FUNCTION public.get_missing_participant_events(p_profile_id uuid)
RETURNS TABLE (
  event_id             uuid,
  title                text,
  spots_needed         bigint,
  current_participants bigint,
  interest_tags        text[],
  start_time           timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_interest_tags text[];
BEGIN
  -- Collect user's interests from the normalized user_interests table.
  -- FIX: was ui.interest_tag - correct column name is ui.interest
  SELECT COALESCE(array_agg(ui.interest), '{}')
    INTO user_interest_tags
    FROM user_interests ui
   WHERE ui.user_id = p_profile_id;

  RETURN QUERY
  SELECT
    e.id                                                        AS event_id,
    e.title,
    (e.max_participants - COUNT(ep.id))::bigint                 AS spots_needed,
    COUNT(ep.id)::bigint                                        AS current_participants,
    e.interest_tags,
    e.date                                                      AS start_time
  FROM events e
  LEFT JOIN event_participants ep ON ep.event_id = e.id
  WHERE
    e.date > now()
    AND e.interest_tags && user_interest_tags
  GROUP BY e.id, e.title, e.max_participants, e.interest_tags, e.date
  HAVING (e.max_participants - COUNT(ep.id)) <= 3
     AND (e.max_participants - COUNT(ep.id)) > 0
  ORDER BY spots_needed ASC, e.date ASC;
END;
$$;

-- -----------------------------------------------------------------------------
-- FIX 2: get_personal_suggestions
-- Bug: references event_suggestions.profile_id - column is actually named user_id
-- -----------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.get_personal_suggestions(uuid);

CREATE OR REPLACE FUNCTION public.get_personal_suggestions(p_profile_id uuid)
RETURNS TABLE (
  suggestion_id   uuid,
  template_id     uuid,
  title           text,
  description     text,
  why_shown       text,
  score           integer,
  category_level  integer,
  base_price_type text,
  indoor_outdoor  text,
  interest_tags   text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    es.id                    AS suggestion_id,
    es.template_id,
    at.title,
    at.description,
    es.why_shown,
    es.score,
    at.category_level,
    at.base_price_type,
    at.indoor_outdoor,
    at.interest_tags
  FROM event_suggestions es
  JOIN activity_templates at ON at.id = es.template_id
  WHERE
    -- FIX: was es.profile_id - correct column name is es.user_id
    es.user_id = p_profile_id
    AND es.suggestion_status = 'pending'
    AND (es.shown_at IS NULL OR es.shown_at > now() - interval '7 days')
  ORDER BY es.score DESC
  LIMIT 20;
END;
$$;

-- -----------------------------------------------------------------------------
-- FIX 3: generate_suggestions_for_user
-- Bug: references events.start_time - column is actually named date
-- -----------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.generate_suggestions_for_user(uuid);

CREATE OR REPLACE FUNCTION public.generate_suggestions_for_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_city          text;
  user_interests_arr text[];
BEGIN
  SELECT city INTO user_city
    FROM profiles
   WHERE id = target_user_id;

  SELECT COALESCE(array_agg(interest), '{}') INTO user_interests_arr
    FROM user_interests
   WHERE user_id = target_user_id;

  INSERT INTO event_suggestions (user_id, event_id, reason, match_score)
  SELECT
    target_user_id,
    e.id,
    'Matcher dine interesser',
    (
      SELECT COUNT(*)
        FROM user_interests ui
       WHERE ui.user_id = target_user_id
         AND (
           e.title       ILIKE '%' || ui.interest || '%'
           OR e.description ILIKE '%' || ui.interest || '%'
           OR e.category    ILIKE '%' || ui.interest || '%'
         )
    )::int AS match_score
  FROM events e
  WHERE
    e.date > now()
    AND e.id NOT IN (
      SELECT event_id
        FROM event_suggestions
       WHERE user_id = target_user_id
    )
  ON CONFLICT (user_id, event_id) DO NOTHING;

  INSERT INTO notifications (user_id, type, title, body)
  VALUES (
    target_user_id,
    'new_suggestion',
    'Vi har fundet oplevelser til dig!',
    'Aabn appen for at se dine personlige anbefalinger.'
  )
  ON CONFLICT DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_missing_participant_events(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_personal_suggestions(uuid)        TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_suggestions_for_user(uuid)   TO authenticated, service_role;
