import React, { useState } from 'react';
import { ShopTheLookBundle, Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { ProductImage } from './ProductImage';
import { Check, Plus, ShoppingBag, Sparkles, X, ChevronRight } from 'lucide-react';

interface ShopTheLookSectionProps {
  bundles: ShopTheLookBundle[];
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, size?: any, color?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopTheLookSection: React.FC<ShopTheLookSectionProps> = ({
  bundles,
  products,
  currency,
  onAddToCart,
  onSelectProduct
}) => {
  const [activeBundleIndex, setActiveBundleIndex] = useState(0);
  const activeBundle = bundles[activeBundleIndex] || bundles[0];

  const mainOutfit = products.find((p) => p.id === activeBundle.mainOutfitId);
  const matchingHijab = products.find((p) => p.id === activeBundle.hijabId);
  const matchingBag = products.find((p) => p.id === activeBundle.bagId);
  const matchingAccessory = products.find((p) => p.id === activeBundle.accessoryId);

  const lookItems = [mainOutfit, matchingHijab, matchingBag, matchingAccessory].filter(
    (item): item is Product => Boolean(item)
  );

  // Checked state for items in bundle
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() =>
    lookItems.map((item) => item.id)
  );

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectedProducts = lookItems.filter((item) => selectedItemIds.includes(item.id));
  const rawSubtotal = selectedProducts.reduce((sum, item) => sum + item.price, 0);
  const isFullBundle = selectedProducts.length === lookItems.length;
  const bundleDiscount = isFullBundle ? Math.round(rawSubtotal * (activeBundle.discountPercent / 100)) : 0;
  const finalBundlePrice = rawSubtotal - bundleDiscount;

  const handleAddBundleToCart = () => {
    selectedProducts.forEach((prod) => {
      onAddToCart(prod, prod.sizes[0] || 'M', prod.colors[0]);
    });
  };

  return (
    <section id="section-shop-the-look" className="w-full py-12 px-4 sm:px-6 bg-[#FAF7F2] border-t border-b border-[#E8DFC8]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0EAE0] border border-[#C59B27]/30 rounded-full text-[11px] font-sans-ui text-[#8C6B1B] uppercase tracking-widest font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-[#C59B27]" /> Complete Ensemble Styling
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-[#1E1A17] font-bold tracking-wide">
            Shop The Look
          </h2>
          <p className="text-sm font-sans-ui text-[#6E6053] mt-2 leading-relaxed">
            Curated modest pairings combining our signature gowns with matching pure silk hijabs, handcrafted potlis, and calligraphy jewelry.
          </p>
        </div>

        {/* Look Switcher Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {bundles.map((bundle, idx) => (
            <button
              key={`stl-bundle-${bundle.id}-${idx}`}
              onClick={() => {
                setActiveBundleIndex(idx);
                const nextOutfit = products.find((p) => p.id === bundle.mainOutfitId);
                const nextHijab = products.find((p) => p.id === bundle.hijabId);
                const nextBag = products.find((p) => p.id === bundle.bagId);
                const nextAcc = products.find((p) => p.id === bundle.accessoryId);
                const all = [nextOutfit, nextHijab, nextBag, nextAcc].filter(Boolean).map((p) => p!.id);
                setSelectedItemIds(all);
              }}
              className={`px-4 py-2 text-xs font-cinzel tracking-wider whitespace-nowrap rounded-full transition-all ${
                activeBundleIndex === idx
                  ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27] shadow-sm font-semibold'
                  : 'bg-[#F0EAE0] text-[#54463A] hover:bg-[#E6DEC8] border border-[#DDD3BC]'
              }`}
            >
              {bundle.title}
            </button>
          ))}
        </div>

        {/* Interactive Look Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F7F2E8] p-4 sm:p-8 rounded-2xl border border-[#E0D5BE] shadow-xs">
          {/* Left Column: Styled Editorial Image with Hotspot Overlays */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-xl bg-[#1E1A17] aspect-3/4 max-h-[540px]">
            <ProductImage
              src={activeBundle.lookImage}
              alt={activeBundle.title}
              aspectRatio="aspect-3/4"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" />

            {/* Occasion Pill */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs border border-[#C59B27]/40 text-[#FAF7F2] text-[10px] font-sans-ui uppercase tracking-widest px-3 py-1 rounded-full z-20">
              {activeBundle.occasion}
            </div>

            {/* Look Info Banner at bottom */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-20">
              <span className="text-[10px] uppercase font-sans-ui tracking-widest text-[#E8D59E]">
                AL-NOUREEN Atelier Styling
              </span>
              <h3 className="font-cinzel text-lg font-bold text-white mt-0.5">
                {activeBundle.title}
              </h3>
              <p className="text-xs text-[#DDD3BC] line-clamp-2 mt-1 font-sans-ui">
                {activeBundle.description}
              </p>
            </div>
          </div>

          {/* Right Column: Individual Ensemble Pieces & Interactive Add */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-[#DDD3BC] pb-3 mb-4">
                <div>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#1E1A17]">
                    Curated Pieces in this Ensemble
                  </h4>
                  <p className="text-xs text-[#7A6B5D] font-sans-ui">
                    Select the pieces you want or add the full look for {activeBundle.discountPercent}% bundle savings.
                  </p>
                </div>
                {isFullBundle && (
                  <span className="bg-[#181411] text-[#E8D59E] border border-[#C59B27] text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                    {activeBundle.discountPercent}% Bundle Off
                  </span>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {lookItems.map((item, idx) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div
                      key={`stl-item-${activeBundle?.id || 'bundle'}-${item.id}-${idx}`}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#C59B27]/60 shadow-xs'
                          : 'bg-[#F0EAE0]/60 border-transparent opacity-60'
                      }`}
                    >
                      {/* Checkbox Toggle */}
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors mr-3 flex-shrink-0 ${
                          isSelected
                            ? 'bg-[#181411] border-[#C59B27] text-[#E8D59E]'
                            : 'border-[#9E8E7C] bg-white'
                        }`}
                        aria-label={`Select ${item.name}`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>

                      {/* Thumbnail Image with ProductImage */}
                      <div
                        onClick={() => onSelectProduct(item)}
                        className="w-14 h-14 rounded-lg overflow-hidden border border-[#DDD3BC] cursor-pointer mr-3.5 flex-shrink-0 bg-[#F0EAE0]"
                      >
                        <ProductImage
                          src={item.images[0]}
                          alt={item.name}
                          aspectRatio="aspect-square"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Name & Category */}
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="text-[10px] uppercase font-sans-ui tracking-wider text-[#8C6B1B] font-semibold">
                          {item.category}
                        </span>
                        <h5
                          onClick={() => onSelectProduct(item)}
                          className="font-serif text-sm font-semibold text-[#1E1A17] truncate cursor-pointer hover:text-[#C59B27] transition-colors"
                        >
                          {item.name}
                        </h5>
                        <p className="text-xs text-[#7A6B5D] truncate font-sans-ui">
                          {item.fabric} • {item.colors[0]}
                        </p>
                      </div>

                      {/* Price & Single Add */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold font-serif text-[#1E1A17]">
                          {formatPrice(item.price, currency)}
                        </p>
                        <button
                          onClick={() => onAddToCart(item, item.sizes[0] || 'M', item.colors[0])}
                          className="mt-1 text-[11px] font-sans-ui text-[#8C6B1B] hover:text-[#181411] underline decoration-[#C59B27] font-medium"
                        >
                          Add piece
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Pricing & Action Bar */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#C59B27]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-sans-ui text-[#7A6B5D]">
                  Selected {selectedProducts.length} of {lookItems.length} pieces:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#1E1A17]">
                    {formatPrice(finalBundlePrice, currency)}
                  </span>
                  {bundleDiscount > 0 && (
                    <>
                      <span className="text-xs text-[#8C7A6B] line-through">
                        {formatPrice(rawSubtotal, currency)}
                      </span>
                      <span className="text-xs font-semibold text-[#0A7B54]">
                        (Save {formatPrice(bundleDiscount, currency)})
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                id="btn-add-entire-look"
                onClick={handleAddBundleToCart}
                disabled={selectedProducts.length === 0}
                className="w-full sm:w-auto px-6 py-3 bg-[#181411] hover:bg-[#2A2420] text-[#E8D59E] border border-[#C59B27] rounded-xl text-xs font-cinzel font-semibold tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                Add Ensemble to Bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
