import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Star,
  CheckCircle2,
  Maximize2,
  X,
  ShoppingBag,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ScreenType, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess } from '../utils/haptics';

export interface VideoTestimonial {
  id: string;
  customerName: string;
  location: string;
  role: string;
  avatar: string;
  occasion: 'Bridal & Nikkah' | 'Festive Eid' | 'Luxury Abayas' | 'Evening Gala';
  rating: number;
  headline: string;
  reviewText: string;
  videoUrl: string;
  posterImage: string;
  duration: string;
  featuredProduct: {
    name: string;
    category: string;
    price: number;
    image: string;
    linkScreen: ScreenType;
  };
  highlights: string[];
}

interface VideoTestimonialsSectionProps {
  onNavigate: (screen: ScreenType) => void;
  currency?: Currency;
}

const TESTIMONIALS_DATA: VideoTestimonial[] = [
  {
    id: 'vid-1',
    customerName: 'Dr. Aaliyah Khan-Siddiqui',
    location: 'Mayfair, London, UK',
    role: 'Verified Atelier Bride',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    occasion: 'Bridal & Nikkah',
    rating: 5,
    headline: 'The hand Zardozi craftsmanship took everyone’s breath away at my Nikkah',
    reviewText:
      'I ordered the Noor-e-Kashmir bespoke velvet ensemble from London. The weight of the pure silk velvet, the 3D gold zari needlework, and the sheer modest elegance surpassed Parisian couture houses. AL-NOUREEN made me feel like royalty.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
    duration: '0:38',
    featuredProduct: {
      name: 'Noor-e-Kashmir Velvet Gharara Set',
      category: 'Pakistani Haute Couture',
      price: 28500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=85',
      linkScreen: 'pakistani'
    },
    highlights: ['0:06 - Close up of 24k gold bullion embroidery', '0:18 - Full 360-degree modest flare rotation', '0:29 - Scalloped zari dupatta drape']
  },
  {
    id: 'vid-2',
    customerName: 'Mariam Al-Mansoor',
    location: 'Jumeirah, Dubai, UAE',
    role: 'Modest Fashion Stylist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    occasion: 'Luxury Abayas',
    rating: 5,
    headline: 'The most fluid French Crepe drape in my entire modest wardrobe',
    reviewText:
      'Living in Dubai, I look for abayas that have structural dignity without being heavy. The midnight noir silk-crepe with hand-cut crystal piping feels effortless from boardroom meetings to five-star dinner soirees.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterImage: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=85',
    duration: '0:42',
    featuredProduct: {
      name: 'Royal Midnight French Crepe Abaya',
      category: 'Luxury Abayas',
      price: 14500,
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=600&q=85',
      linkScreen: 'abayas'
    },
    highlights: ['0:04 - Natural drape & flow test', '0:14 - Hidden modest magnetic clasp demonstration', '0:31 - Sleeve cuff gemstone detailing']
  },
  {
    id: 'vid-3',
    customerName: 'Zainab & Fatima Parvez',
    location: 'South Mumbai, India',
    role: 'Festive Connoisseurs',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    occasion: 'Festive Eid',
    rating: 5,
    headline: 'Matching Mother-Daughter Eid ensembles made to perfection',
    reviewText:
      'We visited the Mumbai Atelier for our custom Eid measurements. The master karigars treated us with so much hospitality. The blush rose tissue organza was completely non-sheer yet featherlight in the summer heat.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    posterImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
    duration: '0:32',
    featuredProduct: {
      name: 'Gul-e-Rana Tissue Organza Anarkali',
      category: 'Festive Collection',
      price: 22800,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=85',
      linkScreen: 'pakistani'
    },
    highlights: ['0:05 - Floor-length kalidar flare showcase', '0:15 - Real client unboxing experience in bespoke gold box', '0:26 - Hand-twisted zardozi tassels']
  },
  {
    id: 'vid-4',
    customerName: 'Sana Hashmi',
    location: 'Toronto, Ontario, Canada',
    role: 'Editorial Creative Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    occasion: 'Evening Gala',
    rating: 5,
    headline: 'International express shipping arrived in 4 days with museum-grade packaging',
    reviewText:
      'I was nervous ordering high jewelry and a raw silk kaftan across the world to Canada. The live tracking was pinpoint accurate, and the garment arrived steamed, sealed with security wax, and fitting my exact shoulder width.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    posterImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85',
    duration: '0:45',
    featuredProduct: {
      name: 'Maharani Raw Silk Royal Kaftan',
      category: 'Haute Modest Couture',
      price: 19500,
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=85',
      linkScreen: 'abayas'
    },
    highlights: ['0:08 - Real daylight luster of raw silk', '0:22 - Walking comfort in high heels', '0:35 - Hand-carved brass buttons']
  }
];

