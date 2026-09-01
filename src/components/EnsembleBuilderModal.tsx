import React, { useState, useMemo } from 'react';
import { Product, ProductSize, Currency, EnsembleSelection } from '../types';
import { ProductImage } from './ProductImage';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import {
  X,
  Sparkles,
  ShoppingBag,
  Heart,
  Layers,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Share2,
  CheckCircle2,
  Scissors,
  Wand2,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface EnsembleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product, size?: ProductSize, color?: string) => void;
  onSelectProduct: (product: Product) => void;
  initialProduct?: Product;
}

type SlotType = 'main' | 'hijab' | 'bag' | 'accessory';

export const EnsembleBuilderModal: React.FC<EnsembleBuilderModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onAddToCart,
  onSelectProduct,
  initialProduct
}) => {
  // Preset Looks Definitions
  const presetLooks = useMemo(
    () => [
      {
        id: 'preset-royal-nikah',
        name: 'The Royal Nikah Bride',
        description: 'Emerald Zardozi Anarkali with Sage Chiffon & Pearl Potli',
        mainId: 'emerald-zardozi-anarkali-suit',
        hijabId: 'sage-chiffon-luxury-hijab',
        bagId: 'ivory-pearl-tassel-potli',
        accessoryId: 'calligraphy-gold-cuff'
      },
      {
        id: 'preset-noor-abaya',
        name: 'The Noor Minimalist Abaya',
        description: 'Pleated Nida Abaya with Champagne Silk & Crescent Bag',
        mainId: 'noir-pleated-open-abaya',
        hijabId: 'champagne-pure-silk-hijab',
        bagId: 'structured-crescent-leather-bag',
        accessoryId: 'matte-gold-magnetic-pins-pack'
      },
      {
        id: 'preset-rose-dust',
        name: 'The Rose Dust High Tea',
        description: 'Raw Silk Co-ord with Rosewood Modal & Velvet Clutch',
        mainId: 'rose-dust-raw-silk-coord',
        hijabId: 'rosewood-modal-hijab',
        bagId: 'velvet-embroidered-evening-clutch',
        accessoryId: 'brushed-gold-calligraphy-earrings'
      },
      {
        id: 'preset-desert-linen',
        name: 'Desert Dune Safari & Travel',
        description: 'Organic Linen Kimono with Taupe Jersey & Metallic Minaudière',
        mainId: 'sand-dune-linen-kimono-abaya',
        hijabId: 'taupe-ribbed-jersey-hijab',
        bagId: 'handwoven-metallic-minaudiere',
        accessoryId: 'filigree-pearl-bangle'
      }
    ],
    []
  );

  // Active Category Tray Tab
  const [activeSlotTab, setActiveSlotTab] = useState<SlotType>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [sizeForMain, setSizeForMain] = useState<ProductSize>('M');

  // Equipped Ensemble State
  const [ensemble, setEnsemble] = useState<EnsembleSelection>(() => {
    if (initialProduct) {
      if (initialProduct.category === 'Pakistani' || initialProduct.category === 'Abayas' || initialProduct.category === 'Modest Wear') {
        const matchingHijab = products.find((p) => p.category === 'Hijabs');
        const matchingBag = products.find((p) => p.category === 'Bags');
        const matchingAcc = products.find((p) => p.category === 'Accessories');
        return {
          mainOutfit: initialProduct,
          mainOutfitSize: initialProduct.sizes[0] || 'M',
          mainOutfitColor: initialProduct.colors[0],
          hijab: matchingHijab,
          hijabColor: matchingHijab?.colors[0],
          bag: matchingBag,
          bagColor: matchingBag?.colors[0],
          accessory: matchingAcc,
          accessoryColor: matchingAcc?.colors[0]
        };
      }
    }
    // Default initial ensemble
    const main = products.find((p) => p.id === 'emerald-zardozi-anarkali-suit') || products[0];
    const hijab = products.find((p) => p.id === 'sage-chiffon-luxury-hijab') || products.find((p) => p.category === 'Hijabs');
    const bag = products.find((p) => p.id === 'ivory-pearl-tassel-potli') || products.find((p) => p.category === 'Bags');
    const acc = products.find((p) => p.id === 'calligraphy-gold-cuff') || products.find((p) => p.category === 'Accessories');

    return {
      mainOutfit: main,
      mainOutfitSize: 'M',
      mainOutfitColor: main?.colors[0],
      hijab: hijab,
      hijabColor: hijab?.colors[0],
      bag: bag,
      bagColor: bag?.colors[0],
      accessory: acc,
      accessoryColor: acc?.colors[0]
    };
  });

  // Categorized Pools
  const mainOutfitPool = useMemo(
    () =>
      products.filter(
        (p) =>
          p.category === 'Pakistani' ||
          p.category === 'Abayas' ||
          p.category === 'Modest Wear' ||
          p.category === 'Co-ord Sets' ||
          p.category === 'Tunics'
      ),
    [products]
  );

  const hijabPool = useMemo(() => products.filter((p) => p.category === 'Hijabs'), [products]);
  const bagPool = useMemo(() => products.filter((p) => p.category === 'Bags'), [products]);
  const accessoryPool = useMemo(
    () => products.filter((p) => p.category === 'Accessories'),
    [products]
  );

  // Filter items in current active tray
  const currentPool = useMemo(() => {
    let pool: Product[] = [];
    if (activeSlotTab === 'main') pool = mainOutfitPool;
    else if (activeSlotTab === 'hijab') pool = hijabPool;
    else if (activeSlotTab === 'bag') pool = bagPool;
    else if (activeSlotTab === 'accessory') pool = accessoryPool;

    if (!searchQuery.trim()) return pool;
    const q = searchQuery.toLowerCase();
    return pool.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [activeSlotTab, mainOutfitPool, hijabPool, bagPool, accessoryPool, searchQuery]);

  // Pricing calculations
  const equippedCount = [
    ensemble.mainOutfit,
    ensemble.hijab,
    ensemble.bag,
    ensemble.accessory
  ].filter(Boolean).length;

  const rawTotal =
    (ensemble.mainOutfit?.price || 0) +
    (ensemble.hijab?.price || 0) +
    (ensemble.bag?.price || 0) +
    (ensemble.accessory?.price || 0);

  // 15% Atelier Bundle Discount when 2 or more slots equipped
  const discountPercent = equippedCount >= 2 ? 15 : 0;
  const savings = Math.round(rawTotal * (discountPercent / 100));
  const finalBundlePrice = rawTotal - savings;

  // Equip an item to the active slot or specific slot
  const handleEquipItem = (product: Product, slotOverride?: SlotType) => {
    hapticLight();
    const targetSlot = slotOverride || activeSlotTab;

    if (targetSlot === 'main') {
      setEnsemble((prev) => ({
        ...prev,
        mainOutfit: product,
        mainOutfitColor: product.colors[0],
        mainOutfitSize: product.sizes[0] || 'M'
      }));
      setSizeForMain(product.sizes[0] || 'M');
    } else if (targetSlot === 'hijab') {
      setEnsemble((prev) => ({
        ...prev,
        hijab: product,
        hijabColor: product.colors[0]
      }));
    } else if (targetSlot === 'bag') {
      setEnsemble((prev) => ({
        ...prev,
        bag: product,
        bagColor: product.colors[0]
      }));
    } else if (targetSlot === 'accessory') {
      setEnsemble((prev) => ({
        ...prev,
        accessory: product,
        accessoryColor: product.colors[0]
      }));
    }
  };

  const handleRemoveSlot = (slot: SlotType) => {
    hapticLight();
    if (slot === 'main') setEnsemble((prev) => ({ ...prev, mainOutfit: undefined }));
    if (slot === 'hijab') setEnsemble((prev) => ({ ...prev, hijab: undefined }));
    if (slot === 'bag') setEnsemble((prev) => ({ ...prev, bag: undefined }));
    if (slot === 'accessory') setEnsemble((prev) => ({ ...prev, accessory: undefined }));
  };

  const handleApplyPreset = (preset: (typeof presetLooks)[0]) => {
    hapticLight();
    const main = products.find((p) => p.id === preset.mainId);
    const hijab = products.find((p) => p.id === preset.hijabId);
    const bag = products.find((p) => p.id === preset.bagId);
    const acc = products.find((p) => p.id === preset.accessoryId);

    setEnsemble({
      mainOutfit: main,
      mainOutfitSize: 'M',
      mainOutfitColor: main?.colors[0],
      hijab: hijab,
      hijabColor: hijab?.colors[0],
      bag: bag,
      bagColor: bag?.colors[0],
      accessory: acc,
      accessoryColor: acc?.colors[0]
    });
  };

  const handleAddEnsembleToBag = () => {
    hapticSuccess();
    if (ensemble.mainOutfit) {
      onAddToCart(ensemble.mainOutfit, sizeForMain, ensemble.mainOutfitColor);
    }
    if (ensemble.hijab) {
      onAddToCart(ensemble.hijab, 'Free Size', ensemble.hijabColor);
    }
    if (ensemble.bag) {
      onAddToCart(ensemble.bag, 'One Size', ensemble.bagColor);
    }
    if (ensemble.accessory) {
      onAddToCart(ensemble.accessory, 'One Size', ensemble.accessoryColor);
    }
    onClose();
  };

  const handleShareLook = () => {
    hapticLight();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Drag & Drop handlers for canvas
  const handleDragStart = (e: React.DragEvent, product: Product, slotType: SlotType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ product, slotType }));
  };

  const handleDrop = (e: React.DragEvent, targetSlot: SlotType) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const { product, slotType } = JSON.parse(dataStr);
        handleEquipItem(product, targetSlot);
      }
    } catch (err) {
      console.error('Drag drop error:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div
      id="ensemble-builder-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#FAF7F2] dark:bg-[#181411] rounded-3xl border border-[#C59B27]/40 shadow-2xl flex flex-col overflow-hidden text-[#1E1A17] dark:text-[#FAF7F2]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFC8] dark:border-[#2E2620] bg-[#FAF7F2] dark:bg-[#181411] z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#181411] border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shadow-sm">
              <Layers className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-widest">
                  Atelier Dressing Room
                </span>
                <span className="px-2 py-0.2 rounded-full bg-[#C59B27]/20 border border-[#C59B27]/50 text-[#8C6B1B] dark:text-[#E8D59E] text-[9.5px] font-bold">
                  15% Bundle VIP Savings
                </span>
              </div>
              <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                Interactive "Mix & Match" Ensemble Builder
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLook}
              className="p-2 rounded-full hover:bg-[#EAE2D4] dark:hover:bg-[#2B231D] text-[#8C6B1B] dark:text-[#E8D59E] transition-colors"
              title="Share / Copy Look"
            >
              {copiedLink ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EAE2D4] dark:hover:bg-[#2B231D] text-[#7A6B5D] dark:text-[#A69788] hover:text-[#181411] dark:hover:text-white transition-colors"
              aria-label="Close Ensemble Builder"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Presets Ribbon */}
        <div className="px-6 py-2.5 bg-[#F0EAE0] dark:bg-[#120F0D] border-b border-[#E8DFC8] dark:border-[#2E2620] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#8C7A6B] font-bold flex items-center gap-1 shrink-0">
            <Wand2 className="w-3 h-3 text-[#C59B27]" /> Stylist Presets:
          </span>
          {presetLooks.map((preset, pIdx) => (
            <button
              key={`ensemble-preset-${preset.id}-${pIdx}`}
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1 bg-[#FAF7F2] dark:bg-[#241E19] hover:bg-[#E8DFC8] dark:hover:bg-[#342B23] border border-[#DDD3BC] dark:border-[#3B3026] text-[#1E1A17] dark:text-[#E8D59E] rounded-full text-[11px] font-sans-ui whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" />
              {preset.name}
            </button>
          ))}
        </div>

        {/* Main Grid: Left Canvas & Right Product Selector Tray */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
          {/* Left Canvas: Interactive Mannequin Slots (5 cols) */}
          <div className="lg:col-span-6 p-4 sm:p-6 bg-[#F7F3EB] dark:bg-[#151210] border-r border-[#E8DFC8] dark:border-[#2E2620] flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Equipped Ensemble Slots ({equippedCount}/4)
                </span>
                <span className="text-[10.5px] text-[#7A6B5D] dark:text-[#A69788]">
                  Click or drag items to customize
                </span>
              </div>

              {/* 4 Interactive Slots Matrix */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Main Outfit Slot */}
                <div
                  onDrop={(e) => handleDrop(e, 'main')}
                  onDragOver={handleDragOver}
                  onClick={() => setActiveSlotTab('main')}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between aspect-4/5 ${
                    activeSlotTab === 'main'
                      ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#201A16] shadow-md ring-2 ring-[#C59B27]/30'
                      : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#FAF7F2]/80 dark:bg-[#1B1613]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9.5px] font-cinzel font-bold uppercase tracking-wider text-[#C59B27] flex items-center gap-1">
                      1. Main Garment
                    </span>
                    {ensemble.mainOutfit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSlot('main');
                        }}
                        className="p-1 text-[#8C7A6B] hover:text-red-500 transition-colors"
                        title="Remove Piece"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {ensemble.mainOutfit ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#181411] mb-2 relative">
                        <ProductImage
                          src={ensemble.mainOutfit.images[0]}
                          alt={ensemble.mainOutfit.name}
                          aspectRatio="aspect-square"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                          {ensemble.mainOutfit.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E]">
                            {formatPrice(ensemble.mainOutfit.price, currency)}
                          </span>
                          <span className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] truncate">
                            {ensemble.mainOutfitColor || ensemble.mainOutfit.colors[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-3 border-2 border-dashed border-[#DDD3BC] dark:border-[#3B3026] rounded-xl">
                      <Plus className="w-6 h-6 text-[#C59B27] mb-1" />
                      <span className="text-xs font-semibold text-[#8C7A6B]">Select Main Outfit</span>
                      <span className="text-[9.5px] text-[#A69788]">Anarkali, Abaya or Co-ord</span>
                    </div>
                  )}
                </div>

                {/* 2. Silk Hijab / Veil Slot */}
                <div
                  onDrop={(e) => handleDrop(e, 'hijab')}
                  onDragOver={handleDragOver}
                  onClick={() => setActiveSlotTab('hijab')}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between aspect-4/5 ${
                    activeSlotTab === 'hijab'
                      ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#201A16] shadow-md ring-2 ring-[#C59B27]/30'
                      : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#FAF7F2]/80 dark:bg-[#1B1613]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9.5px] font-cinzel font-bold uppercase tracking-wider text-[#C59B27] flex items-center gap-1">
                      2. Pure Silk Veil
                    </span>
                    {ensemble.hijab && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSlot('hijab');
                        }}
                        className="p-1 text-[#8C7A6B] hover:text-red-500 transition-colors"
                        title="Remove Piece"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {ensemble.hijab ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#181411] mb-2">
                        <ProductImage
                          src={ensemble.hijab.images[0]}
                          alt={ensemble.hijab.name}
                          aspectRatio="aspect-square"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                          {ensemble.hijab.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E]">
                            {formatPrice(ensemble.hijab.price, currency)}
                          </span>
                          <span className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] truncate">
                            {ensemble.hijabColor || ensemble.hijab.colors[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-3 border-2 border-dashed border-[#DDD3BC] dark:border-[#3B3026] rounded-xl">
                      <Plus className="w-6 h-6 text-[#C59B27] mb-1" />
                      <span className="text-xs font-semibold text-[#8C7A6B]">Select Pure Silk Veil</span>
                      <span className="text-[9.5px] text-[#A69788]">Mulberry Silk or Chiffon</span>
                    </div>
                  )}
                </div>

                {/* 3. Luxury Bag / Potli Slot */}
                <div
                  onDrop={(e) => handleDrop(e, 'bag')}
                  onDragOver={handleDragOver}
                  onClick={() => setActiveSlotTab('bag')}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between aspect-4/5 ${
                    activeSlotTab === 'bag'
                      ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#201A16] shadow-md ring-2 ring-[#C59B27]/30'
                      : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#FAF7F2]/80 dark:bg-[#1B1613]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9.5px] font-cinzel font-bold uppercase tracking-wider text-[#C59B27] flex items-center gap-1">
                      3. Handcrafted Bag
                    </span>
                    {ensemble.bag && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSlot('bag');
                        }}
                        className="p-1 text-[#8C7A6B] hover:text-red-500 transition-colors"
                        title="Remove Piece"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {ensemble.bag ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#181411] mb-2">
                        <ProductImage
                          src={ensemble.bag.images[0]}
                          alt={ensemble.bag.name}
                          aspectRatio="aspect-square"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                          {ensemble.bag.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E]">
                            {formatPrice(ensemble.bag.price, currency)}
                          </span>
                          <span className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] truncate">
                            {ensemble.bagColor || ensemble.bag.colors[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-3 border-2 border-dashed border-[#DDD3BC] dark:border-[#3B3026] rounded-xl">
                      <Plus className="w-6 h-6 text-[#C59B27] mb-1" />
                      <span className="text-xs font-semibold text-[#8C7A6B]">Select Evening Bag</span>
                      <span className="text-[9.5px] text-[#A69788]">Pearl Potli or Minaudière</span>
                    </div>
                  )}
                </div>

                {/* 4. Fine Jewelry & Brooches Slot */}
                <div
                  onDrop={(e) => handleDrop(e, 'accessory')}
                  onDragOver={handleDragOver}
                  onClick={() => setActiveSlotTab('accessory')}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between aspect-4/5 ${
                    activeSlotTab === 'accessory'
                      ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#201A16] shadow-md ring-2 ring-[#C59B27]/30'
                      : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#FAF7F2]/80 dark:bg-[#1B1613]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9.5px] font-cinzel font-bold uppercase tracking-wider text-[#C59B27] flex items-center gap-1">
                      4. Haute Jewelry
                    </span>
                    {ensemble.accessory && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSlot('accessory');
                        }}
                        className="p-1 text-[#8C7A6B] hover:text-red-500 transition-colors"
                        title="Remove Piece"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {ensemble.accessory ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#181411] mb-2">
                        <ProductImage
                          src={ensemble.accessory.images[0]}
                          alt={ensemble.accessory.name}
                          aspectRatio="aspect-square"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] truncate">
                          {ensemble.accessory.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E]">
                            {formatPrice(ensemble.accessory.price, currency)}
                          </span>
                          <span className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] truncate">
                            {ensemble.accessoryColor || ensemble.accessory.colors[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-3 border-2 border-dashed border-[#DDD3BC] dark:border-[#3B3026] rounded-xl">
                      <Plus className="w-6 h-6 text-[#C59B27] mb-1" />
                      <span className="text-xs font-semibold text-[#8C7A6B]">Select Jewelry Accent</span>
                      <span className="text-[9.5px] text-[#A69788]">Cuff, Pins or Bangle</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stylist Color & Harmony Tip */}
              <div className="p-3.5 bg-[#FAF7F2] dark:bg-[#1E1A17] border border-[#DDD3BC] dark:border-[#2E2620] rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Atelier Harmony Insight
                </div>
                <p className="text-[11px] text-[#5E5043] dark:text-[#C5BAAC] leading-relaxed">
                  {ensemble.mainOutfit?.name && ensemble.hijab?.name
                    ? `Pairing "${ensemble.mainOutfit.name}" with "${ensemble.hijab.name}" creates a balanced modest drape with fluid texture resonance.`
                    : 'Select both a main outfit and silk veil to unlock harmonious tone-on-tone recommendations from our master stylists.'}
                </p>
              </div>
            </div>

            {/* Bottom Ensemble Pricing & Checkout Action */}
            <div className="mt-4 pt-4 border-t border-[#DDD3BC] dark:border-[#2E2620] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A6B5D] dark:text-[#A69788]">
                  <span>Itemized Pieces Subtotal ({equippedCount} items)</span>
                  <span>{formatPrice(rawTotal, currency)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Atelier Ensemble VIP Discount ({discountPercent}%)
                    </span>
                    <span>-{formatPrice(savings, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] pt-1 border-t border-[#E8DFC8] dark:border-[#2E2620]">
                  <span>Ensemble Price</span>
                  <span className="text-[#8C6B1B] dark:text-[#E8D59E]">{formatPrice(finalBundlePrice, currency)}</span>
                </div>
              </div>

              {/* Main Size Selector if main outfit equipped */}
              {ensemble.mainOutfit && ensemble.mainOutfit.sizes.length > 0 && (
                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-[11px] font-cinzel uppercase text-[#8C7A6B] font-bold">
                    Garment Size:
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {ensemble.mainOutfit.sizes.map((s, sIdx) => (
                      <button
                        key={`ensemble-size-${ensemble.mainOutfit?.id || 'outfit'}-${s}-${sIdx}`}
                        onClick={() => setSizeForMain(s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          sizeForMain === s
                            ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27]'
                            : 'bg-[#FAF7F2] dark:bg-[#241E19] text-[#7A6B5D] dark:text-[#A69788] border border-[#DDD3BC] dark:border-[#3B3026]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={equippedCount === 0}
                onClick={handleAddEnsembleToBag}
                className="w-full py-3.5 px-4 bg-[#C59B27] hover:bg-[#D4AF37] disabled:opacity-50 text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Complete Ensemble to Bag ({formatPrice(finalBundlePrice, currency)})</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Piece Selector Tray with Tabs & Search (6 cols) */}
          <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto bg-[#FAF7F2] dark:bg-[#181411]">
            <div className="space-y-4">
              {/* Category Filter Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F0EAE0] dark:bg-[#120F0D] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                <button
                  onClick={() => setActiveSlotTab('main')}
                  className={`py-2 px-1 text-center rounded-xl text-[10.5px] font-cinzel font-bold transition-all ${
                    activeSlotTab === 'main'
                      ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27] shadow-xs'
                      : 'text-[#7A6B5D] dark:text-[#A69788] hover:text-[#181411] dark:hover:text-white'
                  }`}
                >
                  Outfits ({mainOutfitPool.length})
                </button>
                <button
                  onClick={() => setActiveSlotTab('hijab')}
                  className={`py-2 px-1 text-center rounded-xl text-[10.5px] font-cinzel font-bold transition-all ${
                    activeSlotTab === 'hijab'
                      ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27] shadow-xs'
                      : 'text-[#7A6B5D] dark:text-[#A69788] hover:text-[#181411] dark:hover:text-white'
                  }`}
                >
                  Veils ({hijabPool.length})
                </button>
                <button
                  onClick={() => setActiveSlotTab('bag')}
                  className={`py-2 px-1 text-center rounded-xl text-[10.5px] font-cinzel font-bold transition-all ${
                    activeSlotTab === 'bag'
                      ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27] shadow-xs'
                      : 'text-[#7A6B5D] dark:text-[#A69788] hover:text-[#181411] dark:hover:text-white'
                  }`}
                >
                  Bags ({bagPool.length})
                </button>
                <button
                  onClick={() => setActiveSlotTab('accessory')}
                  className={`py-2 px-1 text-center rounded-xl text-[10.5px] font-cinzel font-bold transition-all ${
                    activeSlotTab === 'accessory'
                      ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27] shadow-xs'
                      : 'text-[#7A6B5D] dark:text-[#A69788] hover:text-[#181411] dark:hover:text-white'
                  }`}
                >
                  Jewelry ({accessoryPool.length})
                </button>
              </div>

              {/* Search Bar inside tray */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeSlotTab === 'main' ? 'anarkalis, abayas, sets...' : activeSlotTab === 'hijab' ? 'silk veils, shaylas...' : activeSlotTab === 'bag' ? 'potlis, clutches...' : 'jewelry & pins...'}`}
                  className="w-full px-4 py-2 text-xs bg-[#F0EAE0] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-[#1E1A17] dark:text-[#FAF7F2] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C59B27]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-[#8C7A6B] hover:text-[#181411]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Product Grid in Tray */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {currentPool.map((product, prodIdx) => {
                  const isEquipped =
                    ensemble.mainOutfit?.id === product.id ||
                    ensemble.hijab?.id === product.id ||
                    ensemble.bag?.id === product.id ||
                    ensemble.accessory?.id === product.id;

                  return (
                    <div
                      key={`ensemble-prod-${product.id}-${prodIdx}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, product, activeSlotTab)}
                      onClick={() => handleEquipItem(product)}
                      className={`group relative p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isEquipped
                          ? 'border-[#C59B27] bg-[#EAE2D4]/50 dark:bg-[#2B231D] ring-2 ring-[#C59B27]/40 shadow-sm'
                          : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#FAF7F2] dark:bg-[#1B1613] hover:border-[#C59B27]/60'
                      }`}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#181411] mb-2">
                        <ProductImage
                          src={product.images[0]}
                          alt={product.name}
                          aspectRatio="aspect-square"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isEquipped && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C59B27] text-[#181411] flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-serif text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] line-clamp-1 group-hover:text-[#C59B27] transition-colors">
                          {product.name}
                        </h5>
                        <p className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] line-clamp-1">
                          {product.fabric}
                        </p>
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="font-cinzel font-bold text-[#8C6B1B] dark:text-[#E8D59E]">
                            {formatPrice(product.price, currency)}
                          </span>
                          <span className="text-[9px] font-cinzel font-bold text-[#C59B27] uppercase group-hover:underline">
                            {isEquipped ? 'Equipped' : '+ Equip'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8DFC8] dark:border-[#2E2620] flex items-center justify-between text-[11px] text-[#7A6B5D] dark:text-[#A69788]">
              <span>💡 Tip: You can drag any piece directly onto the slots on the left.</span>
              <button
                onClick={() => {
                  setEnsemble({});
                }}
                className="text-[#8C7A6B] hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Slots
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
