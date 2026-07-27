-- ====================================================================
-- AL-HIKMAH MADRASA & SCHOOL MANAGEMENT SYSTEM - ACADEMIC MODULE SCHEMA
-- Migration 002: Classes (درجات), Sections (سیکشنز), Subjects (مضامین), and Class Subjects
-- ====================================================================

-- 1. CLASSES TABLE (درجات و شعبہ جات)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ur TEXT NOT NULL, -- e.g. "درجہ اول (ناظرہ و بنیادی تعلیم)"
    name_en TEXT NOT NULL, -- e.g. "Grade 1 (Nazira & Basics)"
    level_type TEXT NOT NULL CHECK (level_type IN ('school', 'hifz', 'dars_nizami')), -- School, Hifz, or Alimiyah
    description TEXT,
    capacity INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SECTIONS TABLE (سیکشنز)
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    name_ur TEXT NOT NULL, -- e.g. "سیکشن الف (صبح)"
    name_en TEXT NOT NULL, -- e.g. "Section A (Morning)"
    room_number TEXT,      -- e.g. "ہال نمبر 102"
    shift TEXT CHECK (shift IN ('morning', 'afternoon', 'evening')) DEFAULT 'morning',
    capacity INT DEFAULT 35,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS TABLE (مضامین و درسی کتب)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ur TEXT NOT NULL, -- e.g. "تجوید و قراءت القرآن"
    name_en TEXT NOT NULL, -- e.g. "Tajweed & Quran Recitation"
    code TEXT NOT NULL UNIQUE, -- e.g. "ISL-101"
    subject_type TEXT CHECK (subject_type IN ('compulsory', 'elective', 'islamic', 'vocational')) DEFAULT 'compulsory',
    total_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLASS SUBJECTS MAPPING TABLE (تفویض کردہ مضامین و اساتذہ)
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Assigned Ustad / Teacher
    credit_hours INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, subject_id)
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES (All authenticated users can read, only Admin & Clerk can write)
CREATE POLICY "All authenticated users can read classes"
    ON public.classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage classes"
    ON public.classes FOR ALL USING (public.is_admin_or_clerk());

CREATE POLICY "All authenticated users can read sections"
    ON public.sections FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage sections"
    ON public.sections FOR ALL USING (public.is_admin_or_clerk());

CREATE POLICY "All authenticated users can read subjects"
    ON public.subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage subjects"
    ON public.subjects FOR ALL USING (public.is_admin_or_clerk());

CREATE POLICY "All authenticated users can read class_subjects"
    ON public.class_subjects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage class_subjects"
    ON public.class_subjects FOR ALL USING (public.is_admin_or_clerk());

-- ====================================================================
-- 7. RICH SEED DATA FOR DEMO & PRODUCTION (MADRASA + SCHOOL)
-- ====================================================================

-- Seed Classes (درجات)
INSERT INTO public.classes (id, name_ur, name_en, level_type, description, capacity) VALUES
('11111111-1111-1111-1111-111111111101', 'درجہ اول (ناظرہ و بنیادی تعلیم)', 'Grade 1 (Nazira & Basics)', 'school', 'بنیادی ناظرہ قرآن، اردو قاعدہ اور حساب', 45),
('11111111-1111-1111-1111-111111111102', 'درجہ پنجم (پرائمری عصری علوم)', 'Grade 5 (Primary Education)', 'school', 'پرائمری بورڈ کا مکمل نصاب اور اسلامیات', 40),
('11111111-1111-1111-1111-111111111103', 'درجہ دہم (سائنس گروپ)', 'Grade 10 (Science Group)', 'school', 'میٹرک سائنس (فزکس، کیمسٹری، بائیولوجی اور اسلامیات)', 35),
('11111111-1111-1111-1111-111111111104', 'شعبہ حفظ القرآن (ناظرہ و حفظ)', 'Hifz al-Quran (Memorization Dept)', 'hifz', 'مکمل حفظ القرآن کے لیے دارالحفظ کا خصوصی درجہ', 30),
('11111111-1111-1111-1111-111111111105', 'درس نظامی سال اول (عامہ اولیٰ)', 'Dars-e-Nizami Year 1 (Aamah 1)', 'dars_nizami', 'صرف، نحو، فقہ اور ابتدائی عربی ادب', 35),
('11111111-1111-1111-1111-111111111106', 'درجہ عالمیت سال آخر (دورہ حدیث)', 'Dora-e-Hadith (Final Year Alimiyah)', 'dars_nizami', 'صحاح ستہ اور اصول حدیث کا اختتامی سال', 25)
ON CONFLICT DO NOTHING;

