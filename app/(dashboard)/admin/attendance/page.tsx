"use client";

import React from 'react';
import { AttendanceHub } from '@/components/attendance/attendance-hub';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, ShieldCheck, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function AdminAttendancePage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-primary to-teal-800 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'منتظم اعلیٰ / پرنسپل کا مرکزی جائزہ' : 'Admin Attendance Oversight'}
            </Badge>
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 4: حاضری کا نظام' : 'Module 4: Attendance System'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-8 h-8 text-emerald-300 shrink-0" />
            <span>{locale === 'ur' ? 'جامعہ کی کل حاضری، روزانہ رجسٹر اور ماہانہ تجزیاتی رپورٹ' : 'Master Attendance Oversight & Monthly Analytics'}</span>
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'تمام عصری درجات، شعبہ حفظ اور درس نظامی کی حاضری کا حقیقی مشاہدہ کریں۔ حاضری کا تناسب، غیر حاضر طلباء اور 75% سے کم حاضری والے طلباء کی نگرانی کریں۔' 
              : 'Monitor daily school and madrasa attendance, track chronic absenteeism, review teacher submissions, and generate official printable reports.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/admin">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'عمومی جائزہ' : 'Admin Overview'}
            </Button>
          </Link>
          <Link href="/teacher/attendance">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <CalendarCheck className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'اساتذہ پورٹل' : 'Teacher View'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Hub Component with Monthly tab default for Admin */}
      <AttendanceHub defaultTab="monthly" role="admin" />
    </div>
  );
}
