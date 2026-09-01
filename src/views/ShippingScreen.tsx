import React from 'react';
import { Truck, Globe, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { ScreenType } from '../types';

interface ShippingScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ShippingScreen: React.FC<ShippingScreenProps> = ({ onNavigate }) => {
  return (
    <div id="screen-shipping-delivery" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-16">
      <div className="bg-[#181411] text-[#FAF7F2] py-14 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold">
            <Truck className="w-3.5 h-3.5 text-[#C59B27]" /> Global Logistics
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide text-white">
            Shipping & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            Dispatched in signature gold-embossed presentation boxes via DHL Express and FedEx Priority worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-8 text-xs font-sans-ui leading-relaxed text-[#4A3E34]">
        {/* Region Timelines Table */}
        <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="font-cinzel text-lg font-bold text-[#1E1A17]">
            Estimated Delivery Timelines by Region
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[#DDD3BC]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#181411] text-[#E8D59E] font-cinzel text-[11px]">
                  <th className="p-3">Destination</th>
                  <th className="p-3">Courier Partner</th>
                  <th className="p-3">Estimated Transit Time</th>
                  <th className="p-3">Complimentary Shipping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD3BC] bg-[#FAF7F2]">
                <tr className="hover:bg-[#F2ECE0]">
                  <td className="p-3 font-semibold text-[#1E1A17]">UAE & GCC (Saudi Arabia, Qatar, Kuwait)</td>
                  <td className="p-3">DHL Express Air</td>
                  <td className="p-3">2 – 3 Business Days</td>
                  <td className="p-3 text-[#0A7B54] font-semibold">Orders over $150</td>
                </tr>
                <tr className="hover:bg-[#F2ECE0]">
                  <td className="p-3 font-semibold text-[#1E1A17]">United Kingdom & Europe</td>
                  <td className="p-3">DHL Express Priority</td>
                  <td className="p-3">3 – 4 Business Days</td>
                  <td className="p-3 text-[#0A7B54] font-semibold">Orders over $150</td>
                </tr>
                <tr className="hover:bg-[#F2ECE0]">
                  <td className="p-3 font-semibold text-[#1E1A17]">United States & Canada</td>
                  <td className="p-3">FedEx Priority / DHL</td>
                  <td className="p-3">3 – 5 Business Days</td>
                  <td className="p-3 text-[#0A7B54] font-semibold">Orders over $150</td>
                </tr>
                <tr className="hover:bg-[#F2ECE0]">
                  <td className="p-3 font-semibold text-[#1E1A17]">Pakistan & India</td>
                  <td className="p-3">TCS / BlueEx / Express Courier</td>
                  <td className="p-3">1 – 3 Business Days</td>
                  <td className="p-3 text-[#0A7B54] font-semibold">Complimentary all orders</td>
                </tr>
                <tr className="hover:bg-[#F2ECE0]">
                  <td className="p-3 font-semibold text-[#1E1A17]">Rest of World (90+ Countries)</td>
                  <td className="p-3">DHL International Express</td>
                  <td className="p-3">4 – 6 Business Days</td>
                  <td className="p-3 text-[#0A7B54] font-semibold">Orders over $200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#F7F2E8] border border-[#DDD3BC] rounded-2xl space-y-2">
            <h3 className="font-cinzel font-bold text-sm text-[#1E1A17]">
              Ready-to-Wear Items
            </h3>
            <p>
              In-stock Abayas, Pure Silk Hijabs, Co-ords, and accessories are dispatched within <strong>24–48 hours</strong> from order confirmation.
            </p>
          </div>

          <div className="p-5 bg-[#F7F2E8] border border-[#DDD3BC] rounded-2xl space-y-2">
            <h3 className="font-cinzel font-bold text-sm text-[#1E1A17]">
              Handcrafted & Bridal Outfits
            </h3>
            <p>
              Made-to-order Pakistani formal ensembles involving bespoke hand zardozi typically require <strong>4–7 business days</strong> for master artisan finishing prior to flight dispatch.
            </p>
          </div>
        </div>

        {/* Customs & Duties */}
        <div className="p-6 bg-[#FAF7F2] border border-[#E0D5BE] rounded-2xl space-y-2">
          <h3 className="font-cinzel font-bold text-sm text-[#1E1A17]">
            Customs, Taxes & Duties
          </h3>
          <p>
            For customers in the United States, GCC, UK, and Pakistan, orders are shipped with duties pre-calculated or covered under standard de minimis thresholds. For other destinations, any local import duties assessed by your national customs authority are handled seamlessly by DHL at delivery.
          </p>
        </div>
      </div>
    </div>
  );
};
