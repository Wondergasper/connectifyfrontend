// src/hooks/useWallet.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AddFundsRequest } from '@/lib/apiTypes';
import { toast } from 'sonner';

// ── Queries ───────────────────────────────────────────────────────────────

export const useWalletBalance = () =>
  useQuery({
    queryKey: ['wallet-balance'],
    queryFn: () => api.wallet.getBalance(),
    staleTime: 30_000, // 30 seconds — balance changes frequently
  });

export const useWalletTransactions = (params?: { page?: number; limit?: number; type?: string }) =>
  useQuery({
    queryKey: ['wallet-transactions', params],
    queryFn: () => api.wallet.getTransactions(params),
  });

export const useBanks = () =>
  useQuery({
    queryKey: ['paystack-banks'],
    queryFn: () => api.wallet.getBanks(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours — bank list rarely changes
  });

// ── Mutations ─────────────────────────────────────────────────────────────

/** Legacy/test-mode only. Real funding goes through initializePayment → Paystack → verifyPayment */
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

/** Step 1 — get Paystack authorization URL and open it */
export const useInitializePayment = () =>
  useMutation({
    mutationFn: (amount: number) => api.wallet.initializePayment(amount),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initialize payment');
    },
  });

/** Step 2 — called on Paystack callback page to credit the wallet */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => api.wallet.verifyPayment(reference),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      const amount = data?.data?.amountAdded;
      if (amount) toast.success(`₦${amount.toLocaleString()} added to your wallet!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Payment verification failed');
    },
  });
};

/** Resolve a bank account number → returns account name for user to confirm */
export const useResolveAccount = () =>
  useMutation({
    mutationFn: ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) =>
      api.wallet.resolveAccount(accountNumber, bankCode),
    onError: (error: Error) => {
      toast.error(error.message || 'Could not verify account. Please check the details.');
    },
  });

/** Withdraw funds to a Nigerian bank account */
export const useWithdraw = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; accountNumber: string; bankCode: string; accountName: string }) =>
      api.wallet.withdraw(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
      const amount = data?.data?.amount;
      if (amount) toast.success(`₦${amount.toLocaleString()} withdrawal initiated!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Withdrawal failed. Please try again.');
    },
  });
};

/** Pay for a booking from wallet balance */
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
