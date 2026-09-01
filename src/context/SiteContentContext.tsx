import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, uploadBrandLogo, cleanFirestoreData } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface SiteContentSettings {
  // Brand Logo & Core Visual Identity
  logoUrl?: string; // Custom uploaded image (Data URL / HTTPS image)
  logoHeight?: number; // Custom display height in px (e.g. 40-120px)
  brandName: string; // "AL NOUREEN"
  brandSubtitle: string; // "by Nasreen"
  brandArabic: string; // "النورين"
  brandTagline: string; // "Two Lights. One Beautiful Vision."
  brandSubheading: string; // "Haute Couture • Indian & Modest Luxury"
  
  // Announcement Bar
  announcementText: string;
  announcementCode: string;
  announcementDiscountText: string;
  announcementEnabled: boolean;
  announcementLink: string;

  // Hero Section (Home)
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroDescription: string;
  heroArabicTag: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;

  // Value Propositions (Home)
  valueProp1Title: string;
  valueProp1Desc: string;
  valueProp2Title: string;
  valueProp2Desc: string;
  valueProp3Title: string;
  valueProp3Desc: string;
  valueProp4Title: string;
  valueProp4Desc: string;

  // Home Featured Story & Quotes
  homeStoryTitle: string;
  homeStorySubtitle: string;
  homeStoryQuote: string;
  homeStoryAuthor: string;

  // About Screen Narrative
  aboutHeroBadge: string;
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutHeroArabic: string;
  aboutEthosTitle: string;
  aboutEthosDesc: string;
  aboutPillar1Title: string;
  aboutPillar1Desc: string;
  aboutPillar2Title: string;
  aboutPillar2Desc: string;
  aboutPillar3Title: string;
  aboutPillar3Desc: string;
  aboutArtisanTitle: string;
  aboutArtisanDesc: string;
  aboutNasreenQuote: string;
  aboutNasreenTitle: string;

  // Contact & Concierge Information
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactHours: string;
  whatsappNumber: string;
  instagramHandle: string;
  contactHeroTitle: string;
  contactHeroSubtitle: string;

  // Policies & Customer Care
  shippingPolicyTitle: string;
  shippingPolicySummary: string;
  returnsPolicyTitle: string;
  returnsPolicySummary: string;

  // Invoicing & Tax Information
  invoiceGstNumber: string;
  invoiceAtelierLocation: string;
  invoiceTermsNote: string;
  invoiceCareInstructions: string;
  merchantUpiId: string;

  // Footer Settings
  footerAbout: string;
  footerTagline: string;
  footerCopyright: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
  footerInstagramUrl: string;
  footerFacebookUrl: string;
  footerYoutubeUrl: string;
  footerPinterestUrl: string;
  footerTiktokUrl: string;
  footerWhatsappNumber: string;
  footerNewsletterHeading: string;
  footerNewsletterSubtitle: string;
  footerShowPaymentBadges: boolean;
  footerPaymentBadgesText: string;

  // Payment Gateway & API Key Configuration
  paymentGatewayApiKey: string;
  paymentGatewayEnabled: boolean;
  paymentGatewayMerchantId: string;

  // SEO, Metadata & OpenGraph Social Sharing
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoKeywords: string;
  seoOgImageUrl: string;
  seoCanonicalBaseUrl: string;
  seoTwitterHandle: string;
  seoRobotsIndex: boolean;

  // Section-Specific SEO Overrides
  seoHomeTitle: string;
  seoHomeDescription: string;
  seoHomeOgImage: string;
  seoShopTitle: string;
  seoShopDescription: string;
  seoShopOgImage: string;
  seoAboutTitle: string;
  seoAboutDescription: string;
  seoAboutOgImage: string;
  seoContactTitle: string;
  seoContactDescription: string;
  seoContactOgImage: string;
  seoLookbookTitle: string;
  seoLookbookDescription: string;
  seoLookbookOgImage: string;
  seoReviewsTitle: string;
  seoReviewsDescription: string;
  seoReviewsOgImage: string;

  // Dynamic Key-Value Dictionary for Editing Any Text String
  customTexts: Record<string, string>;
}

