"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ShieldCheck, UserCheck, BookOpen, Lock, Mail, ArrowLeft, ArrowRight, AlertCircle, Globe, Wallet, Home } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/context';

export default function LoginPage() {
  const router = useRouter();
  const { locale, toggleLocale, dir } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || (locale === 'ur' ? "لاگ ان ناکام ہوا۔ براہ کرم اپنا ای میل اور پاسورڈ دوبارہ چیک کریں!" : "Login failed. Please check your email and password!"));
      } else if (data.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const userRole = (profileData as { role?: string } | null)?.role || 'admin';
        router.push(`/${userRole}`);
      }
    } catch (err: any) {
      setError(locale === 'ur' ? "سرور سے رابطہ ناکام رہا۔ براہ کرم اپنا ای میل اور پاسورڈ چیک کریں یا منتظم سے رابطہ کریں!" : "Connection failed. Please check your credentials or contact administrator!");
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden font-ur">
      {/* Top Language Toggle Badge */}
      <div className="absolute top-6 end-6 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLocale}
          className="h-9 px-3 rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs gap-2 transition-all shadow-lg backdrop-blur-md"
        >
          <Globe className="w-4 h-4 animate-spin-slow text-emerald-400" />
          <span>{locale === 'ur' ? 'Switch to English (LTR)' : 'اردو میں دیکھیں (RTL)'}</span>
        </Button>
      </div>

      {/* Background Geometric Decorations */}
      <div className="absolute top-1/4 start-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 end-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mx-auto mb-4 border border-white/20">
            <Sparkles className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {locale === 'ur' ? 'جامعہ الحکمہ تعلیمی پورٹل' : 'Al-Hikmah System'}
          </h1>
          <p className="text-sm text-emerald-200/80 mt-1 font-medium">
            {locale === 'ur' ? 'جدید ترین مدرسہ و سکول مینجمنٹ سسٹم' : 'Next-Gen School & Madrasa Management Portal'}
          </p>
        </div>

        <Card className="border-white/10 bg-slate-900/85 backdrop-blur-xl shadow-2xl text-slate-100">
          <CardHeader className="space-y-1 pb-4 text-center">
            <CardTitle className="text-xl font-bold text-white">
              {locale === 'ur' ? 'اپنے اکاؤنٹ میں لاگ ان کریں' : 'Sign In to Your Account'}
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              {locale === 'ur' ? 'اپنی معلومات درج کریں یا نیچے دیے گئے تجرباتی رول سے مشاہدہ کریں' : 'Enter your credentials or choose a role below to preview'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30 flex items-start gap-2 text-xs text-destructive-foreground">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleSupabaseLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-300">
                  {locale === 'ur' ? 'ای میل ایڈریس / Email Address' : 'Email Address'}
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="principal@alhikmah.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ps-9 pe-4 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 h-10 font-en text-start"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-300">
                    {locale === 'ur' ? 'پاسورڈ / Password' : 'Password'}
                  </Label>
                  <a href="#" className="text-[11px] text-emerald-400 hover:underline">
                    {locale === 'ur' ? 'پاسورڈ بھول گئے ہیں؟' : 'Forgot password?'}
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ps-9 pe-4 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 h-10 font-en text-start"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="emerald"
                className="w-full h-10 font-bold text-sm"
                disabled={loading}
              >
                {loading ? (locale === 'ur' ? "تصدیق کی جا رہی ہے..." : "Authenticating...") : (locale === 'ur' ? "Supabase سے لاگ ان کریں" : "Sign In with Supabase")}
                <ArrowIcon className="w-4 h-4 ms-2 shrink-0" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6 font-en">
          Single-Tenant Free-to-Host Architecture &bull; Al-Hikmah v1.0
        </p>
      </div>
    </div>
  );
}
