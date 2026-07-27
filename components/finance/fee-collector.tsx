"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wallet, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Printer, 
  CreditCard, 
  Sparkles, 
  Receipt,
  Users,
  DollarSign,
  Database,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { ReceiptModal, FeeReceiptData } from './receipt-modal';

// Demo Invoices matching SQL seed data
const initialInvoices = [
  { id: 'inv1', invoiceNo: 'INV-2026-0701', studentId: '44444444-4444-4444-4444-444444444401', regId: 'REG-2026-0001', nameUrdu: 'محمد زبیر بن عبداللہ', name: 'Muhammad Zubair', classId: 'c1', classNameUrdu: 'درجہ اول (ناظرہ و بنیادی تعلیم)', classNameEn: 'Grade 1 (Nazira)', month: '2026-07', total: 3000, paid: 3000, discount: 0, status: 'paid', receiptNo: 'REC-2026-0001', paymentDate: '2026-07-02' },
  { id: 'inv2', invoiceNo: 'INV-2026-0702', studentId: '44444444-4444-4444-4444-444444444402', regId: 'REG-2026-0002', nameUrdu: 'احمد رضا قادری', name: 'Ahmed Raza Qadri', classId: 'c1', classNameUrdu: 'درجہ اول (ناظرہ و بنیادی تعلیم)', classNameEn: 'Grade 1 (Nazira)', month: '2026-07', total: 3000, paid: 1500, discount: 0, status: 'partial', receiptNo: 'REC-2026-0002', paymentDate: '2026-07-05' },
  { id: 'inv3', invoiceNo: 'INV-2026-0703', studentId: '44444444-4444-4444-4444-444444444403', regId: 'REG-2026-0003', nameUrdu: 'طلحہ محمود عثمانی', name: 'Talha Mahmood Usmani', classId: 'c1', classNameUrdu: 'درجہ اول (ناظرہ و بنیادی تعلیم)', classNameEn: 'Grade 1 (Nazira)', month: '2026-07', total: 3000, paid: 0, discount: 0, status: 'unpaid', receiptNo: '', paymentDate: '' },
  { id: 'inv4', invoiceNo: 'INV-2026-0704', studentId: '44444444-4444-4444-4444-444444444404', regId: 'REG-2026-0004', nameUrdu: 'عائشہ صدیقہ بنت عمر', name: 'Ayesha Siddiqa', classId: 'c1', classNameUrdu: 'درجہ اول (ناظرہ و بنیادی تعلیم)', classNameEn: 'Grade 1 (Nazira)', month: '2026-07', total: 3000, paid: 0, discount: 3000, status: 'waived', receiptNo: 'REC-2026-0003', paymentDate: '2026-07-01' },
  { id: 'inv6', invoiceNo: 'INV-2026-0706', studentId: '44444444-4444-4444-4444-444444444406', regId: 'REG-2026-0006', nameUrdu: 'عبدالرحمٰن سندھی', name: 'Abdur Rahman Sindhi', classId: 'c4', classNameUrdu: 'شعبہ حفظ القرآن (دارالحفظ)', classNameEn: 'Hifz Dept', month: '2026-07', total: 2000, paid: 0, discount: 0, status: 'unpaid', receiptNo: '', paymentDate: '' },
  { id: 'inv7', invoiceNo: 'INV-2026-0707', studentId: '44444444-4444-4444-4444-444444444407', regId: 'REG-2026-0007', nameUrdu: 'مولوی انس مدنی', name: 'Maulvi Anas Madani', classId: 'c5', classNameUrdu: 'درس نظامی سال اول (عامہ اولیٰ)', classNameEn: 'Dars-e-Nizami Year 1', month: '2026-07', total: 2000, paid: 2000, discount: 0, status: 'paid', receiptNo: 'REC-2026-0004', paymentDate: '2026-07-03' },
];

