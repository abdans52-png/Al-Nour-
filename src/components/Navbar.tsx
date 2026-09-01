import React, { useState } from 'react';
import { ScreenType, Currency } from '../types';
import { Logo } from './Logo';
import { CURRENCY_RATES } from '../utils/currency';
import { ThemeRadioSlider } from './ThemeRadioSlider';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Globe,
  Tag,
  Bell,
  Shield
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
  wishlistCount: number;
  notificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenSearch: () => void;
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenEnsembleBuilder?: () => void;
  onOpenTailoringWizard?: () => void;
  onOpenLookbooks?: () => void;
  darkMode?: boolean;
  onDarkModeChange?: (isDark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  wishlistCount,
  notificationsCount = 0,
  onOpenNotifications,
  onOpenSearch,
  currentCurrency,
  onCurrencyChange,
  onOpenEnsembleBuilder,
  onOpenTailoringWizard,
  onOpenLookbooks,
  darkMode = false,
  onDarkModeChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const navLinks: { label: string; screen: ScreenType; badge?: string; isSale?: boolean }[] = [
    { label: 'Home', screen: 'home' },
    { label: 'Pakistani', screen: 'pakistani' },
    { label: 'Abayas', screen: 'abayas' },
    { label: 'Hijabs', screen: 'hijabs' },
    { label: 'Modest Wear', screen: 'modest-wear' },
    { label: 'Lookbooks', screen: 'shop-the-look', badge: 'Capsules' },
    { label: 'Accessories', screen: 'accessories' },
    { label: 'Bags', screen: 'bags' },
    { label: 'New Arrivals', screen: 'new-arrivals', badge: 'New' },
    { label: 'Sale', screen: 'sale', isSale: true }
  ];

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="static z-40 w-full bg-[#FAF7F2] border-b border-[#E8DFC8]">
      {/* Main Brand Header (Desktop & Mobile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Mobile Hamburger & Search Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#1E1A17] hover:text-[#C59B27] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#1E1A17] hover:text-[#C59B27] transition-colors"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Center/Left: Brand Logo with Arabic name and tagline */}
        <div className="flex-1 lg:flex-initial flex justify-center lg:justify-start">
          <Logo
            variant="header"
            onClick={() => onNavigate('home')}
            className="cursor-pointer hover:opacity-95 transition-opacity"
          />
        </div>

        {/* Desktop Quick Search Bar */}
        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-4">
          <div
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2.5 px-4 py-2 bg-[#F0EAE0] hover:bg-[#EAE2D4] border border-[#DDD3BC] rounded-full text-xs text-[#7A6B5D] cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4 text-[#8C6B1B]" />
            <span className="font-sans-ui truncate">Search abayas, modest dresses, luxury suits, hijabs...</span>
          </div>
        </div>

        {/* Right: Header Icons (Compact Currency, Search, Notifications, Wishlist, Account, Cart) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Super Compact Currency Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F0EAE0] hover:bg-[#EAE2D4] text-[#1E1A17] text-[11px] font-sans-ui border border-[#DDD3BC] transition-colors cursor-pointer"
              title="Change Currency"
            >
              <span className="font-bold text-[#8C6B1B]">{CURRENCY_RATES[currentCurrency]?.symbol.trim() || '$'}</span>
              <span className="font-semibold text-[10.5px]">{currentCurrency}</span>
              <ChevronDown className="w-2.5 h-2.5 text-[#7A6B5D]" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-[#181411] border border-[#C59B27]/40 rounded-xl shadow-xl py-1.5 w-36 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1 text-[10px] uppercase font-cinzel text-[#8C7A6B] border-b border-[#2B231D]">
                  Select Currency
                </div>
                {(Object.keys(CURRENCY_RATES) as Currency[]).map((cur) => (
                  <button
                    key={`nav-cur-${cur}`}
                    onClick={() => {
                      onCurrencyChange(cur);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#2B231D] flex items-center justify-between transition-colors cursor-pointer ${
                      currentCurrency === cur ? 'text-[#C59B27] font-bold' : 'text-[#FAF7F2]'
                    }`}
                  >
                    <span>{CURRENCY_RATES[cur].label}</span>
                    <span className="text-[#A69788] text-[11px]">{CURRENCY_RATES[cur].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenSearch}
            className="hidden lg:flex p-2 text-[#1E1A17] hover:text-[#C59B27] transition-colors rounded-full hover:bg-[#F0EAE0]"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-[#1E1A17] hover:text-[#C59B27] transition-colors rounded-full hover:bg-[#F0EAE0]"
            title="Automated Delivery Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#C59B27] text-[#181411] border border-[#181411] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {notificationsCount}
              </span>
            )}
          </button>

          <button
            id="navbar-wishlist-button"
            onClick={() => onNavigate('wishlist')}
            className="relative p-2 text-[#1E1A17] hover:text-[#C59B27] transition-colors rounded-full hover:bg-[#F0EAE0]"
            title="Saved Wishlist"
            aria-label={`Saved Wishlist with ${wishlistCount} items`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                wishlistCount > 0
                  ? 'text-[#C59B27] fill-[#C59B27]/20 scale-105'
                  : 'text-[#1E1A17]'
              }`}
            />
            <AnimatePresence mode="wait">
              {wishlistCount > 0 && (
                <motion.span
                  key={`wishlist-badge-count-${wishlistCount}`}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#181411] text-[#E8D59E] border border-[#C59B27] text-[9.5px] font-cinzel font-bold rounded-full flex items-center justify-center shadow-xs"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            id="navbar-admin-btn"
            onClick={() => onNavigate('admin')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-cinzel font-semibold bg-[#201B17] hover:bg-[#302822] text-[#E8D59E] border border-[#C59B27]/50 transition-all active:scale-95 shadow-xs"
            title="AL NOUREEN Admin Control Panel (Pricing, Images, Offers)"
          >
            <Shield className="w-3.5 h-3.5 text-[#C59B27]" />
            <span className="hidden md:inline text-[10.5px]">Admin</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="p-2 text-[#1E1A17] hover:text-[#C59B27] transition-colors rounded-full hover:bg-[#F0EAE0]"
            title="Customer Account"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('cart')}
            className="relative flex items-center gap-2 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27]/60 px-3.5 py-1.5 rounded-full transition-all active:scale-95 shadow-xs"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-cinzel font-semibold hidden sm:inline">Bag</span>
            <span className="bg-[#C59B27] text-[#181411] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Main Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-[#E8DFC8] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-7 py-2 text-xs font-cinzel tracking-wider font-semibold">
          {navLinks.map((link, idx) => {
            const isActive = currentScreen === link.screen;
            return (
              <button
                key={`nav-link-${link.screen}-${idx}`}
                onClick={() => handleNavClick(link.screen)}
                className={`relative py-1 transition-colors group ${
                  isActive
                    ? 'text-[#C59B27]'
                    : link.isSale
                    ? 'text-[#A32A2A] hover:text-[#C52727]'
                    : 'text-[#2D2620] hover:text-[#C59B27]'
                }`}
              >
                <span className="flex items-center gap-1">
                  {link.label}
                  {link.badge && (
                    <span className="text-[8.5px] font-sans-ui bg-[#181411] text-[#E8D59E] border border-[#C59B27] px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                      {link.badge}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C59B27] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Mobile Slide-out Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] z-50 bg-[#FAF7F2] border-t border-[#E8DFC8] overflow-y-auto animate-in slide-in-from-top duration-200 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#DDD3BC]">
              <span className="text-[10px] font-cinzel font-semibold uppercase tracking-widest text-[#8C6B1B]">
                Explore Collections
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {navLinks.map((link, idx) => (
                <button
                  key={`nav-mob-link-${link.screen}-${idx}`}
                  onClick={() => handleNavClick(link.screen)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-cinzel font-semibold flex items-center justify-between transition-colors ${
                    currentScreen === link.screen
                      ? 'bg-[#181411] text-[#E8D59E]'
                      : 'text-[#1E1A17] hover:bg-[#F0EAE0]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-[#C59B27] text-[#181411] px-2 py-0.5 rounded-full font-sans-ui">
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#DDD3BC] space-y-2">
              <button
                onClick={() => handleNavClick('wishlist')}
                className="w-full text-left px-3 py-2 text-xs font-cinzel font-semibold text-[#181411] hover:text-[#C59B27] flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#C59B27]" /> Saved Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="bg-[#181411] text-[#E8D59E] border border-[#C59B27] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('shop-the-look')}
                className="w-full text-left px-3 py-2 text-xs font-cinzel font-semibold text-[#8C6B1B] hover:text-[#181411] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Shop The Look
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="w-full text-left px-3 py-2 text-xs font-cinzel text-[#4A3E34] hover:text-[#181411]"
              >
                About AL-NOUREEN (النورين)
              </button>
              <button
                onClick={() => handleNavClick('reviews')}
                className="w-full text-left px-3 py-2 text-xs font-cinzel text-[#4A3E34] hover:text-[#181411]"
              >
                Customer Reviews
              </button>
              <button
                onClick={() => handleNavClick('track-order')}
                className="w-full text-left px-3 py-2 text-xs font-cinzel text-[#4A3E34] hover:text-[#181411]"
              >
                Track Your Order
              </button>
              <button
                onClick={() => handleNavClick('size-guide')}
                className="w-full text-left px-3 py-2 text-xs font-cinzel text-[#4A3E34] hover:text-[#181411]"
              >
                Modest Size Guide
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-3 py-2 text-xs font-cinzel font-semibold text-[#8C6B1B] bg-[#F4EFE6] border border-[#C59B27]/40 rounded-lg hover:bg-[#EAE0CD] flex items-center justify-between mt-2"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C59B27]" /> Admin Control Panel
                </span>
                <span className="text-[9px] bg-[#181411] text-[#E8D59E] px-1.5 py-0.5 rounded font-mono">Backend</span>
              </button>
            </div>
          </div>

          {/* Preferences (Theme & Currency) in Mobile Drawer */}
          <div className="pt-5 border-t border-[#DDD3BC] mt-6 space-y-4">
            {onDarkModeChange && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans-ui text-[#7A6B5D]">Theme Appearance:</span>
                <ThemeRadioSlider
                  darkMode={darkMode}
                  onChange={onDarkModeChange}
                  size="sm"
                  variant="light"
                  idPrefix="mobile-nav-theme-radio"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-sans-ui text-[#7A6B5D]">Currency:</span>
              <div className="flex gap-1.5">
                {(['USD', 'AED', 'GBP', 'PKR', 'SAR'] as Currency[]).map((c) => (
                  <button
                    key={`mob-cur-${c}`}
                    onClick={() => onCurrencyChange(c)}
                    className={`px-2 py-1 rounded-md text-[11px] font-sans-ui ${
                      currentCurrency === c
                        ? 'bg-[#181411] text-[#E8D59E] font-semibold'
                        : 'bg-[#F0EAE0] text-[#54463A]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
