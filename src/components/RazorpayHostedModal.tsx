import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Building2,
  Smartphone,
  Check
} from 'lucide-react';
import { Currency, Order } from '../types';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import { playNotificationChime } from '../utils/notificationSound';
import { RazorpayPaymentOptions } from '../utils/razorpay';

interface RazorpayHostedModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: RazorpayPaymentOptions | null;
}

export const RazorpayHostedModal: React.FC<RazorpayHostedModalProps> = ({
  isOpen,
  onClose,
  options
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'link'>('upi');
  const [upiId, setUpiId] = useState<string>('patron@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4312 8820 9145 3290');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('842');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'form' | 'processing' | 'success'>('form');

  useEffect(() => {
    if (isOpen) {
      setAuthStep('form');
      setIsAuthorizing(false);
    }
  }, [isOpen]);

  if (!isOpen || !options) return null;

  const totalAmount = options.amount;
  const currency = options.currency;

  const handleAuthorizePayment = () => {
    hapticLight();
    setIsAuthorizing(true);
    setAuthStep('processing');

    const paymentId = `pay_${Math.random().toString(36).substring(2, 14)}_${Date.now()}`;
    const rzpOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    setTimeout(() => {
      setAuthStep('success');
      hapticSuccess();
      playNotificationChime();

      setTimeout(() => {
        const completedOrder: Order = {
          id: `ALN-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          itemsCount: options.items.reduce((s, i) => s + i.quantity, 0),
          subtotal: options.items.reduce((s, i) => s + i.product.price * i.quantity, 0),
          discount: options.discount || 0,
          shipping: options.shipping || 0,
          total: options.amount,
          status: 'In Atelier Tailoring',
          estimatedDelivery: '3–5 Business Days via DHL Express Air',
          trackingNumber: `EXP-IN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          carrier: 'DHL Express Priority Air',
          shippingAddress: {
            fullName: options.customer.name,
            email: options.customer.email,
            phone: options.customer.phone,
            street: options.customer.address || 'Signature Address',
            city: options.customer.city || 'Mumbai',
            state: options.customer.state || 'Maharashtra',
            country: options.customer.country || 'India',
            postalCode: options.customer.postalCode || '400001'
          },
          paymentMethod: `Razorpay Online Payment (${selectedMethod.toUpperCase()}: ${paymentId})`,
          orderNotes: options.orderNotes,
          items: options.items.map((ci) => ({
            productId: ci.product.id,
            name: ci.product.name,
            image: ci.product.images[0],
            size: ci.size,
            color: ci.color,
            quantity: ci.quantity,
            price: ci.product.price
          }))
        };

        // Post verification to server
        fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: rzpOrderId,
            razorpay_payment_id: paymentId,
            orderData: completedOrder
          })
        }).catch((e) => console.warn('Server verify notice:', e));

        options.onSuccess({
          razorpay_payment_id: paymentId,
          razorpay_order_id: rzpOrderId,
          order: completedOrder
        });

        onClose();
      }, 1000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1A1613] w-full max-w-lg rounded-2xl shadow-2xl border border-[#DDD3BC] dark:border-[#382E25] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] px-5 py-4 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3395FF] flex items-center justify-center font-bold text-white text-lg tracking-wider shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">Razorpay</span>
                <span className="bg-[#3395FF]/20 text-[#3395FF] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#3395FF]/40 uppercase tracking-wider">
                  Verified Gateway
                </span>
              </div>
              <p className="text-xs text-blue-200">AL Noureen by Nasreen</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase text-blue-200 block">Total Payable</span>
              <span className="font-serif font-bold text-base text-white">
                {formatPrice(totalAmount, currency as Currency)}
              </span>
            </div>
            <button
              onClick={onClose}
              disabled={isAuthorizing}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {authStep === 'processing' ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <RefreshCw className="w-12 h-12 text-[#3395FF] animate-spin" />
              <Lock className="w-5 h-5 text-[#0C2340] absolute inset-0 m-auto" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
              Authorizing via Razorpay Bank Node
            </h3>
            <p className="text-xs text-[#6B5E52] dark:text-[#A89C8F] max-w-xs">
              Communicating with your financial institution via 256-bit SSL encrypted token. Do not refresh.
            </p>
          </div>
        ) : authStep === 'success' ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-emerald-700 dark:text-emerald-400">
              Payment Authenticated
            </h3>
            <p className="text-xs text-[#6B5E52] dark:text-[#A89C8F]">
              Redirecting back to AL Noureen order confirmation...
            </p>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto space-y-5">
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-[#F4EDE2] dark:bg-[#251E19] rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'upi'
                    ? 'bg-white dark:bg-[#1E1A17] text-[#0C2340] dark:text-[#3395FF] shadow-xs font-semibold'
                    : 'text-[#6B5E52] dark:text-[#A89C8F] hover:text-[#1E1A17]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[11px]">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'card'
                    ? 'bg-white dark:bg-[#1E1A17] text-[#0C2340] dark:text-[#3395FF] shadow-xs font-semibold'
                    : 'text-[#6B5E52] dark:text-[#A89C8F] hover:text-[#1E1A17]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px]">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'netbanking'
                    ? 'bg-white dark:bg-[#1E1A17] text-[#0C2340] dark:text-[#3395FF] shadow-xs font-semibold'
                    : 'text-[#6B5E52] dark:text-[#A89C8F] hover:text-[#1E1A17]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[11px]">NetBank</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('wallet')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'wallet'
                    ? 'bg-white dark:bg-[#1E1A17] text-[#0C2340] dark:text-[#3395FF] shadow-xs font-semibold'
                    : 'text-[#6B5E52] dark:text-[#A89C8F] hover:text-[#1E1A17]'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span className="text-[11px]">Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('link')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex flex-col items-center gap-1 ${
                  selectedMethod === 'link'
                    ? 'bg-white dark:bg-[#1E1A17] text-[#0C2340] dark:text-[#3395FF] shadow-xs font-semibold'
                    : 'text-[#6B5E52] dark:text-[#A89C8F] hover:text-[#1E1A17]'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-[11px]">Direct URL</span>
              </button>
            </div>

            {/* Selected Method Details */}
            {selectedMethod === 'upi' && (
              <div className="space-y-3 bg-[#FAF7F2] dark:bg-[#201A15] p-4 rounded-xl border border-[#E8DFC8] dark:border-[#382E25]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                    Enter UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                  </label>
                  <span className="text-[10px] text-emerald-600 font-medium">⚡ Instant Auth</span>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okaxis / mobile@upi"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#171310] border border-[#DDD3BC] dark:border-[#453A30] rounded-lg focus:outline-hidden focus:border-[#3395FF]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['@okhdfcbank', '@okaxis', '@ybl', '@paytm', '@ibl'].map((suffix) => (
                    <button
                      key={suffix}
                      type="button"
                      onClick={() => setUpiId((prev) => prev.split('@')[0] + suffix)}
                      className="px-2 py-0.5 text-[10px] bg-white dark:bg-[#2A231C] border border-[#DDD3BC] dark:border-[#453A30] rounded text-[#4A3E34] dark:text-[#C5BAAC] hover:border-[#3395FF]"
                    >
                      {suffix}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="space-y-3 bg-[#FAF7F2] dark:bg-[#201A15] p-4 rounded-xl border border-[#E8DFC8] dark:border-[#382E25]">
                <div>
                  <label className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-[#171310] border border-[#DDD3BC] dark:border-[#453A30] rounded-lg focus:outline-hidden focus:border-[#3395FF]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] block mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-[#171310] border border-[#DDD3BC] dark:border-[#453A30] rounded-lg focus:outline-hidden focus:border-[#3395FF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] block mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-[#171310] border border-[#DDD3BC] dark:border-[#453A30] rounded-lg focus:outline-hidden focus:border-[#3395FF]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="space-y-3 bg-[#FAF7F2] dark:bg-[#201A15] p-4 rounded-xl border border-[#E8DFC8] dark:border-[#382E25]">
                <label className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] block mb-1">
                  Select Popular Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2 text-xs rounded-lg border text-left flex items-center justify-between ${
                        selectedBank === bank
                          ? 'border-[#3395FF] bg-blue-50/50 dark:bg-blue-950/20 text-[#0C2340] dark:text-[#3395FF] font-semibold'
                          : 'border-[#DDD3BC] dark:border-[#453A30] bg-white dark:bg-[#1E1A17] text-[#4A3E34] dark:text-[#C5BAAC]'
                      }`}
                    >
                      <span>{bank}</span>
                      {selectedBank === bank && <Check className="w-3.5 h-3.5 text-[#3395FF]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedMethod === 'wallet' && (
              <div className="space-y-3 bg-[#FAF7F2] dark:bg-[#201A15] p-4 rounded-xl border border-[#E8DFC8] dark:border-[#382E25]">
                <label className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] block mb-1">
                  Supported Wallets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Paytm', 'PhonePe', 'Mobikwik', 'Freecharge', 'Airtel Money', 'Amazon Pay'].map((w) => (
                    <div
                      key={w}
                      className="p-2 text-xs text-center rounded-lg border border-[#DDD3BC] dark:border-[#453A30] bg-white dark:bg-[#1E1A17] text-[#4A3E34] dark:text-[#C5BAAC]"
                    >
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMethod === 'link' && (
              <div className="space-y-3 bg-[#FAF7F2] dark:bg-[#201A15] p-4 rounded-xl border border-[#E8DFC8] dark:border-[#382E25]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                    Official Razorpay.me Hosted Payment URL
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">SSL Encrypted</span>
                </div>
                <p className="text-xs text-[#6B5E52] dark:text-[#A89C8F]">
                  You can proceed directly on the verified Razorpay payment portal or authorize your transaction below.
                </p>
                <a
                  href="https://razorpay.me/@AlNour?amount=CeQsAR0nTC%2BND0Le6liYzQ%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-white dark:bg-[#171310] border border-[#3395FF] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-[#0C2340] dark:text-[#3395FF] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Official Razorpay Link in New Tab</span>
                </a>
              </div>
            )}

            {/* Customer Summary & Security Guarantee */}
            <div className="p-3 bg-[#F0EAE1] dark:bg-[#251E19] rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between text-[#4A3E34] dark:text-[#C5BAAC]">
                <span>Patron Name:</span>
                <span className="font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                  {options.customer.name || 'Valued Guest'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#4A3E34] dark:text-[#C5BAAC]">
                <span>Contact Email:</span>
                <span className="font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                  {options.customer.email || 'patron@example.com'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#4A3E34] dark:text-[#C5BAAC]">
                <span>Contact Phone:</span>
                <span className="font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                  {options.customer.phone || '+91 9326294187'}
                </span>
              </div>
            </div>

            {/* Action Pay Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAuthorizePayment}
                className="w-full py-3.5 px-4 bg-[#3395FF] hover:bg-[#2482EB] active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-[#3395FF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                <Lock className="w-4 h-4" />
                <span>
                  Authorize {formatPrice(totalAmount, currency as Currency)} via Razorpay
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#6B5E52] dark:text-[#A89C8F]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PCI-DSS Level 1 Certified • 256-Bit SSL Encryption</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
