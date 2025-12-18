// src/hooks/useWallet.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { WalletBalance, Transaction, AddFundsRequest } from '@/lib/apiTypes';

export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['walletBalance'],
    queryFn: () => api.wallet.getBalance(),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ['walletTransactions'],
    queryFn: () => api.wallet.getTransactions(),
  });
};

export const useAddFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fundsData: AddFundsRequest) => api.wallet.addFunds(fundsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: Record<string, unknown>) => api.wallet.processPayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
    },
  });
};