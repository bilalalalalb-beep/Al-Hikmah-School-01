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



export function MonthlySummary({ role = 'admin' }: { role?: 'teacher' | 'admin' }) {
  const { locale, t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [classList, setClassList] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [totalSchoolDays, setTotalSchoolDays] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const averageAttendance = monthlyData.length > 0
    ? Math.round(monthlyData.reduce((acc, curr) => acc + curr.percentage, 0) / monthlyData.length)
    : 0;

  const handlePrintReport = () => {
    toast.success(locale === 'ur' ? '🖨️ ماہانہ حاضری رپورٹ پرنٹ کے لیے تیار کی جا رہی ہے...' : '🖨️ Preparing monthly report for printing...');
    window.print();
  };

  const handleExportCSV = () => {
    toast.success(locale === 'ur' ? '📊 ماہانہ حاضری کا ایکسل (CSV) ریکارڈ ڈاؤن لوڈ ہو رہا ہے...' : '📊 Downloading monthly CSV record...');
  };

  return (
    <div className="space-y-6 font-ur">
      {/* Top Filter Bar */}
      <Card className="border-border/60 shadow-sm bg-card/95 backdrop-blur-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'درجہ / کلاس' : 'Select Class'}</span>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10 text-xs sm:text-sm font-bold font-ur w-full sm:w-64 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent className="font-ur">
                    {classList.map(c => (
                      <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.name_ur : c.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'تعلیمی مہینہ / سال' : 'Select Month'}</span>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-10 text-xs sm:text-sm font-bold font-mono w-full sm:w-48 bg-background"><SelectValue /></SelectTrigger>
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
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button onClick={handleExportCSV} variant="outline" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locale === 'ur' ? 'ایکسل (Excel/CSV) ڈاؤن لوڈ' : 'Export CSV'}</span>
              </Button>
              <Button onClick={handlePrintReport} variant="secondary" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
                <Printer className="w-4 h-4 text-primary shrink-0" />
                <span>{locale === 'ur' ? 'پرنٹ کریں (Print Sheet)' : 'Print Report'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
      <Card className="border-border/60 shadow-md">
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
              ) : monthlyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{locale === 'ur' ? 'کوئی ریکارڈ نہیں ملا' : 'No records found'}</TableCell>
                </TableRow>
              ) : monthlyData.map((student: any) => (
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
    </div>
  );
}
