"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Users, Save } from 'lucide-react';

export function TeacherDepartments() {
  const { locale } = useLanguage();
  const supabase = createClient();
  
  const [teachers, setTeachers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [teacherDepts, setTeacherDepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Local state for checkboxes
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: tch } = await (supabase as any).from('profiles').select('*').in('role', ['teacher', 'admin']).order('full_name', { ascending: true });
      const { data: dept } = await (supabase as any).from('departments').select('*').order('created_at', { ascending: true });
      const { data: td } = await (supabase as any).from('teacher_departments').select('*');
      
      if (tch) setTeachers(tch);
      if (dept) setDepartments(dept);
      if (td) {
        setTeacherDepts(td);
        
        // Build initial selections
        const initialMap: Record<string, string[]> = {};
        tch?.forEach((t: any) => {
          initialMap[t.id] = td.filter((x: any) => x.teacher_id === t.id).map((x: any) => x.department_id);
        });
        setSelections(initialMap);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDept = (teacherId: string, deptId: string) => {
    setSelections(prev => {
      const current = prev[teacherId] || [];
      if (current.includes(deptId)) {
        return { ...prev, [teacherId]: current.filter(id => id !== deptId) };
      } else {
        return { ...prev, [teacherId]: [...current, deptId] };
      }
    });
  };

  const handleSave = async (teacherId: string) => {
    setSavingId(teacherId);
    try {
      // 1. Delete existing
      await (supabase as any).from('teacher_departments').delete().eq('teacher_id', teacherId);
      
      // 2. Insert new
      const newDepts = selections[teacherId] || [];
      if (newDepts.length > 0) {
        const insertData = newDepts.map(dId => ({ teacher_id: teacherId, department_id: dId }));
        const { error } = await (supabase as any).from('teacher_departments').insert(insertData);
        if (error) throw error;
      }
      
      toast.success(locale === 'ur' ? 'محفوظ ہو گیا' : 'Saved successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div className="text-center p-8">⏳ Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
        <p className="text-sm text-muted-foreground">
          {locale === 'ur' 
            ? 'نوٹ: صرف وہ اساتذہ جنہیں یہاں کسی شعبے سے جوڑا جائے گا، وہ نیا مضمون تفویض کرتے وقت یا ٹائم ٹیبل بناتے وقت ڈراپ ڈاؤن میں نظر آئیں گے۔' 
            : 'Note: Only teachers linked to a department here will appear in the dropdown when assigning subjects or timetables.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map(teacher => (
          <Card key={teacher.id} className="border-border/60 shadow-sm hover:border-primary/30 transition-colors">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase shrink-0">
                  {teacher.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{teacher.full_name}</h3>
                  <p className="text-[10px] text-muted-foreground">{teacher.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-3 text-xs" 
                onClick={() => handleSave(teacher.id)}
                disabled={savingId === teacher.id}
              >
                {savingId === teacher.id ? '...' : (locale === 'ur' ? 'محفوظ کریں' : 'Save')}
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {departments.map(dept => (
                  <div key={dept.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id={`t_${teacher.id}_d_${dept.id}`} 
                      checked={(selections[teacher.id] || []).includes(dept.id)}
                      onCheckedChange={() => toggleDept(teacher.id, dept.id)}
                    />
                    <Label htmlFor={`t_${teacher.id}_d_${dept.id}`} className="text-xs cursor-pointer">
                      {locale === 'ur' ? dept.name_ur : dept.name_en}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {teachers.length === 0 && (
          <div className="col-span-2 text-center p-8 text-muted-foreground border border-dashed rounded-xl">
            {locale === 'ur' ? 'کوئی استاد نہیں ملا۔ پہلے Staff Roles سے اساتذہ شامل کریں۔' : 'No teachers found. Add them from Staff Roles first.'}
          </div>
        )}
      </div>
    </div>
  );
}
