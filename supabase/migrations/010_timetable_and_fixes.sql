-- Migration 010: Timetable System & Departments RLS Fix

-- 1. Fix Departments RLS (So Admin can view them)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All authenticated users can read departments" ON public.departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;

CREATE POLICY "All authenticated users can read departments"
    ON public.departments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage departments"
    ON public.departments FOR ALL USING (public.is_admin_or_clerk());

-- 2. Create ENUM for Days of Week
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'day_of_week') THEN
        CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
    END IF;
END$$;

-- 3. Create Timetables Table
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS and Policies for Timetables
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage timetables"
    ON public.timetables FOR ALL USING (public.is_admin_or_clerk());

CREATE POLICY "Authenticated users can read timetables"
    ON public.timetables FOR SELECT USING (auth.role() = 'authenticated');
