import api, { type ApiResponse } from '../utils/api';

export interface Filter {
  id: string;
  key: string;
  type: string;
  options?: any;
  validation?: any;
  i18n?: {
    en?: { label: string; placeholder?: string };
    ar?: { label: string; placeholder?: string };
  };
  isIndexed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFilterData {
  key: string;
  type: string;
  options?: any;
  validation?: any;
  i18n?: Filter['i18n'];
  isIndexed?: boolean;
}

export interface UpdateFilterData extends Partial<CreateFilterData> {}

export const filtersApi = {
  getAll: async (): Promise<Filter[]> => {
    const response = await api.get<ApiResponse<{ filters: Filter[] }>>('/admin/filters');
    return response.data.data.filters || [];
  },

  getById: async (id: string): Promise<Filter> => {
    const response = await api.get<ApiResponse<{ filter: Filter }>>(`/admin/filters/${id}`);
    return response.data.data.filter;
  },

  create: async (data: CreateFilterData): Promise<Filter> => {
    const response = await api.post<ApiResponse<{ filter: Filter }>>('/admin/filters', data);
    return response.data.data.filter;
  },

  update: async (id: string, data: UpdateFilterData): Promise<Filter> => {
    const response = await api.patch<ApiResponse<{ filter: Filter }>>(`/admin/filters/${id}`, data);
    return response.data.data.filter;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/filters/${id}`);
  },
};


