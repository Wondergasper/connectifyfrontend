// src/hooks/useReceiptsAndReviews.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Receipt, CreateReviewRequest, Review } from '@/lib/apiTypes';

export const useReceipt = (bookingId: string) => {
  return useQuery({
    queryKey: ['receipt', bookingId],
    queryFn: () => api.receipts.get(bookingId),
  });
};

export const useReceiptDetails = (bookingId: string) => {
  return useQuery({
    queryKey: ['receiptDetails', bookingId],
    queryFn: () => api.receipts.getDetails(bookingId),
  });
};

export const useCreateReview = () => {
  return useMutation({
    mutationFn: (reviewData: CreateReviewRequest) => api.reviews.create(reviewData),
  });
};

export const useServiceReviews = (serviceId: string) => {
  return useQuery({
    queryKey: ['serviceReviews', serviceId],
    queryFn: () => api.reviews.getByService(serviceId),
  });
};

export const useProviderReviews = (providerId: string) => {
  return useQuery({
    queryKey: ['providerReviews', providerId],
    queryFn: () => api.reviews.getByProvider(providerId),
  });
};