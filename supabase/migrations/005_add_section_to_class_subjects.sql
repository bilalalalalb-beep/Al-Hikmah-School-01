-- Migration 005: Add section_id to class_subjects
ALTER TABLE public.class_subjects
ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE;

-- Update the unique constraint on class_subjects so a subject can be assigned multiple times per class IF in different sections
ALTER TABLE public.class_subjects DROP CONSTRAINT IF EXISTS class_subjects_class_id_subject_id_key;
ALTER TABLE public.class_subjects ADD CONSTRAINT class_subjects_class_subject_section_unique UNIQUE NULLS NOT DISTINCT (class_id, subject_id, section_id);
