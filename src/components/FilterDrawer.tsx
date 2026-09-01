import React from 'react';
import { X, Check } from 'lucide-react';
import { FilterOptions } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  totalCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalCount
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Cord Sets',
    'Suits & Kurtas',
    'Sarees',
    'Lehengas',
    'Tunics',
    'Accessories'
  ];

  const fabrics = [
    'All',
    'Pure Silk',
    'Silk Organza',
    'Flowing Georgette',
    'Tissue & Tussar Silk',
    'Handwoven Cotton',
    'Velvet & Zari'
  ];

  const sortOptions: { id: FilterOptions['sortBy']; label: string }[] = [
    { id: 'featured', label: 'Featured & Editorial' },
    { id: 'newest', label: 'New Arrivals' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' }
  ];

  const handleReset = () => {
    const resetValues: FilterOptions = {
      category: 'All',
      fabric: 'All',
      size: 'All',
      color: 'All',
      sortBy: 'featured',
      maxPrice: 1000,
      inStockOnly: false,
      searchQuery: ''
    };
    setLocalFilters(resetValues);
    onApplyFilters(resetValues);
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div 
      id="filter-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity"
    >
      <div className="bg-[#FAF7F2] w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
            <h3 className="font-playfair text-xl text-[#1E1A17]">Refine Collection</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-[#6B635B] hover:text-[#1E1A17] transition-colors rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sort By */}
          <div className="py-5 border-b border-[#E8E2D5]">
            <h4 className="text-xs font-cinzel font-semibold tracking-wider text-[#1E1A17] uppercase mb-3">
              Sort By
            </h4>
            <div className="space-y-2">
              {sortOptions.map((opt, oIdx) => (
                <button
                  key={`sort-opt-${opt.id}-${oIdx}`}
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: opt.id })}
                  className={`w-full flex items-center justify-between py-2 px-3 text-xs tracking-wide transition-colors ${
                    localFilters.sortBy === opt.id
                      ? 'bg-[#EAE3D6] text-[#1E1A17] font-medium'
                      : 'text-[#6B635B] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {localFilters.sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#C59B27]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="py-5 border-b border-[#E8E2D5]">
            <h4 className="text-xs font-cinzel font-semibold tracking-wider text-[#1E1A17] uppercase mb-3">
              Category
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, cIdx) => {
                const isSelected = localFilters.category === cat;
                return (
                  <button
                    key={`f-drawer-cat-${cat}-${cIdx}`}
                    onClick={() => setLocalFilters({ ...localFilters, category: cat })}
                    className={`px-3.5 py-1.5 text-xs transition-all ${
                      isSelected
                        ? 'bg-[#1E1A17] text-[#FAF7F2] font-medium'
                        : 'bg-[#F2ECE1] text-[#6B635B] hover:bg-[#EAE3D6]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fabric Type */}
          <div className="py-5 border-b border-[#E8E2D5]">
            <h4 className="text-xs font-cinzel font-semibold tracking-wider text-[#1E1A17] uppercase mb-3">
              Fabric & Texture
            </h4>
            <div className="flex flex-wrap gap-2">
              {fabrics.map((fab, fIdx) => {
                const isSelected = localFilters.fabric === fab;
                return (
                  <button
                    key={`f-drawer-fab-${fab}-${fIdx}`}
                    onClick={() => setLocalFilters({ ...localFilters, fabric: fab })}
                    className={`px-3.5 py-1.5 text-xs transition-all ${
                      isSelected
                        ? 'bg-[#1E1A17] text-[#FAF7F2] font-medium'
                        : 'bg-[#F2ECE1] text-[#6B635B] hover:bg-[#EAE3D6]'
                    }`}
                  >
                    {fab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="py-5">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-cinzel font-semibold tracking-wider text-[#1E1A17] uppercase">
                Price Cap
              </h4>
              <span className="text-xs font-semibold text-[#C59B27]">${localFilters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={localFilters.maxPrice}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) })
              }
              className="w-full accent-[#C59B27] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C7E72] mt-1">
              <span>$50</span>
              <span>$1,000</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#E8E2D5] flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border border-[#D4CBBF] text-[#4A433D] text-xs font-sans-ui tracking-wider uppercase font-medium hover:bg-[#EAE3D6] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-[#C59B27] hover:bg-[#B38A1E] text-[#1E1A17] text-xs font-sans-ui tracking-wider uppercase font-semibold transition-colors"
          >
            Show ({totalCount})
          </button>
        </div>
      </div>
    </div>
  );
};
