import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface GlobalLoadingIndicatorProps {
  isLoading: boolean;
  message?: string;
}

export const GlobalLoadingIndicator: React.FC<GlobalLoadingIndicatorProps> = ({
  isLoading,
  message = 'Loading Haute Couture Catalog & Atelier Data...'
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          id="global-loading-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2]/80 dark:bg-[#120F0D]/80 backdrop-blur-md"
        >
          <div className="flex flex-col items-center max-w-sm px-6 py-8 text-center">
            {/* Luxury Animated Monogram & Spinner */}
            <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
              {/* Outer Golden Spinner Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#C59B27]/20 border-t-[#C59B27] animate-spin" />
              <div className="absolute inset-2 rounded-full border border-[#D4AF37]/30 border-b-[#D4AF37] animate-spin [animation-direction:reverse] [animation-duration:3s]" />
              
              {/* Center Luxury Emblem */}
              <div className="w-12 h-12 rounded-full bg-[#1E1A17] dark:bg-[#1E1915] border border-[#C59B27]/50 flex items-center justify-center shadow-md">
                <span className="font-cinzel text-sm font-bold text-[#D4AF37] tracking-wider">
                  AN
                </span>
              </div>
            </div>

            {/* Brand Title */}
            <h4 className="font-playfair text-xl font-bold text-[#1E1A17] dark:text-[#FAF7F2] tracking-wide">
              AL NOUREEN
            </h4>
            <p className="font-cinzel text-[10px] tracking-[0.25em] text-[#C59B27] uppercase mt-0.5 mb-3">
              Haute Couture & Atelier
            </p>

            {/* Loading text with shimmer */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-sans-ui text-[#8C7E72] dark:text-[#A89A8D]">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27] animate-pulse" />
              <span>{message}</span>
            </div>

            {/* Progress bar shimmer */}
            <div className="w-48 h-1 bg-[#E8E2D5] dark:bg-[#2E2620] rounded-full overflow-hidden mt-4">
              <div className="w-full h-full bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#C59B27] animate-[shimmer_1.5s_infinite] -translate-x-full" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