export const DEFAULT_SITE_CONTENT: SiteContentSettings = {
  // Brand Logo & Core Visual Identity
  logoUrl: '',
  logoHeight: 48,
  brandName: 'AL NOUREEN',
  brandSubtitle: 'by Nasreen',
  brandArabic: 'النورين',
  brandTagline: 'Two Lights. One Beautiful Vision.',
  brandSubheading: 'Indian & Modest Luxury',

  // Announcement Bar
  announcementText: 'Complimentary Insured Express Delivery Across India & Worldwide on Orders Above ₹5,000 / $150',
  announcementCode: 'NOUREEN10',
  announcementDiscountText: '10% OFF INAUGURAL ORDER',
  announcementEnabled: true,
  announcementLink: 'shop',

  // Hero Section
  heroBadge: 'Maison Heritage 2026 Collection',
  heroHeadline: 'Two Lights. One Beautiful Vision.',
  heroSubtitle: 'Luxury Modest Wear, Handcrafted Pakistani Ensembles & Artisanal Abayas.',
  heroDescription: 'النورين — Illuminating the path where South Asian royal heritage, Mughal zardozi mastery, and modern modesty meet.',
  heroArabicTag: 'النورين • فن الزردوزي والتطريز اليدوي',
  heroCtaPrimary: 'Explore Pakistani Heritage',
  heroCtaSecondary: 'View Royal Lookbook',

  // Value Propositions
  valueProp1Title: 'Bespoke Sizing & Atelier Tailoring',
  valueProp1Desc: 'Custom necklines, sleeve linings, and floor-length bespoke modifications by master karigars.',
  valueProp2Title: 'Pure Mulberry Silk & Korean Nida',
  valueProp2Desc: 'Imported high-grade non-transparent, breathable textiles crafted for dignified modesty.',
  valueProp3Title: 'Insured Global Express Courier',
  valueProp3Desc: 'Priority air dispatch to 85+ countries with DHL & FedEx real-time consignment tracking.',
  valueProp4Title: 'Artisanal Zardozi & Resham Craft',
  valueProp4Desc: 'Handcrafted zardozi, dabka, tilla, and gotta patti embroidery honoring royal traditions.',

  // Home Story
  homeStoryTitle: 'The Heritage & Craftsmanship',
  homeStorySubtitle: 'Hand-Guided Zardozi, Fine Silk Weaves & Royal Dignity',
  homeStoryQuote: 'We do not simply craft garments; we preserve ancestral art forms and elevate modest silhouettes into wearable poetry.',
  homeStoryAuthor: 'Nasreen — Founder & Creative Director',

  // About Screen Narrative
  aboutHeroBadge: 'The Story of AL-NOUREEN',
  aboutHeroTitle: 'Two Lights. One Beautiful Vision.',
  aboutHeroSubtitle: 'Illuminating the path where modesty meets refined elegance.',
  aboutHeroArabic: 'النورين — النور والوقار في حلة ملكية',
  aboutEthosTitle: 'The Meaning of Al-Noureen (النورين)',
  aboutEthosDesc: 'In the Arabic tongue, Al-Noureen (النورين) translates to "The Two Lights". For us, these two twin beams of radiant illumination represent the eternal dialogue between heritage craftsmanship and modern dignified elegance.',
  aboutPillar1Title: 'Tradition & Modernity',
  aboutPillar1Desc: 'Honoring centuries-old Mughal zardozi, hand-shadow chikankari, and regal craftsmanship, distilled into sleek modern silhouettes for today’s global lifestyle.',
  aboutPillar2Title: 'Modesty & Elegance',
  aboutPillar2Desc: 'Believing that true beauty never requires compromising one’s modesty. Dignified floor-length drapes, non-sheer textiles, and generous cuts.',
  aboutPillar3Title: 'Heritage & Contemporary Fashion',
  aboutPillar3Desc: 'Harmonizing authentic South Asian handwork with Parisian minimalist tailoring, breathable European linens, and Grade 6A pure mulberry silks.',
  aboutArtisanTitle: 'The Artisan Atelier of Mumbai, Maharashtra, India',
  aboutArtisanDesc: 'Every AL-NOUREEN garment begins in our dedicated master atelier located in Mumbai, India. We work hand-in-hand with multi-generational karigars whose lineages have perfected the art of real gold-plated zardozi needlework.',
  aboutNasreenQuote: 'Every stitch in our atelier is a tribute to womanhood, spirituality, and grace. We design for the woman who carries both royal heritage and contemporary dignity with pride.',
  aboutNasreenTitle: 'Nasreen, Founder & Creative Director',

  // Contact & Concierge Information
  contactEmail: 'concierge@al-noureen.com',
  contactPhone: '+91 93262 94187',
  contactAddress: 'Atelier AL-NOUREEN, 42 Altamount Road, Bandra West, Mumbai, Maharashtra 400050, India',
  contactHours: 'Mon – Sat: 10:00 AM – 8:00 PM IST',
  whatsappNumber: '+91 93262 94187',
  instagramHandle: '@alnoureen.couture',
  contactHeroTitle: 'Connect With AL-NOUREEN',
  contactHeroSubtitle: 'Whether inquiring about bespoke bridal Pakistani outfits, choosing your abaya length, or tracking an existing package, our atelier in Mumbai is at your service.',

  // Policies
  shippingPolicyTitle: 'Complimentary Insured Worldwide Shipping',
  shippingPolicySummary: 'We ship across India within 3–5 business days and internationally across 85+ countries within 5–7 business days via DHL Express.',
  returnsPolicyTitle: '14-Day Atelier Privilege Return & Exchange',
  returnsPolicySummary: 'We accept returns on unworn standard collection items with security tags intact within 14 days of receipt.',

  // Invoicing & Tax
  invoiceGstNumber: '27AAECN9482M1Z5',
  invoiceAtelierLocation: 'MUMBAI, MAHARASHTRA, INDIA',
  invoiceTermsNote: 'This is a certified digital tax invoice issued by AL NOUREEN by Nasreen. All applicable taxes & duties included.',
  invoiceCareInstructions: 'Dry clean only. Store in provided breathable muslin garment bag.',
  merchantUpiId: '9326294187@okbizaxis',

  // Footer Settings
  footerAbout: 'Maison AL-NOUREEN is a premier luxury modest fashion house blending South Asian royal craftsmanship, Mughal zardozi, and contemporary graceful silhouettes.',
  footerTagline: 'Two Lights. One Beautiful Vision. Handcrafted with reverence in Mumbai.',
  footerCopyright: '© 2026 AL NOUREEN Atelier. All rights reserved. Handcrafted with reverence in Mumbai, India.',
  footerAddress: 'Atelier AL-NOUREEN, 42 Altamount Road, Bandra West, Mumbai, Maharashtra 400050, India',
  footerPhone: '+91 93262 94187',
  footerEmail: 'concierge@al-noureen.com',
  footerInstagramUrl: 'https://instagram.com/alnoureen.couture',
  footerFacebookUrl: 'https://facebook.com/alnoureen.couture',
  footerYoutubeUrl: 'https://youtube.com/@alnoureencouture',
  footerPinterestUrl: 'https://pinterest.com/alnoureencouture',
  footerTiktokUrl: 'https://tiktok.com/@alnoureen.couture',
  footerWhatsappNumber: '+91 93262 94187',
  footerNewsletterHeading: 'Join the Maison Private Circle',
  footerNewsletterSubtitle: 'Receive privileged previews of seasonal capsules, private trunk show invitations, and royal bridal lookbooks.',
  footerShowPaymentBadges: true,
  footerPaymentBadgesText: '256-BIT SSL ENCRYPTED • SECURE ATELIER CHECKOUT • INSURED COURIER',

  // Payment Gateway Configuration
  paymentGatewayApiKey: '',
  paymentGatewayEnabled: true,
  paymentGatewayMerchantId: 'merchant.com.alnoureen.nasreen',

  // SEO, Metadata & OpenGraph Social Sharing
  seoDefaultTitle: 'AL NOUREEN by Nasreen | Modest Couture & Pakistani Ensembles',
  seoDefaultDescription: 'Discover handcrafted Pakistani ethnic luxury, pure mulberry silk abayas, and royal zardozi ensembles by AL-NOUREEN. Handcrafted in Mumbai with worldwide express shipping.',
  seoKeywords: 'modest fashion, luxury abaya, pakistani dresses, zardozi embroidery, bespoke modest couture, pure silk abayas, AL NOUREEN, Nasreen, modest luxury Mumbai',
  seoOgImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  seoCanonicalBaseUrl: 'https://al-noureen.com',
  seoTwitterHandle: '@alnoureen_couture',
  seoRobotsIndex: true,

  // Section-Specific SEO Overrides
  seoHomeTitle: 'AL NOUREEN by Nasreen | Two Lights. One Beautiful Vision.',
  seoHomeDescription: 'Illuminating South Asian royal heritage, Mughal zardozi needlework, and modern modest elegance. Explore our signature 2026 Maison collection.',
  seoHomeOgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  
  seoShopTitle: 'Curated Ready-to-Wear & Couture Catalog | AL NOUREEN',
  seoShopDescription: 'Browse royal Pakistani peshwas, pure silk kaftans, artisanal abayas, and premium magnetic hijab sets. Bespoke tailoring available on all items.',
  seoShopOgImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',

  seoAboutTitle: 'The Story of Al-Noureen (النورين) | Maison Heritage & Karigars',
  seoAboutDescription: 'Learn how founder Nasreen preserves ancestral Mughal embroidery and pairs dignified modest silhouettes with contemporary luxury fabrics.',
  seoAboutOgImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80',

  seoContactTitle: 'Atelier Concierge & Bespoke Bridal Consultations | AL NOUREEN',
  seoContactDescription: 'Book a bespoke styling appointment at our Mumbai atelier or reach our dedicated VIP WhatsApp concierge for international bridal orders.',
  seoContactOgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',

  seoLookbookTitle: 'Seasonal Haute Lookbooks & Styling Narratives | AL NOUREEN',
  seoLookbookDescription: 'Explore editorial high-fashion modest lookbooks direct from our Mumbai master atelier. Cohesive seasonal capsules tailored for grand occasions.',
  seoLookbookOgImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',

  seoReviewsTitle: 'Client Testimonials & Verified Patron Reviews | AL NOUREEN',
  seoReviewsDescription: 'Read verified experiences from royal wedding brides and international clients who cherish AL-NOUREEN artisanal craftsmanship across 85+ countries.',
  seoReviewsOgImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',

  // Custom key-value text dictionary
  customTexts: {}
};

