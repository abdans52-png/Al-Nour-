import React, { useState } from 'react';
import {
  CartItem,
  Currency,
  ScreenType,
  Order
} from '../types';
import { formatPrice } from '../utils/currency';
import { ProductImage } from '../components/ProductImage';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Tag,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { launchRazorpayPayment } from '../utils/razorpay';

interface CheckoutScreenProps {
  cart: CartItem[];
  currency: Currency;
  onNavigate: (screen: ScreenType) => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  currency,
  onNavigate,
  onOrderPlaced
}) => {
  const { siteContent } = useSiteContent();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [couponCode, setCouponCode] = useState('NOUREEN10');
  const [couponApplied, setCouponApplied] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: 'Maryam',
    lastName: 'Ansari',
    email: 'maryam.ansari@example.com',
    phone: siteContent.contactPhone || '+91 93262 94187',
    address: '14 Altamount Road, Cumballa Hill',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400026',
    country: 'India',
    notes: 'Please pack in signature luxury gift box.'
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = couponApplied ? (subtotal * discountPercent) / 100 : 0;
  const shipping = 0; // Complimentary Express Shipping
  const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'NOUREEN10' || code === 'ALNOUREEN10') {
      setCouponApplied(true);
      setDiscountPercent(10);
    } else if (code === 'WELCOME15') {
      setCouponApplied(true);
      setDiscountPercent(15);
    } else {
      alert('Invalid Promo Code. Try NOUREEN10 for 10% off.');
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required shipping details.');
      return;
    }

    setIsProcessing(true);

    try {
      await launchRazorpayPayment({
        amount: total,
        currency,
        items: cart,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode
        },
        discount: discountAmount,
        shipping,
        orderNotes: formData.notes.trim() || undefined,
        onSuccess: (result) => {
          setIsProcessing(false);
          setPlacedOrder(result.order);
          onOrderPlaced(result.order);
          setStep('success');
        },
        onFailure: (err) => {
          setIsProcessing(false);
          alert(err.description || 'Payment was unsuccessful. Please try again.');
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (err: any) {
      console.error('Razorpay checkout trigger error:', err);
      setIsProcessing(false);
      alert('Failed to initiate Razorpay checkout: ' + (err?.message || 'Unknown error'));
    }
  };

  if (step === 'success' && placedOrder) {
    return (
      <div id="checkout-success-view" className="w-full bg-[#FAF7F2] min-h-screen py-16 px-4 sm:px-6">
        <div className="max-w-xl mx-auto bg-[#FAF7F2] border border-[#C59B27]/40 rounded-3xl p-6 sm:p-10 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#181411] border-2 border-[#C59B27] flex items-center justify-center text-[#E8D59E] mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9 text-[#25D366]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-cinzel font-bold uppercase tracking-widest text-[#8C6B1B]">
              Order Confirmation
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17]">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm font-sans-ui text-[#54463A]">
              Your order has been received and is being prepared for dispatch.
            </p>
          </div>

          {/* Receipt Info Card */}
          <div className="bg-[#F7F2E8] border border-[#DDD3BC] rounded-2xl p-5 text-left text-xs font-sans-ui space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD3BC]">
              <span className="text-[#8C7A6B]">Order Number:</span>
              <strong className="font-cinzel text-sm text-[#1E1A17]">{placedOrder.id}</strong>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD3BC]">
              <span className="text-[#8C7A6B]">Payment Method:</span>
              <span className="font-semibold text-[#1E1A17]">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD3BC]">
              <span className="text-[#8C7A6B]">Courier Tracking:</span>
              <span className="font-semibold text-[#1E1A17]">{placedOrder.carrier} • {placedOrder.trackingNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD3BC]">
              <span className="text-[#8C7A6B]">Estimated Delivery:</span>
              <span className="text-[#0A7B54] font-semibold">{placedOrder.estimatedDelivery}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8C7A6B]">Total Amount:</span>
              <strong className="font-serif text-base text-[#1E1A17]">
                {formatPrice(placedOrder.total, currency)}
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('order-success')}
              className="flex-1 py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              View Order Invoice & Summary
            </button>
            <button
              onClick={() => onNavigate('track-order')}
              className="flex-1 py-3.5 bg-[#EAE2D2] hover:bg-[#DDD3BC] text-[#1E1A17] border border-[#DDD3BC] rounded-xl font-cinzel font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Track Package
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-screen-view" className="w-full bg-[#FAF7F2] min-h-screen pb-20">
      {/* Top Banner */}
      <div className="bg-[#181411] text-[#FAF7F2] py-8 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-[#E8D59E]">
          Secure Checkout
        </h1>
        <p className="text-[11px] text-[#C5BAAC] font-sans-ui mt-1 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-[#C59B27]" /> 256-Bit SSL Encrypted Checkout
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Customer Details, Address, Shipping & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details */}
            <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="font-cinzel text-sm sm:text-base font-bold text-[#1E1A17] uppercase tracking-wider">
                1. Customer & Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans-ui">
                <div>
                  <label className="block font-semibold text-[#1E1A17] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E1A17] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E1A17] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E1A17] mb-1">
                    Phone Number (WhatsApp Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <h2 className="font-cinzel text-sm sm:text-base font-bold text-[#1E1A17] uppercase tracking-wider">
                2. Shipping Address
              </h2>
              <div className="space-y-3 text-xs font-sans-ui">
                <div>
                  <label className="block font-semibold text-[#1E1A17] mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1E1A17] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1E1A17] mb-1">PIN / Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1E1A17] mb-1">Country *</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                    >
                      <option>India</option>
                      <option>United Kingdom</option>
                      <option>United Arab Emirates</option>
                      <option>Saudi Arabia</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Pakistan</option>
                      <option>Qatar</option>
                      <option>Kuwait</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery speed badge */}
            <div className="p-4 bg-[#F2ECE1] border border-[#E8E2D5] flex items-center justify-between rounded-2xl">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#C59B27]" />
                <div>
                  <p className="font-semibold text-xs text-[#1E1A17]">Complimentary Express Courier</p>
                  <p className="text-[11px] text-[#6B635B]">Estimated arrival within 3–5 business days with live tracking</p>
                </div>
              </div>
              <span className="font-bold text-emerald-800 uppercase tracking-wider text-xs bg-emerald-100 px-2.5 py-1 rounded-full">
                Free
              </span>
            </div>

            {/* Secure Payment Verification */}
            <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
                <h2 className="font-cinzel text-sm sm:text-base font-bold text-[#1E1A17] uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C59B27]" />
                  3. Razorpay Secure Payment
                </h2>
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Protected
                </span>
              </div>
              
              <div className="p-4 bg-[#F7F2E8] border border-[#DDD3BC] rounded-xl text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#C59B27]" />
                    <span className="font-semibold text-[#1E1A17]">Razorpay Online Checkout</span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#0C2340] text-[#3395FF] text-[10px] font-bold rounded tracking-wider uppercase">
                    Razorpay
                  </span>
                </div>
                <p className="text-[#6B5E52] text-[11px] leading-relaxed">
                  Clicking <strong>Pay Now</strong> redirects to the official Razorpay payment page with instant bank-grade authentication. Supports UPI (Google Pay, PhonePe, Paytm), All Credit/Debit Cards, NetBanking, and Wallets.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[10px] font-medium rounded-md">
                    ⚡ UPI / QR
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[10px] font-medium rounded-md">
                    💳 Credit / Debit Cards
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[10px] font-medium rounded-md">
                    🏛️ 50+ Banks NetBanking
                  </span>
                  <span className="px-2 py-0.5 bg-white border border-[#DDD3BC] text-[#4A3E34] text-[10px] font-medium rounded-md">
                    👛 Wallets & EMI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-3xl p-6 space-y-5 shadow-sm sticky top-28">
              <h2 className="font-cinzel text-base font-bold text-[#1E1A17] uppercase tracking-wider pb-2 border-b border-[#E8DFC8]">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={`chk-${item.product.id}-${item.size}-${item.color}-${idx}`} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#DDD3BC] dark:border-[#2E2620] flex-shrink-0 bg-[#F0EAE0]">
                        <ProductImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          aspectRatio="aspect-3/4"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif font-semibold text-[#1E1A17] dark:text-[#FAF7F2] truncate max-w-[170px]">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-[#8C7A6B] dark:text-[#A69788]">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8C6B1B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#DDD3BC] rounded-lg text-xs font-cinzel font-semibold uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-[#181411] text-[#E8D59E] rounded-lg text-xs font-cinzel font-semibold hover:bg-[#2B231D]"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[10px] text-[#0A7B54] font-medium mt-1">
                    ✓ Promo code applied ({discountPercent}% off subtotal)
                  </p>
                )}
              </div>

              {/* Price Calculation Table */}
              <div className="pt-3 border-t border-[#E8DFC8] space-y-2 text-xs font-sans-ui text-[#5E5043]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-serif">{formatPrice(subtotal, currency)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-[#0A7B54]">
                    <span>Discount:</span>
                    <span className="font-serif">-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier Delivery:</span>
                  <span className="font-serif text-[#0A7B54] font-semibold">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E8DFC8] text-sm font-bold text-[#1E1A17]">
                  <span className="font-cinzel">Total Payable:</span>
                  <span className="font-serif text-base text-[#C59B27]">
                    {formatPrice(total, currency)}
                  </span>
                </div>
              </div>

              {/* Single Pay Now CTA Button */}
              <button
                type="submit"
                id="checkout-screen-pay-now-button"
                disabled={isProcessing}
                className="w-full py-4 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    Pay Now ({formatPrice(total, currency)})
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-[#8C7A6B] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0A7B54]" />
                14-Day Hassle-Free Returns & Exchanges
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
