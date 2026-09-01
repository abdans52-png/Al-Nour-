import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Sparkles,
  Truck,
  FileText,
  CreditCard
} from 'lucide-react';
import { CartItem, Currency, Order, FailedPaymentInfo } from '../types';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import { apiGetOffers } from '../utils/api';
import { launchRazorpayPayment } from '../utils/razorpay';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  currency?: Currency;
  onOrderSuccess: (order: Order) => void;
  onOrderFailed?: (info: FailedPaymentInfo) => void;
  onRazorpayPaymentSuccess?: (paymentData: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  currency = 'INR',
  onOrderSuccess
}) => {
  const [formData, setFormData] = useState({
    name: 'Amina Al-Mansoor',
    email: 'amina.mansoor@example.com',
    address: '42 Altamount Road, Cumballa Hill',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400026',
    country: 'India',
    phone: '+91 93262 94187',
    orderNotes: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    try {
      const offers = await apiGetOffers();
      const matched = offers.find((o) => o.code.toUpperCase() === code && o.isActive);

      if (matched) {
        if (matched.minOrderAmount && subtotal < matched.minOrderAmount) {
          setPromoError(`Minimum order amount of $${matched.minOrderAmount} required for code ${matched.code}.`);
          setPromoSuccess('');
          return;
        }

        let calculatedDiscount = 0;
        if (matched.discountType === 'percentage') {
          calculatedDiscount = (subtotal * matched.discountValue) / 100;
          if (matched.maxDiscount) {
            calculatedDiscount = Math.min(calculatedDiscount, matched.maxDiscount);
          }
        } else {
          calculatedDiscount = matched.discountValue;
        }

        setDiscount(calculatedDiscount);
        setPromoError('');
        setPromoSuccess(`${matched.title} applied! Saved ${matched.discountValue}${matched.discountType === 'percentage' ? '%' : '$'}.`);
        return;
      }
    } catch {}

    if (code === 'ALNOUREEN10' || code === 'NOUREEN10') {
      const discountVal = subtotal * 0.1;
      setDiscount(discountVal);
      setPromoError('');
      setPromoSuccess('10% discount privilege applied.');
    } else {
      setPromoError('Invalid coupon code. Try "NOUREEN10" for 10% off.');
      setPromoSuccess('');
    }
  };

  const finalTotal = Math.max(0, subtotal - discount);

  const buildOrderObject = (generatedId: string): Order => ({
    id: generatedId,
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discount,
    shipping: 0,
    total: finalTotal,
    status: 'Order Confirmed',
    estimatedDelivery: '3–5 Business Days via Express Courier',
    trackingNumber: `EXP-IN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    carrier: 'DHL Express Priority Air',
    shippingAddress: {
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      street: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode
    },
    paymentMethod: 'Direct Secure Checkout',
    orderNotes: formData.orderNotes.trim() || undefined,
    items: items.map((ci) => ({
      productId: ci.product.id,
      name: ci.product.name,
      image: ci.product.images[0],
      size: ci.size,
      color: ci.color,
      quantity: ci.quantity,
      price: ci.product.price
    }))
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setPromoError('Please complete all required shipping contact fields.');
      return;
    }

    hapticLight();
    setIsProcessing(true);

    try {
      await launchRazorpayPayment({
        amount: finalTotal,
        currency,
        items,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode
        },
        discount,
        shipping: 0,
        orderNotes: formData.orderNotes.trim() || undefined,
        onSuccess: (result) => {
          setIsProcessing(false);
          hapticSuccess();
          onOrderSuccess(result.order);
          onClose();
        },
        onFailure: (err) => {
          setIsProcessing(false);
          hapticWarning();
          setPromoError(err.description || 'Payment was cancelled or unsuccessful.');
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (err: any) {
      console.error('Razorpay modal trigger error:', err);
      setIsProcessing(false);
      hapticWarning();
      setPromoError('Unable to launch Razorpay gateway: ' + (err?.message || 'Check connection'));
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-[#FAF7F2] border border-[#C59B27]/40 max-w-xl w-full p-6 md:p-8 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
          <div>
            <span className="text-[10px] font-cinzel tracking-widest text-[#B38A1E] uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Secure Checkout
            </span>
            <h3 className="font-playfair text-2xl text-[#1E1A17]">Complete Your Order</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B635B] hover:text-[#1E1A17] transition-colors rounded-full"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-6 font-sans-ui text-xs">
          {/* 1. Customer & Shipping Details */}
          <div>
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-[#1E1A17] mb-3">
              1. Delivery Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#6B635B] mb-1 font-medium">Full Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#D4CBBF] px-3 py-2 text-[#1E1A17] focus:outline-[#C59B27] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#6B635B] mb-1 font-medium">Email Address *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#D4CBBF] px-3 py-2 text-[#1E1A17] focus:outline-[#C59B27] rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#6B635B] mb-1 font-medium">Street Address *</label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-[#D4CBBF] px-3 py-2 text-[#1E1A17] focus:outline-[#C59B27] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#6B635B] mb-1 font-medium">City *</label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white border border-[#D4CBBF] px-3 py-2 text-[#1E1A17] focus:outline-[#C59B27] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[#6B635B] mb-1 font-medium">PIN / Postal Code *</label>
                <input
                  required
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-white border border-[#D4CBBF] px-3 py-2 text-[#1E1A17] focus:outline-[#C59B27] rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#6B635B] mb-1 font-medium">Phone Number (WhatsApp Updates) *</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-[#D4CBBF] px-3 py-2 text-[#1E1A17] focus:outline-[#C59B27] rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Delivery speed badge */}
          <div className="p-3 bg-[#F2ECE1] border border-[#E8E2D5] flex items-center justify-between rounded-xl">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#C59B27]" />
              <div>
                <p className="font-semibold text-[#1E1A17]">Express Courier Delivery</p>
                <p className="text-[10px] text-[#6B635B]">Estimated arrival within 3–5 business days</p>
              </div>
            </div>
            <span className="font-bold text-emerald-800 uppercase tracking-wider text-xs">Free</span>
          </div>

          {/* 2. Order Notes & Special Instructions */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#DDD3BC] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#8C6B1B]" />
                <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#1E1A17]">
                  Order Notes & Special Instructions
                </h4>
              </div>
              <span className="text-[10px] text-[#8C6B1B] font-mono font-medium">Optional</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                { label: '🎁 Luxury Gift Box & Card', text: 'Please include luxury gold-embossed gift packaging with a handwritten greeting card.' },
                { label: '📦 Leave with Front Desk', text: 'Please leave package with the building security / concierge desk.' },
                { label: '📞 Call Before Delivery', text: 'Kindly call before arrival for gate entry verification.' }
              ].map((chip, idx) => (
                <button
                  key={`checkout-preset-chip-${idx}`}
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setFormData((prev) => {
                      const current = prev.orderNotes.trim();
                      if (!current) return { ...prev, orderNotes: chip.text };
                      if (current.includes(chip.text)) return prev;
                      return { ...prev, orderNotes: `${current}\n• ${chip.text}` };
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F2ECE1] text-[#5E5043] hover:text-[#1E1A17] border border-[#DDD3BC] hover:border-[#C59B27] text-[10.5px] font-sans-ui transition-all cursor-pointer active:scale-95"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                id="checkout-order-notes"
                rows={2}
                maxLength={500}
                value={formData.orderNotes}
                onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                placeholder="Special instructions or custom gift notes..."
                className="w-full bg-white border border-[#D4CBBF] p-2.5 text-xs text-[#1E1A17] placeholder:text-[#9E9184] focus:outline-[#C59B27] rounded-xl resize-none leading-relaxed shadow-inner"
              />
            </div>
          </div>

          {/* 3. Secure Payment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-[#1E1A17] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#C59B27]" />
                3. Razorpay Payment Gateway
              </h4>
              <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 256-Bit SSL Protected
              </span>
            </div>
            
            <div className="p-3.5 bg-[#F9F6F0] border border-[#D4CBBF] rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span className="font-semibold text-[#1E1A17]">Instant Razorpay Redirect</span>
                </div>
                <span className="px-2 py-0.5 bg-[#0C2340] text-[#3395FF] text-[9px] font-bold rounded tracking-wider uppercase">
                  Razorpay
                </span>
              </div>
              <p className="text-[#6B635B] text-[11px] leading-relaxed">
                Clicking <strong>Pay Now</strong> opens the official Razorpay checkout page. Pay via UPI, Cards, NetBanking, or Wallets.
              </p>
              <div className="flex flex-wrap gap-1 pt-0.5">
                <span className="px-1.5 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[9px] font-medium rounded">
                  UPI / QR
                </span>
                <span className="px-1.5 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[9px] font-medium rounded">
                  Cards
                </span>
                <span className="px-1.5 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[9px] font-medium rounded">
                  NetBanking
                </span>
                <span className="px-1.5 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[9px] font-medium rounded">
                  Wallets
                </span>
              </div>
            </div>
          </div>

          {/* Discount / Coupon Code */}
          <div>
            <label className="block text-[#6B635B] mb-1 font-medium">Discount Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter NOUREEN10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-white border border-[#D4CBBF] px-3 py-2 text-[#1E1A17] uppercase tracking-wider rounded-lg"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-[#EAE3D6] hover:bg-[#DED5C5] text-[#1E1A17] font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
            {promoSuccess && <p className="text-[11px] text-emerald-700 mt-1 font-medium">{promoSuccess}</p>}
            {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
          </div>

          {/* Order Summary */}
          <div className="pt-4 border-t border-[#E8E2D5] space-y-2">
            <div className="flex justify-between text-[#6B635B]">
              <span>Items Total ({items.length} items)</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>Discount (10% Off)</span>
                <span>-{formatPrice(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#6B635B]">
              <span>Shipping Fee</span>
              <span className="text-emerald-800 font-semibold">Free</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#1E1A17] pt-2 border-t border-[#E8E2D5]">
              <span>Total Payable</span>
              <span className="text-lg font-serif font-bold text-[#8C6B1B]">
                {formatPrice(finalTotal, currency)}
              </span>
            </div>
          </div>

          {/* Single Pay Now CTA */}
          <button
            type="submit"
            id="checkout-modal-pay-now-button"
            disabled={isProcessing}
            className="w-full py-4 bg-[#1E1A17] hover:bg-[#2C2622] text-[#F5D77F] font-cinzel text-xs font-bold tracking-widest uppercase transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 rounded-xl cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Processing Payment...</span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                Pay Now ({formatPrice(finalTotal, currency)})
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-[#8C7E72] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            Secure 256-Bit SSL Encryption • 100% Satisfaction Guaranteed
          </p>
        </form>
      </div>
    </div>
  );
};
