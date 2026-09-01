import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Tag,
  Layers,
  Star,
  Check,
  TrendingUp,
  Shirt
} from 'lucide-react';
import { Product, Currency, ProductCategory } from '../types';
import { formatPrice } from '../utils/currency';
import { ProductImage } from './ProductImage';
import { hapticLight } from '../utils/haptics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
}

interface CategoryMatch {
  category: ProductCategory;
  label: string;
  count: number;
  icon: string;
}

interface CollectionMatch {
  name: string;
  query: string;
  tag: string;
  count: number;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  onSearchSubmit
}) => {
  const [query, setQuery] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Recent Searches persisted in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alnoureen_recent_searches');
      return saved ? JSON.parse(saved) : ['Zardozi Velvet', 'Korean Nida Abaya', 'Silk Hijab'];
    } catch {
      return ['Zardozi Velvet', 'Korean Nida Abaya', 'Silk Hijab'];
    }
  });

  const trendingTags = [
    'Pure Silk Abaya',
    'Zardozi Pakistani Suit',
    'Champagne Silk Hijab',
    'Magnetic Hijab Pins',
    'Raw Silk Co-ord',
    'Pearl Potli Bag',
    'Chikankari Peshwas',
    'Linen Kimono 56"'
  ];

  // Predefined Curated Collections for smart matching
  const CURATED_COLLECTIONS: CollectionMatch[] = [
    { name: 'Royal Festive & Bridal Peshwas', query: 'Festive', tag: 'Haute Collection', count: 12 },
    { name: 'Korean Nida Haute Abayas (52"–60")', query: 'Abayas', tag: 'Signature Abayas', count: 16 },
    { name: 'Pure Silk & Modal Hijab Sets', query: 'Silk', tag: 'Luxury Veils', count: 14 },
    { name: 'Shop The Look Coordinated Bundles', query: 'Look', tag: 'Pre-Styled Outfits', count: 8 },
    { name: 'Handcrafted Zardozi & Velvet Ensembles', query: 'Zardozi', tag: 'Artisan Craft', count: 10 },
    { name: 'Handmade Pearl & Zari Potlis', query: 'Potli', tag: 'Accessories', count: 9 }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedSuggestionIndex(-1);
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('alnoureen_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    hapticLight();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem('alnoureen_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const clearAllRecent = () => {
    hapticLight();
    setRecentSearches([]);
    try {
      localStorage.removeItem('alnoureen_recent_searches');
    } catch {}
  };

  // 1. Matched Categories calculation
  const matchedCategories = useMemo<CategoryMatch[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const categories: ProductCategory[] = [
      'Pakistani',
      'Abayas',
      'Hijabs',
      'Modest Wear',
      'Accessories',
      'Bags'
    ];

    return categories
      .filter((cat) => cat.toLowerCase().includes(q))
      .map((cat) => {
        const count = products.filter((p) => p.category === cat).length;
        let icon = '✨';
        if (cat === 'Abayas') icon = '👗';
        if (cat === 'Hijabs') icon = '🧣';
        if (cat === 'Pakistani') icon = '👑';
        if (cat === 'Bags') icon = '👜';
        if (cat === 'Accessories') icon = '💎';
        return {
          category: cat,
          label: cat === 'Pakistani' ? 'Pakistani Festive & Suits' : cat === 'Abayas' ? 'Haute Abayas (52"–60")' : cat,
          count,
          icon
        };
      });
  }, [query, products]);

  // 2. Matched Collections & Fabrics
  const matchedCollections = useMemo<CollectionMatch[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return CURATED_COLLECTIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.query.toLowerCase().includes(q)
    );
  }, [query]);

  // 3. Matched Products
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q))
    );
  }, [query, products]);

  // 4. Quick Autocomplete Keyword suggestions derived dynamically
  const autocompleteKeywords = useMemo<string[]>(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const set = new Set<string>();

    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) {
        set.add(p.name);
      }
      if (p.fabric.toLowerCase().includes(q)) {
        set.add(`${p.fabric} ${p.category}`);
      }
    });

    trendingTags.forEach((tag) => {
      if (tag.toLowerCase().includes(q)) {
        set.add(tag);
      }
    });

    return Array.from(set).slice(0, 5);
  }, [query, products]);

  const handleQuerySubmit = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    hapticLight();
    saveRecentSearch(searchTerm);
    onSearchSubmit(searchTerm);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuerySubmit(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Helper to highlight matching text in search results safely
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const cleanHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanHighlight})`, 'i');
    const parts = text.split(new RegExp(`(${cleanHighlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => (
          <React.Fragment key={`hl-part-${i}-${part}`}>
            {part.toLowerCase() === highlight.trim().toLowerCase() ? (
              <span className="bg-[#C59B27]/30 text-[#181411] font-semibold px-0.5 rounded-xs">
                {part}
              </span>
            ) : (
              part
            )}
          </React.Fragment>
        ))}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 select-none"
    >
      <div
        id="global-search-modal-container"
        className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl border border-[#C59B27]/50 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
      >
        {/* Search Input Bar */}
        <div className="bg-[#181411] p-4 sm:p-5 flex items-center gap-3 border-b border-[#C59B27]/40 shadow-inner">
          <div className="w-8 h-8 rounded-full bg-[#28221C] border border-[#C59B27]/40 flex items-center justify-center text-[#E8D59E] shrink-0">
            <Search className="w-4 h-4 text-[#C59B27]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search Pakistani festive, Korean Nida abayas, silk hijabs, potlis..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#FAF7F2] placeholder-[#8C7A6B] focus:outline-hidden font-sans-ui"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-[#8C7A6B] hover:text-white p-1 rounded-full hover:bg-[#28221C] transition-colors cursor-pointer"
              title="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-cinzel font-semibold text-[#E8D59E] hover:text-white bg-[#28221C] hover:bg-[#383028] border border-[#C59B27]/50 rounded-xl transition-all cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Dynamic Search Content & Suggestions Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {query.trim() === '' ? (
            /* Blank state: Recent Searches, Trending Tags & Categories */
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#8C6B1B] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C59B27]" /> Recent Searches
                    </span>
                    <button
                      onClick={clearAllRecent}
                      className="text-[10px] text-[#A69788] hover:text-[#181411] underline transition-colors cursor-pointer"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={`recent-${term}-${idx}`}
                        onClick={() => handleQuerySubmit(term)}
                        className="px-3 py-1.5 bg-[#F0EAE0] hover:bg-[#E5DCCB] text-[#3D332A] hover:text-[#181411] border border-[#DDD3BC] rounded-full text-xs font-sans-ui flex items-center gap-2 group transition-all cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-[#A69788] group-hover:text-[#C59B27]" />
                        <span>{term}</span>
                        <span
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="text-[#A69788] hover:text-[#9E2A2B] hover:bg-[#DDD3BC] p-0.5 rounded-full"
                          title="Remove from history"
                        >
                          <X className="w-2.5 h-2.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#8C6B1B] flex items-center gap-1.5 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C59B27]" /> Trending Haute Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag, tIdx) => (
                    <button
                      key={`sm-trending-${tag}-${tIdx}`}
                      onClick={() => handleQuerySubmit(tag)}
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE0] text-[#4A3E34] hover:text-[#181411] border border-[#DDD3BC] hover:border-[#C59B27]/60 rounded-full text-xs font-sans-ui transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-[#C59B27]" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Categories */}
              <div>
                <span className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#8C6B1B] flex items-center gap-1.5 mb-2.5">
                  <Layers className="w-3.5 h-3.5 text-[#C59B27]" /> Explore by Atelier Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { label: 'Pakistani Festive Suits', cat: 'Pakistani', count: '100+ Pieces', icon: '👑' },
                    { label: 'Haute Abayas (52"–60")', cat: 'Abayas', count: 'Korean Nida & Silk', icon: '👗' },
                    { label: 'Pure Silk & Modal Hijabs', cat: 'Hijabs', count: 'Hand-Hemmed', icon: '🧣' },
                    { label: 'Modest Co-ords & Kaftans', cat: 'Modest Wear', count: 'Contemporary', icon: '✨' },
                    { label: 'Fine Jewelry & Hijab Pins', cat: 'Accessories', count: '18k Gold Finish', icon: '💎' },
                    { label: 'Handcrafted Potlis & Clutches', cat: 'Bags', count: 'Zari Embroidery', icon: '👜' }
                  ].map((catItem, cIdx) => (
                    <button
                      key={`sm-cat-item-${catItem.cat}-${cIdx}`}
                      onClick={() => handleQuerySubmit(catItem.cat)}
                      className="p-3 bg-[#F4EDE2] hover:bg-[#EFE5D5] border border-[#DDD3BC] hover:border-[#C59B27]/60 rounded-2xl text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{catItem.icon}</span>
                        <ArrowRight className="w-3 h-3 text-[#A69788] group-hover:text-[#8C6B1B] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs font-cinzel font-bold text-[#1E1A17] mt-1.5">
                        {catItem.label}
                      </p>
                      <span className="text-[10px] text-[#7A6B5D] font-sans-ui block mt-0.5">
                        {catItem.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Typing state: Live Dynamic Suggestions & Auto-Complete */
            <div className="space-y-5">
              {/* Dynamic Header with Result Count & Direct Submit CTA */}
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD3BC] flex-wrap gap-2">
                <span className="text-xs font-sans-ui text-[#7A6B5D]">
                  Showing suggestions for <strong className="text-[#1E1A17]">"{query}"</strong>
                </span>
                {filteredProducts.length > 0 && (
                  <button
                    onClick={() => handleQuerySubmit(query)}
                    className="text-xs font-cinzel font-bold text-[#8C6B1B] hover:text-[#181411] underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all ({filteredProducts.length}) in Catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* 1. Dynamic Keyword Autocomplete Fast Pills */}
              {autocompleteKeywords.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#8C6B1B] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C59B27]" /> Suggested Autocomplete Terms:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {autocompleteKeywords.map((kw, idx) => (
                      <button
                        key={`kw-${kw}-${idx}`}
                        onClick={() => {
                          setQuery(kw);
                          handleQuerySubmit(kw);
                        }}
                        className="px-3 py-1 bg-[#F0EAE0] hover:bg-[#E2D8C7] border border-[#DDD3BC] text-[#1E1A17] text-xs font-sans-ui rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Search className="w-2.5 h-2.5 text-[#C59B27]" />
                        <span>{highlightMatch(kw, query)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Matched Categories Suggestions */}
              {matchedCategories.length > 0 && (
                <div className="bg-[#F0EAE0]/70 p-3.5 rounded-2xl border border-[#DDD3BC] space-y-2">
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#8C6B1B] flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#C59B27]" /> Matched Categories
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedCategories.map((cat, idx) => (
                      <button
                        key={`cat-${cat.category}-${idx}`}
                        onClick={() => handleQuerySubmit(cat.category)}
                        className="p-2.5 bg-white hover:bg-[#FAF7F2] border border-[#E0D5BE] hover:border-[#C59B27] rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cat.icon}</span>
                          <div>
                            <p className="text-xs font-cinzel font-bold text-[#1E1A17] group-hover:text-[#8C6B1B]">
                              {highlightMatch(cat.label, query)}
                            </p>
                            <span className="text-[10px] text-[#8C7A6B] font-sans-ui">
                              {cat.count} handcrafted designs
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A69788] group-hover:text-[#8C6B1B] group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Matched Curated Collections Suggestions */}
              {matchedCollections.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#8C6B1B] flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#C59B27]" /> Curated Collections & Edits
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchedCollections.map((col, idx) => (
                      <button
                        key={`col-${col.name}-${idx}`}
                        onClick={() => handleQuerySubmit(col.query)}
                        className="px-3 py-1.5 bg-[#181411] hover:bg-[#2B231D] text-[#FAF7F2] rounded-xl text-xs font-cinzel border border-[#C59B27]/40 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#C59B27]" />
                        <span>{highlightMatch(col.name, query)}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#C59B27]/20 text-[#E8D59E] rounded">
                          {col.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Matched Products List */}
              <div className="space-y-2">
                <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#8C6B1B] flex items-center gap-1">
                  <Shirt className="w-3 h-3 text-[#C59B27]" /> Matching Haute Couture Products ({filteredProducts.length})
                </span>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-10 bg-white/60 rounded-2xl border border-[#DDD3BC] space-y-2">
                    <p className="font-cinzel text-sm font-bold text-[#1E1A17]">No direct product matches found</p>
                    <p className="text-xs text-[#7A6B5D] max-w-sm mx-auto font-sans-ui">
                      Try searching for terms like <strong>"Zardozi"</strong>, <strong>"Abaya"</strong>, <strong>"Pure Silk"</strong>, or <strong>"Peshwas"</strong>.
                    </p>
                    <button
                      onClick={() => handleQuerySubmit('')}
                      className="mt-2 px-4 py-1.5 bg-[#181411] text-[#E8D59E] rounded-xl text-xs font-cinzel border border-[#C59B27] cursor-pointer"
                    >
                      Browse Entire Catalog
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#EADFCB] bg-white rounded-2xl border border-[#DDD3BC] overflow-hidden">
                    {filteredProducts.slice(0, 8).map((product, pIdx) => (
                      <div
                        key={`search-prod-${product.id}-${pIdx}`}
                        onClick={() => {
                          hapticLight();
                          saveRecentSearch(query);
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#F7F2E8] transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#DDD3BC] shrink-0 bg-[#F0EAE0]">
                            <ProductImage
                              src={product.images[0]}
                              alt={product.name}
                              aspectRatio="aspect-3/4"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase font-mono tracking-wider text-[#8C6B1B] font-semibold bg-[#C59B27]/10 px-1.5 py-0.2 rounded border border-[#C59B27]/20">
                                {product.category}
                              </span>
                              {product.badge && (
                                <span className="text-[9px] font-cinzel font-semibold text-[#0A7B54]">
                                  • {product.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#1E1A17] group-hover:text-[#8C6B1B] transition-colors truncate mt-0.5">
                              {highlightMatch(product.name, query)}
                            </h4>
                            <p className="text-[11px] text-[#7A6B5D] font-sans-ui truncate">
                              {highlightMatch(product.fabric, query)} • {product.sizes.slice(0, 4).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-cinzel font-bold text-xs sm:text-sm text-[#1E1A17]">
                            {formatPrice(product.price, currency)}
                          </p>
                          <span className="text-[10px] text-[#0A7B54] font-medium flex items-center justify-end gap-1">
                            <Check className="w-2.5 h-2.5" /> In Stock
                          </span>
                        </div>
                      </div>
                    ))}

                    {filteredProducts.length > 8 && (
                      <div className="p-3 text-center bg-[#FAF7F2] border-t border-[#DDD3BC]">
                        <button
                          onClick={() => handleQuerySubmit(query)}
                          className="text-xs font-cinzel font-bold text-[#8C6B1B] hover:text-[#181411] underline cursor-pointer"
                        >
                          + View {filteredProducts.length - 8} more matching products in catalog
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-[#F0EAE0] px-4 sm:px-6 py-2.5 border-t border-[#DDD3BC] flex items-center justify-between text-[11px] text-[#7A6B5D]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#8C6B1B]">TIP:</span>
            <span>Press Enter to search catalog • Click any suggestion to jump directly</span>
          </div>
          <span className="hidden sm:inline text-[#8C7A6B]">AL-NOUREEN Haute Catalog</span>
        </div>
      </div>
    </div>
  );
};

