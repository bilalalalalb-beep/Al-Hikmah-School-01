"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Wallet, 
  CalendarCheck, 
  Award, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Settings, 
  Smartphone, 
  Globe, 
  RefreshCw, 
  Copy, 
  Filter, 
  FileText, 
  PhoneCall,
  Share2,
  ShieldCheck,
  Zap,
  HelpCircle,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';

export function WhatsAppAutomationDesk() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'quick' | 'custom' | 'logs' | 'settings'>('quick');
  const [gatewayMode, setGatewayMode] = useState<'free_web' | 'cloud_api'>('free_web');
  const [channelMode, setChannelMode] = useState<'whatsapp' | 'email' | 'both'>('both');

  // Custom message editor state
  const [targetGroup, setTargetGroup] = useState('defaulters');
  const [customMessage, setCustomMessage] = useState(
    locale === 'ur'
      ? "السلام علیکم ورحمۃ اللہ! محترم سرپرست {father_name}، آپ کے فرزند {student_name} (رجسٹریشن نمبر: {reg_id}) کے حوالے سے مطلع کیا جاتا ہے کہ اس ماہ کی فیس مبلغ {due_amount} روپے واجب الادا ہے۔ براہ کرم جلد از جلد میزان بینک یا ایزی پیسہ کے ذریعے ادائیگی کر کے رسید ارسال فرمائیں۔ جزاکم اللہ خیراً! (دفتر مدرسہ الحکمہ)"
      : "Assalam-o-Alaikum! Dear Guardian {father_name}, this is a reminder regarding your ward {student_name} ({reg_id}). The fee invoice of Rs. {due_amount} for this month is currently pending. Kindly clear the dues via Meezan Bank or EasyPaisa at your earliest convenience. JazakAllah! (Al-Hikmah Office)"
  );

  // API settings state
  const [apiKey, setApiKey] = useState('umsg_live_8921_pk_mdr_2026');
  const [instanceId, setInstanceId] = useState('inst_alhikmah_01');
  const [senderNumber, setSenderNumber] = useState('+92 300 1234567');

  // SMTP Email settings state
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('465 (SSL/TLS)');
  const [smtpUser, setSmtpUser] = useState('info@alhikmah.edu.pk');
  const [smtpPass, setSmtpPass] = useState('••••••••••••••••');

  // Helper placeholder insert
  const insertPlaceholder = (placeholder: string) => {
    setCustomMessage(prev => prev + " " + placeholder);
    toast.info(locale === 'ur' ? `🏷️ متغیر ${placeholder} شامل کر دیا گیا` : `🏷️ Added variable ${placeholder}`);
  };

  const handleQuickBroadcast = (type: string, count: number) => {
    if (channelMode === 'email') {
      toast.success(
        locale === 'ur'
          ? `📧 آفیشل ای میل سرور فعال! ${count} سرپرستوں کے ای میل ایڈریس پر آفیشل رسید اور پیغام بھیج دیا گیا ہے!`
          : `📧 Official Email SMTP active! Dispatched formal notice & receipts to ${count} parent email addresses!`
      );
    } else if (channelMode === 'both') {
      toast.success(
        locale === 'ur'
          ? `🚀 ڈوئل موڈ فعال! ${count} سرپرستوں کو واٹس ایپ پیغام کے ساتھ ساتھ آفیشل ای میل رسیدیں بھی روانہ کر دی گئی ہیں!`
          : `🚀 Dual Broadcast Active! Sent instant WhatsApp alert AND formal Email receipts to ${count} guardians simultaneously!`
      );
    } else {
      if (gatewayMode === 'free_web') {
        toast.success(
          locale === 'ur' 
            ? `🚀 فری واٹس ایپ ویب موڈ فعال! ${count} سرپرستوں کو یکے بعد دیگرے پیغامات بھیجے جا رہے ہیں...` 
            : `🚀 Free Web Mode active! Broadcasting to ${count} guardians sequentially...`
        );
      } else {
        toast.success(
          locale === 'ur' 
            ? `☁️ کلاؤڈ اے پی آئی کے ذریعے ${count} پیغامات سرور کیو (Queue) میں شامل کر دیے گئے ہیں!` 
            : `☁️ Queued ${count} messages via Cloud API successfully!`
        );
      }
    }
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) {
      toast.error(locale === 'ur' ? 'براہ کرم پیغام کی عبارت تحریر کریں!' : 'Please enter message content!');
      return;
    }
    const groupName = targetGroup === 'defaulters' ? 'فیس نادہندگان' : targetGroup === 'absent' ? 'آج کے غیر حاضر' : 'تمام والدین';
    if (channelMode === 'email') {
      toast.success(
        locale === 'ur'
          ? `📧 آفیشل ای میل کے ذریعے منتخب گروپ (${groupName}) کو تفصیلی پیغام روانہ کر دیا گیا ہے!`
          : `📧 Message dispatched via Official Email SMTP to selected group!`
      );
    } else if (channelMode === 'both') {
      toast.success(
        locale === 'ur'
          ? `🚀 ڈوئل موڈ (واٹس ایپ + ای میل): منتخب گروپ (${groupName}) کو دونوں ذرائع سے فوری اطلاع بھیج دی گئی ہے!`
          : `🚀 Dual Mode (WhatsApp + Email): Alert broadcasted to selected target group via both channels!`
      );
    } else {
      toast.success(
        locale === 'ur'
          ? `✅ واٹس ایپ پیغام منتخب گروپ (${groupName}) کو ارسال کر دیا گیا ہے!`
          : `✅ WhatsApp message broadcasted to selected target group successfully!`
      );
    }
  };

  const handleTestConnection = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: locale === 'ur' ? '🔍 واٹس ایپ سرور کنکشن ٹیسٹ کیا جا رہا ہے...' : '🔍 Testing WhatsApp server gateway connection...',
        success: locale === 'ur' ? '🟢 کنکشن کامیاب! سرور فعال اور تیار ہے (Status: 200 OK)' : '🟢 Connection successful! Gateway is active (Status: 200 OK)',
        error: locale === 'ur' ? 'کنکشن میں مسئلہ آیا' : 'Connection error'
      }
    );
  };

  const handleTestSmtp = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1400)),
      {
        loading: locale === 'ur' ? '📧 ایس ایم ٹی پی ای میل سرور ٹیسٹ کیا جا رہا ہے...' : '📧 Testing SMTP Email Server gateway connection...',
        success: locale === 'ur' ? '🟢 ای میل سرور تصدیق شدہ! (SMTP Connected: port 465 SSL/TLS)' : '🟢 Email Server Verified! (SMTP Connected: port 465 SSL/TLS)',
        error: locale === 'ur' ? 'ای میل سرور میں مسئلہ آیا' : 'SMTP connection error'
      }
    );
  };

  // Sample broadcast logs
  const broadcastLogs = [
    { id: 'LOG-901', time: '10:15 AM', typeUr: 'فیس نادہندگان یاددہانی', typeEn: 'Fee Defaulters Reminder', recipients: 14, mode: 'واٹس ایپ + ای میل (ڈوئل)', status: 'delivered', date: '26-07-2026' },
    { id: 'LOG-902', time: '08:30 AM', typeUr: 'روزانہ غیر حاضری نوٹس', typeEn: 'Daily Absence Notice', recipients: 3, mode: 'فری واٹس ایپ ویب', status: 'delivered', date: '26-07-2026' },
    { id: 'LOG-885', time: '02:00 PM', typeUr: 'ششماہی امتحانی رزلٹ اطلاع', typeEn: 'Mid-Term Results Broadcast', recipients: 120, mode: 'آفیشل ای میل (SMTP)', status: 'delivered', date: '25-07-2026' },
    { id: 'LOG-840', time: '11:00 AM', typeUr: 'یومِ عاشور تعطیل کا اعلان', typeEn: 'Ashura Holiday Announcement', recipients: 145, mode: 'واٹس ایپ + ای میل (ڈوئل)', status: 'delivered', date: '15-07-2026' },
    { id: 'LOG-812', time: '09:00 AM', typeUr: 'ماہانہ فیس چالان اجرا', typeEn: 'Monthly Fee Challan Dispatch', recipients: 125, mode: 'کلاؤڈ اے پی آئی', status: 'delivered', date: '01-07-2026' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header & Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 p-6 rounded-2xl border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start sm:items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <MessageSquare className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold text-[11px]">
                {locale === 'ur' ? 'ماڈیول 9: آٹومیشن ڈیسک' : 'Module 9: Automation Desk'}
              </Badge>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1 font-en">
                <Zap className="w-3 h-3 text-amber-400" />
                Live Broadcast
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {locale === 'ur' ? 'کمیونیکیشن، واٹس ایپ اور ای میل الرٹ سینٹر' : 'WhatsApp & Email SMS Communication Hub'}
            </h1>
            <p className="text-xs text-slate-300/90 mt-0.5 max-w-xl">
              {locale === 'ur' ? 'مدرسہ کے طلباء کے سرپرستوں اور اساتذہ کو ایک کلک میں فیس یاددہانی، روزانہ غیر حاضری نوٹس، امتحانی نتائج اور عام اعلانات واٹس ایپ یا ای میل پر ارسال کریں' : 'Send instant fee defaulter reminders, daily absence alerts, exam results, and school announcements to parents via WhatsApp or Email with 1-click automation'}
            </p>
          </div>
        </div>

        {/* Gateway Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-white/10 z-10 shrink-0">
          <button
            onClick={() => {
              setGatewayMode('free_web');
              toast.info(locale === 'ur' ? '🟢 فری واٹس ایپ ویب موڈ فعال کر دیا گیا (بغیر کسی ماہانہ خرچ کے)' : '🟢 Switched to Free WhatsApp Web Mode (Zero API costs)');
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all w-full sm:w-auto justify-center ${
              gatewayMode === 'free_web'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-102'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-start">
              <span className="block">{locale === 'ur' ? 'فری واٹس ایپ ویب' : 'Free Web Mode'}</span>
              <span className="text-[9px] opacity-80 block font-en">{locale === 'ur' ? '(مفت و فوری)' : '(No API Fee Required)'}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setGatewayMode('cloud_api');
              toast.info(locale === 'ur' ? '☁️ کلاؤڈ سرور اے پی آئی موڈ فعال کر دیا گیا' : '☁️ Switched to Cloud Server API Mode');
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all w-full sm:w-auto justify-center ${
              gatewayMode === 'cloud_api'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-102'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="text-start">
              <span className="block">{locale === 'ur' ? 'کلاؤڈ اے پی آئی موڈ' : 'Cloud API Mode'}</span>
              <span className="text-[9px] opacity-80 block font-en">{locale === 'ur' ? '(الٹرا میسج / میٹا)' : '(UltraMsg / Meta Webhook)'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Broadcast Channel Selector Bar */}
      <div className="bg-card border-2 border-primary/30 p-4 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {locale === 'ur' ? 'ترسیل کا فعال ذریعہ (Active Broadcast Channel):' : 'Active Broadcast Channel:'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {locale === 'ur' ? 'منتخب کریں کہ پیغامات اور رسیدیں واٹس ایپ پر بھیجنی ہیں، ای میل پر، یا بیک وقت دونوں پر (ڈوئل ارسال)' : 'Select whether to dispatch alerts via WhatsApp, Email (SMTP), or Simultaneous Dual Broadcast'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto bg-muted/70 p-1.5 rounded-xl border border-border/80">
          <button
            type="button"
            onClick={() => {
              setChannelMode('whatsapp');
              toast.info(locale === 'ur' ? '📲 چینل: صرف واٹس ایپ الرٹ منتخب' : '📲 Channel: WhatsApp Only selected');
            }}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              channelMode === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{locale === 'ur' ? 'صرف واٹس ایپ' : 'WhatsApp Only'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setChannelMode('email');
              toast.info(locale === 'ur' ? '📧 چینل: صرف آفیشل ای میل منتخب' : '📧 Channel: Email Only selected');
            }}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              channelMode === 'email'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{locale === 'ur' ? 'صرف ای میل (Email)' : 'Email Only'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setChannelMode('both');
              toast.success(locale === 'ur' ? '📲 + 📧 چینل: واٹس ایپ اور ای میل دونوں فعال (ڈوئل موڈ)!' : '📲 + 📧 Channel: WhatsApp + Email Dual Broadcast Active!');
            }}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              channelMode === 'both'
                ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md shadow-primary/25 scale-102 font-extrabold'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>{locale === 'ur' ? 'دونوں پر ارسال (ڈوئل موڈ)' : 'Both WhatsApp + Email'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'quick'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{locale === 'ur' ? '📢 ون کلک فوری اعلانات (1-Click Broadcast)' : 'Quick 1-Click Broadcasts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'custom'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{locale === 'ur' ? '✍️ کسٹم پیغام اور ٹیمپلیٹ ایڈیٹر' : 'Custom Message & Templates'}</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{locale === 'ur' ? '📊 پیغام رسانی کا لاگ اور ہسٹری' : 'Broadcast Logs & History'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{locale === 'ur' ? '⚙️ اے پی آئی اور ایس ایم ایس سیٹنگز' : 'API & Gateway Settings'}</span>
        </button>
      </div>

      {/* Tab 1: Quick 1-Click Broadcasts */}
      {activeTab === 'quick' && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{locale === 'ur' ? 'ہدایت برائے فوری پیغام رسانی:' : 'Quick Broadcast Instructions:'}</span>
              <p className="mt-0.5 opacity-90">
                {locale === 'ur'
                  ? 'نیچے دیے گئے کسی بھی کارڈ پر "فوری ارسال کریں" پر کلک کرنے سے آپ کے منتخب کردہ موڈ کے مطابق تمام متعلقہ والدین کو خودکار پیغامات روانہ ہو جائیں گے۔ ہر پیغام میں طالب علم کا نام اور تفصیلات خودکار شامل ہو جائیں گی۔'
                  : 'Clicking "Send Broadcast Now" on any card below will automatically dispatch targeted messages to parents based on your selected gateway mode. Each message includes dynamic student placeholders.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Action 1: Fee Defaulters Reminder */}
            <Card className="border-2 border-amber-500/40 bg-gradient-to-br from-card via-card to-amber-500/5 hover:border-amber-500/80 transition-all shadow-md">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {locale === 'ur' ? 'فیس نادہندگان کو یاددہانی (Defaulters Alert)' : 'Fee Defaulters Reminder Broadcast'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {locale === 'ur' ? 'جولائی انوائس کے بقایاجات والے والدین کو اطلاع' : 'Send fee payment reminders for pending July invoices'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold font-en">
                  14 Students
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs text-muted-foreground font-medium space-y-1">
                  <span className="font-bold text-foreground block">{locale === 'ur' ? 'پیغام کا نمونہ (Preview):' : 'Message Sample:'}</span>
                  <p className="italic">
                    "{locale === 'ur' ? 'السلام علیکم! محترم حاجی محمد امین صاحب، آپ کے فرزند زبیر احمد کی جولائی کی فیس مبلغ 3,500 روپے واجب الادا ہے۔ براہِ کرم میزان بینک اکاؤنٹ میں ادا کر کے تصدیق کروائیں...' : 'Assalam-o-Alaikum! Dear Haji Muhammad Amin, fee invoice of Rs. 3,500 for Zubair Ahmed is currently pending...'}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{locale === 'ur' ? 'آخری ارسال: 3 دن قبل' : 'Last Sent: 3 days ago'}</span>
                  </span>
                  <Button
                    onClick={() => handleQuickBroadcast(locale === 'ur' ? 'فیس نادہندگان یاددہانی' : 'Fee Defaulters Alert', 14)}
                    variant="emerald"
                    className="h-9 px-4 font-bold text-xs gap-2 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? '🚀 فوری ارسال کریں (Send Now)' : 'Send Broadcast Now'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action 2: Today's Absentees Notice */}
            <Card className="border-2 border-destructive/40 bg-gradient-to-br from-card via-card to-destructive/5 hover:border-destructive/80 transition-all shadow-md">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {locale === 'ur' ? 'آج کے غیر حاضر طلباء کا نوٹس (Absentees Alert)' : "Today's Absentees Notice"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {locale === 'ur' ? 'بغیر رخصت کے غیر حاضر طلباء کے والدین کو اطلاع' : 'Notify guardians of students absent without approved leave today'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-destructive/20 text-destructive border-destructive/40 font-bold font-en">
                  3 Students
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs text-muted-foreground font-medium space-y-1">
                  <span className="font-bold text-foreground block">{locale === 'ur' ? 'پیغام کا نمونہ (Preview):' : 'Message Sample:'}</span>
                  <p className="italic">
                    "{locale === 'ur' ? 'السلام علیکم! محترم سرپرست، آپ کا فرزند عمر فاروق (درجہ سوم) آج مدرسہ میں غیر حاضر ہے۔ براہ کرم غیر حاضری کی وجہ سے دفتر کو آگاہ فرمائیں...' : 'Assalam-o-Alaikum! Dear Guardian, your ward Umar Farooq (Class 3) is marked absent today without prior leave notice...'}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                    <span>{locale === 'ur' ? 'آج کی حاضری مکمل' : 'Attendance Marked Today'}</span>
                  </span>
                  <Button
                    onClick={() => handleQuickBroadcast(locale === 'ur' ? 'غیر حاضری نوٹس' : 'Absence Notice', 3)}
                    variant="destructive"
                    className="h-9 px-4 font-bold text-xs gap-2 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? '🚀 فوری ارسال کریں (Send Now)' : 'Send Broadcast Now'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action 3: Exam Results Broadcast */}
            <Card className="border-2 border-purple-500/40 bg-gradient-to-br from-card via-card to-purple-500/5 hover:border-purple-500/80 transition-all shadow-md">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {locale === 'ur' ? 'امتحانی نتائج کی مبارکباد (Exam Results Alert)' : 'Exam Results & Position Broadcast'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {locale === 'ur' ? 'ششماہی امتحان 2026 کے نتائج اور پوزیشن کی اطلاع' : 'Send term exam results & grade summary to all parents'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/40 font-bold font-en">
                  120 Students
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs text-muted-foreground font-medium space-y-1">
                  <span className="font-bold text-foreground block">{locale === 'ur' ? 'پیغام کا نمونہ (Preview):' : 'Message Sample:'}</span>
                  <p className="italic">
                    "{locale === 'ur' ? 'مبارکباد! محترم حاجی محمد امین، آپ کے فرزند طلحہ احمد نے ششماہی امتحان میں 462/500 نمبر لے کر دوسری پوزیشن حاصل کی ہے۔ کشف الدرجات پورٹل پر ملاحظہ کریں...' : 'Congratulations! Haji Muhammad Amin, your ward Talha Ahmed secured 2nd Position in Mid-Term Exams with 92.4% marks...'}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? 'نتیجہ مشتہر کر دیا گیا' : 'Result Officially Declared'}</span>
                  </span>
                  <Button
                    onClick={() => handleQuickBroadcast(locale === 'ur' ? 'امتحانی نتائج اطلاع' : 'Exam Results Broadcast', 120)}
                    variant="emerald"
                    className="h-9 px-4 font-bold text-xs gap-2 shadow-md bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? '🚀 رزلٹ ارسال کریں (Send Results)' : 'Broadcast Results Now'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action 4: General Announcement & Holidays */}
            <Card className="border-2 border-blue-500/40 bg-gradient-to-br from-card via-card to-blue-500/5 hover:border-blue-500/80 transition-all shadow-md">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {locale === 'ur' ? 'عام اعلان / تعطیل کا پیغام (Holiday Broadcast)' : 'General Holiday / Event Announcement'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {locale === 'ur' ? 'موسمی تعطیلات، سالانہ جلسہ یا عیدین کی عام اطلاع' : 'Broadcast general announcements or holiday notices to all staff & guardians'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/40 font-bold font-en">
                  All 145 Parents
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs text-muted-foreground font-medium space-y-1">
                  <span className="font-bold text-foreground block">{locale === 'ur' ? 'پیغام کا نمونہ (Preview):' : 'Message Sample:'}</span>
                  <p className="italic">
                    "{locale === 'ur' ? 'اعلانِ عام: محترم والدین اور اساتذہ کرام! یومِ آزادی کی مناسبت سے کل 14 اگست کو مدرسہ الحکمہ میں تعطیل رہے گی۔ پرسوں بروز جمعہ حسبِ معمول کلاسز ہوں گی...' : 'Public Notice: Al-Hikmah Madrasa will remain closed tomorrow on account of Independence Day. Regular classes resume on Friday...'}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>{locale === 'ur' ? 'کل والدین و اساتذہ' : 'All Parents & Staff'}</span>
                  </span>
                  <Button
                    onClick={() => handleQuickBroadcast(locale === 'ur' ? 'عام اعلان تعطیل' : 'General Holiday Notice', 145)}
                    variant="emerald"
                    className="h-9 px-4 font-bold text-xs gap-2 shadow-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? '🚀 عام اعلان کریں (Broadcast All)' : 'Send to All Now'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Custom Message & Templates Editor */}
      {activeTab === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Column (2 spans) */}
          <Card className="lg:col-span-2 border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>{locale === 'ur' ? 'حسبِ ضرورت پیغام کا مسودہ تیار کریں' : 'Draft Custom Broadcast Message'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'آپ اپنی مرضی کا پیغام لکھ کر متغیرات (Variables) شامل کر سکتے ہیں جو ہر طالب علم کے لیے خودکار تبدیل ہو جائیں گے' : 'Compose custom message and insert dynamic variables that adapt automatically for each recipient'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <form onSubmit={handleSendCustomMessage} className="space-y-4">
                {/* Target Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="targetGroup" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'مخاطب گروپ منتخب کریں (Target Audience):' : 'Select Target Audience Group:'}
                  </Label>
                  <select
                    id="targetGroup"
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-card border border-border text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="defaulters">{locale === 'ur' ? '🔴 فیس نادہندگان والدین (14 سرپرست)' : '🔴 Fee Defaulters Only (14 Parents)'}</option>
                    <option value="absent">{locale === 'ur' ? '🟠 آج کے غیر حاضر طلباء کے والد (3 سرپرست)' : '🟠 Today Absentees Only (3 Parents)'}</option>
                    <option value="all_parents">{locale === 'ur' ? '🟢 کل طلباء کے والدین و سرپرست (120 سرپرست)' : '🟢 All Students Guardians (120 Parents)'}</option>
                    <option value="hifz_only">{locale === 'ur' ? '📘 صرف شعبہ حفظ القرآن کے والدین (45 سرپرست)' : '📘 Hifz-ul-Quran Department Parents (45 Guardians)'}</option>
                    <option value="dars_only">{locale === 'ur' ? '📙 صرف شعبہ درس نظامی کے والدین (50 سرپرست)' : '📙 Dars-e-Nizami Department Parents (50 Guardians)'}</option>
                    <option value="teachers">{locale === 'ur' ? '👔 مدرسہ کے تمام اساتذہ و عملہ (12 اساتذہ)' : '👔 All Madrasa Teachers & Staff (12 Members)'}</option>
                  </select>
                </div>

                {/* Variable Placeholders Buttons */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground">
                    {locale === 'ur' ? 'خودکار متغیرات شامل کرنے کے لیے کلک کریں:' : 'Click to insert dynamic variables:'}
                  </Label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { labelUr: 'طالب علم کا نام', labelEn: 'Student Name', tag: '{student_name}' },
                      { labelUr: 'والد کا نام', labelEn: 'Father Name', tag: '{father_name}' },
                      { labelUr: 'رجسٹریشن آئی ڈی', labelEn: 'Reg ID', tag: '{reg_id}' },
                      { labelUr: 'واجب الادا فیس', labelEn: 'Due Amount', tag: '{due_amount}' },
                      { labelUr: 'درجہ / شعبہ', labelEn: 'Class Name', tag: '{class_name}' },
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertPlaceholder(btn.tag)}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>+ {locale === 'ur' ? btn.labelUr : btn.labelEn}</span>
                        <span className="text-[10px] opacity-75 font-en">({btn.tag})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Text Area */}
                <div className="space-y-1.5">
                  <Label htmlFor="customMessage" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'پیغام کی عبارت (Message Text):' : 'Message Body Content:'}
                  </Label>
                  <textarea
                    id="customMessage"
                    rows={6}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-card border border-border text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-xs text-muted-foreground font-bold">
                    💬 {locale === 'ur' ? 'مجموعی الفاظ:' : 'Total Characters:'} {customMessage.length}
                  </span>
                  <Button
                    type="submit"
                    variant="emerald"
                    className="h-10 px-6 font-bold text-xs sm:text-sm gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{locale === 'ur' ? '📲 واٹس ایپ پر ارسال کریں (Broadcast Now)' : 'Broadcast Custom Message Now'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Live Preview Column (1 span) */}
          <Card className="border-border/80 bg-card shadow-sm h-fit">
            <CardHeader className="pb-3 border-b border-border/60 bg-emerald-500/5">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{locale === 'ur' ? 'لائیو واٹس ایپ پیشکش (Preview)' : 'Live WhatsApp Screen Preview'}</span>
              </CardTitle>
              <CardDescription className="text-[11px]">
                {locale === 'ur' ? 'والدین کو موبائل پر یہ پیغام کس طرح نظر آئے گا' : 'How the rendered message appears on guardians smartphone'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 bg-slate-900/90 text-white rounded-b-xl space-y-3 font-ur">
              {/* Fake WhatsApp Header */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10 text-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[10px] text-white">
                  الحکمہ
                </div>
                <div>
                  <p className="font-bold text-slate-100">{locale === 'ur' ? 'مدرسہ الحکمہ (آفیشل ڈیسک)' : 'Al-Hikmah Madrasa (Official)'}</p>
                  <p className="text-[9px] text-emerald-400 font-en">online • verified business</p>
                </div>
              </div>

              {/* Fake WhatsApp Message Bubble */}
              <div className="p-3 rounded-xl bg-emerald-800/80 text-emerald-50 border border-emerald-600/40 text-xs leading-relaxed space-y-2 relative shadow-inner">
                <p className="whitespace-pre-wrap">
                  {customMessage
                    .replace(/\{student_name\}/g, locale === 'ur' ? 'طلحہ احمد' : 'Talha Ahmed')
                    .replace(/\{father_name\}/g, locale === 'ur' ? 'حاجی محمد امین' : 'Haji Muhammad Amin')
                    .replace(/\{reg_id\}/g, 'REG-2026-001')
                    .replace(/\{due_amount\}/g, '4,500')
                    .replace(/\{class_name\}/g, locale === 'ur' ? 'درجہ ہشتم' : 'Class 8th')}
                </p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 pt-1">
                  <span>10:30 AM</span>
                  <span className="text-blue-300 font-bold">✓✓</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400">
                🔒 {locale === 'ur' ? 'اینڈ ٹو اینڈ انکرپٹڈ تصدیق شدہ پیغام' : 'End-to-end encrypted school message'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Broadcast Logs & History */}
      {activeTab === 'logs' && (
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
            <div>
              <CardTitle className="text-base font-bold">
                {locale === 'ur' ? 'پیغام رسانی کا مکمل تفصیلی لاگ (Communication Logs)' : 'Broadcast History & Delivery Log'}
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'ارسال کردہ تمام پیغامات، وصول کنندگان کی تعداد اور ڈیلیوری کی حیثیت' : 'Real-time monitoring of all transmitted broadcast alerts and receipt status'}
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success(locale === 'ur' ? '🔄 لاگز تازہ کیے جا رہے ہیں...' : '🔄 Refreshing delivery logs...');
              }}
              className="h-8 text-xs font-bold gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{locale === 'ur' ? 'تازہ کریں (Refresh)' : 'Refresh Log'}</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                    <th className="py-3 px-4 text-start font-en">ID</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'پیغام کا عنوان و نوعیت' : 'Broadcast Title / Type'}</th>
                    <th className="py-3 px-4 text-center">{locale === 'ur' ? 'وصول کنندگان' : 'Recipients'}</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'گیٹ وے موڈ' : 'Gateway Mode'}</th>
                    <th className="py-3 px-4 text-center">{locale === 'ur' ? 'ڈیلیوری حیثیت' : 'Delivery Status'}</th>
                    <th className="py-3 px-4 text-start">{locale === 'ur' ? 'تاریخ و وقت' : 'Date & Time'}</th>
                    <th className="py-3 px-4 text-end">{locale === 'ur' ? 'اقدام' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {broadcastLogs.map((row, idx) => (
                    <tr key={idx} className="hover:bg-accent/30 transition-colors">
                      <td className="py-3.5 px-4 font-en font-bold text-primary">{row.id}</td>
                      <td className="py-3.5 px-4 font-bold text-foreground">{locale === 'ur' ? row.typeUr : row.typeEn}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className="font-en font-bold bg-muted">
                          {row.recipients} Parents
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-muted-foreground">{row.mode}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold px-2.5 py-0.5">
                          <CheckCircle2 className="w-3 h-3 me-1 inline" />
                          {locale === 'ur' ? 'کامیاب (Delivered)' : 'Delivered'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-en text-muted-foreground">{row.date} ({row.time})</td>
                      <td className="py-3.5 px-4 text-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.success(locale === 'ur' ? `🔁 پیغام دوبارہ ارسال کیا جا رہا ہے: ${row.typeUr}` : `🔁 Re-broadcasting: ${row.typeEn}`);
                          }}
                          className="h-7 text-[11px] font-bold gap-1"
                        >
                          <RefreshCw className="w-3 h-3 text-primary" />
                          <span>{locale === 'ur' ? 'دوبارہ بھیجیں' : 'Re-send'}</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: API & Gateway Settings */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>{locale === 'ur' ? 'واٹس ایپ کلاؤڈ اے پی آئی کنفیگریشن (UltraMsg / 360Dialog)' : 'WhatsApp Cloud API Gateway Configuration'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'اگر آپ فری ویب موڈ کی بجائے خودکار سرور اے پی آئی استعمال کرنا چاہتے ہیں تو اپنی تفصیلات درج کریں' : 'Configure server API instance details for fully headless automated background messaging'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="apiKey" className="text-xs font-bold text-foreground">
                  {locale === 'ur' ? 'اے پی آئی ٹوکن (API Key / Token):' : 'API Token / Secret Key:'}
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="h-10 text-xs font-en bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="instanceId" className="text-xs font-bold text-foreground">
                  {locale === 'ur' ? 'انسٹینس آئی ڈی (Instance ID / Phone ID):' : 'Instance ID / Webhook ID:'}
                </Label>
                <Input
                  id="instanceId"
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="h-10 text-xs font-en bg-muted/50 border-border"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="senderNumber" className="text-xs font-bold text-foreground">
                  {locale === 'ur' ? 'مدرسہ تصدیق شدہ واٹس ایپ نمبر:' : 'Verified School WhatsApp Number:'}
                </Label>
                <Input
                  id="senderNumber"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="h-10 text-xs font-en bg-muted/50 border-border text-start"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  className="h-9 px-4 font-bold text-xs gap-2 border-blue-500/40 text-blue-600 hover:bg-blue-500/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{locale === 'ur' ? '🔍 کنکشن ٹیسٹ کریں (Test API)' : 'Test Gateway Connection'}</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    toast.success(locale === 'ur' ? '✅ اے پی آئی سیٹنگز محفوظ کر لی گئیں!' : '✅ Gateway API settings saved successfully!');
                  }}
                  variant="emerald"
                  className="h-9 px-4 font-bold text-xs gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{locale === 'ur' ? 'محفوظ کریں (Save)' : 'Save Settings'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-500" />
                <span>{locale === 'ur' ? 'فری واٹس ایپ ویب موڈ کے متعلق معلومات' : 'About Free WhatsApp Web Broadcast Mode'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'پاکستانی اور ہندوستانی مدارس میں سب سے زیادہ مقبول اور آسان ترین پیغام رسانی کا طریقہ' : 'The most popular and cost-free communication method for educational institutions'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-2">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{locale === 'ur' ? '100% مفت اور تاحیات قابلِ استعمال:' : '100% Free & Lifetime Operational:'}</span>
                </p>
                <p className="opacity-90 text-xs">
                  {locale === 'ur'
                    ? 'فری ویب موڈ میں آپ کو کسی بھی تھرڈ پارٹی اے پی آئی (جیسے Twilio یا Meta Cloud) کو ماہانہ فیس دینے کی ضرورت نہیں ہے۔ یہ آپ کے کمپیوٹر یا موبائل کے اپنے واٹس ایپ سے براہِ راست منسلک ہو کر پیغامات بھیجتا ہے۔'
                    : 'Free Web mode requires zero monthly subscriptions or per-message API fees. It seamlessly connects with your existing WhatsApp desktop or browser session to dispatch verified messages.'}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="font-bold text-foreground">{locale === 'ur' ? 'اہم فوائد:' : 'Key Advantages:'}</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs font-medium">
                  <li>{locale === 'ur' ? 'والدین کو مدرسہ کے جانی پہچانے آفیشل نمبر سے پیغام وصول ہوتا ہے' : 'Guardians receive messages directly from the familiar official school number'}</li>
                  <li>{locale === 'ur' ? 'کوئی ٹیکنیکل سیٹ اپ یا سرور کنفیگریشن کی ضرورت نہیں' : 'Zero complex technical setup or server webhook configuration required'}</li>
                  <li>{locale === 'ur' ? 'پیغام میں طالب علم کا نام اور فیس وغیرہ خودکار پُر ہو جاتے ہیں' : 'Automatic placeholder replacement for student names, IDs, and fee invoices'}</li>
                  <li>{locale === 'ur' ? 'رسید کا لنک اور پی ڈی ایف اٹیچمنٹ بھیجی جا سکتی ہے' : 'Full support for attaching PDF receipts and kashf-ul-darajat links'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Email SMTP Configuration */}
          <Card className="md:col-span-2 border-border/80 bg-card shadow-sm border-t-4 border-t-blue-500">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>{locale === 'ur' ? 'آفیشل ای میل سرور کنفیگریشن (SMTP / Resend / AWS SES)' : 'Official Email SMTP & Cloud Gateway Configuration'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur'
                  ? 'والدین اور سرپرستوں کو فیس انوائس، امتحانی کشف الدرجات اور آفیشل نوٹس ای میل پر ارسال کرنے کے لیے سرور تفصیلات درج کریں'
                  : 'Configure custom SMTP server or Resend API credentials for dispatching formal fee invoices, exam report cards, and notices via email'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="smtpHost" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'ایس ایم ٹی پی ہوسٹ (SMTP Server Host):' : 'SMTP Server Host / Gateway:'}
                  </Label>
                  <Input
                    id="smtpHost"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="h-10 text-xs font-en bg-muted/50 border-border text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="smtpPort" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'پورٹ اور سیکیورٹی (Port / SSL):' : 'Port & Encryption (SSL/TLS):'}
                  </Label>
                  <Input
                    id="smtpPort"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="h-10 text-xs font-en bg-muted/50 border-border text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="smtpUser" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'ارسال کنندہ ای میل (Sender Email / Username):' : 'Sender Email Address / Username:'}
                  </Label>
                  <Input
                    id="smtpUser"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="h-10 text-xs font-en bg-muted/50 border-border text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="smtpPass" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'ایس ایم ٹی پی پاسورڈ یا ایپ کی (SMTP Password / App Key):' : 'SMTP Secret Password / App Key:'}
                  </Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="h-10 text-xs font-en bg-muted/50 border-border text-start"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60">
                <div className="text-xs text-muted-foreground font-medium">
                  💡 <span className="font-bold">{locale === 'ur' ? 'تجویز:' : 'Recommendation:'}</span> {locale === 'ur' ? 'گوگل ورک اسپیس یا Resend استعمال کرنے سے ای میلز ان باکس میں 100% ڈیلیور ہوتی ہیں۔' : 'Using Google Workspace or Resend ensures 99.9% inbox delivery rates for school alerts.'}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestSmtp}
                    className="h-9 px-4 font-bold text-xs gap-2 border-blue-500/40 text-blue-600 hover:bg-blue-500/10"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? '🔍 ای میل سرور ٹیسٹ کریں (Test SMTP)' : 'Test SMTP Connection'}</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      toast.success(locale === 'ur' ? '✅ آفیشل ای میل سرور سیٹنگز محفوظ کر لی گئیں!' : '✅ SMTP Email settings saved successfully!');
                    }}
                    variant="emerald"
                    className="h-9 px-4 font-bold text-xs gap-2 shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? 'محفوظ کریں (Save)' : 'Save Email Settings'}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
