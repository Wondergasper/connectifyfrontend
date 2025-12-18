// src/hooks/useBookings.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Booking, CreateBookingRequest } from '@/lib/apiTypes';

export const useBookings = (params?: { type?: string; status?: string }) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => api.bookings.get(params),
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.bookings.getById(id),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: CreateBookingRequest) => api.bookings.create(bookingData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Update availability after booking creation
      if (data?.booking?.provider) {
        queryClient.invalidateQueries({
          queryKey: ['availability', { providerId: data.booking.provider }]
        });
      }
    },
  });
};

export const useUpdateBooking = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: Partial<Booking>) => api.bookings.update(id, bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
    },
  });
};

export const useAddBookingRating = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingData: { rating: number; comment?: string }) => api.bookings.addRating(id, ratingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Update service and provider ratings
      queryClient.invalidateQueries({ queryKey: ['service'] }); // This will refresh any service queries
    },
  });
};