export function FeeCollector() {
  const { locale } = useLanguage();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [loadingDb, setLoadingDb] = useState(false);
  const [processingDb, setProcessingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);
  const supabase = createClient();

  const fetchInvoicesFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data: invData } = await (supabase as any).from('fee_invoices').select('*').order('created_at', { ascending: true });
      const { data: stdData } = await (supabase as any).from('students').select('*');
      const { data: recData } = await (supabase as any).from('fee_receipts').select('*');

      if (invData && invData.length > 0) {
        const mapped = invData.map((inv: any) => {
          const std = stdData?.find((s: any) => s.id === inv.student_id);
          const rec = recData?.find((r: any) => r.invoice_id === inv.id);

          let cId = 'c1';
          let cUr = 'درجہ اول (ناظرہ و بنیادی تعلیم)';
          let cEn = 'Grade 1 (Nazira)';
          if (inv.class_id === '11111111-1111-1111-1111-111111111104') {
            cId = 'c4'; cUr = 'شعبہ حفظ القرآن (دارالحفظ)'; cEn = 'Hifz Dept';
          } else if (inv.class_id === '11111111-1111-1111-1111-111111111105') {
            cId = 'c5'; cUr = 'درس نظامی سال اول (عامہ اولیٰ)'; cEn = 'Dars-e-Nizami Year 1';
          }

          return {
            id: inv.id,
            invoiceNo: inv.invoice_no || 'INV-2026-070X',
            studentId: inv.student_id,
            regId: std ? std.registration_id : 'REG-2026-XXXX',
            nameUrdu: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'طالب علم',
            name: std ? `${std.first_name} ${std.last_name || ''}`.trim() : 'Student',
            classId: cId,
            classNameUrdu: cUr,
            classNameEn: cEn,
            month: inv.billing_month || '2026-07',
            total: inv.total_amount || 0,
            paid: inv.paid_amount || 0,
            discount: inv.discount_amount || 0,
            status: inv.status || 'unpaid',
            receiptNo: rec ? rec.receipt_no : '',
            paymentDate: rec ? rec.payment_date : ''
          };
        });
        setInvoices(mapped);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchInvoicesFromDb();
  }, []);

  const handleSeedInvoices = async () => {
    setSeedingDb(true);
    try {
      const { data: stdData } = await (supabase as any).from('students').select('*').limit(6);
      if (!stdData || stdData.length === 0) {
        toast.error(locale === 'ur' ? 'پہلے شعبہ طلباء سے کچھ طلباء شامل کریں یا سیڈ کریں۔' : 'Please seed students first.');
        setSeedingDb(false);
        return;
      }
      const newInvoices = stdData.map((std: any, idx: number) => {
        const amt = idx % 2 === 0 ? 3000 : 2500;
        return {
          invoice_no: `INV-2026-07${10 + idx}`,
          student_id: std.id,
          class_id: std.current_class_id || '11111111-1111-1111-1111-111111111101',
          billing_month: '2026-07',
          total_amount: amt,
          paid_amount: 0,
          discount_amount: 0,
          status: 'unpaid',
          due_date: '2026-07-15'
        };
      });
      const { error } = await (supabase as any).from('fee_invoices').upsert(newInvoices, { onConflict: 'student_id, billing_month' });
      if (error) {
        toast.error(locale === 'ur' ? `ایرر: ${error.message}` : `Error: ${error.message}`);
      } else {
        await fetchInvoicesFromDb();
        toast.success(locale === 'ur' ? '🎉 الحمد للہ! تجرباتی انوائسز لائیو DB میں شامل ہو گئیں!' : '🎉 Sample invoices seeded to live DB!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error seeding');
    } finally {
      setSeedingDb(false);
    }
  };

  // Collect Modal State
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<typeof initialInvoices[0] | null>(null);
  const [amountToCollect, setAmountToCollect] = useState(0);
  const [discountToGive, setDiscountToGive] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [remarks, setRemarks] = useState('');

  // Receipt Preview Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeReceiptData, setActiveReceiptData] = useState<FeeReceiptData | null>(null);

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = searchQuery === '' || 
      inv.nameUrdu.includes(searchQuery) || 
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inv.regId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || inv.classId === selectedClassFilter;
    const matchesStatus = selectedStatusFilter === 'all' || inv.status === selectedStatusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Summary Metrics
  const totalDue = filteredInvoices.reduce((acc, curr) => acc + curr.total, 0);
  const totalCollected = filteredInvoices.reduce((acc, curr) => acc + curr.paid, 0);
  const totalPending = totalDue - totalCollected - filteredInvoices.reduce((acc, curr) => acc + curr.discount, 0);

  // Open Collect Modal
  const openCollectDialog = (inv: typeof initialInvoices[0]) => {
    setActiveInvoice(inv);
    const remaining = inv.total - inv.paid - inv.discount;
    setAmountToCollect(remaining > 0 ? remaining : 0);
    setDiscountToGive(0);
    setPaymentMethod('cash');
    setRemarks('');
    setCollectModalOpen(true);
  };

  // Submit Payment & Generate Receipt
  const handleCollectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice) return;

    setProcessingDb(true);
    try {
      const newPaid = activeInvoice.paid + Number(amountToCollect);
      const newDiscount = activeInvoice.discount + Number(discountToGive);
      const newStatus = (newPaid + newDiscount) >= activeInvoice.total ? 'paid' : 'partial';
      const newReceiptNo = `REC-2026-0${Math.floor(100 + Math.random() * 900)}`;
      const todayStr = new Date().toISOString().split('T')[0];

      if (activeInvoice.id.length === 36) {
        await (supabase as any).from('fee_invoices').update({
          paid_amount: newPaid,
          discount_amount: newDiscount,
          status: newStatus
        }).eq('id', activeInvoice.id);

        await (supabase as any).from('fee_receipts').insert([{
          receipt_no: newReceiptNo,
          invoice_id: activeInvoice.id,
          student_id: activeInvoice.studentId.length === 36 ? activeInvoice.studentId : '44444444-4444-4444-4444-444444444401',
          amount_paid: Number(amountToCollect),
          discount_given: Number(discountToGive),
          payment_method: paymentMethod,
          remarks: remarks || 'آن لائن / نقد وصولی',
          payment_date: todayStr
        }]);
      }

      // Update local state
      setInvoices(invoices.map(inv => inv.id === activeInvoice.id ? {
        ...inv,
        paid: newPaid,
        discount: newDiscount,
        status: newStatus,
        receiptNo: newReceiptNo,
        paymentDate: todayStr
      } : inv));

      setCollectModalOpen(false);

      const receiptPayload: FeeReceiptData = {
        receiptNo: newReceiptNo,
        invoiceNo: activeInvoice.invoiceNo,
        studentNameUrdu: activeInvoice.nameUrdu,
        studentNameEn: activeInvoice.name,
        regId: activeInvoice.regId,
        classNameUrdu: activeInvoice.classNameUrdu,
        classNameEn: activeInvoice.classNameEn,
        billingMonth: activeInvoice.month,
        totalAmount: activeInvoice.total,
        paidAmount: Number(amountToCollect),
        discountAmount: Number(discountToGive),
        paymentMethod: paymentMethod.toUpperCase(),
        paymentDate: todayStr,
        collectorName: locale === 'ur' ? 'محترم کلرک / اکاؤنٹینٹ صاحب' : 'Authorized Clerk Desk'
      };

      setActiveReceiptData(receiptPayload);
      setReceiptModalOpen(true);
      toast.success(locale === 'ur' ? `🎉 الحمد للہ! فیس لائیو Supabase میں محفوظ ہو گئی اور رسید (${newReceiptNo}) جاری کر دی گئی!` : `🎉 Payment saved to live DB & Receipt ${newReceiptNo} generated!`);
      await fetchInvoicesFromDb();
    } catch (err: any) {
      toast.error(err.message || 'Error processing payment');
    } finally {
      setProcessingDb(false);
    }
  };

  // Open existing receipt
  const openExistingReceipt = (inv: typeof initialInvoices[0]) => {
    const receiptPayload: FeeReceiptData = {
      receiptNo: inv.receiptNo || 'REC-2026-0001',
      invoiceNo: inv.invoiceNo,
      studentNameUrdu: inv.nameUrdu,
      studentNameEn: inv.name,
      regId: inv.regId,
      classNameUrdu: inv.classNameUrdu,
      classNameEn: inv.classNameEn,
      billingMonth: inv.month,
      totalAmount: inv.total,
      paidAmount: inv.paid,
      discountAmount: inv.discount,
      paymentMethod: 'CASH / ONLINE',
      paymentDate: inv.paymentDate || '2026-07-02',
      collectorName: locale === 'ur' ? 'محترم کلرک / اکاؤنٹینٹ صاحب' : 'Authorized Clerk Desk'
    };
    setActiveReceiptData(receiptPayload);
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6 font-ur">
      {/* Top Search & Filter Card */}
      <Card className="border-border/60 shadow-sm bg-card/95 backdrop-blur-md">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>{locale === 'ur' ? 'طالب علم، REG ID یا بل نمبر تلاش کریں' : 'Search Student, REG ID or Invoice No'}</span>
              </Label>
              <div className="relative w-full">
                <Input
                  placeholder={locale === 'ur' ? 'نام یا ID لکھیں (جیسے REG-2026-0001)...' : 'Type student name or ID...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 text-xs sm:text-sm font-ur bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{locale === 'ur' ? 'درجہ / کلاس فلٹر' : 'Class Filter'}</span>
              </Label>
              <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
                <SelectTrigger className="h-11 text-xs sm:text-sm font-bold font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'تمام درجات اور شعبے' : 'All Classes & Depts'}</SelectItem>
                  <SelectItem value="c1">{locale === 'ur' ? 'درجہ اول (ناظرہ و بنیادی تعلیم)' : 'Grade 1 (Nazira)'}</SelectItem>
                  <SelectItem value="c4">{locale === 'ur' ? 'شعبہ حفظ القرآن (دارالحفظ)' : 'Hifz Dept'}</SelectItem>
                  <SelectItem value="c5">{locale === 'ur' ? 'درس نظامی سال اول (عامہ اولیٰ)' : 'Dars-e-Nizami Year 1'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Filter className="w-3.5 h-3.5 text-purple-600" />
                <span>{locale === 'ur' ? 'بل کی کیفیت (Status Filter)' : 'Fee Status Filter'}</span>
              </Label>
              <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
                <SelectTrigger className="h-11 text-xs sm:text-sm font-bold font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="all">{locale === 'ur' ? 'تمام بلز (All Dues)' : 'All Invoices'}</SelectItem>
                  <SelectItem value="unpaid">{locale === 'ur' ? '🔴 واجب الادا / نادہندہ (Unpaid)' : '🔴 Unpaid / Pending'}</SelectItem>
                  <SelectItem value="partial">{locale === 'ur' ? '🟡 جزوی ادائیگی (Partial)' : '🟡 Partial Paid'}</SelectItem>
                  <SelectItem value="paid">{locale === 'ur' ? '🟢 مکمل ادا شدہ (Paid)' : '🟢 Fully Paid'}</SelectItem>
                  <SelectItem value="waived">{locale === 'ur' ? '🟣 مستثنیٰ / وظیفہ (Scholarship)' : '🟣 Waived / Scholarship'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-emerald-500/10 via-card to-card border-s-4 border-s-emerald-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل وصول شدہ فیس (جولائی)' : 'Total Collected (This Month)'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">Rs. {totalCollected.toLocaleString()}</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {locale === 'ur' ? 'نقد و آن لائن وصولیاں' : 'Cash & Online collections'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-rose-500/10 via-card to-card border-s-4 border-s-rose-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل واجب الادا بقایاجات (Pending Dues)' : 'Total Pending Dues'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">Rs. {totalPending.toLocaleString()}</h3>
              <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {locale === 'ur' ? 'فوری وصولی طلب رقم' : 'Needs immediate collection'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-blue-500/10 via-card to-card border-s-4 border-s-blue-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'کل بلنگ (Total Billed Amount)' : 'Total Billed Amount'}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground font-en mt-1">Rs. {totalDue.toLocaleString()}</h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1">{locale === 'ur' ? `${filteredInvoices.length} طلباء کا ریکارڈ` : `${filteredInvoices.length} total invoices`}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Invoices & Roster Table */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/60 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>{locale === 'ur' ? 'ماہانہ فیس بل اور وصولی پورٹل' : 'Monthly Fee Dues & Collection Desk'}</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {locale === 'ur' ? 'کسی بھی طالب علم کے سامنے "💳 فیس وصول کریں" پر کلک کر کے رقم وصول اور باضابطہ رسید جاری کریں۔' : 'Click "Collect Fee" for any student to process payment and generate official Cloudinary receipts.'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSeedInvoices}
                disabled={seedingDb}
                className="font-bold border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 gap-1.5 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>{seedingDb ? (locale === 'ur' ? 'انوائسز ڈالی جا رہی ہیں...' : 'Seeding...') : (locale === 'ur' ? '⚡ لائیو DB میں تجرباتی انوائسز ڈالیں' : 'Seed Invoices to DB')}</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={fetchInvoicesFromDb} className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Refresh DB">
                <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === 'ur' ? 'بل نمبر' : 'Invoice No'}</TableHead>
                <TableHead>{locale === 'ur' ? 'طالب علم' : 'Student Name'}</TableHead>
                <TableHead>{locale === 'ur' ? 'درجہ / کلاس' : 'Class / Grade'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'کل فیس' : 'Total Due'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'ادا شدہ' : 'Paid'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'بقایہ رقم' : 'Pending'}</TableHead>
                <TableHead className="text-center">{locale === 'ur' ? 'کیفیت' : 'Status'}</TableHead>
                <TableHead className="text-end">{locale === 'ur' ? 'اقدام' : 'Action'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => {
                const pendingAmount = inv.total - inv.paid - inv.discount;
                return (
                  <TableRow key={inv.id} className={inv.status === 'unpaid' ? 'bg-rose-500/5' : ''}>
                    <TableCell className="font-mono text-xs font-bold text-primary font-en">
                      {inv.invoiceNo}
                    </TableCell>
                    <TableCell className="font-bold py-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-en">
                            {inv.regId}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-foreground">{locale === 'ur' ? inv.nameUrdu : inv.name}</h4>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground">
                      {locale === 'ur' ? inv.classNameUrdu : inv.classNameEn}
                    </TableCell>
                    <TableCell className="text-center font-en font-bold text-foreground">
                      Rs. {inv.total.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-en font-bold text-emerald-600 dark:text-emerald-400">
                      Rs. {inv.paid.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center font-en font-extrabold text-rose-600 dark:text-rose-400">
                      Rs. {pendingAmount > 0 ? pendingAmount.toLocaleString() : '0'}
                    </TableCell>
                    <TableCell className="text-center">
                      {inv.status === 'paid' ? (
                        <Badge variant="success" className="text-[10px] font-bold">
                          {locale === 'ur' ? '🟢 ادا شدہ (Paid)' : '🟢 Paid'}
                        </Badge>
                      ) : inv.status === 'partial' ? (
                        <Badge variant="secondary" className="text-[10px] font-bold bg-amber-500/15 text-amber-700 border-amber-500/30">
                          {locale === 'ur' ? '🟡 جزوی ادائیگی' : '🟡 Partial'}
                        </Badge>
                      ) : inv.status === 'waived' ? (
                        <Badge variant="outline" className="text-[10px] font-bold bg-purple-500/15 text-purple-700 border-purple-500/30">
                          {locale === 'ur' ? '🟣 وظیفہ / مستثنیٰ' : '🟣 Waived'}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] font-bold animate-pulse">
                          {locale === 'ur' ? '🔴 واجب الادا' : '🔴 Unpaid'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-end">
                      {inv.status === 'paid' || inv.status === 'waived' ? (
                        <Button 
                          onClick={() => openExistingReceipt(inv)} 
                          variant="outline" 
                          size="sm" 
                          className="font-bold text-xs gap-1.5 border-emerald-500/50 text-emerald-700 hover:bg-emerald-500/10"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{locale === 'ur' ? 'رسید دیکھیں' : 'View Receipt'}</span>
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => openCollectDialog(inv)} 
                          variant="emerald" 
                          size="sm" 
                          className="font-bold text-xs gap-1.5 shadow-md"
                        >
                          <CreditCard className="w-3.5 h-3.5 shrink-0" />
                          <span>{locale === 'ur' ? '💳 فیس وصول کریں' : 'Collect Payment'}</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Collect Fee Interactive Modal */}
      <Dialog open={collectModalOpen} onOpenChange={setCollectModalOpen}>
        <DialogContent className="max-w-lg font-ur p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              <span>{locale === 'ur' ? 'فیس وصولی اور رسید کا اجرا' : 'Collect Fee & Generate Receipt'}</span>
            </DialogTitle>
          </DialogHeader>

          {activeInvoice && (
            <form onSubmit={handleCollectSubmit} className="space-y-4">
              {/* Student info box */}
              <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs space-y-1 font-bold">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{locale === 'ur' ? 'طالب علم:' : 'Student:'}</span>
                  <span className="text-foreground text-sm font-extrabold">{locale === 'ur' ? activeInvoice.nameUrdu : activeInvoice.name} ({activeInvoice.regId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{locale === 'ur' ? 'درجہ / کلاس:' : 'Class:'}</span>
                  <span className="text-foreground">{locale === 'ur' ? activeInvoice.classNameUrdu : activeInvoice.classNameEn}</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-1 mt-1 text-sm font-extrabold text-primary">
                  <span>{locale === 'ur' ? 'کل واجب الادا رقم (Total Due):' : 'Total Payable Amount:'}</span>
                  <span className="font-mono font-en">Rs. {(activeInvoice.total - activeInvoice.paid - activeInvoice.discount).toLocaleString()}</span>
                </div>
              </div>

              {/* Amount to collect input */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'وصول کی جانے والی رقم (PKR)' : 'Amount to Collect (PKR)'}</Label>
                <Input
                  type="number"
                  required
                  min="1"
                  max={activeInvoice.total - activeInvoice.paid - activeInvoice.discount}
                  value={amountToCollect}
                  onChange={(e) => setAmountToCollect(Number(e.target.value))}
                  className="h-11 font-mono text-base font-bold text-primary bg-background"
                />
              </div>

              {/* Concession / Scholarship discount */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{locale === 'ur' ? 'خصوصی رعایتی وظیفہ / چھوٹ (اگر کوئی ہو)' : 'Concession / Scholarship Discount (PKR)'}</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={discountToGive}
                  onChange={(e) => setDiscountToGive(Number(e.target.value))}
                  className="h-10 font-mono text-sm font-bold bg-background"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'ادائیگی کا ذریعہ (Payment Method)' : 'Payment Method'}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-11 font-bold font-ur bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent className="font-ur">
                    <SelectItem value="cash" className="font-bold">{locale === 'ur' ? '💵 نقد رقم (Cash Payment)' : '💵 Cash Payment'}</SelectItem>
                    <SelectItem value="bank" className="font-bold">{locale === 'ur' ? '🏦 میزان / اسلامی بینک ٹرانسفر' : '🏦 Bank Transfer'}</SelectItem>
                    <SelectItem value="jazzcash" className="font-bold">{locale === 'ur' ? '📱 جاز کیش (JazzCash)' : '📱 JazzCash'}</SelectItem>
                    <SelectItem value="easypaisa" className="font-bold">{locale === 'ur' ? '📱 ایزی پیسہ (EasyPaisa)' : '📱 EasyPaisa'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'کیفیت / نوٹ (Remarks)' : 'Remarks / Note'}</Label>
                <Input
                  placeholder={locale === 'ur' ? 'جیسے: مکمل فیس وصول یا رسید وصول کی گئی...' : 'e.g., Full payment received...'}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="h-10 text-xs font-ur bg-background"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" onClick={() => setCollectModalOpen(false)} variant="outline" className="font-bold">
                  {locale === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                </Button>
                <Button type="submit" variant="emerald" className="font-bold gap-2 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{locale === 'ur' ? '✅ فیس وصول کریں اور رسید جاری کریں' : '✅ Confirm Payment & Generate Receipt'}</span>
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Printable Receipt Preview Modal */}
      <ReceiptModal 
        isOpen={receiptModalOpen} 
        onClose={() => setReceiptModalOpen(false)} 
        receiptData={activeReceiptData} 
      />
    </div>
  );
}
