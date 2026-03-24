// src/lib/api.ts
import {
  ApiResponse,
  ApiErrorResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserProfileResponse,
  Service,
  ServiceSearchParams,
  CreateServiceRequest,
  Booking,
  CreateBookingRequest,
  WalletBalance,
  Transaction,
  AddFundsRequest,
  Notification,
  Conversation,
  Message,
  Availability,
  UpdateAvailabilityRequest,
  Review,
  CreateReviewRequest,
  VerificationRequest,
  Receipt,
  Category,
  User,
} from './apiTypes';

// Use /api in development to leverage Vite proxy
// In production, VITE_API_URL should be the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    const maxRetries = 3;
    let attempt = 0;

    try {
      while (true) {
        attempt++;
        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        // 429 Rate-limit — retry with backoff
        if (response.status === 429) {
          if (attempt >= maxRetries) {
            throw new Error('Too many requests. Please try again in a few moments.');
          }
          const retryAfter = response.headers.get('Retry-After');
          const waitMs = Math.min(retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000, 5000);
          console.warn(`Rate limited on ${endpoint}. Retrying in ${waitMs / 1000}s (${attempt}/${maxRetries})...`);
          await new Promise(res => setTimeout(res, waitMs));
          continue;
        }

        // 401 — try token refresh, then retry
        if (response.status === 401) {
          console.log('Received 401, attempting token refresh...');
          const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          if (refreshResponse.ok) {
            console.log('Token refresh successful, retrying original request...');
            await new Promise(resolve => setTimeout(resolve, 100));
            const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, config);
            if (!retryResponse.ok) {
              const retryError = await retryResponse.json().catch(() => ({} as ApiErrorResponse));
              throw new Error(retryError.message || retryError.error || `Retry failed: ${retryResponse.status}`);
            }
            return await retryResponse.json();
          } else {
            const refreshError = await refreshResponse.json().catch(() => ({} as ApiErrorResponse));
            throw new Error(refreshError.message || refreshError.error || 'Session expired. Please log in again.');
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status}`,
            error: 'Network Error',
            statusCode: response.status,
          } as ApiErrorResponse));

          let errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
          if (response.status === 400) errorMessage = errorData.error || errorData.message || 'Invalid request. Please check your input.';
          else if (response.status === 403) errorMessage = errorData.error || errorData.message || 'Access forbidden.';
          else if (response.status === 404) errorMessage = errorData.error || errorData.message || 'Resource not found.';
          else if (response.status === 500) errorMessage = errorData.error || errorData.message || 'Server error. Please try again later.';

          throw new Error(errorMessage);
        }

        return await response.json();
      }
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error);
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  auth = {
    login: (credentials: LoginRequest) =>
      this.request<ApiResponse<LoginResponse>>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

    register: (userData: RegisterRequest) =>
      this.request<ApiResponse<UserProfileResponse>>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

    getProfile: () =>
      this.request<ApiResponse<UserProfileResponse>>('/auth/profile'),

    updateProfile: (profileData: Partial<User>) =>
      this.request<ApiResponse<UserProfileResponse>>('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

    logout: () =>
      this.request<ApiResponse<{ message: string }>>('/auth/logout', { method: 'POST' }),

    refreshToken: () =>
      this.request<ApiResponse<{ token: string }>>('/auth/refresh', { method: 'POST' }),

    forgotPassword: (email: string) =>
      this.request<ApiResponse<{ data: string }>>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

    resetPassword: (token: string, password: string) =>
      this.request<ApiResponse<{ data: string }>>(`/auth/reset-password/${token}`, { method: 'PUT', body: JSON.stringify({ password }) }),
  };

  // ── Users ─────────────────────────────────────────────────────────────────
  users = {
    get: (userId: string) => this.request<ApiResponse<User>>(`/users/${userId}`),
    getAll: () => this.request<ApiResponse<User[]>>('/users'),
    update: (userId: string, userData: Partial<User>) =>
      this.request<ApiResponse<User>>(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(userData) }),
  };

  // ── Services ──────────────────────────────────────────────────────────────
  services = {
    get: (params?: ServiceSearchParams) => {
      const qp = new URLSearchParams();
      if (params?.search) qp.append('search', params.search);
      if (params?.category) qp.append('category', params.category);
      const qs = qp.toString();
      return this.request<ApiResponse<{ data: Service[] }>>(qs ? `/services?${qs}` : '/services');
    },
    getById: (id: string) => this.request<ApiResponse<Service>>(`/services/${id}`),
    create: (serviceData: CreateServiceRequest) =>
      this.request<ApiResponse<Service>>('/services', { method: 'POST', body: JSON.stringify(serviceData) }),
    update: (id: string, serviceData: CreateServiceRequest) =>
      this.request<ApiResponse<Service>>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(serviceData) }),
    delete: (id: string) =>
      this.request<ApiResponse<{ message: string }>>(`/services/${id}`, { method: 'DELETE' }),
    search: (params?: ServiceSearchParams) => {
      const qp = new URLSearchParams();
      if (params?.search) qp.append('search', params.search);
      if (params?.category) qp.append('category', params.category);
      if (params?.location) qp.append('location', params.location);
      const qs = qp.toString();
      return this.request<ApiResponse<{ data: Service[] }>>(qs ? `/services/search?${qs}` : '/services/search');
    },
  };

  // ── Bookings ──────────────────────────────────────────────────────────────
  bookings = {
    get: (params?: { type?: string; status?: string }) => {
      const qp = new URLSearchParams();
      if (params?.type) qp.append('type', params.type);
      if (params?.status) qp.append('status', params.status);
      const qs = qp.toString();
      return this.request<ApiResponse<{ data: Booking[] }>>(qs ? `/bookings?${qs}` : '/bookings');
    },
    getById: (id: string) => this.request<ApiResponse<Booking>>(`/bookings/${id}`),
    create: (bookingData: CreateBookingRequest) =>
      this.request<ApiResponse<{ booking: Booking }>>('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
    update: (id: string, bookingData: Partial<Booking>) =>
      this.request<ApiResponse<Booking>>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(bookingData) }),
    addRating: (id: string, ratingData: { rating: number; comment?: string }) =>
      this.request<ApiResponse<Booking>>(`/bookings/${id}/rating`, { method: 'POST', body: JSON.stringify(ratingData) }),
  };

  // ── Wallet ────────────────────────────────────────────────────────────────
  wallet = {
    getBalance: () =>
      this.request<ApiResponse<WalletBalance>>('/wallet/balance'),

    getTransactions: (params?: { page?: number; limit?: number; type?: string }) => {
      const qp = new URLSearchParams();
      if (params?.page) qp.append('page', String(params.page));
      if (params?.limit) qp.append('limit', String(params.limit));
      if (params?.type) qp.append('type', params.type);
      const qs = qp.toString();
      return this.request<ApiResponse<Transaction[]>>(qs ? `/wallet/transactions?${qs}` : '/wallet/transactions');
    },

    processPayment: (paymentData: Record<string, unknown>) =>
      this.request<ApiResponse<{ success: boolean; transactionId: string }>>(
        '/wallet/process-payment', { method: 'POST', body: JSON.stringify(paymentData) }
      ),

    /** Legacy / test-mode only — redirects to initializePayment if Paystack is configured */
    addFunds: (fundsData: AddFundsRequest) =>
      this.request<ApiResponse<WalletBalance>>('/wallet/add-funds', { method: 'POST', body: JSON.stringify(fundsData) }),

    // ── Paystack ──

    /** Step 1: Get Paystack checkout URL to redirect user for payment */
    initializePayment: (amount: number) =>
      this.request<ApiResponse<{ authorizationUrl: string; accessCode: string; reference: string; amount: number }>>(
        '/wallet/initialize-payment',
        { method: 'POST', body: JSON.stringify({ amount }) }
      ),

    /** Step 2: Called after Paystack redirects back — verify & credit wallet */
    verifyPayment: (reference: string) =>
      this.request<ApiResponse<{ balance: number; currency: string; amountAdded: number }>>(
        '/wallet/verify-payment',
        { method: 'POST', body: JSON.stringify({ reference }) }
      ),

    /** Withdraw funds to a Nigerian bank account via Paystack Transfer */
    withdraw: (data: { amount: number; accountNumber: string; bankCode: string; accountName: string }) =>
      this.request<ApiResponse<{ reference: string; amount: number; newBalance: number; transferStatus: string }>>(
        '/wallet/withdraw',
        { method: 'POST', body: JSON.stringify(data) }
      ),

    /** List Nigerian banks (for withdrawal form selector) */
    getBanks: () =>
      this.request<ApiResponse<Array<{ id: number; name: string; code: string; longcode: string }>>>('/wallet/banks'),

    /** Verify a bank account number, returns accountName for confirmation */
    resolveAccount: (accountNumber: string, bankCode: string) =>
      this.request<ApiResponse<{ accountName: string; accountNumber: string; bankId: number }>>(
        '/wallet/resolve-account',
        { method: 'POST', body: JSON.stringify({ accountNumber, bankCode }) }
      ),
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications = {
    get: () => this.request<ApiResponse<Notification[]>>('/notifications'),
    markAsRead: (notificationId: string) =>
      this.request<ApiResponse<Notification>>(`/notifications/${notificationId}/read`, { method: 'PUT' }),
    markAllAsRead: () =>
      this.request<ApiResponse<{ message: string }>>('/notifications/read-all', { method: 'PUT' }),
    delete: (notificationId: string) =>
      this.request<ApiResponse<{ message: string }>>(`/notifications/${notificationId}`, { method: 'DELETE' }),
  };

  // ── Messages ──────────────────────────────────────────────────────────────
  messages = {
    getConversations: () => this.request<ApiResponse<Conversation[]>>('/messages/conversations'),
    getMessages: (conversationId: string) => this.request<ApiResponse<Message[]>>(`/messages/conversations/${conversationId}`),
    getMessagesWithUser: (userId: string) => this.request<ApiResponse<Message[]>>(`/messages/users/${userId}`),
    searchConversations: (search: string) => this.request<ApiResponse<Conversation[]>>(`/messages/search?search=${encodeURIComponent(search)}`),
    getUnreadCount: () => this.request<ApiResponse<{ count: number }>>('/messages/unread'),
    markConversationAsRead: (conversationId: string) =>
      this.request<ApiResponse<{ message: string }>>(`/messages/conversations/${conversationId}/read`, { method: 'PUT' }),
    createConversation: (conversationData: { recipientId: string; serviceId?: string; bookingId?: string }) =>
      this.request<ApiResponse<Conversation>>('/messages/conversations', { method: 'POST', body: JSON.stringify(conversationData) }),
    sendMessage: (messageData: { conversationId: string; content: string }) =>
      this.request<ApiResponse<Message>>('/messages', { method: 'POST', body: JSON.stringify(messageData) }),
  };

  // ── Availability ──────────────────────────────────────────────────────────
  availability = {
    get: (params: { providerId: string; date?: string }) => {
      const qp = new URLSearchParams();
      qp.append('providerId', params.providerId);
      if (params.date) qp.append('date', params.date);
      return this.request<ApiResponse<Availability>>(`/availability?${qp.toString()}`);
    },
    getRange: (params: { providerId: string; startDate?: string; endDate?: string }) => {
      const qp = new URLSearchParams();
      qp.append('providerId', params.providerId);
      if (params.startDate) qp.append('startDate', params.startDate);
      if (params.endDate) qp.append('endDate', params.endDate);
      return this.request<ApiResponse<Availability>>(`/availability/range?${qp.toString()}`);
    },
    update: (availabilityData: UpdateAvailabilityRequest) =>
      this.request<ApiResponse<Availability>>('/availability', { method: 'PUT', body: JSON.stringify(availabilityData) }),
    bookSlot: (slotData: { providerId: string; date: string; startTime: string; bookingId: string }) =>
      this.request<ApiResponse<Availability>>('/availability/book-slot', { method: 'PUT', body: JSON.stringify(slotData) }),
    unbookSlot: (slotData: { providerId: string; date: string; startTime: string; bookingId: string }) =>
      this.request<ApiResponse<Availability>>('/availability/unbook-slot', { method: 'PUT', body: JSON.stringify(slotData) }),
  };

  // ── Reviews ───────────────────────────────────────────────────────────────
  reviews = {
    create: (reviewData: CreateReviewRequest) =>
      this.request<ApiResponse<Review>>('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
    getByService: (serviceId: string) => this.request<ApiResponse<Review[]>>(`/reviews/service/${serviceId}`),
    getByProvider: (providerId: string) => this.request<ApiResponse<Review[]>>(`/reviews/provider/${providerId}`),
    getByUser: () => this.request<ApiResponse<Review[]>>('/reviews/user'),
    getById: (id: string) => this.request<ApiResponse<Review>>(`/reviews/${id}`),
  };

  // ── Verification ──────────────────────────────────────────────────────────
  verification = {
    submit: (verificationData: Partial<VerificationRequest>) =>
      this.request<ApiResponse<VerificationRequest>>('/verification', { method: 'POST', body: JSON.stringify(verificationData) }),
    getStatus: (userId?: string) => {
      const endpoint = userId ? `/verification/${userId}` : '/verification/status';
      return this.request<ApiResponse<VerificationRequest>>(endpoint);
    },
    getAll: (params?: { status?: string }) => {
      const endpoint = params?.status ? `/verification/requests?status=${params.status}` : '/verification/requests';
      return this.request<ApiResponse<VerificationRequest[]>>(endpoint);
    },
    approve: (id: string) =>
      this.request<ApiResponse<VerificationRequest>>(`/verification/${id}/approve`, { method: 'PUT' }),
    reject: (id: string, reason: string) =>
      this.request<ApiResponse<VerificationRequest>>(`/verification/${id}/reject`, { method: 'PUT', body: JSON.stringify({ reason }) }),
  };

  // ── Receipts ──────────────────────────────────────────────────────────────
  receipts = {
    get: (bookingId: string) => this.request<ApiResponse<Receipt>>(`/receipts/${bookingId}`),
    getDetails: (bookingId: string) => this.request<ApiResponse<Receipt>>(`/receipts/${bookingId}/details`),
    getPdf: async (bookingId: string) => {
      let response = await fetch(`${this.baseUrl}/receipts/${bookingId}/pdf`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshResponse.ok) {
          await new Promise(resolve => setTimeout(resolve, 100));
          response = await fetch(`${this.baseUrl}/receipts/${bookingId}/pdf`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!response.ok) {
            const errText = await response.clone().text();
            let msg = `Retry failed: ${response.status}`;
            try { msg = JSON.parse(errText).message || JSON.parse(errText).error || msg; } catch { msg = errText || msg; }
            throw new Error(msg);
          }
        } else {
          const errText = await refreshResponse.clone().text();
          let msg = 'Session expired. Please log in again.';
          try { msg = JSON.parse(errText).message || JSON.parse(errText).error || msg; } catch { msg = errText || msg; }
          throw new Error(msg);
        }
      }

      if (!response.ok) {
        let msg = `HTTP error! status: ${response.status}`;
        try {
          const txt = await response.clone().text();
          msg = JSON.parse(txt).message || JSON.parse(txt).error || txt || msg;
        } catch { /* use default msg */ }
        throw new Error(msg);
      }

      return await response.text();
    },
  };

  // ── Categories ────────────────────────────────────────────────────────────
  categories = {
    get: (params?: { isActive?: boolean }) => {
      const endpoint = params?.isActive !== undefined ? `/categories?isActive=${params.isActive}` : '/categories';
      return this.request<ApiResponse<Category[]>>(endpoint);
    },
    getById: (id: string) => this.request<ApiResponse<Category>>(`/categories/${id}`),
    create: (categoryData: Partial<Category>) =>
      this.request<ApiResponse<Category>>('/categories', { method: 'POST', body: JSON.stringify(categoryData) }),
    update: (id: string, categoryData: Partial<Category>) =>
      this.request<ApiResponse<Category>>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(categoryData) }),
    delete: (id: string) =>
      this.request<ApiResponse<{ message: string }>>(`/categories/${id}`, { method: 'DELETE' }),
  };

  // ── Images ────────────────────────────────────────────────────────────────
  images = {
    addServiceImages: (serviceId: string, imageUrls: string[]) =>
      this.request<ApiResponse<Service>>(`/images/services/${serviceId}`, { method: 'POST', body: JSON.stringify({ imageUrls }) }),
    removeServiceImage: (serviceId: string, imageUrl: string) =>
      this.request<ApiResponse<Service>>(`/images/services/${serviceId}`, { method: 'DELETE', body: JSON.stringify({ imageUrl }) }),
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  upload = {
    profileImage: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(`${this.baseUrl}/upload/profile-image`, {
        method: 'POST', credentials: 'include', body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Failed to upload image');
      }
      return await response.json();
    },

    portfolio: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const response = await fetch(`${this.baseUrl}/upload/portfolio`, {
        method: 'POST', credentials: 'include', body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Failed to upload portfolio images');
      }
      return await response.json();
    },

    verification: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('documents', file));
      const response = await fetch(`${this.baseUrl}/upload/verification`, {
        method: 'POST', credentials: 'include', body: formData,
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Failed to upload verification documents');
      }
      return await response.json();
    },

    deletePortfolioImage: (publicId: string) =>
      this.request<ApiResponse<{ message: string }>>(`/upload/portfolio/${publicId}`, { method: 'DELETE' }),
  };

  // ── Location ──────────────────────────────────────────────────────────────
  location = {
    reverseGeocode: (latitude: number, longitude: number) =>
      this.request<ApiResponse<unknown>>('/location/reverse-geocode', {
        method: 'POST', body: JSON.stringify({ latitude, longitude }),
      }),
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) =>
      this.request<ApiResponse<unknown>>('/location/calculate-distance', {
        method: 'POST', body: JSON.stringify({ lat1, lon1, lat2, lon2 }),
      }),
  };
}

export const api = new ApiClient();
