// src/lib/apiTypes.ts - API response and error types

// User related types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  location?: {
    address: string;
    coordinates?: [number, number];
  };
  verification?: {
    verified: boolean;
    status?: string;
    documents?: string[];
  };
  image?: string;
}

// Generic API response type
// Generic API response type
export type ApiResponse<T = unknown> = T & {
  message?: string;
  success?: boolean;
  // Some endpoints might still return 'data' explicitly, which would be part of T
};

// Error response type
export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

// Authentication related types
export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserProfileResponse {
  user: User;
}

// Services related types
export interface ServiceSearchParams {
  search?: string;
  category?: string;
  location?: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  provider: User | string; // Can be user object or just ID
  price: number;
  priceType?: 'hourly' | 'fixed';
  duration?: number; // in minutes
  rating?: number;
  reviewCount?: number;
  images?: string[];
  location?: {
    address: string;
    coordinates?: [number, number];
  };
  averageRating?: number;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  priceType?: 'hourly' | 'fixed';
  duration?: number;
  images?: string[];
  location?: {
    address: string;
    coordinates?: [number, number];
  };
}

// Booking related types
export interface Booking {
  _id: string;
  service: string | Service; // Can be service ID or service object
  customer: string | User; // Can be user ID or user object
  provider: string | User; // Can be user ID or user object
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'done';
  totalAmount: number;
  notes?: string;
  rating?: {
    value: number;
    comment?: string;
  };
  address?: {
    address: string;
    coordinates?: [number, number];
  };
}

export interface CreateBookingRequest {
  service: string;
  date: string;
  time: string;
  totalAmount: number;
  notes?: string;
  address?: {
    address: string;
    coordinates?: [number, number];
  };
}

// Wallet related types
export interface WalletBalance {
  balance: number;
  currency: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
}

export interface AddFundsRequest {
  amount: number;
  paymentMethod: string;
}

// Category related types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Availability related types
export interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  bookingId?: string;
}

export interface Availability {
  providerId: string;
  slots: AvailabilitySlot[];
}

export interface UpdateAvailabilityRequest {
  providerId: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  available: boolean;
  bookingId?: string;
}

// Notification related types
export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// Message related types
export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  read: boolean;
  createdAt: string;
}

// Review related types
export interface Review {
  _id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment: string;
}

// Verification related types
export interface VerificationRequest {
  userId: string;
  documents: string[];
  type: string;
  status: string;
  reason?: string;
}

// Receipt related types
export interface Receipt {
  _id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  amount: number;
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  tax?: number;
  total: number;
  createdAt: string;
}