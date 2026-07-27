"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Locale } from './dictionaries';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: typeof dictionaries['ur'];
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is Urdu ('ur') as required from Day 1
  const [locale, setLocaleState] = useState<Locale>('ur');

  useEffect(() => {
    // Check localStorage if user previously switched
    const savedLocale = localStorage.getItem('alhikmah_locale') as Locale;
    if (savedLocale && (savedLocale === 'ur' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Automatically apply RTL/LTR direction and lang attribute to <html> tag
    const dir = locale === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    localStorage.setItem('alhikmah_locale', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    setLocaleState(prev => (prev === 'ur' ? 'en' : 'ur'));
  };

  const dir = locale === 'ur' ? 'rtl' : 'ltr';
  const t = dictionaries[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
