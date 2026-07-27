-- ====================================================================
-- AL-HIKMAH MADRASA & SCHOOL MANAGEMENT SYSTEM
-- Migration 007: RBAC Extension (Accountant & Warden Roles), Promotional Role Switching Logs & Dynamic Exam Config
-- ====================================================================

-- 1. Safely add new roles ('accountant' / خازن and 'warden' / ناظم دارالاقامہ) to user_role ENUM
DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'accountant';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'warden';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Update Helper Functions for Extended RBAC (Finance & Hostel Access)
CREATE OR REPLACE FUNCTION public.is_admin_or_clerk()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'clerk', 'accountant')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'clerk', 'accountant', 'warden', 'teacher')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ROLE SWITCHING / PROMOTIONS HISTORY TABLE (پروموشنل رول سویچنگ ریکارڈ)
CREATE TABLE IF NOT EXISTS public.role_switch_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    previous_role user_role NOT NULL,
    new_role user_role NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Principal / Admin ID
    reason TEXT, -- e.g. "شاندار انتظامی اور تعلیمی کارکردگی کی بنا پر ترقی دی گئی"
    switched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DYNAMIC EXAM & CURRICULUM CONFIGURATION TABLE (متحرک نصاب اور امتحانی اصطلاحات)
CREATE TABLE IF NOT EXISTS public.exam_system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id TEXT DEFAULT 'default',
    term_model TEXT NOT NULL DEFAULT 'three_six_annual', -- 'three_six_annual' | 'monthly_four_annual' | 'semester'
    hifz_criteria_json JSONB DEFAULT '[
        {"id": "h1", "urdu": "تلاوت و یادداشت کا جائزہ", "en": "Quran Memory & Recitation", "marks": 100, "enabled": true},
        {"id": "h2", "urdu": "تجوید و مخارج الحروف", "en": "Tajweed & Phonetics", "marks": 50, "enabled": true},
        {"id": "h3", "urdu": "منزل، سبق اور سبقی روانی", "en": "Manzil & Sabaqi Flow", "marks": 50, "enabled": true},
        {"id": "h4", "urdu": "صفائی ستھرائی، اخلاق اور ظاہری ہیئت", "en": "Hygiene & Manners", "marks": 25, "enabled": true}
    ]'::jsonb,
    curriculum_map_json JSONB, -- Stores class-wise dynamic papers (c1 to c21)
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_institution_exam_config UNIQUE (institution_id)
);

-- 5. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_role_switch_logs_user_id ON public.role_switch_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_role_switch_logs_switched_at ON public.role_switch_logs(switched_at);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.role_switch_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_system_configs ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR NEW TABLES
CREATE POLICY "Admins can manage role switch logs"
    ON public.role_switch_logs FOR ALL
    USING (public.is_admin_or_clerk());

CREATE POLICY "All authenticated users can read role switch logs for themselves"
    ON public.role_switch_logs FOR SELECT
    USING (auth.uid() = user_id OR public.is_staff());

CREATE POLICY "All authenticated users can read exam configs"
    ON public.exam_system_configs FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage exam configs"
    ON public.exam_system_configs FOR ALL
    USING (public.is_admin_or_clerk());

-- 8. SEED INITIAL DEMO ROLE SWITCH LOG
INSERT INTO public.role_switch_logs (user_id, previous_role, new_role, reason)
SELECT id, 'teacher'::user_role, 'clerk'::user_role, 'انتظامی امور میں حسنِ کارکردگی پر دفتر اہتمام میں ترقی دی گئی'
FROM public.profiles WHERE email = 'clerk@alhikmah.edu'
LIMIT 1
ON CONFLICT DO NOTHING;

-- End of Migration 007
