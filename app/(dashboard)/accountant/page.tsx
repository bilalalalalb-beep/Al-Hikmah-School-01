"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Printer, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  Sparkles,
  Building,
  Users
} from 'lucide-react';

export default function AccountantDashboardPage() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'receipts' | 'expenses' | 'payroll'>('receipts');
  const [searchQuery, setSearchQuery] = useState('');

  const [receipts, setReceipts] = useState([
    { id: 'INV-2026-0801', studentUr: 'محمد زبیر بن عبداللہ', studentEn: 'Zubair Abdullah', classUr: 'درجہ اولیٰ (ناظرہ)', amount: 4500, date: '2026-07-26', method: 'کیش (Cash Desk)', status: 'paid' },
    { id: 'INV-2026-0802', studentUr: 'عمران خان بن سلطان', studentEn: 'Imran Khan', classUr: 'درجہ ثالثہ (عالمیت)', amount: 6000, date: '2026-07-25', method: 'بینک ٹرانسفر', status: 'paid' },
    { id: 'INV-2026-0803', studentUr: 'بلال احمد بن یوسف', studentEn: 'Bilal Ahmed', classUr: 'شعبہ حفظ و تجوید', amount: 3500, date: '2026-07-25', method: 'کیش (Cash Desk)', status: 'paid' },
    { id: 'INV-2026-0804', studentUr: 'طلحہ محمود بن شاہد', studentEn: 'Talha Mehmood', classUr: 'درجہ خامسہ', amount: 5000, date: '2026-07-24', method: 'ایزی پیسہ / جاز کیش', status: 'paid' },
  ]);

  const [expenses, setExpenses] = useState([
    { id: 'EXP-2026-041', categoryUr: 'بجلی و یوٹیلیٹی بلز', categoryEn: 'Electricity & Utilities', descUr: 'جامعہ کی مرکزی عمارت اور دارالاقامہ کا بل', amount: 45000, date: '2026-07-20', approvedByUr: 'مولانا طارق صاحب (پرنسپل)' },
    { id: 'EXP-2026-042', categoryUr: 'مطبخ و طعام اخراجات', categoryEn: 'Kitchen & Grocery', descUr: 'طلباء کے لیے ہفتہ وار راشن اور اشیاء خوردونوش', amount: 62000, date: '2026-07-22', approvedByUr: 'مولانا طارق صاحب (پرنسپل)' },
    { id: 'EXP-2026-043', categoryUr: 'کتب خانہ و قرطاسیہ', categoryEn: 'Library & Stationery', descUr: 'امتحانی کاپیاں، قلم، اور حاضری رجسٹرز', amount: 12500, date: '2026-07-24', approvedByUr: 'حافظ زبیر صاحب (نائب مہتمم)' },
  ]);

  const [payroll, setPayroll] = useState([
    { id: 'PAY-01', nameUr: 'استاد احمد صاحب', nameEn: 'Ustad Ahmed', deptUr: 'شعبہ درسِ نظامی', salary: 45000, status: 'transferred', date: '2026-07-01' },
    { id: 'PAY-02', nameUr: 'قاری عمران صاحب', nameEn: 'Qari Imran', deptUr: 'ناظمِ دارالاقامہ', salary: 38000, status: 'transferred', date: '2026-07-01' },
    { id: 'PAY-03', nameUr: 'حافظ زبیر صاحب', nameEn: 'Hafiz Zubair', deptUr: 'نائب مہتمم / دفتر', salary: 50000, status: 'transferred', date: '2026-07-01' },
  ]);

  const handlePrint = (docId: string) => {
    toast.success(locale === 'ur' ? `رسید / واؤچر #${docId} پرنٹر پر بھیج دیا گیا ہے!` : `Document #${docId} sent to printer!`);
  };

  const handleNewTransaction = () => {
    toast.info(locale === 'ur' ? 'نیا مالیاتی فارم کھل رہا ہے...' : 'Opening new transaction form...');
  };

  return (
    <div className={`space-y-6 animate-in fade-in-50 duration-300 ${locale === 'ur' ? 'font-ur' : 'font-en'}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{locale === 'ur' ? 'شعبہ مالیات و محاسبہ (Finance & Accounts Hub)' : 'Finance & Treasury Desk'}</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-teal-400 shrink-0" />
            <span>{locale === 'ur' ? 'خازن / اکاؤںٹنٹ مرکزی ڈیش بورڈ' : 'Accountant & Cash Officer Portal'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-medium">
            {locale === 'ur'
              ? 'جامعہ کی تمام روزانہ فیس وصولی، انوائسنگ، مطبخ و تعمیراتی اخراجات کا روزنامچہ، اور اساتذہ کی تنخواہ کا مکمل ڈیجیٹل حساب کتاب یہاں سے کنٹرول کریں۔'
              : 'Manage daily fee collection, expense ledger vouchers, institution utilities, and staff salary disbursement.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <Button
            type="button"
            variant="emerald"
            onClick={handleNewTransaction}
            className="font-extrabold text-xs px-5 py-5 rounded-xl shadow-lg gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'ur' ? 'نئی فیس وصولی (+ Receipt)' : '+ New Fee Receipt'}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.success(locale === 'ur' ? 'روزنامچہ رپورٹ تیار ہو رہی ہے...' : 'Generating Ledger Report...')}
            className="font-bold text-xs px-4 py-5 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{locale === 'ur' ? 'روزنامچہ پرنٹ' : 'Print Ledger'}</span>
          </Button>
        </div>
      </div>

      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-teal-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'ماہانہ فیس وصولی (Collection)' : 'Monthly Fee Collection'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground font-en">Rs. 485,000</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{locale === 'ur' ? '+18% گزشتہ ماہ کی نسبت' : '+18% vs last month'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-amber-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'واجب الادا بقایاجات (Pending)' : 'Pending Fee Dues'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 font-en">Rs. 142,500</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              <span>{locale === 'ur' ? '45 طلباء کے ذمہ واجب الادا' : '45 students pending dues'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-rose-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'ماہانہ اخراجات (Expenses)' : 'Monthly Expenses'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-rose-600 font-en">Rs. 119,500</div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <Building className="w-3 h-3" />
              <span>{locale === 'ur' ? 'یوٹیلیٹی، مطبخ اور قرطاسیہ' : 'Utilities, Kitchen & Admin'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-emerald-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کیش بک بیلنس (Net Balance)' : 'Net Cashbook Balance'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 font-en">Rs. 365,500</div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>{locale === 'ur' ? 'سرکاری بینک اور کیش کا مجموعہ' : 'Bank + In-hand Cash Desk'}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-2 overflow-x-auto">
        <Button
          type="button"
          variant={activeTab === 'receipts' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('receipts')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <Wallet className="w-4 h-4" />
          <span>{locale === 'ur' ? '1. تازہ ترین فیس وصولی رسیدیں' : '1. Recent Fee Receipts'}</span>
        </Button>
        <Button
          type="button"
          variant={activeTab === 'expenses' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('expenses')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <TrendingDown className="w-4 h-4" />
          <span>{locale === 'ur' ? '2. مدرسہ اخراجات کا روزنامچہ' : '2. Expense Vouchers Ledger'}</span>
        </Button>
        <Button
          type="button"
          variant={activeTab === 'payroll' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('payroll')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <Users className="w-4 h-4" />
          <span>{locale === 'ur' ? '3. اساتذہ و ملازمین تنخواہ شیٹ' : '3. Staff Salary Payroll'}</span>
        </Button>
      </div>

      {/* Tab 1: Receipts Table */}
      {activeTab === 'receipts' && (
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>{locale === 'ur' ? 'طلباء کی حال ہی میں جاری کردہ فیس رسیدیں' : 'Recently Issued Student Fee Receipts'}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {locale === 'ur' ? 'کسی بھی رسید کا دوبارہ پرنٹ نکالیں یا تصدیق کریں' : 'Verify, download or print any payment transaction voucher.'}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={locale === 'ur' ? 'طالب علم کا نام یا رسید نمبر تلاش کریں...' : 'Search student or receipt ID...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-10 text-xs rounded-xl border-border bg-background"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'رسید نمبر' : 'Receipt ID'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'طالب علم کا نام و درجہ' : 'Student Name & Class'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'رقم (Amount)' : 'Amount'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'ذریعہ ادائیگی' : 'Payment Method'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 text-end">{locale === 'ur' ? 'اقدام (Print)' : 'Action'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4 font-en font-bold text-xs text-teal-600">{r.id}</TableCell>
                      <TableCell className="py-4">
                        <div className="font-extrabold text-sm text-foreground">{locale === 'ur' ? r.studentUr : r.studentEn}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{r.classUr}</div>
                      </TableCell>
                      <TableCell className="py-4 font-en font-extrabold text-sm text-foreground">Rs. {r.amount.toLocaleString()}</TableCell>
                      <TableCell className="py-4 text-xs font-semibold text-muted-foreground">{r.method}</TableCell>
                      <TableCell className="py-4 font-en text-xs text-muted-foreground">{r.date}</TableCell>
                      <TableCell className="py-4 text-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(r.id)}
                          className="font-bold text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30 rounded-xl gap-1.5 px-3"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{locale === 'ur' ? 'پرنٹ' : 'Print'}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Expenses Table */}
      {activeTab === 'expenses' && (
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border">
            <CardTitle className="text-lg font-extrabold flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-600" />
              <span>{locale === 'ur' ? 'جامعہ کے منظور شدہ اخراجات اور واؤچرز کا روزنامچہ' : 'Institution Approved Expense Vouchers Ledger'}</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              {locale === 'ur' ? 'تمام یوٹیلیٹی بلز، مطبخ راشن اور مرمت کے اخراجات کا ریکارڈ' : 'Complete audit trail of utilities, kitchen supplies and maintenance expenditure.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'واؤچر ID' : 'Voucher ID'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'مد / کیٹیگری' : 'Category & Description'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'رقم' : 'Amount'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'منظوری دہندہ' : 'Approved By'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 text-end">{locale === 'ur' ? 'واؤچر پرنٹ' : 'Action'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((e) => (
                    <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4 font-en font-bold text-xs text-rose-600">{e.id}</TableCell>
                      <TableCell className="py-4">
                        <div className="font-extrabold text-sm text-foreground">{locale === 'ur' ? e.categoryUr : e.categoryEn}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{e.descUr}</div>
                      </TableCell>
                      <TableCell className="py-4 font-en font-extrabold text-sm text-rose-600">Rs. {e.amount.toLocaleString()}</TableCell>
                      <TableCell className="py-4 text-xs font-medium text-muted-foreground">{e.approvedByUr}</TableCell>
                      <TableCell className="py-4 font-en text-xs text-muted-foreground">{e.date}</TableCell>
                      <TableCell className="py-4 text-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(e.id)}
                          className="font-bold text-xs rounded-xl gap-1.5 px-3"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{locale === 'ur' ? 'پرنٹ واؤچر' : 'Print Voucher'}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Payroll Table */}
      {activeTab === 'payroll' && (
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border">
            <CardTitle className="text-lg font-extrabold flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>{locale === 'ur' ? 'اساتذہ و ملازمین کی ماہانہ تنخواہ اور مشاہرہ شیٹ' : 'Staff & Faculty Monthly Salary Disbursement'}</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              {locale === 'ur' ? 'تمام ملازمین کی تنخواہ کی ادائیگی اور سلپ پرنٹ کرنے کا نظام' : 'Disburse and print monthly salary slips for faculty and administrative staff.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'ملازم کا نام و عہدہ' : 'Staff Member & Dept'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'ماہانہ مشاہرہ' : 'Monthly Salary'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'ادائیگی کا اسٹیٹس' : 'Status'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'ادائیگی کی تاریخ' : 'Payment Date'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 text-end">{locale === 'ur' ? 'تنخواہ سلپ' : 'Salary Slip'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payroll.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4">
                        <div className="font-extrabold text-sm text-foreground">{locale === 'ur' ? p.nameUr : p.nameEn}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{p.deptUr}</div>
                      </TableCell>
                      <TableCell className="py-4 font-en font-extrabold text-sm text-foreground">Rs. {p.salary.toLocaleString()}</TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{locale === 'ur' ? 'ادائیگی مکمل' : 'Disbursed'}</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-4 font-en text-xs text-muted-foreground">{p.date}</TableCell>
                      <TableCell className="py-4 text-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(p.id)}
                          className="font-bold text-xs rounded-xl gap-1.5 px-3"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{locale === 'ur' ? 'پرنٹ سلپ' : 'Print Slip'}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
