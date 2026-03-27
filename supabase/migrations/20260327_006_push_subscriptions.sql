-- Migration: 20260327_006_push_subscriptions.sql
-- Description: Create push_subscriptions table for PWA Web Push notifications

-- 1. push_subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint     text        NOT NULL UNIQUE,
  p256dh       text        NOT NULL,
  auth         text        NOT NULL,
  user_agent   text,
  device_label text,
  platform     text,
  is_active    boolean     DEFAULT true,
  last_used_at timestamptz,
  failed_count int         DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. RLS policies
CREATE POLICY "push_subscriptions_select_own" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "push_subscriptions_insert_own" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "push_subscriptions_update_own" ON public.push_subscriptions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "push_subscriptions_delete_own" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "push_subscriptions_service_role" ON public.push_subscriptions FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_active ON public.push_subscriptions (user_id) WHERE is_active = true;
CREATE UNIQUE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions (endpoint);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_failed_count ON public.push_subscriptions (failed_count) WHERE is_active = true;

-- 4. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_push_subscription_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS trg_push_subscriptions_updated_at ON public.push_subscriptions;
CREATE TRIGGER trg_push_subscriptions_updated_at BEFORE UPDATE ON public.push_subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_push_subscription_updated_at();

-- 5. Upsert helper function
CREATE OR REPLACE FUNCTION public.upsert_push_subscription(
  p_user_id     uuid,
  p_endpoint    text,
  p_p256dh      text,
  p_auth        text,
  p_user_agent  text DEFAULT NULL,
  p_device_label text DEFAULT NULL,
  p_platform    text DEFAULT 'web'
)
RETURNS public.push_subscriptions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result public.push_subscriptions;
BEGIN
  INSERT INTO public.push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, device_label, platform, is_active, failed_count)
  VALUES (p_user_id, p_endpoint, p_p256dh, p_auth, p_user_agent, p_device_label, p_platform, true, 0)
  ON CONFLICT (endpoint) DO UPDATE
    SET user_id = EXCLUDED.user_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth,
        user_agent = COALESCE(EXCLUDED.user_agent, push_subscriptions.user_agent),
        device_label = COALESCE(EXCLUDED.device_label, push_subscriptions.device_label),
        platform = COALESCE(EXCLUDED.platform, push_subscriptions.platform),
        is_active = true, failed_count = 0, updated_at = now()
  RETURNING * INTO result;
  RETURN result;
END;
$$;
GRANT EXECUTE ON FUNCTION public.upsert_push_subscription(uuid, text, text, text, text, text, text) TO authenticated, service_role;

-- 6. Cleanup helper function
CREATE OR REPLACE FUNCTION public.cleanup_failed_push_subscriptions(p_failure_threshold int DEFAULT 5)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE deactivated_count integer;
BEGIN
  UPDATE public.push_subscriptions SET is_active = false, updated_at = now()
   WHERE is_active = true AND failed_count >= p_failure_threshold;
  GET DIAGNOSTICS deactivated_count = ROW_COUNT;
  RETURN deactivated_count;
END;
$$;
GRANT EXECUTE ON FUNCTION public.cleanup_failed_push_subscriptions(int) TO service_role;
