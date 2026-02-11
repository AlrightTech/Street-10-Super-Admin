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
  auctionId?: string; // For auction orders
  paymentStage?: string; // For auction orders: down_payment_required, final_payment_required, full_payment_required, fully_paid
  downPaymentMinor?: string; // For auction orders
  remainingPaymentMinor?: string; // For auction orders
  depositAmountMinor?: string; // Deposit amount for auction orders
  finalPaymentAfterDeposit?: string; // Final payment amount after deposit is applied
  fullPaymentAfterDeposit?: string; // Full payment amount after deposit is applied
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
    profileImageUrl?: string | null;
  };
  vendor: {
    id: string;
    email: string;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    priceMinor: string;
    product?: {
      id: string;
      title: string;
      priceMinor: string;
      media?: Array<{
        id: string;
        url: string;
        type: string;
      }>;
    };
  }>;
}

export interface OrderDetails extends Omit<Order, 'vendor' | 'items'> {
  orderType?: 'vendor' | 'superadmin' | 'ecommerce';
  vendor?: {
    id: string;
    name?: string;
    email: string;
  };
  items: Array<{
    id: string;
    productId: string;
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
  dueDate?: string;
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
    const response = await api.get<ApiResponse<Order[]>>('/orders', {
      params: filters,
    });
    // Backend sendPaginated returns { success: true, data: [...], pagination: {...} }
    // We need to return { data: [...], pagination: {...} }
    return {
      data: response.data.data || [],
      pagination: (response.data as any).pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    };
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

  // Send invoice to customer
  sendInvoice: async (id: string): Promise<void> => {
    await api.post<ApiResponse<void>>(`/admin/orders/${id}/invoice/send`);
  },

  // Mark down payment as paid (admin only)
  markDownPaymentPaid: async (id: string): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>(`/orders/${id}/mark-down-payment-paid`);
    return response.data.data.order;
  },

  // Mark final payment as paid (admin only)
  markFinalPaymentPaid: async (id: string): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>(`/orders/${id}/mark-final-payment-paid`);
    return response.data.data.order;
  },

  // Mark full payment as paid (admin only)
  markFullPaymentPaid: async (id: string): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>(`/orders/${id}/mark-full-payment-paid`);
    return response.data.data.order;
  },

  // Update shipping information
  updateShipping: async (
    id: string,
    data: {
      deliveryCompany?: string;
      deliveryPerson?: string;
      deliveryContact?: string;
      estimatedDeliveryDate?: string;
      shippingNotes?: string;
      trackingNumber?: string;
      sendTrackingNotification?: boolean;
    }
  ): Promise<Order> => {
    const response = await api.patch<ApiResponse<{ order: Order }>>(`/orders/${id}/shipping`, data);
    return response.data.data.order;
  },

  // Process refund
  processRefund: async (
    id: string,
    data: {
      type: 'full' | 'partial';
      amountMinor?: number;
      reason: string;
      notes?: string;
      method: 'original' | 'wallet' | 'bank';
      notifyCustomer: boolean;
    }
  ): Promise<void> => {
    await api.post<ApiResponse<void>>(`/orders/${id}/refund`, data);
  },
};

