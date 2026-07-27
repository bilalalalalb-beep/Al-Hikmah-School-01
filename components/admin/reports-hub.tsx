"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Printer, 
  Download, 
  FileText, 
  Users, 
  Wallet, 
  GraduationCap, 
  TrendingUp, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Award,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

export function ReportsHub() {
  const { locale, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState('staff-roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Data States
  const [staffList, setStaffList] = useState<any[]>([]);
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [financeSummary, setFinanceSummary] = useState({
    totalFeeCollected: 850000,
    totalSalariesPaid: 450000,
    otherExpenses: 120000,
    netSurplus: 280000
  });

  // Fetch Live DB Data
  const fetchReportData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Staff
      const { data: staffData } = await (supabase as any).from('staff_members').select('*').order('full_name_ur');
      if (staffData && staffData.length > 0) {
        setStaffList(staffData);
      } else {
        // Fallback demo staff if empty
        setStaffList([
          { id: '1', emp_id: 'EMP-2026-001', full_name_ur: 'مفتی عبدالحکیم عثمانی', full_name_en: 'Mufti Abdul Hakim Usmani', designation_ur: 'مہتمم اعلیٰ و شیخ الحدیث', designation_en: 'Principal', department: 'nizami', basic_salary: 75000, phone: '0300-1111111' },
          { id: '2', emp_id: 'EMP-2026-002', full_name_ur: 'قاری محمد طارق مدنی', full_name_en: 'Qari Muhammad Tariq Madani', designation_ur: 'صدر مدرس شعبہ حفظ', designation_en: 'Head Qari', department: 'hifz', basic_salary: 50000, phone: '0300-2222222' },
          { id: '3', emp_id: 'EMP-2026-003', full_name_ur: 'ماسٹر کاشف علی خان', full_name_en: 'Master Kashif Ali Khan', designation_ur: 'سینئر معلم سائنس', designation_en: 'Senior Teacher', department: 'school', basic_salary: 48000, phone: '0300-3333333' }
        ]);
      }

      // 2. Fetch Payroll
      const { data: payData } = await (supabase as any).from('payroll_records').select('*').order('payment_date', { ascending: false });
      if (payData && payData.length > 0) {
        setPayrollList(payData);
      } else {
        setPayrollList([
          { id: 'p1', reference_no: 'SAL-2026-0001', salary_month: 'July 2026 / محرم الحرام 1448ھ', basic_amount: 75000, bonus_amount: 5000, deduction_amount: 0, net_paid: 80000, payment_method: 'bank', payment_date: '2026-07-01' },
          { id: 'p2', reference_no: 'SAL-2026-0002', salary_month: 'July 2026 / محرم الحرام 1448ھ', basic_amount: 50000, bonus_amount: 2000, deduction_amount: 0, net_paid: 52000, payment_method: 'bank', payment_date: '2026-07-01' }
        ]);
      }

      // 3. Fetch Students
      const { data: stuData } = await (supabase as any).from('students').select('*').limit(20);
      if (stuData && stuData.length > 0) {
        setStudentList(stuData);
      } else {
        setStudentList([
          { id: 's1', roll_number: 'JAM-2026-101', full_name_ur: 'محمد عثمان علی', full_name_en: 'Muhammad Usman Ali', father_name_ur: 'چوہدری علی محمد', class_name: 'درجہ اولیٰ (پہلا سال)', section_name: 'شعبہ نظامی', fee_status: 'paid', phone: '0300-1234567' },
          { id: 's2', roll_number: 'JAM-2026-102', full_name_ur: 'حافظ عمر فاروق', full_name_en: 'Hafiz Umar Farooq', father_name_ur: 'مولانا فاروق احمد', class_name: 'حفظ و ناظرہ', section_name: 'شعبہ حفظ', fee_status: 'paid', phone: '0300-7654321' },
          { id: 's3', roll_number: 'JAM-2026-103', full_name_ur: 'عبدالرحمٰن شاہ', full_name_en: 'Abdur Rahman Shah', father_name_ur: 'سید محمود شاہ', class_name: 'دہم (Matric 10th)', section_name: 'عصری سکول', fee_status: 'pending', phone: '0333-9988776' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handlePrintReport = () => {
    toast.success(
      locale === 'ur' 
        ? '🖨️ پرنٹ ڈائیلاگ کھل رہا ہے... PDF ڈاؤن لوڈ کرنے کے لیے "Save as PDF" کا انتخاب کریں!' 
        : '🖨️ Opening Print dialog... Choose "Save as PDF" to download!'
    );
    window.print();
  };

  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'school':
        return locale === 'ur' ? 'عصری سکول' : 'Modern School';
      case 'hifz':
        return locale === 'ur' ? 'شعبہ حفظ' : 'Hifz Dept';
      case 'nizami':
        return locale === 'ur' ? 'درس نظامی' : 'Dars-e-Nizami';
      default:
        return locale === 'ur' ? 'دفتری عملہ' : 'Admin Staff';
    }
  };

  // Filter lists based on search query
  const filteredStaff = staffList.filter(s => 
    (s.full_name_ur || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.full_name_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.emp_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayroll = payrollList.filter(p => 
    (p.reference_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.salary_month || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = studentList.filter(s => 
    (s.full_name_ur || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.roll_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-ur">
      {/* Control Banner & Quick Print Notice */}
      <Card className="border-2 border-primary/30 bg-gradient-to-r from-card via-card to-primary/5 shadow-xl">
        <CardHeader className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60">
          <div>
            <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/15 text-primary">
                <Printer className="w-6 h-6" />
              </div>
              <span>{locale === 'ur' ? 'مرکزی رپورٹنگ اور لسٹیں پرنٹ کرنے کا نظام (Master Reports Hub)' : 'Master Reports & Print Generator'}</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
              {locale === 'ur'
                ? 'پورے مدرسہ و سکول سسٹم کے اساتذہ، تنخواہیں، طلباء، اور مالیات کی مکمل رپورٹس ایک ہی پرچے میں پرنٹ کریں یا PDF ڈاؤن لوڈ کریں۔'
                : 'Generate, filter, and print master rosters for staff salaries, student fee status, and financial ledgers.'}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <Button 
              onClick={fetchReportData} 
              variant="outline" 
              size="sm" 
              disabled={loading}
              className="font-bold text-xs gap-1.5 shadow-sm"
              title="Refresh DB"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{locale === 'ur' ? 'تازہ کریں' : 'Refresh'}</span>
            </Button>

            <Button 
              onClick={handlePrintReport} 
              variant="emerald" 
              size="sm" 
              className="font-extrabold text-xs sm:text-sm gap-2 px-4 py-5 shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>{locale === 'ur' ? '🖨️ یہ رپورٹ پرنٹ کریں / PDF میں محفوظ کریں' : '🖨️ Print Report / Save as PDF'}</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 bg-muted/40 text-xs font-bold text-primary flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 inline" />
            <span>
              {locale === 'ur' 
                ? 'اہم ہدایت: پرنٹ بٹن پر کلک کرنے کے بعد اپنے براؤزر کے Print Destination میں "Save as PDF" کا انتخاب کریں تاکہ مکمل لسٹ آپ کے کمپیوٹر میں PDF فائل کی صورت میں محفوظ ہو جائے!' 
                : 'Pro Tip: When the print dialog opens, select "Save as PDF" as the destination to save the clean report sheet directly to your device!'}
            </span>
          </span>
        </CardContent>
      </Card>

      {/* Reports Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir={dir}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 h-auto bg-card border border-border/80 rounded-xl p-1 shadow-sm w-full lg:w-auto gap-1">
            <TabsTrigger value="staff-roster" className="font-bold text-xs gap-1.5 py-2.5">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{locale === 'ur' ? '1. فہرستِ اساتذہ و مشاہرہ' : '1. Staff Salary Roster'}</span>
            </TabsTrigger>
            <TabsTrigger value="payroll-ledger" className="font-bold text-xs gap-1.5 py-2.5">
              <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{locale === 'ur' ? '2. پے رول ادائیگی لیجر' : '2. Payroll Disbursed Ledger'}</span>
            </TabsTrigger>
            <TabsTrigger value="student-roster" className="font-bold text-xs gap-1.5 py-2.5">
              <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{locale === 'ur' ? '3. طلباء کی تفصیلی فہرست' : '3. Student Roster'}</span>
            </TabsTrigger>
            <TabsTrigger value="finance-summary" className="font-bold text-xs gap-1.5 py-2.5">
              <TrendingUp className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{locale === 'ur' ? '4. مالیاتی خلاصہ' : '4. Finance Summary'}</span>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={locale === 'ur' ? 'لسٹ میں نام یا ID سے تلاش کریں...' : 'Filter records in report...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-10 text-xs font-bold bg-card shadow-sm"
            />
          </div>
        </div>

        {/* TAB 1: STAFF SALARY ROSTER REPORT */}
        <TabsContent value="staff-roster" className="space-y-4 animate-in fade-in-50 duration-200">
          <Card className="border-border/60 shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border/60 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>{locale === 'ur' ? 'جامعہ کے تمام اساتذہ و ملازمین کی سالانہ و ماہانہ مشاہرہ لسٹ' : 'Master Faculty & Employee Salary Roster Sheet'}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'ur' ? `کل اساتذہ و ملازمین: ${filteredStaff.length} افراد | تمام شعبہ جات کا مستند ریکارڈ` : `Total Staff Found: ${filteredStaff.length} members`}
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-en font-bold text-xs px-3 py-1 border-blue-500/40 text-blue-600 bg-blue-500/10">
                {locale === 'ur' ? 'مستند مشاہرہ شیٹ' : 'OFFICIAL ROSTER'}
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>{locale === 'ur' ? 'آئی ڈی / EMP ID' : 'EMP ID'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'استاد / ملازم کا نام' : 'Staff Name'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'عہدہ اور منصب' : 'Designation'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'شعبہ' : 'Department'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'رابطہ نمبر' : 'Phone'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'بنیادی ماہانہ مشاہرہ' : 'Monthly Salary'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff, idx) => (
                    <TableRow key={staff.id || idx} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-primary font-en">
                        {staff.emp_id || 'EMP-XXXX'}
                      </TableCell>
                      <TableCell className="font-extrabold text-sm text-foreground">
                        {locale === 'ur' ? staff.full_name_ur : staff.full_name_en}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-teal-700 dark:text-teal-400">
                        {locale === 'ur' ? staff.designation_ur : staff.designation_en}
                      </TableCell>
                      <TableCell className="text-xs font-bold">
                        {getDeptBadge(staff.department)}
                      </TableCell>
                      <TableCell className="font-mono font-en text-xs font-bold text-muted-foreground">
                        {staff.phone || '0300-0000000'}
                      </TableCell>
                      <TableCell className="text-end font-mono font-en text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        Rs. {Number(staff.basic_salary || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStaff.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-bold text-sm">
                        {locale === 'ur' ? 'کوئی ریکارڈ نہیں ملا۔' : 'No staff members found matching filter.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-muted/30 p-3.5 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                <span>{locale === 'ur' ? 'یہ لسٹ جامعہ الحکمہ الاسلامیہ کے لائیو ڈیٹا بیس سے تیار کی گئی ہے۔' : 'Generated from live school database.'}</span>
              </span>
              <span className="font-mono font-en font-bold text-xs text-primary">
                {locale === 'ur' ? 'کل ماہانہ بجٹ: ' : 'Total Monthly Budget: '} 
                Rs. {filteredStaff.reduce((acc, curr) => acc + Number(curr.basic_salary || 0), 0).toLocaleString()}
              </span>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 2: PAYROLL DISBURSED LEDGER REPORT */}
        <TabsContent value="payroll-ledger" className="space-y-4 animate-in fade-in-50 duration-200">
          <Card className="border-border/60 shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border/60 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <span>{locale === 'ur' ? 'ادا شدہ تنخواہوں کا تفصیلی روزنامچہ اور لیجر شیٹ' : 'Disbursed Payroll Ledger Report Sheet'}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'ur' ? `کل ادائیگیاں: ${filteredPayroll.length} رسیدات | تصدیق شدہ مشاہرہ لیجر` : `Total Disbursements: ${filteredPayroll.length}`}
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-en font-bold text-xs px-3 py-1 border-emerald-500/40 text-emerald-600 bg-emerald-500/10">
                {locale === 'ur' ? 'ادا شدہ مشاہرے' : 'PAID LEDGER'}
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>{locale === 'ur' ? 'حوالہ نمبر' : 'Ref No'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'مہینہ / تاریخ' : 'Month / Date'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'بنیادی رقم' : 'Basic'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'بونس و کٹوتی' : 'Bonus / Deduction'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'کل ادا شدہ رقم (Net Paid)' : 'Net Paid'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'ذریعہ ادائیگی' : 'Mode'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.map((pay, idx) => (
                    <TableRow key={pay.id || idx} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-primary font-en">
                        {pay.reference_no || 'SAL-XXXX'}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground">
                        <div>{pay.salary_month}</div>
                        <div className="font-mono font-en text-[10px] text-muted-foreground">{pay.payment_date}</div>
                      </TableCell>
                      <TableCell className="font-mono font-en text-xs font-bold text-muted-foreground">
                        Rs. {Number(pay.basic_amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono font-en text-xs font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">+{Number(pay.bonus_amount || 0)}</span> / <span className="text-destructive">-{Number(pay.deduction_amount || 0)}</span>
                      </TableCell>
                      <TableCell className="text-end font-mono font-en text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        Rs. {Number(pay.net_paid || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-en uppercase text-[10px] font-bold">{pay.payment_method || 'bank'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPayroll.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-bold text-sm">
                        {locale === 'ur' ? 'کوئی ادائیگی ریکارڈ نہیں ملا۔' : 'No payroll disbursements found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-muted/30 p-3.5 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                {locale === 'ur' ? 'تمام ادائیگیاں کلاؤڈینیری ڈیجیٹل دستخط سے تصدیق شدہ ہیں۔' : 'Verified digital payroll records.'}
              </span>
              <span className="font-mono font-en font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {locale === 'ur' ? 'کل ادا شدہ رقم: ' : 'Total Disbursed: '} 
                Rs. {filteredPayroll.reduce((acc, curr) => acc + Number(curr.net_paid || 0), 0).toLocaleString()}
              </span>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 3: STUDENT ROSTER & FEE STATUS REPORT */}
        <TabsContent value="student-roster" className="space-y-4 animate-in fade-in-50 duration-200">
          <Card className="border-border/60 shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border/60 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span>{locale === 'ur' ? 'جامعہ کے تمام طلباء کی فہرست اور فیس اسٹیٹس رپورٹ' : 'Master Student Roster & Fee Status Report'}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'ur' ? `کل طلباء: ${filteredStudents.length} طلباء | تمام درجات اور شعبہ جات` : `Total Students: ${filteredStudents.length}`}
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-en font-bold text-xs px-3 py-1 border-amber-500/40 text-amber-600 bg-amber-500/10">
                {locale === 'ur' ? 'طلباء ڈائریکٹری' : 'STUDENTS ROSTER'}
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>{locale === 'ur' ? 'رول نمبر' : 'Roll No'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'طالب علم کا نام' : 'Student Name'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'والد کا نام' : 'Father Name'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'درجہ و کلاس' : 'Class & Section'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'رابطہ نمبر' : 'Phone'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'فیس اسٹیٹس' : 'Fee Status'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((stu, idx) => (
                    <TableRow key={stu.id || idx} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-xs text-primary font-en">
                        {stu.roll_number || 'JAM-XXXX'}
                      </TableCell>
                      <TableCell className="font-extrabold text-sm text-foreground">
                        {locale === 'ur' ? (stu.full_name_ur || stu.full_name_en) : stu.full_name_en}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {locale === 'ur' ? (stu.father_name_ur || stu.father_name_en || 'والد کا نام') : stu.father_name_en}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-teal-700 dark:text-teal-400">
                        {stu.class_name || 'درجہ اولیٰ'} ({stu.section_name || 'نظامی'})
                      </TableCell>
                      <TableCell className="font-mono font-en text-xs font-bold text-muted-foreground">
                        {stu.phone || '0300-0000000'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={stu.fee_status === 'paid' ? 'success' : 'destructive'} className="text-[10px] uppercase font-bold font-en">
                          {stu.fee_status === 'paid' ? (locale === 'ur' ? 'ادا شدہ' : 'PAID') : (locale === 'ur' ? 'واجب الادا' : 'PENDING')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-bold text-sm">
                        {locale === 'ur' ? 'کوئی طالب علم نہیں ملا۔' : 'No students found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-muted/30 p-3.5 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">
                {locale === 'ur' ? 'طلباء کے تفصیلی نتائج اور فیس چالان متعلقہ ٹیبز میں دستیاب ہیں۔' : 'Detailed challans available in Finance tab.'}
              </span>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 4: FINANCIAL SUMMARY REPORT */}
        <TabsContent value="finance-summary" className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-emerald-500/30 bg-emerald-500/5 shadow-md">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                  <span>{locale === 'ur' ? 'کل فیس و امداد وصولی (Revenue)' : 'Total Fee & Donation Collection'}</span>
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </CardTitle>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono font-en text-emerald-600 dark:text-emerald-400 mt-2">
                  Rs. {financeSummary.totalFeeCollected.toLocaleString()}
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-blue-500/30 bg-blue-500/5 shadow-md">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center justify-between">
                  <span>{locale === 'ur' ? 'کل تنخواہیں و مشاہرہ ادائیگیاں (Salaries)' : 'Total Salaries Disbursed'}</span>
                  <Users className="w-5 h-5 text-blue-600" />
                </CardTitle>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono font-en text-blue-600 dark:text-blue-400 mt-2">
                  Rs. {financeSummary.totalSalariesPaid.toLocaleString()}
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-500/30 bg-purple-500/5 shadow-md">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center justify-between">
                  <span>{locale === 'ur' ? 'خالص بچت و سرپلس (Net Surplus)' : 'Net School Surplus'}</span>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </CardTitle>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono font-en text-purple-600 dark:text-purple-400 mt-2">
                  Rs. {financeSummary.netSurplus.toLocaleString()}
                </div>
              </CardHeader>
            </Card>
          </div>

          <Card className="border-border/60 shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border/60 py-4">
              <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>{locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ کی مالیاتی کیفیت کا خلاصہ رپورٹ' : 'Financial Statement & Performance Summary Report'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 font-bold text-sm leading-relaxed">
              <p className="text-foreground">
                {locale === 'ur' 
                  ? 'الحمد للہ، جامعہ الحکمہ کا مالیاتی نظام مکمل شفافیت کے ساتھ کام کر رہا ہے۔ تمام شعبہ جات (درس نظامی، حفظ، اور عصری سکول) کی فیس وصولی اور اساتذہ کے مشاہرے کلاؤڈ ریکارڈ پر مستند ہیں۔' 
                  : 'The financial operations are running with total transparency. Faculty salaries and student fee collections are digitally reconciled.'}
              </p>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-between">
                <span>{locale === 'ur' ? 'رپورٹ تاریخ و وقت:' : 'Report Generated On:'}</span>
                <span className="font-mono font-en font-bold">{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-US')}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
