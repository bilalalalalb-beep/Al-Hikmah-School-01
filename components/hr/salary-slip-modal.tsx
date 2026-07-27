"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, Wallet, ShieldCheck, QrCode, School, Sparkles, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

export interface SalarySlipData {
  referenceNo: string;
  empId: string;
  staffNameUrdu: string;
  staffNameEn: string;
  designationUrdu: string;
  designationEn: string;
  department: string;
  salaryMonth: string;
  basicSalary: number;
  bonusAmount: number;
  deductionAmount: number;
  netPaid: number;
  paymentMethod: string;
  paymentDate: string;
  paidBy?: string;
  remarks?: string;
}

interface SalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slipData: SalarySlipData | null;
}

export function SalarySlipModal({ isOpen, onClose, slipData }: SalarySlipModalProps) {
  const { locale } = useLanguage();

  if (!slipData) return null;

  const handlePrint = () => {
    toast.success(locale === 'ur' ? '🖨️ باضابطہ رسید مشاہرہ (Salary Slip) پرنٹ کی جا رہی ہے...' : '🖨️ Printing official Salary Slip...');
    window.print();
  };

  const handleDownloadCloudinary = () => {
    const dir = locale === 'ur' ? 'rtl' : 'ltr';
    const title = locale === 'ur' ? `رسید مشاہرہ - ${slipData.staffNameUrdu}` : `Salary Slip - ${slipData.staffNameEn}`;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} (${slipData.referenceNo})</title>
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
      max-width: 750px;
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
    
    .school-title { font-size: 20px; font-weight: bold; color: #047857; margin: 0; }
    .school-sub { font-size: 13px; color: #065f46; font-weight: bold; margin-top: 4px; }
    
    .badge {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #34d399;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      font-family: 'Outfit', sans-serif;
    }
    
    .grid-specs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 13px;
    }
    
    .spec-label { font-size: 11px; color: #64748b; display: block; }
    .spec-val { font-weight: bold; color: #0f172a; }
    
    .month-banner {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #047857;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; font-size: 13px; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
    td { padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: bold; }
    
    .net-row {
      border-top: 2px solid #047857;
      font-size: 16px;
      color: #047857;
      background: #ecfdf5;
    }
    
    .footer-sigs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
    }
    
    .sig-line { width: 120px; border-bottom: 1px solid #94a3b8; text-align: center; padding-bottom: 4px; margin-bottom: 4px; color: #64748b; }
    
    .action-bar {
      text-align: center;
      margin: 20px auto;
      max-width: 750px;
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
    <button onclick="window.print()" class="print-btn">🖨️ اس رسید کو پرنٹ کریں یا PDF میں محفوظ کریں (Print / Save PDF)</button>
  </div>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="school-title">${locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}</h1>
        <div class="school-sub">${locale === 'ur' ? 'شعبہ امورِ عملہ و مشاہرہ (Central HR & Payroll Department)' : 'Central HR & Payroll Department'}</div>
      </div>
      <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">
        <span class="badge">PAID SALARY</span>
        <div class="font-mono font-en" style="font-weight: bold; margin-top: 6px; color: #047857;">${slipData.referenceNo}</div>
        <div class="font-mono font-en" style="font-size: 11px; color: #64748b;">${slipData.paymentDate}</div>
      </div>
    </div>

    <div class="grid-specs">
      <div>
        <span class="spec-label">${locale === 'ur' ? 'ایمپلائی آئی ڈی / EMP ID' : 'EMP ID'}</span>
        <span class="spec-val font-mono font-en">${slipData.empId}</span>
      </div>
      <div>
        <span class="spec-label">${locale === 'ur' ? 'استاد / ملازم کا نام' : 'Staff Name'}</span>
        <span class="spec-val">${locale === 'ur' ? slipData.staffNameUrdu : slipData.staffNameEn}</span>
      </div>
      <div>
        <span class="spec-label">${locale === 'ur' ? 'عہدہ اور منصب' : 'Designation'}</span>
        <span class="spec-val" style="color: #0f766e;">${locale === 'ur' ? slipData.designationUrdu : slipData.designationEn}</span>
      </div>
      <div>
        <span class="spec-label">${locale === 'ur' ? 'شعبہ / Department' : 'Department'}</span>
        <span class="spec-val">${slipData.department === 'nizami' ? (locale === 'ur' ? 'درس نظامی' : 'Dars-e-Nizami') : slipData.department === 'hifz' ? (locale === 'ur' ? 'شعبہ حفظ' : 'Hifz Dept') : (locale === 'ur' ? 'عصری سکول' : 'Modern School')}</span>
      </div>
    </div>

    <div class="month-banner">
      <span>${locale === 'ur' ? 'مشاہرہ برائے ماہ / تنخواہ کا مہینہ:' : 'Salary For Month:'}</span>
      <span class="font-en">${slipData.salaryMonth}</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>${locale === 'ur' ? 'تفصیلات مشاہرہ و علاؤنس (Breakdown)' : 'Description'}</th>
          <th style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">${locale === 'ur' ? 'رقم (PKR)' : 'Amount (PKR)'}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${locale === 'ur' ? 'بنیادی مقررہ مشاہرہ (Basic Salary)' : 'Basic Monthly Salary'}</td>
          <td class="font-mono font-en" style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">Rs. ${slipData.basicSalary.toLocaleString()}</td>
        </tr>
        ${slipData.bonusAmount > 0 ? `
        <tr style="color: #059669;">
          <td>✨ ${locale === 'ur' ? 'حسنِ کارکردگی و خصوصی بونس (Performance Bonus)' : 'Performance Bonus'}</td>
          <td class="font-mono font-en" style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">+ Rs. ${slipData.bonusAmount.toLocaleString()}</td>
        </tr>` : ''}
        ${slipData.deductionAmount > 0 ? `
        <tr style="color: #e11d48;">
          <td>📉 ${locale === 'ur' ? 'رخصت و دیگر کٹوتی (Deductions / Advance)' : 'Deductions / Advance Adjustment'}</td>
          <td class="font-mono font-en" style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">- Rs. ${slipData.deductionAmount.toLocaleString()}</td>
        </tr>` : ''}
        <tr class="net-row">
          <td>${locale === 'ur' ? 'کل ادا شدہ مشاہرہ (Net Paid Amount)' : 'Net Paid Amount'}</td>
          <td class="font-mono font-en" style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">Rs. ${slipData.netPaid.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    ${slipData.remarks ? `<div style="font-size: 13px; color: #475569; font-style: italic; margin-bottom: 20px;"><strong>${locale === 'ur' ? 'کیفیت و تاثرات:' : 'Remarks:'}</strong> ${slipData.remarks}</div>` : ''}

    <div class="footer-sigs">
      <div>
        <div style="font-weight: bold; color: #059669;">🛡️ ${locale === 'ur' ? 'کلاؤڈ تصدیق شدہ مشاہرہ رسید' : 'Cloud Verified Salary Advice'}</div>
        <div class="font-mono font-en" style="font-size: 11px; color: #64748b; margin-top: 2px;">Hash: CLD-PAY-${slipData.empId}-${Date.now().toString().slice(-4)}</div>
      </div>
      <div style="display: flex; gap: 40px;">
        <div>
          <div class="sig-line">${locale === 'ur' ? 'محاسب / انچارج' : 'Accountant'}</div>
          <div style="font-weight: bold; font-size: 11px;">${locale === 'ur' ? 'دستخط انچارج پے رول' : 'Accounts Officer'}</div>
        </div>
        <div>
          <div class="sig-line" style="color: #047857; font-weight: bold;">${locale === 'ur' ? 'مہتمم اعلیٰ / پرنسپل' : 'Principal'}</div>
          <div style="font-weight: bold; font-size: 11px; color: #0f172a;">${locale === 'ur' ? 'تصدیق مہتمم / پرنسپل' : 'Authorized Principal'}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Salary_Slip_${slipData.empId}_${slipData.referenceNo}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      locale === 'ur' 
        ? '📥 رسید کی مکمل فائل ڈائریکٹ ڈاؤن لوڈ ہو گئی ہے! (کوئی پرنٹ ڈائیلاگ نہیں کھلا)' 
        : '📥 Receipt file downloaded directly without print dialog!'
    );
  };

  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'school':
        return locale === 'ur' ? 'عصری سکول' : 'Modern School';
      case 'hifz':
        return locale === 'ur' ? 'شعبہ حفظ القرآن' : 'Hifz Dept';
      case 'nizami':
        return locale === 'ur' ? 'درس نظامی و تخصص' : 'Dars-e-Nizami';
      case 'admin':
        return locale === 'ur' ? 'دفتری انتظام و محاسبی' : 'Admin & Accounts';
      default:
        return locale === 'ur' ? 'معاون عملہ' : 'Support Staff';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto font-ur p-0 border-2 border-primary/30 shadow-2xl bg-card print:border-none print:shadow-none print:max-h-none print:overflow-visible print:w-full print:max-w-full print:p-0">
        {/* Printable Salary Slip Container */}
        <div id="printable-salary-slip" className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-card via-card to-emerald-500/5 border-4 border-double border-primary/20 print:border-2 print:border-emerald-700 print:p-4 print:space-y-3 print:bg-white print:text-black">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-primary/20 pb-5 text-center sm:text-start print:pb-3 print:gap-2">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 via-primary to-teal-800 text-white flex items-center justify-center shadow-md shrink-0 border border-emerald-400/30 print:w-12 print:h-12 print:bg-emerald-700">
                <School className="w-8 h-8 print:w-6 print:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight print:text-base print:text-black">
                  {locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}
                </h2>
                <p className="text-xs text-primary font-bold mt-0.5 flex items-center justify-center sm:justify-start gap-1 print:text-[11px] print:text-emerald-800">
                  <Wallet className="w-3.5 h-3.5 inline text-emerald-600 print:text-emerald-800" />
                  <span>{locale === 'ur' ? 'شعبہ امورِ عملہ و مشاہرہ (Central HR & Payroll Department)' : 'Central HR & Payroll Department'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end">
              <Badge variant="success" className="px-3 py-1 text-xs font-extrabold gap-1 border-emerald-500 text-emerald-700 uppercase font-en shadow-sm print:border print:border-emerald-700 print:text-emerald-800 print:bg-emerald-50">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 inline" /> {locale === 'ur' ? 'ادا شدہ (PAID SALARY)' : 'PAID SALARY'}
              </Badge>
              <span className="font-mono font-bold text-xs text-primary mt-1.5 font-en print:text-black">{slipData.referenceNo}</span>
              <span className="text-[10px] text-muted-foreground font-mono font-en mt-0.5 print:text-gray-600">{slipData.paymentDate}</span>
            </div>
          </div>

          {/* Staff Member Details Specification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-muted/50 border border-border/80 text-xs font-bold shadow-inner print:bg-gray-50 print:border-gray-300 print:p-2.5 print:gap-2">
            <div>
              <span className="text-muted-foreground block text-[10px] print:text-gray-600">{locale === 'ur' ? 'ایمپلائی آئی ڈی / EMP ID' : 'EMP ID'}</span>
              <span className="font-mono text-primary text-sm font-en font-bold print:text-black">{slipData.empId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] print:text-gray-600">{locale === 'ur' ? 'استاد / ملازم کا نام' : 'Staff Name'}</span>
              <span className="text-foreground text-sm font-extrabold print:text-black">{locale === 'ur' ? slipData.staffNameUrdu : slipData.staffNameEn}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] print:text-gray-600">{locale === 'ur' ? 'عہدہ اور منصب' : 'Designation'}</span>
              <span className="text-foreground text-xs sm:text-sm font-extrabold text-teal-700 dark:text-teal-400 print:text-emerald-800">{locale === 'ur' ? slipData.designationUrdu : slipData.designationEn}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] print:text-gray-600">{locale === 'ur' ? 'شعبہ / Department' : 'Department'}</span>
              <span className="text-foreground text-xs font-extrabold print:text-black">{getDeptBadge(slipData.department)}</span>
            </div>
          </div>

          {/* Salary Month Title */}
          <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-between text-xs sm:text-sm font-extrabold text-primary print:bg-emerald-50 print:border-emerald-300 print:text-emerald-900 print:py-1.5">
            <span>{locale === 'ur' ? 'مشاہرہ برائے ماہ / تنخواہ کا مہینہ:' : 'Salary For Month:'}</span>
            <span className="font-en font-bold">{slipData.salaryMonth}</span>
          </div>

          {/* Payroll Breakdown Table */}
          <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm bg-card print:border-gray-300 print:shadow-none">
            <div className="bg-muted/70 p-3 border-b border-border/80 flex items-center justify-between text-xs font-extrabold text-foreground print:bg-gray-100 print:border-gray-300 print:text-black print:p-2">
              <span>{locale === 'ur' ? 'تفصیلات مشاہرہ و علاؤنس (Salary & Allowances Breakdown)' : 'Description'}</span>
              <span className="font-en">{locale === 'ur' ? 'رقم (PKR)' : 'Amount (PKR)'}</span>
            </div>

            <div className="divide-y divide-border/60 p-3 space-y-2 text-xs sm:text-sm font-bold print:divide-gray-200 print:p-2 print:space-y-1.5 print:text-black">
              <div className="flex items-center justify-between py-1">
                <span className="text-foreground print:text-black">{locale === 'ur' ? 'بنیادی مقررہ مشاہرہ (Basic Salary)' : 'Basic Monthly Salary'}</span>
                <span className="font-mono font-en print:text-black">Rs. {slipData.basicSalary.toLocaleString()}</span>
              </div>

              {slipData.bonusAmount > 0 && (
                <div className="flex items-center justify-between py-1 text-emerald-600 dark:text-emerald-400 print:text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? 'حسنِ کارکردگی و خصوصی بونس (Performance Bonus)' : 'Performance Bonus / Allowance'}</span>
                  </span>
                  <span className="font-mono font-en">+ Rs. {slipData.bonusAmount.toLocaleString()}</span>
                </div>
              )}

              {slipData.deductionAmount > 0 && (
                <div className="flex items-center justify-between py-1 text-destructive print:text-red-700">
                  <span>{locale === 'ur' ? 'رخصت و دیگر کٹوتی (Deductions / Advance)' : 'Deductions / Advance Adjustment'}</span>
                  <span className="font-mono font-en">- Rs. {slipData.deductionAmount.toLocaleString()}</span>
                </div>
              )}

              {slipData.remarks && (
                <div className="py-1 text-[11px] text-muted-foreground font-normal italic border-t border-border/40 pt-2 print:text-gray-700 print:border-gray-200 print:pt-1">
                  <span className="font-bold not-italic text-foreground me-1 print:text-black">{locale === 'ur' ? 'کیفیت و تاثرات:' : 'Remarks:'}</span>
                  {slipData.remarks}
                </div>
              )}

              <div className="flex items-center justify-between py-2.5 border-t-2 border-primary/30 text-sm sm:text-base font-extrabold text-primary print:border-emerald-600 print:text-emerald-900 print:py-1.5">
                <span>{locale === 'ur' ? 'کل ادا شدہ مشاہرہ (Net Paid Amount)' : 'Net Paid Amount'}</span>
                <span className="font-mono font-en bg-primary/15 px-3 py-1 rounded-lg shadow-inner print:bg-emerald-100 print:border print:border-emerald-300 print:shadow-none">Rs. {slipData.netPaid.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-bold print:text-black">
            <span>{locale === 'ur' ? 'ذریعہ ادائیگی (Payment Mode):' : 'Payment Mode:'}</span>
            <Badge variant="outline" className="font-en uppercase font-bold text-xs print:border-gray-400 print:text-black">{slipData.paymentMethod}</Badge>
          </div>

          {/* Signatures & Cloud QR Verification */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-5 border-t-2 border-border/80 text-xs print:pt-3 print:gap-4 print:border-gray-300">
            <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl border border-border/60 print:bg-gray-50 print:border-gray-300 print:p-2">
              <div className="p-1.5 rounded-lg bg-white text-black shrink-0 shadow-sm print:border print:border-gray-300">
                <QrCode className="w-8 h-8 print:w-7 print:h-7" />
              </div>
              <div>
                <p className="font-bold text-foreground flex items-center gap-1 text-[11px] print:text-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 print:text-emerald-800" /> {locale === 'ur' ? 'کلاؤڈ تصدیق شدہ مشاہرہ رسید' : 'Cloud Verified Salary Advice'}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono font-en mt-0.5 print:text-gray-600">Hash: CLD-PAY-{slipData.empId}-{Date.now().toString().slice(-4)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center sm:text-end print:gap-6">
              <div className="space-y-1">
                <div className="w-28 border-b-2 border-foreground/40 pb-1 mx-auto font-ur italic text-muted-foreground text-[11px] print:border-gray-500 print:text-gray-700">
                  {locale === 'ur' ? 'محاسب / انچارج' : 'Accountant'}
                </div>
                <p className="font-bold text-muted-foreground text-[10px] print:text-gray-700">{locale === 'ur' ? 'دستخط انچارج پے رول' : 'Accounts Officer'}</p>
              </div>
              <div className="space-y-1">
                <div className="w-28 border-b-2 border-foreground/40 pb-1 mx-auto font-ur italic text-primary font-bold text-[11px] print:border-emerald-800 print:text-emerald-900">
                  {locale === 'ur' ? 'مہتمم اعلیٰ / پرنسپل' : 'Principal'}
                </div>
                <p className="font-bold text-foreground text-[10px] print:text-black">{locale === 'ur' ? 'تصدیق مہتمم / پرنسپل' : 'Authorized Principal'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing via print:hidden) */}
        <div className="bg-muted/60 p-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <p className="text-xs font-bold text-muted-foreground">
            {locale === 'ur' ? 'ہدایت: پرنٹ کے وقت Margins کو Minimum رکھیں تاکہ رسید مشاہرہ ایک صفحے پر پرنٹ ہو۔' : 'Tip: Set printer margins to minimum for optimal single-page output.'}
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button onClick={onClose} variant="outline" size="sm" className="font-bold text-xs">
              {locale === 'ur' ? 'بند کریں' : 'Close'}
            </Button>
            <Button onClick={handleDownloadCloudinary} variant="secondary" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
              <Download className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{locale === 'ur' ? 'پی ڈی ایف ڈاؤن لوڈ' : 'Download PDF'}</span>
            </Button>
            <Button onClick={handlePrint} variant="emerald" size="sm" className="font-bold text-xs gap-1.5 shadow-md">
              <Printer className="w-4 h-4 shrink-0" />
              <span>{locale === 'ur' ? 'پرنٹ کریں (Print Slip)' : 'Print Salary Slip'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
