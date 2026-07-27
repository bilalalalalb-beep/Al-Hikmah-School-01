"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { usePortalSettings } from '@/lib/settings/context';
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
  const { settings } = usePortalSettings();
  const [expiryDate, setExpiryDate] = useState('31-03-2027');
  const [showStudentCnic, setShowStudentCnic] = useState(false);
  const [cardLanguage, setCardLanguage] = useState<'ur' | 'en' | 'ar'>('ur');
  
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
  
  const getCardsDocument = (includePrintScript: boolean, lang: 'ur' | 'en' | 'ar' = 'ur') => {
    let cardsHtml = '';
    
    const labels = {
      ur: { id: 'آئی ڈی:', studentCnic: 'ب فارم/CNIC:', father: 'والد:', fatherCnic: 'والد CNIC:', contact: 'رابطہ:', address: 'پتہ:', expiry: 'معیاد:' },
      en: { id: 'ID:', studentCnic: 'B-Form/CNIC:', father: 'Father:', fatherCnic: 'Father CNIC:', contact: 'Contact:', address: 'Address:', expiry: 'Expiry:' },
      ar: { id: 'رقم الهوية:', studentCnic: 'رقم الهوية الوطنية:', father: 'الأب:', fatherCnic: 'هوية الأب:', contact: 'رقم التواصل:', address: 'العنوان:', expiry: 'تاريخ الإنتهاء:' }
    };
    
    const l = labels[lang] || labels['ur'];
    const dir = (lang === 'en') ? 'ltr' : 'rtl';
    const textAlign = (lang === 'en') ? 'left' : 'right';
    
    const studentsToPrint = students.filter(s => selectedIds.has(s.id));
    
    studentsToPrint.forEach(student => {
      const fullName = `${student.first_name} ${student.last_name || ''}`.trim();
      const classNameStr = getClassName(student.current_class_id);
      
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${student.registration_id}`;
      const photoUrl = student.photo_url || '';
      const photoHtml = photoUrl 
        ? `<img src="${photoUrl}" class="pt-photo" />` 
        : `<div class="pt-photo-placeholder">👤</div>`;

      const logoHtml = settings.logo 
        ? `<img src="${settings.logo}" style="width: 100%; height: 100%; object-fit: contain;" />`
        : `<span style="font-size: 24px;">🏫</span>`;

      const madrasaName = lang === 'en' ? (settings.madrasaNameEn || 'Al-Hikmah Islamic Institute') : (settings.madrasaNameUr || 'جامعہ الحکمہ الاسلامیہ و پبلک سکول');
      const address = lang === 'en' ? (settings.addressEn || 'Near Bilal Mosque, Chenab Nagar') : (settings.addressUr || 'نزد جامع مسجد بلال، چناب نگر');

      cardsHtml += `
        <div class="card-container portrait-card" dir="${dir}">
          <!-- Top Section -->
          <div style="text-align: center; padding-top: 12px; position: relative; z-index: 1;">
            <div style="width: 45px; height: 45px; margin: 0 auto; background-color: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; overflow: hidden;">
              ${logoHtml}
            </div>
            <h2 style="font-size: 11px; font-weight: bold; color: #171f27; margin: 0; padding: 0 5px; line-height: 1.4;">
              ${madrasaName}
            </h2>
            <p style="font-size: 7px; font-weight: 500; color: #64748b; margin: 2px 0 0 0; font-family: 'Inter', sans-serif;">
              ${address}
            </p>
          </div>

          <!-- Profile Picture -->
          <div style="position: absolute; top: 34%; left: 50%; transform: translateX(-50%); width: 65px; height: 65px; border-radius: 50%; background-color: #ffffff; padding: 3px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); z-index: 10;">
            ${photoHtml}
          </div>

          <!-- Bottom Section (Triangle + Rectangle) -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 52%; background-color: #171f27; clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 100%); display: flex; flex-direction: column; align-items: center; padding-top: 35px; color: #ffffff;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0; line-height: 1.2;">${fullName}</h3>
            <p style="font-size: 9px; font-weight: 500; margin: 2px 0 8px 0; color: #cbd5e1;">${classNameStr}</p>

            <!-- Info Grid -->
            <div style="width: 85%; font-size: 7px; display: grid; grid-template-columns: auto 1fr; gap: 3px 8px; text-align: ${textAlign};">
              <div style="font-weight: bold; color: #94a3b8;">${l.id}</div>
              <div>${student.registration_id}</div>
              
              ${showStudentCnic ? `
                <div style="font-weight: bold; color: #94a3b8;">${l.studentCnic}</div>
                <div style="font-family: 'Inter', sans-serif;">${student.student_cnic || '---'}</div>
              ` : ''}

              <div style="font-weight: bold; color: #94a3b8;">${l.father}</div>
              <div>${student.father_name}</div>
              
              ${showFatherCnic ? `
                <div style="font-weight: bold; color: #94a3b8;">${l.fatherCnic}</div>
                <div style="font-family: 'Inter', sans-serif;">${student.father_cnic_or_id || '---'}</div>
              ` : ''}
              
              ${showContact ? `
                <div style="font-weight: bold; color: #94a3b8;">${l.contact}</div>
                <div style="font-family: 'Inter', sans-serif;">${student.father_phone || '---'}</div>
              ` : ''}
              
              <div style="font-weight: bold; color: #94a3b8;">${l.address}</div>
              <div>${student.residential_address || '---'}</div>
              
              ${expiryDate ? `
                <div style="font-weight: bold; color: #94a3b8;">${l.expiry}</div>
                <div style="font-family: 'Inter', sans-serif;">${expiryDate}</div>
              ` : ''}
            </div>

            <!-- QR Code -->
            <div style="position: absolute; bottom: 8px; ${lang === 'en' ? 'right' : 'left'}: 8px; background-color: #fff; padding: 2px; border-radius: 4px; width: 30px; height: 30px;">
              <img src="${qrCodeUrl}" style="width: 100%; height: 100%; display: block;" />
            </div>
          </div>
        </div>
      `;
    });

    return `
      <!DOCTYPE html>
      <html lang="${lang}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <title>Bulk_ID_Cards</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;600;700;800&family=Noto+Sans+Arabic:wght@400;700&display=swap');
          
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; }
          body { 
            font-family: ${lang === 'ar' ? "'Noto Sans Arabic'" : "'Noto Nastaliq Urdu'"}, 'Inter', sans-serif; 
            margin: 0;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cards-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            padding: 20px;
          }
          
          .card-container {
            position: relative;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .portrait-card {
            width: 54mm;
            height: 86mm;
            margin: 0 auto;
          }

          .pt-photo {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          
          .pt-photo-placeholder {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 20px;
          }

          @media print {
            body { background-color: white; }
            .cards-grid { padding: 0; gap: 5px; }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="cards-grid">
          ${cardsHtml}
        </div>
        ${includePrintScript ? `<script>
          document.fonts.ready.then(() => {
             setTimeout(() => { window.print(); }, 1000);
          });
        </script>` : ''}
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
      doc.document.write(getCardsDocument(true, cardLanguage));
      doc.document.close();
      
      setTimeout(() => {
        try {
          doc.print();
        } catch (e) {}
      }, 3000);
    }
  };

  const handleDownloadHtmlPdf = () => {
    handleBulkPrint();
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
                  <div className="flex items-center justify-between pb-2">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'کارڈ کی زبان' : 'Card Language'}</Label>
                    <Select value={cardLanguage} onValueChange={(val: any) => setCardLanguage(val)}>
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ur">اردو (Urdu)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'رابطہ نمبر' : 'Contact Number'}</Label>
                    <Switch checked={showContact} onCheckedChange={setShowContact} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'والد کا شناختی کارڈ (CNIC)' : 'Father CNIC'}</Label>
                    <Switch checked={showFatherCnic} onCheckedChange={setShowFatherCnic} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-600">{locale === 'ur' ? 'طالب علم کا ب-فارم / CNIC' : 'Student B-Form/CNIC'}</Label>
                    <Switch checked={showStudentCnic} onCheckedChange={setShowStudentCnic} />
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <Label className="text-xs text-slate-600 mb-2 block">{locale === 'ur' ? 'کارڈ کی ایکسپائری تاریخ' : 'Card Expiry Date'}</Label>
                    <Input 
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="e.g. 31-03-2027"
                      className="text-xs h-8"
                    />
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
