export const initialSiteContent = {
  announcement: {
    enabled: true,
    text: "🔥 FREE SHIPPING ON ORDERS OVER 1500 EGP | USE CODE: KESWA10 FOR 10% OFF",
    link: "#sale"
  },
  brand: {
    name: "KESWA",
    tagline: "CLOTHES • STYLE • YOU",
    logoStyle: "metallic", // 'metallic' | 'image' | 'minimal'
  },
  navigation: [
    { id: "shop", label: "SHOP ALL", link: "#shop" },
    { id: "hoodies", label: "HOODIES", link: "#hoodies" },
    { id: "tshirts", label: "T-SHIRTS", link: "#tshirts" },
    { id: "sweatpants", label: "SWEATPANTS", link: "#sweatpants" },
    { id: "sale", label: "SALE", link: "#sale" }
  ],
  banners: {
    heroHoodies: {
      enabled: true,
      title: "HOODIES",
      subtitle: "HEAVYWEIGHT 450 GSM COTTON • OVERSIZED BOXY FIT",
      badge: "NEW DROP 2026",
      buttonText: "SHOP COLLECTION",
      buttonLink: "#hoodies",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop"
    },
    categoryGrid: {
      enabled: true,
      card1: {
        title: "OVERSIZED HOODIES",
        subtitle: "DROP SHOULDER SILHOUETTE",
        buttonText: "SHOP HOODIES",
        link: "#hoodies",
        image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop"
      },
      card2: {
        title: "RETRO POLO TEES",
        subtitle: "KNIT COLLAR ESSENTIALS",
        buttonText: "SHOP TEES",
        link: "#tshirts",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop"
      },
      card3: {
        title: "BAGGY SWEATPANTS",
        subtitle: "MAXIMUM FLEECE COMFORT",
        buttonText: "SHOP SWEATS",
        link: "#sweatpants",
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000&auto=format&fit=crop"
      }
    },
    heroTshirts: {
      enabled: true,
      title: "T-SHIRTS",
      subtitle: "SUMMER ESSENTIALS & OVERSIZED VINTAGE CUTS",
      badge: "STREETWEAR BASICS",
      buttonText: "EXPLORE NOW",
      buttonLink: "#tshirts",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2000&auto=format&fit=crop"
    },
    heroSweatpants: {
      enabled: true,
      title: "SWEATPANTS",
      subtitle: "RELAXED FIT & DRAWSTRING WAIST • STREET READY",
      badge: "ALL DAY COMFORT",
      buttonText: "SHOP SWEATS",
      buttonLink: "#sweatpants",
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=2000&auto=format&fit=crop"
    },
    superSale: {
      enabled: true,
      title: "SUPER SALE UP TO 40% OFF",
      subtitle: "BIGGEST SEASONAL PRICE DROP • LIMITED STOCK AVAILABLE",
      badge: "FLASH DEAL",
      buttonText: "SHOP SALE",
      buttonLink: "#sale",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
      // Target countdown date: 5 days from now
      targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString()
    },
    newsletter: {
      enabled: true,
      title: "NEWSLETTER",
      subtitle: "JOIN THE KESWA SQUAD & GET 10% OFF YOUR FIRST ORDER",
      placeholder: "Enter your email address...",
      buttonText: "SUBSCRIBE",
      badgeText: "STREET CLUB"
    }
  },
  sectionHeaders: {
    hoodies: {
      title: "HOODIES",
      subtitle: "Signature heavyweight oversized fits crafted for ultimate street comfort",
      viewAllText: "VIEW ALL"
    },
    tshirts: {
      title: "T-SHIRTS",
      subtitle: "Breathable pure Egyptian cotton and boxy drop-shoulder graphics",
      viewAllText: "VIEW ALL"
    },
    sweatpants: {
      title: "SWEATPANTS",
      subtitle: "Ultra-comfortable fleece joggers, cargos and wide-leg silhouettes",
      viewAllText: "VIEW ALL"
    }
  },
  footer: {
    about: "KESWA WEAR is a premier Egyptian streetwear label born from the underground youth culture. We craft premium oversized garments made from heavy-gauge fabrics engineered for daily expression.",
    tagline: "CLOTHES • STYLE • YOU",
    phone: "+20 102 345 6789",
    whatsapp: "+20 102 345 6789",
    email: "contact@keswawear.com",
    address: "Alexandria & Cairo, Egypt",
    social: {
      instagram: "https://instagram.com/keswawear",
      tiktok: "https://tiktok.com/@keswawear",
      facebook: "https://facebook.com/keswawear"
    },
    copyright: "© 2026 KESWA WEAR. ALL RIGHTS RESERVED."
  },
  general: {
    currency: "EGP",
    shippingCost: 50,
    freeShippingThreshold: 1500
  }
};

