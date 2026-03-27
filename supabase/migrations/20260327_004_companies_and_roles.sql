-- Migration: 20260327_004_companies_and_roles.sql
-- Description: Add company system and user role column

-- 1. companies
CREATE TABLE IF NOT EXISTS public.companies (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        UNIQUE NOT NULL,
  description text,
  logo_url    text,
  website     text,
  email       text,
  phone       text,
  address     text,
  cvr         text,
  lat         float,
  lng         float,
  owner_id    uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  plan        text        DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  is_verified boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies_select_authenticated" ON public.companies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "companies_update_owner" ON public.companies FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "companies_insert_authenticated" ON public.companies FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "companies_delete_owner" ON public.companies FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "companies_service_role" ON public.companies FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies (slug);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies (owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_cvr ON public.companies (cvr) WHERE cvr IS NOT NULL;

-- 2. company_members
CREATE TABLE IF NOT EXISTS public.company_members (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid        NOT NULL REFERENCES public.companies(id)  ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id)   ON DELETE CASCADE,
  role       text        DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (company_id, user_id)
);
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company_members_select_own_company" ON public.company_members FOR SELECT USING (company_id IN (SELECT cm.company_id FROM public.company_members cm WHERE cm.user_id = auth.uid()));
CREATE POLICY "company_members_insert_admin" ON public.company_members FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.company_members cm WHERE cm.company_id = company_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')));
CREATE POLICY "company_members_update_admin" ON public.company_members FOR UPDATE USING (EXISTS (SELECT 1 FROM public.company_members cm WHERE cm.company_id = company_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin'))) WITH CHECK (EXISTS (SELECT 1 FROM public.company_members cm WHERE cm.company_id = company_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')));
CREATE POLICY "company_members_delete_admin_or_self" ON public.company_members FOR DELETE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.company_members cm WHERE cm.company_id = company_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')));
CREATE POLICY "company_members_service_role" ON public.company_members FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS idx_company_members_company_id ON public.company_members (company_id);
CREATE INDEX IF NOT EXISTS idx_company_members_user_id ON public.company_members (user_id);

-- 3. Extend profiles with role column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'firma', 'admin'));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role) WHERE role != 'user';

-- 4. Trigger: auto-add company creator as owner member
CREATE OR REPLACE FUNCTION public.handle_new_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL THEN
    INSERT INTO public.company_members (company_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner')
    ON CONFLICT (company_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_handle_new_company ON public.companies;
CREATE TRIGGER trg_handle_new_company AFTER INSERT ON public.companies FOR EACH ROW EXECUTE FUNCTION public.handle_new_company();
