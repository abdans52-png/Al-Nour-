/**
 * AL NOUREEN - Zapier Webhook & Automations Integration
 * Webhook Endpoint: https://hooks.zapier.com/hooks/catch/28715190/4hr2x62/
 */

export const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/28715190/4hr2x62/';

export type ZapierEventName =
  | 'order.created'
  | 'order.status_updated'
  | 'contact.submitted'
  | 'newsletter.subscribed'
  | 'stock_notification.requested'
  | 'price_drop.requested'
  | 'fabric_swatch.requested'
  | 'test.ping';

export interface ZapierWebhookResponse {
  success: boolean;
  status?: number | string;
  message?: string;
  error?: string;
}

export interface ZapierWebhookLog {
  id: string;
  event: string;
  timestamp: string;
  status: 'success' | 'failed';
  statusCode?: number;
  error?: string;
  summary: string;
}

/**
 * Triggers Zapier Webhook via the backend proxy or direct fallback
 * with formatted payload containing friendly root-level and nested fields.
 */
export async function triggerZapierEvent(
  event: ZapierEventName | string,
  payload: Record<string, any> = {}
): Promise<ZapierWebhookResponse> {
  const timestamp = new Date().toISOString();

  // 1. First, attempt via backend API proxy (guarantees server-side logging and security)
  try {
    const res = await fetch('/api/zapier/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event,
        payload
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`[Zapier Trigger] Successfully sent ${event} via backend proxy`);
      return { success: true, status: res.status, message: data.message || 'Webhook received' };
    }
  } catch (err: any) {
    console.warn('[Zapier Trigger] Backend proxy failed, attempting direct dispatch:', err.message);
  }

  // 2. Direct client-side dispatch fallback (handles no-cors or standard response)
  try {
    // Format structured body
    const formattedBody: Record<string, any> = {
      event_type: event,
      event_name: event,
      source: 'al-noureen-frontend',
      timestamp,
      ...payload
    };

    const directRes = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Standard for cross-origin catch webhooks in browser
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(formattedBody)
    });

    console.log(`[Zapier Trigger] Direct dispatch sent for ${event}`);
    return {
      success: true,
      status: 'dispatched_client_side',
      message: 'Event dispatched to Zapier'
    };
  } catch (directErr: any) {
    console.error('[Zapier Trigger] Direct webhook dispatch failed:', directErr);
    return {
      success: false,
      error: directErr.message || 'Failed to dispatch to Zapier webhook'
    };
  }
}

/**
 * Sends a test ping to Zapier with realistic sample boutique data
 */
export async function sendTestZapierPing(): Promise<ZapierWebhookResponse> {
  try {
    const res = await fetch('/api/zapier/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success ?? true,
        status: 200,
        message: data.message || 'Test webhook successfully sent to Zapier!'
      };
    }
  } catch (err) {
    console.warn('Backend test ping failed, falling back to direct test:', err);
  }

  return triggerZapierEvent('test.ping', {
    test_id: `PING-${Date.now()}`,
    source: 'AL Noureen Admin Diagnostic',
    notes: 'Test ping from AL Noureen Haute Couture Web Application',
    sample_order: {
      id: 'ALN-TEST-9021',
      customer_name: 'Amina Al-Mansoor',
      customer_email: 'amina.mansoor@example.com',
      total_amount: 18500,
      currency: 'INR',
      items: 'Zardozi Royal Velvet Abaya (x1, M)'
    }
  });
}

/**
 * Fetches Zapier status and recent dispatch history from the backend
 */
export async function getZapierStatus(): Promise<{
  success: boolean;
  webhookUrl: string;
  isConfigured: boolean;
  recentLogs: ZapierWebhookLog[];
}> {
  try {
    const res = await fetch('/api/zapier/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to retrieve Zapier status from backend:', err);
  }

  return {
    success: true,
    webhookUrl: ZAPIER_WEBHOOK_URL,
    isConfigured: true,
    recentLogs: []
  };
}
