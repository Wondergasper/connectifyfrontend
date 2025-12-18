// src/lib/validationSchemas.ts
import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Profile validation schema
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
});

// Service validation schema
export const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
});

// Booking validation schema
export const bookingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),
});

// Review validation schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must be less than 500 characters'),
});

// Wallet validation schema
export const addFundsSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type AddFundsInput = z.infer<typeof addFundsSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;