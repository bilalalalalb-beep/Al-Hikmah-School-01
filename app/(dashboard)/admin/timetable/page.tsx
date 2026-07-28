import React from 'react';
import { TimetableManager } from '@/components/admin/timetable-manager';

export const metadata = {
  title: 'Timetable Manager | Admin Portal',
  description: 'Manage class and teacher timetables',
};

export default function AdminTimetablePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      <TimetableManager />
    </div>
  );
}
