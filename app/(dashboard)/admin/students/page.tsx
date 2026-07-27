"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromotionDialog } from '@/components/students/promotion-dialog';
import { ViewStudentModal } from '@/components/students/view-student-modal';
import { EditStudentModal } from '@/components/students/edit-student-modal';
import { IdCardsDesk } from '@/components/students/id-cards-desk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Sparkles,
  RefreshCw,
  Database,
  CalendarDays,
  Users,
  Coins
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface StudentRecord {
  id: string;
  registration_id: string;
  first_name: string;
  last_name?: string;
  gender: string;
  current_class_id?: string;
  father_name: string;
  father_phone: string;
  admission_date?: string;
  status: string;
  is_orphan?: boolean;
  is_zakat_eligible?: boolean;
}

const classNamesMap: Record<string, { ur: string; en: string }> = {
  '11111111-1111-1111-1111-111111111101': { ur: 'درجہ اول (ناظرہ)', en: 'Grade 1 (Nazira)' },
  '11111111-1111-1111-1111-111111111102': { ur: 'درجہ پنجم (پرائمری)', en: 'Grade 5 (Primary)' },
  '11111111-1111-1111-1111-111111111103': { ur: 'درجہ دہم (سائنس)', en: 'Grade 10 (Science)' },
  '11111111-1111-1111-1111-111111111104': { ur: 'شعبہ حفظ القرآن', en: 'Hifz al-Quran' },
  '11111111-1111-1111-1111-111111111105': { ur: 'درس نظامی سال اول', en: 'Dars-e-Nizami Y1' },
  '11111111-1111-1111-1111-111111111106': { ur: 'دورہ حدیث (عالمیت)', en: 'Dora-e-Hadith' },
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);
  
  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Advanced Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedFinStatus, setSelectedFinStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const { locale } = useLanguage();
  const supabase = createClient();

  const fetchStudentsFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data, error } = await (supabase as any)
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
      } else if (data) {
        setStudents(data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchStudentsFromDb();
  }, []);

  const handleSeedStudents = async () => {
    setSeedingDb(true);
    try {
      const sampleRows = [
        { registration_id: 'REG-2026-0001', first_name: 'محمد', last_name: 'عثمان', gender: 'male', current_class_id: '11111111-1111-1111-1111-111111111103', father_name: 'طارق احمد', father_phone: '0300-9876543', status: 'active', admission_date: '2026-01-10', is_orphan: true, is_zakat_eligible: true },
        { registration_id: 'REG-2026-0012', first_name: 'طلحہ', last_name: 'محمود', gender: 'male', current_class_id: '11111111-1111-1111-1111-111111111104', father_name: 'محمود علی', father_phone: '0321-1234567', status: 'active', admission_date: '2026-02-15', is_orphan: false, is_zakat_eligible: false },
        { registration_id: 'REG-2026-0045', first_name: 'عائشہ', last_name: 'صدیقہ', gender: 'female', current_class_id: '11111111-1111-1111-1111-111111111102', father_name: 'صدیق الرحمان', father_phone: '0332-9988776', status: 'active', admission_date: '2025-06-14', is_orphan: false, is_zakat_eligible: true }
      ];

      const { error } = await (supabase as any).from('students').upsert(sampleRows, { onConflict: 'registration_id' });
      if (error) {
        toast.error(locale === 'ur' ? `ڈیٹا بیس ایرر: ${error.message}` : `DB Error: ${error.message}`);
      } else {
        await fetchStudentsFromDb();
        toast.success(locale === 'ur' ? `🎉 الحمد للہ! 3 حقیقی طلباء کا ڈیٹا لائیو Supabase میں شامل ہو گیا!` : `🎉 3 authentic students seeded into live Supabase DB!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    } finally {
      setSeedingDb(false);
    }
  };

  const handleOpenViewModal = (student: StudentRecord) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentRecord) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(locale === 'ur' ? `کیا آپ واقعی "${studentName}" کو ریکارڈ سے (Delete) کرنا چاہتے ہیں؟ یہ عمل ناقابل واپسی ہے۔` : `Are you sure you want to delete "${studentName}"? This action cannot be undone.`)) {
      try {
        const { error } = await (supabase as any).from('students').delete().eq('id', studentId);
        
        if (error) {
          console.error("Delete Error:", error);
          toast.error(locale === 'ur' ? 'ڈیلیٹ کرنے میں مسئلہ پیش آیا۔ (Error: ' + error.message + ')' : 'Error deleting student: ' + error.message);
        } else {
          toast.success(locale === 'ur' ? 'طالب علم کا ریکارڈ کامیابی سے ڈیلیٹ ہو گیا' : 'Student deleted successfully');
          await fetchStudentsFromDb();
        }
      } catch (err: any) {
        toast.error(locale === 'ur' ? 'ڈیلیٹ کرنے میں مسئلہ پیش آیا۔' : 'An error occurred during deletion.');
      }
    }
  };

  const filteredStudents = students.filter(s => {
    // 1. Search Query (Name, ID, Father)
    const fullName = `${s.first_name} ${s.last_name || ''}`.trim().toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          (s.registration_id && s.registration_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (s.father_name && s.father_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 2. Class Filter
    const classNameObj = s.current_class_id ? classNamesMap[s.current_class_id] : null;
    const classStr = classNameObj ? `${classNameObj.ur} ${classNameObj.en}` : '';
    const matchesClass = selectedClass === 'all' || classStr.toLowerCase().includes(selectedClass.toLowerCase());

    // 3. Gender Filter
    const matchesGender = selectedGender === 'all' || s.gender === selectedGender;

    // 4. Financial Status Filter (Orphan / Zakat)
    let matchesFinStatus = true;
    if (selectedFinStatus === 'orphan') matchesFinStatus = !!s.is_orphan;
    if (selectedFinStatus === 'zakat') matchesFinStatus = !!s.is_zakat_eligible;
    if (selectedFinStatus === 'regular') matchesFinStatus = !s.is_orphan && !s.is_zakat_eligible;

    // 5. Year & Month Admission Filters
    let matchesYear = true;
    let matchesMonth = true;
    if (s.admission_date) {
      const dateParts = s.admission_date.split('-'); // YYYY-MM-DD
      if (dateParts.length === 3) {
        if (selectedYear !== 'all' && dateParts[0] !== selectedYear) matchesYear = false;
        if (selectedMonth !== 'all' && dateParts[1] !== selectedMonth) matchesMonth = false;
      }
    } else {
      if (selectedYear !== 'all' || selectedMonth !== 'all') {
        matchesYear = false;
        matchesMonth = false;
      }
    }

    return matchesSearch && matchesClass && matchesGender && matchesFinStatus && matchesYear && matchesMonth;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 font-ur">
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2 bg-slate-200/50">
          <TabsTrigger value="students" className="font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            {locale === 'ur' ? 'طلباء کا ریکارڈ' : 'Students Record'}
          </TabsTrigger>
          <TabsTrigger value="id-cards" className="font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            {locale === 'ur' ? 'آئی ڈی کارڈز' : 'ID Cards'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-6 mt-0">
          {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-bold gap-1">
              <Database className="w-3.5 h-3.5 animate-pulse" />
              <span>{locale === 'ur' ? 'لائیو Supabase ڈیٹا بیس کنیکٹڈ' : 'Live Supabase DB Connected'}</span>
            </Badge>
            {loadingDb && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> {locale === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-primary shrink-0" />
            <span>{locale === 'ur' ? 'طلباء و طالبات کا مرکزی ریکارڈ' : 'Student Master Directory'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            {locale === 'ur' ? 'ماڈیول 2: تمام طلباء کا لائیو ڈیٹا بیس، فلٹریشن، ترمیم اور شناختی کارڈ پرنٹنگ۔' : 'Module 2: Complete student database with advanced filtering, editing, and ID Card printing.'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleSeedStudents} 
            disabled={seedingDb}
            className="font-bold border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{seedingDb ? (locale === 'ur' ? 'ڈیٹا ڈالا جا رہا ہے...' : 'Seeding...') : (locale === 'ur' ? '⚡ لائیو DB میں 3 مستند طلباء ڈالیں' : 'Seed 3 Authentic Students')}</span>
          </Button>
          <PromotionDialog studentCount={filteredStudents.length} />
          <Link href="/clerk/admissions">
            <Button variant="emerald" size="sm" className="font-bold shadow-sm">
              <UserPlus className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'نیا داخلہ کریں' : 'New Admission'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Advanced Filtration System */}
      <Card className="border-border/60 shadow-sm border-t-4 border-t-primary">
        <CardHeader className="pb-2 bg-muted/20">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span>{locale === 'ur' ? 'جدید فلٹریشن سسٹم (Advanced Filters)' : 'Advanced Filtration System'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Name/ID Search */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? 'نام، ID، یا والد سے تلاش' : 'Search Name, ID, Father'}</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder={locale === 'ur' ? 'تلاش کریں...' : 'Search...'} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 h-9 text-xs font-ur"
                />
              </div>
            </div>

            {/* 2. Class Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? 'موجودہ درجہ / کلاس' : 'Class / Grade'}</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-9 text-xs font-ur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'تمام درجات' : 'All Classes'}</SelectItem>
                  <SelectItem value="Grade">{locale === 'ur' ? 'عصری درجات' : 'School Grades'}</SelectItem>
                  <SelectItem value="Hifz">{locale === 'ur' ? 'شعبہ حفظ' : 'Hifz'}</SelectItem>
                  <SelectItem value="Dars">{locale === 'ur' ? 'درس نظامی' : 'Dars-e-Nizami'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Gender Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? 'صنف (لڑکے / لڑکیاں)' : 'Gender (Boys / Girls)'}</label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="h-9 text-xs font-ur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'لڑکے اور لڑکیاں' : 'Both (All)'}</SelectItem>
                  <SelectItem value="male">{locale === 'ur' ? 'صرف طلباء (لڑکے)' : 'Boys Only'}</SelectItem>
                  <SelectItem value="female">{locale === 'ur' ? 'صرف طالبات (لڑکیاں)' : 'Girls Only'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Financial / Zakat Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? 'مالیاتی حیثیت (Financial Status)' : 'Financial Status'}</label>
              <Select value={selectedFinStatus} onValueChange={setSelectedFinStatus}>
                <SelectTrigger className="h-9 text-xs font-ur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'تمام طلباء' : 'All Students'}</SelectItem>
                  <SelectItem value="orphan">{locale === 'ur' ? 'صرف یتیم طلباء' : 'Orphans Only'}</SelectItem>
                  <SelectItem value="zakat">{locale === 'ur' ? 'مستحقِ زکوۃ طلباء' : 'Zakat Eligible Only'}</SelectItem>
                  <SelectItem value="regular">{locale === 'ur' ? 'ریگولر (غیر مستحق)' : 'Regular (Paying)'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Admission Year Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? 'سالِ داخلہ (Admission Year)' : 'Admission Year'}</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-9 text-xs font-ur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'تمام سال' : 'All Years'}</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. Admission Month Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? 'ماہِ داخلہ (Admission Month)' : 'Admission Month'}</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-9 text-xs font-ur">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'تمام مہینے' : 'All Months'}</SelectItem>
                  <SelectItem value="01">January (01)</SelectItem>
                  <SelectItem value="02">February (02)</SelectItem>
                  <SelectItem value="03">March (03)</SelectItem>
                  <SelectItem value="04">April (04)</SelectItem>
                  <SelectItem value="05">May (05)</SelectItem>
                  <SelectItem value="06">June (06)</SelectItem>
                  <SelectItem value="07">July (07)</SelectItem>
                  <SelectItem value="08">August (08)</SelectItem>
                  <SelectItem value="09">September (09)</SelectItem>
                  <SelectItem value="10">October (10)</SelectItem>
                  <SelectItem value="11">November (11)</SelectItem>
                  <SelectItem value="12">December (12)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Total Count Display */}
            <div className="lg:col-span-2 flex items-end justify-end">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1.5 text-xs font-bold gap-2">
                <Users className="w-4 h-4" />
                <span>{locale === 'ur' ? 'فلٹر شدہ طلباء:' : 'Filtered Students:'} <strong>{filteredStudents.length}</strong></span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">{locale === 'ur' ? 'رجسٹرڈ طلباء کی فہرست (لائیو DB)' : 'Enrolled Students List (Live DB)'}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchStudentsFromDb} className="h-8 gap-1 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? 'animate-spin' : ''}`} />
            <span>{locale === 'ur' ? 'تازہ کریں' : 'Refresh'}</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">{locale === 'ur' ? 'رجسٹریشن نمبر' : 'Registration ID'}</TableHead>
                <TableHead>{locale === 'ur' ? 'نام طالب علم' : 'Student Name'}</TableHead>
                <TableHead>{locale === 'ur' ? 'موجودہ درجہ / کلاس' : 'Current Class / Grade'}</TableHead>
                <TableHead>{locale === 'ur' ? 'رابطہ نمبر' : 'Contact Phone'}</TableHead>
                <TableHead>{locale === 'ur' ? 'تاریخِ داخلہ' : 'Admission Date'}</TableHead>
                <TableHead>{locale === 'ur' ? 'مالی حیثیت' : 'Financial Status'}</TableHead>
                <TableHead className="text-end">{locale === 'ur' ? 'اقدام' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => {
                  const classObj = s.current_class_id ? classNamesMap[s.current_class_id] : null;
                  const className = classObj ? (locale === 'ur' ? classObj.ur : classObj.en) : (locale === 'ur' ? 'تعین نہیں ہوا' : 'Unassigned');
                  const fullName = `${s.first_name} ${s.last_name || ''}`.trim();
                  const genderText = s.gender === 'female' ? (locale === 'ur' ? 'طالبہ' : 'Female') : (locale === 'ur' ? 'طالب علم' : 'Male');

                  return (
                    <TableRow key={s.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-bold text-[11px] text-primary font-en">
                        {s.registration_id}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-foreground text-xs">{fullName}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          {genderText} | {locale === 'ur' ? 'والد:' : 'S/o'} {s.father_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold text-[11px]">
                          {className}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground font-en">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-primary shrink-0" />
                          <span>{s.father_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground font-en">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{s.admission_date || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          {s.is_orphan ? (
                            <Badge variant="destructive" className="text-[9px] h-4 px-1.5">{locale === 'ur' ? 'یتیم' : 'Orphan'}</Badge>
                          ) : null}
                          {s.is_zakat_eligible ? (
                            <Badge className="bg-amber-500 text-white text-[9px] h-4 px-1.5">{locale === 'ur' ? 'مستحق زکوۃ' : 'Zakat'}</Badge>
                          ) : null}
                          {!s.is_orphan && !s.is_zakat_eligible && (
                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 text-muted-foreground border-border/80">{locale === 'ur' ? 'ریگولر' : 'Regular'}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenViewModal(s)}
                            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                            title={locale === 'ur' ? 'پروفائل دیکھیں / آئی ڈی کارڈ پرنٹ کریں' : 'View Profile / Print ID'}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEditModal(s)}
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                            title={locale === 'ur' ? 'طالب علم کے ریکارڈ میں ترمیم کریں' : 'Edit Student'}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteStudent(s.id, fullName)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title={locale === 'ur' ? 'ڈیلیٹ کریں' : 'Delete Student'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs font-ur space-y-2">
                    <p>{locale === 'ur' ? 'ڈیٹا بیس میں کوئی طالب علم نہیں ملا یا آپ کی تلاش کے مطابق ریکارڈ موجود نہیں۔' : 'No students found matching your filters in live Supabase DB.'}</p>
                    {students.length === 0 && (
                      <Button variant="outline" size="sm" onClick={handleSeedStudents} disabled={seedingDb} className="text-emerald-600 border-emerald-500/50 font-bold mt-2">
                        <Sparkles className="w-3.5 h-3.5 me-1 text-emerald-500" />
                        {locale === 'ur' ? '⚡ یہاں کلک کر کے 3 مستند طلباء لائیو DB میں شامل کریں' : 'Click here to Seed 3 Authentic Students'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Student Modal / ID Card */}
      <ViewStudentModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        studentData={selectedStudent} 
      />

      {/* Edit Student Modal */}
      <EditStudentModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        studentData={selectedStudent} 
        onSuccess={fetchStudentsFromDb}
      />
      </TabsContent>
      
      <TabsContent value="id-cards" className="mt-0">
        <IdCardsDesk />
      </TabsContent>
      </Tabs>
    </div>
  );
}
