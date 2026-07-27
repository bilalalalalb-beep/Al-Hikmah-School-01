"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  ShieldCheck, 
  CalendarCheck, 
  Laptop, 
  HeartHandshake, 
  Send, 
  UserPlus,
  Lock,
  Menu,
  X,
  FileText,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/context';
import { usePortalSettings } from '@/lib/settings/context';
import { toast } from 'sonner';

export default function PublicLandingPage() {
  const { locale, toggleLocale, dir } = useLanguage();
  const { settings } = usePortalSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Hero Slider & Welcome Popup State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!settings.heroSliderImages || settings.heroSliderImages.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % (settings.heroSliderImages?.length || 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [settings.heroSliderImages]);

  useEffect(() => {
    if (settings.showWelcomePopup) {
      const timer = setTimeout(() => {
        setPopupOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [settings.showWelcomePopup]);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [classId, setClassId] = useState('');
  const [age, setAge] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [address, setAddress] = useState('');

  const handleOnlineAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !fatherName || !phone || !classId) {
      toast.error(
        locale === 'ur'
          ? 'براہ کرم تمام لازمی معلومات (*) پُر کریں!'
          : 'Please fill in all mandatory fields (*)!'
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const trackingId = `ADM-ONL-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRequest = {
        id: Date.now().toString(),
        trackingId,
        studentName: `${studentName} ${lastName}`.trim(),
        fatherName,
        phone,
        gender,
        classId,
        age,
        previousSchool,
        address,
        date: new Date().toLocaleDateString(locale === 'ur' ? 'ur-PK' : 'en-US'),
        status: 'pending' as const,
      };

      try {
        const existing = JSON.parse(localStorage.getItem('alhikmah_online_admissions') || '[]');
        existing.unshift(newRequest);
        localStorage.setItem('alhikmah_online_admissions', JSON.stringify(existing));
      } catch (err) {
        console.error('Failed to save online admission request to localStorage', err);
      }

      setSubmitting(false);
      setSubmittedId(trackingId);
      toast.success(
        locale === 'ur'
          ? `🎉 مبارک ہو! آپ کی آن لائن درخواست (ID: ${trackingId}) کامیابی سے موصول ہو گئی ہے!`
          : `🎉 Congratulations! Online admission application (ID: ${trackingId}) submitted successfully!`
      );

      // Reset fields
      setStudentName('');
      setLastName('');
      setFatherName('');
      setPhone('');
      setClassId('');
      setAge('');
      setPreviousSchool('');
      setAddress('');
    }, 1200);
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-ur overflow-x-hidden transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-8 py-3.5 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-0.5 bg-white" />
              ) : (
                <Sparkles className="w-6 h-6 animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight leading-none">
                {locale === 'ur' ? settings.madrasaNameUr : settings.madrasaNameEn}
              </h1>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 tracking-wide">
                {locale === 'ur' ? 'آن لائن تعارفی و داخلہ پورٹل' : 'Online Admission & School Portal'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700 dark:text-slate-300">
            <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {locale === 'ur' ? 'تعارف و پیغام' : 'About Us'}
            </a>
            <a href="#departments" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {locale === 'ur' ? 'تعلیمی شعبہ جات' : 'Faculty & Courses'}
            </a>
            <a href="#facilities" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {locale === 'ur' ? 'امتیازی سہولیات' : 'Facilities'}
            </a>
            <a href="#admission-form" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>{locale === 'ur' ? 'آن لائن داخلہ فارم' : 'Online Admission'}</span>
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleLocale}
              className="bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white border-slate-300 dark:border-white/20 font-extrabold text-xs h-9 px-3"
            >
              <Globe className="w-3.5 h-3.5 me-1.5 text-emerald-600 dark:text-amber-300" />
              <span>{locale === 'ur' ? 'English' : 'اردو'}</span>
            </Button>

            <Link href="/login" className="hidden sm:inline-flex">
              <Button
                variant="emerald"
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs h-9 px-4 shadow-md shadow-emerald-500/20 gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{locale === 'ur' ? 'پورٹل لاگن (Portal Login)' : 'Staff / Parent Login'}</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-200 dark:border-white/10 mt-3 flex flex-col gap-3 text-sm font-bold animate-in slide-in-from-top-2">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
              {locale === 'ur' ? 'تعارف و پیغام' : 'About Us'}
            </a>
            <a href="#departments" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
              {locale === 'ur' ? 'تعلیمی شعبہ جات' : 'Faculty & Courses'}
            </a>
            <a href="#facilities" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
              {locale === 'ur' ? 'امتیازی سہولیات' : 'Facilities'}
            </a>
            <a href="#admission-form" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              {locale === 'ur' ? 'آن لائن داخلہ فارم' : 'Online Admission'}
            </a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="emerald" className="w-full font-bold text-xs gap-2">
                <Lock className="w-4 h-4" />
                <span>{locale === 'ur' ? 'پورٹل لاگن (Portal Login)' : 'Staff / Parent Login'}</span>
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Welcome Popup Modal */}
      {popupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 end-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none" />
            <button
              type="button"
              onClick={() => setPopupOpen(false)}
              className="absolute top-4 end-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm"
              title="Close / بند کریں"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                <Volume2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold mb-1 px-2.5 py-0.5">
                  {locale === 'ur' ? 'اہم اعلان و پیغام' : 'Official Announcement'}
                </Badge>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {locale === 'ur' ? (settings.welcomePopupTitleUr || 'داخلے جاری ہیں') : (settings.welcomePopupTitleEn || 'Admissions Open')}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              {locale === 'ur'
                ? (settings.welcomePopupMessageUr || 'جامعہ الحکمہ میں نئے داخلوں کا آغاز ہو چکا ہے۔')
                : (settings.welcomePopupMessageEn || 'Admissions are now open for the upcoming academic session.')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <a
                href="#admission-form"
                onClick={() => setPopupOpen(false)}
                className="w-full sm:w-auto"
              >
                <Button variant="emerald" className="w-full font-extrabold text-xs px-6 py-5 rounded-xl shadow-md gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>{locale === 'ur' ? 'آن لائن داخلہ فارم پر جائیں' : 'Go to Admission Form'}</span>
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={() => setPopupOpen(false)}
                className="w-full sm:w-auto font-bold text-xs px-6 py-5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <span>{locale === 'ur' ? 'بند کریں (Close)' : 'Close Dialog'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-8 overflow-hidden bg-emerald-900 text-white rounded-b-[2.5rem] shadow-xl mb-12 min-h-[580px] flex items-center justify-center">
        {/* Hero Background Slider Images */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {settings.heroSliderImages && settings.heroSliderImages.map((imgUrl, idx) => {
            const isActive = idx === activeSlideIndex;
            let animClass = "opacity-0 scale-105 pointer-events-none";
            if (isActive) {
              if (settings.heroSliderAnimation === 'slide') animClass = "opacity-100 translate-x-0 scale-100 transition-all duration-1000 ease-in-out";
              else if (settings.heroSliderAnimation === 'zoom') animClass = "opacity-100 scale-105 transition-all duration-1000 ease-in-out";
              else animClass = "opacity-100 scale-100 transition-all duration-1000 ease-in-out";
            } else {
              if (settings.heroSliderAnimation === 'slide') animClass = "opacity-0 translate-x-12 scale-100 transition-all duration-1000 ease-in-out pointer-events-none";
              else if (settings.heroSliderAnimation === 'zoom') animClass = "opacity-0 scale-110 transition-all duration-1000 ease-in-out pointer-events-none";
              else animClass = "opacity-0 transition-opacity duration-1000 ease-in-out pointer-events-none";
            }
            return (
              <div key={idx} className={`absolute inset-0 w-full h-full ${animClass}`}>
                <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            );
          })}
          {/* Rich Gradient Overlay for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/85 via-emerald-900/85 to-slate-950/95 backdrop-blur-[1px]" />
        </div>

        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none z-1" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none z-1" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6 py-6">
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-xs sm:text-sm font-extrabold shadow-lg inline-flex items-center gap-2 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>{locale === 'ur' ? 'اسلامی و جدید عصری علوم کا عظیم الشان اور مستند ادارہ' : 'Premier Center for Islamic & Modern Education'}</span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight drop-shadow-md">
            {locale === 'ur' ? settings.madrasaNameUr : settings.madrasaNameEn}
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow">
            {locale === 'ur' ? settings.taglineUr : settings.taglineEn}
          </p>

          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
            {locale === 'ur'
              ? 'الحمدللہ! جامعہ میں حفظِ قرآن، ناظرہ، تجوید، 8 سالہ درسِ نظامی (عالم و عالمہ کورس) اور میٹرک و انٹر تک جدید عصری علوم (کمپیوٹر سائنس و انگلش) کا مربوط و بااخلاق ماحول موجود ہے۔ دور دراز سے آنے والے طلباء کے لیے دارالاقامہ (ہاسٹل) اور مستحق طلباء کے لیے 100% مفت کفالت کا انتظام ہے۔'
              : 'Offering structured Hifz al-Quran, Dars-e-Nizami (8-year Scholar Course), alongside recognized Matriculation and Intermediate modern computer & science education in a moral and nurturing environment.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="#admission-form" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm px-8 py-6 rounded-2xl shadow-xl transition-all hover:scale-105 gap-2">
                <UserPlus className="w-5 h-5" />
                <span>{locale === 'ur' ? '📝 آن لائن داخلہ فارم پُر کریں' : 'Apply Online for Admission'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </a>

            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 font-black text-sm px-8 py-6 rounded-2xl transition-all hover:scale-105 gap-2 backdrop-blur-md shadow-lg">
                <Lock className="w-5 h-5 text-amber-300" />
                <span>{locale === 'ur' ? '🔐 پورٹل لاگن (Staff & Parents)' : 'Staff & Parent Portal Login'}</span>
              </Button>
            </Link>
          </div>

          {/* Slider Indicators */}
          {settings.heroSliderImages && settings.heroSliderImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {settings.heroSliderImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeSlideIndex ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-en">500+</div>
              <div className="text-xs text-white font-bold mt-1">{locale === 'ur' ? 'زیرِ تعلیم طلباء' : 'Enrolled Students'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-en">40+</div>
              <div className="text-xs text-white font-bold mt-1">{locale === 'ur' ? 'مستند و شفیق اساتذہ' : 'Qualified Faculty'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-teal-300 font-en">8+</div>
              <div className="text-xs text-white font-bold mt-1">{locale === 'ur' ? 'تعلیمی شعبہ جات' : 'Academic Courses'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
              <div className="text-2xl sm:text-3xl font-black text-blue-300 font-en">100%</div>
              <div className="text-xs text-white font-bold mt-1">{locale === 'ur' ? 'مفت کفالت و وظائف' : 'Free Scholarships'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-3 py-1 font-bold text-xs">
            {locale === 'ur' ? 'فیضانِ مدرسہ و تعلیم' : 'Academic Departments'}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {locale === 'ur' ? 'جامعہ کے اہم تعلیمی شعبہ جات اور کورسز' : 'Our Specialized Faculty & Programs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            {locale === 'ur'
              ? 'بنیادی ناظرہ و تجوید سے لے کر تخصص اور جدید کمپیوٹر علوم تک، ہر طالب علم کی دینی و دنیاوی کامیابی کا ضامن'
              : 'Comprehensive education pathways combining classical Islamic scholarship with modern scientific advancements'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white hover:border-emerald-500 dark:hover:border-emerald-500/50 transition-all shadow-md hover:shadow-xl flex flex-col justify-between rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{locale === 'ur' ? 'شعبہ حفظ و ناظرہ قرآن' : 'Hifz & Nazra Quran'}</CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {locale === 'ur' ? 'مخارج و تجوید کے اصولوں کے ساتھ حفظِ قرآن کا باقاعدہ و مربوط نظام' : 'Tajweed-focused Quran memorization with daily revision tracking'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> <span>{locale === 'ur' ? 'انفرادی توجہ و روزانہ منزل ٹیسٹ' : 'Individual teacher attention'}</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> <span>{locale === 'ur' ? 'سالانہ دستار بندی و اعزازات' : 'Annual Dastar-bandi ceremony'}</span></div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-slate-100 dark:border-white/10">
              <Badge className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 w-full justify-center py-1 font-bold">
                {locale === 'ur' ? 'دورانیہ: 2 تا 3 سال' : 'Duration: 2 to 3 Years'}
              </Badge>
            </CardFooter>
          </Card>

          <Card className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-500/50 transition-all shadow-md hover:shadow-xl flex flex-col justify-between rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{locale === 'ur' ? 'شعبہ درسِ نظامی (عالم کورس)' : 'Dars-e-Nizami (Scholar)'}</CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {locale === 'ur' ? 'علومِ عربیہ، تفسیر، حدیث اور فقہ کا 8 سالہ مستند عالم و عالمہ کورس' : '8-Year comprehensive Islamic jurisprudence, Tafseer & Hadith degree'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" /> <span>{locale === 'ur' ? 'عربی گرامر و ادب میں مہارت' : 'Advanced Arabic linguistics'}</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" /> <span>{locale === 'ur' ? 'وفاق المدارس سے تسلیم شدہ سند' : 'Accredited Wifaq degree'}</span></div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-slate-100 dark:border-white/10">
              <Badge className="bg-blue-50 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 w-full justify-center py-1 font-bold">
                {locale === 'ur' ? 'دورانیہ: 8 سالہ کورس' : 'Duration: 8-Year Program'}
              </Badge>
            </CardFooter>
          </Card>

          <Card className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white hover:border-purple-500 dark:hover:border-purple-500/50 transition-all shadow-md hover:shadow-xl flex flex-col justify-between rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Laptop className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{locale === 'ur' ? 'جدید عصری و سائنس علوم' : 'Modern School & IT Lab'}</CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {locale === 'ur' ? 'دینی تعلیم کے ساتھ ساتھ میٹرک اور انٹر (کمپیوٹر سائنس / انگلش) کی تعلیم' : 'Recognized school curriculum with modern computer lab & English fluency'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" /> <span>{locale === 'ur' ? 'جدید ترین کمپیوٹر لیب و انٹرنیٹ' : 'State-of-the-art IT lab'}</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" /> <span>{locale === 'ur' ? 'بورڈ امتحانات کی بہترین تیاری' : 'Excellent Board exam results'}</span></div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-slate-100 dark:border-white/10">
              <Badge className="bg-purple-50 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/30 w-full justify-center py-1 font-bold">
                {locale === 'ur' ? 'درجہ اول تا انٹرمیڈیٹ' : 'Grade 1 to Intermediate'}
              </Badge>
            </CardFooter>
          </Card>

          <Card className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white hover:border-amber-500 dark:hover:border-amber-500/50 transition-all shadow-md hover:shadow-xl flex flex-col justify-between rounded-2xl group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{locale === 'ur' ? 'دارالاقامہ و کفالتِ طلباء' : 'Hostel & Scholarships'}</CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {locale === 'ur' ? 'دور دراز کے طلباء کے لیے قیام، طعام اور طبی سہولیات کا بہترین و پاکیزہ ماحول' : 'Full boarding, hygienic meals, and living scholarships for deserving students'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" /> <span>{locale === 'ur' ? '24 گھنٹے نگران اساتذہ و سیکیورٹی' : '24/7 security & mentorship'}</span></div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" /> <span>{locale === 'ur' ? 'مستحقین کے لیے 100% وظیفہ' : '100% scholarship support'}</span></div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-slate-100 dark:border-white/10">
              <Badge className="bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 w-full justify-center py-1 font-bold">
                {locale === 'ur' ? 'محدود نشستیں' : 'Limited Seats Available'}
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-16 sm:py-24 px-4 sm:px-8 bg-slate-100/80 dark:bg-slate-900/50 border-y border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 px-3 py-1 font-bold text-xs">
              {locale === 'ur' ? 'امتیازی خصوصیات' : 'School Facilities'}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {locale === 'ur' ? 'والدین اور طلباء کا اعتماد کیوں؟' : 'Why Guardians Choose Our Institute'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500/50 transition-all space-y-3 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">1</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{locale === 'ur' ? 'واٹس ایپ اور ای میل الرٹ نظام' : 'Instant WhatsApp & Email Alerts'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {locale === 'ur' ? 'والدین کو روزانہ حاضری، فیس رسیدیں اور امتحانی نتائج خودکار واٹس ایپ اور ای میل پر ارسال کیے جاتے ہیں۔' : 'Guardians receive real-time attendance notices, fee receipts, and term report cards directly on WhatsApp and Email.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 transition-all space-y-3 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">2</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{locale === 'ur' ? 'اخلاق و کردار کی بہترین تعمیر' : 'Moral Character & Discipline'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {locale === 'ur' ? 'سنتِ نبوی ﷺ اور تقویٰ کی روشنی میں طلباء کی باقاعدہ فکری و روحانی تربیت کی جاتی ہے۔' : 'Holistic personal development rooted in prophetic ethics, respect, discipline, and regular congregational prayers.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-purple-500/50 transition-all space-y-3 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">3</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{locale === 'ur' ? 'عظیم الشان کتب خانہ (لائبریری)' : 'Rich Reference Library'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {locale === 'ur' ? 'ہزاروں اسلامی و عصری کتب، تفاسیر اور انسائیکلوپیڈیا پر مشتمل پرسکون مطالعہ کا ماحول۔' : 'Access to thousands of classical Islamic manuscripts, modern reference books, and digital study rooms.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-amber-500/50 transition-all space-y-3 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">4</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{locale === 'ur' ? 'سولر اور جنریٹر کا 24/7 بیک اپ' : '24/7 Solar & Power Backup'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {locale === 'ur' ? 'لوڈشیڈنگ سے پاک تعلیمی ماحول تاکہ طلباء کی کلاسز اور مطالعہ میں کوئی تعطل نہ آئے۔' : 'Uninterrupted power supply ensuring smooth classroom sessions, computer labs, and hostel illumination.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-teal-500/50 transition-all space-y-3 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">5</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{locale === 'ur' ? 'آن لائن والدین پورٹل' : 'Dedicated Parent Portal'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {locale === 'ur' ? 'والدین اپنے گھر بیٹھے موبائل پورٹل سے بچے کی روزانہ پروگریس، حاضری اور فیس کا ریکارڈ دیکھ سکتے ہیں۔' : 'Parents can login anytime to check live attendance logs, exam report cards, and fee challan history.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-rose-500/50 transition-all space-y-3 shadow-sm hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">6</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{locale === 'ur' ? 'صحت بخش و متوازن خوراک' : 'Hygienic Dining & Healthcare'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {locale === 'ur' ? 'مقیم طلباء کے لیے صاف ستھرا طعام، فلٹرڈ پانی اور ابتدائی طبی امداد (فرسٹ ایڈ) کا انتظام۔' : 'Nutritious daily meals prepared in hygienic kitchens, clean drinking water, and regular medical checkups.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Form Section */}
      <section id="admission-form" className="py-16 sm:py-24 px-4 sm:px-8 max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 text-slate-900 dark:text-white shadow-2xl overflow-hidden relative rounded-3xl">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

          <CardHeader className="pt-8 pb-6 border-b border-slate-100 dark:border-white/10 text-center space-y-2 bg-slate-50/50 dark:bg-transparent">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-1 shadow-inner">
              <UserPlus className="w-7 h-7" />
            </div>
            <CardTitle className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {locale === 'ur' ? 'نئے طلباء کے لیے آن لائن داخلہ فارم (سیشن 2026-27)' : 'Online Admission Application Form (2026-27)'}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
              {locale === 'ur'
                ? 'فارم پُر کریں، آپ کی درخواست سیدھا جامعہ کے دفتر (کلرک ڈیسک) کو موصول ہوگی اور دفتری اوقات میں آپ کے واٹس ایپ پر داخلہ تصدیق کی جائے گی۔'
                : 'Fill out this form to submit an instant admission request. Our admission desk will verify and contact you via WhatsApp.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {settings.admissionStatus === 'closed' ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {locale === 'ur' ? '🔴 آن لائن داخلے عارضی طور پر بند ہیں' : '🔴 Online Admissions Currently Closed'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
                  {locale === 'ur'
                    ? `موجودہ سیشن کی نشستیں مکمل ہو چکی ہیں یا داخلہ کا وقت ختم ہو گیا ہے۔ خصوصی معلومات یا ویٹنگ لسٹ کے لیے دفتر کے نمبر پر رابطہ کریں: ${settings.phone}`
                    : `Admissions for the current term are temporarily closed. For inquiries or waiting list requests, please contact our office at: ${settings.phone}`}
                </p>
              </div>
            ) : submittedId ? (
              <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <Badge className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs px-3 py-1 font-bold">
                    {locale === 'ur' ? 'درخواست موصول ہو گئی!' : 'Application Submitted!'}
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {locale === 'ur' ? 'الحمدللہ! آپ کی داخلہ درخواست جمع ہو چکی ہے' : 'Alhamdulillah! Your Application is Received'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto font-medium">
                    {locale === 'ur'
                      ? 'جامعہ الحکمہ کے دفتر نے آپ کی معلومات ریکارڈ کر لی ہیں۔ جلد ہی ہمارے کلرک آپ کے واٹس ایپ نمبر پر رابطہ کر کے انٹرویو اور تصدیق مکمل کریں گے۔'
                      : 'Our admission desk has received your request. An admission clerk will contact your provided WhatsApp number shortly to confirm enrollment.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-sm mx-auto text-center space-y-1 shadow-inner">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">{locale === 'ur' ? 'آپ کی درخواست کا ٹریکنگ نمبر (ID):' : 'Your Application Tracking ID:'}</span>
                  <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 tracking-wider block font-en">{submittedId}</span>
                </div>

                <Button
                  type="button"
                  onClick={() => setSubmittedId(null)}
                  variant="outline"
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white border-slate-300 dark:border-white/20 font-bold text-xs h-10 px-6 rounded-xl"
                >
                  {locale === 'ur' ? '➕ کسی اور طالب علم کے لیے فارم پُر کریں' : '➕ Submit Another Application'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleOnlineAdmissionSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="studentName" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'طالب علم کا اسمِ گرامی (پہلا نام) *' : 'Student First Name *'}
                    </Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder={locale === 'ur' ? 'مثلاً: محمد / فاطمہ' : 'e.g. Muhammad / Fatima'}
                      className="h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-ur focus:bg-white dark:focus:bg-slate-900 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'آخری نام / عرفیت' : 'Last Name / Surname'}
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={locale === 'ur' ? 'مثلاً: علی / خان' : 'e.g. Ali / Khan'}
                      className="h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-ur focus:bg-white dark:focus:bg-slate-900 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="fatherName" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'والد / سرپرست کا نام *' : 'Father / Guardian Name *'}
                    </Label>
                    <Input
                      id="fatherName"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder={locale === 'ur' ? 'مثلاً: حاجی عبدالرحمٰن' : 'e.g. Haji Abdul Rahman'}
                      className="h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-ur focus:bg-white dark:focus:bg-slate-900 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'سرپرست کا واٹس ایپ / فون نمبر *' : 'Guardian WhatsApp / Phone *'}
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-en text-start focus:bg-white dark:focus:bg-slate-900 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'صنف (Gender) *' : 'Gender *'}
                    </Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="w-full h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs font-ur focus:bg-white dark:focus:bg-slate-900 rounded-xl">
                        <SelectValue placeholder={locale === 'ur' ? 'منتخب کریں...' : 'Select...'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-white/20 font-ur shadow-xl">
                        <SelectItem value="male">{locale === 'ur' ? 'لڑکا (Male)' : 'Male'}</SelectItem>
                        <SelectItem value="female">{locale === 'ur' ? 'لڑکی (Female)' : 'Female'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'مطلوبہ شعبہ / درجہ *' : 'Desired Course / Grade *'}
                    </Label>
                    <Select value={classId} onValueChange={setClassId}>
                      <SelectTrigger className="w-full h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs font-ur focus:bg-white dark:focus:bg-slate-900 rounded-xl">
                        <SelectValue placeholder={locale === 'ur' ? 'شعبہ منتخب کریں...' : 'Select course...'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-white/20 font-ur shadow-xl">
                        <SelectItem value="4">{locale === 'ur' ? 'حفظ القرآن الکریم (Hifz)' : 'Hifz al-Quran'}</SelectItem>
                        <SelectItem value="5">{locale === 'ur' ? 'درس نظامی سال اول (Aalim)' : 'Dars-e-Nizami Year 1'}</SelectItem>
                        <SelectItem value="1">{locale === 'ur' ? 'درجہ اول (Grade 1)' : 'Grade 1 - Schooling'}</SelectItem>
                        <SelectItem value="2">{locale === 'ur' ? 'درجہ پنجم (Grade 5)' : 'Grade 5 - Morning'}</SelectItem>
                        <SelectItem value="3">{locale === 'ur' ? 'میٹرک سائنس (Grade 10)' : 'Grade 10 - Science'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="age" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'طالب علم کی عمر (سال میں)' : 'Student Age (Years)'}
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="10"
                      className="h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-en text-start focus:bg-white dark:focus:bg-slate-900 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="previousSchool" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'سابقہ تعلیمی ادارہ / مدرسہ کا نام' : 'Previous School / Madrasa'}
                    </Label>
                    <Input
                      id="previousSchool"
                      value={previousSchool}
                      onChange={(e) => setPreviousSchool(e.target.value)}
                      placeholder={locale === 'ur' ? 'مثلاً: مدرسہ دارالعلوم / پبلک اسکول' : 'e.g. Dar-ul-Uloom / Public School'}
                      className="h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-ur focus:bg-white dark:focus:bg-slate-900 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {locale === 'ur' ? 'رہائشی پتہ اور شہر' : 'Residential Address & City'}
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={locale === 'ur' ? 'گلشنِ اقبال، کراچی' : 'Gulshan-e-Iqbal, Karachi'}
                      className="h-11 bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/15 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-ur focus:bg-white dark:focus:bg-slate-900 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-xl shadow-emerald-500/20 gap-2"
                  >
                    {submitting ? (
                      <span>{locale === 'ur' ? 'درخواست بھیجی جا رہی ہے...' : 'Submitting Application...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{locale === 'ur' ? '🚀 آن لائن داخلہ درخواست جمع کریں' : 'Submit Online Admission Application'}</span>
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[11px] text-center text-slate-400 pt-2">
                  🔒 {locale === 'ur' ? 'آپ کی معلومات 100% محفوظ ہیں اور صرف مدرسہ کے دفتر کو بھیجی جائیں گی۔' : 'Your information is secure and directly routed to our admission secretariat.'}
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{locale === 'ur' ? settings.madrasaNameUr : settings.madrasaNameEn}</span>
            </div>
            <p className="leading-relaxed opacity-80">
              {locale === 'ur' ? settings.taglineUr : settings.taglineEn}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm">{locale === 'ur' ? 'رابطہ اور دفتری اوقات' : 'Contact & Timings'}</h4>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400 shrink-0" /> <span>{locale === 'ur' ? settings.addressUr : settings.addressEn}</span></p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400 shrink-0" /> <span className="font-en">{settings.phone}</span></p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400 shrink-0" /> <span className="font-en">{settings.email}</span></p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm">{locale === 'ur' ? 'فوری روابط' : 'Quick Links'}</h4>
            <div className="flex flex-col gap-1">
              <a href="#about" className="hover:text-white transition-colors">{locale === 'ur' ? 'تعارف و پیغام' : 'About Institution'}</a>
              <a href="#departments" className="hover:text-white transition-colors">{locale === 'ur' ? 'شعبہ جات و کورسز' : 'Academic Faculty'}</a>
              <a href="#admission-form" className="hover:text-white transition-colors">{locale === 'ur' ? 'آن لائن داخلہ فارم' : 'Online Admission Portal'}</a>
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold mt-1">
                {locale === 'ur' ? '→ عملہ اور سرپرست لاگن پورٹل' : '→ Staff & Parent Portal Login'}
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} {locale === 'ur' ? settings.madrasaNameUr : settings.madrasaNameEn}. {locale === 'ur' ? 'جملہ حقوق محفوظ ہیں' : 'All rights reserved'}.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-white font-bold">Al-Hikmah Educational Management System</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