export const initialProducts = [
  // HOODIES (8 products matching image 1)
  {
    id: "h-01",
    name: "Washed Black Boxy Heavyweight Hoodie",
    category: "hoodies",
    price: 950,
    oldPrice: 1200,
    badge: "SALE -20%",
    inStock: true,
    featured: true,
    description: "450 GSM french terry cotton hoodie featuring a boxy drop-shoulder cut, double-layered hood without drawstrings, and subtle tonal chest embroidery.",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Washed Black", hex: "#1c1c1f" },
      { name: "Burgundy", hex: "#5b1d28" },
      { name: "Mocha", hex: "#543e34" }
    ]
  },
  {
    id: "h-02",
    name: "Burgundy Heavy Fleece Oversized Hoodie",
    category: "hoodies",
    price: 920,
    oldPrice: 1150,
    badge: "BEST SELLER",
    inStock: true,
    featured: true,
    description: "Deep wine burgundy fleece hoodie designed with ribbed cuffs and kangaroo pouch. Pre-shrunk Egyptian combed cotton.",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Burgundy", hex: "#5b1d28" },
      { name: "Onyx Black", hex: "#111111" }
    ]
  },
  {
    id: "h-03",
    name: "Maroon Zip-Up Streetwear Hoodie",
    category: "hoodies",
    price: 980,
    oldPrice: 1250,
    badge: "SALE -22%",
    inStock: true,
    featured: true,
    description: "Heavy metal YKK two-way zipper hoodie with clean minimal chest logo and reinforced stitching throughout.",
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Maroon", hex: "#631c2c" },
      { name: "Navy", hex: "#1a243b" },
      { name: "Charcoal", hex: "#2b2b30" }
    ]
  },
  {
    id: "h-04",
    name: "Stealth Utility Arm Patch Hoodie",
    category: "hoodies",
    price: 1050,
    oldPrice: 1300,
    badge: "LIMITED",
    inStock: true,
    featured: false,
    description: "Tactical streetwear hybrid hoodie with zippered arm pocket and rubberized KESWA emblem.",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Tactical Black", hex: "#151515" }
    ]
  },
  {
    id: "h-05",
    name: "Oatmeal Heather Embroidered Hoodie",
    category: "hoodies",
    price: 890,
    oldPrice: 1100,
    badge: "NEW",
    inStock: true,
    featured: true,
    description: "Warm neutral heather oatmeal palette with high-density KESWA crown embroidery across the chest.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Oatmeal", hex: "#dcd6cd" },
      { name: "Bone White", hex: "#f1eee9" }
    ]
  },
  {
    id: "h-06",
    name: "Charcoal Washed Minimal Pullover",
    category: "hoodies",
    price: 940,
    oldPrice: 1200,
    badge: "SALE -21%",
    inStock: true,
    featured: false,
    description: "Sun-faded stone wash finish providing that sought-after vintage grunge streetwear vibe.",
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Acid Charcoal", hex: "#2f3136" }
    ]
  },
  {
    id: "h-07",
    name: "Earth Mocha Tan Relaxed Hoodie",
    category: "hoodies",
    price: 950,
    oldPrice: 1250,
    badge: "HOT",
    inStock: true,
    featured: false,
    description: "Earthy mocha brown shade crafted in ultra-soft brushed fleece interior with thick elasticated hem.",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Mocha Tan", hex: "#6e5445" },
      { name: "Desert Sand", hex: "#c4a482" }
    ]
  },
  {
    id: "h-08",
    name: "Deep Midnight Navy Zip Hoodie",
    category: "hoodies",
    price: 920,
    oldPrice: 1180,
    badge: "SALE -22%",
    inStock: true,
    featured: false,
    description: "Clean dark navy blue hue with matte metallic zipper pull and reinforced side panel ribbing.",
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Deep Navy", hex: "#162035" },
      { name: "Steel Grey", hex: "#4b5563" }
    ]
  },

  // T-SHIRTS (4 products matching image 1)
  {
    id: "t-01",
    name: "Vintage Cream Retro Knit Collar Polo",
    category: "tshirts",
    price: 580,
    oldPrice: 720,
    badge: "SALE -20%",
    inStock: true,
    featured: true,
    description: "Retro streetwear collared polo tee featuring contrast jacquard knit piping and relaxed drop sleeves.",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Beige Cream", hex: "#eee8dd" },
      { name: "Sage", hex: "#8a9a86" }
    ]
  },
  {
    id: "t-02",
    name: "Urban Camo Street Oversized Tee",
    category: "tshirts",
    price: 520,
    oldPrice: 650,
    badge: "POPULAR",
    inStock: true,
    featured: true,
    description: "Custom military camo screenprint on 260 GSM heavy cotton jersey. Wide neckline and raw look hem.",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Woodland Camo", hex: "#4a533c" }
    ]
  },
  {
    id: "t-03",
    name: "Crisp Off-White Textured Boxy Polo",
    category: "tshirts",
    price: 590,
    oldPrice: 750,
    badge: "NEW DROP",
    inStock: true,
    featured: true,
    description: "Clean minimalist waffle knit texture with mother-of-pearl buttons and embroidered K crown logo.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Off White", hex: "#f7f7f5" },
      { name: "Pure Black", hex: "#000000" }
    ]
  },
  {
    id: "t-04",
    name: "Olive Graphic Gold Print Street Tee",
    category: "tshirts",
    price: 490,
    oldPrice: 620,
    badge: "SALE -21%",
    inStock: true,
    featured: true,
    description: "Military olive green washed tee stamped with metallic golden calligraphy street graphic on the back.",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Olive Green", hex: "#434b36" }
    ]
  },

  // SWEATPANTS (8 products matching image 1)
  {
    id: "p-01",
    name: "Heather Grey Baggy Drawstring Sweatpants",
    category: "sweatpants",
    price: 750,
    oldPrice: 950,
    badge: "ICONIC",
    inStock: true,
    featured: true,
    description: "Heavy 400 GSM brushed fleece sweatpants with oversized wide-leg cut, thick chunky white drawstring cord, and deep welt pockets.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Heather Grey", hex: "#b5b7b9" },
      { name: "Charcoal", hex: "#3e4146" },
      { name: "Onyx", hex: "#141416" }
    ]
  },
  {
    id: "p-02",
    name: "Midnight Navy Relaxed Fit Track Pants",
    category: "sweatpants",
    price: 720,
    oldPrice: 900,
    badge: "BEST SELLER",
    inStock: true,
    featured: true,
    description: "Straight leg navy sweatpants designed for effortless stacking over your favorite sneakers.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Navy Blue", hex: "#162035" }
    ]
  },
  {
    id: "p-03",
    name: "Ecru Off-White Baggy Fleece Pants",
    category: "sweatpants",
    price: 780,
    oldPrice: 980,
    badge: "LIMITED",
    inStock: true,
    featured: true,
    description: "Minimalist cream ecru tone with custom brushed texture interior and tonal metallic eyelets.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ecru Bone", hex: "#ece7de" }
    ]
  },
  {
    id: "p-04",
    name: "Vintage Charcoal Heavy Jogger Pants",
    category: "sweatpants",
    price: 760,
    oldPrice: 950,
    badge: "SALE -20%",
    inStock: true,
    featured: false,
    description: "Tapered ankle elastic jogger with vintage washed finish for high-energy casual styling.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Washed Charcoal", hex: "#32353b" }
    ]
  },
  {
    id: "p-05",
    name: "Classic Deep Navy Athletic Joggers",
    category: "sweatpants",
    price: 690,
    oldPrice: 880,
    badge: "SALE -21%",
    inStock: true,
    featured: false,
    description: "Classic streetwear sweatpants with snug ribbed ankles and durable cotton-poly fleece mix.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy Blue", hex: "#162035" }
    ]
  },
  {
    id: "p-06",
    name: "Dune Sand Relaxed Cargo Sweats",
    category: "sweatpants",
    price: 820,
    oldPrice: 1050,
    badge: "NEW DROP",
    inStock: true,
    featured: true,
    description: "Dual utility cargo flap pockets on the thighs with snap buttons. Urban explorer streetwear staple.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Dune Sand", hex: "#c2ab95" },
      { name: "Black", hex: "#111111" }
    ]
  },
  {
    id: "p-07",
    name: "Jet Black Wide Leg Stacking Sweats",
    category: "sweatpants",
    price: 750,
    oldPrice: 950,
    badge: "HOT",
    inStock: true,
    featured: false,
    description: "All-black heavyweight wide-leg silhouette that stacks cleanly over sneakers and boots.",
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Jet Black", hex: "#0e0e10" }
    ]
  },
  {
    id: "p-08",
    name: "Slate Grey Vintage Cuffed Joggers",
    category: "sweatpants",
    price: 740,
    oldPrice: 920,
    badge: "SALE -20%",
    inStock: true,
    featured: false,
    description: "Dark mineral slate shade with mineral wash detailing and concealed zippered side pockets.",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Slate Grey", hex: "#5a616d" }
    ]
  }
];

