"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';
import { 
  Home, 
  Bed, 
  Clock, 
  Users, 
  Building2, 
  CalendarCheck, 
  MessageSquare, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Sun, 
  Moon, 
  BellRing, 
  ShieldCheck, 
  ArrowRightLeft,
  FileText
} from 'lucide-react';

export default function WardenDashboardPage() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rooms' | 'prayers' | 'notices'>('rooms');
  const [selectedFloor, setSelectedFloor] = useState('floor1');
  const [searchQuery, setSearchQuery] = useState('');

  // Room Allocation State
  const [rooms, setRooms] = useState([
    { id: '101', nameUr: 'کمرہ 101 - ابوبکر صدیق رضي اللہ عنہ بلاک', nameEn: 'Room 101 - Abu Bakr Block', floor: 'floor1', capacity: 6, current: 6, monitorUr: 'حافظ زبیر (نگرانِ کمرہ)', status: 'full' },
    { id: '102', nameUr: 'کمرہ 102 - ابوبکر صدیق رضي اللہ عنہ بلاک', nameEn: 'Room 102 - Abu Bakr Block', floor: 'floor1', capacity: 6, current: 5, monitorUr: 'محمد حسان (نگرانِ کمرہ)', status: 'available' },
    { id: '103', nameUr: 'کمرہ 103 - ابوبکر صدیق رضي اللہ عنہ بلاک', nameEn: 'Room 103 - Abu Bakr Block', floor: 'floor1', capacity: 6, current: 4, monitorUr: 'عبداللہ بن عمر (نگرانِ کمرہ)', status: 'available' },
    { id: '201', nameUr: 'کمرہ 201 - عمر فاروق رضي اللہ عنہ بلاک', nameEn: 'Room 201 - Umar Farooq Block', floor: 'floor2', capacity: 8, current: 8, monitorUr: 'قاری بلال (نگرانِ کمرہ)', status: 'full' },
    { id: '202', nameUr: 'کمرہ 202 - عمر فاروق رضي اللہ عنہ بلاک', nameEn: 'Room 202 - Umar Farooq Block', floor: 'floor2', capacity: 8, current: 7, monitorUr: 'سعد بن معاذ (نگرانِ کمرہ)', status: 'available' },
    { id: '301', nameUr: 'کمرہ 301 - عثمان غنی رضي اللہ عنہ بلاک', nameEn: 'Room 301 - Usman Ghani Block', floor: 'floor3', capacity: 10, current: 10, monitorUr: 'طلحہ محمود (نگرانِ کمرہ)', status: 'full' },
  ]);

  // Students in Rooms State
  const [students, setStudents] = useState([
    { id: 'ST-01', nameUr: 'محمد زبیر بن عبداللہ', nameEn: 'Zubair Abdullah', classUr: 'درجہ اولیٰ (ناظرہ)', room: '101', floorUr: 'منزل اول' },
    { id: 'ST-02', nameUr: 'عمران خان بن سلطان', nameEn: 'Imran Khan', classUr: 'درجہ ثالثہ (عالمیت)', room: '102', floorUr: 'منزل اول' },
    { id: 'ST-03', nameUr: 'بلال احمد بن یوسف', nameEn: 'Bilal Ahmed', classUr: 'شعبہ حفظ و تجوید', room: '201', floorUr: 'منزل دوم' },
    { id: 'ST-04', nameUr: 'طلحہ محمود بن شاہد', nameEn: 'Talha Mehmood', classUr: 'درجہ خامسہ', room: '301', floorUr: 'منزل سوم' },
  ]);

  // Prayer Attendance State
  const [prayers, setPrayers] = useState([
    { id: 'fajr', nameUr: 'نمازِ فجر (وقتِ بیداری: 4:30 صبح)', nameEn: 'Fajr Prayer (Wakeup 4:30 AM)', icon: Sun, present: 174, total: 180, status: 'checked', noteUr: 'تمام بلاکس کے طلباء بیدار اور مسجد میں حاضر ہوئے' },
    { id: 'dhuhr', nameUr: 'نمازِ ظہر (باجماعت)', nameEn: 'Dhuhr Prayer (Jamaat)', icon: Sun, present: 178, total: 180, status: 'checked', noteUr: 'درس و تدریس کے وقفے میں مکمل حاضری' },
    { id: 'asr', nameUr: 'نمازِ عصر (باجماعت)', nameEn: 'Asr Prayer (Jamaat)', icon: Sun, present: 176, total: 180, status: 'checked', noteUr: 'کھیل اور تلاوت کے بعد مسجد میں حاضری' },
    { id: 'maghrib', nameUr: 'نمازِ مغرب اور اوابین', nameEn: 'Maghrib Prayer & Awabeen', icon: Moon, present: 180, total: 180, status: 'checked', noteUr: 'مکمل 100% حاضری الحمدللہ' },
    { id: 'isha', nameUr: 'نمازِ عشاء اور شب خوابی بیداری چیک', nameEn: 'Isha Prayer & Night Roll Call', icon: Moon, present: 0, total: 180, status: 'pending', noteUr: 'رات 9:30 بجے باجماعت نماز اور پھر کمروں کی چیکنگ ہوگی' },
  ]);

  // Notices State
  const [notices, setNotices] = useState([
    { id: '1', titleUr: 'رات 10 بجے کے بعد ہاسٹل کے مرکزی دروازے بند کرنے کا حکم', titleEn: 'Hostel Gate Curfew at 10:00 PM', date: '2026-07-26', authorUr: 'ناظمِ دارالاقامہ', type: 'urgent' },
    { id: '2', titleUr: 'کل صبح فجر کے فوراً بعد تمام کمروں کی صفائی اور بستروں کا معائنہ', titleEn: 'Morning Room Cleanliness Inspection after Fajr', date: '2026-07-25', authorUr: 'ناظمِ دارالاقامہ', type: 'notice' },
    { id: '3', titleUr: 'جمعرات شب مغرب کے بعد مسجد میں خصوصی اصلاحی و روحانی مجلس', titleEn: 'Special Thursday Spiritual Gathering after Maghrib', date: '2026-07-24', authorUr: 'مہتمم صاحب', type: 'event' },
  ]);

  // Modal State
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [targetRoom, setTargetRoom] = useState('102');

  const handleOpenRoomChange = (student: any) => {
    setSelectedStudent(student);
    setTargetRoom(student.room);
    setRoomModalOpen(true);
  };

  const handleConfirmRoomChange = () => {
    if (!selectedStudent) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? { ...s, room: targetRoom } : s))
    );
    toast.success(
      locale === 'ur'
        ? `ماشاء اللہ! ${selectedStudent.nameUr} کو کمرہ #${targetRoom} میں منتقل کر دیا گیا ہے!`
        : `Success! Student re-allocated to Room #${targetRoom}.`
    );
    setRoomModalOpen(false);
  };

  const handleTogglePrayer = (id: string) => {
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'checked' ? 'pending' : 'checked';
          toast.success(locale === 'ur' ? `${p.nameUr} کی حاضری اور بیداری اسٹیٹس اپڈیٹ ہو گیا!` : `Prayer attendance status updated!`);
          return { ...p, status: nextStatus, present: nextStatus === 'checked' ? p.total : 0 };
        }
        return p;
      })
    );
  };

  const filteredRooms = rooms.filter((r) => r.floor === selectedFloor || selectedFloor === 'all');
  const filteredStudents = students.filter(
    (s) =>
      s.nameUr.includes(searchQuery) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.includes(searchQuery)
  );

  return (
    <div className={`space-y-6 animate-in fade-in-50 duration-300 ${locale === 'ur' ? 'font-ur' : 'font-en'}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{locale === 'ur' ? 'شعبہ دارالاقامہ و رہائش (Hostel & Residency Hub)' : 'Darul Iqama & Residency Hub'}</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Home className="w-8 h-8 text-indigo-400 shrink-0" />
            <span>{locale === 'ur' ? 'ناظمِ دارالاقامہ مرکزی کنٹرول پورٹل' : 'Hostel Warden Central Control Desk'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-medium">
            {locale === 'ur'
              ? 'جامعہ کے مقیم طلباء کی کمرہ وار رہائش، منزلوں کی تقسیم، پانچوں وقت نمازوں اور صبح فجر میں جگانے کا نظام، اور ہاسٹل کی روزانہ ہدایات و اعلانات کو یہاں سے کنٹرول کریں۔'
              : 'Manage student room allocation across floors, 5-time prayer wakeup roll call, and official hostel notice bulletins.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <Button
            type="button"
            variant="emerald"
            onClick={() => toast.success(locale === 'ur' ? 'فجر بیداری کا الرٹ تمام اساتذہ کو بھیج دیا گیا ہے!' : 'Fajr Wakeup alert broadcasted!')}
            className="font-extrabold text-xs px-5 py-5 rounded-xl shadow-lg gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500"
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            <span>{locale === 'ur' ? 'فجر بیداری الرٹ بھیجیں' : 'Broadcast Wakeup Alert'}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveTab('notices')}
            className="font-bold text-xs px-4 py-5 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'ur' ? 'نیا ہاسٹل اعلان' : 'New Bulletin'}</span>
          </Button>
        </div>
      </div>

      {/* 4 Warden Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-indigo-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل مقیم طلباء (Hostelers)' : 'Total Resident Students'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground font-en">180</div>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span>{locale === 'ur' ? '3 بلاکس اور منزلوں میں مقیم' : 'Residing across 3 Blocks'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-emerald-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'فجر بیداری حاضری (Fajr Wakup)' : 'Fajr Wakeup & Attendance'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Sun className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600 font-en">96.6%</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              <span>{locale === 'ur' ? '174/180 طلباء باجماعت حاضر' : '174/180 attended Jamaat'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-purple-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'دستیاب کمرے (Rooms)' : 'Room Occupancy Status'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Bed className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-purple-600 font-en">30 {locale === 'ur' ? 'کمرے' : 'Rooms'}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              <span>{locale === 'ur' ? '4 کمروں میں مزید گنجائش موجود' : '4 rooms currently have spare beds'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-md rounded-2xl bg-card overflow-hidden relative group hover:border-amber-500/50 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'فعال اعلانات (Bulletins)' : 'Active Notice Board Bulletins'}</CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-amber-600 font-en">3 {locale === 'ur' ? 'اعلانات' : 'Active'}</div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-500" />
              <span>{locale === 'ur' ? 'طلباء و والدین پورٹل پر لائیو' : 'Broadcasted to student portal'}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-2 overflow-x-auto">
        <Button
          type="button"
          variant={activeTab === 'rooms' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('rooms')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <Building2 className="w-4 h-4" />
          <span>{locale === 'ur' ? '1. رہائش، منزلیں اور کمروں کی تقسیم' : '1. Room & Floor Allocation'}</span>
        </Button>
        <Button
          type="button"
          variant={activeTab === 'prayers' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('prayers')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <Clock className="w-4 h-4" />
          <span>{locale === 'ur' ? '2. نمازوں کی باجماعت حاضری اور بیداری' : '2. Prayer Wakeup & Roll Call'}</span>
        </Button>
        <Button
          type="button"
          variant={activeTab === 'notices' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('notices')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{locale === 'ur' ? '3. دارالاقامہ اعلانات اور ہدایات' : '3. Hostel Notice Board'}</span>
        </Button>
      </div>

      {/* Tab 1: Room & Floor Allocation */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          {/* Floor Selection Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">{locale === 'ur' ? 'منزل / بلاک منتخب کریں:' : 'Select Floor Block:'}</span>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant={selectedFloor === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedFloor('all')}
                  className="text-xs font-bold rounded-lg h-8"
                >
                  {locale === 'ur' ? 'تمام منزلیں' : 'All Floors'}
                </Button>
                <Button
                  size="sm"
                  variant={selectedFloor === 'floor1' ? 'default' : 'outline'}
                  onClick={() => setSelectedFloor('floor1')}
                  className="text-xs font-bold rounded-lg h-8"
                >
                  {locale === 'ur' ? 'منزلِ اول (ابوبکر بلاک)' : 'Floor 1 (Abu Bakr)'}
                </Button>
                <Button
                  size="sm"
                  variant={selectedFloor === 'floor2' ? 'default' : 'outline'}
                  onClick={() => setSelectedFloor('floor2')}
                  className="text-xs font-bold rounded-lg h-8"
                >
                  {locale === 'ur' ? 'منزلِ دوم (عمر بلاک)' : 'Floor 2 (Umar)'}
                </Button>
                <Button
                  size="sm"
                  variant={selectedFloor === 'floor3' ? 'default' : 'outline'}
                  onClick={() => setSelectedFloor('floor3')}
                  className="text-xs font-bold rounded-lg h-8"
                >
                  {locale === 'ur' ? 'منزلِ سوم (عثمان بلاک)' : 'Floor 3 (Usman)'}
                </Button>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={locale === 'ur' ? 'طالب علم کا نام تلاش کریں...' : 'Search student...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs rounded-xl border-border bg-background"
              />
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((r) => (
              <Card key={r.id} className="border-border shadow-sm rounded-2xl bg-card overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3 border-b border-border flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-extrabold text-foreground">{r.nameUr}</CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground mt-0.5">{r.monitorUr}</CardDescription>
                  </div>
                  <Badge variant={r.status === 'full' ? 'destructive' : 'outline'} className="text-[10px] font-bold">
                    {r.status === 'full' ? (locale === 'ur' ? 'مکمل (Full)' : 'Full') : (locale === 'ur' ? 'گنجائش موجود' : 'Available')}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-3 pb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground font-semibold">{locale === 'ur' ? 'کمرے میں مقیم طلباء:' : 'Occupancy:'}</span>
                    <span className="font-en font-extrabold text-foreground">{r.current} / {r.capacity} {locale === 'ur' ? 'طلباء' : 'Beds'}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all ${r.current >= r.capacity ? 'bg-rose-500' : 'bg-indigo-600'}`}
                      style={{ width: `${(r.current / r.capacity) * 100}%` }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info(locale === 'ur' ? `کمرہ #${r.id} کے طلباء کی حاضری رجسٹر کھل رہا ہے...` : `Opening room #${r.id} attendance...`)}
                    className="w-full text-xs font-bold rounded-xl border-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10"
                  >
                    <span>{locale === 'ur' ? 'کمرے کی تفصیلی نگرانی' : 'View Room Members'}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Students Allocation Table */}
          <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/40 pb-4 border-b border-border">
              <CardTitle className="text-base font-extrabold flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>{locale === 'ur' ? 'طلباء کی کمرہ وار رہائش اور منتقلی کا ریکارڈ' : 'Student Residency & Room Transfer Registry'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'طالب علم کا نام' : 'Student Name'}</TableHead>
                      <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'درجہ و شعبہ' : 'Class & Dept'}</TableHead>
                      <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'منزل / بلاک' : 'Floor'}</TableHead>
                      <TableHead className="font-bold text-xs py-3.5 text-center">{locale === 'ur' ? 'موجودہ کمرہ نمبر' : 'Current Room'}</TableHead>
                      <TableHead className="font-bold text-xs py-3.5 text-end">{locale === 'ur' ? 'منتقلی (Change Room)' : 'Action'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="py-4 font-extrabold text-sm text-foreground">{locale === 'ur' ? s.nameUr : s.nameEn}</TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-muted-foreground">{s.classUr}</TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-indigo-600">{s.floorUr}</TableCell>
                        <TableCell className="py-4 text-center">
                          <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 font-en font-extrabold px-3 py-1">
                            Room #{s.room}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRoomChange(s)}
                            className="font-bold text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 rounded-xl gap-1.5 px-3"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>{locale === 'ur' ? 'کمرہ تبدیل کریں' : 'Change Room'}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Prayer Wakeup & Roll Call */}
      {activeTab === 'prayers' && (
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>{locale === 'ur' ? 'پانچوں وقت باجماعت نمازوں اور صبح فجر میں جگانے کا نظام' : 'Daily 5 Prayers Jamaat & Fajr Morning Wakeup System'}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {locale === 'ur'
                  ? 'تمام ہاسٹل بلاکس میں نمازوں کی بیداری، حاضری اور اصلاحی نگرانی کا روزنامچہ'
                  : 'Track prayer roll calls, wakeup alarms and Jamaat attendance across all residency floors.'}
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-3.5 py-1.5 font-bold text-xs">
              {locale === 'ur' ? 'آج کی حاضری: 96.6% بیدار و حاضر' : "Today's Attendance: 96.6% Present"}
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
              <Sun className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-sm text-foreground">{locale === 'ur' ? 'صبح صادق اور نمازِ فجر میں بیداری کا خصوصی اہتمام' : 'Special Morning Fajr Wakup Protocol'}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {locale === 'ur'
                    ? 'دارالاقامہ کے تمام نگران اساتذہ صبح 4:30 بجے بیدار ہو کر کمرہ وار طلباء کو باجماعت نمازِ فجر کے لیے بیدار کرتے ہیں۔ کسی بھی غیر حاضر طالب علم کی اطلاع فوراً پرنسپل اور والدین کو بھیجی جاتی ہے۔'
                    : 'Warden and floor monitors awaken all students at 4:30 AM for Fajr Jamaat in the central mosque. Automated alerts notify parents of any unexcused absences.'}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {prayers.map((p) => {
                const IconComponent = p.icon;
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      p.status === 'checked' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-card border-border hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        p.status === 'checked' ? 'bg-emerald-500/20 text-emerald-600 font-bold' : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-foreground flex items-center gap-2">
                          <span>{p.nameUr}</span>
                          {p.status === 'checked' && (
                            <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">{locale === 'ur' ? 'مکمل حاضر' : 'Checked'}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{p.noteUr}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end">
                      <div className="text-end font-en">
                        <div className="text-sm font-extrabold text-foreground">{p.present} / {p.total}</div>
                        <div className="text-[10px] text-muted-foreground">{locale === 'ur' ? 'طلباء حاضر' : 'Attended'}</div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={p.status === 'checked' ? 'outline' : 'emerald'}
                        onClick={() => handleTogglePrayer(p.id)}
                        className={`rounded-xl font-bold text-xs px-4 h-10 gap-1.5 ${
                          p.status === 'checked' ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : ''
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{p.status === 'checked' ? (locale === 'ur' ? 'حاضری درج (Checked)' : 'Checked') : (locale === 'ur' ? 'حاضری لگائیں (Check)' : 'Mark Attendance')}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Hostel Notice Board */}
      {activeTab === 'notices' && (
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <span>{locale === 'ur' ? 'دارالاقامہ کے اعلانات، ہدایات اور شب خوابی قوانین' : 'Hostel Notice Board & Residency Instructions'}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {locale === 'ur'
                  ? 'یہاں جاری کیے گئے اعلانات براہِ راست طلباء اور ان کے والدین کے پورٹل پر ظاہر ہوتے ہیں'
                  : 'Published bulletins appear instantly on student and parent mobile dashboards.'}
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="emerald"
              onClick={() => toast.success(locale === 'ur' ? 'نیا اعلان کامیابی کے ساتھ شائع کر دیا گیا ہے!' : 'New bulletin published!')}
              className="font-extrabold text-xs px-5 py-4 rounded-xl shadow-md gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === 'ur' ? '+ نیا ہاسٹل اعلان جاری کریں' : '+ Publish Bulletin'}</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {notices.map((n) => (
              <div key={n.id} className="p-5 rounded-2xl bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold">
                      {n.type === 'urgent' ? (locale === 'ur' ? 'حکم / ضروری' : 'Urgent') : (locale === 'ur' ? 'ہدایت' : 'Notice')}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-en">{n.date}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-foreground">{n.titleUr}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{locale === 'ur' ? `جاری کردہ: ${n.authorUr}` : `Issued by: ${n.authorUr}`}</p>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info(locale === 'ur' ? 'اعلان کا متن کاپی اور واٹس ایپ پر بھیجا جا رہا ہے...' : 'Broadcasting bulletin via WhatsApp...')}
                    className="font-bold text-xs rounded-xl px-4"
                  >
                    <span>{locale === 'ur' ? 'واٹس ایپ پر بھیجیں' : 'WhatsApp Share'}</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Room Change Modal */}
      <Dialog open={roomModalOpen} onOpenChange={setRoomModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border text-foreground">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-1">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-black">{locale === 'ur' ? 'طالب علم کا کمرہ تبدیل کریں' : 'Re-allocate Student Room'}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {locale === 'ur' ? `آپ ${selectedStudent?.nameUr} کی رہائش منتقلی کر رہے ہیں:` : `Select target room for ${selectedStudent?.nameEn}:`}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4 py-3">
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border">
                <div className="text-xs font-extrabold text-foreground">{selectedStudent.nameUr}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{selectedStudent.classUr} - موجودہ: کمرہ #{selectedStudent.room}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-room" className="text-xs font-bold text-foreground">{locale === 'ur' ? 'نیا کمرہ منتخب کریں:' : 'Target Room:'}</Label>
                <Select value={targetRoom} onValueChange={setTargetRoom}>
                  <SelectTrigger id="target-room" className="h-11 rounded-xl text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="101" className="text-xs py-2 font-bold">کمرہ 101 - ابوبکر بلاک (منزل اول)</SelectItem>
                    <SelectItem value="102" className="text-xs py-2 font-bold">کمرہ 102 - ابوبکر بلاک (منزل اول)</SelectItem>
                    <SelectItem value="103" className="text-xs py-2 font-bold">کمرہ 103 - ابوبکر بلاک (منزل اول)</SelectItem>
                    <SelectItem value="201" className="text-xs py-2 font-bold">کمرہ 201 - عمر فاروق بلاک (منزل دوم)</SelectItem>
                    <SelectItem value="202" className="text-xs py-2 font-bold">کمرہ 202 - عمر فاروق بلاک (منزل دوم)</SelectItem>
                    <SelectItem value="301" className="text-xs py-2 font-bold">کمرہ 301 - عثمان غنی بلاک (منزل سوم)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={() => setRoomModalOpen(false)} className="rounded-xl font-bold text-xs h-11">
              {locale === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </Button>
            <Button type="button" variant="emerald" onClick={handleConfirmRoomChange} className="rounded-xl font-extrabold text-xs h-11 px-6 shadow-md">
              <span>{locale === 'ur' ? 'منتقلی منظور کریں' : 'Confirm Allocation'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
