import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Heart,
  ArrowRight,
  Check,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { CartItem, Product, ScreenType, Currency, ProductSize } from '../types';
import { formatPrice } from '../utils/currency';
import { ProductImage } from '../components/ProductImage';
import { hapticLight, hapticSuccess, hapticWarning, hapticWishlist } from '../utils/haptics';

interface CartScreenProps {
  cart: CartItem[];
  currency?: Currency;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct: (product: Product) => void;
  onProceedToCheckout: () => void;
  allProducts?: Product[];
  onAddToCart?: (product: Product, size?: ProductSize, color?: string) => void;
  wishlist?: string[];
  onToggleWishlist?: (product: Product) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  currency = 'INR',
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onSelectProduct,
  onProceedToCheckout,
  allProducts = [],
  onAddToCart,
  wishlist = [],
  onToggleWishlist
}) => {
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Compute dynamic personalized recommendations based on active items in cart
  const getPersonalizedRecommendations = (): { products: Product[]; rationale: string } => {
    if (allProducts.length === 0) return { products: [], rationale: '' };

    const cartProductIds = new Set(cart.map((ci) => ci.product.id));
    const cartCategories = new Set(cart.map((ci) => ci.product.category));

    // 1. Gather explicitly linked styleWith / completeLook items
    const linkedIds: string[] = [];
    cart.forEach((ci) => {
      if (ci.product.styleWithIds) {
        linkedIds.push(...ci.product.styleWithIds);
      }
    });

    const explicitlyLinked = allProducts.filter(
      (p) => linkedIds.includes(p.id) && !cartProductIds.has(p.id)
    );

    // 2. Recommend complementary categories
    // e.g. If cart contains Abayas, recommend Hijabs & luxury magnetic pins/accessories
    // If cart contains Pakistani festive, recommend Shawls, Dupattas, or complementary sets
    let complementary: Product[] = [];
    let rationale = 'Curated pieces specifically tailored to complement your selected silhouette';

    if (cartCategories.has('Abayas')) {
      complementary = allProducts.filter(
        (p) => (p.category === 'Hijabs' || p.category === 'Accessories') && !cartProductIds.has(p.id)
      );
      rationale = 'Complete your Abaya with coordinating pure silk and medina chiffon headwear';
    } else if (cartCategories.has('Pakistani')) {
      complementary = allProducts.filter(
        (p) => (p.category === 'Festive' || p.category === 'Hijabs' || p.category === 'Accessories') && !cartProductIds.has(p.id)
      );
      rationale = 'Atelier handcrafted shawls & dupattas styled to elevate your Pakistani festive ensemble';
    } else if (cartCategories.has('Hijabs')) {
      complementary = allProducts.filter(
        (p) => (p.category === 'Abayas' || p.category === 'Co-ords') && !cartProductIds.has(p.id)
      );
      rationale = 'Pair your silk hijabs with our signature lightweight everyday abayas & co-ords';
    }

    // Combine unique items: explicitly linked first, then complementary, then top picks
    const combinedMap = new Map<string, Product>();
    explicitlyLinked.forEach((p) => combinedMap.set(p.id, p));
    complementary.forEach((p) => {
      if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
    });

    if (combinedMap.size < 4) {
      allProducts
        .filter((p) => !cartProductIds.has(p.id))
        .forEach((p) => {
          if (combinedMap.size < 4 && !combinedMap.has(p.id)) {
            combinedMap.set(p.id, p);
          }
        });
    }

    return {
      products: Array.from(combinedMap.values()).slice(0, 4),
      rationale
    };
  };

  const { products: recommendedProducts, rationale: recRationale } =
    getPersonalizedRecommendations();

  const handleQuickAdd = (product: Product) => {
    hapticSuccess();
    if (onAddToCart) {
      onAddToCart(product, product.sizes[0] || 'M', product.colors[0] || 'Default');
    }
    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 2000);
  };

  if (cart.length === 0) {
    return (
      <div id="cart-screen-empty" className="w-full bg-[#FAF7F2] min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-[#F4EFE6] text-[#C59B27] rounded-full flex items-center justify-center mb-4 border border-[#E8E2D5]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="font-playfair text-2xl text-[#1E1A17]">Your Bag is Empty</h2>
        <p className="text-xs font-sans-ui text-[#6B635B] max-w-xs mt-2 leading-relaxed">
          Discover our handcrafted festive collection and add items to your wardrobe.
        </p>
        <button
          onClick={() => {
            hapticLight();
            onNavigate('shop');
          }}
          className="mt-6 px-8 py-3.5 bg-[#C59B27] hover:bg-[#B38A1E] text-[#1E1A17] text-xs font-semibold uppercase tracking-[0.2em] transition-colors rounded-xl shadow-md cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div id="cart-screen-view" className="w-full bg-[#FAF7F2] min-h-screen pb-24">
      <div className="max-w-md md:max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="font-playfair text-3xl font-normal text-[#1E1A17] tracking-tight">
            Shopping Bag
          </h1>
          <span className="text-xs font-cinzel text-[#8C6B1B] font-bold">
            {cart.reduce((total, item) => total + item.quantity, 0)} Items
          </span>
        </div>

        {/* Cart Items List */}
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}-${index}`}
              id={`cart-item-${index}`}
              className="bg-[#F4EFE6] dark:bg-[#1E1915] border border-[#E8E2D5] dark:border-[#2E2620] p-4 flex flex-col justify-between rounded-2xl shadow-2xs"
            >
              <div className="flex gap-4">
                {/* Product Thumbnail with ProductImage */}
                <div
                  onClick={() => {
                    hapticLight();
                    onSelectProduct(item.product);
                  }}
                  className="w-24 h-32 md:w-28 md:h-36 bg-[#FAF7F2] dark:bg-[#120F0D] border border-[#E8E2D5] dark:border-[#2E2620] overflow-hidden flex-shrink-0 cursor-pointer rounded-xl"
                >
                  <ProductImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    aspectRatio="aspect-3/4"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => {
                        hapticLight();
                        onSelectProduct(item.product);
                      }}
                      className="font-playfair text-base md:text-lg text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#947625] cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs font-sans-ui text-[#6B635B] dark:text-[#A69788] mt-1">
                      Color: {item.color}
                    </p>
                    <p className="text-xs font-sans-ui text-[#6B635B] dark:text-[#A69788] mt-0.5">
                      Size: {item.size}
                    </p>
                  </div>

                  {/* Quantity and Price Row */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Box */}
                    <div className="flex items-center bg-[#FAF7F2] dark:bg-[#28211A] border border-[#DED7CA] dark:border-[#3D332B] rounded-lg">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            hapticLight();
                            onUpdateQuantity(index, item.quantity - 1);
                          } else {
                            hapticWarning();
                            onRemoveItem(index);
                          }
                        }}
                        className="p-1.5 text-[#6B635B] hover:text-[#1E1A17] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span className="w-8 text-center text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          hapticLight();
                          onUpdateQuantity(index, item.quantity + 1);
                        }}
                        className="p-1.5 text-[#6B635B] hover:text-[#1E1A17] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <span className="font-playfair text-base md:text-lg text-[#1E1A17] dark:text-[#FAF7F2] font-semibold">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="mt-8 bg-[#F4EFE6] dark:bg-[#1E1915] border border-[#E8E2D5] dark:border-[#2E2620] p-6 shadow-2xs rounded-2xl">
          <h2 className="font-playfair text-xl text-[#1E1A17] dark:text-[#FAF7F2] mb-5">Order Summary</h2>

          <div className="space-y-3 text-xs font-sans-ui text-[#594F45] dark:text-[#C5BAAC]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#1E1A17] dark:text-[#FAF7F2] font-medium">{formatPrice(subtotal, currency)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-800 dark:text-[#38D39F] font-semibold uppercase tracking-wider">Free Priority Air</span>
            </div>

            <div className="flex justify-between">
              <span>Taxes & Duties</span>
              <span className="text-[#8C7E72]">Included in Atelier Price</span>
            </div>

            <div className="pt-4 border-t border-[#E8E2D5] dark:border-[#2E2620] flex justify-between items-center text-sm md:text-base font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
              <span>Total</span>
              <span className="font-playfair text-lg md:text-xl text-[#8C6B1B] dark:text-[#E8D59E]">
                {formatPrice(subtotal, currency)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            id="proceed-to-checkout-btn"
            onClick={() => {
              hapticSuccess();
              onProceedToCheckout();
            }}
            className="mt-6 w-full py-4 bg-[#181411] hover:bg-[#2C2622] text-[#F5D77F] border border-[#C59B27] font-sans-ui text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-md active:scale-99 rounded-xl cursor-pointer"
          >
            PROCEED TO CHECKOUT
          </button>

          {/* Secure Checkout Note */}
          <div className="mt-3 text-center">
            <span className="text-[11px] font-sans-ui text-[#8C7E72] tracking-wider">
              256-Bit SSL Encrypted Checkout • White-Glove Dispatch
            </span>
          </div>
        </div>

        {/* Personalized Dynamic Recommendation Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#E8DFC8] dark:border-[#2E2620]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
              <div>
                <div className="flex items-center gap-2 text-[#8C6B1B] dark:text-[#D4AF37] text-xs font-cinzel font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  Personalized Style Pairings
                </div>
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#1E1A17] dark:text-[#FAF7F2] mt-1">
                  Complete Your Look
                </h3>
                <p className="text-xs text-[#7A6B5D] dark:text-[#A69788] font-sans-ui mt-0.5">
                  {recRationale}
                </p>
              </div>

              <button
                onClick={() => {
                  hapticLight();
                  onNavigate('shop');
                }}
                className="text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                View Full Catalog <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recommendation Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((prod, idx) => {
                const isWish = wishlist.includes(prod.id);
                const isJustAdded = quickAddedId === prod.id;

                return (
                  <div
                    key={`cart-rec-${prod.id}-${idx}`}
                    className="group bg-[#F4EFE6] dark:bg-[#1E1915] border border-[#E8E2D5] dark:border-[#2E2620] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-3/4 overflow-hidden bg-[#FAF7F2] dark:bg-[#120F0D]">
                      <div
                        onClick={() => {
                          hapticLight();
                          onSelectProduct(prod);
                        }}
                        className="w-full h-full cursor-pointer"
                      >
                        <ProductImage
                          src={prod.images[0]}
                          alt={prod.name}
                          aspectRatio="aspect-3/4"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Wishlist Button */}
                      {onToggleWishlist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            hapticWishlist();
                            onToggleWishlist(prod);
                          }}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 dark:bg-[#181411]/90 backdrop-blur-xs text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#C59B27] flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                          title="Save to Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isWish ? 'fill-[#C59B27] text-[#C59B27]' : ''
                            }`}
                          />
                        </button>
                      )}

                      {/* Category Tag */}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#14100D]/80 backdrop-blur-xs text-[#E8D59E] text-[9px] font-cinzel font-semibold uppercase tracking-wider rounded-md">
                        {prod.category}
                      </span>
                    </div>

                    <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
                      <div>
                        <h4
                          onClick={() => {
                            hapticLight();
                            onSelectProduct(prod);
                          }}
                          className="font-playfair text-xs sm:text-sm font-semibold text-[#1E1A17] dark:text-[#FAF7F2] hover:text-[#8C6B1B] cursor-pointer line-clamp-1"
                        >
                          {prod.name}
                        </h4>
                        <p className="font-serif text-xs font-bold text-[#8C6B1B] dark:text-[#D4AF37] mt-0.5">
                          {formatPrice(prod.price, currency)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(prod)}
                        className={`w-full py-2 rounded-xl text-[11px] font-cinzel font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isJustAdded
                            ? 'bg-[#0E3827] text-[#38D39F] border border-[#25D366]/50'
                            : 'bg-[#181411] hover:bg-[#2A231D] text-[#FAF7F2] border border-[#C59B27]/60 shadow-2xs active:scale-98'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#25D366]" />
                            Added to Bag
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                            + Add to Bag
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
