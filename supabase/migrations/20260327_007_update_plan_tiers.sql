-- Migration: 20260327_007_update_plan_tiers.sql
-- Description: Update company plan tiers from fixed subscription to revenue share model
-- Old tiers: free, starter, pro, enterprise
-- New tiers: starter (0%), vaekst (5%), partner (3%)

-- 1. Migrate existing plans to new tier names
UPDATE public.companies SET plan = 'starter' WHERE plan IN ('free', 'starter');
UPDATE public.companies SET plan = 'vaekst' WHERE plan = 'pro';
UPDATE public.companies SET plan = 'partner' WHERE plan = 'enterprise';

-- 2. Drop old CHECK constraint and add new one
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_plan_check;
ALTER TABLE public.companies ADD CONSTRAINT companies_plan_check CHECK (plan IN ('starter', 'vaekst', 'partner'));

-- 3. Update default to 'starter'
ALTER TABLE public.companies ALTER COLUMN plan SET DEFAULT 'starter';

-- 4. Create company_revenue table for tracking revenue share
CREATE TABLE IF NOT EXISTS public.company_revenue (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid        NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  month         text        NOT NULL, -- format: YYYY-MM
  revenue       numeric(12,2) DEFAULT 0,
  bsocial_share numeric(12,2) DEFAULT 0,
  status        text        DEFAULT 'pending' CHECK (status IN ('pending', 'settled')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE (company_id, month)
);
ALTER TABLE public.company_revenue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_revenue_select_own" ON public.company_revenue
  FOR SELECT USING (
    company_id IN (
      SELECT cm.company_id FROM public.company_members cm WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "company_revenue_service_role" ON public.company_revenue
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_company_revenue_company_id ON public.company_revenue (company_id);
CREATE INDEX IF NOT EXISTS idx_company_revenue_month ON public.company_revenue (month);
