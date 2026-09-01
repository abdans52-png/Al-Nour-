import React from 'react';
import { Shield, FileText } from 'lucide-react';
import { ScreenType } from '../types';

interface LegalScreenProps {
  type: 'privacy' | 'terms';
  onNavigate: (screen: ScreenType) => void;
}

export const LegalScreens: React.FC<LegalScreenProps> = ({ type, onNavigate }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div id={`screen-${type}`} className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-16">
      <div className="bg-[#181411] text-[#FAF7F2] py-14 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold">
            {isPrivacy ? <Shield className="w-3.5 h-3.5 text-[#C59B27]" /> : <FileText className="w-3.5 h-3.5 text-[#C59B27]" />}
            Maison Legal Policy
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide text-white">
            {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions of Service'}
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            Last Updated: August 2026 • AL-NOUREEN Haute Couture Global Client Relations
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-8 text-xs font-sans-ui leading-relaxed text-[#4A3E34]">
        {isPrivacy ? (
          <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <section className="space-y-2">
              <h2 className="font-cinzel text-base font-bold text-[#1E1A17]">1. Commitment to Client Confidentiality</h2>
              <p>
                At AL-NOUREEN, we treat patron confidentiality with utmost sanctity. We do not sell, rent, or lease your personal information, measurement profiles, or payment details to any third-party marketing brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-cinzel text-base font-bold text-[#1E1A17]">2. Data Collected for Order Fulfillment</h2>
              <p>
                To tailor and dispatch your luxury garments, we collect essential details such as your name, shipping address, WhatsApp contact number (for courier dispatch alerts), and measurement records.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-cinzel text-base font-bold text-[#1E1A17]">3. Payment Security & Encryption</h2>
              <p>
                All digital order checkout transactions are encrypted through 256-Bit SSL and PCI-DSS Level 1 certified gateways. AL-NOUREEN never stores raw payment credentials on local servers.
              </p>
            </section>
          </div>
        ) : (
          <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <section className="space-y-2">
              <h2 className="font-cinzel text-base font-bold text-[#1E1A17]">1. Artisan Handcrafting Variations</h2>
              <p>
                Due to the authentic handcrafted nature of our Pakistani zardozi, hand-shadow chikankari, and vegetable-dyed silk weaves, subtle organic variations in embroidery stitch tension or dye absorption are hallmarks of genuine haute couture rather than defects.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-cinzel text-base font-bold text-[#1E1A17]">2. Intellectual Property & Designs</h2>
              <p>
                All AL-NOUREEN logos, crest emblems, product photography, editorial lookbooks, and proprietary modest garment patterns are the exclusive intellectual property of Maison AL-NOUREEN.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-cinzel text-base font-bold text-[#1E1A17]">3. Pricing & Currency Conversions</h2>
              <p>
                Prices are displayed in your chosen currency (USD, GBP, EUR, AED, PKR, SAR, INR). Checkout charges are processed securely in accordance with standard international banking exchange rates.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
