"use client";

import React from 'react';
import { AcademicManager } from '@/components/admin/academic-manager';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Sparkles, ShieldCheck, ArrowUpRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function AdminClassesPage() {
  const { locale, t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-primary to-teal-800 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'پرنسپل و منتظم اعلیٰ کا خصوصی ماڈیول' : 'Admin Exclusive Module'}
            </Badge>
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 3: تعلیمی نظام' : 'Module 3: Academics'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Building2 className="w-8 h-8 text-emerald-300 shrink-0" />
            <span>{locale === 'ur' ? 'درجات، سیکشنز اور مضامین کا تنظیمی نظام' : 'Academic Management (Classes, Sections & Subjects)'}</span>
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'جامعہ کے عصری درجات، شعبہ حفظ القرآن اور درس نظامی (عالمیت) کی کلاسز قائم کریں۔ ہر درجہ کے لیے صبح و شام کے سیکشنز اور درسی کتب کے ساتھ متعلقہ اساتذہ تعینات کریں۔' 
              : 'Configure School grades, Hifz al-Quran sections, and Dars-e-Nizami (Alimiyah) courses. Manage shift schedules, student capacities, textbooks, and assign teaching staff.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/admin">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'عمومی جائزہ (Dashboard)' : 'Admin Overview'}
            </Button>
          </Link>
          <Link href="/teacher">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <BookOpen className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'اساتذہ کا نقطہ نظر' : 'Teacher View'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Interactive Academic Manager Component */}
      <AcademicManager />
    </div>
  );
}
