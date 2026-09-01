import React, { useRef } from 'react';
import { SeasonalLookbook, Product, Currency } from '../types';
import { ProductImage } from './ProductImage';
import { formatPrice } from '../utils/currency';
import { hapticLight } from '../utils/haptics';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface SeasonalLookbooksSectionProps {
  lookbooks: SeasonalLookbook[];
  products: Product[];
  currency: Currency;
  onSelectLookbook: (lookbook: SeasonalLookbook) => void;
  onSelectProduct: (product: Product) => void;
}

export const SeasonalLookbooksSection: React.FC<SeasonalLookbooksSectionProps> = ({
  lookbooks,
  products,
  currency,
  onSelectLookbook,
  onSelectProduct
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    hapticLight();
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="seasonal-lookbooks-section" className="py-14 bg-[#181411] text-[#FAF7F2] relative overflow-hidden border-y border-[#C59B27]/30">
      {/* Subtle background ambient texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2C2219]/40 via-[#181411] to-[#120F0D] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B231D] border border-[#C59B27]/40 text-[#E8D59E] text-[10.5px] font-cinzel font-bold tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5 text-[#C59B27]" />
              Artisanal Editorial Series
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Seasonal Lookbooks & Trend Edits
            </h2>
            <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl">
              Curated styling narratives direct from our Mumbai master atelier. Explore cohesive wardrobe capsules tailored for your next unforgettable occasion.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-full bg-[#241E19] hover:bg-[#342B23] border border-[#C59B27]/40 text-[#E8D59E] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Scroll lookbooks left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-full bg-[#241E19] hover:bg-[#342B23] border border-[#C59B27]/40 text-[#E8D59E] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Scroll lookbooks right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontally-Scrollable Lookbooks Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {lookbooks.map((lb, index) => {
            // Find products associated with this lookbook for live piece preview
            const lbProducts = products.filter((p) => lb.productIds.includes(p.id));

            return (
              <div
                key={`lookbook-${lb.id}-${index}`}
                id={`lookbook-card-${lb.id}`}
                className="group relative flex-none w-[320px] sm:w-[420px] md:w-[460px] snap-center bg-[#241E19] border border-[#C59B27]/30 hover:border-[#C59B27] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[#C59B27]/10 flex flex-col justify-between"
              >
                {/* Hero Editorial Visual */}
                <div
                  onClick={() => onSelectLookbook(lb)}
                  className="relative aspect-4/3 overflow-hidden cursor-pointer bg-[#181411]"
                >
                  <ProductImage
                    src={lb.heroImage}
                    alt={lb.title}
                    aspectRatio="aspect-4/3"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241E19] via-transparent to-black/30 pointer-events-none" />

                  {/* Top Season Pill */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#181411]/90 backdrop-blur-md border border-[#C59B27]/60 text-[#E8D59E] font-cinzel text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {lb.season}
                    </span>
                  </div>

                  {/* Top Right Item Count Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FAF7F2] text-[10.5px] font-sans-ui flex items-center gap-1 border border-white/10">
                      <Layers className="w-3 h-3 text-[#C59B27]" /> {lb.itemCount} Curated Pieces
                    </span>
                  </div>

                  {/* Arabic subtitle floating over image base */}
                  {lb.arabicTitle && (
                    <div className="absolute bottom-3 right-4 z-10 text-right pointer-events-none">
                      <span className="font-serif text-[#E8D59E]/80 text-xs tracking-wide">
                        {lb.arabicTitle}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[#C59B27] text-[10.5px] font-cinzel font-semibold tracking-wider uppercase">
                      <Sparkles className="w-3 h-3" />
                      <span>{lb.vibe}</span>
                    </div>
                    <h3
                      onClick={() => onSelectLookbook(lb)}
                      className="font-cinzel text-xl sm:text-2xl font-bold text-[#FAF7F2] group-hover:text-[#E8D59E] transition-colors cursor-pointer leading-snug"
                    >
                      {lb.title}
                    </h3>
                    <p className="text-xs text-[#C5BAAC] font-sans-ui leading-relaxed line-clamp-2">
                      {lb.description}
                    </p>
                  </div>

                  {/* Mini Preview Gallery of Curated Products */}
                  <div className="pt-2 border-t border-[#3B3026]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#9C8A79] font-bold">
                        Included in this Capsule:
                      </span>
                      <span className="text-[10px] text-[#C59B27] font-semibold">
                        Preview Pieces
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {lbProducts.slice(0, 4).map((item, pIdx) => (
                        <div
                          key={`lb-${lb.id}-piece-${item.id}-${pIdx}`}
                          onClick={() => onSelectProduct(item)}
                          className="group/item relative aspect-square rounded-xl overflow-hidden bg-[#181411] border border-[#3B3026] hover:border-[#C59B27] cursor-pointer transition-all"
                          title={`${item.name} - ${formatPrice(item.price, currency)}`}
                        >
                          <ProductImage
                            src={item.images[0]}
                            alt={item.name}
                            aspectRatio="aspect-square"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[8px] font-cinzel text-[#E8D59E] font-bold text-center px-1">
                              View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectLookbook(lb)}
                      className="w-full py-3 px-4 bg-[#C59B27] hover:bg-[#D4AF37] active:scale-[0.98] text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Shop Curated Capsule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
