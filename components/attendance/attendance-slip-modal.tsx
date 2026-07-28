"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, UserCheck, ShieldCheck, QrCode, School, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

export interface AttendanceSlipData {
  regId: string;
  studentNameUrdu: string;
  studentNameEn: string;
  classNameUrdu: string;
  classNameEn: string;
  month: string;
  totalDays: number;
  present: number;
  absent: number;
  leave: number;
  late: number;
  percentage: number;
}

interface AttendanceSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  slipData: AttendanceSlipData | null;
}

export function AttendanceSlipModal({ isOpen, onClose, slipData }: AttendanceSlipModalProps) {
  const { locale } = useLanguage();

  if (!slipData) return null;

  const handlePrint = () => {
    toast.success(locale === 'ur' ? '🖨️ حاضری کی رسید پرنٹ کی جا رہی ہے...' : '🖨️ Printing Attendance Slip...');
    window.print();
  };

  const handleDownloadPDF = () => {
    const dir = locale === 'ur' ? 'rtl' : 'ltr';
    const title = locale === 'ur' ? `حاضری رسید - ${slipData.studentNameUrdu}` : `Attendance Slip - ${slipData.studentNameEn}`;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} (${slipData.regId})</title>
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
      border: 3px double #0ea5e9;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #bae6fd;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    
    .school-title { font-size: 20px; font-weight: bold; color: #0369a1; margin: 0; }
    .school-sub { font-size: 13px; color: #0284c7; font-weight: bold; margin-top: 4px; }
    
    .badge {
      background: #e0f2fe;
      color: #0284c7;
      border: 1px solid #7dd3fc;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      font-family: 'Outfit', sans-serif;
    }
    
    .grid-specs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    
    .spec-label { font-size: 12px; color: #64748b; display: block; }
    .spec-val { font-weight: bold; color: #0f172a; font-size: 18px; }
    
    .month-banner {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0369a1;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .stat-box {
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      border: 2px solid;
    }
    .stat-title { font-size: 14px; font-weight: bold; margin-bottom: 8px; }
    .stat-value { font-size: 28px; font-weight: bold; }
    
    .stat-present { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
    .stat-absent { background: #fff1f2; border-color: #fecdd3; color: #be123c; }
    .stat-leave { background: #fffbeb; border-color: #fde68a; color: #b45309; }
    .stat-total { background: #f8fafc; border-color: #e2e8f0; color: #334155; }
    
    .percentage-box {
      border-top: 2px dashed #cbd5e1;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .footer-sigs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
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
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      font-family: 'Noto Nastaliq Urdu', serif;
      box-shadow: 0 4px 6px rgba(2, 132, 199, 0.2);
    }
    .print-btn:hover { background: #0369a1; }

    @media print {
      body { background: #fff; padding: 0; }
      .container { border: 2px solid #0284c7; box-shadow: none; margin: 0; width: 100%; max-width: 100%; }
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
        <div class="school-sub">${locale === 'ur' ? 'شعبہ امتحانات و حاضری (Examination & Attendance Dept)' : 'Examination & Attendance Dept'}</div>
      </div>
      <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">
        <span class="badge">ATTENDANCE REPORT</span>
        <div class="font-mono font-en" style="font-weight: bold; margin-top: 6px; color: #0284c7;">${slipData.regId}</div>
      </div>
    </div>

    <div class="grid-specs">
      <div>
        <span class="spec-label">${locale === 'ur' ? 'نام طالب علم (Student Name)' : 'Student Name'}</span>
        <span class="spec-val">${locale === 'ur' ? slipData.studentNameUrdu : slipData.studentNameEn}</span>
      </div>
      <div>
        <span class="spec-label">${locale === 'ur' ? 'درجہ / کلاس (Class / Grade)' : 'Class / Grade'}</span>
        <span class="spec-val" style="color: #0369a1;">${locale === 'ur' ? slipData.classNameUrdu : slipData.classNameEn}</span>
      </div>
    </div>

    <div class="month-banner">
      <span>${locale === 'ur' ? 'ماہانہ حاضری رپورٹ برائے:' : 'Monthly Attendance For:'}</span>
      <span class="font-en">${slipData.month}</span>
    </div>

    <div class="stats-grid">
      <div class="stat-box stat-present">
        <div class="stat-title">${locale === 'ur' ? 'حاضر (Present)' : 'Present'}</div>
        <div class="stat-value font-mono font-en">${slipData.present}</div>
      </div>
      <div class="stat-box stat-absent">
        <div class="stat-title">${locale === 'ur' ? 'غیر حاضر (Absent)' : 'Absent'}</div>
        <div class="stat-value font-mono font-en">${slipData.absent}</div>
      </div>
      <div class="stat-box stat-leave">
        <div class="stat-title">${locale === 'ur' ? 'رخصت (Leave)' : 'Leave'}</div>
        <div class="stat-value font-mono font-en">${slipData.leave}</div>
      </div>
      <div class="stat-box stat-total">
        <div class="stat-title">${locale === 'ur' ? 'کل ایام (Total)' : 'Total Days'}</div>
        <div class="stat-value font-mono font-en">${slipData.totalDays}</div>
      </div>
    </div>

    <div class="percentage-box">
      <div>
        <div style="font-size: 14px; color: #64748b; font-weight: bold;">${locale === 'ur' ? 'تناسبِ حاضری (Percentage)' : 'Attendance Percentage'}</div>
        <div style="font-size: 32px; font-weight: bold; color: #0f172a;" class="font-mono font-en">${slipData.percentage}%</div>
      </div>
      <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'}">
        <div style="font-size: 14px; color: #64748b; font-weight: bold;">${locale === 'ur' ? 'کیفیت (Status)' : 'Status'}</div>
        <div style="font-size: 24px; font-weight: bold; color: ${slipData.percentage >= 75 ? '#059669' : '#e11d48'};">
          ${slipData.percentage >= 90 ? (locale === 'ur' ? 'بہترین (Excellent)' : 'Excellent') : 
            slipData.percentage >= 75 ? (locale === 'ur' ? 'تسلی بخش (Satisfactory)' : 'Satisfactory') : 
            (locale === 'ur' ? 'کم حاضری وارننگ (Warning)' : 'Low Warning')}
        </div>
      </div>
    </div>

    <div class="footer-sigs">
      <div>
        <div style="font-weight: bold; color: #0284c7;">🛡️ ${locale === 'ur' ? 'کلاؤڈ تصدیق شدہ رپورٹ' : 'Cloud Verified Report'}</div>
        <div class="font-mono font-en" style="font-size: 11px; color: #64748b; margin-top: 2px;">Hash: CLD-ATT-${slipData.regId}-${Date.now().toString().slice(-4)}</div>
      </div>
      <div style="display: flex; gap: 40px;">
        <div>
          <div class="sig-line">${locale === 'ur' ? 'استاد محترم / نگران' : 'Class Teacher'}</div>
          <div style="font-weight: bold; font-size: 11px;">${locale === 'ur' ? 'دستخط استاد' : 'Teacher Signature'}</div>
        </div>
        <div>
          <div class="sig-line" style="color: #0284c7; font-weight: bold;">${locale === 'ur' ? 'مہتمم اعلیٰ / پرنسپل' : 'Principal'}</div>
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
    link.download = `Attendance_Slip_${slipData.regId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(
      locale === 'ur' 
        ? '📥 رسید کی مکمل فائل ڈاؤن لوڈ ہو گئی ہے! اسے براؤزر میں کھول کر پرنٹ کریں۔' 
        : '📥 Receipt file downloaded! Open in browser to print.'
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto font-ur p-0 border-2 border-primary/30 shadow-2xl bg-card print:border-none print:shadow-none print:max-h-none print:overflow-visible print:w-full print:max-w-full print:p-0">
        {/* Printable Attendance Slip Container */}
        <div id="printable-attendance-slip" className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-card via-card to-sky-500/5 border-4 border-double border-primary/20 print:border-2 print:border-sky-700 print:p-4 print:space-y-3 print:bg-white print:text-black">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-primary/20 pb-5 text-center sm:text-start print:pb-3 print:gap-2">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-700 via-primary to-blue-800 text-white flex items-center justify-center shadow-md shrink-0 border border-sky-400/30 print:w-12 print:h-12 print:bg-sky-700">
                <School className="w-8 h-8 print:w-6 print:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight print:text-base print:text-black">
                  {locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}
                </h2>
                <p className="text-xs text-primary font-bold mt-0.5 flex items-center justify-center sm:justify-start gap-1 print:text-[11px] print:text-sky-800">
                  <UserCheck className="w-3.5 h-3.5 inline text-sky-600 print:text-sky-800" />
                  <span>{locale === 'ur' ? 'شعبہ امتحانات و حاضری (Examination & Attendance)' : 'Examination & Attendance Dept'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end">
              <Badge variant="outline" className="px-3 py-1 text-xs font-extrabold gap-1 border-sky-500 text-sky-700 uppercase font-en shadow-sm print:border print:border-sky-700 print:text-sky-800 print:bg-sky-50">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 inline" /> {locale === 'ur' ? 'حاضری رپورٹ (ATTENDANCE)' : 'ATTENDANCE'}
              </Badge>
              <span className="font-mono font-bold text-xs text-primary mt-1.5 font-en print:text-black">{slipData.regId}</span>
            </div>
          </div>

          {/* Student Details Specification */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/50 border border-border/80 text-xs font-bold shadow-inner print:bg-gray-50 print:border-gray-300 print:p-2.5 print:gap-2">
            <div>
              <span className="text-muted-foreground block text-[10px] print:text-gray-600">{locale === 'ur' ? 'نام طالب علم / Student Name' : 'Student Name'}</span>
              <span className="text-foreground text-sm font-extrabold print:text-black">{locale === 'ur' ? slipData.studentNameUrdu : slipData.studentNameEn}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] print:text-gray-600">{locale === 'ur' ? 'درجہ و کلاس / Class' : 'Class / Grade'}</span>
              <span className="text-foreground text-xs sm:text-sm font-extrabold text-sky-700 dark:text-sky-400 print:text-sky-800">{locale === 'ur' ? slipData.classNameUrdu : slipData.classNameEn}</span>
            </div>
          </div>

          {/* Month Title */}
          <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-between text-xs sm:text-sm font-extrabold text-primary print:bg-sky-50 print:border-sky-300 print:text-sky-900 print:py-1.5">
            <span>{locale === 'ur' ? 'ماہانہ حاضری رپورٹ برائے:' : 'Monthly Attendance For:'}</span>
            <span className="font-en font-bold">{slipData.month}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 print:gap-2">
            <div className="border border-emerald-500/30 bg-emerald-500/10 p-3 rounded-lg text-center print:border-emerald-500 print:bg-emerald-50">
              <div className="text-[10px] sm:text-xs font-bold text-emerald-700 print:text-emerald-800">{locale === 'ur' ? 'حاضر (Present)' : 'Present'}</div>
              <div className="text-xl sm:text-2xl font-extrabold font-en text-emerald-600 mt-1 print:text-emerald-700">{slipData.present}</div>
            </div>
            <div className="border border-rose-500/30 bg-rose-500/10 p-3 rounded-lg text-center print:border-red-500 print:bg-red-50">
              <div className="text-[10px] sm:text-xs font-bold text-rose-700 print:text-red-800">{locale === 'ur' ? 'غیر حاضر (Absent)' : 'Absent'}</div>
              <div className="text-xl sm:text-2xl font-extrabold font-en text-rose-600 mt-1 print:text-red-700">{slipData.absent}</div>
            </div>
            <div className="border border-amber-500/30 bg-amber-500/10 p-3 rounded-lg text-center print:border-amber-500 print:bg-amber-50">
              <div className="text-[10px] sm:text-xs font-bold text-amber-700 print:text-amber-800">{locale === 'ur' ? 'رخصت (Leave)' : 'Leave'}</div>
              <div className="text-xl sm:text-2xl font-extrabold font-en text-amber-600 mt-1 print:text-amber-700">{slipData.leave}</div>
            </div>
            <div className="border border-slate-500/30 bg-slate-500/10 p-3 rounded-lg text-center print:border-gray-500 print:bg-gray-50">
              <div className="text-[10px] sm:text-xs font-bold text-slate-700 print:text-gray-800">{locale === 'ur' ? 'کل ایام (Total)' : 'Total'}</div>
              <div className="text-xl sm:text-2xl font-extrabold font-en text-slate-600 mt-1 print:text-gray-700">{slipData.totalDays}</div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-border/80 text-sm sm:text-base font-extrabold print:border-gray-300 print:pt-2">
            <div>
              <span className="text-xs text-muted-foreground block print:text-gray-600">{locale === 'ur' ? 'تناسب حاضری (%)' : 'Attendance Percentage'}</span>
              <span className="font-mono font-en text-2xl text-foreground print:text-black">{slipData.percentage}%</span>
            </div>
            <div className="text-end">
              <span className="text-xs text-muted-foreground block print:text-gray-600">{locale === 'ur' ? 'کیفیت (Status)' : 'Status'}</span>
              <span className={`font-extrabold ${slipData.percentage >= 75 ? 'text-emerald-600 print:text-emerald-700' : 'text-rose-600 print:text-red-700'}`}>
                {slipData.percentage >= 90 ? (locale === 'ur' ? 'بہترین (Excellent)' : 'Excellent') : 
                  slipData.percentage >= 75 ? (locale === 'ur' ? 'تسلی بخش (Satisfactory)' : 'Satisfactory') : 
                  (locale === 'ur' ? 'کم حاضری وارننگ (Warning)' : 'Low Warning')}
              </span>
            </div>
          </div>

          {/* Signatures & Cloud QR Verification */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-5 border-t-2 border-border/80 text-xs print:pt-3 print:gap-4 print:border-gray-300">
            <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl border border-border/60 print:bg-gray-50 print:border-gray-300 print:p-2">
              <div className="p-1.5 rounded-lg bg-white text-black shrink-0 shadow-sm print:border print:border-gray-300">
                <QrCode className="w-8 h-8 print:w-7 print:h-7" />
              </div>
              <div>
                <p className="font-bold text-foreground flex items-center gap-1 text-[11px] print:text-black">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 print:text-sky-800" /> {locale === 'ur' ? 'کلاؤڈ تصدیق شدہ رپورٹ' : 'Cloud Verified Report'}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono font-en mt-0.5 print:text-gray-600">Hash: CLD-ATT-{slipData.regId}-{Date.now().toString().slice(-4)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center sm:text-end print:gap-6">
              <div className="space-y-1">
                <div className="w-28 border-b-2 border-foreground/40 pb-1 mx-auto font-ur italic text-muted-foreground text-[11px] print:border-gray-500 print:text-gray-700">
                  {locale === 'ur' ? 'استاد محترم / نگران' : 'Class Teacher'}
                </div>
                <p className="font-bold text-muted-foreground text-[10px] print:text-gray-700">{locale === 'ur' ? 'دستخط استاد' : 'Teacher Signature'}</p>
              </div>
              <div className="space-y-1">
                <div className="w-28 border-b-2 border-foreground/40 pb-1 mx-auto font-ur italic text-primary font-bold text-[11px] print:border-sky-800 print:text-sky-900">
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
            {locale === 'ur' ? 'ہدایت: پرنٹ کے وقت Margins کو Minimum رکھیں تاکہ رسید ایک صفحے پر پرنٹ ہو۔' : 'Tip: Set printer margins to minimum for optimal output.'}
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button onClick={onClose} variant="outline" size="sm" className="font-bold text-xs">
              {locale === 'ur' ? 'بند کریں' : 'Close'}
            </Button>
            <Button onClick={handleDownloadPDF} variant="secondary" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
              <Download className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{locale === 'ur' ? 'پی ڈی ایف ڈاؤن لوڈ' : 'Download PDF'}</span>
            </Button>
            <Button onClick={handlePrint} variant="default" size="sm" className="font-bold text-xs gap-1.5 shadow-md">
              <Printer className="w-4 h-4 shrink-0" />
              <span>{locale === 'ur' ? 'پرنٹ کریں (Print Slip)' : 'Print Slip'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
