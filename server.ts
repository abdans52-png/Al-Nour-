import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';
import { PRODUCTS } from './src/data/products';

const app = express();
const PORT = 3000;

// Enable CORS and JSON body parsing with high limit for image uploads
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Structure
interface Database {
  products: typeof PRODUCTS;
  offers: Array<{
    id: string;
    code: string;
    title: string;
    description: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    minOrderAmount: number;
    maxDiscount?: number;
    expiryDate: string;
    isActive: boolean;
    usageCount: number;
    highlightBadge?: string;
  }>;
  orders: Array<any>;
  banners: {
    announcementText: string;
    announcementCode: string;
    announcementLink: string;
    isEnabled: boolean;
    heroHeadline: string;
    heroSubtitle: string;
  };
  siteMedia: {
    heroSlides: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      imageUrl: string;
      linkScreen: string;
    }>;
    categoryImages: Record<string, string>;
    lookbookImages: Record<string, string>;
    aboutImages: {
      nasreenPortrait: string;
      atelierCraft: string;
    };
  };
  siteContent?: Record<string, any>;
}

const defaultOffers = [
  {
    id: 'offer-noureen10',
    code: 'NOUREEN10',
    title: 'New Client Atelier Privilege',
    description: 'Enjoy 10% complimentary discount on your inaugural order.',
    discountType: 'percentage' as const,
    discountValue: 10,
    minOrderAmount: 100,
    maxDiscount: 250,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 142,
    highlightBadge: 'Popular'
  },
  {
    id: 'offer-eid2026',
    code: 'EID2026',
    title: 'Eid Al-Fitr Festive Luxury',
    description: 'Flat ₹500 / $25 off on handcrafted Pakistani couture and silk abayas.',
    discountType: 'flat' as const,
    discountValue: 25,
    minOrderAmount: 200,
    expiryDate: '2026-06-30',
    isActive: true,
    usageCount: 89,
    highlightBadge: 'Festive'
  },
  {
    id: 'offer-freeship',
    code: 'FREESHIP',
    title: 'Complimentary Express Courier',
    description: 'Complimentary worldwide insured dispatch on orders above $300.',
    discountType: 'percentage' as const,
    discountValue: 100,
    minOrderAmount: 300,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 312
  }
];

const defaultBanners = {
  announcementText: 'Complimentary Insured Express Delivery Across India & Worldwide on Orders Above ₹5,000 / $150',
  announcementCode: 'NOUREEN10',
  announcementLink: 'shop',
  isEnabled: true,
  heroHeadline: 'Two Lights. One Beautiful Vision.',
  heroSubtitle: 'Luxury Modest Couture, Handcrafted Pakistani Ensembles & Artisanal Abayas.'
};

const defaultSiteMedia = {
  heroSlides: [
    {
      id: 'slide-1',
      title: 'Zardozi Royal Festive Collection',
      subtitle: 'Hand-guided embroidery on pure silk weaves & organza dupattas.',
      category: 'Pakistani Couture',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
      linkScreen: 'pakistani'
    },
    {
      id: 'slide-2',
      title: 'Emirati & Qatari Haute Abayas',
      subtitle: 'Crafted with premium Korean Nida, satin lapels, and crystal accents.',
      category: 'Haute Abayas',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1600&q=85',
      linkScreen: 'abayas'
    },
    {
      id: 'slide-3',
      title: 'Pure Mulberry Silk & Modal Hijabs',
      subtitle: 'Breathable, non-slip luxury drapes tailored for enduring elegance.',
      category: 'Silk Hijabs',
      imageUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1600&q=85',
      linkScreen: 'hijabs'
    }
  ],
  categoryImages: {
    pakistani: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
    abayas: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
    hijabs: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=85',
    modestWear: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
    accessories: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85',
    bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
  },
  lookbookImages: {
    noorUlAin: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=85',
    zomorodVelvet: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    qamarSilk: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85'
  },
  aboutImages: {
    nasreenPortrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    atelierCraft: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85'
  }
};

