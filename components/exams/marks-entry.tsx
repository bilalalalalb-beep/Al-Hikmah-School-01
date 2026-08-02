"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Save, 
  Printer, 
  Sparkles, 
  Users, 
  GraduationCap, 
  Star,
  AlertCircle,
  Trophy,
  Filter,
  Database,
  RefreshCw,
  Trash2,
  Plus,
  UserCheck,
  ListChecks,
  FileText,
  Sliders,
  Search,
  LayoutGrid,
  User,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { ResultCardModal, ResultCardData, SubjectMarkItem } from './result-card-modal';
import { curriculumMap } from './exam-system-config';

export function MarksEntryDesk() {
  const { locale } = useLanguage();
  // View Modes: 'grid' (By-Class Matrix Roster), 'single' (Single Student Focus), 'roster' (Flat List)
  const [viewMode, setViewMode] = useState<'grid' | 'single' | 'roster'>('grid');
  const [marksList, setMarksList] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState('annual');
  const [selectedClass, setSelectedClass] = useState('c11');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [loadingDb, setLoadingDb] = useState(false);
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [dbSubjects, setDbSubjects] = useState<any[]>([]);
  const [dbClasses, setDbClasses] = useState<any[]>([]);
  const [dbClassSubjects, setDbClassSubjects] = useState<any[]>([]);
  const supabase = createClient();

  const fetchMarksFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data: resData } = await (supabase as any).from('exam_results').select('*').order('created_at', { ascending: false });
      const { data: stdData } = await (supabase as any).from('students').select('*');
      const { data: subData } = await (supabase as any).from('subjects').select('*');
      const { data: clsData } = await (supabase as any).from('classes').select('*').order('created_at', { ascending: true });
      const { data: csData } = await (supabase as any).from('class_subjects').select('*');

      if (csData) setDbClassSubjects(csData);

      if (clsData && clsData.length > 0) {
        setDbClasses(clsData);
        if (selectedClass === 'all' || selectedClass === 'c11') {
          setSelectedClass(clsData[0].id);
        }
      } else {
        setDbClasses([]);
      }

      if (stdData && stdData.length > 0) {
        setDbStudents(stdData);
      } else {
        setDbStudents([]);
      }
      if (subData && subData.length > 0) {
        setDbSubjects(subData);
      } else {
        setDbSubjects([]);
      }

      if (resData && resData.length > 0) {
        const mapped = resData.map((r: any) => {
          const std = stdData?.find((s: any) => s.id === r.student_id);
          const sub = subData?.find((s: any) => s.id === r.subject_id);

          let cId = r.class_id || 'c1';
          let cUr = 'قاعدہ (شعبہ حفظ و ناظرہ)';
          let cEn = 'c1: Qaida';
          if (cId === '11111111-1111-1111-1111-111111111105' || cId === 'c11') {
            cId = 'c11'; cUr = 'درجہ اولیٰ (عامہ اولیٰ - سال اول)'; cEn = 'c11: Ula (Year 1)';
          } else if (cId.startsWith('c')) {
            cUr = `درجہ ${cId}`; cEn = `Class ${cId}`;
          }

          return {
            id: r.id,
            studentId: r.student_id,
            regId: std ? std.registration_id : 'REG-2026-XXXX',
            nameUrdu: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'طالب علم',
            name: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'Student',
            classId: cId,
            classNameUrdu: cUr,
            classNameEn: cEn,
            subjectId: r.subject_id,
            subjectUrdu: sub ? (sub.title_ur || sub.name_ur) : 'نورانی قاعدہ',
            subjectEn: sub ? (sub.title_en || sub.name_en) : 'Noorani Qaida',
            total: r.total_marks || 100,
            obtained: r.obtained_marks !== null && r.obtained_marks !== undefined ? r.obtained_marks : '',
            grade: r.grade || '-',
            remarks: r.remarks || ''
          };
        });
        setMarksList(mapped);
      } else {
        setMarksList([]);
      }
    } catch (err) {
      console.error("Error fetching marks:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchMarksFromDb();
  }, []);

  // Calculate Auto Grade
  const calculateGrade = (obtained: number | string, total: number) => {
    if (obtained === '' || obtained === null || obtained === undefined || isNaN(Number(obtained))) return '-';
    const obtNum = Number(obtained);
    const pct = total > 0 ? (obtNum / total) * 100 : 0;
    if (pct >= 90) return 'mumtaz';
    if (pct >= 80) return 'jayyid_jiddan';
    if (pct >= 70) return 'jayyid';
    if (pct >= 60) return 'maqbool';
    return 'rasib';
  };

  // Derive configured subjects/books for the currently selected class based on class_subjects mapping
  const classBooks = useMemo(() => {
    // 1. Find all subject IDs mapped to this class in class_subjects
    const mappedSubjectIds = dbClassSubjects
      .filter((cs: any) => cs.class_id === selectedClass)
      .map((cs: any) => cs.subject_id);

    // 2. Filter subjects that are assigned to this class
    const dbMatchedSubs = dbSubjects.filter(sub => mappedSubjectIds.includes(sub.id));

    if (dbMatchedSubs && dbMatchedSubs.length > 0) {
      return dbMatchedSubs.map(s => ({
        id: s.id,
        titleUr: s.title_ur || s.name_ur || 'پرچہ / مضمون',
        titleEn: s.title_en || s.name_en || 'Paper',
        marks: s.total_marks || 100
      }));
    }

    return [];
  }, [selectedClass, dbSubjects, dbClassSubjects]);

  // Derive all students belonging to the currently selected class strictly from Database
  const classStudents = useMemo(() => {
    return dbStudents
      .filter((s: any) => s.current_class_id === selectedClass)
      .map((s: any) => {
        const clsObj = dbClasses.find(c => c.id === selectedClass);
        return {
          id: s.id,
          regId: s.registration_id || 'REG-2026-0000',
          nameUrdu: `${s.first_name} ${s.last_name || ''}`.trim(),
          nameEn: `${s.first_name} ${s.last_name || ''}`.trim(),
          classId: selectedClass,
          classNameUrdu: clsObj ? clsObj.name_ur : `درجہ`,
          classNameEn: clsObj ? clsObj.name_en : `Class`
        };
      });
  }, [selectedClass, dbStudents, dbClasses]);

  // Search Results across all students strictly in Database
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) return [];
    const q = searchQuery.toLowerCase().trim();
    
    return dbStudents
      .filter(s => {
        const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
        const reg = (s.registration_id || '').toLowerCase();
        return name.includes(q) || reg.includes(q);
      })
      .map(s => {
        const clsObj = dbClasses.find(c => c.id === s.current_class_id);
        return {
          id: s.id,
          regId: s.registration_id || 'REG-2026-0000',
          nameUrdu: `${s.first_name} ${s.last_name || ''}`.trim(),
          nameEn: `${s.first_name} ${s.last_name || ''}`.trim(),
          classId: s.current_class_id || 'c11',
          classNameUrdu: clsObj ? clsObj.name_ur : 'نامعلوم درجہ (ڈلیٹ شدہ)',
          classNameEn: clsObj ? clsObj.name_en : 'Unknown Class'
        };
      });
  }, [searchQuery, dbStudents, dbClasses]);

  // Handle selecting a student from search results (Auto-detects their class!)
  const handleSelectSearchedStudent = (student: any) => {
    setSelectedClass(student.classId || 'c11');
    setSelectedStudentId(student.id);
    setSearchQuery('');
    toast.success(locale === 'ur' ? `🎯 طالب علم "${student.nameUrdu}" منتخب! ان کا درجہ اور متعلقہ کتب لوڈ ہو گئیں!` : `🎯 Student "${student.nameEn}" selected! Class & books loaded!`);
  };

  // Ensure selected student ID is in current class
  useEffect(() => {
    if (classStudents && classStudents.length > 0) {
      if (!classStudents.some(s => s.id === selectedStudentId)) {
        setSelectedStudentId(classStudents[0].id);
      }
    } else {
      setSelectedStudentId('');
    }
  }, [classStudents, selectedStudentId]);

  const currentSingleStudent = useMemo(() => {
    return classStudents.find(s => s.id === selectedStudentId) || classStudents[0];
  }, [classStudents, selectedStudentId]);

  // Helper to get mark for a specific student and subject in Grid Mode
  const getStudentSubjectMark = (studentId: string, subjectId: string, defaultTotal: number) => {
    const found = marksList.find(m => (m.studentId === studentId || m.regId === studentId) && m.subjectId === subjectId);
    if (found) return found;
    return {
      id: `temp_${studentId}_${subjectId}`,
      studentId,
      regId: studentId,
      nameUrdu: 'طالب علم',
      name: 'Student',
      classId: selectedClass,
      classNameUrdu: 'درجہ',
      classNameEn: 'Class',
      subjectId,
      subjectUrdu: 'کتاب',
      subjectEn: 'Book',
      total: defaultTotal,
      obtained: '',
      grade: '-',
      remarks: ''
    };
  };

  // Handle mark change in Bulk Grid Mode (Instant matrix update!)
  const handleGridCellChange = (student: any, subject: any, newObtainedVal: any) => {
    const obtVal = newObtainedVal === '' ? '' : Number(newObtainedVal);
    const totNum = subject.marks || 100;
    const newGrade = calculateGrade(obtVal, totNum);

    let newMarksList = [...marksList];
    const idx = newMarksList.findIndex(m => (m.studentId === student.id || m.regId === student.regId) && m.subjectId === subject.id);

    if (idx >= 0) {
      newMarksList[idx] = {
        ...newMarksList[idx],
        obtained: obtVal,
        grade: newGrade
      };
    } else {
      newMarksList.push({
        id: `grid_${student.id}_${subject.id}`,
        studentId: student.id,
        regId: student.regId,
        nameUrdu: student.nameUrdu,
        name: student.nameEn || student.nameUrdu,
        classId: selectedClass,
        classNameUrdu: student.classNameUrdu || `درجہ ${selectedClass}`,
        classNameEn: `Class ${selectedClass}`,
        subjectId: subject.id,
        subjectUrdu: subject.titleUr,
        subjectEn: subject.titleEn,
        total: totNum,
        obtained: obtVal,
        grade: newGrade,
        remarks: ''
      });
    }

    setMarksList(newMarksList);
  };

  // Save All Marks to Supabase (Works for both Grid Mode and Single Mode)
  const handleSaveAll = async () => {
    if (classStudents.length === 0) {
      toast.error(locale === 'ur' ? 'اس درجے میں کوئی طالب علم موجود نہیں ہے!' : 'No students in this class!');
      return;
    }
    setIsSaving(true);
    try {
      let examId = '77777777-7777-7777-7777-777777777701';
      const { data: examsData } = await (supabase as any).from('exams').select('id').limit(1);
      if (examsData && examsData.length > 0) {
        examId = examsData[0].id;
      } else {
        await (supabase as any).from('exams').upsert([{
          id: examId,
          title_ur: 'سالانہ امتحان 1447ھ',
          title_en: 'Annual Examination 2026',
          exam_type: 'annual',
          start_date: '2026-06-01',
          end_date: '2026-06-15',
          is_published: true
        }]);
      }

      const rowsToSave: any[] = [];
      for (const std of classStudents) {
        for (const sub of classBooks) {
          const markObj = getStudentSubjectMark(std.id, sub.id, sub.marks);
          if (markObj.obtained !== '' && markObj.obtained !== null && markObj.obtained !== undefined) {
            rowsToSave.push({
              exam_id: examId,
              student_id: std.id,
              class_id: std.classId || selectedClass,
              subject_id: sub.id,
              total_marks: Number(markObj.total) || 100,
              obtained_marks: Number(markObj.obtained) || 0,
              grade: markObj.grade !== '-' ? markObj.grade : calculateGrade(markObj.obtained, markObj.total),
              remarks: markObj.remarks || (locale === 'ur' ? 'بہترین کارکردگی' : 'Good performance')
            });
          }
        }
      }

      if (rowsToSave.length > 0) {
        await (supabase as any).from('exam_results').upsert(rowsToSave, { onConflict: 'exam_id, student_id, subject_id' });
        toast.success(locale === 'ur' ? '🎉 الحمد للہ! اس درجے کے تمام طلباء اور کتب کے نمبرات لائیو Supabase میں محفوظ ہو گئے!' : '🎉 All student marks for this class saved to live DB!');
        await fetchMarksFromDb();
      } else {
        toast.error(locale === 'ur' ? 'براہ کرم کم از کم کسی ایک خانے میں نمبرات درج کریں!' : 'Please enter marks in at least one cell!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving marks to DB');
    } finally {
      setIsSaving(false);
    }
  };

  // Result Card Modal State
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [activeResultCard, setActiveResultCard] = useState<ResultCardData | null>(null);

  // Generate & Preview Kashf-ul-Darajat for ANY student
  const handlePreviewStudentCard = (student: any) => {
    if (!student) {
      toast.error(locale === 'ur' ? 'براہ کرم پہلے طالب علم منتخب کریں!' : 'Please select a student first!');
      return;
    }
    const fullStd = dbStudents.find(s => s.id === student.id);
    const subjects: SubjectMarkItem[] = classBooks.map(sub => {
      const markObj = getStudentSubjectMark(student.id, sub.id, sub.marks);
      const obtNum = markObj.obtained !== '' && markObj.obtained !== null ? Number(markObj.obtained) : 0;
      return {
        subjectUrdu: sub.titleUr,
        subjectEn: sub.titleEn,
        totalMarks: Number(markObj.total) || 100,
        obtainedMarks: obtNum,
        grade: markObj.grade !== '-' ? markObj.grade : calculateGrade(obtNum, sub.marks),
        remarks: markObj.remarks || ''
      };
    });

    const tot = subjects.reduce((acc, curr) => acc + curr.totalMarks, 0);
    const obt = subjects.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
    const pct = tot > 0 ? (obt / tot) * 100 : 0;
    const overallGrade = calculateGrade(obt, tot);

    const positionStr = pct >= 90 && obt > 0 ? (locale === 'ur' ? 'پوزیشن: اول (1st Position)' : '1st Position 🏆') :
                        pct >= 84 && obt > 0 ? (locale === 'ur' ? 'پوزیشن: دوم (2nd Position)' : '2nd Position 🥈') :
                        pct >= 75 && obt > 0 ? (locale === 'ur' ? 'پوزیشن: سوم (3rd Position)' : '3rd Position 🥉') : undefined;

    const cardPayload: ResultCardData = {
      examTitleUrdu: selectedExam === 'annual' ? 'سالانہ امتحان 1447ھ (عصری و دینی علوم)' : 'امتحانی جائزہ ٹیسٹ 1447ھ',
      examTitleEn: selectedExam === 'annual' ? 'Annual Examination 2026' : 'Evaluation Examination 2026',
      studentNameUrdu: student.nameUrdu,
      studentNameEn: student.nameEn || student.nameUrdu,
      regId: student.regId,
      fatherNameUrdu: fullStd ? (fullStd.father_name || 'عبداللہ خان قادری') : 'عبداللہ خان قادری',
      fatherNameEn: 'Abdullah Khan',
      classNameUrdu: student.classNameUrdu || `درجہ ${selectedClass}`,
      classNameEn: `Class ${selectedClass}`,
      subjects,
      totalMarks: tot,
      obtainedMarks: obt,
      percentage: pct,
      overallGrade: overallGrade === 'mumtaz' ? 'ممتاز (A+ Distinction)' :
                    overallGrade === 'jayyid_jiddan' ? 'جید جدا (Very Good A)' :
                    overallGrade === 'jayyid' ? 'جید (Good B)' : 'مقبول (Pass C)',
      position: positionStr,
      issueDate: new Date().toISOString().split('T')[0]
    };

    setActiveResultCard(cardPayload);
    setResultModalOpen(true);
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'mumtaz':
        return <Badge className="bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/30 font-bold px-2 py-0.5 text-[11px] gap-1 shadow-sm"><Star className="w-3 h-3 inline text-amber-500 fill-amber-500" /> ممتاز (A+)</Badge>;
      case 'jayyid_jiddan':
        return <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-bold px-2 py-0.5 text-[11px]">جید جدا (A)</Badge>;
      case 'jayyid':
        return <Badge className="bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/30 font-bold px-2 py-0.5 text-[11px]">جید (B)</Badge>;
      case 'maqbool':
        return <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30 font-bold px-2 py-0.5 text-[11px]">مقبول (C)</Badge>;
      case '-':
        return <Badge variant="outline" className="font-bold px-2 py-0.5 text-[11px] text-muted-foreground">-</Badge>;
      default:
        return <Badge variant="destructive" className="font-bold px-2 py-0.5 text-[11px]">راسب (Fail)</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-ur">
      {/* Search Bar & Mode Selector Box */}
      <Card className="border-purple-500/30 shadow-md bg-gradient-to-r from-purple-900/5 via-card to-indigo-900/5">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Student Search Box (Auto-detects Class!) */}
            <div className="relative w-full md:w-1/2">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute right-3 text-purple-600 dark:text-purple-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder={locale === 'ur' ? '🔍 کسی بھی طالب علم کا نام یا REG ID لکھیں (متعلقہ درجہ و کتب خودکار لوڈ ہوں گی)...' : '🔍 Search student name or ID (Auto-detects class & books)...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-12 font-bold text-xs sm:text-sm bg-background border-purple-500/40 shadow-inner focus:ring-2 focus:ring-purple-500 w-full"
                />
              </div>
              {/* Live Search Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-card border border-purple-500/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-1">
                  <div className="text-[10px] font-extrabold text-muted-foreground px-2 py-1 bg-muted/50 rounded">{locale === 'ur' ? 'تلاش کے نتائج (کلک کریں تاکہ طالب علم اور ان کا درجہ لوڈ ہو)' : 'Search Results (Click to load student & class)'}</div>
                  {searchResults.map(res => (
                    <div
                      key={res.id}
                      onClick={() => handleSelectSearchedStudent(res)}
                      className="p-2.5 rounded-lg hover:bg-purple-500/10 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-purple-500/30"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-foreground">{locale === 'ur' ? res.nameUrdu : res.nameEn}</p>
                          <p className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-bold">{res.regId}</p>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">{res.classId}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border/80 shadow-inner w-full md:w-auto overflow-x-auto">
              <Button
                type="button"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`font-bold text-xs gap-1.5 shrink-0 ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-md' : 'text-muted-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{locale === 'ur' ? '📊 درجہ وار میٹرکس ٹیبل (آسان ترین)' : '📊 By-Class Grid Matrix'}</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === 'single' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('single')}
                className={`font-bold text-xs gap-1.5 shrink-0 ${viewMode === 'single' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground'}`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{locale === 'ur' ? '👤 سنگل طالب علم انٹری' : '👤 Single Student Focus'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Exam & Class Selector Card */}
      <Card className="border-border/60 shadow-sm bg-card/95 backdrop-blur-md">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Award className="w-3.5 h-3.5 text-primary" />
                <span>{locale === 'ur' ? 'امتحانی ٹرم منتخب کریں' : 'Select Examination Term'}</span>
              </Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="h-11 font-bold text-xs sm:text-sm font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="annual" className="font-bold">{locale === 'ur' ? '🏆 سالانہ امتحان (Annual Exam)' : '🏆 Annual Exam'}</SelectItem>
                  <SelectItem value="mid_term" className="font-bold">{locale === 'ur' ? '📝 شش ماہی امتحان (6-Month / Half-Yearly)' : '📝 6-Month Half-Yearly'}</SelectItem>
                  <SelectItem value="quarterly" className="font-bold">{locale === 'ur' ? '📅 سہ ماہی امتحان (3-Month / Quarterly)' : '📅 3-Month Quarterly'}</SelectItem>
                  <SelectItem value="four_month" className="font-bold">{locale === 'ur' ? '📖 چار ماہی امتحان (4-Month Major Exam)' : '📖 4-Month Major Exam'}</SelectItem>
                  <SelectItem value="monthly" className="font-bold">{locale === 'ur' ? '📊 یک ماہی جائزہ ٹیسٹ (Monthly Eval)' : '📊 Monthly Evaluation Test'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>{locale === 'ur' ? 'درجہ / کلاس منتخب کریں (اس درجے کے طلباء اور متعلقہ کتب شو ہوں گی)' : 'Select Class / Grade (Shows its students & books)'}</span>
              </Label>
              <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); }}>
                <SelectTrigger className="h-11 font-bold text-xs sm:text-sm font-ur bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-100"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur max-h-72">
                  {dbClasses.length > 0 ? (
                    dbClasses.map(c => (
                      <SelectItem key={c.id} value={c.id} className="font-bold">
                        {locale === 'ur' ? c.name_ur : c.name_en}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled className="font-bold">
                      {locale === 'ur' ? 'کوئی درجہ موجود نہیں' : 'No Classes Found'}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIEW MODE 1: BY-CLASS MATRIX ROSTER (درجہ وار یکجا مارکس انٹری - پوری کلاس اور تمام کتب ایک ساتھ) */}
      {viewMode === 'grid' && (
        <Card className="border-border/60 shadow-xl border-t-8 border-t-purple-600 bg-gradient-to-b from-card via-card to-purple-500/5 animate-in fade-in-50 duration-200">
          <CardHeader className="bg-purple-500/10 border-b border-border/60 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shrink-0">
                <LayoutGrid className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-purple-600 text-white font-mono text-xs px-2 py-0.5">{selectedClass}</Badge>
                  <Badge variant="outline" className="text-purple-800 dark:text-purple-300 border-purple-500/40 text-xs">{locale === 'ur' ? `کل کتب / پرچے: ${classBooks.length}` : `Total Books: ${classBooks.length}`}</Badge>
                </div>
                <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                  <span>{locale === 'ur' ? `درجہ وار مارکس انٹری ڈیسک (${selectedClass})` : `Class Matrix Marksheet (${selectedClass})`}</span>
                  <Sparkles className="w-5 h-5 text-amber-500 inline animate-pulse" />
                </CardTitle>
                <CardDescription className="text-xs text-purple-950 dark:text-purple-200 font-bold mt-0.5">
                  {locale === 'ur' ? 'اس درجے کے تمام طلباء بائیں طرف اور مقررہ کتب اوپر کالمز میں موجود ہیں، بس نمبرات ڈالتے جائیں!' : 'All students as rows & configured class books as columns. Type marks to auto-compute results!'}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button onClick={handleSaveAll} disabled={isSaving} variant="emerald" size="sm" className="font-bold text-xs gap-1.5 shadow-md shrink-0">
                <Save className="w-4 h-4 shrink-0" />
                <span>{isSaving ? (locale === 'ur' ? 'محفوظ ہو رہا ہے...' : 'Saving...') : (locale === 'ur' ? '💾 اس درجے کا مکمل رزلٹ محفوظ کریں' : '💾 Save Class Results')}</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 border-b-2 border-purple-500/30">
                  <TableHead className="w-12 text-center font-black">#</TableHead>
                  <TableHead className="min-w-[200px] font-black text-foreground">{locale === 'ur' ? 'طالب علم کا نام و ID' : 'Student Name & ID'}</TableHead>
                  {classBooks.map((sub, idx) => (
                    <TableHead key={sub.id} className="text-center min-w-[130px] font-extrabold bg-purple-500/5 border-x border-border/40 py-3">
                      <div className="text-xs text-purple-700 dark:text-purple-300 font-extrabold leading-tight">{locale === 'ur' ? sub.titleUr : sub.titleEn}</div>
                      <div className="text-[10px] font-mono font-bold text-muted-foreground mt-0.5">{locale === 'ur' ? `کل نمبر: ${sub.marks}` : `Max: ${sub.marks}`}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[130px] font-black bg-blue-500/5 text-blue-700 dark:text-blue-300">{locale === 'ur' ? 'کل حاصل کردہ / فیصد' : 'Total & %'}</TableHead>
                  <TableHead className="text-center min-w-[110px] font-black">{locale === 'ur' ? 'تقدیر (Division)' : 'Grade'}</TableHead>
                  <TableHead className="text-end min-w-[120px] font-black">{locale === 'ur' ? 'کشف الدرجات' : 'Result Card'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={classBooks.length + 5} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <Users className="w-8 h-8 animate-pulse" />
                        </div>
                        <h4 className="text-lg font-extrabold text-foreground">
                          {locale === 'ur' ? `درجہ "${selectedClass}" میں ابھی کوئی طالب علم موجود نہیں ہے!` : `No students found in class "${selectedClass}"!`}
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-md text-center font-bold">
                          {locale === 'ur' ? 'براہ کرم شعبہ داخلہ و طلباء سے حقیقی طلباء کا اندراج کریں اور متعلقہ کتب شامل کریں تاکہ کوئی کنفیوژن نہ رہے۔' : 'Please register students and add their corresponding subjects directly into the live database.'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  classStudents.map((std, sIdx) => {
                    let stdTotalObt = 0;
                    let stdTotalMax = 0;
                    classBooks.forEach(sub => {
                      const markObj = getStudentSubjectMark(std.id, sub.id, sub.marks);
                      if (markObj.obtained !== '' && markObj.obtained !== null && !isNaN(Number(markObj.obtained))) {
                        stdTotalObt += Number(markObj.obtained);
                      }
                      stdTotalMax += markObj.total;
                    });
                    const stdPct = stdTotalMax > 0 ? (stdTotalObt / stdTotalMax) * 100 : 0;
                    const stdOverallGrade = calculateGrade(stdTotalObt, stdTotalMax);

                    return (
                      <TableRow key={std.id} className="hover:bg-purple-500/10 transition-colors border-b border-border/40">
                        <TableCell className="text-center font-mono font-bold text-muted-foreground">{sIdx + 1}</TableCell>
                        <TableCell className="font-extrabold text-sm py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">{std.regId}</span>
                          </div>
                          <div className="text-base font-black text-foreground mt-0.5">{locale === 'ur' ? std.nameUrdu : std.nameEn}</div>
                        </TableCell>
                        
                        {classBooks.map(sub => {
                          const markObj = getStudentSubjectMark(std.id, sub.id, sub.marks);
                          return (
                            <TableCell key={sub.id} className="text-center border-x border-border/40 p-2">
                              <Input
                                type="number"
                                min="0"
                                max={sub.marks}
                                value={markObj.obtained}
                                placeholder="0"
                                onChange={(e) => handleGridCellChange(std, sub, e.target.value)}
                                className="h-10 w-24 text-center font-mono font-black text-base bg-background border-purple-500/60 text-purple-700 dark:text-purple-200 mx-auto shadow-inner focus:ring-2 focus:ring-purple-500"
                              />
                            </TableCell>
                          );
                        })}

                        <TableCell className="text-center bg-blue-500/5 font-mono">
                          <div className="text-base font-black text-blue-600 dark:text-blue-400">{stdTotalObt} / {stdTotalMax}</div>
                          <div className="text-xs font-bold text-muted-foreground mt-0.5">{stdPct.toFixed(1)}%</div>
                        </TableCell>

                        <TableCell className="text-center">
                          {getGradeBadge(stdOverallGrade)}
                        </TableCell>

                        <TableCell className="text-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewStudentCard(std)}
                            className="font-bold text-xs gap-1 border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{locale === 'ur' ? 'پرنٹ' : 'Print Card'}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 border-t border-border/60 flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground">
              {locale === 'ur' ? '💡 ٹِپ: ٹیبل کے کسی بھی خانے (Cell) میں نمبر لکھتے جائیں، کل نمبر اور تقدیر خودکار بنتی جائے گی!' : '💡 Tip: Type marks across cells. Totals and grades compute automatically for the entire class!'}
            </p>
          </CardFooter>
        </Card>
      )}

      {/* VIEW MODE 2: SINGLE STUDENT FOCUS MODE (سنگل طالب علم کا فوکس ویو) */}
      {viewMode === 'single' && (
        <Card className="border-border/60 shadow-lg border-t-8 border-t-primary bg-gradient-to-b from-card via-card to-primary/5 animate-in fade-in-50 duration-200">
          <CardHeader className="bg-primary/10 border-b border-border/60 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center shadow-lg shrink-0">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground">
                    {locale === 'ur' ? 'سنگل طالب علم وار مارکس انٹری' : 'Single Student Focus Marksheet'}
                  </CardTitle>
                  <CardDescription className="text-xs font-bold mt-0.5">
                    {locale === 'ur' ? 'اس درجے کے کسی ایک طالب علم کو سلیکٹ کریں اور ان کی تمام کتب کے نمبرات درج کریں:' : 'Select a student from this class to focus solely on their subjects:'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 max-w-sm">
                <Label className="text-xs font-bold shrink-0">{locale === 'ur' ? 'طالب علم منتخب کریں:' : 'Select Student:'}</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={classStudents.length === 0}>
                  <SelectTrigger className="h-10 font-bold text-xs font-ur bg-background border-primary/40"><SelectValue placeholder={locale === 'ur' ? 'طالب علم منتخب کریں' : 'Select Student'} /></SelectTrigger>
                  <SelectContent className="font-ur">
                    {classStudents.map(std => (
                      <SelectItem key={std.id} value={std.id} className="font-bold">
                        👤 {locale === 'ur' ? std.nameUrdu : std.nameEn} <span className="font-mono text-[10px] text-muted-foreground">({std.regId})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button onClick={() => handlePreviewStudentCard(currentSingleStudent)} disabled={!currentSingleStudent} variant="outline" size="sm" className="font-bold text-xs gap-1.5 border-primary/50 text-primary hover:bg-primary/10 shadow-sm">
                <Printer className="w-4 h-4 text-primary shrink-0" />
                <span>{locale === 'ur' ? '🖨️ اس طالب علم کا رزلٹ کارڈ پرنٹ کریں' : '🖨️ Print Student Result Card'}</span>
              </Button>
              <Button onClick={handleSaveAll} disabled={isSaving || classStudents.length === 0} variant="emerald" size="sm" className="font-bold text-xs gap-1.5 shadow-md shrink-0">
                <Save className="w-4 h-4 shrink-0" />
                <span>{isSaving ? (locale === 'ur' ? 'محفوظ ہو رہا ہے...' : 'Saving...') : (locale === 'ur' ? '💾 نمبرات محفوظ کریں' : '💾 Save Marks')}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {classStudents.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 animate-pulse" />
                <h4 className="text-lg font-extrabold text-foreground mb-1">
                  {locale === 'ur' ? `درجہ "${selectedClass}" میں ابھی کوئی طالب علم موجود نہیں ہے!` : `No students found in class "${selectedClass}"!`}
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4 font-bold">
                  {locale === 'ur' ? 'براہ کرم شعبہ داخلہ و طلباء سے حقیقی طلباء کا اندراج کریں تاکہ رزلٹ مرتب کیا جا سکے۔' : 'Please register students directly into the live database to enter marks.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-12 text-center font-extrabold">#</TableHead>
                    <TableHead className="font-extrabold">{locale === 'ur' ? 'مضمون / کتاب کا نام' : 'Subject / Book'}</TableHead>
                    <TableHead className="text-center w-32 font-extrabold">{locale === 'ur' ? 'کل نمبر' : 'Total Max'}</TableHead>
                    <TableHead className="text-center w-36 font-extrabold">{locale === 'ur' ? 'حاصل کردہ نمبر' : 'Obtained'}</TableHead>
                    <TableHead className="text-center w-36 font-extrabold">{locale === 'ur' ? 'تقدیر (Grade)' : 'Grade'}</TableHead>
                    <TableHead className="font-extrabold">{locale === 'ur' ? 'ممتحن کے ریمارکس' : 'Remarks'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classBooks.map((sub, idx) => {
                    const markObj = getStudentSubjectMark(currentSingleStudent?.id || '', sub.id, sub.marks);
                    return (
                      <TableRow key={sub.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="text-center font-mono font-bold text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="font-extrabold text-base text-foreground py-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary shrink-0" />
                            <span>{locale === 'ur' ? sub.titleUr : sub.titleEn}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-sm text-muted-foreground">{sub.marks}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max={sub.marks}
                            value={markObj.obtained}
                            placeholder="0"
                            onChange={(e) => handleGridCellChange(currentSingleStudent, sub, e.target.value)}
                            className="h-10 w-28 text-center font-mono font-black text-base bg-background border-primary/60 text-primary mx-auto shadow-inner focus:ring-2 focus:ring-primary"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {getGradeBadge(markObj.grade)}
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder={locale === 'ur' ? 'مثلاً: بہترین کارکردگی...' : 'e.g. Excellent effort...'}
                            value={markObj.remarks}
                            onChange={(e) => {
                              let newMarksList = [...marksList];
                              const idx = newMarksList.findIndex(m => (m.studentId === currentSingleStudent.id || m.regId === currentSingleStudent.regId) && m.subjectId === sub.id);
                              if (idx >= 0) {
                                newMarksList[idx] = { ...newMarksList[idx], remarks: e.target.value };
                              } else {
                                newMarksList.push({ ...markObj, remarks: e.target.value });
                              }
                              setMarksList(newMarksList);
                            }}
                            className="h-9 text-xs font-ur bg-background w-full"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Result Card Preview Modal */}
      <ResultCardModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        resultData={activeResultCard}
      />
    </div>
  );
}
