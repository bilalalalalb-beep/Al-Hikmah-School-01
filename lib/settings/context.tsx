"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type ThemeColor = 'emerald' | 'blue' | 'purple' | 'amber' | 'teal';

export interface PortalSettings {
  madrasaNameUr: string;
  madrasaNameEn: string;
  taglineUr: string;
  taglineEn: string;
  addressUr: string;
  addressEn: string;
  phone: string;
  email: string;
  website: string;
  themeColor: ThemeColor;
  allowClerkSettings: boolean;
  admissionStatus: 'open' | 'closed';
  logo: string | null;
  heroSliderImages: string[];
  heroSliderAnimation: 'fade' | 'slide' | 'zoom';
  showWelcomePopup: boolean;
  welcomePopupTitleUr: string;
  welcomePopupTitleEn: string;
  welcomePopupMessageUr: string;
  welcomePopupMessageEn: string;
}

interface PortalSettingsContextType {
  settings: PortalSettings;
  updateSettings: (newSettings: Partial<PortalSettings>) => void;
  resetToDefault: () => void;
}

const defaultSettings: PortalSettings = {
  madrasaNameUr: 'جامعہ الحکمہ الاسلامیہ',
  madrasaNameEn: 'Al-Hikmah Islamic Institute',
  taglineUr: 'علم و حکمت کا منبع و مرکز برائے تعلیم و تربیت',
  taglineEn: 'Center of Excellence for Islamic & Modern Education',
  addressUr: 'گلشنِ اقبال، بلاک 10، کراچی، پاکستان',
  addressEn: 'Gulshan-e-Iqbal, Block 10, Karachi, Pakistan',
  phone: '+92 21 34567890 / +92 300 1234567',
  email: 'info@alhikmah.edu.pk',
  website: 'www.alhikmah.edu.pk',
  themeColor: 'emerald',
  allowClerkSettings: false,
  admissionStatus: 'open',
  logo: null,
  heroSliderImages: [
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=80',
  ],
  heroSliderAnimation: 'fade',
  showWelcomePopup: true,
  welcomePopupTitleUr: 'داخلے جاری ہیں - تعلیمی سال 2026-2027',
  welcomePopupTitleEn: 'Admissions Open - Academic Year 2026-2027',
  welcomePopupMessageUr: 'جامعہ الحکمہ الاسلامیہ میں شعبہ حفظ، تجوید، اور عصری علوم کے لیے نئے داخلوں کا آغاز ہو چکا ہے۔ تمام درجات میں محدود نشستیں دستیاب ہیں۔ آج ہی آن لائن داخلہ فارم پُر کریں یا دفتر سے رابطہ فرمائیں۔',
  welcomePopupMessageEn: 'Admissions are now open for Hifz, Tajweed, and School Grades (1-10) for the upcoming academic session. Limited seats available. Apply online or contact the admission office today.',
};

const PortalSettingsContext = createContext<PortalSettingsContextType | undefined>(undefined);

export function PortalSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<PortalSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alhikmah_portal_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettingsState({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.error('Failed to load portal settings from localStorage', e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem('alhikmah_portal_settings', JSON.stringify(settings));
        // Apply theme color attribute to documentElement for dynamic CSS styling if needed
        document.documentElement.setAttribute('data-theme-color', settings.themeColor);
      } catch (e) {
        console.error('Failed to save portal settings to localStorage', e);
      }
    }
  }, [settings, loaded]);

  const updateSettings = (newSettings: Partial<PortalSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  const resetToDefault = () => {
    setSettingsState(defaultSettings);
    localStorage.removeItem('alhikmah_portal_settings');
    toast.success('مدرسہ کی تمام ترتیبات اور برانڈنگ ڈیفالٹ حالت میں بحال کر دی گئی ہیں!');
  };

  return (
    <PortalSettingsContext.Provider value={{ settings, updateSettings, resetToDefault }}>
      {children}
    </PortalSettingsContext.Provider>
  );
}

export function usePortalSettings() {
  const context = useContext(PortalSettingsContext);
  if (!context) {
    throw new Error('usePortalSettings must be used within a PortalSettingsProvider');
  }
  return context;
}
