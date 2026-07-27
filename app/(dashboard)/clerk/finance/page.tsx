"use client";

import React from 'react';
import { FeeCollector } from '@/components/finance/fee-collector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, ShieldCheck, ArrowUpRight, BookOpen, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function ClerkFinancePage() {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-primary to-teal-800 text-white shadow-xl shadow-primary/15 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 font-bold gap-1.5">
              <CreditCard className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'کلرک / اکاؤنٹینٹ کا فیس وصولی ڈیسک' : 'Clerk Fee Collection Desk'}
            </Badge>
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30 font-bold text-[10px]">
              {locale === 'ur' ? 'ماڈیول 5: مالیاتی نظام و رسیدیں' : 'Module 5: Fee & Finance System'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <Wallet className="w-8 h-8 text-emerald-300 shrink-0" />
            <span>{locale === 'ur' ? 'طلباء کی ماہانہ فیس وصولی، رعایت اور سرکاری ڈیجیٹل رسیدات' : 'Monthly Fee Collection, Concessions & Digital Cloud Receipts'}</span>
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
            {locale === 'ur' 
              ? 'طالب علم کو نام یا رجسٹریشن ID سے تلاش کریں، واجب الادا رقم اور بقایاجات کا جائزہ لیں، فیس (نقد یا آن لائن) وصول کریں اور فوراً باضابطہ QR کوڈ والی رسید پرنٹ کریں۔' 
              : 'Lookup student dues by Name or REG ID, process cash or online payments, apply orphan/deserving concessions, and generate instant printable Cloudinary verified receipts.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/clerk">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <ArrowUpRight className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'کلرک ڈیش بورڈ' : 'Clerk Overview'}
            </Button>
          </Link>
          <Link href="/clerk/expenses">
            <Button size="sm" className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs shadow-sm">
              <BookOpen className="w-4 h-4 me-1.5 shrink-0" /> {locale === 'ur' ? 'اخراجات کا لیجر' : 'Expense Tracker'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Fee Collector Component */}
      <FeeCollector />
    </div>
  );
}