// Helper to load or initialize DB
function getDB(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.products && Array.isArray(parsed.products)) {
        if (!parsed.siteMedia) {
          parsed.siteMedia = defaultSiteMedia;
          saveDB(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to defaults:', err);
  }

  const initialDB: Database = {
    products: PRODUCTS,
    offers: defaultOffers,
    orders: [],
    banners: defaultBanners,
    siteMedia: defaultSiteMedia
  };

  saveDB(initialDB);
  return initialDB;
}

function saveDB(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// -------------------------------------------------------------
// ZAPIER WEBHOOK & AUTOMATION ENGINE
// -------------------------------------------------------------
const ZAPIER_WEBHOOK_URL =
  process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/28715190/4hr2x62/';

interface WebhookLog {
  id: string;
  event: string;
  timestamp: string;
  status: 'success' | 'failed';
  statusCode?: number;
  error?: string;
  summary: string;
}

const recentWebhookLogs: WebhookLog[] = [];

/**
 * Dispatches structured event payloads to the Zapier Webhook catch endpoint
 */
async function dispatchZapierWebhook(
  event: string,
  payload: any
): Promise<{ success: boolean; status?: number; error?: string }> {
  const logId = `wh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // Construct structured payload with both flattened top-level and nested raw data
  const webhookBody: Record<string, any> = {
    event_type: event,
    event_name: event,
    event_source: 'AL Noureen Haute Couture Platform',
    timestamp,
    app_environment: process.env.NODE_ENV || 'production',
    raw_payload: payload
  };

  // Extract key order properties to root level for instant Zapier field mapping
  if (event.startsWith('order') && payload) {
    webhookBody.order_id = payload.id || payload.orderId;
    webhookBody.customer_name = payload.shippingAddress?.fullName || payload.customerName || 'Client';
    webhookBody.customer_email = payload.shippingAddress?.email || payload.customerEmail || '';
    webhookBody.customer_phone = payload.shippingAddress?.phone || payload.customerPhone || '';
    webhookBody.total_amount = payload.total || 0;
    webhookBody.subtotal = payload.subtotal || 0;
    webhookBody.discount = payload.discount || 0;
    webhookBody.shipping_cost = payload.shipping || 0;
    webhookBody.order_status = payload.status || payload.orderStatus || 'In Atelier Tailoring';
    webhookBody.payment_method = payload.paymentMethod || 'Direct Checkout';
    webhookBody.tracking_number = payload.trackingNumber || '';
    webhookBody.carrier = payload.carrier || 'DHL Express Priority Air';
    webhookBody.items_count = Array.isArray(payload.items) ? payload.items.length : 0;
    webhookBody.items_summary = Array.isArray(payload.items)
      ? payload.items
          .map((it: any) => `${it.name || 'Item'} (Qty: ${it.quantity || 1}, Size: ${it.size || 'M'}, Color: ${it.color || 'Default'})`)
          .join('; ')
      : '';
    webhookBody.shipping_address = payload.shippingAddress
      ? `${payload.shippingAddress.street || ''}, ${payload.shippingAddress.city || ''}, ${payload.shippingAddress.state || ''} ${payload.shippingAddress.postalCode || ''}, ${payload.shippingAddress.country || ''}`
      : '';
  } else if (event.startsWith('contact') && payload) {
    webhookBody.contact_name = payload.name || payload.fullName;
    webhookBody.contact_email = payload.email;
    webhookBody.contact_phone = payload.phone || '';
    webhookBody.contact_subject = payload.subject || payload.inquiryType || 'Atelier Concierge Inquiry';
    webhookBody.contact_message = payload.message || '';
  } else if (event.startsWith('newsletter') && payload) {
    webhookBody.subscriber_email = payload.email;
    webhookBody.subscription_source = payload.source || 'Maison Private Circle';
  } else if (event.startsWith('stock') && payload) {
    webhookBody.product_id = payload.productId;
    webhookBody.product_name = payload.productName;
    webhookBody.requested_size = payload.size;
    webhookBody.requested_color = payload.color;
    webhookBody.customer_contact = payload.emailOrPhone || payload.email;
  } else if (event.startsWith('price_drop') && payload) {
    webhookBody.product_id = payload.productId;
    webhookBody.product_name = payload.productName;
    webhookBody.target_discount = payload.discountPercent;
    webhookBody.customer_contact = payload.emailOrPhone || payload.email;
  } else if (event.startsWith('fabric_swatch') && payload) {
    webhookBody.product_name = payload.productName;
    webhookBody.customer_name = payload.fullName;
    webhookBody.customer_email = payload.email;
    webhookBody.customer_phone = payload.phone;
    webhookBody.swatch_color = payload.selectedColor;
    webhookBody.shipping_address = `${payload.street || ''}, ${payload.city || ''}, ${payload.state || ''} ${payload.postalCode || ''}, ${payload.country || ''}`;
  }

  // Copy non-colliding primitive fields from payload
  if (typeof payload === 'object' && payload !== null) {
    for (const [k, v] of Object.entries(payload)) {
      if (!(k in webhookBody) && typeof v !== 'object') {
        webhookBody[k] = v;
      }
    }
  }

  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AL-Noureen-Zapier-Integration/1.0'
      },
      body: JSON.stringify(webhookBody)
    });

    const isOk = response.ok;
    const statusCode = response.status;

    const logEntry: WebhookLog = {
      id: logId,
      event,
      timestamp,
      status: isOk ? 'success' : 'failed',
      statusCode,
      summary: `Dispatched ${event} to Zapier [${statusCode}]`
    };
    recentWebhookLogs.unshift(logEntry);
    if (recentWebhookLogs.length > 50) recentWebhookLogs.pop();

    console.log(`[Zapier Webhook] ${event} dispatched -> ${statusCode}`);
    return { success: isOk, status: statusCode };
  } catch (err: any) {
    const logEntry: WebhookLog = {
      id: logId,
      event,
      timestamp,
      status: 'failed',
      error: err.message,
      summary: `Failed ${event} -> ${err.message}`
    };
    recentWebhookLogs.unshift(logEntry);
    if (recentWebhookLogs.length > 50) recentWebhookLogs.pop();

    console.error(`[Zapier Webhook Error] Failed to dispatch ${event}:`, err.message);
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Products API
app.get('/api/products', (req, res) => {
  const db = getDB();
  res.json({ success: true, count: db.products.length, data: db.products });
});

app.post('/api/products', (req, res) => {
  try {
    const db = getDB();
    const newProduct = req.body;
    if (!newProduct.id) {
      newProduct.id = `product-${Date.now()}`;
    }
    db.products.unshift(newProduct);
    saveDB(db);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const index = db.products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    db.products[index] = { ...db.products[index], ...req.body, id };
    saveDB(db);
    res.json({ success: true, data: db.products[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const initialLen = db.products.length;
    db.products = db.products.filter((p: any) => p.id !== id);
    if (db.products.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    saveDB(db);
    res.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Offers / Promo Codes API
app.get('/api/offers', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.offers || [] });
});

app.post('/api/offers', (req, res) => {
  try {
    const db = getDB();
    const newOffer = {
      id: `offer-${Date.now()}`,
      usageCount: 0,
      isActive: true,
      ...req.body
    };
    if (!db.offers) db.offers = [];
    db.offers.unshift(newOffer);
    saveDB(db);
    res.status(201).json({ success: true, data: newOffer });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/offers/:id', (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!db.offers) db.offers = [];
    const index = db.offers.findIndex((o: any) => o.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Offer not found' });
    }
    db.offers[index] = { ...db.offers[index], ...req.body, id };
    saveDB(db);
    res.json({ success: true, data: db.offers[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/offers/:id', (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!db.offers) db.offers = [];
    db.offers = db.offers.filter((o: any) => o.id !== id);
    saveDB(db);
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Orders API
app.get('/api/orders', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.orders || [] });
});

app.post('/api/orders', (req, res) => {
  try {
    const db = getDB();
    const newOrder = req.body;
    if (!db.orders) db.orders = [];
    db.orders.unshift(newOrder);
    saveDB(db);

    // Asynchronously dispatch order.created event to Zapier
    dispatchZapierWebhook('order.created', newOrder).catch((err) => {
      console.error('[Zapier Order Trigger Error]:', err);
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!db.orders) db.orders = [];
    const index = db.orders.findIndex((o: any) => o.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    db.orders[index] = { ...db.orders[index], ...req.body, id };
    saveDB(db);

    // Asynchronously dispatch order.status_updated event to Zapier
    dispatchZapierWebhook('order.status_updated', {
      orderId: id,
      orderStatus: req.body.status || req.body.orderStatus || db.orders[index].status,
      trackingNumber: req.body.trackingNumber || db.orders[index].trackingNumber,
      updatedOrder: db.orders[index]
    }).catch((err) => {
      console.error('[Zapier Order Update Trigger Error]:', err);
    });

    res.json({ success: true, data: db.orders[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Banners & Site Announcements API
app.get('/api/banners', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.banners || defaultBanners });
});

app.put('/api/banners', (req, res) => {
  try {
    const db = getDB();
    db.banners = { ...db.banners, ...req.body };
    saveDB(db);
    res.json({ success: true, data: db.banners });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Site Media & Images API (Change Any Image)
app.get('/api/media', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.siteMedia || defaultSiteMedia });
});

app.put('/api/media', (req, res) => {
  try {
    const db = getDB();
    db.siteMedia = { ...db.siteMedia, ...req.body };
    saveDB(db);
    res.json({ success: true, data: db.siteMedia });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5b. Dynamic Site Content, Texts & Brand Logo API
app.get('/api/site-content', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.siteContent || {} });
});

app.put('/api/site-content', (req, res) => {
  try {
    const db = getDB();
    db.siteContent = { ...(db.siteContent || {}), ...req.body };
    saveDB(db);
    res.json({ success: true, data: db.siteContent });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Image Upload / Asset API
app.post('/api/upload', (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'imageBase64 is required' });
    }
    // Return the data URL or base64 directly so it can be previewed and stored in products list
    res.json({
      success: true,
      imageUrl: imageBase64,
      filename: filename || 'uploaded_image.jpg'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Zapier Webhooks & Automation APIs
app.get('/api/zapier/status', (req, res) => {
  res.json({
    success: true,
    webhookUrl: ZAPIER_WEBHOOK_URL,
    isConfigured: true,
    recentLogs: recentWebhookLogs
  });
});

app.post('/api/zapier/trigger', async (req, res) => {
  try {
    const { event, payload } = req.body;
    if (!event) {
      return res.status(400).json({ success: false, error: 'Event name is required' });
    }
    const result = await dispatchZapierWebhook(event, payload || {});
    res.json({ success: result.success, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/zapier/test', async (req, res) => {
  try {
    const testPayload = {
      id: `ALN-TEST-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: 'Amina Al-Mansoor',
      customerEmail: 'amina.mansoor@example.com',
      customerPhone: '+91 98200 45678',
      total: 18500,
      currency: 'INR',
      status: 'Test Ping Received',
      paymentMethod: 'Zapier Automation Diagnostic',
      carrier: 'DHL Express Priority Air',
      trackingNumber: `DHL-TEST-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      shippingAddress: {
        fullName: 'Amina Al-Mansoor',
        email: 'amina.mansoor@example.com',
        phone: '+91 98200 45678',
        street: '42 Altamount Road, Cumballa Hill',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400026'
      },
      items: [
        {
          name: 'Zardozi Royal Velvet Abaya & Silk Hijab Set',
          quantity: 1,
          size: 'M (56")',
          color: 'Midnight Emerald & Antique Gold',
          price: 18500
        }
      ],
      notes: 'Diagnostic verification from AL Noureen Haute Couture Platform to confirm Zapier workflow listener connectivity.'
    };

    const result = await dispatchZapierWebhook('test.ping', testPayload);
    res.json({
      success: result.success,
      message: result.success
        ? 'Zapier test webhook dispatched successfully! Check your Zapier Zap history.'
        : 'Zapier webhook returned a non-200 status.',
      ...result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Contact / Concierge Inquiries API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, inquiryType, message } = req.body;
    const contactData = {
      id: `contact-${Date.now()}`,
      name: name || 'Valued Client',
      email: email || '',
      phone: phone || '',
      inquiryType: inquiryType || 'General Inquiry',
      message: message || '',
      timestamp: new Date().toISOString()
    };

    // Forward to Zapier asynchronously
    dispatchZapierWebhook('contact.submitted', contactData).catch((err) => {
      console.error('[Zapier Contact Trigger Error]:', err);
    });

    res.json({ success: true, message: 'Inquiry registered and dispatched.', data: contactData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Newsletter VIP Subscription API
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const subscriberData = {
      id: `sub-${Date.now()}`,
      email,
      source: source || 'Maison Private Circle',
      timestamp: new Date().toISOString()
    };

    // Forward to Zapier asynchronously
    dispatchZapierWebhook('newsletter.subscribed', subscriberData).catch((err) => {
      console.error('[Zapier Newsletter Trigger Error]:', err);
    });

    res.json({ success: true, message: 'VIP Circle subscription activated.', data: subscriberData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. Reset Factory Catalog API
app.post('/api/reset-factory', (req, res) => {
  try {
    const initialDB: Database = {
      products: PRODUCTS,
      offers: defaultOffers,
      orders: [],
      banners: defaultBanners,
      siteMedia: defaultSiteMedia
    };
    saveDB(initialDB);
    res.json({ success: true, message: 'Database reset to factory defaults' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. Razorpay Gateway API & Payment Verification
let razorpayClient: any = null;
function getRazorpay(): any {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TSNf0OSCTf7Uv3';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'E6At58j4nHgcyYaUexhlpRIc';
  if (!razorpayClient && key_id && key_secret) {
    try {
      razorpayClient = new (Razorpay as any)({
        key_id,
        key_secret
      });
    } catch (err: any) {
      console.warn('Razorpay SDK lazy initialization notice:', err?.message || err);
    }
  }
  return razorpayClient;
}

app.get('/api/razorpay/config', (req, res) => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TSNf0OSCTf7Uv3';
  res.json({
    success: true,
    keyId: key_id,
    merchantName: 'AL Noureen by Nasreen',
    isConfigured: true
  });
});

app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TSNf0OSCTf7Uv3';
    const amountInPaise = Math.max(100, Math.round(Number(amount || 1) * 100));
    const rzp = getRazorpay();

    if (rzp && rzp.orders) {
      try {
        const rzpOrder = await rzp.orders.create({
          amount: amountInPaise,
          currency: currency || 'INR',
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {}
        });
        return res.json({
          success: true,
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: key_id
        });
      } catch (rzpErr: any) {
        console.warn('Razorpay server order creation notice:', rzpErr?.message || rzpErr);
      }
    }

    // Direct sandbox simulated order ID for instant test execution
    const fallbackOrderId = `order_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    res.json({
      success: true,
      orderId: fallbackOrderId,
      amount: amountInPaise,
      currency: currency || 'INR',
      keyId: key_id,
      simulated: true
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/razorpay/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'E6At58j4nHgcyYaUexhlpRIc';

    let isValid = true;
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature && key_secret) {
      try {
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', key_secret)
          .update(body.toString())
          .digest('hex');
        isValid = expectedSignature === razorpay_signature;
      } catch (err) {
        console.warn('Signature verification calculation:', err);
      }
    }

    if (orderData) {
      const db = getDB();
      if (!db.orders) db.orders = [];
      const existsIndex = db.orders.findIndex((o: any) => o.id === orderData.id);
      if (existsIndex === -1) {
        db.orders.unshift(orderData);
      } else {
        db.orders[existsIndex] = { ...db.orders[existsIndex], ...orderData };
      }
      saveDB(db);

      // Asynchronously trigger Zapier workflow
      dispatchZapierWebhook('order.created', {
        ...orderData,
        paymentMethod: `Razorpay Online Payment (Txn ID: ${razorpay_payment_id || 'RZP_AUTH_OK'})`,
        razorpay_payment_id,
        razorpay_order_id
      }).catch((err) => {
        console.error('[Zapier Webhook Payment Trigger Error]:', err);
      });
    }

    res.json({
      success: true,
      verified: isValid,
      paymentId: razorpay_payment_id || `pay_${Date.now()}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/razorpay/create-payment-link', async (req, res) => {
  try {
    const { amount, currency = 'INR', customer, description } = req.body;
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TSNf0OSCTf7Uv3';
    const amountInPaise = Math.max(100, Math.round(Number(amount || 1) * 100));
    const rzp = getRazorpay();

    if (rzp && rzp.paymentLink) {
      try {
        const paymentLink = await rzp.paymentLink.create({
          amount: amountInPaise,
          currency: currency || 'INR',
          accept_partial: false,
          description: description || 'AL Noureen Haute Couture Acquisition',
          customer: {
            name: customer?.name || 'Valued Patron',
            email: customer?.email || 'patron@example.com',
            contact: customer?.phone || '+919326294187'
          },
          notify: {
            sms: true,
            email: true
          },
          reminder_enable: true,
          notes: {
            merchant: 'AL Noureen by Nasreen'
          }
        });

        return res.json({
          success: true,
          paymentUrl: paymentLink.short_url,
          paymentLinkId: paymentLink.id
        });
      } catch (linkErr: any) {
        console.warn('Razorpay payment link creation notice:', linkErr?.message || linkErr);
      }
    }

    // Direct fallback payment link
    const fallbackPaymentUrl = `https://rzp.io/l/alnoureen-${Date.now()}`;
    res.json({
      success: true,
      paymentUrl: fallbackPaymentUrl,
      simulated: true
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 12. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    zapierConfigured: !!ZAPIER_WEBHOOK_URL
  });
});

// -------------------------------------------------------------
// VITE INTEGRATION & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AL NOUREEN Backend Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
