import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
  aspectRatio?: string;
  showMonogram?: boolean;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  showMonogram = true,
  priority = false,
  style,
  onClick,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached in browser on mount
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoaded(false);
    setHasError(true);
  };

  return (
    <div
      className={`relative overflow-hidden ${aspectRatio || ''} ${containerClassName}`}
      onClick={onClick}
    >
      {/* Luxury Gold Shimmer Loading Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F4EFE6] via-[#EFE7D8] to-[#E8DFC8] dark:from-[#1A1613] dark:via-[#221D18] dark:to-[#171310] select-none"
          aria-hidden="true"
        >
          {/* Radial Ambient Gold Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(245,215,127,0.35)_0%,rgba(197,155,39,0.08)_50%,transparent_80%)] dark:bg-[radial-gradient(circle_at_50%_45%,rgba(245,215,127,0.18)_0%,rgba(197,155,39,0.05)_50%,transparent_80%)]" />

          {/* Animated Gold Shimmer Wave */}
          <div className="absolute inset-0 shimmer-gold opacity-90" />

          {/* Diagonal Gold Light Beam */}
          <div className="gold-sweep-beam pointer-events-none" />

          {/* Gold Border Hairline Accent */}
          <div className="absolute inset-0 border border-[#C59B27]/25 pointer-events-none" />

          {/* Subtle Atelier Center Monogram */}
          {showMonogram && (
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 opacity-65">
              <div className="w-8 h-8 rounded-full border border-[#C59B27]/60 bg-[#FFFDF9]/60 dark:bg-[#181411]/70 backdrop-blur-xs flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-[#8C6B1B] dark:text-[#F5D77F] animate-pulse" />
              </div>
              <span className="font-cinzel text-[8px] tracking-[0.25em] uppercase text-[#7A5B12] dark:text-[#E8D59E] font-bold">
                AL-NOUREEN
              </span>
            </div>
          )}
        </div>
      )}

      {/* Fallback Display if image fails to load */}
      {hasError && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#F2ECE0] dark:bg-[#1F1A16] text-[#8C7A6B] p-4 text-center border border-[#DDD3BC]/40">
          <ImageIcon className="w-6 h-6 text-[#C59B27] mb-1 opacity-70" />
          <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#1E1A17] dark:text-[#E8D59E] font-bold">
            AL-NOUREEN
          </span>
          <span className="text-[8px] font-sans-ui text-[#8C7A6B] truncate max-w-full">
            {alt || 'Artisanal Creation'}
          </span>
        </div>
      )}

      {/* Actual Image with smooth fade-in */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        style={style}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
