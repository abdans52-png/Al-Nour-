import { jsPDF } from 'jspdf';
import { Order, Currency } from '../types';
import { formatPrice, CURRENCY_RATES } from './currency';
import { MERCHANT_NAME, MERCHANT_PHONE, MERCHANT_UPI_ID } from './paymentGateway';

export interface CustomInvoiceBranding {
  logoUrl?: string;
  brandName?: string;
  brandSubtitle?: string;
  brandArabic?: string;
  brandTagline?: string;
  gstNumber?: string;
  atelierLocation?: string;
  contactPhone?: string;
  merchantUpiId?: string;
  careInstructions?: string;
  invoiceTermsNote?: string;
}

/**
 * Loads an image from a URL or Data URL and returns a Base64 PNG/JPEG Data URL safe for jsPDF.
 */
async function loadImgDataUrl(src: string): Promise<{ dataUrl: string; format: 'PNG' | 'JPEG' } | null> {
  if (!src) return null;
  if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) {
    return { dataUrl: src, format: 'JPEG' };
  }
  if (src.startsWith('data:image/png')) {
    return { dataUrl: src, format: 'PNG' };
  }
  if (src.startsWith('data:image/webp') || src.startsWith('data:image/svg')) {
    // Convert WebP/SVG to PNG on Canvas
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 200;
          canvas.height = img.naturalHeight || 200;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve({ dataUrl: canvas.toDataURL('image/png'), format: 'PNG' });
            return;
          }
        } catch {}
        resolve(null);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  // Remote HTTPS image URL
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 240;
        canvas.height = img.naturalHeight || 240;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve({ dataUrl: canvas.toDataURL('image/png'), format: 'PNG' });
          return;
        }
      } catch {}
      resolve(null);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Generates and downloads an official tax invoice PDF for an order with dynamic logo and site settings.
 */
