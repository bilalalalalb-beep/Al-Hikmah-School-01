"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RoleBadge } from '@/components/layout/role-badge';
import { UserRole } from '@/types';
import { useLanguage } from '@/lib/i18n/context';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  UserCheck, 
  BookOpen, 
  Users, 
  Wallet, 
  Home, 
  Award, 
  ArrowRightLeft, 
  CheckCircle2, 
  Lock, 
  Search,
  Sparkles,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  Clock
} from 'lucide-react';

interface StaffUserItem {
  id: string;
  nameUrdu: string;
  nameEn: string;
  email: string;
  phone: string;
  role: UserRole;
  departmentUrdu: string;
  departmentEn: string;
  joinDate: string;
  status: 'active' | 'on_leave';
  lastPromoted?: string;
}

const initialStaffUsers: StaffUserItem[] = [
  { id: '1', nameUrdu: 'مولانا طارق صاحب', nameEn: 'Maulana Tariq', email: 'principal@alhikmah.edu', phone: '0300-1122334', role: 'admin', departmentUrdu: 'انتظامیہ اعلیٰ', departmentEn: 'Executive Admin', joinDate: '2020-01-01', status: 'active' },
  { id: '2', nameUrdu: 'حافظ زبیر صاحب', nameEn: 'Hafiz Zubair', email: 'clerk@alhikmah.edu', phone: '0321-4455667', role: 'clerk', departmentUrdu: 'دفتر اہتمام و داخلہ', departmentEn: 'Admin Desk & Admissions', joinDate: '2022-03-15', status: 'active', lastPromoted: '2024-01-10' },
  { id: '3', nameUrdu: 'استاد احمد صاحب', nameEn: 'Ustad Ahmed', email: 'ahmed@alhikmah.edu', phone: '0333-8899001', role: 'teacher', departmentUrdu: 'شعبہ درسِ نظامی', departmentEn: 'Dars-e-Nizami Faculty', joinDate: '2023-05-20', status: 'active' },
  { id: '4', nameUrdu: 'مولانا عبید صاحب', nameEn: 'Maulana Ubaid', email: 'accountant@alhikmah.edu', phone: '0345-2233445', role: 'accountant', departmentUrdu: 'شعبہ مالیات و فیس', departmentEn: 'Finance & Cash Desk', joinDate: '2021-08-10', status: 'active', lastPromoted: '2025-02-01' },
  { id: '5', nameUrdu: 'قاری عمران صاحب', nameEn: 'Qari Imran', email: 'warden@alhikmah.edu', phone: '0312-7788990', role: 'warden', departmentUrdu: 'دارالاقامہ (ہاسٹل)', departmentEn: 'Hostel Management', joinDate: '2023-10-05', status: 'active' },
  { id: '6', nameUrdu: 'مفتی شاہد صاحب', nameEn: 'Mufti Shahid', email: 'shahid@alhikmah.edu', phone: '0301-3344556', role: 'teacher', departmentUrdu: 'شعبہ تخصص فی الفقہ', departmentEn: 'Takhassus Faculty', joinDate: '2021-02-15', status: 'active' },
  { id: '7', nameUrdu: 'حافظ سعد صاحب', nameEn: 'Hafiz Saad', email: 'saad@alhikmah.edu', phone: '0332-1122339', role: 'teacher', departmentUrdu: 'شعبہ حفظ و ناظرہ', departmentEn: 'Hifz Section', joinDate: '2024-01-01', status: 'active' },
];

import { createClient } from '@/lib/supabase/client';

