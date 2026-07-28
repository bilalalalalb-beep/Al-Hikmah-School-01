"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  Wallet, 
  Award, 
  UserCog,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
  X,
  Settings,
  Globe,
  Home,
  Bed,
  Clock,
  Printer,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { RoleBadge } from './role-badge';
import { useLanguage } from '@/lib/i18n/context';
import { usePortalSettings } from '@/lib/settings/context';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  onLogout?: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ userRole, userName, userEmail, onLogout, isMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { t, dir, locale } = useLanguage();
  const { settings } = usePortalSettings();

  const navLinks = [
    // Public Portal Quick Link for Principal (Admin) ONLY
    { title: locale === 'ur' ? '🌐 بیرونی ویب سائٹ (لینڈنگ پیج)' : '🌐 Public School Website', href: '/', icon: Globe, roles: ['admin'], badge: locale === 'ur' ? 'لائیو' : 'Live', target: '_blank' },

    // Admin Links
    { title: t.navAdminOverview, href: '/admin', icon: LayoutDashboard, roles: ['admin'] },
    { title: locale === 'ur' ? 'اساتذہ و ملازمین (HR)' : 'Staff & HR', href: '/admin/hr', icon: Users, roles: ['admin'], badge: locale === 'ur' ? 'پے رول' : 'Payroll' },
    { title: locale === 'ur' ? 'مرکزی رپورٹنگ اور لسٹیں (Reports Hub)' : 'Reports & Print Hub', href: '/admin/reports', icon: Printer, roles: ['admin'], badge: locale === 'ur' ? 'پرنٹ / PDF' : 'PDF / Print' },
    { title: t.navStaffRoles, href: '/admin/users', icon: UserCog, roles: ['admin'] },
    { title: t.navClassesSections, href: '/admin/classes', icon: Building2, roles: ['admin'] },
    { title: locale === 'ur' ? 'نظام الاوقات (Timetable)' : 'Timetable', href: '/admin/timetable', icon: Clock, roles: ['admin'], badge: locale === 'ur' ? 'نیا' : 'New' },
    { title: t.navAllStudents, href: '/admin/students', icon: GraduationCap, roles: ['admin'] },
    { title: t.navFinancialAnalytics, href: '/admin/finance', icon: Wallet, roles: ['admin'] },
    { title: t.navSchoolAttendance, href: '/admin/attendance', icon: CalendarCheck, roles: ['admin'] },
    { title: t.navExamsResults || (locale === 'ur' ? 'امتحانات اور نتائج' : 'Exams & Results'), href: '/admin/exams', icon: Award, roles: ['admin'] },
    { title: t.navCommunication || (locale === 'ur' ? 'واٹس ایپ اور الرٹ نظام' : 'WhatsApp Alerts'), href: '/admin/communication', icon: MessageSquare, roles: ['admin'], badge: locale === 'ur' ? 'لائیو' : 'Live' },
    { title: locale === 'ur' ? 'پورٹل ترتیبات اور برانڈنگ' : 'Portal Settings & Branding', href: '/admin/settings', icon: Settings, roles: ['admin'], badge: locale === 'ur' ? 'اختیار' : 'Control' },

    // Clerk Links
    { title: t.navClerkDesk, href: '/clerk', icon: LayoutDashboard, roles: ['clerk'] },
    { title: t.navNewAdmissions, href: '/clerk/admissions', icon: GraduationCap, roles: ['clerk'], badge: locale === 'ur' ? 'نیا' : 'New' },
    { title: t.navFeeCollection, href: '/clerk/finance', icon: Wallet, roles: ['clerk'] },
    { title: t.navExpenseTracker, href: '/clerk/expenses', icon: BookOpen, roles: ['clerk'] },
    { title: t.navCommunication || (locale === 'ur' ? 'واٹس ایپ اور الرٹ نظام' : 'WhatsApp Alerts'), href: '/clerk/communication', icon: MessageSquare, roles: ['clerk'], badge: locale === 'ur' ? 'لائیو' : 'Live' },
    ...(settings.allowClerkSettings ? [{ title: locale === 'ur' ? 'پورٹل ترتیبات اور برانڈنگ' : 'Portal Settings & Branding', href: '/clerk/settings', icon: Settings, roles: ['clerk'], badge: locale === 'ur' ? 'تفویض' : 'Granted' }] : []),

    // Teacher Links
    { title: t.navTeacherPortal, href: '/teacher', icon: LayoutDashboard, roles: ['teacher'] },
    { title: t.navAssignedClasses, href: '/teacher/classes', icon: Building2, roles: ['teacher'] },
    { title: locale === 'ur' ? 'میرا ٹائم ٹیبل' : 'My Timetable', href: '/teacher/timetable', icon: Clock, roles: ['teacher'], badge: locale === 'ur' ? 'نیا' : 'New' },
    { title: t.navDailyAttendance, href: '/teacher/attendance', icon: CalendarCheck, roles: ['teacher'], badge: locale === 'ur' ? 'آج' : 'Today' },
    { title: t.navExamsResults, href: '/teacher/exams', icon: Award, roles: ['teacher'] },
    ...(t.navDailyAttendance ? [] : []), // fallback safety

    // Parent Links
    { title: t.navParentPortal, href: '/parent', icon: LayoutDashboard, roles: ['parent'] },
    { title: t.navChildAttendance, href: '/parent/attendance', icon: CalendarCheck, roles: ['parent'], badge: locale === 'ur' ? 'لائیو' : 'Live' },
    { title: t.navChildFeeInvoices, href: '/parent/finance', icon: Wallet, roles: ['parent'] },
    { title: t.navChildExams, href: '/parent/exams', icon: Award, roles: ['parent'] },

    // Accountant / Finance Officer Links (خازن / اکاؤںٹنٹ)
    { title: locale === 'ur' ? 'خازن مرکزی ڈیش بورڈ' : 'Finance Desk', href: '/accountant', icon: LayoutDashboard, roles: ['accountant'], badge: locale === 'ur' ? 'مالیات' : 'Finance' },
    { title: t.navFeeCollection || (locale === 'ur' ? 'فیس وصولی اور رسیدیں' : 'Fee Receipts'), href: '/clerk/finance', icon: Wallet, roles: ['accountant'], badge: locale === 'ur' ? 'کیش' : 'Cash' },
    { title: t.navExpenseTracker || (locale === 'ur' ? 'اخراجات اور روزنامچہ' : 'Expenses & Ledger'), href: '/clerk/expenses', icon: BookOpen, roles: ['accountant'] },
    { title: locale === 'ur' ? 'نیا داخلہ اور فیس چالان' : 'Admissions & Challans', href: '/clerk/admissions', icon: GraduationCap, roles: ['accountant'] },
    { title: t.navCommunication || (locale === 'ur' ? 'واٹس ایپ فیس یاددہانی' : 'WhatsApp Alerts'), href: '/clerk/communication', icon: MessageSquare, roles: ['accountant'] },

    // Hostel Warden Links (ناظمِ دارالاقامہ)
    { title: locale === 'ur' ? 'دارالاقامہ کنٹرول پورٹل' : 'Hostel Desk', href: '/warden', icon: LayoutDashboard, roles: ['warden'], badge: locale === 'ur' ? 'مرکزی' : 'Hub' },
    { title: locale === 'ur' ? 'رہائش اور کمروں کی تقسیم' : 'Room Allocation', href: '/warden/rooms', icon: Home, roles: ['warden'], badge: locale === 'ur' ? 'منزلیں' : 'Rooms' },
    { title: locale === 'ur' ? 'نمازوں کی حاضری اور بیداری' : 'Prayer Attendance', href: '/warden/prayers', icon: Clock, roles: ['warden'], badge: locale === 'ur' ? '5 وقت' : '5 Times' },
    { title: locale === 'ur' ? 'ہاسٹل اعلانات اور ہدایات' : 'Hostel Notice Board', href: '/warden/notices', icon: MessageSquare, roles: ['warden'] },
    { title: locale === 'ur' ? 'ہاسٹل طلباء کی فہرست' : 'Hostel Students Directory', href: '/admin/students', icon: Users, roles: ['warden'] },
  ];

  const filteredLinks = navLinks.filter(link => link.roles.includes(userRole));
  const ChevronIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const sidebarContent = (
    <aside className={cn(
      "w-64 bg-card border-e border-border min-h-screen flex flex-col justify-between shadow-xl shadow-slate-900/5 z-20 transition-all duration-300 shrink-0",
      isMobile ? "w-72 shadow-2xl min-h-full" : "hidden lg:flex"
    )}>
      {/* Top Header / Branding */}
      <div>
        <div className="p-6 border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent flex items-center justify-between">
          <Link href={`/${userRole}`} onClick={onCloseMobile} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-teal-500 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200 shrink-0 overflow-hidden">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-0.5 bg-white" />
              ) : (
                <Sparkles className="w-5 h-5 animate-pulse" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-tight text-foreground truncate max-w-[160px]">
                {locale === 'ur' ? settings.madrasaNameUr : settings.madrasaNameEn}
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground tracking-wide truncate max-w-[160px]">
                {locale === 'ur' ? 'مدرسہ و سکول سسٹم' : 'Madrasa & School'}
              </p>
            </div>
          </Link>
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
          <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {locale === 'ur' ? 'نیویگیشن مینیو' : 'Navigation Menu'}
          </p>
          {filteredLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                target={(item as any).target || '_self'}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/15 font-bold" 
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-primary/15 text-primary"
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronIcon className="w-4 h-4 text-primary-foreground opacity-80 shrink-0" />}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / User Profile Card */}
      <div className="p-4 border-t border-border/80 bg-muted/30">
        <div className="p-3 rounded-xl bg-card border border-border/60 shadow-sm mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary text-xs uppercase shrink-0">
              {userName ? userName.slice(0, 2) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-foreground truncate font-ur">{userName}</p>
              <p className="text-[11px] text-muted-foreground truncate font-en">{userEmail}</p>
            </div>
          </div>
          <div className="mt-1">
            <RoleBadge role={userRole} />
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20 font-ur"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>{t.logout}</span>
          </button>
        )}
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex lg:hidden">
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onCloseMobile} />
        <div className="relative z-50 flex flex-col h-full animate-in slide-in-from-start duration-300">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return sidebarContent;
}
