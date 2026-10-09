export const initialSiteContent = {
  // 1. التحكم في ظهور وإخفاء صفوف وأقسام الموقع (Rows Visibility)
  sectionsVisibility: {
    announcement: true,       // 1. شريط الإعلانات العلوي
    heroHoodies: true,        // 2. بنر الهوديز الرئيسي
    categoryGrid: true,       // 3. شبكة الفئات الثلاثية (3 كروت)
    hoodiesProducts: true,    // 4. صف منتجات الهوديز
    heroTshirts: true,        // 5. بنر التيشرتات الصيفي
    tshirtsProducts: true,    // 6. صف منتجات التيشرتات
    heroSweatpants: true,     // 7. بنر السويت بانتس الحضري
    sweatpantsProducts: true, // 8. صف منتجات السويت بانتس
    superSale: false,          // 9. صف الخصم الكبير والعداد التنازلي
    newsletter: true,         // 10. صف النادي البريدي
    footer: true              // 11. الفوتر
  },

  announcement: {
    enabled: true,
    text_ar: "✨ شحن مجاني لكافة محافظات مصر للطلبات فوق 1500 ج.م | تشكيلة شتاء 2026 الأصلية",
    text_en: "✨ FREE SHIPPING ACROSS EGYPT ON ORDERS OVER 1500 EGP | ORIGINAL 2026 COLLECTION",
    link: "#shop"
  },
  brand: {
    name: "KESWA",
    tagline_ar: "ملابس • أناقة • أنت",
    tagline_en: "CLOTHES • STYLE • YOU",
    logoStyle: "metallic", // 'metallic' | 'badge'
    logoImage: "/assets/keswa-logo.jpg"
  },
  navigation: [
    { id: "shop", label_ar: "تسوق الكل", label_en: "SHOP ALL", link: "#shop" },
    { id: "hoodies", label_ar: "هوديز", label_en: "HOODIES", link: "#hoodies" },
    { id: "tshirts", label_ar: "تيشرتات", label_en: "T-SHIRTS", link: "#tshirts" },
    { id: "sweatpants", label_ar: "سويت بانتس", label_en: "SWEATPANTS", link: "#sweatpants" },
  ],
  categories: [
    {
      id: "hoodies",
      name_ar: "هوديز",
      name_en: "HOODIES",
      subtitle_ar: "هوديز شتوية ثقيلة من أرقى أنواع القطن المصري للأناقة اليومية",
      subtitle_en: "Signature heavyweight oversized fits crafted for ultimate street comfort",
      bannerImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
      showBanner: true,
      showProducts: true,
      viewAllText_ar: "عرض الكل",
      viewAllText_en: "VIEW ALL",
      badge_ar: "تشكيلة 2026 الجديدة",
      badge_en: "NEW DROP 2026",
      buttonText_ar: "تسوق التشكيلة",
      buttonText_en: "SHOP COLLECTION",
      isCore: true
    },
    {
      id: "tshirts",
      name_ar: "تيشرتات",
      name_en: "T-SHIRTS",
      subtitle_ar: "قطن مصري نقي وقصات أوفرسايز مريحة وطباعات متميزة",
      subtitle_en: "Breathable pure Egyptian cotton and boxy drop-shoulder graphics",
      bannerImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2070&auto=format&fit=crop",
      showBanner: true,
      showProducts: true,
      viewAllText_ar: "عرض الكل",
      viewAllText_en: "VIEW ALL",
      badge_ar: "صيف 2026",
      badge_en: "SUMMER ESSENTIALS",
      buttonText_ar: "اكتشف التيشرتات",
      buttonText_en: "EXPLORE TEES",
      isCore: true
    },
    {
      id: "sweatpants",
      name_ar: "سويت بانتس",
      name_en: "SWEATPANTS",
      subtitle_ar: "بناطيل فليس وجوجرز وكارجو واسعة مصممة للراحة والحركة",
      subtitle_en: "Ultra-comfortable fleece joggers, cargos and wide-leg silhouettes",
      bannerImage: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2070&auto=format&fit=crop",
      showBanner: true,
      showProducts: true,
      viewAllText_ar: "عرض الكل",
      viewAllText_en: "VIEW ALL",
      badge_ar: "راحة الشارع",
      badge_en: "STREET FLEECE",
      buttonText_ar: "تسوق البناطيل",
      buttonText_en: "SHOP PANTS",
      isCore: true
    }
  ],
  banners: {
    heroHoodies: {
      enabled: true,
      title_ar: "هوديز",
      title_en: "HOODIES",
      subtitle_ar: "قطن مصري 450 جرام • قصة أوفرسايز بوكسي عصرية",
      subtitle_en: "HEAVYWEIGHT 450 GSM COTTON • OVERSIZED BOXY FIT",
      badge_ar: "تشكيلة 2026 الجديدة",
      badge_en: "NEW DROP 2026",
      buttonText_ar: "تسوق التشكيلة",
      buttonText_en: "SHOP COLLECTION",
      buttonLink: "#hoodies",
      image: "/assets/hero_knit_banner.jpg"
    },
    categoryGrid: {
      enabled: true,
      card1: {
        title_ar: "هوديز أوفرسايز",
        title_en: "OVERSIZED HOODIES",
        subtitle_ar: "أكتاف ساقطة وقماش ثقيل",
        subtitle_en: "DROP SHOULDER SILHOUETTE",
        buttonText_ar: "تسوق الهوديز",
        buttonText_en: "SHOP HOODIES",
        link: "#hoodies",
        image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop"
      },
      card2: {
        title_ar: "تيشرتات بولو ريترو",
        title_en: "RETRO POLO TEES",
        subtitle_ar: "ياقة تريكو إصدار محدود",
        subtitle_en: "KNIT COLLAR ESSENTIALS",
        buttonText_ar: "تسوق التيشرتات",
        buttonText_en: "SHOP TEES",
        link: "#tshirts",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop"
      },
      card3: {
        title_ar: "سويت بانتس باجي",
        title_en: "BAGGY SWEATPANTS",
        subtitle_ar: "راحة قصوى وفليس ناعم",
        subtitle_en: "MAXIMUM FLEECE COMFORT",
        buttonText_ar: "تسوق البنطلونات",
        buttonText_en: "SHOP SWEATS",
        link: "#sweatpants",
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop"
      }
    },
    heroTshirts: {
      enabled: true,
      title_ar: "تيشرتات",
      title_en: "T-SHIRTS",
      subtitle_ar: "أساسيات الصيف وقصات أوفرسايز فينتاج",
      subtitle_en: "SUMMER ESSENTIALS & OVERSIZED VINTAGE CUTS",
      badge_ar: "الأكثر مبيعاً",
      badge_en: "BEST SELLERS",
      buttonText_ar: "اكتشف الآن",
      buttonText_en: "EXPLORE NOW",
      buttonLink: "#tshirts",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop"
    },
    heroSweatpants: {
      enabled: true,
      title_ar: "سويت بانتس",
      title_en: "SWEATPANTS",
      subtitle_ar: "قصة مريحة ورباط خصر عريض • ستريت وير أصلي",
      subtitle_en: "RELAXED FIT & DRAWSTRING WAIST • STREET READY",
      badge_ar: "راحة طوال اليوم",
      badge_en: "ALL DAY COMFORT",
      buttonText_ar: "تسوق السويت بانتس",
      buttonText_en: "SHOP SWEATS",
      buttonLink: "#sweatpants",
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=2000&auto=format&fit=crop"
    },
    superSale: {
      enabled: true,
      title_ar: "تخفيضات كبرى تصل إلى 40%",
      title_en: "SUPER SALE UP TO 40% OFF",
      subtitle_ar: "أكبر خصم موسمي على ملابس الستريت وير • الكمية محدودة",
      subtitle_en: "BIGGEST SEASONAL PRICE DROP • LIMITED STOCK AVAILABLE",
      badge_ar: "عرض حصري لفترة محدودة",
      badge_en: "FLASH DEAL",
      buttonText_ar: "تسوق العرض الآن",
      buttonText_en: "SHOP SALE",
      buttonLink: "#sale",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
      targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString()
    },
    newsletter: {
      enabled: true,
      title_ar: "النشرة البريدية ونادي كسوة",
      title_en: "NEWSLETTER",
      subtitle_ar: "انضم إلى عائلة KESWA وكن أول من يعلم بأحدث الإصدارات الحصرية",
      subtitle_en: "JOIN THE KESWA SQUAD & GET FIRST ACCESS TO EXCLUSIVE DROPS",
      placeholder_ar: "أدخل بريدك الإلكتروني هنا...",
      placeholder_en: "Enter your email address...",
      buttonText_ar: "اشترك الآن",
      buttonText_en: "SUBSCRIBE",
      badgeText_ar: "نادي الستريت وير",
      badgeText_en: "STREET CLUB"
    }
  },
  sectionHeaders: {
    hoodies: {
      title_ar: "هوديز (HOODIES)",
      title_en: "HOODIES",
      subtitle_ar: "هوديز شتوية ثقيلة من أرقى أنواع القطن المصري للأناقة اليومية",
      subtitle_en: "Signature heavyweight oversized fits crafted for ultimate street comfort",
      viewAllText_ar: "عرض الكل",
      viewAllText_en: "VIEW ALL"
    },
    tshirts: {
      title_ar: "تيشرتات (T-SHIRTS)",
      title_en: "T-SHIRTS",
      subtitle_ar: "قطن مصري نقي وقصات أوفرسايز مريحة وطباعات متميزة",
      subtitle_en: "Breathable pure Egyptian cotton and boxy drop-shoulder graphics",
      viewAllText_ar: "عرض الكل",
      viewAllText_en: "VIEW ALL"
    },
    sweatpants: {
      title_ar: "سويت بانتس وكارجو (SWEATPANTS)",
      title_en: "SWEATPANTS",
      subtitle_ar: "بناطيل فليس وجوجرز وكارجو واسعة مصممة للراحة والحركة",
      subtitle_en: "Ultra-comfortable fleece joggers, cargos and wide-leg silhouettes",
      viewAllText_ar: "عرض الكل",
      viewAllText_en: "VIEW ALL"
    }
  },
  footer: {
    about_ar: "براند KESWA WEAR هو علامة تجارية مصرية رائدة للملابس الستريت وير الفاخرة. نبتكر تصاميم عصرية واسعة مصنوعة من أجود أنواع القطن المصري لتلائم ثقافة الشباب المعاصر.",
    about_en: "KESWA WEAR is a premier Egyptian streetwear label born from the underground youth culture. We craft premium oversized garments made from heavy-gauge fabrics engineered for daily expression.",
    tagline_ar: "ملابس • أناقة • أنت",
    tagline_en: "CLOTHES • STYLE • YOU",
    phone: "+20 102 345 6789",
    whatsapp: "+20 102 345 6789",
    email: "contact@keswawear.com",
    address_ar: "الإسكندرية والقاهرة، مصر",
    address_en: "Alexandria & Cairo, Egypt",
    social: {
      instagram: "https://instagram.com/keswawear",
      tiktok: "https://tiktok.com/@keswawear",
      facebook: "https://facebook.com/keswawear"
    },
    copyright_ar: "© 2026 KESWA WEAR. جميع الحقوق محفوظة.",
    copyright_en: "© 2026 KESWA WEAR. ALL RIGHTS RESERVED."
  },
  general: {
    currency_ar: "ج.م",
    currency_en: "EGP",
    shippingCost: 50,
    freeShippingThreshold: 1500
  },
  whatsapp: {
    enabled: true,
    phone: "01023456789",
    message_ar: "مرحباً KESWA WEAR، أود الاستفسار عن تفاصيل الطلب والمنتجات",
    message_en: "Hello KESWA WEAR, I would like to inquire about products and orders",
    showFloatingButton: true
  },
  sizeGuide: {
    enabled: true,
    title_ar: "دليل المقاسات الستريت وير",
    title_en: "Streetwear Size Guide",
    subtitle_ar: "جميع مقاساتنا مصممة بقصة واسعة ومريحة (Oversized Fit). إذا كنت تفضل المقاس المظبوط (Regular Fit) ننصح باختيار مقاس أصغر بدرجة واحدة.",
    subtitle_en: "All garments are cut in our signature relaxed oversized fit. If you prefer a regular fit, consider sizing down.",
    tops: [
      { size: 'S', chest: '58 سم', length: '70 سم', shoulder: '52 سم' },
      { size: 'M', chest: '61 سم', length: '72 سم', shoulder: '54 سم' },
      { size: 'L', chest: '64 سم', length: '74 سم', shoulder: '56 سم' },
      { size: 'XL', chest: '67 سم', length: '76 سم', shoulder: '58 سم' },
      { size: 'XXL', chest: '70 سم', length: '78 سم', shoulder: '60 سم' },
      { size: '3XL', chest: '73 سم', length: '80 سم', shoulder: '62 سم' }
    ],
    pants: [
      { size: '30', waist: '76-80 سم', length: '102 سم', thigh: '62 سم' },
      { size: '32', waist: '81-85 سم', length: '104 سم', thigh: '64 سم' },
      { size: '34', waist: '86-90 سم', length: '106 سم', thigh: '66 سم' },
      { size: '36', waist: '91-95 سم', length: '108 سم', thigh: '68 سم' },
      { size: '38', waist: '96-100 سم', length: '110 سم', thigh: '70 سم' },
      { size: '40', waist: '101-105 سم', length: '112 سم', thigh: '72 سم' },
      { size: '42', waist: '106-110 سم', length: '114 سم', thigh: '74 سم' },
      { size: '44', waist: '111-115 سم', length: '116 سم', thigh: '76 سم' },
      { size: '46', waist: '116-120 سم', length: '118 سم', thigh: '78 سم' }
    ]
  }
};

