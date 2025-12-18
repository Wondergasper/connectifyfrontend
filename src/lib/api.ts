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
  User
} from './apiTypes';

// Use /api in development to leverage Vite proxy
// In production, VITE_API_URL should be the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // For credentials (cookies), we need to include them in requests
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies in requests
      ...options,
    };

    const maxRetries = 3;
    let attempt = 0;

    try {
      while (true) {
        attempt++;
        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (response.status === 429) {
          if (attempt >= maxRetries) {
            const errorMsg = `Too many requests. Please try again in a few moments.`;
            throw new Error(errorMsg);
          }
          // Parse Retry-After header, but cap at 5 seconds for better UX
          const retryAfter = response.headers.get('Retry-After');
          let waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000;
          // Cap the wait time at 5 seconds maximum to prevent excessive delays
          waitMs = Math.min(waitMs, 5000);
          console.warn(`Received 429 for ${endpoint}. Retrying in ${waitMs / 1000}s (attempt ${attempt}/${maxRetries})...`);
          await new Promise(res => setTimeout(res, waitMs));
          continue; // retry
        }

        // Check for authentication errors and try to refresh token automatically
        if (response.status === 401) {
          const errorData = await response.json().catch(() => ({} as ApiErrorResponse));
          console.log('Received 401, attempting token refresh...');

          // Attempt to refresh the token
          const refreshToken = localStorage.getItem('refreshToken');
          const refreshBody = refreshToken ? JSON.stringify({ refreshToken }) : undefined;
          const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // Include cookies for refresh token
            headers: {
              'Content-Type': 'application/json',
            },
            body: refreshBody,
          });

          if (refreshResponse.ok) {
            console.log('Token refresh successful, retrying original request...');
            // Add a small delay to ensure cookies are properly updated
            await new Promise(resolve => setTimeout(resolve, 100));
            // After successful refresh, the cookies should be updated
            // Retry the original request
            const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, config);

            if (!retryResponse.ok) {
              const retryError = await retryResponse.json().catch(() => ({} as ApiErrorResponse));
              const retryErrorMessage = retryError.message || retryError.error || `Retry failed with status: ${retryResponse.status}`;
              throw new Error(retryErrorMessage);
            }

            return await retryResponse.json();
          } else {
            // Refresh also failed, clear any stored data and throw error
            const refreshError = await refreshResponse.json().catch(() => ({} as ApiErrorResponse));
            console.log('Token refresh failed:', refreshError);
            const refreshErrorMessage = refreshError.message || refreshError.error || 'Session expired. Please log in again.';
            throw new Error(refreshErrorMessage);
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status}`,
            error: 'Network Error',
            statusCode: response.status
          } as ApiErrorResponse));

          // Handle specific error codes with more descriptive messages
          let errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;

          // Add more context for specific error codes
          if (response.status === 400) {
            errorMessage = errorData.error || errorData.message || 'Invalid request. Please check your input.';
          } else if (response.status === 403) {
            errorMessage = errorData.error || errorData.message || 'Access forbidden. You do not have permission to perform this action.';
          } else if (response.status === 404) {
            errorMessage = errorData.error || errorData.message || 'Resource not found. The requested resource does not exist.';
          } else if (response.status === 500) {
            errorMessage = errorData.error || errorData.message || 'Server error. Please try again later.';
          }

          throw new Error(errorMessage);
        }

        return await response.json();
      }
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error);

      // Handle network errors or other non-HTTP errors
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection and try again.');
      }

      // Re-throw the error to be handled by calling code
      throw error;
    }
  }

  // Auth methods
  auth = {
    login: (credentials: LoginRequest) => {
      // Store tokens after successful login (cookies are set by the server)
      return this.request<ApiResponse<LoginResponse>>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    },

    register: (userData: RegisterRequest) =>
      this.request<ApiResponse<UserProfileResponse>>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

    getProfile: () =>
      this.request<ApiResponse<UserProfileResponse>>('/auth/profile'),

    updateProfile: (profileData: Partial<User>) =>
      this.request<ApiResponse<UserProfileResponse>>('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

    logout: () =>
      this.request<ApiResponse<{ message: string }>>('/auth/logout', { method: 'POST' }),

    // Send stored refresh token in request body
    refreshToken: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      const body = refreshToken ? JSON.stringify({ refreshToken }) : undefined;
      return this.request<ApiResponse<{ token: string }>>('/auth/refresh', { method: 'POST', body });
    },

    forgotPassword: (email: string) =>
      this.request<ApiResponse<{ data: string }>>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

    resetPassword: (token: string, password: string) =>
      this.request<ApiResponse<{ data: string }>>(`/auth/reset-password/${token}`, { method: 'PUT', body: JSON.stringify({ password }) }),
  };

  // User methods
  users = {
    get: (userId: string) => this.request<ApiResponse<User>>(`/users/${userId}`),
    getAll: () => this.request<ApiResponse<User[]>>('/users'),
    update: (userId: string, userData: Partial<User>) =>
      this.request<ApiResponse<User>>(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(userData) }),
  };

  // Services methods
  services = {
    get: (params?: ServiceSearchParams) => {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/services?${queryString}` : '/services';
      return this.request<ApiResponse<{ data: Service[] }>>(endpoint);
    },
    getById: (id: string) => this.request<ApiResponse<Service>>(`/services/${id}`),
    create: (serviceData: CreateServiceRequest) =>
      this.request<ApiResponse<Service>>('/services', { method: 'POST', body: JSON.stringify(serviceData) }),
    update: (id: string, serviceData: CreateServiceRequest) =>
      this.request<ApiResponse<Service>>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(serviceData) }),
    delete: (id: string) =>
      this.request<ApiResponse<{ message: string }>>(`/services/${id}`, { method: 'DELETE' }),
    search: (params?: ServiceSearchParams) => {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.location) queryParams.append('location', params.location);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/services/search?${queryString}` : '/services/search';
      return this.request<ApiResponse<{ data: Service[] }>>(endpoint);
    },
  };

  // Bookings methods
  bookings = {
    get: (params?: { type?: string; status?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';
      return this.request<ApiResponse<{ data: Booking[] }>>(endpoint);
    },
    getById: (id: string) => this.request<ApiResponse<Booking>>(`/bookings/${id}`),
    create: (bookingData: CreateBookingRequest) =>
      this.request<ApiResponse<{ booking: Booking }>>('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
    update: (id: string, bookingData: Partial<Booking>) =>
      this.request<ApiResponse<Booking>>(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(bookingData) }),
    addRating: (id: string, ratingData: { rating: number; comment?: string }) =>
      this.request<ApiResponse<Booking>>(`/bookings/${id}/rating`, { method: 'POST', body: JSON.stringify(ratingData) }),
  };

  // Wallet methods
  wallet = {
    getBalance: () => this.request<ApiResponse<WalletBalance>>('/wallet/balance'),
    getTransactions: () => this.request<ApiResponse<Transaction[]>>('/wallet/transactions'),
    processPayment: (paymentData: Record<string, unknown>) =>
      this.request<ApiResponse<{ success: boolean; transactionId: string }>>('/wallet/process-payment', { method: 'POST', body: JSON.stringify(paymentData) }),
    addFunds: (fundsData: AddFundsRequest) =>
      this.request<ApiResponse<WalletBalance>>('/wallet/add-funds', { method: 'POST', body: JSON.stringify(fundsData) }),
  };

  // Notifications methods
  notifications = {
    get: () => this.request<ApiResponse<Notification[]>>('/notifications'),
    markAsRead: (notificationId: string) =>
      this.request<ApiResponse<Notification>>(`/notifications/${notificationId}/read`, { method: 'PUT' }),
    markAllAsRead: () =>
      this.request<ApiResponse<{ message: string }>>('/notifications/read-all', { method: 'PUT' }),
    delete: (notificationId: string) =>
      this.request<ApiResponse<{ message: string }>>(`/notifications/${notificationId}`, { method: 'DELETE' }),
  };

  // Messages methods
  messages = {
    getConversations: () => this.request<ApiResponse<Conversation[]>>('/messages/conversations'),
    getMessages: (conversationId: string) => this.request<ApiResponse<Message[]>>(`/messages/conversations/${conversationId}`),
    getMessagesWithUser: (userId: string) => this.request<ApiResponse<Message[]>>(`/messages/users/${userId}`),
    searchConversations: (search: string) => this.request<ApiResponse<Conversation[]>>(`/messages/search?search=${search}`),
    getUnreadCount: () => this.request<ApiResponse<{ count: number }>>('/messages/unread'),
    markConversationAsRead: (conversationId: string) =>
      this.request<ApiResponse<{ message: string }>>(`/messages/conversations/${conversationId}/read`, { method: 'PUT' }),
    createConversation: (conversationData: { recipientId: string; serviceId?: string; bookingId?: string }) =>
      this.request<ApiResponse<Conversation>>('/messages/conversations', { method: 'POST', body: JSON.stringify(conversationData) }),
    sendMessage: (messageData: { conversationId: string; content: string }) =>
      this.request<ApiResponse<Message>>('/messages', { method: 'POST', body: JSON.stringify(messageData) }),
  };

  // Availability methods
  availability = {
    get: (params: { providerId: string; date?: string }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('providerId', params.providerId);
      if (params.date) queryParams.append('date', params.date);

      const queryString = queryParams.toString();
      return this.request<ApiResponse<Availability>>(`/availability?${queryString}`);
    },
    getRange: (params: { providerId: string; startDate?: string; endDate?: string }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('providerId', params.providerId);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const queryString = queryParams.toString();
      return this.request<ApiResponse<Availability>>(`/availability/range?${queryString}`);
    },
    update: (availabilityData: UpdateAvailabilityRequest) =>
      this.request<ApiResponse<Availability>>('/availability', { method: 'PUT', body: JSON.stringify(availabilityData) }),
    bookSlot: (slotData: { date: string; startTime: string; bookingId: string }) =>
      this.request<ApiResponse<Availability>>('/availability/book-slot', { method: 'PUT', body: JSON.stringify(slotData) }),
    unbookSlot: (slotData: { date: string; startTime: string; bookingId: string }) =>
      this.request<ApiResponse<Availability>>('/availability/unbook-slot', { method: 'PUT', body: JSON.stringify(slotData) }),
  };

  // Reviews methods
  reviews = {
    create: (reviewData: CreateReviewRequest) =>
      this.request<ApiResponse<Review>>('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
    getByService: (serviceId: string) => this.request<ApiResponse<Review[]>>(`/reviews/service/${serviceId}`),
    getByProvider: (providerId: string) => this.request<ApiResponse<Review[]>>(`/reviews/provider/${providerId}`),
    getByUser: () => this.request<ApiResponse<Review[]>>('/reviews/user'),
    getById: (id: string) => this.request<ApiResponse<Review>>(`/reviews/${id}`),
  };

  // Verification methods
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
      this.request<ApiResponse<VerificationRequest>>(`/verification/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      }),
  };

  // Receipt methods
  receipts = {
    get: (bookingId: string) => this.request<ApiResponse<Receipt>>(`/receipts/${bookingId}`),
    getDetails: (bookingId: string) => this.request<ApiResponse<Receipt>>(`/receipts/${bookingId}/details`),
    // Special method for PDF that doesn't parse JSON response but includes auth refresh logic
    getPdf: async (bookingId: string) => {
      let response = await fetch(`${this.baseUrl}/receipts/${bookingId}/pdf`, {
        method: 'GET',
        credentials: 'include',
      });

      // Handle authentication errors and try to refresh token automatically
      if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshBody = refreshToken ? JSON.stringify({ refreshToken }) : undefined;
        const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Include cookies for refresh token
          headers: {
            'Content-Type': 'application/json',
          },
          body: refreshBody,
        });

        if (refreshResponse.ok) {
          // Add a small delay to ensure cookies are properly updated
          await new Promise(resolve => setTimeout(resolve, 100));
          // After successful refresh, the cookies should be updated
          // Retry the original request
          response = await fetch(`${this.baseUrl}/receipts/${bookingId}/pdf`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            const retryErrorText = await response.clone().text();
            let retryErrorMessage = `Retry failed with status: ${response.status}`;
            try {
              const retryErrorJson = JSON.parse(retryErrorText);
              retryErrorMessage = retryErrorJson.message || retryErrorJson.error || retryErrorMessage;
            } catch {
              // If not JSON, use the text as is
              retryErrorMessage = retryErrorText;
            }
            throw new Error(retryErrorMessage);
          }
        } else {
          // Refresh also failed, clear any stored data and throw error
          const refreshErrorText = await refreshResponse.clone().text();
          let refreshErrorMessage = 'Session expired. Please log in again.';
          try {
            const refreshErrorJson = JSON.parse(refreshErrorText);
            refreshErrorMessage = refreshErrorJson.message || refreshErrorJson.error || refreshErrorMessage;
          } catch {
            // If not JSON, use the text as is
            refreshErrorMessage = refreshErrorText;
          }
          throw new Error(refreshErrorMessage);
        }
      }

      if (!response.ok) {
        // For non-JSON responses, try to get error from text or use status code
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          // Clone the response to read it multiple times
          const errorResponse = response.clone();
          const errorText = await errorResponse.text();
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorMessage;
          } catch {
            // If not JSON, use the text as is
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          // If there's an issue reading the error response, use status code
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      return await response.text(); // Return as text instead of parsing JSON
    },
  };

  // Categories methods
  categories = {
    get: (params?: { isActive?: boolean }) => {
      const endpoint = params?.isActive !== undefined
        ? `/categories?isActive=${params.isActive}`
        : '/categories';
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

  // Images methods
  images = {
    addServiceImages: (serviceId: string, imageUrls: string[]) =>
      this.request<ApiResponse<Service>>(`/images/services/${serviceId}`, {
        method: 'POST',
        body: JSON.stringify({ imageUrls })
      }),
    removeServiceImage: (serviceId: string, imageUrl: string) =>
      this.request<ApiResponse<Service>>(`/images/services/${serviceId}`, {
        method: 'DELETE',
        body: JSON.stringify({ imageUrl })
      }),
  };

  // Upload methods
  upload = {
    profileImage: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${this.baseUrl}/upload/profile-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Failed to upload image');
      }

      return await response.json();
    },

    portfolio: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${this.baseUrl}/upload/portfolio`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Failed to upload portfolio images');
      }

      return await response.json();
    },

    verification: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });

      const response = await fetch(`${this.baseUrl}/upload/verification`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Failed to upload verification documents');
      }

      return await response.json();
    },

    deletePortfolioImage: (publicId: string) =>
      this.request<ApiResponse<{ message: string }>>(`/upload/portfolio/${publicId}`, {
        method: 'DELETE'
      }),
  };

  // Location/Geolocation methods
  location = {
    reverseGeocode: async (latitude: number, longitude: number) => {
      return this.request<any>('/location/reverse-geocode', {
        method: 'POST',
        body: JSON.stringify({ latitude, longitude })
      });
    },

    calculateDistance: async (lat1: number, lon1: number, lat2: number, lon2: number) => {
      return this.request<any>('/location/calculate-distance', {
        method: 'POST',
        body: JSON.stringify({ lat1, lon1, lat2, lon2 })
      });
    }
  };
}

export const api = new ApiClient();

// Add a global error handler for unhandled API errors
const originalConsoleError = console.error;
console.error = function (...args) {
  // Log only if not an API error we're handling elsewhere
  if (args[0] && typeof args[0] === 'string' && args[0].includes('API request error')) {
    // This is already handled in the API layer, so don't double log
    return;
  }
  originalConsoleError.apply(console, args);
};

// Helper to retrieve stored refresh token (used by other modules if needed)
export const getStoredRefreshToken = () => localStorage.getItem('refreshToken');