interface SiteContentContextType {
  siteContent: SiteContentSettings;
  updateSiteContent: (updates: Partial<SiteContentSettings>) => Promise<boolean>;
  uploadLogo: (logoDataUrl: string) => Promise<boolean>;
  uploadLogoFile: (file: File | Blob) => Promise<string | null>;
  updateCustomText: (key: string, value: string) => Promise<boolean>;
  deleteCustomText: (key: string) => Promise<boolean>;
  resetToDefaultLogo: () => Promise<boolean>;
  resetAllTextsToDefault: () => Promise<boolean>;
  t: (key: string, fallback: string) => string;
  isSaving: boolean;
  lastSavedAt: string | null;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'alnoureen_site_content_settings';

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<SiteContentSettings>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(cached) };
      }
    } catch (e) {
      console.warn('Failed to load cached site content:', e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // 1. Listen in real-time to Firestore `settings/site_content`
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const docRef = doc(db, 'settings', 'site_content');
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as Partial<SiteContentSettings>;
            setSiteContent((prev) => {
              const merged = { ...prev, ...data };
              try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        },
        (error) => {
          console.warn('Firestore snapshot error on settings/site_content:', error?.message);
        }
      );
    } catch (err) {
      console.warn('Could not attach Firestore onSnapshot for site_content:', err);
    }

    // Also try to load from backend API /api/site-content
    fetch('/api/site-content')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.success && json.data) {
          setSiteContent((prev) => {
            const merged = { ...prev, ...json.data };
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => {
      unsubscribe();
    };
  }, []);

  // Update site content helper
  const updateSiteContent = useCallback(async (updates: Partial<SiteContentSettings>): Promise<boolean> => {
    setIsSaving(true);
    try {
      const nextState: SiteContentSettings = {
        ...siteContent,
        ...updates
      };

      // Optimistic local update
      setSiteContent(nextState);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextState));
      } catch {}

      // 1. Sync to Firestore
      try {
        const docRef = doc(db, 'settings', 'site_content');
        await setDoc(docRef, cleanFirestoreData(updates), { merge: true });
      } catch (fireErr) {
        console.warn('Firestore sync notice:', fireErr);
      }

      // 2. Sync to Express Backend API
      try {
        await fetch('/api/site-content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (apiErr) {
        console.warn('Backend API sync notice:', apiErr);
      }

      setLastSavedAt(new Date().toLocaleTimeString());
      return true;
    } catch (err) {
      console.error('Failed to update site content:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [siteContent]);

  // Upload Logo
  const uploadLogo = useCallback(async (logoDataUrl: string): Promise<boolean> => {
    return await updateSiteContent({ logoUrl: logoDataUrl });
  }, [updateSiteContent]);

  // Upload Logo from File (Firebase Storage + base64 fallback)
  const uploadLogoFile = useCallback(async (file: File | Blob): Promise<string | null> => {
    setIsSaving(true);
    try {
      const url = await uploadBrandLogo(file);
      if (url) {
        await updateSiteContent({ logoUrl: url });
        return url;
      }
      return null;
    } catch (err) {
      console.error('Failed to upload logo file:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [updateSiteContent]);

  // Update a single custom text key in dictionary
  const updateCustomText = useCallback(async (key: string, value: string): Promise<boolean> => {
    const updatedCustomTexts = {
      ...(siteContent.customTexts || {}),
      [key]: value
    };
    return await updateSiteContent({ customTexts: updatedCustomTexts });
  }, [siteContent.customTexts, updateSiteContent]);

  // Delete a custom text key from dictionary
  const deleteCustomText = useCallback(async (key: string): Promise<boolean> => {
    const updatedCustomTexts = { ...(siteContent.customTexts || {}) };
    delete updatedCustomTexts[key];
    return await updateSiteContent({ customTexts: updatedCustomTexts });
  }, [siteContent.customTexts, updateSiteContent]);

  // Reset to default logo
  const resetToDefaultLogo = useCallback(async (): Promise<boolean> => {
    return await updateSiteContent({ logoUrl: '' });
  }, [updateSiteContent]);

  // Reset all texts to factory defaults
  const resetAllTextsToDefault = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      setSiteContent(DEFAULT_SITE_CONTENT);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_CONTENT));
      try {
        await setDoc(doc(db, 'settings', 'site_content'), cleanFirestoreData(DEFAULT_SITE_CONTENT));
      } catch {}
      try {
        await fetch('/api/site-content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_SITE_CONTENT)
        });
      } catch {}
      return true;
    } catch (e) {
      console.error('Reset all texts error:', e);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Custom text lookup with fallback
  const t = useCallback((key: string, fallback: string): string => {
    if (siteContent.customTexts && siteContent.customTexts[key] !== undefined && siteContent.customTexts[key] !== '') {
      return siteContent.customTexts[key];
    }
    // Also check direct property if key is a known field
    if ((siteContent as any)[key] !== undefined && typeof (siteContent as any)[key] === 'string' && (siteContent as any)[key] !== '') {
      return (siteContent as any)[key];
    }
    return fallback;
  }, [siteContent]);

  return (
    <SiteContentContext.Provider
      value={{
        siteContent,
        updateSiteContent,
        uploadLogo,
        uploadLogoFile,
        updateCustomText,
        deleteCustomText,
        resetToDefaultLogo,
        resetAllTextsToDefault,
        t,
        isSaving,
        lastSavedAt
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      siteContent: DEFAULT_SITE_CONTENT,
      updateSiteContent: async () => false,
      uploadLogo: async () => false,
      uploadLogoFile: async () => null,
      updateCustomText: async () => false,
      deleteCustomText: async () => false,
      resetToDefaultLogo: async () => false,
      resetAllTextsToDefault: async () => false,
      t: (k: string, fallback: string) => fallback,
      isSaving: false,
      lastSavedAt: null
    };
  }
  return context;
};
