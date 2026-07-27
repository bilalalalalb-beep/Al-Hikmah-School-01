"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  CalendarCheck, 
  Award, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  FileText,
  MapPin,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';

interface AssignedClass {
  id: string;
  departmentUrdu: string;
  department: string;
  deptType: 'hifz_nazra' | 'tajweed' | 'balighan' | 'dars_nizami' | 'takhassusat';
  nameUrdu: string;
  name: string;
  sectionUrdu: string;
  section: string;
  subjectUrdu: string;
  subject: string;
  studentsCount: number;
  attendanceStatus: 'marked' | 'pending' | 'upcoming';
  roomUrdu: string;
  room: string;
  timingUrdu: string;
  timing: string;
  syllabusProgress: number;
}

const initialAssignedClasses: AssignedClass[] = [
  { 
    id: 'cls-1',
    departmentUrdu: '1. شعبہ حفظ و ناظرہ',
    department: 'Hifz & Nazra Dept',
    deptType: 'hifz_nazra',
    nameUrdu: 'حفظِ قرآن کریم - سال اول', 
    name: 'Hifz al-Quran - Year 1', 
    sectionUrdu: 'سیکشن الف (صبح کا شفٹ)', 
    section: 'Section A (Morning Shift)', 
    subjectUrdu: 'حفظ، منزل اور تجویدِ مشق', 
    subject: 'Memorization, Revision & Tajweed', 
    studentsCount: 25, 
    attendanceStatus: 'marked',
    roomUrdu: 'دارالحفظ ہال نمبر 1',
    room: 'Madrasa Hall 1',
    timingUrdu: 'صبح 7:30 تا 12:00 بجے',
    timing: '7:30 AM to 12:00 PM',
    syllabusProgress: 65
  },
  { 
    id: 'cls-2',
    departmentUrdu: '4. شعبہ کتب (درس نظامی)',
    department: 'Dars-e-Nizami Dept',
    deptType: 'dars_nizami',
    nameUrdu: 'درجہ اولیٰ (عامہ سال اول)', 
    name: 'Aamma Year 1 (Grade 1st)', 
    sectionUrdu: 'سیکشن الف (دوپہر)', 
    section: 'Section A (Afternoon)', 
    subjectUrdu: 'عربی گرامر، نحو و صرف، زاد الطالبین', 
    subject: 'Arabic Grammar, Nahw & Sarf', 
    studentsCount: 42, 
    attendanceStatus: 'pending',
    roomUrdu: 'کمرہ نمبر 104',
    room: 'Room 104',
    timingUrdu: 'دوپہر 2:00 تا 5:30 بجے',
    timing: '2:00 PM to 5:30 PM',
    syllabusProgress: 45
  },
  { 
    id: 'cls-3',
    departmentUrdu: '4. شعبہ کتب (درس نظامی)',
    department: 'Dars-e-Nizami Dept',
    deptType: 'dars_nizami',
    nameUrdu: 'درجہ ثامنہ (دورہِ حدیث - سال آخر)', 
    name: 'Dora-e-Hadith (Final Year)', 
    sectionUrdu: 'سینئر ہال گروپ', 
    section: 'Senior Scholars Hall', 
    subjectUrdu: 'صحیح البخاری و جامع الترمذی', 
    subject: 'Sahih al-Bukhari & Jami at-Tirmidhi', 
    studentsCount: 38, 
    attendanceStatus: 'marked',
    roomUrdu: 'مرکزی ایڈیٹوریم ہال',
    room: 'Central Auditorium Hall',
    timingUrdu: 'صبح 8:00 تا دوپہر 1:00 بجے',
    timing: '8:00 AM to 1:00 PM',
    syllabusProgress: 80
  },
  { 
    id: 'cls-4',
    departmentUrdu: '2. شعبہ تجوید و قرآت',
    department: 'Tajweed & Qiraat Dept',
    deptType: 'tajweed',
    nameUrdu: 'تجوید و قرآت سبعہ', 
    name: 'Tajweed & Qiraat Sabaa', 
    sectionUrdu: 'خصوصی کلاس (شام)', 
    section: 'Special Evening Class', 
    subjectUrdu: 'مخارج، صفات اور لہجے کی مشق', 
    subject: 'Makharij & Phonetic Rules', 
    studentsCount: 18, 
    attendanceStatus: 'upcoming',
    roomUrdu: 'صوت القرآن لیب 2',
    room: 'Qiraat Lab 2',
    timingUrdu: 'شام 4:30 تا مغرب',
    timing: '4:30 PM to Sunset',
    syllabusProgress: 30
  },
  { 
    id: 'cls-5',
    departmentUrdu: '5. شعبہ تخصصات',
    department: 'Takhassusat (Postgrad)',
    deptType: 'takhassusat',
    nameUrdu: 'تخصص فی الفقہ والافتاء (مفتی کورس)', 
    name: 'Takhassus fi al-Fiqh (Mufti Course)', 
    sectionUrdu: 'دارالافتاء ریسرچ ڈیسک', 
    section: 'Dar-ul-Iftaa Research Desk', 
    subjectUrdu: 'تمرین الفتویٰ، رد المحتار، الاشباہ والنظائر', 
    subject: 'Fatwa Writing & Advanced Fiqh', 
    studentsCount: 12, 
    attendanceStatus: 'marked',
    roomUrdu: 'دارالافتاء کانفرنس روم',
    room: 'Iftaa Conference Room',
    timingUrdu: 'صبح 9:00 تا دوپہر 1:30 بجے',
    timing: '9:00 AM to 1:30 PM',
    syllabusProgress: 90
  }
];

