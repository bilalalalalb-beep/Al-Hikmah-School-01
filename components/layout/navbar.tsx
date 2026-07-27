"use client";

import React from 'react';
import { Bell, Search, RefreshCw, Globe, Menu, Moon, Sun } from 'lucide-react';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';

interface NavbarProps {
  userRole: UserRole;
  userName: string;
  onRoleSwitch?: (newRole: UserRole) => void;
  onOpenMobileMenu?: () => void;
}

export function Navbar({ userRole, userName, onRoleSwitch, onOpenMobileMenu }: NavbarProps) {
  const router = useRouter();
  const { t, locale, toggleLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const roles: UserRole[] = ['admin', 'clerk', 'teacher', 'parent', 'accountant', 'warden'];

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      {/* Welcome Title & Mobile Menu Button */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-muted/80 hover:bg-accent text-foreground transition-colors border border-border/60 shrink-0"
            title="اوپن مینیو (Open Menu)"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-sm sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-1.5 sm:gap-2">
            <span className="truncate max-w-[180px] sm:max-w-none">{t.welcome}، {userName}!</span>
            <span className="text-xs font-normal text-muted-foreground hidden xl:inline">({t.academicYear})</span>
          </h2>
        </div>
      </div>

      {/* Right Action Items & Language Switcher */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search with RTL logical positioning */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="w-full h-9 ps-9 pe-4 text-xs rounded-full bg-muted/60 border border-border/60 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all font-ur"
          />
        </div>

        {/* Language Switcher Badge (Urdu / English) */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLocale}
          className="h-9 px-3 rounded-full border-primary/40 bg-primary/5 hover:bg-primary/15 text-primary font-bold text-xs gap-1.5 transition-all shadow-sm shrink-0"
          title="Switch Language / زبان تبدیل کریں"
        >
          <Globe className="w-3.5 h-3.5 animate-spin-slow" />
          <span>{locale === 'ur' ? 'English (LTR)' : 'اردو (RTL)'}</span>
        </Button>

        {/* Development Role Switcher for instant Demo / Review */}
        {onRoleSwitch && (
          <div className="hidden sm:flex items-center gap-1 bg-muted/70 p-1 rounded-lg border border-border/60 text-xs">
            <span className="text-[10px] font-bold px-1.5 text-muted-foreground flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-primary animate-spin-slow" />
              {t.devRole}
            </span>
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  if (onRoleSwitch) {
                    onRoleSwitch(r);
                  } else {
                    router.push(`/${r}`);
                  }
                }}
                className={`px-2 py-1 rounded font-semibold capitalize transition-all ${
                  userRole === r 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r === 'admin' ? (locale === 'ur' ? 'پرنسپل' : 'Admin') :
                 r === 'clerk' ? (locale === 'ur' ? 'کلرک' : 'Clerk') :
                 r === 'teacher' ? (locale === 'ur' ? 'استاد' : 'Teacher') :
                 r === 'parent' ? (locale === 'ur' ? 'والدین' : 'Parent') :
                 r === 'accountant' ? (locale === 'ur' ? 'خازن / اکاؤںٹنٹ' : 'Accountant') :
                 (locale === 'ur' ? 'ناظمِ دارالاقامہ' : 'Warden')}
              </button>
            ))}
          </div>
        )}

        {/* Notification Bell */}
        <button className="w-9 h-9 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent relative transition-colors shrink-0">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </button>
      </div>
    </header>
  );
}
