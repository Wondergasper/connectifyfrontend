// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoginRequest, RegisterRequest, User } from '@/lib/apiTypes';
import { disconnectWebSocket } from '@/lib/websocket';

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
  const query = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.auth.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    throwOnError: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Handle errors without navigation (useEffect replaces deprecated onError option)
  useEffect(() => {
    if (!query.isError || !query.error) return;
    const error = query.error as Error;
    if (
      error.message.includes('Session expired') ||
      error.message.includes('401') ||
      error.message.includes('No refresh token provided') ||
      error.message.includes('Invalid refresh token')
    ) {
      disconnectWebSocket();
    } else {
      toast.error('Failed to load profile. Please try again later.');
    }
  }, [query.isError, query.error]);

  return query;
};

// A version of useProfile that can navigate (for use in router contexts)
export const useProfile = () => {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.auth.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    throwOnError: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Handle errors with navigation (useEffect replaces deprecated onError option)
  useEffect(() => {
    if (!query.isError || !query.error) return;
    const error = query.error as Error;
    if (
      error.message.includes('Session expired') ||
      error.message.includes('401') ||
      error.message.includes('No refresh token provided') ||
      error.message.includes('Invalid refresh token')
    ) {
      disconnectWebSocket();
      navigate('/auth', { replace: true });
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error('Failed to load profile. Please try again later.');
    }
  }, [query.isError, query.error]);

  return query;
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
    mutationFn: (role: string) => api.auth.updateProfile({ 
      role, 
      profile: { roleSelected: true } 
    }),
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
      disconnectWebSocket();
      // Navigate to auth page
      navigate('/auth', { replace: true });
      toast.success('You have been logged out successfully');
    },
    onError: (error: Error) => {
      console.error('Logout error:', error);
      // Even if logout fails on the backend, clear local state and navigate to auth
      queryClient.clear();
      disconnectWebSocket();
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
