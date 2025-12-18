// src/hooks/useServices.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Service, CreateServiceRequest, ServiceSearchParams } from '@/lib/apiTypes';

export const useServices = (params?: ServiceSearchParams) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => api.services.get(params),
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => api.services.getById(id),
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: CreateServiceRequest) => api.services.create(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: CreateServiceRequest) => api.services.update(id, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service', id] });
    },
  });
};

export const useDeleteService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.services.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useSearchServices = (params?: ServiceSearchParams) => {
  return useQuery({
    queryKey: ['searchServices', params],
    queryFn: () => api.services.search(params),
  });
};

export const useCategories = (params?: { isActive?: boolean }) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => api.categories.get(params),
  });
};