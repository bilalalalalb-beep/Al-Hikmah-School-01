-- ====================================================================
-- MIGRATION: ADD FINANCIAL AND MEDICAL COLUMNS TO STUDENTS TABLE
-- DESCRIPTION: Adds is_orphan, is_zakat_eligible, blood_group, b_form_number
-- ====================================================================

-- Add columns to the public.students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS is_orphan BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_zakat_eligible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS blood_group TEXT,
ADD COLUMN IF NOT EXISTS b_form_number TEXT;

-- (Optional) If you have existing data and want to make sure it's cleanly updated:
-- UPDATE public.students SET is_orphan = false WHERE is_orphan IS NULL;
-- UPDATE public.students SET is_zakat_eligible = false WHERE is_zakat_eligible IS NULL;
