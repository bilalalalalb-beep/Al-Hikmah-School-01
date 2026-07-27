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
  BookOpen, 
  PlusCircle, 
  DollarSign, 
  Filter, 
  Search, 
  TrendingDown, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle2, 
  Receipt,
  Users,
  Zap,
  Utensils,
  Wrench,
  HelpCircle,
  Database,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';

const initialExpenses = [
  { id: 'exp1', titleUrdu: 'اساتذہ کرام کی تنخواہ (ماہ جولائی)', titleEn: 'Staff Salaries (July)', amount: 185000, category: 'salary', date: '2026-07-01', remarks: 'کل 8 اساتذہ و ملازمین کی ماہانہ تنخواہ' },
  { id: 'exp2', titleUrdu: 'بجلی کا بل (مرکزی کیمپس)', titleEn: 'Electricity Utility Bill', amount: 42000, category: 'utility', date: '2026-07-04', remarks: 'واپڈا میٹر نمبر 1044 کا بل' },
  { id: 'exp3', titleUrdu: 'دارالاقامہ کے لیے راشن اور غلہ', titleEn: 'Boarding Mess Ration & Grain', amount: 65000, category: 'food_mess', date: '2026-07-05', remarks: 'چاول، آٹا، گھی اور دالیں (ہول سیل مارکیٹ)' },
  { id: 'exp4', titleUrdu: 'کلاس رومز کی سفیدی و پنکھوں کی مرمت', titleEn: 'Classroom Painting & Repair', amount: 15000, category: 'maintenance', date: '2026-07-06', remarks: 'الیکٹریشن اور مستری کی مزدوری' },
];

