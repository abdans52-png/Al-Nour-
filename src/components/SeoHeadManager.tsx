import React, { useEffect } from 'react';
import { useSiteContent } from '../context/SiteContentContext';

interface SeoHeadManagerProps {
  currentScreen: 'home' | 'shop' | 'about' | 'contact' | 'reviews' | 'cart' | 'checkout' | 'order-success' | 'admin' | 'tracking' | 'lookbook';
}

export const SeoHeadManager: React.FC<SeoHeadManagerProps> = ({ currentScreen }) => {
  const { siteContent } = useSiteContent();

  useEffect(() => {
    let title = siteContent.seoDefaultTitle || `${siteContent.brandName} ${siteContent.brandSubtitle} | Modest Couture`;
    let description = siteContent.seoDefaultDescription || 'Luxury modest fashion, artisanal abayas, and Pakistani heritage wear.';
    let ogImage = siteContent.seoOgImageUrl || siteContent.logoUrl || '';
    const canonical = siteContent.seoCanonicalBaseUrl || 'https://al-noureen.com';

    switch (currentScreen) {
      case 'home':
        title = siteContent.seoHomeTitle || title;
        description = siteContent.seoHomeDescription || description;
        ogImage = siteContent.seoHomeOgImage || ogImage;
        break;
      case 'shop':
        title = siteContent.seoShopTitle || `Curated Catalog | ${siteContent.brandName}`;
        description = siteContent.seoShopDescription || description;
        ogImage = siteContent.seoShopOgImage || ogImage;
        break;
      case 'about':
        title = siteContent.seoAboutTitle || `Our Story & Heritage | ${siteContent.brandName}`;
        description = siteContent.seoAboutDescription || description;
        ogImage = siteContent.seoAboutOgImage || ogImage;
        break;
      case 'contact':
        title = siteContent.seoContactTitle || `Atelier Concierge | ${siteContent.brandName}`;
        description = siteContent.seoContactDescription || description;
        ogImage = siteContent.seoContactOgImage || ogImage;
        break;
      case 'reviews':
        title = siteContent.seoReviewsTitle || `Client Testimonials | ${siteContent.brandName}`;
        description = siteContent.seoReviewsDescription || description;
        ogImage = siteContent.seoReviewsOgImage || ogImage;
        break;
      case 'lookbook':
        title = siteContent.seoLookbookTitle || `Haute Lookbooks | ${siteContent.brandName}`;
        description = siteContent.seoLookbookDescription || description;
        ogImage = siteContent.seoLookbookOgImage || ogImage;
        break;
      case 'admin':
        title = `Admin Management Suite | ${siteContent.brandName}`;
        break;
      case 'cart':
      case 'checkout':
        title = `VIP Secure Checkout | ${siteContent.brandName}`;
        break;
      case 'order-success':
        title = `Order Confirmation & Certified Invoice | ${siteContent.brandName}`;
        break;
      default:
        break;
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', siteContent.seoKeywords || 'modest fashion, luxury abayas');
    setMetaTag('name', 'robots', siteContent.seoRobotsIndex ? 'index, follow' : 'noindex, nofollow');
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }
    setMetaTag('property', 'og:url', `${canonical}/${currentScreen === 'home' ? '' : currentScreen}`);
    setMetaTag('property', 'og:site_name', `${siteContent.brandName} ${siteContent.brandSubtitle}`);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    if (siteContent.seoTwitterHandle) {
      setMetaTag('name', 'twitter:site', siteContent.seoTwitterHandle);
    }
    if (ogImage) {
      setMetaTag('name', 'twitter:image', ogImage);
    }
  }, [currentScreen, siteContent]);

  return null;
};
