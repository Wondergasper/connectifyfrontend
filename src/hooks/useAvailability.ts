import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { UpdateAvailabilityRequest } from '@/lib/apiTypes';

export const useAvailability = (providerId?: string, date?: string) => {
  return useQuery({
    queryKey: ['availability', { providerId, date }],
    queryFn: () => api.availability.get({ providerId: providerId || '', date }),
    enabled: !!providerId,
  });
};

export const useAvailabilityRange = (
  providerId?: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ['availability-range', { providerId, startDate, endDate }],
    queryFn: () => api.availability.getRange({ providerId: providerId || '', startDate, endDate }),
    enabled: !!providerId,
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (availabilityData: UpdateAvailabilityRequest & { providerId?: string }) =>
      api.availability.update(availabilityData),
    onSuccess: (data, variables) => {
      const providerId = variables.providerId || (data?.data?.providerId ?? undefined);
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      if (providerId) {
        queryClient.invalidateQueries({ queryKey: ['availability', { providerId }] });
        queryClient.invalidateQueries({ queryKey: ['availability-range', { providerId }] });
      }
    },
  });
};

export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotData: { providerId: string; date: string; startTime: string; bookingId: string }) =>
      api.availability.bookSlot(slotData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['availability', { providerId: variables.providerId }] });
      queryClient.invalidateQueries({ queryKey: ['availability-range', { providerId: variables.providerId }] });
    },
  });
};

export const useUnbookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotData: { providerId: string; date: string; startTime: string; bookingId: string }) =>
      api.availability.unbookSlot(slotData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['availability', { providerId: variables.providerId }] });
      queryClient.invalidateQueries({ queryKey: ['availability-range', { providerId: variables.providerId }] });
    },
  });
};

