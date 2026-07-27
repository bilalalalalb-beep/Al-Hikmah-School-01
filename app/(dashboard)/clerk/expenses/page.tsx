"use client";

import React from 'react';
import { ExpenseManager } from '@/components/finance/expense-manager';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ShieldCheck, ArrowUpRight, Wallet, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function ClerkExpensesPage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white shadow-xl shadow-rose-900/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <BookOpen className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'کلرک / اکاؤنٹینٹ کا روزنامچہ اخراجات' : 'Clerk Expense Ledger'}
            </Badge>
            <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 5: حساب کتاب و اخراجات' : 'Module 5: Expense Tracker'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-8 h-8 text-amber-300 shrink-0" />
            <span>{locale === 'ur' ? 'جامعہ کے روزمرہ اور ماہانہ اخراجات، تنخواہیں، بلز اور طعام کا لیجر' : 'Daily & Monthly Expense Tracker, Salaries, Utility Bills & Boarding Mess'}</span>
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'اساتذہ کرام اور عملے کی ماہانہ تنخواہ، بجلی و یوٹیلیٹی بلز، دارالاقامہ کے راشن اور مرمت کے اخراجات درج کریں اور زمرہ وار رپورٹس تیار کریں۔' 
              : 'Record and categorize school/madrasa expenditures including staff salaries, electricity bills, boarding food supplies, and infrastructure maintenance.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/clerk/finance">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <Wallet className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'فیس وصولی ڈیسک' : 'Fee Collection'}
            </Button>
          </Link>
          <Link href="/admin/finance">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ShieldCheck className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'پرنسپل مالیاتی جائزہ' : 'Admin Analytics'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Expense Manager Component */}
      <ExpenseManager />
    </div>
  );
}
