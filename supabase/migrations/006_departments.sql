-- Migration 006: Dynamic Departments (شعبہ جات)

-- 1. Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ur TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read departments"
    ON public.departments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage departments"
    ON public.departments FOR ALL USING (public.is_admin_or_clerk());

-- 2. Insert Base Departments
INSERT INTO public.departments (id, name_ur, name_en, description) VALUES
('44444444-4444-4444-4444-444444444401', 'شعبہ حفظ و ناظرہ', 'Hifz & Nazra', 'Basic Quran recitation and memorization'),
('44444444-4444-4444-4444-444444444402', 'شعبہ تجوید و قرآت', 'Tajweed & Qiraat', 'Advanced Quran recitation with Tajweed rules'),
('44444444-4444-4444-4444-444444444403', 'شعبہ تعلیم بالغان', 'Adult Education', 'Basic Islamic education for adults'),
('44444444-4444-4444-4444-444444444404', 'شعبہ کتب (درس نظامی)', 'Dars-e-Nizami', 'Comprehensive Islamic scholar program'),
('44444444-4444-4444-4444-444444444405', 'شعبہ تخصصات', 'Takhassusat (Postgrad)', 'Specializations in Fiqh, Hadith, Tafseer'),
('44444444-4444-4444-4444-444444444406', 'عصری تعلیم (سکول)', 'School Education', 'Modern school subjects and curriculum')
ON CONFLICT DO NOTHING;

-- 3. Add department_id to classes
ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

-- 4. Update existing classes to use department_id based on old level_type
UPDATE public.classes SET department_id = '44444444-4444-4444-4444-444444444401' WHERE level_type = 'hifz';
UPDATE public.classes SET department_id = '44444444-4444-4444-4444-444444444404' WHERE level_type = 'dars_nizami';
UPDATE public.classes SET department_id = '44444444-4444-4444-4444-444444444406' WHERE level_type = 'school';

-- 5. Note: We will keep level_type column for now for backwards compatibility, but it will be nullable and we can drop its constraint
ALTER TABLE public.classes DROP CONSTRAINT IF EXISTS classes_level_type_check;
ALTER TABLE public.classes ALTER COLUMN level_type DROP NOT NULL;
