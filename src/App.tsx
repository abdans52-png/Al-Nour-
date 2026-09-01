import React, { useState, useEffect } from 'react';
import { ScreenType, Product, CartItem, FilterOptions, Currency, Order, OrderStatus, OrderNotification, ProductCategory, FailedPaymentInfo } from './types';
import { PRODUCTS, COLLECTIONS } from './data/products';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { HomeScreen } from './views/HomeScreen';
import { ShopScreen } from './views/ShopScreen';
import { ProductDetailScreen } from './views/ProductDetailScreen';
import { CartScreen } from './views/CartScreen';
import { CollectionsScreen } from './views/CollectionsScreen';
import { ProfileScreen } from './views/ProfileScreen';
import { AboutScreen } from './views/AboutScreen';
import { ReviewsScreen } from './views/ReviewsScreen';
import { FaqScreen } from './views/FaqScreen';
import { ContactScreen } from './views/ContactScreen';
import { ShippingScreen } from './views/ShippingScreen';
import { ReturnsScreen } from './views/ReturnsScreen';
import { TrackOrderScreen } from './views/TrackOrderScreen';
import { OrderSuccessScreen } from './views/OrderSuccessScreen';
import { OrderFailedScreen } from './views/OrderFailedScreen';
import { AdminScreen } from './views/AdminScreen';
import { LegalScreens } from './views/LegalScreens';
import { SizeGuideModal } from './components/SizeGuideModal';
import { FilterDrawer } from './components/FilterDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Toast } from './components/Toast';
import { OrderNotificationModal } from './components/OrderNotificationModal';
import { NotificationToastBanner } from './components/NotificationToastBanner';
import { NotificationCenter } from './components/NotificationCenter';
import { SwatchRequestData } from './components/FabricSwatchModal';
import { EnsembleBuilderModal } from './components/EnsembleBuilderModal';
import { BespokeTailoringWizardModal } from './components/BespokeTailoringWizardModal';
import { AdminProductManagerModal } from './components/AdminProductManagerModal';
import { GlobalLoadingIndicator } from './components/GlobalLoadingIndicator';
import { AuthModal } from './components/AuthModal';
import { RazorpayHostedModal } from './components/RazorpayHostedModal';
import { registerRazorpayModalHandler, unregisterRazorpayModalHandler, RazorpayPaymentOptions } from './utils/razorpay';
import {
  subscribeToProductsRealtime,
  subscribeToOrdersRealtime,
  apiCreateOrder,
  apiUpdateOrderStatus,
  auth,
  checkUserIsAdmin
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { apiGetProducts } from './utils/api';
import { playNotificationChime } from './utils/notificationSound';
import { hapticLight, hapticSuccess, hapticWarning, hapticWishlist } from './utils/haptics';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [lastVisitedScreen, setLastVisitedScreen] = useState<ScreenType | null>(() => {
    try {
      const saved = localStorage.getItem('alnoureen_last_visited_screen');
      return (saved as ScreenType) || null;
    } catch {
      return null;
    }
  });
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(() => {
    try {
      const saved = localStorage.getItem('alnoureen_screen_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['home'];
  });

  const prevScreenRef = React.useRef<ScreenType>(currentScreen);
  useEffect(() => {
    if (prevScreenRef.current !== currentScreen) {
      const prev = prevScreenRef.current;
      setLastVisitedScreen(prev);
      try {
        localStorage.setItem('alnoureen_last_visited_screen', prev);
      } catch {}

      setScreenHistory((history) => {
        const filtered = history.filter((s) => s !== currentScreen);
        const updated = [...filtered, currentScreen].slice(-6);
        try {
          localStorage.setItem('alnoureen_screen_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      prevScreenRef.current = currentScreen;
    }
  }, [currentScreen]);

  // Global Loading State for Firebase Network/Firestore Operations
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);
  const [firebaseLoadingMessage, setFirebaseLoadingMessage] = useState('Syncing with Atelier Cloud Database...');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dynamic Products List with Firebase Firestore Real-Time Listener
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);

  // Real-time Firestore Sync for Products
  useEffect(() => {
    setIsFirebaseLoading(true);
    setFirebaseLoadingMessage('Connecting to real-time products catalog...');

    const unsubscribe = subscribeToProductsRealtime((products) => {
      if (products && products.length > 0) {
        setProductsList(products);
      }
      setIsFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const admin = await checkUserIsAdmin(user);
        setIsUserAdmin(admin);
      } else {
        setIsUserAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => productsList[0] || PRODUCTS[0]);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [failedPaymentInfo, setFailedPaymentInfo] = useState<FailedPaymentInfo | null>(null);
  const [razorpayHostedOptions, setRazorpayHostedOptions] = useState<RazorpayPaymentOptions | null>(null);

  // Register Global Razorpay Hosted Modal listener
  useEffect(() => {
    registerRazorpayModalHandler((options) => {
      setRazorpayHostedOptions(options);
    });
    return () => {
      unregisterRazorpayModalHandler();
    };
  }, []);

  // Dark mode theme state with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('alnoureen_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('alnoureen_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('alnoureen_theme', 'light');
      }
    } catch (e) {
      console.error('Error toggling dark mode:', e);
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Initial Cart matching Image 3 screenshot (Crimson Silk Lehenga + Ivory Georgette Saree = $1,270)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const lehenga = PRODUCTS.find((p) => p.id === 'crimson-silk-lehenga') || PRODUCTS[7];
    const saree = PRODUCTS.find((p) => p.id === 'ivory-georgette-saree') || PRODUCTS[8];
    return [
      { product: lehenga, size: 'M', color: 'Deep Crimson', quantity: 1 },
      { product: saree, size: 'Free Size', color: 'Warm Ivory', quantity: 1 }
    ];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[0], PRODUCTS[1]]);

  // Currency (Default to INR ₹)
  const [currency, setCurrency] = useState<Currency>('INR');

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    fabric: 'All',
    size: 'All',
    color: 'All',
    sortBy: 'featured',
    maxPrice: 1000,
    inStockOnly: false,
    searchQuery: ''
  });

  // Modals & Drawers
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEnsembleBuilderOpen, setIsEnsembleBuilderOpen] = useState(false);
  const [ensembleInitialProduct, setEnsembleInitialProduct] = useState<Product | undefined>(undefined);
  const [isBespokeWizardOpen, setIsBespokeWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automated notifications system
  const [notifications, setNotifications] = useState<OrderNotification[]>([
    {
      id: 'notif-init-1',
      orderId: 'ALN-902814',
      type: 'shipped',
      title: 'Order #ALN-902814 Dispatched via DHL Express Priority',
      message: 'Your bespoke order is now in transit with DHL Express Priority (Tracking #DHL-8890214829).',
      timestamp: 'Today, 10:30 AM',
      trackingNumber: 'DHL-8890214829',
      carrier: 'DHL Express Priority',
      recipientEmail: 'eleanor.vance@example.com',
      recipientName: 'Eleanor Vance',
      read: false,
      order: {
        id: 'ALN-902814',
        date: 'Aug 10, 2026',
        itemsCount: 2,
        subtotal: 730,
        discount: 50,
        shipping: 0,
        total: 680,
        status: 'Shipped',
        estimatedDelivery: 'Aug 22, 2026',
        trackingNumber: 'DHL-8890214829',
        carrier: 'DHL Express Priority',
        shippingAddress: {
          fullName: 'Eleanor Vance',
          email: 'eleanor.vance@example.com',
          phone: '+91 93262 94187',
          street: '42 Altamount Road, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400050'
        },
        paymentMethod: 'Direct Secure Checkout',
        items: [
          {
            productId: 'zardozi-velvet-peshwas',
            name: 'Zardozi Velvet Royal Peshwas',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
            size: 'M',
            color: 'Emerald Green',
            quantity: 1,
            price: 520
          },
          {
            productId: 'silk-organza-veil',
            name: 'Hand-Embroidered Silk Organza Veil',
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
            size: 'Free Size',
            color: 'Champagne Gold',
            quantity: 1,
            price: 160
          }
        ]
      }
    }
  ]);

  const [activeNotificationModal, setActiveNotificationModal] = useState<{
    isOpen: boolean;
    order: Order | null;
    triggerStatus?: OrderStatus;
  }>({
    isOpen: false,
    order: null
  });

  const [activeToastNotification, setActiveToastNotification] = useState<OrderNotification | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string | undefined>(undefined);

  // Rich Order history with active In Atelier Tailoring order synchronized with Firestore
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ALN-734190',
      date: 'Aug 14, 2026',
      itemsCount: 1,
      subtotal: 580,
      discount: 0,
      shipping: 0,
      total: 580,
      status: 'In Atelier Tailoring',
      estimatedDelivery: 'Aug 24, 2026',
      trackingNumber: 'DHL-IN-9482103859',
      carrier: 'DHL Express Priority Air',
      shippingAddress: {
        fullName: 'Eleanor Vance',
        email: 'eleanor.vance@example.com',
        phone: '+91 93262 94187',
        street: '42 Altamount Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400050'
      },
      paymentMethod: 'Direct Secure Checkout',
      items: [
        {
          productId: 'zardozi-velvet-peshwas',
          name: 'Zardozi Velvet Royal Peshwas Ensemble',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          size: 'Bespoke M (Length 56")',
          color: 'Emerald Green & Metallic Zardozi',
          quantity: 1,
          price: 580
        }
      ]
    },
    {
      id: 'ALN-902814',
      date: 'Aug 10, 2026',
      itemsCount: 2,
      subtotal: 730,
      discount: 50,
      shipping: 0,
      total: 680,
      status: 'Shipped',
      estimatedDelivery: 'Aug 22, 2026',
      trackingNumber: 'DHL-8890214829',
      carrier: 'DHL Express Priority',
      shippingAddress: {
        fullName: 'Eleanor Vance',
        email: 'eleanor.vance@example.com',
        phone: '+91 93262 94187',
        street: '42 Altamount Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400050'
      },
      paymentMethod: 'Direct Secure Checkout',
      items: [
        {
          productId: 'zardozi-velvet-peshwas',
          name: 'Zardozi Velvet Royal Peshwas',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          size: 'M',
          color: 'Emerald Green',
          quantity: 1,
          price: 520
        },
        {
          productId: 'silk-organza-veil',
          name: 'Hand-Embroidered Silk Organza Veil',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
          size: 'Free Size',
          color: 'Champagne Gold',
          quantity: 1,
          price: 160
        }
      ]
    },
    {
      id: 'ALN-489201',
      date: 'Jul 24, 2026',
      itemsCount: 1,
      subtotal: 245,
      discount: 0,
      shipping: 0,
      total: 245,
      status: 'Delivered',
      estimatedDelivery: 'Jul 28, 2026',
      trackingNumber: 'DHL-5541908231',
      carrier: 'DHL Express',
      shippingAddress: {
        fullName: 'Eleanor Vance',
        email: 'eleanor.vance@example.com',
        phone: '+91 93262 94187',
        street: '42 Altamount Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400050'
      },
      paymentMethod: 'Direct Secure Checkout',
      items: [
        {
          productId: 'korean-nida-open-abaya',
          name: 'Korean Nida Pearl Trim Open Abaya',
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
          size: '56"',
          color: 'Jet Black',
          quantity: 1,
          price: 245
        }
      ]
    }
  ]);

  // Real-time Firestore Sync for Orders
  useEffect(() => {
    const unsubscribe = subscribeToOrdersRealtime((firestoreOrders) => {
      if (firestoreOrders && firestoreOrders.length > 0) {
        setOrders(firestoreOrders);
      }
    });

    return () => unsubscribe();
  }, []);

  // Scroll to top on screen transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen, selectedProduct]);

  // Navigation Handler supporting category switching
  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'size-guide') {
      setIsSizeGuideOpen(true);
      return;
    }
    if (screen === 'pakistani') {
      setFilters((prev) => ({ ...prev, category: 'Pakistani' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'abayas') {
      setFilters((prev) => ({ ...prev, category: 'Abayas' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'hijabs') {
      setFilters((prev) => ({ ...prev, category: 'Hijabs' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'modest-wear') {
      setFilters((prev) => ({ ...prev, category: 'Modest Wear' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'accessories') {
      setFilters((prev) => ({ ...prev, category: 'Accessories' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'bags') {
      setFilters((prev) => ({ ...prev, category: 'Bags' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'new-arrivals') {
      setFilters((prev) => ({ ...prev, category: 'All', sortBy: 'newest' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'sale') {
      setFilters((prev) => ({ ...prev, category: 'All', sortBy: 'featured' }));
      setCurrentScreen('shop');
      return;
    }
    if (screen === 'shop-the-look') {
      setCurrentScreen('home');
      setTimeout(() => {
        const el = document.getElementById('shop-the-look-bundle-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    setCurrentScreen(screen);
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    size: any = 'M',
    color?: string
  ) => {
    hapticSuccess();
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          size: size || product.sizes[0] || 'M',
          color: color || product.colors[0] || 'Original',
          quantity: 1
        }
      ];
    });
    setToastMessage(`Added "${product.name}" (${size}) to your bag.`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    hapticLight();
    setCart((prev) => {
      const updated = [...prev];
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    hapticWarning();
    const item = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    if (item) {
      setToastMessage(`Removed "${item.product.name}" from bag.`);
    }
  };

  // Wishlist toggle with tactile haptics
  const handleToggleWishlist = (product: Product) => {
    hapticWishlist();
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        setToastMessage(`Removed from your wishlist.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        setToastMessage(`Saved "${product.name}" to wishlist.`);
        return [...prev, product];
      }
    });
  };

  // Price Drop Alert simulation handler
  const handlePriceDropAlert = (product: Product, email: string, discountPercent: number = 15) => {
    hapticSuccess();
    const discountedPrice = Math.round(product.price * (1 - discountPercent / 100));
    
    const newNotif: OrderNotification = {
      id: `price-drop-${Date.now()}`,
      type: 'price_drop',
      title: `Private Flash Drop: ${discountPercent}% Off "${product.name}"`,
      message: `Great news! "${product.name}" has dropped from ₹${product.price.toLocaleString('en-IN')} to ₹${discountedPrice.toLocaleString('en-IN')}. Your VIP reservation is active.`,
      timestamp: 'Just now',
      recipientEmail: email,
      recipientName: 'Valued Patron',
      read: false,
      product: product,
      discountedPrice,
      originalPrice: product.price
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToastNotification(newNotif);
    playNotificationChime();
    setToastMessage(`✨ Price drop alert registered for "${product.name}"! Notification sent.`);
  };

  // Fabric Swatch Request simulation handler
  const handleFabricSwatchRequest = (data: SwatchRequestData) => {
    hapticSuccess();
    const trackingNumber = `SWATCH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newNotif: OrderNotification = {
      id: `swatch-${Date.now()}`,
      type: 'swatch_dispatched',
      title: `Fabric Swatch Dispatched: ${data.product.name}`,
      message: `Your complimentary luxury textile sample envelope (${data.selectedColor} shade) is dispatched via Priority Air Mail to ${data.city}, ${data.country}.`,
      timestamp: 'Just now',
      trackingNumber,
      carrier: 'DHL Express Atelier Mail',
      recipientEmail: data.email,
      recipientName: data.fullName,
      read: false,
      product: data.product
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToastNotification(newNotif);
    playNotificationChime();
    setToastMessage(`✨ Fabric swatch requested for "${data.product.name}"! Dispatched to ${data.city}.`);
  };

  // Restock Subscription & Simulation Handlers
  const handleSubscribeRestock = (
    product: Product,
    email: string,
    size?: string,
    color?: string
  ) => {
    hapticSuccess();
    setToastMessage(
      `Restock Alert Registered: You'll be notified at ${email} as soon as "${product.name}" returns to the atelier.`
    );
  };

  const handleSimulateRestock = (
    product: Product,
    size?: string,
    color?: string,
    email?: string
  ) => {
    hapticSuccess();
    playNotificationChime();

    const restockNotif: OrderNotification = {
      id: `restock-${Date.now()}`,
      orderId: `RESTOCK-${product.id.slice(0, 6).toUpperCase()}`,
      type: 'restock',
      title: `Back in Stock: ${product.name}`,
      message: `Maison AL-NOUREEN has tailored a fresh limited run of "${product.name}"${size ? ` (Size ${size})` : ''}${color ? ` in ${color}` : ''}. Reserve your piece before the allocation is exhausted.`,
      timestamp: 'Just now',
      recipientEmail: email || 'abdans52@gmail.com',
      recipientName: 'Valued Patron',
      read: false,
      product: product,
      restockProduct: product,
      restockSize: size,
      restockColor: color
    };

    setNotifications((prev) => [restockNotif, ...prev]);
    setActiveToastNotification(restockNotif);
    setToastMessage(
      `🔔 Restock Event Simulated: Alert dispatched for "${product.name}"!`
    );
  };

  // Delivery Date Hold Update Handler
  const handleUpdateOrderDeliveryDate = (
    orderId: string,
    newDeliveryDate: string,
    reason: string,
    notes: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            estimatedDelivery: newDeliveryDate,
            orderNotes: o.orderNotes
              ? `${o.orderNotes} | Delivery Hold Requested: ${reason} (Hold until ${newDeliveryDate}). Instructions: ${notes}`
              : `Delivery Hold Requested: ${reason} (Hold until ${newDeliveryDate}). Instructions: ${notes}`
          };
        }
        return o;
      })
    );
    setToastMessage(`Delivery hold registered. New delivery target: ${newDeliveryDate}`);
  };

  // Product selection
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
  };

  // Order Placement Success
  const handleOrderSuccess = (orderOrId: Order | string) => {
    let createdOrder: Order;
    if (typeof orderOrId === 'string') {
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      createdOrder = {
        id: orderOrId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        itemsCount: count,
        subtotal: total,
        discount: 0,
        shipping: 0,
        total,
        status: 'In Atelier Tailoring',
        estimatedDelivery: '3–5 Business Days via DHL Express Priority',
        trackingNumber: `DHL-IN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        carrier: 'DHL Express Priority Air',
        shippingAddress: {
          fullName: 'Amina Al-Mansoor',
          email: currentUser?.email || 'amina.mansoor@example.com',
          phone: '+91 98200 45678',
          street: '42 Altamount Road, Cumballa Hill',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400026'
        },
        paymentMethod: 'Direct Secure Checkout',
        items: cart.map((ci) => ({
          productId: ci.product.id,
          name: ci.product.name,
          image: ci.product.images[0],
          size: ci.size,
          color: ci.color,
          quantity: ci.quantity,
          price: ci.product.price
        }))
      };
    } else {
      createdOrder = orderOrId;
    }

    // Save to Firestore
    apiCreateOrder(createdOrder).catch((err) => {
      console.error('Failed to sync new order to Firestore:', err);
    });

    setOrders((prev) => [createdOrder, ...prev]);
    setLatestOrder(createdOrder);
    setCart([]);
    setCurrentScreen('order-success');
    setToastMessage(`Acquisition ${createdOrder.id} registered! Confirmation docket generated.`);
  };

  // Order Placement Failure (Payment Declined/Failed on Google Pay/Apple Pay)
  const handleOrderFailed = (info: FailedPaymentInfo) => {
    hapticWarning();
    setFailedPaymentInfo(info);
    setCurrentScreen('order-failed');
    setToastMessage(`Payment incomplete. Order was not placed.`);
  };

  // Listener for return query parameters from Google Pay / Apple Pay / UPI redirects and Shared Tracking Links
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment_status');
        const orderIdParam = urlParams.get('order_id');
        const gatewayParam = urlParams.get('gateway');
        const reasonParam = urlParams.get('reason');
        const trackParam = urlParams.get('track') || urlParams.get('tracking');

        if (trackParam) {
          setSelectedTrackOrderId(trackParam);
          setCurrentScreen('track-order');
          return;
        }

        if (paymentStatus === 'success') {
          if (orderIdParam) {
            const existingOrder = orders.find((o) => o.id === orderIdParam);
            if (existingOrder) {
              setLatestOrder(existingOrder);
              setCurrentScreen('order-success');
            } else {
              handleOrderSuccess(orderIdParam);
            }
          }
        } else if (paymentStatus === 'failed' || paymentStatus === 'cancelled') {
          handleOrderFailed({
            gateway:
              gatewayParam === 'gpay'
                ? 'Google Pay (UPI)'
                : gatewayParam === 'applepay'
                ? 'Apple Pay'
                : 'Payment Gateway',
            orderId: orderIdParam || undefined,
            amount: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
            currency,
            reason: reasonParam
              ? reasonParam.replace(/_/g, ' ')
              : 'Payment was cancelled or failed in payment application. No funds were transferred.',
            errorCode: 'ERR_GATEWAY_RETURN_FAILED',
            timestamp: new Date().toLocaleTimeString(),
            items: cart
          });
        }
      } catch (err) {
        console.error('Error parsing payment return URL:', err);
      }
    }
  }, []);

  // Status update handler with automatic notification trigger
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    let targetOrder: Order | null = null;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus };
          targetOrder = updated;
          return updated;
        }
        return ord;
      })
    );

    // Sync status to Firestore
    apiUpdateOrderStatus(orderId, newStatus).catch((err) => {
      console.error('Failed to sync status update to Firestore:', err);
    });

    const isOutForDelivery = newStatus === 'Out for Delivery';
    const isShipped = newStatus === 'Shipped' || newStatus === 'Dispatched';

    if (isShipped || isOutForDelivery) {
      setTimeout(() => {
        const orderToNotify = targetOrder || orders.find((o) => o.id === orderId);
        if (orderToNotify) {
          const newNotif: OrderNotification = {
            id: `notif-${Date.now()}`,
            orderId: orderToNotify.id,
            type: isOutForDelivery ? 'out_for_delivery' : 'shipped',
            title: isOutForDelivery
              ? `Order #${orderToNotify.id} is Out for Delivery!`
              : `Order #${orderToNotify.id} Dispatched via ${orderToNotify.carrier}`,
            message: isOutForDelivery
              ? `Your package (Tracking #${orderToNotify.trackingNumber}) is out with your courier driver for delivery today.`
              : `Your bespoke order has been handed to ${orderToNotify.carrier}. Tracking #${orderToNotify.trackingNumber}. Estimated arrival: ${orderToNotify.estimatedDelivery}.`,
            timestamp: 'Just now',
            trackingNumber: orderToNotify.trackingNumber,
            carrier: orderToNotify.carrier,
            recipientEmail: orderToNotify.shippingAddress.email || 'abdans52@gmail.com',
            recipientName: orderToNotify.shippingAddress.fullName,
            read: false,
            order: orderToNotify
          };

          setNotifications((prev) => [newNotif, ...prev]);
          setActiveToastNotification(newNotif);
          playNotificationChime();

          // Auto open the email preview modal
          setActiveNotificationModal({
            isOpen: true,
            order: orderToNotify,
            triggerStatus: newStatus
          });
        }
      }, 60);
    } else {
      setToastMessage(`Order #${orderId} status updated to "${newStatus}".`);
    }
  };

  const handleOpenNotificationModal = (order: Order, triggerStatus?: OrderStatus) => {
    setActiveNotificationModal({
      isOpen: true,
      order,
      triggerStatus
    });
  };

  const handleTrackSpecificOrder = (orderId: string) => {
    setSelectedTrackOrderId(orderId);
    setCurrentScreen('track-order');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Total cart items count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // If Admin Screen is active, render dedicated Full-Screen Admin Panel
  if (currentScreen === 'admin') {
    return (
      <AdminScreen
        onBackToStore={() => handleNavigate('home')}
        products={productsList}
        onUpdateProducts={(updated) => {
          setProductsList(updated);
          try {
            localStorage.setItem('alnoureen_custom_products', JSON.stringify(updated));
          } catch {}
        }}
        currentCurrency={currency}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EAE0] text-[#1E1A17] flex flex-col items-center justify-start antialiased selection:bg-[#C59B27]/20 selection:text-[#1E1A17]">
      {/* Main Container / App Canvas */}
      <div className="w-full max-w-full md:max-w-7xl bg-[#FAF7F2] dark:bg-[#15110E] shadow-none md:shadow-xs min-h-screen overflow-x-hidden relative flex flex-col">
        {/* Navigation Header */}
        <Navbar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          notificationsCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          currentCurrency={currency}
          onCurrencyChange={setCurrency}
          onOpenSearch={() => {
            setCurrentScreen('shop');
            setIsFilterOpen(true);
          }}
          onOpenEnsembleBuilder={() => {
            setEnsembleInitialProduct(undefined);
            setIsEnsembleBuilderOpen(true);
          }}
          onOpenTailoringWizard={() => {
            setIsBespokeWizardOpen(true);
          }}
          onOpenLookbooks={() => {
            setCurrentScreen('shop-the-look');
          }}
          darkMode={darkMode}
          onDarkModeChange={setDarkMode}
        />

        {/* View Switcher with Framer Motion Screen Transitions */}
        <main className="flex-1 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen === 'product-detail' ? `product-detail-${selectedProduct.id}` : currentScreen}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex-1 flex flex-col"
            >
              {currentScreen === 'home' && (
                <HomeScreen
                  onNavigate={handleNavigate}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  products={productsList}
                  currency={currency}
                  onOpenEnsembleBuilder={(prod) => {
                    setEnsembleInitialProduct(prod);
                    setIsEnsembleBuilderOpen(true);
                  }}
                  onOpenTailoringWizard={() => {
                    setIsBespokeWizardOpen(true);
                  }}
                  onSelectLookbook={(lb) => {
                    setFilters((prev) => ({
                      ...prev,
                      category: lb.curatedCategory === 'Pakistani' ? 'Pakistani' : lb.curatedCategory === 'Abayas' ? 'Abayas' : 'All'
                    }));
                    setCurrentScreen('shop');
                  }}
                />
              )}

              {currentScreen === 'shop' && (
                <ShopScreen
                  products={productsList}
                  onSelectProduct={handleSelectProduct}
                  onOpenFilters={() => setIsFilterOpen(true)}
                  activeFilters={filters}
                  onClearFilters={() =>
                    setFilters({
                      category: 'All',
                      fabric: 'All',
                      size: 'All',
                      color: 'All',
                      sortBy: 'featured',
                      maxPrice: 1000,
                      inStockOnly: false,
                      searchQuery: ''
                    })
                  }
                  onUpdateFilters={(newFilters) => setFilters(newFilters)}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  currency={currency}
                />
              )}

              {currentScreen === 'product-detail' && (
                <ProductDetailScreen
                  product={selectedProduct}
                  allProducts={productsList}
                  onNavigate={handleNavigate}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlist.some((p) => p.id === selectedProduct.id)}
                  onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
                  currency={currency}
                  onNotifyPriceDrop={handlePriceDropAlert}
                  onRequestFabricSwatch={handleFabricSwatchRequest}
                  onSubscribeRestock={handleSubscribeRestock}
                  onSimulateRestock={handleSimulateRestock}
                  onOpenEnsembleBuilder={(prod) => {
                    setEnsembleInitialProduct(prod || selectedProduct);
                    setIsEnsembleBuilderOpen(true);
                  }}
                  onOpenTailoringWizard={() => {
                    setIsBespokeWizardOpen(true);
                  }}
                />
              )}

              {currentScreen === 'cart' && (
                <CartScreen
                  cart={cart}
                  currency={currency}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveCartItem}
                  onNavigate={handleNavigate}
                  onSelectProduct={handleSelectProduct}
                  onProceedToCheckout={() => setIsCheckoutOpen(true)}
                  allProducts={productsList}
                  onAddToCart={handleAddToCart}
                  wishlist={wishlist.map((p) => p.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              )}

              {currentScreen === 'collections' && (
                <CollectionsScreen
                  collections={COLLECTIONS}
                  onSelectCollection={(title) => {
                    setFilters((prev) => ({
                      ...prev,
                      category: 'All'
                    }));
                    setCurrentScreen('shop');
                  }}
                  onNavigate={handleNavigate}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  wishlist={wishlist}
                  onRemoveWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onSelectProduct={handleSelectProduct}
                  onNavigate={handleNavigate}
                  currentCurrency={currency}
                  onCurrencyChange={setCurrency}
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onOpenNotificationModal={handleOpenNotificationModal}
                  onTrackOrder={handleTrackSpecificOrder}
                  darkMode={darkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                  onDarkModeChange={setDarkMode}
                  onOpenCatalogManager={() => setIsAdminModalOpen(true)}
                />
              )}

              {currentScreen === 'order-success' && (
                <OrderSuccessScreen
                  order={latestOrder || orders[0]}
                  currency={currency}
                  onNavigate={handleNavigate}
                />
              )}

              {currentScreen === 'order-failed' && (
                <OrderFailedScreen
                  failedInfo={failedPaymentInfo}
                  cartItems={cart}
                  currency={currency}
                  onNavigate={handleNavigate}
                  onRetryPayment={() => {
                    setIsCheckoutOpen(true);
                  }}
                />
              )}

              {currentScreen === 'about' && (
                <AboutScreen onNavigate={handleNavigate} currency={currency} />
              )}

              {currentScreen === 'reviews' && <ReviewsScreen onNavigate={handleNavigate} />}

              {currentScreen === 'faq' && <FaqScreen onNavigate={handleNavigate} />}

              {currentScreen === 'contact' && <ContactScreen onNavigate={handleNavigate} />}

              {currentScreen === 'shipping' && <ShippingScreen onNavigate={handleNavigate} />}

              {currentScreen === 'returns' && <ReturnsScreen onNavigate={handleNavigate} />}

              {currentScreen === 'track-order' && (
                <TrackOrderScreen
                  onNavigate={handleNavigate}
                  orders={orders}
                  currency={currency}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onOpenNotificationModal={handleOpenNotificationModal}
                  initialOrderId={selectedTrackOrderId}
                  onUpdateOrderDeliveryDate={handleUpdateOrderDeliveryDate}
                />
              )}

              {currentScreen === 'privacy' && (
                <LegalScreens type="privacy" onNavigate={handleNavigate} />
              )}

              {currentScreen === 'terms' && (
                <LegalScreens type="terms" onNavigate={handleNavigate} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer on standard web layout */}
        <Footer
          onNavigate={handleNavigate}
          currentScreen={currentScreen}
          lastVisitedScreen={lastVisitedScreen}
          screenHistory={screenHistory}
        />

        {/* Bottom Navigation Tab Bar on Mobile View */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Floating WhatsApp Action Button */}
      <WhatsAppWidget />

      {/* Real-time Order Notification Toast Banner */}
      <NotificationToastBanner
        notification={activeToastNotification}
        onClose={() => setActiveToastNotification(null)}
        onViewEmail={(notif) => {
          if (notif.order) {
            handleOpenNotificationModal(
              notif.order,
              notif.type === 'out_for_delivery' ? 'Out for Delivery' : 'Shipped'
            );
          }
          setActiveToastNotification(null);
        }}
      />

      {/* Automated Email & Notification Template Modal */}
      <OrderNotificationModal
        isOpen={activeNotificationModal.isOpen}
        onClose={() => setActiveNotificationModal({ isOpen: false, order: null })}
        order={activeNotificationModal.order}
        triggerStatus={activeNotificationModal.triggerStatus}
        currency={currency}
        userEmail="abdans52@gmail.com"
        onNavigateToTracking={(orderId) => {
          setActiveNotificationModal({ isOpen: false, order: null });
          handleTrackSpecificOrder(orderId);
        }}
      />

      {/* Notification Drawer History */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onSelectNotification={(notif) => {
          if (notif.order) {
            handleOpenNotificationModal(
              notif.order,
              notif.type === 'out_for_delivery' ? 'Out for Delivery' : 'Shipped'
            );
          }
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
          );
        }}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectProduct={handleSelectProduct}
      />

      {/* Global Modals & Notifications */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        totalCount={productsList.length}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={subtotal}
        currency={currency}
        onOrderSuccess={handleOrderSuccess}
        onOrderFailed={handleOrderFailed}
      />

      {/* Interactive Mix & Match Ensemble Builder Modal */}
      <EnsembleBuilderModal
        isOpen={isEnsembleBuilderOpen}
        onClose={() => {
          setIsEnsembleBuilderOpen(false);
          setEnsembleInitialProduct(undefined);
        }}
        products={productsList}
        currency={currency}
        onAddToCart={(p, s, c) => {
          handleAddToCart(p, s || 'M', c);
          setToastMessage(`Added ${p.name} to bag!`);
        }}
        onSelectProduct={handleSelectProduct}
        initialProduct={ensembleInitialProduct}
      />

      {/* Bespoke Sizing & Custom Tailoring Measurement Wizard */}
      <BespokeTailoringWizardModal
        isOpen={isBespokeWizardOpen}
        onClose={() => setIsBespokeWizardOpen(false)}
        onSaveProfile={(profile) => {
          setToastMessage('Bespoke measurement profile saved successfully to your account!');
        }}
      />

      {/* Store Catalog & Price Manager Modal (Admin) */}
      <AdminProductManagerModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        products={productsList}
        onUpdateProducts={(updated) => {
          setProductsList(updated);
          setToastMessage('Catalog and prices updated successfully!');
        }}
        currentCurrency={currency}
        onResetDefaults={() => {
          setProductsList(PRODUCTS);
          try {
            localStorage.removeItem('alnoureen_custom_products');
          } catch (e) {}
          setToastMessage('Catalog reset to default products.');
        }}
      />

      {/* Global Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Razorpay Hosted Payment Modal Fallback */}
      <RazorpayHostedModal
        isOpen={!!razorpayHostedOptions}
        onClose={() => setRazorpayHostedOptions(null)}
        options={razorpayHostedOptions}
      />

      {/* Global Cloud Sync / Network Loading Overlay */}
      <GlobalLoadingIndicator
        isVisible={isFirebaseLoading}
        message={firebaseLoadingMessage}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

