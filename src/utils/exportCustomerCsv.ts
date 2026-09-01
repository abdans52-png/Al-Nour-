import { Order, Currency } from '../types';
import { formatPrice } from './currency';

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  totalOrders: number;
  totalSpend: number;
  firstOrderDate: string;
  lastOrderDate: string;
  orderIds: string[];
  purchasedItems: string[];
  segment: 'VIP Haute Patron' | 'Repeat Patron' | 'First-Time Client';
}

/**
 * Aggregates order data by customer email/phone to produce a CRM customer list
 */
export function extractCustomerList(orders: Order[]): CustomerSummary[] {
  const customerMap: Record<string, CustomerSummary> = {};

  orders.forEach((order) => {
    // Generate a unique identifier for customer (email or phone or name)
    const emailKey = order.shippingAddress?.email?.trim().toLowerCase();
    const phoneKey = order.shippingAddress?.phone?.trim();
    const nameKey = order.shippingAddress?.fullName?.trim();
    const identifier = emailKey || phoneKey || nameKey || `patron-${order.id}`;

    const orderTotal = Number(order.total) || 0;
    const orderDate = order.date ? new Date(order.date).toISOString().split('T')[0] : 'N/A';
    
    // Extract item titles
    const itemNames = (order.items || []).map((i) => `${i.name} (x${i.quantity || 1})`);

    if (!customerMap[identifier]) {
      customerMap[identifier] = {
        id: identifier,
        name: order.shippingAddress?.fullName || 'Valued Patron',
        email: order.shippingAddress?.email || 'N/A',
        phone: order.shippingAddress?.phone || 'N/A',
        city: order.shippingAddress?.city || 'Mumbai',
        state: order.shippingAddress?.state || 'Maharashtra',
        country: order.shippingAddress?.country || 'India',
        totalOrders: 1,
        totalSpend: orderTotal,
        firstOrderDate: orderDate,
        lastOrderDate: orderDate,
        orderIds: [order.id],
        purchasedItems: [...itemNames],
        segment: 'First-Time Client'
      };
    } else {
      const cust = customerMap[identifier];
      cust.totalOrders += 1;
      cust.totalSpend += orderTotal;
      cust.orderIds.push(order.id);
      cust.purchasedItems.push(...itemNames);
      
      // Update dates
      if (orderDate !== 'N/A') {
        if (cust.firstOrderDate === 'N/A' || orderDate < cust.firstOrderDate) {
          cust.firstOrderDate = orderDate;
        }
        if (cust.lastOrderDate === 'N/A' || orderDate > cust.lastOrderDate) {
          cust.lastOrderDate = orderDate;
        }
      }
      
      // Update missing contact info if available in newer order
      if (cust.email === 'N/A' && order.shippingAddress?.email) cust.email = order.shippingAddress.email;
      if (cust.phone === 'N/A' && order.shippingAddress?.phone) cust.phone = order.shippingAddress.phone;
      if (order.shippingAddress?.city) cust.city = order.shippingAddress.city;
      if (order.shippingAddress?.country) cust.country = order.shippingAddress.country;
    }
  });

  // Calculate customer tier/segment
  return Object.values(customerMap).map((cust) => {
    let segment: 'VIP Haute Patron' | 'Repeat Patron' | 'First-Time Client' = 'First-Time Client';
    if (cust.totalSpend >= 300 || cust.totalOrders >= 3) {
      segment = 'VIP Haute Patron';
    } else if (cust.totalOrders >= 2) {
      segment = 'Repeat Patron';
    }
    return {
      ...cust,
      segment
    };
  }).sort((a, b) => b.totalSpend - a.totalSpend);
}

/**
 * Generates and triggers browser download of the Customer List CSV
 */
export function downloadCustomerListCsv(orders: Order[], currency: Currency = 'INR'): void {
  const customers = extractCustomerList(orders);

  const headers = [
    'Customer ID / Identifier',
    'Full Name',
    'Email Address',
    'Phone / WhatsApp',
    'City',
    'State / Province',
    'Country',
    'Total Orders Count',
    'Lifetime Spend (Formatted)',
    'Lifetime Spend (Raw Number)',
    'Customer Tier / Segment',
    'First Order Date',
    'Last Order Date',
    'Order Reference IDs',
    'Garments Purchased'
  ];

  const rows = customers.map((c) => [
    `"${c.id.replace(/"/g, '""')}"`,
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.email.replace(/"/g, '""')}"`,
    `"${c.phone.replace(/"/g, '""')}"`,
    `"${c.city.replace(/"/g, '""')}"`,
    `"${c.state.replace(/"/g, '""')}"`,
    `"${c.country.replace(/"/g, '""')}"`,
    c.totalOrders,
    `"${formatPrice(c.totalSpend, currency).replace(/"/g, '""')}"`,
    c.totalSpend.toFixed(2),
    `"${c.segment}"`,
    `"${c.firstOrderDate}"`,
    `"${c.lastOrderDate}"`,
    `"${c.orderIds.join(', ')}"`,
    `"${[...new Set(c.purchasedItems)].join('; ').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `al_noureen_customer_crm_export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