export const generateInvoicePdf = async (
  order: Order,
  currency: Currency | string = 'INR',
  customBranding?: CustomInvoiceBranding
): Promise<string> => {
  // Read any saved site content branding from localStorage if not explicitly passed
  let branding: CustomInvoiceBranding = customBranding || {};
  if (!branding.logoUrl || !branding.brandName) {
    try {
      const saved = localStorage.getItem('alnoureen_site_content_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        branding = {
          logoUrl: branding.logoUrl || parsed.logoUrl,
          brandName: branding.brandName || parsed.brandName,
          brandSubtitle: branding.brandSubtitle || parsed.brandSubtitle,
          brandArabic: branding.brandArabic || parsed.brandArabic,
          brandTagline: branding.brandTagline || parsed.brandTagline,
          gstNumber: branding.gstNumber || parsed.invoiceGstNumber,
          atelierLocation: branding.atelierLocation || parsed.invoiceAtelierLocation,
          contactPhone: branding.contactPhone || parsed.contactPhone,
          merchantUpiId: branding.merchantUpiId || parsed.merchantUpiId,
          careInstructions: branding.careInstructions || parsed.invoiceCareInstructions,
          invoiceTermsNote: branding.invoiceTermsNote || parsed.invoiceTermsNote
        };
      }
    } catch {}
  }

  const brandName = branding.brandName || 'AL NOUREEN';
  const brandSubtitle = branding.brandSubtitle || 'by Nasreen';
  const brandTagline = branding.brandTagline || 'Two Lights. One Beautiful Vision.';
  const brandLocation = branding.atelierLocation || 'MUMBAI, MAHARASHTRA, INDIA';
  const gstNum = branding.gstNumber || '27AAECN9482M1Z5';
  const contactPhone = branding.contactPhone || MERCHANT_PHONE;
  const merchantUpi = branding.merchantUpiId || MERCHANT_UPI_ID;

  const safeCurrency: Currency =
    (currency as Currency) in CURRENCY_RATES ? (currency as Currency) : 'INR';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkObsidian = [24, 20, 17] as const;
  const royalGold = [197, 155, 39] as const;
  const lightGold = [245, 215, 127] as const;
  const warmCream = [250, 247, 242] as const;
  const darkCream = [244, 239, 230] as const;
  const borderTan = [222, 211, 188] as const;
  const textDark = [30, 26, 23] as const;
  const textMuted = [107, 99, 91] as const;
  const greenPaid = [10, 123, 84] as const;

  // Background subtle tint
  doc.setFillColor(warmCream[0], warmCream[1], warmCream[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer decorative border
  doc.setDrawColor(borderTan[0], borderTan[1], borderTan[2]);
  doc.setLineWidth(0.6);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);

  doc.setDrawColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.setLineWidth(0.2);
  doc.rect(margin - 2.5, margin - 2.5, contentWidth + 5, pageHeight - (margin * 2) + 5);

  let currentY = margin;

  // 1. TOP HEADER BANNER
  doc.setFillColor(darkObsidian[0], darkObsidian[1], darkObsidian[2]);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'F');

  // Custom Logo or Gold Crest Box on the left of Header
  doc.setFillColor(18, 14, 11);
  doc.roundedRect(margin + 3, currentY + 3, 20, 20, 1.5, 1.5, 'F');
  doc.setDrawColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 3, currentY + 3, 20, 20, 1.5, 1.5, 'S');

  // Check if custom logo image exists
  let loadedLogo: { dataUrl: string; format: 'PNG' | 'JPEG' } | null = null;
  if (branding.logoUrl) {
    try {
      loadedLogo = await loadImgDataUrl(branding.logoUrl);
    } catch {}
  }

  if (loadedLogo) {
    try {
      doc.addImage(
        loadedLogo.dataUrl,
        loadedLogo.format,
        margin + 4,
        currentY + 4,
        18,
        18,
        undefined,
        'FAST'
      );
    } catch (e) {
      console.warn('doc.addImage fallback:', e);
      loadedLogo = null;
    }
  }

  // Draw Gold Calligraphy Crest inside the box if no uploaded logo rendered
  if (!loadedLogo) {
    doc.setDrawColor(lightGold[0], lightGold[1], lightGold[2]);
    doc.setLineWidth(0.5);
    // Outer flame contour
    doc.lines([[2, -5], [4, -8], [0, -3], [-3, 6], [-3, 10]], margin + 13, currentY + 18, [1, 1], 'S');
    // Inner loops & Arabic calligraphy strokes
    doc.lines([[-3, -4], [0, -4], [3, 2], [3, 6]], margin + 13, currentY + 16, [1, 1], 'S');
    // Nuqta gold diamond dots
    doc.setFillColor(lightGold[0], lightGold[1], lightGold[2]);
    doc.circle(margin + 9, currentY + 11, 0.6, 'F');
    doc.circle(margin + 17, currentY + 12, 0.6, 'F');
    doc.circle(margin + 12, currentY + 20, 0.5, 'F');
    doc.circle(margin + 14, currentY + 20, 0.5, 'F');
  }

  // Brand Name & Details in Header
  doc.setTextColor(lightGold[0], lightGold[1], lightGold[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${brandName} ${brandSubtitle}`.toUpperCase(), margin + 26, currentY + 10.5);

  // Mini Star Divider in PDF: — ✦ —
  doc.setDrawColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.setLineWidth(0.2);
  doc.line(margin + 26, currentY + 13.5, margin + 48, currentY + 13.5);
  doc.setFontSize(6.5);
  doc.text('✦', margin + 50, currentY + 14);
  doc.line(margin + 53, currentY + 13.5, margin + 75, currentY + 13.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(215, 200, 180);
  doc.text(brandLocation, margin + 26, currentY + 19);
  doc.text(`Reg: ${gstNum} | ${brandTagline}`, margin + 26, currentY + 23);

  // Invoice badge on right
  doc.setFillColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.roundedRect(pageWidth - margin - 52, currentY + 4, 46, 8.5, 1.5, 1.5, 'F');
  doc.setTextColor(darkObsidian[0], darkObsidian[1], darkObsidian[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TAX INVOICE / BILL', pageWidth - margin - 29, currentY + 9.8, { align: 'center' });

  // Paid Status Pill
  doc.setFillColor(greenPaid[0], greenPaid[1], greenPaid[2]);
  doc.roundedRect(pageWidth - margin - 52, currentY + 14, 46, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('PAYMENT CONFIRMED (PAID)', pageWidth - margin - 29, currentY + 18.2, { align: 'center' });

  currentY += 31;

  // 2. INVOICE META & CUSTOMER DETAILS (2 Columns)
  const colWidth = (contentWidth - 6) / 2;
  const atelierBatchNumber = `ATELIER-BATCH-${order.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-2026`;

  // Left Column: Order & Invoice Meta
  doc.setFillColor(darkCream[0], darkCream[1], darkCream[2]);
  doc.roundedRect(margin, currentY, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(borderTan[0], borderTan[1], borderTan[2]);
  doc.roundedRect(margin, currentY, colWidth, 42, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.text('INVOICE & ORDER SUMMARY', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  doc.text(`Invoice No: INV-${order.id}`, margin + 4, currentY + 11.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.text(`Atelier Batch #: ${atelierBatchNumber}`, margin + 4, currentY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Order Reference: ${order.id}`, margin + 4, currentY + 21.5);
  doc.text(`Order Date: ${order.date}`, margin + 4, currentY + 26.5);
  doc.text(`Payment Mode: ${order.paymentMethod}`, margin + 4, currentY + 31.5);
  doc.text(`Merchant VPA: ${merchantUpi}`, margin + 4, currentY + 36.5);

  // Right Column: Shipping & Customer Details
  const rightColX = margin + colWidth + 6;
  doc.setFillColor(darkCream[0], darkCream[1], darkCream[2]);
  doc.roundedRect(rightColX, currentY, colWidth, 42, 2, 2, 'F');
  doc.setDrawColor(borderTan[0], borderTan[1], borderTan[2]);
  doc.roundedRect(rightColX, currentY, colWidth, 42, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.text('BILLED & SHIPPED TO', rightColX + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(order.shippingAddress.fullName, rightColX + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  
  const addressLine1 = order.shippingAddress.street;
  const addressLine2 = `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`;
  
  doc.text(addressLine1.substring(0, 42), rightColX + 4, currentY + 18);
  doc.text(addressLine2.substring(0, 42), rightColX + 4, currentY + 24);
  doc.text(`Contact: ${order.shippingAddress.phone}`, rightColX + 4, currentY + 30);
  doc.text(`Email: ${order.shippingAddress.email}`, rightColX + 4, currentY + 36);

  currentY += 47;

  // 3. LOGISTICS DISPATCH BANNER
  doc.setFillColor(242, 236, 225);
  doc.roundedRect(margin, currentY, contentWidth, 10, 1.5, 1.5, 'F');
  doc.setDrawColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 10, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`COURIER: ${order.carrier}`, margin + 4, currentY + 6.5);
  doc.text(`TRACKING AWB: ${order.trackingNumber}`, margin + 65, currentY + 6.5);
  doc.text(`EST. DELIVERY: ${order.estimatedDelivery}`, pageWidth - margin - 4, currentY + 6.5, { align: 'right' });

  currentY += 14;

  // 4. ITEM DETAILS TABLE
  doc.setFillColor(darkObsidian[0], darkObsidian[1], darkObsidian[2]);
  doc.rect(margin, currentY, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(lightGold[0], lightGold[1], lightGold[2]);

  doc.text('ITEM DESCRIPTION', margin + 4, currentY + 5.5);
  doc.text('SIZE / COLOR', margin + 95, currentY + 5.5);
  doc.text('QTY', margin + 130, currentY + 5.5, { align: 'center' });
  doc.text('UNIT PRICE', margin + 155, currentY + 5.5, { align: 'right' });
  doc.text('AMOUNT', pageWidth - margin - 4, currentY + 5.5, { align: 'right' });

  currentY += 8;

  const items = order.items && order.items.length > 0 ? order.items : [];
  
  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 249, isEven ? 255 : 246, isEven ? 255 : 240);
    doc.rect(margin, currentY, contentWidth, 12, 'F');
    
    doc.setDrawColor(borderTan[0], borderTan[1], borderTan[2]);
    doc.setLineWidth(0.15);
    doc.line(margin, currentY + 12, pageWidth - margin, currentY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(item.name.substring(0, 48), margin + 4, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Authentic ${brandName} ${brandSubtitle} Handcrafted Atelier Garment`, margin + 4, currentY + 9.5);

    const sizeColorStr = `${item.size || 'M'} / ${item.color || 'Standard'}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(sizeColorStr, margin + 95, currentY + 7);

    doc.text(`${item.quantity}`, margin + 130, currentY + 7, { align: 'center' });
    doc.text(formatPrice(item.price, safeCurrency), margin + 155, currentY + 7, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.text(formatPrice(item.price * item.quantity, safeCurrency), pageWidth - margin - 4, currentY + 7, { align: 'right' });

    currentY += 12;
  });

  currentY += 4;

  // 5. ORDER NOTES & FINANCIAL TOTALS
  const summaryBoxWidth = 80;
  const notesBoxWidth = contentWidth - summaryBoxWidth - 6;

  if (order.orderNotes) {
    doc.setFillColor(darkCream[0], darkCream[1], darkCream[2]);
    doc.roundedRect(margin, currentY, notesBoxWidth, 40, 2, 2, 'F');
    doc.setDrawColor(royalGold[0], royalGold[1], royalGold[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, notesBoxWidth, 40, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(royalGold[0], royalGold[1], royalGold[2]);
    doc.text('SPECIAL INSTRUCTIONS / ATELIER NOTES', margin + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    
    const splitNotes = doc.splitTextToSize(order.orderNotes, notesBoxWidth - 8);
    doc.text(splitNotes.slice(0, 5), margin + 4, currentY + 12);
  } else {
    doc.setFillColor(darkCream[0], darkCream[1], darkCream[2]);
    doc.roundedRect(margin, currentY, notesBoxWidth, 40, 2, 2, 'F');
    doc.setDrawColor(borderTan[0], borderTan[1], borderTan[2]);
    doc.roundedRect(margin, currentY, notesBoxWidth, 40, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(royalGold[0], royalGold[1], royalGold[2]);
    doc.text('ATELIER LUXURY GUARANTEE', margin + 4, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('Each garment is thoroughly inspected by master artisans before dispatch.', margin + 4, currentY + 12);
    doc.text(branding.careInstructions || 'Dry clean only. Store in provided breathable muslin garment bag.', margin + 4, currentY + 18);
    doc.text('For complimentary bespoke sizing alterations or styling inquiries,', margin + 4, currentY + 24);
    doc.text(`connect with your atelier stylist on WhatsApp: ${contactPhone}`, margin + 4, currentY + 30);
  }

  // Right: Totals Calculation Box
  const summaryX = pageWidth - margin - summaryBoxWidth;
  doc.setFillColor(darkCream[0], darkCream[1], darkCream[2]);
  doc.roundedRect(summaryX, currentY, summaryBoxWidth, 40, 2, 2, 'F');
  doc.setDrawColor(borderTan[0], borderTan[1], borderTan[2]);
  doc.roundedRect(summaryX, currentY, summaryBoxWidth, 40, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);

  doc.text('Subtotal:', summaryX + 4, currentY + 7);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(formatPrice(order.subtotal, safeCurrency), pageWidth - margin - 4, currentY + 7, { align: 'right' });

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Couture Discount:', summaryX + 4, currentY + 14);
  doc.setTextColor(180, 40, 40);
  doc.text(
    order.discount > 0 ? `-${formatPrice(order.discount, safeCurrency)}` : 'N/A',
    pageWidth - margin - 4,
    currentY + 14,
    { align: 'right' }
  );

  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Insured Delivery:', summaryX + 4, currentY + 21);
  doc.setTextColor(greenPaid[0], greenPaid[1], greenPaid[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPLIMENTARY', pageWidth - margin - 4, currentY + 21, { align: 'right' });

  // Grand Total Highlight Ribbon
  doc.setFillColor(darkObsidian[0], darkObsidian[1], darkObsidian[2]);
  doc.roundedRect(summaryX + 2, currentY + 26, summaryBoxWidth - 4, 11, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(lightGold[0], lightGold[1], lightGold[2]);
  doc.text('TOTAL PAID:', summaryX + 5, currentY + 33.5);
  doc.setFontSize(10);
  doc.text(formatPrice(order.total, safeCurrency), pageWidth - margin - 6, currentY + 33.5, { align: 'right' });

  currentY += 46;

  // 6. BOTTOM SIGN-OFF & ATELIER SEAL
  doc.setDrawColor(borderTan[0], borderTan[1], borderTan[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(
    branding.invoiceTermsNote || `This is a certified digital tax invoice issued by ${brandName} ${brandSubtitle}. All applicable taxes & duties included.`,
    margin,
    currentY
  );
  doc.text(
    `Atelier Concierge: ${contactPhone} | UPI Verified VPA: ${merchantUpi} | Website: al-noureen.com`,
    margin,
    currentY + 4
  );

  // Authorized Signatory Emblem on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(royalGold[0], royalGold[1], royalGold[2]);
  doc.text(`${brandName} ${brandSubtitle} ATELIER`.toUpperCase(), pageWidth - margin, currentY, { align: 'right' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Authorized Digital Signatory • Mumbai Atelier', pageWidth - margin, currentY + 4, { align: 'right' });

  const safeFileName = `${brandName.replace(/\s+/g, '-')}-${brandSubtitle.replace(/\s+/g, '-')}-Invoice-${order.id}.pdf`;
  doc.save(safeFileName);
  return safeFileName;
};
