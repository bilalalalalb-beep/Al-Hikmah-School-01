"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light'); // Enforce light theme as requested by user ("ڈارک والا سسٹم ختم کردیں")
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      // Force light theme and remove any dark class from documentElement
      localStorage.setItem('alhikmah_theme', 'light');
      document.documentElement.classList.remove('dark');
    } catch (e) {
      console.error('Failed to load theme from localStorage', e);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState('light');
    try {
      localStorage.setItem('alhikmah_theme', 'light');
      document.documentElement.classList.remove('dark');
    } catch (e) {
      console.error('Failed to save theme to localStorage', e);
    }
  };

  const toggleTheme = () => {
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
