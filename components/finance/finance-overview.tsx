"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  Printer, 
  Download, 
  Send, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  BookOpen,
  PieChart,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { FeeCollector } from './fee-collector';
import { ExpenseManager } from './expense-manager';

// Defaulters list for demo
const defaulterList = [
  { id: 'def1', regId: 'REG-2026-0003', nameUrdu: 'طلحہ محمود عثمانی', name: 'Talha Mahmood Usmani', classNameUrdu: 'درجہ اول (ناظرہ و بنیادی تعلیم)', classNameEn: 'Grade 1 (Nazira)', fatherName: 'محمود عالم', phone: '0333-9876543', pendingAmount: 3000, monthsOverdue: 1, lastPaid: '2026-06-05' },
  { id: 'def2', regId: 'REG-2026-0006', nameUrdu: 'عبدالرحمٰن سندھی', name: 'Abdur Rahman Sindhi', classNameUrdu: 'شعبہ حفظ القرآن (دارالحفظ)', classNameEn: 'Hifz Dept', fatherName: 'ابراھیم سندھی', phone: '0312-4433221', pendingAmount: 4000, monthsOverdue: 2, lastPaid: '2026-05-10' },
];

export function FinanceOverview() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample Aggregated Numbers (in PKR)
  const totalRevenue = 345000;
  const totalExpenses = 240000;
  const netSurplus = totalRevenue - totalExpenses;
  const totalDefaulterDues = defaulterList.reduce((acc, curr) => acc + curr.pendingAmount, 0);

  const handleSendReminder = (studentName: string, phone: string) => {
    toast.success(locale === 'ur' ? `📢 والد (${phone}) کو فیس ادا کرنے کا ایس ایم ایس (SMS) ارسال کر دیا گیا!` : `📢 SMS reminder sent to guardian at ${phone}!`);
  };

  const handlePrintDefaulters = () => {
    toast.success(locale === 'ur' ? '🖨️ فیس نادہندگان کی لسٹ پرنٹ کی جا رہی ہے...' : '🖨️ Printing fee defaulters sheet...');
    window.print();
  };

  return (
    <div className="space-y-6 font-ur">
      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-emerald-500/10 via-card to-card border-s-4 border-s-emerald-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل ماہانہ آمدنی (Revenue)' : 'Total Monthly Revenue'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">Rs. {totalRevenue.toLocaleString()}</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {locale === 'ur' ? 'ٹیوشن، داخلہ و عطیات' : 'Fees, admission & grants'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-rose-500/10 via-card to-card border-s-4 border-s-rose-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل ماہانہ اخراجات (Expenses)' : 'Total Monthly Expenses'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">Rs. {totalExpenses.toLocaleString()}</h3>
              <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> {locale === 'ur' ? 'تنخواہیں، بلز و طعام' : 'Salaries, utilities & ration'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-700 flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-blue-500/10 via-card to-card border-s-4 border-s-blue-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'خالص بچت / توازن (Net Surplus)' : 'Net Surplus Balance'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-blue-400 font-en mt-1">+ Rs. {netSurplus.toLocaleString()}</h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1">{locale === 'ur' ? 'آمدن و اخراجات کا مثبت فرق' : 'Positive operating surplus'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-amber-500/10 via-card to-card border-s-4 border-s-amber-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'نادہندگان بقایاجات (Defaulters)' : 'Defaulter Pending Dues'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-400 font-en mt-1">Rs. {totalDefaulterDues.toLocaleString()}</h3>
              <p className="text-[11px] text-amber-700 font-bold mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {locale === 'ur' ? `${defaulterList.length} طلباء کی فیس تاخیر کا شکار` : `${defaulterList.length} students overdue`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 h-auto bg-card border border-border/80 rounded-xl p-1 shadow-sm gap-1">
          <TabsTrigger value="overview" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <PieChart className="w-4 h-4 text-primary shrink-0" />
            <span>{locale === 'ur' ? '1. مالیاتی جائزہ اور نادہندگان (Overview & Defaulters)' : '1. Overview & Defaulters'}</span>
          </TabsTrigger>
          <TabsTrigger value="collection" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{locale === 'ur' ? '2. فیس وصولی ڈیسک (Fee Collection Desk)' : '2. Fee Collection Desk'}</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <BookOpen className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{locale === 'ur' ? '3. روزنامچہ اخراجات (Expense Ledger)' : '3. Expense Ledger'}</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW & DEFAULTERS */}
        <TabsContent value="overview" className="pt-4 space-y-6 animate-in fade-in-50 duration-200">
          {/* Revenue vs Expense Chart Summary Card */}
          <Card className="border-border/60 shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border/60 py-4">
              <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                <span>{locale === 'ur' ? 'شعبہ وار مالیاتی تناسب (Departmental Breakdown)' : 'Departmental Revenue & Expense Ratio'}</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {locale === 'ur' ? 'عصری سکول، شعبہ حفظ القرآن، اور درس نظامی کا مالیاتی تخمینہ اور فیصدی حصہ۔' : 'Estimated financial distribution across Modern School, Hifz Department, and Dars-e-Nizami.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-extrabold">
                    <span>{locale === 'ur' ? 'عصری سکول (پرائمری تا میٹرک) - فیس وصولی' : 'Modern School (Primary to Matric) - Fee Revenue'}</span>
                    <span className="font-mono font-en text-emerald-600">Rs. 210,000 (60%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-extrabold">
                    <span>{locale === 'ur' ? 'شعبہ حفظ القرآن و دارالاقامہ - طعام و قیام' : 'Hifz Dept & Boarding - Mess Revenue'}</span>
                    <span className="font-mono font-en text-blue-600">Rs. 85,000 (25%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-extrabold">
                    <span>{locale === 'ur' ? 'درس نظامی (عالمیت و دورہ حدیث) - رجسٹریشن و کتب' : 'Dars-e-Nizami - Reg & Books Fee'}</span>
                    <span className="font-mono font-en text-purple-600">Rs. 50,000 (15%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Defaulters Report Table */}
          <Card className="border-border/60 shadow-md border-t-4 border-t-amber-500">
            <CardHeader className="bg-amber-500/5 border-b border-border/60 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  <span>{locale === 'ur' ? 'فیس نادہندگان کی خصوصی رپورٹ (Fee Defaulters List)' : 'Overdue Fee Defaulters Report'}</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {locale === 'ur' ? 'وہ طلباء جن کی فیس مقررہ تاریخ کے بعد بھی واجب الادا ہے۔ والدین کو فوری ایس ایم ایس یاددہانی ارسال کریں۔' : 'Students with overdue dues exceeding 30 days. Send immediate reminders to guardians.'}
                </CardDescription>
              </div>
              <Button onClick={handlePrintDefaulters} variant="outline" size="sm" className="font-bold text-xs gap-1.5 shrink-0">
                <Printer className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{locale === 'ur' ? '🖨️ لسٹ پرنٹ کریں (Print Defaulters)' : '🖨️ Print Defaulters'}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'ur' ? 'طالب علم و REG ID' : 'Student & ID'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'درجہ / کلاس' : 'Class / Grade'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'والد کا نام اور رابطہ' : 'Father & Phone'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'تاخیر کے مہینے' : 'Months Overdue'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'واجب الادا بقایہ رقم' : 'Pending Amount'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'اقدام' : 'Action'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaulterList.map((def) => (
                    <TableRow key={def.id} className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                      <TableCell className="font-bold py-3.5">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-en">
                            {def.regId}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-foreground">{locale === 'ur' ? def.nameUrdu : def.name}</h4>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {locale === 'ur' ? def.classNameUrdu : def.classNameEn}
                      </TableCell>
                      <TableCell className="text-xs font-bold">
                        <div className="text-foreground">{def.fatherName}</div>
                        <div className="font-mono text-[11px] text-muted-foreground font-en">{def.phone}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive" className="text-[10px] font-bold">
                          {def.monthsOverdue} {locale === 'ur' ? 'ماہ تاخیر' : 'Month(s)'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-en text-base font-extrabold text-rose-600 dark:text-rose-400">
                        Rs. {def.pendingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-end">
                        <Button 
                          onClick={() => handleSendReminder(def.nameUrdu, def.phone)} 
                          variant="secondary" 
                          size="sm" 
                          className="font-bold text-xs gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300"
                        >
                          <Send className="w-3.5 h-3.5 shrink-0" />
                          <span>{locale === 'ur' ? '📢 یاددہانی بھیجیں' : '📢 SMS Reminder'}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t border-border/60 flex items-center justify-between">
              <p className="text-xs font-bold text-muted-foreground">
                {locale === 'ur' ? 'ہدایت: مسلسل 3 ماہ تک فیس ادا نہ کرنے والے طلباء کا داخلہ پرنسپل کی اجازت سے معطل کیا جا سکتا ہے۔' : 'Tip: Students exceeding 3 months of non-payment require administrative review.'}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 2: FEE COLLECTION DESK */}
        <TabsContent value="collection" className="pt-4 animate-in fade-in-50 duration-200">
          <FeeCollector />
        </TabsContent>

        {/* TAB 3: EXPENSE LEDGER */}
        <TabsContent value="expenses" className="pt-4 animate-in fade-in-50 duration-200">
          <ExpenseManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
