"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  Palette, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  UserCog, 
  HelpCircle,
  Eye,
  Upload,
  Trash2,
  Image as ImageIcon,
  MessageSquare,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n/context';
import { usePortalSettings, ThemeColor } from '@/lib/settings/context';
import { toast } from 'sonner';

interface PortalSettingsDeskProps {
  role: 'admin' | 'clerk';
}

export function PortalSettingsDesk({ role }: PortalSettingsDeskProps) {
  const { locale, dir } = useLanguage();
  const { settings, updateSettings, resetToDefault } = usePortalSettings();

  // Local form state initialized from context
  const [madrasaNameUr, setMadrasaNameUr] = useState(settings.madrasaNameUr);
  const [madrasaNameEn, setMadrasaNameEn] = useState(settings.madrasaNameEn);
  const [taglineUr, setTaglineUr] = useState(settings.taglineUr);
  const [taglineEn, setTaglineEn] = useState(settings.taglineEn);
  const [addressUr, setAddressUr] = useState(settings.addressUr);
  const [addressEn, setAddressEn] = useState(settings.addressEn);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [website, setWebsite] = useState(settings.website);
  const [themeColor, setThemeColor] = useState<ThemeColor>(settings.themeColor);
  const [allowClerkSettings, setAllowClerkSettings] = useState(settings.allowClerkSettings);
  const [admissionStatus, setAdmissionStatus] = useState<'open' | 'closed'>(settings.admissionStatus);
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo);

  // Hero Slider & Welcome Popup State
  const [heroSliderImages, setHeroSliderImages] = useState<string[]>(settings.heroSliderImages || []);
  const [heroSliderAnimation, setHeroSliderAnimation] = useState<'fade' | 'slide' | 'zoom'>(settings.heroSliderAnimation || 'fade');
  const [showWelcomePopup, setShowWelcomePopup] = useState<boolean>(settings.showWelcomePopup ?? true);
  const [welcomePopupTitleUr, setWelcomePopupTitleUr] = useState(settings.welcomePopupTitleUr || '');
  const [welcomePopupTitleEn, setWelcomePopupTitleEn] = useState(settings.welcomePopupTitleEn || '');
  const [welcomePopupMessageUr, setWelcomePopupMessageUr] = useState(settings.welcomePopupMessageUr || '');
  const [welcomePopupMessageEn, setWelcomePopupMessageEn] = useState(settings.welcomePopupMessageEn || '');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddSliderImage = () => {
    if (newImageUrl && !heroSliderImages.includes(newImageUrl)) {
      setHeroSliderImages([...heroSliderImages, newImageUrl]);
      setNewImageUrl('');
      toast.success(locale === 'ur' ? '✅ تصویر سلائیڈر میں شامل کر دی گئی' : '✅ Image added to slider');
    }
  };

  const handleRemoveSliderImage = (index: number) => {
    setHeroSliderImages(heroSliderImages.filter((_, i) => i !== index));
    toast.info(locale === 'ur' ? 'تصویر سلائیڈر سے ہٹا دی گئی' : 'Image removed from slider');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        updateSettings({ logo: result });
        toast.success(locale === 'ur' ? '✅ مدرسہ کا لوگو اپلوڈ اور محفوظ ہو گیا ہے!' : '✅ Madrasa logo uploaded and saved!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    updateSettings({ logo: null });
    toast.info(locale === 'ur' ? 'لوگو ہٹا دیا گیا ہے، اب ڈیفالٹ آئکن ظاہر ہوگا' : 'Logo removed, default icon will be used');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      madrasaNameUr,
      madrasaNameEn,
      taglineUr,
      taglineEn,
      addressUr,
      addressEn,
      phone,
      email,
      website,
      themeColor,
      allowClerkSettings,
      admissionStatus,
      logo: logoPreview,
      heroSliderImages,
      heroSliderAnimation,
      showWelcomePopup,
      welcomePopupTitleUr,
      welcomePopupTitleEn,
      welcomePopupMessageUr,
      welcomePopupMessageEn,
    });
    toast.success(
      locale === 'ur'
        ? '✅ مدرسہ کی تمام ترتیبات، ہیرو سلائیڈر، پاپ اپ پیغام اور اختیارات کامیابی سے محفوظ کر لیے گئے ہیں!'
        : '✅ Portal branding, hero slider, popup message, and permissions saved successfully!'
    );
  };

  const themeOptions: { id: ThemeColor; labelUr: string; labelEn: string; bgClass: string; borderClass: string }[] = [
    { id: 'emerald', labelUr: 'سبز اسلامی (Default)', labelEn: 'Islamic Emerald', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-500' },
    { id: 'blue', labelUr: 'نیلا شاہی (Royal)', labelEn: 'Royal Blue', bgClass: 'bg-blue-600', borderClass: 'border-blue-500' },
    { id: 'purple', labelUr: 'جامنی وقار (Premium)', labelEn: 'Deep Purple', bgClass: 'bg-purple-600', borderClass: 'border-purple-500' },
    { id: 'amber', labelUr: 'سنہری روایتی (Amber)', labelEn: 'Golden Amber', bgClass: 'bg-amber-600', borderClass: 'border-amber-500' },
    { id: 'teal', labelUr: 'فیروزی جدید (Teal)', labelEn: 'Vibrant Teal', bgClass: 'bg-teal-600', borderClass: 'border-teal-500' },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-primary/95 to-slate-900 p-6 rounded-2xl border border-primary/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start sm:items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-10 h-10 object-contain rounded" />
            ) : (
              <Settings className="w-7 h-7 animate-spin-slow" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-bold text-[11px]">
                {locale === 'ur' ? 'ماڈیول: پورٹل کنفیگریشن' : 'Module: Portal Configuration'}
              </Badge>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1 font-en">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {role === 'admin' ? 'Principal Executive Control' : 'Clerk Delegated Control'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {locale === 'ur' ? 'مدرسہ کی برانڈنگ، لوگو، تھیم اور اختیارات کنٹرول' : 'Madrasa Branding, Logo, Theme Colors & Access Control'}
            </h1>
            <p className="text-xs text-slate-300/90 mt-0.5 max-w-xl">
              {locale === 'ur'
                ? 'پورٹل کا نام، لوگو، پتہ، فون، کلرز اور کلرک کے اختیارات کو ایک کلک سے اپنی مرضی کے مطابق ترتیب دیں'
                : 'Customize portal logo, institution name, contact details, color palettes, and delegate clerk privileges seamlessly'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 z-10">
          <Button
            type="button"
            variant="outline"
            onClick={resetToDefault}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-10 px-4 text-xs font-bold gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{locale === 'ur' ? 'ڈیفالٹ بحال کریں' : 'Reset Default'}</span>
          </Button>

          <Button
            type="submit"
            variant="emerald"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold h-10 px-6 text-xs gap-2 shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{locale === 'ur' ? '💾 ترتیبات محفوظ کریں (Save)' : 'Save All Settings'}</span>
          </Button>
        </div>
      </div>

      {/* Permission Info / Clerk Notice */}
      {role === 'clerk' && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 flex items-center gap-3 text-xs sm:text-sm font-medium">
          <UserCog className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            {locale === 'ur'
              ? 'مبارک ہو! محترم مہتمم (Principal) کی جانب سے آپ کو ویب پورٹل کی ترتیبات اور برانڈنگ کنٹرول کرنے کا خصوصی اختیار تفویض کیا گیا ہے۔'
              : 'Notice: You have been granted executive delegation rights by the Principal to manage portal branding and settings.'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Branding & Identity (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>{locale === 'ur' ? '1. مدرسہ / جامعہ کا نام اور شناخت' : '1. Institution Name & Identity Branding'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'یہ نام سائڈ بار، لاگن اسکرین، فیس رسیدوں اور پبلک ویب سائٹ پر ظاہر ہوتا ہے' : 'This name appears on the sidebar, login screen, fee invoices, and public landing website'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="madrasaNameUr" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'مدرسہ کا نام (اردو میں) *' : 'Madrasa Name (Urdu) *'}
                  </Label>
                  <Input
                    id="madrasaNameUr"
                    value={madrasaNameUr}
                    onChange={(e) => setMadrasaNameUr(e.target.value)}
                    required
                    className="h-10 text-xs font-ur text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="madrasaNameEn" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'مدرسہ کا نام (انگلش میں) *' : 'Madrasa Name (English) *'}
                  </Label>
                  <Input
                    id="madrasaNameEn"
                    value={madrasaNameEn}
                    onChange={(e) => setMadrasaNameEn(e.target.value)}
                    required
                    className="h-10 text-xs font-en text-start"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="taglineUr" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'شعار / تعارفی جملہ (اردو)' : 'Tagline / Slogan (Urdu)'}
                  </Label>
                  <Input
                    id="taglineUr"
                    value={taglineUr}
                    onChange={(e) => setTaglineUr(e.target.value)}
                    className="h-10 text-xs font-ur text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="taglineEn" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'شعار / تعارفی جملہ (انگلش)' : 'Tagline / Slogan (English)'}
                  </Label>
                  <Input
                    id="taglineEn"
                    value={taglineEn}
                    onChange={(e) => setTaglineEn(e.target.value)}
                    className="h-10 text-xs font-en text-start"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload Card */}
          <Card className="border-border/80 bg-card shadow-sm border-l-4 border-l-amber-500">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                <span>{locale === 'ur' ? 'مدرسہ / جامعہ کا آفیشل لوگو (Logo Uploading)' : 'Official Institution Logo Upload'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'پی این جی یا جے پی جی لوگو اپلوڈ کریں جو سائڈ بار، نیویگیشن، رسیدوں اور پبلک ویب سائٹ پر ظاہر ہوگا' : 'Upload PNG/JPG logo displayed across sidebar, navbar, invoices, and public landing page'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner group">
                {logoPreview ? (
                  <img src={logoPreview} alt="Madrasa Logo" className="w-full h-full object-contain p-2 bg-white/10" />
                ) : (
                  <div className="text-center p-2 text-muted-foreground flex flex-col items-center">
                    <Building2 className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[10px] font-bold">{locale === 'ur' ? 'کوئی لوگو نہیں' : 'No Logo'}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3 flex-1 text-center sm:text-start">
                <div>
                  <h4 className="text-xs font-bold text-foreground">{locale === 'ur' ? 'شفاف (Transparent) یا مربع لوگو تجویز کیا جاتا ہے' : 'Transparent PNG or Square Logo Recommended'}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{locale === 'ur' ? 'زیادہ سے زیادہ فائل سائز: 2MB۔ اپلوڈ کرتے ہی پورے پورٹل پر فوراً لاگو ہو جائے گا۔' : 'Max file size: 2MB. Applied instantaneously across all portals upon selection.'}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="h-9 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{locale === 'ur' ? 'لوگو منتخب کریں...' : 'Select Logo File...'}</span>
                    </div>
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </Label>
                  {logoPreview && (
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveLogo} className="h-9 text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30">
                      <Trash2 className="w-3.5 h-3.5 me-1" /> {locale === 'ur' ? 'لوگو ہٹائیں' : 'Remove Logo'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Address Card */}
          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>{locale === 'ur' ? '2. پتہ، رابطہ اور پبلک معلومات' : '2. Address, Contact Details & Public Info'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'داخلہ فارم، رابطہ ڈیسک اور آفیشل انوائس پر درج ہونے والا پتہ اور فون نمبر' : 'Contact details printed on admission letters, fee invoices, and public school page'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="addressUr" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'مکمل رہائشی / دفتری پتہ (اردو)' : 'Physical Address (Urdu)'}
                  </Label>
                  <Input
                    id="addressUr"
                    value={addressUr}
                    onChange={(e) => setAddressUr(e.target.value)}
                    className="h-10 text-xs font-ur text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="addressEn" className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'مکمل رہائشی / دفتری پتہ (انگلش)' : 'Physical Address (English)'}
                  </Label>
                  <Input
                    id="addressEn"
                    value={addressEn}
                    onChange={(e) => setAddressEn(e.target.value)}
                    className="h-10 text-xs font-en text-start"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{locale === 'ur' ? 'فون نمبر / واٹس ایپ:' : 'Phone / WhatsApp:'}</span>
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 text-xs font-en text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>{locale === 'ur' ? 'آفیشل ای میل:' : 'Official Email:'}</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-xs font-en text-start"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-purple-500" />
                    <span>{locale === 'ur' ? 'ویب سائٹ یو آر ایل:' : 'Website URL:'}</span>
                  </Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="h-10 text-xs font-en text-start"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Slider Settings Card */}
          <Card className="border-border/80 bg-card shadow-sm border-l-4 border-l-emerald-500">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                <span>{locale === 'ur' ? '5. پبلک ویب سائٹ ہیرو سلائیڈر (Hero Carousel)' : '5. Public Homepage Hero Slider'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'لینڈنگ پیج پر چلنے والی تصاویر اور ان کے تبدیل ہونے کا انداز (اینیمیشن) کنٹرول کریں' : 'Manage banner images and transition animations on the public school website'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground">
                  {locale === 'ur' ? 'سلائیڈر اینیمیشن کا انداز (Animation Type):' : 'Slider Transition Animation:'}
                </Label>
                <Select value={heroSliderAnimation} onValueChange={(v: 'fade' | 'slide' | 'zoom') => setHeroSliderAnimation(v)}>
                  <SelectTrigger className="h-10 text-xs font-ur">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-ur">
                    <SelectItem value="fade">{locale === 'ur' ? 'آہستہ نمودار ہونا (Fade Transition)' : 'Fade Transition'}</SelectItem>
                    <SelectItem value="slide">{locale === 'ur' ? 'بائیں سے دائیں سرکنا (Slide Animation)' : 'Slide Animation'}</SelectItem>
                    <SelectItem value="zoom">{locale === 'ur' ? 'زوم ان اثر (Zoom & Pan Effect)' : 'Zoom & Pan Effect'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-foreground block">
                  {locale === 'ur' ? `موجودہ سلائیڈر تصاویر (${heroSliderImages.length}):` : `Active Slider Images (${heroSliderImages.length}):`}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {heroSliderImages.map((imgUrl, idx) => (
                    <div key={idx} className="group relative rounded-xl overflow-hidden border border-border bg-muted h-24 shadow-sm flex items-center justify-center">
                      <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <button
                        type="button"
                        onClick={() => handleRemoveSliderImage(idx)}
                        className="absolute top-1.5 end-1.5 p-1 rounded-full bg-destructive/90 text-white hover:bg-destructive shadow-md transition-all opacity-90 group-hover:opacity-100"
                        title={locale === 'ur' ? 'تصویر ہٹائیں' : 'Remove Image'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <Input
                    placeholder={locale === 'ur' ? 'نئی تصویر کا یو آر ایل (URL) یہاں لکھیں...' : 'Paste new image URL (e.g. Unsplash or Cloudinary)...'}
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="h-10 text-xs font-en text-start flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddSliderImage} className="h-10 text-xs font-bold gap-1.5 shrink-0 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white">
                    <Plus className="w-4 h-4" />
                    <span>{locale === 'ur' ? 'شامل کریں' : 'Add Image'}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Popup Settings Card */}
          <Card className="border-border/80 bg-card shadow-sm border-l-4 border-l-blue-500">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span>{locale === 'ur' ? '6. ویب سائٹ ویلکم پاپ اپ پیغام (Welcome Popup Dialog)' : '6. Homepage Welcome Popup Message'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'ویب سائٹ کھلتے ہی زائرین اور نئے طلباء کو دکھایا جانے والا خصوصی پیغام یا اعلان' : 'Special announcement dialog displayed automatically when visitors land on homepage'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-between">
                <Label className="text-xs font-bold text-foreground flex items-center gap-2 cursor-pointer" onClick={() => setShowWelcomePopup(!showWelcomePopup)}>
                  <span>{locale === 'ur' ? 'پاپ اپ پیغام فعال رکھیں:' : 'Enable Welcome Popup:'}</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowWelcomePopup(!showWelcomePopup)}
                  className={`w-12 h-6 rounded-full transition-colors relative px-0.5 flex items-center shrink-0 cursor-pointer ${
                    showWelcomePopup ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      showWelcomePopup ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'پیغام کا عنوان (اردو)' : 'Popup Title (Urdu)'}
                  </Label>
                  <Input
                    value={welcomePopupTitleUr}
                    onChange={(e) => setWelcomePopupTitleUr(e.target.value)}
                    className="h-10 text-xs font-ur text-start"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'پیغام کا عنوان (انگلش)' : 'Popup Title (English)'}
                  </Label>
                  <Input
                    value={welcomePopupTitleEn}
                    onChange={(e) => setWelcomePopupTitleEn(e.target.value)}
                    className="h-10 text-xs font-en text-start"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'تفصیلی پیغام (اردو)' : 'Detailed Message (Urdu)'}
                  </Label>
                  <textarea
                    rows={3}
                    value={welcomePopupMessageUr}
                    onChange={(e) => setWelcomePopupMessageUr(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-ur text-start focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    {locale === 'ur' ? 'تفصیلی پیغام (انگلش)' : 'Detailed Message (English)'}
                  </Label>
                  <textarea
                    rows={3}
                    value={welcomePopupMessageEn}
                    onChange={(e) => setWelcomePopupMessageEn(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-en text-start focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Colors & Permissions (1 span) */}
        <div className="space-y-6">
          {/* Theme & Colors Card */}
          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-500" />
                <span>{locale === 'ur' ? '3. کلرز اور تھیم پیلیٹ' : '3. Color Palette & Theme'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'پورٹل کا بنیادی رنگ اور اسکرین کا انداز منتخب کریں' : 'Choose active accent color for buttons and portal highlights'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground block">
                  {locale === 'ur' ? 'بنیادی کلر تھیم منتخب کریں:' : 'Select Accent Color Scheme:'}
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setThemeColor(opt.id);
                        toast.info(locale === 'ur' ? `🎨 تھیم منتخب: ${opt.labelUr}` : `🎨 Theme Selected: ${opt.labelEn}`);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all text-start ${
                        themeColor === opt.id
                          ? `${opt.borderClass} bg-muted font-bold shadow-sm ring-2 ring-primary/20`
                          : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg ${opt.bgClass} shadow-sm shrink-0 flex items-center justify-center text-white text-[10px] font-extrabold`}>
                          {themeColor === opt.id && '✓'}
                        </div>
                        <span className="text-xs text-foreground font-semibold">
                          {locale === 'ur' ? opt.labelUr : opt.labelEn}
                        </span>
                      </div>
                      {themeColor === opt.id && (
                        <Badge variant="outline" className="text-[9px] font-extrabold border-primary/40 text-primary">
                          {locale === 'ur' ? 'فعال' : 'Active'}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Control & Permissions Card */}
          <Card className="border-border/80 bg-card shadow-sm border-t-4 border-t-purple-500">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                <span>{locale === 'ur' ? '4. اختیارات اور رسائی کنٹرول' : '4. Access Control & Delegation'}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {locale === 'ur' ? 'کلرک کے اختیارات اور پبلک داخلہ فارم کی حالت' : 'Manage clerk delegation rights and public admission portal status'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {/* Clerk Permission Switch */}
              <div className="p-4 rounded-xl bg-muted/60 border border-border/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {allowClerkSettings ? (
                        <Unlock className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span>{locale === 'ur' ? 'کلرک کو ترتیبات کا اختیار دیں' : 'Allow Clerk Settings Access'}</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {locale === 'ur'
                        ? 'اگر یہ آن ہو تو کلرک بھی اپنے پورٹل سے مدرسہ کا نام، پتہ اور ترتیبات تبدیل کر سکے گا'
                        : 'If enabled, the Clerk can access this settings tab in their portal to manage branding'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={role !== 'admin'}
                    onClick={() => {
                      const newVal = !allowClerkSettings;
                      setAllowClerkSettings(newVal);
                      toast.success(
                        locale === 'ur'
                          ? newVal
                            ? '🔓 کلرک کو پورٹل ترتیبات سنبھالنے کا مکمل اختیار دے دیا گیا ہے!'
                            : '🔒 کلرک کا ترتیبات پر اختیار ختم کر دیا گیا (صرف پرنسپل کے پاس ہے)!'
                          : newVal
                            ? '🔓 Granted Portal Settings delegation rights to Clerk!'
                            : '🔒 Revoked Clerk access (Restricted to Principal only)!'
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative px-0.5 flex items-center shrink-0 ${
                      allowClerkSettings ? 'bg-emerald-600' : 'bg-slate-700'
                    } ${role !== 'admin' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        allowClerkSettings ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {role !== 'admin' && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                    ⚠️ {locale === 'ur' ? 'یہ اختیار صرف مہتمم (Principal) کے لاگن سے تبدیل کیا جا سکتا ہے' : 'Only Principal login can modify this privilege'}
                  </p>
                )}
              </div>

              {/* Online Admission Portal Switch */}
              <div className="p-4 rounded-xl bg-muted/60 border border-border/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{locale === 'ur' ? 'آن لائن داخلہ فارم کی حالت' : 'Online Admission Form Status'}</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {locale === 'ur'
                        ? 'پبلک لینڈنگ پیج پر نئے طلباء کے لیے داخلہ فارم فعال رکھیں یا بند کریں'
                        : 'Keep the online enrollment form open or closed for new applicants on public homepage'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newVal = admissionStatus === 'open' ? 'closed' : 'open';
                      setAdmissionStatus(newVal);
                      toast.info(
                        locale === 'ur'
                          ? newVal === 'open'
                            ? '🟢 آن لائن داخلے کھول دیے گئے ہیں!'
                            : '🔴 آن لائن داخلے عارضی طور پر بند کر دیے گئے ہیں!'
                          : newVal === 'open'
                            ? '🟢 Online Admissions opened!'
                            : '🔴 Online Admissions closed!'
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative px-0.5 flex items-center shrink-0 cursor-pointer ${
                      admissionStatus === 'open' ? 'bg-blue-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                        admissionStatus === 'open' ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {locale === 'ur' ? 'موجودہ حالت:' : 'Current Status:'}
                  </span>
                  <Badge className={`text-xs font-bold ${admissionStatus === 'open' ? 'bg-emerald-500 text-white' : 'bg-destructive text-white'}`}>
                    {admissionStatus === 'open' ? (locale === 'ur' ? '🟢 کھلے ہیں (Open)' : '🟢 Open') : (locale === 'ur' ? '🔴 بند ہیں (Closed)' : '🔴 Closed')}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 border-t border-border/60">
              <Button type="submit" variant="emerald" className="w-full h-10 font-bold text-xs gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{locale === 'ur' ? 'محفوظ کریں (Save All Changes)' : 'Save All Changes'}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
