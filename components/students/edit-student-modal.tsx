"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentAdmissionSchema, StudentAdmissionFormValues } from '@/validations/student.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Edit, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: any;
  onSuccess: () => void;
}

export function EditStudentModal({ isOpen, onClose, studentData, onSuccess }: EditStudentModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const { locale } = useLanguage();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<StudentAdmissionFormValues>({
    resolver: zodResolver(studentAdmissionSchema) as any,
  });

  const isOrphan = watch('isOrphan');
  const isZakatEligible = watch('isZakatEligible');

  useEffect(() => {
    if (studentData && isOpen) {
      // Map existing classId to form
      let mappedClassId = '';
      if (studentData.current_class_id === '11111111-1111-1111-1111-111111111101') mappedClassId = '1';
      else if (studentData.current_class_id === '11111111-1111-1111-1111-111111111102') mappedClassId = '2';
      else if (studentData.current_class_id === '11111111-1111-1111-1111-111111111103') mappedClassId = '3';
      else if (studentData.current_class_id === '11111111-1111-1111-1111-111111111104') mappedClassId = '4';
      else if (studentData.current_class_id === '11111111-1111-1111-1111-111111111105') mappedClassId = '5';
      else mappedClassId = '1'; // Default fallback

      reset({
        firstName: studentData.first_name || '',
        firstNameEn: studentData.first_name_en || '',
        lastName: studentData.last_name || '',
        lastNameEn: studentData.last_name_en || '',
        gender: studentData.gender || 'male',
        dateOfBirth: studentData.date_of_birth ? new Date(studentData.date_of_birth).toISOString().split('T')[0] : '',
        classId: mappedClassId,
        fatherName: studentData.father_name || '',
        fatherNameEn: studentData.father_name_en || '',
        studentCnic: studentData.student_cnic || '',
        fatherPhone: studentData.father_phone || '',
        fatherCnic: studentData.father_cnic_or_id || '',
        guardianEmail: studentData.guardian_email || '',
        residentialAddress: studentData.residential_address || '',
        previousSchool: studentData.previous_school || '',
        previousGrade: studentData.previous_grade || '',
        isOrphan: studentData.is_orphan || false,
        isZakatEligible: studentData.is_zakat_eligible || false,
        bloodGroup: studentData.blood_group || '',
        bFormNumber: studentData.b_form_number || '',
      });
    }
  }, [studentData, isOpen, reset]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const classIdMap: Record<string, string> = {
        "1": "11111111-1111-1111-1111-111111111101",
        "2": "11111111-1111-1111-1111-111111111102",
        "3": "11111111-1111-1111-1111-111111111103",
        "4": "11111111-1111-1111-1111-111111111104",
        "5": "11111111-1111-1111-1111-111111111105",
      };

      const updatedStudent = {
        first_name: data.firstName,
        last_name: data.lastName || null,
        gender: data.gender,
        date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : null,
        current_class_id: classIdMap[data.classId] || null,
        father_name: data.fatherName,
        father_name_en: data.fatherNameEn || null,
        student_cnic: data.studentCnic || null,
        father_phone: data.fatherPhone,
        father_cnic_or_id: data.fatherCnic || null,
        guardian_email: data.guardianEmail || null,
        residential_address: data.residentialAddress || null,
        previous_school: data.previousSchool || null,
        previous_grade: data.previousGrade || null,
        is_orphan: data.isOrphan,
        is_zakat_eligible: data.isZakatEligible,
        blood_group: data.bloodGroup || null,
        b_form_number: data.bFormNumber || null,
      };

      const { error } = await (supabase as any)
        .from('students')
        .update(updatedStudent)
        .eq('id', studentData.id);

      if (error) throw error;

      toast.success(locale === 'ur' ? '🎉 طالب علم کا ریکارڈ کامیابی سے اپڈیٹ ہو گیا!' : 'Student record updated successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error updating student record');
    } finally {
      setSubmitting(false);
    }
  };

  if (!studentData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto font-ur p-0 border-t-4 border-t-amber-500">
        <DialogHeader className="p-6 pb-2 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Edit className="w-5 h-5 text-amber-500" />
            <span>{locale === 'ur' ? 'طالب علم کے ریکارڈ میں ترمیم' : 'Edit Student Record'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-muted-foreground">
            {locale === 'ur' ? 'ذاتی معلومات، درجہ، اور مالیاتی حیثیت (یتیم / زکوۃ) کی تفصیلات اپڈیٹ کریں۔' : 'Update personal information, class, and financial status details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1 */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary border-b border-border/50 pb-1 mb-3">
                {locale === 'ur' ? 'ذاتی و تعلیمی معلومات' : 'Personal & Academic'}
              </h4>
              
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'اسمِ گرامی (پہلا نام) *' : 'First Name *'}</Label>
                <Input {...register('firstName')} className={`h-10 text-xs font-ur ${errors.firstName ? "border-destructive" : ""}`} />
                {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'آخری نام' : 'Last Name'}</Label>
                <Input {...register('lastName')} className="h-10 text-xs font-ur" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'صنف (Gender) *' : 'Gender *'}</Label>
                <Select onValueChange={(val: any) => setValue('gender', val)} value={watch('gender')}>
                  <SelectTrigger className="w-full h-10 text-xs font-ur">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-ur">
                    <SelectItem value="male">{locale === 'ur' ? 'لڑکا (Male)' : 'Male'}</SelectItem>
                    <SelectItem value="female">{locale === 'ur' ? 'لڑکی (Female)' : 'Female'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'موجودہ درجہ / کلاس *' : 'Current Class *'}</Label>
                <Select onValueChange={(val) => setValue('classId', val)} value={watch('classId')}>
                  <SelectTrigger className={`w-full h-10 text-xs font-ur ${errors.classId ? "border-destructive" : ""}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-ur">
                    <SelectItem value="1">{locale === 'ur' ? 'درجہ اول - الف' : 'Grade 1 - Section A'}</SelectItem>
                    <SelectItem value="2">{locale === 'ur' ? 'درجہ پنجم - صبح' : 'Grade 5 - Morning'}</SelectItem>
                    <SelectItem value="3">{locale === 'ur' ? 'درجہ دہم (سائنس)' : 'Grade 10 - Science'}</SelectItem>
                    <SelectItem value="4">{locale === 'ur' ? 'حفظ القرآن - سیکشن الف' : 'Hifz al-Quran - Section A'}</SelectItem>
                    <SelectItem value="5">{locale === 'ur' ? 'درس نظامی سال اول' : 'Dars-e-Nizami Year 1'}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.classId && <p className="text-[11px] text-destructive">{errors.classId.message}</p>}
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary border-b border-border/50 pb-1 mb-3">
                {locale === 'ur' ? 'سرپرست و مالیاتی حیثیت' : 'Guardian & Financial Status'}
              </h4>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'والد / سرپرست کا نام *' : 'Father Name *'}</Label>
                <Input {...register('fatherName')} className="h-10 text-xs font-ur" />
                {errors.fatherName && <p className="text-[11px] text-destructive">{errors.fatherName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'موبائل نمبر *' : 'Mobile Number *'}</Label>
                <Input {...register('fatherPhone')} className="h-10 text-xs font-en text-start" />
                {errors.fatherPhone && <p className="text-[11px] text-destructive">{errors.fatherPhone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'ب فارم نمبر (B-Form No)' : 'B-Form Number'}</Label>
                <Input {...register('bFormNumber')} placeholder="00000-0000000-0" className="h-10 text-xs font-en text-start" />
              </div>

              {/* Financial Status Switches */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-extrabold text-foreground">{locale === 'ur' ? 'یتیم طالب علم' : 'Orphan Student'}</Label>
                    <p className="text-[10px] text-muted-foreground">{locale === 'ur' ? 'کیا طالب علم یتیم ہے؟' : 'Is the student an orphan?'}</p>
                  </div>
                  <Switch 
                    checked={isOrphan} 
                    onCheckedChange={(checked) => setValue('isOrphan', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-extrabold text-foreground">{locale === 'ur' ? 'مستحقِ زکوۃ' : 'Zakat Eligible'}</Label>
                    <p className="text-[10px] text-muted-foreground">{locale === 'ur' ? 'فیس معافی / زکوۃ فنڈ سے امداد کا مستحق' : 'Eligible for fee concession from Zakat fund'}</p>
                  </div>
                  <Switch 
                    checked={isZakatEligible} 
                    onCheckedChange={(checked) => setValue('isZakatEligible', checked)} 
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 font-bold text-xs">
              {locale === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={submitting} variant="emerald" className="h-10 font-bold text-xs gap-1.5">
              {submitting ? (
                <span>{locale === 'ur' ? 'محفوظ کیا جا رہا ہے...' : 'Saving...'}</span>
              ) : (
                <>
                  <Save className="w-4 h-4 shrink-0" />
                  <span>{locale === 'ur' ? 'ترمیم محفوظ کریں' : 'Save Changes'}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