export const VideoTestimonialsSection: React.FC<VideoTestimonialsSectionProps> = ({
  onNavigate,
  currency = 'INR'
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const categories = ['All', 'Bridal & Nikkah', 'Luxury Abayas', 'Festive Eid', 'Evening Gala'];

  const filteredTestimonials = activeFilter === 'All'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter((t) => t.occasion === activeFilter);

  const toggleInlinePlay = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    hapticLight();
    const vid = videoRefs.current[id];
    if (!vid) return;

    if (playingId === id) {
      vid.pause();
      setPlayingId(null);
    } else {
      // Pause any previously playing video
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]?.pause();
      }
      vid.play().catch(() => {});
      setPlayingId(id);
    }
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    hapticSuccess();
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openFullscreenModal = (testimonial: VideoTestimonial) => {
    hapticLight();
    // Pause any inline playing video
    if (playingId && videoRefs.current[playingId]) {
      videoRefs.current[playingId]?.pause();
      setPlayingId(null);
    }
    setSelectedVideo(testimonial);
  };

  return (
    <section id="section-video-testimonials" className="space-y-8 pt-6">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F0EAE0] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#8C6B1B] uppercase tracking-widest font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Real Stories & Live Draping
        </div>

        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E1A17]">
          Customer Video Testimonials
        </h2>

        <p className="text-xs sm:text-sm text-[#6E6053] font-sans-ui leading-relaxed">
          Watch real women around the globe experiencing AL-NOUREEN's exquisite hand embroidery, modest fluid silhouettes, and luxury bespoke fit.
        </p>

        <div className="w-16 h-0.5 bg-[#C59B27] mx-auto pt-1" />
      </div>

      {/* Occasion Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 px-2">
        {categories.map((cat, cIdx) => (
          <button
            key={`vid-test-cat-${cat}-${cIdx}`}
            onClick={() => {
              hapticLight();
              setActiveFilter(cat);
            }}
            className={`px-4 py-2 rounded-full text-xs font-cinzel tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === cat
                ? 'bg-[#181411] text-[#E8D59E] font-bold shadow-md border border-[#C59B27]/50 scale-102'
                : 'bg-[#F0EAE0] text-[#54463A] border border-[#DDD3BC] hover:bg-[#E5DDD0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTestimonials.map((item, itemIdx) => {
          const isPlaying = playingId === item.id;
          const isLiked = !!likedVideos[item.id];

          return (
            <div
              key={`vid-test-card-${item.id}-${itemIdx}`}
              onClick={() => openFullscreenModal(item)}
              className="group bg-white rounded-3xl border border-[#E0D5BE] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
            >
              {/* Video Thumbnail Frame */}
              <div className="relative aspect-9/16 bg-[#181411] overflow-hidden">
                <video
                  ref={(el) => (videoRefs.current[item.id] = el)}
                  src={item.videoUrl}
                  poster={item.posterImage}
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181411]/90 via-transparent to-[#181411]/40 pointer-events-none" />

                {/* Top Badges: Occasion Tag & Like Button */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-[#E8D59E] text-[10px] font-cinzel font-bold rounded-full border border-[#C59B27]/40 shadow-xs">
                    {item.occasion}
                  </span>

                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-xs text-white hover:text-[#E8D59E] transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#E8D59E] text-[#E8D59E]' : ''}`} />
                  </button>
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <button
                    onClick={(e) => toggleInlinePlay(item.id, e)}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-[#181411]/80 backdrop-blur-md border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shadow-lg transform group-hover:scale-110 transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Bottom Video Meta: Customer info & headline */}
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.avatar}
                      alt={item.customerName}
                      className="w-7 h-7 rounded-full object-cover border border-[#C59B27]"
                    />
                    <div className="min-w-0">
                      <p className="font-cinzel text-xs font-bold text-white truncate flex items-center gap-1">
                        {item.customerName}
                        <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0" />
                      </p>
                      <p className="text-[10px] text-[#C5BAAC] flex items-center gap-0.5 truncate">
                        <MapPin className="w-2.5 h-2.5 text-[#C59B27] shrink-0" /> {item.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#C59B27]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={`item-star-${item.id}-${i}`} className="w-2.5 h-2.5 fill-[#C59B27]" />
                    ))}
                    <span className="text-[9.5px] text-[#E8D59E] font-mono ml-1 font-bold">5.0</span>
                  </div>

                  <p className="text-[11px] font-sans-ui text-[#FAF7F2] font-medium line-clamp-2 leading-snug">
                    "{item.headline}"
                  </p>
                </div>
              </div>

              {/* Bottom Featured Product Mini Pill */}
              <div className="p-3.5 bg-[#FAF7F2] border-t border-[#E8DFC8] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.featuredProduct.image}
                    alt={item.featuredProduct.name}
                    className="w-9 h-11 rounded-lg object-cover border border-[#DDD3BC] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-[#8C6B1B] font-mono block">
                      Featured Piece
                    </span>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1A17] truncate">
                      {item.featuredProduct.name}
                    </h4>
                    <span className="font-cinzel text-[11px] font-bold text-[#1E1A17]">
                      {formatPrice(item.featuredProduct.price, currency)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    hapticLight();
                    onNavigate(item.featuredProduct.linkScreen);
                  }}
                  className="p-2 rounded-xl bg-[#181411] text-[#E8D59E] hover:bg-[#28221D] transition-colors shrink-0 cursor-pointer shadow-2xs"
                  title="View Ensemble"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Invite Callout Banner */}
      <div className="bg-[#181411] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#C59B27]/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[10.5px] font-mono text-[#E8D59E] uppercase font-bold">
            <Sparkles className="w-3 h-3 text-[#C59B27]" /> Join the #AlNoureenDrape Gallery
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            Share Your AL-NOUREEN Moment
          </h3>
          <p className="text-xs text-[#C5BAAC] font-sans-ui leading-relaxed">
            Record a short styling clip or festive celebration video in your AL-NOUREEN ensemble. Featured clients receive an exclusive <strong>₹2,500 / $30 Atelier Haute Gift Voucher</strong>.
          </p>
        </div>

        <a
          href="https://wa.me/919326294187?text=Hello%20Maison%20AL-NOUREEN,%20I%20would%20like%20to%20submit%20my%20styling%20video%20for%20the%20Client%20Gallery!"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#1EBE5B] text-white rounded-xl font-cinzel font-bold text-xs tracking-wider transition-all whitespace-nowrap shadow-md flex items-center justify-center gap-2 cursor-pointer z-10 shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white" /> Submit Video via WhatsApp
        </a>
      </div>

      {/* Fullscreen Video Modal Player */}
      {selectedVideo && (
        <div
          id="modal-video-testimonial-player"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-[#181411] text-[#FAF7F2] w-full max-w-4xl rounded-3xl border border-[#C59B27]/50 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Video Player Area */}
            <div className="relative md:w-3/5 bg-black flex items-center justify-center aspect-9/16 md:aspect-auto">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.posterImage}
                controls
                autoPlay
                className="w-full h-full object-cover md:object-contain max-h-[70vh] md:max-h-[85vh]"
              />

              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 left-4 md:hidden p-2 rounded-full bg-black/60 text-white z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Client Review & Featured Garment Details */}
            <div className="md:w-2/5 p-6 overflow-y-auto flex flex-col justify-between space-y-6 bg-[#1F1A15] border-t md:border-t-0 md:border-l border-[#C59B27]/30">
              <div className="space-y-5">
                {/* Header & Close for Desktop */}
                <div className="flex items-center justify-between pb-3 border-b border-[#383028]">
                  <span className="px-3 py-1 bg-[#28221D] text-[#E8D59E] border border-[#C59B27]/40 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider">
                    {selectedVideo.occasion}
                  </span>

                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="hidden md:flex p-1.5 rounded-full text-[#A69788] hover:text-white hover:bg-[#28221D] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Customer Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={selectedVideo.avatar}
                    alt={selectedVideo.customerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C59B27]"
                  />
                  <div>
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                      {selectedVideo.customerName}
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    </h3>
                    <p className="text-xs text-[#C5BAAC] font-sans-ui flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C59B27]" /> {selectedVideo.location}
                    </p>
                    <span className="text-[10px] font-mono text-[#E8D59E] uppercase tracking-wider">
                      {selectedVideo.role}
                    </span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1.5 text-[#C59B27]">
                  {[...Array(selectedVideo.rating)].map((_, i) => (
                    <Star key={`video-modal-star-${selectedVideo.id}-${i}`} className="w-3.5 h-3.5 fill-[#C59B27]" />
                  ))}
                  <span className="text-xs text-[#E8D59E] font-mono font-bold ml-1">5.0 / 5.0 Rating</span>
                </div>

                {/* Quote review */}
                <div className="space-y-2">
                  <h4 className="font-cinzel text-sm font-bold text-[#FAF7F2] leading-snug">
                    "{selectedVideo.headline}"
                  </h4>
                  <p className="text-xs text-[#C5BAAC] font-sans-ui leading-relaxed">
                    {selectedVideo.reviewText}
                  </p>
                </div>

                {/* Video Timestamp Highlights */}
                <div className="space-y-2 bg-[#28221D] p-3.5 rounded-2xl border border-[#C59B27]/30">
                  <span className="font-cinzel text-[11px] font-bold text-[#E8D59E] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#C59B27]" /> Video Highlights
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-[#C5BAAC] font-sans-ui">
                    {selectedVideo.highlights.map((hl, idx) => (
                      <li key={`video-hl-${selectedVideo.id}-${idx}`} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Featured Garment Action Card */}
              <div className="pt-4 border-t border-[#383028] space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#28221D] rounded-2xl border border-[#C59B27]/40">
                  <img
                    src={selectedVideo.featuredProduct.image}
                    alt={selectedVideo.featuredProduct.name}
                    className="w-12 h-14 rounded-xl object-cover border border-[#C59B27]/40"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-[#C59B27]">
                      Featured In Video
                    </span>
                    <h5 className="font-cinzel text-xs font-bold text-white truncate">
                      {selectedVideo.featuredProduct.name}
                    </h5>
                    <p className="font-cinzel text-xs font-bold text-[#E8D59E]">
                      {formatPrice(selectedVideo.featuredProduct.price, currency)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedVideo(null);
                    onNavigate(selectedVideo.featuredProduct.linkScreen);
                  }}
                  className="w-full py-3 bg-[#C59B27] hover:bg-[#D4AF37] text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> View & Shop This Ensemble
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
