import React, { useState } from 'react';
import {
  X,
  Bell,
  Sparkles,
  TrendingDown,
  Mail,
  CheckCircle2,
  Percent,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { ProductImage } from './ProductImage';
import { triggerZapierEvent } from '../utils/zapier';

interface PriceDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currency?: Currency;
  onSubscribe: (email: string, discountPercent: number) => void;
  defaultEmail?: string;
}

export const PriceDropModal: React.FC<PriceDropModalProps> = ({
  isOpen,
  onClose,
  product,
  currency = 'INR',
  onSubscribe,
  defaultEmail = 'abdans52@gmail.com'
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [discountPercent, setDiscountPercent] = useState<number>(15);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const simulatedDroppedPrice = Math.round(product.price * (1 - discountPercent / 100));
  const savings = product.price - simulatedDroppedPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    // Trigger Zapier Webhook
    triggerZapierEvent('price_drop.requested', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      currentPrice: product.price,
      targetDiscountPercent: discountPercent,
      targetPrice: simulatedDroppedPrice,
      savingsExpected: savings,
      email,
      currency
    }).catch((err) => {
      console.warn('Zapier price drop notice:', err);
    });

    onSubscribe(email, discountPercent);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#181411] border border-[#C59B27] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#14100D] p-5 sm:p-6 text-white border-b border-[#C59B27]/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#C5BAAC] hover:text-white rounded-full bg-[#241F1B] border border-[#C59B27]/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#2A231C] border border-[#C59B27]/60 rounded-full text-[10px] font-cinzel text-[#F5D77F] uppercase tracking-widest">
              <TrendingDown className="w-3 h-3 text-[#D4AF37]" />
              Haute Atelier Price Watch
            </span>
          </div>

          <h2 className="font-playfair text-xl sm:text-2xl text-[#FAF7F2] font-semibold tracking-wide">
            Notify Me When Price Drops
          </h2>
          <p className="text-xs text-[#C5BAAC] font-sans-ui mt-1">
            Receive automated real-time alert emails and notifications the moment this handcrafted piece goes on privilege discount.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Product Mini Preview */}
          <div className="flex items-center gap-4 p-3.5 bg-[#F2ECE1] dark:bg-[#201A15] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
            <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#120F0D] border border-[#DDD3BC] dark:border-[#2E2620] flex-shrink-0">
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                aspectRatio="aspect-3/4"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9.5px] uppercase font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37]">
                {product.category}
              </span>
              <h4 className="font-playfair text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs font-sans-ui text-[#7A6B5D] dark:text-[#A69788]">Current:</span>
                <span className="font-serif font-bold text-sm text-[#1E1A17] dark:text-[#FAF7F2]">
                  {formatPrice(product.price, currency)}
                </span>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6 space-y-3 bg-[#F0F9F4] dark:bg-[#0E241A] p-6 rounded-2xl border border-[#25D366]/40 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-[#0F5A47] dark:text-[#38D39F]">
                Price Alert Registered!
              </h3>
              <p className="text-xs text-[#2D5A46] dark:text-[#A2E2C8] font-sans-ui max-w-sm mx-auto">
                We will email <strong>{email}</strong> when <em>{product.name}</em> reaches {discountPercent}% off or drops below {formatPrice(simulatedDroppedPrice, currency)}.
              </p>
              <div className="text-[11px] text-[#8C6B1B] dark:text-[#D4AF37] font-cinzel font-semibold pt-1">
                ✨ Simulated test notification sent to your Automated Alerts Center!
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Discount Threshold Selector */}
              <div className="space-y-2">
                <label className="text-xs font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                  Notify Me When Price Drops By:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Any Drop (5%)', pct: 5 },
                    { label: '15% Off (Save ' + formatPrice(Math.round(product.price * 0.15), currency) + ')', pct: 15 },
                    { label: '25% Off (Save ' + formatPrice(Math.round(product.price * 0.25), currency) + ')', pct: 25 },
                  ].map((tier, tIdx) => (
                    <button
                      key={`price-tier-${tier.pct}-${tIdx}`}
                      type="button"
                      onClick={() => setDiscountPercent(tier.pct)}
                      className={`py-2.5 px-2 text-center rounded-xl border text-xs font-cinzel font-bold transition-all ${
                        discountPercent === tier.pct
                          ? 'bg-[#181411] dark:bg-[#C59B27] text-[#E8D59E] dark:text-[#181411] border-[#C59B27] shadow-xs ring-1 ring-[#C59B27]'
                          : 'bg-white dark:bg-[#201A15] border-[#DDD3BC] dark:border-[#2E2620] text-[#54463A] dark:text-[#C5BAAC] hover:bg-[#F2ECE0]'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7A6B5D] dark:text-[#A69788] pt-1">
                  <span>Target Trigger Price:</span>
                  <span className="font-serif font-bold text-[#8C6B1B] dark:text-[#D4AF37]">
                    {formatPrice(simulatedDroppedPrice, currency)} (Save {formatPrice(savings, currency)})
                  </span>
                </div>
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                  Your VIP Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6B1B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email (e.g. yourname@example.com)"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#D4AF37]" />
                  Set Price Alert & Simulate Drop Alert
                </button>
                <p className="text-[10px] text-[#8C7A6B] text-center font-sans-ui">
                  No spam. Only high-priority atelier price movement and private capsule restock alerts.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
