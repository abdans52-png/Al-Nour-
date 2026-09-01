import React, { useState, useEffect } from 'react';
import { Product, Currency, ScreenType, Order, OrderStatus } from '../types';
import { CURRENCY_RATES, formatPrice } from '../utils/currency';
import { auth, signInWithGoogle, signOutUser } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  Heart,
  Package,
  Globe,
  Shield,
  MessageCircle,
  ArrowRight,
  Trash2,
  ShoppingBag,
  Truck,
  Mail,
  ExternalLink,
  Moon,
  Sun,
  Sparkles,
  Smartphone,
  Download,
  FileText,
  CheckCircle2,
  Fingerprint,
  Copy,
  Check,
  Share2,
  Link,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ThemeRadioSlider } from '../components/ThemeRadioSlider';
import { AtelierOrderProgressTracker } from '../components/AtelierOrderProgressTracker';
import { getHapticsEnabled, setHapticsEnabled, hapticSuccess, hapticLight } from '../utils/haptics';
import { generateInvoicePdf } from '../utils/invoicePdf';

interface ProfileScreenProps {
  wishlist: Product[];
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: any) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenType) => void;
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onOpenNotificationModal?: (order: Order, triggerStatus?: OrderStatus) => void;
  onTrackOrder?: (orderId: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onDarkModeChange?: (isDark: boolean) => void;
  onOpenCatalogManager?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  wishlist,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
  onNavigate,
  currentCurrency,
  onCurrencyChange,
  orders,
  onUpdateOrderStatus,
  onOpenNotificationModal,
  onTrackOrder,
  darkMode = false,
  onToggleDarkMode,
  onDarkModeChange,
  onOpenCatalogManager
}) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'orders' | 'settings'>('orders');
  const [hapticsOn, setHapticsOn] = useState<boolean>(getHapticsEnabled());
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    setHapticsOn(getHapticsEnabled());
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      hapticLight();
      await signInWithGoogle();
      hapticSuccess();
    } catch (err) {
      console.error('Firebase Auth sign in failed:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      hapticLight();
      await signOutUser();
      hapticSuccess();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleToggleHaptics = () => {
    const nextVal = !hapticsOn;
    setHapticsOn(nextVal);
    setHapticsEnabled(nextVal);
    if (nextVal) {
      setTimeout(() => hapticSuccess(), 50);
    }
  };

  const handleTestHaptic = () => {
    hapticSuccess();
  };

  const handleDownloadOrderPdf = async (ord: Order) => {
    try {
      hapticLight();
      setDownloadingOrderId(ord.id);
      await generateInvoicePdf(ord, currentCurrency);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const handleCopyTrackingLink = async (ord: Order) => {
    hapticSuccess();
    const trackingUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/?track=${encodeURIComponent(ord.id)}`
      : `https://al-noureen.luxury/?track=${ord.id}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(trackingUrl);
      } else {
        // Fallback for iframe environments
        const textArea = document.createElement('textarea');
        textArea.value = trackingUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedOrderId(ord.id);
      setTimeout(() => {
        setCopiedOrderId(null);
      }, 3000);
    } catch (err) {
      console.error('Could not copy tracking URL:', err);
    }
  };

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'AED', 'PKR', 'INR', 'SAR'];

  return (
    <div id="profile-screen-view" className="w-full bg-[#FAF7F2] min-h-screen">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-6">
        {/* User Card */}
        <div className="bg-[#F4EFE6] border border-[#E8E2D5] p-6 text-center rounded-2xl relative overflow-hidden">
          {currentUser ? (
            <div className="flex flex-col items-center">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Customer'}
                  className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-[#C59B27] shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 bg-[#1E1A17] text-[#D4AF37] font-cinzel text-xl font-semibold rounded-full flex items-center justify-center mx-auto mb-3 border border-[#C59B27]/40 shadow-xs">
                  {currentUser.displayName
                    ? currentUser.displayName.slice(0, 2).toUpperCase()
                    : 'EV'}
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5">
                <h2 className="font-playfair text-2xl text-[#1E1A17]">
                  {currentUser.displayName || 'Atelier Client'}
                </h2>
                <UserCheck className="w-4 h-4 text-[#C59B27]" />
              </div>
              <p className="text-xs font-sans-ui text-[#8C7E72] mt-0.5">
                {currentUser.email}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#D5CEBF] hover:border-[#1E1A17] text-xs font-sans-ui text-[#5A5046] hover:text-[#1E1A17] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1E1A17] text-[#D4AF37] font-cinzel text-xl font-semibold rounded-full flex items-center justify-center mx-auto mb-3 border border-[#C59B27]/40 shadow-xs">
                AN
              </div>
              <h2 className="font-playfair text-2xl text-[#1E1A17]">Al Noureen Client</h2>
              <p className="text-xs font-sans-ui text-[#8C7E72] mt-0.5">
                Sign in with your Google account to sync your orders and bespoke requests.
              </p>
              <div className="mt-4">
                <button
                  onClick={handleSignIn}
                  disabled={isAuthLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E1A17] hover:bg-[#2D2622] text-[#FAF7F2] text-xs font-sans-ui font-semibold transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {isAuthLoading ? 'Connecting...' : 'Sign In with Google'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-[#E8E2D5] mt-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-xs font-sans-ui tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#C59B27] text-[#1E1A17]'
                : 'border-transparent text-[#8C7E72] hover:text-[#1E1A17]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Orders & Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-3 text-xs font-sans-ui tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'wishlist'
                ? 'border-[#C59B27] text-[#1E1A17]'
                : 'border-transparent text-[#8C7E72] hover:text-[#1E1A17]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-xs font-sans-ui tracking-wider uppercase font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-[#C59B27] text-[#1E1A17]'
                : 'border-transparent text-[#8C7E72] hover:text-[#1E1A17]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Preferences
          </button>
        </div>

        {/* Tab 1: Orders with Automated Email Triggers & Visual Atelier Tailoring Progress */}
        {activeTab === 'orders' && (
          <div className="py-6 space-y-5">
            {orders.map((ord, idx) => (
              <div
                key={`profile-ord-${ord.id}-${idx}`}
                className="bg-[#F4EFE6] dark:bg-[#1E1915] border border-[#E8E2D5] dark:border-[#332A22] p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D5] dark:border-[#2E2620] pb-3">
                  <div>
                    <span className="text-[10px] font-cinzel text-[#8C7E72] dark:text-[#9E8E7C] tracking-wider uppercase">
                      Order Reference
                    </span>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans-ui text-sm sm:text-base font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                        {ord.id}
                      </h4>
                      <button
                        onClick={() => handleCopyTrackingLink(ord)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-sans-ui font-medium border transition-all cursor-pointer ${
                          copiedOrderId === ord.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-[#FAF7F2] dark:bg-[#251F1A] text-[#8C7A6B] dark:text-[#C5BAAC] border-[#DDD3BC] dark:border-[#3A3026] hover:text-[#C59B27] hover:border-[#C59B27]'
                        }`}
                        title="Copy tracking link to share order progress"
                      >
                        {copiedOrderId === ord.id ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>Link Copied!</span>
                          </>
                        ) : (
                          <>
                            <Link className="w-3 h-3 text-[#C59B27]" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui mt-0.5">
                      Carrier: <strong>{ord.carrier}</strong> • Tracking: <span className="font-mono text-[#C59B27]">{ord.trackingNumber}</span>
                    </p>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1">
                    <span className="inline-block bg-[#181411] text-[#E8D59E] border border-[#C59B27]/40 text-[10px] font-cinzel uppercase tracking-widest px-3 py-1 font-bold rounded-full">
                      {ord.status}
                    </span>
                    <p className="text-[10.5px] text-[#0A7B54] dark:text-[#4ade80] font-semibold">
                      Est. Delivery: {ord.estimatedDelivery}
                    </p>
                  </div>
                </div>

                {/* Items Summary & Pricing */}
                <div className="flex flex-wrap items-center justify-between text-xs text-[#6B635B] dark:text-[#C5BAAC] font-sans-ui gap-2">
                  <span>Placed on {ord.date}</span>
                  <span>{ord.itemsCount || ord.items.length} Custom Handcrafted Items</span>
                  <span className="font-semibold text-[#1E1A17] dark:text-[#FAF7F2] text-sm">
                    {formatPrice(ord.total, currentCurrency)}
                  </span>
                </div>

                {/* VISUAL ATELIER PROGRESS BAR & TAILORING TRACKER */}
                <AtelierOrderProgressTracker
                  order={ord}
                  onUpdateStatus={onUpdateOrderStatus}
                  defaultExpanded={ord.status === 'In Atelier Tailoring' || ord.status === 'Order Confirmed' || ord.status === 'Quality Inspection'}
                />

                {/* Order Items Preview Thumbnails */}
                {ord.items && ord.items.length > 0 && (
                  <div className="p-3 bg-[#FAF7F2] dark:bg-[#181411] rounded-xl border border-[#DDD3BC] dark:border-[#2D241E] space-y-2">
                    <span className="text-[10px] font-cinzel uppercase font-semibold text-[#8C7A6B] dark:text-[#9E8E7C]">
                      Ordered Items
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ord.items.map((item, i) => (
                        <div key={`profile-ord-${ord.id}-item-${item.productId || 'item'}-${i}`} className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-[#201A16] border border-[#E8E2D5] dark:border-[#332A22]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-12 object-cover object-top rounded-xs border border-[#DDD3BC] dark:border-[#3A3026] shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-playfair text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                              {item.name}
                            </h5>
                            <p className="text-[10px] text-[#7A6B5D] dark:text-[#9E8E7C] font-sans-ui">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons: Invoice PDF, Email notification, Track Order */}
                <div className="pt-2 border-t border-[#E8E2D5] dark:border-[#2E2620] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10.5px] text-[#8C7A6B] dark:text-[#9E8E7C] font-sans-ui">
                    Paid via: <strong>{ord.paymentMethod}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyTrackingLink(ord)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider transition-all flex items-center gap-1 cursor-pointer border ${
                        copiedOrderId === ord.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-[#FAF7F2] dark:bg-[#251F1A] hover:bg-[#EAE2D2] dark:hover:bg-[#332A22] text-[#1E1A17] dark:text-[#E8D59E] border-[#DDD3BC] dark:border-[#3A3026]'
                      }`}
                      title="Copy Tracking Link"
                    >
                      {copiedOrderId === ord.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span>Copy Tracking Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadOrderPdf(ord)}
                      disabled={downloadingOrderId === ord.id}
                      className="px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#251F1A] hover:bg-[#EAE2D2] dark:hover:bg-[#332A22] text-[#1E1A17] dark:text-[#E8D59E] border border-[#DDD3BC] dark:border-[#3A3026] rounded-lg text-xs font-cinzel font-semibold tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      title="Download Certified Tax Invoice (PDF)"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C59B27]" />
                      {downloadingOrderId === ord.id ? 'Generating...' : 'PDF Bill'}
                    </button>

                    {onOpenNotificationModal && (
                      <button
                        onClick={() => onOpenNotificationModal(ord)}
                        className="px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#251F1A] hover:bg-[#EAE2D2] dark:hover:bg-[#332A22] text-[#1E1A17] dark:text-[#E8D59E] border border-[#DDD3BC] dark:border-[#3A3026] rounded-lg text-xs font-cinzel font-semibold tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#C59B27]" /> Email
                      </button>
                    )}

                    <button
                      onClick={() => (onTrackOrder ? onTrackOrder(ord.id) : onNavigate('track-order'))}
                      className="px-3 py-1.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-lg text-xs font-cinzel font-semibold tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Track
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="py-6">
            {wishlist.length === 0 ? (
              <div className="text-center py-12 bg-[#F4EFE6] border border-[#E8E2D5] p-6 rounded-2xl">
                <Heart className="w-8 h-8 text-[#C59B27] mx-auto mb-2 stroke-1" />
                <h3 className="font-playfair text-lg text-[#1E1A17]">No Saved Pieces</h3>
                <p className="text-xs text-[#6B635B] mt-1 font-sans-ui">
                  Tap the heart icon on any garment to curate your personalized wishlist.
                </p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="mt-4 px-6 py-2.5 bg-[#C59B27] text-[#1E1A17] text-xs font-semibold uppercase tracking-widest rounded-xl"
                >
                  Browse Shop
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item, idx) => (
                  <div
                    key={`profile-wish-${item.id}-${idx}`}
                    className="bg-[#F4EFE6] border border-[#E8E2D5] p-4 flex gap-4 items-center justify-between rounded-xl"
                  >
                    <div
                      onClick={() => onSelectProduct(item)}
                      className="flex gap-3 items-center cursor-pointer flex-1"
                    >
                      <div className="w-16 h-20 bg-[#FAF7F2] border border-[#E8E2D5] overflow-hidden flex-shrink-0 rounded-lg">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <h4 className="font-playfair text-sm md:text-base text-[#1E1A17]">{item.name}</h4>
                        <p className="text-xs font-sans-ui text-[#B38A1E] font-medium mt-0.5">
                          {formatPrice(item.price, currentCurrency)}
                        </p>
                        <p className="text-[10px] text-[#8C7E72] font-sans-ui">{item.fabric}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAddToCart(item, item.sizes[0] || 'M')}
                        className="px-3 py-2 bg-[#C59B27] hover:bg-[#B38A1E] text-[#1E1A17] text-[11px] font-sans-ui font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 rounded-lg"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Bag
                      </button>
                      <button
                        onClick={() => onRemoveWishlist(item)}
                        className="p-2 text-[#8C7E72] hover:text-red-600 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Preferences */}
        {activeTab === 'settings' && (
          <div className="py-6 space-y-6 font-sans-ui text-xs">
            {/* Theme Toggle: Midnight Obsidian & Royal Gold / Warm Ivory */}
            <div className="bg-[#F4EFE6] border border-[#E8E2D5] p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E1A17] text-[#D4AF37] rounded-full flex items-center justify-center border border-[#C59B27]/40 shadow-xs shrink-0">
                    {darkMode ? <Moon className="w-5 h-5 text-[#D4AF37]" /> : <Sun className="w-5 h-5 text-[#D4AF37]" />}
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1A17] uppercase tracking-wider flex items-center gap-1.5">
                      {darkMode ? 'Midnight Obsidian Mode' : 'Warm Ivory Luxury Mode'}
                      <span className="text-[10px] font-sans-ui font-normal bg-[#C59B27]/20 text-[#8C6B1B] px-2 py-0.5 rounded-full">
                        {darkMode ? 'Dark' : 'Light'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#6B635B] mt-0.5">
                      Toggle high-contrast dark aesthetic tailored for evening couture viewing.
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-auto">
                  <ThemeRadioSlider
                    darkMode={darkMode}
                    onChange={(isDark) => {
                      if (onDarkModeChange) {
                        onDarkModeChange(isDark);
                      } else if (onToggleDarkMode) {
                        onToggleDarkMode();
                      }
                    }}
                    size="md"
                    variant="light"
                    idPrefix="profile-theme-radio"
                  />
                </div>
              </div>
            </div>

            {/* Haptic / Tactile Feedback Toggle */}
            <div className="bg-[#F4EFE6] border border-[#E8E2D5] p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E1A17] text-[#D4AF37] rounded-full flex items-center justify-center border border-[#C59B27]/40 shadow-xs">
                    <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-[#1E1A17] uppercase tracking-wider flex items-center gap-1.5">
                      Tactile Haptic Feedback
                      <span
                        className={`text-[10px] font-sans-ui font-medium px-2 py-0.5 rounded-full ${
                          hapticsOn
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {hapticsOn ? 'Enabled' : 'Disabled'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#6B635B] mt-0.5 leading-snug">
                      Subtle tactile vibrations for Bag additions, Wishlist favorites, and gateway confirmation steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="profile-toggle-haptics"
                    onClick={handleToggleHaptics}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      hapticsOn ? 'bg-[#C59B27]' : 'bg-[#DDD3BC]'
                    }`}
                    role="switch"
                    aria-checked={hapticsOn}
                    aria-label="Toggle Tactile Haptic Feedback"
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-[#181411] shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                        hapticsOn ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    >
                      <Fingerprint className={`w-3.5 h-3.5 ${hapticsOn ? 'text-[#F5D77F]' : 'text-[#8C7E72]'}`} />
                    </span>
                  </button>
                </div>
              </div>

              {hapticsOn && (
                <div className="mt-3 pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-[11px] text-[#8C7E72]">
                  <span>Feel sample vibration feedback pattern</span>
                  <button
                    type="button"
                    onClick={handleTestHaptic}
                    className="px-2.5 py-1 bg-white hover:bg-[#FAF7F2] text-[#1E1A17] border border-[#DDD3BC] rounded-md font-cinzel text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#C59B27]" /> Test Vibration
                  </button>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="bg-[#F4EFE6] border border-[#E8E2D5] p-5 rounded-2xl">
              <h4 className="font-cinzel text-xs font-semibold text-[#1E1A17] uppercase tracking-wider mb-3">
                Display Currency
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {currencies.map((curr, cIdx) => (
                  <button
                    key={`profile-curr-${curr}-${cIdx}`}
                    onClick={() => onCurrencyChange(curr)}
                    className={`py-2 px-2 text-center text-xs font-medium border rounded-xl transition-all ${
                      currentCurrency === curr
                        ? 'bg-[#1E1A17] text-[#FAF7F2] border-[#1E1A17] shadow-sm font-bold'
                        : 'bg-[#FAF7F2] text-[#6B635B] border-[#DED7CA] hover:border-[#B38A1E]'
                    }`}
                  >
                    {curr} ({CURRENCY_RATES[curr]?.symbol.trim() || '$'})
                  </button>
                ))}
              </div>
            </div>

            {/* Store Catalog & Price Manager Card */}
            {/* Admin Backend Suite Access */}
            <div className="bg-[#181411] text-[#E8D59E] border border-[#C59B27]/60 p-5 rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2B231D] text-[#D4AF37] rounded-full flex items-center justify-center border border-[#C59B27] shrink-0">
                    <Sparkles className="w-5 h-5 text-[#C59B27]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
                        AL NOUREEN Admin Suite
                      </h4>
                      <span className="text-[9.5px] bg-[#C59B27] text-[#14100D] font-bold px-2 py-0.2 rounded-full font-mono">
                        Backend
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A69788] mt-0.5">
                      Control selling prices, upload high-res images, create promo codes, and manage customer fulfillment.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="px-5 py-2.5 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] font-cinzel font-bold text-xs tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Open Admin Suite
                </button>
              </div>
            </div>

            {/* Atelier Concierge */}
            <div className="bg-[#F4EFE6] border border-[#E8E2D5] p-5 flex items-center justify-between rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C59B27]/20 text-[#947625] rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-[#1E1A17]">Private Stylist & Concierge</h4>
                  <p className="text-[11px] text-[#6B635B]">Connect for custom fittings on WhatsApp: +91 93262 94187</p>
                </div>
              </div>
              <a
                href="https://wa.me/919326294187"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#1E1A17] text-[#FAF7F2] text-xs font-medium tracking-wider uppercase rounded-xl"
              >
                Chat
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

