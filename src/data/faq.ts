export interface FaqItem {
  id: string;
  category: 'Sizing & Modesty' | 'Abaya Lengths' | 'Fabrics & Care' | 'Shipping & Delivery' | 'Custom Orders & Bridal';
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Sizing & Modesty',
    question: 'How do AL-NOUREEN modest garments fit compared to standard western sizing?',
    answer:
      'All AL-NOUREEN garments are cut with intentional modest ease. This means silhouettes are non-clinging, necklines are high and dignified, sleeves provide full wrist coverage, and garments feature opaque linings. We recommend selecting your true standard size for our intended modest drape, or sizing down only if you prefer a closer tailored fit.'
  },
  {
    id: 'faq-2',
    category: 'Abaya Lengths',
    question: 'How do I choose the correct Abaya length for my height?',
    answer:
      'We offer specialized Abaya lengths from 52 inches to 60 inches measured from the highest point of the shoulder down to the floor:\n• 52" : Recommended for heights 5\'0" – 5\'2" (152–157 cm)\n• 54" : Recommended for heights 5\'3" – 5\'4" (160–163 cm)\n• 56" : Recommended for heights 5\'5" – 5\'6" (165–168 cm)\n• 58" : Recommended for heights 5\'7" – 5\'8" (170–173 cm)\n• 60" : Recommended for heights 5\'9" and above (175+ cm)\nIf you plan to wear heels of 3+ inches with your abaya, we recommend sizing up one length tier.'
  },
  {
    id: 'faq-3',
    category: 'Fabrics & Care',
    question: 'What fabrics do you use for your Abayas and Hijabs?',
    answer:
      'We source exclusively premium, sustainable, and skin-friendly textiles: Grade 6A Pure Mulberry Silk (19mm) for our luxury veils, authentic Korean Nida for our classic abayas (known for its opaque weight and cool touch), 100% Austrian Lenzing Modal for breathable daily wear, and pure Raw Chanderi Silk & Georgette for our Pakistani formal ensembles.'
  },
  {
    id: 'faq-4',
    category: 'Shipping & Delivery',
    question: 'Do you ship internationally and how long does delivery take?',
    answer:
      'Yes, AL-NOUREEN ships to over 90 countries worldwide via DHL Express and FedEx Priority. Ready-to-wear items dispatch within 24–48 hours from our ateliers. Express shipping arrives in 3–5 business days to the UAE, UK, US, Canada, Europe, and Asia. Complimentary worldwide shipping is provided on all orders over $150.'
  },
  {
    id: 'faq-5',
    category: 'Custom Orders & Bridal',
    question: 'Can I request bespoke custom sizing or bridal Pakistani trousseau orders?',
    answer:
      'Absolutely. Our Mumbai master atelier welcomes custom bridal and bespoke modest commissions. You can contact our Atelier Concierge via WhatsApp (+91 93262 94187) or through our Contact page with your custom measurements, color preferences, and wedding date.'
  },
  {
    id: 'faq-6',
    category: 'Fabrics & Care',
    question: 'Will your magnetic hijab pins damage delicate silk or chiffon scarves?',
    answer:
      'No. Our magnetic pins use a needle-free, snag-free design. The ultra-strong N52 neodymium magnets hold layers securely together without piercing or snagging even the most delicate 19mm silk or chiffon fabrics.'
  }
];
