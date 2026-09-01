export type ProductCategory =
  | 'Pakistani'
  | 'Abayas'
  | 'Hijabs'
  | 'Modest Wear'
  | 'Co-ord Sets'
  | 'Tunics'
  | 'Accessories'
  | 'Bags'
  | 'All';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size' | 'One Size' | 'Custom' | '52"' | '54"' | '56"' | '58"' | '60"';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  fitRating?: 'Runs Small' | 'True to Size' | 'Runs Large';
  userImage?: string;
  productName?: string;
  helpfulCount?: number;
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  arabicName?: string;
  subtitle?: string;
  fabric: string;
  price: number;
  originalPrice?: number;
  category: 'Pakistani' | 'Abayas' | 'Hijabs' | 'Modest Wear' | 'Co-ord Sets' | 'Tunics' | 'Accessories' | 'Bags';
  images: string[];
  videoUrl?: string;
  description: string;
  details: {
    fabricCraft: string[];
    shippingReturns: string;
    careInstructions: string;
    modestFitNotes?: string;
  };
  colors: string[];
  colorHexes?: string[];
  sizes: ProductSize[];
  availableLengths?: string[]; // For Abayas e.g. 52", 54", 56", 58", 60"
  featured?: boolean;
  newArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  stockCount?: number;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  styleWithIds?: string[];
  completeTheLookIds?: string[];
  badge?: string;
  estimatedDispatch?: string;
}

export interface CartItem {
  product: Product;
  size: ProductSize;
  color: string;
  length?: string; // Optional for Abayas
  quantity: number;
}

export interface ShopTheLookBundle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lookImage: string;
  occasion: string;
  mainOutfitId: string;
  hijabId?: string;
  bagId?: string;
  accessoryId?: string;
  discountPercent: number; // e.g. 15 for 15% off full bundle
}

export type ScreenType =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'collections'
  | 'shop-the-look'
  | 'order-success'
  | 'order-failed'
  | 'about'
  | 'reviews'
  | 'faq'
  | 'contact'
  | 'size-guide'
  | 'shipping'
  | 'returns'
  | 'track-order'
  | 'privacy'
  | 'terms'
  | 'profile'
  | 'wishlist'
  | 'pakistani'
  | 'abayas'
  | 'hijabs'
  | 'modest-wear'
  | 'accessories'
  | 'bags'
  | 'new-arrivals'
  | 'sale'
  | 'admin';

export interface PromoOffer {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 10 for 10% or 20 for flat $20/₹20 off
  minOrderAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
  isActive: boolean;
  usageCount?: number;
  highlightBadge?: string;
}

export interface FailedPaymentInfo {
  gateway: string;
  orderId?: string;
  amount: number;
  currency?: Currency;
  reason: string;
  errorCode?: string;
  timestamp: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items?: CartItem[];
}

export interface FilterOptions {
  category: string;
  fabric: string;
  size: string;
  color: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'bestsellers' | 'rating';
  maxPrice: number;
  inStockOnly: boolean;
  searchQuery: string;
}

export interface Collection {
  id: string;
  title: string;
  arabicTitle?: string;
  subtitle: string;
  image: string;
  tagline: string;
  productCount: number;
  categoryFilter?: string;
}

export interface SeasonalLookbook {
  id: string;
  title: string;
  arabicTitle?: string;
  season: string; // e.g. 'Autumn / Winter 2026' | 'Eid Al-Fitr Capsule' | 'Royal Nikah Collection'
  tagline: string;
  description: string;
  heroImage: string;
  moodImage?: string;
  accentColor?: string;
  curatedCategory?: ProductCategory | 'All' | 'Sale' | 'New Arrivals';
  filterTag?: string;
  productIds: string[];
  vibe: string;
  itemCount: number;
}

export interface BespokeTailoringProfile {
  id: string;
  clientName: string;
  email?: string;
  phone?: string;
  heightUnit: 'ft_in' | 'cm';
  heightFeet: number;
  heightInches: number;
  heightCm: number;
  footwear: 'flats' | 'low_heels' | 'high_heels';
  bustInches: number;
  waistInches: number;
  hipInches: number;
  acrossShouldersInches: number;
  sleeveLengthInches: number;
  desiredLengthInches: number;
  fitStyle: 'ultra_modest_loose' | 'classic_regular' | 'tailored_structured';
  sleeveStyle: 'wide_kimono' | 'modest_wrist_buttons' | 'elasticated_cuff' | 'lace_trim';
  necklineStyle: 'high_mandarin' | 'bandh_gala' | 'boat_neck' | 'modest_v_inset';
  pocketPreference: boolean;
  nursingZipper: boolean;
  matchingBelt: boolean;
  monogramInitials?: string;
  specialInstructions?: string;
  createdAt: string;
}

export interface EnsembleSelection {
  mainOutfit?: Product;
  mainOutfitSize?: ProductSize;
  mainOutfitColor?: string;
  hijab?: Product;
  hijabColor?: string;
  bag?: Product;
  bagColor?: string;
  accessory?: Product;
  accessoryColor?: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AED' | 'PKR' | 'INR' | 'SAR';

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'In Atelier Tailoring'
  | 'Quality Inspection'
  | 'Dispatched'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
  trackingNumber: string;
  carrier: string;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
  orderNotes?: string;
}

export interface OrderNotification {
  id: string;
  orderId?: string;
  type: 'shipped' | 'out_for_delivery' | 'delivered' | 'confirmed' | 'price_drop' | 'swatch_dispatched' | 'restock';
  title: string;
  message: string;
  timestamp: string;
  trackingNumber?: string;
  carrier?: string;
  recipientEmail: string;
  recipientName: string;
  read: boolean;
  order?: Order;
  product?: Product;
  discountedPrice?: number;
  originalPrice?: number;
  restockProduct?: Product;
  restockSize?: string;
  restockColor?: string;
}
