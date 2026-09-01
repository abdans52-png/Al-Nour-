import { Product, PromoOffer, Order } from '../types';
import { PRODUCTS } from '../data/products';
import { triggerZapierEvent, sendTestZapierPing, getZapierStatus, ZapierWebhookLog } from './zapier';
import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
  cleanFirestoreData
} from '../lib/firebase';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

export interface SiteBanners {
  announcementText: string;
  announcementCode: string;
  announcementLink: string;
  isEnabled: boolean;
  heroHeadline: string;
  heroSubtitle: string;
}

export interface SiteMedia {
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
}

// -------------------------------------------------------------
// PRODUCTS API WITH FIRESTORE SYNCHRONIZATION
// -------------------------------------------------------------

export async function apiGetProducts(): Promise<Product[]> {
  // 1. Try Firestore
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (!snap.empty) {
      const prods: Product[] = [];
      snap.forEach((d) => prods.push(d.data() as Product));
      return prods;
    }
  } catch (err: any) {
    console.warn('Firestore get products notice:', err?.message || err);
  }

  // 2. Try Backend Express API
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API /api/products request failed:', err);
  }

  // 3. Local fallback
  try {
    const local = localStorage.getItem('alnoureen_custom_products');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return PRODUCTS;
}

export async function apiCreateProduct(product: Product): Promise<Product> {
  // Try Firestore
  try {
    await setDoc(doc(db, 'products', product.id), cleanFirestoreData(product));
  } catch (err) {
    console.warn('Firestore setDoc product fallback:', err);
  }

  // Try Express API
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || product;
    }
  } catch (err) {
    console.error('API create product error:', err);
  }

  return product;
}

export async function apiUpdateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  // Try Firestore
  try {
    await updateDoc(doc(db, 'products', id), cleanFirestoreData(updates));
  } catch (err) {
    console.warn('Firestore updateDoc product fallback:', err);
  }

  // Try Express API
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || null;
    }
  } catch (err) {
    console.error('API update product error:', err);
  }
  return null;
}

export async function apiDeleteProduct(id: string): Promise<boolean> {
  // Try Firestore
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (err) {
    console.warn('Firestore deleteDoc product fallback:', err);
  }

  // Try Express API
  try {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('API delete product error:', err);
    return false;
  }
}

// -------------------------------------------------------------
// OFFERS & PROMO CODES API
// -------------------------------------------------------------

export async function apiGetOffers(): Promise<PromoOffer[]> {
  // 1. Try Firestore
  try {
    const snap = await getDocs(collection(db, 'offers'));
    if (!snap.empty) {
      const offers: PromoOffer[] = [];
      snap.forEach((d) => offers.push(d.data() as PromoOffer));
      return offers;
    }
  } catch (err) {
    console.warn('Firestore get offers fallback:', err);
  }

  // 2. Try API
  try {
    const res = await fetch('/api/offers');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API /api/offers failed:', err);
  }

  // 3. Local fallback
  try {
    const local = localStorage.getItem('alnoureen_custom_offers');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return [
    {
      id: 'offer-noureen10',
      code: 'NOUREEN10',
      title: 'New Client Atelier Privilege',
      description: 'Enjoy 10% complimentary discount on your inaugural order.',
      discountType: 'percentage',
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
      discountType: 'flat',
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
      discountType: 'percentage',
      discountValue: 100,
      minOrderAmount: 300,
      expiryDate: '2026-12-31',
      isActive: true,
      usageCount: 312
    }
  ];
}

export async function apiCreateOffer(offer: Omit<PromoOffer, 'id' | 'usageCount'>): Promise<PromoOffer> {
  const newOffer: PromoOffer = {
    ...offer,
    id: `offer-${Date.now()}`,
    usageCount: 0
  };

  try {
    await setDoc(doc(db, 'offers', newOffer.id), cleanFirestoreData(newOffer));
  } catch (err) {
    console.warn('Firestore setDoc offer fallback:', err);
  }

  try {
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOffer)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || newOffer;
    }
  } catch (err) {
    console.error('API create offer error:', err);
  }

  return newOffer;
}

export async function apiUpdateOffer(id: string, updates: Partial<PromoOffer>): Promise<PromoOffer | null> {
  try {
    await updateDoc(doc(db, 'offers', id), cleanFirestoreData(updates));
  } catch (err) {
    console.warn('Firestore updateDoc offer fallback:', err);
  }

  try {
    const res = await fetch(`/api/offers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.error('API update offer error:', err);
  }
  return null;
}

export async function apiDeleteOffer(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'offers', id));
  } catch (err) {
    console.warn('Firestore deleteDoc offer fallback:', err);
  }

  try {
    const res = await fetch(`/api/offers/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('API delete offer error:', err);
    return false;
  }
}

// -------------------------------------------------------------
// ORDERS API
// -------------------------------------------------------------

export async function apiGetOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const orders: Order[] = [];
      snap.forEach((d) => orders.push(d.data() as Order));
      return orders;
    }
  } catch (err) {
    console.warn('Firestore get orders fallback:', err);
  }

  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('API /api/orders failed:', err);
  }

  return [];
}

