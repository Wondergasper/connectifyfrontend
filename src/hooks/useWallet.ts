import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AddFundsRequest } from '@/lib/apiTypes';

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => api.wallet.getBalance(),
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => api.wallet.getTransactions(),
  });
};

export const useAddFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fundsData: AddFundsRequest) => api.wallet.addFunds(fundsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: Record<string, unknown>) => api.wallet.processPayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
  });
};
