import React from 'react';
import { X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { FilterOptions, ProductCategory, ProductSize, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onReset: () => void;
  currency: Currency;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  currency
}) => {
  if (!isOpen) return null;

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Pakistani',
    'Abayas',
    'Hijabs',
    'Modest Wear',
    'Co-ord Sets',
    'Tunics',
    'Accessories',
    'Bags'
  ];

  const sizes: ProductSize[] = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL',
    '52"', '54"', '56"', '58"', '60"',
    'Free Size', 'One Size', 'Custom'
  ];

  const fabrics = [
    'All',
    'Pure Silk / Silk Organza',
    'Korean Nida',
    'Pure Chiffon / Georgette',
    'Lawn & Cotton',
    'European Linen',
    'Modal & Jersey',
    'Micro-Velvet'
  ];

  const colors = [
    'Emerald Green',
    'Champagne Gold',
    'Midnight Black',
    'Mocha Brown',
    'Dusty Rose',
    'Ivory Cream',
    'Navy Blue',
    'Deep Maroon'
  ];

  const handleSizeToggle = (size: ProductSize) => {
    const currentSizes = filters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    onChange({ ...filters, sizes: newSizes });
  };

  const handleColorToggle = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    onChange({ ...filters, colors: newColors });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-md h-full flex flex-col justify-between border-l border-[#C59B27]/40 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[#181411] text-[#FAF7F2] p-5 flex items-center justify-between border-b border-[#C59B27]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C59B27]" />
            <h3 className="font-cinzel text-base font-bold text-[#E8D59E] tracking-wider">
              Filter Collection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#A69788] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-sans-ui">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] uppercase tracking-wider mb-2.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, cIdx) => (
                <button
                  key={`f-modal-cat-${cat}-${cIdx}`}
                  onClick={() => onChange({ ...filters, category: cat })}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    filters.category === cat
                      ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] font-semibold'
                      : 'bg-white border-[#DDD3BC] text-[#54463A] hover:bg-[#F2ECE0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sizing & Abaya Lengths */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] uppercase tracking-wider">
                Sizes & Abaya Lengths
              </label>
              <span className="text-[10px] text-[#8C7A6B]">
                {(filters.sizes || []).length} selected
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {sizes.map((s, sIdx) => {
                const isSelected = (filters.sizes || []).includes(s);
                return (
                  <button
                    key={`f-modal-size-${s}-${sIdx}`}
                    onClick={() => handleSizeToggle(s)}
                    className={`py-1.5 px-2 text-center rounded-lg border text-xs font-cinzel font-bold transition-all ${
                      isSelected
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27]'
                        : 'bg-white border-[#DDD3BC] text-[#4A3E34] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] uppercase tracking-wider mb-2.5">
              Curated Color Shades
            </label>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((c, colIdx) => {
                const isSelected = (filters.colors || []).includes(c);
                return (
                  <button
                    key={`f-modal-color-${c}-${colIdx}`}
                    onClick={() => handleColorToggle(c)}
                    className={`p-2 text-left rounded-lg border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] font-semibold'
                        : 'bg-white border-[#DDD3BC] text-[#54463A] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    <span className="text-xs truncate">{c}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C59B27]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fabric Weave */}
          <div>
            <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] uppercase tracking-wider mb-2">
              Fabric Weave & Material
            </label>
            <select
              value={filters.fabric}
              onChange={(e) => onChange({ ...filters, fabric: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-xl focus:outline-hidden focus:border-[#C59B27]"
            >
              {fabrics.map((f, fIdx) => (
                <option key={`f-modal-fab-${f}-${fIdx}`} value={f === 'All' ? 'All' : f.split('/')[0].trim()}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-cinzel font-bold text-[#1E1A17] uppercase tracking-wider">
                Maximum Price
              </label>
              <span className="font-serif font-bold text-sm text-[#1E1A17]">
                {formatPrice(filters.maxPrice, currency)}
              </span>
            </div>
            <input
              type="range"
              min={25}
              max={650}
              step={10}
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[#C59B27] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7A6B] mt-1">
              <span>{formatPrice(25, currency)}</span>
              <span>{formatPrice(650, currency)}</span>
            </div>
          </div>

          {/* In Stock Availability Toggle */}
          <div className="flex items-center justify-between p-3 bg-white border border-[#DDD3BC] rounded-xl">
            <div>
              <span className="font-semibold text-[#1E1A17] block">In-Stock Ready to Dispatch</span>
              <span className="text-[10px] text-[#8C7A6B]">Hide made-to-order bridal pieces</span>
            </div>
            <button
              onClick={() =>
                onChange({ ...filters, inStockOnly: !filters.inStockOnly })
              }
              className={`w-11 h-6 rounded-full p-1 transition-colors ${
                filters.inStockOnly ? 'bg-[#181411]' : 'bg-[#DDD3BC]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  filters.inStockOnly ? 'translate-x-5 bg-[#C59B27]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F2ECE0] border-t border-[#DDD3BC] flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-3 bg-white hover:bg-[#FAF7F2] border border-[#DDD3BC] text-[#54463A] rounded-xl font-cinzel text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-colors shadow-md text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
