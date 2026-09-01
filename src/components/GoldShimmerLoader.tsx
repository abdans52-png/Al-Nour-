import React from 'react';
import { Sparkles } from 'lucide-react';

interface GoldShimmerLoaderProps {
  aspectRatio?: string;
  className?: string;
  showMonogram?: boolean;
  monogramSize?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const GoldShimmerLoader: React.FC<GoldShimmerLoaderProps> = ({
  aspectRatio,
  className = '',
  showMonogram = true,
  monogramSize = 'md',
  label = 'AL-NOUREEN ATELIER'
}) => {
  const iconDimensions = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }[monogramSize];

  const textSize = {
    sm: 'text-[7px]',
    md: 'text-[9px]',
    lg: 'text-[11px]'
  }[monogramSize];

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#F4EFE6] via-[#EFE7D8] to-[#E8DFC8] dark:from-[#1A1613] dark:via-[#221D18] dark:to-[#171310] ${
        aspectRatio || ''
      } ${className}`}
      aria-hidden="true"
    >
      {/* Background Radial Ambient Gold Luminescence */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(245,215,127,0.35)_0%,rgba(197,155,39,0.08)_50%,transparent_80%)] dark:bg-[radial-gradient(circle_at_50%_45%,rgba(245,215,127,0.18)_0%,rgba(197,155,39,0.05)_50%,transparent_80%)]" />

      {/* Shimmer Sweep Wave */}
      <div className="absolute inset-0 shimmer-gold opacity-90" />

      {/* Diagonal Gold Light Beam Sweep */}
      <div className="gold-sweep-beam pointer-events-none" />

      {/* Gold Border Hairline Accent */}
      <div className="absolute inset-0 border border-[#C59B27]/25 pointer-events-none rounded-inherit" />

      {/* Subtle Corner Gold Flourishes */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C59B27]/40 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C59B27]/40 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C59B27]/40 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C59B27]/40 pointer-events-none" />

      {/* Center Monogram Seal with Animated Breathing Aura */}
      {showMonogram && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center select-none">
          <div className="relative flex items-center justify-center mb-2">
            <div className="absolute w-12 h-12 rounded-full bg-[#C59B27]/15 dark:bg-[#C59B27]/25 blur-md gold-ambient-glow" />
            <div className="w-10 h-10 rounded-full border border-[#C59B27]/60 bg-[#FFFDF9]/60 dark:bg-[#181411]/70 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Sparkles className={`${iconDimensions} text-[#8C6B1B] dark:text-[#F5D77F] animate-pulse`} />
            </div>
          </div>

          <span
            className={`font-cinzel ${textSize} tracking-[0.28em] uppercase text-[#7A5B12] dark:text-[#E8D59E] font-bold`}
          >
            {label}
          </span>

          <span className="text-[7px] font-sans-ui tracking-widest uppercase text-[#9C8775] dark:text-[#A69788] mt-1 font-medium">
            Maison Haute Couture
          </span>
        </div>
      )}
    </div>
  );
};
