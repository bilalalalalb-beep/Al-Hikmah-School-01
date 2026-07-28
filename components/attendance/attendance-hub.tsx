"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyRegister } from './daily-register';
import { MonthlySummary } from './monthly-summary';
import { CalendarCheck, TrendingUp, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface AttendanceHubProps {
  defaultTab?: 'daily' | 'monthly';
  role?: 'teacher' | 'admin';
}

export function AttendanceHub({ defaultTab = 'daily', role = 'teacher' }: AttendanceHubProps) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-6 font-ur">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12 bg-card border border-border/80 rounded-xl p-1 shadow-sm">
          <TabsTrigger value="daily" className="font-bold text-xs sm:text-sm gap-2">
            <CalendarCheck className="w-4 h-4 text-primary shrink-0" />
            <span>{locale === 'ur' ? '1. روزانہ حاضری رجسٹر (Daily Register)' : '1. Daily Register'}</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="font-bold text-xs sm:text-sm gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{locale === 'ur' ? '2. ماہانہ جائزہ اور رپورٹس (Monthly Summary)' : '2. Monthly Summary'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="pt-2 animate-in fade-in-50 duration-200">
          <DailyRegister role={role} />
        </TabsContent>

        <TabsContent value="monthly" className="pt-2 animate-in fade-in-50 duration-200">
          <MonthlySummary role={role} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
