-- ==============================================================================
-- Tiny Tales Adventure Bank - Supabase SQL Setup
-- Run this in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create tables if they do not exist
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT 'demo@tinytaleskids.com',
    parent_pin TEXT NOT NULL DEFAULT '1234',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    coin_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Daily Chores',
    icon TEXT NOT NULL DEFAULT '⭐',
    reward_coins INTEGER NOT NULL DEFAULT 10,
    status TEXT NOT NULL DEFAULT 'available', -- 'available' | 'pending' | 'completed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_coins INTEGER NOT NULL DEFAULT 100,
    icon TEXT NOT NULL DEFAULT '🏰',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- 3. Create permissive policies for anon client access (Demo / Pair Programming environment)
DROP POLICY IF EXISTS "Allow anon all on families" ON public.families;
CREATE POLICY "Allow anon all on families" ON public.families FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on children" ON public.children;
CREATE POLICY "Allow anon all on children" ON public.children FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on quests" ON public.quests;
CREATE POLICY "Allow anon all on quests" ON public.quests FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on goals" ON public.goals;
CREATE POLICY "Allow anon all on goals" ON public.goals FOR ALL TO anon USING (true) WITH CHECK (true);

-- (Optional) If you prefer to disable RLS completely during development:
-- ALTER TABLE public.families DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.children DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.goals DISABLE ROW LEVEL SECURITY;
