"use client";

import React, { useState } from 'react';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Download, 
  Send, 
  FileText, 
  User, 
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';

export default function ParentAttendancePage() {
  const { locale } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('2026-07-28');

  const handleSendLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      toast.error(locale === 'ur' ? 'براہ کرم رخصت کی وجہ تحریر کریں!' : 'Please enter leave reason!');
      return;
    }
    toast.success(locale === 'ur' ? '✅ رخصت کی درخواست کلاس انچارج (قاری طارق صاحب) کو ارسال کر دی گئی ہے!' : '✅ Leave application submitted to Class Incharge!');
    setIsLeaveModalOpen(false);
    setLeaveReason('');
  };

  const attendanceLog = [
    { date: '26-07-2026', dayUr: 'ہفتہ', dayEn: 'Saturday', status: 'present', time: '07:45 AM', ustad: 'قاری محمد طارق' },
    { date: '25-07-2026', dayUr: 'جمعہ', dayEn: 'Friday', status: 'leave', time: '-', ustad: 'قاری محمد طارق (رخصت منظور شدہ - بیماری)' },
    { date: '24-07-2026', dayUr: 'جمعرات', dayEn: 'Thursday', status: 'present', time: '07:50 AM', ustad: 'قاری محمد طارق' },
    { date: '23-07-2026', dayUr: 'بدھ', dayEn: 'Wednesday', status: 'present', time: '07:40 AM', ustad: 'قاری محمد طارق' },
    { date: '22-07-2026', dayUr: 'منگل', dayEn: 'Tuesday', status: 'present', time: '07:42 AM', ustad: 'قاری محمد طارق' },
    { date: '21-07-2026', dayUr: 'پیر', dayEn: 'Monday', status: 'present', time: '07:48 AM', ustad: 'قاری محمد طارق' },
    { date: '19-07-2026', dayUr: 'ہفتہ', dayEn: 'Saturday', status: 'present', time: '07:44 AM', ustad: 'قاری محمد طارق' },
    { date: '18-07-2026', dayUr: 'جمعہ', dayEn: 'Friday', status: 'present', time: '07:40 AM', ustad: 'قاری محمد طارق' },
    { date: '17-07-2026', dayUr: 'جمعرات', dayEn: 'Thursday', status: 'present', time: '07:51 AM', ustad: 'قاری محمد طارق' },
    { date: '16-07-2026', dayUr: 'بدھ', dayEn: 'Wednesday', status: 'present', time: '07:45 AM', ustad: 'قاری محمد طارق' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border/80 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {locale === 'ur' ? 'فرزند کی روزانہ اور ماہانہ حاضری کا رجسٹر' : 'Child Daily & Monthly Attendance Ledger'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {locale === 'ur' ? 'طالب علم: حافظ عبداللہ احمد (شعبہ حفظ القرآن - REG-2026-042)' : 'Student: Hafiz Abdullah Ahmed (Hifz Dept - REG-2026-042)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setIsLeaveModalOpen(true)}
            variant="emerald"
            className="h-9 px-4 font-bold text-xs gap-2 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{locale === 'ur' ? '🗓️ رخصت کی درخواست بھیجیں' : 'Apply for Leave'}</span>
          </Button>

          <Button
            onClick={() => {
              toast.success(locale === 'ur' ? '📥 حاضری کا سالانہ ریکارڈ ڈاؤن لوڈ ہو رہا ہے...' : '📥 Downloading attendance PDF...');
            }}
            variant="outline"
            className="h-9 px-3 font-bold text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>{locale === 'ur' ? 'پی ڈی ایف' : 'Export PDF'}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'کل تعلیمی ایام' : 'Working Days'}</p>
              <p className="text-2xl font-extrabold text-foreground font-en mt-1">25</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">📅</span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'حاضر (Present)' : 'Total Present'}</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-en mt-1">24</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">✓</span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'رخصت (Leave)' : 'Total Leaves'}</p>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-en mt-1">1</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">🗓️</span>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'غیر حاضر (Absent)' : 'Total Absent'}</p>
              <p className="text-2xl font-extrabold text-destructive font-en mt-1">0</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center font-bold">✕</span>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Main Ledger Card */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-bold text-foreground">
              {locale === 'ur' ? 'ماہانہ حاضری کا تفصیلی کھاتہ' : 'Detailed Monthly Attendance Log'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-8 w-36 text-xs bg-muted/50 border-border font-en"
            />
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                  <th className="py-3 px-4 text-start">{locale === 'ur' ? 'تاریخ / Date' : 'Date'}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ur' ? 'دن / Day' : 'Day'}</th>
                  <th className="py-3 px-4 text-center">{locale === 'ur' ? 'حاضری کی حیثیت' : 'Attendance Status'}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ur' ? 'وقتِ حاضری / Time' : 'Time'}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ur' ? 'تصدیق کنندہ استاد و تبصرہ' : 'Verified By & Remarks'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {attendanceLog.map((row, idx) => (
                  <tr key={idx} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3.5 px-4 font-en font-medium text-foreground">{row.date}</td>
                    <td className="py-3.5 px-4 font-bold">{locale === 'ur' ? row.dayUr : row.dayEn}</td>
                    <td className="py-3.5 px-4 text-center">
                      {row.status === 'present' ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold px-3 py-1">
                          <CheckCircle2 className="w-3.5 h-3.5 me-1 inline" />
                          {locale === 'ur' ? 'حاضر (Present)' : 'Present'}
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold px-3 py-1">
                          <Clock className="w-3.5 h-3.5 me-1 inline" />
                          {locale === 'ur' ? 'رخصت (Leave)' : 'Leave'}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-en text-muted-foreground font-medium">{row.time}</td>
                    <td className="py-3.5 px-4 font-medium text-muted-foreground">{row.ustad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Leave Request Dialog */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent className="max-w-md font-ur border-2 border-primary/20 bg-card">
          <DialogHeader className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {locale === 'ur' ? 'طالب علم کی رخصت (Leave) کی درخواست' : 'Student Leave Application Form'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {locale === 'ur' ? 'یہ درخواست براہِ راست کلاس انچارج استاد اور پرنسپل دفتر کو ارسال ہو جائے گی' : 'This application will be sent directly to class teacher and principal office'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendLeaveRequest} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">
                {locale === 'ur' ? 'طالب علم کا نام:' : 'Student Name:'}
              </Label>
              <Input 
                disabled 
                value={locale === 'ur' ? 'حافظ عبداللہ احمد (شعبہ حفظ القرآن)' : 'Hafiz Abdullah Ahmed (Hifz)'} 
                className="bg-muted/50 text-xs font-bold text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="leaveDate" className="text-xs font-bold text-foreground">
                {locale === 'ur' ? 'رخصت کی مطلوبہ تاریخ:' : 'Leave Date Required:'}
              </Label>
              <Input
                id="leaveDate"
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="h-9 text-xs bg-card font-en text-start"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="leaveReason" className="text-xs font-bold text-foreground">
                {locale === 'ur' ? 'رخصت کی وجہ (بیماری، گھریلو ضرورت وغیرہ):' : 'Reason for Leave:'}
              </Label>
              <textarea
                id="leaveReason"
                rows={3}
                placeholder={locale === 'ur' ? 'مثلاً: کل بچے کو بخار ہے اس لیے مدرسہ حاضر نہیں ہو سکے گا...' : 'e.g. Child is suffering from fever and needs rest...'}
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full p-3 rounded-lg bg-card border border-border text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              ></textarea>
            </div>

            <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
                {locale === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </Button>
              <Button type="submit" variant="emerald" size="sm" className="font-bold gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>{locale === 'ur' ? 'درخواست ارسال کریں' : 'Submit Application'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
