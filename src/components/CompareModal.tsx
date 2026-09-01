import React, { useState } from 'react';
import {
  X,
  Scale,
  ShoppingBag,
  Sparkles,
  Check,
  Star,
  Trash2,
  Eye,
  Plus,
  ArrowRight,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Product, Currency, ProductSize } from '../types';
import { formatPrice } from '../utils/currency';
import { ProductImage } from './ProductImage';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProducts: Product[];
  allProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddProduct: (product: Product) => void;
  onClearAll: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize, color: string) => void;
  currency: Currency;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareProducts,
  allProducts,
  onRemoveProduct,
  onAddProduct,
  onClearAll,
  onSelectProduct,
  onAddToCart,
  currency
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  if (!isOpen) return null;

  // Items that can still be added (not currently in comparison)
  const availableToAdd = allProducts.filter(
    (p) => !compareProducts.some((cp) => cp.id === p.id)
  );

  const handleAddToCart = (product: Product) => {
    onAddToCart(product, product.sizes[0] || 'M', product.colors[0] || 'Default');
    setAddedItemNotice(product.id);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 2000);
  };

  const handleViewProduct = (product: Product) => {
    onSelectProduct(product);
    onClose();
  };

  // Helper to check if row values differ across compared items
  const checkIsDifferent = (getValue: (p: Product) => any) => {
    if (compareProducts.length <= 1) return false;
    const firstVal = JSON.stringify(getValue(compareProducts[0]));
    return compareProducts.some((p) => JSON.stringify(getValue(p)) !== firstVal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] dark:bg-[#14100D] w-full max-w-5xl rounded-3xl border border-[#C59B27]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-[#181411] text-[#FAF7F2] px-5 py-4 flex items-center justify-between border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#28221D] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37] shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-1.5">
                  Atelier Couture Comparison
                </h2>
                <span className="text-[10px] font-sans-ui bg-[#C59B27]/20 text-[#E8D59E] border border-[#C59B27]/40 px-2 py-0.5 rounded-full font-medium">
                  {compareProducts.length} of 3 Selected
                </span>
              </div>
              <p className="text-[11px] text-[#C5BAAC] font-sans-ui hidden sm:block">
                Side-by-side analysis of fabrics, craftsmanship, silhouette tailoring, and pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Highlight Differences Toggle */}
            {compareProducts.length > 1 && (
              <button
                type="button"
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans-ui font-medium border transition-colors flex items-center gap-1.5 ${
                  highlightDifferences
                    ? 'bg-[#C59B27] text-[#181411] border-[#C59B27] font-semibold'
                    : 'bg-[#28221D] text-[#E8D59E] border-[#C59B27]/40 hover:bg-[#382F27]'
                }`}
                title="Highlight features that differ across items"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Highlight Differences</span>
              </button>
            )}

            {/* Clear All Button */}
            {compareProducts.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-2.5 py-1.5 text-xs text-[#C5BAAC] hover:text-white hover:bg-white/10 rounded-lg transition-colors font-sans-ui"
                title="Clear all compared items"
              >
                Clear All
              </button>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] flex items-center justify-center transition-colors"
              aria-label="Close comparison modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Comparison Matrix */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 bg-[#FAF7F2] dark:bg-[#14100D]">
          {compareProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#F0EAE0] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#382E25] mx-auto flex items-center justify-center text-[#8C6B1B] dark:text-[#D4AF37]">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#1E1A17] dark:text-[#F4EFE6]">
                No Creations Selected for Comparison
              </h3>
              <p className="text-xs text-[#7A6B5D] dark:text-[#A69788] font-sans-ui leading-relaxed">
                Browse our collection and click the "Compare" button on up to three creations to view fabrics, silhouettes, and intricate craft specifications side-by-side.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#181411] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel text-xs font-semibold hover:bg-[#2B231D] transition-colors"
              >
                Return to Shop Catalog
              </button>
            </div>
          ) : (
            <div className="min-w-[640px] space-y-6">
              {/* Product Visual Cards Grid */}
              <div className="grid grid-cols-12 gap-4 pb-6 border-b border-[#DDD3BC] dark:border-[#2E2620]">
                {/* Fixed Label Column Spacer on Desktop */}
                <div className="col-span-3 hidden md:flex flex-col justify-end p-3">
                  <span className="text-xs font-cinzel uppercase tracking-widest text-[#8C6B1B] dark:text-[#D4AF37] font-semibold">
                    Product Overview
                  </span>
                  <p className="text-[11px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui mt-1">
                    Select up to 3 pieces to examine intricate handcrafted nuances.
                  </p>

                  {/* Add More Dropdown if < 3 */}
                  {compareProducts.length < 3 && (
                    <div className="relative mt-4">
                      <button
                        onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                        className="w-full py-2 px-3 bg-[#F0EAE0] dark:bg-[#1E1915] hover:bg-[#E4DAC7] text-[#1E1A17] dark:text-[#FAF7F2] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs font-cinzel font-semibold flex items-center justify-between transition-colors shadow-2xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-[#C59B27]" /> Add 3rd Piece
                        </span>
                        <ChevronDown className="w-3 h-3 text-[#8C7A6B]" />
                      </button>

                      {isAddDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-[#1C1713] border border-[#C59B27]/40 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-[#EADFCB] dark:divide-[#2E2620]">
                          {availableToAdd.map((p, idx) => (
                            <button
                              key={`avail-add-${p.id}-${idx}`}
                              onClick={() => {
                                onAddProduct(p);
                                setIsAddDropdownOpen(false);
                              }}
                              className="w-full p-2 text-left hover:bg-[#F4EFE6] dark:hover:bg-[#28221D] flex items-center gap-2 text-xs transition-colors"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-8 h-10 object-cover rounded-md border border-[#DDD3BC]"
                              />
                              <div className="truncate">
                                <p className="font-serif font-semibold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-[#8C6B1B] font-sans-ui">
                                  {formatPrice(p.price, currency)}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Column Cards */}
                {compareProducts.map((product, pIdx) => {
                  const colSpan =
                    compareProducts.length === 1
                      ? 'col-span-12 md:col-span-9'
                      : compareProducts.length === 2
                      ? 'col-span-6 md:col-span-4'
                      : 'col-span-4 md:col-span-3';

                  return (
                    <div
                      key={`cmp-prod-${product.id}-${pIdx}`}
                      className={`${colSpan} bg-[#F4EFE6] dark:bg-[#1A1613] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620] p-3.5 flex flex-col justify-between relative shadow-xs`}
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-[#28221D] text-[#8C7A6B] hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center shadow-xs transition-colors"
                        title="Remove from comparison"
                        aria-label={`Remove ${product.name} from comparison`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Image */}
                      <div
                        onClick={() => handleViewProduct(product)}
                        className="cursor-pointer group relative rounded-xl overflow-hidden mb-3 aspect-3/4 bg-[#ECE5D8] dark:bg-[#120F0D]"
                      >
                        <ProductImage
                          src={product.images[0]}
                          alt={product.name}
                          aspectRatio="aspect-3/4"
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <span className="absolute bottom-2 left-2 bg-[#181411]/90 text-[#E8D59E] border border-[#C59B27]/50 text-[8.5px] font-cinzel font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Info & Price */}
                      <div className="space-y-1 text-center">
                        <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#8C6B1B] dark:text-[#D4AF37] font-semibold">
                          {product.category}
                        </span>
                        <h4
                          onClick={() => handleViewProduct(product)}
                          className="font-serif text-xs sm:text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#C59B27] cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        {product.arabicName && (
                          <p className="font-serif text-xs text-[#8C6B1B]/80 italic">
                            {product.arabicName}
                          </p>
                        )}
                        <div className="pt-1 flex items-center justify-center gap-1.5">
                          <span className="font-serif font-bold text-sm sm:text-base text-[#1E1A17] dark:text-[#F4EFE6]">
                            {formatPrice(product.price, currency)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-[#8C7A6B] line-through">
                              {formatPrice(product.originalPrice, currency)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3.5 pt-3 border-t border-[#DDD3BC]/60 dark:border-[#2E2620] space-y-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-2 px-2 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/70 rounded-xl text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          {addedItemNotice === product.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Added to Bag
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleViewProduct(product)}
                          className="w-full py-1.5 px-2 bg-transparent hover:bg-[#E8DFC8] dark:hover:bg-[#28221D] text-[#54463A] dark:text-[#C5BAAC] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-[11px] font-sans-ui font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> View Details
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Empty Slot Placeholder if < 3 */}
                {compareProducts.length < 3 && (
                  <div
                    className={`${
                      compareProducts.length === 1
                        ? 'col-span-12 md:col-span-3'
                        : 'col-span-4 md:col-span-3'
                    } bg-[#FAF7F2]/60 dark:bg-[#120F0D]/60 rounded-2xl border-2 border-dashed border-[#DDD3BC] dark:border-[#2E2620] p-4 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EAE2D2] dark:bg-[#1E1915] text-[#8C6B1B] dark:text-[#C59B27] flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-cinzel text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                        Compare Another Piece
                      </p>
                      <p className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui mt-1 max-w-[140px]">
                        Add up to 3 creations for detailed comparison.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Spec Comparison Rows */}
              <div className="space-y-3 font-sans-ui text-xs">
                {/* Section: Fabric & Craftsmanship */}
                <div className="pt-2">
                  <h5 className="font-cinzel text-xs uppercase tracking-widest font-bold text-[#8C6B1B] dark:text-[#D4AF37] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Fabric & Artisanal Details
                  </h5>

                  {/* Row: Primary Fabric */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.fabric);
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center">
                          Primary Fabric & Weave
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`fabric-${p.id}-${pIdx}`} className={`${colSpan} text-[#4A3E34] dark:text-[#C5BAAC] font-medium`}>
                              {p.fabric}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Row: Craftsmanship / Details */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.details.fabricCraft);
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors mt-2 ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                          Artisanal Craftsmanship
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`craft-${p.id}-${pIdx}`} className={`${colSpan} text-[#4A3E34] dark:text-[#C5BAAC] space-y-1`}>
                              {p.details.fabricCraft.slice(0, 3).map((craft, i) => (
                                <p key={`craft-${p.id}-${pIdx}-${i}`} className="text-[11px] flex items-start gap-1">
                                  <span className="text-[#C59B27] mt-0.5">•</span>
                                  <span>{craft}</span>
                                </p>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Section: Sizing & Colors */}
                <div className="pt-3">
                  <h5 className="font-cinzel text-xs uppercase tracking-widest font-bold text-[#8C6B1B] dark:text-[#D4AF37] mb-2">
                    Silhouette, Sizes & Palette
                  </h5>

                  {/* Row: Available Sizes */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.sizes);
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center">
                          Available Sizes
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`sz-col-${p.id}-${pIdx}`} className={`${colSpan} flex flex-wrap gap-1 items-center`}>
                              {p.sizes.map((sz, szIdx) => (
                                <span
                                  key={`sz-${p.id}-${pIdx}-${sz}-${szIdx}`}
                                  className="text-[10px] font-cinzel bg-white dark:bg-[#251E19] text-[#1E1A17] dark:text-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#DDD3BC] dark:border-[#382E25]"
                                >
                                  {sz}
                                </span>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Row: Colors */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.colors);
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors mt-2 ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center">
                          Color Options
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`col-${p.id}-${pIdx}`} className={`${colSpan} text-[#4A3E34] dark:text-[#C5BAAC]`}>
                              {p.colors.join(', ')}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Row: Abaya Lengths (if applicable) */}
                  {(() => {
                    const hasLengths = compareProducts.some((p) => p.availableLengths && p.availableLengths.length > 0);
                    if (!hasLengths) return null;
                    const isDiff = checkIsDifferent((p) => p.availableLengths || []);
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors mt-2 ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center">
                          Length Tailoring
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`len-col-${p.id}-${pIdx}`} className={`${colSpan} text-[#4A3E34] dark:text-[#C5BAAC]`}>
                              {p.availableLengths && p.availableLengths.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {p.availableLengths.map((l, lIdx) => (
                                    <span
                                      key={`len-${p.id}-${pIdx}-${l}-${lIdx}`}
                                      className="text-[10px] font-sans-ui bg-[#ECE5D8] dark:bg-[#28221D] px-1.5 py-0.5 rounded-sm"
                                    >
                                      {l}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[#8C7A6B] text-[11px]">Standard Silhouette Cut</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Section: Modesty, Care & Dispatch */}
                <div className="pt-3">
                  <h5 className="font-cinzel text-xs uppercase tracking-widest font-bold text-[#8C6B1B] dark:text-[#D4AF37] mb-2">
                    Care, Fit & Shipping
                  </h5>

                  {/* Row: Modest Fit Notes */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.details.modestFitNotes || '');
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                          Modest Fit & Silhouette
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`fit-${p.id}-${pIdx}`} className={`${colSpan} text-[#4A3E34] dark:text-[#C5BAAC] text-[11px]`}>
                              {p.details.modestFitNotes || 'Full modest coverage with relaxed artisanal drape.'}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Row: Care Instructions */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.details.careInstructions);
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors mt-2 ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                          Care & Preservation
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`care-${p.id}-${pIdx}`} className={`${colSpan} text-[#4A3E34] dark:text-[#C5BAAC] text-[11px]`}>
                              {p.details.careInstructions}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Row: Dispatch Window */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.estimatedDispatch || '');
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors mt-2 ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center">
                          Estimated Dispatch
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`dispatch-${p.id}-${pIdx}`} className={`${colSpan} text-[#1E1A17] dark:text-[#FAF7F2] font-semibold text-[11px]`}>
                              {p.estimatedDispatch || 'Dispatched within 2-4 business days'}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Row: Customer Rating */}
                  {(() => {
                    const isDiff = checkIsDifferent((p) => p.rating);
                    const shouldHighlight = highlightDifferences && isDiff;
                    return (
                      <div
                        className={`grid grid-cols-12 gap-4 p-3 rounded-xl border transition-colors mt-2 ${
                          shouldHighlight
                            ? 'bg-[#C59B27]/15 border-[#C59B27]'
                            : 'bg-[#F4EFE6] dark:bg-[#1A1613] border-[#E8E2D5] dark:border-[#28221D]'
                        }`}
                      >
                        <div className="col-span-3 font-cinzel font-semibold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center">
                          Patron Rating
                        </div>
                        {compareProducts.map((p, pIdx) => {
                          const colSpan =
                            compareProducts.length === 1
                              ? 'col-span-9'
                              : compareProducts.length === 2
                              ? 'col-span-4'
                              : 'col-span-3';
                          return (
                            <div key={`rating-${p.id}-${pIdx}`} className={`${colSpan} flex items-center gap-1.5`}>
                              <div className="flex items-center text-[#C59B27]">
                                <Star className="w-3.5 h-3.5 fill-[#C59B27]" />
                              </div>
                              <span className="font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                                {p.rating} / 5.0
                              </span>
                              <span className="text-[10px] text-[#8C7A6B]">
                                ({p.reviewCount} reviews)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-[#181411] px-5 py-3.5 border-t border-[#C59B27]/40 flex items-center justify-between">
          <span className="text-xs text-[#C5BAAC] font-sans-ui hidden sm:inline">
            AL-NOUREEN Haute Modest Couture • Curated Comparison
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider transition-colors ml-auto shadow-xs"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
