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
  Sparkles, 
  Search, 
  GraduationCap,
  Layers,
  Award,
  UserCheck,
  Database,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

// Initial Authentic Seed Data matching Madrasa 5 Departments & 21 Classes Structure
const initialClasses = [
  // 1. شعبہ حفظ و ناظرہ (یا شعبہ تحفظ)
  { id: 'c1', nameUrdu: 'قاعدہ (شعبہ حفظ و ناظرہ)', name: 'Qaida (Basics)', levelType: 'hifz_nazra', capacity: 40, description: 'نورانی قاعدہ اور بنیادی تلفظ کی تعلیم' },
  { id: 'c2', nameUrdu: 'ناظرہ قرآن کریم', name: 'Nazra Quran', levelType: 'hifz_nazra', capacity: 45, description: 'مکمل ناظرہ قرآن باتجوید اور بنیادی دعائیں' },
  { id: 'c3', nameUrdu: 'حفظِ قرآن کریم', name: 'Hifz al-Quran', levelType: 'hifz_nazra', capacity: 35, description: 'مکمل حفظ قرآن اور منزل کی پختگی' },

  // 2. شعبہ تجوید و قرآت
  { id: 'c4', nameUrdu: 'تجوید (روایت حفص)', name: 'Tajweed Course', levelType: 'tajweed', capacity: 30, description: 'مخارج اور صفاتِ حروف کی عملی و نظری مشق' },
  { id: 'c5', nameUrdu: 'قرآت (سبعہ و عشرہ)', name: 'Qiraat (Saba & Ashra)', levelType: 'tajweed', capacity: 25, description: 'مختلف روایات اور قراءت سبعہ و عشرہ' },

  // 3. شعبہ تعلیم بالغان
  { id: 'c6', nameUrdu: 'دراسِاتِ دینیہ (ایک سالہ کورس)', name: 'Dirasat-e-Deeniyah (1-Year)', levelType: 'balighan', capacity: 40, description: 'بالغ افراد کے لیے ضروری مسائل و بنیادی دینی معلومات' },
  { id: 'c7', nameUrdu: 'آسان دینیات (بنیادی کورس)', name: 'Aasan Deeniyat', levelType: 'balighan', capacity: 50, description: 'عصری طلباء اور ملازمت پیشہ افراد کے لیے آسان دینی کورس' },

  // 4. شعبہ کتب (درس نظامی / عالمیت)
  { id: 'c8', nameUrdu: 'اعدادیہ اول (مڈل / بنیاد)', name: 'Idadiyah Year 1', levelType: 'dars_nizami', capacity: 35, description: 'ابتدائی صرف و نحو اور فارسی ادب' },
  { id: 'c9', nameUrdu: 'اعدادیہ دوم (تیاری عالمیت)', name: 'Idadiyah Year 2', levelType: 'dars_nizami', capacity: 35, description: 'عربی ادب اور فقہ کی بنیادی کتب' },
  { id: 'c10', nameUrdu: 'اعدادیہ سوم', name: 'Idadiyah Year 3', levelType: 'dars_nizami', capacity: 30, description: 'متوسطات عربی اور اصولِ فقہ' },
  { id: 'c11', nameUrdu: 'درجہ اولیٰ (عامہ اولیٰ - سال اول)', name: 'Ula (Year 1 Alimiyah)', levelType: 'dars_nizami', capacity: 40, description: 'صرف، نحو، فقہ اور ابتدائی عربی ادب کا باقاعدہ سال' },
  { id: 'c12', nameUrdu: 'درجہ ثانیہ (عامہ ثانیہ - سال دوم)', name: 'Saniyah (Year 2 Alimiyah)', levelType: 'dars_nizami', capacity: 35, description: 'عربی ادب، فقہ، اور تاریخ اسلام' },
  { id: 'c13', nameUrdu: 'درجہ ثالثہ (خاصہ اولیٰ - سال سوم)', name: 'Salisah (Year 3 Alimiyah)', levelType: 'dars_nizami', capacity: 30, description: 'ترجمہ قرآن، فقہ، اور اصول حدیث' },
  { id: 'c14', nameUrdu: 'درجہ رابعہ (خاصہ ثانیہ - سال چہارم)', name: 'Rabiah (Year 4 Alimiyah)', levelType: 'dars_nizami', capacity: 30, description: 'تفسیر، حدیث (مشکوٰۃ)، اور عقائد' },
  { id: 'c15', nameUrdu: 'درجہ خامسہ (عالیہ اولیٰ - سال پنجم)', name: 'Khamisah (Year 5 Alimiyah)', levelType: 'dars_nizami', capacity: 25, description: 'ہدایہ، جلالین، اور الفیہ' },
  { id: 'c16', nameUrdu: 'درجہ سادسہ (عالیہ ثانیہ - سال ششم)', name: 'Sadisah (Year 6 Alimiyah)', levelType: 'dars_nizami', capacity: 25, description: 'مشکوٰۃ المصابيح اور شرح معانی الآثار' },
  { id: 'c17', nameUrdu: 'درجہ سابعہ (موقوف علیہ - سال ہفتم)', name: 'Sabiah (Year 7 Alimiyah)', levelType: 'dars_nizami', capacity: 25, description: 'ہدایہ آخرین اور بیضاوی' },
  { id: 'c18', nameUrdu: 'درجہ ثامنہ (دورہِ حدیث - سال آخر)', name: 'Dora-e-Hadith (Final Year)', levelType: 'dars_nizami', capacity: 30, description: 'صحاح ستہ اور اصولِ حدیث کا خصوصی و اختتامی سال' },

  // 5. شعبہ تخصصات (پوسٹ گریجویٹ / التخصص)
  { id: 'c19', nameUrdu: 'تخصص فی التفسیر (ایک سالہ / دو سالہ)', name: 'Takhassus fil Tafseer', levelType: 'takhassusat', capacity: 15, description: 'تفسیر اور اصولِ تفسیر میں اعلیٰ مہارت و تحقیق' },
  { id: 'c20', nameUrdu: 'تخصص فی الحدیث (علوم الحدیث)', name: 'Takhassus fil Hadith', levelType: 'takhassusat', capacity: 15, description: 'تخریج احادیث، جرح و تعدیل اور اسماء الرجال میں تخصص' },
  { id: 'c21', nameUrdu: 'تخصص فی الفقہ والافتاء (مفتی کورس)', name: 'Takhassus fil Fiqh (Ifta)', levelType: 'takhassusat', capacity: 20, description: 'فتویٰ نویسی، جدید فقہی مسائل اور قضا و افتاء میں تخصص' },
];

