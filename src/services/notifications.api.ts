import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Notification {
  id: string;
  userId: string | null;
  type: string;
  title: string;
  message: string;
  data: any | null;
  read: boolean;
  priority: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface NotificationFilters {
  user_id?: string | null;
  type?: string;
  is_read?: boolean;
  priority?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export const notificationsApi = {
  // Get all notifications
  getAll: async (filters?: NotificationFilters): Promise<PaginatedResponse<Notification>> => {
    const params: any = { ...filters };
    if (params.user_id === null || params.user_id === 'null') {
      params.user_id = 'null';
    }
    const response = await api.get<ApiResponse<PaginatedResponse<Notification>>>(
      '/admin/notifications',
      { params }
    );
    return response.data.data;
  },

  // Get notification by ID
  getById: async (id: string): Promise<Notification> => {
    const response = await api.get<ApiResponse<{ notification: Notification }>>(
      `/admin/notifications/${id}`
    );
    return response.data.data.notification;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<ApiResponse<{ notification: Notification }>>(
      `/admin/notifications/${id}/read`
    );
    return response.data.data.notification;
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/notifications/${id}`);
  },

  // Clear all notifications
  clearAll: async (userId?: string | null): Promise<{ deleted: number }> => {
    const params: any = {};
    if (userId !== undefined) {
      params.user_id = userId === null ? 'null' : userId;
    }
    const response = await api.delete<ApiResponse<{ deleted: number }>>('/admin/notifications', {
      params,
    });
    return response.data.data;
  },
};

