"use client";

import React from 'react';
import { ReportsHub } from '@/components/admin/reports-hub';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, ShieldCheck, ArrowUpRight, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function AdminReportsPage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-primary to-indigo-900 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'منتظم اعلیٰ / پرنسپل کا مرکزی رپورٹنگ ڈیسک' : 'Master Admin Reports Generator'}
            </Badge>
            <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 10: لسٹیں اور پرنٹنگ نظام' : 'Module 10: Print & Reports Hub'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Printer className="w-8 h-8 text-amber-300 shrink-0" />
            <span>{locale === 'ur' ? 'مرکزی رپورٹنگ، لسٹیں پرنٹ کرنے کا نظام، اور پی ڈی ایف ڈاؤنلوڈر' : 'Master Reports Hub, Roster Generator & Printable PDF Engine'}</span>
          </h1>
          <p className="text-blue-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'جامعہ الحکمہ الاسلامیہ کے تمام اساتذہ، قراء، مفتیان کی ماہانہ و سالانہ تنخواہ لسٹیں، طلباء کی تفصیلی فہرستیں، اور مالیاتی خلاصے ایک ہی پرچے میں تیار کریں اور فوراً پرنٹ یا PDF میں محفوظ کریں۔' 
              : 'Generate, customize, and print master sheets for staff salaries, payroll disbursements, student rosters, and school financial summaries on clean single sheets.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/admin/hr">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <Users className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'اساتذہ و پے رول' : 'Staff & Payroll'}
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'عمومی جائزہ' : 'Admin Overview'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Reports Hub Component */}
      <ReportsHub />
    </div>
  );
}
