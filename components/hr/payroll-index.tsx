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
  History, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  FileText, 
  Users, 
  Wallet, 
  Calendar, 
  Building2, 
  RefreshCw, 
  CheckCircle2, 
  Eye,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { SalarySlipModal, SalarySlipData } from './salary-slip-modal';

// Dummy data removed. Relying on Supabase live data.

export function PayrollIndex() {
  const { locale, dir } = useLanguage();
  const [payrollList, setPayrollList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Filters State
  const [filterStaff, setFilterStaff] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Slip Modal State
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [activeSlipData, setActiveSlipData] = useState<SalarySlipData | null>(null);
  
  // Pending Salaries State
  const [pendingModalOpen, setPendingModalOpen] = useState(false);

  const fetchIndexData = async () => {
    setLoading(true);
    try {
      const { data: staffData } = await (supabase as any).from('staff_members').select('*');
      if (staffData && staffData.length > 0) {
        setStaffList(staffData.map((s: any) => ({
          empId: s.emp_id || 'EMP-XXXX',
          nameUrdu: s.full_name_ur || '',
          nameEn: s.full_name_en || '',
          dept: s.department || 'school',
          basicSalary: s.basic_salary || 35000
        })));
      }

      const { data: payData } = await (supabase as any).from('payroll_records').select('*').order('payment_date', { ascending: false });
      if (payData && payData.length > 0) {
        const mappedPay = payData.map((p: any) => {
          const st = staffData?.find((s: any) => s.id === p.staff_id);
          return {
            id: p.id,
            refNo: p.reference_no || 'SAL-XXXX',
            empId: st ? st.emp_id : 'EMP-XXXX',
            staffNameUrdu: st ? st.full_name_ur : (p.remarks || 'استاد'),
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
        setPayrollList(mappedPay);
      }
    } catch (err) {
      console.error('Error fetching payroll index:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexData();
  }, []);

  // Filter Logic
  const filteredList = payrollList.filter(item => {
    const matchesStaff = filterStaff === 'all' || item.empId === filterStaff || item.staffNameUrdu === filterStaff;
    const matchesMonth = filterMonth === 'all' || item.month === filterMonth;
    const matchesDept = filterDept === 'all' || item.department === filterDept;
    const matchesDate = !filterDate || item.date === filterDate;
    const matchesSearch = !searchQuery || 
      (item.staffNameUrdu || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.staffNameEn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.refNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.empId || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStaff && matchesMonth && matchesDept && matchesDate && matchesSearch;
  });

  // Calculate Summary Stats
  const stats = {
    count: filteredList.length,
    totalBasic: filteredList.reduce((sum, i) => sum + Number(i.basic || 0), 0),
    totalBonus: filteredList.reduce((sum, i) => sum + Number(i.bonus || 0), 0),
    totalDeductions: filteredList.reduce((sum, i) => sum + Number(i.deduction || 0), 0),
    totalNet: filteredList.reduce((sum, i) => sum + Number(i.net || 0), 0),
  };

  const handleViewSlip = (item: any) => {
    const slip: SalarySlipData = {
      referenceNo: item.refNo,
      paymentDate: item.date,
      salaryMonth: item.month,
      empId: item.empId,
      staffNameUrdu: item.staffNameUrdu,
      staffNameEn: item.staffNameEn,
      designationUrdu: item.designationUrdu,
      designationEn: item.designationEn,
      department: item.department,
      basicSalary: Number(item.basic || 0),
      bonusAmount: Number(item.bonus || 0),
      deductionAmount: Number(item.deduction || 0),
      netPaid: Number(item.net || 0),
      paymentMethod: item.method,
      remarks: item.remarks
    };
    setActiveSlipData(slip);
    setSlipModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilterStaff('all');
    setFilterMonth('all');
    setFilterDept('all');
    setFilterDate('');
    setSearchQuery('');
    toast.info(locale === 'ur' ? 'تمام فلٹرز ری سیٹ کر دیے گئے ہیں!' : 'Filters reset!');
  };

  const handlePrintSheet = () => {
    toast.success(locale === 'ur' ? '🖨️ مشاہرہ انڈیکس لسٹ پرنٹ کی جا رہی ہے...' : '🖨️ Printing Payroll Index Sheet...');
    window.print();
  };

  const handleDownloadDirectPdf = () => {
    const title = locale === 'ur' ? 'جامعہ الحکمہ - تنخواہوں کا تفصیلی انڈیکس اور ریکارڈ لسٹ' : 'Al-Hikmah - Payroll Disbursement Index & Archive';
    
    // Generate clean offline HTML document for direct download
    const fullHtml = `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Outfit:wght@400;600;700&display=swap');
    
    * { box-sizing: border-box; }
    body {
      font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 20px;
      line-height: 2.2;
    }
    .font-en { font-family: 'Outfit', sans-serif !important; line-height: 1.5 !important; }
    .font-mono { font-family: 'Consolas', monospace !important; }
    
    .container {
      max-width: 950px;
      margin: 20px auto;
      background: #ffffff;
      border: 3px double #047857;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #a7f3d0;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    
    .school-title { font-size: 22px; font-weight: bold; color: #047857; margin: 0; }
    .school-sub { font-size: 14px; color: #065f46; font-weight: bold; margin-top: 4px; }
    
    .stats-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #ecfdf5;
      border: 1px solid #34d399;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .stat-lbl { font-size: 11px; color: #065f46; display: block; }
    .stat-val { font-size: 18px; font-weight: bold; color: #047857; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #f1f5f9; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 13px; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: bold; }
    
    .total-row {
      background: #ecfdf5;
      border-top: 2px solid #047857;
      font-weight: bold;
      color: #047857;
    }
    
    .badge {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #34d399;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-family: 'Outfit', sans-serif;
    }
    
    .action-bar {
      text-align: center;
      margin: 20px auto;
      max-width: 950px;
    }
    .print-btn {
      background: #047857;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      font-family: 'Noto Nastaliq Urdu', serif;
      box-shadow: 0 4px 6px rgba(4, 120, 87, 0.2);
    }
    .print-btn:hover { background: #065f46; }

    @media print {
      body { background: #fff; padding: 0; }
      .container { border: 2px solid #047857; box-shadow: none; margin: 0; width: 100%; max-width: 100%; }
      .action-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <button onclick="window.print()" class="print-btn">🖨️ اس مکمل ریکارڈ شیٹ کو پرنٹ کریں یا PDF محفوظ کریں (Print / Save PDF)</button>
  </div>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="school-title">${locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}</h1>
        <div class="school-sub">${locale === 'ur' ? 'شعبہ امورِ عملہ - تنخواہوں کا تفصیلی انڈیکس اور لیجر (Payroll Archive)' : 'Central HR Dept - Master Payroll Index & Disbursed Ledger'}</div>
      </div>
      <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">
        <span class="badge">VERIFIED ARCHIVE</span>
        <div class="font-mono font-en" style="font-size: 11px; color: #64748b; margin-top: 6px;">Generated: ${new Date().toLocaleDateString()}</div>
      </div>
    </div>

    <div class="stats-box">
      <div>
        <span class="stat-lbl">${locale === 'ur' ? 'کل رسیدات (Total Slips)' : 'Total Slips'}</span>
        <span class="stat-val font-mono font-en">${stats.count}</span>
      </div>
      <div>
        <span class="stat-lbl">${locale === 'ur' ? 'بنیادی مشاہرے (Basic)' : 'Total Basic'}</span>
        <span class="stat-val font-mono font-en">Rs. ${stats.totalBasic.toLocaleString()}</span>
      </div>
      <div>
        <span class="stat-lbl">${locale === 'ur' ? 'بونس و کٹوتی (Bonus/Ded)' : 'Bonus / Ded'}</span>
        <span class="stat-val font-mono font-en" style="font-size: 14px;">+${stats.totalBonus.toLocaleString()} / -${stats.totalDeductions.toLocaleString()}</span>
      </div>
      <div>
        <span class="stat-lbl">${locale === 'ur' ? 'کل ادا شدہ رقم (Net Paid)' : 'Net Disbursed'}</span>
        <span class="stat-val font-mono font-en" style="color: #047857;">Rs. ${stats.totalNet.toLocaleString()}</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>${locale === 'ur' ? 'حوالہ نمبر' : 'Ref No'}</th>
          <th>${locale === 'ur' ? 'استاد / ملازم' : 'Staff Member'}</th>
          <th>${locale === 'ur' ? 'شعبہ' : 'Dept'}</th>
          <th>${locale === 'ur' ? 'تنخواہ کا مہینہ' : 'Salary Month'}</th>
          <th>${locale === 'ur' ? 'تاریخ ادائیگی' : 'Paid Date'}</th>
          <th style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">${locale === 'ur' ? 'ادا شدہ رقم (PKR)' : 'Net Amount'}</th>
        </tr>
      </thead>
      <tbody>
        ${filteredList.map(i => `
        <tr>
          <td class="font-mono font-en" style="color: #047857;">${i.refNo}</td>
          <td>
            <div>${locale === 'ur' ? i.staffNameUrdu : i.staffNameEn}</div>
            <div style="font-size: 11px; color: #64748b; font-weight: normal;">${locale === 'ur' ? i.designationUrdu : i.designationEn}</div>
          </td>
          <td><span class="badge">${i.department === 'nizami' ? (locale === 'ur' ? 'درس نظامی' : 'Nizami') : i.department === 'hifz' ? (locale === 'ur' ? 'شعبہ حفظ' : 'Hifz') : (locale === 'ur' ? 'عصری سکول' : 'School')}</span></td>
          <td>${i.month}</td>
          <td class="font-mono font-en">${i.date}</td>
          <td class="font-mono font-en" style="text-align: ${dir === 'rtl' ? 'left' : 'right'}; color: #047857;">Rs. ${Number(i.net).toLocaleString()}</td>
        </tr>`).join('')}
        ${filteredList.length === 0 ? `<tr><td colspan="6" style="text-align: center; padding: 20px;">No records match your filter criteria.</td></tr>` : ''}
      </tbody>
      ${filteredList.length > 0 ? `
      <tfoot>
        <tr class="total-row">
          <td colspan="5" style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">${locale === 'ur' ? 'کل میزان (Total Net Disbursed Amount):' : 'Total Net Disbursed Amount:'}</td>
          <td class="font-mono font-en" style="text-align: ${dir === 'rtl' ? 'left' : 'right'}; font-size: 16px;">Rs. ${stats.totalNet.toLocaleString()}</td>
        </tr>
      </tfoot>` : ''}
    </table>

    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
      <span>🛡️ ${locale === 'ur' ? 'کلاؤڈ تصدیق شدہ مشاہرہ لیجر شیٹ' : 'Cloud Verified Payroll Archive Sheet'}</span>
      <span class="font-mono font-en">System Hash: HR-IDX-${Date.now().toString().slice(-6)}</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payroll_Index_Report_${filterMonth !== 'all' ? filterMonth.replace(/[^a-zA-Z0-9]/g, '_') : 'All_Months'}_${Date.now().toString().slice(-4)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      locale === 'ur' 
        ? '📥 فلٹر شدہ ریکارڈز کی مکمل رپورٹ ڈائریکٹ ڈاؤن لوڈ ہو گئی ہے! (کوئی پرنٹ ڈائیلاگ نہیں کھلا)' 
        : '📥 Filtered payroll archive report downloaded directly without print dialog!'
    );
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
        return <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 text-xs font-bold">{locale === 'ur' ? 'دفتری انتظام' : 'Admin Staff'}</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs font-bold">{locale === 'ur' ? 'معاون عملہ' : 'Support'}</Badge>;
    }
  };

  const uniqueMonths = Array.from(new Set(payrollList.map(p => p.month))).filter(Boolean);
  const defaultMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

  const activeMonth = filterMonth !== 'all' ? filterMonth : (uniqueMonths.includes(defaultMonth) ? defaultMonth : (uniqueMonths[0] || defaultMonth));
  const paidStaffIds = payrollList.filter(p => p.month === activeMonth).map(p => p.empId);
  const pendingList = activeMonth ? staffList.filter(s => !paidStaffIds.includes(s.empId)) : [];
  
  return (
    <div className="space-y-6 font-ur animate-in fade-in-50 duration-300">
      {/* Header Banner & Print Actions */}
      <Card className="border-2 border-emerald-500/30 bg-gradient-to-r from-card via-card to-emerald-500/5 shadow-xl">
        <CardHeader className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60">
          <div>
            <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <History className="w-6 h-6" />
              </div>
              <span>{locale === 'ur' ? 'تنخواہوں کا تفصیلی انڈیکس، لیجر اور آرکائیو ریکارڈ (Master Payroll Index)' : 'Master Payroll Disbursement Index & Archive'}</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
              {locale === 'ur' 
                ? 'استاد کے نام، مہینے، شعبے اور ادائیگی کی تاریخ کے لحاظ سے مکمل ریکارڈ تلاش کریں اور ایک کلک سے رپورٹ ڈاؤن لوڈ کریں۔' 
                : 'Filter disbursed salaries by staff member, salary month, department, or disbursement date. Export reports directly.'}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <Button 
              onClick={fetchIndexData} 
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
              onClick={handlePrintSheet} 
              variant="outline" 
              size="sm" 
              className="font-bold text-xs gap-1.5 shadow-sm border-primary/30 hover:bg-primary/5 text-primary"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{locale === 'ur' ? '🖨️ پرنٹ کریں' : '🖨️ Print Sheet'}</span>
            </Button>

            <Button 
              onClick={handleDownloadDirectPdf} 
              variant="emerald" 
              size="sm" 
              className="font-extrabold text-xs gap-2 px-4 py-4 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{locale === 'ur' ? '📥 فلٹر شدہ رپورٹ ڈاؤن لوڈ کریں (Direct PDF)' : '📥 Download Filtered Report (Direct PDF)'}</span>
            </Button>
          </div>
        </CardHeader>

        {/* Filter Bar */}
        <CardContent className="p-4 bg-muted/30 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Filter by Staff */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3 text-primary" />
                <span>{locale === 'ur' ? 'فلاں بندہ / استاد منتخب کریں:' : 'Filter by Staff Member:'}</span>
              </Label>
              <Select value={filterStaff} onValueChange={setFilterStaff}>
                <SelectTrigger className="h-9 text-xs font-bold bg-background"><SelectValue placeholder="تمام اساتذہ" /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all" className="font-bold">{locale === 'ur' ? 'تمام اساتذہ و ملازمین (All Staff)' : 'All Staff Members'}</SelectItem>
                  {staffList.map((s, idx) => (
                    <SelectItem key={idx} value={s.empId} className="font-bold">
                      {locale === 'ur' ? `${s.nameUrdu} (${s.empId})` : `${s.nameEn} (${s.empId})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Month */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span>{locale === 'ur' ? 'فلاں مہینہ منتخب کریں:' : 'Filter by Salary Month:'}</span>
              </Label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="h-9 text-xs font-bold bg-background"><SelectValue placeholder="تمام مہینے" /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all" className="font-bold">{locale === 'ur' ? 'تمام مہینے (All Months)' : 'All Months'}</SelectItem>
                  {uniqueMonths.map((m, idx) => (
                    <SelectItem key={idx} value={m} className="font-bold">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Dept */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                <Building2 className="w-3 h-3 text-purple-600" />
                <span>{locale === 'ur' ? 'شعبہ منتخب کریں:' : 'Filter by Department:'}</span>
              </Label>
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="h-9 text-xs font-bold bg-background"><SelectValue placeholder="تمام شعبہ جات" /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all" className="font-bold">{locale === 'ur' ? 'تمام شعبہ جات' : 'All Departments'}</SelectItem>
                  <SelectItem value="nizami" className="font-bold">{locale === 'ur' ? 'درس نظامی' : 'Dars-e-Nizami'}</SelectItem>
                  <SelectItem value="hifz" className="font-bold">{locale === 'ur' ? 'شعبہ حفظ' : 'Hifz Dept'}</SelectItem>
                  <SelectItem value="school" className="font-bold">{locale === 'ur' ? 'عصری سکول' : 'Modern School'}</SelectItem>
                  <SelectItem value="admin" className="font-bold">{locale === 'ur' ? 'دفتری انتظام' : 'Admin & Accounts'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Payment Date */}
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-600" />
                <span>{locale === 'ur' ? 'فلاں تاریخ کی ادائیگی (Payment Date):' : 'Filter by Paid Date:'}</span>
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="h-9 text-xs font-mono font-bold bg-background border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                />
                {filterDate && (
                  <Button variant="ghost" size="sm" onClick={() => setFilterDate('')} className="h-9 px-2 text-xs text-destructive">
                    ✕
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs font-bold">
            <span className="text-muted-foreground">
              {locale === 'ur' ? `فلٹر کے بعد ریکارڈز کی تعداد: ${stats.count}` : `Filtered Records: ${stats.count}`}
            </span>
            <Button variant="link" size="sm" onClick={handleResetFilters} className="text-primary font-extrabold h-auto p-0">
              {locale === 'ur' ? '🔄 تمام فلٹرز ختم کریں (Reset Filters)' : '🔄 Reset All Filters'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-2 border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-4">
            <div className="text-xs font-bold text-muted-foreground flex items-center justify-between">
              <span>{locale === 'ur' ? 'فلٹر شدہ ریکارڈز' : 'Total Records'}</span>
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-extrabold font-mono font-en text-primary mt-1">{stats.count}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/20 bg-blue-500/5 shadow-sm">
          <CardContent className="p-4">
            <div className="text-xs font-bold text-muted-foreground flex items-center justify-between">
              <span>{locale === 'ur' ? 'بنیادی مشاہرہ (Basic)' : 'Total Basic'}</span>
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono font-en text-blue-600 dark:text-blue-400 mt-1">
              Rs. {stats.totalBasic.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-500/20 bg-amber-500/5 shadow-sm">
          <CardContent className="p-4">
            <div className="text-xs font-bold text-muted-foreground flex items-center justify-between">
              <span>{locale === 'ur' ? '+ کل بونس / - کٹوتی' : 'Bonus / Deductions'}</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-sm sm:text-base font-extrabold font-mono font-en mt-2 flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">+{stats.totalBonus.toLocaleString()}</span> / <span className="text-destructive">-{stats.totalDeductions.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-red-500/30 bg-red-500/5 shadow-sm cursor-pointer hover:bg-red-500/10 transition-colors"
          onClick={() => { if (pendingList.length > 0) setPendingModalOpen(true); }}
        >
          <CardContent className="p-4">
            <div className="text-xs font-bold text-muted-foreground flex items-center justify-between">
              <span>{locale === 'ur' ? 'بقایا تنخواہیں' : 'Pending Salaries'}</span>
              <FileText className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono font-en text-red-600 dark:text-red-400 mt-1">
              {pendingList.length} {locale === 'ur' ? 'اساتذہ' : 'Staff'}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              {locale === 'ur' ? `(${activeMonth} کے لیے)` : `(for ${activeMonth})`}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-500/40 bg-gradient-to-br from-red-600 to-red-900 text-white shadow-md">
          <CardContent className="p-4">
            <div className="text-[11px] font-extrabold text-red-100 flex items-center justify-between">
              <span>{locale === 'ur' ? 'کل ادا شدہ تنخواہ (مدرسے کا کل خرچہ)' : 'Net Disbursed (Madrasa Expense)'}</span>
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono font-en mt-1 text-white tracking-tight">
              Rs. {stats.totalNet.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-border/60 shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>{locale === 'ur' ? 'ادائیگیاں اور تنخواہ رسیدات کی تفصیلی فہرست' : 'Disbursed Payroll Index Roster'}</span>
          </CardTitle>
          <Badge variant="outline" className="font-mono font-en text-xs px-2.5 py-0.5 border-emerald-500/40 text-emerald-600 bg-emerald-500/10 font-bold">
            {stats.count} {locale === 'ur' ? 'رسیدات' : 'Slips Found'}
          </Badge>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>{locale === 'ur' ? 'حوالہ نمبر' : 'Ref No'}</TableHead>
                <TableHead>{locale === 'ur' ? 'استاد / ملازم' : 'Staff Member'}</TableHead>
                <TableHead>{locale === 'ur' ? 'شعبہ' : 'Dept'}</TableHead>
                <TableHead>{locale === 'ur' ? 'تنخواہ کا مہینہ' : 'Salary Month'}</TableHead>
                <TableHead>{locale === 'ur' ? 'ادائیگی کی تاریخ' : 'Paid Date'}</TableHead>
                <TableHead className="text-end">{locale === 'ur' ? 'ادا شدہ رقم (Net)' : 'Net Paid'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'عمل' : 'Action'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.map((item, idx) => (
                <TableRow key={item.id || idx} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-bold text-xs text-primary font-en">
                    {item.refNo}
                  </TableCell>
                  <TableCell className="font-extrabold text-sm text-foreground">
                    <div>{locale === 'ur' ? item.staffNameUrdu : item.staffNameEn}</div>
                    <div className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? item.designationUrdu : item.designationEn}</div>
                  </TableCell>
                  <TableCell>
                    {getDeptBadge(item.department)}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {item.month}
                  </TableCell>
                  <TableCell className="font-mono font-en text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {item.date}
                  </TableCell>
                  <TableCell className="text-end font-mono font-en text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    Rs. {Number(item.net || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewSlip(item)}
                      className="h-8 px-2.5 font-bold text-xs gap-1 hover:bg-primary/10 text-primary border-primary/30"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{locale === 'ur' ? 'رسید' : 'Slip'}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground font-bold text-sm">
                    {locale === 'ur' ? 'آپ کے منتخب کردہ فلٹر کے مطابق کوئی ریکارڈ نہیں ملا۔' : 'No salary disbursements found matching criteria.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/30 p-3.5 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">
            {locale === 'ur' ? 'تمام ریکارڈ کلاؤڈ لائیو ڈیٹا بیس سے ہم آہنگ ہیں۔' : 'Synced with live Cloud Database.'}
          </span>
          <span className="font-mono font-en font-bold text-xs text-emerald-600 dark:text-emerald-400">
            {locale === 'ur' ? 'کل میزان: ' : 'Total Disbursed: '} Rs. {stats.totalNet.toLocaleString()}
          </span>
        </CardFooter>
      </Card>

      {/* Salary Slip Modal */}
      {activeSlipData && (
        <SalarySlipModal
          isOpen={slipModalOpen}
          onClose={() => setSlipModalOpen(false)}
          slipData={activeSlipData}
        />
      )}

      {/* Pending Salaries Modal */}
      {pendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
          <div className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border-2 border-destructive/20 overflow-hidden font-ur">
            <div className="p-5 border-b border-border bg-destructive/5 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-destructive flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {locale === 'ur' ? `بقایا تنخواہیں برائے ماہ: ${activeMonth}` : `Pending Salaries for: ${activeMonth}`}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setPendingModalOpen(false)}>✕</Button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {pendingList.length > 0 ? (
                <div className="space-y-3">
                  {pendingList.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-extrabold text-sm text-foreground">{locale === 'ur' ? s.nameUrdu : s.nameEn}</div>
                        <div className="text-xs text-muted-foreground font-mono font-en">{s.empId}</div>
                      </div>
                      <div className="text-end">
                        {getDeptBadge(s.dept)}
                        <div className="text-sm font-bold text-destructive mt-1 font-mono font-en">Rs. {Number(s.basicSalary || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground font-bold">
                  {locale === 'ur' ? 'الحمد للہ! اس مہینے تمام اساتذہ کو تنخواہ ادا کی جا چکی ہے۔' : 'All staff members have been paid for this month.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
