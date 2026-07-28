"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Trash2, Users, Building2, BookOpen, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const URDU_DAYS: Record<string, string> = {
  monday: 'پیر',
  tuesday: 'منگل',
  wednesday: 'بدھ',
  thursday: 'جمعرات',
  friday: 'جمعہ',
  saturday: 'ہفتہ',
  sunday: 'اتوار'
};

export function TimetableManager() {
  const { locale, dir } = useLanguage();
  const supabase = createClient();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teacherDepts, setTeacherDepts] = useState<any[]>([]);
  const [timetables, setTimetables] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    day_of_week: 'monday',
    subject_id: '',
    teacher_id: 'none',
    start_time: '08:00',
    end_time: '09:00',
    room_number: ''
  });

  const fetchBaseData = async () => {
    const { data: cls } = await (supabase as any).from('classes').select('*');
    const { data: sec } = await (supabase as any).from('sections').select('*');
    const { data: sub } = await (supabase as any).from('subjects').select('*');
    const { data: tch } = await (supabase as any).from('profiles').select('*').in('role', ['teacher', 'admin']);
    const { data: td } = await (supabase as any).from('teacher_departments').select('*');
    
    if (cls) setClasses(cls);
    if (sec) setSections(sec);
    if (sub) setSubjects(sub);
    if (tch) setTeachers(tch);
    if (td) setTeacherDepts(td);
  };

  const fetchTimetables = async (classId: string, sectionId: string) => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from('timetables')
        .select(`
          *,
          subjects(name_ur, name_en, code),
          profiles(full_name)
        `)
        .eq('class_id', classId)
        .order('start_time', { ascending: true });

      if (sectionId !== 'all') {
        query = query.eq('section_id', sectionId);
      } else {
        query = query.is('section_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTimetables(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetables(selectedClass, selectedSection);
    } else {
      setTimetables([]);
    }
  }, [selectedClass, selectedSection]);

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !newEntry.subject_id) return toast.error(locale === 'ur' ? 'درجہ اور مضمون منتخب کریں' : 'Select class and subject');
    
    try {
      const row = {
        class_id: selectedClass,
        section_id: selectedSection === 'all' ? null : selectedSection,
        subject_id: newEntry.subject_id,
        teacher_id: newEntry.teacher_id === 'none' ? null : newEntry.teacher_id,
        day_of_week: newEntry.day_of_week,
        start_time: newEntry.start_time,
        end_time: newEntry.end_time,
        room_number: newEntry.room_number || null
      };

      const { error } = await (supabase as any).from('timetables').insert([row]);
      if (error) throw error;
      
      toast.success(locale === 'ur' ? 'پیریڈ شامل کر دیا گیا' : 'Period added');
      setIsModalOpen(false);
      fetchTimetables(selectedClass, selectedSection);
      // Reset times for next entry (smart default based on last end_time)
      setNewEntry({ ...newEntry, start_time: newEntry.end_time, subject_id: '' });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await (supabase as any).from('timetables').delete().eq('id', id);
      toast.success(locale === 'ur' ? 'پیریڈ حذف کر دیا گیا' : 'Period deleted');
      fetchTimetables(selectedClass, selectedSection);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Just HH:MM
  };

  return (
    <div className="space-y-6 font-ur">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            {locale === 'ur' ? 'نظام الاوقات (Timetable)' : 'Timetable Manager'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === 'ur' ? 'کلاسز کا شیڈول اور پیریڈز ترتیب دیں' : 'Manage class schedules and periods'}
          </p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ منتخب کریں *' : 'Select Class *'}</Label>
              <Select value={selectedClass} onValueChange={(val) => { setSelectedClass(val); setSelectedSection('all'); }}>
                <SelectTrigger className="h-10 text-xs bg-background"><SelectValue placeholder="درجہ..." /></SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{locale === 'ur' ? c.name_ur : c.name_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{locale === 'ur' ? 'سیکشن (اختیاری)' : 'Section (Optional)'}</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
                <SelectTrigger className="h-10 text-xs bg-background"><SelectValue placeholder="سیکشن..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{locale === 'ur' ? 'تمام / مشترک' : 'All / Shared'}</SelectItem>
                  {sections.filter(s => s.class_id === selectedClass).map(s => (
                    <SelectItem key={s.id} value={s.id}>{locale === 'ur' ? s.name_ur : s.name_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedClass ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Building2 className="w-12 h-12 mb-3 opacity-20" />
              <p>{locale === 'ur' ? 'ٹائم ٹیبل دیکھنے کے لیے درجہ منتخب کریں' : 'Select a class to view timetable'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px] p-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-primary">
                    {locale === 'ur' ? 'ہفتہ وار شیڈول' : 'Weekly Schedule'}
                  </h3>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="emerald" size="sm" className="font-bold">
                        <Plus className="w-4 h-4 me-1.5" />
                        {locale === 'ur' ? 'نیا پیریڈ' : 'Add Period'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="font-ur sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-600">
                          <Clock className="w-5 h-5" />
                          {locale === 'ur' ? 'نئے پیریڈ کا اندراج' : 'Add New Period'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSaveEntry} className="space-y-4 pt-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">{locale === 'ur' ? 'دن *' : 'Day *'}</Label>
                          <Select value={newEntry.day_of_week} onValueChange={(val) => setNewEntry({...newEntry, day_of_week: val})}>
                            <SelectTrigger className="h-10 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {DAYS.map(day => (
                                <SelectItem key={day} value={day}>{locale === 'ur' ? URDU_DAYS[day] : day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold">{locale === 'ur' ? 'شروع کا وقت *' : 'Start Time *'}</Label>
                            <Input type="time" value={newEntry.start_time} onChange={e => setNewEntry({...newEntry, start_time: e.target.value})} className="h-10 text-xs font-en text-start" required />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold">{locale === 'ur' ? 'ختم کا وقت *' : 'End Time *'}</Label>
                            <Input type="time" value={newEntry.end_time} onChange={e => setNewEntry({...newEntry, end_time: e.target.value})} className="h-10 text-xs font-en text-start" required />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">{locale === 'ur' ? 'مضمون *' : 'Subject *'}</Label>
                          <Select value={newEntry.subject_id} onValueChange={(val) => setNewEntry({...newEntry, subject_id: val})}>
                            <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="مضمون" /></SelectTrigger>
                            <SelectContent>
                              {subjects.map(s => (
                                <SelectItem key={s.id} value={s.id}>{locale === 'ur' ? s.name_ur : s.name_en}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">{locale === 'ur' ? 'استاد' : 'Teacher'}</Label>
                          <Select value={newEntry.teacher_id} onValueChange={(val) => setNewEntry({...newEntry, teacher_id: val})}>
                            <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="کوئی نہیں" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">{locale === 'ur' ? 'طے نہیں' : 'None'}</SelectItem>
                              {(() => {
                                const targetClass = classes.find(c => c.id === selectedClass);
                                const deptId = targetClass?.department_id;
                                const allowedTeacherIds = deptId ? teacherDepts.filter(td => td.department_id === deptId).map(td => td.teacher_id) : [];
                                const availableTeachers = allowedTeacherIds.length > 0 ? teachers.filter(t => allowedTeacherIds.includes(t.id)) : teachers;
                                
                                return availableTeachers.map(t => (
                                  <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                                ));
                              })()}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold">{locale === 'ur' ? 'کمرہ / روم' : 'Room Number'}</Label>
                          <Input value={newEntry.room_number} onChange={e => setNewEntry({...newEntry, room_number: e.target.value})} className="h-10 text-xs text-start font-en" />
                        </div>

                        <DialogFooter>
                          <Button type="submit" variant="emerald" className="w-full font-bold">
                            {locale === 'ur' ? 'محفوظ کریں' : 'Save'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {DAYS.map(day => {
                    const dayPeriods = timetables.filter(t => t.day_of_week === day);
                    if (dayPeriods.length === 0) return null;

                    return (
                      <div key={day} className="flex flex-col gap-2 bg-muted/20 p-3 rounded-xl border border-border/50">
                        <div className="w-full pb-2 border-b border-border/60">
                          <span className="font-bold text-sm text-foreground bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {locale === 'ur' ? URDU_DAYS[day] : day.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1">
                          {dayPeriods.map(period => (
                            <div key={period.id} className="relative group bg-card border border-border shadow-sm rounded-lg p-3 min-w-[200px] flex-1 max-w-[280px] hover:border-primary/50 transition-colors">
                              <button 
                                onClick={() => handleDelete(period.id)}
                                className="absolute top-2 end-2 p-1.5 bg-destructive/10 text-destructive rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="text-[11px] font-bold text-muted-foreground font-en flex items-center gap-1.5 mb-1.5">
                                <Clock className="w-3 h-3" />
                                {formatTime(period.start_time)} - {formatTime(period.end_time)}
                              </div>
                              <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                                {locale === 'ur' ? period.subjects?.name_ur : period.subjects?.name_en}
                              </p>
                              {period.profiles && (
                                <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5" />
                                  {period.profiles.full_name}
                                </p>
                              )}
                              {period.room_number && (
                                <p className="text-[10px] text-muted-foreground mt-1 font-en bg-muted inline-block px-1.5 py-0.5 rounded">
                                  Room: {period.room_number}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {timetables.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-xl border-border/60">
                      {locale === 'ur' ? 'اس کلاس کا کوئی ٹائم ٹیبل موجود نہیں۔' : 'No timetable added for this class yet.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
