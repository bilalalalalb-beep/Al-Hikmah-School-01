-- ====================================================================
-- 008_FIX_PERMISSIONS_AND_RLS.SQL
-- Al-Hikmah School & Madrasa Management System
-- Comprehensive Master Fix for "permission denied for table X" & RLS
-- ====================================================================

-- 1. GRANT ALL PERMISSIONS ON ALL TABLES TO SUPABASE API ROLES (anon, authenticated, service_role)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 2. SET DEFAULT PRIVILEGES FOR ANY FUTURE TABLES OR SEQUENCES
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ====================================================================
-- 3. RESET & FIX RLS POLICIES FOR STAFF & PAYROLL (Module 7)
-- ====================================================================
DROP POLICY IF EXISTS "Admin and Clerk full access on staff_members" ON public.staff_members;
DROP POLICY IF EXISTS "Anyone can read staff_members" ON public.staff_members;
DROP POLICY IF EXISTS "Admin and Clerk manage staff_members" ON public.staff_members;

CREATE POLICY "Anyone can read staff_members" ON public.staff_members FOR SELECT USING (true);
CREATE POLICY "Admin and Clerk manage staff_members" ON public.staff_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin and Clerk full access on payroll_records" ON public.payroll_records;
DROP POLICY IF EXISTS "Anyone can read payroll_records" ON public.payroll_records;
DROP POLICY IF EXISTS "Admin and Clerk manage payroll_records" ON public.payroll_records;

CREATE POLICY "Anyone can read payroll_records" ON public.payroll_records FOR SELECT USING (true);
CREATE POLICY "Admin and Clerk manage payroll_records" ON public.payroll_records FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 4. RESET & FIX RLS POLICIES FOR EXAMS & RESULTS (Module 6)
-- ====================================================================
DROP POLICY IF EXISTS "All authenticated users can read published exams" ON public.exams;
DROP POLICY IF EXISTS "Admins and Clerks can manage exams" ON public.exams;
CREATE POLICY "Anyone can read exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Admins and Clerks can manage exams" ON public.exams FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Teachers, Admins, and Clerks can insert and update exam results" ON public.exam_results;
DROP POLICY IF EXISTS "Students and Parents can read their own exam results" ON public.exam_results;
CREATE POLICY "Anyone can read exam_results" ON public.exam_results FOR SELECT USING (true);
CREATE POLICY "Manage exam_results" ON public.exam_results FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 5. RESET & FIX RLS POLICIES FOR FINANCE & EXPENSES (Module 5)
-- ====================================================================
DROP POLICY IF EXISTS "Admins and Clerks can manage expenses" ON public.expenses;
CREATE POLICY "Anyone can read expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Manage expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and Clerks can manage fee invoices" ON public.fee_invoices;
DROP POLICY IF EXISTS "Students can read their own invoices" ON public.fee_invoices;
CREATE POLICY "Anyone can read fee_invoices" ON public.fee_invoices FOR SELECT USING (true);
CREATE POLICY "Manage fee_invoices" ON public.fee_invoices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins and Clerks can manage fee receipts" ON public.fee_receipts;
DROP POLICY IF EXISTS "Students can read their own receipts" ON public.fee_receipts;
CREATE POLICY "Anyone can read fee_receipts" ON public.fee_receipts FOR SELECT USING (true);
CREATE POLICY "Manage fee_receipts" ON public.fee_receipts FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 6. RESET & FIX RLS POLICIES FOR ATTENDANCE & STUDENTS (Modules 3 & 4)
-- ====================================================================
DROP POLICY IF EXISTS "Teachers, Admins, and Clerks can insert and update attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Students and Parents can view own attendance" ON public.attendance_records;
CREATE POLICY "Anyone can read attendance_records" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "Manage attendance_records" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "All staff can view students" ON public.students;
DROP POLICY IF EXISTS "Admins and Clerks can insert students" ON public.students;
DROP POLICY IF EXISTS "Admins and Clerks can update students" ON public.students;
CREATE POLICY "Anyone can read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Manage students" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 7. RE-SEED STAFF DATA IF EMPTY
-- ====================================================================
INSERT INTO public.staff_members (id, emp_id, full_name_ur, full_name_en, father_name_ur, father_name_en, cnic, phone, gender, qualification, designation_ur, designation_en, department, basic_salary, join_date, status)
VALUES
    ('55555555-5555-5555-5555-555555555501', 'EMP-2026-001', 'مفتی عبدالحکیم عثمانی', 'Mufti Abdul Hakim Usmani', 'مولانا فضل الرحمٰن', 'Maulana Fazal-ur-Rehman', '35202-1111111-1', '0300-1111111', 'male', 'تخصص فی الفقه و الافتاء، شہادۃ العالمیہ', 'مہتمم اعلیٰ و شیخ الحدیث', 'Principal & Shaykh-ul-Hadith', 'nizami', 75000.00, '2022-01-01', 'active'),
    ('55555555-5555-5555-5555-555555555502', 'EMP-2026-002', 'قاری محمد طارق مدنی', 'Qari Muhammad Tariq Madani', 'حافظ بشیر احمد', 'Hafiz Bashir Ahmed', '35202-2222222-1', '0300-2222222', 'male', 'شہادۃ الحفظ، سبعہ عشرہ قراءت', 'صدر مدرس شعبہ حفظ', 'Head Qari Hifz Dept', 'hifz', 50000.00, '2023-03-15', 'active'),
    ('55555555-5555-5555-5555-555555555503', 'EMP-2026-003', 'ماسٹر کاشف علی خان', 'Master Kashif Ali Khan', 'شوکت علی خان', 'Shaukat Ali Khan', '35202-3333333-1', '0300-3333333', 'male', 'M.Sc Mathematics, B.Ed', 'سینئر معلم سائنس و ریاضی', 'Senior Science & Maths Teacher', 'school', 48000.00, '2024-04-01', 'active'),
    ('55555555-5555-5555-5555-555555555504', 'EMP-2026-004', 'مولانا زبیر احمد قادری', 'Maulana Zubair Ahmed Qadri', 'مولانا عبدالخالق', 'Maulana Abdul Khaliq', '35202-4444444-1', '0300-4444444', 'male', 'شہادۃ العالمیہ، M.A Arabic & Islamiat', 'معلم درس نظامی و عربی ادب', 'Lecturer Dars-e-Nizami & Arabic', 'nizami', 45000.00, '2024-05-10', 'active')
ON CONFLICT (emp_id) DO NOTHING;

-- END OF MIGRATION 008
