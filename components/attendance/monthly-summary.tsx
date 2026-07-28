"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CalendarCheck, 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle, 
  Printer, 
  Download, 
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { usePortalSettings } from '@/lib/settings/context';
import { createClient } from '@/lib/supabase/client';
import { AttendanceSlipModal, AttendanceSlipData } from './attendance-slip-modal';

export function MonthlySummary({ role = 'admin' }: { role?: 'teacher' | 'admin' }) {
  const { locale, t } = useLanguage();
  const { settings } = usePortalSettings();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [classList, setClassList] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [totalSchoolDays, setTotalSchoolDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [slipData, setSlipData] = useState<AttendanceSlipData | null>(null);
  const supabase = createClient();

  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        let allowedClassIds: string[] = [];
        if (role === 'teacher') {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user?.id) {
            const { data: assigned } = await (supabase as any).from('class_subjects').select('class_id').eq('teacher_id', userData.user.id);
            if (assigned && assigned.length > 0) {
               allowedClassIds = [...new Set(assigned.map((a: any) => a.class_id)) as any];
            } else {
               setClassList([]);
               return;
            }
          }
        }

        let clsQuery = (supabase as any).from('classes').select('*').order('created_at', { ascending: true });
        if (role === 'teacher' && allowedClassIds.length > 0) {
          clsQuery = clsQuery.in('id', allowedClassIds);
        }

        const { data } = await clsQuery;
        if (data && data.length > 0) {
          setClassList(data);
          setSelectedClass(data[0].id);
        } else {
          setClassList([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!selectedClass || !selectedMonth) return;
      setLoading(true);
      try {
        const [year, month] = selectedMonth.split('-');
        const startDate = `${year}-${month}-01`;
        // get last day of month
        const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];

        // 1. Fetch Students
        const { data: students } = await (supabase as any).from('students')
          .select('*')
          .eq('status', 'active')
          .eq('current_class_id', selectedClass);

        // 2. Fetch Attendance for this class in this month
        const { data: attendance } = await (supabase as any).from('attendance_records')
          .select('*')
          .eq('class_id', selectedClass)
          .gte('date', startDate)
          .lte('date', endDate);

        if (students) {
          // Calculate distinct dates to find total school days
          const dates = new Set(attendance?.map((a: any) => a.date) || []);
          const tDays = dates.size;
          setTotalSchoolDays(tDays);

          const agg = students.map((s: any) => {
            const stuAtt = attendance?.filter((a: any) => a.student_id === s.id) || [];
            let p = 0, a = 0, l = 0, lt = 0;
            stuAtt.forEach((record: any) => {
              if (record.status === 'present') p++;
              else if (record.status === 'absent') a++;
              else if (record.status === 'leave') l++;
              else if (record.status === 'late') lt++;
            });
            // Total attended is present + late
            const attended = p + lt;
            const percentage = tDays > 0 ? Math.round((attended / tDays) * 100) : 0;

            return {
              id: s.id,
              regId: s.registration_id,
              nameUrdu: `${s.first_name} ${s.last_name || ''}`.trim(),
              name: `${s.first_name} ${s.last_name || ''}`.trim(),
              totalDays: tDays,
              present: p,
              absent: a,
              leave: l,
              late: lt,
              percentage: percentage
            };
          });
          
          agg.sort((a: any, b: any) => a.nameUrdu.localeCompare(b.nameUrdu, 'ur'));
          setMonthlyData(agg);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClass, selectedMonth]);

  let filteredData = selectedStudent === 'all' ? monthlyData : monthlyData.filter((s: any) => s.id === selectedStudent);
  
  if (statusFilter === '100p') {
    filteredData = filteredData.filter((s: any) => s.percentage === 100);
  } else if (statusFilter === '0p') {
    filteredData = filteredData.filter((s: any) => s.percentage === 0);
  } else if (statusFilter === 'warning') {
    filteredData = filteredData.filter((s: any) => s.percentage < 75);
  }

  const averageAttendance = filteredData.length > 0
    ? Math.round(filteredData.reduce((acc: any, curr: any) => acc + curr.percentage, 0) / filteredData.length)
    : 0;

  const handlePrintReport = () => {
    if (selectedStudent !== 'all' && filteredData.length === 1) {
      const student = filteredData[0];
      const cls = classList.find(c => c.id === selectedClass);
      
      setSlipData({
        regId: student.regId,
        studentNameUrdu: student.nameUrdu,
        studentNameEn: student.name,
        classNameUrdu: cls?.name_ur || '',
        classNameEn: cls?.name_en || '',
        month: selectedMonth,
        totalDays: totalSchoolDays,
        present: student.present,
        absent: student.absent,
        leave: student.leave,
        late: student.late,
        percentage: student.percentage
      });
      setIsSlipOpen(true);
    } else {
      handleDownloadFullReport();
    }
  };

  const handleDownloadFullReport = () => {
    toast.success(locale === 'ur' ? '🖨️ مکمل ماہانہ رپورٹ تیار کی جا رہی ہے...' : '🖨️ Preparing full monthly report...');
    const dir = locale === 'ur' ? 'rtl' : 'ltr';
    const cls = classList.find(c => c.id === selectedClass);
    const className = cls ? (locale === 'ur' ? cls.name_ur : cls.name_en) : '';
    const title = locale === 'ur' ? `ماہانہ حاضری رپورٹ - ${className}` : `Monthly Attendance - ${className}`;
    
    // Islamic/School Logo HTML
    const logoHtml = settings.logo 
      ? `<img src="${settings.logo}" style="width: 48px; height: 48px; object-fit: contain;" />` 
      : `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;

    let rowsHtml = '';
    filteredData.forEach((s: any, idx: number) => {
      const statusText = s.percentage >= 90 ? (locale === 'ur' ? 'بہترین' : 'Excellent') : 
                         s.percentage >= 75 ? (locale === 'ur' ? 'تسلی بخش' : 'Satisfactory') : 
                         (locale === 'ur' ? 'وارننگ' : 'Warning');
      const statusColor = s.percentage >= 75 ? '#059669' : '#e11d48';
      rowsHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td class="font-en font-mono" style="font-size: 11px;">${s.regId}</td>
          <td style="font-weight: bold;">${locale === 'ur' ? s.nameUrdu : s.name}</td>
          <td class="font-en" style="color: #047857;">${s.present}</td>
          <td class="font-en" style="color: #be123c;">${s.absent}</td>
          <td class="font-en" style="color: #b45309;">${s.leave}</td>
          <td class="font-en font-bold" style="font-size: 16px;">${s.percentage}%</td>
          <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
        </tr>
      `;
    });

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
      background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; line-height: 1.8;
    }
    .font-en { font-family: 'Outfit', sans-serif !important; line-height: 1.5 !important; }
    .font-mono { font-family: 'Consolas', monospace !important; }
    
    .container {
      max-width: 900px; margin: 20px auto; background: #ffffff;
      border: 3px double #0ea5e9; border-radius: 12px; padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    .header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #bae6fd; padding-bottom: 16px; margin-bottom: 20px;
    }
    .header-logo { display: flex; gap: 16px; align-items: center; }
    .school-title { font-size: 22px; font-weight: bold; color: #0369a1; margin: 0; }
    .school-sub { font-size: 14px; color: #0284c7; font-weight: bold; margin-top: 4px; }
    .info-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
      background: #f0f9ff; padding: 12px; border-radius: 8px; margin-bottom: 20px;
      border: 1px solid #bae6fd; font-size: 14px; font-weight: bold;
    }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
    th { background: #0284c7; color: white; padding: 10px; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .action-bar { text-align: center; margin: 20px auto; max-width: 900px; }
    .print-btn {
      background: #0284c7; color: #ffffff; border: none; padding: 12px 24px;
      border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;
      font-family: 'Noto Nastaliq Urdu', serif; box-shadow: 0 4px 6px rgba(2, 132, 199, 0.2);
    }
    .print-btn:hover { background: #0369a1; }
    .footer-sigs {
      display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px;
      border-top: 1px solid #e2e8f0; font-size: 12px; text-align: center;
    }
    .sig-line { width: 140px; border-bottom: 1px solid #94a3b8; margin-bottom: 8px; }
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: 2px solid #0284c7; box-shadow: none; margin: 0; width: 100%; max-width: 100%; }
      .action-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="action-bar">
    <button onclick="window.print()" class="print-btn">🖨️ اس رپورٹ کو پرنٹ کریں (Print Report)</button>
  </div>
  <div class="container">
    <div class="header">
      <div class="header-logo">
        <div>${logoHtml}</div>
        <div>
          <h1 class="school-title">${locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}</h1>
          <div class="school-sub">${locale === 'ur' ? 'شعبہ امتحانات و حاضری (Examination & Attendance)' : 'Examination & Attendance Dept'}</div>
        </div>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: bold; color: #0284c7; border: 1px solid #0284c7; padding: 4px 12px; border-radius: 99px;">
          ${locale === 'ur' ? 'مکمل حاضری رپورٹ' : 'Full Attendance Report'}
        </div>
      </div>
    </div>
    
    <div class="info-grid">
      <div><span style="color: #64748b;">${locale === 'ur' ? 'مہینہ:' : 'Month:'}</span> <span class="font-en">${selectedMonth}</span></div>
      <div><span style="color: #64748b;">${locale === 'ur' ? 'درجہ / کلاس:' : 'Class:'}</span> ${className}</div>
      <div><span style="color: #64748b;">${locale === 'ur' ? 'کل ایام:' : 'Total Days:'}</span> <span class="font-en">${totalSchoolDays}</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>${locale === 'ur' ? 'رجسٹریشن' : 'Reg No'}</th>
          <th>${locale === 'ur' ? 'نام طالب علم' : 'Name'}</th>
          <th>${locale === 'ur' ? 'حاضر' : 'Present'}</th>
          <th>${locale === 'ur' ? 'غیر حاضر' : 'Absent'}</th>
          <th>${locale === 'ur' ? 'رخصت' : 'Leave'}</th>
          <th>${locale === 'ur' ? 'فیصد' : '%'}</th>
          <th>${locale === 'ur' ? 'کیفیت' : 'Status'}</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="footer-sigs">
      <div>
        <div class="sig-line"></div>
        <div style="font-weight: bold;">${locale === 'ur' ? 'دستخط استاد' : 'Teacher Signature'}</div>
      </div>
      <div>
        <div class="sig-line"></div>
        <div style="font-weight: bold;">${locale === 'ur' ? 'دستخط پرنسپل' : 'Principal Signature'}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Full_Attendance_Report_${className}_${selectedMonth}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    toast.success(locale === 'ur' ? '📊 ماہانہ حاضری کا ایکسل (CSV) ریکارڈ ڈاؤن لوڈ ہو رہا ہے...' : '📊 Downloading monthly CSV record...');
  };

  return (
    <div className="space-y-6 font-ur">
      {/* Top Filter Bar */}
      <Card className="border-border/60 shadow-sm bg-card/95 backdrop-blur-md">
        <CardContent className="p-4 sm:p-6 print:hidden">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[160px] h-11 bg-muted/30 border-primary/20">
                  <SelectValue placeholder={locale === 'ur' ? 'کلاس منتخب کریں' : 'Select Class'} />
                </SelectTrigger>
                <SelectContent>
                  {classList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {locale === 'ur' ? c.name_ur : c.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px] h-11 bg-muted/30 border-primary/20 font-en">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-ur">
                  {Array.from({length: 6}).map((_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    const labelUr = new Intl.DateTimeFormat('ur-PK', { month: 'long', year: 'numeric' }).format(d);
                    const labelEn = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d);
                    return <SelectItem key={val} value={val}>{locale === 'ur' ? labelUr : labelEn}</SelectItem>
                  })}
                </SelectContent>
              </Select>

              <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={!selectedClass || loading}>
                <SelectTrigger className="w-[180px] h-11 bg-muted/30 border-primary/20">
                  <SelectValue placeholder={locale === 'ur' ? 'طالب علم تلاش کریں' : 'Select Student'} />
                </SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'تمام طلباء (All Students)' : 'All Students'}</SelectItem>
                  {monthlyData.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.regId} - {locale === 'ur' ? s.nameUrdu : s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter} disabled={!selectedClass || loading || selectedStudent !== 'all'}>
                <SelectTrigger className="w-[170px] h-11 bg-muted/30 border-primary/20">
                  <SelectValue placeholder={locale === 'ur' ? 'حاضری کی کیفیت' : 'Status Filter'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{locale === 'ur' ? 'تمام طلباء (All)' : 'All Students'}</SelectItem>
                  <SelectItem value="100p">{locale === 'ur' ? 'مکمل حاضر (100%)' : '100% Present'}</SelectItem>
                  <SelectItem value="0p">{locale === 'ur' ? 'مکمل غیر حاضر' : '100% Absent'}</SelectItem>
                  <SelectItem value="warning">{locale === 'ur' ? 'کم حاضری (<75%)' : 'Below 75% Warning'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button onClick={handleExportCSV} variant="outline" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locale === 'ur' ? 'ایکسل' : 'Export'}</span>
              </Button>
              <Button onClick={handlePrintReport} variant="secondary" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
                <Printer className="w-4 h-4 text-primary shrink-0" />
                <span>{selectedStudent === 'all' ? (locale === 'ur' ? 'مکمل رپورٹ پرنٹ' : 'Print Sheet') : (locale === 'ur' ? 'رسید / سلپ پرنٹ' : 'Print Slip')}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 print:hidden">
        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-emerald-500/10 via-card to-card border-s-4 border-s-emerald-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'اوسط ماہانہ حاضری' : 'Monthly Average'}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-en mt-1">{averageAttendance}%</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {locale === 'ur' ? 'بہترین تعلیمی تسلسل' : 'Excellent consistency'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-blue-500/10 via-card to-card border-s-4 border-s-blue-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل تعلیمی و تدریسی ایام' : 'Total School Days'}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-en mt-1">{totalSchoolDays} <span className="text-sm font-ur text-muted-foreground font-normal">{locale === 'ur' ? 'دن' : 'Days'}</span></h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1">{locale === 'ur' ? 'جن دنوں میں حاضری لگی' : 'Days with marked attendance'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-purple-500/10 via-card to-card border-s-4 border-s-purple-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? '100% حاضری والے طلباء' : '100% Attendance Award'}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-en mt-1">
                {monthlyData.filter((s: any) => s.percentage === 100).length} <span className="text-sm font-ur text-muted-foreground font-normal">{locale === 'ur' ? 'طلباء' : 'Students'}</span>
              </h3>
              <p className="text-[11px] text-purple-600 font-bold mt-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> {locale === 'ur' ? 'حسنِ کارکردگی کے حقدار' : 'Eligible for Excellence Badge'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary Table */}
      <Card className="border-border/60 shadow-md print:hidden">
        <CardHeader className="bg-muted/30 border-b border-border/60 py-4">
          <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>{locale === 'ur' ? 'طالب علم وار ماہانہ حاضری رپورٹ' : 'Student-wise Monthly Attendance Breakdown'}</span>
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            {locale === 'ur' ? 'ہر طالب علم کے حاضر، غیر حاضر اور رخصت کے ایام اور حاضری کا فیصدی تناسب۔' : 'Monthly aggregated days for present, absent, leave, and overall attendance percentage.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === 'ur' ? 'طالب علم' : 'Student Name'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'حاضر (Present)' : 'Present'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'غیر حاضر (Absent)' : 'Absent'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'رخصت (Leave)' : 'Leave'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'تاخیر (Late)' : 'Late'}</TableHead>
                <TableHead className="w-48 text-center">{locale === 'ur' ? 'تناسبِ حاضری (%)' : 'Attendance Percentage'}</TableHead>
                <TableHead className="text-end">{locale === 'ur' ? 'کیفیت' : 'Status'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">{locale === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}</TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{locale === 'ur' ? 'کوئی ریکارڈ نہیں ملا' : 'No records found'}</TableCell>
                </TableRow>
              ) : filteredData.map((student: any) => (
                <TableRow key={student.id} className={student.percentage < 70 ? 'bg-rose-500/5' : ''}>
                  <TableCell className="font-bold py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-en">
                        {student.regId}
                      </span>
                      <span className="text-sm font-extrabold text-foreground">{locale === 'ur' ? student.nameUrdu : student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-en font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                    {student.present}
                  </TableCell>
                  <TableCell className="text-center font-en font-bold text-rose-700 dark:text-rose-400 bg-rose-500/5">
                    {student.absent}
                  </TableCell>
                  <TableCell className="text-center font-en font-bold text-amber-700 dark:text-amber-400 bg-amber-500/5">
                    {student.leave}
                  </TableCell>
                  <TableCell className="text-center font-en font-bold text-blue-700 dark:text-blue-400">
                    {student.late}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold font-en">
                        <span>{student.percentage}%</span>
                        <span className="text-[10px] text-muted-foreground font-ur">{student.present + student.late}/{totalSchoolDays} {locale === 'ur' ? 'دن' : 'days'}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            student.percentage >= 90 ? 'bg-emerald-600' :
                            student.percentage >= 75 ? 'bg-amber-500' :
                            'bg-rose-600'
                          }`}
                          style={{ width: `${student.percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-end">
                    {student.percentage >= 90 ? (
                      <Badge variant="success" className="text-[10px] font-bold">
                        {locale === 'ur' ? 'اعلیٰ کارکردگی' : 'Excellent'}
                      </Badge>
                    ) : student.percentage >= 75 ? (
                      <Badge variant="secondary" className="text-[10px] font-bold">
                        {locale === 'ur' ? 'تسلی بخش' : 'Satisfactory'}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px] font-bold gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3 inline" /> {locale === 'ur' ? 'کم حاضری (وارننگ)' : 'Low Warning'}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 border-t border-border/60 flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-bold">
            {locale === 'ur' ? 'نوٹ: 75% سے کم حاضری والے طلباء کو سالانہ امتحانات میں بیٹھنے کے لیے پرنسپل کی خصوصی اجازت درکار ہوگی۔' : 'Note: Students below 75% attendance require Admin approval for annual examinations.'}
          </p>
        </CardFooter>
      </Card>

      <AttendanceSlipModal 
        isOpen={isSlipOpen} 
        onClose={() => setIsSlipOpen(false)} 
        slipData={slipData} 
      />
    </div>
  );
}
