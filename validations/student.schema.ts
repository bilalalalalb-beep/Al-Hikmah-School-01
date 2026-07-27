import { z } from 'zod';

export const studentAdmissionSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().optional(),
  gender: z.enum(['male', 'female', 'other'], { message: 'Please select gender' }),
  dateOfBirth: z.string().optional(),
  classId: z.string().min(1, 'Please assign a class / grade'),
  fatherName: z.string().min(2, "Father / Guardian's name is required"),
  fatherPhone: z.string().min(10, 'Valid contact number is required'),
  fatherCnic: z.string().optional(),
  motherName: z.string().optional(),
  guardianEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  emergencyContact: z.string().optional(),
  residentialAddress: z.string().optional(),
  previousSchool: z.string().optional(),
  previousGrade: z.string().optional(),
  medicalHistory: z.string().optional(),
  isOrphan: z.boolean().optional().default(false),
  isZakatEligible: z.boolean().optional().default(false),
  bloodGroup: z.string().optional(),
  bFormNumber: z.string().optional(),
  generalNotes: z.string().optional(),
});

export type StudentAdmissionFormValues = z.infer<typeof studentAdmissionSchema>;
