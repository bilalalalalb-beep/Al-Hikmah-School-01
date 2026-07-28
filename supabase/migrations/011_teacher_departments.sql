-- Migration 011: Teacher Departments Link

CREATE TABLE IF NOT EXISTS public.teacher_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, department_id)
);

ALTER TABLE public.teacher_departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read teacher_departments"
    ON public.teacher_departments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage teacher_departments"
    ON public.teacher_departments FOR ALL USING (public.is_admin_or_clerk());