const initialSections = [
  { id: 's1', classId: 'c1', classNameUrdu: 'قاعدہ (شعبہ حفظ و ناظرہ)', nameUrdu: 'سیکشن الف (صبح)', name: 'Section A (Morning)', room: 'کمرہ نمبر 101', shift: 'morning', capacity: 25 },
  { id: 's2', classId: 'c2', classNameUrdu: 'ناظرہ قرآن کریم', nameUrdu: 'سیکشن ب (دوپہر)', name: 'Section B (Afternoon)', room: 'کمرہ نمبر 102', shift: 'afternoon', capacity: 20 },
  { id: 's3', classId: 'c3', classNameUrdu: 'حفظِ قرآن کریم', nameUrdu: 'دارالحفظ الف (صبح)', name: 'Darul-Hifz A (Morning)', room: 'ہال نمبر 1', shift: 'morning', capacity: 15 },
  { id: 's4', classId: 'c4', classNameUrdu: 'تجوید (روایت حفص)', nameUrdu: 'دارالتجوید الف', name: 'Tajweed Hall A', room: 'ہال نمبر 2', shift: 'evening', capacity: 15 },
  { id: 's5', classId: 'c11', classNameUrdu: 'درجہ اولیٰ (عامہ اولیٰ)', nameUrdu: 'سیکشن عامہ (صبح)', name: 'Section Aamah (Morning)', room: 'ہال نمبر 3', shift: 'morning', capacity: 35 },
  { id: 's6', classId: 'c18', classNameUrdu: 'درجہ ثامنہ (دورہِ حدیث)', nameUrdu: 'ہال دورہ حدیث', name: 'Dora-e-Hadith Hall', room: 'مرکزی ہال دارالحدیث', shift: 'morning', capacity: 25 },
  { id: 's7', classId: 'c21', classNameUrdu: 'تخصص فی الفقہ والافتاء', nameUrdu: 'دارالافتاء (تحقیقی ہال)', name: 'Darul-Ifta Hall', room: 'تحقیقی ہال نمبر 5', shift: 'morning', capacity: 20 },
];

const initialSubjects = [
  { id: 'sub1', nameUrdu: 'تجوید و قراءت القرآن', name: 'Tajweed & Quran Recitation', code: 'ISL-101', type: 'islamic', marks: 100 },
  { id: 'sub2', nameUrdu: 'فقہ اور اصول فقہ (نور الایضاح)', name: 'Fiqh & Usul al-Fiqh', code: 'FIQ-201', type: 'islamic', marks: 100 },
  { id: 'sub3', nameUrdu: 'علم الصرف و النحو (عربی گرائمر)', name: 'Arabic Grammar (Sarf & Nahw)', code: 'ARB-101', type: 'islamic', marks: 100 },
  { id: 'sub4', nameUrdu: 'صحیح بخاری و صحیح مسلم (حدیث)', name: 'Sahih Bukhari & Muslim', code: 'HAD-401', type: 'islamic', marks: 100 },
  { id: 'sub5', nameUrdu: 'اصولِ حدیث و اسماء الرجال', name: 'Usul al-Hadith & Asma al-Rijal', code: 'HAD-501', type: 'islamic', marks: 100 },
  { id: 'sub6', nameUrdu: 'فتاویٰ نویسی و اصولِ افتاء', name: 'Fatwa Writing & Usul al-Ifta', code: 'IFT-601', type: 'islamic', marks: 100 },
];