export const initialProducts = [
  // HOODIES (6 products)
  {
    id: "h-01",
    name_ar: "هودي أسود مغسول بوكسي ثقيل 450 جرام",
    name_en: "Washed Black Boxy Heavyweight Hoodie",
    category: "hoodies",
    price: 950,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: true,
    description_ar: "هودي قطن فرينش تيري مصري 450 جرام بقصة أكتاف ساقطة بوكسي وغطاء رأس مزدوج بدون أربطة مع تطريز ناعم.",
    description_en: "450 GSM french terry cotton hoodie featuring a boxy drop-shoulder cut, double-layered hood without drawstrings, and subtle tonal chest embroidery.",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name_ar: "أسود مغسول", name_en: "Washed Black", hex: "#1c1c1f" },
      { name_ar: "نبيتي", name_en: "Burgundy", hex: "#5b1d28" },
      { name_ar: "موكا", name_en: "Mocha", hex: "#543e34" }
    ]
  },
  {
    id: "h-02",
    name_ar: "هودي نبيتي فليس أوفرسايز فخم",
    name_en: "Burgundy Heavy Fleece Oversized Hoodie",
    category: "hoodies",
    price: 920,
    badge_ar: "الأكثر مبيعاً",
    badge_en: "BEST SELLER",
    inStock: true,
    featured: true,
    description_ar: "هودي فليس نبيتي داكن مع جيب كنغر أمامي وأساور مضلعة متينة، معالج ضد الانكماش.",
    description_en: "Deep wine burgundy fleece hoodie designed with ribbed cuffs and kangaroo pouch. Pre-shrunk Egyptian combed cotton.",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name_ar: "نبيتي", name_en: "Burgundy", hex: "#5b1d28" },
      { name_ar: "أسود داكن", name_en: "Onyx Black", hex: "#111111" }
    ]
  },
  {
    id: "h-03",
    name_ar: "هودي مارون سوستة ستريت وير كاملة",
    name_en: "Maroon Zip-Up Streetwear Hoodie",
    category: "hoodies",
    price: 980,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: true,
    description_ar: "هودي بسحاب معدني YKK باتجاهين مع لوجو كسوة مصغر وخياطة مزدوجة معززة.",
    description_en: "Heavy metal YKK two-way zipper hoodie with clean minimal chest logo and reinforced stitching throughout.",
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_ar: "مارون", name_en: "Maroon", hex: "#631c2c" },
      { name_ar: "كحلي", name_en: "Navy", hex: "#1a243b" },
      { name_ar: "شاركوول", name_en: "Charcoal", hex: "#2b2b30" }
    ]
  },
  {
    id: "h-04",
    name_ar: "هودي أسود تكتيكال بجيب على الذراع",
    name_en: "Stealth Utility Arm Patch Hoodie",
    category: "hoodies",
    price: 1050,
    badge_ar: "إصدار حصري",
    badge_en: "LIMITED",
    inStock: true,
    featured: false,
    description_ar: "تصميم ستريت وير تكتيكي هجين مع جيب سوستة على الذراع وشارة كسوة مطاطية حصرية.",
    description_en: "Tactical streetwear hybrid hoodie with zippered arm pocket and rubberized KESWA emblem.",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name_ar: "أسود تكتيكال", name_en: "Tactical Black", hex: "#151515" }
    ]
  },
  {
    id: "h-05",
    name_ar: "هودي بيج شوفان مطرز بتاج كسوة",
    name_en: "Oatmeal Heather Embroidered Hoodie",
    category: "hoodies",
    price: 890,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: true,
    description_ar: "لون بيج شوفان طبيعي هادئ مع تطريز كثيف عالي الجودة لتاج KESWA في المنتصف.",
    description_en: "Warm neutral heather oatmeal palette with high-density KESWA crown embroidery across the chest.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name_ar: "شوفان بيج", name_en: "Oatmeal", hex: "#dcd6cd" },
      { name_ar: "أوف وايت", name_en: "Bone White", hex: "#f1eee9" }
    ]
  },
  {
    id: "h-06",
    name_ar: "هودي رمادي شاركوول أسيد مغسول فينتاج",
    name_en: "Charcoal Washed Minimal Pullover",
    category: "hoodies",
    price: 940,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: false,
    description_ar: "غسيل حجري مميز يمنح الهودي طابع الجرونج العتيق المحبب لعشاق الستريت وير.",
    description_en: "Sun-faded stone wash finish providing that sought-after vintage grunge streetwear vibe.",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_ar: "شاركوول مغسول", name_en: "Acid Charcoal", hex: "#2f3136" }
    ]
  },

  // T-SHIRTS (4 products)
  {
    id: "t-01",
    name_ar: "تيشيرت بولو بيج بياقة تريكو ريترو",
    name_en: "Vintage Cream Retro Knit Collar Polo",
    category: "tshirts",
    price: 580,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: true,
    description_ar: "تيشيرت بولو كلاسيكي ستريت وير بياقة تريكو جاكار مخططة وأكمام ساقطة واسعة.",
    description_en: "Retro streetwear collared polo tee featuring contrast jacquard knit piping and relaxed drop sleeves.",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_ar: "بيج كريمي", name_en: "Beige Cream", hex: "#eee8dd" },
      { name_ar: "زيتي فاتح", name_en: "Sage", hex: "#8a9a86" }
    ]
  },
  {
    id: "t-02",
    name_ar: "تيشيرت مموه أوربان كامو أوفرسايز",
    name_en: "Urban Camo Street Oversized Tee",
    category: "tshirts",
    price: 520,
    badge_ar: "شائع",
    badge_en: "POPULAR",
    inStock: true,
    featured: true,
    description_ar: "طباعة تمويه عسكري مخصصة على قماش قطن مصري متين 260 جرام مع ياقة واسعة.",
    description_en: "Custom military camo screenprint on 260 GSM heavy cotton jersey. Wide neckline and raw look hem.",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name_ar: "كامو غابات", name_en: "Woodland Camo", hex: "#4a533c" }
    ]
  },
  {
    id: "t-03",
    name_ar: "تيشيرت بولو أوف وايت وافل بوكسي",
    name_en: "Crisp Off-White Textured Boxy Polo",
    category: "tshirts",
    price: 590,
    badge_ar: "إصدار جديد",
    badge_en: "NEW DROP",
    inStock: true,
    featured: true,
    description_ar: "ملمس نسيج الوافل الفاخر مع أزرار صدفية وتطريز مصغر لتاج كسوة الملكي.",
    description_en: "Clean minimalist waffle knit texture with mother-of-pearl buttons and embroidered K crown logo.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_ar: "أوف وايت", name_en: "Off White", hex: "#f7f7f5" },
      { name_ar: "أسود نقي", name_en: "Pure Black", hex: "#000000" }
    ]
  },
  {
    id: "t-04",
    name_ar: "تيشيرت زيتي ستريت بطباعة ذهبية خلفية",
    name_en: "Olive Graphic Gold Print Street Tee",
    category: "tshirts",
    price: 490,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: true,
    description_ar: "تيشيرت قطن زيتي مغسول مدموج بطباعة خط عربي ستريت ذهبية على الظهر.",
    description_en: "Military olive green washed tee stamped with metallic golden calligraphy street graphic on the back.",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name_ar: "زيتي عسكري", name_en: "Olive Green", hex: "#434b36" }
    ]
  },

  // SWEATPANTS (8 products)
  {
    id: "p-01",
    name_ar: "سويت بانتس رمادي باجي برباط أبيض سميك",
    name_en: "Heather Grey Baggy Drawstring Sweatpants",
    category: "sweatpants",
    price: 750,
    badge_ar: "أيقوني",
    badge_en: "ICONIC",
    inStock: true,
    featured: true,
    description_ar: "فليس ثقيل 400 جرام بقصة رجل عريضة مريحة ورباط خصر أبيض سميك وجيوب عميقة.",
    description_en: "Heavy 400 GSM brushed fleece sweatpants with oversized wide-leg cut, thick chunky white drawstring cord, and deep welt pockets.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name_ar: "رمادي ميلانج", name_en: "Heather Grey", hex: "#b5b7b9" },
      { name_ar: "شاركوول", name_en: "Charcoal", hex: "#3e4146" },
      { name_ar: "أسود أونيكس", name_en: "Onyx", hex: "#141416" }
    ]
  },
  {
    id: "p-02",
    name_ar: "بنطلون كحلي مريح قصة مستقيمة",
    name_en: "Midnight Navy Relaxed Fit Track Pants",
    category: "sweatpants",
    price: 720,
    badge_ar: "الأكثر طلباً",
    badge_en: "BEST SELLER",
    inStock: true,
    featured: true,
    description_ar: "بنطلون سويت بانتس كحلي مستقيم ينزل بنسيابية فوق السنيكرز.",
    description_en: "Straight leg navy sweatpants designed for effortless stacking over your favorite sneakers.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name_ar: "كحلي داكن", name_en: "Navy Blue", hex: "#162035" }
    ]
  },
  {
    id: "p-03",
    name_ar: "سويت بانتس إيكرو أوف وايت فليس باجي",
    name_en: "Ecru Off-White Baggy Fleece Pants",
    category: "sweatpants",
    price: 780,
    badge_ar: "إصدار محدود",
    badge_en: "LIMITED",
    inStock: true,
    featured: true,
    description_ar: "درجة إيكرو كريمية فخمة مع فليس ناعم للغاية وحلقات أربطة معدنية مطفية.",
    description_en: "Minimalist cream ecru tone with custom brushed texture interior and tonal metallic eyelets.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_ar: "إيكرو كريمي", name_en: "Ecru Bone", hex: "#ece7de" }
    ]
  },
  {
    id: "p-04",
    name_ar: "جوجر شاركوول ثقيل مغسول باستك سفلي",
    name_en: "Vintage Charcoal Heavy Jogger Pants",
    category: "sweatpants",
    price: 760,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: false,
    description_ar: "بنطلون جوجر رمادي شاركوول بأسورة كاحل مطاطية ولمسة غسيل كلاسيكية.",
    description_en: "Tapered ankle elastic jogger with vintage washed finish for high-energy casual styling.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name_ar: "شاركوول مغسول", name_en: "Washed Charcoal", hex: "#32353b" }
    ]
  },
  {
    id: "p-05",
    name_ar: "جوجر رياضي كحلي كلاسيكي مريح",
    name_en: "Classic Deep Navy Athletic Joggers",
    category: "sweatpants",
    price: 690,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: false,
    description_ar: "سويت بانتس عملي يومي متين مع بطانة ناعمة ومقاومة للوبر.",
    description_en: "Classic streetwear sweatpants with snug ribbed ankles and durable cotton-poly fleece mix.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name_ar: "كحلي داكن", name_en: "Navy Blue", hex: "#162035" }
    ]
  },
  {
    id: "p-06",
    name_ar: "بنطلون كارجو رملي بجيوب جانبية كبس",
    name_en: "Dune Sand Relaxed Cargo Sweats",
    category: "sweatpants",
    price: 820,
    badge_ar: "جديد وحصري",
    badge_en: "NEW DROP",
    inStock: true,
    featured: true,
    description_ar: "جيوب كارجو مزدوجة على الفخذين مع أزرار كبس مخفية لأناقة الستريت وير المعاصرة.",
    description_en: "Dual utility cargo flap pockets on the thighs with snap buttons. Urban explorer streetwear staple.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name_ar: "رملي بيج", name_en: "Dune Sand", hex: "#c2ab95" },
      { name_ar: "أسود نقي", name_en: "Black", hex: "#111111" }
    ]
  },
  {
    id: "p-07",
    name_ar: "سويت بانتس أسود نفاث واسع الأرجل",
    name_en: "Jet Black Wide Leg Stacking Sweats",
    category: "sweatpants",
    price: 750,
    badge_ar: "مميز",
    badge_en: "HOT",
    inStock: true,
    featured: false,
    description_ar: "قصة رجل واسعة متدلية باللون الأسود الكامل تنسدل بشكل استثنائي فوق الأحذية.",
    description_en: "All-black heavyweight wide-leg silhouette that stacks cleanly over sneakers and boots.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name_ar: "أسود داكن", name_en: "Jet Black", hex: "#0e0e10" }
    ]
  },
  {
    id: "p-08",
    name_ar: "جوجر رمادي أردوازي فينتاج بسوست مخفية",
    name_en: "Slate Grey Vintage Cuffed Joggers",
    category: "sweatpants",
    price: 740,
    badge_ar: "جديد",
    badge_en: "NEW",
    inStock: true,
    featured: false,
    description_ar: "درجة رمادي حجري مميزة مع جيوب جانبية بسحابات مخفية لراحة وحماية متعلقاتك.",
    description_en: "Dark mineral slate shade with mineral wash detailing and concealed zippered side pockets.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name_ar: "رمادي حجري", name_en: "Slate Grey", hex: "#5a616d" }
    ]
  }
];

