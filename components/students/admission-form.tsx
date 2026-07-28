"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentAdmissionSchema, StudentAdmissionFormValues } from '@/validations/student.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Upload, 
  CheckCircle2, 
  User, 
  Phone, 
  FileText,
  Globe,
  Download,
  Trash2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

interface OnlineAdmissionRequest {
  id: string;
  trackingId: string;
  studentName: string;
  fatherName: string;
  phone: string;
  gender: 'male' | 'female';
  classId: string;
  age?: string;
  previousSchool?: string;
  address?: string;
  date: string;
  status: 'pending';
}

export function AdmissionForm() {
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generatedRegId, setGeneratedRegId] = useState<string>("");
  const [onlineRequests, setOnlineRequests] = useState<OnlineAdmissionRequest[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('dars_nizami');
  const { locale, t } = useLanguage();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StudentAdmissionFormValues>({
    resolver: zodResolver(studentAdmissionSchema) as any,
    defaultValues: {
      gender: 'male',
      classId: '',
    },
  });

  useEffect(() => {
    const fetchClasses = async () => {
      const supabase = createClient();
      const { data } = await (supabase as any).from('classes').select('*').order('created_at', { ascending: true });
      if (data) setClasses(data);
    };
    fetchClasses();
    setGeneratedRegId(`REG-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`);

    try {
      const saved = localStorage.getItem('alhikmah_online_admissions');
      if (saved) {
        const parsed: OnlineAdmissionRequest[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setOnlineRequests(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load online admissions', e);
    }
  }, []);

  const handleLoadRequest = (req: OnlineAdmissionRequest) => {
    const names = req.studentName.split(' ');
    const first = names[0] || req.studentName;
    const last = names.slice(1).join(' ');

    setValue('firstName', first);
    if (last) setValue('lastName', last);
    setValue('fatherName', req.fatherName);
    setValue('fatherPhone', req.phone);
    if (req.gender) setValue('gender', req.gender);
    if (req.classId) setValue('classId', req.classId);
    if (req.previousSchool) setValue('previousSchool', req.previousSchool);
    if (req.address) setValue('residentialAddress', req.address);

    toast.success(
      locale === 'ur'
        ? `📥 آن لائن درخواست (${req.trackingId}) کا ڈیٹا فارم میں لوڈ ہو گیا ہے! تصدیق کر کے داخلہ مکمل کریں۔`
        : `📥 Loaded application (${req.trackingId}) into form for enrollment verification.`
    );
  };

  const handleDismissRequest = (id: string) => {
    const updated = onlineRequests.filter((r) => r.id !== id);
    setOnlineRequests(updated);
    localStorage.setItem('alhikmah_online_admissions', JSON.stringify(updated));
    toast.info(locale === 'ur' ? 'درخواست فہرست سے ہٹا دی گئی' : 'Request removed from inbox');
  };

  const onSubmit = async (data: StudentAdmissionFormValues) => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const newStudent = {
        registration_id: generatedRegId,
        first_name: data.firstName,
        first_name_en: data.firstNameEn || null,
        last_name: data.lastName || '',
        last_name_en: data.lastNameEn || null,
        gender: data.gender || 'male',
        date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : null,
        photo_url: photoPreview || null,
        current_class_id: data.classId || null,
        admission_date: new Date().toISOString().split('T')[0],
        status: 'active',
        father_name: data.fatherName,
        father_name_en: data.fatherNameEn || null,
        student_cnic: data.studentCnic || null,
        father_phone: data.fatherPhone,
        father_cnic_or_id: data.fatherCnic || null,
        guardian_email: data.guardianEmail || null,
        residential_address: data.residentialAddress || null,
        previous_school: data.previousSchool || null,
        previous_grade: data.previousGrade || null,
        is_orphan: data.isOrphan || false,
        is_zakat_eligible: data.isZakatEligible || false,
        blood_group: data.bloodGroup || null,
      };

      const { error } = await (supabase as any).from('students').insert([newStudent]);
      if (error) {
        toast.error(locale === 'ur' ? `ڈیٹا بیس ایرر: ${error.message}` : `DB Error: ${error.message}`);
      } else {
        toast.success(
          locale === 'ur' 
            ? `🎉 الحمد للہ! طالب علم (${data.firstName}) کا داخلہ لائیو Supabase میں محفوظ ہو گیا! رجسٹریشن نمبر: ${generatedRegId}`
            : `🎉 Student ${data.firstName} enrolled and saved live in Supabase DB! ID: ${generatedRegId}`
        );
        reset();
        setPhotoPreview(null);
        setGeneratedRegId(`REG-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        toast.info(locale === 'ur' ? "تصویر لوڈ ہو چکی ہے (Cloudinary پر اپلوڈ کے لیے تیار ہے)۔" : "Photo loaded for Cloudinary upload.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 font-ur">
      {/* Online Admissions Inbox Card */}
      {onlineRequests.length > 0 && (
        <Card className="border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-500/5 via-card to-teal-500/5 shadow-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <Globe className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                    <span>{locale === 'ur' ? '🌐 پبلک ویب سائٹ سے موصول ہونے والی آن لائن درخواستیں' : '🌐 Online Applications Inbox (Public Website)'}</span>
                    <Badge className="bg-emerald-500 text-white font-extrabold text-xs">
                      {onlineRequests.length} {locale === 'ur' ? 'نئی' : 'New'}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    {locale === 'ur'
                      ? 'والدین کی جانب سے آن لائن داخلہ فارم کے ذریعے بھیجی گئی درخواستیں۔ ایک کلک میں فارم میں لوڈ کریں اور تصدیق کریں۔'
                      : 'Applications submitted via online portal. One-click load into registration form below for verification.'}
                  </CardDescription>
                </div>
              </div>

              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs self-start sm:self-center">
                <Sparkles className="w-3 h-3 me-1 inline" /> {locale === 'ur' ? 'براہِ راست منسلک (Live Connected)' : 'Live Connected Desk'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {onlineRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-card border border-border/80 hover:border-emerald-500/50 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-muted text-primary font-en">{req.trackingId}</span>
                    <h4 className="font-bold text-sm text-foreground">{req.studentName}</h4>
                    <span className="text-xs text-muted-foreground">({locale === 'ur' ? 'والد:' : 'Father:'} <strong className="text-foreground font-semibold">{req.fatherName}</strong>)</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span>📱 <strong className="font-en text-foreground">{req.phone}</strong></span>
                    <span>📚 {locale === 'ur' ? 'مطلوبہ درجہ:' : 'Class:'} <strong className="text-primary">{req.classId === '4' ? 'حفظ القرآن' : req.classId === '5' ? 'درس نظامی' : `Grade ${req.classId}`}</strong></span>
                    <span>📍 <strong className="text-foreground">{req.address || 'کراچی'}</strong></span>
                    <span className="text-[11px] opacity-75">⏱️ {req.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="emerald"
                    size="sm"
                    onClick={() => handleLoadRequest(req)}
                    className="h-9 px-3 text-xs font-bold gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? '📥 فارم میں لوڈ کریں' : 'Load in Form'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDismissRequest(req.id)}
                    className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title={locale === 'ur' ? 'فہرست سے ہٹائیں' : 'Dismiss Request'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in-50 duration-300 font-ur">
        {/* Top Banner / REG ID Indicator */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              {locale === 'ur' ? 'نئے طالب علم کا داخلہ فارم (Registration Form)' : 'New Student Admission Form'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {locale === 'ur' ? 'ماڈیول 2: طالب علم اور سرپرست کی مکمل معلومات اور تصدیق کے ساتھ اندراج۔' : 'Module 2: Complete profile registration with Parent / Guardian verification.'}
            </p>
          </div>
        </div>
        <div className="bg-card px-4 py-2 rounded-lg border border-border shadow-sm flex items-center gap-2 text-xs shrink-0">
          <span className="text-muted-foreground font-bold">{locale === 'ur' ? 'خودکار رجسٹریشن نمبر:' : 'Auto-Generated ID:'}</span>
          <span className="font-mono font-extrabold text-primary text-sm font-en">{generatedRegId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Details & Photo Upload (Cloudinary) */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-primary shrink-0" />
              <span>{locale === 'ur' ? '1. طالب علم کی ذاتی معلومات' : '1. Student Personal Information'}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'ur' ? 'طالب علم کا مکمل نام، صنف، تاریخ پیدائش اور تفویض کردہ درجہ درج کریں۔' : "Enter student's full legal name, gender, birth date, and assigned class."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-bold">{locale === 'ur' ? 'اسمِ گرامی (اردو) *' : 'First Name (Urdu) *'}</Label>
                <Input 
                  id="firstName" 
                  placeholder={locale === 'ur' ? 'مثلاً: محمد / فاطمہ' : 'e.g. Muhammad / Fatima'} 
                  {...register('firstName')} 
                  className={`h-10 text-xs font-ur ${errors.firstName ? "border-destructive" : ""}`}
                />
                {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="firstNameEn" className="text-xs font-bold">{locale === 'ur' ? 'پہلا نام (انگریزی)' : 'First Name (English)'}</Label>
                <Input 
                  id="firstNameEn" 
                  placeholder="e.g. Muhammad / Fatima" 
                  {...register('firstNameEn')} 
                  className="h-10 text-xs font-en text-left" 
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-bold">{locale === 'ur' ? 'آخری نام (اردو)' : 'Last Name (Urdu)'}</Label>
                <Input id="lastName" placeholder={locale === 'ur' ? 'مثلاً: علی / خان' : 'e.g. Ali / Khan'} {...register('lastName')} className="h-10 text-xs font-ur" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastNameEn" className="text-xs font-bold">{locale === 'ur' ? 'آخری نام (انگریزی)' : 'Last Name (English)'}</Label>
                <Input id="lastNameEn" placeholder="e.g. Ali / Khan" {...register('lastNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'صنف (Gender) *' : 'Gender *'}</Label>
                <Select onValueChange={(val: any) => setValue('gender', val)} defaultValue="male">
                  <SelectTrigger className="w-full h-10 text-xs font-ur">
                    <SelectValue placeholder={locale === 'ur' ? 'صنف منتخب کریں' : 'Select gender'} />
                  </SelectTrigger>
                  <SelectContent className="font-ur">
                    <SelectItem value="male">{locale === 'ur' ? 'لڑکا (Male)' : 'Male'}</SelectItem>
                    <SelectItem value="female">{locale === 'ur' ? 'لڑکی (Female)' : 'Female'}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-[11px] text-destructive">{errors.gender.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-xs font-bold">{locale === 'ur' ? 'تاریخِ پیدائش' : 'Date of Birth'}</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} className="h-10 text-xs font-en text-start" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="studentCnic" className="text-xs font-bold">{locale === 'ur' ? 'ب-فارم / CNIC' : 'Student B-Form/CNIC'}</Label>
                <Input id="studentCnic" placeholder="35201-1234567-1" {...register('studentCnic')} className="h-10 text-xs font-en text-left" dir="ltr" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'شعبہ (Department) *' : 'Department *'}</Label>
                <Select onValueChange={(val) => { setSelectedDept(val); setValue('classId', ''); }} value={selectedDept}>
                  <SelectTrigger className="w-full h-10 text-xs font-ur">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-ur">
                    <SelectItem value="dars_nizami">{locale === 'ur' ? 'درس نظامی' : 'Dars-e-Nizami'}</SelectItem>
                    <SelectItem value="hifz">{locale === 'ur' ? 'شعبہ حفظ' : 'Hifz Dept'}</SelectItem>
                    <SelectItem value="school">{locale === 'ur' ? 'عصری سکول' : 'Modern School'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{locale === 'ur' ? 'درجہ / کلاس منتخب کریں *' : 'Assign Class / Grade *'}</Label>
                <Select onValueChange={(val) => setValue('classId', val)}>
                  <SelectTrigger className={`w-full h-10 text-xs font-ur ${errors.classId ? "border-destructive" : ""}`}>
                    <SelectValue placeholder={locale === 'ur' ? 'درجہ منتخب کریں...' : 'Select grade...'} />
                  </SelectTrigger>
                  <SelectContent className="font-ur">
                    {classes.filter(c => c.level_type === selectedDept).map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {locale === 'ur' ? c.name_ur : c.name_en}
                      </SelectItem>
                    ))}
                    {classes.filter(c => c.level_type === selectedDept).length === 0 && (
                       <SelectItem value="none" disabled>{locale === 'ur' ? 'اس شعبے میں کوئی درجہ نہیں' : 'No classes in this dept'}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.classId && <p className="text-[11px] text-destructive">{errors.classId.message}</p>}
              </div>
            </div>

            <div className="pt-3 border-t border-border/50">
              <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary shrink-0" /> {locale === 'ur' ? 'سابقہ تعلیمی ریکارڈ اور طبی معلومات' : 'Previous Academics & Medical Notes'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="previousSchool" className="text-xs font-bold">{locale === 'ur' ? 'سابقہ ادارہ / مدرسہ' : 'Previous School / Madrasa'}</Label>
                  <Input id="previousSchool" placeholder={locale === 'ur' ? 'مثلاً: مدرسہ دارالعلوم' : 'e.g. Al-Falah School'} {...register('previousSchool')} className="h-10 text-xs font-ur" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="previousGrade" className="text-xs font-bold">{locale === 'ur' ? 'سابقہ پاس کردہ درجہ' : 'Previous Grade Passed'}</Label>
                  <Input id="previousGrade" placeholder={locale === 'ur' ? 'مثلاً: درجہ چہارم / ناظرہ' : 'e.g. Grade 4 / Nazira'} {...register('previousGrade')} className="h-10 text-xs font-ur" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Cloudinary Photo Upload */}
        <Card className="border-border/60 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary shrink-0" />
              <span>{locale === 'ur' ? 'طالب علم کی تصویر (Cloudinary)' : 'Student Photo (Cloudinary)'}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'ur' ? 'شناختی کارڈ اور رزلٹ کارڈ کے لیے پاسپورٹ سائز تصویر اپلوڈ کریں۔' : 'Upload passport size photo for ID Card and report cards.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="w-36 h-44 rounded-xl border-2 border-dashed border-border/80 bg-muted/40 flex flex-col items-center justify-center overflow-hidden relative group hover:border-primary/60 transition-colors">
              {photoPreview ? (
                <img src={photoPreview} alt="Student preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <User className="w-10 h-10 text-muted-foreground/60 mx-auto mb-2" />
                  <p className="text-[11px] font-bold text-muted-foreground">{locale === 'ur' ? 'تصویر منتخب کریں یا ڈریگ کریں' : 'Click or Drag Photo'}</p>
                  <p className="text-[9px] text-muted-foreground/80 mt-1 font-en">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
            {photoPreview && (
              <Button type="button" variant="outline" size="sm" onClick={() => setPhotoPreview(null)} className="h-8 text-xs font-bold">
                {locale === 'ur' ? 'تصویر ہٹائیں' : 'Remove Photo'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Parent / Guardian Details */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span>{locale === 'ur' ? '2. سرپرست / والد کی تفصیلی معلومات اور رابطہ' : '2. Parent / Guardian Details & Contact Info'}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {locale === 'ur' ? 'ہنگامی اطلاعات، فیس رسیدوں اور تعلیمی رپورٹ کے لیے سرپرست کا مستند رابطہ نمبر ضروری ہے۔' : 'Guardian information is required for emergency alerts and fee receipts notifications.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fatherName" className="text-xs font-bold">{locale === 'ur' ? 'والد کا نام (اردو) *' : 'Father Name (Urdu) *'}</Label>
              <Input id="fatherName" placeholder={locale === 'ur' ? 'مثلاً: عبدالرحمٰن' : 'e.g. Abdul Rahman'} {...register('fatherName')} className="h-10 text-xs font-ur" />
              {errors.fatherName && <p className="text-[11px] text-destructive">{errors.fatherName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fatherNameEn" className="text-xs font-bold">{locale === 'ur' ? 'والد کا نام (انگریزی)' : 'Father Name (English)'}</Label>
              <Input id="fatherNameEn" placeholder="e.g. Abdul Rahman" {...register('fatherNameEn')} className="h-10 text-xs font-en text-left" dir="ltr" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fatherPhone" className="text-xs font-bold">{locale === 'ur' ? 'موبائل نمبر / واٹس ایپ *' : 'Mobile Number / Phone *'}</Label>
              <Input id="fatherPhone" placeholder="0300-1234567" {...register('fatherPhone')} className="h-10 text-xs font-en text-start" />
              {errors.fatherPhone && <p className="text-[11px] text-destructive">{errors.fatherPhone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fatherCnic" className="text-xs font-bold">{locale === 'ur' ? 'قومی شناختی کارڈ نمبر (CNIC)' : 'CNIC / National ID Card No.'}</Label>
              <Input id="fatherCnic" placeholder="35201-1234567-1" {...register('fatherCnic')} className="h-10 text-xs font-en text-start" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="guardianEmail" className="text-xs font-bold">{locale === 'ur' ? 'سرپرست کا ای میل (اختیاری)' : 'Guardian Email Address (Optional)'}</Label>
              <Input id="guardianEmail" type="email" placeholder="parent@gmail.com" {...register('guardianEmail')} className="h-10 text-xs font-en text-start" />
              {errors.guardianEmail && <p className="text-[11px] text-destructive">{errors.guardianEmail.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="residentialAddress" className="text-xs font-bold">{locale === 'ur' ? 'مکمل رہائشی پتہ' : 'Residential Address'}</Label>
              <Input id="residentialAddress" placeholder={locale === 'ur' ? 'مکان نمبر 12، گلی 4، محلہ...' : 'House 12, Street 4, Block A...'} {...register('residentialAddress')} className="h-10 text-xs font-ur" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 flex justify-end gap-3 border-t border-border/60">
          <Button type="button" variant="outline" onClick={() => reset()} className="h-10 font-bold px-6">
            {t.reset}
          </Button>
          <Button type="submit" variant="emerald" disabled={submitting} className="h-10 px-8 font-bold text-sm">
            {submitting ? (locale === 'ur' ? "اندراج کیا جا رہا ہے..." : "Registering Student...") : (locale === 'ur' ? "داخلہ مکمل کریں اور محفوظ کریں" : "Confirm Student Admission")}
            <CheckCircle2 className="w-4 h-4 ms-2 shrink-0" />
          </Button>
        </CardFooter>
      </Card>
    </form>
    </div>
  );
}
