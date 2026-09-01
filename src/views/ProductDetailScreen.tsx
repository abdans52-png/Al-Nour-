import React, { useState, useRef } from 'react';
import {
  Heart,
  Share2,
  Check,
  Star,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bell,
  TrendingDown,
  Scissors,
  Layers
} from 'lucide-react';
import { Product, ScreenType, Currency, ProductSize } from '../types';
import { formatPrice } from '../utils/currency';
import { REVIEWS } from '../data/reviews';
import { ReviewModal } from '../components/ReviewModal';
import { ProductImage } from '../components/ProductImage';
import { GoldShimmerLoader } from '../components/GoldShimmerLoader';
import { PriceDropModal } from '../components/PriceDropModal';
import { FabricSwatchModal, SwatchRequestData } from '../components/FabricSwatchModal';
import { NotifyMeModal } from '../components/NotifyMeModal';
import {
  FindMyFitModal,
  getSavedFitProfile,
  calculateFitRecommendation,
  UserFitProfile
} from '../components/FindMyFitModal';
import { hapticLight, hapticSuccess, hapticWishlist } from '../utils/haptics';

interface ProductDetailScreenProps {
  product: Product;
  allProducts: Product[];
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenSizeGuide: () => void;
  currency: Currency;
  onNotifyPriceDrop?: (product: Product, email: string, discountPercent: number) => void;
  onRequestFabricSwatch?: (data: SwatchRequestData) => void;
  onSubscribeRestock?: (product: Product, email: string, size?: string, color?: string) => void;
  onSimulateRestock?: (product: Product, size?: string, color?: string, email?: string) => void;
  onOpenEnsembleBuilder?: (initialProduct?: Product) => void;
  onOpenTailoringWizard?: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  allProducts,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpenSizeGuide,
  currency,
  onNotifyPriceDrop,
  onRequestFabricSwatch,
  onSubscribeRestock,
  onSimulateRestock,
  onOpenEnsembleBuilder,
  onOpenTailoringWizard
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0] || 'Default'
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [openSection, setOpenSection] = useState<string>('fabric');

  // Reset image loaded state when active index or product changes
  React.useEffect(() => {
    setIsMainImageLoaded(false);
  }, [product.id, activeImageIndex]);
  const [addedNotice, setAddedNotice] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPriceDropModalOpen, setIsPriceDropModalOpen] = useState(false);
  const [isFabricSwatchModalOpen, setIsFabricSwatchModalOpen] = useState(false);
  const [isNotifyMeModalOpen, setIsNotifyMeModalOpen] = useState(false);
  const [isFindMyFitOpen, setIsFindMyFitOpen] = useState(false);
  const [savedFitProfile, setSavedFitProfile] = useState<UserFitProfile | null>(() => getSavedFitProfile());

  const isOutOfStock = product.inStock === false || product.stockCount === 0;

  // Re-check saved fit profile if modal closes or on mount
  const handleOpenFindMyFit = () => {
    hapticLight();
    setSavedFitProfile(getSavedFitProfile());
    setIsFindMyFitOpen(true);
  };

  const currentRecommendation = savedFitProfile
    ? calculateFitRecommendation(product, savedFitProfile)
    : null;
  
  // Hover-to-Zoom Fabric Texture Magnifier State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomLocked, setIsZoomLocked] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const [productReviews, setProductReviews] = useState(
    REVIEWS.filter(
      (r) =>
        r.productName?.toLowerCase().includes(product.name.toLowerCase()) ||
        r.rating >= 4
    ).slice(0, 3)
  );

  const handleAddToCart = () => {
    hapticSuccess();
    onAddToCart(product, selectedSize, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleBuyNow = () => {
    hapticSuccess();
    onAddToCart(product, selectedSize, selectedColor);
    onNavigate('cart');
  };

  const handleToggleWishlistWithHaptic = () => {
    hapticWishlist();
    onToggleWishlist(product);
  };

  // Paired items for "Complete The Look"
  const pairedItems = (product.styleWithIds || [])
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? '' : sec);
  };

  // WhatsApp direct customer inquiry
  const whatsappInquiryUrl = `https://wa.me/919326294187?text=${encodeURIComponent(
    `Hello AL-NOUREEN, I would like to inquire about "${product.name}" (Code: ${product.id}) in Size: ${selectedSize}, Color: ${selectedColor}.`
  )}`;

  return (
    <div id="product-detail-view" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-20">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-[11px] font-sans-ui text-[#8C7A6B] flex items-center gap-2 border-b border-[#E8DFC8]">
        <button onClick={() => onNavigate('home')} className="hover:text-[#1E1A17] transition-colors">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => {
            if (product.category === 'Pakistani') onNavigate('pakistani');
            else if (product.category === 'Abayas') onNavigate('abayas');
            else if (product.category === 'Hijabs') onNavigate('hijabs');
            else if (product.category === 'Accessories') onNavigate('accessories');
            else if (product.category === 'Bags') onNavigate('bags');
            else onNavigate('modest-wear');
          }}
          className="hover:text-[#1E1A17] transition-colors uppercase"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-[#1E1A17] font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Multi-Angle Imagery Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image with Hover-To-Zoom Fabric Texture Magnifier */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => {
                if (!isZoomLocked) setIsZoomed(false);
              }}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsZoomed(true)}
              onTouchMove={handleTouchMove}
              onClick={() => setIsZoomLocked(!isZoomLocked)}
              className="relative aspect-3/4 rounded-3xl overflow-hidden bg-[#F0EAE0] dark:bg-[#1A1613] border border-[#DDD3BC] dark:border-[#2E2620] shadow-md cursor-crosshair group select-none"
            >
              {/* Luxury Gold Shimmer Loading Overlay */}
              {!isMainImageLoaded && (
                <div className="absolute inset-0 z-0 select-none">
                  <GoldShimmerLoader
                    aspectRatio="aspect-3/4"
                    className="w-full h-full"
                    showMonogram={true}
                    monogramSize="lg"
                    label="AL-NOUREEN"
                  />
                </div>
              )}

              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                onLoad={() => setIsMainImageLoaded(true)}
                className={`w-full h-full object-cover object-top transition-all duration-700 ease-in-out ${
                  isMainImageLoaded ? 'opacity-100' : 'opacity-0'
                } ${
                  isZoomed
                    ? 'scale-[2.4] duration-75 ease-out'
                    : 'scale-100 duration-500 ease-in-out'
                }`}
                style={{
                  transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : '50% 50%'
                }}
              />

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#181411] text-[#E8D59E] border border-[#C59B27] text-[10px] font-cinzel font-semibold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs pointer-events-none z-10">
                  {product.badge}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleWishlistWithHaptic();
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-[#1E1A17] hover:text-[#C59B27] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95 z-10 cursor-pointer"
                title="Save to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-[#C59B27] text-[#C59B27]' : ''
                  }`}
                />
              </button>

              {/* Hover-to-Zoom Visual Guidance Indicator */}
              <div
                className={`absolute bottom-4 left-4 right-4 flex items-center justify-between px-3 py-2 rounded-xl backdrop-blur-md transition-all duration-300 pointer-events-none z-10 ${
                  isZoomed
                    ? 'bg-[#181411]/90 text-[#E8D59E] border border-[#C59B27]/60 shadow-lg'
                    : 'bg-white/80 text-[#1E1A17] border border-black/10 opacity-90 group-hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-cinzel font-semibold">
                  <ZoomIn className={`w-4 h-4 ${isZoomed ? 'text-[#C59B27] animate-pulse' : 'text-[#8C7A6B]'}`} />
                  <span>
                    {isZoomed
                      ? 'Fabric Magnified 2.4x • Move cursor to inspect threads & zardozi'
                      : 'Hover / Tap to Zoom Fabric Texture'}
                  </span>
                </div>
                <span className="text-[10px] font-sans-ui px-2 py-0.5 rounded-full bg-[#FAF7F2]/20 font-medium tracking-wider uppercase">
                  {isZoomLocked ? 'Zoom Locked' : isZoomed ? 'Live Lens' : 'Texture HD'}
                </span>
              </div>
            </div>

            {/* Close-up & Angle Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => {
                  const isSelected = activeImageIndex === idx;
                  return (
                    <div
                      key={`pdp-thumb-${product.id}-${idx}`}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-[#C59B27] ring-2 ring-[#C59B27]/30 shadow-xs'
                          : 'border-[#DDD3BC] dark:border-[#2E2620] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <ProductImage
                        src={img}
                        alt={`${product.name} angle ${idx + 1}`}
                        aspectRatio="aspect-square"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta & Purchase Matrix */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-cinzel font-bold uppercase tracking-widest text-[#8C6B1B]">
                  Maison AL-NOUREEN • {product.category}
                </span>
                <div className="flex items-center gap-1 text-[#C59B27] text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#C59B27]" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-[#8C7A6B]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17] tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-2xl font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm font-sans-ui text-[#8C7A6B] line-through">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-[10px] font-cinzel font-bold text-[#A32A2A] bg-[#FBEBEB] dark:bg-[#3D1414] dark:text-[#FFA8A8] px-2 py-0.5 rounded-sm">
                      SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Price Drop Alert Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setIsPriceDropModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#241F1B] hover:bg-[#F2ECE0] dark:hover:bg-[#322923] border border-[#C59B27]/60 rounded-full text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E] transition-all hover:scale-102 active:scale-98 shadow-2xs cursor-pointer"
                  title="Receive instant notification when this item goes on discount"
                >
                  <TrendingDown className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Notify me when price drops</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm font-sans-ui text-[#54463A] leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-cinzel font-semibold uppercase tracking-wider text-[#1E1A17]">
                  Color Shade: <strong className="text-[#8C6B1B]">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, cIdx) => (
                    <button
                      key={`pdp-color-${product.id}-${c}-${cIdx}`}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-sans-ui transition-all ${
                        selectedColor === c
                          ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] font-semibold shadow-2xs'
                          : 'bg-white border-[#DDD3BC] text-[#54463A] hover:bg-[#F2ECE0]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size & Length Selector with Find My Fit Helper */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-cinzel font-semibold uppercase tracking-wider text-[#1E1A17]">
                  {product.category === 'Abayas' ? 'Select Abaya Length:' : 'Select Modest Size:'}{' '}
                  <strong className="text-[#8C6B1B]">{selectedSize}</strong>
                </span>

                <div className="flex items-center gap-3">
                  {/* Find My Fit Helper Trigger Button */}
                  <button
                    type="button"
                    id="find-my-fit-trigger-btn"
                    onClick={handleOpenFindMyFit}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF7F2] dark:bg-[#25201A] hover:bg-[#F2ECE0] dark:hover:bg-[#322A23] border border-[#C59B27] rounded-full text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E] shadow-2xs transition-all hover:scale-102 active:scale-98 cursor-pointer"
                    title="Calculate your tailored size based on height & weight"
                  >
                    <Sparkles className="w-3 h-3 text-[#C59B27] animate-pulse" />
                    <span>Find My Fit</span>
                  </button>

                  <button
                    onClick={onOpenSizeGuide}
                    className="text-xs font-cinzel font-semibold text-[#8C6B1B] hover:text-[#181411] flex items-center gap-1 underline decoration-[#C59B27]"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>
              </div>

              {/* Interactive 'Find My Fit' Helper Banner */}
              {currentRecommendation ? (
                <div className="p-3 bg-gradient-to-r from-[#FAF7F2] via-[#F5EFE4] to-[#FAF7F2] dark:from-[#241E18] dark:via-[#2D261F] dark:to-[#241E18] border border-[#C59B27]/50 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center text-[#8C6B1B] dark:text-[#E8D59E] shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#1E1A17] dark:text-[#FAF7F2] font-medium truncate">
                        Recommended: <strong className="font-cinzel text-[#8C6B1B] dark:text-[#E8D59E]">Size {currentRecommendation.recommendedSize}</strong>{' '}
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded font-semibold ml-1">
                          {currentRecommendation.confidencePercent}% match
                        </span>
                      </p>
                      <p className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] truncate font-sans-ui">
                        {currentRecommendation.hemClearanceNote}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {selectedSize !== currentRecommendation.recommendedSize ? (
                      <button
                        type="button"
                        onClick={() => {
                          hapticSuccess();
                          setSelectedSize(currentRecommendation.recommendedSize);
                        }}
                        className="px-2.5 py-1 bg-[#181411] text-[#E8D59E] hover:bg-[#2C241E] border border-[#C59B27] rounded-lg text-[11px] font-cinzel font-bold tracking-wider uppercase transition-all shadow-2xs cursor-pointer active:scale-95"
                      >
                        Apply Size {currentRecommendation.recommendedSize}
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-cinzel font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded-lg">
                        <Check className="w-3 h-3 text-emerald-600" /> Applied
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleOpenFindMyFit}
                  className="p-2.5 bg-[#FAF7F2] dark:bg-[#201B17] hover:bg-[#F2ECE0] dark:hover:bg-[#28221D] border border-dashed border-[#C59B27]/70 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2 text-xs text-[#54463A] dark:text-[#C5BAAC]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27] group-hover:scale-110 transition-transform" />
                    <span>
                      Unsure about size? Enter your <strong>Height & Weight</strong> for personalized sizing.
                    </span>
                  </div>
                  <span className="text-[10px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E] uppercase tracking-wider shrink-0 underline decoration-[#C59B27]">
                    Try Advisor &rarr;
                  </span>
                </div>
              )}

              {/* Size Buttons Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes.map((s, sIdx) => {
                  const isRecommended = currentRecommendation?.recommendedSize === s;
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={`pdp-size-${product.id}-${s}-${sIdx}`}
                      onClick={() => setSelectedSize(s)}
                      className={`relative py-2.5 text-center rounded-xl border text-xs font-cinzel font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] shadow-sm ring-1 ring-[#C59B27]'
                          : isRecommended
                          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-[#C59B27] text-[#1E1A17] dark:text-[#FAF7F2] hover:bg-[#F2ECE0]'
                          : 'bg-white dark:bg-[#241F1A] border-[#DDD3BC] dark:border-[#3D352D] text-[#3D332A] dark:text-[#E0D7CC] hover:bg-[#F2ECE0]'
                      }`}
                    >
                      {s}
                      {isRecommended && !isSelected && (
                        <span className="absolute -top-1.5 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C59B27] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C59B27] items-center justify-center text-[7px] text-white">
                            ★
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {product.category === 'Abayas' && (
                <p className="text-[10px] text-[#7A6B5D] font-sans-ui italic">
                  Tip: Abaya sizes 52"–60" refer to overall length from high shoulder point to hem.
                </p>
              )}
            </div>

            {/* Action Buttons: Out-of-Stock 'Notify Me' OR In-Stock 'Add to Bag' & 'Buy Now' */}
            <div className="space-y-2.5 pt-2">
              {isOutOfStock ? (
                <div className="space-y-3">
                  {/* Out of stock luxury notice banner */}
                  <div className="p-3.5 bg-amber-50/80 dark:bg-[#2A221B] border border-[#C59B27]/60 rounded-2xl flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-[#181411] border border-[#C59B27] flex items-center justify-center text-[#F5D77F] shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-[#F5D77F] animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E] uppercase tracking-wider">
                          Currently Sold Out in Atelier
                        </span>
                        <span className="px-1.5 py-0.2 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-[9px] font-mono rounded font-bold uppercase">
                          Out of Stock
                        </span>
                      </div>
                      <p className="text-[11px] text-[#594E43] dark:text-[#C5BAAC] font-sans-ui mt-0.5 leading-snug">
                        Handcrafted batches are strictly limited. Register your email to secure instant VIP notification and first reservation rights when this piece is restocked.
                      </p>
                    </div>
                  </div>

                  {/* Primary 'Notify Me When Available' Button */}
                  <button
                    id="notify-me-trigger-btn"
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setIsNotifyMeModalOpen(true);
                    }}
                    className="relative overflow-hidden group w-full py-4 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B3871B] hover:from-[#D4AF37] hover:to-[#C59B27] text-[#14100D] rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-lg hover:scale-101 active:scale-98 cursor-pointer flex items-center justify-center gap-2.5 border border-[#F5D77F]/60"
                  >
                    <div className="gold-sweep-beam pointer-events-none" />
                    <Bell className="w-4 h-4 text-[#14100D]" />
                    <span>Notify Me When Available</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4 text-[#25D366]" /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Bag
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 bg-[#C59B27] hover:bg-[#D4AF37] text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    Buy Now & Checkout
                  </button>
                </div>
              )}

              {/* Secondary Actions: Swatch Request & WhatsApp Concierge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="request-fabric-swatch-btn"
                  onClick={() => {
                    hapticLight();
                    setIsFabricSwatchModalOpen(true);
                  }}
                  className="w-full py-3 bg-[#FAF7F2] dark:bg-[#1E1915] hover:bg-[#F2ECE0] dark:hover:bg-[#2A231D] border border-[#C59B27] text-[#1E1A17] dark:text-[#FAF7F2] rounded-xl text-xs font-cinzel font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs hover:scale-101 active:scale-99 cursor-pointer"
                  title="Request physical fabric sample mailer"
                >
                  <Scissors className="w-4 h-4 text-[#C59B27]" />
                  <span>Request Fabric Swatch</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#FAF7F2] hover:bg-[#F2ECE0] dark:bg-[#1E1915] dark:hover:bg-[#2A231D] border border-[#25D366]/60 text-[#1E1A17] dark:text-[#FAF7F2] rounded-xl text-xs font-cinzel font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  Inquire on WhatsApp
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#E8DFC8] text-center">
              <div className="space-y-1">
                <Truck className="w-4 h-4 text-[#C59B27] mx-auto" />
                <p className="text-[10px] font-cinzel font-bold text-[#1E1A17]">DHL Express</p>
                <p className="text-[9px] text-[#7A6B5D]">2–4 Days Air Dispatch</p>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-4 h-4 text-[#C59B27] mx-auto" />
                <p className="text-[10px] font-cinzel font-bold text-[#1E1A17]">14-Day Exchanges</p>
                <p className="text-[9px] text-[#7A6B5D]">Seamless Size Swaps</p>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#C59B27] mx-auto" />
                <p className="text-[10px] font-cinzel font-bold text-[#1E1A17]">Artisan Authentic</p>
                <p className="text-[9px] text-[#7A6B5D]">100% Genuine Weaves</p>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="space-y-2 pt-1 text-xs">
              {/* Fabric & Product Details */}
              <div className="border border-[#DDD3BC] rounded-xl overflow-hidden bg-[#FAF7F2]">
                <button
                  onClick={() => toggleSection('fabric')}
                  className="w-full p-3.5 text-left font-cinzel font-bold text-[#1E1A17] flex items-center justify-between hover:bg-[#F2ECE0]"
                >
                  <span>Fabric & Artisan Craftsmanship</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'fabric' ? 'rotate-180 text-[#C59B27]' : ''
                    }`}
                  />
                </button>
                {openSection === 'fabric' && (
                  <div className="p-3.5 pt-0 font-sans-ui text-[#54463A] dark:text-[#C5BAAC] leading-relaxed space-y-2.5">
                    <p><strong>Primary Textile:</strong> {product.fabric}</p>
                    <p><strong>Includes:</strong> {product.includes}</p>
                    <p><strong>Workmanship:</strong> Master karigar hand embroidery, zardozi needlework, clean overcast modest tailoring.</p>
                    
                    <div className="pt-2.5 border-t border-[#DDD3BC] dark:border-[#2E2620] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F2ECE1]/60 dark:bg-[#201A15]/60 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#C59B27] shrink-0" />
                        <span className="text-[11px] text-[#54463A] dark:text-[#C5BAAC]">
                          Want to feel the weave, texture & zari luster in person?
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          hapticLight();
                          setIsFabricSwatchModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-lg font-cinzel text-[10.5px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                      >
                        <Scissors className="w-3 h-3 text-[#D4AF37]" />
                        Get Free Swatch Sample
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="border border-[#DDD3BC] rounded-xl overflow-hidden bg-[#FAF7F2]">
                <button
                  onClick={() => toggleSection('care')}
                  className="w-full p-3.5 text-left font-cinzel font-bold text-[#1E1A17] flex items-center justify-between hover:bg-[#F2ECE0]"
                >
                  <span>Care & Preservation Instructions</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'care' ? 'rotate-180 text-[#C59B27]' : ''
                    }`}
                  />
                </button>
                {openSection === 'care' && (
                  <div className="p-3.5 pt-0 font-sans-ui text-[#54463A] leading-relaxed space-y-1.5">
                    <p>• {product.care}</p>
                    <p>• Store inside the breathable AL-NOUREEN signature cotton garment dustbag.</p>
                    <p>• Avoid spraying perfume directly onto gold bullion, tilla or silk fibers.</p>
                  </div>
                )}
              </div>

              {/* Delivery & Dispatch */}
              <div className="border border-[#DDD3BC] rounded-xl overflow-hidden bg-[#FAF7F2]">
                <button
                  onClick={() => toggleSection('delivery')}
                  className="w-full p-3.5 text-left font-cinzel font-bold text-[#1E1A17] flex items-center justify-between hover:bg-[#F2ECE0]"
                >
                  <span>Delivery, Customs & Packaging</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openSection === 'delivery' ? 'rotate-180 text-[#C59B27]' : ''
                    }`}
                  />
                </button>
                {openSection === 'delivery' && (
                  <div className="p-3.5 pt-0 font-sans-ui text-[#54463A] leading-relaxed space-y-1.5">
                    <p>• Dispatched in our luxury magnetic-closure presentation box with gold-foiled crest.</p>
                    <p>• DHL Express Priority door-to-door delivery with live tracking and WhatsApp alerts.</p>
                    <p>• Duties covered or calculated at transparent flat rates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete The Look (Matching Hijabs, Bags, Accessories) */}
        {pairedItems.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E8DFC8]">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] font-bold">
                Maison Styling Ensemble
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-[#1E1A17] mt-1">
                Complete The Look
              </h2>
              <p className="text-xs text-[#7A6B5D] font-sans-ui mt-1">
                Hand-picked matching pure silk hijabs, handcrafted potlis, and fine accessories to pair with this outfit.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {pairedItems.map((item, idx) => (
                <div
                  key={`pdp-paired-${product.id}-${item.id}-${idx}`}
                  className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#DDD3BC] p-3 space-y-3 shadow-2xs hover:border-[#C59B27] transition-all"
                >
                  <div
                    onClick={() => onSelectProduct(item)}
                    className="aspect-square rounded-xl overflow-hidden bg-[#F0EAE0] dark:bg-[#120F0D] cursor-pointer"
                  >
                    <ProductImage
                      src={item.images[0]}
                      alt={item.name}
                      aspectRatio="aspect-square"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-sans-ui tracking-wider text-[#8C6B1B] font-semibold">
                      {item.category}
                    </span>
                    <h4
                      onClick={() => onSelectProduct(item)}
                      className="font-serif text-xs font-semibold text-[#1E1A17] truncate group-hover:text-[#C59B27] cursor-pointer"
                    >
                      {item.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#E8DFC8]">
                    <span className="font-serif font-bold text-xs text-[#1E1A17]">
                      {formatPrice(item.price, currency)}
                    </span>
                    <button
                      onClick={() => onAddToCart(item, item.sizes[0] || 'One Size', item.colors[0])}
                      className="px-2.5 py-1 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/40 rounded-md text-[10px] font-cinzel font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Pair
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews for this Product */}
        <div className="mt-16 pt-12 border-t border-[#E8DFC8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] font-bold">
                Verified Feedback
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-[#1E1A17] mt-1">
                Patron Reviews for {product.name}
              </h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-semibold text-xs tracking-wider transition-colors shadow-xs"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {productReviews.map((rev, idx) => (
              <div
                key={`pdp-review-${product.id}-${rev.id}-${idx}`}
                className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD3BC] shadow-2xs space-y-3"
              >
                <div className="flex items-center gap-1 text-[#C59B27]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={`pdp-rev-${rev.id}-star-${i}`} className="w-3.5 h-3.5 fill-[#C59B27]" />
                  ))}
                </div>
                <h4 className="font-cinzel text-xs font-bold text-[#1E1A17]">{rev.title}</h4>
                <p className="text-xs text-[#5E5043] font-sans-ui leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="pt-2 border-t border-[#E8DFC8] flex items-center justify-between text-[11px] text-[#8C7A6B]">
                  <span>{rev.author} • {rev.location}</span>
                  {rev.fitRating && (
                    <span className="text-[#8C6B1B] font-semibold">Fit: {rev.fitRating}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productName={product.name}
        onSubmitReview={(newRev) => {
          setProductReviews([newRev as any, ...productReviews]);
        }}
      />

      <PriceDropModal
        isOpen={isPriceDropModalOpen}
        onClose={() => setIsPriceDropModalOpen(false)}
        product={product}
        currency={currency}
        onSubscribe={(email, discountPct) => {
          if (onNotifyPriceDrop) {
            onNotifyPriceDrop(product, email, discountPct);
          }
        }}
      />

      <FabricSwatchModal
        isOpen={isFabricSwatchModalOpen}
        onClose={() => setIsFabricSwatchModalOpen(false)}
        product={product}
        selectedColor={selectedColor}
        onRequestSwatch={(data) => {
          if (onRequestFabricSwatch) {
            onRequestFabricSwatch(data);
          }
        }}
      />

      <FindMyFitModal
        isOpen={isFindMyFitOpen}
        onClose={() => {
          setIsFindMyFitOpen(false);
          setSavedFitProfile(getSavedFitProfile());
        }}
        product={product}
        currentSelectedSize={selectedSize}
        onSelectSize={(newSize) => {
          setSelectedSize(newSize);
          setSavedFitProfile(getSavedFitProfile());
        }}
      />

      <NotifyMeModal
        isOpen={isNotifyMeModalOpen}
        onClose={() => setIsNotifyMeModalOpen(false)}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        currency={currency}
        onSubscribe={(email, phone, size, color) => {
          if (onSubscribeRestock) {
            onSubscribeRestock(product, email, size, color);
          }
        }}
        onSimulateRestock={(prod, size, color, email) => {
          if (onSimulateRestock) {
            onSimulateRestock(prod, size, color, email);
          }
        }}
      />
    </div>
  );
};