export const initialOrders = [
  {
    id: "ORD-9481",
    customer: {
      name: "أحمد حسن",
      phone: "01091234567",
      address: "15 شارع الجمهورية، سموحة",
      city: "Alexandria"
    },
    items: [
      {
        id: "h-01",
        name: "هودي أسود مغسول بوكسي ثقيل 450 جرام",
        name_ar: "هودي أسود مغسول بوكسي ثقيل 450 جرام",
        name_en: "Washed Black Boxy Heavyweight Hoodie",
        size: "L",
        color: "أسود مغسول",
        price: 950,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=300&auto=format&fit=crop"
      },
      {
        id: "p-01",
        name: "سويت بانتس رمادي باجي برباط أبيض سميك",
        name_ar: "سويت بانتس رمادي باجي برباط أبيض سميك",
        name_en: "Heather Grey Baggy Drawstring Sweatpants",
        size: "L",
        color: "رمادي ميلانج",
        price: 750,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=300&auto=format&fit=crop"
      }
    ],
    subtotal: 1700,
    shipping: 0,
    total: 1700,
    status: "Delivered",
    paymentMethod: "الدفع عند الاستلام (COD)",
    date: "2026-10-05T14:30:00.000Z"
  },
  {
    id: "ORD-9482",
    customer: {
      name: "عمر طارق",
      phone: "01123456789",
      address: "عمارة 42، دجلة المعادي",
      city: "Cairo"
    },
    items: [
      {
        id: "h-02",
        name: "هودي نبيتي فليس أوفرسايز فخم",
        name_ar: "هودي نبيتي فليس أوفرسايز فخم",
        name_en: "Burgundy Heavy Fleece Oversized Hoodie",
        size: "XL",
        color: "نبيتي",
        price: 920,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&auto=format&fit=crop"
      }
    ],
    subtotal: 920,
    shipping: 50,
    total: 970,
    status: "Processing",
    paymentMethod: "الدفع عند الاستلام (COD)",
    date: "2026-10-06T10:15:00.000Z"
  }
];
