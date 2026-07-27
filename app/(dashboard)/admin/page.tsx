"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  UserPlus, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Settings,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

const feeCollectionData = [
  { month: 'محرم', collected: 320000, target: 350000 },
  { month: 'صفر', collected: 340000, target: 350000 },
  { month: 'ربیع الاول', collected: 380000, target: 360000 },
  { month: 'ربیع الثانی', collected: 410000, target: 380000 },
  { month: 'جمادی الاول', collected: 390000, target: 380000 },
  { month: 'جمادی الثانی', collected: 450000, target: 400000 },
  { month: 'رجب', collected: 485000, target: 420000 },
];

const attendanceTrendData = [
  { day: 'پیر', present: 96, absent: 4 },
  { day: 'منگل', present: 95, absent: 5 },
  { day: 'بدھ', present: 97, absent: 3 },
  { day: 'جمعرات', present: 94, absent: 6 },
  { day: 'جمعہ', present: 98, absent: 2 },
  { day: 'ہفتہ', present: 93, absent: 7 },
];

export default function AdminDashboardPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 font-ur">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary to-teal-700 text-white shadow-xl shadow-primary/10">
        <div>
          <Badge className="bg-white/20 text-white hover:bg-white/20 border-white/30 mb-2 font-bold gap-1.5">
            <Sparkles className="w-3.5 h-3.5 inline" /> {locale === 'ur' ? 'منتظم اعلیٰ (پرنسپل) ڈیش بورڈ' : 'Executive Dashboard'}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {locale === 'ur' ? 'جامعہ الحکمہ مدرسہ و سکول عمومی جائزہ' : 'Al-Hikmah Madrasa & School Overview'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {locale === 'ur' 
              ? 'تعلیمی سال 2026-2027 کے لیے طلباء کی حاضری، ماہانہ فیس وصولی، اساتذہ کی کارکردگی اور نئے داخلوں کی براہِ راست تفصیلات۔' 
              : 'Real-time insights on academic attendance, fee collection, staff performance, and student enrollment for 2026-2027.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 font-extrabold shadow-lg">
              <Globe className="w-4 h-4 me-2 shrink-0" /> {locale === 'ur' ? '🌐 پبلک ویب سائٹ دیکھیں' : '🌐 View Public Website'}
            </Button>
          </Link>
          <Link href="/clerk/admissions">
            <Button variant="secondary" size="sm" className="font-bold shadow-md">
              <UserPlus className="w-4 h-4 me-2 shrink-0" /> {locale === 'ur' ? 'نیا داخلہ کریں' : 'New Admission'}
            </Button>
          </Link>
          <Link href="/admin/finance">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold">
              <FileText className="w-4 h-4 me-2 shrink-0" /> {locale === 'ur' ? 'بقایاجات رپورٹ' : 'Defaulters'}
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Key Stat Cards covering Students, Classes, Attendance, Finance & HR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border/60 hover:border-primary/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.totalStudents}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">482</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5 inline shrink-0" /> {locale === 'ur' ? '+18 نئے طلباء اس ماہ' : '+18 enrolled this month'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-primary/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.activeClasses}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">21</div>
            <p className="text-xs text-muted-foreground mt-1 font-bold">
              {locale === 'ur' ? '5 مستند شعبہ جات • 21 درجات' : '5 Authentic Depts • 21 Classes'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-primary/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.todayAttendance}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-en">96.4%</div>
            <p className="text-xs text-muted-foreground mt-1 font-bold">
              {locale === 'ur' ? '465 حاضر • ' : '465 Present • '}
              <span className="text-destructive font-bold">{locale === 'ur' ? '17 غیر حاضر' : '17 Absent'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-primary/50 transition-all shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {t.monthlyCollection}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono font-en">Rs. 485,000</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 inline shrink-0" /> {locale === 'ur' ? '92% ہدف حاصل ہوا' : '92% target achieved'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 hover:border-primary/50 transition-all shadow-sm bg-gradient-to-br from-amber-500/5 via-card to-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {locale === 'ur' ? 'اساتذہ و ملازمین' : 'Staff & HR Desk'}
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono font-en">34</div>
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 inline shrink-0" /> {locale === 'ur' ? '100% پے رول فعال' : '100% Payroll active'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Quick Stats Row */}
      <Card className="border-border/60 shadow-sm bg-gradient-to-r from-card via-muted/30 to-card">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-background/80 border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'امتحانات ⬅️ کشف الدرجات' : 'Exams ⬅️ Results Card Sync'}</span>
              <span className="text-foreground font-extrabold text-sm flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Auto Kashf-ul-Darajat</span>
              </span>
            </div>
            <Badge variant="success" className="text-[10px] font-en uppercase font-extrabold">Active</Badge>
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'واٹس ایپ و ای میل الرٹس' : 'WhatsApp & Email Desk'}</span>
              <span className="text-foreground font-extrabold text-sm flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Multi-Channel Ready</span>
              </span>
            </div>
            <Badge variant="success" className="text-[10px] font-en uppercase font-extrabold">Active</Badge>
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'ٹائپوگرافی و فانٹ سسٹم' : 'RTL & Typography'}</span>
              <span className="text-foreground font-extrabold text-sm flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>Nastaleeq + Outfit</span>
              </span>
            </div>
            <Badge variant="success" className="text-[10px] font-en uppercase font-extrabold">Flawless</Badge>
          </div>

          <div className="p-3 rounded-xl bg-background/80 border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[10px]">{locale === 'ur' ? 'مالیات ⬅️ پے رول انٹیگریشن' : 'Finance ⬅️ HR Sync'}</span>
              <span className="text-foreground font-extrabold text-sm flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>Automated Ledger</span>
              </span>
            </div>
            <Badge variant="success" className="text-[10px] font-en uppercase font-extrabold">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>{locale === 'ur' ? 'ماہانہ فیس وصولی اور ہدف کا تقابل (2026)' : 'Fee Collection vs Target Trend (2026)'}</span>
              <Badge variant="outline" className="text-xs font-normal">PKR / روپیہ</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'ur' ? 'مقررہ ہدف کے مقابلے میں کلرک کی جانب سے جمع کی گئی حقیقی ٹیوشن فیس کا جائزہ۔' : 'Comparison of target projected revenue versus actual fee receipts collected by Accountant.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeCollectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`Rs. ${value.toLocaleString()}`, locale === 'ur' ? 'رقم' : 'Amount']}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font-nastaliq)' }} />
                <Area type="monotone" name={locale === 'ur' ? 'مقررہ ہدف (Target)' : 'Target Revenue'} dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" fill="transparent" />
                <Area type="monotone" name={locale === 'ur' ? 'حقیقی وصولی (Collected)' : 'Actual Collected'} dataKey="collected" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCollected)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Attendance Bar Chart */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">{locale === 'ur' ? 'ہفتہ وار حاضری کا رجحان' : 'Weekly Attendance Trend'}</CardTitle>
            <CardDescription className="text-xs">
              {locale === 'ur' ? 'تمام درجات میں حاضر اور غیر حاضر طلباء کا فیصدی تناسب۔' : 'Percentage of students present vs absent across all sections.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} domain={[80, 100]} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, locale === 'ur' ? 'تناسب' : 'Percentage']}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font-nastaliq)' }} />
                <Bar name={locale === 'ur' ? 'حاضر %' : 'Present %'} dataKey="present" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar name={locale === 'ur' ? 'غیر حاضر %' : 'Absent %'} dataKey="absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: 10-Module Executive Command Hub & Recent System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-sm border-t-4 border-t-primary">
          <CardHeader className="bg-muted/30 border-b border-border/60 py-3.5">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{locale === 'ur' ? 'جامعہ کے تمام 10 ماڈیولز کا ماسٹر کنٹرول ہب' : '10-Module Master Executive Command Hub'}</span>
            </CardTitle>
            <CardDescription className="text-xs">{locale === 'ur' ? 'سسٹم کے کسی بھی شعبے یا پورٹل پر 1-کلک فوری رسائی' : 'Instant 1-click access across all 10 institutional modules'}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 space-y-1.5 max-h-[380px] overflow-y-auto">
            <Link href="/admin" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-primary hover:bg-primary/5">
                <LayoutDashboard className="w-3.5 h-3.5 me-2.5 text-primary shrink-0" /> {locale === 'ur' ? 'ماڈیول 1: عمومی جائزہ و تجزیاتی ڈیش بورڈ' : 'Mod 1: Executive Overview'}
              </Button>
            </Link>
            <Link href="/admin/classes" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-blue-500 hover:bg-blue-500/5">
                <Building2 className="w-3.5 h-3.5 me-2.5 text-blue-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 2: 5 شعبہ جات، درجات و سیکشنز' : 'Mod 2: 5 Depts & Classes'}
              </Button>
            </Link>
            <Link href="/clerk/admissions" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-teal-500 hover:bg-teal-500/5">
                <UserPlus className="w-3.5 h-3.5 me-2.5 text-teal-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 3: نیا داخلہ و طلباء پروفائل' : 'Mod 3: Admissions & Students'}
              </Button>
            </Link>
            <Link href="/admin/attendance" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-emerald-500 hover:bg-emerald-500/5">
                <CheckCircle2 className="w-3.5 h-3.5 me-2.5 text-emerald-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 4: حاضری کا ڈیجیٹل نظام' : 'Mod 4: Digital Attendance System'}
              </Button>
            </Link>
            <Link href="/clerk/finance" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-purple-500 hover:bg-purple-500/5">
                <Wallet className="w-3.5 h-3.5 me-2.5 text-purple-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 5: فیس وصولی، انوائس و مصارف' : 'Mod 5: Finance & Ledger'}
              </Button>
            </Link>
            <Link href="/admin/exams" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-amber-500 hover:bg-amber-500/5">
                <GraduationCap className="w-3.5 h-3.5 me-2.5 text-amber-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 6: امتحانات اور کشف الدرجات' : 'Mod 6: Exams & Results'}
              </Button>
            </Link>
            <Link href="/admin/hr" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-rose-500 hover:bg-rose-500/5">
                <Users className="w-3.5 h-3.5 me-2.5 text-rose-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 7: اساتذہ و ملازمین پے رول' : 'Mod 7: HR & Payroll Desk'}
              </Button>
            </Link>
            <Link href="/admin/communication" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-indigo-500 hover:bg-indigo-500/5">
                <MessageSquare className="w-3.5 h-3.5 me-2.5 text-indigo-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 8: واٹس ایپ و ای میل براڈکاسٹ' : 'Mod 8: WhatsApp & Email Alert System'}
              </Button>
            </Link>
            <Link href="/admin/settings" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-bold h-9 hover:border-amber-600 hover:bg-amber-600/5 border-amber-500/40">
                <Settings className="w-3.5 h-3.5 me-2.5 text-amber-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 9: پورٹل ترتیبات، لوگو اور برانڈنگ' : 'Mod 9: Settings, Logo & Branding'}
              </Button>
            </Link>
            <Link href="/" target="_blank" className="block">
              <Button variant="outline" className="w-full justify-start text-xs font-extrabold h-9 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40">
                <Globe className="w-3.5 h-3.5 me-2.5 text-emerald-600 shrink-0" /> {locale === 'ur' ? 'ماڈیول 10: پبلک ویب سائٹ اور آن لائن داخلہ' : 'Mod 10: Public Landing Website (Live)'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">{locale === 'ur' ? 'اینڈ ٹو اینڈ لائیو انٹیگریشن لاگ اور سرگرمیاں' : 'Live Multi-Module Integration Feed'}</CardTitle>
              <CardDescription className="text-xs">{locale === 'ur' ? 'تمام ماڈیولز کے مابین خودکار روابط کی لائیو تصدیق' : 'Real-time verified events across all role modules'}</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 font-bold">{locale === 'ur' ? 'مکمل انٹیگریٹڈ' : 'Fully Synced'}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold font-en shadow-sm">
                  ✓
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-foreground">{locale === 'ur' ? 'پے رول ⬅️ مصارف خودکار انٹیگریشن مکمل' : 'Payroll ⬅️ Expense Auto-Sync Verified'}</p>
                    <span className="text-muted-foreground text-[10px] font-mono font-en">2 mins ago</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed font-bold">
                    {locale === 'ur' ? 'مفتی عبدالحکیم صاحب کا مشاہرہ (Rs. 80,000) ادا کیا گیا اور ماڈیول 5 کے مصارف میں "salary" زمرے کے تحت خودکار درج ہو گیا۔' : 'Salary of Rs. 80,000 disbursed to Mufti Abdul Hakim and instantly synced to Module 5 Expenses ledger under "salary".'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold font-en shadow-sm">
                  ★
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-foreground">{locale === 'ur' ? 'امتحانات ⬅️ کشف الدرجات تصدیق مکمل' : 'Exam Grading ⬅️ Result Card Verified'}</p>
                    <span className="text-muted-foreground text-[10px] font-mono font-en">15 mins ago</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed font-bold">
                    {locale === 'ur' ? 'سالانہ امتحان (درجہ ہشتم) کے نتائج فیڈ کیے گئے، سسٹم نے از خود "ممتاز" گریڈ اور رول آف آنر جنریٹ کیا۔' : 'Annual exam marks finalized for Grade 8. System automatically calculated "Mumtaz" grade and generated Roll of Honor.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold font-en shadow-sm">
                  +
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-foreground">{locale === 'ur' ? 'داخلہ ⬅️ کلاؤڈینیری میڈیا اپ لوڈ تصدیق' : 'Admission ⬅️ Cloudinary Verification'}</p>
                    <span className="text-muted-foreground text-[10px] font-mono font-en">1 hour ago</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed font-bold">
                    {locale === 'ur' ? 'طالب علم طلحہ احمد کا داخلہ مکمل اور کلاؤڈینیری (Cloudinary) پر تصویر اور رجسٹریشن فارم کامیابی سے آرکائیو ہوا۔' : 'Student Talha Ahmed enrolled with Cloudinary photo verification and automatic fee invoice generation.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold font-en shadow-sm">
                  #
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-foreground">{locale === 'ur' ? 'حاضری ⬅️ اساتذہ پورٹل ہم آہنگی' : 'Attendance ⬅️ Teacher Portal Sync'}</p>
                    <span className="text-muted-foreground text-[10px] font-mono font-en">3 hours ago</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed font-bold">
                    {locale === 'ur' ? 'استاد احمد صاحب نے روزانہ حاضری رجسٹر مکمل کیا، ایڈمن پورٹل میں 96.4% حاضری کا تناسب لائیو اپ ڈیٹ ہو گیا۔' : 'Ustad Ahmed marked daily attendance. Admin dashboard live attendance KPI updated to 96.4% in real-time.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

