export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'clerk' | 'teacher' | 'student' | 'parent' | 'accountant' | 'warden';
export type GenderType = 'male' | 'female' | 'other';
export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'suspended' | 'inactive';
export type LevelType = 'school' | 'hifz' | 'dars_nizami' | 'hifz_nazra' | 'tajweed' | 'balighan' | 'takhassusat';
export type SubjectType = 'compulsory' | 'elective' | 'islamic' | 'vocational';
export type ShiftType = 'morning' | 'afternoon' | 'evening';
export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'late';
export type FeeType = 'tuition' | 'admission' | 'exam' | 'boarding' | 'transport' | 'other';
export type PaymentMethod = 'cash' | 'bank' | 'jazzcash' | 'easypaisa' | 'cheque';
export type ExpenseCategory = 'salary' | 'utility' | 'food_mess' | 'maintenance' | 'stationary' | 'other';
export type InvoiceStatus = 'paid' | 'unpaid' | 'partial' | 'waived';
export type ExamType = 'mid_term' | 'annual' | 'monthly' | 'board_trial';
export type GradeLevel = 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbool' | 'rasib';
export type StaffDepartment = 'hifz_nazra' | 'tajweed' | 'balighan' | 'dars_nizami' | 'takhassusat' | 'school' | 'admin' | 'support';
export type EmpStatus = 'active' | 'on_leave' | 'resigned' | 'terminated';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: UserRole
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: UserRole
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      academic_years: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          is_current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          is_current?: boolean
          created_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name_ur: string
          name_en: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_ur: string
          name_en: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_ur?: string
          name_en?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          name_ur?: string
          name_en?: string
          level_type?: LevelType
          section: string | null
          capacity: number
          description: string | null
          department_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ur?: string
          name_en?: string
          level_type?: LevelType
          section?: string | null
          capacity?: number
          description?: string | null
          department_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ur?: string
          name_en?: string
          level_type?: LevelType
          section?: string | null
          capacity?: number
          description?: string | null
          department_id?: string | null
          created_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          class_id: string
          name_ur: string
          name_en: string
          room_number: string | null
          shift: ShiftType
          capacity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          name_ur: string
          name_en: string
          room_number?: string | null
          shift?: ShiftType
          capacity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          name_ur?: string
          name_en?: string
          room_number?: string | null
          shift?: ShiftType
          capacity?: number
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name_ur: string
          name_en: string
          code: string
          subject_type: SubjectType
          total_marks: number
          passing_marks: number
          created_at: string
        }
        Insert: {
          id?: string
          name_ur: string
          name_en: string
          code: string
          subject_type?: SubjectType
          total_marks?: number
          passing_marks?: number
          created_at?: string
        }
        Update: {
          id?: string
          name_ur?: string
          name_en?: string
          code?: string
          subject_type?: SubjectType
          total_marks?: number
          passing_marks?: number
          created_at?: string
        }
      }
      class_subjects: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          teacher_id: string | null
          section_id: string | null
          credit_hours: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          teacher_id?: string | null
          section_id?: string | null
          credit_hours?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string | null
          section_id?: string | null
          credit_hours?: number | null
          created_at?: string | null
        }
      }
      students: {
        Row: {
          id: string
          registration_id: string
          first_name: string
          last_name: string | null
          gender: GenderType
          date_of_birth: string | null
          photo_url: string | null
          current_class_id: string | null
          section_id: string | null
          admission_date: string
          status: StudentStatus
          father_name: string
          father_phone: string
          father_cnic_or_id: string | null
          mother_name: string | null
          guardian_email: string | null
          emergency_contact: string | null
          residential_address: string | null
          previous_school: string | null
          previous_grade: string | null
          medical_history: string | null
          general_notes: string | null
          first_name_en: string | null
          last_name_en: string | null
          father_name_en: string | null
          student_cnic: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registration_id?: string
          first_name: string
          last_name?: string | null
          gender: GenderType
          date_of_birth?: string | null
          photo_url?: string | null
          current_class_id?: string | null
          section_id?: string | null
          admission_date?: string
          status?: StudentStatus
          father_name: string
          father_phone: string
          father_cnic_or_id?: string | null
          mother_name?: string | null
          guardian_email?: string | null
          emergency_contact?: string | null
          residential_address?: string | null
          previous_school?: string | null
          previous_grade?: string | null
          medical_history?: string | null
          general_notes?: string | null
          first_name_en?: string | null
          last_name_en?: string | null
          father_name_en?: string | null
          student_cnic?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          first_name?: string
          last_name?: string | null
          gender?: GenderType
          date_of_birth?: string | null
          photo_url?: string | null
          current_class_id?: string | null
          section_id?: string | null
          admission_date?: string
          status?: StudentStatus
          father_name?: string
          father_phone?: string
          father_cnic_or_id?: string | null
          mother_name?: string | null
          guardian_email?: string | null
          emergency_contact?: string | null
          residential_address?: string | null
          previous_school?: string | null
          previous_grade?: string | null
          medical_history?: string | null
          general_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_promotions_history: {
        Row: {
          id: string
          student_id: string
          from_class_id: string | null
          to_class_id: string
          academic_year_id: string | null
          promoted_at: string
          promoted_by: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          from_class_id?: string | null
          to_class_id: string
          academic_year_id?: string | null
          promoted_at?: string
          promoted_by?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          from_class_id?: string | null
          to_class_id?: string
          academic_year_id?: string | null
          promoted_at?: string
          promoted_by?: string | null
          remarks?: string | null
          created_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          student_id: string
          class_id: string
          section_id: string | null
          date: string
          status: AttendanceStatus
          marked_by: string | null
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          class_id: string
          section_id?: string | null
          date?: string
          status?: AttendanceStatus
          marked_by?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string
          section_id?: string | null
          date?: string
          status?: AttendanceStatus
          marked_by?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fee_structures: {
        Row: {
          id: string
          class_id: string
          title_ur: string
          title_en: string
          amount: number
          fee_type: FeeType
          is_mandatory: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          title_ur: string
          title_en: string
          amount?: number
          fee_type?: FeeType
          is_mandatory?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          title_ur?: string
          title_en?: string
          amount?: number
          fee_type?: FeeType
          is_mandatory?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      fee_invoices: {
        Row: {
          id: string
          invoice_no: string
          student_id: string
          class_id: string
          billing_month: string
          total_amount: number
          paid_amount: number
          discount_amount: number
          status: InvoiceStatus
          due_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_no: string
          student_id: string
          class_id: string
          billing_month: string
          total_amount?: number
          paid_amount?: number
          discount_amount?: number
          status?: InvoiceStatus
          due_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_no?: string
          student_id?: string
          class_id?: string
          billing_month?: string
          total_amount?: number
          paid_amount?: number
          discount_amount?: number
          status?: InvoiceStatus
          due_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      fee_receipts: {
        Row: {
          id: string
          receipt_no: string
          invoice_id: string | null
          student_id: string
          amount_paid: number
          discount_given: number
          payment_method: PaymentMethod
          collector_id: string | null
          remarks: string | null
          payment_date: string
          created_at: string
        }
        Insert: {
          id?: string
          receipt_no: string
          invoice_id?: string | null
          student_id: string
          amount_paid: number
          discount_given?: number
          payment_method?: PaymentMethod
          collector_id?: string | null
          remarks?: string | null
          payment_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          receipt_no?: string
          invoice_id?: string | null
          student_id?: string
          amount_paid?: number
          discount_given?: number
          payment_method?: PaymentMethod
          collector_id?: string | null
          remarks?: string | null
          payment_date?: string
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          title_ur: string
          title_en: string
          amount: number
          category: ExpenseCategory
          expense_date: string
          recorded_by: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title_ur: string
          title_en: string
          amount: number
          category?: ExpenseCategory
          expense_date?: string
          recorded_by?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title_ur?: string
          title_en?: string
          amount?: number
          category?: ExpenseCategory
          expense_date?: string
          recorded_by?: string | null
          remarks?: string | null
          created_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          title_ur: string
          title_en: string
          exam_type: ExamType
          academic_year_id: string | null
          start_date: string
          end_date: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_ur: string
          title_en: string
          exam_type?: ExamType
          academic_year_id?: string | null
          start_date?: string
          end_date?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_ur?: string
          title_en?: string
          exam_type?: ExamType
          academic_year_id?: string | null
          start_date?: string
          end_date?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exam_results: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          class_id: string
          subject_id: string
          total_marks: number
          obtained_marks: number
          grade: GradeLevel
          remarks: string | null
          marked_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          class_id: string
          subject_id: string
          total_marks?: number
          obtained_marks?: number
          grade?: GradeLevel
          remarks?: string | null
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          class_id?: string
          subject_id?: string
          total_marks?: number
          obtained_marks?: number
          grade?: GradeLevel
          remarks?: string | null
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      staff_members: {
        Row: {
          id: string
          emp_id: string
          full_name_ur: string
          full_name_en: string
          father_name_ur: string | null
          father_name_en: string | null
          cnic: string | null
          phone: string
          gender: GenderType
          qualification: string
          designation_ur: string
          designation_en: string
          department: StaffDepartment
          basic_salary: number
          join_date: string
          status: EmpStatus
          address: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          emp_id: string
          full_name_ur: string
          full_name_en: string
          father_name_ur?: string | null
          father_name_en?: string | null
          cnic?: string | null
          phone: string
          gender?: GenderType
          qualification: string
          designation_ur: string
          designation_en: string
          department?: StaffDepartment
          basic_salary?: number
          join_date?: string
          status?: EmpStatus
          address?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          emp_id?: string
          full_name_ur?: string
          full_name_en?: string
          father_name_ur?: string | null
          father_name_en?: string | null
          cnic?: string | null
          phone?: string
          gender?: GenderType
          qualification?: string
          designation_ur?: string
          designation_en?: string
          department?: StaffDepartment
          basic_salary?: number
          join_date?: string
          status?: EmpStatus
          address?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payroll_records: {
        Row: {
          id: string
          staff_id: string
          salary_month: string
          basic_amount: number
          bonus_amount: number
          deduction_amount: number
          net_paid: number
          payment_method: PaymentMethod
          payment_date: string
          reference_no: string
          paid_by: string | null
          remarks: string | null
          created_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          salary_month: string
          basic_amount: number
          bonus_amount?: number
          deduction_amount?: number
          net_paid: number
          payment_method?: PaymentMethod
          payment_date?: string
          reference_no: string
          paid_by?: string | null
          remarks?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          salary_month?: string
          basic_amount?: number
          bonus_amount?: number
          deduction_amount?: number
          net_paid?: number
          payment_method?: PaymentMethod
          payment_date?: string
          reference_no?: string
          paid_by?: string | null
          remarks?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_or_clerk: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      gender_type: GenderType
      student_status: StudentStatus
      attendance_status: AttendanceStatus
      fee_type: FeeType
      payment_method: PaymentMethod
      expense_category: ExpenseCategory
      invoice_status: InvoiceStatus
      exam_type: ExamType
      grade_level: GradeLevel
      staff_department: StaffDepartment
      emp_status: EmpStatus
    }
  }
}