export const initialOrders = [
  {
    id: "ORD-9481",
    customer: {
      name: "Ahmed Hassan",
      phone: "01091234567",
      address: "15 El-Gomhoureya St, Smoha",
      city: "Alexandria"
    },
    items: [
      {
        id: "h-01",
        name: "Washed Black Boxy Heavyweight Hoodie",
        size: "L",
        color: "Washed Black",
        price: 950,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=300&auto=format&fit=crop"
      },
      {
        id: "p-01",
        name: "Heather Grey Baggy Drawstring Sweatpants",
        size: "L",
        color: "Heather Grey",
        price: 750,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=300&auto=format&fit=crop"
      }
    ],
    subtotal: 1700,
    shipping: 0,
    total: 1700,
    status: "Delivered",
    paymentMethod: "Cash on Delivery (COD)",
    date: "2026-10-05T14:30:00.000Z"
  },
  {
    id: "ORD-9482",
    customer: {
      name: "Omar Tarek",
      phone: "01123456789",
      address: "Bldg 42, Degla, Maadi",
      city: "Cairo"
    },
    items: [
      {
        id: "h-02",
        name: "Burgundy Heavy Fleece Oversized Hoodie",
        size: "XL",
        color: "Burgundy",
        price: 920,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&auto=format&fit=crop"
      }
    ],
    subtotal: 920,
    shipping: 50,
    total: 970,
    status: "Processing",
    paymentMethod: "Cash on Delivery (COD)",
    date: "2026-10-06T10:15:00.000Z"
  }
];