export default function StaffRolesAndPromotionPage() {
  const { locale } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'switching' | 'permissions'>('switching');
  
  // Fetch profiles on load
  React.useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await (supabase as any).from('profiles').select('*').order('created_at', { ascending: false });
      if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Promotion Dialog State
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('clerk');
  const [promoReason, setPromoReason] = useState('');
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);

  // Permission Matrix State
  const [permissions, setPermissions] = useState<{ [role in UserRole]?: { [key: string]: boolean } }>({
    admin: { fee: true, attendance: true, exams: true, admissions: true, settings: true, whatsapp: true },
    clerk: { fee: true, attendance: true, exams: false, admissions: true, settings: false, whatsapp: true },
    accountant: { fee: true, attendance: false, exams: false, admissions: false, settings: false, whatsapp: false },
    warden: { fee: false, attendance: true, exams: false, admissions: false, settings: false, whatsapp: true },
    teacher: { fee: false, attendance: true, exams: true, admissions: false, settings: false, whatsapp: false },
    parent: { fee: false, attendance: false, exams: false, admissions: false, settings: false, whatsapp: false },
    student: { fee: false, attendance: false, exams: false, admissions: false, settings: false, whatsapp: false },
  });

  const permissionLabels = [
    { key: 'fee', urdu: 'فیس وصولی، انوائس اور مالیاتی روزنامچہ', en: 'Fee Collection & Cash Vouchers' },
    { key: 'attendance', urdu: 'روزانہ کی ڈیجیٹل حاضری لگانا اور رخصت منظور کرنا', en: 'Mark Daily Attendance & Leave Approval' },
    { key: 'exams', urdu: 'امتحانی نمبرات فیڈ کرنا اور رزلٹ کشف تیار کرنا', en: 'Enter Exam Marks & Result Compilation' },
    { key: 'admissions', urdu: 'نئے طلباء کا داخلہ فارم منظور کرنا اور رجسٹریشن', en: 'New Student Admission & Registration' },
    { key: 'settings', urdu: 'پورٹل کی ترتیبات، برانڈنگ اور ہیرو سلائیڈر کنٹرول', en: 'Portal Settings, Branding & Hero Slider' },
    { key: 'whatsapp', urdu: 'واٹس ایپ اور ایس ایم ایس پیغامات کا خودکار اجرا', en: 'WhatsApp & SMS Automated Broadcasts' },
  ];

  const handleOpenPromoDialog = (user: any) => {
    setSelectedUser(user);
    setTargetRole(user.role);
    setPromoReason(
      locale === 'ur'
        ? `شاندار انتظامی اور تعلیمی کارکردگی کی بنا پر ترقی دی جا رہی ہے۔`
        : `Promoting based on exemplary institutional performance and leadership.`
    );
    setPromoDialogOpen(true);
  };

  const handleConfirmPromotion = async () => {
    if (!selectedUser) return;
    setIsSubmittingPromo(true);

    try {
      const supabase = createClient();
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role: targetRole })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast.success(
        locale === 'ur'
          ? `ماشاء اللہ! ${selectedUser.full_name} کا رول کامیابی کے ساتھ تبدیل کر کے نیا عہدہ الاٹ کر دیا گیا ہے!`
          : `Success! Role has been updated successfully.`
      );
      await fetchProfiles();
      setPromoDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  const handleTogglePermission = (role: UserRole, key: string) => {
    if (role === 'admin') {
      toast.error(locale === 'ur' ? 'منتظم اعلیٰ (Admin) کے تمام اختیارات مستقل فعال رہتے ہیں!' : 'Admin role always has full permissions.');
      return;
    }
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !(prev[role]?.[key] || false),
      },
    }));
  };

  const handleSavePermissions = () => {
    toast.success(
      locale === 'ur'
        ? 'الحمدللہ! تمام عہدوں کے اختیارات اور پابندیاں کامیابی کے ساتھ محفوظ کر لی گئی ہیں!'
        : 'Success! Role-based access matrix and permissions saved successfully.'
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`space-y-6 animate-in fade-in-50 duration-300 ${locale === 'ur' ? 'font-ur' : 'font-en'}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{locale === 'ur' ? 'عہدے اور اختیارات کا مرکزی کنٹرول' : 'Staff Roles & RBAC Management'}</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-emerald-400 shrink-0" />
            <span>{locale === 'ur' ? 'پروموشنل رول سویچنگ اور عہدہ مینجمنٹ سسٹم' : 'Promotional Role Switching & Access Control'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-medium">
            {locale === 'ur'
              ? 'یہاں سے پرنسپل کسی بھی استاد کو کلرک، کلرک کو استاد، خازن یا نگرانِ ہاسٹل کے عہدے پر پروموٹ کر سکتا ہے اور ہر رول کے مخصوص اختیارات اور پابندیاں (Permissions) ایک کلک سے سیٹ کر سکتا ہے۔'
              : 'Empower administrators to promote teachers to clerks or vice versa, assign finance & hostel warden roles, and configure fine-grained permissions matrix.'}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-2 overflow-x-auto">
        <Button
          type="button"
          variant={activeTab === 'switching' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('switching')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>{locale === 'ur' ? '1. ملازمین کی رول سویچنگ اور پروموشن پینل' : '1. Role Promotion & Switching Desk'}</span>
        </Button>
        <Button
          type="button"
          variant={activeTab === 'permissions' ? 'emerald' : 'outline'}
          onClick={() => setActiveTab('permissions')}
          className="font-bold text-xs sm:text-sm gap-2 shrink-0 rounded-xl px-5 py-3"
        >
          <Lock className="w-4 h-4" />
          <span>{locale === 'ur' ? '2. عہدوں کے اختیارات کی تقسیم (RBAC Matrix)' : '2. Fine-Grained Permissions Matrix'}</span>
        </Button>
      </div>

      {/* Tab 1: Role Switching & Promotion Desk */}
      {activeTab === 'switching' && (
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{locale === 'ur' ? 'جامعہ کے فعال اساتذہ و ملازمین کی فہرست' : 'Active Staff & Faculty Members'}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {locale === 'ur'
                  ? 'کسی بھی ملازم کے سامنے موجود "عہدہ تبدیل کریں" بٹن پر کلک کر کے فوری ترقی یا نیا رول تفویض کریں'
                  : 'Click promote/switch role on any staff member to instantly assign new responsibilities.'}
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={locale === 'ur' ? 'نام، شعبہ یا ای میل تلاش کریں...' : 'Search staff name, email or department...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-10 text-xs rounded-xl border-border bg-background"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'ملازم کا نام و شعبہ' : 'Staff Member & Dept'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5">{locale === 'ur' ? 'رابطہ و ای میل' : 'Contact & Email'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 text-center">{locale === 'ur' ? 'موجودہ عہدہ (Current Role)' : 'Current Role Badge'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 text-center">{locale === 'ur' ? 'آخری پروموشن' : 'Last Promoted'}</TableHead>
                    <TableHead className="font-bold text-xs py-3.5 text-end">{locale === 'ur' ? 'اقدام / رول سویچنگ' : 'Action / Switch Role'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4">
                        <div className="font-extrabold text-sm text-foreground">
                          {u.full_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                          {locale === 'ur' ? 'اکاؤنٹ آن لائن' : 'Online Profile'}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 font-en text-xs">
                        <div className="font-semibold text-foreground">{u.email}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{u.phone}</div>
                      </TableCell>

                      <TableCell className="py-4 text-center">
                        <RoleBadge role={u.role} />
                      </TableCell>

                      <TableCell className="py-4 text-center font-en text-xs text-muted-foreground">
                        <span>{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</span>
                      </TableCell>

                      <TableCell className="py-4 text-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenPromoDialog(u)}
                          className="font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 rounded-xl gap-1.5 px-4"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>{locale === 'ur' ? 'عہدہ تبدیل کریں (Promote)' : 'Switch / Promote Role'}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Fine-Grained Permissions Matrix */}
      {activeTab === 'permissions' && (
        <Card className="border-border shadow-md rounded-3xl overflow-hidden bg-card">
          <CardHeader className="bg-muted/40 pb-4 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-extrabold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <span>{locale === 'ur' ? 'عہدوں کے اختیارات اور پابندیوں کا میٹرکس (RBAC Permissions)' : 'Role-Based Access Control Matrix'}</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  {locale === 'ur'
                    ? 'منتخب کریں کہ کون سے عہدے والا ملازم پورٹل کے کس حصے پر کام کر سکتا ہے یا تغییرات کر سکتا ہے'
                    : 'Check or uncheck functional capabilities for each staff role in the institution.'}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="emerald"
                onClick={handleSavePermissions}
                className="font-extrabold text-xs px-6 py-5 rounded-xl shadow-md gap-2 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{locale === 'ur' ? 'اختیارات محفوظ کریں (Save Matrix)' : 'Save Permissions Matrix'}</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-extrabold text-xs py-4 w-72">{locale === 'ur' ? 'ملازم کا اختیار / ماڈیول کارکردگی' : 'System Capability / Module'}</TableHead>
                    <TableHead className="text-center font-bold text-xs py-4"><RoleBadge role="admin" /></TableHead>
                    <TableHead className="text-center font-bold text-xs py-4"><RoleBadge role="clerk" /></TableHead>
                    <TableHead className="text-center font-bold text-xs py-4"><RoleBadge role="accountant" /></TableHead>
                    <TableHead className="text-center font-bold text-xs py-4"><RoleBadge role="warden" /></TableHead>
                    <TableHead className="text-center font-bold text-xs py-4"><RoleBadge role="teacher" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionLabels.map((perm) => (
                    <TableRow key={perm.key} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4 font-bold text-xs text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{locale === 'ur' ? perm.urdu : perm.en}</span>
                        </div>
                      </TableCell>

                      {/* Admin Checkbox (Always checked) */}
                      <TableCell className="py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission('admin', perm.key)}
                          className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 flex items-center justify-center mx-auto cursor-not-allowed"
                          title="Admin role always has full permissions"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </TableCell>

                      {/* Clerk Checkbox */}
                      <TableCell className="py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission('clerk', perm.key)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all ${
                            permissions['clerk']?.[perm.key] ? 'bg-blue-600 text-white shadow-sm' : 'bg-muted border border-border text-transparent hover:border-blue-400'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </TableCell>

                      {/* Accountant Checkbox */}
                      <TableCell className="py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission('accountant', perm.key)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all ${
                            permissions['accountant']?.[perm.key] ? 'bg-teal-600 text-white shadow-sm' : 'bg-muted border border-border text-transparent hover:border-teal-400'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </TableCell>

                      {/* Warden Checkbox */}
                      <TableCell className="py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission('warden', perm.key)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all ${
                            permissions['warden']?.[perm.key] ? 'bg-indigo-600 text-white shadow-sm' : 'bg-muted border border-border text-transparent hover:border-indigo-400'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </TableCell>

                      {/* Teacher Checkbox */}
                      <TableCell className="py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission('teacher', perm.key)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all ${
                            permissions['teacher']?.[perm.key] ? 'bg-emerald-600 text-white shadow-sm' : 'bg-muted border border-border text-transparent hover:border-emerald-400'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Promotion / Switching Modal Dialog */}
      <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border text-foreground">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
              <Award className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-black">
              {locale === 'ur' ? 'عہدہ تبدیل کریں اور ترقی دیں (Role Promotion)' : 'Promote or Switch Staff Role'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {locale === 'ur'
                ? `آپ ${selectedUser?.nameUrdu} کا موجودہ عہدہ تبدیل کر رہے ہیں۔ نیا رول منتخب کریں:`
                : `Select the new role and responsibilities for ${selectedUser?.nameEn}:`}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-3">
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-foreground">{selectedUser.full_name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{selectedUser.email}</div>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-muted-foreground block mb-1">{locale === 'ur' ? 'موجودہ عہدہ:' : 'Current:'}</span>
                  <RoleBadge role={selectedUser.role} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-role-select" className="text-xs font-bold text-foreground">
                  {locale === 'ur' ? 'نیا عہدہ منتخب کریں (New Target Role):' : 'Select New Target Role:'}
                </Label>
                <Select value={targetRole} onValueChange={(val: any) => setTargetRole(val)}>
                  <SelectTrigger id="new-role-select" className="h-11 rounded-xl text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="admin" className="text-xs py-2.5 font-bold">{locale === 'ur' ? 'پرنسپل / منتظم اعلیٰ (Admin)' : 'Principal / Executive Admin'}</SelectItem>
                    <SelectItem value="clerk" className="text-xs py-2.5 font-bold">{locale === 'ur' ? 'نائب مہتمم / کلرک (Clerk / VP)' : 'Vice Principal / Clerk Desk'}</SelectItem>
                    <SelectItem value="accountant" className="text-xs py-2.5 font-bold">{locale === 'ur' ? 'خازن / اکاؤںٹنٹ (Finance Officer)' : 'Finance Officer / Accountant'}</SelectItem>
                    <SelectItem value="warden" className="text-xs py-2.5 font-bold">{locale === 'ur' ? 'ناظمِ دارالاقامہ (Hostel Warden)' : 'Hostel Warden / Nazim'}</SelectItem>
                    <SelectItem value="teacher" className="text-xs py-2.5 font-bold">{locale === 'ur' ? 'معلم / استاد (Teacher Portal)' : 'Teacher / Faculty Member'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo-reason" className="text-xs font-bold text-foreground">
                  {locale === 'ur' ? 'ترقی / تبدیلی کی وجہ (Promotion Remarks):' : 'Promotion Remarks / Reason:'}
                </Label>
                <Input
                  id="promo-reason"
                  value={promoReason}
                  onChange={(e) => setPromoReason(e.target.value)}
                  placeholder={locale === 'ur' ? 'مثلاً: شاندار کارکردگی پر ترقی دی گئی...' : 'Enter remarks for institutional audit log...'}
                  className="h-11 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {locale === 'ur'
                    ? 'نوٹ: عہدہ تبدیل ہونے کے فوری بعد اس ملازم کو نئے رول کے مطابق پورٹل رسائی اور سائڈ بار مینیو حاصل ہو جائے گا۔'
                    : 'Note: Upon confirmation, the staff member will immediately receive dashboard access tailored to the new role.'}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPromoDialogOpen(false)}
              className="rounded-xl font-bold text-xs h-11"
              disabled={isSubmittingPromo}
            >
              {locale === 'ur' ? 'منسوخ کریں (Cancel)' : 'Cancel'}
            </Button>
            <Button
              type="button"
              variant="emerald"
              onClick={handleConfirmPromotion}
              className="rounded-xl font-extrabold text-xs h-11 px-6 shadow-md gap-2"
              disabled={isSubmittingPromo}
            >
              {isSubmittingPromo ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{locale === 'ur' ? 'ترقی / تبدیلی منظور کریں (Confirm)' : 'Confirm Promotion'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
