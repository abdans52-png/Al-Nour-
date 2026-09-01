import React, { useMemo } from 'react';
import { ScreenType } from '../types';
import { Logo } from './Logo';
import { useSiteContent } from '../context/SiteContentContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Compass,
  History,
  ArrowRight,
  ArrowLeft,
  Ruler,
  ShoppingBag,
  Package,
  HelpCircle,
  Heart,
  Star,
  Layers,
  Check,
  User,
  Clock,
  Shirt,
  Info
} from 'lucide-react';
import { hapticLight } from '../utils/haptics';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
  currentScreen?: ScreenType;
  lastVisitedScreen?: ScreenType | null;
  screenHistory?: ScreenType[];
}

interface QuickLinkItem {
  id: string;
  label: string;
  subtitle: string;
  screen: ScreenType;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  isReturn?: boolean;
}

// Friendly human labels for screens
const SCREEN_LABELS: Record<ScreenType, string> = {
  home: 'Home',
  shop: 'Collections Catalog',
  'product-detail': 'Product Details',
  cart: 'Shopping Bag',
  collections: 'Curated Collections',
  'shop-the-look': 'Shop The Look',
  'order-success': 'Order Confirmed',
  'order-failed': 'Payment Status',
  about: 'Brand Heritage',
  reviews: 'Client Reviews',
  faq: 'Help & FAQ',
  contact: 'Customer Concierge',
  'size-guide': 'Size & Length Guide',
  shipping: 'Shipping & Delivery',
  returns: 'Returns & Exchanges',
  'track-order': 'Track Order',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  profile: 'Client Account',
  wishlist: 'Curated Wishlist',
  pakistani: 'Pakistani Festive',
  abayas: 'Haute Abayas',
  hijabs: 'Silk Hijabs',
  'modest-wear': 'Modest Wear',
  accessories: 'Fine Jewelry',
  bags: 'Handcrafted Bags',
  'new-arrivals': 'New Arrivals',
  sale: 'Private Sale',
  admin: 'Admin Backend Suite'
};

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  currentScreen = 'home',
  lastVisitedScreen = null,
  screenHistory = []
}) => {
  // Compute dynamic smart quick links based on last visited screen and active screen
  const dynamicLinks = useMemo<QuickLinkItem[]>(() => {
    const referenceScreen = lastVisitedScreen || currentScreen;

    // 1. If coming from or on shopping/product discovery
    if (
      referenceScreen === 'product-detail' ||
      referenceScreen === 'shop' ||
      referenceScreen === 'pakistani' ||
      referenceScreen === 'abayas' ||
      referenceScreen === 'hijabs' ||
      referenceScreen === 'modest-wear' ||
      referenceScreen === 'accessories' ||
      referenceScreen === 'bags' ||
      referenceScreen === 'new-arrivals' ||
      referenceScreen === 'sale'
    ) {
      return [
        {
          id: 'size-guide-smart',
          label: 'Modest Size & Length Guide',
          subtitle: 'Find your tailored drape (52"–60" & XS–XXL)',
          screen: 'size-guide',
          icon: Ruler,
          tag: 'Sizing Aid'
        },
        {
          id: 'shop-the-look-smart',
          label: 'Shop The Look Bundles',
          subtitle: 'Pre-styled outfits with matching hijabs (15% off)',
          screen: 'shop-the-look',
          icon: Sparkles,
          tag: 'Curated Set'
        },
        {
          id: 'reviews-smart',
          label: 'Verified Client Reviews',
          subtitle: 'Real photos, fabric drape ratings & feedback',
          screen: 'reviews',
          icon: Star,
          tag: '4.9★ Rated'
        },
        {
          id: 'cart-smart',
          label: 'View Shopping Bag',
          subtitle: 'Review selected haute couture pieces',
          screen: 'cart',
          icon: ShoppingBag,
          tag: 'Checkout'
        },
        {
          id: 'track-order-smart',
          label: 'Track an Existing Shipment',
          subtitle: 'DHL & FedEx global priority tracking',
          screen: 'track-order',
          icon: Package,
          tag: 'Courier'
        }
      ];
    }

    // 2. If coming from or on Cart / Order Success / Checkout
    if (referenceScreen === 'cart' || referenceScreen === 'order-success') {
      return [
        {
          id: 'shipping-smart',
          label: 'Shipping & Delivery Timelines',
          subtitle: 'Complimentary priority DHL & FedEx express',
          screen: 'shipping',
          icon: Truck,
          tag: '3-5 Days'
        },
        {
          id: 'returns-smart',
          label: '14-Day Returns & Exchanges',
          subtitle: 'Complimentary size swaps & concierge support',
          screen: 'returns',
          icon: RotateCcw,
          tag: 'Hassle-Free'
        },
        {
          id: 'track-order-smart',
          label: 'Live Order Tracking',
          subtitle: 'Real-time consignment status & alerts',
          screen: 'track-order',
          icon: Package,
          tag: 'Live Status'
        },
        {
          id: 'contact-smart',
          label: 'WhatsApp Concierge Support',
          subtitle: 'Direct guidance on payments & sizing (+919326294187)',
          screen: 'contact',
          icon: MessageCircle,
          tag: 'Instant'
        },
        {
          id: 'new-arrivals-smart',
          label: 'Discover New Season Releases',
          subtitle: 'Continue browsing fresh haute couture',
          screen: 'new-arrivals',
          icon: Sparkles,
          tag: 'New In'
        }
      ];
    }

    // 3. If coming from or on Profile / Order Tracking / Wishlist
    if (referenceScreen === 'profile' || referenceScreen === 'track-order' || referenceScreen === 'wishlist') {
      return [
        {
          id: 'shop-smart',
          label: 'Explore Haute Catalog',
          subtitle: 'Browse 100+ zardozi, lawn & silk designs',
          screen: 'shop',
          icon: ShoppingBag,
          tag: 'All Items'
        },
        {
          id: 'faq-smart',
          label: 'Frequently Asked Questions',
          subtitle: 'Bespoke tailoring, customs & garment care',
          screen: 'faq',
          icon: HelpCircle,
          tag: 'Knowledge'
        },
        {
          id: 'contact-smart',
          label: 'Atelier Bridal & Bespoke Concierge',
          subtitle: 'Schedule a consultation at Bandra West salon',
          screen: 'contact',
          icon: MessageCircle,
          tag: 'Bespoke'
        },
        {
          id: 'size-guide-smart',
          label: 'Precision Size & Length Advisor',
          subtitle: 'Anthropometric fit engine & chart',
          screen: 'size-guide',
          icon: Ruler,
          tag: 'Advisor'
        },
        {
          id: 'about-smart',
          label: 'Maison Heritage & Philosophy',
          subtitle: 'The Two Lights: Tradition & Modernity',
          screen: 'about',
          icon: Compass,
          tag: 'Heritage'
        }
      ];
    }

    // 4. If coming from or on Information / Brand / Legal / Care
    if (
      referenceScreen === 'about' ||
      referenceScreen === 'faq' ||
      referenceScreen === 'contact' ||
      referenceScreen === 'shipping' ||
      referenceScreen === 'returns' ||
      referenceScreen === 'privacy' ||
      referenceScreen === 'terms'
    ) {
      return [
        {
          id: 'abayas-smart',
          label: 'Haute Abayas (52"–60")',
          subtitle: 'Floor-length modest drapes in Korean Nida',
          screen: 'abayas',
          icon: Shirt,
          tag: 'Signature'
        },
        {
          id: 'pakistani-smart',
          label: 'Pakistani Festive & Peshwas',
          subtitle: 'Hand-embroidered zardozi & royal velvets',
          screen: 'pakistani',
          icon: Sparkles,
          tag: 'Festive'
        },
        {
          id: 'size-guide-smart',
          label: 'Modest Sizing & Length Guide',
          subtitle: 'Cross-check length & chest ease for perfect fit',
          screen: 'size-guide',
          icon: Ruler,
          tag: 'Fit Guide'
        },
        {
          id: 'shop-the-look-smart',
          label: 'Curated Ensemble Looks',
          subtitle: 'Coordinated abaya, hijab & clutch pairings',
          screen: 'shop-the-look',
          icon: Layers,
          tag: 'Complete Look'
        },
        {
          id: 'shop-smart',
          label: 'Explore Complete Collection',
          subtitle: 'Browse all bespoke couture creations',
          screen: 'shop',
          icon: ShoppingBag,
          tag: 'Catalog'
        }
      ];
    }

    // 5. Default / Home Atelier
    return [
      {
        id: 'new-arrivals-smart',
        label: 'New Season Haute Festive 2026',
        subtitle: 'Freshly unveiled artisanal suits & abayas',
        screen: 'new-arrivals',
        icon: Sparkles,
        tag: 'New Season'
      },
      {
        id: 'shop-the-look-smart',
        label: 'Shop The Look Bundles',
        subtitle: 'Curated modest ensembles with 15% VIP savings',
        screen: 'shop-the-look',
        icon: Layers,
        tag: '15% Off'
      },
      {
        id: 'abayas-smart',
        label: 'Haute Abayas (52"–60")',
        subtitle: 'Signature Korean Nida & pearl-trimmed drapes',
        screen: 'abayas',
        icon: Shirt,
        tag: 'Bestseller'
      },
      {
        id: 'size-guide-smart',
        label: 'Modest Size & Length Guide',
        subtitle: 'Interactive fit calculator for every height',
        screen: 'size-guide',
        icon: Ruler,
        tag: 'Sizing'
      },
      {
        id: 'track-order-smart',
        label: 'Track Your Consignment',
        subtitle: 'Check real-time DHL Express delivery status',
        screen: 'track-order',
        icon: Package,
        tag: 'Tracking'
      }
    ];
  }, [currentScreen, lastVisitedScreen]);

  const { siteContent } = useSiteContent();

  const handleLinkClick = (screen: ScreenType) => {
    hapticLight();
    onNavigate(screen);
  };

  const lastVisitedLabel = lastVisitedScreen ? SCREEN_LABELS[lastVisitedScreen] : null;
  const currentLabel = SCREEN_LABELS[currentScreen] || 'Current View';

  // Filter recent browsing trail to avoid duplicates of current screen
  const recentTrail = useMemo(() => {
    if (!screenHistory || screenHistory.length <= 1) return [];
    return screenHistory.filter((s) => s !== currentScreen).slice(-4);
  }, [screenHistory, currentScreen]);

  return (
    <footer
      id="al-noureen-main-footer"
      className="w-full bg-[#151210] text-[#EFEBE4] border-t border-[#C59B27]/40 pt-12 pb-10 select-none"
    >
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 border-b border-[#C59B27]/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="flex items-center sm:items-start gap-3.5 p-3 rounded-2xl bg-[#1C1814]/70 border border-[#C59B27]/20">
            <div className="w-9 h-9 rounded-xl bg-[#28221C] border border-[#C59B27]/30 flex items-center justify-center text-[#E8D59E] shrink-0">
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div>
              <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-wider">
                Authentic Artisan Craft
              </h4>
              <p className="text-[11px] text-[#A69788] mt-0.5 leading-snug">
                Over 140 hours of hand-guided zardozi & pure silk weaves.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5 p-3 rounded-2xl bg-[#1C1814]/70 border border-[#C59B27]/20">
            <div className="w-9 h-9 rounded-xl bg-[#28221C] border border-[#C59B27]/30 flex items-center justify-center text-[#E8D59E] shrink-0">
              <Truck className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div>
              <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-wider">
                Global Express Courier
              </h4>
              <p className="text-[11px] text-[#A69788] mt-0.5 leading-snug">
                Complimentary priority delivery via DHL & FedEx Priority.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5 p-3 rounded-2xl bg-[#1C1814]/70 border border-[#C59B27]/20">
            <div className="w-9 h-9 rounded-xl bg-[#28221C] border border-[#C59B27]/30 flex items-center justify-center text-[#E8D59E] shrink-0">
              <RotateCcw className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div>
              <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-wider">
                14-Day Returns & Exchanges
              </h4>
              <p className="text-[11px] text-[#A69788] mt-0.5 leading-snug">
                Seamless size exchanges & dedicated styling advice.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5 p-3 rounded-2xl bg-[#1C1814]/70 border border-[#C59B27]/20">
            <div className="w-9 h-9 rounded-xl bg-[#28221C] border border-[#C59B27]/30 flex items-center justify-center text-[#E8D59E] shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div>
              <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-wider">
                Secured Direct Checkout
              </h4>
              <p className="text-[11px] text-[#A69788] mt-0.5 leading-snug">
                256-Bit SSL Encryption & Worldwide Buyer Protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Contextual Smart Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1E1915] via-[#26201B] to-[#1E1915] border border-[#C59B27]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shrink-0">
              <Compass className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-cinzel text-xs sm:text-sm font-bold text-[#E8D59E] tracking-wider uppercase">
                  Intuitive Journey Navigation
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C59B27]/20 text-[#F5D77F] border border-[#C59B27]/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" />
                  {lastVisitedLabel
                    ? `Adapted from: ${lastVisitedLabel}`
                    : `Browsing: ${currentLabel}`}
                </span>
              </div>
              <p className="text-[11px] text-[#A69788] mt-0.5">
                Quick shortcuts tailored dynamically to your shopping & styling flow.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons: Return to previous screen if exists */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {lastVisitedScreen && lastVisitedScreen !== currentScreen && (
              <button
                type="button"
                id="footer-return-previous-btn"
                onClick={() => handleLinkClick(lastVisitedScreen)}
                className="px-3 py-1.5 bg-[#2B231D] hover:bg-[#3D332A] text-[#E8D59E] border border-[#C59B27]/60 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Return to {lastVisitedLabel}</span>
              </button>
            )}

            {/* Quick Size Guide CTA */}
            <button
              type="button"
              id="footer-quick-size-guide-btn"
              onClick={() => handleLinkClick('size-guide')}
              className="px-3 py-1.5 bg-[#181411] hover:bg-[#25201A] text-[#C5BAAC] hover:text-[#E8D59E] border border-[#3D352D] hover:border-[#C59B27]/60 rounded-xl text-xs font-cinzel flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Size Guide</span>
            </button>
          </div>
        </div>

        {/* Browsing Trail Breadcrumb Chips */}
        {recentTrail.length > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] text-[#A69788] px-1">
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase text-[#C59B27]">
              <History className="w-3 h-3" /> Recent trail:
            </span>
            {recentTrail.map((screenId, idx) => (
              <React.Fragment key={`trail-${screenId}-${idx}`}>
                <button
                  type="button"
                  onClick={() => handleLinkClick(screenId)}
                  className="px-2.5 py-0.5 rounded-lg bg-[#1E1915] hover:bg-[#2B231D] text-[#C5BAAC] hover:text-[#E8D59E] border border-[#3D352D] hover:border-[#C59B27]/50 transition-all font-sans-ui text-[11px] cursor-pointer"
                >
                  {SCREEN_LABELS[screenId]}
                </button>
                {idx < recentTrail.length - 1 && <span className="text-[#5A4D40]">&rarr;</span>}
              </React.Fragment>
            ))}
            <span className="text-[#5A4D40]">&rarr;</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#C59B27]/20 text-[#E8D59E] border border-[#C59B27]/40 font-semibold font-sans-ui text-[11px]">
              {currentLabel} (Active)
            </span>
          </div>
        )}
      </div>

      {/* Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Column 1-2: Brand Philosophy & Origin */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Logo variant="inline" showTagline={false} />
            </div>
            <p className="text-xs text-[#C5BAAC] leading-relaxed max-w-sm">
              {siteContent.footerAbout || (
                <>
                  <strong className="text-[#E8D59E]">Al-Noureen (النورين)</strong> means <span className="italic">“The Two Lights”</span>. The two lights illuminate the divine balance between <strong>tradition and modernity</strong>, <strong>modesty and elegance</strong>, and <strong>timeless heritage with contemporary haute couture</strong>.
                </>
              )}
            </p>
            <p className="text-[11px] text-[#9E8E7C] font-sans-ui">
              {siteContent.footerTagline || 'Designed with bespoke dignity for the modern global woman.'}
            </p>

            {/* Atelier Locations */}
            <div className="pt-2 text-[11px] text-[#A69788] space-y-1">
              <p>📍 <strong>Head Atelier & Flagship:</strong> {siteContent.footerAddress || 'Bandra West, Mumbai, Maharashtra 400050, India'}</p>
              <p>📍 <strong>Headquarters:</strong> Mumbai, Maharashtra, India</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${(siteContent.footerWhatsappNumber || siteContent.whatsappNumber || '+919326294187').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#28221C] hover:bg-[#25D366] hover:text-white text-[#E8D59E] border border-[#C59B27]/40 flex items-center justify-center transition-colors"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={siteContent.footerInstagramUrl || 'https://instagram.com/alnoureen.couture'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#28221C] hover:bg-[#C59B27] hover:text-[#181411] text-[#E8D59E] border border-[#C59B27]/40 flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteContent.footerFacebookUrl || 'https://facebook.com/alnoureen.couture'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#28221C] hover:bg-[#C59B27] hover:text-[#181411] text-[#E8D59E] border border-[#C59B27]/40 flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              {siteContent.footerYoutubeUrl && (
                <a
                  href={siteContent.footerYoutubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#28221C] hover:bg-[#FF0000] hover:text-white text-[#E8D59E] border border-[#C59B27]/40 flex items-center justify-center transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 3-4: DYNAMIC QUICK LINKS (Adaptive Menu) */}
          <div
            id="footer-dynamic-quick-links"
            className="lg:col-span-2 space-y-3 bg-[#1C1814]/90 p-4 sm:p-5 rounded-2xl border border-[#C59B27]/40 shadow-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#C59B27]/30 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27] animate-pulse" />
                <h5 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-widest">
                  Dynamic Quick Links
                </h5>
              </div>
              <span className="text-[9px] font-mono uppercase bg-[#C59B27]/20 text-[#E8D59E] px-2 py-0.5 rounded-full border border-[#C59B27]/30">
                Adaptive Menu
              </span>
            </div>

            <p className="text-[11px] text-[#A69788] leading-tight">
              Curated navigation suggestions based on your active path:
            </p>

            {/* Dynamic Items List */}
            <div className="space-y-2 pt-1">
              {dynamicLinks.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={`dyn-link-${item.id}-${item.screen}-${idx}`}
                    type="button"
                    onClick={() => handleLinkClick(item.screen)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#241F1A] hover:bg-[#2F2821] border border-[#3D352D] hover:border-[#C59B27]/60 transition-all flex items-center justify-between gap-3 group cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#181411] border border-[#C59B27]/30 flex items-center justify-center text-[#C59B27] group-hover:text-[#E8D59E] group-hover:scale-105 transition-all shrink-0">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-xs font-semibold text-[#FAF7F2] group-hover:text-[#E8D59E] transition-colors truncate">
                            {item.label}
                          </span>
                          {item.tag && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#C59B27]/15 text-[#E8D59E] rounded border border-[#C59B27]/30 shrink-0">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#A69788] truncate font-sans-ui">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-[#6B5E52] group-hover:text-[#E8D59E] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Category Quick Chips */}
            <div className="pt-2 border-t border-[#3D352D]">
              <span className="text-[10px] font-mono uppercase text-[#A69788] block mb-1.5">
                Quick Category Jump:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleLinkClick('pakistani')}
                  className="px-2 py-0.5 rounded-md bg-[#181411] hover:bg-[#C59B27] hover:text-[#181411] text-[#C5BAAC] border border-[#3D352D] text-[10px] font-cinzel transition-colors cursor-pointer"
                >
                  Pakistani
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('abayas')}
                  className="px-2 py-0.5 rounded-md bg-[#181411] hover:bg-[#C59B27] hover:text-[#181411] text-[#C5BAAC] border border-[#3D352D] text-[10px] font-cinzel transition-colors cursor-pointer"
                >
                  Abayas
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('hijabs')}
                  className="px-2 py-0.5 rounded-md bg-[#181411] hover:bg-[#C59B27] hover:text-[#181411] text-[#C5BAAC] border border-[#3D352D] text-[10px] font-cinzel transition-colors cursor-pointer"
                >
                  Hijabs
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('modest-wear')}
                  className="px-2 py-0.5 rounded-md bg-[#181411] hover:bg-[#C59B27] hover:text-[#181411] text-[#C5BAAC] border border-[#3D352D] text-[10px] font-cinzel transition-colors cursor-pointer"
                >
                  Modest Wear
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('shop-the-look')}
                  className="px-2 py-0.5 rounded-md bg-[#181411] hover:bg-[#C59B27] hover:text-[#181411] text-[#E8D59E] border border-[#C59B27]/40 text-[10px] font-cinzel transition-colors cursor-pointer"
                >
                  Bundles
                </button>
              </div>
            </div>
          </div>

          {/* Column 5: Collections */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-widest border-b border-[#C59B27]/30 pb-1.5">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-[#C5BAAC]">
              <li>
                <button onClick={() => handleLinkClick('pakistani')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Pakistani Formal & Festive
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('abayas')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Haute Abayas (52"–60")
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('hijabs')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Pure Silk & Modal Hijabs
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('modest-wear')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Modest Dresses & Co-ords
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('accessories')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  18k Jewelry & Hijab Pins
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('bags')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Handmade Potlis & Clutches
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('shop-the-look')} className="text-[#E8D59E] font-semibold flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-3 h-3 text-[#C59B27]" /> Shop The Look
                </button>
              </li>
            </ul>
          </div>

          {/* Column 6: Maison & Client Concierge */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-xs font-bold text-[#E8D59E] uppercase tracking-widest border-b border-[#C59B27]/30 pb-1.5">
              Client Concierge
            </h5>
            <ul className="space-y-2 text-xs text-[#C5BAAC]">
              <li>
                <button onClick={() => handleLinkClick('track-order')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('shipping')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Shipping & Global Timelines
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('returns')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Returns & Size Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('size-guide')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Modest Size & Length Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('faq')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Help & Frequently Asked
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('contact')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  Atelier Concierge & Bridal
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-[#E8D59E] transition-colors cursor-pointer text-left">
                  About AL NOUREEN by Nasreen (النورين)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('admin' as ScreenType)}
                  className="text-[#C59B27] hover:text-[#E8D59E] transition-colors cursor-pointer text-left flex items-center gap-1 font-mono text-[11px] pt-1"
                >
                  <span>⚙️ Admin Backend Suite</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#C59B27]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8C7A6B]">
        <p>
          {siteContent.footerCopyright || `© ${new Date().getFullYear()} AL NOUREEN by Nasreen. All Rights Reserved. Handcrafted in Mumbai.`}
        </p>
        {siteContent.footerShowPaymentBadges !== false && (
          <div className="flex items-center gap-3 text-[#A69788] flex-wrap justify-center font-mono text-[9px]">
            <span className="px-2.5 py-0.5 bg-[#201B17] border border-[#C59B27]/30 text-[#E8D59E] rounded">256-BIT SSL ENCRYPTED</span>
            <span className="px-2.5 py-0.5 bg-[#201B17] border border-[#C59B27]/30 text-[#E8D59E] rounded">AUTHENTICATED ATELIER CHECKOUT</span>
            <span className="px-2.5 py-0.5 bg-[#201B17] border border-[#C59B27]/30 text-[#E8D59E] rounded">INSURED DHL COURIER</span>
          </div>
        )}
      </div>
    </footer>
  );
};
