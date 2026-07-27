"use client";

import React from 'react';
import { AttendanceHub } from '@/components/attendance/attendance-hub';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, ShieldCheck, ArrowUpRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function TeacherAttendancePage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-primary to-teal-800 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'معلم / استاد کا روزانہ حاضری پورٹل' : 'Teacher Attendance Desk'}
            </Badge>
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 4: حاضری کا ڈیجیٹل نظام' : 'Module 4: Attendance System'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-8 h-8 text-emerald-300 shrink-0" />
            <span>{locale === 'ur' ? 'روزانہ ڈیجیٹل حاضری رجسٹر اور ماہانہ جائزہ' : 'Daily Digital Attendance Register & Monthly Summary'}</span>
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'اپنے تفویض کردہ درجہ اور سیکشن کا انتخاب کریں، روزانہ کی حاضری (حاضر، غیر حاضر، رخصت) ایک کلک سے درج کریں یا وقت بچانے کے لیے "سب کو حاضر کریں" کا بٹن استعمال کریں۔' 
              : 'Select your assigned class and section, mark daily student attendance (Present, Absent, Leave) instantly, or use "Mark All Present" for quick submission.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/teacher">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'اساتذہ ڈیش بورڈ' : 'Teacher Overview'}
            </Button>
          </Link>
          <Link href="/admin/attendance">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ShieldCheck className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'پرنسپل جائزہ' : 'Admin View'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Hub Component */}
      <AttendanceHub defaultTab="daily" role="teacher" />
    </div>
  );
}
