-- ====================================================================
-- AL-HIKMAH MADRASA & SCHOOL MANAGEMENT SYSTEM - EXAMINATIONS MODULE
-- Migration 005: Exams, Marks Entry, Grading & Kashf-ul-Darajat (امتحانات و نتائج)
-- ====================================================================

-- 1. ENUM Types for Exams and Islamic/School Grading
CREATE TYPE exam_type AS ENUM ('mid_term', 'annual', 'monthly', 'board_trial');
CREATE TYPE grade_level AS ENUM ('mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbool', 'rasib'); -- (A+, A, B, C, Fail / ممتاز، جید جدا، جید، مقبول، راسب/ناکام)

-- 2. EXAMS TABLE (امتحانی سیشنز اور شیڈول)
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ur TEXT NOT NULL, -- e.g. "سالانہ امتحان 1447ھ (عصری و دینی علوم)"
    title_en TEXT NOT NULL, -- e.g. "Annual Examination 2026"
    exam_type exam_type NOT NULL DEFAULT 'annual',
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '15 days'),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXAM RESULTS / MARKS ENTRY TABLE (کشف الدرجات اور نمبرات کی تفصیل)
CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    total_marks INT NOT NULL DEFAULT 100,
    obtained_marks INT NOT NULL DEFAULT 0,
    grade grade_level NOT NULL DEFAULT 'mumtaz',
    remarks TEXT, -- e.g. "بہترین کارکردگی / حسنِ قراءت"
    marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Teacher ID
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_subject_exam_result UNIQUE (exam_id, student_id, subject_id)
);

-- 4. INDEXES FOR FAST RESULT CARD COMPUTATION
CREATE INDEX IF NOT EXISTS idx_exam_results_student_exam ON public.exam_results(student_id, exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_class_subject ON public.exam_results(class_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_published ON public.exams(is_published);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES
CREATE POLICY "All authenticated users can read published exams"
    ON public.exams FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and Clerks can manage exams"
    ON public.exams FOR ALL USING (public.is_admin_or_clerk());

CREATE POLICY "Teachers, Admins, and Clerks can insert and update exam results"
    ON public.exam_results FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Students and Parents can read their own exam results"
    ON public.exam_results FOR SELECT USING (auth.uid() = student_id);

-- ====================================================================
-- 7. RICH SEED DATA: EXAM SESSIONS & STUDENT MARKS (ANALYTICS DEMO)
-- ====================================================================

-- Seed Sample Exams
INSERT INTO public.exams (id, title_ur, title_en, exam_type, start_date, end_date, is_published) VALUES
('66666666-6666-6666-6666-666666666601', 'سالانہ امتحان 1447ھ (جامعہ الحکمہ و پبلک سکول)', 'Annual Examination 2026', 'annual', '2026-06-15', '2026-06-30', true),
('66666666-6666-6666-6666-666666666602', 'ششماہی امتحان 1447ھ (مڈ ٹرم ٹیسٹ)', 'Mid-Term Examination 2026', 'mid_term', '2026-02-10', '2026-02-22', true)
ON CONFLICT DO NOTHING;

-- Seed Exam Results for Grade 1 Students (Exam ID: 6666...01)
-- Subjects in Grade 1: Nazira (3333...01), Islamiat (3333...02), Mathematics (3333...03), Urdu, English
INSERT INTO public.exam_results (exam_id, student_id, class_id, subject_id, total_marks, obtained_marks, grade, remarks) VALUES
-- Student 1: Muhammad Zubair (Total 275/300 -> 91.6% - ممتاز / 1st Position)
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301', 100, 95, 'mumtaz', 'حسنِ قراءت اور مخارج کا بہترین التزام'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333302', 100, 92, 'mumtaz', 'فقہ و قائدہ میں ممتاز کارکردگی'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333303', 100, 88, 'jayyid_jiddan', 'حساب اور ریاضی میں عمدہ سمجھ بوجھ'),

-- Student 2: Ahmed Raza Qadri (Total 253/300 -> 84.3% - جید جدا / 2nd Position)
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301', 100, 88, 'jayyid_jiddan', 'تجوید کا مزید خیال رکھیں'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333302', 100, 85, 'jayyid_jiddan', 'اچھی تیاری ہے'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333303', 100, 80, 'jayyid_jiddan', 'تسلی بخش'),

-- Student 3: Talha Mahmood Usmani (Total 225/300 -> 75% - جید / 3rd Position)
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301', 100, 78, 'jayyid', 'مزید محنت درکار ہے'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333302', 100, 75, 'jayyid', 'تسلی بخش'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333303', 100, 72, 'jayyid', 'ریاضی میں کمزور'),

-- Student 5: Hafiz Bilal Ahmed (Hifz Dept - Total 194/200 -> 97% - ممتاز / 1st Position Hifz)
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111104', '33333333-3333-3333-3333-333333333304', 100, 98, 'mumtaz', 'ماشاء اللہ پختہ حفظ، کوئی منزل نہیں بھولی'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111104', '33333333-3333-3333-3333-333333333305', 100, 96, 'mumtaz', 'قواعد صرف و نحو میں عبور'),

-- Student 7: Maulvi Anas Madani (Dars-e-Nizami - Total 285/300 -> 95% - ممتاز / 1st Position Dars-e-Nizami)
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111105', '33333333-3333-3333-3333-333333333306', 100, 96, 'mumtaz', 'فقہ حنفی میں بہترین عبور اور استدلال'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111105', '33333333-3333-3333-3333-333333333307', 100, 94, 'mumtaz', 'عربی ادب اور نحو میں ممتاز کارکردگی'),
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111105', '33333333-3333-3333-3333-333333333308', 100, 95, 'mumtaz', 'روایت حدیث اور اصول حدیث کی پختگی')
ON CONFLICT DO NOTHING;
