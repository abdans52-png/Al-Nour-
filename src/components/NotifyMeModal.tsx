import React, { useState } from 'react';
import {
  X,
  Bell,
  Sparkles,
  Check,
  Mail,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
  AlertCircle,
  Play
} from 'lucide-react';
import { Product, Currency, ProductSize } from '../types';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import { triggerZapierEvent } from '../utils/zapier';

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedSize?: ProductSize | string;
  selectedColor?: string;
  currency?: Currency;
  onSubscribe: (email: string, phone?: string, size?: string, color?: string) => void;
  onSimulateRestock?: (product: Product, size?: string, color?: string, email?: string) => void;
  userEmail?: string;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedSize = 'M',
  selectedColor,
  currency = 'INR',
  onSubscribe,
  onSimulateRestock,
  userEmail = 'abdans52@gmail.com'
}) => {
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState('+91 98201 44521');
  const [notifyViaEmail, setNotifyViaEmail] = useState(true);
  const [notifyViaWhatsapp, setNotifyViaWhatsapp] = useState(true);
  const [chosenSize, setChosenSize] = useState<string>(selectedSize || product.sizes[0] || 'Standard');
  const [chosenColor, setChosenColor] = useState<string>(selectedColor || product.colors[0] || 'Default');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    hapticSuccess();

    // Trigger Zapier Webhook
    triggerZapierEvent('stock_notification.requested', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      size: chosenSize,
      color: chosenColor,
      email,
      phone: notifyViaWhatsapp ? phone : undefined,
      notifyViaEmail,
      notifyViaWhatsapp
    }).catch((err) => {
      console.warn('Zapier stock notification notice:', err);
    });

    onSubscribe(email, notifyViaWhatsapp ? phone : undefined, chosenSize, chosenColor);
    setIsSubmitted(true);
  };

  const handleTriggerSimulation = () => {
    hapticSuccess();
    setIsSimulating(true);
    if (onSimulateRestock) {
      onSimulateRestock(product, chosenSize, chosenColor, email);
    }
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div
      id="notify-me-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF7F2] dark:bg-[#181411] rounded-3xl shadow-2xl border border-[#C59B27]/50 overflow-hidden flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Header */}
        <div className="relative p-5 sm:p-6 bg-[#14100D] text-white border-b border-[#C59B27]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#241E18] border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shadow-sm">
              <Bell className="w-5 h-5 text-[#F5D77F] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-cinzel font-bold text-[#C59B27] uppercase tracking-widest">
                  Atelier Back-in-Stock Alert
                </span>
                <span className="px-1.5 py-0.2 bg-[#C59B27]/20 border border-[#C59B27]/40 text-[#F5D77F] text-[9px] font-mono rounded uppercase">
                  VIP Waitlist
                </span>
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#FAF7F2] leading-tight">
                Notify Me When Restocked
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#A69788] hover:text-white hover:bg-[#251E18] rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Product Mini Preview Card */}
          <div className="flex items-center gap-3.5 p-3.5 bg-[#F2ECE0] dark:bg-[#201A15] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-20 object-cover object-top rounded-xl border border-[#C59B27]/40 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[9.5px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E] uppercase tracking-wider">
                {product.category} • {product.fabric}
              </span>
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate mt-0.5">
                {product.name}
              </h4>
              <p className="font-serif text-sm font-bold text-[#8C6B1B] dark:text-[#F5D77F] mt-1">
                {formatPrice(product.price, currency)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-[#7A6B5D] dark:text-[#A69788]">
                <span>Size: <strong className="text-[#1E1A17] dark:text-[#FAF7F2]">{chosenSize}</strong></span>
                <span>•</span>
                <span>Color: <strong className="text-[#1E1A17] dark:text-[#FAF7F2]">{chosenColor}</strong></span>
              </div>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs text-[#594E43] dark:text-[#C5BAAC] leading-relaxed">
                  Due to the intricate hand-embroidered nature of our garments, heirloom pieces are tailored in limited batches. Leave your coordinates to secure priority reservation access when this piece returns.
                </p>
              </div>

              {/* Size & Color Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider mb-1.5">
                    Select Desired Size:
                  </label>
                  <select
                    value={chosenSize}
                    onChange={(e) => setChosenSize(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#251F1A] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27]"
                  >
                    {product.sizes.map((s, sIdx) => (
                      <option key={`notify-sz-${product.id}-${s}-${sIdx}`} value={s}>
                        Size {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider mb-1.5">
                    Select Desired Shade:
                  </label>
                  <select
                    value={chosenColor}
                    onChange={(e) => setChosenColor(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#251F1A] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27]"
                  >
                    {product.colors.map((c, cIdx) => (
                      <option key={`notify-col-${product.id}-${c}-${cIdx}`} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider">
                  Your VIP Email Address: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C6B1B] dark:text-[#C59B27] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#251F1A] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs sm:text-sm font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] placeholder-[#A69788] focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27]"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp for SMS Alert */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider">
                    WhatsApp / SMS Number:
                  </label>
                  <span className="text-[10px] text-[#8C7A6B] font-sans-ui">Optional Instant Ping</span>
                </div>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-[#8C6B1B] dark:text-[#C59B27] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98201 44521"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#251F1A] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs sm:text-sm font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] placeholder-[#A69788] focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27]"
                  />
                </div>
              </div>

              {/* Channels checkboxes */}
              <div className="p-3 bg-[#F2ECE0]/60 dark:bg-[#201A15] rounded-xl border border-[#DDD3BC]/80 dark:border-[#2E2620] space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-[#1E1A17] dark:text-[#FAF7F2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyViaEmail}
                    onChange={(e) => setNotifyViaEmail(e.target.checked)}
                    className="rounded border-[#C59B27] text-[#C59B27] focus:ring-[#C59B27]"
                  />
                  <span>Send priority notification email when inventory is restocked</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-[#1E1A17] dark:text-[#FAF7F2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyViaWhatsapp}
                    onChange={(e) => setNotifyViaWhatsapp(e.target.checked)}
                    className="rounded border-[#C59B27] text-[#C59B27] focus:ring-[#C59B27]"
                  />
                  <span>Send instant WhatsApp VIP concierge notification</span>
                </label>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="relative overflow-hidden group w-full py-3.5 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B3871B] hover:from-[#D4AF37] hover:to-[#C59B27] text-[#14100D] font-cinzel font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg hover:scale-101 active:scale-99 cursor-pointer flex items-center justify-center gap-2 border border-[#F5D77F]/60"
              >
                <div className="gold-sweep-beam pointer-events-none" />
                <Bell className="w-4 h-4" />
                <span>Register for Restock Alert</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            /* Confirmation State with Simulation Trigger */
            <div className="py-2 space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-md">
                <Check className="w-7 h-7 stroke-2" />
              </div>

              <div className="space-y-1">
                <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                  Restock Alert Registered
                </h4>
                <p className="text-xs font-sans-ui text-[#594E43] dark:text-[#C5BAAC] max-w-sm mx-auto leading-relaxed">
                  We have registered your request for <strong>{product.name}</strong> (Size {chosenSize} • {chosenColor}). You will receive an immediate notice at <strong>{email}</strong> the moment new pieces are crafted.
                </p>
              </div>

              {/* Simulation Sandbox Box */}
              <div className="p-4 bg-gradient-to-br from-[#F5EFE4] to-[#EAE0CD] dark:from-[#251E18] dark:to-[#1C1713] rounded-2xl border border-[#C59B27] text-left space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8C6B1B] dark:text-[#F5D77F]" />
                    <span className="font-cinzel text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider">
                      Interactive Restock Simulator
                    </span>
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-[#C59B27]/20 text-[#8C6B1B] dark:text-[#E8D59E] px-2 py-0.5 rounded font-bold">
                    Test Mode
                  </span>
                </div>
                <p className="text-[11px] text-[#6B5C4D] dark:text-[#A69788] leading-relaxed">
                  Click below to simulate an incoming restock event right now. This will dispatch a live notification to your <strong>NotificationCenter</strong>, play the atelier audio chime, and display the restock alert banner.
                </p>
                <button
                  type="button"
                  onClick={handleTriggerSimulation}
                  disabled={isSimulating}
                  className="w-full py-2.5 bg-[#181411] hover:bg-[#28211A] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:scale-101 active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-[#F5D77F]" />
                  <span>{isSimulating ? 'Triggering Notification...' : 'Simulate Restock Event Now'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#FAF7F2] dark:bg-[#201A15] hover:bg-[#F2ECE0] text-[#1E1A17] dark:text-[#FAF7F2] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Assurance Footer */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#E8DFC9] dark:border-[#2E2620] text-[10px] text-[#8C7A6B] dark:text-[#A69788]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C6B1B] dark:text-[#C59B27]" />
            <span>Maison AL-NOUREEN never spams. Your coordinates are strictly used for restock notifications.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
