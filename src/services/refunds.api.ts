import api from '../utils/api';

export interface RefundRequestSummary {
  id: string;
  orderId: string;
  type: string;
  amountMinor: string | null;
  reason: string;
  notes: string | null;
  status: string;
  requestedBy: string;
  productReceived: boolean;
  createdAt: string;
  bankName?: string | null;
  iban?: string | null;
  accountNumber?: string | null;
  swiftCode?: string | null;
  paymentProofUrl?: string | null;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
    previousStatus?: string | null;
    orderType?: 'auction' | 'admin-ecommerce' | 'vendor';
    totalMinor: string;
    paymentMethod: string;
    user?: { id: string; email?: string; name?: string };
  };
}

export interface RefundRequestDetail extends RefundRequestSummary {
  documents?: string[] | null;
  disputeReason?: string | null;
  order: NonNullable<RefundRequestSummary['order']> & {
    items?: Array<{
      id: string;
      productId: string;
      quantity: number;
      priceMinor: string;
      maxRestockQty?: number;
      product?: { id: string; title: string };
    }>;
  };
  auditLogs?: Array<{
    id: string;
    action: string;
    actorId: string | null;
    actorRole: string | null;
    createdAt: string;
  }>;
  restockLines?: Array<{
    id: string;
    orderItemId: string;
    productId: string;
    quantityRestocked: number;
  }>;
}

export const refundsApi = {
  async getList(orderId?: string): Promise<RefundRequestSummary[]> {
    const params = orderId ? `?orderId=${orderId}` : '';
    const res = await api.get<{ success: boolean; data: { refundRequests: RefundRequestSummary[] } }>(
      `/refund-requests${params}`
    );
    if (res.data?.success && res.data?.data) return (res.data.data as any).refundRequests ?? [];
    throw new Error((res.data as any)?.message || 'Failed to fetch refund requests');
  },

  async getById(id: string): Promise<RefundRequestDetail> {
    const res = await api.get<{ success: boolean; data: { refundRequest: RefundRequestDetail } }>(`/refunds/${id}`);
    if (res.data?.success && res.data?.data) return (res.data.data as any).refundRequest;
    throw new Error((res.data as any)?.message || 'Failed to fetch refund request');
  },

  async updateStatus(
    id: string,
    data: { status: 'vendor_approved' | 'rejected' | 'disputed' | 'admin_issue'; disputeReason?: string; paymentProofUrl?: string; amountMinor?: number }
  ): Promise<RefundRequestDetail> {
    const res = await api.patch<{ success: boolean; data: { refundRequest: RefundRequestDetail } }>(
      `/refunds/${id}/status`,
      data
    );
    if (res.data?.success && res.data?.data) return (res.data.data as any).refundRequest;
    throw new Error((res.data as any)?.message || 'Failed to update status');
  },

  async markProductReceived(
    id: string,
    restockLines: Array<{ orderItemId: string; productId: string; quantityRestocked: number }>
  ): Promise<RefundRequestDetail> {
    const res = await api.patch<{ success: boolean; data: { refundRequest: RefundRequestDetail } }>(
      `/refunds/${id}/product-received`,
      { restockLines }
    );
    if (res.data?.success && res.data?.data) return (res.data.data as any).refundRequest;
    throw new Error((res.data as any)?.message || 'Failed to mark product received');
  },
};
