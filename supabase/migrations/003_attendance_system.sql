-- ====================================================================
-- AL-HIKMAH MADRASA & SCHOOL MANAGEMENT SYSTEM - ATTENDANCE MODULE
-- Migration 003: Daily & Monthly Attendance System (حاضری کا ڈیجیٹل نظام)
-- ====================================================================

-- 1. ENUM Type for Attendance Status
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'leave', 'late');

-- 2. ATTENDANCE RECORDS TABLE (روزانہ حاضری رجسٹر)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status attendance_status NOT NULL DEFAULT 'present',
    marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks TEXT, -- e.g. "بیماری کی رخصت / 15 منٹ تاخیر"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_daily_attendance UNIQUE (student_id, date)
);

-- 3. INDEXES FOR PERFORMANCE & REPORTING
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON public.attendance_records(class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(date);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR ATTENDANCE RECORDS
CREATE POLICY "All authenticated staff can view attendance records"
    ON public.attendance_records FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Teachers and Admins can insert attendance records"
    ON public.attendance_records FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Teachers and Admins can update attendance records"
    ON public.attendance_records FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete attendance records"
    ON public.attendance_records FOR DELETE
    USING (public.is_admin_or_clerk());

-- ====================================================================
-- 6. DEMO SEED DATA: STUDENTS & ATTENDANCE RECORDS FOR IMMEDIATE TESTING
-- ====================================================================

-- Seed Sample Students (if not already present)
INSERT INTO public.students (id, registration_id, first_name, last_name, gender, current_class_id, status, father_name, father_phone, admission_date)
VALUES
('44444444-4444-4444-4444-444444444401', 'REG-2026-0001', 'محمد زبیر', 'بن عبداللہ', 'male', '11111111-1111-1111-1111-111111111101', 'active', 'عبداللہ شاہ', '0300-1234567', '2026-04-01'),
('44444444-4444-4444-4444-444444444402', 'REG-2026-0002', 'احمد رضا', 'قادری', 'male', '11111111-1111-1111-1111-111111111101', 'active', 'غلام مصطفیٰ', '0301-7654321', '2026-04-01'),
('44444444-4444-4444-4444-444444444403', 'REG-2026-0003', 'طلحہ محمود', 'عثمانی', 'male', '11111111-1111-1111-1111-111111111101', 'active', 'محمود عالم', '0333-9876543', '2026-04-01'),
('44444444-4444-4444-4444-444444444404', 'REG-2026-0004', 'عائشہ صدیقہ', 'بنت عمر', 'female', '11111111-1111-1111-1111-111111111101', 'active', 'عمر فاروق', '0321-1122334', '2026-04-01'),
('44444444-4444-4444-4444-444444444405', 'REG-2026-0005', 'حافظ بلال', 'احمد', 'male', '11111111-1111-1111-1111-111111111104', 'active', 'احمد یوسف', '0345-5566778', '2026-04-01'),
('44444444-4444-4444-4444-444444444406', 'REG-2026-0006', 'عبدالرحمٰن', 'سندھی', 'male', '11111111-1111-1111-1111-111111111104', 'active', 'ابراھیم سندھی', '0312-4433221', '2026-04-01'),
('44444444-4444-4444-4444-444444444407', 'REG-2026-0007', 'مولوی انس', 'مدنی', 'male', '11111111-1111-1111-1111-111111111105', 'active', 'شفیق مدنی', '0300-9988776', '2026-04-01'),
('44444444-4444-4444-4444-444444444408', 'REG-2026-0008', 'حسنین معاویہ', 'چوہدری', 'male', '11111111-1111-1111-1111-111111111105', 'active', 'اختر چوہدری', '0332-6677889', '2026-04-01')
ON CONFLICT (registration_id) DO NOTHING;

-- Seed Sample Attendance Records for Today (CURRENT_DATE) and previous days
INSERT INTO public.attendance_records (student_id, class_id, section_id, date, status, remarks)
VALUES
-- Today's Attendance (Grade 1 - Section A)
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE, 'present', 'وقت پر حاضر'),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE, 'present', 'حاضر'),
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE, 'leave', 'بیماری کی رخصت (والد کا فون آیا)'),
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE, 'late', '10 منٹ تاخیر سے آمد'),

-- Today's Attendance (Hifz Dept)
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222203', CURRENT_DATE, 'present', 'سبق سنا دیا'),
('44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222203', CURRENT_DATE, 'absent', 'بغیر اطلاع غیر حاضر'),

-- Previous Day (Yesterday) Attendance
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE - INTERVAL '1 day', 'present', 'حاضر'),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE - INTERVAL '1 day', 'present', 'حاضر'),
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE - INTERVAL '1 day', 'present', 'حاضر'),
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', CURRENT_DATE - INTERVAL '1 day', 'present', 'حاضر')
ON CONFLICT (student_id, date) DO NOTHING;
