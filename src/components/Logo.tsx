import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';

interface LogoProps {
  variant?: 'badge' | 'inline' | 'full' | 'header' | 'seal';
  className?: string;
  onClick?: () => void;
  showTagline?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  customLogoUrl?: string;
  customBrandName?: string;
  customBrandSubtitle?: string;
  customBrandArabic?: string;
  customBrandTagline?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'badge',
  className = '',
  onClick,
  showTagline = true,
  theme = 'auto',
  customLogoUrl,
  customBrandName,
  customBrandSubtitle,
  customBrandArabic,
  customBrandTagline
}) => {
  const { siteContent } = useSiteContent();

  const activeLogoUrl = customLogoUrl || siteContent?.logoUrl || '';
  const brandName = customBrandName || siteContent?.brandName || 'AL NOUREEN';
  const brandSubtitle = customBrandSubtitle || siteContent?.brandSubtitle || 'by Nasreen';
  const brandArabic = customBrandArabic || siteContent?.brandArabic || 'النورين';
  const brandTagline = customBrandTagline || siteContent?.brandTagline || 'Two Lights. One Beautiful Vision.';
  const brandSubheading = siteContent?.brandSubheading || 'Haute Couture • Indian & Modest Luxury';

  // Master 3D Gold Arabic Calligraphy Emblem SVG
  const renderCalligraphyCrest = (size = 100) => {
    if (activeLogoUrl) {
      return (
        <img
          src={activeLogoUrl}
          alt={`${brandName} ${brandSubtitle}`}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(197,155,39,0.3)]"
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(197,155,39,0.25)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Multi-stop 3D Gold Gradient for Calligraphy */}
          <linearGradient id="sculptedGoldGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="20%" stopColor="#F5D77F" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7E1A" />
            <stop offset="88%" stopColor="#E2BF5A" />
            <stop offset="100%" stopColor="#6C4A0B" />
          </linearGradient>

          {/* Highlight Gradient for bevel edges */}
          <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F9E9B6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9C7318" stopOpacity="0.1" />
          </linearGradient>

          {/* Ambient Shadow Filter for 3D depth */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0.8 0 0 0 0.85
                      0.6 0 0 0 0.65
                      0.1 0 0 0 0.15
                      0 0 0 0.35 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#goldGlow)">
          {/* Outer Teardrop Flame Silhouette of 'النورين' */}
          <path
            d="M100 12 C103 28 96 46 88 64 C82 78 86 94 98 106 C108 116 122 118 132 108 C144 96 142 78 132 64 C124 52 114 42 105 28 C99 18 101 10 100 12 Z"
            fill="url(#sculptedGoldGrad)"
            stroke="#422C05"
            strokeWidth="0.75"
          />

          {/* Ascending Main Flame Tip */}
          <path
            d="M100 12 C104 22 112 36 124 50 C138 66 148 84 148 104 C148 134 126 158 98 158 C72 158 52 136 52 108 C52 86 64 68 76 54 C86 42 96 26 100 12 Z"
            fill="none"
            stroke="url(#sculptedGoldGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Calligraphic Arabic Flow (Noon, Waw, Raa, Yaa, Noon) */}
          <path
            d="M58 114 C62 90 82 82 92 98 C98 108 94 124 82 132 C70 140 56 130 58 114 Z"
            fill="url(#sculptedGoldGrad)"
          />
          <path
            d="M142 114 C138 90 118 82 108 98 C102 108 106 124 118 132 C130 140 144 130 142 114 Z"
            fill="url(#sculptedGoldGrad)"
          />

          {/* Central Interlocking Waw/Raa Ribbon Arch */}
          <path
            d="M82 72 Q100 96 118 72 Q136 108 100 142 Q64 108 82 72 Z"
            fill="none"
            stroke="url(#sculptedGoldGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Base Crest Ribbon Pedestal */}
          <path
            d="M60 146 Q100 182 140 146 Q100 166 60 146 Z"
            fill="url(#sculptedGoldGrad)"
          />
          <path
            d="M68 152 Q100 178 132 152"
            fill="none"
            stroke="#FFF2B8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Nuqta (Calligraphic Diamond Dots) */}
          <path
            d="M72 82 L78 76 L84 82 L78 88 Z"
            fill="url(#sculptedGoldGrad)"
            stroke="#553A08"
            strokeWidth="0.5"
          />
          <path
            d="M124 106 L130 100 L136 106 L130 112 Z"
            fill="url(#sculptedGoldGrad)"
            stroke="#553A08"
            strokeWidth="0.5"
          />
          <path
            d="M90 162 L96 156 L102 162 L96 168 Z"
            fill="url(#sculptedGoldGrad)"
            stroke="#553A08"
            strokeWidth="0.5"
          />
          <path
            d="M102 162 L108 156 L114 162 L108 168 Z"
            fill="url(#sculptedGoldGrad)"
            stroke="#553A08"
            strokeWidth="0.5"
          />

          {/* Subtle Highlight Reflection strokes */}
          <path
            d="M96 22 Q112 50 118 78"
            fill="none"
            stroke="url(#goldHighlight)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M66 112 Q76 96 86 102"
            fill="none"
            stroke="url(#goldHighlight)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  };

  // Divider with central 4-pointed diamond star: ——— ✦ ———
  const renderStarDivider = () => (
    <div className="flex items-center justify-center w-full max-w-[220px] my-1 opacity-90">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C59B27] to-[#E2BF5A]" />
      <span className="mx-2 text-[#D4AF37] text-[10px] sm:text-xs leading-none drop-shadow-sm select-none">
        ✦
      </span>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C59B27] to-[#E2BF5A]" />
    </div>
  );

  // Full Emblem (Centered, Large Brand Display)
  if (variant === 'full') {
    return (
      <div
        id="al-noureen-brand-logo-full"
        onClick={onClick}
        className={`flex flex-col items-center justify-center cursor-pointer select-none text-center ${className}`}
      >
        {/* 3D Gold Arabic Crest / Uploaded Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center mb-1">
          {renderCalligraphyCrest(100)}
        </div>

        {/* Star Divider */}
        {renderStarDivider()}

        {/* Brand Name Typography */}
        <div className="flex flex-col items-center mt-1">
          <span className="font-cinzel tracking-[0.28em] text-xl sm:text-2xl font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase drop-shadow-xs">
            {brandName}
          </span>
          <span className="font-cormorant italic text-[#C59B27] text-sm sm:text-base font-semibold tracking-wider -mt-0.5">
            {brandSubtitle}
          </span>
          {brandArabic && (
            <span className="font-serif text-[#C59B27]/80 text-xs tracking-widest mt-0.5">
              {brandArabic}
            </span>
          )}
        </div>

        {/* Tagline */}
        {showTagline && brandTagline && (
          <p className="text-[10.5px] font-sans-ui tracking-[0.24em] text-[#8C7A6B] uppercase mt-1.5 font-medium">
            {brandTagline}
          </p>
        )}
      </div>
    );
  }

  // Header Variant (Horizontal Navbar lockup)
  if (variant === 'header') {
    return (
      <div
        id="al-noureen-brand-logo-header"
        onClick={onClick}
        className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group ${className}`}
      >
        <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#14100D] border border-[#C59B27]/50 flex items-center justify-center rounded-sm shadow-md flex-shrink-0 transition-transform group-hover:scale-105 p-1 overflow-hidden">
          {renderCalligraphyCrest(44)}
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-cinzel tracking-[0.22em] sm:tracking-[0.26em] text-xs sm:text-base font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase whitespace-nowrap">
              {brandName}
            </span>
            <span className="font-cormorant italic text-[11px] sm:text-xs text-[#C59B27] font-semibold tracking-wide whitespace-nowrap">
              {brandSubtitle}
            </span>
            {brandArabic && (
              <span className="text-[10px] text-[#C59B27] font-serif font-medium hidden sm:inline">
                {brandArabic}
              </span>
            )}
          </div>
          <span className="text-[8px] sm:text-[8.5px] tracking-[0.16em] sm:tracking-[0.18em] text-[#8C7A6B] uppercase font-sans-ui hidden xs:inline truncate">
            {brandSubheading}
          </span>
        </div>
      </div>
    );
  }

  // Seal Variant (for Order Confirmation / Luxury Invoice)
  if (variant === 'seal') {
    return (
      <div
        id="al-noureen-brand-logo-seal"
        className={`flex flex-col items-center justify-center text-center ${className}`}
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#14100D] border-2 border-[#C59B27] rounded-full p-2.5 shadow-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-1 rounded-full border border-dashed border-[#C59B27]/40 pointer-events-none" />
          {renderCalligraphyCrest(110)}
        </div>
        <div className="mt-3 flex flex-col items-center">
          <span className="font-cinzel tracking-[0.32em] text-lg sm:text-xl font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase">
            {brandName}
          </span>
          <span className="font-cormorant italic text-sm text-[#D4AF37] font-semibold tracking-wider">
            {brandSubtitle}
          </span>
          <span className="text-xs text-[#C59B27] font-serif tracking-widest mt-0.5">
            {brandArabic ? `${brandArabic} • ATELIER ROYALE` : 'ATELIER ROYALE'}
          </span>
        </div>
      </div>
    );
  }

  // Inline Variant
  if (variant === 'inline') {
    return (
      <div
        id="al-noureen-brand-logo-inline"
        onClick={onClick}
        className={`flex items-center gap-2.5 cursor-pointer select-none ${className}`}
      >
        <div className="w-8 h-8 bg-[#14100D] border border-[#C59B27]/40 flex items-center justify-center rounded-xs shadow-xs p-0.5 shrink-0 overflow-hidden">
          {renderCalligraphyCrest(32)}
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-cinzel tracking-[0.20em] text-xs sm:text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] whitespace-nowrap">
              {brandName}
            </span>
            <span className="font-cormorant italic text-[11px] text-[#C59B27] font-semibold whitespace-nowrap">
              {brandSubtitle}
            </span>
            {brandArabic && (
              <span className="text-[10px] text-[#C59B27] font-serif hidden xs:inline">{brandArabic}</span>
            )}
          </div>
          {showTagline && brandTagline && (
            <span className="text-[8px] tracking-[0.14em] text-[#8C7A6B] uppercase font-sans-ui">
              {brandTagline}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default Badge Variant (Crest Emblem Card)
  return (
    <div
      id="al-noureen-brand-logo-badge"
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center bg-[#14100D] border border-[#C59B27]/60 rounded-b-md px-3 pt-2 pb-2 shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 group ${className}`}
    >
      <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
        {renderCalligraphyCrest(36)}
      </div>

      <span className="font-cinzel text-[8px] tracking-[0.24em] font-bold text-[#F5D77F] uppercase mt-1 whitespace-nowrap drop-shadow-xs">
        {brandName}
      </span>
      <span className="font-cormorant italic text-[7.5px] text-[#D4AF37] font-semibold -mt-0.5">
        {brandSubtitle}
      </span>
      {brandArabic && (
        <span className="text-[6.5px] text-[#C59B27] font-serif -mt-0.5">{brandArabic}</span>
      )}
    </div>
  );
};
