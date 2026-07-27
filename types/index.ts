import { 
  Database, UserRole, GenderType, StudentStatus, LevelType, SubjectType, ShiftType, AttendanceStatus,
  FeeType, PaymentMethod, ExpenseCategory, InvoiceStatus,
  ExamType, GradeLevel, StaffDepartment, EmpStatus 
} from './database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type AcademicYear = Database['public']['Tables']['academic_years']['Row'];
export type ClassItem = Database['public']['Tables']['classes']['Row'];
export type SectionItem = Database['public']['Tables']['sections']['Row'];
export type SubjectItem = Database['public']['Tables']['subjects']['Row'];
export type ClassSubjectItem = Database['public']['Tables']['class_subjects']['Row'];
export type Student = Database['public']['Tables']['students']['Row'];
export type StudentPromotion = Database['public']['Tables']['student_promotions_history']['Row'];
export type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row'];

export type FeeStructure = Database['public']['Tables']['fee_structures']['Row'];
export type FeeInvoice = Database['public']['Tables']['fee_invoices']['Row'];
export type FeeReceipt = Database['public']['Tables']['fee_receipts']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];

export type Exam = Database['public']['Tables']['exams']['Row'];
export type ExamResult = Database['public']['Tables']['exam_results']['Row'];

export type StaffMember = Database['public']['Tables']['staff_members']['Row'];
export type PayrollRecord = Database['public']['Tables']['payroll_records']['Row'];

export type StudentWithClass = Student & {
  classes: Pick<ClassItem, 'name' | 'section'> | null;
};

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
};

export { 
  type UserRole, type GenderType, type StudentStatus, type LevelType, type SubjectType, type ShiftType, type AttendanceStatus,
  type FeeType, type PaymentMethod, type ExpenseCategory, type InvoiceStatus,
  type ExamType, type GradeLevel, type StaffDepartment, type EmpStatus 
};




