import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Search,
  X,
  Sparkles,
  Heart,
  ShoppingBag,
  ArrowUpDown,
  Scale,
  Check,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, FilterOptions, ProductCategory, ScreenType, Currency, ProductSize } from '../types';
import { formatPrice } from '../utils/currency';
import { ProductImage } from '../components/ProductImage';
import { CompareModal } from '../components/CompareModal';

interface ShopScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenFilters: () => void;
  activeFilters: FilterOptions;
  onClearFilters: () => void;
  onUpdateFilters: (filters: FilterOptions) => void;
  onAddToCart: (product: Product, size: ProductSize, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  currency: Currency;
  activeCategoryOverride?: ProductCategory | 'All' | 'Sale' | 'New Arrivals';
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  products,
  onSelectProduct,
  onOpenFilters,
  activeFilters,
  onClearFilters,
  onUpdateFilters,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  currency,
  activeCategoryOverride
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(12);

  // Compare Feature State (max 3 products)
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);

  const toggleCompareProduct = (product: Product) => {
    setCompareProducts((prev) => {
      const isAlreadyIn = prev.some((p) => p.id === product.id);
      if (isAlreadyIn) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        setCompareNotice('Comparison limit reached (max 3 pieces). Remove one to add another.');
        setTimeout(() => setCompareNotice(null), 3000);
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeCompareProduct = (productId: string) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const addCompareProduct = (product: Product) => {
    setCompareProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, product];
    });
  };

  const clearAllCompare = () => {
    setCompareProducts([]);
  };

  // Category Tabs
  const categoriesList: (ProductCategory | 'All')[] = [
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

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.fabric.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter
      if (activeFilters.category !== 'All' && item.category !== activeFilters.category) {
        return false;
      }

      // Fabric filter
      if (
        activeFilters.fabric !== 'All' &&
        !item.fabric.toLowerCase().includes(activeFilters.fabric.toLowerCase())
      ) {
        return false;
      }

      // Price filter
      if (item.price > activeFilters.maxPrice) {
        return false;
      }

      // Size filter
      if (activeFilters.sizes && activeFilters.sizes.length > 0) {
        const hasMatchingSize = item.sizes.some((s) =>
          activeFilters.sizes?.includes(s)
        );
        if (!hasMatchingSize) return false;
      }

      // Color filter
      if (activeFilters.colors && activeFilters.colors.length > 0) {
        const hasMatchingColor = item.colors.some((c) =>
          activeFilters.colors?.some((fc) => c.toLowerCase().includes(fc.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }

      // In-stock
      if (activeFilters.inStockOnly && !item.inStock) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, activeFilters]);

  // Sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (activeFilters.sortBy === 'price-asc') return a.price - b.price;
      if (activeFilters.sortBy === 'price-desc') return b.price - a.price;
      if (activeFilters.sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      if (activeFilters.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filteredProducts, activeFilters.sortBy]);

  const visibleProducts = sortedProducts.slice(0, displayCount);
  const hasMore = displayCount < sortedProducts.length;

  // Key tracking filter & sorting criteria to trigger stagger animation on change
  const filterSortKey = useMemo(() => {
    return `grid-${activeFilters.category}-${activeFilters.sortBy}-${activeFilters.fabric}-${activeFilters.maxPrice}-${activeFilters.sizes?.join(',') || ''}-${activeFilters.colors?.join(',') || ''}-${activeFilters.inStockOnly ? '1' : '0'}-${searchQuery.trim()}`;
  }, [activeFilters, searchQuery]);

  // Framer motion variants for subtle luxury grid entry
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02
      }
    }
  };

  const gridItemVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const getCategoryTitle = () => {
    if (activeFilters.category === 'Pakistani') return 'The Pakistani Couture Collection';
    if (activeFilters.category === 'Abayas') return 'Haute Abaya & Kimono Collection';
    if (activeFilters.category === 'Hijabs') return 'The Pure Silk & Modal Hijab Edit';
    if (activeFilters.category === 'Modest Wear') return 'Modest Dresses & Silhouette Gowns';
    if (activeFilters.category === 'Accessories') return '18k Jewelry & Fine Hijab Pins';
    if (activeFilters.category === 'Bags') return 'Handmade Potlis & Velvet Clutches';
    if (activeFilters.category === 'Co-ord Sets') return 'Luxury Co-ord Sets';
    if (activeFilters.category === 'Tunics') return 'Modest Designer Tunics';
    return 'The AL-NOUREEN Atelier Collection';
  };

  const getCategoryDescription = () => {
    if (activeFilters.category === 'Pakistani') {
      return 'Regal Pakistani festive suits, floor-sweeping peshwas, and zardozi formalwear crafted on pure silk and chiffon.';
    }
    if (activeFilters.category === 'Abayas') {
      return 'Premium open-front abayas, kimono wraps, and evening coats tailored in lengths 52" to 60" with opaque modest drapes.';
    }
    if (activeFilters.category === 'Hijabs') {
      return '100% pure 19mm mulberry silk veils, breathable modal wraps, and snag-free magnetic hijab pins.';
    }
    return 'Impeccable modest wear crafted with uncompromising artisanal dignity for the modern global woman.';
  };

  return (
    <div id="shop-screen-view" className="w-full bg-[#FAF7F2] min-h-screen pb-20">
      {/* Category Hero / Title Section */}
      <div className="bg-[#181411] text-[#FAF7F2] py-12 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <div className="max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-cinzel text-[#E8D59E] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Two Lights. One Beautiful Vision.
          </span>
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wide text-white">
            {getCategoryTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            {getCategoryDescription()}
          </p>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DFC8] sticky top-[95px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Scrollable Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categoriesList.map((cat, cIdx) => (
              <button
                key={`shop-cat-pill-${cat}-${cIdx}`}
                onClick={() => onUpdateFilters({ ...activeFilters, category: cat })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-cinzel whitespace-nowrap transition-colors ${
                  activeFilters.category === cat
                    ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27] font-semibold'
                    : 'bg-[#F0EAE0] text-[#54463A] hover:bg-[#E2D8C7] border border-[#DDD3BC]'
                }`}
              >
                {cat === 'All' ? 'All Collections' : cat}
              </button>
            ))}
          </div>

          {/* Filter Trigger Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onOpenFilters}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#181411] text-[#E8D59E] hover:bg-[#2B231D] border border-[#C59B27]/60 rounded-xl text-xs font-cinzel font-semibold shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#8C6B1B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within this category..."
            className="w-full pl-8 pr-8 py-2 bg-white border border-[#DDD3BC] rounded-xl text-xs font-sans-ui text-[#1E1A17] focus:outline-hidden focus:border-[#C59B27]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#1E1A17]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Count & Sorting */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-sans-ui text-[#7A6B5D]">
          <span>Showing <strong>{sortedProducts.length}</strong> creations</span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C6B1B]" />
            <select
              value={activeFilters.sortBy}
              onChange={(e) =>
                onUpdateFilters({ ...activeFilters, sortBy: e.target.value as any })
              }
              className="bg-white border border-[#DDD3BC] rounded-lg px-2.5 py-1 text-xs text-[#1E1A17] focus:outline-hidden focus:border-[#C59B27]"
            >
              <option value="featured">Featured Atelier</option>
              <option value="newest">New Arrivals</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FAF7F2] border border-[#DDD3BC] rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
            <h3 className="font-cinzel text-lg font-bold text-[#1E1A17]">No Matching Garments Found</h3>
            <p className="text-xs text-[#7A6B5D] font-sans-ui">
              We couldn't find items matching your active filter criteria. Try expanding your price limit or clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onClearFilters();
              }}
              className="px-6 py-2.5 bg-[#181411] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div
            key={filterSortKey}
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {visibleProducts.map((product, pIdx) => {
              const isWishlisted = wishlist.some((p) => p.id === product.id);
              const isCompared = compareProducts.some((p) => p.id === product.id);

              return (
                <motion.div
                  key={`shop-item-${product.id}-${pIdx}`}
                  variants={gridItemVariants}
                  className={`group flex flex-col bg-[#FAF7F2] dark:bg-[#1A1613] rounded-2xl overflow-hidden border shadow-2xs transition-all ${
                    isCompared
                      ? 'border-[#C59B27] ring-2 ring-[#C59B27]/40 shadow-md'
                      : 'border-[#DDD3BC] dark:border-[#2E2620] hover:border-[#C59B27]/70'
                  }`}
                >
                  {/* Photo Container with Skeleton ProductImage */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-3/4 overflow-hidden cursor-pointer bg-[#F0EAE0] dark:bg-[#120F0D]"
                  >
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      aspectRatio="aspect-3/4"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#181411]/90 text-[#E8D59E] border border-[#C59B27] text-[9px] font-cinzel font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs z-10 pointer-events-none">
                        {product.badge}
                      </span>
                    )}

                    {/* Compare Quick Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompareProduct(product);
                      }}
                      className={`absolute top-3 left-auto right-12 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-all active:scale-95 z-10 ${
                        isCompared
                          ? 'bg-[#C59B27] text-white border border-[#C59B27]'
                          : 'bg-white/90 dark:bg-[#201A16]/90 text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#C59B27] border border-black/5'
                      }`}
                      title={isCompared ? 'Remove from Compare' : 'Add to Compare (up to 3)'}
                      aria-label={`Compare ${product.name}`}
                    >
                      <Scale className={`w-3.5 h-3.5 ${isCompared ? 'text-white' : ''}`} />
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-[#201A16]/90 backdrop-blur-xs text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#C59B27] flex items-center justify-center shadow-xs transition-transform active:scale-95 z-10"
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? 'fill-[#C59B27] text-[#C59B27]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] uppercase font-sans-ui tracking-wider text-[#8C6B1B] dark:text-[#D4AF37] font-semibold">
                          {product.category}
                        </span>
                        {isCompared && (
                          <span className="text-[9px] font-cinzel font-bold text-[#C59B27] flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Comparing
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-sm font-semibold text-[#1E1A17] dark:text-[#FAF7F2] line-clamp-1 group-hover:text-[#C59B27] transition-colors mt-0.5">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui line-clamp-1">
                        {product.fabric}
                      </p>

                      {/* Sizes Preview Chips */}
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {product.sizes.slice(0, 4).map((s, sIdx) => (
                          <span
                            key={`shop-item-${product.id}-sz-${s}-${sIdx}`}
                            className="text-[9px] font-cinzel bg-[#F0EAE0] dark:bg-[#251E19] text-[#4A3E34] dark:text-[#C5BAAC] px-1.5 py-0.2 rounded-sm border border-[#DDD3BC]/60 dark:border-[#382E25]"
                          >
                            {s}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="text-[9px] text-[#8C7A6B] font-sans-ui">
                            +{product.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E8DFC8] dark:border-[#2E2620]">
                      <div>
                        <p className="font-serif font-bold text-sm text-[#1E1A17] dark:text-[#FAF7F2]">
                          {formatPrice(product.price, currency)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[10px] text-[#8C7A6B] line-through">
                            {formatPrice(product.originalPrice, currency)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Compare Quick Action Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleCompareProduct(product)}
                          className={`p-1.5 rounded-lg text-[10px] font-cinzel font-semibold transition-colors flex items-center gap-1 border ${
                            isCompared
                              ? 'bg-[#C59B27] text-white border-[#C59B27]'
                              : 'bg-transparent text-[#6E5D4F] dark:text-[#A69788] border-[#DDD3BC] dark:border-[#382E25] hover:border-[#C59B27]'
                          }`}
                          title={isCompared ? 'Remove from comparison' : 'Compare with other pieces'}
                        >
                          <Scale className="w-3 h-3" />
                          <span className="hidden sm:inline">{isCompared ? 'Selected' : 'Compare'}</span>
                        </button>

                        <button
                          onClick={() =>
                            onAddToCart(product, product.sizes[0] || 'M', product.colors[0])
                          }
                          className="px-2.5 sm:px-3 py-1.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/60 rounded-lg text-[11px] font-cinzel font-semibold flex items-center gap-1 transition-colors"
                          title="Add to Shopping Bag"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span className="hidden xs:inline">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-12">
            <button
              onClick={() => setDisplayCount((prev) => prev + 8)}
              className="px-8 py-3 bg-[#FAF7F2] dark:bg-[#1A1613] hover:bg-[#F2ECE0] dark:hover:bg-[#251F1A] border border-[#C59B27] text-[#1E1A17] dark:text-[#FAF7F2] rounded-xl font-cinzel font-semibold text-xs tracking-wider transition-all shadow-xs"
            >
              Load More Creations
            </button>
          </div>
        )}
      </div>

      {/* Floating Compare Notification Toast */}
      {compareNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#181411] text-[#E8D59E] border border-[#C59B27] px-4 py-2.5 rounded-full shadow-2xl text-xs font-cinzel font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Scale className="w-4 h-4 text-[#D4AF37]" />
          <span>{compareNotice}</span>
        </div>
      )}

      {/* Sticky Bottom Compare Dock */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-4xl mx-auto bg-[#181411]/95 text-[#FAF7F2] border border-[#C59B27]/60 p-3 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-6 duration-300">
            {/* Left: Summary & Selected Thumbnails */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto w-full sm:w-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#28221D] border border-[#C59B27]/40 flex items-center justify-center text-[#D4AF37]">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-cinzel text-xs font-bold text-white tracking-wide">
                    Compare Atelier Pieces
                  </h4>
                  <p className="text-[10px] text-[#C5BAAC] font-sans-ui">
                    {compareProducts.length} of 3 selected
                  </p>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-2">
                {compareProducts.map((p, pIdx) => (
                  <div
                    key={`compare-dock-${p.id}-${pIdx}`}
                    className="relative group w-10 h-12 rounded-md overflow-hidden border border-[#C59B27]/50 flex-shrink-0 bg-[#251E19]"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeCompareProduct(p.id)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5 text-rose-300" />
                    </button>
                  </div>
                ))}

                {/* Empty slot indicator */}
                {Array.from({ length: 3 - compareProducts.length }).map((_, idx) => (
                  <div
                    key={`compare-slot-empty-${idx}`}
                    className="w-10 h-12 rounded-md border border-dashed border-[#C59B27]/30 flex items-center justify-center text-[#C59B27]/40 text-[9px] font-cinzel flex-shrink-0"
                    title="Select more pieces to compare"
                  >
                    +{idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={clearAllCompare}
                className="px-3 py-2 text-xs font-sans-ui text-[#C5BAAC] hover:text-white transition-colors"
              >
                Clear
              </button>

              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="flex-1 sm:flex-initial px-5 py-2 bg-[#C59B27] hover:bg-[#B38A1E] text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Scale className="w-3.5 h-3.5 text-[#181411]" />
                <span>Compare Now ({compareProducts.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Product Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareProducts={compareProducts}
        allProducts={products}
        onRemoveProduct={removeCompareProduct}
        onAddProduct={addCompareProduct}
        onClearAll={clearAllCompare}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        currency={currency}
      />
    </div>
  );
};
