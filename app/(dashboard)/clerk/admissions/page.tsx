"use client";

import React from 'react';
import { AdmissionForm } from '@/components/students/admission-form';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClerkAdmissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1 inline" /> Module 2: Student Management
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Student Enrollment & Registration
          </h1>
        </div>
        <Link href="/clerk">
          <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Desk
          </Button>
        </Link>
      </div>

      <AdmissionForm />
    </div>
  );
}
