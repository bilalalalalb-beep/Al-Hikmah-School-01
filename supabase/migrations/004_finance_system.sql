-- ====================================================================
-- AL-HIKMAH MADRASA & SCHOOL MANAGEMENT SYSTEM - FINANCE MODULE
-- Migration 004: Fee Collection, Invoices, Receipts & Expense Tracker (مالیاتی نظام)
-- ====================================================================

-- 1. ENUM Types for Financial Operations
CREATE TYPE fee_type AS ENUM ('tuition', 'admission', 'exam', 'boarding', 'transport', 'other');
CREATE TYPE payment_method AS ENUM ('cash', 'bank', 'jazzcash', 'easypaisa', 'cheque');
CREATE TYPE expense_category AS ENUM ('salary', 'utility', 'food_mess', 'maintenance', 'stationary', 'other');
CREATE TYPE invoice_status AS ENUM ('paid', 'unpaid', 'partial', 'waived');

-- 2. FEE STRUCTURES TABLE (درجات کے لحاظ سے فیس کا قاعدہ)
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    title_ur TEXT NOT NULL, -- e.g. "ماہانہ ٹیوشن فیس (عصری علوم)"
    title_en TEXT NOT NULL, -- e.g. "Monthly Tuition Fee"
    amount INT NOT NULL DEFAULT 0, -- PKR Amount
    fee_type fee_type NOT NULL DEFAULT 'tuition',
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FEE INVOICES / VOUCHERS TABLE (ماہانہ فیس بل اور بقایاجات کا ریکارڈ)
CREATE TABLE IF NOT EXISTS public.fee_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no TEXT NOT NULL UNIQUE, -- e.g. "INV-2026-0701"
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    billing_month TEXT NOT NULL, -- e.g. "2026-07"
    total_amount INT NOT NULL DEFAULT 0, -- Total fee due
    paid_amount INT NOT NULL DEFAULT 0,  -- Total fee collected
    discount_amount INT NOT NULL DEFAULT 0, -- Scholarship / Concession
    status invoice_status NOT NULL DEFAULT 'unpaid',
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '10 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_monthly_invoice UNIQUE (student_id, billing_month)
);

