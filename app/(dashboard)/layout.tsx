"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { UserRole } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('admin');
  const { locale } = useLanguage();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Urdu primary default user names
  const [userName, setUserName] = useState<string>('مولانا طارق صاحب (پرنسپل)');
  const [userEmail, setUserEmail] = useState<string>('principal@alhikmah.edu');
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setRole('admin');
      setUserName(locale === 'ur' ? 'مولانا طارق صاحب (پرنسپل)' : 'Maulana Tariq (Principal)');
      setUserEmail('principal@alhikmah.edu');
    } else if (pathname.startsWith('/clerk')) {
      setRole('clerk');
      setUserName(locale === 'ur' ? 'حافظ زبیر صاحب (نائب مہتمم / کلرک)' : 'Hafiz Zubair (Clerk / VP)');
      setUserEmail('clerk@alhikmah.edu');
    } else if (pathname.startsWith('/teacher')) {
      setRole('teacher');
      setUserName(locale === 'ur' ? 'استاد احمد صاحب (شعبہ عالمیت)' : 'Ustad Ahmed (Alimiyah Dept)');
      setUserEmail('ahmed@alhikmah.edu');
    } else if (pathname.startsWith('/parent')) {
      setRole('parent');
      setUserName(locale === 'ur' ? 'حاجی محمد امین صاحب (سرپرست)' : 'Haji Muhammad Amin (Parent)');
      setUserEmail('parent@alhikmah.edu');
    } else if (pathname.startsWith('/accountant')) {
      setRole('accountant');
      setUserName(locale === 'ur' ? 'مولانا عبید صاحب (خازن / اکاؤںٹنٹ)' : 'Maulana Ubaid (Finance Officer)');
      setUserEmail('accountant@alhikmah.edu');
    } else if (pathname.startsWith('/warden')) {
      setRole('warden');
      setUserName(locale === 'ur' ? 'قاری عمران صاحب (ناظمِ دارالاقامہ)' : 'Qari Imran (Hostel Warden)');
      setUserEmail('warden@alhikmah.edu');
    }
  }, [pathname, locale]);

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setUserName(locale === 'ur' ? 'مولانا طارق صاحب (پرنسپل)' : 'Maulana Tariq (Principal)');
      setUserEmail('principal@alhikmah.edu');
      router.push('/admin');
    } else if (newRole === 'clerk') {
      setUserName(locale === 'ur' ? 'حافظ زبیر صاحب (نائب مہتمم / کلرک)' : 'Hafiz Zubair (Clerk / VP)');
      setUserEmail('clerk@alhikmah.edu');
      router.push('/clerk');
    } else if (newRole === 'teacher') {
      setUserName(locale === 'ur' ? 'استاد احمد صاحب (شعبہ عالمیت)' : 'Ustad Ahmed (Alimiyah Dept)');
      setUserEmail('ahmed@alhikmah.edu');
      router.push('/teacher');
    } else if (newRole === 'parent') {
      setUserName(locale === 'ur' ? 'حاجی محمد امین صاحب (سرپرست)' : 'Haji Muhammad Amin (Parent)');
      setUserEmail('parent@alhikmah.edu');
      router.push('/parent');
    } else if (newRole === 'accountant') {
      setUserName(locale === 'ur' ? 'مولانا عبید صاحب (خازن / اکاؤںٹنٹ)' : 'Maulana Ubaid (Finance Officer)');
      setUserEmail('accountant@alhikmah.edu');
      router.push('/accountant');
    } else if (newRole === 'warden') {
      setUserName(locale === 'ur' ? 'قاری عمران صاحب (ناظمِ دارالاقامہ)' : 'Qari Imran (Hostel Warden)');
      setUserEmail('warden@alhikmah.edu');
      router.push('/warden');
    }
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className={`flex min-h-screen bg-background text-foreground ${locale === 'ur' ? 'font-ur' : 'font-en'}`}>
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <Sidebar 
        userRole={role} 
        userName={userName} 
        userEmail={userEmail} 
        onLogout={handleLogout} 
      />

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <Sidebar 
          userRole={role} 
          userName={userName} 
          userEmail={userEmail} 
          onLogout={handleLogout}
          isMobile={true}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          userRole={role} 
          userName={userName} 
          onRoleSwitch={handleRoleSwitch}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
