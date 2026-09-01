import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Heart,
  ShoppingBag,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Tag,
  CheckCircle2,
  X,
  Share2,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess } from '../utils/haptics';

export interface CommunityStylePost {
  id: string;
  creatorHandle: string;
  creatorName: string;
  location: string;
  avatar: string;
  image: string;
  occasion: 'Pakistani Festive' | 'Haute Abayas' | 'Modest Co-ords' | 'Silk Hijabs' | 'Everyday Elegance';
  stylingQuote: string;
  stylingTip: string;
  likesCount: number;
  featuredProduct: {
    id: string;
    name: string;
    category: string;
    fabric: string;
    price: number;
    image: string;
    size: string;
    color: string;
  };
  companionItems?: Array<{
    name: string;
    category: string;
    price: number;
    image: string;
  }>;
}

interface CommunityStylingSectionProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: any, color?: string) => void;
  products: Product[];
  currency?: Currency;
}

const COMMUNITY_POSTS: CommunityStylePost[] = [
  {
    id: 'ugc-1',
    creatorHandle: '@ayesha.sid',
    creatorName: 'Ayesha Siddiqui',
    location: 'London, United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
    occasion: 'Pakistani Festive',
    stylingQuote: 'The 24-kali flare on this Emerald Zardozi suit spins like poetry in the evening lights.',
    stylingTip: 'Draped the scalloped organza dupatta over one shoulder and pinned with AL-NOUREEN’s gold magnetic pin.',
    likesCount: 1420,
    featuredProduct: {
      id: 'emerald-zardozi-anarkali-suit',
      name: 'Emerald Zardozi Anarkali Suit',
      category: 'Pakistani Haute Couture',
      fabric: 'Pure Silk Chanderi & Organza',
      price: 28500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=85',
      size: 'M',
      color: 'Emerald Green'
    },
    companionItems: [
      {
        name: 'Sage Chiffon Luxury Hijab',
        category: 'Silk Hijabs',
        price: 2450,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80'
      },
      {
        name: 'Ivory Pearl Tassel Potli',
        category: 'Luxury Bags',
        price: 4200,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'ugc-2',
    creatorHandle: '@mariam.dubai',
    creatorName: 'Mariam Al-Qasimi',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
    occasion: 'Haute Abayas',
    stylingQuote: 'French crepe with crystal wrist accents. Structured, ultra-breathable, and effortlessly modest.',
    stylingTip: 'Paired with a matching taupe modal wrap and 4-inch nude pumps for an art gallery preview.',
    likesCount: 2185,
    featuredProduct: {
      id: 'midnight-black-embroidered-abaya',
      name: 'Noor-e-Falak Embroidered Abaya',
      category: 'Luxury Abayas',
      fabric: 'Korean Nida & French Crepe',
      price: 16800,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=85',
      size: '56"',
      color: 'Midnight Noir'
    },
    companionItems: [
      {
        name: 'Calligraphy Gold Cuff Bracelet',
        category: 'Accessories',
        price: 3800,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'ugc-3',
    creatorHandle: '@zainab.modest',
    creatorName: 'Zainab Merchant',
    location: 'Toronto, Canada',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
    occasion: 'Silk Hijabs',
    stylingQuote: 'The 19mm Mulberry silk stays wrinkle-free all day without single pull pin tears.',
    stylingTip: 'Used the seamless magnetic clasp to create soft Turkish neck pleats without poking the silk.',
    likesCount: 980,
    featuredProduct: {
      id: 'rose-gold-silk-hijab',
      name: 'Gul-e-Noor Mulberry Silk Hijab',
      category: 'Hijabs',
      fabric: '100% Pure 19mm Mulberry Silk',
      price: 3400,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=85',
      size: 'One Size',
      color: 'Blush Champagne'
    },
    companionItems: [
      {
        name: 'Snag-Free Gold Hijab Magnets',
        category: 'Accessories',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'ugc-4',
    creatorHandle: '@fatima.lahore',
    creatorName: 'Fatima Malik',
    location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=85',
    occasion: 'Modest Co-ords',
    stylingQuote: 'Raw silk tailored co-ord set with asymmetric slit cut. Minimalist modest luxury at its best.',
    stylingTip: 'Styled with antique jhumkas and an embroidered velvet clutch for an intimate dinner.',
    likesCount: 1650,
    featuredProduct: {
      id: 'ivory-chikankari-peshwas',
      name: 'Ivory Chikankari Peshwas Ensemble',
      category: 'Pakistani Haute Couture',
      fabric: 'Pure Georgette & Organza',
      price: 24500,
      image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=85',
      size: 'S',
      color: 'Ivory Pearl'
    },
    companionItems: [
      {
        name: 'Emerald Cut Crystal Minaudière',
        category: 'Luxury Bags',
        price: 5900,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'ugc-5',
    creatorHandle: '@samira.ny',
    creatorName: 'Samira Bukhari',
    location: 'Manhattan, New York',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
    occasion: 'Everyday Elegance',
    stylingQuote: 'The tailored linen trousers with modest oversized blazer transition seamlessly from day to night.',
    stylingTip: 'Rolled up the cuffs slightly to show off gold bangles and paired with square-toe mules.',
    likesCount: 1890,
    featuredProduct: {
      id: 'olive-raw-silk-coord-set',
      name: 'Zaytoun Raw Silk Co-ord Set',
      category: 'Modest Wear',
      fabric: 'Pure Raw Silk & Linen Blend',
      price: 18900,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85',
      size: 'L',
      color: 'Olive Zaytoun'
    }
  }
];

export const CommunityStylingSection: React.FC<CommunityStylingSectionProps> = ({
  onSelectProduct,
  onAddToCart,
  products,
  currency = 'INR'
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<CommunityStylePost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filterTabs = [
    'All',
    'Pakistani Festive',
    'Haute Abayas',
    'Modest Co-ords',
    'Silk Hijabs',
    'Everyday Elegance'
  ];

  const filteredPosts = activeFilter === 'All'
    ? COMMUNITY_POSTS
    : COMMUNITY_POSTS.filter((p) => p.occasion === activeFilter);

  const handleScroll = (direction: 'left' | 'right') => {
    hapticLight();
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSuccess();
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (post: CommunityStylePost, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSuccess();

    // Find actual matching product in products state or build fallback
    const targetProduct = products.find((p) => p.id === post.featuredProduct.id) || {
      id: post.featuredProduct.id,
      name: post.featuredProduct.name,
      fabric: post.featuredProduct.fabric,
      price: post.featuredProduct.price,
      category: post.featuredProduct.category as any,
      images: [post.featuredProduct.image],
      description: post.stylingQuote,
      details: {
        fabricCraft: [post.featuredProduct.fabric],
        shippingReturns: 'Express Shipping Available',
        careInstructions: 'Dry clean only'
      },
      colors: [post.featuredProduct.color],
      sizes: [post.featuredProduct.size as any],
      rating: 5,
      reviewCount: 24,
      inStock: true
    };

    onAddToCart(targetProduct, post.featuredProduct.size, post.featuredProduct.color);

    setAddedItemIds((prev) => ({ ...prev, [post.id]: true }));
    setAddedToast(`Added "${post.featuredProduct.name}" to your shopping bag!`);

    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [post.id]: false }));
    }, 2000);

    setTimeout(() => {
      setAddedToast(null);
    }, 3500);
  };

  const handleOpenProduct = (post: CommunityStylePost) => {
    hapticLight();
    const targetProduct = products.find((p) => p.id === post.featuredProduct.id);
    if (targetProduct) {
      onSelectProduct(targetProduct);
    } else {
      setSelectedPost(post);
    }
  };

  return (
    <section id="section-community-styling" className="w-full py-12 sm:py-16 bg-[#FAF7F2] border-t border-[#E8DFC8]">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#181411] text-[#E8D59E] border border-[#C59B27] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-cinzel font-bold animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{addedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Title & Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F0EAE0] border border-[#C59B27]/40 rounded-full text-[10.5px] font-sans-ui text-[#8C6B1B] uppercase tracking-widest font-semibold">
              <Sparkles className="w-3 h-3 text-[#C59B27]" />
              #StyledByAlNoureen • Real Patron Looks
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E1A17]">
              Community Styling & Draping
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6053] font-sans-ui max-w-xl leading-relaxed">
              Explore how global tastemakers, brides, and patrons style our haute couture ensembles in real daylight. Tap <strong>Add to Shop</strong> to add the look directly to your cart.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-[#DDD3BC] hover:border-[#C59B27] hover:bg-[#F0EAE0] text-[#1E1A17] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous community look"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-[#DDD3BC] hover:border-[#C59B27] hover:bg-[#F0EAE0] text-[#1E1A17] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label="Next community look"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {filterTabs.map((tab, tIdx) => (
            <button
              key={`comm-filter-${tab}-${tIdx}`}
              onClick={() => {
                hapticLight();
                setActiveFilter(tab);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-cinzel tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === tab
                  ? 'bg-[#181411] text-[#E8D59E] font-bold shadow-md border border-[#C59B27]/50'
                  : 'bg-white text-[#5E5043] border border-[#DDD3BC] hover:bg-[#F0EAE0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Horizontal Scrolling Carousel Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          {filteredPosts.map((post, pIdx) => {
            const isLiked = !!likedPosts[post.id];
            const isAdded = !!addedItemIds[post.id];

            return (
              <div
                key={`comm-post-${post.id}-${pIdx}`}
                onClick={() => setSelectedPost(post)}
                className="group w-[285px] sm:w-[320px] shrink-0 bg-white rounded-3xl border border-[#E0D5BE] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col snap-start cursor-pointer hover:-translate-y-1"
              >
                {/* Visual Image Showcase */}
                <div className="relative aspect-4/5 bg-[#181411] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.featuredProduct.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Creator Badge & Like Button */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      <img
                        src={post.avatar}
                        alt={post.creatorName}
                        className="w-5 h-5 rounded-full object-cover border border-[#C59B27]"
                      />
                      <span className="text-[11px] font-mono text-white font-semibold">
                        {post.creatorHandle}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleToggleLike(post.id, e)}
                      className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-[#E8D59E] transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#E8D59E] text-[#E8D59E]' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Overlay: Occasion & Styling Quote */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white space-y-1.5 z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-cinzel font-bold text-[#E8D59E] uppercase tracking-wider bg-[#28221D]/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#C59B27]/40">
                        {post.occasion}
                      </span>
                      <span className="text-[10px] text-[#C5BAAC] flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-[#C59B27]" /> {post.location}
                      </span>
                    </div>

                    <p className="text-xs font-sans-ui text-[#FAF7F2] font-medium line-clamp-2 leading-snug">
                      "{post.stylingQuote}"
                    </p>
                  </div>
                </div>

                {/* Bottom Card Content: Featured Product & Add to Shop Action */}
                <div className="p-4 bg-[#FAF7F2] flex-1 flex flex-col justify-between space-y-3 border-t border-[#E8DFC8]">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.featuredProduct.image}
                      alt={post.featuredProduct.name}
                      className="w-12 h-14 rounded-xl object-cover border border-[#DDD3BC] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9.5px] uppercase tracking-wider font-mono text-[#8C6B1B] block">
                        Featured Piece
                      </span>
                      <h4 className="font-cinzel text-xs font-bold text-[#1E1A17] truncate">
                        {post.featuredProduct.name}
                      </h4>
                      <p className="font-cinzel text-xs font-bold text-[#8C6B1B]">
                        {formatPrice(post.featuredProduct.price, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Interactive 'Add to Shop' / Quick Add Button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      id={`btn-add-to-shop-${post.id}`}
                      onClick={(e) => handleQuickAdd(post, e)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                        isAdded
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/60 active:scale-98'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Shop</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProduct(post);
                      }}
                      className="p-2.5 rounded-xl bg-white border border-[#DDD3BC] hover:border-[#C59B27] text-[#1E1A17] hover:bg-[#F0EAE0] transition-colors cursor-pointer shrink-0"
                      title="View Details"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UGC Modal Detail View */}
      {selectedPost && (
        <div
          id="modal-ugc-detail"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-[#FAF7F2] max-w-3xl w-full rounded-3xl border border-[#C59B27]/40 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Styling Photo */}
            <div className="relative md:w-1/2 bg-[#181411] aspect-4/5 md:aspect-auto">
              <img
                src={selectedPost.image}
                alt={selectedPost.featuredProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 left-4 md:hidden p-2 rounded-full bg-black/60 text-white z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Look Breakdown & Shopping Actions */}
            <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-5">
                {/* Header with Creator & Close */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedPost.avatar}
                      alt={selectedPost.creatorName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#C59B27]"
                    />
                    <div>
                      <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#1E1A17] flex items-center gap-1">
                        {selectedPost.creatorName}
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      </h3>
                      <p className="text-[11px] font-mono text-[#8C6B1B]">
                        {selectedPost.creatorHandle} • {selectedPost.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPost(null)}
                    className="hidden md:flex p-1.5 rounded-full text-[#6E6053] hover:text-[#1E1A17] hover:bg-[#F0EAE0] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Styling Review & Tips */}
                <div className="space-y-2.5">
                  <span className="px-2.5 py-0.5 bg-[#F0EAE0] text-[#8C6B1B] border border-[#C59B27]/40 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider">
                    {selectedPost.occasion}
                  </span>
                  <p className="text-xs sm:text-sm font-sans-ui text-[#1E1A17] leading-relaxed italic">
                    "{selectedPost.stylingQuote}"
                  </p>
                  <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#DDD3BC] text-xs text-[#5E5043] space-y-1">
                    <span className="font-cinzel font-bold text-[#8C6B1B] text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#C59B27]" /> Styling Secret:
                    </span>
                    <p className="text-[11.5px] leading-relaxed">{selectedPost.stylingTip}</p>
                  </div>
                </div>

                {/* Outfit Items Breakdown */}
                <div className="space-y-3">
                  <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#1E1A17] block">
                    Outfit Breakdown
                  </span>

                  {/* Primary Featured Item */}
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#C59B27]/50 flex items-center justify-between gap-3">
                    <img
                      src={selectedPost.featuredProduct.image}
                      alt={selectedPost.featuredProduct.name}
                      className="w-12 h-14 rounded-xl object-cover border border-[#DDD3BC]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-[#8C6B1B]">
                        Main Garment • Size {selectedPost.featuredProduct.size}
                      </span>
                      <h5 className="font-cinzel text-xs font-bold text-[#1E1A17] truncate">
                        {selectedPost.featuredProduct.name}
                      </h5>
                      <p className="font-cinzel text-xs font-bold text-[#8C6B1B]">
                        {formatPrice(selectedPost.featuredProduct.price, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Companion pieces */}
                  {selectedPost.companionItems?.map((comp, idx) => (
                    <div
                      key={`comp-${selectedPost.id}-${comp.name}-${idx}`}
                      className="p-2.5 rounded-xl bg-white border border-[#E8DFC8] flex items-center justify-between gap-3 text-xs"
                    >
                      <img
                        src={comp.image}
                        alt={comp.name}
                        className="w-9 h-11 rounded-lg object-cover border border-[#DDD3BC]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono text-[#7A6B5D] uppercase">{comp.category}</span>
                        <h6 className="font-cinzel text-[11px] font-semibold text-[#1E1A17] truncate">
                          {comp.name}
                        </h6>
                        <span className="font-cinzel text-[11px] font-bold text-[#1E1A17]">
                          {formatPrice(comp.price, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Add to Bag CTA */}
              <div className="pt-4 border-t border-[#E8DFC8] space-y-2">
                <button
                  type="button"
                  onClick={(e) => {
                    handleQuickAdd(selectedPost, e);
                    setSelectedPost(null);
                  }}
                  className="w-full py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" /> Add Ensemble to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