-- 4. FEE RECEIPTS TABLE (ادا شدہ فیس کی باضابطہ رسیدیں)
CREATE TABLE IF NOT EXISTS public.fee_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_no TEXT NOT NULL UNIQUE, -- e.g. "REC-2026-0001"
    invoice_id UUID REFERENCES public.fee_invoices(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    amount_paid INT NOT NULL, -- Amount collected in PKR
    discount_given INT DEFAULT 0,
    payment_method payment_method NOT NULL DEFAULT 'cash',
    collector_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Clerk / Accountant ID
    remarks TEXT, -- e.g. "نصف فیس ادا، بقیہ اگلے ماہ"
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXPENSES TRACKER TABLE (جامعہ کے روزمرہ اور ماہانہ اخراجات کا لیجر)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ur TEXT NOT NULL, -- e.g. "بجلی کا بل (ماہ جولائی)"
    title_en TEXT NOT NULL, -- e.g. "Electricity Bill (July)"
    amount INT NOT NULL,    -- PKR Amount
    category expense_category NOT NULL DEFAULT 'utility',
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks TEXT,           -- e.g. "واپڈا میٹر نمبر 104"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR FINANCIAL REPORTING
CREATE INDEX IF NOT EXISTS idx_invoices_student_id ON public.fee_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_month ON public.fee_invoices(billing_month);
CREATE INDEX IF NOT EXISTS idx_receipts_student_id ON public.fee_receipts(student_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date_category ON public.expenses(expense_date, category);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES (Only Admin and Clerk can manage finance tables, authenticated can read structures)
CREATE POLICY "All authenticated users can read fee structures"
    ON public.fee_structures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and Clerks can manage fee structures"
    ON public.fee_structures FOR ALL USING (public.is_admin_or_clerk());

CREATE POLICY "Admins and Clerks can manage fee invoices"
    ON public.fee_invoices FOR ALL USING (public.is_admin_or_clerk());
CREATE POLICY "Students can read their own invoices"
    ON public.fee_invoices FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Admins and Clerks can manage fee receipts"
    ON public.fee_receipts FOR ALL USING (public.is_admin_or_clerk());
CREATE POLICY "Students can read their own receipts"
    ON public.fee_receipts FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Admins and Clerks can manage expenses"
    ON public.expenses FOR ALL USING (public.is_admin_or_clerk());

-- ====================================================================
-- 9. RICH SEED DATA: FEE STRUCTURES, INVOICES, RECEIPTS & EXPENSES (PKR)
-- ====================================================================

-- Seed Fee Structures
INSERT INTO public.fee_structures (class_id, title_ur, title_en, amount, fee_type) VALUES
('11111111-1111-1111-1111-111111111101', 'ماہانہ ٹیوشن فیس (درجہ اول)', 'Monthly Tuition Fee (Grade 1)', 3000, 'tuition'),
('11111111-1111-1111-1111-111111111102', 'ماہانہ ٹیوشن فیس (درجہ پنجم)', 'Monthly Tuition Fee (Grade 5)', 3500, 'tuition'),
('11111111-1111-1111-1111-111111111103', 'ماہانہ ٹیوشن فیس (میٹرک سائنس)', 'Monthly Tuition Fee (Grade 10)', 4500, 'tuition'),
('11111111-1111-1111-1111-111111111104', 'دارالحفظ طعام و قیام فیس (وظیفہ مستحقین مفت)', 'Hifz Boarding & Mess Fee (Free for deserving)', 0, 'boarding'),
('11111111-1111-1111-1111-111111111105', 'درس نظامی سالانہ رجسٹریشن و کتب فیس', 'Dars-e-Nizami Annual Reg & Books', 2000, 'admission'),
('11111111-1111-1111-1111-111111111106', 'دورہ حدیث خصوصی وظیفہ و کتب فیس', 'Dora-e-Hadith Final Year Fee', 1500, 'tuition')
ON CONFLICT DO NOTHING;

-- Seed Sample Monthly Invoices (Billing Month: 2026-07)
INSERT INTO public.fee_invoices (id, invoice_no, student_id, class_id, billing_month, total_amount, paid_amount, discount_amount, status, due_date) VALUES
('55555555-5555-5555-5555-555555555501', 'INV-2026-0701', '44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '2026-07', 3000, 3000, 0, 'paid', '2026-07-10'),
('55555555-5555-5555-5555-555555555502', 'INV-2026-0702', '44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', '2026-07', 3000, 1500, 0, 'partial', '2026-07-10'),
('55555555-5555-5555-5555-555555555503', 'INV-2026-0703', '44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101', '2026-07', 3000, 0, 0, 'unpaid', '2026-07-10'),
('55555555-5555-5555-5555-555555555504', 'INV-2026-0704', '44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111101', '2026-07', 3000, 0, 3000, 'waived', '2026-07-10'),
('55555555-5555-5555-5555-555555555505', 'INV-2026-0705', '44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111104', '2026-07', 0, 0, 0, 'waived', '2026-07-10'),
('55555555-5555-5555-5555-555555555506', 'INV-2026-0706', '44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111104', '2026-07', 2000, 0, 0, 'unpaid', '2026-07-10'),
('55555555-5555-5555-5555-555555555507', 'INV-2026-0707', '44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111105', '2026-07', 2000, 2000, 0, 'paid', '2026-07-10')
ON CONFLICT (student_id, billing_month) DO NOTHING;

-- Seed Sample Receipts
INSERT INTO public.fee_receipts (receipt_no, invoice_id, student_id, amount_paid, discount_given, payment_method, remarks, payment_date) VALUES
('REC-2026-0001', '55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', 3000, 0, 'cash', 'مکمل فیس وصول (ماہ جولائی)', '2026-07-02'),
('REC-2026-0002', '55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444402', 1500, 0, 'jazzcash', 'نصف فیس وصول، بقیہ 1500 بقایا', '2026-07-05'),
('REC-2026-0003', '55555555-5555-5555-5555-555555555507', '44444444-4444-4444-4444-444444444407', 2000, 0, 'easypaisa', 'آن لائن ادائیگی موصول', '2026-07-03')
ON CONFLICT (receipt_no) DO NOTHING;

-- Seed Sample Expenses (PKR)
INSERT INTO public.expenses (title_ur, title_en, amount, category, expense_date, remarks) VALUES
('اساتذہ کرام کی تنخواہ (ماہ جولائی)', 'Staff Salaries (July)', 185000, 'salary', '2026-07-01', 'کل 8 اساتذہ و ملازمین کی ماہانہ تنخواہ'),
('بجلی کا بل (مرکزی کیمپس)', 'Electricity Utility Bill', 42000, 'utility', '2026-07-04', 'واپڈا میٹر نمبر 1044 کا بل'),
('دارالاقامہ کے لیے راشن اور غلہ', 'Boarding Mess Ration & Grain', 65000, 'food_mess', '2026-07-05', 'چاول، آٹا، گھی اور دالیں (ہول سیل مارکیٹ)'),
('کلاس رومز کی سفیدی و پنکھوں کی مرمت', 'Classroom Painting & Repair', 15000, 'maintenance', '2026-07-06', 'الیکٹریشن اور مستری کی مزدوری')
ON CONFLICT DO NOTHING;
