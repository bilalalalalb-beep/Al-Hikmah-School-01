"use client";

import React from 'react';
import { MarksEntryDesk } from '@/components/exams/marks-entry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ShieldCheck, ArrowUpRight, GraduationCap, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function TeacherExamsPage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-primary to-emerald-800 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'معلم / استاد کا مارکس انٹری پورٹل' : 'Teacher Marks Entry Portal'}
            </Badge>
            <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 6: امتحانات اور نتائج کا نظام' : 'Module 6: Examination & Results System'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Award className="w-8 h-8 text-amber-300 shrink-0" />
            <span>{locale === 'ur' ? 'طلباء کے نمبرات کا اندراج، تقدیر (Grading) اور خودکار کشف الدرجات' : 'Student Marks Entry, Auto-Grading & Printable Result Cards (Kashf-ul-Darajat)'}</span>
          </h1>
          <p className="text-teal-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'اپنے تفویض کردہ درجے اور مضمون کے طلباء کے حاصل کردہ نمبرات اور تاثرات درج کریں۔ سسٹم خودکار طور پر ممتاز، جید جدا اور مقبول کی تقدیر شمار کرے گا اور سرکاری رزلٹ کارڈ پرنٹ کرے گا۔' 
              : 'Enter student marks for your assigned classes & subjects. The system automatically computes academic grades (Mumtaz, Jayyid, etc.) and generates official bilingual result cards.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/teacher">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'معلم ڈیش بورڈ' : 'Teacher Dashboard'}
            </Button>
          </Link>
          <Link href="/teacher/classes">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <Trophy className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'تفویض کردہ درجات' : 'Assigned Classes'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Marks Entry Component */}
      <MarksEntryDesk />
    </div>
  );
}
