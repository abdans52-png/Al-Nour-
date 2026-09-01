import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductCategory, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import { uploadProductImage } from '../lib/firebase';
import { apiCreateProduct, apiUpdateProduct, apiDeleteProduct } from '../utils/api';
import { AdminSiteContentEditor } from './AdminSiteContentEditor';
import { AdminProductCsvBulkModal } from './AdminProductCsvBulkModal';
import {
  X,
  Search,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  DollarSign,
  Save,
  RotateCcw,
  Check,
  Tag,
  Layers,
  Sparkles,
  Copy,
  ExternalLink,
  AlertTriangle,
  FileCode,
  Eye,
  Upload,
  RefreshCw,
  Loader2,
  Package,
  FileText,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';

interface AdminProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (updated: Product[]) => void;
  currentCurrency: Currency;
  onResetDefaults?: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Pakistani',
  'Abayas',
  'Hijabs',
  'Modest Wear',
  'Co-ord Sets',
  'Tunics',
  'Accessories',
  'Bags'
];

export const AdminProductManagerModal: React.FC<AdminProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  currentCurrency,
  onResetDefaults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTab, setActiveModalTab] = useState<'products' | 'brand' | 'texts'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copiedCodeSuccess, setCopiedCodeSuccess] = useState(false);
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [showCsvBulkModal, setShowCsvBulkModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for editing or creating
  const [formName, setFormName] = useState('');
  const [formArabicName, setFormArabicName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Pakistani');
  const [formFabric, setFormFabric] = useState('');
  const [formPrice, setFormPrice] = useState<number>(100);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(120);
  const [formDescription, setFormDescription] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formStockCount, setFormStockCount] = useState(10);
  const [formColors, setFormColors] = useState<string>('Emerald Green, Midnight Black, Ruby');
  const [formSizes, setFormSizes] = useState<string>('XS, S, M, L, XL');

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartEdit = (product: Product) => {
    hapticLight();
    setEditingProduct(product);
    setIsCreatingNew(false);
    setFormName(product.name);
    setFormArabicName(product.arabicName || '');
    setFormSubtitle(product.subtitle || '');
    setFormCategory(product.category);
    setFormFabric(product.fabric);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice || product.price);
    setFormDescription(product.description);
    setFormImages([...product.images]);
    setNewImageUrl('');
    setFormBadge(product.badge || '');
    setFormInStock(product.inStock);
    setFormStockCount(product.stockCount || 10);
    setFormColors(product.colors?.join(', ') || 'Emerald, Gold, Black');
    setFormSizes(product.sizes?.join(', ') || 'S, M, L, XL');
  };

  const handleStartCreate = () => {
    hapticLight();
    const newId = `product-${Date.now()}`;
    const emptyProduct: Product = {
      id: newId,
      name: '',
      arabicName: '',
      subtitle: '',
      fabric: 'Pure Mulberry Silk',
      price: 150,
      originalPrice: 180,
      category: 'Pakistani',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
      ],
      description: 'Handcrafted luxury modest couture garment with meticulous tailoring.',
      details: {
        fabricCraft: ['100% pure premium materials', 'Hand-finished edging'],
        shippingReturns: 'Complimentary express courier shipping. 14-day returns.',
        careInstructions: 'Dry clean only.',
        modestFitNotes: 'Graceful modest relaxed fit.'
      },
      colors: ['Emerald Green', 'Royal Navy'],
      colorHexes: ['#0A4D3C', '#1A2B4C'],
      sizes: ['S', 'M', 'L', 'XL'],
      featured: true,
      newArrival: true,
      inStock: true,
      stockCount: 15,
      rating: 5.0,
      reviewCount: 1,
      badge: 'New Arrival'
    };
    setEditingProduct(emptyProduct);
    setIsCreatingNew(true);
    setFormName('New Haute Couture Piece');
    setFormArabicName('قطعة أزياء راقية جديدة');
    setFormSubtitle('Exclusive Collection Piece');
    setFormCategory('Pakistani');
    setFormFabric('Pure Mulberry Silk & Korean Nida');
    setFormPrice(150);
    setFormOriginalPrice(190);
    setFormDescription('Artisanal modest fashion piece handcrafted with premium fabrics.');
    setFormImages([
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'
    ]);
    setNewImageUrl('');
    setFormBadge('New Arrival');
    setFormInStock(true);
    setFormStockCount(12);
    setFormColors('Emerald Green, Midnight Black, Champagne Gold');
    setFormSizes('XS, S, M, L, XL');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingImage(true);
      hapticLight();
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadProductImage(file, `product_${Date.now()}_${file.name}`);
        if (url) uploadedUrls.push(url);
      }

      setFormImages((prev) => [...prev, ...uploadedUrls]);
      hapticSuccess();
    } catch (err) {
      console.error('Failed to upload product image to Firebase Storage:', err);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    hapticLight();
    setFormImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    hapticLight();
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    hapticSuccess();

    const colorsArray = formColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const sizesArray = formSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalImages = formImages.length > 0
      ? formImages
      : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'];

    const updatedProduct: Product = {
      ...editingProduct,
      name: formName || 'Haute Couture Garment',
      arabicName: formArabicName || undefined,
      subtitle: formSubtitle || undefined,
      category: formCategory,
      fabric: formFabric || 'Luxury Fabric',
      price: Number(formPrice) || 1,
      originalPrice: Number(formOriginalPrice) || Number(formPrice) || 1,
      description: formDescription,
      images: finalImages,
      badge: formBadge || undefined,
      inStock: formInStock,
      stockCount: Number(formStockCount) || 5,
      colors: colorsArray.length > 0 ? colorsArray : ['Black'],
      sizes: sizesArray.length > 0 ? sizesArray : ['S', 'M', 'L']
    };

    let newProductsList: Product[];
    if (isCreatingNew) {
      newProductsList = [updatedProduct, ...products];
      await apiCreateProduct(updatedProduct);
    } else {
      newProductsList = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      await apiUpdateProduct(updatedProduct.id, updatedProduct);
    }

    onUpdateProducts(newProductsList);
    try {
      localStorage.setItem('alnoureen_custom_products', JSON.stringify(newProductsList));
    } catch (e) {
      console.error('Error saving custom products:', e);
    }
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    hapticWarning();
    const newProductsList = products.filter((p) => p.id !== productId);
    onUpdateProducts(newProductsList);
    await apiDeleteProduct(productId);
    try {
      localStorage.setItem('alnoureen_custom_products', JSON.stringify(newProductsList));
    } catch (e) {
      console.error('Error saving custom products:', e);
    }
    setDeleteConfirmId(null);
    if (editingProduct?.id === productId) {
      setEditingProduct(null);
    }
  };

  const handleCopyCode = () => {
    hapticSuccess();
    const code = `import { Product } from '../types';\n\nexport const PRODUCTS: Product[] = ${JSON.stringify(
      products,
      null,
      2
    )};\n`;
    navigator.clipboard.writeText(code);
    setCopiedCodeSuccess(true);
    setTimeout(() => setCopiedCodeSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="admin-product-manager-modal"
        className="bg-[#FAF7F2] dark:bg-[#181411] border border-[#C59B27]/50 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#1E1A17] dark:text-[#FAF7F2]"
      >
        {/* Modal Top Header */}
        <div className="bg-[#14100D] text-[#E8D59E] px-6 py-4 border-b border-[#C59B27]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center text-[#D4AF37]">
              {activeModalTab === 'products' && <Edit3 className="w-4 h-4" />}
              {activeModalTab === 'brand' && <Sparkles className="w-4 h-4" />}
              {activeModalTab === 'texts' && <FileText className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wider">
                  {activeModalTab === 'products' && 'Store Catalog & Price Manager'}
                  {activeModalTab === 'brand' && 'Brand Identity & Logo Manager'}
                  {activeModalTab === 'texts' && 'Global Site Text & Policies CMS'}
                </h3>
                {activeModalTab === 'products' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C59B27]/20 text-[#E8D59E] border border-[#C59B27]/40 text-[10px] font-mono">
                    {products.length} Products
                  </span>
                )}
                {activeModalTab === 'brand' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                    Firestore & Storage
                  </span>
                )}
                {activeModalTab === 'texts' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#C59B27]/20 text-[#E8D59E] border border-[#C59B27]/40 text-[10px] font-mono">
                    Live Real-Time
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#A69788] font-sans-ui">
                {activeModalTab === 'products' && (
                  <>Edit prices, add or delete images, create new pieces, or export code for <code className="text-[#E8D59E]">src/data/products.ts</code>.</>
                )}
                {activeModalTab === 'brand' && (
                  <>Upload brand logo to Firebase Storage, customize Arabic typography, and verify instant updates in header and invoice.</>
                )}
                {activeModalTab === 'texts' && (
                  <>Edit home page greetings, about narratives, store policies, tax numbers, and dictionary overrides with instant persistence.</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeModalTab === 'products' && (
              <>
                <button
                  onClick={() => {
                    hapticLight();
                    setShowCsvBulkModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] font-cinzel font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Bulk CSV Import & Export for Products"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV Bulk Import</span>
                </button>

                <button
                  onClick={() => setShowCodeExport(!showCodeExport)}
                  className="px-3 py-1.5 bg-[#2B231D] hover:bg-[#3D322A] text-[#E8D59E] border border-[#C59B27]/50 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View & Export TypeScript Data"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span className="hidden sm:inline">Export Code</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-[#C5BAAC] hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Navigation Tab Bar */}
        <div className="bg-[#1C1713] border-b border-[#C59B27]/30 px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="admin-tab-products"
              onClick={() => {
                hapticLight();
                setActiveModalTab('products');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'products'
                  ? 'bg-[#C59B27] text-[#14100D] shadow-md'
                  : 'bg-[#28211B] text-[#C5BAAC] hover:text-white hover:bg-[#382E25]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products Catalog</span>
            </button>

            <button
              id="admin-tab-brand"
              onClick={() => {
                hapticLight();
                setActiveModalTab('brand');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'brand'
                  ? 'bg-[#C59B27] text-[#14100D] shadow-md'
                  : 'bg-[#28211B] text-[#C5BAAC] hover:text-white hover:bg-[#382E25]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Brand Identity & Logo</span>
            </button>

            <button
              id="admin-tab-texts"
              onClick={() => {
                hapticLight();
                setActiveModalTab('texts');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeModalTab === 'texts'
                  ? 'bg-[#C59B27] text-[#14100D] shadow-md'
                  : 'bg-[#28211B] text-[#C5BAAC] hover:text-white hover:bg-[#382E25]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Store Texts & Policies CMS</span>
            </button>
          </div>
        </div>

        {/* Main Body Area */}
        {activeModalTab === 'products' ? (
          <>
            {/* Code Export Drawer / Banner */}
            <AnimatePresence>
              {showCodeExport && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#1F1914] border-b border-[#C59B27]/30 p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 text-xs text-[#E8D59E] font-sans-ui">
                      <Sparkles className="w-4 h-4 text-[#C59B27]" />
                      <span>
                        Your modifications are currently saved in <strong>Browser LocalStorage</strong>. Click below to copy the full TypeScript array for <code>src/data/products.ts</code>:
                      </span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-1.5 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] font-cinzel font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      {copiedCodeSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCodeSuccess ? 'Code Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Body Area: Left Catalog List, Right Editor Form */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* LEFT: Product List Column (5 Cols) */}
          <div className="md:col-span-5 border-r border-[#DDD3BC] dark:border-[#2E2620] flex flex-col h-full overflow-hidden bg-[#F7F2E8] dark:bg-[#14100D]">
            {/* Search Bar & New Product Button */}
            <div className="p-3.5 border-b border-[#DDD3BC] dark:border-[#2E2620] space-y-2.5 bg-white dark:bg-[#1A1511]">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#8C6B1B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, ID, category..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] dark:bg-[#251E18] border border-[#DDD3BC] dark:border-[#382E24] rounded-xl text-xs font-sans-ui focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
                <button
                  onClick={handleStartCreate}
                  className="px-3 py-1.5 bg-[#181411] text-[#E8D59E] hover:bg-[#2B231D] border border-[#C59B27] rounded-xl text-xs font-cinzel font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Add Piece</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-2.5 py-0.5 rounded-full border transition-all whitespace-nowrap ${
                    selectedCategory === 'All'
                      ? 'bg-[#C59B27] text-[#181411] border-[#C59B27] font-bold'
                      : 'bg-[#FAF7F2] dark:bg-[#241D17] text-[#7A6B5D] dark:text-[#A69788] border-[#DDD3BC] dark:border-[#382E25]'
                  }`}
                >
                  All ({products.length})
                </button>
                {CATEGORIES.map((cat, cIdx) => (
                  <button
                    key={`adm-pm-cat-${cat}-${cIdx}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-full border transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#C59B27] text-[#181411] border-[#C59B27] font-bold'
                        : 'bg-[#FAF7F2] dark:bg-[#241D17] text-[#7A6B5D] dark:text-[#A69788] border-[#DDD3BC] dark:border-[#382E25]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Products List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-[#8C7A6B] text-xs space-y-2">
                  <p>No products match your search.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="text-[#C59B27] underline text-xs cursor-pointer"
                  >
                    Clear search filters
                  </button>
                </div>
              ) : (
                filteredProducts.map((p, pIdx) => {
                  const isSelected = editingProduct?.id === p.id;
                  return (
                    <div
                      key={`adm-pm-prod-${p.id}-${pIdx}`}
                      onClick={() => handleStartEdit(p)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#FFF9EE] dark:bg-[#2A2119] border-[#C59B27] shadow-sm ring-2 ring-[#C59B27]/20'
                          : 'bg-white dark:bg-[#1C1713] border-[#E8DFC8] dark:border-[#2D241C] hover:border-[#C59B27]/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-lg border border-[#DDD3BC] dark:border-[#382E25] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[9.5px] uppercase font-mono px-1.5 py-0.2 rounded-xs bg-[#181411] text-[#E8D59E] border border-[#C59B27]/40 inline-block mb-0.5">
                            {p.category}
                          </span>
                          <h4 className="font-cinzel text-xs font-bold truncate leading-snug">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
                            <span className="font-bold text-[#C59B27]">
                              {formatPrice(p.price, currentCurrency)}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-[#8C7A6B] line-through text-[10px]">
                                {formatPrice(p.originalPrice, currentCurrency)}
                              </span>
                            )}
                            <span className="text-[9.5px] text-[#8C7A6B]">
                              ({p.images.length} {p.images.length === 1 ? 'img' : 'imgs'})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1 bg-[#FBEBEB] p-1 rounded-lg border border-[#E0B4B4]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(p.id);
                              }}
                              className="px-2 py-0.5 bg-[#9E2A2B] text-white rounded text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(null);
                              }}
                              className="px-1.5 py-0.5 text-[#594E43] text-[10px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(p.id);
                            }}
                            className="p-1.5 text-[#8C7A6B] hover:text-[#9E2A2B] rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions: Reset Defaults */}
            {onResetDefaults && (
              <div className="p-3 border-t border-[#DDD3BC] dark:border-[#2E2620] bg-white dark:bg-[#1A1511] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#8C7A6B]">Restore factory catalog:</span>
                <button
                  onClick={() => {
                    hapticLight();
                    if (window.confirm('Reset all product prices and images to factory defaults?')) {
                      onResetDefaults();
                    }
                  }}
                  className="px-2.5 py-1 text-[#8C6B1B] dark:text-[#E8D59E] hover:bg-[#F0EAE0] dark:hover:bg-[#251E18] rounded-lg border border-[#DDD3BC] dark:border-[#382E25] text-[10.5px] font-cinzel font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Product Editor / Creator Panel (7 Cols) */}
          <div className="md:col-span-7 flex flex-col h-full overflow-y-auto bg-[#FAF7F2] dark:bg-[#181411] p-4 sm:p-6">
            {editingProduct ? (
              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8] dark:border-[#2E2620]">
                  <div>
                    <span className="text-[10px] font-mono text-[#C59B27] uppercase tracking-wider block">
                      {isCreatingNew ? 'Creating Brand New Product' : `Editing ID: ${editingProduct.id}`}
                    </span>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      {formName || 'Untitled Product'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#181411] text-[#E8D59E] hover:bg-[#2B231D] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-102"
                    >
                      <Save className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                {/* 1. Price & Currency Controls (Highlight Box) */}
                <div className="p-4 bg-[#F2ECE1] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#382E25] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#C59B27]" /> Price Settings ({currentCurrency})
                    </span>
                    <span className="text-[10.5px] text-[#7A6B5D] dark:text-[#A69788]">
                      Displayed across website in active currency
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-sans-ui font-semibold text-[#594E43] dark:text-[#C5BAAC] block mb-1">
                        Sale / Selling Price (in {currentCurrency}) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-xs text-[#8C6B1B]">
                          {currentCurrency === 'INR' ? '₹' : '$'}
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-sm font-mono font-bold text-[#1E1A17] dark:text-[#FAF7F2] focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-sans-ui font-semibold text-[#594E43] dark:text-[#C5BAAC] block mb-1">
                        Original / Strikethrough Price (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[#8C7A6B]">
                          {currentCurrency === 'INR' ? '₹' : '$'}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formOriginalPrice}
                          onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-sm font-mono text-[#7A6B5D] dark:text-[#A69788] focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Image Gallery & Image URL Management */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#C59B27]" /> Product Images ({formImages.length})
                    </label>
                    <span className="text-[10px] text-[#7A6B5D] dark:text-[#A69788]">
                      First image is the primary cover
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {formImages.map((imgUrl, idx) => (
                      <div
                        key={`adm-pm-img-${idx}-${imgUrl.slice(-10)}`}
                        className="relative group rounded-xl overflow-hidden border border-[#DDD3BC] dark:border-[#382E25] bg-black/5 aspect-3/4"
                      >
                        <img
                          src={imgUrl}
                          alt={`Product preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-black/70 text-[#E8D59E] rounded text-[9px] font-mono">
                          {idx === 0 ? 'Cover' : `#${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer hover:bg-red-700"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Image Input & Firebase Storage Uploader */}
                  <div className="space-y-2 pt-1">
                    {/* Firebase Storage Upload File Box */}
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleImageFileUpload}
                        className="hidden"
                        id="modal-firebase-file-input"
                      />
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[#1E1A17] dark:bg-[#251E18] text-[#D4AF37] hover:bg-[#2D2621] border border-[#C59B27]/40 rounded-xl text-xs font-cinzel font-semibold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading to Firebase...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image (Firebase Storage)</span>
                          </>
                        )}
                      </button>

                      <span className="text-[11px] text-[#8C7E72] hidden sm:inline">or paste direct image URL below:</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste image URL (e.g. Unsplash or direct HTTPS image link)..."
                        className="flex-1 px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs font-sans-ui focus:border-[#C59B27] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-4 py-2 bg-[#F0EAE0] dark:bg-[#251E18] hover:bg-[#E8DFC8] dark:hover:bg-[#332A22] text-[#1E1A17] dark:text-[#E8D59E] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs font-cinzel font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Add URL</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Titles & Category Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs focus:border-[#C59B27] focus:outline-hidden"
                    >
                      {CATEGORIES.map((cat, cIdx) => (
                        <option key={`apm-cat-opt-${cat}-${cIdx}`} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                      Fabric & Material
                    </label>
                    <input
                      type="text"
                      value={formFabric}
                      onChange={(e) => setFormFabric(e.target.value)}
                      placeholder="e.g. Pure Mulberry Silk, Korean Nida"
                      className="w-full px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="e.g. Best Seller, Exclusive, New"
                      className="w-full px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* 4. Description */}
                <div>
                  <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                    Garment Description & Modest Crafting Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs focus:border-[#C59B27] focus:outline-hidden leading-relaxed"
                  />
                </div>

                {/* 5. Colors, Sizes, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                      Available Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formSizes}
                      onChange={(e) => setFormSizes(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                      Available Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formColors}
                      onChange={(e) => setFormColors(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-sans-ui font-semibold block mb-1">
                      Stock Count & Availability
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={formStockCount}
                        onChange={(e) => setFormStockCount(Number(e.target.value))}
                        className="w-20 px-3 py-2 bg-white dark:bg-[#16120F] border border-[#DDD3BC] dark:border-[#382E25] rounded-xl text-xs font-mono focus:border-[#C59B27] focus:outline-hidden"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-[#594E43] dark:text-[#C5BAAC] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formInStock}
                          onChange={(e) => setFormInStock(e.target.checked)}
                          className="accent-[#C59B27]"
                        />
                        <span>In Stock</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bottom Submit Button */}
                <div className="pt-3 border-t border-[#E8DFC8] dark:border-[#2E2620] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsCreatingNew(false);
                    }}
                    className="px-4 py-2 text-xs font-cinzel text-[#8C7A6B] hover:text-[#1E1A17] dark:hover:text-[#FAF7F2] transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-[#181411] text-[#E8D59E] hover:bg-[#2B231D] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-102"
                  >
                    <Save className="w-4 h-4 text-[#C59B27]" />
                    <span>Save Product Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8C7A6B] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181411] border border-[#C59B27]/50 flex items-center justify-center text-[#E8D59E] shadow-md">
                  <Layers className="w-8 h-8 text-[#C59B27]" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="font-cinzel text-base font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                    Select a Product to Edit or Add a New One
                  </h4>
                  <p className="text-xs text-[#7A6B5D] dark:text-[#A69788] leading-relaxed">
                    Click any product on the left list to change its price, add/remove images, update fabric details, or click the button below to add a new piece to your catalog.
                  </p>
                </div>
                <button
                  onClick={handleStartCreate}
                  className="px-6 py-2.5 bg-[#C59B27] hover:bg-[#D4AF37] text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Product</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    ) : (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F2] dark:bg-[#14100D]">
        <AdminSiteContentEditor
          initialTab={activeModalTab === 'brand' ? 'logo' : 'home'}
        />
      </div>
    )}

    {showCsvBulkModal && (
      <AdminProductCsvBulkModal
        isOpen={showCsvBulkModal}
        onClose={() => setShowCsvBulkModal(false)}
        products={products}
        onUpdateProducts={onUpdateProducts}
        currentCurrency={currentCurrency}
      />
    )}
  </div>
</div>
  );
};
