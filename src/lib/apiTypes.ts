export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
}

export interface ApiErrorResponse {
  success?: boolean;
  error?: string;
  message?: string;
  errors?: unknown;
  statusCode?: number;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: unknown;
  pagination?: Pagination;
  cache?: boolean;
  responseTimeMs?: number;
  count?: number;
  averageRating?: number;
  newerExists?: boolean;
  booking?: Booking;
  bookings?: Booking[];
  service?: Service;
  services?: Service[];
  review?: Review;
  reviews?: Review[];
  notification?: Notification;
  notifications?: Notification[];
  receipt?: Receipt;
  user?: User;
  token?: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'customer' | 'provider';
}

export interface LocationPoint {
  type?: string;
  coordinates?: [number, number];
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ProfilePortfolioItem {
  url: string;
  publicId?: string;
  uploadedAt?: string;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  location?: LocationPoint;
  verification?: {
    verified?: boolean;
    documents?: string[];
    verifiedAt?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  portfolio?: ProfilePortfolioItem[];
}

export interface ProviderDetails {
  category?: string;
  hourlyRate?: number;
  yearsOfExperience?: number;
  servicesOffered?: string[];
  portfolio?: string[];
  certifications?: string[];
  availability?: Record<string, { start?: string; end?: string; available?: boolean }>;
}

export interface RatingSummary {
  average?: number;
  count?: number;
}

export interface WalletSummary {
  balance?: number;
  currency?: string;
  transactions?: WalletTransaction[];
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'customer' | 'provider' | 'admin' | string;
  profile?: UserProfile;
  providerDetails?: ProviderDetails;
  rating?: RatingSummary;
  completedJobsCount?: number;
  wallet?: WalletSummary;
  isActive?: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  fcmToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  user: User;
}

export interface LoginResponse {
  user?: User;
  token?: string;
}

export interface ServiceSearchParams {
  search?: string;
  category?: string;
  location?: string;
}

export interface CreateServiceRequest {
  name: string;
  category: string;
  description: string;
  price: number;
  priceType?: 'fixed' | 'hourly' | 'negotiable';
  duration: number;
  images?: string[];
  location?: LocationPoint;
  servicesOffered?: string[];
  gallery?: string[];
  isActive?: boolean;
}

export interface Service {
  _id?: string;
  id?: string;
  name: string;
  provider?: string | User;
  category?: string;
  description?: string;
  price?: number;
  priceType?: 'fixed' | 'hourly' | 'negotiable' | string;
  duration?: number;
  images?: string[];
  location?: LocationPoint;
  rating?: RatingSummary;
  averageRating?: number;
  reviewCount?: number;
  servicesOffered?: string[];
  gallery?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  location?: LocationPoint;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'rescheduled'
  | string;

export interface Booking {
  _id?: string;
  id?: string;
  customer?: string | User;
  provider?: string | User;
  service?: string | Service;
  date: string;
  time: string;
  duration?: number;
  status?: BookingStatus;
  totalAmount?: number;
  currency?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded' | string;
  notes?: string;
  address?: BookingAddress;
  completedAt?: string;
  rating?: {
    value?: number;
    comment?: string;
    date?: string;
  };
  serviceImages?: string[];
  reminderSent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  service: string;
  providerId?: string;
  date: string;
  time: string;
  duration?: number;
  totalAmount?: number;
  notes?: string;
  address?: BookingAddress;
}

export interface WalletBalance {
  balance: number;
  currency?: string;
  availableBalance?: number;
  pendingBalance?: number;
}

export interface WalletTransaction {
  _id?: string;
  id?: string;
  type: 'credit' | 'debit' | string;
  amount: number;
  description?: string;
  title?: string;
  status?: string;
  date?: string;
  createdAt?: string;
  reference?: string;
  bookingId?: string;
}

export type Transaction = WalletTransaction;

export interface AddFundsRequest {
  amount: number;
  paymentMethod?: string;
  reference?: string;
  description?: string;
}

export interface NotificationDataMap {
  bookingId?: string;
  serviceId?: string;
  messageId?: string;
  [key: string]: unknown;
}

export interface Notification {
  _id?: string;
  id?: string;
  user?: string | User;
  title: string;
  message?: string;
  content?: string;
  type: 'booking' | 'payment' | 'review' | 'system' | 'message' | string;
  read?: boolean;
  readAt?: string;
  data?: NotificationDataMap;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageAttachment {
  url?: string;
  type?: string;
  size?: number;
  name?: string;
}

export interface MessageReaction {
  user?: string | User;
  emoji?: string;
  addedAt?: string;
}

export interface ConversationReadStatus {
  user?: string | User;
  lastReadMessage?: string | Message;
  lastReadAt?: string;
  unreadCount?: number;
}

export interface ConversationLastMessage {
  content?: string;
  type?: string;
  sender?: string | User;
  timestamp?: string;
}

export interface Conversation {
  _id?: string;
  id?: string;
  participants?: Array<string | User>;
  participantReadStatus?: ConversationReadStatus[];
  service?: string | Service;
  booking?: string | Booking;
  name?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  unreadCount?: number;
  type?: 'direct' | 'group' | string;
  membersCount?: number;
  lastMessage?: string | ConversationLastMessage;
  lastMessageAt?: string;
  isGroup?: boolean;
  groupInfo?: {
    name?: string;
    avatar?: string;
    description?: string;
    createdBy?: string | User;
    isPublic?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id?: string;
  id?: string;
  conversation?: string | Conversation;
  sender?: string | User;
  recipient?: string | User;
  content: string;
  contentType?: 'text' | 'image' | 'document' | 'location' | string;
  attachments?: MessageAttachment[];
  read?: boolean;
  readBy?: Array<{ user?: string | User; readAt?: string }>;
  delivered?: boolean;
  deliveredAt?: string;
  status?: 'sent' | 'delivered' | 'read' | string;
  repliedTo?: string | Message;
  reactions?: MessageReaction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  bookingId?: string | Booking | null;
}

export interface Availability {
  _id?: string;
  id?: string;
  provider?: string | User;
  providerId?: string;
  date: string;
  slots: AvailabilitySlot[];
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateAvailabilityRequest {
  date: string;
  slots?: AvailabilitySlot[];
  isAvailable?: boolean;
}

export interface Review {
  _id?: string;
  id?: string;
  customer?: string | User;
  provider?: string | User;
  booking?: string | Booking;
  service?: string | Service;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface VerificationRequest {
  _id?: string;
  id?: string;
  user?: string | User;
  documentType?: string;
  documentNumber?: string;
  documentFront?: string;
  documentBack?: string;
  status?: string;
  verifiedBy?: string | User;
  verificationDate?: string;
  rejectionReason?: string;
  additionalInfo?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Receipt {
  _id?: string;
  id?: string;
  booking?: Booking;
  provider?: User;
  service?: Service;
  transactionId?: string;
  paymentMethod?: string;
  totalAmount?: number;
  serviceFee?: number;
  platformFee?: number;
  currency?: string;
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
