-- =========================================================
-- Supabase Schema Migration: 001_initial_schema.sql
-- Project: AI-Powered Agriculture Crop Advisory Assistant (Chaotic Edition)
-- =========================================================

-- Enable pgcrypto for UUID generation if not present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    farmer_name TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    location TEXT NOT NULL,
    total_area_hectares NUMERIC DEFAULT 0
);

-- Create Crops & Fields Table
CREATE TABLE IF NOT EXISTS public.plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    plot_name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    growth_stage TEXT NOT NULL
);

-- Create Advisories Table
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    condition_diagnosis TEXT NOT NULL,
    action_plan JSONB NOT NULL,
    urgency_level TEXT DEFAULT 'MEDIUM'
);

-- Enable Row Level Security
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for demo simplicity (Drop existing policies if rerun)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow anon select" ON public.farms;
    DROP POLICY IF EXISTS "Allow anon insert" ON public.farms;
    DROP POLICY IF EXISTS "Allow anon update" ON public.farms;
    DROP POLICY IF EXISTS "Allow anon delete" ON public.farms;

    DROP POLICY IF EXISTS "Allow anon select" ON public.plots;
    DROP POLICY IF EXISTS "Allow anon insert" ON public.plots;
    DROP POLICY IF EXISTS "Allow anon update" ON public.plots;
    DROP POLICY IF EXISTS "Allow anon delete" ON public.plots;

    DROP POLICY IF EXISTS "Allow anon select" ON public.advisories;
    DROP POLICY IF EXISTS "Allow anon insert" ON public.advisories;
    DROP POLICY IF EXISTS "Allow anon update" ON public.advisories;
    DROP POLICY IF EXISTS "Allow anon delete" ON public.advisories;
END $$;

CREATE POLICY "Allow anon select" ON public.farms FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.farms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.farms FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON public.farms FOR DELETE USING (true);

CREATE POLICY "Allow anon select" ON public.plots FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.plots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.plots FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON public.plots FOR DELETE USING (true);

CREATE POLICY "Allow anon select" ON public.advisories FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON public.advisories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.advisories FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON public.advisories FOR DELETE USING (true);

-- Seed Initial Data
INSERT INTO public.farms (id, farmer_name, farm_name, location, total_area_hectares)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Old McDonald', 'Chaos Acres Organic Ranch', 'Bakersfield, CA', 42.5),
    ('22222222-2222-2222-2222-222222222222', 'Farmer Giles', 'Overgrown Pastures & Sons', 'Des Moines, IA', 115.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.plots (id, farm_id, plot_name, crop_type, growth_stage)
VALUES 
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'North Corn Hazard Patch', 'Corn (Maize)', 'Tasseling'),
    ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'West Blight Vineyard', 'Wine Grapes', 'Fruit Set'),
    ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Swamp Wheat Quad', 'Winter Wheat', 'Vegetative')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.advisories (id, plot_id, query_text, condition_diagnosis, action_plan, urgency_level)
VALUES 
    (
        '66666666-6666-6666-6666-666666666666',
        '33333333-3333-3333-3333-333333333333',
        'Lower leaves show V-shaped yellowing along the midrib.',
        'Nitrogen Deficiency (Chlorosis)',
        '{"steps": ["Apply side-dress nitrogen fertilizer at 30-40 lbs/acre", "Ensure soil moisture facilitates uptake", "Check soil pH to rule out acid-induced nutrient lockup"], "immediate_threat": "Yield loss if tasseling finishes without correction"}',
        'HIGH'
    )
ON CONFLICT (id) DO NOTHING;