-- Seed Sections (سیکشنز)
INSERT INTO public.sections (id, class_id, name_ur, name_en, room_number, shift, capacity) VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'سیکشن الف (صبح)', 'Section A (Morning)', 'کمرہ نمبر 101', 'morning', 25),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'سیکشن ب (دوپہر)', 'Section B (Afternoon)', 'کمرہ نمبر 102', 'afternoon', 20),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111104', 'دارالحفظ الف (صبح)', 'Darul-Hifz A (Morning)', 'ہال نمبر 1', 'morning', 15),
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111104', 'دارالحفظ ب (شام)', 'Darul-Hifz B (Evening)', 'ہال نمبر 2', 'evening', 15),
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111105', 'سیکشن عامہ (صبح)', 'Section Aamah (Morning)', 'ہال نمبر 3', 'morning', 35),
('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111106', 'ہال دورہ حدیث', 'Dora-e-Hadith Hall', 'مرکزی ہال دارالحدیث', 'morning', 25)
ON CONFLICT DO NOTHING;

-- Seed Subjects (مضامین)
INSERT INTO public.subjects (id, name_ur, name_en, code, subject_type, total_marks, passing_marks) VALUES
('33333333-3333-3333-3333-333333333301', 'تجوید و قراءت القرآن', 'Tajweed & Quran Recitation', 'ISL-101', 'islamic', 100, 50),
('33333333-3333-3333-3333-333333333302', 'فقہ اور اصول فقہ (نور الایضاح / قدوری)', 'Fiqh & Usul al-Fiqh', 'FIQ-201', 'islamic', 100, 50),
('33333333-3333-3333-3333-333333333303', 'علم الصرف و النحو (عربی گرائمر)', 'Arabic Grammar (Sarf & Nahw)', 'ARB-101', 'islamic', 100, 45),
('33333333-3333-3333-3333-333333333304', 'صحیح بخاری و صحیح مسلم (حدیث)', 'Sahih Bukhari & Muslim (Hadith)', 'HAD-401', 'islamic', 100, 60),
('33333333-3333-3333-3333-333333333305', 'ریاضی اور الجبرا (Mathematics)', 'Mathematics & Algebra', 'MTH-101', 'compulsory', 100, 40),
('33333333-3333-3333-3333-333333333306', 'انگریزی زبان اور گرائمر (English)', 'English Language & Grammar', 'ENG-101', 'compulsory', 100, 40),
('33333333-3333-3333-3333-333333333307', 'عمومی سائنس اور کمپیوٹر (General Science)', 'General Science & Computer', 'SCI-101', 'compulsory', 100, 40)
ON CONFLICT DO NOTHING;

-- Seed Class Subjects Mapping
INSERT INTO public.class_subjects (class_id, subject_id, credit_hours) VALUES
('11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301', 5),
('11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333305', 3),
('11111111-1111-1111-1111-111111111104', '33333333-3333-3333-3333-333333333301', 10),
('11111111-1111-1111-1111-111111111105', '33333333-3333-3333-3333-333333333302', 4),
('11111111-1111-1111-1111-111111111105', '33333333-3333-3333-3333-333333333303', 4),
('11111111-1111-1111-1111-111111111106', '33333333-3333-3333-3333-333333333304', 8),
('11111111-1111-1111-1111-111111111103', '33333333-3333-3333-3333-333333333305', 4),
('11111111-1111-1111-1111-111111111103', '33333333-3333-3333-3333-333333333306', 4)
ON CONFLICT DO NOTHING;
