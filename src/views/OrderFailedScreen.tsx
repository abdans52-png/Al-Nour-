import React from 'react';
import { ScreenType, Currency, CartItem, FailedPaymentInfo } from '../types';
import { formatPrice } from '../utils/currency';
import { Logo } from '../components/Logo';
import { ProductImage } from '../components/ProductImage';
import {
  XCircle,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Smartphone,
  ShoppingBag,
  MessageCircle,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Lock,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { MERCHANT_PHONE, MERCHANT_UPI_ID, MERCHANT_NAME, openGooglePayApp, openApplePayApp } from '../utils/paymentGateway';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';

interface OrderFailedScreenProps {
  failedInfo: FailedPaymentInfo | null;
  cartItems: CartItem[];
  currency?: Currency;
  onNavigate: (screen: ScreenType) => void;
  onRetryPayment: () => void;
}

export const OrderFailedScreen: React.FC<OrderFailedScreenProps> = ({
  failedInfo,
  cartItems,
  currency = 'INR',
  onNavigate,
  onRetryPayment
}) => {
  const displayGateway = failedInfo?.gateway || 'Google Pay (UPI)';
  const displayReason =
    failedInfo?.reason ||
    'The payment authorization could not be completed from your payment application. No funds were captured by the seller.';
  const displayAmount =
    failedInfo?.amount ||
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const displayTimestamp = failedInfo?.timestamp || new Date().toLocaleTimeString();
  const displayOrderId = failedInfo?.orderId || `ALN-${Math.floor(100000 + Math.random() * 900000)}`;

  const whatsappInquiryUrl = `https://wa.me/919326294187?text=${encodeURIComponent(
    `Hello AL-NOUREEN Atelier Concierge, my recent online payment attempt for ${formatPrice(
      displayAmount,
      currency
    )} via ${displayGateway} did not go through (Docket #${displayOrderId}). I would like assistance with completing this acquisition.`
  )}`;

  const handleOpenGPayDirect = () => {
    hapticLight();
    openGooglePayApp({
      amount: displayAmount,
      orderId: displayOrderId,
      note: `AL-NOUREEN Retry ${displayOrderId}`
    });
  };

  const handleOpenApplePayDirect = () => {
    hapticLight();
    openApplePayApp({
      amount: displayAmount,
      orderId: displayOrderId,
      note: `AL-NOUREEN Retry ${displayOrderId}`
    });
  };

  return (
    <div
      id="order-failed-view"
      className="w-full bg-[#FAF7F2] min-h-screen py-8 sm:py-12 px-4 sm:px-6 relative text-[#1E1A17]"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FFFDF9] border border-amber-800/30 shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Header Banner - Distinct Alert Theme */}
          <div className="bg-[#1A1412] text-white p-8 sm:p-10 text-center relative overflow-hidden border-b border-amber-700/40">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3A1814] border-2 border-[#E53935]/80 text-[#FF6B6B] flex items-center justify-center mb-4 shadow-lg ring-8 ring-[#E53935]/15">
                <XCircle className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2E1916] border border-[#E53935]/40 rounded-full text-[10px] sm:text-xs font-cinzel text-[#FF9E9E] uppercase tracking-widest mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B6B]" />
                Transaction Incomplete
              </div>

              <h1 className="font-playfair text-2xl sm:text-4xl text-[#FAF7F2] font-medium tracking-wide">
                Order Not Placed
              </h1>

              <p className="text-xs sm:text-sm text-[#D8C7B8] font-sans-ui max-w-lg mt-2 leading-relaxed">
                Your payment to the seller was not completed. <br className="hidden sm:inline" />
                <span className="text-[#F5D77F] font-semibold">
                  No order has been placed and your account was not debited.
                </span>
              </p>
            </div>
          </div>

          {/* Quick Notice Ribbon */}
          <div className="bg-[#F8EFEA] border-b border-[#E8D0C5] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-sans-ui">
            <div className="flex items-center gap-2.5 text-[#7A362E]">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#C62828]" />
              <span className="leading-snug">
                <strong>Your shopping bag is safe:</strong> All garments and items remain reserved in your bag so you can easily retry or choose another payment method.
              </span>
            </div>
            <button
              onClick={onRetryPayment}
              className="px-4 py-2 bg-[#8C2A20] hover:bg-[#72221A] text-white font-cinzel text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Checkout
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Payment Attempt Breakdown Card */}
            <div className="bg-[#FAF7F2] border border-[#DDD3BC] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
                <h3 className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1E1A17] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#8C6B1B]" />
                  Payment Attempt Details
                </h3>
                <span className="text-[10px] font-mono text-[#8C7A6B] bg-[#EFE8DA] px-2 py-0.5 rounded-sm">
                  {displayTimestamp}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans-ui">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-cinzel text-[#8C7A6B] tracking-wider block">
                    Target Merchant
                  </span>
                  <span className="font-semibold text-[#1E1A17] block">
                    {MERCHANT_NAME}
                  </span>
                  <span className="text-[11px] font-mono text-[#8C6B1B]">
                    UPI: {MERCHANT_UPI_ID}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-cinzel text-[#8C7A6B] tracking-wider block">
                    Payment Channel
                  </span>
                  <span className="font-semibold text-[#1E1A17] block">
                    {displayGateway}
                  </span>
                  <span className="text-[11px] text-[#8C7A6B]">
                    Attempted Amount: <strong className="text-[#1E1A17]">{formatPrice(displayAmount, currency)}</strong>
                  </span>
                </div>
              </div>

              {/* Specific Reason Box */}
              <div className="p-3.5 bg-[#FFF4F2] border border-[#F5C2BC] rounded-lg text-xs space-y-1">
                <span className="font-semibold text-[#B71C1C] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Reason for Failure:
                </span>
                <p className="text-[#5C231E] leading-relaxed">
                  {displayReason}
                </p>
              </div>
            </div>

            {/* Reserved Items in Cart */}
            {cartItems.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC9]">
                  <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#1E1A17] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
                    Reserved Garments in Your Bag ({cartItems.reduce((acc, ci) => acc + ci.quantity, 0)})
                  </h3>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    Bag Saved
                  </span>
                </div>

                <div className="divide-y divide-[#EFE8DA] bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD3BC]">
                  {cartItems.map((item, idx) => (
                    <div key={`failed-item-${item.product.id}-${item.size}-${item.color}-${idx}`} className="py-3 flex items-center gap-3.5 first:pt-0 last:pb-0">
                      <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-md overflow-hidden border border-[#DDD3BC] flex-shrink-0 bg-[#F0EAE0]">
                        <ProductImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          aspectRatio="aspect-3/4"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-xs sm:text-sm font-bold text-[#1E1A17] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-[#6B635B] mt-0.5">
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs sm:text-sm text-[#1E1A17]">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Did This Happen & Helpful Next Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans-ui">
              <div className="p-4 bg-[#FAF7F2] border border-[#DDD3BC] rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold uppercase text-[#1E1A17]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C59B27]" />
                  Common Reasons for Failure
                </div>
                <ul className="list-disc list-inside text-[#6B635B] space-y-1 text-[11px] leading-relaxed">
                  <li>Payment session timed out or was cancelled in UPI app</li>
                  <li>Incorrect UPI PIN or biometric authentication mismatch</li>
                  <li>Daily transaction limit exceeded on bank account</li>
                  <li>Temporary bank gateway / clearing network maintenance</li>
                </ul>
              </div>

              <div className="p-4 bg-[#FAF7F2] border border-[#DDD3BC] rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold uppercase text-[#1E1A17]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C59B27]" />
                  Atelier Concierge Assistance
                </div>
                <p className="text-[#6B635B] leading-relaxed text-[11px]">
                  Need help completing your order via direct bank wire, manual payment link, or split tender?
                </p>
                <div className="pt-1">
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Instant Support on WhatsApp (+91 93262 94187)
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="pt-6 border-t border-[#E8DFC9] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  id="order-failed-retry-btn"
                  onClick={() => {
                    hapticSuccess();
                    onRetryPayment();
                  }}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-[#1E1A17] hover:bg-[#2C2622] text-[#F5D77F] font-cinzel text-xs font-bold tracking-widest uppercase rounded-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                  Retry Payment Now
                </button>

                {displayGateway.includes('Google Pay') && (
                  <button
                    onClick={handleOpenGPayDirect}
                    className="px-4 py-3.5 bg-white hover:bg-[#F7F2E8] text-[#1E1A17] border border-[#DDD3BC] font-cinzel text-xs font-semibold tracking-wider uppercase rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Launch Google Pay App directly on phone"
                  >
                    <Smartphone className="w-4 h-4 text-[#4285F4]" />
                    <span>Launch GPay</span>
                  </button>
                )}

                {displayGateway.includes('Apple Pay') && (
                  <button
                    onClick={handleOpenApplePayDirect}
                    className="px-4 py-3.5 bg-white hover:bg-[#F7F2E8] text-[#1E1A17] border border-[#DDD3BC] font-cinzel text-xs font-semibold tracking-wider uppercase rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#1E1A17]" />
                    <span>Apple Pay</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('cart')}
                  className="flex-1 sm:flex-none px-5 py-3.5 bg-[#EAE2D2] hover:bg-[#DDD3BC] text-[#1E1A17] font-cinzel text-xs font-semibold tracking-wider uppercase rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  View Bag
                </button>

                <button
                  onClick={() => onNavigate('shop')}
                  className="flex-1 sm:flex-none px-5 py-3.5 bg-[#C59B27] hover:bg-[#B38A1E] text-[#1E1A17] font-cinzel text-xs font-bold tracking-wider uppercase rounded-sm shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center text-xs text-[#8C7A6B] space-y-1 font-sans-ui">
          <p>
            No order charge was posted to your bank or card account.
          </p>
          <p className="text-[10px] text-[#A69788]">
            AL-NOUREEN HAUTE COUTURE • Secure Payment Gateway Architecture
          </p>
        </div>
      </div>
    </div>
  );
};
