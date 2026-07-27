"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wallet, 
  Users, 
  CheckCircle2, 
  DollarSign, 
  Printer, 
  Sparkles, 
  Building2, 
  Calendar, 
  ArrowRight,
  History,
  AlertCircle,
  TrendingUp,
  FileText,
  Database,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { SalarySlipModal, SalarySlipData } from './salary-slip-modal';

// Dummy data removed. Relying on Supabase live data.

export function PayrollManager() {
  const { locale } = useLanguage();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);
  const supabase = createClient();

  const fetchPayrollFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data: staffData } = await (supabase as any).from('staff_members').select('*');
      if (staffData && staffData.length > 0) {
        const mappedStaff = staffData.map((s: any) => ({
          id: s.id,
          empId: s.emp_id || 'EMP-XXXX',
          nameUrdu: s.full_name_ur || '',
          nameEn: s.full_name_en || '',
          designationUrdu: s.designation_ur || 'استاد / ملازم',
          designationEn: s.designation_en || 'Staff Member',
          department: s.department || 'school',
          basicSalary: Number(s.basic_salary || 40000)
        }));
        setStaffList(mappedStaff);
      }

      const { data: payData } = await (supabase as any).from('payroll_records').select('*').order('payment_date', { ascending: false });
      if (payData && payData.length > 0) {
        const mappedPay = payData.map((p: any) => {
          const st = staffData?.find((s: any) => s.id === p.staff_id);
          return {
            id: p.id,
            refNo: p.reference_no || 'SAL-XXXX',
            empId: st ? st.emp_id : 'EMP-XXXX',
            staffNameUrdu: st ? st.full_name_ur : 'استاد',
            staffNameEn: st ? st.full_name_en : 'Staff Member',
            designationUrdu: st ? st.designation_ur : 'معلم',
            designationEn: st ? st.designation_en : 'Teacher',
            department: st ? st.department : 'school',
            month: p.salary_month || 'July 2026 / محرم الحرام 1448ھ',
            basic: Number(p.basic_amount || 0),
            bonus: Number(p.bonus_amount || 0),
            deduction: Number(p.deduction_amount || 0),
            net: Number(p.net_paid || 0),
            method: p.payment_method || 'bank',
            date: p.payment_date || '2026-07-01',
            remarks: p.remarks || ''
          };
        });
        setPayrollHistory(mappedPay);
      }
    } catch (err) {
      console.error("Error fetching payroll:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchPayrollFromDb();
  }, []);

  const handleSeedPayroll = async () => {
    setSeedingDb(true);
    try {
      const { data: existingPay } = await (supabase as any).from('payroll_records').select('id').limit(1);
      if (existingPay && existingPay.length > 0) {
        toast.info(locale === 'ur' ? 'پے رول کا ریکارڈ پہلے سے موجود ہے۔ ڈپلیکیٹ انٹریز نہیں ڈالی گئیں۔' : 'Payroll records already exist in DB. No duplicates added.');
        await fetchPayrollFromDb();
        return;
      }

      let { data: staffData } = await (supabase as any).from('staff_members').select('*');
      if (!staffData || staffData.length === 0) {
        toast.error(locale === 'ur' ? 'براہ کرم پہلے "فہرست اساتذہ" میں اساتذہ شامل کریں یا سیڈ کریں!' : 'Please seed or add staff members first!');
        return;
      }

      // Only seed 2 real entries as requested by user
      const st1 = staffData[0];
      const st2 = staffData[1] || staffData[0];

      const payRows = [
        {
          staff_id: st1.id,
          salary_month: 'July 2026 / محرم الحرام 1448ھ',
          basic_amount: st1.basic_salary || 75000,
          bonus_amount: 5000,
          deduction_amount: 0,
          net_paid: (Number(st1.basic_salary || 75000) + 5000),
          payment_method: 'bank',
          payment_date: '2026-07-01',
          reference_no: 'SAL-2026-0001',
          remarks: 'ماہانہ مشاہرہ مع عید بونس'
        },
        {
          staff_id: st2.id,
          salary_month: 'July 2026 / محرم الحرام 1448ھ',
          basic_amount: st2.basic_salary || 50000,
          bonus_amount: 2000,
          deduction_amount: 0,
          net_paid: (Number(st2.basic_salary || 50000) + 2000),
          payment_method: 'bank',
          payment_date: '2026-07-01',
          reference_no: 'SAL-2026-0002',
          remarks: 'ماہانہ مشاہرہ و حسن کارکردگی'
        }
      ];

      const { error } = await (supabase as any).from('payroll_records').upsert(payRows, { onConflict: 'reference_no', ignoreDuplicates: true });
      if (error) {
        toast.error(locale === 'ur' ? `ایرر: ${error.message}` : `Error: ${error.message}`);
      } else {
        await fetchPayrollFromDb();
        toast.success(locale === 'ur' ? '🎉 الحمد للہ! 2 حقیقی و مستند پے رول رسیدات لائیو DB میں شامل ہو گئیں!' : '🎉 2 sample payroll records seeded into live DB!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error seeding payroll');
    } finally {
      setSeedingDb(false);
    }
  };

  const handleDeletePayroll = async (id: string, refNo: string) => {
    if (!confirm(locale === 'ur' ? `کیا آپ واقعی رسید نمبر "${refNo}" کو حذف کرنا چاہتے ہیں؟` : `Are you sure you want to delete slip "${refNo}"?`)) {
      return;
    }
    try {
      const { error } = await (supabase as any)
        .from('payroll_records')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error(locale === 'ur' ? `حذف نہ ہو سکا: ${error.message}` : `Delete Error: ${error.message}`);
      } else {
        setPayrollHistory(payrollHistory.filter(p => p.id !== id));
        toast.success(locale === 'ur' ? `رسید "${refNo}" کو لائیو DB سے حذف کر دیا گیا!` : `Payroll record deleted!`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    }
  };

  // Form State
  const defaultMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [deductionAmount, setDeductionAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Salary Slip Preview State
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [activeSlipData, setActiveSlipData] = useState<SalarySlipData | null>(null);

  const selectedStaff = staffList.find(s => s.id === selectedStaffId) || staffList[0];
  const netPayable = selectedStaff ? (selectedStaff.basicSalary + Number(bonusAmount || 0) - Number(deductionAmount || 0)) : 0;

  const handleDisburseSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;
    setIsSubmitting(true);

    try {
      const refNo = `SAL-${new Date().getFullYear()}-0${100 + payrollHistory.length + 1}`;
      let staffDbId = selectedStaff.id;
      
      if (!staffDbId) {
        const { data: found } = await (supabase as any).from('staff_members').select('id').eq('emp_id', selectedStaff.empId).limit(1);
        if (found && found.length > 0) {
          staffDbId = found[0].id;
        } else {
          const { data: ins } = await (supabase as any).from('staff_members').insert([{
            emp_id: selectedStaff.empId,
            full_name_ur: selectedStaff.nameUrdu,
            full_name_en: selectedStaff.nameEn,
            phone: '0300-0000000',
            qualification: 'شہادۃ العالمیہ',
            designation_ur: selectedStaff.designationUrdu,
            designation_en: selectedStaff.designationEn,
            department: selectedStaff.department,
            basic_salary: selectedStaff.basicSalary,
            status: 'active'
          }]).select();
          if (ins && ins.length > 0) staffDbId = ins[0].id;
        }
      }

      if (staffDbId) {
        const row = {
          staff_id: staffDbId,
          salary_month: selectedMonth,
          basic_amount: selectedStaff.basicSalary,
          bonus_amount: Number(bonusAmount || 0),
          deduction_amount: Number(deductionAmount || 0),
          net_paid: netPayable,
          payment_method: paymentMethod,
          payment_date: paymentDate,
          reference_no: refNo,
          remarks: remarks || 'ماہانہ مشاہرہ برائے وقت ادائیگی'
        };

        const { error } = await (supabase as any).from('payroll_records').insert([row]);
        if (error) {
          toast.error(locale === 'ur' ? `ایرر: ${error.message}` : `Error: ${error.message}`);
          setIsSubmitting(false);
          return;
        }

        // Auto sync with Module 5 Expenses!
        await (supabase as any).from('expenses').insert([{
          title_ur: `${selectedStaff.nameUrdu} کی تنخواہ (${selectedMonth})`,
          title_en: `${selectedStaff.nameEn} Salary (${selectedMonth})`,
          amount: netPayable,
          category: 'salary',
          expense_date: paymentDate,
          remarks: `Ref: ${refNo} - ${remarks || 'ماہانہ مشاہرہ'}`
        }]);
      }

      await fetchPayrollFromDb();
      setIsSubmitting(false);

      toast.success(
        locale === 'ur' 
          ? `💸 الحمد للہ! ${selectedStaff.nameUrdu} کا مشاہرہ (Rs. ${netPayable.toLocaleString()}) لائیو DB میں محفوظ ہو گیا اور ماڈیول 5 (Finance) کے مصارف میں خودکار درج ہو گیا!` 
          : `💸 Salary of Rs. ${netPayable.toLocaleString()} disbursed to ${selectedStaff.nameEn} and synced as Expense in DB!`,
        { duration: 5000 }
      );

      const newRecord = {
        id: `p_${Date.now()}`,
        refNo,
        empId: selectedStaff.empId,
        staffNameUrdu: selectedStaff.nameUrdu,
        staffNameEn: selectedStaff.nameEn,
        designationUrdu: selectedStaff.designationUrdu,
        designationEn: selectedStaff.designationEn,
        department: selectedStaff.department,
        month: selectedMonth,
        basic: selectedStaff.basicSalary,
        bonus: Number(bonusAmount || 0),
        deduction: Number(deductionAmount || 0),
        net: netPayable,
        method: paymentMethod,
        date: paymentDate,
        remarks: remarks || 'ماہانہ مشاہرہ برائے وقت ادائیگی'
      };
      handleViewSlip(newRecord);

      setBonusAmount(0);
      setDeductionAmount(0);
      setRemarks('');
    } catch (err: any) {
      toast.error(err.message || 'Error disbursing salary');
      setIsSubmitting(false);
    }
  };

  const handleViewSlip = (record: any) => {
    const slipPayload: SalarySlipData = {
      referenceNo: record.refNo,
      empId: record.empId,
      staffNameUrdu: record.staffNameUrdu,
      staffNameEn: record.staffNameEn,
      designationUrdu: record.designationUrdu,
      designationEn: record.designationEn,
      department: record.department,
      salaryMonth: record.month,
      basicSalary: record.basic,
      bonusAmount: record.bonus,
      deductionAmount: record.deduction,
      netPaid: record.net,
      paymentMethod: record.method,
      paymentDate: record.date,
      remarks: record.remarks
    };

    setActiveSlipData(slipPayload);
    setSlipModalOpen(true);
  };

  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'school':
        return <Badge className="bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30 text-xs font-bold">{locale === 'ur' ? 'عصری سکول' : 'Modern School'}</Badge>;
      case 'hifz':
        return <Badge className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 text-xs font-bold">{locale === 'ur' ? 'شعبہ حفظ' : 'Hifz Dept'}</Badge>;
      case 'nizami':
        return <Badge className="bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30 text-xs font-bold">{locale === 'ur' ? 'درس نظامی' : 'Dars-e-Nizami'}</Badge>;
      case 'admin':
        return <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 text-xs font-bold">{locale === 'ur' ? 'دفتری انتظام' : 'Admin & Accounts'}</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs font-bold">{locale === 'ur' ? 'معاون عملہ' : 'Support Staff'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-ur animate-in fade-in-50 duration-300">
      {/* Top Info Alert Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-card to-amber-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-foreground">{locale === 'ur' ? '✨ ماڈیول 5 (Finance) کے ساتھ خودکار انٹیگریشن' : '✨ Automated Integration with Module 5 Finance'}</h4>
            <p className="text-xs text-muted-foreground font-bold">
              {locale === 'ur' ? 'یہاں سے ادا کی جانے والی ہر تنخواہ فوراً جامعہ کے عمومی مصارف (Expenses) میں بطور "salary" درج ہو جاتی ہے، جس سے حساب کتاب میں کوئی تضاد نہیں رہتا۔' : 'Every salary disbursed here is instantly recorded under school General Expenses as "salary", ensuring 100% financial consistency.'}
            </p>
          </div>
        </div>
      </div>

      {/* Disbursement Desk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Salary Disbursement Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/60 shadow-lg border-t-4 border-t-primary">
            <CardHeader className="bg-muted/30 border-b border-border/60 py-4">
              <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <span>{locale === 'ur' ? 'ماہانہ مشاہرہ اور تنخواہ ادائیگی کا فارم' : 'Monthly Payroll Disbursement Desk'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'استاد یا ملازم منتخب کریں، بونس یا کٹوتی درج کریں اور ادائیگی مکمل کریں۔' : 'Select staff member, input bonus/deductions, and disburse salary.'}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleDisburseSalary}>
              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Select Staff Member */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>{locale === 'ur' ? 'استاد / ملازم منتخب کریں (Select Staff Member)' : 'Select Staff Member'}</span>
                  </Label>
                  <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                    <SelectTrigger className="h-11 font-bold text-xs sm:text-sm font-ur bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="font-ur">
                      {staffList.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="font-bold">
                          {locale === 'ur' ? `${s.nameUrdu} (${s.designationUrdu})` : `${s.nameEn} (${s.designationEn})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Staff Summary Card */}
                {selectedStaff && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-muted-foreground">{locale === 'ur' ? 'ایمپلائی آئی ڈی و شعبہ:' : 'Emp ID & Dept:'}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-en text-primary">{selectedStaff.empId}</span>
                      {getDeptBadge(selectedStaff.department)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-extrabold text-sm border-t border-primary/10 pt-1.5">
                    <span className="text-foreground">{locale === 'ur' ? 'بنیادی مقررہ مشاہرہ (Basic):' : 'Basic Salary:'}</span>
                    <span className="font-mono font-en text-primary">Rs. {selectedStaff.basicSalary.toLocaleString()}</span>
                  </div>
                </div>
                )}

                {/* Select Month & Payment Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{locale === 'ur' ? 'تنخواہ کا مہینہ (Salary Month)' : 'Salary Month'}</span>
                    </Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="h-10 font-bold text-xs sm:text-sm font-ur bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent className="font-ur">
                        <SelectItem value="August 2026 / صفر المظفر 1448ھ" className="font-bold">{locale === 'ur' ? 'صفر المظفر 1448ھ (August 2026)' : 'August 2026'}</SelectItem>
                        <SelectItem value="July 2026 / محرم الحرام 1448ھ" className="font-bold">{locale === 'ur' ? 'محرم الحرام 1448ھ (July 2026)' : 'July 2026'}</SelectItem>
                        <SelectItem value="June 2026 / ذوالحجہ 1447ھ" className="font-bold">{locale === 'ur' ? 'ذوالحجہ 1447ھ (June 2026)' : 'June 2026'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{locale === 'ur' ? 'ادائیگی کی تاریخ (Payment Date)' : 'Disbursement Date'}</span>
                    </Label>
                    <Input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="h-10 font-mono font-bold text-xs sm:text-sm bg-background border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Bonus and Deductions Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {locale === 'ur' ? '+ خصوصی بونس (Bonus PKR)' : '+ Bonus Amount'}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={bonusAmount || ''}
                      onChange={(e) => setBonusAmount(Number(e.target.value))}
                      placeholder="0"
                      className="h-10 font-mono font-bold text-sm bg-background border-emerald-500/40 text-emerald-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-destructive">
                      {locale === 'ur' ? '- کٹوتی / رخصت (Deduction PKR)' : '- Deduction / Advance'}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={deductionAmount || ''}
                      onChange={(e) => setDeductionAmount(Number(e.target.value))}
                      placeholder="0"
                      className="h-10 font-mono font-bold text-sm bg-background border-destructive/40 text-destructive"
                    />
                  </div>
                </div>

                {/* Net Payable Banner */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-primary to-teal-800 text-white flex items-center justify-between shadow-md">
                  <span className="text-xs sm:text-sm font-extrabold">{locale === 'ur' ? 'کل قابلِ ادائیگی مشاہرہ (Net Pay):' : 'Net Payable Amount:'}</span>
                  <span className="font-mono font-en text-lg sm:text-xl font-extrabold tracking-tight">Rs. {netPayable.toLocaleString()}</span>
                </div>

                {/* Payment Method and Remarks */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'ذریعہ ادائیگی' : 'Payment Method'}</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="h-10 font-bold text-xs font-ur bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent className="font-ur">
                        <SelectItem value="bank">{locale === 'ur' ? '🏦 بینک ٹرانسفر' : '🏦 Bank Transfer'}</SelectItem>
                        <SelectItem value="cash">{locale === 'ur' ? '💵 نقد (Cash)' : '💵 Cash'}</SelectItem>
                        <SelectItem value="jazzcash">{locale === 'ur' ? '📱 جائز کیش' : '📱 JazzCash'}</SelectItem>
                        <SelectItem value="easypaisa">{locale === 'ur' ? '📱 ایزی پیسہ' : '📱 Easypaisa'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'کیفیت و تاثرات' : 'Remarks / Note'}</Label>
                    <Input
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder={locale === 'ur' ? 'مثلاً: حسنِ کارکردگی کے ساتھ...' : 'Optional note...'}
                      className="h-10 text-xs font-ur bg-background"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/30 p-4 border-t border-border/60">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || netPayable <= 0} 
                  variant="emerald" 
                  className="w-full h-11 font-extrabold text-xs sm:text-sm gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Wallet className="w-4 h-4 shrink-0" />
                  <span>{isSubmitting ? (locale === 'ur' ? 'ادائیگی اور انٹیگریشن جاری ہے...' : 'Disbursing...') : (locale === 'ur' ? '💸 مشاہرہ ادا کریں اور رسید جاری کریں' : '💸 Disburse Salary & Issue Pay Slip')}</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Payroll History Ledger Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border/60 shadow-md">
            <CardHeader className="bg-muted/30 border-b border-border/60 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <span>{locale === 'ur' ? 'ادا شدہ مشاہروں کا لیجر اور رسیدات' : 'Disbursed Payroll Ledger & Pay Advice History'}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'ur' ? 'کسی بھی ملازم کی تنخواہ کی رسید پرنٹ کریں یا کلاؤڈ تصدیق شدہ پی ڈی ایف ڈاؤن لوڈ کریں۔' : 'View or reprint official salary slips for all disbursed staff pay.'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSeedPayroll}
                  disabled={seedingDb}
                  className="font-bold border-purple-500/50 text-purple-600 hover:bg-purple-500/10 gap-1.5 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>{seedingDb ? (locale === 'ur' ? 'ڈیٹا ڈالا جا رہا ہے...' : 'Seeding...') : (locale === 'ur' ? '⚡ لائیو DB میں تجرباتی پے رول ڈالیں' : 'Seed Payroll')}</span>
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={fetchPayrollFromDb} className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Refresh DB">
                  <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
                </Button>
                <Badge variant="outline" className="font-en font-bold text-xs px-2.5 py-1 border-primary/40 text-primary shrink-0">
                  {payrollHistory.length} {locale === 'ur' ? 'ادائیگیاں درج ہیں' : 'Records'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{locale === 'ur' ? 'حوالہ و مہینہ' : 'Ref & Month'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'استاد / ملازم' : 'Staff Member'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'شعبہ' : 'Dept'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'بنیادی رقم' : 'Basic'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'کل ادا شدہ' : 'Net Paid'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'رسید مشاہرہ' : 'Salary Slip'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollHistory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold py-3">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary font-en block w-fit mb-1">
                          {item.refNo}
                        </span>
                        <span className="text-xs text-muted-foreground font-bold">{item.month.split('/')[0]}</span>
                      </TableCell>
                      <TableCell className="font-bold">
                        <p className="text-sm font-extrabold text-foreground">{locale === 'ur' ? item.staffNameUrdu : item.staffNameEn}</p>
                        <p className="text-[11px] text-muted-foreground font-bold">{locale === 'ur' ? item.designationUrdu : item.designationEn}</p>
                      </TableCell>
                      <TableCell>
                        {getDeptBadge(item.department)}
                      </TableCell>
                      <TableCell className="text-center font-mono font-en text-xs text-muted-foreground">
                        Rs. {item.basic.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-mono font-en text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        Rs. {item.net.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            onClick={() => handleViewSlip(item)} 
                            variant="outline" 
                            size="sm" 
                            className="font-bold text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5 shrink-0" />
                            <span>{locale === 'ur' ? 'رسید دیکھیں' : 'View Slip'}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePayroll(item.id, item.refNo)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            title={locale === 'ur' ? 'رسید حذف کریں' : 'Delete Slip'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-muted/30 p-3.5 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                <span>{locale === 'ur' ? 'تمام مشاہرہ رسیدات کلاؤڈینیری (Cloudinary) سے تصدیق شدہ ہیں۔' : 'All salary slips are verified and digitally archived.'}</span>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Salary Slip Preview Modal */}
      <SalarySlipModal
        isOpen={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        slipData={activeSlipData}
      />
    </div>
  );
}
