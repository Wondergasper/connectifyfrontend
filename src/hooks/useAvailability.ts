// src/hooks/useAvailability.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Availability, UpdateAvailabilityRequest } from '@/lib/apiTypes';

export const useAvailability = (params: { providerId: string; date?: string }) => {
  return useQuery({
    queryKey: ['availability', params],
    queryFn: () => api.availability.get(params),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useAvailabilityRange = (params: { providerId: string; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['availabilityRange', params],
    queryFn: () => api.availability.getRange(params),
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (availabilityData: UpdateAvailabilityRequest) => api.availability.update(availabilityData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['availability', { providerId: data.providerId }]
      });
      queryClient.invalidateQueries({
        queryKey: ['availabilityRange', { providerId: data.providerId }]
      });
    },
  });
};

export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotData: { date: string; startTime: string; bookingId: string }) =>
      api.availability.bookSlot(slotData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['availability', { providerId: data.providerId }]
      });
    },
  });
};

export const useUnbookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotData: { date: string; startTime: string; bookingId: string }) =>
      api.availability.unbookSlot(slotData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['availability', { providerId: data.providerId }]
      });
    },
  });
};