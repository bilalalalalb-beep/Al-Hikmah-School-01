-- Migration 004: Add section_id to students table
-- This allows assigning a specific section to a student in the admission and edit forms.

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL;

-- Optional: Create an index for faster lookups when filtering students by section
CREATE INDEX IF NOT EXISTS idx_students_section_id ON public.students(section_id);
