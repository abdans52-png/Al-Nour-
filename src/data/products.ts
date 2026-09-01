import { Product, Collection } from '../types';

export const PRODUCTS: Product[] = [
  // --- PAKISTANI DRESSES & SUITS ---
  {
    id: 'emerald-zardozi-anarkali-suit',
    name: 'Emerald Zardozi Anarkali Suit',
    arabicName: 'طقم أناركالي الزمردي المطرز بالزردوزي',
    subtitle: 'Pure Silk Chanderi with Handcrafted Zari',
    fabric: 'Pure Silk Chanderi & Organza',
    price: 1,
    originalPrice: 1,
    category: 'Pakistani',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-in-a-traditional-dress-41619-large.mp4',
    description:
      'A masterwork of Pakistani heritage haute couture. This regal floor-length Anarkali features hand-applied zardozi, dabka, and tilla embroidery along the neckline, sleeves, and flared kalis. Paired with a pure silk trouser and a translucent organza dupatta bordered with antique marori work.',
    details: {
      fabricCraft: [
        '100% Pure Silk Chanderi outer tunic with breathable cotton-silk lining',
        'Over 140 hours of hand-guided zardozi, antique tilla, and pearl moti work',
        '24-kali flared silhouette offering opulent modest drape',
        'Accompanied by silk cigarette trousers and hand-scalloped organza dupatta (2.75m)'
      ],
      shippingReturns:
        'Complimentary express courier shipping. Hand-tailored in our atelier and dispatched within 24-48 hours. 14-day hassle-free returns & size exchange.',
      careInstructions: 'Dry clean only by luxury garment specialists. Wrap in unbleached cotton muslin for storage.',
      modestFitNotes: 'Relaxed modest cut with high rounded neckline, full-length lined sleeves, and non-sheer inner lining.'
    },
    colors: ['Emerald Green', 'Royal Crimson', 'Midnight Navy'],
    colorHexes: ['#0A4D3C', '#7A1C29', '#1A2B4C'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    newArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewCount: 38,
    badge: 'Atelier Masterpiece',
    estimatedDispatch: 'Dispatches in 24-48 hours',
    styleWithIds: ['sage-chiffon-luxury-hijab', 'ivory-pearl-tassel-potli', 'calligraphy-gold-cuff'],
    completeTheLookIds: ['sage-chiffon-luxury-hijab', 'ivory-pearl-tassel-potli', 'calligraphy-gold-cuff']
  },
  {
    id: 'ivory-chikankari-peshwas',
    name: 'Ivory Chikankari Peshwas Ensemble',
    arabicName: 'ثوب بيشواس شيكانكاري العاجي',
    subtitle: 'Hand-Shadow Work & Pearl Borders',
    fabric: 'Pure Georgette & Organza',
    price: 1,
    originalPrice: 1,
    category: 'Pakistani',
    images: [
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'Inspired by Mughal architectural geometry, this ethereal ivory Peshwas features intricate Lucknowi Chikankari shadow embroidery hand-rendered on fluid georgette. Embellished with delicate seed pearls and a lightweight crinkle dupatta.',
    details: {
      fabricCraft: [
        'Pure viscose georgette with artisan shadow work chikankari',
        'Hand-set micro seed pearls along collar and cuffs',
        'Includes silk modal inner slip and wide-leg palazzo',
        'Matching crinkle organza dupatta with pearl tassels'
      ],
      shippingReturns: 'Complimentary worldwide shipping. Standard delivery 4-6 business days.',
      careInstructions: 'Dry clean only. Gentle steam iron on reverse.',
      modestFitNotes: 'Full-coverage modest fit with 56-inch garment length and double layer georgette.'
    },
    colors: ['Warm Ivory', 'Blush Champagne', 'Soft Mint'],
    colorHexes: ['#F7F3E8', '#F2E3D5', '#E2ECE4'],
    sizes: ['S', 'M', 'L', 'XL', 'Free Size'],
    featured: true,
    newArrival: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 9,
    rating: 4.8,
    reviewCount: 29,
    badge: 'Best Seller',
    estimatedDispatch: 'Dispatches in 24 hours',
    styleWithIds: ['champagne-pure-silk-hijab', 'velvet-embroidered-evening-clutch', 'brushed-gold-calligraphy-earrings'],
    completeTheLookIds: ['champagne-pure-silk-hijab', 'velvet-embroidered-evening-clutch', 'brushed-gold-calligraphy-earrings']
  },
  {
    id: 'crimson-silk-raw-lehenga-suit',
    name: 'Crimson Silk Hand-Embroidered Kurta Set',
    arabicName: 'طقم كورتا حرير قرمزي مع تطريز يدوي',
    subtitle: 'Heritage Aari & Gota Patti',
    fabric: 'Raw Silk & Chiffon',
    price: 1,
    originalPrice: 1,
    category: 'Pakistani',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'A statement bridal and festive Pakistani kurta set in saturated deep crimson raw silk. Features intricate aari thread work, beaten gold gota patti accents, and structured flared culottes.',
    details: {
      fabricCraft: [
        '100% Pure Raw Silk with subtle natural slub texture',
        'Hand-applied gota patti and antique tilla borders',
        'Comfort-tailored silk culottes with side pockets',
        'Pure chiffon dupatta featuring foil printed geometric borders'
      ],
      shippingReturns: 'Complimentary expedited shipping. Made-to-order sizing available on request.',
      careInstructions: 'Dry clean only.',
      modestFitNotes: 'Flattering modest longline cut with side slits terminating below hip level.'
    },
    colors: ['Deep Crimson', 'Plum Wine', 'Heritage Ochre'],
    colorHexes: ['#881B28', '#4A1525', '#C28422'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
    newArrival: true,
    inStock: false,
    stockCount: 0,
    rating: 5.0,
    reviewCount: 16,
    badge: 'Sold Out • VIP Waitlist',
    styleWithIds: ['rosewood-modal-hijab', 'handwoven-metallic-minaudiere', 'filigree-pearl-bangle'],
    completeTheLookIds: ['rosewood-modal-hijab', 'handwoven-metallic-minaudiere', 'filigree-pearl-bangle']
  },

  // --- ABAYA COLLECTION ---
  {
    id: 'noir-pleated-open-abaya',
    name: 'Noir Pleated Haute Open Abaya',
    arabicName: 'عباية نوار المفتوحة ذات الكسرات الراقية',
    subtitle: 'Premium Korean Nida & French Pleating',
    fabric: 'Royal Korean Nida Silk Blend',
    price: 1,
    originalPrice: 1,
    category: 'Abayas',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-a-black-dress-41620-large.mp4',
    description:
      'The quintessential luxury abaya. Crafted from heavy-weight, breathable Korean Nida silk with delicate micro-pleating along the back yoke and sleeve cuffs. Designed with concealed snap buttons to wear effortlessly open or closed.',
    details: {
      fabricCraft: [
        '100% High-Grade Korean Nida fabric with rich matte drape',
        'Includes matching detachable fabric tie-belt and chiffon shayla hijab',
        'Concealed magnetic snap button closures down the front',
        'Deep side inseam pockets for everyday practicality'
      ],
      shippingReturns: 'Dispatched within 24 hours. Express courier shipping available.',
      careInstructions: 'Machine wash delicate cycle in laundry bag or hand wash cool. Hang dry.',
      modestFitNotes: 'Generous modest silhouette. Available in standard dress sizes and customized height lengths (52" to 60").'
    },
    colors: ['Midnight Black', 'Espresso Brown', 'Charcoal Slate'],
    colorHexes: ['#121212', '#2B1E16', '#33373B'],
    sizes: ['S', 'M', 'L', 'XL'],
    availableLengths: ['52"', '54"', '56"', '58"', '60"'],
    featured: true,
    newArrival: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 14,
    rating: 4.9,
    reviewCount: 64,
    badge: 'Signature Abaya',
    estimatedDispatch: 'Dispatches in 24 hours',
    styleWithIds: ['champagne-pure-silk-hijab', 'structured-crescent-leather-bag', 'matte-gold-magnetic-pins-pack'],
    completeTheLookIds: ['champagne-pure-silk-hijab', 'structured-crescent-leather-bag', 'matte-gold-magnetic-pins-pack']
  },
  {
    id: 'sand-dune-linen-kimono-abaya',
    name: 'Sand Dune Organic Linen Kimono Abaya',
    arabicName: 'عباية كيمونو كتان كثبان الرمال',
    subtitle: 'Breathable European Linen & Wide Cuffs',
    fabric: '100% Pure European Linen',
    price: 1,
    originalPrice: 1,
    category: 'Abayas',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'Effortless daytime modest luxury. Cut from washed, breathable European linen in a warm sand dune tone. Features relaxed batwing kimono sleeves and delicate frayed edge detailing.',
    details: {
      fabricCraft: [
        '100% Oeko-Tex Certified Washed Linen with natural cooling properties',
        'Wide kimono sleeves designed for seamless modest layering',
        'Includes tonal linen wrap belt and complementary modal hijab',
        'Double-stitched reinforced seams for durability'
      ],
      shippingReturns: 'Complimentary express shipping. 14-day hassle-free returns.',
      careInstructions: 'Machine wash cold. Line dry in shade. Warm iron or leave natural linen texture.',
      modestFitNotes: 'Oversized modest cut designed to gracefully skim the body without clinging.'
    },
    colors: ['Sand Dune', 'Olive Sage', 'Warm Terracotta'],
    colorHexes: ['#D6C3A5', '#7A8471', '#BD6B53'],
    sizes: ['S', 'M', 'L', 'XL'],
    availableLengths: ['52"', '54"', '56"', '58"', '60"'],
    featured: true,
    newArrival: true,
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewCount: 42,
    badge: 'New Arrival',
    styleWithIds: ['taupe-ribbed-jersey-hijab', 'handwoven-metallic-minaudiere', 'filigree-pearl-bangle'],
    completeTheLookIds: ['taupe-ribbed-jersey-hijab', 'handwoven-metallic-minaudiere', 'filigree-pearl-bangle']
  },
  {
    id: 'embellished-organza-evening-abaya',
    name: 'Layla Embellished Organza Evening Abaya',
    arabicName: 'عباية ليلى المسائية من الأورجانزا المطرزة',
    subtitle: 'Crystal Beaded Sleeves & Satin Slip',
    fabric: 'Embroidered Sheer Organza & Silk Satin',
    price: 1,
    originalPrice: 1,
    category: 'Abayas',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'Designed for weddings, galas, and festive celebrations. A two-piece set including a diaphanous black organza outer coat intricately embroidered with floral vines and hand-set glass crystals, worn over an opaque charcoal silk-satin inner slip dress.',
    details: {
      fabricCraft: [
        'Includes 2 pieces: Luxury Organza Outer Abaya + Full Length Opaque Satin Slip Dress',
        'Hand-applied Austrian crystal beads and metallic thread embroidery on cuff hems',
        'Inner slip dress features adjustable inner waist ties',
        'Accompanied by a matching crystal-bordered organza hijab'
      ],
      shippingReturns: 'Complimentary courier shipping. Dispatched in 2 business days.',
      careInstructions: 'Strictly dry clean only due to delicate beadwork.',
      modestFitNotes: '100% non-see-through when worn with the provided silk-satin inner slip.'
    },
    colors: ['Onyx & Champagne', 'Deep Amethyst', 'Midnight Navy'],
    colorHexes: ['#1A1715', '#3E233E', '#141E30'],
    sizes: ['S', 'M', 'L', 'XL'],
    availableLengths: ['52"', '54"', '56"', '58"', '60"'],
    featured: false,
    newArrival: true,
    inStock: true,
    stockCount: 5,
    rating: 5.0,
    reviewCount: 22,
    badge: 'Occasion Wear',
    styleWithIds: ['champagne-pure-silk-hijab', 'velvet-embroidered-evening-clutch', 'calligraphy-gold-cuff'],
    completeTheLookIds: ['champagne-pure-silk-hijab', 'velvet-embroidered-evening-clutch', 'calligraphy-gold-cuff']
  },

  // --- HIJAB COLLECTION ---
  {
    id: 'champagne-pure-silk-hijab',
    name: 'Champagne Pure Mulberry Silk Hijab',
    arabicName: 'حجاب حرير التوت النقي بلون الشامبانيا',
    subtitle: '100% 19mm Mulberry Silk with Hand-Rolled Hem',
    fabric: 'Pure 19mm Mulberry Silk',
    price: 1,
    originalPrice: 1,
    category: 'Hijabs',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'The crown jewel of our modest veil collection. Crafted from the finest 19-momme pure mulberry silk with a lustrous satin face and non-slip crepe underside. Finished with traditional artisan hand-rolled hems.',
    details: {
      fabricCraft: [
        '100% Grade 6A Pure Mulberry Silk (19mm)',
        'Artisan hand-rolled and hand-stitched borders',
        'Dimensions: 190 cm x 75 cm (75" x 30") for generous styling and chest coverage',
        'Naturally hypoallergenic, moisture-locking, and hair-protecting'
      ],
      shippingReturns: 'Dispatches in 24 hours in our signature gold-embossed magnetic gift box.',
      careInstructions: 'Hand wash cold using silk-safe detergent or dry clean. Low iron on silk setting.'
    },
    colors: ['Warm Champagne', 'Golden Ivory', 'Rose Quartz', 'Desert Taupe'],
    colorHexes: ['#E6D7B9', '#F4E8D1', '#E7C8C5', '#9E8E7C'],
    sizes: ['Free Size'],
    featured: true,
    newArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 28,
    rating: 5.0,
    reviewCount: 92,
    badge: 'Pure Silk',
    estimatedDispatch: 'Dispatches in 24 hours',
    styleWithIds: ['noir-pleated-open-abaya', 'matte-gold-magnetic-pins-pack'],
    completeTheLookIds: ['noir-pleated-open-abaya', 'matte-gold-magnetic-pins-pack']
  },
  {
    id: 'sage-chiffon-luxury-hijab',
    name: 'Sage Premium Georgette Chiffon Hijab',
    arabicName: 'حجاب شيفون جورجيت الفاخر بلون الميرمية',
    subtitle: 'Non-Slip Lightweight Texture with Clean Stitched Edges',
    fabric: 'High-Density Georgette Chiffon',
    price: 1,
    originalPrice: 1,
    category: 'Hijabs',
    images: [
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'Our best-selling everyday and event chiffon hijab. Offers a subtle textured matte grain that stays securely in place without constant readjustment. Rich, breathable, and opaque when layered.',
    details: {
      fabricCraft: [
        'High-density breathable georgette chiffon weave',
        'Precision micro-hemmed laser finished edges',
        'Dimensions: 200 cm x 75 cm (79" x 30")',
        'Wrinkle resistant and easy to drape'
      ],
      shippingReturns: 'Same-day dispatch for orders placed before 2 PM.',
      careInstructions: 'Machine wash cold in wash bag or hand wash. Hang to dry quickly.'
    },
    colors: ['Sage Mist', 'Dusty Rose', 'Warm Mocha', 'Classic Ivory', 'Midnight Noir'],
    colorHexes: ['#9FB1A1', '#CFA7A2', '#866B57', '#FAF7F2', '#1A1816'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 45,
    rating: 4.9,
    reviewCount: 114,
    badge: 'Everyday Essential',
    styleWithIds: ['emerald-zardozi-anarkali-suit', 'matte-gold-magnetic-pins-pack'],
    completeTheLookIds: ['emerald-zardozi-anarkali-suit', 'matte-gold-magnetic-pins-pack']
  },
  {
    id: 'rosewood-modal-hijab',
    name: 'Rosewood Cloud-Soft Modal Hijab',
    arabicName: 'حجاب مودال ناعم كالسحاب بلون خشب الورد',
    subtitle: 'Ultra-Breathable Bamboo Modal with Ethereal Drape',
    fabric: '100% Austrian Lenzing Modal',
    price: 1,
    originalPrice: 1,
    category: 'Hijabs',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'Made from sustainable Austrian beechwood fibers, this cloud-soft modal hijab offers unmatched softness, thermal regulation, and effortless all-day comfort without pins required.',
    details: {
      fabricCraft: [
        '100% Eco-Friendly Lenzing Modal fabric',
        'Featherlight 85 GSM with full opacity when folded',
        'Dimensions: 195 cm x 80 cm (77" x 31.5")',
        'Zero-iron needed with natural relaxed fall'
      ],
      shippingReturns: 'Dispatches worldwide in 24 hours.',
      careInstructions: 'Hand wash cool. Lay flat to dry.'
    },
    colors: ['Rosewood', 'Caramel Beige', 'Stone Grey', 'Olive Leaf'],
    colorHexes: ['#A06864', '#C49F7D', '#8C8D8E', '#646D52'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: true,
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviewCount: 37,
    badge: 'Eco Luxury',
    styleWithIds: ['rose-dust-raw-silk-coord', 'matte-gold-magnetic-pins-pack'],
    completeTheLookIds: ['rose-dust-raw-silk-coord', 'matte-gold-magnetic-pins-pack']
  },
  {
    id: 'taupe-ribbed-jersey-hijab',
    name: 'Taupe Ribbed Premium Jersey Hijab',
    arabicName: 'حجاب جيرسي مضلع فاخر بلون رمادي داكن',
    subtitle: '4-Way Stretch Cotton-Modal with Stay-Put Texture',
    fabric: 'Ribbed Cotton-Modal Jersey',
    price: 1,
    originalPrice: 1,
    category: 'Hijabs',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'
    ],
    description:
      'The modern minimalist staple. Features a subtle vertical ribbing texture that provides natural grip against hair, eliminating the need for underscarves or pins while sculpting a clean drape.',
    details: {
      fabricCraft: [
        '95% Modal Cotton, 5% Elastane for 4-way flexibility',
        'Pin-free effortless wrap styling',
        'Dimensions: 185 cm x 70 cm (73" x 28")',
        'Retains shape and elasticity after frequent laundering'
      ],
      shippingReturns: 'Dispatches in 24 hours.',
      careInstructions: 'Machine wash warm. Tumble dry low or line dry.'
    },
    colors: ['Desert Taupe', 'Charcoal', 'Mochaccino', 'Buttercream'],
    colorHexes: ['#9D8D7E', '#2B2B2C', '#6E5142', '#FAF0D7'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: false,
    inStock: true,
    stockCount: 35,
    rating: 4.9,
    reviewCount: 52,
    badge: 'Pin-Free Style',
    styleWithIds: ['sand-dune-linen-kimono-abaya'],
    completeTheLookIds: ['sand-dune-linen-kimono-abaya']
  },

  // --- MODEST WEAR (CO-ORD SETS, DRESSES, TUNICS) ---
  {
    id: 'rose-dust-raw-silk-coord',
    name: 'Rose Dust Tailored Raw Silk Co-ord Set',
    arabicName: 'طقم متناسق من الحرير الخام باللون الوردي المغبر',
    subtitle: 'Relaxed Tunic & Wide Trouser with Contrast Piping',
    fabric: '100% Pure Raw Chanderi Silk',
    price: 1,
    originalPrice: 1,
    category: 'Co-ord Sets',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'A harmonious marriage of modest proportions and structured minimalism. This two-piece set includes a notched-lapel tunic with side vents and tailored wide-leg trousers adorned with subtle gold thread piping.',
    details: {
      fabricCraft: [
        '100% Pure Raw Chanderi Silk with natural slub weave',
        'Subtle gold thread piping on lapel collar and cuffs',
        'Elasticated back waistband with clean flat front panel',
        'Deep functional side pockets on trousers'
      ],
      shippingReturns: 'Complimentary shipping worldwide. 14 days returns.',
      careInstructions: 'Dry clean recommended. Warm iron on reverse with pressing cloth.',
      modestFitNotes: 'High-waisted trousers with 42" outer seam; tunic length 38" covering the hips completely.'
    },
    colors: ['Rose Dust', 'Desert Gold', 'Sage Green'],
    colorHexes: ['#C59B8E', '#D1B46A', '#8F9B88'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
    newArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 31,
    badge: 'Trending Co-ord',
    estimatedDispatch: 'Dispatches in 24-48 hours',
    styleWithIds: ['rosewood-modal-hijab', 'velvet-embroidered-evening-clutch', 'brushed-gold-calligraphy-earrings'],
    completeTheLookIds: ['rosewood-modal-hijab', 'velvet-embroidered-evening-clutch', 'brushed-gold-calligraphy-earrings']
  },
  {
    id: 'flared-tier-modest-maxi-dress',
    name: 'Amira Flared Tiered Modest Maxi Dress',
    arabicName: 'فستان أميرة ماكسي المتدرج الفضفاض',
    subtitle: 'Flowing Crinkle Georgette with Balloon Sleeves',
    fabric: 'High-Twist Crinkle Georgette',
    price: 1,
    originalPrice: 1,
    category: 'Modest Wear',
    images: [
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'Romantic, flowing, and completely modest. This tiered maxi dress features poetic bishop sleeves with smocked cuffs, a modest high Victorian collar with covered buttons, and a removable sash belt to tailor your silhouette.',
    details: {
      fabricCraft: [
        'High-twist crinkle georgette with 100% full-length viscose lining',
        'Victorian covered button closure at neck and cuffs',
        'Gathered triple tiered skirt spanning 3.5 meters of hem flare',
        'Includes matching detachable tie sash'
      ],
      shippingReturns: 'Complimentary shipping. Standard delivery 3-5 business days.',
      careInstructions: 'Machine wash cold on gentle cycle or dry clean. Hang dry.',
      modestFitNotes: '100% opaque double lining. Garment length 57 inches.'
    },
    colors: ['Oatmeal Cream', 'Dusty Lavender', 'Forest Pine'],
    colorHexes: ['#EDE6D6', '#AFA2B5', '#243B2A'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    newArrival: true,
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewCount: 26,
    badge: 'Modest Dress',
    styleWithIds: ['sage-chiffon-luxury-hijab', 'structured-crescent-leather-bag'],
    completeTheLookIds: ['sage-chiffon-luxury-hijab', 'structured-crescent-leather-bag']
  },
  {
    id: 'charcoal-tailored-high-slit-tunic',
    name: 'Charcoal Tailored Asymmetric Modest Tunic',
    arabicName: 'تونيك شاركول المفصل غير المتماثل',
    subtitle: 'Fine Suiting Wool Blend with Mandarin Collar',
    fabric: 'Fine Tropical Wool Blend',
    price: 1,
    originalPrice: 1,
    category: 'Tunics',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85'
    ],
    description:
      'A sharp, contemporary layering tunic for the modern professional. Crafted from breathable lightweight tropical wool blend with clean geometric lines, structured shoulders, and an asymmetrical button placard.',
    details: {
      fabricCraft: [
        'Tropical wool blend with wrinkle-resistant structure',
        'Architectural mandarin collar and matte horn buttons',
        'Deep side vents starting below the hip for comfortable stride',
        'Wear layered over palazzo trousers or our tailored slips'
      ],
      shippingReturns: 'Dispatched within 24 hours.',
      careInstructions: 'Dry clean only. Steam iron.'
    },
    colors: ['Charcoal Slate', 'Camel Tan', 'Pure Noir'],
    colorHexes: ['#3A3E45', '#9B744A', '#111111'],
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    newArrival: false,
    inStock: true,
    stockCount: 7,
    rating: 4.7,
    reviewCount: 18,
    badge: 'Workwear Luxury',
    styleWithIds: ['taupe-ribbed-jersey-hijab', 'structured-crescent-leather-bag'],
    completeTheLookIds: ['taupe-ribbed-jersey-hijab', 'structured-crescent-leather-bag']
  },

  // --- ACCESSORIES (JEWELRY, HIJAB PINS, BROOCHES) ---
  {
    id: 'matte-gold-magnetic-pins-pack',
    name: 'Matte Gold Ultra-Strong Magnetic Hijab Pins (Set of 4)',
    arabicName: 'دبابيس حجاب مغناطيسية قوية للغاية بلون الذهب غير اللامع',
    subtitle: 'Snag-Free Heavy Duty Neodymium Magnets',
    fabric: 'Brushed 18k Gold Plated Brass & Neodymium',
    price: 1,
    originalPrice: 1,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'The essential modest accessory. Engineered with ultra-strong neodymium rare-earth magnets that secure through multi-layered silk, modal, and heavy jerseys without snagging, piercing, or damaging delicate fabrics. Comes in a pack of 4 luxury finishes.',
    details: {
      fabricCraft: [
        'Pack of 4 includes: Brushed Gold, Polished Champagne, Rose Gold, and Matte Noir',
        'Grade N52 Neodymium rare-earth magnetic core holding up to 3kg shear force',
        'Zero-needle snag-free design preserves silk and chiffon weave integrity',
        'Comes in a velvet-lined magnetic travel pouch'
      ],
      shippingReturns: 'Dispatches in 24 hours.',
      careInstructions: 'Wipe clean with a microfiber cloth. Store separated in provided pouch.'
    },
    colors: ['Gold Multi-Pack', 'Silver Multi-Pack'],
    colorHexes: ['#C59B27', '#CCCCCC'],
    sizes: ['Free Size'],
    featured: true,
    newArrival: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 65,
    rating: 5.0,
    reviewCount: 148,
    badge: 'Fabric Safe Magnet',
    estimatedDispatch: 'Dispatches in 24 hours',
    styleWithIds: ['champagne-pure-silk-hijab', 'noir-pleated-open-abaya'],
    completeTheLookIds: ['champagne-pure-silk-hijab', 'noir-pleated-open-abaya']
  },
  {
    id: 'brushed-gold-calligraphy-earrings',
    name: 'Al-Noor Calligraphy Drop Earrings',
    arabicName: 'أقراط قطرة بتصميم الخط العربي النور',
    subtitle: '18k Gold Plated with Natural Baroque Pearl',
    fabric: '18k Brushed Gold on Sterling Silver & Pearl',
    price: 1,
    originalPrice: 1,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'Fine jewelry embodying the two lights of AL-NOUREEN. Hand-sculpted in sterling silver with 18k brushed gold plating, spelling out the subtle Arabic calligraphy for "Noor" (Light) cascading into an organic freshwater baroque pearl.',
    details: {
      fabricCraft: [
        '18k Heavy Gold Vermeil over 925 Sterling Silver',
        'Genuine AAA freshwater baroque pearl drop (each pearl uniquely formed)',
        'Hypoallergenic titanium posts safe for sensitive skin',
        'Packaged in an embossed velvet jewelry keepsake drawer box'
      ],
      shippingReturns: 'Complimentary insured shipping.',
      careInstructions: 'Avoid contact with perfumes, hairsprays, and water. Polish gently with included cloth.'
    },
    colors: ['Brushed Gold', 'Silver Rhodium'],
    colorHexes: ['#D4AF37', '#E5E4E2'],
    sizes: ['Free Size'],
    featured: true,
    newArrival: true,
    inStock: true,
    stockCount: 18,
    rating: 4.9,
    reviewCount: 41,
    badge: 'Handcrafted Jewelry',
    styleWithIds: ['emerald-zardozi-anarkali-suit', 'ivory-chikankari-peshwas'],
    completeTheLookIds: ['emerald-zardozi-anarkali-suit', 'ivory-chikankari-peshwas']
  },
  {
    id: 'calligraphy-gold-cuff',
    name: 'Al-Noureen Filigree Statement Cuff',
    arabicName: 'سوار كفة النورين المخرم الفاخر',
    subtitle: 'Laser Cut Arabic Floral Motifs with Cabochon Stone',
    fabric: '18k Gold Plated Brass & Green Onyx',
    price: 1,
    originalPrice: 1,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
    ],
    description:
      'An opulent open bracelet featuring laser-cut Islamic geometric tracery and crowned with a faceted natural emerald-green onyx cabochon. Adjustable to fit any wrist comfortably over abaya sleeves.',
    details: {
      fabricCraft: [
        '2.5 micron 18k gold plating with anti-tarnish protective ceramic coating',
        'Natural faceted green onyx gemstone set in claw bezel',
        'Slightly malleable open-cuff structure fits wrists from 5.5" to 7.5"',
        'Engraved with AL-NOUREEN maker’s hallmark'
      ],
      shippingReturns: 'Dispatches in 24 hours.',
      careInstructions: 'Wipe with a soft cloth after wearing. Store in dry jewelry box.'
    },
    colors: ['Gold & Emerald Onyx', 'Gold & Ruby Quartz'],
    colorHexes: ['#C59B27', '#8E2838'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: false,
    inStock: true,
    stockCount: 14,
    rating: 4.8,
    reviewCount: 19,
    badge: 'Artisan Cuff',
    styleWithIds: ['emerald-zardozi-anarkali-suit', 'ivory-pearl-tassel-potli'],
    completeTheLookIds: ['emerald-zardozi-anarkali-suit', 'ivory-pearl-tassel-potli']
  },
  {
    id: 'filigree-pearl-bangle',
    name: 'Sultana Freshwater Pearl & Filigree Bangle',
    arabicName: 'سوار لؤلؤ المياه العذبة بتصميم سلطانة',
    subtitle: 'Delicate Stackable Bracelet with Safety Clasp',
    fabric: '18k Gold Plated Brass & Seed Pearls',
    price: 1,
    originalPrice: 1,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
    ],
    description:
      'A refined stackable bangle with woven seed pearls and filigree gold beads. Ideal for pairing with our modest co-ord sets or abayas.',
    details: {
      fabricCraft: [
        'Natural freshwater seed pearls hand-threaded on reinforced wire',
        '18k yellow gold vermeil clasp',
        'Length: 7 inches with 1 inch extender chain'
      ],
      shippingReturns: 'Dispatches in 24 hours.',
      careInstructions: 'Keep away from moisture and direct fragrance.'
    },
    colors: ['Gold & Pearl'],
    colorHexes: ['#D4AF37'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: false,
    inStock: true,
    stockCount: 20,
    rating: 4.7,
    reviewCount: 15,
    styleWithIds: ['rose-dust-raw-silk-coord'],
    completeTheLookIds: ['rose-dust-raw-silk-coord']
  },

  // --- BAGS (POTLIS, EVENING CLUTCHES, TOTES) ---
  {
    id: 'ivory-pearl-tassel-potli',
    name: 'Shehrbano Ivory Pearl & Zardozi Potli Bag',
    arabicName: 'حقيبة بوتلي شهر بانو العاجية باللؤلؤ والزردوزي',
    subtitle: 'Hand-Embroidered Velvet with Heavy Pearl Tassels',
    fabric: 'Micro Velvet, Zari & Cultured Glass Pearls',
    price: 1,
    originalPrice: 1,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'A masterpiece of artisan accessory craftsmanship. Structured in ivory micro-velvet, heavily embroidered with hand-sewn bullion zari work, and embellished with cascading pearl tassels and a braided gold wrist handle.',
    details: {
      fabricCraft: [
        'Handcrafted by master karigars specializing in royal wedding trousseaus',
        'Includes drawstring closure with weighted pearl bell tassels',
        'Detachable 45-inch antique gold chain strap to wear as crossbody or clutch',
        'Spacious enough to comfortably fit phone, compact mirror, cardholder, and lipstick'
      ],
      shippingReturns: 'Dispatches in 24 hours in luxury satin dust bag.',
      careInstructions: 'Spot clean with dry cloth. Store stuffed in dust bag to retain shape.'
    },
    colors: ['Warm Ivory', 'Emerald Green', 'Royal Crimson'],
    colorHexes: ['#F5EFE6', '#0B4734', '#781523'],
    sizes: ['Free Size'],
    featured: true,
    newArrival: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 10,
    rating: 5.0,
    reviewCount: 49,
    badge: 'Artisan Potli',
    estimatedDispatch: 'Dispatches in 24 hours',
    styleWithIds: ['emerald-zardozi-anarkali-suit', 'brushed-gold-calligraphy-earrings'],
    completeTheLookIds: ['emerald-zardozi-anarkali-suit', 'brushed-gold-calligraphy-earrings']
  },
  {
    id: 'velvet-embroidered-evening-clutch',
    name: 'Zahra Velvet Embroidered Box Clutch',
    arabicName: 'حقيبة كلاتش زهرة المخملية المطرزة للمساء',
    subtitle: 'Handmade Metallic Zardozi on Deep Midnight Velvet',
    fabric: 'Italian Silk Velvet & 24k Gold Dip Frame',
    price: 1,
    originalPrice: 1,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'
    ],
    description:
      'A structured hard-case evening clutch wrapped in sumptuous midnight velvet, adorned with raised floral tilla embroidery and clasped with an engraved mother-of-pearl push lock.',
    details: {
      fabricCraft: [
        'Rigid brass frame with scratch-resistant 24k gold dipped finish',
        'Mother-of-pearl carved push-lock closure',
        'Lined in soft champagne satin with interior card slot',
        'Includes concealed drop-in gold snake chain'
      ],
      shippingReturns: 'Dispatches in 24 hours.',
      careInstructions: 'Spot clean only.'
    },
    colors: ['Midnight Black', 'Imperial Burgundy', 'Antique Bronze'],
    colorHexes: ['#121212', '#541221', '#8C6C38'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 34,
    badge: 'Evening Clutch',
    styleWithIds: ['noir-pleated-open-abaya', 'embellished-organza-evening-abaya'],
    completeTheLookIds: ['noir-pleated-open-abaya', 'embellished-organza-evening-abaya']
  },
  {
    id: 'structured-crescent-leather-bag',
    name: 'Noor Crescent Structured Shoulder Bag',
    arabicName: 'حقيبة كتف نور بتصميم الهلال المنحوت',
    subtitle: 'Full Grain Italian Calf Leather with Brushed Gold Clasp',
    fabric: 'Full-Grain Italian Calf Leather',
    price: 1,
    originalPrice: 1,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
    ],
    description:
      'Clean sculptural curves celebrating the crescent motif. Hand-constructed using supple pebble-grain calf leather, finished with edge paint and an understated gold emblem.',
    details: {
      fabricCraft: [
        '100% Full-grain vegetable tanned leather',
        'Magnetic flap closure with custom AL-NOUREEN logo hardware',
        'Adjustable shoulder strap with 3 length settings',
        'Microsuede interior lining with zippered security compartment'
      ],
      shippingReturns: 'Complimentary express shipping.',
      careInstructions: 'Condition periodically with leather balm.'
    },
    colors: ['Espresso Brown', 'Cream Ivory', 'Classic Noir'],
    colorHexes: ['#382417', '#F5EFE6', '#1A1A1A'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: true,
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewCount: 21,
    badge: 'Italian Leather',
    styleWithIds: ['noir-pleated-open-abaya', 'sand-dune-linen-kimono-abaya'],
    completeTheLookIds: ['noir-pleated-open-abaya', 'sand-dune-linen-kimono-abaya']
  },
  {
    id: 'handwoven-metallic-minaudiere',
    name: 'Aurelia Handwoven Metallic Minaudière',
    arabicName: 'حقيبة مينوديير أوريليا المعدنية المنسوجة يدوياً',
    subtitle: 'Woven Brass Wire with Velvet Interior',
    fabric: 'Handwoven Brass & Velvet',
    price: 1,
    originalPrice: 1,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85'
    ],
    description:
      'A sculptural objet d’art. Artisans hand-weave fine metallic brass threads across a structured oval frame to create a luminous, light-catching evening companion.',
    details: {
      fabricCraft: [
        'Handwoven metallic wire mesh over sturdy metal armature',
        'Crystal embellished snap closure',
        'Includes tuck-away shoulder chain'
      ],
      shippingReturns: 'Dispatches in 24 hours.',
      careInstructions: 'Store in protective dust bag.'
    },
    colors: ['Antique Gold', 'Sterling Silver'],
    colorHexes: ['#C59B27', '#E0E0E0'],
    sizes: ['Free Size'],
    featured: false,
    newArrival: false,
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewCount: 17,
    styleWithIds: ['crimson-silk-raw-lehenga-suit'],
    completeTheLookIds: ['crimson-silk-raw-lehenga-suit']
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'pakistani-couture',
    title: 'Pakistani Heritage Couture',
    arabicTitle: 'أزياء التراث الباكستاني الفاخرة',
    subtitle: 'Zardozi, Chikankari & Pure Silk Peshwas',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Timeless craftsmanship passed down through generations of master artisans.',
    productCount: 14,
    categoryFilter: 'Pakistani'
  },
  {
    id: 'haute-abayas',
    title: 'Haute Abaya Collection',
    arabicTitle: 'مجموعة العبايات الراقية',
    subtitle: 'Flowing Nida, Linen & Organza Layering',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Sculptural modesty designed for contemporary grace and seamless movement.',
    productCount: 18,
    categoryFilter: 'Abayas'
  },
  {
    id: 'pure-silk-hijabs',
    title: 'The Veil & Hijab Edit',
    arabicTitle: 'مجموعة الحجاب والأوشحة الحريرية',
    subtitle: '19mm Pure Mulberry Silk, Georgette & Modal',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Breathable, hair-protecting veils and snag-free magnetic jewelry pins.',
    productCount: 22,
    categoryFilter: 'Hijabs'
  },
  {
    id: 'modest-coords-tunics',
    title: 'Modest Co-ords & Tunics',
    arabicTitle: 'أطقم متناسقة وتونيكات محتشمة',
    subtitle: 'Effortless Tailoring in Raw Silk & Linen',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Monochrome tailoring and elevated daywear designed with full coverage.',
    productCount: 12,
    categoryFilter: 'Co-ord Sets'
  },
  {
    id: 'accessories-and-bags',
    title: 'Accessories & Fine Bags',
    arabicTitle: 'الإكسسوارات والحقائب الفاخرة',
    subtitle: 'Handmade Zardozi Potlis, 18k Calligraphy Jewelry & Clutches',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
    tagline: 'The finishing touches to elevate every modest ensemble.',
    productCount: 16,
    categoryFilter: 'Accessories'
  }
];
