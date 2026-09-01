import React from 'react';
import { Collection, ScreenType } from '../types';
import { ProductImage } from '../components/ProductImage';

interface CollectionsScreenProps {
  collections: Collection[];
  onSelectCollection: (category: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  collections,
  onSelectCollection,
  onNavigate
}) => {
  return (
    <div id="collections-screen-view" className="w-full bg-[#FAF7F2] dark:bg-[#120F0D] min-h-screen">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-4 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl font-normal text-[#1E1A17] dark:text-[#FAF7F2] tracking-tight">
          Collections
        </h1>
        <p className="font-sans-ui text-xs md:text-sm text-[#6B635B] dark:text-[#A69788] leading-relaxed max-w-md mx-auto mt-3 font-light">
          Immerse yourself in our curated capsule edits, weaving centuries-old artisanal traditions with visionary contemporary cuts.
        </p>
      </div>

      <div className="max-w-md md:max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-8">
        {collections.map((col, idx) => (
          <div
            key={`collection-${col.id}-${idx}`}
            id={`collection-card-${col.id}`}
            onClick={() => onSelectCollection(col.title)}
            className="relative w-full h-[380px] md:h-[460px] overflow-hidden group cursor-pointer shadow-xs border border-[#E8E2D5] dark:border-[#2E2620] bg-[#181411]"
          >
            <ProductImage
              src={col.image}
              alt={col.title}
              aspectRatio="aspect-auto"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-10 pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 text-left z-20">
              <span className="text-[10px] font-sans-ui uppercase tracking-[0.25em] text-[#E8D59E] font-medium">
                {col.productCount} CURATED PIECES
              </span>
              <h3 className="font-playfair text-2xl md:text-3xl text-[#FAF7F2] mt-1 drop-shadow-md">
                {col.title}
              </h3>
              <p className="text-xs font-sans-ui text-[#FAF7F2]/80 mt-1 line-clamp-2">
                {col.tagline}
              </p>
              <div className="mt-3 inline-flex items-center text-[10px] font-sans-ui uppercase tracking-[0.2em] text-[#E8D59E] border-b border-[#E8D59E] pb-0.5 group-hover:text-white group-hover:border-white transition-colors">
                Explore Capsule
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
