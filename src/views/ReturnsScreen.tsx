import React from 'react';
import { RotateCcw, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';
import { ScreenType } from '../types';

interface ReturnsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ReturnsScreen: React.FC<ReturnsScreenProps> = ({ onNavigate }) => {
  return (
    <div id="screen-returns-exchanges" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-16">
      <div className="bg-[#181411] text-[#FAF7F2] py-14 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold">
            <RotateCcw className="w-3.5 h-3.5 text-[#C59B27]" /> Seamless Experience
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide text-white">
            Returns & Size Exchanges
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            We want you to feel complete confidence and joy in every AL-NOUREEN garment.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-8 text-xs font-sans-ui leading-relaxed text-[#4A3E34]">
        {/* 14-Day Guarantee Box */}
        <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="font-cinzel text-lg font-bold text-[#1E1A17]">
            14-Day Complimentary Exchange Window
          </h2>
          <p>
            You may request a size exchange or return on all ready-to-wear items within <strong>14 calendar days</strong> of receiving your package. Garments must be unworn, unwashed, in their original condition with all security ribbon tags intact, and in the original magnetic presentation box.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#F7F2E8] border border-[#DDD3BC] rounded-xl space-y-1.5">
              <span className="font-cinzel font-bold text-xs text-[#1E1A17] block">
                1. Request Online or WhatsApp
              </span>
              <p className="text-[11px] text-[#6E6053]">
                Message our concierge with your Order ID and desired replacement size or return request.
              </p>
            </div>
            <div className="p-4 bg-[#F7F2E8] border border-[#DDD3BC] rounded-xl space-y-1.5">
              <span className="font-cinzel font-bold text-xs text-[#1E1A17] block">
                2. Prepaid Courier Pickup
              </span>
              <p className="text-[11px] text-[#6E6053]">
                We generate a DHL courier return label and schedule a doorstep collection at your convenience.
              </p>
            </div>
            <div className="p-4 bg-[#F7F2E8] border border-[#DDD3BC] rounded-xl space-y-1.5">
              <span className="font-cinzel font-bold text-xs text-[#1E1A17] block">
                3. Fast Exchange or Refund
              </span>
              <p className="text-[11px] text-[#6E6053]">
                Once inspected at our atelier, your new size is dispatched or full refund processed in 3–5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Exceptions & Bespoke Notice */}
        <div className="p-6 bg-[#F7F2E8] border border-[#DDD3BC] rounded-2xl space-y-2">
          <h3 className="font-cinzel font-bold text-sm text-[#1E1A17]">
            Bespoke Bridal & Custom Sized Garments
          </h3>
          <p>
            Garments tailored to unique custom bridal measurements cannot be returned for cash refund, but our master tailoring atelier provides complimentary fit adjustments within 30 days of receipt to guarantee your ideal silhouette.
          </p>
        </div>
      </div>
    </div>
  );
};
