"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  BookOpen, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Layers,
  Award,
  UserCheck,
  RefreshCw,
  Library
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { TeacherDepartments } from './teacher-departments';

export function AcademicManager() {
  const { locale, dir } = useLanguage();
  
  // Live Data States
  const [departments, setDepartments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teacherDepts, setTeacherDepts] = useState<any[]>([]);
  
  const [loadingDb, setLoadingDb] = useState(false);
  const supabase = createClient();

  const fetchFromDb = async () => {
    try {
      setLoadingDb(true);

      // Fetch Departments
      const { data: deptData } = await (supabase as any).from('departments').select('*').order('created_at', { ascending: true });
      if (deptData) setDepartments(deptData);
      
      // Fetch Classes
      const { data: clsData } = await (supabase as any).from('classes').select('*, departments(name_ur, name_en)').order('created_at', { ascending: true });
      if (clsData) setClasses(clsData);

      // Fetch Sections
      const { data: secData } = await (supabase as any).from('sections').select('*, classes(name_ur, name_en)').order('created_at', { ascending: true });
      if (secData) setSections(secData);

      // Fetch Subjects
      const { data: subData } = await (supabase as any).from('subjects').select('*').order('created_at', { ascending: true });
      if (subData) setSubjects(subData);

      // Fetch Assignments
      const { data: assignData } = await (supabase as any)
        .from('class_subjects')
        .select(`
          *,
          classes (name_ur, name_en),
          subjects (name_ur, name_en),
          sections (name_ur, name_en),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false });
      if (assignData) setAssignments(assignData);

      // Fetch Teachers (Fixing full_name)
      const { data: teacherData } = await (supabase as any)
        .from('profiles')
        .select('*')
        .in('role', ['teacher', 'admin'])
        .order('full_name', { ascending: true });
      if (teacherData) setTeachers(teacherData);

      // Fetch Teacher Departments
      const { data: tdData } = await (supabase as any).from('teacher_departments').select('*');
      if (tdData) setTeacherDepts(tdData);

    } catch (err) {
      console.error("Error fetching academic data:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchFromDb();
  }, []);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilterDept, setClassFilterDept] = useState('all');
  const [sectionFilterClass, setSectionFilterClass] = useState('all');
  const [subjectFilterClass, setSubjectFilterClass] = useState('all');

  // Modal States - Add
  const [openDeptModal, setOpenDeptModal] = useState(false);
  const [openClassModal, setOpenClassModal] = useState(false);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  // Modal States - Edit
  const [editDeptId, setEditDeptId] = useState<string | null>(null);
  const [editClassId, setEditClassId] = useState<string | null>(null);
  const [editSectionId, setEditSectionId] = useState<string | null>(null);
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);

  // Form States
  const [newDept, setNewDept] = useState({ name_ur: '', name_en: '', description: '' });
  const [newClass, setNewClass] = useState({ name_ur: '', name_en: '', department_id: '', capacity: 40, description: '' });
  const [newSection, setNewSection] = useState({ class_id: '', name_ur: '', name_en: '', room_number: '', shift: 'morning', capacity: 30 });
  const [newSubject, setNewSubject] = useState({ name_ur: '', name_en: '', code: '', subject_type: 'compulsory', total_marks: 100, class_id: 'none' });
  const [newAssign, setNewAssign] = useState({ class_id: '', section_id: 'none', subject_id: '', teacher_id: '', credit_hours: 3 });

  // CRUD: Departments
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editDeptId) {
        const { error } = await (supabase as any).from('departments').update(newDept).eq('id', editDeptId);
        if (error) throw error;
        toast.success(locale === 'ur' ? 'شعبہ اپڈیٹ ہو گیا!' : 'Department updated!');
      } else {
        const generatedCode = newDept.name_en ? newDept.name_en.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/(^_|_$)/g, '') : `dept_${Date.now()}`;
        const insertData = { ...newDept, code: generatedCode };
        const { error } = await (supabase as any).from('departments').insert([insertData]);
        if (error) throw error;
        toast.success(locale === 'ur' ? 'نیا شعبہ محفوظ ہو گیا!' : 'Department added!');
      }
      await fetchFromDb();
      setOpenDeptModal(false);
      setEditDeptId(null);
      setNewDept({ name_ur: '', name_en: '', description: '' });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditDept = (dept: any) => {
    setNewDept({ name_ur: dept.name_ur || '', name_en: dept.name_en || '', description: dept.description || '' });
    setEditDeptId(dept.id);
    setOpenDeptModal(true);
  };

  const handleDeleteDept = async (id: string) => {
    try {
      await (supabase as any).from('departments').delete().eq('id', id);
      await fetchFromDb();
      toast.success(locale === 'ur' ? 'شعبہ حذف کر دیا گیا!' : 'Department deleted!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // CRUD: Classes
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.department_id) return toast.error(locale === 'ur' ? 'شعبہ منتخب کریں' : 'Select a department');
    try {
      if (editClassId) {
        const { error } = await (supabase as any).from('classes').update(newClass).eq('id', editClassId);
        if (error) throw error;
        toast.success(locale === 'ur' ? 'درجہ اپڈیٹ ہو گیا!' : 'Class updated!');
      } else {
        const { error } = await (supabase as any).from('classes').insert([newClass]);
        if (error) throw error;
        toast.success(locale === 'ur' ? 'درجہ محفوظ ہو گیا!' : 'Class added!');
      }
      await fetchFromDb();
      setOpenClassModal(false);
      setEditClassId(null);
      setNewClass({ name_ur: '', name_en: '', department_id: '', capacity: 40, description: '' });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditClass = (cls: any) => {
    setNewClass({ name_ur: cls.name_ur || '', name_en: cls.name_en || '', department_id: cls.department_id || '', capacity: cls.capacity || 40, description: cls.description || '' });
    setEditClassId(cls.id);
    setOpenClassModal(true);
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await (supabase as any).from('classes').delete().eq('id', id);
      await fetchFromDb();
      toast.success(locale === 'ur' ? 'درجہ حذف کر دیا گیا!' : 'Class deleted!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // CRUD: Sections
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.class_id) return toast.error(locale === 'ur' ? 'درجہ منتخب کریں' : "Select a class");
    try {
      if (editSectionId) {
        const { error } = await (supabase as any).from('sections').update(newSection).eq('id', editSectionId);
        if (error) throw error;
        toast.success(locale === 'ur' ? 'سیکشن اپڈیٹ ہو گیا!' : 'Section updated!');
      } else {
        const { error } = await (supabase as any).from('sections').insert([newSection]);
        if (error) throw error;
        toast.success(locale === 'ur' ? 'سیکشن محفوظ ہو گیا!' : 'Section added!');
      }
      await fetchFromDb();
      setOpenSectionModal(false);
      setEditSectionId(null);
      setNewSection({ class_id: '', name_ur: '', name_en: '', room_number: '', shift: 'morning', capacity: 30 });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditSection = (sec: any) => {
    setNewSection({ class_id: sec.class_id || '', name_ur: sec.name_ur || '', name_en: sec.name_en || '', room_number: sec.room_number || '', shift: sec.shift || 'morning', capacity: sec.capacity || 30 });
    setEditSectionId(sec.id);
    setOpenSectionModal(true);
  };

  const handleDeleteSection = async (id: string) => {
    try {
      await (supabase as any).from('sections').delete().eq('id', id);
      await fetchFromDb();
      toast.success(locale === 'ur' ? 'سیکشن حذف کر دیا گیا!' : 'Section deleted!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // CRUD: Subjects
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let subjectId = editSubjectId;
      
      const subjectRow = {
        name_ur: newSubject.name_ur,
        name_en: newSubject.name_en,
        code: newSubject.code,
        subject_type: newSubject.subject_type,
        total_marks: newSubject.total_marks
      };

      if (editSubjectId) {
        const { error } = await (supabase as any).from('subjects').update(subjectRow).eq('id', editSubjectId);
        if (error) throw error;
        toast.success(locale === 'ur' ? 'مضمون اپڈیٹ ہو گیا!' : 'Subject updated!');
      } else {
        const { data, error } = await (supabase as any).from('subjects').insert([subjectRow]).select().single();
        if (error) throw error;
        subjectId = data.id;
        toast.success(locale === 'ur' ? 'مضمون محفوظ ہو گیا!' : 'Subject added!');
      }

      // Auto Assign if class is selected during creation
      if (!editSubjectId && newSubject.class_id && newSubject.class_id !== 'none') {
         await (supabase as any).from('class_subjects').insert([{
           class_id: newSubject.class_id,
           subject_id: subjectId,
           credit_hours: 3
         }]);
         toast.success(locale === 'ur' ? 'مضمون درجہ کو بھی تفویض ہو گیا!' : 'Subject auto-assigned to class!');
      }

      await fetchFromDb();
      setOpenSubjectModal(false);
      setEditSubjectId(null);
      setNewSubject({ name_ur: '', name_en: '', code: '', subject_type: 'compulsory', total_marks: 100, class_id: 'none' });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditSubject = (sub: any) => {
    setNewSubject({ name_ur: sub.name_ur || '', name_en: sub.name_en || '', code: sub.code || '', subject_type: sub.subject_type || 'compulsory', total_marks: sub.total_marks || 100, class_id: 'none' });
    setEditSubjectId(sub.id);
    setOpenSubjectModal(true);
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await (supabase as any).from('subjects').delete().eq('id', id);
      await fetchFromDb();
      toast.success(locale === 'ur' ? 'مضمون حذف کر دیا گیا!' : 'Subject deleted!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // CRUD: Assignments
  const handleAssignSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssign.class_id || !newAssign.subject_id) return toast.error(locale === 'ur' ? 'درجہ اور مضمون منتخب کریں' : "Select class and subject");
    try {
      const row = {
        class_id: newAssign.class_id,
        subject_id: newAssign.subject_id,
        section_id: newAssign.section_id === 'none' ? null : newAssign.section_id,
        teacher_id: newAssign.teacher_id === 'none' || !newAssign.teacher_id ? null : newAssign.teacher_id,
        credit_hours: newAssign.credit_hours
      };
      const { error } = await (supabase as any).from('class_subjects').insert([row]);
      if (error) throw error;
      await fetchFromDb();
      setOpenAssignModal(false);
      setNewAssign({ class_id: '', section_id: 'none', subject_id: '', teacher_id: '', credit_hours: 3 });
      toast.success(locale === 'ur' ? 'تفویض مکمل ہو گئی!' : 'Assigned successfully!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      await (supabase as any).from('class_subjects').delete().eq('id', id);
      await fetchFromDb();
      toast.success(locale === 'ur' ? 'تفویض ختم کر دی گئی!' : 'Assignment removed!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 font-ur">
      <Card className="border-border/60 shadow-sm bg-card/90 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={locale === 'ur' ? 'تلاش کریں...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 pe-4 h-10 text-xs w-full font-ur"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button type="button" variant="ghost" size="icon" onClick={fetchFromDb} className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
              </Button>

              {/* Department Modal */}
              <Dialog open={openDeptModal} onOpenChange={(open) => { setOpenDeptModal(open); if(!open) setEditDeptId(null); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="font-bold gap-1.5 shadow-sm">
                    <Library className="w-4 h-4 shrink-0" />
                    <span>{locale === 'ur' ? '+ نیا شعبہ' : '+ New Dept'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary font-bold">
                      <Library className="w-5 h-5" />
                      <span>{editDeptId ? (locale === 'ur' ? 'شعبہ میں ترمیم' : 'Edit Department') : (locale === 'ur' ? 'نیا شعبہ شامل کریں' : 'Add New Department')}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveDept} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'شعبہ کا نام (اردو میں) *' : 'Name (Urdu) *'}</Label>
                      <Input value={newDept.name_ur} onChange={e => setNewDept({...newDept, name_ur: e.target.value})} className="h-10 text-xs" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'انگریزی نام *' : 'Name (English) *'}</Label>
                      <Input value={newDept.name_en} onChange={e => setNewDept({...newDept, name_en: e.target.value})} className="h-10 text-xs font-en text-start" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'تفصیل' : 'Description'}</Label>
                      <Input value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} className="h-10 text-xs" />
                    </div>
                    <DialogFooter>
                      <Button type="submit" variant="emerald" className="w-full font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'محفوظ کریں' : 'Save'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Class Modal */}
              <Dialog open={openClassModal} onOpenChange={(open) => { setOpenClassModal(open); if(!open) setEditClassId(null); }}>
                <DialogTrigger asChild>
                  <Button variant="emerald" size="sm" className="font-bold gap-1.5 shadow-md">
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>{locale === 'ur' ? '+ نیا درجہ' : '+ New Class'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary font-bold">
                      <Building2 className="w-5 h-5" />
                      <span>{editClassId ? (locale === 'ur' ? 'درجہ میں ترمیم' : 'Edit Class') : (locale === 'ur' ? 'نیا درجہ / کلاس شامل کریں' : 'Add New Class')}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveClass} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'متعلقہ شعبہ *' : 'Department *'}</Label>
                      <Select value={newClass.department_id} onValueChange={(val) => setNewClass({...newClass, department_id: val})}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="شعبہ منتخب کریں" /></SelectTrigger>
                        <SelectContent>
                          {departments.map(d => (
                            <SelectItem key={d.id} value={d.id}>{locale === 'ur' ? d.name_ur : d.name_en}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ کا نام (اردو میں) *' : 'Name (Urdu) *'}</Label>
                      <Input value={newClass.name_ur} onChange={e => setNewClass({...newClass, name_ur: e.target.value})} className="h-10 text-xs" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'انگریزی نام *' : 'Name (English) *'}</Label>
                      <Input value={newClass.name_en} onChange={e => setNewClass({...newClass, name_en: e.target.value})} className="h-10 text-xs font-en text-start" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'گنجائش' : 'Capacity'}</Label>
                      <Input type="number" value={newClass.capacity} onChange={e => setNewClass({...newClass, capacity: parseInt(e.target.value) || 40})} className="h-10 text-xs text-start font-en" />
                    </div>
                    <DialogFooter>
                      <Button type="submit" variant="emerald" className="w-full font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'محفوظ کریں' : 'Save'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Section Modal */}
              <Dialog open={openSectionModal} onOpenChange={(open) => { setOpenSectionModal(open); if(!open) setEditSectionId(null); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="font-bold gap-1.5 border-blue-500/50 text-blue-600 hover:bg-blue-500/10">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>{locale === 'ur' ? '+ نیا سیکشن' : '+ New Section'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-600 font-bold">
                      <Layers className="w-5 h-5" />
                      <span>{editSectionId ? (locale === 'ur' ? 'سیکشن میں ترمیم' : 'Edit Section') : (locale === 'ur' ? 'نیا سیکشن شامل کریں' : 'Add New Section')}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveSection} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ منتخب کریں *' : 'Select Class *'}</Label>
                      <Select value={newSection.class_id} onValueChange={(val) => setNewSection({...newSection, class_id: val})}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="درجہ منتخب کریں" /></SelectTrigger>
                        <SelectContent>
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.name_ur : c.name_en}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'اردو نام *' : 'Name (Urdu) *'}</Label>
                        <Input value={newSection.name_ur} onChange={e => setNewSection({...newSection, name_ur: e.target.value})} className="h-10 text-xs" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'انگریزی نام *' : 'Name (En) *'}</Label>
                        <Input value={newSection.name_en} onChange={e => setNewSection({...newSection, name_en: e.target.value})} className="h-10 text-xs text-start font-en" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'کمرہ' : 'Room'}</Label>
                        <Input value={newSection.room_number} onChange={e => setNewSection({...newSection, room_number: e.target.value})} className="h-10 text-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'شفٹ' : 'Shift'}</Label>
                        <Select value={newSection.shift} onValueChange={(val: any) => setNewSection({...newSection, shift: val})}>
                          <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">{locale === 'ur' ? 'صبح' : 'Morning'}</SelectItem>
                            <SelectItem value="afternoon">{locale === 'ur' ? 'دوپہر' : 'Afternoon'}</SelectItem>
                            <SelectItem value="evening">{locale === 'ur' ? 'شام' : 'Evening'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'محفوظ کریں' : 'Save'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Subject Modal */}
              <Dialog open={openSubjectModal} onOpenChange={(open) => { setOpenSubjectModal(open); if(!open) setEditSubjectId(null); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="font-bold gap-1.5 border-purple-500/50 text-purple-600 hover:bg-purple-500/10">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>{locale === 'ur' ? '+ نیا مضمون' : '+ New Subject'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-600 font-bold">
                      <BookOpen className="w-5 h-5" />
                      <span>{editSubjectId ? (locale === 'ur' ? 'مضمون میں ترمیم' : 'Edit Subject') : (locale === 'ur' ? 'نیا مضمون شامل کریں' : 'Add Subject')}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveSubject} className="space-y-4 py-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'نام (اردو) *' : 'Urdu Name *'}</Label>
                        <Input value={newSubject.name_ur} onChange={e => setNewSubject({...newSubject, name_ur: e.target.value})} className="h-10 text-xs" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'نام (انگریزی)' : 'English Name'}</Label>
                        <Input value={newSubject.name_en} onChange={e => setNewSubject({...newSubject, name_en: e.target.value})} className="h-10 text-xs text-start font-en" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'کورس کوڈ *' : 'Code *'}</Label>
                        <Input value={newSubject.code} onChange={e => setNewSubject({...newSubject, code: e.target.value.toUpperCase()})} className="h-10 text-xs font-mono font-bold text-start" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'قسم' : 'Type'}</Label>
                        <Select value={newSubject.subject_type} onValueChange={(val: any) => setNewSubject({...newSubject, subject_type: val})}>
                          <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="islamic">{locale === 'ur' ? 'دینی علوم' : 'Islamic'}</SelectItem>
                            <SelectItem value="compulsory">{locale === 'ur' ? 'لازمی' : 'Compulsory'}</SelectItem>
                            <SelectItem value="elective">{locale === 'ur' ? 'اختیاری' : 'Elective'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {!editSubjectId && (
                      <div className="space-y-1.5 border-t pt-3 mt-2 border-border/50">
                        <Label className="text-xs font-bold text-emerald-600">{locale === 'ur' ? 'درجہ کو براہ راست تفویض کریں (اختیاری)' : 'Assign directly to Class (Optional)'}</Label>
                        <Select value={newSubject.class_id} onValueChange={(val) => setNewSubject({...newSubject, class_id: val})}>
                          <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="کوئی درجہ نہیں" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{locale === 'ur' ? 'ابھی تفویض نہیں کرنا' : 'Do not assign yet'}</SelectItem>
                            {classes.map(c => (
                              <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.name_ur : c.name_en}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground">{locale === 'ur' ? 'اگر آپ درجہ منتخب کریں گے، تو یہ مضمون فوراً اس درجے کے ساتھ منسلک ہو جائے گا۔' : 'Subject will be auto-assigned if class is selected.'}</p>
                      </div>
                    )}

                    <DialogFooter>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'محفوظ کریں' : 'Save'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Assign Subject Modal */}
              <Dialog open={openAssignModal} onOpenChange={setOpenAssignModal}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="font-bold gap-1.5 shadow-sm">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{locale === 'ur' ? 'مضمون تفویض کریں' : 'Assign Subject'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-600 font-bold">
                      <UserCheck className="w-5 h-5" />
                      <span>{locale === 'ur' ? 'درجہ کو مضمون اور استاد تفویض کریں' : 'Assign Subject'}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAssignSubject} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ منتخب کریں *' : 'Class *'}</Label>
                      <Select value={newAssign.class_id} onValueChange={(val) => setNewAssign({...newAssign, class_id: val, section_id: 'none'})}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="درجہ منتخب کریں" /></SelectTrigger>
                        <SelectContent>
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.name_ur : c.name_en}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'سیکشن (اختیاری)' : 'Section (Optional)'}</Label>
                      <Select value={newAssign.section_id} onValueChange={(val) => setNewAssign({...newAssign, section_id: val})}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="کوئی خاص سیکشن نہیں" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'ur' ? 'تمام سیکشنز / مشترک' : 'All Sections'}</SelectItem>
                          {sections.filter(s => s.class_id === newAssign.class_id).map(s => (
                            <SelectItem key={s.id} value={s.id}>{locale === 'ur' ? s.name_ur : s.name_en}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'مضمون منتخب کریں *' : 'Subject *'}</Label>
                      <Select value={newAssign.subject_id} onValueChange={(val) => setNewAssign({...newAssign, subject_id: val})}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="مضمون منتخب کریں" /></SelectTrigger>
                        <SelectContent>
                          {subjects.map(s => (
                            <SelectItem key={s.id} value={s.id}>{locale === 'ur' ? `${s.name_ur} (${s.code})` : `${s.name_en} (${s.code})`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'ذمہ دار استاد' : 'Teacher'}</Label>
                      <Select value={newAssign.teacher_id} onValueChange={(val) => setNewAssign({...newAssign, teacher_id: val})}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="استاد منتخب کریں" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{locale === 'ur' ? 'ابھی تعین نہیں ہوا' : 'Not assigned'}</SelectItem>
                          {(() => {
                            const targetClass = classes.find(c => c.id === newAssign.class_id);
                            const deptId = targetClass?.department_id;
                            const allowedTeacherIds = deptId ? teacherDepts.filter(td => td.department_id === deptId).map(td => td.teacher_id) : [];
                            const availableTeachers = allowedTeacherIds.length > 0 ? teachers.filter(t => allowedTeacherIds.includes(t.id)) : teachers;
                            
                            return availableTeachers.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                            ));
                          })()}
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter>
                      <Button type="submit" variant="emerald" className="w-full font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'محفوظ کریں' : 'Confirm'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="depts" className="w-full" dir={dir}>
        <TabsList className="w-full grid grid-cols-5 h-12 bg-card border border-border/80 rounded-xl p-1 shadow-sm overflow-x-auto overflow-y-hidden">
          <TabsTrigger value="depts" className="font-bold text-xs sm:text-sm gap-2">
            <Library className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="hidden sm:inline">{locale === 'ur' ? `1. شعبہ جات (${departments.length})` : `1. Departments (${departments.length})`}</span>
            <span className="sm:hidden">{locale === 'ur' ? 'شعبہ جات' : 'Depts'}</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="font-bold text-xs sm:text-sm gap-2">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <span className="hidden sm:inline">{locale === 'ur' ? `2. درجات (${classes.length})` : `2. Classes (${classes.length})`}</span>
            <span className="sm:hidden">{locale === 'ur' ? 'درجات' : 'Classes'}</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="font-bold text-xs sm:text-sm gap-2">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">{locale === 'ur' ? `3. سیکشنز (${sections.length})` : `3. Sections (${sections.length})`}</span>
            <span className="sm:hidden">{locale === 'ur' ? 'سیکشنز' : 'Sections'}</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="font-bold text-xs sm:text-sm gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="hidden sm:inline">{locale === 'ur' ? `4. مضامین (${assignments.length})` : `4. Subjects`}</span>
            <span className="sm:hidden">{locale === 'ur' ? 'مضامین' : 'Subjects'}</span>
          </TabsTrigger>
          <TabsTrigger value="teachers" className="font-bold text-xs sm:text-sm gap-2">
            <Users className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">{locale === 'ur' ? `5. اساتذہ و شعبہ جات` : `5. Teachers & Depts`}</span>
            <span className="sm:hidden">{locale === 'ur' ? 'اساتذہ' : 'Teachers'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="depts" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.filter(d => d.name_ur?.includes(searchQuery) || d.name_en?.toLowerCase().includes(searchQuery.toLowerCase())).map((dept) => (
              <Card key={dept.id} className="border-border/60 hover:border-orange-500/60 transition-all shadow-sm flex flex-col justify-between group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-orange-600 transition-colors">
                    {locale === 'ur' ? dept.name_ur : dept.name_en}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {dept.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">{locale === 'ur' ? 'منسلک درجات:' : 'Linked Classes:'}</span>
                    <strong className="text-foreground font-bold font-en">{classes.filter(c => c.department_id === dept.id).length} Classes</strong>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handleEditDept(dept)} className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground">
                    <Edit className="w-3.5 h-3.5 me-1 text-primary shrink-0" /> {locale === 'ur' ? 'ترمیم' : 'Edit'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteDept(dept.id)} className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5 me-1 shrink-0" /> {locale === 'ur' ? 'حذف' : 'Delete'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4 pt-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'فلٹر (شعبہ):' : 'Filter by Dept:'}</span>
            <Select value={classFilterDept} onValueChange={setClassFilterDept}>
              <SelectTrigger className="h-8 text-xs w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'ur' ? 'تمام شعبہ جات' : 'All Departments'}</SelectItem>
                {departments.map(d => (
                  <SelectItem key={d.id} value={d.id}>{locale === 'ur' ? d.name_ur : d.name_en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes
              .filter(c => classFilterDept === 'all' || c.department_id === classFilterDept)
              .filter(c => c.name_ur?.includes(searchQuery) || c.name_en?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((cls) => (
              <Card key={cls.id} className="border-border/60 hover:border-primary/60 transition-all shadow-sm flex flex-col justify-between group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[11px] font-bold">
                      {locale === 'ur' ? cls.departments?.name_ur : cls.departments?.name_en}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground font-en">{cls.capacity} Seats</span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {locale === 'ur' ? cls.name_ur : cls.name_en}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">{locale === 'ur' ? 'فعال سیکشنز:' : 'Active Sections:'}</span>
                    <strong className="text-foreground font-bold font-en">{sections.filter(s => s.class_id === cls.id).length} Sections</strong>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handleEditClass(cls)} className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground">
                    <Edit className="w-3.5 h-3.5 me-1 text-primary shrink-0" /> {locale === 'ur' ? 'ترمیم' : 'Edit'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClass(cls.id)} className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5 me-1 shrink-0" /> {locale === 'ur' ? 'حذف' : 'Delete'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4 pt-2">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">{locale === 'ur' ? 'تمام فعال سیکشنز' : 'All Active Sections'}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'فلٹر (درجہ):' : 'Filter by Class:'}</span>
                <Select value={sectionFilterClass} onValueChange={setSectionFilterClass}>
                  <SelectTrigger className="h-8 text-xs w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'ur' ? 'تمام درجات' : 'All Classes'}</SelectItem>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.name_ur : c.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'ur' ? 'متعلقہ درجہ' : 'Class'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'سیکشن کا نام' : 'Section'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'شفٹ' : 'Shift'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'ایکشنز' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections
                    .filter(s => sectionFilterClass === 'all' || s.class_id === sectionFilterClass)
                    .map(sec => (
                    <TableRow key={sec.id}>
                      <TableCell className="font-bold text-xs">{locale === 'ur' ? sec.classes?.name_ur : sec.classes?.name_en}</TableCell>
                      <TableCell className="font-bold text-xs text-blue-600">{locale === 'ur' ? sec.name_ur : sec.name_en}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="font-en">{sec.shift}</Badge>
                      </TableCell>
                      <TableCell className="text-end">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSection(sec)} className="text-primary h-8 w-8 hover:bg-primary/10 me-1">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSection(sec.id)} className="text-destructive h-8 w-8 hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6 pt-2">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{locale === 'ur' ? 'تفویض کردہ مضامین' : 'Assigned Subjects'}</span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'فلٹر (درجہ):' : 'Filter by Class:'}</span>
                <Select value={subjectFilterClass} onValueChange={setSubjectFilterClass}>
                  <SelectTrigger className="h-8 text-xs w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'ur' ? 'تمام درجات' : 'All Classes'}</SelectItem>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.name_ur : c.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'ur' ? 'درجہ' : 'Class'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'سیکشن' : 'Section'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'مضمون' : 'Subject'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'استاد' : 'Teacher'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'ختم کریں' : 'Unassign'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments
                    .filter(a => subjectFilterClass === 'all' || a.class_id === subjectFilterClass)
                    .map(mapItem => (
                    <TableRow key={mapItem.id}>
                      <TableCell className="font-bold text-xs">{locale === 'ur' ? mapItem.classes?.name_ur : mapItem.classes?.name_en}</TableCell>
                      <TableCell className="font-bold text-xs text-blue-600">{mapItem.sections ? (locale === 'ur' ? mapItem.sections.name_ur : mapItem.sections.name_en) : 'All'}</TableCell>
                      <TableCell className="font-bold text-xs text-primary">{locale === 'ur' ? mapItem.subjects?.name_ur : mapItem.subjects?.name_en}</TableCell>
                      <TableCell className="font-bold text-xs text-emerald-700">
                        {mapItem.profiles ? mapItem.profiles.full_name : 'Unassigned'}
                      </TableCell>
                      <TableCell className="text-end">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAssignment(mapItem.id)} className="text-destructive h-8 hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">{locale === 'ur' ? 'تمام مضامین کا ریکارڈ' : 'All Subjects'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(sub => (
                  <div key={sub.id} className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-purple-500/50 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-700 font-en">{sub.code}</span>
                      </div>
                      <p className="font-bold text-sm">{locale === 'ur' ? sub.name_ur : sub.name_en}</p>
                    </div>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => handleEditSubject(sub)} className="text-primary h-8 w-8 hover:bg-primary/10 me-1">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(sub.id)} className="text-destructive h-8 w-8 hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="mt-4 focus-visible:outline-none">
          <TeacherDepartments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