export async function apiCreateOrder(order: Order): Promise<Order> {
  // 1. Save to Firestore
  try {
    const sanitized = cleanFirestoreData({
      ...order,
      orderNotes: order.orderNotes || '',
      syncedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'orders', order.id), sanitized);
  } catch (err) {
    console.warn('Firestore setDoc order fallback:', err);
  }

  // 2. Trigger Zapier Webhook (runs on client & backend)
  triggerZapierEvent('order.created', {
    ...order,
    customerName: order.shippingAddress?.fullName || 'Valued Client',
    customerEmail: order.shippingAddress?.email || '',
    customerPhone: order.shippingAddress?.phone || '',
    totalAmount: order.total,
    currency: 'INR'
  }).catch((zErr) => {
    console.warn('Zapier order notification warning:', zErr);
  });

  // 3. Save to backend database
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || order;
    }
  } catch (err) {
    console.error('API create order error:', err);
  }

  return order;
}

export async function apiUpdateOrderStatus(
  orderId: string,
  orderStatus: string,
  trackingNumber?: string
): Promise<boolean> {
  try {
    const sanitized = cleanFirestoreData({
      orderStatus,
      ...(trackingNumber ? { trackingNumber } : {}),
      updatedAt: new Date().toISOString()
    });
    await updateDoc(doc(db, 'orders', orderId), sanitized);
  } catch (err) {
    console.warn('Firestore updateDoc order status fallback:', err);
  }

  // Forward update to Zapier
  triggerZapierEvent('order.status_updated', {
    orderId,
    orderStatus,
    trackingNumber: trackingNumber || '',
    updatedAt: new Date().toISOString()
  }).catch((zErr) => {
    console.warn('Zapier status update warning:', zErr);
  });

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus, trackingNumber })
    });
    return res.ok;
  } catch (err) {
    console.error('API update order status error:', err);
    return false;
  }
}

// -------------------------------------------------------------
// BANNERS API
// -------------------------------------------------------------

export async function apiGetBanners(): Promise<SiteBanners> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'banners'));
    if (snap.exists()) {
      return snap.data() as SiteBanners;
    }
  } catch (err) {
    console.warn('Firestore get banners fallback:', err);
  }

  try {
    const res = await fetch('/api/banners');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch (err) {
    console.warn('API /api/banners failed:', err);
  }

  return {
    announcementText: 'Complimentary Insured Express Delivery Across India & Worldwide on Orders Above ₹5,000 / $150',
    announcementCode: 'NOUREEN10',
    announcementLink: 'shop',
    isEnabled: true,
    heroHeadline: 'Two Lights. One Beautiful Vision.',
    heroSubtitle: 'Luxury Modest Couture, Handcrafted Pakistani Ensembles & Artisanal Abayas.'
  };
}

export async function apiUpdateBanners(banners: Partial<SiteBanners>): Promise<SiteBanners> {
  try {
    await setDoc(doc(db, 'settings', 'banners'), cleanFirestoreData(banners), { merge: true });
  } catch (err) {
    console.warn('Firestore setDoc banners fallback:', err);
  }

  try {
    const res = await fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banners)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.error('API update banners error:', err);
  }

  return banners as SiteBanners;
}

// -------------------------------------------------------------
// SITE MEDIA & IMAGES API (Change Any Image)
// -------------------------------------------------------------

export const DEFAULT_SITE_MEDIA: SiteMedia = {
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

export async function apiGetMedia(): Promise<SiteMedia> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'media'));
    if (snap.exists()) {
      return snap.data() as SiteMedia;
    }
  } catch (err) {
    console.warn('Firestore get media fallback:', err);
  }

  try {
    const res = await fetch('/api/media');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch (err) {
    console.warn('API /api/media failed, using local/default:', err);
  }

  try {
    const local = localStorage.getItem('alnoureen_custom_media');
    if (local) {
      return JSON.parse(local);
    }
  } catch {}

  return DEFAULT_SITE_MEDIA;
}

export async function apiUpdateMedia(media: Partial<SiteMedia>): Promise<SiteMedia> {
  try {
    await setDoc(doc(db, 'settings', 'media'), cleanFirestoreData(media), { merge: true });
  } catch (err) {
    console.warn('Firestore setDoc media fallback:', err);
  }

  try {
    const res = await fetch('/api/media', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(media)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        try {
          localStorage.setItem('alnoureen_custom_media', JSON.stringify(data.data));
        } catch {}
        return data.data;
      }
    }
  } catch (err) {
    console.error('API update media error:', err);
  }

  return media as SiteMedia;
}

// -------------------------------------------------------------
// RESET TO FACTORY DEFAULTS
// -------------------------------------------------------------
export async function apiResetFactory(): Promise<boolean> {
  try {
    const res = await fetch('/api/reset-factory', { method: 'POST' });
    return res.ok;
  } catch (err) {
    console.error('API reset factory error:', err);
    return false;
  }
}

// -------------------------------------------------------------
// CONTACT & NEWSLETTER APIS WITH ZAPIER WEBHOOKS
// -------------------------------------------------------------
export async function apiSubmitContact(formData: {
  name: string;
  email: string;
  phone?: string;
  inquiryType?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  // Trigger Zapier Webhook
  triggerZapierEvent('contact.submitted', formData).catch((zErr) => {
    console.warn('Zapier contact inquiry warning:', zErr);
  });

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend contact API error:', err);
  }

  return { success: true, message: 'Inquiry received by atelier concierge.' };
}

export async function apiSubscribeNewsletter(
  email: string,
  source: string = 'Maison Private Circle'
): Promise<{ success: boolean; message: string }> {
  // Trigger Zapier Webhook
  triggerZapierEvent('newsletter.subscribed', { email, source }).catch((zErr) => {
    console.warn('Zapier newsletter warning:', zErr);
  });

  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend newsletter API error:', err);
  }

  return { success: true, message: 'VIP Circle subscription registered.' };
}

export { sendTestZapierPing as apiTestZapierWebhook, getZapierStatus as apiGetZapierStatus };
