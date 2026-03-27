-- Migration: 20260327_003_normalized_tags_table.sql
-- Description: Introduce a normalized tag taxonomy system

-- 1. tag_categories
CREATE TABLE IF NOT EXISTS public.tag_categories (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  slug       text        UNIQUE NOT NULL,
  emoji      text,
  sort_order int         DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.tag_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tag_categories_select_all" ON public.tag_categories FOR SELECT USING (true);
CREATE POLICY "tag_categories_admin_write" ON public.tag_categories FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 2. tags_normalized
CREATE TABLE IF NOT EXISTS public.tags_normalized (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        UNIQUE NOT NULL,
  emoji       text,
  parent_id   uuid        REFERENCES public.tags_normalized(id) ON DELETE SET NULL,
  category_id uuid        REFERENCES public.tag_categories(id)  ON DELETE SET NULL,
  level       int         DEFAULT 1 CHECK (level IN (1, 2, 3)),
  user_count  int         DEFAULT 0,
  event_count int         DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.tags_normalized ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_normalized_select_all" ON public.tags_normalized FOR SELECT USING (true);
CREATE POLICY "tags_normalized_admin_write" ON public.tags_normalized FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS idx_tags_normalized_slug ON public.tags_normalized (slug);
CREATE INDEX IF NOT EXISTS idx_tags_normalized_parent_id ON public.tags_normalized (parent_id);
CREATE INDEX IF NOT EXISTS idx_tags_normalized_category_id ON public.tags_normalized (category_id);

-- 3. user_tags_normalized
CREATE TABLE IF NOT EXISTS public.user_tags_normalized (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id)      ON DELETE CASCADE,
  tag_id     uuid        NOT NULL REFERENCES public.tags_normalized(id) ON DELETE CASCADE,
  weight     float       DEFAULT 1.0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, tag_id)
);
ALTER TABLE public.user_tags_normalized ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_tags_normalized_select_own" ON public.user_tags_normalized FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_tags_normalized_insert_own" ON public.user_tags_normalized FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tags_normalized_update_own" ON public.user_tags_normalized FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tags_normalized_delete_own" ON public.user_tags_normalized FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_normalized_user_id ON public.user_tags_normalized (user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_normalized_tag_id ON public.user_tags_normalized (tag_id);

-- 4. event_tags_normalized
CREATE TABLE IF NOT EXISTS public.event_tags_normalized (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id)         ON DELETE CASCADE,
  tag_id   uuid NOT NULL REFERENCES public.tags_normalized(id) ON DELETE CASCADE,
  UNIQUE (event_id, tag_id)
);
ALTER TABLE public.event_tags_normalized ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_tags_normalized_select_all" ON public.event_tags_normalized FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "event_tags_normalized_insert_owner" ON public.event_tags_normalized FOR INSERT WITH CHECK (auth.uid() = (SELECT created_by FROM public.events WHERE id = event_id));
CREATE POLICY "event_tags_normalized_delete_owner" ON public.event_tags_normalized FOR DELETE USING (auth.uid() = (SELECT created_by FROM public.events WHERE id = event_id));
CREATE POLICY "event_tags_normalized_service_role" ON public.event_tags_normalized FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS idx_event_tags_normalized_event_id ON public.event_tags_normalized (event_id);
CREATE INDEX IF NOT EXISTS idx_event_tags_normalized_tag_id ON public.event_tags_normalized (tag_id);

-- Helper: keep user_count and event_count on tags_normalized up to date
CREATE OR REPLACE FUNCTION public.update_tag_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_TABLE_NAME = 'user_tags_normalized' THEN
    UPDATE public.tags_normalized SET user_count = (SELECT COUNT(*) FROM public.user_tags_normalized WHERE tag_id = COALESCE(NEW.tag_id, OLD.tag_id)) WHERE id = COALESCE(NEW.tag_id, OLD.tag_id);
  ELSIF TG_TABLE_NAME = 'event_tags_normalized' THEN
    UPDATE public.tags_normalized SET event_count = (SELECT COUNT(*) FROM public.event_tags_normalized WHERE tag_id = COALESCE(NEW.tag_id, OLD.tag_id)) WHERE id = COALESCE(NEW.tag_id, OLD.tag_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_update_user_tag_counts ON public.user_tags_normalized;
CREATE TRIGGER trg_update_user_tag_counts AFTER INSERT OR UPDATE OR DELETE ON public.user_tags_normalized FOR EACH ROW EXECUTE FUNCTION public.update_tag_counts();

DROP TRIGGER IF EXISTS trg_update_event_tag_counts ON public.event_tags_normalized;
CREATE TRIGGER trg_update_event_tag_counts AFTER INSERT OR UPDATE OR DELETE ON public.event_tags_normalized FOR EACH ROW EXECUTE FUNCTION public.update_tag_counts();
