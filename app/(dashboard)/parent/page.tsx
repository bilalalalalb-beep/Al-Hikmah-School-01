"use client";

import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Wallet, 
  Award, 
  Search, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Printer, 
  FileText, 
  ChevronRight,
  ChevronLeft,
  User,
  HeartHandshake,
  TrendingUp,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';
import { ReceiptModal, FeeReceiptData } from '@/components/finance/receipt-modal';
import { ResultCardModal, ResultCardData } from '@/components/exams/result-card-modal';

interface ChildProfile {
  id: string;
  regId: string;
  nameUrdu: string;
  nameEn: string;
  classNameUrdu: string;
  classNameEn: string;
  section: string;
  rollNo: string;
  departmentUrdu: string;
  departmentEn: string;
  photoUrl: string;
  attendanceRate: number;
  feeStatus: 'paid' | 'pending';
  pendingAmount: number;
  latestGrade: string;
  position: string;
  teacherRemarks: string;
}

export default function ParentPortalPage() {
  const { locale, dir } = useLanguage();

  // 3 Sample children belonging to the parent (Haji Muhammad Amin)
  const childrenList: ChildProfile[] = [
    {
      id: 'child-1',
      regId: 'REG-2026-001',
      nameUrdu: 'طلحہ احمد',
      nameEn: 'Talha Ahmed',
      classNameUrdu: 'درجہ ہشتم (Class 8)',
      classNameEn: 'Class 8th',
      section: 'الف (A)',
      rollNo: '102',
      departmentUrdu: 'عصری سکول سسٹم',
      departmentEn: 'Modern School System',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      attendanceRate: 96.5,
      feeStatus: 'paid',
      pendingAmount: 0,
      latestGrade: 'ممتاز (A+ - 92.4%)',
      position: 'دوسری پوزیشن (2nd Position)',
      teacherRemarks: 'ماشاء اللہ! طلحہ کا تعلیمی اور اخلاقی ریکارڈ اس ماہ انتہائی شاندار رہا ہے۔ عصری مضامین میں خصوصی محنت کی ہے۔'
    },
    {
      id: 'child-2',
      regId: 'REG-2026-042',
      nameUrdu: 'حافظ عبداللہ احمد',
      nameEn: 'Hafiz Abdullah Ahmed',
      classNameUrdu: 'شعبہ حفظ القرآن',
      classNameEn: 'Hifz-ul-Quran',
      section: 'حفظ (ب)',
      rollNo: '205',
      departmentUrdu: 'تحفيظ القرآن الكريم',
      departmentEn: 'Quran Memorization Dept',
      photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
      attendanceRate: 98.2,
      feeStatus: 'paid',
      pendingAmount: 0,
      latestGrade: 'ممتاز جداً (Exceptional)',
      position: 'پہلی پوزیشن (1st Position)',
      teacherRemarks: 'الحمد للہ! عبداللہ نے اس ماہ 2 نئے سپارے حفظ کیے اور منزل بھی پختہ ہے۔ قاری صاحب انتہائی مطمئن ہیں۔'
    },
    {
      id: 'child-3',
      regId: 'REG-2026-108',
      nameUrdu: 'محمد زبیر احمد',
      nameEn: 'Muhammad Zubair Ahmed',
      classNameUrdu: 'عالمیت (سال اول)',
      classNameEn: 'Alimiyah (1st Year)',
      section: 'درس نظامی',
      rollNo: '301',
      departmentUrdu: 'شعبہ درس نظامی',
      departmentEn: 'Dars-e-Nizami Dept',
      photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
      attendanceRate: 94.0,
      feeStatus: 'pending',
      pendingAmount: 3500,
      latestGrade: 'جید جداً (Very Good - 85%)',
      position: 'چوتھی پوزیشن (4th Position)',
      teacherRemarks: 'صرف و نحو اور فقہ کے پرچوں میں کارکردگی اچھی ہے، تاہم عربی ادب پر مزید توجہ کی ضرورت ہے۔'
    }
  ];

  const [selectedChild, setSelectedChild] = useState<ChildProfile>(childrenList[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'finance' | 'exams'>('overview');

  // Modal states
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<FeeReceiptData | null>(null);

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultData, setResultData] = useState<ResultCardData | null>(null);

  const handleOpenReceipt = () => {
    setReceiptData({
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNo: `INV-2026-${selectedChild.regId.split('-')[2]}`,
      studentNameUrdu: selectedChild.nameUrdu,
      studentNameEn: selectedChild.nameEn,
      regId: selectedChild.regId,
      classNameUrdu: selectedChild.classNameUrdu,
      classNameEn: selectedChild.classNameEn,
      billingMonth: locale === 'ur' ? 'جولائی 2026' : 'July 2026',
      totalAmount: 4500,
      paidAmount: 4500,
      discountAmount: 0,
      paymentMethod: locale === 'ur' ? 'آن لائن بینک ٹرانسفر (Bank Transfer)' : 'Online Bank Transfer',
      paymentDate: '10-07-2026',
      collectorName: locale === 'ur' ? 'حافظ زبیر صاحب (اکاؤنٹس)' : 'Hafiz Zubair (Accounts)'
    });
    setIsReceiptOpen(true);
  };

  const handleOpenResult = () => {
    setResultData({
      examTitleUrdu: 'ششماہی امتحان (Mid-Term Examination) 2026',
      examTitleEn: 'Mid-Term Examination 2026',
      studentNameUrdu: selectedChild.nameUrdu,
      studentNameEn: selectedChild.nameEn,
      regId: selectedChild.regId,
      fatherNameUrdu: 'حاجی محمد امین صاحب',
      fatherNameEn: 'Haji Muhammad Amin',
      classNameUrdu: selectedChild.classNameUrdu,
      classNameEn: selectedChild.classNameEn,
      rollNo: selectedChild.rollNo,
      subjects: [
        { subjectUrdu: 'ترجمہ قرآن و تجوید', subjectEn: 'Translation & Tajweed', totalMarks: 100, obtainedMarks: 96, grade: 'ممتاز', remarks: 'بہترین اداکاری' },
        { subjectUrdu: 'عربی زبان و قواعد', subjectEn: 'Arabic Grammar', totalMarks: 100, obtainedMarks: 92, grade: 'ممتاز', remarks: 'شاندار محنت' },
        { subjectUrdu: 'سیرت النبی ﷺ و اسلامیات', subjectEn: 'Seerah & Islamic Studies', totalMarks: 100, obtainedMarks: 94, grade: 'ممتاز', remarks: 'قابلِ ستائش' },
        { subjectUrdu: 'ریاضی و سائنس', subjectEn: 'Mathematics & Science', totalMarks: 100, obtainedMarks: 88, grade: 'جید جداً', remarks: 'مزید بہتری ممکن' },
        { subjectUrdu: 'اردو و انگریزی ادب', subjectEn: 'Urdu & English Literature', totalMarks: 100, obtainedMarks: 92, grade: 'ممتاز', remarks: 'خوش خطی بہترین' }
      ],
      totalMarks: 500,
      obtainedMarks: 462,
      percentage: 92.4,
      overallGrade: 'ممتاز (Outstanding)',
      position: selectedChild.position,
      issueDate: '25-07-2026'
    });
    setIsResultOpen(true);
  };

  const handleWhatsAppAlert = () => {
    const text = locale === 'ur'
      ? `السلام علیکم ورحمۃ اللہ! مدرسہ الحکمہ کا دفتر۔ محترم حاجی محمد امین صاحب، آپ کے فرزند (${selectedChild.nameUrdu} - ${selectedChild.regId}) کے حوالے سے رابطہ کیا جا رہا ہے۔`
      : `Assalam-o-Alaikum! Al-Hikmah Madrasa Office. Dear Haji Muhammad Amin, reaching out regarding your ward (${selectedChild.nameEn} - ${selectedChild.regId}).`;
    
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(text)}`, '_blank');
    toast.success(locale === 'ur' ? '📲 واٹس ایپ رابطہ ڈیسک کھولا جا رہا ہے...' : '📲 Opening WhatsApp contact desk...');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner & Child Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/90 via-slate-900 to-teal-900/90 p-6 rounded-2xl border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold text-[11px]">
                {locale === 'ur' ? 'والدین و سرپرست پورٹل' : 'Parent & Guardian Desk'}
              </Badge>
              <span className="text-xs text-emerald-300 font-medium font-en">ID: PR-9821</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {locale === 'ur' ? 'خوش آمدید، حاجی محمد امین صاحب!' : 'Welcome, Haji Muhammad Amin!'}
            </h1>
            <p className="text-xs text-slate-300/90 mt-0.5">
              {locale === 'ur' ? 'اپنے بچوں کی روزانہ حاضری، فیس اور تعلیمی کارکردگی کا لائیو جائزہ لیں' : 'Live real-time monitoring of your children attendance, fee ledger, and exam results'}
            </p>
          </div>
        </div>

        {/* Child Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-white/10 z-10 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 px-2 shrink-0">
            {locale === 'ur' ? 'فرزند منتخب کریں:' : 'Select Child:'}
          </span>
          {childrenList.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setSelectedChild(child);
                toast.info(locale === 'ur' ? `👤 فرزند تبدیل: ${child.nameUrdu}` : `👤 Switched to: ${child.nameEn}`);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedChild.id === child.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{locale === 'ur' ? child.nameUrdu : child.nameEn}</span>
              <span className="text-[10px] opacity-75 font-en">({child.regId.split('-')[2]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Child Hero Profile Card */}
      <Card className="border-border/80 bg-card shadow-lg relative overflow-hidden">
        <div className="absolute top-0 start-0 w-2 h-full bg-gradient-to-b from-amber-500 to-emerald-500" />
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left/Start: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-5">
              <div className="relative group shrink-0">
                <img 
                  src={selectedChild.photoUrl} 
                  alt={selectedChild.nameEn} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md group-hover:scale-105 transition-transform" 
                />
                <span className="absolute -bottom-2 -end-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow-sm font-en">
                  {selectedChild.regId}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {locale === 'ur' ? selectedChild.nameUrdu : selectedChild.nameEn}
                  </h2>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 me-1 inline" />
                    {locale === 'ur' ? 'فعال طالب علم (Active)' : 'Active Student'}
                  </Badge>
                </div>

                <p className="text-sm font-bold text-muted-foreground">
                  {locale === 'ur' ? `شعبہ / درجہ: ${selectedChild.classNameUrdu} (${selectedChild.departmentUrdu})` : `Class: ${selectedChild.classNameEn} (${selectedChild.departmentEn})`}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium pt-1">
                  <span>📜 {locale === 'ur' ? `سیکشن: ${selectedChild.section}` : `Section: ${selectedChild.section}`}</span>
                  <span>🏷️ {locale === 'ur' ? `رول نمبر: ${selectedChild.rollNo}` : `Roll No: ${selectedChild.rollNo}`}</span>
                  <span>👨‍👦 {locale === 'ur' ? 'والد: حاجی محمد امین' : 'Father: Haji Muhammad Amin'}</span>
                </div>
              </div>
            </div>

            {/* Right/End: Quick Contact Actions */}
            <div className="flex flex-row lg:flex-col w-full lg:w-auto items-center justify-center gap-2.5 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
              <Button 
                onClick={handleWhatsAppAlert}
                variant="outline" 
                className="flex-1 lg:w-48 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold text-xs gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{locale === 'ur' ? 'مدرسہ واٹس ایپ رابطہ' : 'Madrasa WhatsApp'}</span>
              </Button>

              <Button 
                onClick={() => {
                  toast.success(locale === 'ur' ? '📞 مدرسہ دفتر فون ملایا جا رہا ہے: 0300-1234567' : '📞 Calling Madrasa Office: 0300-1234567');
                }}
                variant="outline" 
                className="flex-1 lg:w-48 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold text-xs gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{locale === 'ur' ? 'دفتر فون کال کریں' : 'Call Office Desk'}</span>
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* 3 KPI Summary Cards for Selected Child */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attendance Rate */}
        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">
                {locale === 'ur' ? 'ماہانہ حاضری کا تناسب' : 'Monthly Attendance Rate'}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-en">
                {selectedChild.attendanceRate}%
              </p>
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'ur' ? 'اس ماہ 24 حاضر، 1 رخصت' : '24 Present, 1 Leave this month'}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Fee Ledger Status */}
        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">
                {locale === 'ur' ? 'فیس اور بقایاجات' : 'Fee Ledger Status'}
              </p>
              {selectedChild.feeStatus === 'paid' ? (
                <>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {locale === 'ur' ? 'تمام واجبات ادا' : 'Fully Paid'}
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {locale === 'ur' ? 'کوئی بقایاجات نہیں (0 روپے)' : 'No pending dues (Rs. 0)'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-en">
                    Rs. {selectedChild.pendingAmount.toLocaleString()}
                  </p>
                  <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? 'جولائی انوائس واجب الادا ہے' : 'July invoice pending'}</span>
                  </p>
                </>
              )}
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              selectedChild.feeStatus === 'paid' 
                ? 'bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400'
            }`}>
              <Wallet className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Exam Position */}
        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">
                {locale === 'ur' ? 'امتحانی کارکردگی' : 'Exam Performance'}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground">
                {selectedChild.position}
              </p>
              <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedChild.latestGrade}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs for Details */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{locale === 'ur' ? 'عمومی جائزہ اور ڈائری' : 'Overview & Teacher Feed'}</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{locale === 'ur' ? 'حاضری تفصیل (Attendance)' : 'Attendance Ledger'}</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'finance'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{locale === 'ur' ? 'فیس رسیدیں (Fee Receipts)' : 'Fee & Receipts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'exams'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{locale === 'ur' ? 'کشف الدرجات (Result Card)' : 'Exam Results Card'}</span>
        </button>
      </div>

      {/* Tab Content 1: Overview & Teacher Feed */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{locale === 'ur' ? 'استاد صاحب کی تازہ ترین ڈائری اور تاثرات' : 'Class Teacher Feed & Remarks'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm leading-relaxed font-medium">
                <p>"{selectedChild.teacherRemarks}"</p>
                <div className="flex items-center justify-between mt-3 text-xs opacity-80 pt-2 border-t border-amber-500/20">
                  <span>✍️ {locale === 'ur' ? 'کلاس انچارج استاد' : 'Class Incharge Ustad'}</span>
                  <span>📅 {locale === 'ur' ? 'آخری اپڈیٹ: 26 جولائی 2026' : 'Updated: 26 July 2026'}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase">
                  {locale === 'ur' ? 'آنے والے امتحانات و تقریبات' : 'Upcoming School Events'}
                </h4>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60 text-xs font-medium">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{locale === 'ur' ? 'سالانہ امتحانات کا آغاز (شعبہ حفظ و درس نظامی)' : 'Annual Examination Commencement'}</span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-en">15 Aug 2026</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-500" />
                <span>{locale === 'ur' ? 'اس ہفتے کی حاضری کا خلاصہ' : 'Weekly Attendance Summary'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="grid grid-cols-6 gap-2 text-center">
                {[
                  { dayUr: 'پیر', dayEn: 'Mon', status: 'present', date: '21 جولائی' },
                  { dayUr: 'منگل', dayEn: 'Tue', status: 'present', date: '22 جولائی' },
                  { dayUr: 'بدھ', dayEn: 'Wed', status: 'present', date: '23 جولائی' },
                  { dayUr: 'جمعرات', dayEn: 'Thu', status: 'present', date: '24 جولائی' },
                  { dayUr: 'جمعہ', dayEn: 'Fri', status: 'leave', date: '25 جولائی' },
                  { dayUr: 'ہفتہ', dayEn: 'Sat', status: 'present', date: '26 جولائی' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg border border-border/60 bg-muted/30 flex flex-col items-center gap-1">
                    <span className="text-[11px] font-bold text-foreground">{locale === 'ur' ? item.dayUr : item.dayEn}</span>
                    <span className="text-[9px] text-muted-foreground">{item.date}</span>
                    {item.status === 'present' ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]" title="حاضر">
                        {locale === 'ur' ? 'ح' : 'P'}
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px]" title="رخصت">
                        {locale === 'ur' ? 'ر' : 'L'}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                <span>🌟 {locale === 'ur' ? 'حاضری کی شرح بہترین ہے!' : 'Excellent Attendance Track!'}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setActiveTab('attendance')}
                  className="h-7 text-[11px] bg-background border-emerald-500/30 hover:bg-emerald-500/20"
                >
                  {locale === 'ur' ? 'مکمل رجسٹر دیکھیں' : 'View Full Ledger'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Content 2: Attendance Ledger */}
      {activeTab === 'attendance' && (
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
            <div>
              <CardTitle className="text-base font-bold">
                {locale === 'ur' ? `ماہانہ حاضری کا رجسٹر - ${selectedChild.nameUrdu}` : `Monthly Attendance Ledger - ${selectedChild.nameEn}`}
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'جولائی 2026 کا مکمل حاضری لاگ' : 'Full attendance log for July 2026'}
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success(locale === 'ur' ? '📥 حاضری رپورٹ پی ڈی ایف ڈاؤن لوڈ کی جا رہی ہے...' : '📥 Downloading attendance PDF report...');
              }}
              className="h-8 text-xs font-bold gap-2"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>{locale === 'ur' ? 'رپورٹ ڈاؤن لوڈ' : 'Download PDF'}</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'تاریخ / Date' : 'Date'}</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'دن / Day' : 'Day'}</th>
                    <th className="py-3 px-4 text-center">{locale === 'ur' ? 'حاضری کی حیثیت' : 'Attendance Status'}</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'وقت / Time' : 'Time'}</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'تصدیق کنندہ استاد' : 'Verified By'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { date: '26-07-2026', dayUr: 'ہفتہ', dayEn: 'Saturday', status: 'present', time: '07:45 AM', ustad: 'قاری محمد طارق' },
                    { date: '25-07-2026', dayUr: 'جمعہ', dayEn: 'Friday', status: 'leave', time: '-', ustad: 'قاری محمد طارق (رخصت منظور شدہ)' },
                    { date: '24-07-2026', dayUr: 'جمعرات', dayEn: 'Thursday', status: 'present', time: '07:50 AM', ustad: 'قاری محمد طارق' },
                    { date: '23-07-2026', dayUr: 'بدھ', dayEn: 'Wednesday', status: 'present', time: '07:40 AM', ustad: 'قاری محمد طارق' },
                    { date: '22-07-2026', dayUr: 'منگل', dayEn: 'Tuesday', status: 'present', time: '07:42 AM', ustad: 'قاری محمد طارق' },
                    { date: '21-07-2026', dayUr: 'پیر', dayEn: 'Monday', status: 'present', time: '07:48 AM', ustad: 'قاری محمد طارق' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-en font-medium">{row.date}</td>
                      <td className="py-3 px-4 font-bold">{locale === 'ur' ? row.dayUr : row.dayEn}</td>
                      <td className="py-3 px-4 text-center">
                        {row.status === 'present' ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 me-1 inline" />
                            {locale === 'ur' ? 'حاضر (Present)' : 'Present'}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">
                            <Clock className="w-3 h-3 me-1 inline" />
                            {locale === 'ur' ? 'رخصت (Leave)' : 'Leave'}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 font-en text-muted-foreground">{row.time}</td>
                      <td className="py-3 px-4 font-medium text-muted-foreground">{row.ustad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content 3: Fee & Receipts */}
      {activeTab === 'finance' && (
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
            <div>
              <CardTitle className="text-base font-bold">
                {locale === 'ur' ? `فیس انوائس اور رسیدات - ${selectedChild.nameUrdu}` : `Fee Invoices & Receipts - ${selectedChild.nameEn}`}
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'ادا شدہ انوائس پر کلک کر کے سرکاری رسید پرنٹ یا ڈاؤن لوڈ کریں' : 'Click on any paid invoice to view and print official Cloudinary receipt'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'انوائس نمبر' : 'Invoice No'}</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'ماہ / مد' : 'Billing Month / Type'}</th>
                    <th className="py-3 px-4 text-start font-en">{locale === 'ur' ? 'رقم' : 'Amount'}</th>
                    <th className="py-3 px-4 text-center">{locale === 'ur' ? 'ادائیگی صورتحال' : 'Status'}</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'تاریخ ادائیگی' : 'Payment Date'}</th>
                    <th className="py-3 px-4 text-end">{locale === 'ur' ? 'اقدام' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { invNo: 'INV-2026-891', monthUr: 'جولائی 2026 (ماہانہ فیس)', monthEn: 'July 2026 (Tuition Fee)', amount: 4500, status: selectedChild.feeStatus, date: selectedChild.feeStatus === 'paid' ? '10-07-2026' : '-' },
                    { invNo: 'INV-2026-712', monthUr: 'جون 2026 (ماہانہ فیس + ششماہی امتحان)', monthEn: 'June 2026 (Tuition + Exam Fee)', amount: 5500, status: 'paid', date: '08-06-2026' },
                    { invNo: 'INV-2026-540', monthUr: 'مئی 2026 (ماہانہ فیس)', monthEn: 'May 2026 (Tuition Fee)', amount: 4500, status: 'paid', date: '05-05-2026' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-4 font-en font-bold text-primary">{row.invNo}</td>
                      <td className="py-3 px-4 font-bold">{locale === 'ur' ? row.monthUr : row.monthEn}</td>
                      <td className="py-3 px-4 font-en font-extrabold">Rs. {row.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        {row.status === 'paid' ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold">
                            <CheckCircle2 className="w-3 h-3 me-1 inline" />
                            {locale === 'ur' ? 'ادا شدہ (Paid)' : 'Paid'}
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold">
                            <Clock className="w-3 h-3 me-1 inline" />
                            {locale === 'ur' ? 'واجب الادا (Unpaid)' : 'Pending'}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 font-en text-muted-foreground">{row.date}</td>
                      <td className="py-3 px-4 text-end">
                        {row.status === 'paid' ? (
                          <Button
                            size="sm"
                            variant="emerald"
                            onClick={handleOpenReceipt}
                            className="h-8 px-3 font-bold text-xs gap-1.5 shadow-sm"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{locale === 'ur' ? 'رسید دیکھیں' : 'View Receipt'}</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              toast.info(locale === 'ur' ? '💡 فیس کی آن لائن ادائیگی یا واٹس ایپ تصدیق کے لیے مدرسہ دفتر سے رابطہ کریں' : '💡 Contact Madrasa office for online bank transfer or EasyPaisa payment');
                            }}
                            className="h-8 px-3 font-bold text-xs gap-1.5 border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            <span>{locale === 'ur' ? 'ادائیگی کریں' : 'Pay Now'}</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content 4: Exam Results & Kashf-ul-Darajat */}
      {activeTab === 'exams' && (
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
            <div>
              <CardTitle className="text-base font-bold">
                {locale === 'ur' ? `امتحانی نتائج اور کشف الدرجات - ${selectedChild.nameUrdu}` : `Exam Results Card - ${selectedChild.nameEn}`}
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'سالانہ اور ششماہی امتحانات کا سرکاری رزلٹ کارڈ (Kashf-ul-Darajat) دیکھیں اور پرنٹ کریں' : 'View and download official Kashf-ul-Darajat for term examinations'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { titleUr: 'ششماہی امتحان (Mid-Term Exam) 2026', titleEn: 'Mid-Term Examination 2026', grade: selectedChild.latestGrade, pos: selectedChild.position, marks: '462 / 500', date: '25-07-2026', isLatest: true },
                { titleUr: 'سہ ماہی ٹیسٹ (First Term Test) 2026', titleEn: 'First Term Assessment 2026', grade: 'ممتاز (90%)', pos: 'پہلی پوزیشن', marks: '180 / 200', date: '15-05-2026', isLatest: false }
              ].map((exam, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border/80 bg-gradient-to-br from-card to-muted/20 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{locale === 'ur' ? exam.titleUr : exam.titleEn}</span>
                        {exam.isLatest && (
                          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px]">
                            {locale === 'ur' ? 'تازہ ترین' : 'Latest'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {locale === 'ur' ? `تاریخِ اعلان: ${exam.date}` : `Declared: ${exam.date}`}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/50 border border-border/40 text-xs font-bold">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'حاصل کردہ نمبرات' : 'Marks Obtained'}</span>
                      <span className="font-en text-primary font-extrabold text-sm">{exam.marks}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'درجہ / پوزیشن' : 'Grade / Rank'}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-extrabold">{exam.pos}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleOpenResult}
                    variant="emerald"
                    className="w-full h-9 font-bold text-xs gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{locale === 'ur' ? 'کشف الدرجات (Result Card) کھولیں' : 'Open Official Result Card'}</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Embedded Reusable Modals */}
      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={receiptData}
      />

      <ResultCardModal 
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        resultData={resultData}
      />
    </div>
  );
}
