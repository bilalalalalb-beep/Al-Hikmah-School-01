import React from 'react';
import { TeacherTimetable } from '@/components/teacher/timetable-view';

export const metadata = {
  title: 'My Timetable | Teacher Portal',
  description: 'View your class schedule',
};

export default function TeacherTimetablePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      <TeacherTimetable />
    </div>
  );
}
