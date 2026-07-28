-- Migration 006: Dynamic Departments (شعبہ جات)

-- 1. Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE,
    name_ur TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If the table existed without code, add it
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;

-- If the table existed with a NOT NULL code, make it nullable to avoid insert errors
ALTER TABLE public.departments ALTER COLUMN code DROP NOT NULL;

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read departments"
    ON public.departments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage departments"
    ON public.departments FOR ALL USING (public.is_admin_or_clerk());

-- 2. Insert Base Departments
INSERT INTO public.departments (id, code, name_ur, name_en, description) VALUES
('44444444-4444-4444-4444-444444444401', 'HIFZ', 'شعبہ حفظ و ناظرہ', 'Hifz & Nazra', 'Basic Quran recitation'),
('44444444-4444-4444-4444-444444444402', 'TAJWEED', 'شعبہ تجوید و قرآت', 'Tajweed & Qiraat', 'Advanced Quran recitation'),
('44444444-4444-4444-4444-444444444403', 'ADULT', 'شعبہ تعلیم بالغان', 'Adult Education', 'Basic Islamic education'),
('44444444-4444-4444-4444-444444444404', 'DARS', 'شعبہ کتب (درس نظامی)', 'Dars-e-Nizami', 'Islamic scholar program'),
('44444444-4444-4444-4444-444444444405', 'TAKHASSUS', 'شعبہ تخصصات', 'Takhassusat (Postgrad)', 'Specializations'),
('44444444-4444-4444-4444-444444444406', 'SCHOOL', 'عصری تعلیم (سکول)', 'School Education', 'Modern school subjects')
ON CONFLICT DO NOTHING;

-- 3. Add department_id to classes
ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

-- 4. Update existing classes to use department_id based on old level_type
UPDATE public.classes SET department_id = '44444444-4444-4444-4444-444444444401' WHERE level_type = 'hifz_nazra';
UPDATE public.classes SET department_id = '44444444-4444-4444-4444-444444444404' WHERE level_type = 'dars_nizami';
UPDATE public.classes SET department_id = '44444444-4444-4444-4444-444444444406' WHERE level_type = 'school';

-- 5. Note: We will keep level_type column for now for backwards compatibility, but it will be nullable and we can drop its constraint
ALTER TABLE public.classes DROP CONSTRAINT IF EXISTS classes_level_type_check;
ALTER TABLE public.classes ALTER COLUMN level_type DROP NOT NULL;
