// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoginRequest, RegisterRequest, User } from '@/lib/apiTypes';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      api.auth.login(credentials),
    onSuccess: () => {
      // Invalidate profile query to fetch updated data after login
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) =>
      api.auth.register(userData),
    onSuccess: () => {
      // Invalidate profile query to fetch updated data after registration
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
};

// A version of useProfile that does not require navigate (for use in AuthContext)
export const useProfileNoNavigate = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.auth.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401 errors during initial load
    throwOnError: false, // Don't throw on error to allow unauthenticated state
    refetchOnWindowFocus: false, // Don't refetch automatically when window is focused
    refetchOnReconnect: false, // Don't refetch on reconnection
    // Handle errors appropriately without navigation
    onError: (error: Error) => {
      console.error('Profile fetch error:', error);
      // Check if it's an authentication error that requires logout
      if (
        error.message.includes('Session expired') ||
        error.message.includes('401') ||
        error.message.includes('No refresh token provided') ||
        error.message.includes('Invalid refresh token')
      ) {
        // Don't show error toast on initial load - user might just not be logged in
        // Clear any cached data
        localStorage.clear(); // Clear any local storage if needed
        // Note: Navigation will be handled by parent components
      } else {
        toast.error('Failed to load profile. Please try again later.');
      }
    }
  });
};

// A version of useProfile that can navigate (for use in router contexts)
export const useProfile = () => {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.auth.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401 errors during initial load
    throwOnError: false, // Don't throw on error to allow unauthenticated state
    refetchOnWindowFocus: false, // Don't refetch automatically when window is focused
    refetchOnReconnect: false, // Don't refetch on reconnection
    // Handle errors appropriately with navigation
    onError: (error: Error) => {
      console.error('Profile fetch error:', error);
      // Check if it's an authentication error that requires logout
      if (
        error.message.includes('Session expired') ||
        error.message.includes('401') ||
        error.message.includes('No refresh token provided') ||
        error.message.includes('Invalid refresh token')
      ) {
        // Clear any cached data and redirect to auth
        localStorage.clear(); // Clear any local storage if needed
        navigate('/auth', { replace: true });
        // Only show toast if it's not the initial load (to avoid spamming on first visit)
        // But for now, we'll show it to be explicit
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to load profile. Please try again later.');
      }
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: Partial<User>) => api.auth.updateProfile(profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.');
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: string) => api.auth.updateProfile({ role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Role updated successfully');
    },
    onError: (error: Error) => {
      console.error('Role update error:', error);
      toast.error(error.message || 'Failed to update role. Please try again.');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      // Clear any cached data
      queryClient.clear();
      // Navigate to auth page
      navigate('/auth', { replace: true });
      toast.success('You have been logged out successfully');
    },
    onError: (error: Error) => {
      console.error('Logout error:', error);
      // Even if logout fails on the backend, clear local state and navigate to auth
      queryClient.clear();
      navigate('/auth', { replace: true });

      // Show a different message if it's a network error
      if (error.message.includes('Network error')) {
        toast.success('Offline: You have been logged out locally');
      } else {
        toast.error('Logout failed. Please try again later.');
      }
    }
  });
};