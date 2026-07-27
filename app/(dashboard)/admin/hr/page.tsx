"use client";

import React, { useState } from 'react';
import { StaffDirectory } from '@/components/hr/staff-directory';
import { PayrollManager } from '@/components/hr/payroll-manager';
import { PayrollIndex } from '@/components/hr/payroll-index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wallet, ShieldCheck, ArrowUpRight, Building2, Briefcase, History } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function AdminHRPage() {
  const { locale, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState('directory');

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-primary to-emerald-900 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'پرنسپل و منتظم اعلیٰ کا خصوصی ماڈیول' : 'Admin Exclusive Module'}
            </Badge>
            <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 7: امورِ عملہ و مشاہرہ' : 'Module 7: HR & Payroll'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-emerald-300 shrink-0" />
            <span>{locale === 'ur' ? 'جامعہ کی افرادی قوت، فہرستِ اساتذہ اور ماہانہ مشاہرہ و تنخواہ کا انتظام' : 'HR Management (Faculty Directory & Payroll Desk)'}</span>
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'عصری سکول، شعبہ حفظ اور درس نظامی کے اساتذہ، قراء، مفتیانِ کرام اور دفتری ملازمین کے ریکارڈز، تقرر اور مشاہرے کا مکمل انتظام کریں۔ یہاں سے ادا کی جانے والی ہر تنخواہ خودکار طور پر ماڈیول 5 کے مصارف (Expenses) میں خودکار درج ہو جاتی ہے۔' 
              : 'Comprehensive HR directory for modern school teachers, Hifz tutors, Dars-e-Nizami scholars, and administrative staff. Disbursed salaries automatically record into Module 5 Financial Ledgers in real-time.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/admin/finance">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <Wallet className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'مالیات و مصارف' : 'Finance Desk'}
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'عمومی جائزہ' : 'Overview'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir={dir}>
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 h-auto bg-card border border-border/80 rounded-xl p-1.5 shadow-sm gap-1.5">
          <TabsTrigger value="directory" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <Briefcase className="w-4 h-4 text-primary shrink-0" />
            <span>{locale === 'ur' ? '1. فہرستِ اساتذہ و ملازمین' : '1. Faculty & Staff Directory'}</span>
          </TabsTrigger>
          <TabsTrigger value="payroll" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{locale === 'ur' ? '2. ماہانہ پے رول ادائیگی ڈیسک' : '2. Monthly Payroll Desk'}</span>
          </TabsTrigger>
          <TabsTrigger value="index" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <History className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{locale === 'ur' ? '3. تنخواہوں کا تفصیلی انڈیکس و لیجر' : '3. Master Payroll Index'}</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: STAFF DIRECTORY */}
        <TabsContent value="directory" className="pt-4 animate-in fade-in-50 duration-200">
          <StaffDirectory />
        </TabsContent>

        {/* TAB 2: PAYROLL MANAGER */}
        <TabsContent value="payroll" className="pt-4 animate-in fade-in-50 duration-200">
          <PayrollManager />
        </TabsContent>

        {/* TAB 3: PAYROLL INDEX & ARCHIVE */}
        <TabsContent value="index" className="pt-4 animate-in fade-in-50 duration-200">
          <PayrollIndex />
        </TabsContent>
      </Tabs>
    </div>
  );
}
