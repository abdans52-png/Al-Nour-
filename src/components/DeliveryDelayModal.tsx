import React, { useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  MapPin,
  FileText,
  Send,
  UserCheck
} from 'lucide-react';
import { Order, Currency } from '../types';
import { hapticLight, hapticSuccess } from '../utils/haptics';

interface DeliveryDelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  currency?: Currency;
  onConfirmDelay: (
    orderId: string,
    newEstimatedDate: string,
    reason: string,
    instructions: string,
    delayDays: number
  ) => void;
}

export const DeliveryDelayModal: React.FC<DeliveryDelayModalProps> = ({
  isOpen,
  onClose,
  order,
  currency = 'INR',
  onConfirmDelay
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Travelling / Out of Town');
  const [selectedDays, setSelectedDays] = useState<number>(3);
  const [customDate, setCustomDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    'Please hold the parcel at the regional express sorting facility. I will be back in the residence to sign for delivery.'
  );
  const [contactPhone, setContactPhone] = useState<string>(order?.shippingAddress.phone || '+91 93262 94187');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [simulatedTicketId, setSimulatedTicketId] = useState<string>('');

  if (!isOpen || !order) return null;

  // Calculate target formatted delivery date
  const calculateTargetDate = (): string => {
    if (useCustomDate && customDate) {
      const d = new Date(customDate);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    const d = new Date();
    d.setDate(d.getDate() + selectedDays + 2); // adding offset to current date
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formattedTargetDate = calculateTargetDate();

  const handleQuickDaysSelect = (days: number) => {
    hapticLight();
    setUseCustomDate(false);
    setSelectedDays(days);
    const d = new Date();
    d.setDate(d.getDate() + days + 2);
    setCustomDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticSuccess();
    const ticketNum = `HLD-${Math.floor(100000 + Math.random() * 900000)}`;
    setSimulatedTicketId(ticketNum);
    onConfirmDelay(
      order.id,
      formattedTargetDate,
      selectedReason,
      specialInstructions,
      useCustomDate ? 5 : selectedDays
    );
    setIsSubmitted(true);
  };

  // Support Message Generation
  const supportSimulatedMessage = `Dear ${order.shippingAddress.fullName || 'Patron'},\n\nWe have received your delivery hold request for Order #${order.id} (Airway Bill #${order.trackingNumber}).\n\n• Reason: ${selectedReason}\n• Rescheduled Delivery Date: ${formattedTargetDate}\n• Instructions: "${specialInstructions}"\n\nOur Atelier Dispatch Desk has instructed ${order.carrier} to place a security hold on your consignment at the regional hub. Delivery attempts are paused until ${formattedTargetDate}.\n\nTicket Reference: #${simulatedTicketId || 'HLD-882194'}\nAtelier Logistics Concierge`;

  const handleCopySupportMessage = () => {
    navigator.clipboard.writeText(supportSimulatedMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const reasonsList = [
    'Travelling / Out of Town',
    'Gated Community / Security Desk Unavailable',
    'Prefer Weekend Delivery',
    'Hold for Pickup at Local DHL Facility',
    'Office / Residence Renovation',
    'Custom Delivery Timing'
  ];

  return (
    <div
      id="delivery-delay-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FAF7F2] dark:bg-[#181411] rounded-3xl shadow-2xl border border-[#C59B27]/50 overflow-hidden flex flex-col pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Header */}
        <div className="p-5 sm:p-6 bg-[#14100D] text-white border-b border-[#C59B27]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#241E18] border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shadow-sm">
              <Clock className="w-5 h-5 text-[#F5D77F]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-cinzel font-bold text-[#C59B27] uppercase tracking-widest">
                  Courier Management
                </span>
                <span className="px-1.5 py-0.2 bg-[#C59B27]/20 border border-[#C59B27]/40 text-[#F5D77F] text-[9px] font-mono rounded uppercase">
                  Order #{order.id}
                </span>
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#FAF7F2] leading-tight">
                Request a Delivery Delay / Hold
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
          {/* Order Context Banner */}
          <div className="flex items-center justify-between p-3.5 bg-[#F2ECE0] dark:bg-[#201A15] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620] text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E] uppercase tracking-wider">
                Current Scheduled Delivery:
              </span>
              <p className="font-serif font-bold text-sm text-[#1E1A17] dark:text-[#FAF7F2]">
                {order.estimatedDelivery}
              </p>
              <p className="text-[11px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui">
                Carrier: {order.carrier} • Airway Bill: <span className="font-mono font-bold">{order.trackingNumber}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-full text-[10px] font-cinzel font-bold uppercase">
                <ShieldCheck className="w-3 h-3" /> Safe Hub Hold Eligible
              </span>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason Selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider">
                  Select Reason for Delay / Reschedule: <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#251F1A] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs sm:text-sm font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27]"
                >
                  {reasonsList.map((r, rIdx) => (
                    <option key={`delay-reason-${r}-${rIdx}`} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hold Duration & New Target Date Picker */}
              <div className="space-y-2">
                <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider">
                  Select Hold Duration / New Delivery Target:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDaysSelect(2)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-cinzel font-bold text-center transition-all cursor-pointer ${
                      !useCustomDate && selectedDays === 2
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] shadow-sm ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#251F1A] border-[#DDD3BC] dark:border-[#3D352D] text-[#3D332A] dark:text-[#E0D7CC] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    +2 Days Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDaysSelect(4)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-cinzel font-bold text-center transition-all cursor-pointer ${
                      !useCustomDate && selectedDays === 4
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] shadow-sm ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#251F1A] border-[#DDD3BC] dark:border-[#3D352D] text-[#3D332A] dark:text-[#E0D7CC] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    +4 Days Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDaysSelect(7)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-cinzel font-bold text-center transition-all cursor-pointer ${
                      !useCustomDate && selectedDays === 7
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] shadow-sm ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#251F1A] border-[#DDD3BC] dark:border-[#3D352D] text-[#3D332A] dark:text-[#E0D7CC] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    +1 Week Hold
                  </button>
                </div>

                {/* Custom Date Input Option */}
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="custom-date-checkbox"
                      checked={useCustomDate}
                      onChange={(e) => setUseCustomDate(e.target.checked)}
                      className="rounded border-[#C59B27] text-[#C59B27] focus:ring-[#C59B27]"
                    />
                    <label
                      htmlFor="custom-date-checkbox"
                      className="text-xs text-[#594E43] dark:text-[#C5BAAC] font-medium cursor-pointer"
                    >
                      Or pick a specific target delivery date:
                    </label>
                  </div>

                  {useCustomDate && (
                    <div className="relative mt-1.5">
                      <Calendar className="w-4 h-4 text-[#8C6B1B] dark:text-[#C59B27] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#251F1A] border border-[#C59B27] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:ring-1 focus:ring-[#C59B27]"
                      />
                    </div>
                  )}
                </div>

                {/* Dynamic Calculated Reschedule Target */}
                <div className="p-3 bg-[#FAF7F2] dark:bg-[#201A15] rounded-xl border border-[#C59B27]/50 flex items-center justify-between">
                  <span className="text-[11px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E] uppercase tracking-wider">
                    Requested New Delivery Date:
                  </span>
                  <span className="font-serif font-bold text-sm text-[#1E1A17] dark:text-[#FAF7F2]">
                    {formattedTargetDate}
                  </span>
                </div>
              </div>

              {/* Special Instructions & Storage Notes */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider">
                  Instructions for Courier & Atelier Concierge:
                </label>
                <textarea
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please hold in climate-controlled security storage until client returns..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#251F1A] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27]"
                />
              </div>

              {/* Confirmation Phone */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider">
                  Contact Phone for Courier Verification:
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#251F1A] border border-[#DDD3BC] dark:border-[#3D352D] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-[#FAF7F2] focus:ring-1 focus:ring-[#C59B27] focus:border-[#C59B27]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="relative overflow-hidden group w-full py-3.5 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B3871B] hover:from-[#D4AF37] hover:to-[#C59B27] text-[#14100D] font-cinzel font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg hover:scale-101 active:scale-99 cursor-pointer flex items-center justify-center gap-2 border border-[#F5D77F]/60"
              >
                <div className="gold-sweep-beam pointer-events-none" />
                <Clock className="w-4 h-4" />
                <span>Confirm Delivery Hold Request</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            /* Confirmation & Simulated Customer Support Message Screen */
            <div className="space-y-5">
              {/* Success Badge */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                    Delivery Hold Synchronized with Carrier
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-sans-ui mt-0.5">
                    Order #{order.id} delivery rescheduled to <strong>{formattedTargetDate}</strong>.
                  </p>
                </div>
              </div>

              {/* Simulated Customer Support Team Ticket & Transmission Log */}
              <div className="bg-[#181411] text-[#FAF7F2] p-5 rounded-2xl border border-[#C59B27]/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#C59B27]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#F5D77F]" />
                    <h5 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-wider">
                      Simulated Support Team Message
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                    Ticket #{simulatedTicketId} • Logged
                  </span>
                </div>

                {/* Message Body */}
                <div className="bg-[#241E18] p-4 rounded-xl border border-[#3D3328] font-sans-ui text-xs text-[#E6DCce] leading-relaxed whitespace-pre-line space-y-2">
                  <p>{supportSimulatedMessage}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopySupportMessage}
                    className="px-3 py-1.5 bg-[#2B231D] hover:bg-[#3D3328] text-[#E8D59E] border border-[#C59B27]/50 rounded-lg text-[11px] font-cinzel font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMessage ? 'Copied to Clipboard' : 'Copy Message'}</span>
                  </button>

                  <a
                    href={`https://wa.me/919326294187?text=${encodeURIComponent(
                      `Hello Atelier Support Concierge, I requested a delivery hold for Order #${order.id} (Ticket #${simulatedTicketId}) until ${formattedTargetDate}. Please ensure package is held securely at the DHL sorting facility.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5B] text-white rounded-lg text-[11px] font-cinzel font-bold tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Send to WhatsApp Support</span>
                  </a>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-7 py-3 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] font-cinzel font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-md active:scale-98"
                >
                  Return to Live Order Tracking
                </button>
              </div>
            </div>
          )}

          {/* Guarantee footer */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#E8DFC9] dark:border-[#2E2620] text-[10px] text-[#8C7A6B] dark:text-[#A69788]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C6B1B] dark:text-[#C59B27]" />
            <span>Complimentary signature hold service provided by DHL Express Priority & AL-NOUREEN Atelier.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
