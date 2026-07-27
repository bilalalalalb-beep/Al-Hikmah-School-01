"use client";

import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  FileText, 
  Download, 
  Trophy, 
  Star, 
  CheckCircle2, 
  Printer, 
  Share2, 
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';
import { ResultCardModal, ResultCardData } from '@/components/exams/result-card-modal';

export default function ParentExamsPage() {
  const { locale } = useLanguage();
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultData, setResultData] = useState<ResultCardData | null>(null);

  const handleOpenResult = (examTitleUr: string, examTitleEn: string, grade: string, pos: string, total: number, obtained: number, percentage: number) => {
    setResultData({
      examTitleUrdu: examTitleUr,
      examTitleEn: examTitleEn,
      studentNameUrdu: 'طلحہ احمد',
      studentNameEn: 'Talha Ahmed',
      regId: 'REG-2026-001',
      fatherNameUrdu: 'حاجی محمد امین صاحب',
      fatherNameEn: 'Haji Muhammad Amin',
      classNameUrdu: 'درجہ ہشتم (عصری سکول)',
      classNameEn: 'Class 8th (Modern School)',
      rollNo: '102',
      subjects: [
        { subjectUrdu: 'ترجمہ قرآن و تجوید', subjectEn: 'Translation & Tajweed', totalMarks: 100, obtainedMarks: Math.round((obtained/total)*102), grade: 'ممتاز', remarks: 'بہترین اداکاری' },
        { subjectUrdu: 'عربی زبان و قواعد', subjectEn: 'Arabic Grammar', totalMarks: 100, obtainedMarks: Math.round((obtained/total)*98), grade: 'ممتاز', remarks: 'شاندار محنت' },
        { subjectUrdu: 'سیرت النبی ﷺ و اسلامیات', subjectEn: 'Seerah & Islamic Studies', totalMarks: 100, obtainedMarks: Math.round((obtained/total)*100), grade: 'ممتاز', remarks: 'قابلِ ستائش' },
        { subjectUrdu: 'ریاضی و سائنس', subjectEn: 'Mathematics & Science', totalMarks: 100, obtainedMarks: Math.round((obtained/total)*96), grade: 'جید جداً', remarks: 'اچھی کارکردگی' },
        { subjectUrdu: 'اردو و انگریزی ادب', subjectEn: 'Urdu & English Literature', totalMarks: 100, obtainedMarks: Math.round((obtained/total)*104 > 100 ? 98 : Math.round((obtained/total)*104)), grade: 'ممتاز', remarks: 'خوش خطی بہترین' }
      ],
      totalMarks: total,
      obtainedMarks: obtained,
      percentage: percentage,
      overallGrade: grade,
      position: pos,
      issueDate: '25-07-2026'
    });
    setIsResultOpen(true);
  };

  const examsList = [
    { titleUr: 'ششماہی امتحان (Mid-Term Examination) 2026', titleEn: 'Mid-Term Examination 2026', grade: 'ممتاز (Outstanding)', pos: 'دوسری پوزیشن (2nd)', total: 500, obtained: 462, percentage: 92.4, date: '25-07-2026', isLatest: true },
    { titleUr: 'سہ ماہی امتحان (First Term Assessment) 2026', titleEn: 'First Term Assessment 2026', grade: 'ممتاز (Outstanding)', pos: 'پہلی پوزیشن (1st)', total: 200, obtained: 184, percentage: 92.0, date: '15-05-2026', isLatest: false },
    { titleUr: 'سالانہ امتحان (Annual Examination) 2025', titleEn: 'Annual Examination 2025', grade: 'ممتاز (Outstanding)', pos: 'پہلی پوزیشن (1st)', total: 600, obtained: 558, percentage: 93.0, date: '10-03-2026', isLatest: false },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border/80 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {locale === 'ur' ? 'امتحانی نتائج، کارکردگی اور سرکاری کشف الدرجات' : 'Exam Results, Academic Ranking & Official Kashf-ul-Darajat'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {locale === 'ur' ? 'طالب علم: طلحہ احمد (درجہ ہشتم - REG-2026-001) | سرپرست: حاجی محمد امین' : 'Student: Talha Ahmed (Class 8th - REG-2026-001) | Guardian: Haji Muhammad Amin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => {
              toast.success(locale === 'ur' ? '📥 کل امتحانی ریکارڈ پی ڈی ایف ڈاؤن لوڈ ہو رہا ہے...' : '📥 Downloading cumulative academic transcript...');
            }}
            variant="outline"
            className="h-9 px-4 font-bold text-xs gap-2"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>{locale === 'ur' ? 'تعلیمی ٹرانسکرپٹ' : 'Academic Transcript'}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'تازہ ترین نتیجہ و پوزیشن' : 'Latest Result & Rank'}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">{locale === 'ur' ? 'دوسری پوزیشن' : '2nd Position'}</p>
              <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{locale === 'ur' ? 'ششماہی امتحان 2026' : 'Mid-Term Exam 2026'}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'اوسط نمبرات (Average Score)' : 'Average Academic Score'}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-en mt-1">92.5%</p>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'ur' ? 'مجموعی درجہ: ممتاز (Outstanding)' : 'Overall Grade: Outstanding'}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'کلاس انچارج کا تبصرہ' : 'Class Teacher Remarks'}</p>
              <p className="text-sm font-bold text-foreground mt-1">{locale === 'ur' ? 'انتہائی لائق اور محنتی طالب علم' : 'Diligent & Brilliant Scholar'}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{locale === 'ur' ? 'اخلاق و کردار: قابلِ تقلید' : 'Conduct & Akhlaq: Exemplary'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Exams Grid */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
          <div>
            <CardTitle className="text-base font-bold">
              {locale === 'ur' ? 'منعقدہ امتحانات کی فہرست اور سرکاری رزلٹ کارڈز (Kashf-ul-Darajat)' : 'Conducted Examinations & Official Result Cards Archive'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'ur' ? 'کسی بھی امتحان پر کلک کر کے مدرسہ کی مہر اور کیو آر کوڈ والا سرکاری رزلٹ کارڈ دیکھیں اور پرنٹ کریں' : 'Click on any term exam to view and print official verified result card with school stamp & QR code'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {examsList.map((exam, idx) => (
              <div key={idx} className="p-5 rounded-2xl border-2 border-border/80 bg-gradient-to-br from-card to-muted/20 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-foreground">{locale === 'ur' ? exam.titleUr : exam.titleEn}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {locale === 'ur' ? `تاریخِ اعلان: ${exam.date}` : `Declared: ${exam.date}`}
                    </p>
                  </div>
                  {exam.isLatest && (
                    <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px] font-bold shrink-0">
                      {locale === 'ur' ? 'تازہ ترین' : 'Latest'}
                    </Badge>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">{locale === 'ur' ? 'حاصل کردہ نمبرات:' : 'Marks Obtained:'}</span>
                    <span className="font-en font-extrabold text-foreground text-sm">{exam.obtained} / {exam.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">{locale === 'ur' ? 'تناسب (Percentage):' : 'Percentage:'}</span>
                    <span className="font-en font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{exam.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-purple-500/15">
                    <span className="text-muted-foreground font-medium">{locale === 'ur' ? 'درجہ / پوزیشن:' : 'Grade / Rank:'}</span>
                    <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">{exam.pos}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    onClick={() => handleOpenResult(exam.titleUr, exam.titleEn, exam.grade, exam.pos, exam.total, exam.obtained, exam.percentage)}
                    variant="emerald"
                    className="flex-1 h-10 font-bold text-xs gap-2 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{locale === 'ur' ? '📜 کشف الدرجات کھولیں' : 'Open Result Card'}</span>
                  </Button>

                  <Button
                    onClick={() => {
                      window.open('https://wa.me/?text=' + encodeURIComponent(locale === 'ur' ? `الحمد للہ! طلحہ احمد نے ششماہی امتحان 2026 میں ${exam.obtained}/${exam.total} نمبر لے کر ${exam.pos} حاصل کی ہے!` : `Alhamdulillah! Talha Ahmed secured ${exam.pos} in ${exam.titleEn} with ${exam.percentage}% marks!`), '_blank');
                    }}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                    title={locale === 'ur' ? 'واٹس ایپ پر شیئر کریں' : 'Share on WhatsApp'}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Embedded Reusable Modal */}
      <ResultCardModal 
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        resultData={resultData}
      />
    </div>
  );
}
