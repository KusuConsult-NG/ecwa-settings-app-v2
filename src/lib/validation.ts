import { z } from 'zod'

// Common validation patterns
const emailSchema = z.string()
  .email("Invalid email format")
  .toLowerCase()
  .min(5, "Email must be at least 5 characters")
  .max(255, "Email must be less than 255 characters")

const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password must be less than 128 characters")

const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z0-9\s'-]+$/, "Name can only contain letters, numbers, spaces, hyphens, and apostrophes")

const organizationSchema = z.string()
  .min(2, "Organization name must be at least 2 characters")
  .max(200, "Organization name must be less than 200 characters")
  .regex(/^[a-zA-Z0-9\s&.,'-]+$/, "Organization name contains invalid characters")

const phoneSchema = z.string()
  .min(1, "Phone number is required")
  .regex(/^[\+]?[\d\s\-\(\)]{7,20}$/, "Invalid phone number format")

const addressSchema = z.string()
  .min(10, "Address must be at least 10 characters")
  .max(500, "Address must be less than 500 characters")

// User validation schemas
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: phoneSchema,
  address: addressSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
})

export const emailVerificationSchema = z.object({
  email: emailSchema,
  code: z.string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers")
})

export const resendVerificationSchema = z.object({
  email: emailSchema
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema
})

export const passwordResetSchema = z.object({
  email: emailSchema,
  code: z.string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only numbers"),
  newPassword: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

// Profile update schema
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema,
  address: addressSchema,
  organization: organizationSchema.optional()
})

// Expenditure schemas
export const expenditureSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  amount: z.number()
    .positive("Amount must be positive")
    .max(1000000, "Amount must be less than 1,000,000"),
  category: z.enum([
    'Ministry', 'Facilities', 'Outreach', 'Administration', 
    'Events', 'Technology', 'Maintenance', 'Other'
  ]),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  receipt: z.string().url("Invalid receipt URL").optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional()
})

// Income schemas
export const incomeSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  amount: z.number()
    .positive("Amount must be positive")
    .max(1000000, "Amount must be less than 1,000,000"),
  category: z.enum([
    'Offering', 'Tithe', 'Donation', 'Event', 'Fundraising', 
    'Investment', 'Grant', 'Other'
  ]),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  source: z.string()
    .min(2, "Source must be at least 2 characters")
    .max(100, "Source must be less than 100 characters"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional()
})

// Staff schemas
export const staffSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
  position: z.string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must be less than 100 characters"),
  department: z.enum([
    'Ministry', 'Administration', 'Finance', 'Outreach', 
    'Youth', 'Children', 'Music', 'Technical', 'Other'
  ]),
  salary: z.number()
    .positive("Salary must be positive")
    .max(100000, "Salary must be less than 100,000")
    .optional(),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  isActive: z.boolean().default(true)
})

// Event schemas
export const eventSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  time: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  location: z.string()
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must be less than 200 characters"),
  type: z.enum([
    'Service', 'Meeting', 'Conference', 'Outreach', 
    'Social', 'Training', 'Other'
  ]),
  capacity: z.number()
    .positive("Capacity must be positive")
    .max(10000, "Capacity must be less than 10,000")
    .optional(),
  isPublic: z.boolean().default(true)
})

// Report schemas
export const reportSchema = z.object({
  type: z.enum([
    'Financial', 'Attendance', 'Membership', 'Events', 
    'Ministry', 'Outreach', 'Custom'
  ]),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
  format: z.enum(['PDF', 'Excel', 'CSV']).default('PDF'),
  includeCharts: z.boolean().default(true)
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "Start date must be before or equal to end date",
  path: ["endDate"]
})

// Type inference for TypeScript
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type ExpenditureInput = z.infer<typeof expenditureSchema>
export type IncomeInput = z.infer<typeof incomeSchema>
export type StaffInput = z.infer<typeof staffSchema>
export type EventInput = z.infer<typeof eventSchema>
export type ReportInput = z.infer<typeof reportSchema>

// Validation helper functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Array<{ field: string; message: string }>
} {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return {
    success: false,
    errors: result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }))
  }
}

// Sanitize input data
export function sanitizeInput<T>(data: T): T {
  if (typeof data === 'string') {
    return data.trim() as T
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data } as any
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitized[key].trim()
      }
    }
    return sanitized
  }
  
  return data
}
