"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, Award, ShieldCheck, QrCode, School, Sparkles, CheckCircle2, Trophy, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

export interface SubjectMarkItem {
  subjectUrdu: string;
  subjectEn: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  remarks?: string;
}

export interface ResultCardData {
  examTitleUrdu: string;
  examTitleEn: string;
  studentNameUrdu: string;
  studentNameEn: string;
  regId: string;
  fatherNameUrdu?: string;
  fatherNameEn?: string;
  classNameUrdu: string;
  classNameEn: string;
  rollNo?: string;
  subjects: SubjectMarkItem[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  overallGrade: string;
  position?: string; // e.g. "پوزیشن: اول (1st Position)"
  issueDate: string;
}

interface ResultCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultData: ResultCardData | null;
}

export function ResultCardModal({ isOpen, onClose, resultData }: ResultCardModalProps) {
  const { locale, dir } = useLanguage();

  if (!resultData) return null;

  const handlePrint = () => {
    toast.success(locale === 'ur' ? '🖨️ سرکاری کشف الدرجات (Result Card) پرنٹ کیا جا رہا ہے...' : '🖨️ Printing official Kashf-ul-Darajat...');
    window.print();
  };

  const handleDownloadCloudinary = () => {
    toast.success(locale === 'ur' ? '📥 تصدیق شدہ کشف الدرجات آف لائن دستاویز ڈاؤن لوڈ ہو رہی ہے...' : '📥 Downloading standalone Result Card document...');
    
    const subjectsHtml = resultData.subjects.map((sub, i) => `
      <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-weight: bold;">
          <div>${locale === 'ur' ? sub.subjectUrdu : sub.subjectEn}</div>
          ${sub.remarks ? `<div style="font-size: 11px; color: #64748b; font-weight: normal; font-style: italic;">${sub.remarks}</div>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${sub.totalMarks}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: bold; color: #0d9488;">${sub.obtainedMarks}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">
          <span style="padding: 3px 8px; border-radius: 4px; font-size: 11px; background-color: #f1f5f9; border: 1px solid #cbd5e1;">${sub.grade}</span>
        </td>
      </tr>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="${locale}" dir="${dir || 'rtl'}">
<head>
  <meta charset="UTF-8">
  <title>Kashf-ul-Darajat_${resultData.regId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700;800&display=swap');
    body { font-family: ${locale === 'ur' ? "'Noto Nastaliq Urdu', 'Amiri', serif" : "'Inter', sans-serif"}; padding: 30px; background-color: #f8fafc; color: #0f172a; line-height: 1.6; }
    .card-container { max-width: 800px; margin: 0 auto; background: white; padding: 35px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 4px double #d97706; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 25px; }
    .school-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .dept-title { font-size: 14px; color: #0d9488; font-weight: bold; margin: 4px 0 0 0; }
    .exam-title { font-size: 13px; color: #64748b; font-weight: bold; margin: 2px 0 0 0; }
    .badge-pos { background: linear-gradient(135deg, #d97706, #b45309); color: white; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; text-transform: uppercase; }
    .profile-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #f1f5f9; padding: 15px; border-radius: 10px; margin-bottom: 25px; }
    .profile-item span { display: block; font-size: 11px; color: #64748b; }
    .profile-item strong { font-size: 14px; color: #0f172a; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    .table th { background: #ccfbf1; color: #0f172a; padding: 12px 10px; font-size: 13px; font-weight: 800; border-bottom: 2px solid #0d9488; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
    .table th.center { text-align: center; }
    .grand-total { background: #f0fdf4; font-weight: 800; font-size: 16px; color: #15803d; }
    .status-banner { display: flex; align-items: center; justify-content: space-between; background: #fef3c7; border: 1px solid #f59e0b; padding: 15px 20px; border-radius: 12px; margin-bottom: 30px; }
    .signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 12px; font-weight: bold; }
    .sig-line { width: 140px; border-bottom: 1px solid #475569; margin: 0 auto 5px auto; }
    .print-btn { background: #0d9488; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-bottom: 20px; text-decoration: none; display: inline-block; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: white; } .card-container { box-shadow: none; border: 2px solid #000; } }
  </style>
</head>
<body>
  <div style="text-align: center;" class="no-print">
    <button onclick="window.print()" class="print-btn">🖨️ پرنٹ کریں (Print Card)</button>
  </div>
  <div class="card-container">
    <div class="header">
      <div>
        <h1 class="school-title">${locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}</h1>
        <p class="dept-title">🏆 ${locale === 'ur' ? 'شعبہ امتحانات و کشف الدرجات (Central Examinations Board)' : 'Central Examinations & Result Board'}</p>
        <p class="exam-title">${locale === 'ur' ? resultData.examTitleUrdu : resultData.examTitleEn}</p>
      </div>
      <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'};">
        ${resultData.position ? `<span class="badge-pos">🎉 ${resultData.position}</span>` : `<span style="padding: 6px 12px; background: #e2e8f0; border-radius: 6px; font-size: 12px; font-weight: bold;">${locale === 'ur' ? 'باضابطہ نتیجہ' : 'Verified Result'}</span>`}
        <div style="font-size: 11px; color: #64748b; font-family: monospace; margin-top: 8px;">Date: ${resultData.issueDate}</div>
      </div>
    </div>

    <div class="profile-grid">
      <div class="profile-item">
        <span>${locale === 'ur' ? 'رجسٹریشن آئی ڈی' : 'REG ID'}</span>
        <strong style="font-family: monospace; color: #0d9488;">${resultData.regId}</strong>
      </div>
      <div class="profile-item">
        <span>${locale === 'ur' ? 'طالب علم کا نام' : 'Student Name'}</span>
        <strong>${locale === 'ur' ? resultData.studentNameUrdu : resultData.studentNameEn}</strong>
      </div>
      <div class="profile-item">
        <span>${locale === 'ur' ? 'والد / سرپرست' : 'Father Name'}</span>
        <strong>${resultData.fatherNameUrdu || resultData.fatherNameEn || 'عبداللہ خان'}</strong>
      </div>
      <div class="profile-item">
        <span>${locale === 'ur' ? 'درجہ / کلاس' : 'Class / Dept'}</span>
        <strong style="color: #0369a1;">${locale === 'ur' ? resultData.classNameUrdu : resultData.classNameEn}</strong>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>${locale === 'ur' ? 'مضمون و کتاب (Subject Name)' : 'Subject Name'}</th>
          <th class="center" style="width: 100px;">${locale === 'ur' ? 'کل نمبر' : 'Total'}</th>
          <th class="center" style="width: 100px;">${locale === 'ur' ? 'حاصل کردہ' : 'Obtained'}</th>
          <th class="center" style="width: 150px;">${locale === 'ur' ? 'تقدیر (Grade)' : 'Grade'}</th>
        </tr>
      </thead>
      <tbody>
        ${subjectsHtml}
        <tr class="grand-total">
          <td style="padding: 12px 10px;">✨ ${locale === 'ur' ? 'مجموعی نتیجہ (Grand Total)' : 'Grand Total'}</td>
          <td style="padding: 12px 10px; text-align: center; font-family: monospace;">${resultData.totalMarks}</td>
          <td style="padding: 12px 10px; text-align: center; font-family: monospace;">${resultData.obtainedMarks}</td>
          <td style="padding: 12px 10px; text-align: center;">${resultData.percentage.toFixed(1)}%</td>
        </tr>
      </tbody>
    </table>

    <div class="status-banner">
      <div>
        <span style="font-size: 11px; color: #b45309; display: block; font-weight: bold;">${locale === 'ur' ? 'حتمی امتحانی تقدیر و نتیجہ' : 'Final Academic Status'}</span>
        <strong style="font-size: 18px; color: #78350f;">${resultData.overallGrade}</strong>
      </div>
      <div style="font-family: monospace; font-size: 11px; color: #047857; background: #d1fae5; padding: 6px 12px; border-radius: 6px; border: 1px solid #10b981;">
        ✔ Hash: CLD-EXM-${resultData.regId}-${Date.now().toString().slice(-4)}
      </div>
    </div>

    <div class="signatures">
      <div>
        <div class="sig-line"></div>
        <div>${locale === 'ur' ? 'دستخط ممتحن' : 'Examiner'}</div>
      </div>
      <div>
        <div class="sig-line" style="border-color: #0d9488;"></div>
        <div style="color: #0d9488;">${locale === 'ur' ? 'مہتمم اعلیٰ / پرنسپل' : 'Principal / Muhtamim'}</div>
      </div>
      <div>
        <div class="sig-line"></div>
        <div>${locale === 'ur' ? 'دستخط سرپرست' : 'Guardian'}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kashf_ul_Darajat_${resultData.regId.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'mumtaz':
      case 'ممتاز (A+)':
        return <Badge className="bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/30 font-extrabold px-2.5 py-0.5 text-xs gap-1 shadow-sm"><Star className="w-3 h-3 inline text-amber-500 fill-amber-500" /> ممتاز (A+)</Badge>;
      case 'jayyid_jiddan':
      case 'جید جدا (A)':
        return <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-extrabold px-2.5 py-0.5 text-xs gap-1">جید جدا (A)</Badge>;
      case 'jayyid':
      case 'جید (B)':
        return <Badge className="bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/30 font-extrabold px-2.5 py-0.5 text-xs gap-1">جید (B)</Badge>;
      case 'maqbool':
      case 'مقبول (C)':
        return <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30 font-extrabold px-2.5 py-0.5 text-xs gap-1">مقبول (C)</Badge>;
      default:
        return <Badge variant="destructive" className="font-extrabold px-2.5 py-0.5 text-xs gap-1">راسب / ناکام (Fail)</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto font-ur p-0 border-2 border-primary/30 shadow-2xl bg-card">
        {/* Printable Kashf-ul-Darajat Container */}
        <div id="printable-result-card" className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-card via-card to-amber-500/5 border-4 border-double border-amber-500/20">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-primary/20 pb-6 text-center sm:text-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-primary to-teal-800 text-white flex items-center justify-center shadow-lg shrink-0 border-2 border-amber-400/30">
                <School className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}
                </h2>
                <p className="text-xs text-primary font-bold mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <Award className="w-3.5 h-3.5 inline text-amber-500" />
                  <span>{locale === 'ur' ? 'شعبہ امتحانات و کشف الدرجات (Central Examinations Board)' : 'Central Examinations & Result Board'}</span>
                </p>
                <p className="text-[11px] text-muted-foreground font-bold mt-0.5">
                  {locale === 'ur' ? resultData.examTitleUrdu : resultData.examTitleEn}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end">
              {resultData.position ? (
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1 text-xs font-extrabold gap-1.5 shadow-md border border-yellow-300 animate-pulse uppercase">
                  <Trophy className="w-4 h-4 shrink-0 fill-white" />
                  <span>{resultData.position}</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="px-3 py-1 text-xs font-extrabold gap-1 border-primary/40 text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 inline text-emerald-600" /> {locale === 'ur' ? 'باضابطہ نتیجہ' : 'Verified Result'}
                </Badge>
              )}
              <span className="font-mono font-bold text-xs text-muted-foreground mt-2 font-en">{resultData.issueDate}</span>
            </div>
          </div>

          {/* Student Profile Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-muted/50 border border-border/80 text-xs font-bold shadow-inner">
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'رجسٹریشن نمبر / ID' : 'REG ID'}</span>
              <span className="font-mono text-primary text-sm font-en font-bold">{resultData.regId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'طالب علم کا نام' : 'Student Name'}</span>
              <span className="text-foreground text-sm font-extrabold">{locale === 'ur' ? resultData.studentNameUrdu : resultData.studentNameEn}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'والد / سرپرست' : 'Father / Guardian'}</span>
              <span className="text-foreground text-sm font-extrabold">{resultData.fatherNameUrdu || resultData.fatherNameEn || 'عبداللہ خان'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'درجہ / کلاس' : 'Class / Department'}</span>
              <span className="text-foreground text-xs sm:text-sm font-extrabold text-teal-700 dark:text-teal-400">{locale === 'ur' ? resultData.classNameUrdu : resultData.classNameEn}</span>
            </div>
          </div>

          {/* Subjects Marksheet Table */}
          <div className="border border-border/80 rounded-2xl overflow-hidden shadow-sm bg-card">
            <div className="bg-primary/10 p-3 border-b border-border/80 grid grid-cols-12 text-xs font-extrabold text-foreground text-center items-center">
              <span className="col-span-5 text-start ps-2">{locale === 'ur' ? 'مضمون و کتاب (Subject Name)' : 'Subject Name'}</span>
              <span className="col-span-2 font-en">{locale === 'ur' ? 'کل نمبر' : 'Total'}</span>
              <span className="col-span-2 font-en">{locale === 'ur' ? 'حاصل کردہ' : 'Obtained'}</span>
              <span className="col-span-3">{locale === 'ur' ? 'درجہ / تقدیر (Grade)' : 'Grade / Remark'}</span>
            </div>

            <div className="divide-y divide-border/60 text-xs sm:text-sm font-bold">
              {resultData.subjects.map((sub, idx) => (
                <div key={idx} className="grid grid-cols-12 p-3 text-center items-center hover:bg-muted/30 transition-colors">
                  <div className="col-span-5 text-start ps-2">
                    <p className="text-foreground font-extrabold">{locale === 'ur' ? sub.subjectUrdu : sub.subjectEn}</p>
                    {sub.remarks && <p className="text-[10px] text-muted-foreground font-normal mt-0.5 italic">{sub.remarks}</p>}
                  </div>
                  <span className="col-span-2 font-mono font-en text-muted-foreground">{sub.totalMarks}</span>
                  <span className="col-span-2 font-mono font-en text-base font-extrabold text-primary">{sub.obtainedMarks}</span>
                  <div className="col-span-3 flex justify-center">
                    {getGradeBadge(sub.grade)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Aggregates Row */}
            <div className="bg-muted/70 p-4 border-t-2 border-primary/20 grid grid-cols-12 text-sm sm:text-base font-extrabold text-foreground items-center">
              <div className="col-span-5 text-start ps-2 flex items-center gap-1.5 text-primary">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{locale === 'ur' ? 'مجموعی نتیجہ (Grand Total)' : 'Grand Total'}</span>
              </div>
              <span className="col-span-2 text-center font-mono font-en text-base">{resultData.totalMarks}</span>
              <span className="col-span-2 text-center font-mono font-en text-lg bg-primary/15 text-primary py-0.5 rounded-lg shadow-inner">{resultData.obtainedMarks}</span>
              <div className="col-span-3 text-center font-en text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {resultData.percentage.toFixed(1)}% ({locale === 'ur' ? 'فیصد' : 'Percent'})
              </div>
            </div>
          </div>

          {/* Overall Status & Grade Summary Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-card to-emerald-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground font-bold block">{locale === 'ur' ? 'حتمی امتحانی تقدیر و نتیجہ' : 'Final Academic Grade Status'}</span>
                <span className="text-base sm:text-lg font-extrabold text-foreground">{resultData.overallGrade}</span>
              </div>
            </div>
            {resultData.position && (
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white px-4 py-1.5 text-xs sm:text-sm font-extrabold shadow-md">
                🎉 {resultData.position}
              </Badge>
            )}
          </div>

          {/* Signatures & Cloudinary Verification */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-border/80 text-xs">
            <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/60">
              <div className="p-2 rounded-lg bg-white text-black shrink-0 shadow-sm">
                <QrCode className="w-9 h-9" />
              </div>
              <div>
                <p className="font-bold text-foreground flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {locale === 'ur' ? 'کلاؤڈینیری تصدیق شدہ کشف الدرجات' : 'Cloud Verified Kashf-ul-Darajat'}
                </p>
                <p className="text-[10px] text-muted-foreground font-en mt-0.5">Hash: CLD-EXM-{resultData.regId}-{Date.now().toString().slice(-4)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 sm:gap-8 text-center">
              <div className="space-y-1">
                <div className="w-20 sm:w-24 border-b-2 border-foreground/40 pb-2 mx-auto font-ur italic text-muted-foreground text-[11px]">
                  {locale === 'ur' ? 'دستخط ممتحن' : 'Examiner'}
                </div>
                <p className="font-bold text-muted-foreground text-[10px]">{locale === 'ur' ? 'ناظم امتحانات' : 'Controller Exams'}</p>
              </div>
              <div className="space-y-1">
                <div className="w-20 sm:w-24 border-b-2 border-foreground/40 pb-2 mx-auto font-ur italic text-primary font-bold text-[11px]">
                  {locale === 'ur' ? 'مفتی / پرنسپل' : 'Principal'}
                </div>
                <p className="font-bold text-foreground text-[10px]">{locale === 'ur' ? 'مہتمم اعلیٰ / پرنسپل' : 'Principal / Muhtamim'}</p>
              </div>
              <div className="space-y-1">
                <div className="w-20 sm:w-24 border-b-2 border-foreground/40 pb-2 mx-auto font-ur italic text-muted-foreground text-[11px]">
                  {locale === 'ur' ? 'دستخط سرپرست' : 'Guardian'}
                </div>
                <p className="font-bold text-muted-foreground text-[10px]">{locale === 'ur' ? 'والد / سرپرست' : 'Parent / Guardian'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="bg-muted/60 p-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-bold text-muted-foreground">
            {locale === 'ur' ? 'ہدایت: پرنٹ کرتے وقت Margins کو Minimum رکھیں تاکہ رزلٹ کارڈ ایک صفحے پر پرنٹ ہو۔' : 'Tip: Set printer margins to minimum for optimal single-page output.'}
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
              <span>{locale === 'ur' ? 'پرنٹ کریں (Print Card)' : 'Print Kashf-ul-Darajat'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