export function ExpenseManager() {
  const { locale } = useLanguage();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loadingDb, setLoadingDb] = useState(false);
  const [seedingDb, setSeedingDb] = useState(false);
  const supabase = createClient();

  const fetchExpensesFromDb = async () => {
    try {
      setLoadingDb(true);
      const { data: expData } = await (supabase as any).from('expenses').select('*').order('expense_date', { ascending: false });
      if (expData && expData.length > 0) {
        const mapped = expData.map((e: any) => ({
          id: e.id,
          titleUrdu: e.title_ur || '',
          titleEn: e.title_en || '',
          amount: e.amount || 0,
          category: e.category || 'other',
          date: e.expense_date || '2026-07-01',
          remarks: e.remarks || ''
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchExpensesFromDb();
  }, []);

  const handleSeedExpenses = async () => {
    setSeedingDb(true);
    try {
      const rows = initialExpenses.map(e => ({
        title_ur: e.titleUrdu,
        title_en: e.titleEn,
        amount: e.amount,
        category: e.category,
        expense_date: e.date,
        remarks: e.remarks
      }));
      const { error } = await (supabase as any).from('expenses').insert(rows);
      if (error) {
        toast.error(locale === 'ur' ? `ایرر: ${error.message}` : `Error: ${error.message}`);
      } else {
        await fetchExpensesFromDb();
        toast.success(locale === 'ur' ? '🎉 الحمد للہ! تجرباتی اخراجات لائیو DB میں شامل ہو گئے!' : '🎉 Sample expenses seeded into live DB!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error seeding');
    } finally {
      setSeedingDb(false);
    }
  };

  // New Expense Form State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [titleUrdu, setTitleUrdu] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('utility');
  const [remarks, setRemarks] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Filtered Expenses
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = searchQuery === '' || 
      exp.titleUrdu.includes(searchQuery) || 
      exp.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.remarks.includes(searchQuery);
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpensesAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Add Expense Handler
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleUrdu || !amount) return;

    try {
      const row = {
        title_ur: titleUrdu,
        title_en: titleEn || titleUrdu,
        amount: Number(amount),
        category: category,
        expense_date: expenseDate,
        remarks: remarks || (locale === 'ur' ? 'روزمرہ خرچ' : 'Daily expense')
      };

      const { error } = await (supabase as any).from('expenses').insert([row]);
      if (error) {
        toast.error(locale === 'ur' ? `ڈیٹا بیس ایرر: ${error.message}` : `DB Error: ${error.message}`);
      } else {
        await fetchExpensesFromDb();
        setAddModalOpen(false);
        setTitleUrdu('');
        setTitleEn('');
        setAmount('');
        setRemarks('');
        toast.success(locale === 'ur' ? '🎉 الحمد للہ! نیا خرچ لائیو Supabase میں محفوظ ہو گیا!' : '🎉 New expense saved to live DB!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving expense');
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'salary':
        return <Badge className="bg-purple-500/15 text-purple-700 border-purple-500/30 gap-1 text-[11px] font-bold"><Users className="w-3 h-3 inline" /> {locale === 'ur' ? 'تنخواہ اساتذہ' : 'Salary'}</Badge>;
      case 'utility':
        return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 gap-1 text-[11px] font-bold"><Zap className="w-3 h-3 inline" /> {locale === 'ur' ? 'یوٹیلیٹی بلز' : 'Utility Bill'}</Badge>;
      case 'food_mess':
        return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 gap-1 text-[11px] font-bold"><Utensils className="w-3 h-3 inline" /> {locale === 'ur' ? 'طعام و راشن' : 'Boarding Mess'}</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 gap-1 text-[11px] font-bold"><Wrench className="w-3 h-3 inline" /> {locale === 'ur' ? 'مرمت و عمارت' : 'Maintenance'}</Badge>;
      default:
        return <Badge variant="outline" className="gap-1 text-[11px] font-bold"><HelpCircle className="w-3 h-3 inline" /> {locale === 'ur' ? 'دیگر متفرقات' : 'Other'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-ur">
      {/* Top Controls Bar */}
      <Card className="border-border/60 shadow-sm bg-card/95 backdrop-blur-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-primary" />
                  <span>{locale === 'ur' ? 'خرچ یا تفصیل تلاش کریں...' : 'Search Expenses...'}</span>
                </Label>
                <Input
                  placeholder={locale === 'ur' ? 'مثلاً: بجلی کا بل یا تنخواہ...' : 'e.g. Salary, Electricity...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 text-xs font-ur bg-background w-full sm:w-64"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  <span>{locale === 'ur' ? 'زمرہ / کیٹگری فلٹر' : 'Category Filter'}</span>
                </Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-11 font-bold text-xs sm:text-sm font-ur bg-background w-full sm:w-56"><SelectValue /></SelectTrigger>
                  <SelectContent className="font-ur">
                    <SelectItem value="all">{locale === 'ur' ? 'تمام اخراجات (All Expenses)' : 'All Categories'}</SelectItem>
                    <SelectItem value="salary">{locale === 'ur' ? '👥 تنخواہ اساتذہ و ملازمین' : '👥 Staff Salaries'}</SelectItem>
                    <SelectItem value="utility">{locale === 'ur' ? '⚡ بجلی و یوٹیلیٹی بلز' : '⚡ Utility Bills'}</SelectItem>
                    <SelectItem value="food_mess">{locale === 'ur' ? '🍲 دارالاقامہ راشن و طعام' : '🍲 Mess & Food'}</SelectItem>
                    <SelectItem value="maintenance">{locale === 'ur' ? '🔧 مرمت و عمارت سازی' : '🔧 Maintenance'}</SelectItem>
                    <SelectItem value="other">{locale === 'ur' ? '📦 دیگر متفرق اخراجات' : '📦 Other Expenses'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Button
                type="button"
                onClick={() => toast.success(locale === 'ur' ? '📊 اخراجات کی شیٹ ڈاؤن لوڈ ہو رہی ہے...' : '📊 Exporting expense report...')}
                variant="outline"
                className="h-11 text-xs font-bold gap-2 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locale === 'ur' ? 'ایکسل رپورٹ' : 'Export CSV'}</span>
              </Button>
              <Button
                type="button"
                onClick={() => setAddModalOpen(true)}
                variant="emerald"
                className="h-11 text-xs sm:text-sm font-bold gap-2 shadow-md"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>{locale === 'ur' ? '+ نیا خرچ درج کریں' : '+ Add New Expense'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Total Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/20 via-card to-card border-s-4 border-s-rose-600 border border-border/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-muted-foreground">{locale === 'ur' ? 'منتخب زمرے کے کل اخراجات' : 'Total Aggregated Expenses'}</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-en mt-1">Rs. {totalExpensesAmount.toLocaleString()}</h3>
          <p className="text-xs text-muted-foreground font-bold mt-1">
            {locale === 'ur' ? `کل ${filteredExpenses.length} اندراجات کا مجموعہ (PKR میں)` : `Sum of ${filteredExpenses.length} ledger items (PKR)`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 px-4 py-2 text-xs font-bold gap-1.5">
            <TrendingDown className="w-4 h-4 shrink-0" />
            <span>{locale === 'ur' ? 'باقاعدہ مالیاتی نگرانی' : 'Monitored Ledger'}</span>
          </Badge>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="bg-muted/30 border-b border-border/60 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-600" />
                <span>{locale === 'ur' ? 'روزنامچہ اخراجات (Expense Ledger)' : 'Master Expense Ledger'}</span>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {locale === 'ur' ? 'جامعہ کے روزمرہ اور ماہانہ اخراجات، کلاؤڈ رسیدات اور واؤچرز کی تفصیلی فہرست۔' : 'Detailed ledger of salaries, utilities, ration, and school maintenance costs.'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSeedExpenses}
                disabled={seedingDb}
                className="font-bold border-rose-500/50 text-rose-600 hover:bg-rose-500/10 gap-1.5 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{seedingDb ? (locale === 'ur' ? 'اخراجات ڈالے جا رہے ہیں...' : 'Seeding...') : (locale === 'ur' ? '⚡ لائیو DB میں تجرباتی اخراجات ڈالیں' : 'Seed Expenses to DB')}</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={fetchExpensesFromDb} className="h-9 w-9 text-muted-foreground hover:text-foreground" title="Refresh DB">
                <RefreshCw className={`w-4 h-4 ${loadingDb ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === 'ur' ? 'تاریخ' : 'Date'}</TableHead>
                <TableHead>{locale === 'ur' ? 'عنوان و تفصیل' : 'Expense Title'}</TableHead>
                <TableHead>{locale === 'ur' ? 'زمرہ (Category)' : 'Category'}</TableHead>
                <TableHead>{locale === 'ur' ? 'کیفیت / نوٹ' : 'Remarks'}</TableHead>
                <TableHead className="text-end">{locale === 'ur' ? 'رقم (PKR)' : 'Amount (PKR)'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((exp) => (
                <TableRow key={exp.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-muted-foreground font-en whitespace-nowrap">
                    {exp.date}
                  </TableCell>
                  <TableCell className="font-bold py-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">{locale === 'ur' ? exp.titleUrdu : exp.titleEn}</h4>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(exp.category)}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground max-w-xs truncate">
                    {exp.remarks}
                  </TableCell>
                  <TableCell className="text-end font-en text-base font-extrabold text-rose-600 dark:text-rose-400">
                    Rs. {exp.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/30 p-4 border-t border-border/60 flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground">
            {locale === 'ur' ? 'نوٹ: تنخواہوں کی ادائیگی ہر ماہ کی یکم سے 5 تاریخ کے درمیان باضابطہ واؤچر کے ذریعے کی جاتی ہے۔' : 'Note: Staff salaries are processed between 1st and 5th of each month.'}
          </p>
        </CardFooter>
      </Card>

      {/* Add Expense Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg font-ur p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-emerald-600" />
              <span>{locale === 'ur' ? 'نیا اخراجاتی واؤچر درج کریں' : 'Add New Expense Voucher'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'عنوان (اردو میں)' : 'Title (Urdu)'}</Label>
              <Input
                required
                placeholder={locale === 'ur' ? 'جیسے: جنریٹر کا پیٹرول یا کتابوں کی خریداری...' : 'e.g. Generator fuel...'}
                value={titleUrdu}
                onChange={(e) => setTitleUrdu(e.target.value)}
                className="h-11 font-ur text-sm font-bold bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'رقم (PKR میں)' : 'Amount (PKR)'}</Label>
                <Input
                  type="number"
                  required
                  min="1"
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 font-mono text-base font-bold text-rose-600 bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'تاریخ' : 'Date'}</Label>
                <Input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="h-11 font-mono text-xs font-bold bg-background text-start"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'زمرہ (Category)' : 'Category'}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 font-bold font-ur bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="font-ur">
                  <SelectItem value="salary" className="font-bold">{locale === 'ur' ? '👥 تنخواہ اساتذہ و ملازمین' : '👥 Salaries'}</SelectItem>
                  <SelectItem value="utility" className="font-bold">{locale === 'ur' ? '⚡ بجلی و یوٹیلیٹی بلز' : '⚡ Utility Bills'}</SelectItem>
                  <SelectItem value="food_mess" className="font-bold">{locale === 'ur' ? '🍲 دارالاقامہ راشن و طعام' : '🍲 Mess & Food'}</SelectItem>
                  <SelectItem value="maintenance" className="font-bold">{locale === 'ur' ? '🔧 مرمت و عمارت سازی' : '🔧 Maintenance'}</SelectItem>
                  <SelectItem value="other" className="font-bold">{locale === 'ur' ? '📦 دیگر متفرق اخراجات' : '📦 Other Expenses'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">{locale === 'ur' ? 'تفصیل / کیفیت (Remarks)' : 'Remarks / Note'}</Label>
              <Input
                placeholder={locale === 'ur' ? 'جیسے: رسید نمبر یا دکان کا نام...' : 'e.g. Receipt # or Shop name...'}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="h-10 text-xs font-ur bg-background"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" onClick={() => setAddModalOpen(false)} variant="outline" className="font-bold">
                {locale === 'ur' ? 'منسوخ کریں' : 'Cancel'}
              </Button>
              <Button type="submit" variant="emerald" className="font-bold gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{locale === 'ur' ? '✅ لیجر میں محفوظ کریں' : '✅ Save Expense'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
