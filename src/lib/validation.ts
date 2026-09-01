import { z } from 'zod';

const phone = z
  .string()
  .trim()
  .min(7, 'Please enter a valid phone number')
  .max(20)
  .regex(/^[+\d][\d\s()-]*$/, 'Please enter a valid phone number');

const email = z
  .string()
  .trim()
  .email('Please enter a valid email address')
  .or(z.literal(''));

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: phone,
  email: email,
  contactMethod: z.string(),
  inquiryType: z.string(),
  viewingDate: z.string().optional(),
  message: z.string().trim().min(5, 'Please add a short message').max(2000),
});

export const findPropertySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: phone,
  email: email,
  currentCountry: z.string().trim().optional(),
  preferredLocation: z.string().trim().optional(),
  listingPurpose: z.string(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  budget: z.string().optional(),
  budgetFrequency: z.string().optional(),
  purpose: z.string().optional(),
  preferredStatus: z.string().optional(),
  furnishStatus: z.string().optional(),
  moveInDate: z.string().optional(),
  requirements: z.string().trim().max(2000).optional(),
});

export const findRentalSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: phone,
  email: email,
  preferredLocation: z.string().trim().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  budget: z.string().optional(),
  furnishStatus: z.string().optional(),
  moveInDate: z.string().optional(),
  rentalDuration: z.string().optional(),
  employmentInfo: z.string().trim().max(1000).optional(),
  requirements: z.string().trim().max(2000).optional(),
});

export const ownerSubmissionSchema = z.object({
  ownerName: z.string().trim().min(2, 'Please enter your name'),
  phone: phone,
  email: email,
  location: z.string().trim().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  askingPrice: z.string().optional(),
  rentalPrice: z.string().optional(),
  furnishStatus: z.string().optional(),
  availability: z.string().optional(),
  description: z.string().trim().min(10, 'Please describe your property briefly').max(3000),
  serviceType: z.string().optional(),
  contactMethod: z.string().optional(),
});

export const propertyManagementSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: phone,
  email: email,
  propertyLocation: z.string().trim().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  rentalPrice: z.string().optional(),
  furnishStatus: z.string().optional(),
  availability: z.string().optional(),
  serviceType: z.string().optional(),
  message: z.string().trim().max(2000).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: phone,
  email: email,
  subject: z.string().trim().optional(),
  inquiryType: z.string().optional(),
  message: z.string().trim().min(5, 'Please add a message').max(2000),
});

export const rentalApplicationSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: phone,
  email: email,
  currentAddress: z.string().trim().optional(),
  moveInDate: z.string().optional(),
  leaseDuration: z.string().optional(),
  employmentStatus: z.string().optional(),
  employer: z.string().trim().optional(),
  incomeRange: z.string().optional(),
  occupants: z.string().optional(),
  references: z.string().trim().optional(),
  additionalInfo: z.string().trim().max(2000).optional(),
});

export const viewStatusSchema = z.object({
  viewingId: z.string(),
  status: z.enum(['REQUESTED', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'RESCHEDULED', 'CANCELLED', 'NO_SHOW']),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type FindPropertyInput = z.infer<typeof findPropertySchema>;
export type FindRentalInput = z.infer<typeof findRentalSchema>;
export type OwnerSubmissionInput = z.infer<typeof ownerSubmissionSchema>;
export type PropertyManagementInput = z.infer<typeof propertyManagementSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type RentalApplicationInput = z.infer<typeof rentalApplicationSchema>;
export type ViewStatusInput = z.infer<typeof viewStatusSchema>;