export default function TeacherClassesPage() {
  const { t, locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const filteredClasses = initialAssignedClasses.filter(cls => {
    const matchesSearch = 
      cls.nameUrdu.includes(searchQuery) || 
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subjectUrdu.includes(searchQuery) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || cls.deptType === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleDownloadSyllabus = (clsName: string) => {
    toast.success(
      locale === 'ur'
        ? `📄 "${clsName}" کا تفصیلی نصاب اور تدریسی شیڈول ڈاؤن لوڈ ہو رہا ہے...`
        : `📄 Downloading course syllabus & schedule for "${clsName}"...`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300 font-ur pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl shadow-emerald-950/20 border border-emerald-700/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 me-1.5 text-amber-300 animate-spin-slow inline" />
              {locale === 'ur' ? 'معلم / استاد کا تدریسی ڈیسک' : 'Teacher Academic Desk'}
            </Badge>
            <Badge variant="outline" className="text-white border-white/20 text-xs">
              {locale === 'ur' ? 'تعلیمی سال 2026-2027' : 'Academic Year 2026-27'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {locale === 'ur' ? 'میرے تفویض کردہ درجات، مضامین اور تدریسی شیڈول' : 'My Assigned Academic Classes & Syllabus Schedule'}
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {locale === 'ur' 
              ? 'جامعہ کے مستند شعبہ جات میں آپ کو تفویض کردہ تمام کلاسز، ان کے مضامین، کمرہ نمبر اور اوقات کار کی تفصیل۔ یہاں سے آپ روزانہ حاضری اور امتحانی نتائج بھی کنٹرول کر سکتے ہیں۔' 
              : 'Complete directory of your assigned classes across all 5 specialized departments, subject textbooks, room allocations, and direct links to attendance and exam grading.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/teacher/attendance">
            <Button variant="emerald" size="sm" className="font-bold shadow-lg bg-white text-emerald-900 hover:bg-emerald-50 gap-1.5">
              <CalendarCheck className="w-4 h-4 shrink-0" /> 
              <span>{locale === 'ur' ? 'روزانہ حاضری ڈیسک' : 'Attendance Desk'}</span>
            </Button>
          </Link>
          <Link href="/teacher/exams">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold gap-1.5">
              <Award className="w-4 h-4 shrink-0 text-amber-300" /> 
              <span>{locale === 'ur' ? 'امتحانی نتائج ڈیسک' : 'Exam Grading Desk'}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/60 shadow-sm bg-card/90 backdrop-blur-md">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={locale === 'ur' ? 'درجہ، مضمون یا سیکشن تلاش کریں...' : 'Search class, subject, or section...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-10 ps-10 text-xs font-ur bg-background"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> {locale === 'ur' ? 'شعبہ سے چھانٹیں:' : 'Filter Dept:'}
            </span>
            {[
              { id: 'all', labelUr: 'تمام درجات (5)', labelEn: 'All Classes' },
              { id: 'hifz_nazra', labelUr: 'شعبہ حفظ و ناظرہ', labelEn: 'Hifz & Nazra' },
              { id: 'dars_nizami', labelUr: 'شعبہ کتب (درس نظامی)', labelEn: 'Dars-e-Nizami' },
              { id: 'tajweed', labelUr: 'شعبہ تجوید و قرآت', labelEn: 'Tajweed' },
              { id: 'takhassusat', labelUr: 'شعبہ تخصصات (مفتی)', labelEn: 'Takhassusat' }
            ].map(tab => (
              <Button
                key={tab.id}
                type="button"
                variant={selectedDept === tab.id ? 'emerald' : 'outline'}
                size="sm"
                onClick={() => setSelectedDept(tab.id)}
                className="h-8 text-xs font-bold shrink-0"
              >
                {locale === 'ur' ? tab.labelUr : tab.labelEn}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-base font-bold text-foreground">
              {locale === 'ur' ? 'کوئی درجہ یا کلاس نہیں ملی!' : 'No classes found matching your criteria.'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setSearchQuery(''); setSelectedDept('all'); }} 
              className="mt-3 text-xs font-bold"
            >
              {locale === 'ur' ? 'تلاش ری سیٹ کریں' : 'Reset Search'}
            </Button>
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <Card key={cls.id} className="border-border/60 hover:border-primary/60 transition-all shadow-sm flex flex-col justify-between group overflow-hidden bg-card">
              <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={
                      cls.deptType === 'hifz_nazra' ? 'success' : 
                      cls.deptType === 'tajweed' ? 'default' : 
                      cls.deptType === 'takhassusat' ? 'destructive' : 'secondary'
                    } 
                    className="text-[11px] font-extrabold"
                  >
                    {locale === 'ur' ? cls.departmentUrdu : cls.department}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground font-en flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 inline text-primary" /> {cls.studentsCount} {locale === 'ur' ? 'طلباء' : 'Students'}
                  </span>
                </div>
                <CardTitle className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                  {locale === 'ur' ? cls.nameUrdu : cls.name}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{locale === 'ur' ? cls.roomUrdu : cls.room}</span>
                  <span className="text-border">|</span>
                  <span>{locale === 'ur' ? cls.sectionUrdu : cls.section}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="py-4 space-y-3.5 flex-1">
                {/* Subject & Timing Info */}
                <div className="p-3 rounded-xl bg-muted/60 border border-border/50 text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted-foreground font-semibold shrink-0">{locale === 'ur' ? 'تدریسی مضمون:' : 'Textbook / Subject:'}</span>
                    <span className="font-extrabold text-foreground text-end">{locale === 'ur' ? cls.subjectUrdu : cls.subject}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500 inline" /> {locale === 'ur' ? 'اوقات کار:' : 'Class Timings:'}
                    </span>
                    <span className="font-bold text-foreground font-mono text-[11px]">{locale === 'ur' ? cls.timingUrdu : cls.timing}</span>
                  </div>
                </div>

                {/* Syllabus Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground">{locale === 'ur' ? 'سالانہ نصاب کی تکمیل:' : 'Annual Syllabus Progress:'}</span>
                    <span className="text-primary font-en font-black">{cls.syllabusProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                      style={{ width: `${cls.syllabusProgress}%` }}
                    />
                  </div>
                </div>

                {/* Daily Status Indicator */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-muted-foreground font-medium">{locale === 'ur' ? 'آج کی حاضری:' : 'Today Attendance:'}</span>
                  {cls.attendanceStatus === 'marked' && (
                    <Badge variant="success" className="gap-1 text-[11px] font-bold py-0.5">
                      <CheckCircle className="w-3 h-3 shrink-0" /> {locale === 'ur' ? 'حاضری درج ہو گئی' : 'Marked Today'}
                    </Badge>
                  )}
                  {cls.attendanceStatus === 'pending' && (
                    <Badge variant="warning" className="gap-1 text-[11px] font-bold py-0.5 animate-pulse">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {locale === 'ur' ? 'حاضری درج کرنا باقی ہے' : 'Pending Action'}
                    </Badge>
                  )}
                  {cls.attendanceStatus === 'upcoming' && (
                    <Badge variant="secondary" className="gap-1 text-[11px] font-bold py-0.5">
                      <Clock className="w-3 h-3 shrink-0" /> {locale === 'ur' ? 'دوپہر کی کلاس' : 'Scheduled Later'}
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/60 bg-muted/10 flex flex-col sm:flex-row items-center gap-2">
                <Link href={`/teacher/attendance?class=${cls.id}`} className="w-full sm:w-auto flex-1">
                  <Button 
                    variant={cls.attendanceStatus === 'pending' ? 'emerald' : 'outline'} 
                    size="sm" 
                    className="w-full text-xs font-bold gap-1.5 shadow-sm"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 shrink-0" /> 
                    <span>{locale === 'ur' ? 'حاضری رجسٹر' : 'Attendance'}</span>
                  </Button>
                </Link>
                <Link href={`/teacher/exams?class=${cls.id}`} className="w-full sm:w-auto flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold gap-1.5 hover:bg-accent/80">
                    <Award className="w-3.5 h-3.5 shrink-0 text-amber-500" /> 
                    <span>{locale === 'ur' ? 'نمبرات پرچہ' : 'Exam Marks'}</span>
                  </Button>
                </Link>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDownloadSyllabus(locale === 'ur' ? cls.nameUrdu : cls.name)}
                  className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground px-2.5" 
                  title={locale === 'ur' ? 'نصاب ڈاؤن لوڈ کریں' : 'Download Syllabus'}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Quick Help Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/5 via-teal-500/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-foreground">{locale === 'ur' ? 'کیا آپ کو کسی نئے درجے یا مضمون کی تفویض درکار ہے؟' : 'Need to assign a new class or subject?'}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{locale === 'ur' ? 'کسی بھی تبدیلی یا نئے پیریڈ کے اندراج کے لیے جامعہ کے مہتمم اعلیٰ (پرنسپل ڈیسک) یا کلرک سے رابطہ فرمائیں۔' : 'Contact the Principal office or Admin Desk to update your teaching schedule or add new course allocations.'}</p>
          </div>
        </div>
        <Link href="/teacher">
          <Button variant="outline" size="sm" className="text-xs font-bold shrink-0">
            {locale === 'ur' ? '← واپس استاد ڈیش بورڈ' : '← Back to Overview'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
