import React, { useState } from 'react';
import {
  X,
  Layers,
  MapPin,
  Mail,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  Package,
  ShieldCheck,
  Send,
  Scissors,
  Truck
} from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import { triggerZapierEvent } from '../utils/zapier';

export interface SwatchRequestData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  selectedColor: string;
  notes?: string;
  product: Product;
}

interface FabricSwatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColor?: string;
  defaultEmail?: string;
  onRequestSwatch?: (data: SwatchRequestData) => void;
}

export const FabricSwatchModal: React.FC<FabricSwatchModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedColor = product.colors[0] || 'Default',
  defaultEmail = 'abdans52@gmail.com',
  onRequestSwatch
}) => {
  const [fullName, setFullName] = useState('Abdan S');
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState('+91 98200 12345');
  const [street, setStreet] = useState('Flat 402, Royal Palms Estate, Palm Beach Road');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('400050');
  const [country, setCountry] = useState('India');
  const [swatchColor, setSwatchColor] = useState<string>(selectedColor || 'All Color Shades');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [swatchTrackingCode, setSwatchTrackingCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !street || !city || !postalCode) return;

    hapticSuccess();
    const trackingCode = `SWATCH-${Math.floor(100000 + Math.random() * 900000)}`;
    setSwatchTrackingCode(trackingCode);

    const requestData: SwatchRequestData = {
      fullName,
      email,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      selectedColor: swatchColor,
      notes,
      product
    };

    // Trigger Zapier Webhook
    triggerZapierEvent('fabric_swatch.requested', {
      productName: product.name,
      productId: product.id,
      category: product.category,
      fullName,
      email,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      selectedColor: swatchColor,
      notes
    }).catch((err) => {
      console.warn('Zapier swatch request notice:', err);
    });

    if (onRequestSwatch) {
      onRequestSwatch(requestData);
    }

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    hapticLight();
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      id="fabric-swatch-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div
        id="fabric-swatch-modal-dialog"
        className="relative w-full max-w-xl bg-[#FAF7F2] dark:bg-[#181411] border border-[#C59B27] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-[#14100D] p-5 sm:p-6 text-white border-b border-[#C59B27]/40 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-1.5 text-[#C5BAAC] hover:text-white rounded-full bg-[#241F1B] border border-[#C59B27]/30 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#2A231C] border border-[#C59B27]/60 rounded-full text-[10px] font-cinzel text-[#F5D77F] uppercase tracking-widest">
              <Scissors className="w-3 h-3 text-[#D4AF37]" />
              Complimentary Atelier Service
            </span>
          </div>

          <h2 className="font-playfair text-xl sm:text-2xl text-[#FAF7F2] font-semibold tracking-wide">
            Request Fabric Swatch Sample
          </h2>
          <p className="text-xs text-[#C5BAAC] font-sans-ui mt-1 leading-relaxed">
            Experience the tactile weave, hand-feel, and authentic zari luster in person before placing your bespoke order.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Mini Product & Textile Card */}
          <div className="flex items-center gap-4 p-3.5 bg-[#F2ECE1] dark:bg-[#201A15] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
            <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#120F0D] border border-[#DDD3BC] dark:border-[#2E2620] shrink-0">
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                aspectRatio="aspect-3/4"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] uppercase font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37]">
                  {product.category}
                </span>
                <span className="text-[9.5px] font-mono text-[#25D366] font-semibold bg-[#25D366]/10 px-2 py-0.5 rounded-full">
                  Free Sample Mailer
                </span>
              </div>
              <h4 className="font-playfair text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                {product.name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-[#6B5D50] dark:text-[#C5BAAC] font-sans-ui">
                <Layers className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span className="truncate"><strong>Textile:</strong> {product.fabric}</span>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-4 bg-[#F0F9F4] dark:bg-[#0E241A] p-6 rounded-2xl border border-[#25D366]/40 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#25D366]/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-playfair text-xl font-bold text-[#0F5A47] dark:text-[#38D39F]">
                  Fabric Swatch Sample Dispatched!
                </h3>
                <p className="text-xs text-[#2D5A46] dark:text-[#A2E2C8] font-sans-ui max-w-md mx-auto leading-relaxed">
                  Your complimentary luxury swatch sample envelope has been logged and queued for atelier dispatch.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-[#14261C] p-4 rounded-xl border border-[#25D366]/30 text-left space-y-2 text-xs font-sans-ui text-[#1E1A17] dark:text-[#E8F5EF]">
                <div className="flex items-center justify-between border-b border-[#25D366]/20 pb-2">
                  <span className="font-cinzel text-[10px] text-[#0F5A47] dark:text-[#38D39F] font-bold uppercase">
                    Dispatch Reference
                  </span>
                  <span className="font-mono font-bold text-[#0F5A47] dark:text-[#38D39F]">
                    #{swatchTrackingCode}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[#5A7A6B] dark:text-[#8EBEAA]">Recipient:</span>
                  <span className="font-medium text-right">{fullName} ({email})</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[#5A7A6B] dark:text-[#8EBEAA]">Mailing Address:</span>
                  <span className="font-medium text-right max-w-xs">{street}, {city}, {state} {postalCode}, {country}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[#5A7A6B] dark:text-[#8EBEAA]">Swatch Shade:</span>
                  <span className="font-medium text-[#8C6B1B] dark:text-[#F5D77F]">{swatchColor}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[#5A7A6B] dark:text-[#8EBEAA]">Estimated Delivery:</span>
                  <span className="font-medium text-[#0F5A47] dark:text-[#38D39F]">3 – 5 Business Days via Priority Air Mail</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-3 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-md transition-all cursor-pointer"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Collection Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Swatch Color / Preference Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                  Select Swatch Color / Shade Preference
                </label>
                <div className="flex flex-wrap gap-2">
                  {['All Color Shades', ...(product.colors || [])].map((col, cIdx) => (
                    <button
                      key={`swatch-col-${product.id}-${col}-${cIdx}`}
                      type="button"
                      onClick={() => setSwatchColor(col)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-sans-ui font-medium transition-all ${
                        swatchColor === col
                          ? 'bg-[#181411] dark:bg-[#C59B27] text-[#F5D77F] dark:text-[#181411] border-[#C59B27] shadow-xs'
                          : 'bg-white dark:bg-[#201A15] border-[#DDD3BC] dark:border-[#2E2620] text-[#54463A] dark:text-[#C5BAAC] hover:bg-[#F2ECE0]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#8C6B1B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#8C6B1B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                </div>
              </div>

              {/* Phone / Mobile */}
              <div className="space-y-1">
                <label className="text-[11px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                  Contact Phone (For Courier Dispatch SMS)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#8C6B1B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>

              {/* Physical Mailing Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                  Street Address / Apartment / Suite <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6B1B] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House / Flat No., Building name, Street"
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>

              {/* City, State, Postal Code, Country */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                    State / Prov.
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3 py-2 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="PIN / Zip"
                    className="w-full px-3 py-2 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full px-3 py-2 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider block">
                  Bespoke Notes / Requirements (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Planning a bridal ensemble, looking for matching chiffon drape"
                  className="w-full px-3 py-2 bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              {/* Value proposition badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-2 p-2 bg-[#F2ECE1] dark:bg-[#201A15] rounded-xl border border-[#DDD3BC] dark:border-[#2E2620] text-[10.5px] font-sans-ui text-[#54463A] dark:text-[#C5BAAC]">
                  <Truck className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>Free Priority Air Courier Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#F2ECE1] dark:bg-[#201A15] rounded-xl border border-[#DDD3BC] dark:border-[#2E2620] text-[10.5px] font-sans-ui text-[#54463A] dark:text-[#C5BAAC]">
                  <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>100% Genuine Atelier Sample</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  Request Swatch Sample Envelope
                </button>
                <p className="text-[10px] text-[#8C7A6B] text-center font-sans-ui">
                  No credit card required. Shipped inside our gold-sealed sample sleeve.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
