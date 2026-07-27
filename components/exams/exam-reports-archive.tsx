"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Printer, 
  Download, 
  Sparkles, 
  Users, 
  GraduationCap, 
  Star,
  AlertCircle,
  Trophy,
  Filter,
  Database,
  RefreshCw,
  FileText,
  TrendingUp,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { ResultCardModal, ResultCardData, SubjectMarkItem } from './result-card-modal';

export function ExamReportsArchiveDesk() {
  const { locale, dir } = useLanguage();
  const [records, setRecords] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);
  
  // Filter States
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  
  // Modal State for Previewing Result Card
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [activeResultCard, setActiveResultCard] = useState<ResultCardData | null>(null);
  const supabase = createClient();

  const fetchArchiveFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data: resData } = await (supabase as any).from('exam_results').select('*').order('created_at', { ascending: false });
      const { data: stdData } = await (supabase as any).from('students').select('*');
      const { data: subData } = await (supabase as any).from('subjects').select('*');
      const { data: exmData } = await (supabase as any).from('exams').select('*');

      if (resData && resData.length > 0) {
        const mapped = resData.map((r: any) => {
          const std = stdData?.find((s: any) => s.id === r.student_id);
          const sub = subData?.find((s: any) => s.id === r.subject_id);
          const exm = exmData?.find((e: any) => e.id === r.exam_id);

          let cId = 'c1';
          let cUr = 'قاعدہ (شعبہ حفظ و ناظرہ)';
          let cEn = 'c1: Qaida';
          if (r.class_id === '11111111-1111-1111-1111-111111111104' || r.class_id === 'c4') {
            cId = 'c4'; cUr = 'تجوید (روایت حفص)'; cEn = 'c4: Tajweed Course';
          } else if (r.class_id === '11111111-1111-1111-1111-111111111105' || r.class_id === 'c11') {
            cId = 'c11'; cUr = 'درجہ اولیٰ (عامہ اولیٰ - سال اول)'; cEn = 'c11: Ula (Year 1)';
          } else if (r.class_id && r.class_id.startsWith('c')) {
            cId = r.class_id;
            cUr = `درجہ ${r.class_id}`;
            cEn = `Class ${r.class_id}`;
          }

          const tot = Number(r.total_marks) || 100;
          const obt = r.obtained_marks !== null && r.obtained_marks !== undefined ? Number(r.obtained_marks) : 0;
          const pct = tot > 0 ? (obt / tot) * 100 : 0;

          return {
            id: r.id,
            studentId: r.student_id,
            regId: std ? std.registration_id : 'REG-2026-0000',
            nameUrdu: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'طالب علم',
            name: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'Student',
            fatherNameUrdu: std ? (std.father_name || 'عبداللہ خان قادری') : 'عبداللہ خان قادری',
            classId: cId,
            classNameUrdu: cUr,
            classNameEn: cEn,
            examType: exm ? exm.exam_type : 'annual',
            examUrdu: exm ? exm.title_ur : 'سالانہ امتحان 1447ھ',
            examEn: exm ? exm.title_en : 'Annual Exam 2026',
            subjectId: r.subject_id || 'c1_1',
            subjectUrdu: sub ? (sub.title_ur || sub.name_ur) : 'نورانی قاعدہ',
            subjectEn: sub ? (sub.title_en || sub.name_en) : 'Noorani Qaida',
            total: tot,
            obtained: obt,
            grade: r.grade || (pct >= 90 ? 'mumtaz' : pct >= 80 ? 'jayyid_jiddan' : pct >= 70 ? 'jayyid' : pct >= 60 ? 'maqbool' : 'rasib'),
            percentage: pct,
            remarks: r.remarks || (locale === 'ur' ? 'بہترین کارکردگی' : 'Good performance')
          };
        });
        setRecords(mapped);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Error fetching exam archive:", err);
      setRecords([]);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchArchiveFromDb();
  }, []);

  // Filtering logic
  const filteredRecords = records.filter(item => {
    const matchesExam = selectedExam === 'all' || item.examType === selectedExam || (selectedExam === 'annual' && !item.examType);
    const matchesClass = selectedClass === 'all' || item.classId === selectedClass;
    const matchesSubject = selectedSubject === 'all' || item.subjectId === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || item.grade === selectedGrade;
    return matchesExam && matchesClass && matchesSubject && matchesGrade;
  });

  // KPI Calculations
  const totalFound = filteredRecords.length;
  const passedCount = filteredRecords.filter(r => r.grade !== 'rasib').length;
  const passPercentage = totalFound > 0 ? ((passedCount / totalFound) * 100).toFixed(1) : '0.0';
  const mumtazCount = filteredRecords.filter(r => r.grade === 'mumtaz').length;
  const failCount = filteredRecords.filter(r => r.grade === 'rasib').length;

  // Standalone offline HTML Report Download (No print dialog)
  const handleDownloadFilteredReport = () => {
    if (filteredRecords.length === 0) {
      toast.error(locale === 'ur' ? 'کوئی امتحانی ریکارڈ موجود نہیں!' : 'No exam records to download!');
      return;
    }

    toast.success(locale === 'ur' ? '📥 فلٹر شدہ امتحانی آرکائیو رپورٹ ڈاؤن لوڈ ہو رہی ہے...' : '📥 Downloading filtered Exam Archive Report...');

    const rowsHtml = filteredRecords.map((item, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: bold;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-weight: bold;">
          <div style="font-size: 13px; color: #0f172a;">${locale === 'ur' ? item.nameUrdu : item.name}</div>
          <div style="font-size: 11px; color: #64748b; font-family: monospace;">${item.regId}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'};">
          <div style="font-weight: bold; color: #0369a1;">${locale === 'ur' ? item.classNameUrdu : item.classNameEn}</div>
          <div style="font-size: 11px; color: #64748b;">${locale === 'ur' ? item.examUrdu : item.examEn}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-weight: bold; color: #0d9488;">
          ${locale === 'ur' ? item.subjectUrdu : item.subjectEn}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${item.total}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: 800; color: #047857;">${item.obtained}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: bold;">${item.percentage.toFixed(1)}%</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">
          <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; background-color: ${
            item.grade === 'mumtaz' ? '#f3e8ff; color: #6b21a8; border: 1px solid #d8b4fe;' :
            item.grade === 'jayyid_jiddan' ? '#d1fae5; color: #047857; border: 1px solid #6ee7b7;' :
            item.grade === 'jayyid' ? '#e0f2fe; color: #0369a1; border: 1px solid #7dd3fc;' : '#fef3c7; color: #b45309; border: 1px solid #fde68a;'
          }">${item.grade === 'mumtaz' ? 'ممتاز (A+)' : item.grade === 'jayyid_jiddan' ? 'جید جدا (A)' : item.grade === 'jayyid' ? 'جید (B)' : 'مقبول (C)'}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-size: 11px; color: #64748b; font-style: italic;">
          ${item.remarks}
        </td>
      </tr>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="${locale}" dir="${dir || 'rtl'}">
<head>
  <meta charset="UTF-8">
  <title>Master_Exam_Archive_Report_${Date.now()}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700;800&display=swap');
    body { font-family: ${locale === 'ur' ? "'Noto Nastaliq Urdu', 'Amiri', serif" : "'Inter', sans-serif"}; padding: 30px; background-color: #f8fafc; color: #0f172a; line-height: 1.6; }
    .report-box { max-width: 1100px; margin: 0 auto; background: white; padding: 35px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 4px double #0d9488; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 25px; }
    .school-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .subtitle { font-size: 14px; color: #0d9488; font-weight: bold; margin: 4px 0 0 0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
    .kpi-card { background: #f1f5f9; padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0; }
    .kpi-title { font-size: 12px; color: #64748b; font-weight: bold; margin-bottom: 5px; }
    .kpi-value { font-size: 22px; font-weight: 800; color: #0f172a; font-family: monospace; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th { background: #ccfbf1; color: #0f172a; padding: 12px 10px; font-size: 13px; font-weight: 800; border-bottom: 2px solid #0d9488; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
    .table th.center { text-align: center; }
    .signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 12px; font-weight: bold; }
    .sig-line { width: 150px; border-bottom: 1px solid #475569; margin: 0 auto 5px auto; }
    .print-btn { background: #0d9488; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-bottom: 20px; display: inline-block; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: white; } .report-box { box-shadow: none; border: 2px solid #000; } }
  </style>
</head>
<body>
  <div style="text-align: center;" class="no-print">
    <button onclick="window.print()" class="print-btn">🖨️ اس رپورٹ کو پرنٹ کریں (Print Report)</button>
  </div>
  <div class="report-box">
    <div class="header">
      <div>
        <h1 class="school-title">${locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}</h1>
        <p class="subtitle">📜 ${locale === 'ur' ? 'مرکزی امتحانی آرکائیو، کشف الدرجات و رزلٹ رپورٹس ڈیسک' : 'Master Examination Archive & Result Roster Desk'}</p>
      </div>
      <div style="text-align: ${dir === 'rtl' ? 'left' : 'right'}; font-family: monospace; font-size: 12px; color: #64748b;">
        <div>Date: ${new Date().toISOString().split('T')[0]}</div>
        <div style="margin-top: 4px; font-weight: bold; color: #0d9488;">Records: ${totalFound}</div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-title">${locale === 'ur' ? 'کل امتحانی نتائج' : 'Total Results Found'}</div>
        <div class="kpi-value" style="color: #0369a1;">${totalFound}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">${locale === 'ur' ? 'مجموعی کامیابی تناسب' : 'Pass Ratio'}</div>
        <div class="kpi-value" style="color: #047857;">${passPercentage}%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">${locale === 'ur' ? 'ممتاز (A+) طلباء' : 'Mumtaz (A+) Distinction'}</div>
        <div class="kpi-value" style="color: #6b21a8;">${mumtazCount}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">${locale === 'ur' ? 'راسب / ناکام' : 'Needs Attention / Fail'}</div>
        <div class="kpi-value" style="color: ${failCount > 0 ? '#dc2626' : '#64748b'};">${failCount}</div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th class="center" style="width: 40px;">#</th>
          <th>${locale === 'ur' ? 'طالب علم و REG ID' : 'Student & ID'}</th>
          <th>${locale === 'ur' ? 'درجہ و امتحان' : 'Class & Term'}</th>
          <th>${locale === 'ur' ? 'مضمون / پرچہ' : 'Subject Name'}</th>
          <th class="center" style="width: 70px;">${locale === 'ur' ? 'کل نمبر' : 'Total'}</th>
          <th class="center" style="width: 70px;">${locale === 'ur' ? 'حاصل کردہ' : 'Obtained'}</th>
          <th class="center" style="width: 70px;">${locale === 'ur' ? 'فیصد' : '%'}</th>
          <th class="center" style="width: 100px;">${locale === 'ur' ? 'تقدیر (Grade)' : 'Grade'}</th>
          <th>${locale === 'ur' ? 'ممتحن کے تاثرات' : 'Remarks'}</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="signatures">
      <div>
        <div class="sig-line"></div>
        <div>${locale === 'ur' ? 'دستخط ناظم امتحانات' : 'Controller of Examinations'}</div>
      </div>
      <div>
        <div class="sig-line" style="border-color: #0d9488;"></div>
        <div style="color: #0d9488;">${locale === 'ur' ? 'مہتمم اعلیٰ / پرنسپل' : 'Principal / Muhtamim'}</div>
      </div>
      <div>
        <div class="sig-line"></div>
        <div>${locale === 'ur' ? 'مہر شعبہ تعلیم و امتحانات' : 'Official Seal'}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Exam_Roster_Report_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenCard = (rec: any) => {
    // Collect all authentic DB results for this student in this exam session
    const studentResults = records.filter(r => r.studentId === rec.studentId && r.examUrdu === rec.examUrdu);
    const subjects: SubjectMarkItem[] = studentResults.map(r => ({
      subjectUrdu: r.subjectUrdu,
      subjectEn: r.subjectEn,
      totalMarks: r.total,
      obtainedMarks: r.obtained,
      grade: r.grade,
      remarks: r.remarks
    }));

    const tot = subjects.reduce((acc, curr) => acc + curr.totalMarks, 0);
    const obt = subjects.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
    const pct = tot > 0 ? (obt / tot) * 100 : 0;
    const overallGrade = pct >= 90 ? 'mumtaz' : pct >= 80 ? 'jayyid_jiddan' : pct >= 70 ? 'jayyid' : pct >= 60 ? 'maqbool' : 'rasib';

    const cardPayload: ResultCardData = {
      examTitleUrdu: rec.examUrdu || 'سالانہ امتحان 1447ھ',
      examTitleEn: rec.examEn || 'Annual Exam 2026',
      studentNameUrdu: rec.nameUrdu,
      studentNameEn: rec.name,
      regId: rec.regId,
      fatherNameUrdu: rec.fatherNameUrdu || 'عبداللہ خان قادری',
      fatherNameEn: 'Abdullah Khan',
      classNameUrdu: rec.classNameUrdu,
      classNameEn: rec.classNameEn,
      subjects,
      totalMarks: tot,
      obtainedMarks: obt,
      percentage: pct,
      overallGrade: overallGrade === 'mumtaz' ? 'ممتاز (A+ Distinction)' :
                    overallGrade === 'jayyid_jiddan' ? 'جید جدا (Very Good A)' :
                    overallGrade === 'jayyid' ? 'جید (Good B)' : 'مقبول (Pass C)',
      position: pct >= 90 ? (locale === 'ur' ? 'پوزیشن: اول (1st Position)' : '1st Position 🏆') : undefined,
      issueDate: new Date().toISOString().split('T')[0]
    };

    setActiveResultCard(cardPayload);
    setResultModalOpen(true);
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'mumtaz':
        return <Badge className="bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/30 font-bold px-2 py-0.5 text-[11px] gap-1 shadow-sm"><Star className="w-3 h-3 inline text-amber-500 fill-amber-500" /> ممتاز (A+)</Badge>;
      case 'jayyid_jiddan':
        return <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 font-bold px-2 py-0.5 text-[11px]">جید جدا (A)</Badge>;
      case 'jayyid':
        return <Badge className="bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/30 font-bold px-2 py-0.5 text-[11px]">جید (B)</Badge>;
      case 'maqbool':
        return <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30 font-bold px-2 py-0.5 text-[11px]">مقبول (C)</Badge>;
      default:
        return <Badge variant="destructive" className="font-bold px-2 py-0.5 text-[11px]">راسب (Fail)</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-ur">
      {/* KPI Highlights for Filtered Archive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-blue-500/10 via-card to-card border-s-4 border-s-blue-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل ریکارڈز (Results Found)' : 'Total Results Found'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">{totalFound}</h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> {locale === 'ur' ? 'منتخب فلٹرز کے مطابق' : 'Matching current filters'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
              <History className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-emerald-500/10 via-card to-card border-s-4 border-s-emerald-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کامیابی تناسب (Pass Ratio)' : 'Pass Ratio'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">{passPercentage}%</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {locale === 'ur' ? `${passedCount} طلباء کامیاب` : `${passedCount} students passed`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-purple-500/10 via-card to-card border-s-4 border-s-purple-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'ممتاز (A+ Distinction)' : 'Mumtaz A+ Holders'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-purple-700 dark:text-purple-400 font-en mt-1">{mumtazCount}</h3>
              <p className="text-[11px] text-purple-600 font-bold mt-1">{locale === 'ur' ? '90% یا اس سے زائد نمبرات' : '90% or higher score'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-700 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-purple-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-amber-500/10 via-card to-card border-s-4 border-s-amber-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'توجہ طلب / راسب' : 'Needs Attention / Fail'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-400 font-en mt-1">{failCount}</h3>
              <p className="text-[11px] text-amber-600 font-bold mt-1">{locale === 'ur' ? 'مقبول یا اس سے کم' : 'Requires remedial support'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4-Way Filter Dashboard */}
      <Card className="border-border/60 shadow-sm bg-card/95 backdrop-blur-md">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Award className="w-3.5 h-3.5 text-primary" />
                <span>{locale === 'ur' ? 'امتحانی ٹرم / سیشن' : 'Exam Term / Session'}</span>
              </Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="h-10 font-bold text-xs sm:text-sm font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all" className="font-extrabold text-primary">{locale === 'ur' ? '🌐 تمام امتحانات (All Terms)' : '🌐 All Terms'}</SelectItem>
                  <SelectItem value="annual" className="font-bold">{locale === 'ur' ? '🏆 سالانہ امتحان 1447ھ' : '🏆 Annual Exam'}</SelectItem>
                  <SelectItem value="mid_term" className="font-bold">{locale === 'ur' ? '📝 شش ماہی امتحان' : '📝 6-Month Mid Term'}</SelectItem>
                  <SelectItem value="quarterly" className="font-bold">{locale === 'ur' ? '📅 سہ ماہی امتحان' : '📅 Quarterly Exam'}</SelectItem>
                  <SelectItem value="monthly" className="font-bold">{locale === 'ur' ? '📊 یک ماہی جائزہ ٹیسٹ' : '📊 Monthly Eval Test'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{locale === 'ur' ? 'درجہ / کلاس فلٹر' : 'Class / Grade Filter'}</span>
              </Label>
              <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setSelectedSubject('all'); }}>
                <SelectTrigger className="h-10 font-bold text-xs sm:text-sm font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur max-h-72">
                  <SelectItem value="all" className="font-extrabold text-primary">{locale === 'ur' ? '🌐 تمام درجات (All Classes)' : '🌐 All Classes'}</SelectItem>
                  <SelectItem value="c1">{locale === 'ur' ? 'c1: قاعدہ (شعبہ حفظ و ناظرہ)' : 'c1: Qaida'}</SelectItem>
                  <SelectItem value="c2">{locale === 'ur' ? 'c2: ناظرہ قرآن کریم' : 'c2: Nazra Quran'}</SelectItem>
                  <SelectItem value="c3">{locale === 'ur' ? 'c3: حفظِ قرآن کریم' : 'c3: Hifz al-Quran'}</SelectItem>
                  <SelectItem value="c4">{locale === 'ur' ? 'c4: تجوید (روایت حفص)' : 'c4: Tajweed Course'}</SelectItem>
                  <SelectItem value="c8">{locale === 'ur' ? 'c8: اعدادیہ اول (مڈل / بنیاد)' : 'c8: Idadiyah Year 1'}</SelectItem>
                  <SelectItem value="c11">{locale === 'ur' ? 'c11: درجہ اولیٰ (عامہ اولیٰ)' : 'c11: Ula (Year 1)'}</SelectItem>
                  <SelectItem value="c18">{locale === 'ur' ? 'c18: درجہ ثامنہ (دورہِ حدیث)' : 'c18: Dora-e-Hadith'}</SelectItem>
                  <SelectItem value="c21">{locale === 'ur' ? 'c21: تخصص فی الفقہ والافتاء' : 'c21: Takhassus Fiqh'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>{locale === 'ur' ? 'مضمون / کتاب فلٹر' : 'Subject / Book Filter'}</span>
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-10 font-bold text-xs sm:text-sm font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all" className="font-extrabold text-primary">{locale === 'ur' ? '🌐 تمام مضامین' : '🌐 All Subjects'}</SelectItem>
                  <SelectItem value="c1_1">{locale === 'ur' ? '📖 نورانی قاعدہ' : '📖 Noorani Qaida'}</SelectItem>
                  <SelectItem value="c2_1">{locale === 'ur' ? '📖 ناظرہ قرآن' : '📖 Nazra Quran'}</SelectItem>
                  <SelectItem value="c3_2">{locale === 'ur' ? '📖 آموختہ (منزل) کی پختگی' : '📖 Manzil Revision'}</SelectItem>
                  <SelectItem value="c11_1">{locale === 'ur' ? '📖 صرف میر و نحو میر' : '📖 Sarf Meer'}</SelectItem>
                  <SelectItem value="c18_1">{locale === 'ur' ? '📖 صحیح البخاری (جلد اول)' : '📖 Sahih Bukhari 1'}</SelectItem>
                  <SelectItem value="c21_1">{locale === 'ur' ? '📖 فتاویٰ شامی' : '📖 Fatawa Shami'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>{locale === 'ur' ? 'تقدیر (Grade Status)' : 'Grade Status'}</span>
              </Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="h-10 font-bold text-xs sm:text-sm font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all" className="font-extrabold text-primary">{locale === 'ur' ? '🌐 تمام تقدیریں (All Grades)' : '🌐 All Grades'}</SelectItem>
                  <SelectItem value="mumtaz" className="font-bold text-purple-700">{locale === 'ur' ? '⭐ ممتاز (A+ Distinction)' : '⭐ Mumtaz (A+)'}</SelectItem>
                  <SelectItem value="jayyid_jiddan" className="font-bold text-emerald-700">{locale === 'ur' ? '✅ جید جدا (Very Good A)' : '✅ Jayyid Jiddan (A)'}</SelectItem>
                  <SelectItem value="jayyid" className="font-bold text-blue-700">{locale === 'ur' ? '🔵 جید (Good B)' : '🔵 Jayyid (B)'}</SelectItem>
                  <SelectItem value="maqbool" className="font-bold text-amber-700">{locale === 'ur' ? '🟡 مقبول (Pass C)' : '🟡 Maqbool (C)'}</SelectItem>
                  <SelectItem value="rasib" className="font-bold text-rose-700">{locale === 'ur' ? '❌ راسب (Fail)' : '❌ Rasib (Fail)'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Results Table */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/60 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>{locale === 'ur' ? 'مرکزی امتحانی آرکائیو اور نتائج کا تفصیلی انڈیکس' : 'Master Examination Archive & Detailed Results Index'}</span>
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {locale === 'ur' ? 'تمام درجات اور شعبہ جات کے طلباء کی امتحانی کارکردگی۔ کسی بھی رزلٹ کو پرنٹ کریں یا پوری لسٹ کو آف لائن رپورٹ کی صورت میں ڈاؤن لوڈ کریں۔' : 'Comprehensive performance index across all Madrasa departments. Print individual cards or download the complete filtered roster.'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="ghost" size="icon" onClick={fetchArchiveFromDb} className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Refresh DB">
              <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleDownloadFilteredReport} variant="emerald" size="sm" className="font-bold text-xs gap-1.5 shadow-md shrink-0">
              <Download className="w-4 h-4 shrink-0" />
              <span>{locale === 'ur' ? '📥 فلٹر شدہ امتحانی رپورٹ ڈاؤن لوڈ کریں' : '📥 Download Filtered Exam Report'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>{locale === 'ur' ? 'طالب علم و REG ID' : 'Student & ID'}</TableHead>
                <TableHead>{locale === 'ur' ? 'درجہ و امتحانی سیشن' : 'Class & Term'}</TableHead>
                <TableHead>{locale === 'ur' ? 'مضمون / پرچہ' : 'Subject Name'}</TableHead>
                <TableHead className="text-center w-24">{locale === 'ur' ? 'کل نمبر' : 'Total'}</TableHead>
                <TableHead className="text-center w-24">{locale === 'ur' ? 'حاصل کردہ' : 'Obtained'}</TableHead>
                <TableHead className="text-center w-24">{locale === 'ur' ? 'فیصد تناسب' : '%'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'تقدیر (Grade)' : 'Grade'}</TableHead>
                <TableHead>{locale === 'ur' ? 'تاثرات' : 'Remarks'}</TableHead>
                <TableHead className="text-end">{locale === 'ur' ? 'کشف الدرجات' : 'Card'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileText className="w-12 h-12 text-muted-foreground animate-pulse" />
                      <h4 className="text-base font-extrabold text-foreground">
                        {locale === 'ur' ? 'ابھی تک امتحانات کے نتائج لائیو ڈیٹا بیس میں موجود نہیں ہیں!' : 'No exam results found in live database!'}
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-md text-center font-bold">
                        {locale === 'ur' ? 'براہ کرم مارکس انٹری ڈیسک پر جا کر طلباء کے نمبرات درج کریں یا وہاں دیے گئے بٹن سے اصل ڈیٹا بیس میں 3 حقیقی و مستند طلباء اور رزلٹ کا اندراج کریں تاکہ یہاں شو ہوں۔' : 'Please go to Marks Entry desk to input scores or seed 3 authentic records into the live database.'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-center font-mono font-bold text-xs text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-bold py-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-en">
                          {item.regId}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-foreground">{locale === 'ur' ? item.nameUrdu : item.name}</h4>
                    </TableCell>
                    <TableCell className="text-xs font-bold">
                      <div className="text-teal-700 dark:text-teal-400 font-extrabold">{locale === 'ur' ? item.classNameUrdu : item.classNameEn}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{locale === 'ur' ? item.examUrdu : item.examEn}</div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-primary">
                      {locale === 'ur' ? item.subjectUrdu : item.subjectEn}
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold text-xs text-muted-foreground">{item.total}</TableCell>
                    <TableCell className="text-center font-mono font-extrabold text-sm text-primary">{item.obtained}</TableCell>
                    <TableCell className="text-center font-mono font-extrabold text-xs text-emerald-600 dark:text-emerald-400">{item.percentage.toFixed(1)}%</TableCell>
                    <TableCell className="text-center">
                      {getGradeBadge(item.grade)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground italic max-w-[150px] truncate" title={item.remarks}>
                      {item.remarks}
                    </TableCell>
                    <TableCell className="text-end">
                      <Button 
                        onClick={() => handleOpenCard(item)} 
                        variant="outline" 
                        size="sm" 
                        className="font-bold text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5 shrink-0" />
                        <span>{locale === 'ur' ? 'رزلٹ دیکھیں' : 'View Card'}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 border-t border-border/60 flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground">
            {locale === 'ur' ? 'نوٹ: کسی بھی فلٹر کو لگا کر اوپر سبز بٹن پر کلک کریں تاکہ پوری منتخب لسٹ آف لائن رپورٹ فائل میں محفوظ ہو جائے۔' : 'Note: Apply filters and click download button to generate a standalone offline HTML roster report.'}
          </p>
        </CardFooter>
      </Card>

      {/* Printable Result Card Modal */}
      <ResultCardModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        resultData={activeResultCard}
      />
    </div>
  );
}