const initialAssignments = [
  { id: 'a1', classId: 'c1', classNameUrdu: 'قاعدہ (شعبہ حفظ و ناظرہ)', subjectId: 'sub1', subjectNameUrdu: 'تجوید و قراءت', teacher: 'قاری عبدالباسط صاحب', credits: 5 },
  { id: 'a2', classId: 'c4', classNameUrdu: 'تجوید (روایت حفص)', subjectId: 'sub1', subjectNameUrdu: 'تجوید و قراءت', teacher: 'قاری احمد صاحب', credits: 4 },
  { id: 'a3', classId: 'c11', classNameUrdu: 'درجہ اولیٰ (عامہ اولیٰ)', subjectId: 'sub2', subjectNameUrdu: 'فقہ اور اصول فقہ', teacher: 'مولانا طارق صاحب (پرنسپل)', credits: 4 },
  { id: 'a4', classId: 'c11', classNameUrdu: 'درجہ اولیٰ (عامہ اولیٰ)', subjectId: 'sub3', subjectNameUrdu: 'علم الصرف و النحو', teacher: 'مفتی رضوان صاحب', credits: 4 },
  { id: 'a5', classId: 'c18', classNameUrdu: 'درجہ ثامنہ (دورہِ حدیث)', subjectId: 'sub4', subjectNameUrdu: 'صحیح بخاری و مسلم', teacher: 'شیخ الحدیث مولانا زکریا', credits: 8 },
  { id: 'a6', classId: 'c21', classNameUrdu: 'تخصص فی الفقہ والافتاء', subjectId: 'sub6', subjectNameUrdu: 'فتاویٰ نویسی و اصولِ افتاء', teacher: 'مفتی اعظم مولانا عبدالحکیم', credits: 6 },
];

