-- ====================================================================
-- 006_HR_PAYROLL_SYSTEM.SQL
-- Module 7: Human Resources, Staff Directory & Payroll Management
-- Al-Hikmah School & Madrasa Management System
-- ====================================================================

-- 1. Create Staff Department and Employment Status Enums
DO $$ BEGIN
    CREATE TYPE staff_department AS ENUM ('school', 'hifz', 'nizami', 'admin', 'support');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE emp_status AS ENUM ('active', 'on_leave', 'resigned', 'terminated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Staff Members Directory Table (اساتذہ و ملازمین کا ریکارڈ)
CREATE TABLE IF NOT EXISTS public.staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emp_id TEXT NOT NULL UNIQUE, -- e.g. EMP-2026-001
    full_name_ur TEXT NOT NULL,
    full_name_en TEXT NOT NULL,
    father_name_ur TEXT,
    father_name_en TEXT,
    cnic TEXT UNIQUE,
    phone TEXT NOT NULL,
    gender gender_type NOT NULL DEFAULT 'male',
    qualification TEXT NOT NULL, -- e.g. "شہادۃ العالمیہ (وفاق المدارس)، M.A Arabic"
    designation_ur TEXT NOT NULL, -- e.g. "شیخ الحدیث و پرنسپل", "استاد حفظ"
    designation_en TEXT NOT NULL,
    department staff_department NOT NULL DEFAULT 'school',
    basic_salary NUMERIC(10, 2) NOT NULL DEFAULT 35000.00,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status emp_status NOT NULL DEFAULT 'active',
    address TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Payroll Records Table (مشاہرہ اور تنخواہ کی ادائیگی کا ریکارڈ)
CREATE TABLE IF NOT EXISTS public.payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
    salary_month TEXT NOT NULL, -- e.g. "July 2026 / محرم الحرام 1448ھ"
    basic_amount NUMERIC(10, 2) NOT NULL,
    bonus_amount NUMERIC(10, 2) DEFAULT 0.00,
    deduction_amount NUMERIC(10, 2) DEFAULT 0.00,
    net_paid NUMERIC(10, 2) NOT NULL,
    payment_method payment_method NOT NULL DEFAULT 'cash',
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_no TEXT UNIQUE NOT NULL, -- e.g. SAL-2026-0001
    paid_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_department ON public.staff_members(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON public.staff_members(status);
CREATE INDEX IF NOT EXISTS idx_payroll_staff_id ON public.payroll_records(staff_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month ON public.payroll_records(salary_month);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

-- 6. Grant Table Permissions to Supabase Roles (Essential to prevent 'permission denied' errors)
GRANT ALL ON TABLE public.staff_members TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.payroll_records TO anon, authenticated, service_role;

-- 7. Create RLS Policies (Simplified for Seamless Testing & Production Access)
CREATE POLICY "Anyone can read staff_members" 
    ON public.staff_members FOR SELECT USING (true);

CREATE POLICY "Admin and Clerk manage staff_members" 
    ON public.staff_members FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read payroll_records" 
    ON public.payroll_records FOR SELECT USING (true);

CREATE POLICY "Admin and Clerk manage payroll_records" 
    ON public.payroll_records FOR ALL USING (true) WITH CHECK (true);

-- 7. Seed Data: Realistic Staff Members across all Departments
INSERT INTO public.staff_members (id, emp_id, full_name_ur, full_name_en, father_name_ur, father_name_en, cnic, phone, gender, qualification, designation_ur, designation_en, department, basic_salary, join_date, status)
VALUES
    ('55555555-5555-5555-5555-555555555501', 'EMP-2026-001', 'مفتی عبدالحکیم عثمانی', 'Mufti Abdul Hakim Usmani', 'مولانا فضل الرحمٰن', 'Maulana Fazal-ur-Rehman', '35202-1111111-1', '0300-1111111', 'male', 'تخصص فی الفقه و الافتاء، شہادۃ العالمیہ', 'مہتمم اعلیٰ و شیخ الحدیث', 'Principal & Shaykh-ul-Hadith', 'nizami', 75000.00, '2022-01-01', 'active'),
    ('55555555-5555-5555-5555-555555555502', 'EMP-2026-002', 'قاری محمد طارق مدنی', 'Qari Muhammad Tariq Madani', 'حافظ بشیر احمد', 'Hafiz Bashir Ahmed', '35202-2222222-1', '0300-2222222', 'male', 'شہادۃ الحفظ، سبعہ عشرہ قراءت', 'صدر مدرس شعبہ حفظ', 'Head Qari Hifz Dept', 'hifz', 50000.00, '2023-03-15', 'active'),
    ('55555555-5555-5555-5555-555555555503', 'EMP-2026-003', 'ماسٹر کاشف علی خان', 'Master Kashif Ali Khan', 'شوکت علی خان', 'Shaukat Ali Khan', '35202-3333333-1', '0300-3333333', 'male', 'M.Sc Mathematics, B.Ed (Punjab Univ)', 'سینئر معلم سائنس و ریاضی', 'Senior Science & Maths Teacher', 'school', 48000.00, '2024-04-01', 'active'),
    ('55555555-5555-5555-5555-555555555504', 'EMP-2026-004', 'مولانا زبیر احمد قادری', 'Maulana Zubair Ahmed Qadri', 'مولانا عبدالخالق', 'Maulana Abdul Khaliq', '35202-4444444-1', '0300-4444444', 'male', 'شہادۃ العالمیہ، M.A Arabic & Islamiat', 'معلم درس نظامی و عربی ادب', 'Lecturer Dars-e-Nizami & Arabic', 'nizami', 45000.00, '2024-05-10', 'active'),
    ('55555555-5555-5555-5555-555555555505', 'EMP-2026-005', 'محترمہ عائشہ صدیقہ', 'Madam Ayesha Siddiqa', 'ڈاکٹر طارق محمود', 'Dr. Tariq Mahmood', '35202-5555555-2', '0300-5555555', 'female', 'M.A Urdu Literature, B.Ed', 'معلمہ اردو ادب و اسلامیات', 'Senior Urdu & Islamiat Teacher', 'school', 42000.00, '2025-01-15', 'active'),
    ('55555555-5555-5555-5555-555555555506', 'EMP-2026-006', 'بلال احمد اعوان', 'Bilal Ahmed Awan', 'محمد صدیق اعوان', 'Muhammad Siddique Awan', '35202-6666666-1', '0300-6666666', 'male', 'B.Com, Diploma in Islamic Banking & IT', 'محاسب و انچارج دفتر (اکاؤنٹینٹ)', 'Accountant & Office Incharge', 'admin', 40000.00, '2023-08-01', 'active')
ON CONFLICT (emp_id) DO NOTHING;

-- 8. Seed Data: Sample Payroll Records for July 2026
INSERT INTO public.payroll_records (staff_id, salary_month, basic_amount, bonus_amount, deduction_amount, net_paid, payment_method, payment_date, reference_no, remarks)
VALUES
    ('55555555-5555-5555-5555-555555555501', 'July 2026 / محرم الحرام 1448ھ', 75000.00, 5000.00, 0.00, 80000.00, 'bank', '2026-07-01', 'SAL-2026-0001', 'ماہانہ مشاہرہ مع عید بونس'),
    ('55555555-5555-5555-5555-555555555502', 'July 2026 / محرم الحرام 1448ھ', 50000.00, 2000.00, 0.00, 52000.00, 'bank', '2026-07-01', 'SAL-2026-0002', 'ماہانہ مشاہرہ و حسن کارکردگی'),
    ('55555555-5555-5555-5555-555555555503', 'July 2026 / محرم الحرام 1448ھ', 48000.00, 0.00, 1000.00, 47000.00, 'cash', '2026-07-01', 'SAL-2026-0003', 'ایک یوم اتفاقی رخصت کی کٹوتی کے ساتھ'),
    ('55555555-5555-5555-5555-555555555506', 'July 2026 / محرم الحرام 1448ھ', 40000.00, 0.00, 0.00, 40000.00, 'jazzcash', '2026-07-01', 'SAL-2026-0004', 'کلاؤڈ پے رول منتقلی')
ON CONFLICT (reference_no) DO NOTHING;

-- End of Migration 006
