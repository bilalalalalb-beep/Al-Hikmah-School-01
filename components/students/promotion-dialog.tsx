"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

interface PromotionDialogProps {
  studentCount?: number;
  fromClass?: string;
  onPromoteSuccess?: () => void;
}

export function PromotionDialog({ studentCount = 1, fromClass = "Grade 1 - Section A", onPromoteSuccess }: PromotionDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetClass, setTargetClass] = useState('');
  const [academicYear, setAcademicYear] = useState('2027-2028');
  const [loading, setLoading] = useState(false);
  const { locale, dir, t } = useLanguage();

  const classesList = [
    { id: 'c1', nameUrdu: 'درجہ دوم - الف (صبح)', name: 'Grade 2 - Section A (Morning)' },
    { id: 'c2', nameUrdu: 'درجہ دوم - ب (دوپہر)', name: 'Grade 2 - Section B (Afternoon)' },
    { id: 'c3', nameUrdu: 'حفظ القرآن - سال دوم (اعلیٰ)', name: 'Hifz - Year 2 (Advanced)' },
    { id: 'c4', nameUrdu: 'درس نظامی سال دوم (عالمیت)', name: 'Dars-e-Nizami Y2 (Alimiyah)' },
    { id: 'c5', nameUrdu: 'فارغ التحصیل / کورس مکمل', name: 'Graduated / Completed Course' },
  ];

  const handlePromote = () => {
    if (!targetClass) {
      toast.error(locale === 'ur' ? "براہ کرم ترقی دینے کے لیے منزل (Target Class) منتخب کریں۔" : "Please select a target class to promote students.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      const targetName = classesList.find(c => c.id === targetClass);
      toast.success(
        locale === 'ur' 
          ? `کامیابی سے ${studentCount} طالب علم کو ${targetName?.nameUrdu} میں ترقی دے دی گئی!` 
          : `Successfully promoted ${studentCount} student(s) to ${targetName?.name}!`
      );
      if (onPromoteSuccess) onPromoteSuccess();
    }, 800);
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="emerald" size="sm" className="font-bold shadow-md">
          <GraduationCap className="w-4 h-4 me-2 shrink-0" />
          <span>{locale === 'ur' ? `طلباء کو ترقی دیں (${studentCount})` : `Promote Students (${studentCount})`}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] font-ur">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-bold">
            <GraduationCap className="w-6 h-6 shrink-0" />
            <span>{locale === 'ur' ? 'سالانہ تعلیمی ترقی و منتقلی سسٹم' : 'Academic Class Promotion System'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            {locale === 'ur' ? (
              <>آپ <strong className="text-foreground">{studentCount} طلباء</strong> کو <strong className="text-foreground">{fromClass}</strong> سے اگلے سالانہ تعلیمی درجے یا کورس میں منتقل کرنے جا رہے ہیں۔</>
            ) : (
              <>You are promoting <strong className="text-foreground">{studentCount} student(s)</strong> from <strong className="text-foreground">{fromClass}</strong> to their next academic grade or course year.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {locale === 'ur' ? (
                <>یہ عمل طلباء کے ریکارڈ میں ان کا فعال درجہ تبدیل کر دے گا اور اس تاریخ کو <strong>student_promotions_history</strong> ٹیبل میں محفوظ کیا جائے گا۔</>
              ) : (
                <>This will update their active class in the student database and record this event in the <strong>student_promotions_history</strong> table.</>
              )}
            </span>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">{locale === 'ur' ? 'اگلے سال کا ٹارگٹ درجہ / کلاس' : 'Target Class / Grade for Next Session'}</Label>
            <Select value={targetClass} onValueChange={setTargetClass}>
              <SelectTrigger className="w-full h-10 font-ur">
                <SelectValue placeholder={locale === 'ur' ? 'منزل کا درجہ منتخب کریں...' : 'Select destination grade...'} />
              </SelectTrigger>
              <SelectContent className="font-ur">
                {classesList.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {locale === 'ur' ? c.nameUrdu : c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">{locale === 'ur' ? 'ٹارگٹ تعلیمی سال (Academic Year)' : 'Target Academic Year'}</Label>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger className="w-full h-10 font-en text-start">
                <SelectValue placeholder="Select academic year..." />
              </SelectTrigger>
              <SelectContent className="font-ur">
                <SelectItem value="2026-2027">{locale === 'ur' ? '2026-2027 (موجودہ سال میں منتقلی)' : '2026-2027 (Current Year Transfer)'}</SelectItem>
                <SelectItem value="2027-2028">{locale === 'ur' ? '2027-2028 (اگلا سالانہ تعلیمی سیشن)' : '2027-2028 (Next Annual Session)'}</SelectItem>
                <SelectItem value="1448-1449">{locale === 'ur' ? '1448-1449 ہجری (اسلامی ہجری سال)' : '1448-1449 AH (Islamic Hijri Calendar)'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="font-bold">
            {t.cancel}
          </Button>
          <Button variant="emerald" onClick={handlePromote} disabled={loading} className="font-bold">
            {loading ? (locale === 'ur' ? "ترقی دی جا رہی ہے..." : "Promoting...") : (locale === 'ur' ? "تصدیق کریں اور ترقی دیں" : "Confirm & Promote")}
            <ArrowIcon className="w-4 h-4 ms-2 shrink-0" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
