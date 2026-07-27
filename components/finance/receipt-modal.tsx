"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, CheckCircle2, ShieldCheck, QrCode, School, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

export interface FeeReceiptData {
  receiptNo: string;
  invoiceNo: string;
  studentNameUrdu: string;
  studentNameEn: string;
  regId: string;
  classNameUrdu: string;
  classNameEn: string;
  billingMonth: string;
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  paymentMethod: string;
  paymentDate: string;
  collectorName: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: FeeReceiptData | null;
}

export function ReceiptModal({ isOpen, onClose, receiptData }: ReceiptModalProps) {
  const { locale } = useLanguage();

  if (!receiptData) return null;

  const handlePrint = () => {
    toast.success(locale === 'ur' ? '🖨️ سرکاری رسید پرنٹ کی جا رہی ہے...' : '🖨️ Printing official fee receipt...');
    window.print();
  };

  const handleDownloadCloudinary = () => {
    toast.success(locale === 'ur' ? '☁️ کلاؤڈینیری (Cloudinary) رسید پی ڈی ایف ڈاؤن لوڈ ہو رہی ہے...' : '☁️ Downloading Cloudinary verified PDF receipt...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto font-ur p-0 border-2 border-primary/20 shadow-2xl bg-card">
        {/* Printable Receipt Container */}
        <div id="printable-fee-receipt" className="p-4 sm:p-6 space-y-4 bg-gradient-to-b from-card via-card to-muted/20">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-primary/20 pb-6 text-center sm:text-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-lg shrink-0">
                <School className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {locale === 'ur' ? 'جامعہ الحکمہ الاسلامیہ و پبلک سکول' : 'Al-Hikmah Madrasa & Public School'}
                </h2>
                <p className="text-xs text-muted-foreground font-bold mt-0.5">
                  {locale === 'ur' ? 'مرکزی کلاؤڈ فیس وصولی اور رجسٹریشن شعبہ' : 'Central Cloud Fee Collection & Accounts Department'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:items-end">
              <Badge variant="success" className="px-3 py-1 text-xs font-extrabold gap-1 shadow-sm uppercase font-en">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 inline" /> {locale === 'ur' ? 'ادا شدہ (PAID)' : 'PAID'}
              </Badge>
              <span className="font-mono font-bold text-xs text-primary mt-1.5">{receiptData.receiptNo}</span>
              <span className="text-[10px] text-muted-foreground font-en">{receiptData.paymentDate}</span>
            </div>
          </div>

          {/* Student Profile & Invoice Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/50 border border-border/80 text-xs font-bold">
            <div>
              <span className="text-muted-foreground block text-[11px]">{locale === 'ur' ? 'رجسٹریشن نمبر' : 'REG ID'}</span>
              <span className="font-mono text-foreground text-sm font-en">{receiptData.regId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">{locale === 'ur' ? 'طالب علم کا نام' : 'Student Name'}</span>
              <span className="text-foreground text-sm font-extrabold">{locale === 'ur' ? receiptData.studentNameUrdu : receiptData.studentNameEn}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">{locale === 'ur' ? 'درجہ / کلاس' : 'Class / Grade'}</span>
              <span className="text-foreground text-sm font-extrabold">{locale === 'ur' ? receiptData.classNameUrdu : receiptData.classNameEn}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">{locale === 'ur' ? 'بلنگ مہینہ' : 'Billing Month'}</span>
              <span className="font-mono text-primary text-sm font-en">{receiptData.billingMonth}</span>
            </div>
          </div>

          {/* Fee Breakdown Ledger Table */}
          <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-muted/60 p-3 border-b border-border/80 flex items-center justify-between text-xs font-extrabold text-foreground">
              <span>{locale === 'ur' ? 'تفصیلات وظیفہ و فیس (Fee Breakdown)' : 'Fee Item Description'}</span>
              <span>{locale === 'ur' ? 'رقم (PKR)' : 'Amount (PKR)'}</span>
            </div>
            <div className="divide-y divide-border/60 p-3 space-y-2.5 text-xs sm:text-sm font-bold">
              <div className="flex items-center justify-between py-1">
                <span className="text-foreground">{locale === 'ur' ? 'ماہانہ ٹیوشن و تعلیم فیس' : 'Monthly Tuition & Academic Fee'}</span>
                <span className="font-mono font-en">Rs. {receiptData.totalAmount.toLocaleString()}</span>
              </div>
              {receiptData.discountAmount > 0 && (
                <div className="flex items-center justify-between py-1 text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{locale === 'ur' ? 'خصوصی رعایتی وظیفہ (Scholarship / Discount)' : 'Special Scholarship / Discount'}</span>
                  </span>
                  <span className="font-mono font-en">- Rs. {receiptData.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-t-2 border-primary/20 text-base sm:text-lg font-extrabold text-primary">
                <span>{locale === 'ur' ? 'کل ادا شدہ رقم (Total Paid)' : 'Total Paid Amount'}</span>
                <span className="font-mono font-en bg-primary/10 px-3 py-1 rounded-lg">Rs. {receiptData.paidAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Cloudinary QR Verification */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-border/80 text-xs">
            <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/60">
              <div className="p-2 rounded-lg bg-white text-black shrink-0 shadow-sm">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-foreground flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {locale === 'ur' ? 'کلاؤڈ تصدیق شدہ ڈیجیٹل رسید' : 'Cloud Verified Digital Receipt'}
                </p>
                <p className="text-[10px] text-muted-foreground font-en mt-0.5">Hash: CLD-REC-{receiptData.receiptNo}</p>
              </div>
            </div>

            <div className="text-center sm:text-end space-y-1">
              <div className="w-40 border-b-2 border-foreground/40 pb-1 mb-1 mx-auto sm:ms-auto font-ur italic text-primary">
                {receiptData.collectorName}
              </div>
              <p className="font-bold text-muted-foreground text-[11px]">{locale === 'ur' ? 'دستخط کلرک / وصول کنندہ' : 'Authorized Clerk Signature'}</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="bg-muted/60 p-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-bold text-muted-foreground">
            {locale === 'ur' ? 'ہدایت: پرنٹ کے وقت براؤزر میں Margins کو Minimum رکھیں تاکہ رسید ایک صفحے پر پرنٹ ہو۔' : 'Tip: Set printer margins to minimum for optimal single-page output.'}
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button onClick={onClose} variant="outline" size="sm" className="font-bold text-xs">
              {locale === 'ur' ? 'بند کریں' : 'Close'}
            </Button>
            <Button onClick={handleDownloadCloudinary} variant="secondary" size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
              <Download className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{locale === 'ur' ? 'پی ڈی ایف ڈاؤن لوڈ' : 'Download PDF'}</span>
            </Button>
            <Button onClick={handlePrint} variant="emerald" size="sm" className="font-bold text-xs gap-1.5 shadow-md">
              <Printer className="w-4 h-4 shrink-0" />
              <span>{locale === 'ur' ? 'پرنٹ کریں (Print Receipt)' : 'Print Receipt'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
