import { apiClient } from '../client/apiClient';
import { ApiResponse } from '../types/common.types';
import {
  WebhookEventsQuery,
  WhatsAppConnectionItem,
  WhatsAppWebhookEventItem,
} from '../types/whatsapp.types';

export const whatsappApi = {
  /**
   * GET /api/v1/admin/whatsapp/connections
   * Platform-wide WhatsApp connections overview (Super Admin only)
   */
  getConnections(): Promise<ApiResponse<WhatsAppConnectionItem[]>> {
    return apiClient.get<WhatsAppConnectionItem[]>('/admin/whatsapp/connections');
  },

  /**
   * GET /api/v1/admin/whatsapp/webhook-events
   * Inspect staged webhook events (Super Admin only)
   */
  getWebhookEvents(query?: WebhookEventsQuery): Promise<ApiResponse<WhatsAppWebhookEventItem[]>> {
    return apiClient.get<WhatsAppWebhookEventItem[]>('/admin/whatsapp/webhook-events', {
      params: {
        status: query?.status,
        limit: query?.limit,
      },
    });
  },

  /**
   * POST /api/v1/admin/whatsapp/webhook-events/:id/retry
   * Manually retry a failed or stuck webhook event
   */
  retryWebhookEvent(id: string): Promise<ApiResponse<WhatsAppWebhookEventItem>> {
    return apiClient.post<WhatsAppWebhookEventItem>(
      `/admin/whatsapp/webhook-events/${encodeURIComponent(id)}/retry`,
    );
  },
};
