import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductCategory, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import { apiCreateProduct, apiUpdateProduct } from '../utils/api';
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  ArrowRight,
  FileText,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  Sliders,
  DollarSign,
  Package
} from 'lucide-react';

interface AdminProductCsvBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (updated: Product[]) => void;
  currentCurrency: Currency;
}

interface ParsedProductRow {
  isValid: boolean;
  validationError?: string;
  isExisting: boolean;
  existingProduct?: Product;
  data: Partial<Product>;
  rawRow: Record<string, string>;
}

const VALID_CATEGORIES: ProductCategory[] = [
  'Pakistani',
  'Abayas',
  'Hijabs',
  'Modest Wear',
  'Co-ord Sets',
  'Tunics',
  'Accessories',
  'Bags'
];

/**
 * Robust CSV parser handling quotes and commas
 */
function parseCsvToRows(csvText: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

export const AdminProductCsvBulkModal: React.FC<AdminProductCsvBulkModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  currentCurrency
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'preview'>('upload');
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedProductRow[]>([]);
  const [importStrategy, setImportStrategy] = useState<'smart' | 'price_stock_only' | 'overwrite'>('smart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'new' | 'updates' | 'errors'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Generate & Download Sample CSV Template
  const handleDownloadTemplate = () => {
    hapticLight();
    const headers = [
      'id',
      'name',
      'arabicName',
      'subtitle',
      'category',
      'price',
      'originalPrice',
      'stockCount',
      'inStock',
      'fabric',
      'colors',
      'sizes',
      'description',
      'imageUrl',
      'badge'
    ];

    const sampleRows = [
      [
        'zardozi-royal-peshwas',
        'Zardozi Velvet Royal Peshwas',
        'بيشواز زردوزي ملكي',
        'Handcrafted Mughal Bridal Silhouette',
        'Pakistani',
        '580',
        '650',
        '12',
        'true',
        'Micro-Velvet & Pure Silk Lining',
        'Emerald Green, Midnight Black, Royal Ruby',
        'XS, S, M, L, XL, Custom',
        'Exquisite zardozi hand-embroidery featuring genuine gold wire work.',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'Bestseller'
      ],
      [
        'korean-nida-pearl-abaya',
        'Korean Nida Pearl Trim Open Abaya',
        'عباية ندى كورية مع لؤلؤ',
        'Dignified Modest Minimalist Cut',
        'Abayas',
        '245',
        '280',
        '8',
        'true',
        'Original Grade-A Korean Nida',
        'Obsidian Black, Soft Taupe',
        '52, 54, 56, 58, 60',
        'Breathable non-sheer Korean nida embellished with mother-of-pearl cabochons.',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        'New Arrival'
      ],
      [
        'pure-mulberry-silk-hijab-emerald',
        '19mm Mulberry Silk Luxury Hijab',
        'حجاب حرير التوت الطبيعي',
        'Ultra-Soft Breathable Drape',
        'Hijabs',
        '85',
        '95',
        '25',
        'true',
        '100% Pure Mulberry Silk 19 Momme',
        'Emerald Green, Champagne Gold, Pearl White',
        'One Size (185 x 75 cm)',
        'Artisanal hand-rolled hemmed edges designed for hair health and zero snagging.',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        ''
      ]
    ];

    const csvContent =
      headers.join(',') +
      '\n' +
      sampleRows
        .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AL-NOUREEN-Product-Bulk-Template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // 2. Export Active Catalog to CSV
  const handleExportCatalog = () => {
    hapticSuccess();
    const headers = [
      'id',
      'name',
      'arabicName',
      'subtitle',
      'category',
      'price',
      'originalPrice',
      'stockCount',
      'inStock',
      'fabric',
      'colors',
      'sizes',
      'description',
      'imageUrl',
      'badge'
    ];

    const rows = products.map((p) => [
      p.id,
      p.name || '',
      p.arabicName || '',
      p.subtitle || '',
      p.category || 'Pakistani',
      String(p.price || 0),
      String(p.originalPrice || p.price || 0),
      String(p.stockCount ?? 10),
      p.inStock ? 'true' : 'false',
      p.fabric || 'Luxury Modest Fabric',
      (p.colors || []).join(', '),
      (p.sizes || []).join(', '),
      p.description || '',
      p.images?.[0] || '',
      p.badge || ''
    ]);

    const csvContent =
      headers.join(',') +
      '\n' +
      rows
        .map((row) => row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AL-NOUREEN-Catalog-Export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 3. Process Raw CSV String into Parsed Rows
  const processCsv = (raw: string) => {
    const lines = parseCsvToRows(raw);
    if (lines.length < 2) {
      alert('The CSV file does not contain enough rows (header + at least 1 data row required).');
      return;
    }

    const headerRow = lines[0].map((h) => h.toLowerCase().trim().replace(/[\s_-]+/g, ''));
    const rows: ParsedProductRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const rowDict: Record<string, string> = {};
      headerRow.forEach((h, idx) => {
        rowDict[h] = line[idx] || '';
      });

      // Extract fields with fallbacks
      const id = rowDict['id'] || rowDict['sku'] || rowDict['productid'] || `prod-${Date.now()}-${i}`;
      const name = rowDict['name'] || rowDict['title'] || rowDict['productname'] || '';
      const rawCat = rowDict['category'] || 'Pakistani';
      const category: ProductCategory =
        VALID_CATEGORIES.find((c) => c.toLowerCase() === rawCat.toLowerCase()) || 'Pakistani';

      const price = Number(rowDict['price'] || rowDict['unitprice'] || rowDict['mrp'] || 0);
      const originalPrice = Number(rowDict['originalprice'] || rowDict['compareprice'] || price);
      const stockCount = Number(rowDict['stockcount'] || rowDict['stock'] || rowDict['inventory'] || 10);
      const inStock =
        rowDict['instock'] !== undefined
          ? rowDict['instock'].toLowerCase() === 'true' || rowDict['instock'] === '1' || stockCount > 0
          : stockCount > 0;

      const fabric = rowDict['fabric'] || rowDict['material'] || 'Pure Silk / Korean Nida';
      const rawColors = rowDict['colors'] || rowDict['color'] || 'Obsidian Black';
      const colors = rawColors.split(',').map((c) => c.trim()).filter(Boolean);
      const rawSizes = rowDict['sizes'] || rowDict['size'] || 'S, M, L';
      const sizes = rawSizes.split(',').map((s) => s.trim()).filter(Boolean);
      const description = rowDict['description'] || rowDict['desc'] || 'Exquisite modest atelier piece.';
      const imageUrl =
        rowDict['imageurl'] ||
        rowDict['image'] ||
        rowDict['img'] ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
      const badge = rowDict['badge'] || rowDict['tag'] || undefined;
      const arabicName = rowDict['arabicname'] || rowDict['arabic'] || undefined;
      const subtitle = rowDict['subtitle'] || undefined;

      const existing = products.find((p) => p.id === id || (name && p.name.toLowerCase() === name.toLowerCase()));

      let isValid = true;
      let validationError: string | undefined;

      if (!name && !existing) {
        isValid = false;
        validationError = 'Product name is required for new items.';
      } else if (isNaN(price) || price < 0) {
        isValid = false;
        validationError = 'Price must be a valid positive number.';
      }

      const productData: Partial<Product> = {
        id: existing?.id || id,
        name: name || existing?.name || 'Untitled Piece',
        arabicName: arabicName || existing?.arabicName,
        subtitle: subtitle || existing?.subtitle,
        category: category || existing?.category || 'Pakistani',
        price: isNaN(price) || price <= 0 ? (existing?.price ?? 100) : price,
        originalPrice: isNaN(originalPrice) || originalPrice <= 0 ? (existing?.originalPrice ?? price) : originalPrice,
        stockCount: isNaN(stockCount) ? (existing?.stockCount ?? 10) : stockCount,
        inStock,
        fabric: fabric || existing?.fabric || 'Luxury Modest Fabric',
        colors: colors.length > 0 ? colors : (existing?.colors ?? ['Black']),
        sizes: sizes.length > 0 ? sizes : (existing?.sizes ?? ['S', 'M', 'L']),
        description: description || existing?.description || 'Artisanal atelier collection piece.',
        images: imageUrl ? [imageUrl] : (existing?.images ?? ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80']),
        badge: badge || existing?.badge
      };

      rows.push({
        isValid,
        validationError,
        isExisting: !!existing,
        existingProduct: existing,
        data: productData,
        rawRow: rowDict
      });
    }

    setParsedRows(rows);
    setActiveTab('preview');
  };

  // 4. File Input Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      processCsv(text);
    };
    reader.readAsText(file);
  };

  // 5. Commit Import to App State & Firebase
  const handleApplyImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('There are no valid product rows to import.');
      return;
    }

    setIsProcessing(true);
    hapticSuccess();

    try {
      let updatedCatalog: Product[] = [];

      if (importStrategy === 'overwrite') {
        updatedCatalog = validRows.map((r) => r.data as Product);
      } else if (importStrategy === 'price_stock_only') {
        const idMap = new Map<string, ParsedProductRow>();
        validRows.forEach((r) => {
          if (r.data.id) idMap.set(r.data.id, r);
        });

        updatedCatalog = products.map((p) => {
          const match = idMap.get(p.id);
          if (match) {
            return {
              ...p,
              price: match.data.price ?? p.price,
              originalPrice: match.data.originalPrice ?? p.originalPrice,
              stockCount: match.data.stockCount ?? p.stockCount,
              inStock: match.data.inStock ?? p.inStock
            };
          }
          return p;
        });
      } else {
        // 'smart' upsert
        const existingMap = new Map<string, Product>();
        products.forEach((p) => existingMap.set(p.id, { ...p }));

        validRows.forEach((r) => {
          const item = r.data as Product;
          if (existingMap.has(item.id)) {
            const current = existingMap.get(item.id)!;
            existingMap.set(item.id, {
              ...current,
              ...item,
              images: item.images && item.images.length > 0 ? item.images : current.images
            });
          } else {
            existingMap.set(item.id, item);
          }
        });

        updatedCatalog = Array.from(existingMap.values());
      }

      // Update state
      onUpdateProducts(updatedCatalog);
      try {
        localStorage.setItem('alnoureen_custom_products', JSON.stringify(updatedCatalog));
      } catch (err) {
        console.warn('LocalStorage save note:', err);
      }

      // Asynchronously update Firebase
      for (const row of validRows) {
        if (row.data.id) {
          if (row.isExisting) {
            apiUpdateProduct(row.data.id, row.data);
          } else {
            apiCreateProduct(row.data as Product);
          }
        }
      }

      const updatedCount = validRows.filter((r) => r.isExisting).length;
      const newCount = validRows.filter((r) => !r.isExisting).length;

      setImportSuccessMessage(
        `Successfully imported ${validRows.length} items (${updatedCount} updated, ${newCount} added)!`
      );

      setTimeout(() => {
        setImportSuccessMessage(null);
        onClose();
      }, 2200);
    } catch (error: any) {
      alert(`Import error: ${error?.message || 'Could not complete import.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPreviewRows = parsedRows.filter((r) => {
    if (filterMode === 'new') return !r.isExisting && r.isValid;
    if (filterMode === 'updates') return r.isExisting && r.isValid;
    if (filterMode === 'errors') return !r.isValid;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans-ui">
      <div
        id="admin-product-csv-modal"
        className="bg-[#FAF7F2] dark:bg-[#181411] border border-[#C59B27]/50 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#1E1A17] dark:text-[#FAF7F2]"
      >
        {/* Modal Top Header */}
        <div className="bg-[#14100D] text-[#E8D59E] px-6 py-4 border-b border-[#C59B27]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center text-[#D4AF37]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wider">
                  Bulk CSV Product & Inventory Import
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C59B27]/20 text-[#E8D59E] border border-[#C59B27]/40 text-[10px] font-mono">
                  Batch Sync
                </span>
              </div>
              <p className="text-[11px] text-[#A69788]">
                Rapidly update prices, stock quantities, and catalog collections in bulk via spreadsheet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-[#2B231D] hover:bg-[#3D322A] text-[#E8D59E] border border-[#C59B27]/50 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download clean CSV sample"
            >
              <Download className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="hidden sm:inline">CSV Template</span>
            </button>

            <button
              onClick={handleExportCatalog}
              className="px-3 py-1.5 bg-[#2B231D] hover:bg-[#3D322A] text-[#E8D59E] border border-[#C59B27]/50 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export active store products to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="hidden sm:inline">Export Catalog ({products.length})</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-[#C5BAAC] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="bg-[#1C1713] border-b border-[#C59B27]/30 px-6 py-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#C59B27] text-[#14100D] shadow-md'
                : 'bg-[#28211B] text-[#C5BAAC] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>1. Upload File</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-[#C59B27] text-[#14100D] shadow-md'
                : 'bg-[#28211B] text-[#C5BAAC] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Paste Raw CSV</span>
          </button>

          <button
            onClick={() => {
              if (parsedRows.length > 0) setActiveTab('preview');
            }}
            disabled={parsedRows.length === 0}
            className={`px-3.5 py-1.5 rounded-xl font-cinzel text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === 'preview'
                ? 'bg-[#C59B27] text-[#14100D] shadow-md'
                : 'bg-[#28211B] text-[#C5BAAC] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Review & Import ({parsedRows.length})</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {importSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 animate-fade-in shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-cinzel font-bold text-sm text-emerald-300">Catalog Updated Successfully</h4>
                <p className="text-xs text-emerald-200/80">{importSuccessMessage}</p>
              </div>
            </div>
          )}

          {/* TAB 1: FILE UPLOAD ZONE */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#C59B27]/50 hover:border-[#C59B27] bg-[#FAF7F2] dark:bg-[#1E1915] rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all hover:scale-[1.005] group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv,application/vnd.ms-excel"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-[#C59B27]/15 border border-[#C59B27]/30 flex items-center justify-center mx-auto mb-4 text-[#C59B27] group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-cinzel text-lg font-bold text-[#1E1A17] dark:text-[#FAF7F2] mb-1">
                  Click or Drag & Drop Product CSV Here
                </h4>
                <p className="text-xs text-[#8C7E72] max-w-md mx-auto mb-4">
                  Supports standard Excel & Google Sheets export formats with UTF-8 encoding.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C59B27] text-[#14100D] font-cinzel font-bold text-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Select CSV File from Computer</span>
                </div>
              </div>

              {/* Supported Columns Guide Card */}
              <div className="bg-white dark:bg-[#1E1915] border border-[#E8E2D5] dark:border-[#332A22] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase">
                  <Info className="w-4 h-4 text-[#C59B27]" />
                  <span>Standard Header Fields Supported</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">id</span> (Optional SKU)
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">name</span> (Required)
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">price</span> (Number)
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">stockCount</span> (Inventory)
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">category</span> (Pakistani, etc)
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">fabric</span> (Textile name)
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">imageUrl</span> (HTTPS link)
                  </div>
                  <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#14100D] border border-[#E8E2D5] dark:border-[#2E2620]">
                    <span className="text-[#C59B27] font-bold">description</span> (Product story)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE RAW CSV */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-cinzel font-semibold text-[#8C6B1B] dark:text-[#E8D59E] block mb-1.5">
                  Paste Raw CSV / Spreadsheet Columns
                </label>
                <textarea
                  rows={10}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="id,name,category,price,stockCount,imageUrl&#10;zardozi-royal-peshwas,Zardozi Velvet Royal Peshwas,Pakistani,580,12,https://...&#10;korean-nida-pearl-abaya,Korean Nida Pearl Trim Open Abaya,Abayas,245,8,https://..."
                  className="w-full p-4 bg-white dark:bg-[#14100D] border border-[#DDD3BC] dark:border-[#382E24] rounded-2xl text-xs font-mono text-[#1E1A17] dark:text-white leading-relaxed focus:border-[#C59B27] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCsvText('')}
                  className="text-xs text-[#8C7A6B] hover:text-[#C59B27] transition-colors cursor-pointer"
                >
                  Clear Text
                </button>
                <button
                  onClick={() => processCsv(csvText)}
                  disabled={!csvText.trim()}
                  className="px-6 py-2.5 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] rounded-xl font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <span>Parse CSV & Review Table</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEW & COMMIT TABLE */}
          {activeTab === 'preview' && (
            <div className="space-y-5">
              {/* Summary Metric Strip & Strategy Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-[#1E1915] p-3.5 rounded-2xl border border-[#E8E2D5] dark:border-[#332A22]">
                  <span className="text-[10.5px] uppercase font-semibold text-[#8C7E72] block">Total Parsed</span>
                  <p className="font-playfair text-xl font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                    {parsedRows.length} Rows
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1E1915] p-3.5 rounded-2xl border border-[#E8E2D5] dark:border-[#332A22]">
                  <span className="text-[10.5px] uppercase font-semibold text-emerald-600 block">Existing to Update</span>
                  <p className="font-playfair text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {parsedRows.filter((r) => r.isExisting && r.isValid).length} Products
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1E1915] p-3.5 rounded-2xl border border-[#E8E2D5] dark:border-[#332A22]">
                  <span className="text-[10.5px] uppercase font-semibold text-blue-600 block">New Items to Add</span>
                  <p className="font-playfair text-xl font-bold text-blue-600 dark:text-blue-400">
                    {parsedRows.filter((r) => !r.isExisting && r.isValid).length} Products
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1E1915] p-3.5 rounded-2xl border border-[#E8E2D5] dark:border-[#332A22]">
                  <span className="text-[10.5px] uppercase font-semibold text-amber-600 block">Validation Errors</span>
                  <p className="font-playfair text-xl font-bold text-amber-600 dark:text-amber-400">
                    {parsedRows.filter((r) => !r.isValid).length} Rows
                  </p>
                </div>
              </div>

              {/* Strategy & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1E1915] p-3.5 rounded-2xl border border-[#E8E2D5] dark:border-[#332A22]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-cinzel font-semibold text-[#8C6B1B] dark:text-[#E8D59E] uppercase">
                    Import Mode:
                  </span>
                  <select
                    value={importStrategy}
                    onChange={(e: any) => setImportStrategy(e.target.value)}
                    className="px-3 py-1.5 bg-[#FAF7F2] dark:bg-[#14100D] border border-[#DDD3BC] dark:border-[#382E24] rounded-xl text-xs font-sans-ui text-[#1E1A17] dark:text-white"
                  >
                    <option value="smart">Smart Merge (Update Existing + Add New)</option>
                    <option value="price_stock_only">Price & Stock Counts Only (Leave descriptions)</option>
                    <option value="overwrite">Overwrite Whole Catalog with CSV</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-[#FAF7F2] dark:bg-[#14100D] p-1 rounded-xl border border-[#E8E2D5] dark:border-[#2E2620] text-xs">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterMode === 'all' ? 'bg-[#C59B27] text-[#14100D] font-bold' : 'text-[#8C7E72]'
                    }`}
                  >
                    All ({parsedRows.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('updates')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterMode === 'updates' ? 'bg-[#C59B27] text-[#14100D] font-bold' : 'text-[#8C7E72]'
                    }`}
                  >
                    Updates ({parsedRows.filter((r) => r.isExisting && r.isValid).length})
                  </button>
                  <button
                    onClick={() => setFilterMode('new')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterMode === 'new' ? 'bg-[#C59B27] text-[#14100D] font-bold' : 'text-[#8C7E72]'
                    }`}
                  >
                    New ({parsedRows.filter((r) => !r.isExisting && r.isValid).length})
                  </button>
                  {parsedRows.some((r) => !r.isValid) && (
                    <button
                      onClick={() => setFilterMode('errors')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        filterMode === 'errors' ? 'bg-red-500 text-white font-bold' : 'text-red-500'
                      }`}
                    >
                      Errors ({parsedRows.filter((r) => !r.isValid).length})
                    </button>
                  )}
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="border border-[#E8E2D5] dark:border-[#332A22] rounded-2xl overflow-hidden bg-white dark:bg-[#14100D] max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] dark:bg-[#1E1915] border-b border-[#E8E2D5] dark:border-[#332A22] text-[#8C7E72] font-cinzel font-semibold sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Status</th>
                      <th className="p-3">Garment Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price Adjustment</th>
                      <th className="p-3">Stock Level</th>
                      <th className="p-3">Fabric & Color</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D5] dark:divide-[#2E2620]">
                    {filteredPreviewRows.map((row, idx) => (
                      <tr
                        key={`csv-preview-row-${row.data.id || idx}-${idx}`}
                        className={`hover:bg-[#FAF7F2]/50 dark:hover:bg-[#1E1915]/50 transition-colors ${
                          !row.isValid ? 'bg-red-500/10' : ''
                        }`}
                      >
                        <td className="p-3 whitespace-nowrap">
                          {!row.isValid ? (
                            <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                              Error
                            </span>
                          ) : row.isExisting ? (
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                              Update Existing
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              Add New Piece
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-[#1E1A17] dark:text-[#FAF7F2]">
                          <div className="flex items-center gap-2">
                            {row.data.images?.[0] && (
                              <img
                                src={row.data.images[0]}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover border border-[#E8E2D5] dark:border-[#332A22]"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
                              <p className="line-clamp-1">{row.data.name}</p>
                              <span className="text-[10px] font-mono text-[#8C7E72]">{row.data.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-[#8C7E72] whitespace-nowrap">{row.data.category}</td>
                        <td className="p-3 whitespace-nowrap">
                          {row.isExisting && row.existingProduct?.price !== row.data.price ? (
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="line-through text-[#8C7E72] text-[11px]">
                                {formatPrice(row.existingProduct?.price || 0, currentCurrency)}
                              </span>
                              <ArrowRight className="w-3 h-3 text-[#C59B27]" />
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {formatPrice(row.data.price || 0, currentCurrency)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                              {formatPrice(row.data.price || 0, currentCurrency)}
                            </span>
                          )}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                              (row.data.stockCount ?? 10) <= 5
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : 'bg-gray-100 dark:bg-[#1E1915] text-[#1E1A17] dark:text-[#FAF7F2]'
                            }`}
                          >
                            {row.data.stockCount} units
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-[#8C7E72] max-w-xs truncate">
                          {row.data.fabric} • {(row.data.colors || []).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-[#14100D] px-6 py-4 border-t border-[#C59B27]/40 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeTab === 'preview') {
                setActiveTab('upload');
              } else {
                onClose();
              }
            }}
            className="px-4 py-2 text-xs font-cinzel text-[#8C7A6B] hover:text-white transition-colors cursor-pointer"
          >
            {activeTab === 'preview' ? '← Back to File Upload' : 'Cancel'}
          </button>

          {activeTab === 'preview' && (
            <button
              onClick={handleApplyImport}
              disabled={isProcessing || parsedRows.filter((r) => r.isValid).length === 0}
              className="px-8 py-2.5 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] rounded-xl font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Commit & Import {parsedRows.filter((r) => r.isValid).length} Products</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
