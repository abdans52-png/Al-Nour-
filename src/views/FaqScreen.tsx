import React, { useState } from 'react';
import { FAQS } from '../data/faq';
import { ChevronDown, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { ScreenType } from '../types';

interface FaqScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const FaqScreen: React.FC<FaqScreenProps> = ({ onNavigate }) => {
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-2']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Sizing & Modesty', 'Abaya Lengths', 'Fabrics & Care', 'Shipping & Delivery', 'Custom Orders & Bridal'];

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS.filter((faq) =>
    selectedCategory === 'All' ? true : faq.category === selectedCategory
  );

  return (
    <div id="screen-faq" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-16">
      {/* Header */}
      <div className="bg-[#181411] text-[#FAF7F2] py-14 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#C59B27]" /> Atelier Assistance
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            Guidance on modest sizing, choosing your abaya length, textile care, worldwide DHL shipping, and custom bridal orders.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat, cIdx) => (
            <button
              key={`faq-cat-${cat}-${cIdx}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-cinzel tracking-wider whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27] font-semibold shadow-xs'
                  : 'bg-[#F0EAE0] text-[#54463A] hover:bg-[#E2D8C7] border border-[#DDD3BC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, fIdx) => {
            const isOpen = openFaqIds.includes(faq.id);
            return (
              <div
                key={`faq-item-${faq.id}-${faq.category}-${fIdx}`}
                className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#F7F2E8] transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-sans-ui uppercase tracking-wider text-[#8C6B1B] font-semibold block mb-1">
                      {faq.category}
                    </span>
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#1E1A17]">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#F0EAE0] border border-[#DDD3BC] flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#181411] text-[#E8D59E] border-[#C59B27]' : 'text-[#1E1A17]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm font-sans-ui text-[#4A3E34] leading-relaxed border-t border-[#E8DFC8] bg-[#FAF7F2] whitespace-pre-line animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="bg-[#181411] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#C59B27]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#E8D59E]">
              Have a sizing, cosmetic, or styling question?
            </h4>
            <p className="text-xs text-[#C5BAAC] font-sans-ui">
              Our customer care team is available on WhatsApp for fast and friendly assistance.
            </p>
          </div>
          <a
            href="https://wa.me/919326294187"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5B] text-white rounded-xl text-xs font-cinzel font-semibold tracking-wider flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
          >
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
