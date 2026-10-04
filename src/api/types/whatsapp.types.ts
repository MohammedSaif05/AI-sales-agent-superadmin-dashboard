export enum WhatsAppConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING',
  DISCONNECTED = 'DISCONNECTED',
}

export enum WebhookEventStatus {
  RECEIVED = 'RECEIVED',
  QUEUED = 'QUEUED',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

export type WhatsAppQualityRating = 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN' | string;

export interface WhatsAppBusinessSummary {
  id: string;
  name: string;
  phone: string;
}

export interface WhatsAppConnectionItem {
  id: string;
  businessId: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string | null;
  qualityRating: WhatsAppQualityRating | null;
  tokenExpiresAt: string | null;
  status: WhatsAppConnectionStatus;
  connectionVersion: number;
  disconnectRequestedAt: string | null;
  disconnectFinalizedAt: string | null;
  disconnectReason: string | null;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
  business: WhatsAppBusinessSummary;
  // Note: encryptedAccessToken is stripped by the backend controller and is omitted here
}

export interface WhatsAppWebhookEventItem {
  id: string;
  idempotencyKey: string;
  providerPhoneNumberId: string | null;
  rawPayload: Record<string, unknown> | unknown;
  eventOriginTimestamp: string | null;
  status: WebhookEventStatus;
  errorMessage: string | null;
  attempts: number;
  receivedAt: string;
  processedAt: string | null;
}

export interface WebhookEventsQuery {
  status?: WebhookEventStatus;
  limit?: number;
}
