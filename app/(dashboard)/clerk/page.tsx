"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wallet, 
  UserPlus, 
  FileText, 
  Receipt, 
  DollarSign, 
  AlertCircle,
  TrendingDown,
  Printer,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

const recentReceipts = [
  { id: 'FR-2026-084', studentNameUrdu: 'طلحہ احمد', studentName: 'Talha Ahmed', regId: 'REG-2026-0012', classNameUrdu: 'درجہ ہشتم - الف', className: 'Grade 8 - A', amount: 'Rs. 15,000', typeUrdu: 'ٹیوشن فیس', type: 'Tuition Fee', dateUrdu: 'آج صبح 10:45', date: 'Today, 10:45 AM', statusUrdu: 'ادا شدہ', status: 'Paid' },
  { id: 'FR-2026-083', studentNameUrdu: 'محمد عمر', studentName: 'Muhammad Umar', regId: 'REG-2026-0045', classNameUrdu: 'حفظ القرآن - ب', className: 'Hifz Section B', amount: 'Rs. 12,000', typeUrdu: 'ٹیوشن اور بورڈنگ', type: 'Tuition + Boarding', dateUrdu: 'آج صبح 09:30', date: 'Today, 09:30 AM', statusUrdu: 'ادا شدہ', status: 'Paid' },
  { id: 'FR-2026-082', studentNameUrdu: 'حمزہ صدیقی', studentName: 'Hamza Siddiqui', regId: 'REG-2026-0118', classNameUrdu: 'درجہ دہم - صبح', className: 'Grade 10 - Morning', amount: 'Rs. 18,500', typeUrdu: 'ٹیوشن اور ٹرانسپورٹ', type: 'Tuition + Transport', dateUrdu: 'کل', date: 'Yesterday', statusUrdu: 'ادا شدہ', status: 'Paid' },
  { id: 'FR-2026-081', studentNameUrdu: 'زید بن حارث', studentName: 'Zayd ibn Harith', regId: 'REG-2026-0205', classNameUrdu: 'درس نظامی سال اول', className: 'Dars-e-Nizami Y1', amount: 'Rs. 10,000', typeUrdu: 'ٹیوشن فیس', type: 'Tuition Fee', dateUrdu: 'کل', date: 'Yesterday', statusUrdu: 'ادا شدہ', status: 'Paid' },
  { id: 'FR-2026-080', studentNameUrdu: 'بلال مصطفیٰ', studentName: 'Bilal Mustafa', regId: 'REG-2026-0331', classNameUrdu: 'درجہ پنجم - ب', className: 'Grade 5 - B', amount: 'Rs. 14,000', typeUrdu: 'ٹیوشن فیس', type: 'Tuition Fee', dateUrdu: '23 جولائی 2026', date: '23 Jul 2026', statusUrdu: 'ادا شدہ', status: 'Paid' },
];

export default function ClerkDashboardPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-xl shadow-blue-900/10">
        <div>
          <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 mb-2 font-bold">
            {locale === 'ur' ? 'اکاؤنٹینٹ اور کلرک پورٹل' : 'Accountant & Clerk Desk'}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {locale === 'ur' ? 'داخلہ اور فیس وصولی ڈیسک' : 'Admissions & Fee Collection Portal'}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {locale === 'ur' ? 'نئے طلباء کے داخلے کا اندراج کریں، والدین کو باقاعدہ فیس رسیدیں جاری کریں، روزانہ کے اخراجات درج کریں اور بقایاجات کا انتظام کریں۔' : 'Quickly register new student enrollments, issue official fee receipts, track daily expenses, and manage defaulters.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/clerk/admissions">
            <Button variant="emerald" size="sm" className="font-bold shadow-lg">
              <UserPlus className="w-4 h-4 me-2 shrink-0" /> {locale === 'ur' ? '+ نیا داخلہ کریں' : '+ New Admission'}
            </Button>
          </Link>
          <Link href="/clerk/finance">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold">
              <Receipt className="w-4 h-4 me-2 shrink-0" /> {locale === 'ur' ? 'فیس رسید جاری کریں' : 'Collect Fee Receipt'}
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 hover:border-blue-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.todayCollection}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">Rs. 45,500</div>
            <p className="text-xs text-emerald-600 mt-1 font-bold">
              {locale === 'ur' ? 'آج 3 رسیدیں جاری کی گئیں' : '3 Fee receipts generated today'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-blue-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.newAdmissionsMonth}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">18</div>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === 'ur' ? 'رجسٹریشن نمبر 465 سے 482' : 'Registration IDs 465 to 482'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-blue-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.pendingDefaulters}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">24</div>
            <p className="text-xs text-amber-600 mt-1 font-bold">
              {locale === 'ur' ? 'کل واجب الادا: 1,20,000 روپے' : 'Total Overdue: Rs. 1,20,000'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-blue-500/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.todayExpenses}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">Rs. 4,200</div>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === 'ur' ? 'سٹیشنری اور مرمت کے اخراجات' : 'Stationery & maintenance paid'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Receipts Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary shrink-0" />
              <span>{locale === 'ur' ? 'حال ہی میں جاری کردہ فیس رسیدیں' : 'Recently Generated Fee Receipts'}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'ur' ? 'والدین کو جاری کردہ رسیدوں کا ریکارڈ (Cloudinary اسٹوریج اور پرنٹ سہولت کے ساتھ)۔' : 'Official payment records issued to parents with Cloudinary storage and print capability.'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-60">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder={locale === 'ur' ? 'رسید نمبر یا طالب علم تلاش کریں...' : 'Search Receipt ID or Student...'} 
                className="w-full h-9 ps-8 pe-3 text-xs rounded-lg border border-border bg-muted/40 focus:outline-none focus:ring-1 focus:ring-primary font-ur"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">{locale === 'ur' ? 'رسید نمبر' : 'Receipt ID'}</TableHead>
                <TableHead>{locale === 'ur' ? 'نام طالب علم و رجسٹریشن نمبر' : 'Student Name & REG ID'}</TableHead>
                <TableHead>{locale === 'ur' ? 'درجہ / کلاس' : 'Class / Section'}</TableHead>
                <TableHead>{locale === 'ur' ? 'فیس کی قسم' : 'Fee Type'}</TableHead>
                <TableHead>{locale === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                <TableHead>{locale === 'ur' ? 'تاریخ و وقت' : 'Date / Time'}</TableHead>
                <TableHead>{locale === 'ur' ? 'حیثیت' : 'Status'}</TableHead>
                <TableHead className="text-end">{locale === 'ur' ? 'اقدام' : 'Action'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReceipts.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono font-bold text-xs text-primary">
                    {row.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground text-xs">{locale === 'ur' ? row.studentNameUrdu : row.studentName}</div>
                    <div className="text-[11px] text-muted-foreground font-mono font-en">{row.regId}</div>
                  </TableCell>
                  <TableCell className="text-xs font-bold">{locale === 'ur' ? row.classNameUrdu : row.className}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{locale === 'ur' ? row.typeUrdu : row.type}</TableCell>
                  <TableCell className="font-bold text-xs text-foreground font-en">{row.amount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{locale === 'ur' ? row.dateUrdu : row.date}</TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px]">
                      {locale === 'ur' ? row.statusUrdu : row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold gap-1.5">
                      <Printer className="w-3.5 h-3.5 shrink-0" /> {t.print}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
