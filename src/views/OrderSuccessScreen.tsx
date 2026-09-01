import React, { useState } from 'react';
import { Order, Currency, ScreenType } from '../types';
import { formatPrice } from '../utils/currency';
import { Logo } from '../components/Logo';
import { useSiteContent } from '../context/SiteContentContext';
import {
  Download,
  Copy,
  Check,
  Package,
  Truck,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  Smartphone,
  Lock,
  ExternalLink,
  PartyPopper,
  FileText,
  Gift,
  Printer,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { openGooglePayApp, openApplePayApp } from '../utils/paymentGateway';
import { ProductImage } from '../components/ProductImage';
import { ConfettiCelebration } from '../components/ConfettiCelebration';
import { generateInvoicePdf } from '../utils/invoicePdf';
import { hapticLight, hapticSuccess } from '../utils/haptics';

interface OrderSuccessScreenProps {
  order: Order | null;
  currency?: Currency;
  onNavigate: (screen: ScreenType) => void;
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
  order,
  currency = 'INR',
  onNavigate
}) => {
  const { siteContent, t } = useSiteContent();
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const triggerConfetti = () => {
    setConfettiKey((prev) => prev + 1);
  };

  // Fallback if no recent order in memory
  const fallbackOrder: Order = {
    id: 'ALN-948210',
    date: 'August 15, 2026',
    itemsCount: 2,
    subtotal: 765,
    discount: 50,
    shipping: 0,
    total: 715,
    status: 'Order Confirmed',
    estimatedDelivery: 'August 22, 2026',
    trackingNumber: 'DHL-IN-8890214829',
    carrier: 'DHL Express Priority Air',
    shippingAddress: {
      fullName: 'Amina Al-Mansoor',
      email: 'amina.mansoor@example.com',
      phone: siteContent.contactPhone || '+91 93262 94187',
      street: '42 Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400026'
    },
    paymentMethod: 'Google Pay (UPI / GPay)',
    items: [
      {
        productId: 'zardozi-velvet-peshwas',
        name: 'Zardozi Velvet Royal Peshwas',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        size: 'M',
        color: 'Emerald Green',
        quantity: 1,
        price: 520
      },
      {
        productId: 'silk-organza-veil',
        name: 'Hand-Embroidered Silk Organza Veil',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        size: 'Free Size',
        color: 'Champagne Gold',
        quantity: 1,
        price: 195
      }
    ]
  };

  const activeOrder = order || fallbackOrder;
  const atelierBatchNumber = `ATELIER-BATCH-${activeOrder.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-2026`;
  const [copiedBatch, setCopiedBatch] = useState(false);

  const handleCopyBatchNumber = () => {
    navigator.clipboard.writeText(atelierBatchNumber);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(activeOrder.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleDownloadPdf = async () => {
    hapticLight();
    setIsGeneratingInvoice(true);
    try {
      await generateInvoicePdf(activeOrder, currency, {
        logoUrl: siteContent.logoUrl,
        brandName: siteContent.brandName,
        brandSubtitle: siteContent.brandSubtitle,
        brandArabic: siteContent.brandArabic,
        brandTagline: siteContent.brandTagline,
        gstNumber: siteContent.invoiceGstNumber,
        atelierLocation: siteContent.invoiceAtelierLocation,
        contactPhone: siteContent.contactPhone,
        merchantUpiId: siteContent.merchantUpiId,
        careInstructions: siteContent.invoiceCareInstructions,
        invoiceTermsNote: siteContent.invoiceTermsNote
      });
      hapticSuccess();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('Error generating PDF bill:', error);
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handlePrintInvoice = () => {
    hapticLight();
    window.print();
  };

  const cleanPhone = (siteContent.whatsappNumber || '+91 93262 94187').replace(/[^0-9]/g, '');
  const whatsappInquiryUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${siteContent.brandName || 'AL-NOUREEN'}, I am inquiring about my Order ${activeOrder.id} placed under ${activeOrder.shippingAddress.fullName}.`
  )}`;

  return (
    <div id="order-success-luxury-view" className="w-full bg-[#FAF7F2] min-h-screen py-8 sm:py-12 px-4 sm:px-6 relative">
      {/* Lottie-Inspired Confetti Animation (Framer Motion) */}
      <ConfettiCelebration triggerKey={confettiKey} />

      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FFFDF9] border border-[#C59B27]/40 shadow-2xl rounded-2xl overflow-hidden print:border-none print:shadow-none print:bg-white"
        >
          {/* Printable Official Invoice Header (Visible only when Printing) */}
          <div className="hidden print:block p-8 border-b-2 border-[#14100D] bg-white text-[#14100D]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {siteContent.logoUrl ? (
                  <img
                    src={siteContent.logoUrl}
                    alt={siteContent.brandName}
                    className="h-16 max-w-[180px] object-contain"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[#14100D] text-[#C59B27] flex items-center justify-center font-cinzel font-bold text-xl rounded">
                    ALN
                  </div>
                )}
                <div>
                  <h1 className="font-cinzel text-xl font-bold tracking-widest uppercase text-[#14100D]">
                    {siteContent.brandName || 'AL NOUREEN'}
                  </h1>
                  <p className="font-cormorant italic text-sm text-[#8C6B1B]">
                    {siteContent.brandSubtitle || 'by Nasreen'}
                  </p>
                  <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                    GSTIN: {siteContent.invoiceGstNumber || '27AAECN9482M1Z5'}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs space-y-0.5">
                <span className="font-cinzel font-bold text-sm tracking-wider uppercase block text-[#14100D]">
                  TAX INVOICE / CASH MEMO
                </span>
                <p className="font-mono text-[11px] font-semibold text-gray-800">
                  Invoice #: {activeOrder.id}
                </p>
                <p className="text-[10px] text-gray-600">Date: {activeOrder.date}</p>
                <p className="text-[9px] text-gray-500 max-w-[220px]">
                  {siteContent.invoiceAtelierLocation || 'MUMBAI, MAHARASHTRA, INDIA'}
                </p>
              </div>
            </div>
          </div>

          {/* Header Banner (Screen Display) */}
          <div className="bg-[#14100D] text-white p-8 sm:p-10 text-center relative overflow-hidden border-b border-[#C59B27]/60 print:hidden">
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 sm:w-24 sm:h-24 mb-4 relative"
              >
                <Logo variant="seal" />
              </motion.div>

              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#241F1B] border border-[#C59B27]/50 rounded-full text-[10px] sm:text-xs font-cinzel text-[#F5D77F] uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {t('orderSuccessBadge', 'Official Order Confirmation')}
                </div>

                <button
                  type="button"
                  onClick={triggerConfetti}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C59B27]/20 hover:bg-[#C59B27]/30 border border-[#C59B27]/60 rounded-full text-[10px] sm:text-xs font-cinzel text-[#F5D77F] transition-colors active:scale-95 cursor-pointer print:hidden"
                  title="Replay Celebration Animation"
                >
                  <PartyPopper className="w-3 h-3 text-[#F5D77F]" />
                  <span>Celebrate</span>
                </button>
              </div>

              <h1 className="font-playfair text-2xl sm:text-4xl text-[#FAF7F2] font-medium tracking-wide">
                {t('orderSuccessTitle', 'Thank You for Your Order!')}
              </h1>

              <p className="text-xs sm:text-sm text-[#C8BCAC] font-sans-ui max-w-lg mt-2 leading-relaxed">
                Hi <span className="text-[#F5D77F] font-semibold">{activeOrder.shippingAddress.fullName}</span>, we have received your order. We are carefully preparing your items for express delivery.
              </p>
            </div>
          </div>

          {/* Quick Highlights Ribbon */}
          <div className="bg-[#F6EFE2] border-b border-[#E8DFC9] px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center font-sans-ui text-xs">
            <div>
              <span className="text-[10px] uppercase font-cinzel text-[#8C7A6B] tracking-wider block">
                Order ID
              </span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[#1E1A17]">
                {activeOrder.id}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-cinzel text-[#8C6B1B] font-bold tracking-wider block">
                Atelier Batch #
              </span>
              <div className="inline-flex items-center gap-1 font-mono font-bold text-[11px] sm:text-xs text-[#8C6B1B] bg-[#EAE2D2] px-2 py-0.5 rounded border border-[#C59B27]/40">
                <span>{atelierBatchNumber}</span>
                <button
                  onClick={handleCopyBatchNumber}
                  className="hover:text-[#1E1A17] transition-colors cursor-pointer"
                  title="Copy Atelier Batch Number"
                >
                  {copiedBatch ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-cinzel text-[#8C7A6B] tracking-wider block">
                Order Date
              </span>
              <span className="font-semibold text-[#1E1A17]">
                {activeOrder.date}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-cinzel text-[#8C7A6B] tracking-wider block">
                Total Paid
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#8C6B1B]">
                {formatPrice(activeOrder.total, currency)}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-cinzel text-[#8C7A6B] tracking-wider block">
                Estimated Delivery
              </span>
              <span className="font-semibold text-emerald-800">
                {activeOrder.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Tracking and Courier Details */}
            <div className="bg-[#FAF7F2] border border-[#DDD3BC] rounded-xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFC9]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#181411] border border-[#C59B27] flex items-center justify-center text-[#E8D59E]">
                    <Truck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-cinzel uppercase text-[#8C6B1B] tracking-wider">
                      Express Courier Delivery
                    </span>
                    <h4 className="font-playfair text-base font-bold text-[#1E1A17]">
                      {activeOrder.carrier}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#F2ECE1] px-3 py-1.5 rounded-lg border border-[#DDD3BC]">
                  <span className="text-[11px] font-mono text-[#54463A]">
                    Tracking: {activeOrder.trackingNumber}
                  </span>
                  <button
                    onClick={handleCopyTracking}
                    className="p-1 hover:text-[#C59B27] transition-colors text-[#8C7A6B]"
                    title="Copy Tracking Number"
                  >
                    {copiedTracking ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-2">
                <span className="text-[11px] font-cinzel uppercase font-semibold text-[#8C7A6B] tracking-wider block">
                  Delivery Status
                </span>
                <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] sm:text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-emerald-900">Confirmed</span>
                    <span className="text-[9px] text-[#8C7A6B] hidden sm:inline">Order Received</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#C59B27] text-white flex items-center justify-center mb-1 shadow-xs ring-4 ring-[#C59B27]/20">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#8C6B1B]">Preparing</span>
                    <span className="text-[9px] text-[#8C7A6B] hidden sm:inline">Quality Check</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#EAE2D2] text-[#8C7A6B] flex items-center justify-center mb-1">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[#8C7A6B]">In Transit</span>
                    <span className="text-[9px] text-[#8C7A6B] hidden sm:inline">On the Way</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#EAE2D2] text-[#8C7A6B] flex items-center justify-center mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[#8C7A6B]">Delivered</span>
                    <span className="text-[9px] text-[#8C7A6B] hidden sm:inline">Handover</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items in Order */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC9]">
                <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#1E1A17]">
                  Items in Your Order ({activeOrder.itemsCount})
                </h3>
                <span className="text-[11px] text-[#8C7A6B] font-sans-ui">
                  All taxes included
                </span>
              </div>

              <div className="divide-y divide-[#EFE8DA] dark:divide-[#2E2620]">
                {activeOrder.items.map((item, idx) => (
                  <div key={`order-item-${item.productId || 'item'}-${item.size}-${idx}`} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border border-[#DDD3BC] dark:border-[#2E2620] shadow-xs flex-shrink-0 bg-[#F0EAE0]">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        aspectRatio="aspect-3/4"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-playfair text-sm sm:text-base font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-[11px] text-[#6B635B] mt-1">
                        <span className="bg-[#F2ECE1] px-2 py-0.5 rounded-sm">
                          Size: <strong className="text-[#1E1A17]">{item.size}</strong>
                        </span>
                        <span className="bg-[#F2ECE1] px-2 py-0.5 rounded-sm">
                          Color: <strong className="text-[#1E1A17]">{item.color}</strong>
                        </span>
                        <span className="bg-[#F2ECE1] px-2 py-0.5 rounded-sm">
                          Quantity: <strong className="text-[#1E1A17]">{item.quantity}</strong>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm sm:text-base text-[#1E1A17]">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                      <span className="block text-[10px] text-[#8C7A6B]">
                        {formatPrice(item.price, currency)} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Artisanal Atelier Batch Authentication Docket */}
            <div className="bg-[#181411] text-[#FAF7F2] border border-[#C59B27]/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#241F1B] border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shrink-0">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-cinzel uppercase text-[#C59B27] tracking-widest font-bold">
                      Authentic Atelier Production Docket
                    </span>
                    <span className="bg-[#C59B27]/20 border border-[#C59B27]/50 text-[#F5D77F] text-[9px] font-mono px-1.5 py-0.2 rounded-sm">
                      VERIFIED
                    </span>
                  </div>
                  <h4 className="font-mono text-sm sm:text-base font-bold text-[#FFF2C2] tracking-wider mt-0.5">
                    {atelierBatchNumber}
                  </h4>
                  <p className="text-[10px] text-[#A69788] font-sans-ui mt-0.5">
                    Artisanal batch assigned for master finishing, hand zardozi inspection & gold seal locking.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleCopyBatchNumber}
                  className="px-3 py-1.5 bg-[#2B231D] hover:bg-[#3D322B] text-[#E8D59E] border border-[#C59B27]/50 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy Atelier Batch Number"
                >
                  {copiedBatch ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Batch Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Copy Batch #</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#F7F2E8] border border-[#DDD3BC] rounded-xl p-5 sm:p-6 space-y-3 font-sans-ui text-xs">
              <div className="flex justify-between text-[#6B635B]">
                <span>Subtotal</span>
                <span className="font-medium text-[#1E1A17]">
                  {formatPrice(activeOrder.subtotal, currency)}
                </span>
              </div>

              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promo Discount</span>
                  <span className="font-semibold">
                    -{formatPrice(activeOrder.discount, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#6B635B]">
                <span>Express Delivery</span>
                <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                  Free
                </span>
              </div>

              <div className="pt-3 border-t border-[#DDD3BC] flex justify-between items-baseline">
                <div>
                  <span className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#1E1A17] block">
                    Total Amount
                  </span>
                  <span className="text-[10px] text-[#8C7A6B]">
                    Payment Mode: {activeOrder.paymentMethod}
                  </span>
                </div>
                <span className="font-playfair text-xl sm:text-2xl font-bold text-[#8C6B1B]">
                  {formatPrice(activeOrder.total, currency)}
                </span>
              </div>

              {/* Instant App Launcher Trigger */}
              {activeOrder.paymentMethod.includes('Google Pay') && (
                <div className="pt-2 border-t border-[#DDD3BC]/60">
                  <button
                    onClick={() => openGooglePayApp({ amount: activeOrder.total, orderId: activeOrder.id, customerPhone: activeOrder.shippingAddress.phone })}
                    className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-cinzel text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Smartphone className="w-4 h-4" /> Open Google Pay App to Verify / Pay ({formatPrice(activeOrder.total, currency)}) <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              {activeOrder.paymentMethod.includes('Apple Pay') && (
                <div className="pt-2 border-t border-[#DDD3BC]/60">
                  <button
                    onClick={() => openApplePayApp({ amount: activeOrder.total, orderId: activeOrder.id, customerPhone: activeOrder.shippingAddress.phone })}
                    className="w-full py-2.5 px-3 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/40 rounded-lg font-cinzel text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <Lock className="w-4 h-4 text-[#D4AF37]" /> Open Apple Pay Authorization <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Delivery Details & Support */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans-ui">
              <div className="p-4 bg-[#FAF7F2] border border-[#DDD3BC] rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold uppercase text-[#1E1A17]">
                  <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                  Delivery Address
                </div>
                <p className="font-semibold text-[#1E1A17]">
                  {activeOrder.shippingAddress.fullName}
                </p>
                <p className="text-[#6B635B] leading-snug">
                  {activeOrder.shippingAddress.street}<br />
                  {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.postalCode}<br />
                  {activeOrder.shippingAddress.country}
                </p>
                <p className="text-[11px] text-[#8C7A6B] pt-1">
                  Phone: {activeOrder.shippingAddress.phone}
                </p>
              </div>

              <div className="p-4 bg-[#FAF7F2] border border-[#DDD3BC] rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold uppercase text-[#1E1A17]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
                  Need Help or Changes?
                </div>
                <p className="text-[#6B635B] leading-relaxed">
                  Our customer care team is available on WhatsApp to assist with tracking, sizing adjustments, or special delivery notes.
                </p>
                <div className="pt-2">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat on WhatsApp (+91 93262 94187)
                  </a>
                </div>
              </div>
            </div>

            {/* Special Instructions / Order Notes if provided */}
            {activeOrder.orderNotes && (
              <div className="p-4 bg-[#FAF7F2] border border-[#C59B27]/50 rounded-xl space-y-1.5 text-xs font-sans-ui animate-in fade-in">
                <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold uppercase text-[#8C6B1B]">
                  <FileText className="w-3.5 h-3.5 text-[#C59B27]" />
                  Special Instructions / Order Notes
                </div>
                <p className="text-[#1E1A17] whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-[#DDD3BC] text-xs">
                  {activeOrder.orderNotes}
                </p>
              </div>
            )}

            {/* Printable Invoice Certification & Terms Note (Print only) */}
            <div className="hidden print:block pt-6 border-t-2 border-gray-300 text-[10px] text-gray-700 space-y-2">
              <div className="flex justify-between items-end">
                <div className="space-y-1 max-w-md">
                  <p className="font-semibold text-gray-900 uppercase tracking-wide">
                    Terms & Conditions / Authenticity Certification:
                  </p>
                  <p className="leading-relaxed">
                    {siteContent.invoiceTermsNote || 'This is a certified digital tax invoice issued by AL NOUREEN by Nasreen. All applicable taxes and duties are included.'}
                  </p>
                  <p className="text-gray-500 italic">
                    Care: {siteContent.invoiceCareInstructions || 'Dry clean only. Store in provided breathable muslin garment bag.'}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-32 border-b border-gray-900 pb-1 font-cinzel font-bold text-[10px] uppercase text-gray-900">
                    Authorised Signatory
                  </div>
                  <p className="text-[9px] text-gray-500">{siteContent.brandName || 'AL NOUREEN'} Atelier</p>
                </div>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="pt-6 border-t border-[#E8DFC9] flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  id="order-success-print-invoice"
                  onClick={handlePrintInvoice}
                  className="px-5 py-3.5 bg-white hover:bg-[#F7F2E8] text-[#1E1A17] border-2 border-[#C59B27]/70 font-cinzel text-xs font-bold tracking-wider uppercase rounded-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  title="Print official tax invoice and order summary"
                >
                  <Printer className="w-4 h-4 text-[#8C6B1B]" />
                  <span>Print Invoice</span>
                </button>

                <button
                  id="order-success-download-pdf"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingInvoice}
                  className={`flex-1 sm:flex-none px-5 py-3.5 text-xs font-cinzel font-bold tracking-widest uppercase rounded-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
                    downloadSuccess
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#1E1A17] hover:bg-[#2C2622] text-[#F5D77F] border border-[#C59B27]/40'
                  }`}
                  title="Download Official Tax Invoice PDF"
                >
                  {downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>PDF Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isGeneratingInvoice ? 'Generating PDF...' : 'Download PDF Bill'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('track-order')}
                  className="flex-1 sm:flex-none px-4 py-3.5 bg-[#EAE2D2] hover:bg-[#DDD3BC] text-[#1E1A17] font-cinzel text-xs font-semibold tracking-wider uppercase rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#8C6B1B]" />
                  Track Package
                </button>

                <button
                  onClick={() => onNavigate('shop')}
                  className="flex-1 sm:flex-none px-5 py-3.5 bg-[#C59B27] hover:bg-[#B38A1E] text-[#1E1A17] font-cinzel text-xs font-bold tracking-wider uppercase rounded-sm shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center text-xs text-[#8C7A6B] space-y-1 font-sans-ui">
          <p>
            An order confirmation email has been sent to{' '}
            <strong className="text-[#1E1A17]">{activeOrder.shippingAddress.email}</strong>.
          </p>
          <p className="text-[10px] text-[#A69788]">
            AL-NOUREEN • All Rights Reserved © 2026
          </p>
        </div>
      </div>
    </div>
  );
};
