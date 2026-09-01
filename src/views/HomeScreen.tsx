import React, { useState, useEffect } from 'react';
import { Product, ScreenType, Currency, SeasonalLookbook } from '../types';
import { SHOP_THE_LOOK_BUNDLES } from '../data/looks';
import { SEASONAL_LOOKBOOKS } from '../data/lookbooks';
import { REVIEWS } from '../data/reviews';
import { ShopTheLookSection } from '../components/ShopTheLookSection';
import { SeasonalLookbooksSection } from '../components/SeasonalLookbooksSection';
import { CommunityStylingSection } from '../components/CommunityStylingSection';
import { ProductImage } from '../components/ProductImage';
import { formatPrice } from '../utils/currency';
import { hapticLight } from '../utils/haptics';
import {
  Sparkles,
  ArrowRight,
  Star,
  ShoppingBag,
  Heart,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Scissors,
  Crown,
  Ruler,
  Package,
  MessageCircle,
  Gem,
  Award,
  Layers,
  Wand2,
  Sliders
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: any, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  products: Product[];
  currency: Currency;
  onOpenEnsembleBuilder?: (initialProduct?: Product) => void;
  onOpenTailoringWizard?: () => void;
  onSelectLookbook?: (lookbook: SeasonalLookbook) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  products,
  currency,
  onOpenEnsembleBuilder,
  onOpenTailoringWizard,
  onSelectLookbook
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      id: 'pakistani-festive',
      category: 'Pakistani Haute Couture',
      arabic: 'النورين • فن الزردوزي',
      titlePrimary: 'Two Lights.',
      titleSecondary: 'One Regal Vision.',
      description:
        'Heirloom Pakistani bridal & festive creations handcrafted with antique zardozi, handwoven raw silk peshwas, and resham embroidery for the discerning patron.',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85',
      primaryCta: 'Explore Pakistani Heritage',
      primaryScreen: 'pakistani' as ScreenType,
      secondaryCta: 'View Royal Lookbook',
      secondaryScreen: 'shop-the-look' as ScreenType,
      badge: 'Maison Heritage 2026 Collection',
      tag: 'Hand-Embroidered Zardozi'
    },
    {
      id: 'haute-abayas',
      category: 'Imperial Abayas & Silhouettes',
      arabic: 'الأناقة الملكية • ندى كوري',
      titlePrimary: 'Architectural Grace.',
      titleSecondary: 'Pure Royal Modesty.',
      description:
        'Masterfully tailored open abayas, kimono silhouettes, and kaftans in imported Korean Nida, pure European linen, and liquid gold metallic piping.',
      image:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85',
      primaryCta: 'Discover Haute Abayas',
      primaryScreen: 'abayas' as ScreenType,
      secondaryCta: 'Explore Modest Co-ords',
      secondaryScreen: 'modest-wear' as ScreenType,
      badge: 'Atelier Signature Cut',
      tag: 'Imported Korean Nida'
    },
    {
      id: 'pure-silk-hijabs',
      category: 'Silk Atelier & Fine Accents',
      arabic: 'حرير خالص • لمسة ملكية',
      titlePrimary: 'Mulberry Silk.',
      titleSecondary: 'Unrivaled Luminescence.',
      description:
        '100% pure 19mm Mulberry silk veils, whisper-soft bamboo modals, hand-rolled edges, and 18k gold-plated calligraphy magnetic brooches.',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=2000&q=85',
      primaryCta: 'Shop Pure Silk Veils',
      primaryScreen: 'hijabs' as ScreenType,
      secondaryCta: 'Fine Atelier Accessories',
      secondaryScreen: 'accessories' as ScreenType,
      badge: '100% Pure Mulberry Silk',
      tag: 'Hand-Finished Edges'
    }
  ];

  // Auto-advance hero carousel with gentle pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const handleNextSlide = () => {
    hapticLight();
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    hapticLight();
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const pakistaniProducts = products.filter((p) => p.category === 'Pakistani').slice(0, 3);
  const abayaProducts = products.filter((p) => p.category === 'Abayas').slice(0, 3);
  const hijabProducts = products.filter((p) => p.category === 'Hijabs').slice(0, 4);
  const modestWearProducts = products.filter(
    (p) => p.category === 'Modest Wear' || p.category === 'Co-ord Sets' || p.category === 'Tunics'
  ).slice(0, 3);
  const accessoryProducts = products.filter(
    (p) => p.category === 'Accessories' || p.category === 'Bags'
  ).slice(0, 4);

  const categoriesList = [
    {
      name: 'Pakistani Collection',
      screen: 'pakistani' as ScreenType,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Zardozi & Pure Silk Peshwas'
    },
    {
      name: 'Haute Abayas',
      screen: 'abayas' as ScreenType,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Korean Nida & European Linen'
    },
    {
      name: 'Pure Silk Hijabs',
      screen: 'hijabs' as ScreenType,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      subtitle: '19mm Mulberry Silk & Modal'
    },
    {
      name: 'Modest Dresses',
      screen: 'modest-wear' as ScreenType,
      image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Tiered Georgette & Kaftans'
    },
    {
      name: 'Co-ord Sets',
      screen: 'modest-wear' as ScreenType,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Raw Silk & Linen Tailoring'
    },
    {
      name: 'Modest Tunics',
      screen: 'modest-wear' as ScreenType,
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Asymmetrical High-Slit Tunics'
    },
    {
      name: 'Fine Accessories',
      screen: 'accessories' as ScreenType,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
      subtitle: '18k Calligraphy & Magnetic Pins'
    },
    {
      name: 'Luxury Bags & Potlis',
      screen: 'bags' as ScreenType,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      subtitle: 'Hand-Embroidered Velvet Clutches'
    }
  ];

  return (
    <div id="home-screen-view" className="w-full pb-16">
      {/* 1. ULTRA-PREMIUM HAUTE COUTURE HERO SECTION */}
      <section
        className="relative w-full min-h-[640px] md:min-h-[740px] flex items-center justify-center overflow-hidden bg-[#0F0D0B] select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Multi-Slide Background Image Layer with Atmospheric Crossfade */}
        {heroSlides.map((slide, idx) => {
          const isActive = currentSlide === idx;
          return (
            <div
              key={`hero-bg-${slide.id}-${idx}`}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.titlePrimary}
                className={`w-full h-full object-cover object-top transition-transform duration-10000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Multi-Stop Haute Couture Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B] via-[#0F0D0B]/60 to-[#0F0D0B]/40" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,155,39,0.12)_0%,rgba(15,13,11,0.6)_70%,rgba(15,13,11,0.95)_100%)]" />
            </div>
          );
        })}

        {/* Ambient Gold Radial Breathing Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C59B27]/10 rounded-full blur-[120px] pointer-events-none gold-ambient-glow" />

        {/* Subtle Arabic Calligraphy Watermark in Center Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10 z-1 overflow-hidden">
          <span className="font-serif text-[160px] sm:text-[240px] md:text-[340px] text-[#F5D77F] tracking-widest select-none leading-none">
            النورين
          </span>
        </div>

        {/* Slide Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-[#FAF7F2] py-24 sm:py-28 flex flex-col items-center">
          {/* Haute Couture Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#181411]/85 backdrop-blur-md border border-[#C59B27]/60 rounded-full text-[11px] font-cinzel text-[#E8D59E] uppercase tracking-[0.25em] font-semibold shadow-lg mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27] animate-pulse" />
            <span>{heroSlides[currentSlide].badge}</span>
            <span className="w-1 h-1 rounded-full bg-[#C59B27]" />
            <span className="text-[#DDD3BC] font-sans-ui text-[10px] tracking-widest lowercase">
              {heroSlides[currentSlide].tag}
            </span>
          </div>

          {/* Subtitle / Arabic Epithet */}
          <p className="font-serif text-sm sm:text-base text-[#C59B27] tracking-[0.2em] uppercase font-medium mb-3">
            {heroSlides[currentSlide].arabic}
          </p>

          {/* Grand Couture Headline */}
          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white leading-[1.15] drop-shadow-lg max-w-3xl">
            {heroSlides[currentSlide].titlePrimary}{' '}
            <span className="block mt-1 font-normal italic font-serif bg-gradient-to-r from-[#F7E5B5] via-[#E8D59E] to-[#C59B27] bg-clip-text text-transparent">
              {heroSlides[currentSlide].titleSecondary}
            </span>
          </h1>

          {/* Refined Description */}
          <p className="font-sans-ui text-xs sm:text-sm md:text-base text-[#DDD3BC] max-w-2xl leading-relaxed font-light mt-4 drop-shadow-sm px-2">
            {heroSlides[currentSlide].description}
          </p>

          {/* Dual Action CTAs */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                hapticLight();
                onNavigate(heroSlides[currentSlide].primaryScreen);
              }}
              className="relative overflow-hidden group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B3871B] hover:from-[#D4AF37] hover:to-[#C59B27] text-[#120F0D] font-cinzel font-bold text-xs tracking-[0.2em] uppercase rounded-xl transition-all shadow-xl hover:scale-105 active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-[#F5D77F]/60"
            >
              {/* Button Shimmer Beam */}
              <div className="gold-sweep-beam pointer-events-none" />
              <span>{heroSlides[currentSlide].primaryCta}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                hapticLight();
                onNavigate(heroSlides[currentSlide].secondaryScreen);
              }}
              className="w-full sm:w-auto px-7 py-4 bg-[#181411]/70 hover:bg-[#251E18] text-[#E8D59E] border border-[#C59B27]/50 font-cinzel font-semibold text-xs tracking-[0.18em] uppercase rounded-xl backdrop-blur-md transition-all hover:scale-105 active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Crown className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{heroSlides[currentSlide].secondaryCta}</span>
            </button>
          </div>

          {/* Slide Indicator Dots & Thumb Trackers */}
          <div className="flex items-center gap-3 mt-10">
            {heroSlides.map((slide, idx) => {
              const isSelected = currentSlide === idx;
              return (
                <button
                  key={`hero-dot-${slide.id}-${idx}`}
                  onClick={() => {
                    hapticLight();
                    setCurrentSlide(idx);
                  }}
                  className={`group relative py-2 px-1 cursor-pointer transition-all`}
                  title={`Slide ${idx + 1}: ${slide.category}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isSelected
                        ? 'w-10 bg-gradient-to-r from-[#C59B27] to-[#F5D77F] shadow-[0_0_8px_rgba(245,215,127,0.6)]'
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={handlePrevSlide}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#181411]/60 hover:bg-[#181411] border border-[#C59B27]/40 text-[#E8D59E] hover:text-white backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg z-20 cursor-pointer"
          title="Previous Collection"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#181411]/60 hover:bg-[#181411] border border-[#C59B27]/40 text-[#E8D59E] hover:text-white backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg z-20 cursor-pointer"
          title="Next Collection"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Hero Trust & Heritage Highlight Strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#120F0D]/90 backdrop-blur-md border-t border-[#C59B27]/30 py-3.5 px-4 sm:px-6 hidden sm:block">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-left">
              <Scissors className="w-4 h-4 text-[#C59B27] shrink-0" />
              <div>
                <p className="text-[11px] font-cinzel font-bold text-[#E8D59E] uppercase tracking-wider">
                  Handcrafted Zardozi
                </p>
                <p className="text-[9px] text-[#A89887] font-sans-ui">Authentic Resham & Tilla</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-left">
              <Gem className="w-4 h-4 text-[#C59B27] shrink-0" />
              <div>
                <p className="text-[11px] font-cinzel font-bold text-[#E8D59E] uppercase tracking-wider">
                  Pure Mulberry Silk
                </p>
                <p className="text-[9px] text-[#A89887] font-sans-ui">19mm Lustrous Silk Veils</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-left">
              <Truck className="w-4 h-4 text-[#C59B27] shrink-0" />
              <div>
                <p className="text-[11px] font-cinzel font-bold text-[#E8D59E] uppercase tracking-wider">
                  Worldwide Courier
                </p>
                <p className="text-[9px] text-[#A89887] font-sans-ui">Express Shipping to 45+ Countries</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-left">
              <MessageCircle className="w-4 h-4 text-[#C59B27] shrink-0" />
              <div>
                <p className="text-[11px] font-cinzel font-bold text-[#E8D59E] uppercase tracking-wider">
                  Atelier Concierge
                </p>
                <p className="text-[9px] text-[#A89887] font-sans-ui">Bespoke Fit on WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY TILES (8 Categories Requested) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] font-bold">
            Curated Categories
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17] mt-1">
            Shop By Category
          </h2>
          <div className="w-12 h-0.5 bg-[#C59B27] mx-auto mt-2.5" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoriesList.map((cat, idx) => (
            <div
              key={`home-cat-${cat.screen}-${cat.name}-${idx}`}
              onClick={() => onNavigate(cat.screen)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#181411] aspect-4/5 border border-[#E0D5BE] dark:border-[#2E2620] shadow-xs hover:border-[#C59B27] transition-all hover:shadow-lg"
            >
              <ProductImage
                src={cat.image}
                alt={cat.name}
                aspectRatio="aspect-4/5"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity group-hover:opacity-90 z-10 pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-[#E8D59E] transition-colors flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#C59B27] transform transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-[10px] sm:text-xs text-[#DDD3BC] font-sans-ui mt-0.5 line-clamp-1">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS CAROUSEL/GRID */}
      <section className="bg-[#F7F2E8] py-14 px-4 sm:px-6 border-t border-b border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] font-bold">
                Atelier Fresh Releases
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17] mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => onNavigate('new-arrivals')}
              className="inline-flex items-center gap-1.5 text-xs font-cinzel font-semibold text-[#8C6B1B] hover:text-[#181411] underline decoration-[#C59B27]"
            >
              View All New Arrivals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product, idx) => (
              <div
                key={`home-new-${product.id}-${idx}`}
                className="group flex flex-col bg-[#FAF7F2] dark:bg-[#1A1613] rounded-2xl overflow-hidden border border-[#DDD3BC] dark:border-[#2E2620] shadow-2xs hover:border-[#C59B27]/70 transition-all"
              >
                {/* Image Container with Skeleton ProductImage */}
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
                    <span className="absolute top-3 left-3 bg-[#181411]/90 text-[#E8D59E] border border-[#C59B27] text-[9.5px] font-cinzel font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 pointer-events-none">
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-[#201A16]/90 backdrop-blur-xs text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#C59B27] flex items-center justify-center shadow-xs transition-colors z-10"
                    title="Add to Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.some((p) => p.id === product.id)
                          ? 'fill-[#C59B27] text-[#C59B27]'
                          : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                    <span className="text-[9.5px] uppercase font-sans-ui tracking-wider text-[#8C6B1B] dark:text-[#D4AF37] font-semibold">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-sm font-semibold text-[#1E1A17] dark:text-[#FAF7F2] line-clamp-1 group-hover:text-[#C59B27] transition-colors mt-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui line-clamp-1">
                      {product.fabric}
                    </p>
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
                    <button
                      onClick={() => onAddToCart(product, product.sizes[0] || 'M', product.colors[0])}
                      className="px-3 py-1.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/60 rounded-lg text-[11px] font-cinzel font-semibold flex items-center gap-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS EDIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] dark:text-[#D4AF37] font-bold">
              Most Adored by Global Patrons
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17] dark:text-[#FAF7F2] mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel font-semibold text-[#8C6B1B] dark:text-[#D4AF37] hover:text-[#181411] dark:hover:text-white underline decoration-[#C59B27]"
          >
            Explore Full Boutique <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product, idx) => (
            <div
              key={`home-bestseller-${product.id}-${idx}`}
              className="group flex flex-col bg-[#FAF7F2] dark:bg-[#1A1613] rounded-2xl overflow-hidden border border-[#DDD3BC] dark:border-[#2E2620] shadow-2xs hover:border-[#C59B27]/70 transition-all"
            >
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-[#201A16]/90 backdrop-blur-xs text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#C59B27] flex items-center justify-center shadow-xs z-10"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlist.some((p) => p.id === product.id)
                        ? 'fill-[#C59B27] text-[#C59B27]'
                        : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                  <div className="flex items-center gap-1 text-[#C59B27] text-[10px] mb-1">
                    <Star className="w-3 h-3 fill-[#C59B27]" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-[#8C7A6B]">({product.reviewCount})</span>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-[#1E1A17] dark:text-[#FAF7F2] line-clamp-1 group-hover:text-[#C59B27] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui line-clamp-1">
                    {product.fabric}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8DFC8] dark:border-[#2E2620]">
                  <p className="font-serif font-bold text-sm text-[#1E1A17] dark:text-[#FAF7F2]">
                    {formatPrice(product.price, currency)}
                  </p>
                  <button
                    onClick={() => onAddToCart(product, product.sizes[0] || 'M', product.colors[0])}
                    className="px-3 py-1.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/60 rounded-lg text-[11px] font-cinzel font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEASONAL LOOKBOOKS SECTION (Horizontal scrollable curated trends) */}
      <SeasonalLookbooksSection
        lookbooks={SEASONAL_LOOKBOOKS}
        products={products}
        currency={currency}
        onSelectLookbook={(lb) => {
          if (onSelectLookbook) {
            onSelectLookbook(lb);
          } else {
            onNavigate(lb.curatedCategory === 'Pakistani' ? 'pakistani' : lb.curatedCategory === 'Abayas' ? 'abayas' : 'shop');
          }
        }}
        onSelectProduct={onSelectProduct}
      />

      {/* 6. CONCIERGE SPOTLIGHT (Order Tracking & Modest Size Guide) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Real-Time Order Tracking */}
          <div className="bg-[#181411] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#C59B27]/40 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C59B27]/15 to-transparent rounded-bl-full pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B231D] border border-[#C59B27]/50 text-[#E8D59E] text-[10px] font-cinzel font-bold tracking-widest uppercase">
                <Truck className="w-3.5 h-3.5 text-[#C59B27]" />
                Live Logistics Telemetry
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-snug">
                Real-Time Order Tracking & Airway Updates
              </h3>
              <p className="text-xs text-[#C5BAAC] font-sans-ui leading-relaxed">
                Track your shipment every step of the way with live courier telemetry, airport customs clearance milestones, and doorstep delivery notifications.
              </p>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#E8D59E]">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> DHL Priority</span>
                <span className="text-[#8C7A6B]">•</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Share Links</span>
                <span className="text-[#8C7A6B]">•</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PDF Tax Invoices</span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => onNavigate('track-order')}
                className="w-full sm:w-auto px-6 py-3 bg-[#C59B27] hover:bg-[#D4AF37] active:scale-95 text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Track Your Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card B: Modest Size Guide & Fit Assistant */}
          <div className="bg-[#FAF7F2] dark:bg-[#1A1613] text-[#1E1A17] dark:text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#DDD3BC] dark:border-[#2E2620] shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EAE0] dark:bg-[#241E19] border border-[#C59B27]/40 text-[#8C6B1B] dark:text-[#E8D59E] text-[10px] font-cinzel font-bold tracking-widest uppercase">
                <Ruler className="w-3.5 h-3.5 text-[#C59B27]" />
                Size & Fit Concierge
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold leading-snug">
                Modest Sizing & Length Chart
              </h3>
              <p className="text-xs text-[#7A6B5D] dark:text-[#A69788] font-sans-ui leading-relaxed">
                Find your perfect modest fit with our comprehensive sizing charts. Compare abaya lengths (52"–60"), bust measurements, and drape recommendations for every silhouette.
              </p>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#8C6B1B] dark:text-[#E8D59E]">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Height-to-Length Math</span>
                <span className="text-[#8C7A6B]">•</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Modest Drape Guide</span>
                <span className="text-[#8C7A6B]">•</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Fit Guarantee</span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => onNavigate('size-guide')}
                className="w-full sm:w-auto px-6 py-3 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Ruler className="w-4 h-4 text-[#C59B27]" />
                <span>Open Size Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE "SHOP THE LOOK" SECTION (Matching hijabs, bags, jewelry) */}
      <ShopTheLookSection
        bundles={SHOP_THE_LOOK_BUNDLES}
        products={products}
        currency={currency}
        onAddToCart={onAddToCart}
        onSelectProduct={onSelectProduct}
      />

      {/* 6. PAKISTANI COLLECTION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-[#181411] text-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#C59B27]/40 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#E8D59E] font-bold">
                Haute Trousseaus & Festives
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white leading-tight">
                The Pakistani Couture Collection
              </h2>
              <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui leading-relaxed">
                Hand-guided zardozi, antique tilla, dabka, and Lucknowi chikankari rendered on pure mulberry silks and lightweight organza dupattas.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('pakistani')}
                  className="px-6 py-3 bg-[#C59B27] hover:bg-[#D4AF37] text-[#181411] font-cinzel font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md"
                >
                  Shop Pakistani Outfits
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pakistaniProducts.map((p, idx) => (
                <div
                  key={`home-pak-${p.id}-${idx}`}
                  onClick={() => onSelectProduct(p)}
                  className="bg-[#241E19] border border-[#C59B27]/30 rounded-2xl overflow-hidden p-2.5 space-y-2 cursor-pointer hover:border-[#C59B27] transition-all group"
                >
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-[#181411]">
                    <ProductImage
                      src={p.images[0]}
                      alt={p.name}
                      aspectRatio="aspect-3/4"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-serif text-xs font-semibold text-[#FAF7F2] truncate group-hover:text-[#E8D59E]">
                    {p.name}
                  </h4>
                  <p className="font-cinzel text-xs font-bold text-[#E8D59E]">
                    {formatPrice(p.price, currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. HAUTE ABAYA COLLECTION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] dark:text-[#D4AF37] font-bold">
              Modest Drapery in 52"–60" Sizing
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17] dark:text-[#FAF7F2] mt-1">
              Haute Abaya Collection
            </h2>
          </div>
          <button
            onClick={() => onNavigate('abayas')}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel font-semibold text-[#8C6B1B] dark:text-[#D4AF37] hover:text-[#181411] dark:hover:text-white underline decoration-[#C59B27]"
          >
            View All Abayas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {abayaProducts.map((abaya, idx) => (
            <div
              key={`home-abaya-${abaya.id}-${idx}`}
              onClick={() => onSelectProduct(abaya)}
              className="group bg-[#FAF7F2] dark:bg-[#1A1613] border border-[#DDD3BC] dark:border-[#2E2620] rounded-2xl overflow-hidden shadow-2xs hover:border-[#C59B27] transition-all cursor-pointer"
            >
              <div className="relative aspect-3/4 overflow-hidden bg-[#F0EAE0] dark:bg-[#120F0D]">
                <ProductImage
                  src={abaya.images[0]}
                  alt={abaya.name}
                  aspectRatio="aspect-3/4"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/70 text-[#E8D59E] border border-[#C59B27]/40 text-[9px] uppercase px-2 py-0.5 rounded-full font-sans-ui z-10">
                  Lengths 52"–60" Available
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-serif text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] group-hover:text-[#C59B27] transition-colors">
                  {abaya.name}
                </h3>
                <p className="text-xs text-[#7A6B5D] dark:text-[#A69788] font-sans-ui line-clamp-1">
                  {abaya.fabric}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#E8DFC8] dark:border-[#2E2620]">
                  <span className="font-serif font-bold text-sm text-[#1E1A17] dark:text-[#FAF7F2]">
                    {formatPrice(abaya.price, currency)}
                  </span>
                  <span className="text-xs font-cinzel text-[#8C6B1B] dark:text-[#D4AF37] group-hover:underline">
                    View Details & Lengths →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. HIJAB & VEILS EDIT */}
      <section className="bg-[#F7F2E8] dark:bg-[#151210] py-14 px-4 sm:px-6 border-t border-b border-[#E8DFC8] dark:border-[#2E2620] my-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] dark:text-[#D4AF37] font-bold">
                19mm Pure Silk, Modal & Snag-Free Pins
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17] dark:text-[#FAF7F2] mt-1">
                The Veil & Hijab Edit
              </h2>
            </div>
            <button
              onClick={() => onNavigate('hijabs')}
              className="inline-flex items-center gap-1.5 text-xs font-cinzel font-semibold text-[#8C6B1B] dark:text-[#D4AF37] hover:text-[#181411] dark:hover:text-white underline decoration-[#C59B27]"
            >
              Explore All Hijabs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {hijabProducts.map((hijab, idx) => (
              <div
                key={`home-hijab-${hijab.id}-${idx}`}
                onClick={() => onSelectProduct(hijab)}
                className="group bg-[#FAF7F2] dark:bg-[#1A1613] rounded-2xl overflow-hidden border border-[#DDD3BC] dark:border-[#2E2620] p-3 space-y-3 cursor-pointer hover:border-[#C59B27] transition-all"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-[#F0EAE0] dark:bg-[#120F0D]">
                  <ProductImage
                    src={hijab.images[0]}
                    alt={hijab.name}
                    aspectRatio="aspect-square"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#1E1A17] dark:text-[#FAF7F2] truncate group-hover:text-[#C59B27]">
                    {hijab.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#7A6B5D] dark:text-[#A69788] truncate mt-0.5">
                    {hijab.fabric}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#E8DFC8] dark:border-[#2E2620]">
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#1E1A17] dark:text-[#FAF7F2]">
                    {formatPrice(hijab.price, currency)}
                  </span>
                  <span className="text-[11px] text-[#0A7B54] dark:text-[#38D39F] font-medium">In Stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. COMMUNITY STYLING & UGC CAROUSEL */}
      <CommunityStylingSection
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        products={products}
        currency={currency}
      />

      {/* 10. BRAND STORY TEASER ("The Meaning of Al-Noureen - The Two Lights") */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[#FAF7F2] border-2 border-[#C59B27]/40 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-sm">
          <div className="inline-block px-3 py-1 bg-[#F0EAE0] rounded-full text-xs font-cinzel text-[#8C6B1B] font-bold">
            النورين • THE TWO LIGHTS
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E1A17]">
            “Two Lights. One Beautiful Vision.”
          </h2>

          <p className="text-xs sm:text-sm font-sans-ui text-[#4A3E34] leading-relaxed max-w-2xl mx-auto">
            Al-Noureen represents the eternal harmony between <strong>tradition and modernity</strong>, <strong>modesty and elegance</strong>, and <strong>heritage craft with contemporary fashion</strong>. Handcrafted with reverence in our Mumbai atelier.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-2.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-semibold text-xs tracking-wider transition-all"
            >
              Read The Full Brand Story →
            </button>
          </div>
        </div>
      </section>

      {/* 10. CLIENT REVIEWS TESTIMONIALS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#8C6B1B] font-bold">
              Global Client Love
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17] mt-1">
              What Patrons Say
            </h2>
          </div>
          <button
            onClick={() => onNavigate('reviews')}
            className="inline-flex items-center gap-1.5 text-xs font-cinzel font-semibold text-[#8C6B1B] hover:text-[#181411] underline decoration-[#C59B27]"
          >
            Read All Reviews ({REVIEWS.length}+) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.slice(0, 3).map((r, idx) => (
            <div
              key={`home-review-${r.id}-${idx}`}
              className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#DDD3BC] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[#C59B27]">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={`home-rev-${r.id}-star-${i}`} className="w-3.5 h-3.5 fill-[#C59B27]" />
                  ))}
                </div>
                <h4 className="font-cinzel text-sm font-bold text-[#1E1A17]">{r.title}</h4>
                <p className="text-xs text-[#5E5043] font-sans-ui leading-relaxed line-clamp-3">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#1E1A17]">{r.author}</p>
                  <p className="text-[10px] text-[#8C7A6B]">{r.location}</p>
                </div>
                <span className="text-[9.5px] text-[#0A7B54] bg-[#EAF5EF] px-2 py-0.5 rounded-full font-medium">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
