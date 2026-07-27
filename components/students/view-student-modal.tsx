"use client";

import React, { useRef, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Printer, User, Settings2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: any;
}

export function ViewStudentModal({ isOpen, onClose, studentData }: ViewStudentModalProps) {
  const { locale } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  
  // ID Card Settings State
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [showFatherCnic, setShowFatherCnic] = useState(false);
  const [showBloodGroup, setShowBloodGroup] = useState(true);
  const [showContact, setShowContact] = useState(true);

  if (!studentData) return null;

  const fullName = `${studentData.first_name} ${studentData.last_name || ''}`.trim();

  // Determine Class Name
  let classNameStr = 'درجہ اولیٰ';
  if (studentData.current_class_id === '11111111-1111-1111-1111-111111111104') {
    classNameStr = 'حفظ القرآن';
  } else if (studentData.current_class_id === '11111111-1111-1111-1111-111111111105') {
    classNameStr = 'درس نظامی سال اول';
  } else if (studentData.current_class_id === '11111111-1111-1111-1111-111111111101') {
    classNameStr = 'درجہ ناظرہ';
  }

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printContent = printRef.current.innerHTML;
    
    // Page dimensions for CR80 standard ID Card
    const pageCss = orientation === 'landscape' 
      ? '@page { size: 86mm 54mm; margin: 0; }' 
      : '@page { size: 54mm 86mm; margin: 0; }';
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="ur" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>ID_Card_${studentData.registration_id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;600;700;800&display=swap');
            
            ${pageCss}

            * { box-sizing: border-box; }

            body { 
              font-family: 'Noto Nastaliq Urdu', 'Inter', sans-serif; 
              margin: 0;
              padding: 0;
              background-color: white; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .id-card-print-container {
              width: ${orientation === 'landscape' ? '86mm' : '54mm'};
              height: ${orientation === 'landscape' ? '54mm' : '86mm'};
              position: relative;
              overflow: hidden;
              background: #ffffff;
            }

            /* -------------------------------------
               BEAUTIFUL LANDSCAPE DESIGN
               ------------------------------------- */
            .landscape-card {
              width: 100%;
              height: 100%;
              position: relative;
              border-radius: 8px; /* For preview only, doesn't matter in print */
              overflow: hidden;
              display: flex;
              flex-direction: column;
              border: 1px solid #e2e8f0;
              background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            }

            .ls-header {
              height: 28%;
              background: linear-gradient(to right, #064e3b, #0f766e);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              border-bottom: 3px solid #d97706;
            }

            .ls-school-name {
              font-size: 14px;
              font-weight: 700;
              margin: 0;
              letter-spacing: 0.5px;
            }
            .ls-school-sub {
              font-size: 8px;
              opacity: 0.9;
              font-family: 'Inter', sans-serif;
            }

            .ls-body {
              height: 64%;
              display: flex;
              flex-direction: row; /* RTL means right-to-left layout automatically */
              padding: 8px 12px;
              gap: 15px;
              position: relative;
            }

            .ls-watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 80px;
              opacity: 0.03;
              pointer-events: none;
            }

            .ls-photo-section {
              width: 30%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }

            .ls-photo {
              width: 20mm;
              height: 25mm;
              border: 2px solid #0f766e;
              border-radius: 6px;
              background: #e2e8f0;
              object-fit: cover;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }

            .ls-details-section {
              width: 70%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding-top: 5px;
            }

            .ls-name {
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
              margin: 0 0 2px 0;
              line-height: 1;
            }

            .ls-reg {
              font-family: 'Inter', sans-serif;
              font-size: 9px;
              font-weight: 800;
              color: #b45309;
              background: #fef3c7;
              padding: 2px 6px;
              border-radius: 4px;
              display: inline-block;
              margin-bottom: 8px;
              align-self: flex-start;
            }

            .ls-grid {
              display: grid;
              grid-template-columns: 35px 1fr;
              gap: 4px 5px;
              font-size: 10px;
            }

            .ls-label {
              font-weight: 700;
              color: #0f766e;
            }

            .ls-value {
              font-weight: 700;
              color: #334155;
            }

            .ls-footer {
              height: 8%;
              background: #0f172a;
              color: #94a3b8;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 6px;
              font-family: 'Inter', sans-serif;
            }

            /* -------------------------------------
               BEAUTIFUL PORTRAIT DESIGN
               ------------------------------------- */
            .portrait-card {
              width: 100%;
              height: 100%;
              position: relative;
              border-radius: 8px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              border: 1px solid #e2e8f0;
              background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
            }

            .pt-header {
              height: 18%;
              background: linear-gradient(to right, #064e3b, #0f766e);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              border-bottom: 4px solid #d97706;
              padding-top: 5px;
            }

            .pt-school-name {
              font-size: 13px;
              font-weight: 700;
              margin: 0;
            }
            .pt-school-sub {
              font-size: 7px;
              font-family: 'Inter', sans-serif;
              opacity: 0.9;
            }

            .pt-body {
              height: 76%;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 10px;
              position: relative;
            }

            .pt-photo {
              width: 22mm;
              height: 28mm;
              border: 3px solid #ffffff;
              outline: 2px solid #0f766e;
              border-radius: 6px;
              background: #e2e8f0;
              object-fit: cover;
              box-shadow: 0 4px 10px rgba(0,0,0,0.15);
              margin-top: 5px;
              margin-bottom: 8px;
            }

            .pt-name {
              font-size: 18px;
              font-weight: 700;
              color: #0f172a;
              margin: 0;
              line-height: 1.2;
            }

            .pt-reg {
              font-family: 'Inter', sans-serif;
              font-size: 9px;
              font-weight: 800;
              color: #b45309;
              background: #fef3c7;
              padding: 2px 8px;
              border-radius: 12px;
              margin-bottom: 12px;
              margin-top: 2px;
            }

            .pt-grid {
              width: 100%;
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 8px;
              display: grid;
              grid-template-columns: 40px 1fr;
              gap: 6px 8px;
              font-size: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            }

            .pt-footer {
              height: 6%;
              background: #0f766e;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 6px;
              font-family: 'Inter', sans-serif;
              letter-spacing: 0.5px;
            }

          </style>
        </head>
        <body>
          <div class="id-card-print-container">
            ${printContent}
          </div>
        </body>
        </html>
      `);
      doc.close();
      
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  };

  const renderIDCard = () => {
    if (orientation === 'landscape') {
      return (
        <div className="landscape-card" dir="rtl">
          <div className="ls-header">
            <h2 className="ls-school-name">جامعہ الحکمہ الاسلامیہ و پبلک سکول</h2>
            <div className="ls-school-sub">STUDENT IDENTITY CARD</div>
          </div>
          
          <div className="ls-body">
            <div className="ls-watermark">🎓</div>
            
            <div className="ls-photo-section">
              {studentData.photo_url ? (
                <img src={studentData.photo_url} alt="Photo" className="ls-photo" />
              ) : (
                <div className="ls-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User style={{ width: '24px', height: '24px', color: '#94a3b8' }} />
                </div>
              )}
            </div>

            <div className="ls-details-section">
              <h3 className="ls-name">{fullName}</h3>
              <div className="ls-reg">{studentData.registration_id}</div>
              
              <div className="ls-grid">
                <div className="ls-label">والد:</div>
                <div className="ls-value">{studentData.father_name}</div>
                
                <div className="ls-label">کلاس:</div>
                <div className="ls-value" style={{ color: '#0f766e' }}>{classNameStr}</div>
                
                {showContact && (
                  <>
                    <div className="ls-label">رابطہ:</div>
                    <div className="ls-value" style={{ fontFamily: "'Inter', sans-serif" }}>{studentData.father_phone}</div>
                  </>
                )}
                
                {showBloodGroup ? (
                  <>
                    <div className="ls-label">خون:</div>
                    <div className="ls-value" style={{ color: '#dc2626' }}>{studentData.blood_group || '---'}</div>
                  </>
                ) : null}

                {showFatherCnic ? (
                  <>
                    <div className="ls-label" style={{ fontFamily: "'Inter', sans-serif" }}>CNIC:</div>
                    <div className="ls-value" style={{ fontFamily: "'Inter', sans-serif" }}>{studentData.father_cnic_or_id || '---'}</div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="ls-footer">
            WWW.ALHIKMAH.EDU.PK
          </div>
        </div>
      );
    } else {
      // Portrait Layout
      return (
        <div className="portrait-card" dir="rtl">
          <div className="pt-header">
            <h2 className="pt-school-name">جامعہ الحکمہ الاسلامیہ</h2>
            <div className="pt-school-sub">STUDENT IDENTITY CARD</div>
          </div>
          
          <div className="pt-body">
            <div className="ls-watermark">🎓</div>
            
            {studentData.photo_url ? (
              <img src={studentData.photo_url} alt="Photo" className="pt-photo" />
            ) : (
              <div className="pt-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User style={{ width: '32px', height: '32px', color: '#94a3b8' }} />
              </div>
            )}
            
            <h3 className="pt-name">{fullName}</h3>
            <div className="pt-reg">{studentData.registration_id}</div>
            
            <div className="pt-grid">
              <div className="ls-label">والد:</div>
              <div className="ls-value">{studentData.father_name}</div>
              
              <div className="ls-label">کلاس:</div>
              <div className="ls-value" style={{ color: '#0f766e' }}>{classNameStr}</div>
              
              {showContact && (
                <>
                  <div className="ls-label">رابطہ:</div>
                  <div className="ls-value" style={{ fontFamily: "'Inter', sans-serif" }}>{studentData.father_phone}</div>
                </>
              )}

              {showBloodGroup ? (
                <>
                  <div className="ls-label">خون:</div>
                  <div className="ls-value" style={{ color: '#dc2626' }}>{studentData.blood_group || '---'}</div>
                </>
              ) : null}
              
              {showFatherCnic ? (
                <>
                  <div className="ls-label" style={{ fontFamily: "'Inter', sans-serif" }}>CNIC:</div>
                  <div className="ls-value" style={{ fontFamily: "'Inter', sans-serif" }}>{studentData.father_cnic_or_id || '---'}</div>
                </>
              ) : null}
            </div>
          </div>
          
          <div className="pt-footer">
            WWW.ALHIKMAH.EDU.PK
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl font-ur p-0 border-t-4 border-t-emerald-600 overflow-hidden bg-white flex flex-col md:flex-row shadow-2xl rounded-xl">
        
        {/* Left Side: Settings Panel */}
        <div className="w-full md:w-5/12 p-6 border-e border-slate-200 bg-slate-50 flex flex-col">
          <DialogHeader className="mb-6 text-start">
            <DialogTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-emerald-600" />
              <span>{locale === 'ur' ? 'آئی ڈی کارڈ سیٹنگز' : 'ID Card Settings'}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 flex-1">
            {/* Orientation Selection */}
            <div className="space-y-3">
              <Label className="font-bold text-slate-700 text-sm">{locale === 'ur' ? 'کارڈ کی سمت (Orientation)' : 'Card Orientation'}</Label>
              <Tabs defaultValue="landscape" onValueChange={(v) => setOrientation(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-11 bg-slate-200/60 p-1">
                  <TabsTrigger value="landscape" className="font-bold text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">{locale === 'ur' ? 'افقی (Landscape)' : 'Landscape'}</TabsTrigger>
                  <TabsTrigger value="portrait" className="font-bold text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-700">{locale === 'ur' ? 'عمودی (Portrait)' : 'Portrait'}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Display Options */}
            <div className="space-y-3 pt-2">
              <Label className="font-bold text-slate-700 text-sm">{locale === 'ur' ? 'معلومات کا انتخاب (Details to Show)' : 'Information to Display'}</Label>
              
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-600">{locale === 'ur' ? 'رابطہ نمبر شامل کریں' : 'Show Contact Number'}</Label>
                  <Switch checked={showContact} onCheckedChange={setShowContact} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-600">{locale === 'ur' ? 'بلڈ گروپ شامل کریں' : 'Show Blood Group'}</Label>
                  <Switch checked={showBloodGroup} onCheckedChange={setShowBloodGroup} />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-600">{locale === 'ur' ? 'والد کا شناختی کارڈ (CNIC)' : 'Show Father CNIC'}</Label>
                  <Switch checked={showFatherCnic} onCheckedChange={setShowFatherCnic} />
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handlePrint} variant="emerald" className="w-full h-12 font-bold text-base gap-2 mt-4 shadow-lg hover:shadow-xl transition-all rounded-xl">
            <Printer className="w-5 h-5" />
            <span>{locale === 'ur' ? 'آئی ڈی کارڈ پرنٹ کریں' : 'Print Premium ID Card'}</span>
          </Button>
        </div>

        {/* Right Side: Live Preview */}
        <div className="w-full md:w-7/12 p-8 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-100 relative">
          <div className="absolute top-4 start-4 text-xs font-bold text-slate-400 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <Eye className="w-4 h-4 text-emerald-500" /> {locale === 'ur' ? 'لائیو پریمیم پریویو' : 'Live Premium Preview'}
          </div>
          
          {/* Card Frame scaled for Preview */}
          <div 
            className="shadow-2xl bg-white transition-all duration-500 ease-in-out transform hover:scale-105 relative"
            style={{
              width: orientation === 'landscape' ? '324px' : '204px',
              height: orientation === 'landscape' ? '204px' : '324px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* The wrapper mimics the exact dimensions of mm, and we scale it slightly to fit the pixel box perfectly if needed */}
            <div 
              style={{
                width: orientation === 'landscape' ? '86mm' : '54mm',
                height: orientation === 'landscape' ? '54mm' : '86mm',
                transform: 'scale(0.95)',
                transformOrigin: 'top left',
              }}
            >
              <div className="w-full h-full" ref={printRef}>
                 {renderIDCard()}
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-8 text-center max-w-[280px] font-bold">
            {locale === 'ur' 
              ? 'یہ کارڈ اعلیٰ معیار کے PVC پرنٹنگ کے لیے تیار کیا گیا ہے۔' 
              : 'Designed for high-quality Premium PVC card printing.'}
          </p>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
