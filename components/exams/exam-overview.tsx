"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Award, 
  Trophy, 
  Star, 
  CheckCircle2, 
  Printer, 
  Download, 
  Sparkles, 
  Users, 
  GraduationCap, 
  BookOpen, 
  PieChart, 
  TrendingUp,
  ShieldCheck,
  Settings,
  FileText,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { MarksEntryDesk } from './marks-entry';
import { ResultCardModal, ResultCardData } from './result-card-modal';
import { ExamSystemConfigDesk } from './exam-system-config';
import { ExamReportsArchiveDesk } from './exam-reports-archive';

export function ExamOverview() {
  const { locale, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState('honor');
  const [posList, setPosList] = useState<any[]>([]);
  const [rawDbResults, setRawDbResults] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [activeResultCard, setActiveResultCard] = useState<ResultCardData | null>(null);
  const supabase = createClient();

  const fetchRollOfHonorFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data: resData } = await (supabase as any).from('exam_results').select('*').order('obtained_marks', { ascending: false });
      const { data: stdData } = await (supabase as any).from('students').select('*');
      const { data: subData } = await (supabase as any).from('subjects').select('*');
      const { data: clsData } = await (supabase as any).from('classes').select('*');

      if (resData && resData.length > 0) {
        setRawDbResults({ resData, stdData, subData });
        // Group by student and calculate avg
        const stdMap: Record<string, { totalObt: number; count: number; nameUrdu: string; nameEn: string; regId: string; classId: string; fatherName: string }> = {};
        resData.forEach((r: any) => {
          if (!r.student_id) return;
          const std = stdData?.find((s: any) => s.id === r.student_id);
          if (!stdMap[r.student_id]) {
            stdMap[r.student_id] = {
              totalObt: 0,
              count: 0,
              nameUrdu: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'طالب علم',
              nameEn: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'Student',
              fatherName: std ? (std.father_name || 'عبداللہ خان قادری') : 'عبداللہ خان قادری',
              regId: std ? std.registration_id : 'REG-2026-0000',
              classId: r.class_id || 'c1'
            };
          }
          const tot = Number(r.total_marks) || 100;
          const pct = ((Number(r.obtained_marks) || 0) / tot) * 100;
          stdMap[r.student_id].totalObt += pct;
          stdMap[r.student_id].count += 1;
        });

        const topStudents = Object.entries(stdMap)
          .map(([sId, val]) => {
            const avgPct = val.totalObt / val.count;
            const clsObj = clsData?.find((c: any) => c.id === val.classId);
            const cUr = clsObj ? clsObj.name_ur : 'درجہ';
            const cEn = clsObj ? clsObj.name_en : 'Class';
            
            const deptCheck = clsObj ? clsObj.name_ur : val.classId;
            const isHifz = deptCheck.includes('حفظ') || deptCheck.includes('ناظرہ');
            const isNizami = deptCheck.includes('عامہ') || deptCheck.includes('درجہ');

            return {
              id: sId,
              regId: val.regId,
              nameUrdu: val.nameUrdu,
              name: val.nameEn,
              fatherNameUrdu: val.fatherName,
              classNameUrdu: cUr,
              classNameEn: cEn,
              percentage: Number(avgPct.toFixed(1)),
              grade: avgPct >= 90 ? 'ممتاز (Distinction A+)' : avgPct >= 80 ? 'جید جدا (Very Good A)' : avgPct >= 70 ? 'جید (Good B)' : 'مقبول (Pass C)',
              award: avgPct >= 92 ? 'طلائی تمغہ (Gold Medal) 🥇' : avgPct >= 85 ? 'نقری تمغہ (Silver Medal) 🥈' : 'کانسی کا تمغہ (Bronze Medal) 🥉',
              dept: isHifz ? 'hifz' : isNizami ? 'nizami' : 'school'
            };
          })
          .filter(item => item.percentage >= 40)
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 10);

        if (topStudents.length > 0) {
          const ranked = topStudents.map((st, i) => ({
            ...st,
            rankUrdu: i === 0 ? 'پوزیشن: اول (1st)' : i === 1 ? 'پوزیشن: دوم (2nd)' : i === 2 ? 'پوزیشن: سوم (3rd)' : `پوزیشن: ${i + 1}واں`,
            rank: i === 0 ? '1st Position 🏆' : i === 1 ? '2nd Position 🥈' : i === 2 ? '3rd Position 🥉' : `${i + 1}th Position`
          }));
          setPosList(ranked);
          return;
        }
      }
      setPosList([]);
    } catch (err) {
      console.error("Error fetching roll of honor:", err);
      setPosList([]);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchRollOfHonorFromDb();
  }, []);

  const handlePrintRollOfHonor = () => {
    if (posList.length === 0) {
      toast.error(locale === 'ur' ? 'پرنٹ کے لیے کوئی پوزیشن ہولڈر موجود نہیں!' : 'No position holders to print!');
      return;
    }
    toast.success(locale === 'ur' ? '🖨️ لوحِ شرف (Roll of Honor) پرنٹ کی جا رہی ہے...' : '🖨️ Printing official Roll of Honor...');
    window.print();
  };

  const handleDownloadRollOfHonor = () => {
    if (posList.length === 0) {
      toast.error(locale === 'ur' ? 'ڈاؤن لوڈ کے لیے کوئی پوزیشن ہولڈر موجود نہیں!' : 'No position holders to download!');
      return;
    }
    toast.success(locale === 'ur' ? '📥 لوحِ شرف آف لائن دستاویزی رپورٹ ڈاؤن لوڈ ہو رہی ہے...' : '📥 Downloading standalone Roll of Honor report...');
    const rowsHtml = posList.map((pos, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#fefce8'};">
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 800; color: #b45309;">${locale === 'ur' ? pos.rankUrdu : pos.rank}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-weight: bold;">
          <div style="font-size: 15px; color: #0f172a;">${locale === 'ur' ? pos.nameUrdu : pos.name}</div>
          <div style="font-size: 11px; color: #64748b; font-family: monospace;">${pos.regId}</div>
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-weight: bold; color: #0f766e;">
          ${locale === 'ur' ? pos.classNameUrdu : pos.classNameEn}
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-size: 16px; font-weight: 800; color: #15803d;">${pos.percentage}%</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: #6b21a8;">${pos.grade}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; font-weight: 800; color: #d97706;">🏆 ${pos.award}</td>
      </tr>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="${locale}" dir="${dir || 'rtl'}">
<head>
  <meta charset="UTF-8">
  <title>Roll_of_Honor_Report_2026</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700;800&display=swap');
    body { font-family: ${locale === 'ur' ? "'Noto Nastaliq Urdu', 'Amiri', serif" : "'Inter', sans-serif"}; padding: 30px; background-color: #f8fafc; color: #0f172a; line-height: 1.6; }
    .report-box { max-width: 1000px; margin: 0 auto; background: white; padding: 35px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 4px double #d97706; }
    .header { text-align: center; border-bottom: 2px solid #d97706; padding-bottom: 20px; margin-bottom: 25px; }
    .school-title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
    .subtitle { font-size: 16px; color: #d97706; font-weight: bold; margin: 6px 0 0 0; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th { background: #fef3c7; color: #78350f; padding: 12px 10px; font-size: 13px; font-weight: 800; border-bottom: 2px solid #d97706; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
    .table th.center { text-align: center; }
    .signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 13px; font-weight: bold; }
    .sig-line { width: 160px; border-bottom: 1px solid #475569; margin: 0 auto 5px auto; }
    .print-btn { background: #d97706; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-bottom: 20px; display: inline-block; }
    @media print { .no-print { display: none !important; } body { padding: 0; background: white; } .report-box { box-shadow: none; border: 2px solid #000; } }
  </style>
</head>
<body>
  <div style="text-align: center;" class="no-print">
    <button onclick="window.print()" class="print-btn">🖨️ اس رپورٹ کو پرنٹ کریں (Print Report)</button>
  </div>
  <div class="report-box">
    <div class="header">
      <h1 class="school-title">${locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}</h1>
      <p class="subtitle">🏆 ${locale === 'ur' ? 'لوحِ شرف - سالانہ امتحانات 1447ھ (Official Roll of Honor)' : 'Official Roll of Honor - Annual Examination 2026'}</p>
      <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-top: 5px;">Generated: ${new Date().toISOString().split('T')[0]} | Total Top Holders: ${posList.length}</div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th class="center">${locale === 'ur' ? 'پوزیشن و مقام' : 'Rank / Position'}</th>
          <th>${locale === 'ur' ? 'سرفراز طالب علم' : 'Distinguished Student'}</th>
          <th>${locale === 'ur' ? 'درجہ / شعبہ' : 'Class / Dept'}</th>
          <th class="center">${locale === 'ur' ? 'فیصد تناسب' : '%'}</th>
          <th class="center">${locale === 'ur' ? 'تقدیر (Grade)' : 'Grade'}</th>
          <th>${locale === 'ur' ? 'اعزاز / انعام (Award)' : 'Award'}</th>
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
        <div class="sig-line" style="border-color: #d97706;"></div>
        <div style="color: #d97706;">${locale === 'ur' ? 'مہتمم اعلیٰ / پرنسپل' : 'Principal / Muhtamim'}</div>
      </div>
      <div>
        <div class="sig-line"></div>
        <div>${locale === 'ur' ? 'مہر جامعہ و دارالعلوم' : 'Official Seal'}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Roll_of_Honor_Report_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenPositionCard = (pos: any) => {
    let subjects: any[] = [];
    let tot = 0;
    let obt = 0;

    if (rawDbResults && rawDbResults.resData) {
      const { resData, subData } = rawDbResults;
      const stdRes = resData.filter((r: any) => r.student_id === pos.id);
      if (stdRes.length > 0) {
        subjects = stdRes.map((r: any) => {
          const sub = subData?.find((s: any) => s.id === r.subject_id);
          const t = Number(r.total_marks) || 100;
          const o = Number(r.obtained_marks) || 0;
          tot += t;
          obt += o;
          return {
            subjectUrdu: sub ? (sub.title_ur || sub.name_ur) : 'پرچہ امتحان',
            subjectEn: sub ? (sub.title_en || sub.name_en) : 'Exam Paper',
            totalMarks: t,
            obtainedMarks: o,
            grade: r.grade || 'mumtaz',
            remarks: r.remarks || pos.award
          };
        });
      }
    }

    if (subjects.length === 0) {
      tot = 100;
      obt = Math.round(pos.percentage);
      subjects = [{
        subjectUrdu: 'مجموعی امتحانی جائزہ',
        subjectEn: 'Overall Exam Evaluation',
        totalMarks: tot,
        obtainedMarks: obt,
        grade: pos.grade || 'mumtaz',
        remarks: pos.award
      }];
    }

    const pct = tot > 0 ? (obt / tot) * 100 : pos.percentage;

    const cardPayload: ResultCardData = {
      examTitleUrdu: 'سالانہ امتحان 1447ھ (عصری و دینی علوم)',
      examTitleEn: 'Annual Examination 2026',
      studentNameUrdu: pos.nameUrdu,
      studentNameEn: pos.name,
      regId: pos.regId,
      fatherNameUrdu: pos.fatherNameUrdu || 'عبداللہ خان قادری',
      fatherNameEn: 'Abdullah Khan',
      classNameUrdu: pos.classNameUrdu,
      classNameEn: pos.classNameEn,
      subjects,
      totalMarks: tot,
      obtainedMarks: obt,
      percentage: pct,
      overallGrade: pos.grade,
      position: pos.rankUrdu,
      issueDate: new Date().toISOString().split('T')[0]
    };

    setActiveResultCard(cardPayload);
    setResultModalOpen(true);
  };

  return (
    <div className="space-y-6 font-ur">
      {/* KPI Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-amber-500/10 via-card to-card border-s-4 border-s-amber-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'امتحانی سیشنز (Sessions)' : 'Active Exam Sessions'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">2 Sessions</h3>
              <p className="text-[11px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> {locale === 'ur' ? 'سالانہ امتحان 1447ھ جاری' : 'Annual Exam 2026 active'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-emerald-500/10 via-card to-card border-s-4 border-s-emerald-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کامیابی شرح (Pass Rate)' : 'Overall Pass Rate'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">94.8%</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {locale === 'ur' ? 'ممتاز اور جید جدا نتائج' : 'Mumtaz & Jayyid dominance'}
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
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'ممتاز (A+) پوزیشن ہولڈرز' : 'Distinction A+ Holders'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-purple-700 dark:text-purple-400 font-en mt-1">{posList.length} Students</h3>
              <p className="text-[11px] text-purple-600 font-bold mt-1">{locale === 'ur' ? 'لوحِ شرف پر سرفراز طلباء' : 'Featured on Roll of Honor'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-700 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-purple-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-blue-500/10 via-card to-card border-s-4 border-s-blue-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'جانچ شدہ طلباء (Evaluated)' : 'Total Students Evaluated'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-blue-700 dark:text-blue-400 font-en mt-1">{rawDbResults ? rawDbResults.resData?.length || 0 : 0} Records</h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1">{locale === 'ur' ? 'لائیو ڈیٹا بیس اندراجات' : 'Live database entries'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} dir={dir || 'rtl'} className="w-full">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 h-auto bg-card border border-border/80 rounded-xl p-1 shadow-sm gap-1">
          <TabsTrigger value="honor" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{locale === 'ur' ? '1. لوحِ شرف اور پوزیشن ہولڈرز' : '1. Roll of Honor & Ranks'}</span>
          </TabsTrigger>
          <TabsTrigger value="entry" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <GraduationCap className="w-4 h-4 text-primary shrink-0" />
            <span>{locale === 'ur' ? '2. مارکس انٹری و کشف الدرجات ڈیسک' : '2. Marks Entry Desk'}</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <Settings className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{locale === 'ur' ? '3. امتحانی نظام و نصاب ترتیبات' : '3. Exam & Paper Config'}</span>
          </TabsTrigger>
          <TabsTrigger value="archive" className="font-bold text-xs sm:text-sm gap-2 py-2.5">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{locale === 'ur' ? '4. مرکزی امتحانی آرکائیو و رپورٹس' : '4. Master Exam Reports'}</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ROLL OF HONOR (لوحِ شرف) */}
        <TabsContent value="honor" className="pt-4 space-y-6 animate-in fade-in-50 duration-200">
          <Card className="border-border/60 shadow-lg border-t-8 border-t-amber-500 bg-gradient-to-b from-card via-card to-amber-500/5">
            <CardHeader className="bg-amber-500/10 border-b border-border/60 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-lg shrink-0">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                    <span>{locale === 'ur' ? 'لوحِ شرف - سالانہ امتحان 1447ھ (Roll of Honor)' : 'Roll of Honor - Annual Examination 2026'}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-bold mt-0.5">
                    {locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول کے تمام درجات اور شعبہ جات میں ممتاز اور اول پوزیشن حاصل کرنے والے سرفراز طلباء۔' : 'Distinguished Gold, Silver, and Bronze medal position holders across Modern School, Hifz, and Dars-e-Nizami.'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Button 
                  onClick={fetchRollOfHonorFromDb} 
                  disabled={loadingDb}
                  variant="outline" 
                  size="sm" 
                  className="font-bold text-xs gap-1.5 border-purple-500/50 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? 'animate-spin' : ''}`} />
                  <span>{loadingDb ? (locale === 'ur' ? 'سنک ہو رہا ہے...' : 'Syncing...') : (locale === 'ur' ? '⚡ لائیو DB سے سنک کریں' : '⚡ Sync DB')}</span>
                </Button>
                <Button onClick={handleDownloadRollOfHonor} variant="emerald" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>{locale === 'ur' ? '📥 لوحِ شرف ڈاؤن لوڈ کریں' : '📥 Download Report'}</span>
                </Button>
                <Button onClick={handlePrintRollOfHonor} variant="outline" size="sm" className="font-bold text-xs gap-1.5 shrink-0 border-amber-500/50 text-amber-700 hover:bg-amber-500/10 shadow-sm">
                  <Printer className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{locale === 'ur' ? '🖨️ پرنٹ کریں' : '🖨️ Print'}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-24 text-center">{locale === 'ur' ? 'پوزیشن و مقام' : 'Rank / Position'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'سرفراز طالب علم' : 'Distinguished Student'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'درجہ / شعبہ' : 'Class / Dept'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'فیصد تناسب' : 'Percentage'}</TableHead>
                    <TableHead className="text-center">{locale === 'ur' ? 'تقدیر (Grade)' : 'Grade'}</TableHead>
                    <TableHead>{locale === 'ur' ? 'اعزاز / انعام (Award)' : 'Honor Award'}</TableHead>
                    <TableHead className="text-end">{locale === 'ur' ? 'کشف الدرجات' : 'Result Card'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Trophy className="w-12 h-12 text-amber-500/60 animate-pulse" />
                          <h4 className="text-base font-extrabold text-foreground">
                            {locale === 'ur' ? 'ابھی تک پوزیشن ہولڈرز (لوحِ شرف) کا ریکارڈ لائیو ڈیٹا بیس میں موجود نہیں ہے!' : 'No position holders found in live database yet!'}
                          </h4>
                          <p className="text-xs text-muted-foreground max-w-md text-center font-bold">
                            {locale === 'ur' ? 'براہ کرم مارکس انٹری ڈیسک پر جا کر طلباء کے نمبرات درج کریں تاکہ پوزیشن ہولڈرز یہاں شو ہوں۔' : 'Please go to Marks Entry desk to enter marks for enrolled students.'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    posList.map((pos) => (
                      <TableRow key={pos.id} className="hover:bg-amber-500/10 transition-colors">
                        <TableCell className="text-center font-extrabold py-4">
                          <Badge className={`px-3 py-1 text-xs font-extrabold shadow-md uppercase ${
                            pos.id.includes('0') || pos.id.includes('1') || pos.id === 'pos1' || pos.id === 'pos2' || pos.id === 'pos3' 
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-yellow-300' 
                              : 'bg-amber-700/80 text-amber-100 border-amber-800'
                          }`}>
                            {locale === 'ur' ? pos.rankUrdu : pos.rank}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-en">
                              {pos.regId}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                            <span>{locale === 'ur' ? pos.nameUrdu : pos.name}</span>
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 inline animate-spin" />
                          </h4>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-teal-700 dark:text-teal-400">
                          {locale === 'ur' ? pos.classNameUrdu : pos.classNameEn}
                        </TableCell>
                        <TableCell className="text-center font-mono font-en text-base font-extrabold text-primary">
                          {pos.percentage}%
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          <Badge className="bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30 text-xs font-extrabold">
                            {pos.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1 mt-3">
                          <Award className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{pos.award}</span>
                        </TableCell>
                        <TableCell className="text-end">
                          <Button 
                            onClick={() => handleOpenPositionCard(pos)} 
                            variant="emerald" 
                            size="sm" 
                            className="font-bold text-xs gap-1.5 shadow-md"
                          >
                            <Printer className="w-3.5 h-3.5 shrink-0" />
                            <span>{locale === 'ur' ? 'سرکاری رزلٹ کارڈ' : 'Official Card'}</span>
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
                {locale === 'ur' ? 'ہدایت: لوحِ شرف پر سرفراز طلباء کو سالانہ تقسیمِ انعام کی تقریب میں خصوصی طلائی تمغوں اور دستار بندی سے نوازا جائے گا۔' : 'Note: Position holders are honored at the annual convocation & prize distribution ceremony.'}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* TAB 2: MARKS ENTRY DESK */}
        <TabsContent value="entry" className="pt-4 animate-in fade-in-50 duration-200">
          <MarksEntryDesk />
        </TabsContent>

        {/* TAB 3: DYNAMIC EXAM SYSTEM CONFIGURATOR */}
        <TabsContent value="config" className="pt-4 animate-in fade-in-50 duration-200">
          <ExamSystemConfigDesk />
        </TabsContent>

        {/* TAB 4: MASTER EXAM REPORTS ARCHIVE */}
        <TabsContent value="archive" className="pt-4 animate-in fade-in-50 duration-200">
          <ExamReportsArchiveDesk />
        </TabsContent>
      </Tabs>

      {/* Printable Result Card Modal */}
      <ResultCardModal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        resultData={activeResultCard}
      />
    </div>
  );
}
