"use client";

import React from 'react';
import { PortalSettingsDesk } from '@/components/settings/portal-settings-desk';
import { usePortalSettings } from '@/lib/settings/context';
import { useLanguage } from '@/lib/i18n/context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClerkSettingsPage() {
  const { settings } = usePortalSettings();
  const { locale } = useLanguage();

  if (!settings.allowClerkSettings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="max-w-md w-full border-2 border-amber-500/50 bg-card shadow-xl text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            {locale === 'ur' ? 'اختیار محدود ہے (Restricted Access)' : 'Access Restricted'}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {locale === 'ur'
              ? 'محترم کلرک صاحب! اس وقت آپ کو ویب پورٹل کی ترتیبات اور برانڈنگ تبدیل کرنے کی رسائی حاصل نہیں ہے۔ اگر آپ کو مدرسہ کا نام یا پتہ اپڈیٹ کرنا ہے تو مہتمم (Principal) صاحب سے درخواست کریں کہ وہ اپنی سیٹنگز سے آپ کا ٹیب فعال کریں۔'
              : 'Notice: You do not have executive delegation privileges to manage portal branding or system settings. Please request the Principal to enable access from their admin dashboard.'}
          </CardDescription>
          <div className="pt-2">
            <Link href="/clerk">
              <Button variant="outline" className="w-full h-10 font-bold text-xs gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>{locale === 'ur' ? 'کلرک ڈیسک پر واپس جائیں' : 'Back to Clerk Desk'}</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <PortalSettingsDesk role="clerk" />;
}
