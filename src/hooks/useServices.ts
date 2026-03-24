import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Category, CreateServiceRequest, ServiceSearchParams } from '@/lib/apiTypes';

export const useServices = (params?: ServiceSearchParams) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => api.services.get(params),
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await api.services.getById(id);
      // API returns { success, service } or { success, data } — unwrap to the Service object
      const service = (response as any).service ?? (response as any).data ?? response;
      return service as import('@/lib/apiTypes').Service;
    },
    enabled: !!id,
  });
};

export const useSearchServices = (params?: ServiceSearchParams) => {
  return useQuery({
    queryKey: ['services-search', params],
    queryFn: () => api.services.search(params),
  });
};

export const useCategories = (params?: { isActive?: boolean }) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => api.categories.get(params),
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: CreateServiceRequest) => api.services.create(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-search'] });
    },
  });
};

export const useUpdateService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData: CreateServiceRequest) => api.services.update(id, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service', id] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-search'] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.services.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-search'] });
    },
  });
};

export const useServiceSearch = useSearchServices;

