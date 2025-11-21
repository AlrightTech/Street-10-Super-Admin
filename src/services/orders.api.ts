import api, { type ApiResponse, type PaginatedResponse } from '../utils/api';

export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  orderNumber: string;
  totalMinor: string;
  currency: string;
  status: string;
  paymentMethod: string;
  shippingAddress: any;
  couponCode: string | null;
  discountMinor: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
  };
  vendor: {
    id: string;
    email: string;
  };
  items: any[];
}

export interface OrderDetails extends Order {
  items: Array<{
    id: string;
    quantity: number;
    priceMinor: string;
    product: {
      id: string;
      title: string;
      priceMinor: string;
      currency: string;
      media: Array<{
        id: string;
        url: string;
        type: string;
      }>;
    };
  }>;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderDate: string;
  status: string;
  customer: {
    id: string;
    email: string;
    phone: string | null;
    shippingAddress: any;
  };
  vendor: {
    id: string;
    email: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: string;
    total: string;
    currency: string;
  }>;
  subtotal: string;
  discount: string;
  tax: string;
  shipping: string;
  total: string;
  currency: string;
  paymentMethod: string;
}

export interface OrderFilters {
  user_id?: string;
  vendor_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export const ordersApi = {
  // Get all orders
  getAll: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>('/orders', {
      params: filters,
    });
    return response.data.data;
  },

  // Get order by ID
  getById: async (id: string): Promise<OrderDetails> => {
    const response = await api.get<ApiResponse<{ order: OrderDetails }>>(`/orders/${id}`);
    return response.data.data.order;
  },

  // Update order status
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, {
      status,
    });
    return response.data.data.order;
  },

  // Generate invoice
  getInvoice: async (id: string): Promise<InvoiceData> => {
    const response = await api.get<ApiResponse<InvoiceData>>(`/admin/orders/${id}/invoice`);
    return response.data.data;
  },
};

