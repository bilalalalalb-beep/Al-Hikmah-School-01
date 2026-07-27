-- ====================================================================
-- AL-HIKMAH MADRASA & SCHOOL MANAGEMENT SYSTEM - INITIAL SCHEMA
-- Single-Tenant Architecture (Optimized for Supabase PostgreSQL Free Tier)
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM Types for Role-Based Access Control (RBAC) and Statuses
CREATE TYPE user_role AS ENUM ('admin', 'clerk', 'teacher', 'student', 'parent');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE student_status AS ENUM ('active', 'graduated', 'transferred', 'suspended', 'inactive');

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACADEMIC YEARS TABLE
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g. "2026-2027" or "1448-1449 AH"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDENTS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id TEXT NOT NULL UNIQUE, -- e.g. "REG-2026-0001"
    first_name TEXT NOT NULL,
    last_name TEXT,
    gender gender_type NOT NULL DEFAULT 'male',
    date_of_birth DATE,
    photo_url TEXT, -- Stored in Cloudinary
    current_class_id UUID,
    admission_date DATE DEFAULT CURRENT_DATE,
    status student_status DEFAULT 'active',
    father_name TEXT NOT NULL,
    father_phone TEXT NOT NULL,
    father_cnic_or_id TEXT,
    mother_name TEXT,
    guardian_email TEXT,
    emergency_contact TEXT,
    residential_address TEXT,
    previous_school TEXT,
    previous_grade TEXT,
    medical_history TEXT,
    general_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENT PROMOTIONS HISTORY
CREATE TABLE IF NOT EXISTS public.student_promotions_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    from_class_id UUID,
    to_class_id UUID NOT NULL,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE SET NULL,
    promoted_at TIMESTAMPTZ DEFAULT NOW(),
    promoted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HELPER FUNCTION: Check if current user is Admin or Clerk
CREATE OR REPLACE FUNCTION public.is_admin_or_clerk()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'clerk')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_promotions_history ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES FOR PROFILES
CREATE POLICY "Users can view their own profile and Admins can view all"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin_or_clerk());

CREATE POLICY "Admins can update profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_admin_or_clerk());

-- 10. RLS POLICIES FOR STUDENTS
CREATE POLICY "All staff can view students"
    ON public.students FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and Clerks can insert students"
    ON public.students FOR INSERT
    WITH CHECK (public.is_admin_or_clerk());

CREATE POLICY "Admins and Clerks can update students"
    ON public.students FOR UPDATE
    USING (public.is_admin_or_clerk());

-- 11. INITIAL SEED DATA FOR ACADEMIC YEARS
INSERT INTO public.academic_years (name, start_date, end_date, is_current)
VALUES 
('2026-2027 (شوال 1447 تا شعبان 1448)', '2026-04-01', '2027-03-31', true),
('2027-2028 (شوال 1448 تا شعبان 1449)', '2027-04-01', '2028-03-31', false)
ON CONFLICT DO NOTHING;
