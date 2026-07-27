"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, BookOpen, GraduationCap, Users, Wallet, Home } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
}

export function RoleBadge({ role, showIcon = true }: RoleBadgeProps) {
  const { t } = useLanguage();

  const config = {
    admin: {
      label: t.roleAdmin,
      icon: ShieldCheck,
      className: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 font-semibold shadow-sm',
    },
    clerk: {
      label: t.roleClerk,
      icon: UserCheck,
      className: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 font-semibold shadow-sm',
    },
    teacher: {
      label: t.roleTeacher,
      icon: BookOpen,
      className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-semibold shadow-sm',
    },
    student: {
      label: t.roleStudent,
      icon: GraduationCap,
      className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-semibold shadow-sm',
    },
    parent: {
      label: t.roleParent,
      icon: Users,
      className: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 font-semibold shadow-sm',
    },
    accountant: {
      label: (t as any).roleAccountant || 'Accountant / Clerk',
      icon: Wallet,
      className: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30 font-semibold shadow-sm',
    },
    warden: {
      label: (t as any).roleWarden || 'Hostel Warden',
      icon: Home,
      className: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 font-semibold shadow-sm',
    },
  }[role] || {
    label: role,
    icon: BookOpen,
    className: 'bg-gray-500/15 text-gray-700 border-gray-500/30 font-semibold shadow-sm',
  };

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      {showIcon && <Icon className="w-3.5 h-3.5 me-1.5 inline shrink-0" />}
      <span>{config.label}</span>
    </Badge>
  );
}
