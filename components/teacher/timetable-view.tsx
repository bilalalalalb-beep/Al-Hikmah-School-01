"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, BookOpen, Building2, CalendarRange } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

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

export function TeacherTimetable() {
  const { locale, dir } = useLanguage();
  const supabase = createClient();
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTimetable = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await (supabase as any)
          .from('timetables')
          .select(`
            *,
            subjects(name_ur, name_en, code),
            classes(name_ur, name_en),
            sections(name_ur, name_en)
          `)
          .eq('teacher_id', user.id)
          .order('start_time', { ascending: true });

        if (error) throw error;
        setTimetables(data || []);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTimetable();
  }, []);

  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Just HH:MM
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className="space-y-6 font-ur">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <CalendarRange className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {locale === 'ur' ? 'میرا ٹائم ٹیبل' : 'My Timetable'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === 'ur' ? 'آپ کی تدریسی مصروفیات کا ہفتہ وار شیڈول' : 'Your weekly teaching schedule'}
          </p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center p-8"><span className="animate-spin text-2xl">⏳</span></div>
          ) : timetables.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center border border-dashed rounded-xl border-border/60">
              <Clock className="w-12 h-12 mb-3 opacity-20" />
              <p>{locale === 'ur' ? 'آپ کو تاحال کوئی کلاس تفویض نہیں کی گئی۔' : 'No classes assigned to you yet.'}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {DAYS.map(day => {
                const dayPeriods = timetables.filter(t => t.day_of_week === day);
                if (dayPeriods.length === 0) return null;
                
                const isToday = day === today;

                return (
                  <div key={day} className={`flex flex-col gap-2 p-4 rounded-xl border ${isToday ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20 shadow-sm' : 'bg-muted/10 border-border/50'}`}>
                    <div className="w-full pb-2 border-b border-border/60 flex items-center justify-between">
                      <span className={`font-bold text-sm px-3 py-1 rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border shadow-sm'}`}>
                        {locale === 'ur' ? URDU_DAYS[day] : day.toUpperCase()}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                          {locale === 'ur' ? 'آج' : 'TODAY'}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {dayPeriods.map(period => (
                        <div key={period.id} className="bg-card border border-border shadow-sm rounded-lg p-3 hover:border-primary/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1.5 font-en">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTime(period.start_time)} - {formatTime(period.end_time)}
                            </div>
                            {period.room_number && (
                              <div className="text-[10px] text-muted-foreground font-en bg-muted px-1.5 py-0.5 rounded border">
                                {period.room_number}
                              </div>
                            )}
                          </div>
                          <p className="font-bold text-sm text-foreground flex items-center gap-1.5 mb-1">
                            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                            {locale === 'ur' ? period.subjects?.name_ur : period.subjects?.name_en}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {locale === 'ur' ? period.classes?.name_ur : period.classes?.name_en}
                            {period.sections && ` - ${locale === 'ur' ? period.sections.name_ur : period.sections.name_en}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
