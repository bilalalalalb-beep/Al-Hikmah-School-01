"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { 
  Users, 
  Search, 
  Filter, 
  Printer, 
  LayoutGrid, 
  CheckSquare,
  AlertCircle,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { generatePdfIdCards } from '@/lib/pdf-utils';
import { Loader2 } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type StudentRecord = any;

export function IdCardsDesk() {
  const { locale, dir } = useLanguage();
  
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Settings
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [showFatherCnic, setShowFatherCnic] = useState(false);
  const [showBloodGroup, setShowBloodGroup] = useState(true);
  const [showContact, setShowContact] = useState(true);
  
  useEffect(() => {
    fetchStudentsFromDb();
  }, []);

  const fetchStudentsFromDb = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any).from('students').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setStudents(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const fullName = `${s.first_name} ${s.last_name || ''}`.trim().toLowerCase();
    const searchMatch = !searchQuery || 
      fullName.includes(searchQuery.toLowerCase()) || 
      s.registration_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const classMatch = classFilter === 'all' || s.current_class_id === classFilter;
    
    return searchMatch && classMatch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredStudents.map(s => s.id));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  const getClassName = (classId: string) => {
    if (classId === '11111111-1111-1111-1111-111111111104') return 'حفظ القرآن';
    if (classId === '11111111-1111-1111-1111-111111111105') return 'درس نظامی سال اول';
    if (classId === '11111111-1111-1111-1111-111111111101') return 'درجہ ناظرہ';
    return 'درجہ اولیٰ';
  };

  // Bulk Print Logic
  
  const getCardsDocument = (includePrintScript: boolean) => {
    let cardsHtml = '';
    const studentsToPrint = students.filter(s => selectedIds.has(s.id));
    
    studentsToPrint.forEach(student => {
      const fullName = `${student.first_name} ${student.last_name || ''}`.trim();
      const classNameStr = getClassName(student.current_class_id);
      
      if (orientation === 'landscape') {
        cardsHtml += `
          <div class="card-container landscape-card" dir="rtl">
            <div class="ls-header">
              <h2 class="ls-school-name">جامعہ الحکمہ الاسلامیہ و پبلک سکول</h2>
              <div class="ls-school-sub">STUDENT IDENTITY CARD</div>
            </div>
            <div class="ls-body">
              <div class="ls-watermark">🎓</div>
              <div class="ls-photo-section">
                ${student.photo_url ? `<img src="${student.photo_url}" class="ls-photo" />` : `<div class="ls-photo-placeholder"></div>`}
              </div>
              <div class="ls-details-section">
                <h3 class="ls-name">${fullName}</h3>
                <div class="ls-reg">${student.registration_id}</div>
                <div class="ls-grid">
                  <div class="ls-label">والد:</div>
                  <div class="ls-value">${student.father_name}</div>
                  <div class="ls-label">کلاس:</div>
                  <div class="ls-value" style="color:#0f766e">${classNameStr}</div>
                  ${showContact ? `
                    <div class="ls-label">رابطہ:</div>
                    <div class="ls-value" style="font-family:'Inter', sans-serif">${student.father_phone || '---'}</div>
                  ` : ''}
                  ${showBloodGroup ? `
                    <div class="ls-label">خون:</div>
                    <div class="ls-value" style="color:#dc2626">${student.blood_group || '---'}</div>
                  ` : ''}
                  ${showFatherCnic ? `
                    <div class="ls-label" style="font-family:'Inter', sans-serif">CNIC:</div>
                    <div class="ls-value" style="font-family:'Inter', sans-serif">${student.father_cnic_or_id || '---'}</div>
                  ` : ''}
                </div>
              </div>
            </div>
            <div class="ls-footer">WWW.ALHIKMAH.EDU.PK</div>
          </div>
        `;
      } else {
        cardsHtml += `
          <div class="card-container portrait-card" dir="rtl">
            <div class="pt-header">
              <h2 class="pt-school-name">جامعہ الحکمہ الاسلامیہ</h2>
              <div class="pt-school-sub">STUDENT IDENTITY CARD</div>
            </div>
            <div class="pt-body">
              <div class="ls-watermark">🎓</div>
              ${student.photo_url ? `<img src="${student.photo_url}" class="pt-photo" />` : `<div class="pt-photo-placeholder"></div>`}
              <h3 class="pt-name">${fullName}</h3>
              <div class="pt-reg">${student.registration_id}</div>
              <div class="pt-grid">
                <div class="ls-label">والد:</div>
                <div class="ls-value">${student.father_name}</div>
                <div class="ls-label">کلاس:</div>
                <div class="ls-value" style="color:#0f766e">${classNameStr}</div>
                ${showContact ? `
                  <div class="ls-label">رابطہ:</div>
                  <div class="ls-value" style="font-family:'Inter', sans-serif">${student.father_phone || '---'}</div>
                ` : ''}
                ${showBloodGroup ? `
                  <div class="ls-label">خون:</div>
                  <div class="ls-value" style="color:#dc2626">${student.blood_group || '---'}</div>
                ` : ''}
                ${showFatherCnic ? `
                  <div class="ls-label" style="font-family:'Inter', sans-serif">CNIC:</div>
                  <div class="ls-value" style="font-family:'Inter', sans-serif">${student.father_cnic_or_id || '---'}</div>
                ` : ''}
              </div>
            </div>
            <div class="pt-footer">WWW.ALHIKMAH.EDU.PK</div>
          </div>
        `;
      }
    });

    return `
      <!DOCTYPE html>
      <html lang="ur" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>Bulk_ID_Cards</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;600;700;800&display=swap');
          
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; }
          body { 
            font-family: 'Noto Nastaliq Urdu', 'Inter', sans-serif; 
            margin: 0;
            padding: 20px;
            background-color: #f8fafc; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 5mm;
            align-content: flex-start;
            justify-content: flex-start;
          }

          .card-container {
            width: ${orientation === 'landscape' ? '86mm' : '54mm'};
            height: ${orientation === 'landscape' ? '54mm' : '86mm'};
            position: relative;
            overflow: hidden;
            background: white;
            border: 1px dashed #cbd5e1;
            page-break-inside: avoid;
            ${!includePrintScript ? 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);' : ''}
          }

          .landscape-card {
            display: flex; flex-direction: column;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          }
          .ls-header {
            height: 28%; background: linear-gradient(to right, #064e3b, #0f766e);
            display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border-bottom: 3px solid #d97706;
          }
          .ls-school-name { font-size: 14px; font-weight: 700; margin: 0; letter-spacing: 0.5px; }
          .ls-school-sub { font-size: 8px; opacity: 0.9; font-family: 'Inter', sans-serif; }
          .ls-body { height: 64%; display: flex; flex-direction: row; padding: 8px 12px; gap: 15px; position: relative; }
          .ls-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 80px; opacity: 0.03; pointer-events: none; }
          .ls-photo-section { width: 30%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .ls-photo, .ls-photo-placeholder, .pt-photo, .pt-photo-placeholder {
            width: 20mm; height: 25mm; border: 2px solid #0f766e; border-radius: 6px; background: #e2e8f0; object-fit: cover;
          }
          .ls-details-section { width: 70%; display: flex; flex-direction: column; justify-content: center; padding-top: 5px; }
          .ls-name { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 2px 0; line-height: 1; }
          .ls-reg { font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 800; color: #b45309; background: #fef3c7; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 8px; align-self: flex-start; }
          .ls-grid { display: grid; grid-template-columns: 35px 1fr; gap: 4px 5px; font-size: 10px; }
          .ls-label { font-weight: 700; color: #0f766e; }
          .ls-value { font-weight: 700; color: #334155; }
          .ls-footer { height: 8%; background: #0f172a; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 6px; font-family: 'Inter', sans-serif; }

          .portrait-card {
            display: flex; flex-direction: column;
            background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
          }
          .pt-header {
            height: 18%; background: linear-gradient(to right, #064e3b, #0f766e);
            display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; border-bottom: 4px solid #d97706; padding-top: 5px;
          }
          .pt-school-name { font-size: 13px; font-weight: 700; margin: 0; }
          .pt-school-sub { font-size: 7px; font-family: 'Inter', sans-serif; opacity: 0.9; }
          .pt-body { height: 76%; display: flex; flex-direction: column; align-items: center; padding: 10px; position: relative; }
          .pt-photo, .pt-photo-placeholder {
            width: 22mm; height: 28mm; border: 3px solid #ffffff; outline: 2px solid #0f766e; border-radius: 6px; background: #e2e8f0; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.15); margin-top: 5px; margin-bottom: 8px;
          }
          .pt-name { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.2; }
          .pt-reg { font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 800; color: #b45309; background: #fef3c7; padding: 2px 8px; border-radius: 12px; margin-bottom: 12px; margin-top: 2px; }
          .pt-grid { width: 100%; background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; display: grid; grid-template-columns: 40px 1fr; gap: 6px 8px; font-size: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
          .pt-footer { height: 6%; background: #0f766e; color: white; display: flex; align-items: center; justify-content: center; font-size: 6px; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }

          .action-bar {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px dashed #cbd5e1;
          }
          .print-btn {
            background: #0d9488;
            color: #ffffff;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Noto Nastaliq Urdu', serif;
            box-shadow: 0 4px 6px rgba(13, 148, 136, 0.2);
          }
          .print-btn:hover { background: #0f766e; }
          
          @media print {
            body { background: white; padding: 0; }
            .card-container { box-shadow: none; border-color: #cbd5e1; }
            .action-bar { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${!includePrintScript ? `
        <div class="action-bar">
          <button onclick="window.print()" class="print-btn">
            🖨️ ${locale === 'ur' ? 'ان کارڈز کو پرنٹ کریں یا PDF میں محفوظ کریں' : 'Print Cards or Save as PDF'}
          </button>
        </div>
        ` : ''}
        <div class="print-grid">
          ${cardsHtml}
        </div>
        ${includePrintScript ? `
        <script>
          document.fonts.ready.then(() => {
             window.print();
          });
        </script>
        ` : ''}
      </body>
      </html>
    `;
  };

  const handleBulkPrint = () => {
    if (selectedIds.size === 0) {
      toast.error(locale === 'ur' ? 'براہ کرم پرنٹ کرنے کے لیے کم از کم ایک طالب علم کا انتخاب کریں' : 'Please select at least one student');
      return;
    }

    const doc = window.open('', '_blank');
    if (doc) {
      doc.document.write(getCardsDocument(true));
      doc.document.close();
      
      setTimeout(() => {
        try {
          doc.print();
        } catch (e) {}
      }, 3000);
    }
  };

  const handleDownloadHtmlPdf = async () => {
    if (selectedIds.size === 0) {
      toast.error(locale === 'ur' ? 'براہ کرم پرنٹ کرنے کے لیے کم از کم ایک طالب علم کا انتخاب کریں' : 'Please select at least one student');
      return;
    }
    
    setIsGeneratingPdf(true);
    const toastId = toast.loading(locale === 'ur' ? 'PDF بنائی جا رہی ہے، براہ کرم انتظار کریں...' : 'Generating PDF, please wait...');
    
    try {
      const studentsToPrint = students.filter(s => selectedIds.has(s.id));
      await generatePdfIdCards(
        studentsToPrint,
        'جامعہ الحکمہ الاسلامیہ و پبلک سکول',
        'نزد جامع مسجد بلال، چناب نگر',
        showContact,
        showBloodGroup,
        showFatherCnic,
        getClassName
      );
      toast.success(locale === 'ur' ? 'کارڈز کامیابی سے ڈاؤنلوڈ ہو گئے ہیں!' : 'Cards downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error(locale === 'ur' ? 'کارڈز بنانے میں کوئی مسئلہ پیش آیا۔' : 'An error occurred while generating cards.', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportCsv = () => {
    if (selectedIds.size === 0) {
      toast.error(locale === 'ur' ? 'براہ کرم ایکسپورٹ کرنے کے لیے طلباء کو منتخب کریں' : 'Please select students to export');
      return;
    }
    const studentsToExport = students.filter(s => selectedIds.has(s.id));
    
    // Create CSV content
    const headers = ['Registration ID', 'First Name', 'Last Name', 'Father Name', 'Phone', 'Blood Group', 'CNIC', 'Class'];
    const csvContent = [
      headers.join(','),
      ...studentsToExport.map(s => [
        `"${s.registration_id || ''}"`,
        `"${s.first_name || ''}"`,
        `"${s.last_name || ''}"`,
        `"${s.father_name || ''}"`,
        `"${s.father_phone || ''}"`,
        `"${s.blood_group || ''}"`,
        `"${s.father_cnic_or_id || ''}"`,
        `"${getClassName(s.current_class_id)}"`
      ].join(','))
    ].join('\\n');

    // Download file
    const blob = new Blob(['\\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel UTF-8
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students_export_${new Date().getTime()}.csv`;
    link.click();
    toast.success(locale === 'ur' ? 'ڈیٹا ڈاؤنلوڈ ہو گیا' : 'Data exported successfully');
  };

  return (
    <div className="p-6 md:p-10 font-ur max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-3xl font-black text-primary flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-teal-600" />
            {locale === 'ur' ? 'آئی ڈی کارڈز ڈیسک (ID Cards Hub)' : 'ID Cards Hub'}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            {locale === 'ur' 
              ? 'یہاں سے آپ کلاس کے تمام طلباء یا نئے داخلوں کے آئی ڈی کارڈز ایک ساتھ پرنٹ کر سکتے ہیں' 
              : 'Bulk print or download ID cards for specific classes or new admissions.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            variant="outline"
            onClick={handleExportCsv} 
            disabled={selectedIds.size === 0}
            className="w-full md:w-auto h-12 px-6 font-bold text-slate-700 gap-2 border-slate-300 hover:bg-slate-100"
          >
            <Download className="w-5 h-5" />
            {locale === 'ur' ? `ایکسل ڈیٹا ڈاؤنلوڈ` : `Export Excel`}
          </Button>

          <Button 
            variant="outline"
            onClick={handleDownloadHtmlPdf} 
            disabled={selectedIds.size === 0}
            className="w-full md:w-auto h-12 px-6 font-bold text-teal-700 gap-2 border-teal-200 bg-teal-50 hover:bg-teal-100 shadow-sm"
          >
            <Download className="w-5 h-5" />
            {locale === 'ur' ? 'کارڈز ڈاؤنلوڈ (PDF)' : 'Download PDF'}
          </Button>

           <Button 
            onClick={handleBulkPrint} 
            disabled={selectedIds.size === 0}
            className="w-full md:w-auto h-12 px-8 font-bold text-lg gap-2 shadow-lg hover:scale-105 transition-transform bg-teal-600 hover:bg-teal-700"
          >
            <Printer className="w-5 h-5" />
            {locale === 'ur' ? `پرنٹ کریں (${selectedIds.size})` : `Print (${selectedIds.size})`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Sidebar Filters */}
        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-sm border-0 bg-slate-50/50">
            <CardContent className="p-5 space-y-5">
              
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2 text-slate-700"><Search className="w-4 h-4"/> {locale === 'ur' ? 'تلاش کریں' : 'Search'}</Label>
                <Input 
                  placeholder={locale === 'ur' ? 'نام یا رجسٹریشن نمبر...' : 'Name or Reg ID...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2 text-slate-700"><Filter className="w-4 h-4"/> {locale === 'ur' ? 'کلاس منتخب کریں' : 'Filter by Class'}</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'ur' ? 'تمام کلاسز (All)' : 'All Classes'}</SelectItem>
                    <SelectItem value="11111111-1111-1111-1111-111111111101">درجہ ناظرہ</SelectItem>
                    <SelectItem value="11111111-1111-1111-1111-111111111104">حفظ القرآن</SelectItem>
                    <SelectItem value="11111111-1111-1111-1111-111111111105">درس نظامی سال اول</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label className="font-bold flex items-center gap-2 text-slate-700">{locale === 'ur' ? 'کارڈ کی سمت' : 'Orientation'}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button 
                    variant={orientation === 'landscape' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrientation('landscape')}
                    className={orientation === 'landscape' ? 'bg-teal-600' : ''}
                  >
                    Landscape
                  </Button>
                  <Button 
                    variant={orientation === 'portrait' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrientation('portrait')}
                    className={orientation === 'portrait' ? 'bg-teal-600' : ''}
                  >
                    Portrait
                  </Button>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <Label className="font-bold flex items-center gap-2 text-slate-700">{locale === 'ur' ? 'معلومات کا انتخاب' : 'Information to Display'}</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'رابطہ نمبر' : 'Contact Number'}</Label>
                    <Switch checked={showContact} onCheckedChange={setShowContact} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'بلڈ گروپ' : 'Blood Group'}</Label>
                    <Switch checked={showBloodGroup} onCheckedChange={setShowBloodGroup} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'والد کا شناختی کارڈ (CNIC)' : 'Father CNIC'}</Label>
                    <Switch checked={showFatherCnic} onCheckedChange={setShowFatherCnic} />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
          
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-sm font-medium flex gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <p className="leading-relaxed">
              {locale === 'ur' 
                ? 'PDF ڈاؤنلوڈ کرنے کے لیے، پرنٹ بٹن پر کلک کریں اور براؤزر کی پرنٹ ونڈو میں Destination میں سے "Save as PDF" کا انتخاب کریں۔ یہ آپ کو بہترین کوالٹی دے گا۔' 
                : 'To download as PDF, click Print and choose "Save as PDF" as the destination in the print dialog.'}
            </p>
          </div>
        </div>

        {/* Right Content Area (Grid of Students) */}
        <div className="md:col-span-3">
          <Card className="border-0 shadow-md h-full">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 bg-muted/20 border-b border-border">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={filteredStudents.length > 0 && selectedIds.size === filteredStudents.length}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                  />
                  <Label htmlFor="select-all" className="font-bold cursor-pointer">
                    {locale === 'ur' ? `تمام منتخب کریں (${filteredStudents.length})` : `Select All (${filteredStudents.length})`}
                  </Label>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {selectedIds.size} {locale === 'ur' ? 'منتخب شدہ' : 'Selected'}
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-muted-foreground animate-pulse font-bold text-lg">
                  {locale === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground font-bold">
                  {locale === 'ur' ? 'کوئی طالب علم نہیں ملا' : 'No students found'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-h-[650px] overflow-y-auto">
                  {filteredStudents.map(student => {
                    const isSelected = selectedIds.has(student.id);
                    return (
                      <div 
                        key={student.id} 
                        onClick={() => handleSelectStudent(student.id, !isSelected)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all flex gap-3
                          ${isSelected ? 'border-teal-500 bg-teal-50/30' : 'border-border hover:border-teal-200'}
                        `}
                      >
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={(c) => handleSelectStudent(student.id, !!c)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-bold text-foreground text-sm leading-tight">
                            {student.first_name} {student.last_name || ''}
                          </p>
                          <p className="text-xs text-muted-foreground font-en mt-1 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                            {student.registration_id}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <Badge variant="outline" className="text-[10px]">{getClassName(student.current_class_id)}</Badge>
                            {student.is_orphan && <Badge variant="destructive" className="text-[10px]">Orphan</Badge>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