export function AcademicManager() {
  const { locale, t, dir } = useLanguage();
  const [classes, setClasses] = useState(initialClasses);
  const [sections, setSections] = useState(initialSections);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [loadingDb, setLoadingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);
  const supabase = createClient();

  const fetchFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data: clsData } = await (supabase as any).from('classes').select('*').order('created_at', { ascending: true });
      if (clsData && clsData.length > 0) {
        setClasses(clsData.map((c: any) => ({
          id: c.id,
          nameUrdu: c.name_ur || '',
          name: c.name_en || '',
          levelType: c.level_type === 'hifz' ? 'hifz_nazra' : (c.level_type === 'dars_nizami' ? 'dars_nizami' : 'school'),
          capacity: c.capacity || 40,
          description: c.description || ''
        })));
      }

      const { data: subData } = await (supabase as any).from('subjects').select('*').order('created_at', { ascending: true });
      if (subData && subData.length > 0) {
        setSubjects(subData.map((s: any) => ({
          id: s.id,
          nameUrdu: s.name_ur || '',
          name: s.name_en || '',
          code: s.code || '',
          type: s.subject_type || 'compulsory',
          marks: s.total_marks || 100
        })));
      }
    } catch (err) {
      console.error("Error fetching academic data:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchFromDb();
  }, []);

  const handleSeedAll = async () => {
    setSeedingDb(true);
    try {
      // 1. Check if classes already exist to avoid duplicates
      const { data: existingCls } = await (supabase as any).from('classes').select('id').limit(1);
      if (!existingCls || existingCls.length === 0) {
        const classRows = initialClasses.map(c => ({
          name_ur: c.nameUrdu,
          name_en: c.name,
          level_type: c.levelType === 'hifz_nazra' || c.levelType === 'tajweed' ? 'hifz' : (c.levelType === 'dars_nizami' || c.levelType === 'takhassusat' ? 'dars_nizami' : 'school'),
          description: c.description,
          capacity: c.capacity
        }));
        await (supabase as any).from('classes').insert(classRows);
      }

      // 2. Use upsert with ignoreDuplicates for subjects to prevent duplicate key constraint errors
      const subRows = initialSubjects.map(s => ({
        name_ur: s.nameUrdu,
        name_en: s.name,
        code: s.code,
        subject_type: s.type,
        total_marks: s.marks
      }));
      await (supabase as any).from('subjects').upsert(subRows, { onConflict: 'code', ignoreDuplicates: true });

      await fetchFromDb();
      toast.success(locale === 'ur' ? '🎉 الحمد للہ! تعلیمی درجات اور مضامین لائیو Supabase میں اپ ڈیٹ ہو گئے!' : '🎉 Classes & subjects updated in live Supabase DB!');
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    } finally {
      setSeedingDb(false);
    }
  };

  // Filters
  const [classFilter, setClassFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [openClassModal, setOpenClassModal] = useState(false);
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  // Form States for Add / Edit
  const [newClass, setNewClass] = useState({ nameUrdu: '', name: '', levelType: 'dars_nizami', capacity: 40, description: '' });
  const [newSection, setNewSection] = useState({ classId: 'c1', nameUrdu: '', name: '', room: '', shift: 'morning', capacity: 30 });
  const [newSubject, setNewSubject] = useState({ nameUrdu: '', name: '', code: '', type: 'compulsory', marks: 100 });
  const [newAssign, setNewAssign] = useState({ classId: 'c1', subjectId: 'sub1', teacher: 'مولانا طارق صاحب', credits: 3 });

  // CRUD Handlers
  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.nameUrdu || !newClass.name) {
      toast.error(locale === 'ur' ? 'درجہ کا اردو اور انگریزی نام ضروری ہے۔' : 'Both Urdu and English names are required.');
      return;
    }
    try {
      const row = {
        name_ur: newClass.nameUrdu,
        name_en: newClass.name,
        level_type: newClass.levelType === 'hifz_nazra' || newClass.levelType === 'tajweed' ? 'hifz' : (newClass.levelType === 'dars_nizami' || newClass.levelType === 'takhassusat' ? 'dars_nizami' : 'school'),
        capacity: Number(newClass.capacity) || 40,
        description: newClass.description
      };
      const { data, error } = await (supabase as any).from('classes').insert([row]).select().single();
      if (error) {
        toast.error(locale === 'ur' ? `ڈیٹا بیس ایرر: ${error.message}` : `DB Error: ${error.message}`);
      } else {
        await fetchFromDb();
        setOpenClassModal(false);
        setNewClass({ nameUrdu: '', name: '', levelType: 'dars_nizami', capacity: 40, description: '' });
        toast.success(locale === 'ur' ? `🎉 درجہ "${newClass.nameUrdu}" لائیو Supabase میں محفوظ ہو گیا!` : `🎉 Class added to live Supabase DB!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    }
  };

  const handleDeleteClass = async (id: string, name: string) => {
    try {
      await (supabase as any).from('classes').delete().eq('id', id);
      setClasses(classes.filter(c => c.id !== id));
      toast.success(locale === 'ur' ? `درجہ "${name}" لائیو DB سے حذف کر دیا گیا!` : `Class "${name}" deleted from live DB!`);
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    }
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.nameUrdu || !newSection.name) {
      toast.error(locale === 'ur' ? 'سیکشن کا اردو اور انگریزی نام ضروری ہے۔' : 'Section name is required.');
      return;
    }
    const parentClass = classes.find(c => c.id === newSection.classId);
    const id = `s${Date.now()}`;
    setSections([...sections, { ...newSection, id, classNameUrdu: parentClass?.nameUrdu || 'درجہ' }]);
    setOpenSectionModal(false);
    setNewSection({ classId: 'c1', nameUrdu: '', name: '', room: '', shift: 'morning', capacity: 30 });
    toast.success(locale === 'ur' ? `نیا سیکشن "${newSection.nameUrdu}" شامل کر لیا گیا!` : `Section added!`);
  };

  const handleDeleteSection = (id: string, name: string) => {
    setSections(sections.filter(s => s.id !== id));
    toast.success(locale === 'ur' ? `سیکشن "${name}" حذف کر دیا گیا!` : `Section deleted!`);
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.nameUrdu || !newSubject.code) {
      toast.error(locale === 'ur' ? 'مضمون کا نام اور کوڈ ضروری ہے۔' : 'Subject name and code are required.');
      return;
    }
    try {
      const row = {
        name_ur: newSubject.nameUrdu,
        name_en: newSubject.name,
        code: newSubject.code,
        subject_type: newSubject.type,
        total_marks: Number(newSubject.marks) || 100
      };
      const { error } = await (supabase as any).from('subjects').insert([row]);
      if (error) {
        if (error.message && error.message.includes('duplicate key')) {
          toast.error(locale === 'ur' ? `ایرر: کوڈ "${newSubject.code}" کا مضمون پہلے سے موجود ہے۔ براہ کرم نیا کوڈ درج کریں!` : `Error: Subject with code "${newSubject.code}" already exists!`);
        } else {
          toast.error(locale === 'ur' ? `ڈیٹا بیس ایرر: ${error.message}` : `DB Error: ${error.message}`);
        }
      } else {
        await fetchFromDb();
        setOpenSubjectModal(false);
        setNewSubject({ nameUrdu: '', name: '', code: '', type: 'compulsory', marks: 100 });
        toast.success(locale === 'ur' ? `🎉 مضمون "${newSubject.nameUrdu}" لائیو Supabase میں محفوظ ہو گیا!` : `🎉 Subject added to live DB!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    }
  };

  const handleDeleteSubject = async (id: string, name: string) => {
    try {
      await (supabase as any).from('subjects').delete().eq('id', id);
      setSubjects(subjects.filter(s => s.id !== id));
      toast.success(locale === 'ur' ? `مضمون "${name}" لائیو DB سے حذف کر دیا گیا!` : `Subject deleted from live DB!`);
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    }
  };

  const handleAssignSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find(c => c.id === newAssign.classId);
    const sub = subjects.find(s => s.id === newAssign.subjectId);
    const id = `a${Date.now()}`;
    setAssignments([...assignments, {
      id,
      classId: newAssign.classId,
      classNameUrdu: cls?.nameUrdu || 'درجہ',
      subjectId: newAssign.subjectId,
      subjectNameUrdu: sub?.nameUrdu || 'مضمون',
      teacher: newAssign.teacher,
      credits: newAssign.credits
    }]);
    setOpenAssignModal(false);
    toast.success(locale === 'ur' ? `مضمون "${sub?.nameUrdu}" کو درجہ کے لیے تفویض کر دیا گیا!` : `Subject assigned to class!`);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast.success(locale === 'ur' ? 'مضمون کی تفویض ختم کر دی گئی!' : 'Assignment removed!');
  };

  return (
    <div className="space-y-6 font-ur">
      {/* Top Controls Bar */}
      <Card className="border-border/60 shadow-sm bg-card/90 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={locale === 'ur' ? 'درجہ، سیکشن یا مضمون تلاش کریں...' : 'Search classes, sections, subjects...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 pe-4 h-10 text-xs w-full font-ur"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleSeedAll} 
                disabled={seedingDb}
                className="font-bold border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{seedingDb ? (locale === 'ur' ? 'ڈیٹا ڈالا جا رہا ہے...' : 'Seeding...') : (locale === 'ur' ? '⚡ تعلیمی درجات لائیو DB میں ڈالیں' : 'Seed 21 Classes to DB')}</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={fetchFromDb} className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Refresh DB">
                <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
              </Button>
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
                      <span>{locale === 'ur' ? 'نیا درجہ / کلاس شامل کریں' : 'Add New Class / Grade'}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      {locale === 'ur' ? 'جامعہ کے عصری سکول، شعبہ حفظ یا درس نظامی میں نیا تعلیمی درجہ قائم کریں۔' : 'Create a new academic grade in School, Hifz, or Alimiyah section.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddClass} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ کا نام (اردو میں) *' : 'Class Name (Urdu) *'}</Label>
                      <Input placeholder="مثلاً: درجہ ششم / حفظ القرآن سال اول" value={newClass.nameUrdu} onChange={e => setNewClass({...newClass, nameUrdu: e.target.value})} className="h-10 text-xs font-ur" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'انگریزی نام / عرفیت *' : 'Class Name (English) *'}</Label>
                      <Input placeholder="e.g. Grade 6 / Hifz Year 1" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} className="h-10 text-xs font-en text-start" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'شعبہ / سطح' : 'Level Type'}</Label>
                        <Select value={newClass.levelType} onValueChange={(val: any) => setNewClass({...newClass, levelType: val})}>
                          <SelectTrigger className="h-10 text-xs font-ur"><SelectValue /></SelectTrigger>
                          <SelectContent className="font-ur">
                            <SelectItem value="hifz_nazra">{locale === 'ur' ? '1. شعبہ حفظ و ناظرہ' : '1. Hifz & Nazra'}</SelectItem>
                            <SelectItem value="tajweed">{locale === 'ur' ? '2. شعبہ تجوید و قرآت' : '2. Tajweed & Qiraat'}</SelectItem>
                            <SelectItem value="balighan">{locale === 'ur' ? '3. شعبہ تعلیم بالغان' : '3. Adult Education'}</SelectItem>
                            <SelectItem value="dars_nizami">{locale === 'ur' ? '4. شعبہ کتب (درس نظامی)' : '4. Dars-e-Nizami'}</SelectItem>
                            <SelectItem value="takhassusat">{locale === 'ur' ? '5. شعبہ تخصصات' : '5. Takhassusat (Postgrad)'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'گنجائش (طلباء کی تعداد)' : 'Student Capacity'}</Label>
                        <Input type="number" value={newClass.capacity} onChange={e => setNewClass({...newClass, capacity: parseInt(e.target.value) || 40})} className="h-10 text-xs font-en text-start" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'تفصیل / نصاب کا خاکہ' : 'Description / Syllabus'}</Label>
                      <Input placeholder="نصاب اور مضامین کی مختصر تفصیل..." value={newClass.description} onChange={e => setNewClass({...newClass, description: e.target.value})} className="h-10 text-xs font-ur" />
                    </div>
                    <DialogFooter>
                      <Button type="submit" variant="emerald" className="w-full font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'درجہ محفوظ کریں' : 'Save Class'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={openSectionModal} onOpenChange={setOpenSectionModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="font-bold gap-1.5 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>{locale === 'ur' ? '+ نیا سیکشن' : '+ New Section'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-600 font-bold">
                      <Layers className="w-5 h-5" />
                      <span>{locale === 'ur' ? 'درجہ میں نیا سیکشن شامل کریں' : 'Add New Section to Class'}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      {locale === 'ur' ? 'طلباء کی تعداد اور اوقات کے لحاظ سے نیا سیکشن، کمرہ نمبر اور شفٹ ترتیب دیں۔' : 'Organize students by creating shifts, room assignments, and sections.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSection} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'متعلقہ درجہ / کلاس منتخب کریں *' : 'Select Parent Class *'}</Label>
                      <Select value={newSection.classId} onValueChange={(val) => setNewSection({...newSection, classId: val})}>
                        <SelectTrigger className="h-10 text-xs font-ur"><SelectValue /></SelectTrigger>
                        <SelectContent className="font-ur">
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.nameUrdu : c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'سیکشن کا نام (اردو) *' : 'Section Name (Urdu) *'}</Label>
                        <Input placeholder="سیکشن الف (صبح)" value={newSection.nameUrdu} onChange={e => setNewSection({...newSection, nameUrdu: e.target.value})} className="h-10 text-xs font-ur" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'انگریزی نام' : 'English Name'}</Label>
                        <Input placeholder="Section A (Morning)" value={newSection.name} onChange={e => setNewSection({...newSection, name: e.target.value})} className="h-10 text-xs font-en text-start" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'کمرہ / ہال نمبر' : 'Room Number'}</Label>
                        <Input placeholder="ہال نمبر 104" value={newSection.room} onChange={e => setNewSection({...newSection, room: e.target.value})} className="h-10 text-xs font-ur" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'شفٹ (Shift)' : 'Shift'}</Label>
                        <Select value={newSection.shift} onValueChange={(val: any) => setNewSection({...newSection, shift: val})}>
                          <SelectTrigger className="h-10 text-xs font-ur"><SelectValue /></SelectTrigger>
                          <SelectContent className="font-ur">
                            <SelectItem value="morning">{locale === 'ur' ? 'صبح (Morning Shift)' : 'Morning'}</SelectItem>
                            <SelectItem value="afternoon">{locale === 'ur' ? 'دوپہر (Afternoon Shift)' : 'Afternoon'}</SelectItem>
                            <SelectItem value="evening">{locale === 'ur' ? 'شام (Evening Shift)' : 'Evening'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'سیکشن محفوظ کریں' : 'Save Section'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={openSubjectModal} onOpenChange={setOpenSubjectModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="font-bold gap-1.5 border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>{locale === 'ur' ? '+ نیا مضمون' : '+ New Subject'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-600 font-bold">
                      <BookOpen className="w-5 h-5" />
                      <span>{locale === 'ur' ? 'نیا مضمون یا درسی کتاب شامل کریں' : 'Add New Subject / Course Book'}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      {locale === 'ur' ? 'دینی یا عصری علوم کے مضامین، کل نمبر اور امتحانی کامیابی کے نمبرات درج کریں۔' : 'Define subjects, course codes, and passing score thresholds.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSubject} className="space-y-4 py-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'مضمون کا نام (اردو) *' : 'Subject (Urdu) *'}</Label>
                        <Input placeholder="سیرت النبی ﷺ" value={newSubject.nameUrdu} onChange={e => setNewSubject({...newSubject, nameUrdu: e.target.value})} className="h-10 text-xs font-ur" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'انگریزی نام' : 'English Name'}</Label>
                        <Input placeholder="Seerah of Prophet" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} className="h-10 text-xs font-en text-start" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'کورس کوڈ (Code) *' : 'Subject Code *'}</Label>
                        <Input placeholder="ISL-102" value={newSubject.code} onChange={e => setNewSubject({...newSubject, code: e.target.value.toUpperCase()})} className="h-10 text-xs font-mono font-bold text-start" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">{locale === 'ur' ? 'قسم (Type)' : 'Subject Type'}</Label>
                        <Select value={newSubject.type} onValueChange={(val: any) => setNewSubject({...newSubject, type: val})}>
                          <SelectTrigger className="h-10 text-xs font-ur"><SelectValue /></SelectTrigger>
                          <SelectContent className="font-ur">
                            <SelectItem value="islamic">{locale === 'ur' ? 'دینی و مذہبی علوم' : 'Islamic Studies'}</SelectItem>
                            <SelectItem value="compulsory">{locale === 'ur' ? 'لازمی عصری مضمون' : 'Compulsory'}</SelectItem>
                            <SelectItem value="elective">{locale === 'ur' ? 'اختیاری مضمون' : 'Elective'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'مضمون محفوظ کریں' : 'Save Subject'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={openAssignModal} onOpenChange={setOpenAssignModal}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="font-bold gap-1.5 shadow-sm">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{locale === 'ur' ? 'مضمون تفویض کریں' : 'Assign Subject to Class'}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] font-ur">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-600 font-bold">
                      <UserCheck className="w-5 h-5" />
                      <span>{locale === 'ur' ? 'درجہ کو مضمون اور استاد تفویض کریں' : 'Assign Subject & Teacher to Class'}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                      {locale === 'ur' ? 'مخصوص درجہ کے لیے درسی مضمون کا انتخاب کریں اور ذمہ دار استاد / معلم تعینات کریں۔' : 'Map subjects to classes and assign responsible teaching staff.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAssignSubject} className="space-y-4 py-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ / کلاس منتخب کریں *' : 'Select Class *'}</Label>
                      <Select value={newAssign.classId} onValueChange={(val) => setNewAssign({...newAssign, classId: val})}>
                        <SelectTrigger className="h-10 text-xs font-ur"><SelectValue /></SelectTrigger>
                        <SelectContent className="font-ur">
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.nameUrdu : c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'مضمون / کتاب منتخب کریں *' : 'Select Subject *'}</Label>
                      <Select value={newAssign.subjectId} onValueChange={(val) => setNewAssign({...newAssign, subjectId: val})}>
                        <SelectTrigger className="h-10 text-xs font-ur"><SelectValue /></SelectTrigger>
                        <SelectContent className="font-ur">
                          {subjects.map(s => (
                            <SelectItem key={s.id} value={s.id}>{locale === 'ur' ? `${s.nameUrdu} (${s.code})` : `${s.name} (${s.code})`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">{locale === 'ur' ? 'ذمہ دار استاد / معلم کا نام *' : 'Assigned Ustad / Teacher *'}</Label>
                      <Input placeholder="مولانا طارق صاحب / استاد احمد" value={newAssign.teacher} onChange={e => setNewAssign({...newAssign, teacher: e.target.value})} className="h-10 text-xs font-ur" required />
                    </div>
                    <DialogFooter>
                      <Button type="submit" variant="emerald" className="w-full font-bold">
                        <CheckCircle2 className="w-4 h-4 me-2" /> {locale === 'ur' ? 'تفویض مکمل کریں' : 'Confirm Assignment'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Hub */}
      <Tabs defaultValue="classes" className="w-full" dir={dir}>
        <TabsList className="w-full grid grid-cols-3 h-12 bg-card border border-border/80 rounded-xl p-1 shadow-sm">
          <TabsTrigger value="classes" className="font-bold text-xs sm:text-sm gap-2">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <span>{locale === 'ur' ? `1. درجات اور کلاسز (${classes.length})` : `1. Classes (${classes.length})`}</span>
          </TabsTrigger>
          <TabsTrigger value="sections" className="font-bold text-xs sm:text-sm gap-2">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{locale === 'ur' ? `2. سیکشنز کا انتظام (${sections.length})` : `2. Sections (${sections.length})`}</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="font-bold text-xs sm:text-sm gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{locale === 'ur' ? `3. مضامین اور اساتذہ (${assignments.length})` : `3. Subjects & Teachers`}</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CLASSES */}
        <TabsContent value="classes" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.filter(c => c.nameUrdu.includes(searchQuery) || c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cls) => (
              <Card key={cls.id} className="border-border/60 hover:border-primary/60 transition-all shadow-sm flex flex-col justify-between group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={
                        cls.levelType === 'hifz_nazra' ? 'success' : 
                        cls.levelType === 'tajweed' ? 'default' : 
                        cls.levelType === 'balighan' ? 'secondary' :
                        cls.levelType === 'takhassusat' ? 'destructive' : 'outline'
                      } 
                      className="text-[11px] font-bold"
                    >
                      {cls.levelType === 'hifz_nazra' ? (locale === 'ur' ? '1. شعبہ حفظ و ناظرہ' : 'Hifz & Nazra') :
                       cls.levelType === 'tajweed' ? (locale === 'ur' ? '2. شعبہ تجوید و قرآت' : 'Tajweed & Qiraat') :
                       cls.levelType === 'balighan' ? (locale === 'ur' ? '3. شعبہ تعلیم بالغان' : 'Adult Education') :
                       cls.levelType === 'takhassusat' ? (locale === 'ur' ? '5. شعبہ تخصصات' : 'Takhassusat') :
                       (locale === 'ur' ? '4. شعبہ کتب (درس نظامی)' : 'Dars-e-Nizami')}
                    </Badge>
                    <span className="text-xs font-bold text-muted-foreground font-en">{cls.capacity} Seats</span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {locale === 'ur' ? cls.nameUrdu : cls.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {cls.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">{locale === 'ur' ? 'فعال سیکشنز:' : 'Active Sections:'}</span>
                    <strong className="text-foreground font-bold font-en">{sections.filter(s => s.classId === cls.id).length} Sections</strong>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground">
                    <Edit className="w-3.5 h-3.5 me-1 text-primary shrink-0" /> {locale === 'ur' ? 'ترمیم کریں' : 'Edit'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteClass(cls.id, locale === 'ur' ? cls.nameUrdu : cls.name)}
                    className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 me-1 shrink-0" /> {locale === 'ur' ? 'حذف کریں' : 'Delete'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: SECTIONS */}
        <TabsContent value="sections" className="space-y-4 pt-2">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">{locale === 'ur' ? 'تمام درجات کے فعال سیکشنز اور اوقات کار' : 'All Active Sections & Shift Schedule'}</CardTitle>
              <CardDescription className="text-xs">{locale === 'ur' ? 'صبح، دوپہر اور شام کی شفٹوں کے لحاظ سے کمرہ اور گنجائش کی تفصیل' : 'Room numbers, shift schedule, and student capacity details'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'ur' ? 'سیکشن کا نام' : 'Section Name'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'متعلقہ درجہ / کلاس' : 'Parent Class'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'کمرہ / ہال نمبر' : 'Room Number'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'شفٹ (Shift)' : 'Shift'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'گنجائش' : 'Capacity'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'اقدامات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.filter(s => s.nameUrdu.includes(searchQuery) || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.classNameUrdu.includes(searchQuery)).map(sec => (
                    <TableRow key={sec.id}>
                      <TableCell className="font-bold text-xs text-primary">{locale === 'ur' ? sec.nameUrdu : sec.name}</TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{sec.classNameUrdu}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{sec.room}</TableCell>
                      <TableCell>
                        <Badge variant={sec.shift === 'morning' ? 'default' : sec.shift === 'afternoon' ? 'secondary' : 'outline'} className="text-[10px]">
                          {sec.shift === 'morning' ? (locale === 'ur' ? 'صبح' : 'Morning') :
                           sec.shift === 'afternoon' ? (locale === 'ur' ? 'دوپہر' : 'Afternoon') :
                           (locale === 'ur' ? 'شام' : 'Evening')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold font-en text-xs">{sec.capacity} Seats</TableCell>
                      <TableCell className="text-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteSection(sec.id, locale === 'ur' ? sec.nameUrdu : sec.name)}
                          className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: SUBJECTS & ASSIGNMENTS */}
        <TabsContent value="subjects" className="space-y-6 pt-2">
          {/* Assigned Subjects with Teachers */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{locale === 'ur' ? 'درجات کو تفویض کردہ مضامین اور ذمہ دار اساتذہ' : 'Assigned Subjects & Teaching Staff Mapping'}</span>
                </CardTitle>
                <CardDescription className="text-xs">{locale === 'ur' ? 'ہر درجہ کے لیے نصابی کتب اور متعلقہ معلم کی تفصیل' : 'Class subjects mapping to responsible Ustad / Teachers'}</CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-bold">{assignments.length} Active Maps</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'ur' ? 'متعلقہ درجہ' : 'Class / Grade'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'مضمون / درسی کتاب' : 'Subject Name'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'ذمہ دار استاد / معلم' : 'Assigned Ustad / Teacher'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'کریڈٹ / گھنٹے' : 'Credit Hours'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'تفویض ختم کریں' : 'Unassign'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((mapItem) => (
                    <TableRow key={mapItem.id}>
                      <TableCell className="font-bold text-xs text-foreground">{mapItem.classNameUrdu}</TableCell>
                      <TableCell className="font-bold text-xs text-primary">{mapItem.subjectNameUrdu}</TableCell>
                      <TableCell className="font-bold text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 py-3">
                        <UserCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{mapItem.teacher}</span>
                      </TableCell>
                      <TableCell className="font-en font-bold text-xs">{mapItem.credits} hrs/wk</TableCell>
                      <TableCell className="text-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteAssignment(mapItem.id)}
                          className="h-8 text-xs font-bold text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Master Subjects Directory */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">{locale === 'ur' ? 'جامعہ کی درسی کتب اور مضامین کا ماسٹر ریکارڈ' : 'Master Subjects & Textbooks Directory'}</CardTitle>
              <CardDescription className="text-xs">{locale === 'ur' ? 'کورس کوڈ، دینی یا عصری نوعیت اور امتحانی نمبرات' : 'Registered subject codes, type, and evaluation criteria'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((sub) => (
                  <div key={sub.id} className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-purple-500/50 transition-all shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 font-en">
                          {sub.code}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {sub.type === 'islamic' ? (locale === 'ur' ? 'دینی و مذہبی' : 'Islamic') : (locale === 'ur' ? 'لازمی عصری' : 'Compulsory')}
                        </Badge>
                      </div>
                      <p className="font-bold text-sm text-foreground">{locale === 'ur' ? sub.nameUrdu : sub.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 font-en">Max Marks: {sub.marks} | Pass: 40%</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteSubject(sub.id, locale === 'ur' ? sub.nameUrdu : sub.name)}
                      className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
                    >
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
