"use client";

import React from 'react';
import { ExamOverview } from '@/components/exams/exam-overview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, ShieldCheck, ArrowUpRight, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function AdminExamsPage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-900 via-primary to-teal-800 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'منتظم اعلیٰ / پرنسپل کا امتحانی ڈیش بورڈ' : 'Admin Examinations Board'}
            </Badge>
            <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 6: امتحانی نتائج اور لوحِ شرف' : 'Module 6: Exams & Roll of Honor'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Trophy className="w-8 h-8 text-amber-300 shrink-0" />
            <span>{locale === 'ur' ? 'جامعہ کی لوحِ شرف (Roll of Honor)، پوزیشن ہولڈرز اور مرکزی کشف الدرجات' : 'Master Roll of Honor, Position Holders & Central Kashf-ul-Darajat Desk'}</span>
          </h1>
          <p className="text-amber-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'عصری سکول، شعبہ حفظ، اور درس نظامی کے امتحانی نتائج کی نگرانی کریں۔ اول، دوم، اور سوم پوزیشن حاصل کرنے والے سرفراز طلباء کی لوحِ شرف پرنٹ کریں اور کسی بھی طالب علم کا رزلٹ کارڈ جاری کریں۔' 
              : 'Monitor examination progress across all departments. Celebrate Gold, Silver, and Bronze medal position holders on the Roll of Honor, and print cloud-verified bilingual result cards.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/admin">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'عمومی جائزہ' : 'Admin Overview'}
            </Button>
          </Link>
          <Link href="/admin/classes">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <Star className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'درجات و مضامین' : 'Classes & Subjects'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Exam Overview Component */}
      <ExamOverview />
    </div>
  );
}
