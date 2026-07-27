"use client";

import React, { useState } from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Download, 
  CreditCard, 
  Building, 
  PhoneCall, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';
import { ReceiptModal, FeeReceiptData } from '@/components/finance/receipt-modal';

export default function ParentFinancePage() {
  const { locale } = useLanguage();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<FeeReceiptData | null>(null);

  const handleOpenReceipt = (invNo: string, amount: number, monthUr: string, monthEn: string, date: string) => {
    setReceiptData({
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNo: invNo,
      studentNameUrdu: 'طلحہ احمد',
      studentNameEn: 'Talha Ahmed',
      regId: 'REG-2026-001',
      classNameUrdu: 'درجہ ہشتم (عصری سکول)',
      classNameEn: 'Class 8th (Modern School)',
      billingMonth: locale === 'ur' ? monthUr : monthEn,
      totalAmount: amount,
      paidAmount: amount,
      discountAmount: 0,
      paymentMethod: locale === 'ur' ? 'آن لائن بینک ٹرانسفر (Bank Transfer)' : 'Online Bank Transfer',
      paymentDate: date,
      collectorName: locale === 'ur' ? 'حافظ زبیر صاحب (اکاؤنٹس ڈیسک)' : 'Hafiz Zubair (Accounts Desk)'
    });
    setIsReceiptOpen(true);
  };

  const invoicesList = [
    { invNo: 'INV-2026-891', monthUr: 'جولائی 2026 (ماہانہ فیس)', monthEn: 'July 2026 (Tuition Fee)', amount: 4500, status: 'paid', date: '10-07-2026' },
    { invNo: 'INV-2026-712', monthUr: 'جون 2026 (ماہانہ فیس + ششماہی امتحان)', monthEn: 'June 2026 (Tuition + Exam Fee)', amount: 5500, status: 'paid', date: '08-06-2026' },
    { invNo: 'INV-2026-540', monthUr: 'مئی 2026 (ماہانہ فیس)', monthEn: 'May 2026 (Tuition Fee)', amount: 4500, status: 'paid', date: '05-05-2026' },
    { invNo: 'INV-2026-402', monthUr: 'اپریل 2026 (ماہانہ فیس + کتب و کاپیاں)', monthEn: 'April 2026 (Tuition + Stationary)', amount: 6000, status: 'paid', date: '03-04-2026' },
    { invNo: 'INV-2026-255', monthUr: 'مارچ 2026 (ماہانہ فیس)', monthEn: 'March 2026 (Tuition Fee)', amount: 4500, status: 'paid', date: '06-03-2026' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border/80 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {locale === 'ur' ? 'فیس انوائس، ادائیگیوں کا ریکارڈ اور سرکاری رسیدیں' : 'Fee Invoices, Payment Ledger & Official Receipts'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {locale === 'ur' ? 'طالب علم: طلحہ احمد (درجہ ہشتم - REG-2026-001) | سرپرست: حاجی محمد امین' : 'Student: Talha Ahmed (Class 8th - REG-2026-001) | Guardian: Haji Muhammad Amin'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => {
              toast.success(locale === 'ur' ? '📥 مکمل سالانہ فیس سٹیٹمنٹ ڈاؤن لوڈ ہو رہی ہے...' : '📥 Downloading annual fee statement PDF...');
            }}
            variant="outline"
            className="h-9 px-4 font-bold text-xs gap-2"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>{locale === 'ur' ? 'سالانہ فیس سٹیٹمنٹ' : 'Annual Fee Statement'}</span>
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'سالانہ کل فیس (2026)' : 'Total Annual Fee (2026)'}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-en mt-1">Rs. 54,000</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{locale === 'ur' ? 'ماہانہ فیس: 4,500 روپے' : 'Monthly Tuition: Rs. 4,500'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'کل ادا شدہ رقم (Paid)' : 'Total Paid Amount'}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-en mt-1">Rs. 25,000</p>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'ur' ? 'جولائی تک تمام انوائس کلیئر ہیں' : 'All invoices cleared up to July'}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">{locale === 'ur' ? 'موجودہ بقایاجات (Dues)' : 'Current Pending Dues'}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-en mt-1">Rs. 0</p>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{locale === 'ur' ? 'اگلی انوائس 1 اگست کو جاری ہوگی' : 'Next invoice due on 1st August'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-500/15 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Payment Guide & Bank Accounts Desk */}
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/5 shadow-md">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{locale === 'ur' ? 'آن لائن فیس ادائیگی کا طریقہ اور بینک اکاؤنٹس' : 'Online Payment Methods & Official Bank Accounts'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1.5 shadow-sm">
              <p className="font-bold text-primary flex items-center gap-1.5">
                <span>🏦 میزان بینک (Meezan Bank)</span>
              </p>
              <p className="text-muted-foreground text-xs">{locale === 'ur' ? 'اکاؤنٹ ٹائٹل: جامعہ الحکمہ ایجوکیشن ٹرسٹ' : 'Title: Al-Hikmah Education Trust'}</p>
              <p className="font-en font-bold text-foreground text-xs bg-muted p-1.5 rounded text-center">PK34 MEZN 0001 2345 6789 0101</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1.5 shadow-sm">
              <p className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span>📱 جاز کیش / ایزی پیسہ (JazzCash / EasyPaisa)</span>
              </p>
              <p className="text-muted-foreground text-xs">{locale === 'ur' ? 'اکاؤنٹ ٹائٹل: مولانا محمد طارق (مہتمم)' : 'Title: Maulana Muhammad Tariq'}</p>
              <p className="font-en font-bold text-foreground text-xs bg-muted p-1.5 rounded text-center">0300-1234567 (Merchant ID: 8921)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 flex flex-col justify-between">
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-300">💡 {locale === 'ur' ? 'ادائیگی کے بعد کیا کریں؟' : 'After Making Payment?'}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {locale === 'ur' ? 'آن لائن ٹرانسفر کے بعد رسید کا سکرین شاٹ واٹس ایپ پر ارسال کریں تاکہ کلرک فوری رسید جاری کر سکے۔' : 'Send payment screenshot on WhatsApp to instantly receive your verified receipt.'}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  window.open('https://wa.me/923001234567?text=' + encodeURIComponent(locale === 'ur' ? 'السلام علیکم! فیس ادائیگی کا سکرین شاٹ ارسال ہے: REG-2026-001' : 'Hello! Here is my fee payment screenshot for REG-2026-001'), '_blank');
                }}
                className="w-full h-8 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{locale === 'ur' ? 'سکرین شاٹ واٹس ایپ کریں' : 'WhatsApp Screenshot'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Invoices Table */}
      <Card className="border-border/80 bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
          <div>
            <CardTitle className="text-base font-bold">
              {locale === 'ur' ? 'فیس انوائس کا تفصیلی کھاتہ اور رسیدیں' : 'Detailed Fee Ledger & Receipts Archive'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'ur' ? 'کسی بھی ادا شدہ انوائس کے سامنے بنے "رسید دیکھیں" بٹن پر کلک کر کے سرکاری پرنٹ وصول کریں' : 'Click "View Receipt" on any paid invoice to view and print official Cloudinary verified receipt'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                  <th className="py-3 px-4 text-start">{locale === 'ur' ? 'انوائس نمبر' : 'Invoice No'}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ur' ? 'ماہ / مد' : 'Billing Month / Type'}</th>
                  <th className="py-3 px-4 text-start font-en">{locale === 'ur' ? 'رقم (Amount)' : 'Amount'}</th>
                  <th className="py-3 px-4 text-center">{locale === 'ur' ? 'ادائیگی صورتحال' : 'Status'}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ur' ? 'تاریخ ادائیگی' : 'Payment Date'}</th>
                  <th className="py-3 px-4 text-end">{locale === 'ur' ? 'اقدام' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoicesList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3.5 px-4 font-en font-bold text-primary">{row.invNo}</td>
                    <td className="py-3.5 px-4 font-bold">{locale === 'ur' ? row.monthUr : row.monthEn}</td>
                    <td className="py-3.5 px-4 font-en font-extrabold text-foreground">Rs. {row.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold px-3 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5 me-1 inline" />
                        {locale === 'ur' ? 'ادا شدہ (Paid)' : 'Paid'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-en font-medium text-muted-foreground">{row.date}</td>
                    <td className="py-3.5 px-4 text-end">
                      <Button
                        size="sm"
                        variant="emerald"
                        onClick={() => handleOpenReceipt(row.invNo, row.amount, row.monthUr, row.monthEn, row.date)}
                        className="h-8 px-3 font-bold text-xs gap-1.5 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{locale === 'ur' ? 'رسید دیکھیں / پرنٹ کریں' : 'View Official Receipt'}</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Embedded Reusable Modal */}
      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={receiptData}
      />
    </div>
  );
}
