import React, { useState, useRef } from 'react';
import { useSiteContent, DEFAULT_SITE_CONTENT, SiteContentSettings } from '../context/SiteContentContext';
import { Logo } from './Logo';
import { generateInvoicePdf } from '../utils/invoicePdf';
import { Order } from '../types';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import {
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  FileText,
  Save,
  Download,
  AlertCircle,
  HelpCircle,
  Search,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Type,
  Layout,
  Phone,
  Receipt,
  Layers,
  CheckCircle2,
  RefreshCw,
  Globe,
  Share2,
  SearchCode,
  ExternalLink,
  Copy
} from 'lucide-react';

interface AdminSiteContentEditorProps {
  initialTab?: 'logo' | 'brand' | 'announcement' | 'home' | 'about' | 'contact' | 'footer' | 'invoice' | 'seo' | 'dictionary';
}

export const AdminSiteContentEditor: React.FC<AdminSiteContentEditorProps> = ({
  initialTab = 'logo'
}) => {
  const {
    siteContent,
    updateSiteContent,
    uploadLogo,
    uploadLogoFile,
    resetToDefaultLogo,
    resetAllTextsToDefault,
    isSaving,
    lastSavedAt
  } = useSiteContent();

  const [formData, setFormData] = useState<SiteContentSettings>(siteContent);
  const [activeSubTab, setActiveSubTab] = useState<
    'logo' | 'brand' | 'announcement' | 'home' | 'about' | 'contact' | 'footer' | 'invoice' | 'seo' | 'dictionary'
  >(initialTab);

  const [selectedSeoSection, setSelectedSeoSection] = useState<'home' | 'shop' | 'about' | 'contact' | 'lookbook' | 'reviews'>('home');
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [customValueInput, setCustomValueInput] = useState('');
  const [isGeneratingSampleInvoice, setIsGeneratingSampleInvoice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData if siteContent changes externally
  React.useEffect(() => {
    setFormData(siteContent);
  }, [siteContent]);

  const handleChange = (field: keyof SiteContentSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    hapticSuccess();
    const ok = await updateSiteContent(formData);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Handle Logo Upload from File (Firebase Storage + Base64 fallback)
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const downloadUrl = await uploadLogoFile(file);
      if (downloadUrl) {
        setFormData((prev) => ({ ...prev, logoUrl: downloadUrl }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Could not upload file. Please try a different image format.');
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      alert('Failed to upload image file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Reset Logo
  const handleResetLogo = async () => {
    if (confirm('Revert to the default 3D gold Arabic calligraphy crest?')) {
      hapticWarning();
      setFormData((prev) => ({ ...prev, logoUrl: '' }));
      await resetToDefaultLogo();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Handle Reset All Texts
  const handleResetAllTexts = async () => {
    if (confirm('Are you sure you want to reset ALL website texts and titles back to factory defaults?')) {
      hapticWarning();
      const ok = await resetAllTextsToDefault();
      if (ok) {
        setFormData(DEFAULT_SITE_CONTENT);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };

  // Test Invoice Generation with Current Logo
  const handleDownloadSampleInvoice = async () => {
    setIsGeneratingSampleInvoice(true);
    try {
      const sampleOrder: Order = {
        id: 'ALN-TEST-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        shippingAddress: {
          fullName: 'Amina Al-Mansoor',
          street: 'Flat 12B, Noor Royal Residency, Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400026',
          country: 'India',
          phone: '+91 98201 54321',
          email: 'amina.mansoor@example.com'
        },
        items: [
          {
            productId: 'sample-1',
            name: 'Noor-e-Jahan Royal Peshwas & Heavy Zardozi Dupatta',
            price: 540,
            quantity: 1,
            size: 'M',
            color: 'Imperial Ivory Gold',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
          },
          {
            productId: 'sample-2',
            name: 'Imperial Raw Silk Kimono Abaya with Metallic Piping',
            price: 260,
            quantity: 1,
            size: '56',
            color: 'Midnight Obsidian',
            image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
          }
        ],
        itemsCount: 2,
        subtotal: 800,
        discount: 80,
        shipping: 0,
        total: 720,
        status: 'Order Confirmed',
        trackingNumber: 'DHL-EXP-9482015-IN',
        carrier: 'DHL Express Worldwide Insured',
        estimatedDelivery: 'Within 3–5 Business Days',
        paymentMethod: 'Direct Secure Checkout'
      };

      await generateInvoicePdf(sampleOrder, 'INR', {
        logoUrl: formData.logoUrl,
        brandName: formData.brandName,
        brandSubtitle: formData.brandSubtitle,
        brandArabic: formData.brandArabic,
        brandTagline: formData.brandTagline,
        gstNumber: formData.invoiceGstNumber,
        atelierLocation: formData.invoiceAtelierLocation,
        contactPhone: formData.contactPhone,
        merchantUpiId: formData.merchantUpiId,
        careInstructions: formData.invoiceCareInstructions,
        invoiceTermsNote: formData.invoiceTermsNote
      });
      hapticSuccess();
    } catch (e) {
      console.error('Invoice sample generation error:', e);
      alert('Could not generate sample invoice PDF: ' + (e as any)?.message);
    } finally {
      setIsGeneratingSampleInvoice(false);
    }
  };

  // Add custom key-value override
  const handleAddCustomKey = () => {
    if (!customKeyInput.trim()) return;
    const cleanKey = customKeyInput.trim().replace(/\s+/g, '_');
    setFormData((prev) => ({
      ...prev,
      customTexts: {
        ...(prev.customTexts || {}),
        [cleanKey]: customValueInput
      }
    }));
    setCustomKeyInput('');
    setCustomValueInput('');
  };

  const handleRemoveCustomKey = (key: string) => {
    setFormData((prev) => {
      const nextCustom = { ...(prev.customTexts || {}) };
      delete nextCustom[key];
      return {
        ...prev,
        customTexts: nextCustom
      };
    });
  };

  return (
    <div id="admin-site-content-studio" className="space-y-6 max-w-6xl">
      {/* Top Header & Save Bar */}
      <div className="bg-[#1C1713] border border-[#C59B27]/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-wider font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Site Content, Brand Logo & Text Studio
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Edit Every Text & Upload Website Logo
          </h2>
          <p className="text-xs sm:text-sm text-[#A69788] max-w-2xl">
            Upload your official brand logo (used on the navbar, footer, order confirmation, and all downloaded customer PDF invoices) and customize any text across the website in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-wrap">
          {saveSuccess && (
            <span className="px-3.5 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" /> Saved & Synced Live!
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="px-6 py-3 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] font-cinzel font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C59B27]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[#1C1713] p-1.5 rounded-2xl border border-[#2E2620] overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('logo')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'logo'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Brand Logo & Invoices</span>
        </button>

        <button
          onClick={() => setActiveSubTab('brand')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'brand'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Brand Identity & Header</span>
        </button>

        <button
          onClick={() => setActiveSubTab('announcement')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'announcement'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Announcement Bar</span>
        </button>

        <button
          onClick={() => setActiveSubTab('home')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'home'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Home Page & Hero</span>
        </button>

        <button
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'about'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>About & Heritage Page</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact & Concierge</span>
        </button>

        <button
          onClick={() => setActiveSubTab('footer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'footer'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Footer & Social Links</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invoice')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'invoice'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoice & Legal Texts</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seo')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'seo'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO & Search Visibility</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dictionary')}
          className={`px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'dictionary'
              ? 'bg-[#C59B27] text-[#14100D] shadow-sm font-bold'
              : 'text-[#C5BAAC] hover:text-white hover:bg-[#251E18]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>All Custom String Overrides</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* 1. BRAND LOGO & INVOICE MANAGEMENT                         */}
      {/* ========================================================== */}
      {activeSubTab === 'logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-7 bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#C59B27]" />
                <span>Upload Website & Invoice Logo</span>
              </h3>
              <p className="text-xs text-[#A69788]">
                Upload your company logo. It replaces the default vector across the navbar, footer, order confirmation screens, and customer PDF invoices.
              </p>
            </div>

            {/* Dropzone / Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#C59B27]/50 hover:border-[#C59B27] bg-[#14100D] hover:bg-[#1A1512] rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                className="hidden"
                onChange={handleLogoFileChange}
              />

              <div className="w-14 h-14 rounded-full bg-[#2B231D] border border-[#C59B27]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <RefreshCw className="w-6 h-6 text-[#C59B27] animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-[#C59B27]" />
                )}
              </div>

              <div>
                <p className="font-cinzel text-sm font-bold text-white">
                  {isUploading ? 'Uploading & Processing Image...' : 'Click to Upload New Logo File'}
                </p>
                <p className="text-xs text-[#8C7A6B] mt-1">
                  Supports PNG, JPG, SVG, WebP (Transparent PNG / High-res recommended)
                </p>
              </div>

              <button
                type="button"
                className="mt-2 px-4 py-2 bg-[#2B231D] hover:bg-[#3D322A] text-[#E8D59E] border border-[#C59B27]/40 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Select Image From Device
              </button>
            </div>

            {/* Or Direct Image URL Input */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-[#C5BAAC] block">
                Or Paste Direct Logo Image URL (CDN / Hosted Image)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.logoUrl || ''}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  placeholder="https://example.com/my-luxury-logo.png"
                  className="flex-1 px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                />
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Remove custom logo and revert to default gold crest"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Invoice Test Trigger */}
            <div className="p-4 rounded-2xl bg-[#14100D] border border-[#382E24] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-[#C59B27]" />
                    <span>Instant Customer PDF Invoice Test</span>
                  </h4>
                  <p className="text-[11px] text-[#8C7A6B]">
                    Generate and download a real PDF tax invoice to verify that your uploaded logo renders crisp and aligned.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadSampleInvoice}
                  disabled={isGeneratingSampleInvoice}
                  className="px-4 py-2.5 bg-[#2B231D] hover:bg-[#3D322A] text-[#E8D59E] border border-[#C59B27]/50 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  {isGeneratingSampleInvoice ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-[#C59B27]" />
                  )}
                  <span>{isGeneratingSampleInvoice ? 'Generating PDF...' : 'Download Sample Invoice PDF'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Previews in all Variants */}
          <div className="lg:col-span-5 bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#C59B27]" />
                <span>Live Logo Preview Across Website</span>
              </h3>
              <p className="text-xs text-[#A69788]">
                Real-time preview of how your logo appears in various navigation and invoice contexts.
              </p>
            </div>

            {/* 1. Header Navbar Lockup Preview */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] text-[#1E1A17] border border-[#E0D5BE] space-y-2">
              <span className="text-[10px] font-mono text-[#8C6B1B] uppercase tracking-wider font-bold block">
                1. Storefront Header / Navbar Preview (Light Mode)
              </span>
              <div className="p-3 bg-white rounded-xl border border-[#DDD3BC] flex items-center justify-between">
                <Logo
                  variant="header"
                  customLogoUrl={formData.logoUrl}
                  customBrandName={formData.brandName}
                  customBrandSubtitle={formData.brandSubtitle}
                  customBrandArabic={formData.brandArabic}
                  customBrandTagline={formData.brandTagline}
                />
              </div>
            </div>

            {/* 2. Order Success & Invoice Seal Lockup */}
            <div className="p-4 rounded-2xl bg-[#14100D] border border-[#382E24] space-y-2 text-center">
              <span className="text-[10px] font-mono text-[#E8D59E] uppercase tracking-wider font-bold block text-left">
                2. Order Confirmation / Invoice Seal Preview (Dark Mode)
              </span>
              <div className="py-4 flex justify-center">
                <Logo
                  variant="seal"
                  customLogoUrl={formData.logoUrl}
                  customBrandName={formData.brandName}
                  customBrandSubtitle={formData.brandSubtitle}
                  customBrandArabic={formData.brandArabic}
                  customBrandTagline={formData.brandTagline}
                />
              </div>
            </div>

            {/* 3. Badge & Full Displays */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E0D5BE] text-center flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-[#8C6B1B] uppercase tracking-wider mb-2 font-bold">
                  Compact Badge
                </span>
                <Logo
                  variant="badge"
                  customLogoUrl={formData.logoUrl}
                  customBrandName={formData.brandName}
                  customBrandSubtitle={formData.brandSubtitle}
                  customBrandArabic={formData.brandArabic}
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E0D5BE] text-center flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-[#8C6B1B] uppercase tracking-wider mb-2 font-bold">
                  Inline Header
                </span>
                <Logo
                  variant="inline"
                  customLogoUrl={formData.logoUrl}
                  customBrandName={formData.brandName}
                  customBrandSubtitle={formData.brandSubtitle}
                  customBrandArabic={formData.brandArabic}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. BRAND IDENTITY & HEADER TEXTS                           */}
      {/* ========================================================== */}
      {activeSubTab === 'brand' && (
        <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-[#C59B27]" />
              <span>Brand Identity & Main Typography</span>
            </h3>
            <p className="text-xs text-[#A69788]">
              Edit the core brand names, Arabic calligraphy label, subtitle, and primary store tagline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Primary Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                placeholder="AL NOUREEN"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-cinzel font-bold focus:border-[#C59B27] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Brand Subtitle / Creator Byline
              </label>
              <input
                type="text"
                value={formData.brandSubtitle}
                onChange={(e) => handleChange('brandSubtitle', e.target.value)}
                placeholder="by Nasreen"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white italic focus:border-[#C59B27] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Arabic Script Calligraphy Name
              </label>
              <input
                type="text"
                value={formData.brandArabic}
                onChange={(e) => handleChange('brandArabic', e.target.value)}
                placeholder="النورين"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-serif focus:border-[#C59B27] focus:outline-hidden text-right"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Header Subtitle / Luxury Genre
              </label>
              <input
                type="text"
                value={formData.brandSubheading}
                onChange={(e) => handleChange('brandSubheading', e.target.value)}
                placeholder="Indian & Modest Luxury"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Master Brand Tagline / Philosophy
              </label>
              <input
                type="text"
                value={formData.brandTagline}
                onChange={(e) => handleChange('brandTagline', e.target.value)}
                placeholder="Two Lights. One Beautiful Vision."
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-serif italic focus:border-[#C59B27] focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. ANNOUNCEMENT BAR & PROMOTIONS                           */}
      {/* ========================================================== */}
      {activeSubTab === 'announcement' && (
        <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#C59B27]" />
              <span>Top Announcement & Promotional Bar</span>
            </h3>
            <p className="text-xs text-[#A69788]">
              Configure the top luxury ribbon running across all pages of the store.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Announcement Bar Message Text
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                placeholder="Complimentary Insured Express Delivery Across India & Worldwide on Orders Above ₹5,000 / $150"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Featured Coupon / Privilege Code
                </label>
                <input
                  type="text"
                  value={formData.announcementCode}
                  onChange={(e) => handleChange('announcementCode', e.target.value)}
                  placeholder="NOUREEN10"
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-[#C59B27] font-mono font-bold focus:border-[#C59B27] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Discount Highlight Badge Text
                </label>
                <input
                  type="text"
                  value={formData.announcementDiscountText}
                  onChange={(e) => handleChange('announcementDiscountText', e.target.value)}
                  placeholder="10% OFF INAUGURAL ORDER"
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 px-4 py-3 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white cursor-pointer hover:border-[#C59B27]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.announcementEnabled}
                  onChange={(e) => handleChange('announcementEnabled', e.target.checked)}
                  className="w-4 h-4 accent-[#C59B27]"
                />
                <span className="font-semibold">Enable Top Announcement Bar on Storefront</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. HOME PAGE & HERO TEXTS                                 */}
      {/* ========================================================== */}
      {activeSubTab === 'home' && (
        <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C59B27]" />
              <span>Home Page, Hero & Value Proposition Texts</span>
            </h3>
            <p className="text-xs text-[#A69788]">
              Customize the prominent hero slide titles, subtitles, call-to-action buttons, and value propositions.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Hero Badge / Season Pill
                </label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => handleChange('heroBadge', e.target.value)}
                  placeholder="Maison Heritage 2026 Collection"
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Hero Arabic Calligraphy Sub-Pill
                </label>
                <input
                  type="text"
                  value={formData.heroArabicTag}
                  onChange={(e) => handleChange('heroArabicTag', e.target.value)}
                  placeholder="النورين • فن الزردوزي والتطريز اليدوي"
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden text-right font-serif"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Main Hero Headline (H1)
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => handleChange('heroHeadline', e.target.value)}
                placeholder="Two Lights. One Beautiful Vision."
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-cinzel font-bold focus:border-[#C59B27] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                placeholder="Luxury Modest Couture, Handcrafted Pakistani Ensembles & Artisanal Abayas."
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Hero Narrative Description
              </label>
              <textarea
                rows={2}
                value={formData.heroDescription}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Primary Button (CTA)
                </label>
                <input
                  type="text"
                  value={formData.heroCtaPrimary}
                  onChange={(e) => handleChange('heroCtaPrimary', e.target.value)}
                  placeholder="Explore Pakistani Heritage"
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Secondary Button (CTA)
                </label>
                <input
                  type="text"
                  value={formData.heroCtaSecondary}
                  onChange={(e) => handleChange('heroCtaSecondary', e.target.value)}
                  placeholder="View Royal Lookbook"
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Value Propositions */}
            <div className="pt-4 border-t border-[#2E2620] space-y-4">
              <h4 className="font-cinzel text-sm font-bold text-[#E8D59E]">
                Four Value Proposition Cards (Home Screen)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#14100D] border border-[#382E24] rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-[#C59B27] uppercase font-bold">1. Pillar 1</span>
                  <input
                    type="text"
                    value={formData.valueProp1Title}
                    onChange={(e) => handleChange('valueProp1Title', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-white font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={formData.valueProp1Desc}
                    onChange={(e) => handleChange('valueProp1Desc', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-[#A69788]"
                  />
                </div>

                <div className="p-4 bg-[#14100D] border border-[#382E24] rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-[#C59B27] uppercase font-bold">2. Pillar 2</span>
                  <input
                    type="text"
                    value={formData.valueProp2Title}
                    onChange={(e) => handleChange('valueProp2Title', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-white font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={formData.valueProp2Desc}
                    onChange={(e) => handleChange('valueProp2Desc', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-[#A69788]"
                  />
                </div>

                <div className="p-4 bg-[#14100D] border border-[#382E24] rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-[#C59B27] uppercase font-bold">3. Pillar 3</span>
                  <input
                    type="text"
                    value={formData.valueProp3Title}
                    onChange={(e) => handleChange('valueProp3Title', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-white font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={formData.valueProp3Desc}
                    onChange={(e) => handleChange('valueProp3Desc', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-[#A69788]"
                  />
                </div>

                <div className="p-4 bg-[#14100D] border border-[#382E24] rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-[#C59B27] uppercase font-bold">4. Pillar 4</span>
                  <input
                    type="text"
                    value={formData.valueProp4Title}
                    onChange={(e) => handleChange('valueProp4Title', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-white font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={formData.valueProp4Desc}
                    onChange={(e) => handleChange('valueProp4Desc', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-[#A69788]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. ABOUT & HERITAGE PAGE TEXTS                            */}
      {/* ========================================================== */}
      {activeSubTab === 'about' && (
        <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C59B27]" />
              <span>About Maison AL-NOUREEN Heritage Texts</span>
            </h3>
            <p className="text-xs text-[#A69788]">
              Edit the brand origin story, the meaning of Al-Noureen (النورين), atelier descriptions, and Nasreen's founder quote.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  About Hero Title (H1)
                </label>
                <input
                  type="text"
                  value={formData.aboutHeroTitle}
                  onChange={(e) => handleChange('aboutHeroTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-cinzel font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  About Arabic Sub-headline
                </label>
                <input
                  type="text"
                  value={formData.aboutHeroArabic}
                  onChange={(e) => handleChange('aboutHeroArabic', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-serif text-right"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Meaning of Al-Noureen (Story Paragraph)
              </label>
              <textarea
                rows={3}
                value={formData.aboutEthosDesc}
                onChange={(e) => handleChange('aboutEthosDesc', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white leading-relaxed"
              />
            </div>

            {/* 3 Pillars of Philosophy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#14100D] border border-[#382E24] rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-[#C59B27] font-bold">Pillar I</span>
                <input
                  type="text"
                  value={formData.aboutPillar1Title}
                  onChange={(e) => handleChange('aboutPillar1Title', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-white font-semibold"
                />
                <textarea
                  rows={3}
                  value={formData.aboutPillar1Desc}
                  onChange={(e) => handleChange('aboutPillar1Desc', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-[#A69788]"
                />
              </div>

              <div className="p-4 bg-[#14100D] border border-[#382E24] rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-[#C59B27] font-bold">Pillar II</span>
                <input
                  type="text"
                  value={formData.aboutPillar2Title}
                  onChange={(e) => handleChange('aboutPillar2Title', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-white font-semibold"
                />
                <textarea
                  rows={3}
                  value={formData.aboutPillar2Desc}
                  onChange={(e) => handleChange('aboutPillar2Desc', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-[#A69788]"
                />
              </div>

              <div className="p-4 bg-[#14100D] border border-[#382E24] rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-[#C59B27] font-bold">Pillar III</span>
                <input
                  type="text"
                  value={formData.aboutPillar3Title}
                  onChange={(e) => handleChange('aboutPillar3Title', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-white font-semibold"
                />
                <textarea
                  rows={3}
                  value={formData.aboutPillar3Desc}
                  onChange={(e) => handleChange('aboutPillar3Desc', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#1C1713] border border-[#2E2620] rounded-lg text-xs text-[#A69788]"
                />
              </div>
            </div>

            {/* Founder Note & Quote */}
            <div className="pt-2 border-t border-[#2E2620] space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Founder Nasreen Quote
                </label>
                <textarea
                  rows={2}
                  value={formData.aboutNasreenQuote}
                  onChange={(e) => handleChange('aboutNasreenQuote', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white italic font-serif"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                  Founder Title / Attribution
                </label>
                <input
                  type="text"
                  value={formData.aboutNasreenTitle}
                  onChange={(e) => handleChange('aboutNasreenTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 6. CONTACT & CONCIERGE INFORMATION                         */}
      {/* ========================================================== */}
      {activeSubTab === 'contact' && (
        <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#C59B27]" />
              <span>Atelier Contact, WhatsApp & Concierge Details</span>
            </h3>
            <p className="text-xs text-[#A69788]">
              Update your direct email, customer care phone numbers, WhatsApp live styling number, and physical boutique address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Official Support / Concierge Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="concierge@al-noureen.com"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Customer Care Helpline Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+91 93262 94187"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Direct WhatsApp VIP Stylist Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+91 93262 94187"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-[#25D366] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                placeholder="@alnoureen.couture"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-[#E8D59E]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Atelier Physical Boutique Address
              </label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                placeholder="Atelier AL-NOUREEN, 42 Altamount Road, Bandra West, Mumbai, Maharashtra 400050, India"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Boutique Working Hours
              </label>
              <input
                type="text"
                value={formData.contactHours}
                onChange={(e) => handleChange('contactHours', e.target.value)}
                placeholder="Mon – Sat: 10:00 AM – 8:00 PM IST"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 7. INVOICE, GST & LEGAL POLICIES                           */}
      {/* ========================================================== */}
      {activeSubTab === 'invoice' && (
        <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#C59B27]" />
              <span>Tax Invoice, GST Registration & Legal Texts</span>
            </h3>
            <p className="text-xs text-[#A69788]">
              Configure the legal texts, tax identification numbers, and terms shown on all generated customer invoices and footer notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                GST / VAT / Tax Registration Number
              </label>
              <input
                type="text"
                value={formData.invoiceGstNumber}
                onChange={(e) => handleChange('invoiceGstNumber', e.target.value)}
                placeholder="27AAECN9482M1Z5"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-[#C59B27] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Merchant UPI ID (For Payment Verification)
              </label>
              <input
                type="text"
                value={formData.merchantUpiId}
                onChange={(e) => handleChange('merchantUpiId', e.target.value)}
                placeholder="9326294187@okbizaxis"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Invoice Sub-Header Atelier Locations
              </label>
              <input
                type="text"
                value={formData.invoiceAtelierLocation}
                onChange={(e) => handleChange('invoiceAtelierLocation', e.target.value)}
                placeholder="MUMBAI, MAHARASHTRA, INDIA"
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                Invoice Disclaimer & Terms Note
              </label>
              <input
                type="text"
                value={formData.invoiceTermsNote}
                onChange={(e) => handleChange('invoiceTermsNote', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 7. FOOTER SETTINGS & SOCIAL MEDIA STUDIO                     */}
      {/* ========================================================== */}
      {activeSubTab === 'footer' && (
        <div className="space-y-6">
          <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2620] pb-5">
              <div className="space-y-1">
                <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#C59B27]" />
                  <span>Footer Settings & Social Handles Manager</span>
                </h3>
                <p className="text-xs text-[#A69788]">
                  Dynamically customize footer branding, copyright notice, social media links, Mumbai atelier address, and payment security badges across every page.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#C59B27]/10 border border-[#C59B27]/30 text-[#E8D59E] rounded-full text-xs font-mono">
                Live Global Footer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Narrative & Copyright */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  <span>1. Brand Philosophy, Atelier Address & Copyright</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                      Footer Brand Philosophy / About Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={formData.footerAbout}
                      onChange={(e) => handleChange('footerAbout', e.target.value)}
                      placeholder="Al-Noureen (النورين) means 'The Two Lights'. The two lights illuminate the divine balance between tradition and modernity..."
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white leading-relaxed focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                      Footer Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.footerTagline}
                      onChange={(e) => handleChange('footerTagline', e.target.value)}
                      placeholder="Designed with bespoke dignity for the modern global woman."
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                      Head Atelier Physical Address (Mumbai Only)
                    </label>
                    <input
                      type="text"
                      value={formData.footerAddress}
                      onChange={(e) => handleChange('footerAddress', e.target.value)}
                      placeholder="Bandra West, Mumbai, Maharashtra 400050, India"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                      Global Footer Copyright Notice
                    </label>
                    <input
                      type="text"
                      value={formData.footerCopyright}
                      onChange={(e) => handleChange('footerCopyright', e.target.value)}
                      placeholder="© 2026 AL NOUREEN by Nasreen. All Rights Reserved. Two Lights. One Beautiful Vision."
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Handles */}
              <div className="space-y-4 md:col-span-2 pt-4 border-t border-[#2E2620]">
                <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C59B27]" />
                  <span>2. Social Media Handles & Concierge Channels</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> WhatsApp Direct Number
                    </label>
                    <input
                      type="text"
                      value={formData.footerWhatsappNumber}
                      onChange={(e) => handleChange('footerWhatsappNumber', e.target.value)}
                      placeholder="+91 93262 94187"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-mono focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500" /> Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      value={formData.footerInstagramUrl}
                      onChange={(e) => handleChange('footerInstagramUrl', e.target.value)}
                      placeholder="https://instagram.com/alnoureen.couture"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> Facebook Page URL
                    </label>
                    <input
                      type="text"
                      value={formData.footerFacebookUrl}
                      onChange={(e) => handleChange('footerFacebookUrl', e.target.value)}
                      placeholder="https://facebook.com/alnoureen.couture"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> YouTube Channel URL
                    </label>
                    <input
                      type="text"
                      value={formData.footerYoutubeUrl}
                      onChange={(e) => handleChange('footerYoutubeUrl', e.target.value)}
                      placeholder="https://youtube.com/@alnoureen"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-700" /> Pinterest Lookbook URL
                    </label>
                    <input
                      type="text"
                      value={formData.footerPinterestUrl}
                      onChange={(e) => handleChange('footerPinterestUrl', e.target.value)}
                      placeholder="https://pinterest.com/alnoureen"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-400" /> TikTok / Reels Handle URL
                    </label>
                    <input
                      type="text"
                      value={formData.footerTiktokUrl}
                      onChange={(e) => handleChange('footerTiktokUrl', e.target.value)}
                      placeholder="https://tiktok.com/@alnoureen"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway & Security Settings */}
              <div className="space-y-4 md:col-span-2 pt-4 border-t border-[#2E2620]">
                <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#C59B27]" />
                  <span>3. Payment Gateway Integration & API Security Key</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 p-4 bg-[#14100D] border border-[#C59B27]/40 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C59B27]" /> Integrated Payment Gateway API Key
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-mono">
                        Active & Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.paymentGatewayApiKey}
                        onChange={(e) => handleChange('paymentGatewayApiKey', e.target.value)}
                        placeholder="E6At58j4nHgcyYaUexhlpRIc"
                        className="flex-1 px-3.5 py-2 bg-[#1C1713] border border-[#382E24] rounded-xl text-xs font-mono text-[#E8D59E] focus:border-[#C59B27] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(formData.paymentGatewayApiKey);
                          alert('Payment API Key copied to clipboard!');
                        }}
                        className="px-3.5 py-2 bg-[#28221D] hover:bg-[#382E24] text-[#E8D59E] border border-[#C59B27]/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                    </div>

                    <p className="text-[11px] text-[#8C7A6B]">
                      This API key automatically verifies checkout transactions, authorizes direct payloads, and generates authenticated digital payment tokens.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                      Payment Trust Badges Text
                    </label>
                    <input
                      type="text"
                      value={formData.footerPaymentBadgesText}
                      onChange={(e) => handleChange('footerPaymentBadgesText', e.target.value)}
                      placeholder="256-BIT SSL ENCRYPTED • SECURE ATELIER CHECKOUT • INSURED COURIER"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#C5BAAC] block mb-1">
                      Merchant ID / Identifier
                    </label>
                    <input
                      type="text"
                      value={formData.paymentGatewayMerchantId}
                      onChange={(e) => handleChange('paymentGatewayMerchantId', e.target.value)}
                      placeholder="merchant.com.alnoureen.nasreen"
                      className="w-full px-3.5 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white font-mono focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Live Footer Preview */}
          <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2E2620] pb-3">
              <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#C59B27]" />
                <span>Live Interactive Footer Preview</span>
              </h4>
              <span className="text-[10px] font-mono text-[#A69788]">Real-time rendering simulator</span>
            </div>

            <div className="bg-[#151210] border border-[#C59B27]/40 rounded-2xl p-6 text-[#EFEBE4] space-y-6 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3 lg:col-span-2">
                  <div className="flex items-center gap-2">
                    <Logo variant="inline" showTagline={false} />
                  </div>
                  <p className="text-xs text-[#C5BAAC] leading-relaxed">
                    {formData.footerAbout}
                  </p>
                  <p className="text-[11px] text-[#9E8E7C]">
                    {formData.footerTagline}
                  </p>
                  <p className="text-[11px] text-[#A69788]">
                    📍 <strong>Flagship:</strong> {formData.footerAddress}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 bg-[#28221C] border border-[#C59B27]/40 rounded-full text-[10px] text-[#E8D59E]">
                      WhatsApp: {formData.footerWhatsappNumber}
                    </span>
                    <span className="px-2.5 py-1 bg-[#28221C] border border-[#C59B27]/40 rounded-full text-[10px] text-[#E8D59E]">
                      Instagram: {formData.instagramHandle || '@alnoureen.couture'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h5 className="font-cinzel font-bold text-[#E8D59E] uppercase tracking-wider text-[11px]">
                    Collections
                  </h5>
                  <p className="text-[#8C7E72]">Haute Abayas (52"–60")</p>
                  <p className="text-[#8C7E72]">Pakistani Peshwas & Suits</p>
                  <p className="text-[#8C7E72]">Modal & Silk Hijabs</p>
                </div>

                <div className="space-y-2 text-xs">
                  <h5 className="font-cinzel font-bold text-[#E8D59E] uppercase tracking-wider text-[11px]">
                    Client Concierge
                  </h5>
                  <p className="text-[#8C7E72]">Bespoke Bridal Appointments</p>
                  <p className="text-[#8C7E72]">DHL Express Air Tracking</p>
                  <p className="text-[#8C7E72]">Modest Sizing Guide</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#C59B27]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#8C7A6B]">
                <p>{formData.footerCopyright}</p>
                <div className="flex items-center gap-2 font-mono text-[9px] text-[#A69788]">
                  <span className="px-2 py-0.5 bg-[#201B17] border border-[#C59B27]/20 rounded">VISA</span>
                  <span className="px-2 py-0.5 bg-[#201B17] border border-[#C59B27]/20 rounded">MASTERCARD</span>
                  <span className="px-2 py-0.5 bg-[#201B17] border border-[#C59B27]/20 rounded">UPI / GPAY (+91 9326294187)</span>
                  <span className="px-2 py-0.5 bg-[#201B17] border border-[#C59B27]/20 rounded">APPLE PAY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 8. GRANULAR DICTIONARY / ALL TEXT STRINGS OVERRIDE          */}
      {/* ========================================================== */}
      {activeSubTab === 'dictionary' && (
        <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-[#C59B27]" />
              <span>Custom Text Key-Value Overrides (Edit Any String)</span>
            </h3>
            <p className="text-xs text-[#A69788]">
              Define or override any text key in the application. Any component looking up this key will automatically render your custom text.
            </p>
          </div>

          {/* Add New Key */}
          <div className="p-4 rounded-2xl bg-[#14100D] border border-[#382E24] space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Add Custom Key-Value Text Override</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  placeholder="e.g. checkout_security_note"
                  className="w-full px-3.5 py-2 bg-[#1C1713] border border-[#2E2620] rounded-xl text-xs text-white font-mono"
                />
              </div>
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={customValueInput}
                  onChange={(e) => setCustomValueInput(e.target.value)}
                  placeholder="e.g. Insured Express 100% Encrypted Payment"
                  className="w-full px-3.5 py-2 bg-[#1C1713] border border-[#2E2620] rounded-xl text-xs text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddCustomKey}
                  disabled={!customKeyInput.trim()}
                  className="w-full py-2 bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] font-cinzel font-bold text-xs rounded-xl cursor-pointer disabled:opacity-40 transition-all"
                >
                  Add Override
                </button>
              </div>
            </div>
          </div>

          {/* List of Custom Key Overrides */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-[#C5BAAC]">
              Active Custom Overrides ({Object.keys(formData.customTexts || {}).length})
            </h4>

            {Object.keys(formData.customTexts || {}).length === 0 ? (
              <div className="p-6 text-center text-xs text-[#8C7A6B] bg-[#14100D] rounded-2xl border border-[#2E2620]">
                No custom string overrides active. Standard layout strings are in effect.
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(formData.customTexts || {}).map(([key, val], idx) => (
                  <div
                    key={`custom-text-${key}-${idx}`}
                    className="p-3 bg-[#14100D] border border-[#2E2620] rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <span className="sm:col-span-4 font-mono text-xs text-[#C59B27] truncate">
                        {key}
                      </span>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => {
                          const updated = { ...(formData.customTexts || {}), [key]: e.target.value };
                          setFormData((prev) => ({ ...prev, customTexts: updated }));
                        }}
                        className="sm:col-span-8 px-2.5 py-1.5 bg-[#1C1713] border border-[#382E24] rounded-lg text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomKey(key)}
                      className="p-1.5 text-[#8C7A6B] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete override"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 8. SEO, METADATA & SEARCH ENGINE VISIBILITY                */}
      {/* ========================================================== */}
      {activeSubTab === 'seo' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase font-bold">
                  <Globe className="w-3.5 h-3.5 text-[#C59B27]" /> Search Engine Optimization & Social Sharing
                </div>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  Google SERP & OpenGraph Social Card Studio
                </h3>
                <p className="text-xs text-[#A69788] max-w-2xl">
                  Configure browser tab titles, meta descriptions, search engine index rules, and rich social media preview cards (for WhatsApp, iMessage, Twitter, and Facebook) for every section of the website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const snippet = `<script type="application/ld+json">\n${JSON.stringify(
                      {
                        '@context': 'https://schema.org',
                        '@type': 'FashionStore',
                        name: `${formData.brandName} ${formData.brandSubtitle}`,
                        alternateName: formData.brandArabic,
                        url: formData.seoCanonicalBaseUrl || 'https://al-noureen.com',
                        logo: formData.logoUrl || formData.seoOgImageUrl,
                        description: formData.seoDefaultDescription,
                        address: {
                          '@type': 'PostalAddress',
                          addressLocality: 'Mumbai',
                          addressRegion: 'Maharashtra',
                          addressCountry: 'IN'
                        },
                        priceRange: '₹₹₹₹'
                      },
                      null,
                      2
                    )}\n</script>`;
                    navigator.clipboard.writeText(snippet);
                    setCopiedJsonLd(true);
                    setTimeout(() => setCopiedJsonLd(false), 3000);
                  }}
                  className="px-4 py-2 bg-[#251E18] hover:bg-[#332A22] text-[#E8D59E] border border-[#C59B27]/40 rounded-xl text-xs font-cinzel font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <SearchCode className="w-4 h-4 text-[#C59B27]" />
                  <span>{copiedJsonLd ? 'JSON-LD Copied!' : 'Copy Schema.org JSON-LD'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Global & Section Editors (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Global SEO Settings */}
              <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#2E2620] pb-3">
                  <h4 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#C59B27]" />
                    <span>Global Website Metadata</span>
                  </h4>
                  <span className="text-[11px] font-mono text-[#8C7E72]">Site-wide defaults</span>
                </div>

                <div className="space-y-4">
                  {/* Default Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-cinzel font-semibold text-[#E8D59E]">
                        Default Page Title (SEO Tag)
                      </label>
                      <span className="text-[10px] font-mono text-[#8C7E72]">
                        {(formData.seoDefaultTitle || '').length}/60 chars (Recommended: 50-60)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.seoDefaultTitle || ''}
                      onChange={(e) => handleChange('seoDefaultTitle', e.target.value)}
                      placeholder="AL NOUREEN by Nasreen | Modest Couture & Pakistani Ensembles"
                      className="w-full px-4 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  {/* Default Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-cinzel font-semibold text-[#E8D59E]">
                        Global Meta Description
                      </label>
                      <span className={`text-[10px] font-mono ${
                        (formData.seoDefaultDescription || '').length > 160 ? 'text-amber-400' : 'text-[#8C7E72]'
                      }`}>
                        {(formData.seoDefaultDescription || '').length}/160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.seoDefaultDescription || ''}
                      onChange={(e) => handleChange('seoDefaultDescription', e.target.value)}
                      placeholder="Discover handcrafted Pakistani ethnic luxury, pure mulberry silk abayas, and royal zardozi ensembles by AL-NOUREEN..."
                      className="w-full px-4 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                      Meta Keywords (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.seoKeywords || ''}
                      onChange={(e) => handleChange('seoKeywords', e.target.value)}
                      placeholder="modest fashion, luxury abayas, pakistani bridal, zardozi embroidery"
                      className="w-full px-4 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  {/* Canonical URL & Twitter Handle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                        Canonical Base URL
                      </label>
                      <input
                        type="url"
                        value={formData.seoCanonicalBaseUrl || ''}
                        onChange={(e) => handleChange('seoCanonicalBaseUrl', e.target.value)}
                        placeholder="https://al-noureen.com"
                        className="w-full px-4 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                        Twitter / X Creator Handle
                      </label>
                      <input
                        type="text"
                        value={formData.seoTwitterHandle || ''}
                        onChange={(e) => handleChange('seoTwitterHandle', e.target.value)}
                        placeholder="@alnoureen_couture"
                        className="w-full px-4 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Default OpenGraph Social Banner Image */}
                  <div>
                    <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                      Default Social Share Banner (OpenGraph 1200x630 Image)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={formData.seoOgImageUrl || ''}
                        onChange={(e) => handleChange('seoOgImageUrl', e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-4 py-2.5 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                      />
                      {formData.seoOgImageUrl && (
                        <a
                          href={formData.seoOgImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-[#28211B] text-[#C59B27] rounded-xl hover:bg-[#382E24] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Search Engine Robots Indexing */}
                  <div className="flex items-center justify-between p-3.5 bg-[#14100D] border border-[#2E2620] rounded-2xl">
                    <div>
                      <p className="text-xs font-cinzel font-bold text-white">
                        Allow Search Engines to Index (robots.txt / meta robots)
                      </p>
                      <p className="text-[11px] text-[#8C7E72]">
                        {formData.seoRobotsIndex ? 'Active: "index, follow"' : 'Disabled: "noindex, nofollow"'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.seoRobotsIndex ?? true}
                        onChange={(e) => handleChange('seoRobotsIndex', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#2B231D] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C59B27]" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section-Specific SEO Overrides */}
              <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#2E2620] pb-3">
                  <h4 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C59B27]" />
                    <span>Section-Specific SEO Overrides</span>
                  </h4>
                  <span className="text-[11px] text-[#8C7E72]">Per-page customization</span>
                </div>

                {/* Section Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  {[
                    { id: 'home', label: 'Home Page' },
                    { id: 'shop', label: 'Curated Catalog' },
                    { id: 'about', label: 'About Story' },
                    { id: 'contact', label: 'Concierge' },
                    { id: 'lookbook', label: 'Lookbooks' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((sec, sIdx) => (
                    <button
                      key={`seo-sec-${sec.id}-${sIdx}`}
                      type="button"
                      onClick={() => setSelectedSeoSection(sec.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-cinzel whitespace-nowrap transition-all cursor-pointer ${
                        selectedSeoSection === sec.id
                          ? 'bg-[#C59B27] text-[#14100D] font-bold shadow-xs'
                          : 'bg-[#14100D] text-[#A69788] hover:text-white hover:bg-[#251E18]'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>

                {/* Section Fields based on selected tab */}
                <div className="space-y-4 pt-2">
                  {selectedSeoSection === 'home' && (
                    <>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Home Page Title Tag
                        </label>
                        <input
                          type="text"
                          value={formData.seoHomeTitle || ''}
                          onChange={(e) => handleChange('seoHomeTitle', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Home Page Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.seoHomeDescription || ''}
                          onChange={(e) => handleChange('seoHomeDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Home OpenGraph Share Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.seoHomeOgImage || ''}
                          onChange={(e) => handleChange('seoHomeOgImage', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                        />
                      </div>
                    </>
                  )}

                  {selectedSeoSection === 'shop' && (
                    <>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Catalog / Shop Page Title
                        </label>
                        <input
                          type="text"
                          value={formData.seoShopTitle || ''}
                          onChange={(e) => handleChange('seoShopTitle', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Catalog Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.seoShopDescription || ''}
                          onChange={(e) => handleChange('seoShopDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Shop OpenGraph Share Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.seoShopOgImage || ''}
                          onChange={(e) => handleChange('seoShopOgImage', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                        />
                      </div>
                    </>
                  )}

                  {selectedSeoSection === 'about' && (
                    <>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          About Page Title
                        </label>
                        <input
                          type="text"
                          value={formData.seoAboutTitle || ''}
                          onChange={(e) => handleChange('seoAboutTitle', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          About Page Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.seoAboutDescription || ''}
                          onChange={(e) => handleChange('seoAboutDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          About OpenGraph Share Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.seoAboutOgImage || ''}
                          onChange={(e) => handleChange('seoAboutOgImage', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                        />
                      </div>
                    </>
                  )}

                  {selectedSeoSection === 'contact' && (
                    <>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Concierge / Contact Page Title
                        </label>
                        <input
                          type="text"
                          value={formData.seoContactTitle || ''}
                          onChange={(e) => handleChange('seoContactTitle', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Contact Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.seoContactDescription || ''}
                          onChange={(e) => handleChange('seoContactDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Contact OpenGraph Share Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.seoContactOgImage || ''}
                          onChange={(e) => handleChange('seoContactOgImage', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                        />
                      </div>
                    </>
                  )}

                  {selectedSeoSection === 'lookbook' && (
                    <>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Seasonal Lookbook Title
                        </label>
                        <input
                          type="text"
                          value={formData.seoLookbookTitle || ''}
                          onChange={(e) => handleChange('seoLookbookTitle', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Lookbook Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.seoLookbookDescription || ''}
                          onChange={(e) => handleChange('seoLookbookDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Lookbook OpenGraph Share Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.seoLookbookOgImage || ''}
                          onChange={(e) => handleChange('seoLookbookOgImage', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                        />
                      </div>
                    </>
                  )}

                  {selectedSeoSection === 'reviews' && (
                    <>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Testimonials / Reviews Title
                        </label>
                        <input
                          type="text"
                          value={formData.seoReviewsTitle || ''}
                          onChange={(e) => handleChange('seoReviewsTitle', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Reviews Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.seoReviewsDescription || ''}
                          onChange={(e) => handleChange('seoReviewsDescription', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-cinzel font-semibold text-[#E8D59E] block mb-1.5">
                          Reviews OpenGraph Share Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.seoReviewsOgImage || ''}
                          onChange={(e) => handleChange('seoReviewsOgImage', e.target.value)}
                          className="w-full px-4 py-2 bg-[#14100D] border border-[#382E24] rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-hidden font-mono"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Previews (Google SERP & OpenGraph Cards) (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Google Search Live SERP Simulator Card */}
              <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2E2620] pb-3">
                  <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Google Search Snippet Preview</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Live Simulator
                  </span>
                </div>

                {/* Google Search Result Box */}
                <div className="bg-white rounded-2xl p-4.5 shadow-sm space-y-1.5 font-sans">
                  <div className="flex items-center gap-2 text-xs text-[#202124]">
                    <div className="w-5 h-5 rounded-full bg-[#14100D] flex items-center justify-center text-[10px] text-[#C59B27] font-bold">
                      N
                    </div>
                    <div>
                      <p className="text-[11px] text-[#202124] font-medium leading-none">
                        {formData.brandName || 'AL NOUREEN'}
                      </p>
                      <p className="text-[10px] text-[#5f6368] font-mono">
                        {formData.seoCanonicalBaseUrl || 'https://al-noureen.com'} › {selectedSeoSection}
                      </p>
                    </div>
                  </div>

                  <h5 className="text-[#1a0dab] hover:underline text-sm sm:text-base font-medium line-clamp-1 cursor-pointer">
                    {selectedSeoSection === 'home'
                      ? formData.seoHomeTitle || formData.seoDefaultTitle
                      : selectedSeoSection === 'shop'
                      ? formData.seoShopTitle || formData.seoDefaultTitle
                      : selectedSeoSection === 'about'
                      ? formData.seoAboutTitle || formData.seoDefaultTitle
                      : selectedSeoSection === 'contact'
                      ? formData.seoContactTitle || formData.seoDefaultTitle
                      : selectedSeoSection === 'lookbook'
                      ? formData.seoLookbookTitle || formData.seoDefaultTitle
                      : formData.seoReviewsTitle || formData.seoDefaultTitle}
                  </h5>

                  <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                    {selectedSeoSection === 'home'
                      ? formData.seoHomeDescription || formData.seoDefaultDescription
                      : selectedSeoSection === 'shop'
                      ? formData.seoShopDescription || formData.seoDefaultDescription
                      : selectedSeoSection === 'about'
                      ? formData.seoAboutDescription || formData.seoDefaultDescription
                      : selectedSeoSection === 'contact'
                      ? formData.seoContactDescription || formData.seoDefaultDescription
                      : selectedSeoSection === 'lookbook'
                      ? formData.seoLookbookDescription || formData.seoDefaultDescription
                      : formData.seoReviewsDescription || formData.seoDefaultDescription}
                  </p>
                </div>
              </div>

              {/* OpenGraph Social Card Live Simulator */}
              <div className="bg-[#1C1713] border border-[#2E2620] rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2E2620] pb-3">
                  <h4 className="font-cinzel text-xs font-bold text-[#E8D59E] flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>WhatsApp / Social Card Preview</span>
                  </h4>
                  <span className="text-[10px] font-mono text-[#8C7E72]">og:image card</span>
                </div>

                {/* Social Card Box */}
                <div className="bg-[#14100D] border border-[#382E24] rounded-2xl overflow-hidden shadow-md">
                  <div className="h-36 w-full bg-[#251E18] relative overflow-hidden flex items-center justify-center">
                    {formData.seoOgImageUrl ? (
                      <img
                        src={formData.seoOgImageUrl}
                        alt="OpenGraph Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-4 text-[#8C7E72]">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-[#C59B27]/40" />
                        <span className="text-xs">No OpenGraph image specified</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-[9px] font-mono text-white backdrop-blur-xs">
                      1200 × 630 OG Standard
                    </span>
                  </div>

                  <div className="p-3.5 space-y-1 bg-[#1A1511]">
                    <span className="text-[10px] uppercase font-mono text-[#8C7E72]">
                      {formData.seoCanonicalBaseUrl?.replace(/^https?:\/\//, '') || 'al-noureen.com'}
                    </span>
                    <h5 className="font-semibold text-xs text-white line-clamp-1">
                      {formData.seoDefaultTitle}
                    </h5>
                    <p className="text-[11px] text-[#A69788] line-clamp-2 leading-relaxed">
                      {formData.seoDefaultDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Global Reset Defaults Footer */}
      <div className="pt-6 border-t border-[#2E2620] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-cinzel text-xs font-bold text-white flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Reset Website Content Defaults</span>
          </h4>
          <p className="text-[11px] text-[#8C7A6B]">
            Revert all custom texts, brand name, and settings back to original factory defaults.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetAllTexts}
          className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Texts to Default</span>
        </button>
      </div>
    </div>
  );
};
