-- Migration 006: Link Classes to Existing Departments

-- 1. Ensure department_id exists in classes
ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL;

-- 2. Link existing classes to existing departments based on level_type matching department code
UPDATE public.classes c
SET department_id = d.id
FROM public.departments d
WHERE c.level_type = d.code;

-- 3. (Optional) We can drop the level_type check constraint since departments is now dynamic
ALTER TABLE public.classes DROP CONSTRAINT IF EXISTS classes_level_type_check;
ALTER TABLE public.classes ALTER COLUMN level_type DROP NOT NULL;
