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
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

export function AcademicManager() {
  const { locale, dir } = useLanguage();
  
  // Live Data States
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [loadingDb, setLoadingDb] = useState(false);
  const supabase = createClient();

  const fetchFromDb = async () => {
    try {
      setLoadingDb(true);
      
      // Fetch Classes
      const { data: clsData } = await (supabase as any).from('classes').select('*').order('created_at', { ascending: true });
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
          profiles (full_name_ur, full_name_en)
        `)
        .order('created_at', { ascending: false });
      if (assignData) setAssignments(assignData);

      // Fetch Teachers
      const { data: teacherData } = await (supabase as any)
        .from('profiles')
        .select('*')
        .in('role', ['teacher', 'admin'])
        .order('full_name_ur', { ascending: true });
      if (teacherData) setTeachers(teacherData);

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

  // Modal States
  const [openClassModal, setOpenClassModal] = useState(false);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  // Form States
  const [newClass, setNewClass] = useState({ name_ur: '', name_en: '', level_type: 'dars_nizami', capacity: 40, description: '' });
  const [newSection, setNewSection] = useState({ class_id: '', name_ur: '', name_en: '', room_number: '', shift: 'morning', capacity: 30 });
  const [newSubject, setNewSubject] = useState({ name_ur: '', name_en: '', code: '', subject_type: 'compulsory', total_marks: 100 });
  const [newAssign, setNewAssign] = useState({ class_id: '', section_id: 'none', subject_id: '', teacher_id: '', credit_hours: 3 });

  // CRUD: Classes
  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await (supabase as any).from('classes').insert([newClass]);
      if (error) throw error;
      await fetchFromDb();
      setOpenClassModal(false);
      setNewClass({ name_ur: '', name_en: '', level_type: 'dars_nizami', capacity: 40, description: '' });
      toast.success(locale === 'ur' ? 'درجہ محفوظ ہو گیا!' : 'Class added!');
    } catch (err: any) {
      toast.error(err.message);
    }
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
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.class_id) return toast.error("Select a class");
    try {
      const { error } = await (supabase as any).from('sections').insert([newSection]);
      if (error) throw error;
      await fetchFromDb();
      setOpenSectionModal(false);
      setNewSection({ class_id: '', name_ur: '', name_en: '', room_number: '', shift: 'morning', capacity: 30 });
      toast.success(locale === 'ur' ? 'سیکشن محفوظ ہو گیا!' : 'Section added!');
    } catch (err: any) {
      toast.error(err.message);
    }
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
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await (supabase as any).from('subjects').insert([newSubject]);
      if (error) throw error;
      await fetchFromDb();
      setOpenSubjectModal(false);
      setNewSubject({ name_ur: '', name_en: '', code: '', subject_type: 'compulsory', total_marks: 100 });
      toast.success(locale === 'ur' ? 'مضمون محفوظ ہو گیا!' : 'Subject added!');
    } catch (err: any) {
      toast.error(err.message);
    }
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
    if (!newAssign.class_id || !newAssign.subject_id) return toast.error("Select class and subject");
    try {
      const row = {
        class_id: newAssign.class_id,
        subject_id: newAssign.subject_id,
        section_id: newAssign.section_id === 'none' ? null : newAssign.section_id,
        teacher_id: newAssign.teacher_id || null,
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

              {/* Class Modal */}
              <Dialog open={openClassModal} onOpenChange={setOpenClassModal}>
                <DialogTrigger asChild>
                  <Button variant="emerald" size="sm" className="font-bold gap-1.5 shadow-md">
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>{locale === 'ur' ? '+ نیا درجہ (Class)' : '+ New Class'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary font-bold">
                      <Building2 className="w-5 h-5" />
                      <span>{locale === 'ur' ? 'نیا درجہ / کلاس شامل کریں' : 'Add New Class'}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddClass} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ کا نام (اردو میں) *' : 'Name (Urdu) *'}</Label>
                      <Input value={newClass.name_ur} onChange={e => setNewClass({...newClass, name_ur: e.target.value})} className="h-10 text-xs" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'انگریزی نام *' : 'Name (English) *'}</Label>
                      <Input value={newClass.name_en} onChange={e => setNewClass({...newClass, name_en: e.target.value})} className="h-10 text-xs font-en text-start" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'شعبہ' : 'Level Type'}</Label>
                        <Select value={newClass.level_type} onValueChange={(val: any) => setNewClass({...newClass, level_type: val})}>
                          <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hifz_nazra">{locale === 'ur' ? 'حفظ و ناظرہ' : 'Hifz'}</SelectItem>
                            <SelectItem value="tajweed">{locale === 'ur' ? 'تجوید' : 'Tajweed'}</SelectItem>
                            <SelectItem value="balighan">{locale === 'ur' ? 'بالغان' : 'Adult'}</SelectItem>
                            <SelectItem value="dars_nizami">{locale === 'ur' ? 'درس نظامی' : 'Alimiyah'}</SelectItem>
                            <SelectItem value="takhassusat">{locale === 'ur' ? 'تخصص' : 'Postgrad'}</SelectItem>
                            <SelectItem value="school">{locale === 'ur' ? 'عصری تعلیم' : 'School'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'گنجائش' : 'Capacity'}</Label>
                        <Input type="number" value={newClass.capacity} onChange={e => setNewClass({...newClass, capacity: parseInt(e.target.value) || 40})} className="h-10 text-xs text-start font-en" />
                      </div>
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
              <Dialog open={openSectionModal} onOpenChange={setOpenSectionModal}>
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
                      <span>{locale === 'ur' ? 'نیا سیکشن شامل کریں' : 'Add New Section'}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddSection} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ منتخب کریں *' : 'Select Class *'}</Label>
                      <Select value={newSection.class_id} onValueChange={(val) => setNewSection({...newSection, class_id: val})}>
                        <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
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
              <Dialog open={openSubjectModal} onOpenChange={setOpenSubjectModal}>
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
                      <span>{locale === 'ur' ? 'نیا مضمون شامل کریں' : 'Add Subject'}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddSubject} className="space-y-4 py-3">
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
                        <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
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
                        <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
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
                          {teachers.map(t => (
                            <SelectItem key={t.id} value={t.id}>{locale === 'ur' ? t.full_name_ur : t.full_name_en}</SelectItem>
                          ))}
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

      <Tabs defaultValue="classes" className="w-full" dir={dir}>
        <TabsList className="w-full grid grid-cols-3 h-12 bg-card border border-border/80 rounded-xl p-1 shadow-sm">
          <TabsTrigger value="classes" className="font-bold text-xs sm:text-sm gap-2">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <span>{locale === 'ur' ? `1. درجات (${classes.length})` : `1. Classes (${classes.length})`}</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="font-bold text-xs sm:text-sm gap-2">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{locale === 'ur' ? `2. سیکشنز (${sections.length})` : `2. Sections (${sections.length})`}</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="font-bold text-xs sm:text-sm gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{locale === 'ur' ? `3. مضامین (${assignments.length})` : `3. Subjects`}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.filter(c => c.name_ur?.includes(searchQuery) || c.name_en?.toLowerCase().includes(searchQuery.toLowerCase())).map((cls) => (
              <Card key={cls.id} className="border-border/60 hover:border-primary/60 transition-all shadow-sm flex flex-col justify-between group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[11px] font-bold">
                      {cls.level_type}
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
                <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-end">
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteClass(cls.id)} className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4 pt-2">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">{locale === 'ur' ? 'تمام فعال سیکشنز' : 'All Active Sections'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'ur' ? 'متعلقہ درجہ' : 'Class'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'سیکشن کا نام' : 'Section'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'شفٹ' : 'Shift'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'حذف کریں' : 'Delete'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map(sec => (
                    <TableRow key={sec.id}>
                      <TableCell className="font-bold text-xs">{locale === 'ur' ? sec.classes?.name_ur : sec.classes?.name_en}</TableCell>
                      <TableCell className="font-bold text-xs text-blue-600">{locale === 'ur' ? sec.name_ur : sec.name_en}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="font-en">{sec.shift}</Badge>
                      </TableCell>
                      <TableCell className="text-end">
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
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{locale === 'ur' ? 'تفویض کردہ مضامین' : 'Assigned Subjects'}</span>
              </CardTitle>
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
                  {assignments.map(mapItem => (
                    <TableRow key={mapItem.id}>
                      <TableCell className="font-bold text-xs">{locale === 'ur' ? mapItem.classes?.name_ur : mapItem.classes?.name_en}</TableCell>
                      <TableCell className="font-bold text-xs text-blue-600">{mapItem.sections ? (locale === 'ur' ? mapItem.sections.name_ur : mapItem.sections.name_en) : 'All'}</TableCell>
                      <TableCell className="font-bold text-xs text-primary">{locale === 'ur' ? mapItem.subjects?.name_ur : mapItem.subjects?.name_en}</TableCell>
                      <TableCell className="font-bold text-xs text-emerald-700">
                        {mapItem.profiles ? (locale === 'ur' ? mapItem.profiles.full_name_ur : mapItem.profiles.full_name_en) : 'Unassigned'}
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
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(sub.id)} className="text-destructive h-8 w-8 hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
