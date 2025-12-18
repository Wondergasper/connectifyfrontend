// src/hooks/useVerification.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { VerificationRequest } from '@/lib/apiTypes';

export const useVerificationStatus = (userId?: string) => {
  return useQuery({
    queryKey: ['verificationStatus', userId],
    queryFn: () => api.verification.getStatus(userId),
  });
};

export const useSubmitVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (verificationData: Partial<VerificationRequest>) => api.verification.submit(verificationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useApproveVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.verification.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useRejectVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.verification.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
    },
  });
};