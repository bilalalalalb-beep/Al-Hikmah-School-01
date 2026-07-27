"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  CalendarCheck, 
  Award, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

const assignedClasses = [
  { 
    id: '1', 
    nameUrdu: 'درجہ عالمیت - سال اول', 
    name: 'Alimiyah - Year 1', 
    sectionUrdu: 'سیکشن الف (صبح)', 
    section: 'Section A (Morning)', 
    subjectUrdu: 'فقہ اور اصول فقہ', 
    subject: 'Fiqh & Usul al-Fiqh', 
    studentsCount: 42, 
    attendanceStatus: 'marked',
    roomUrdu: 'ہال نمبر 102',
    room: 'Hall 102' 
  },
  { 
    id: '2', 
    nameUrdu: 'درجہ دہم (سائنس)', 
    name: 'Grade 10', 
    sectionUrdu: 'سائنس گروپ الف', 
    section: 'Science Group A', 
    subjectUrdu: 'اسلامیات اور اخلاقیات', 
    subject: 'Islamic Studies & Ethics', 
    studentsCount: 38, 
    attendanceStatus: 'pending',
    roomUrdu: 'کمرہ نمبر 204',
    room: 'Room 204' 
  },
  { 
    id: '3', 
    nameUrdu: 'شعبہ حفظ القرآن', 
    name: 'Hifz al-Quran', 
    sectionUrdu: 'سیکشن ب (دوپہر)', 
    section: 'Section B (Afternoon)', 
    subjectUrdu: 'تجوید اور حفظ', 
    subject: 'Tajweed & Memorization', 
    studentsCount: 25, 
    attendanceStatus: 'upcoming',
    roomUrdu: 'دارالحفظ ہال 3',
    room: 'Madrasa Hall 3' 
  },
];

export default function TeacherDashboardPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl shadow-emerald-950/20">
        <div>
          <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 mb-2 font-bold">
            {locale === 'ur' ? 'معلم اور استاد پورٹل' : 'Teacher & Ustad Portal'}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {locale === 'ur' ? 'میرے تفویض کردہ درجات اور تعلیمی شیڈول' : 'My Academic Classes & Schedule'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {locale === 'ur' ? 'چند سیکنڈوں میں طلباء کی روزانہ ڈیجیٹل حاضری لگائیں، امتحانات کے نمبر درج کریں، اور اپنے درجات کی کارکردگی کا جائزہ لیں۔' : 'Take daily digital student attendance in seconds, enter upcoming term exam marks, and manage assigned class performance.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/teacher/attendance">
            <Button variant="emerald" size="sm" className="font-bold shadow-lg bg-white text-emerald-900 hover:bg-emerald-50">
              <CalendarCheck className="w-4 h-4 me-2 shrink-0" /> {locale === 'ur' ? 'حاضری درج کریں' : 'Mark Attendance Now'}
            </Button>
          </Link>
          <Link href="/teacher/exams">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold">
              <Award className="w-4 h-4 me-2 shrink-0" /> {locale === 'ur' ? 'امتحانی نمبر درج کریں' : 'Enter Exam Marks'}
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 hover:border-emerald-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.assignedClassesCount}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">3 Classes</div>
            <p className="text-xs text-muted-foreground mt-1 font-bold">
              {locale === 'ur' ? 'کل 105 طلباء آپ کے زیرِ تعلیم' : 'Total 105 Students Under Your Care'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-emerald-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.attendanceMarkedStatus}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">1 / 3 Marked</div>
            <p className="text-xs text-amber-600 font-bold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline shrink-0" /> {locale === 'ur' ? '1 درجے کی حاضری باقی ہے!' : '1 class attendance pending!'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-emerald-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.upcomingExams}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {locale === 'ur' ? 'ششمانی امتحانات' : 'Mid-Term Exams'}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-bold">
              {locale === 'ur' ? '12 دنوں میں آغاز • نمبروں کا اندراج جاری' : 'Starts in 12 days • Marks entry open'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Classes Grid */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary shrink-0" />
          <span>{locale === 'ur' ? 'میرے تفویض کردہ درجات اور تدریسی مضامین' : 'My Assigned Academic Classes & Subjects'}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assignedClasses.map((cls) => (
            <Card key={cls.id} className="border-border/60 hover:border-primary/60 transition-all shadow-sm flex flex-col justify-between group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold text-xs">
                    {locale === 'ur' ? cls.roomUrdu : cls.room}
                  </Badge>
                  {cls.attendanceStatus === 'marked' && (
                    <Badge variant="success" className="gap-1 text-[10px]">
                      <CheckCircle className="w-3 h-3 shrink-0" /> {locale === 'ur' ? 'حاضری مکمل' : 'Marked Today'}
                    </Badge>
                  )}
                  {cls.attendanceStatus === 'pending' && (
                    <Badge variant="warning" className="gap-1 text-[10px]">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {locale === 'ur' ? 'حاضری باقی ہے' : 'Pending Today'}
                    </Badge>
                  )}
                  {cls.attendanceStatus === 'upcoming' && (
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <Clock className="w-3 h-3 shrink-0" /> {locale === 'ur' ? 'دوپہر 2 بجے' : '2:00 PM Today'}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {locale === 'ur' ? cls.nameUrdu : cls.name}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground">
                  {locale === 'ur' ? cls.sectionUrdu : cls.section}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-2 space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/40 text-xs space-y-1.5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{locale === 'ur' ? 'مضمون / درس:' : 'Subject / Dars:'}</span>
                    <span className="font-bold text-foreground">{locale === 'ur' ? cls.subjectUrdu : cls.subject}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{locale === 'ur' ? 'رجسٹرڈ طلباء:' : 'Enrolled Students:'}</span>
                    <span className="font-bold text-foreground">{cls.studentsCount} {locale === 'ur' ? 'طالب علم' : 'Students'}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <Link href={`/teacher/attendance?class=${cls.id}`} className="flex-1">
                  <Button 
                    variant={cls.attendanceStatus === 'pending' ? 'emerald' : 'outline'} 
                    size="sm" 
                    className="w-full text-xs font-bold"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 me-1.5 shrink-0" /> {locale === 'ur' ? 'حاضری لگائیں' : 'Attendance'}
                  </Button>
                </Link>
                <Link href={`/teacher/exams?class=${cls.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold">
                    <Award className="w-3.5 h-3.5 me-1.5 shrink-0" /> {locale === 'ur' ? 'نمبر درج کریں' : 'Marks'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
