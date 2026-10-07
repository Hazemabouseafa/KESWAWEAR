import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSiteContent, initialProducts, initialOrders } from '../data/initialData';
import { translations } from '../data/translations';

const StoreContext = createContext();

const STORAGE_KEYS = {
  CONTENT: 'keswa_site_content_v3',
  PRODUCTS: 'keswa_products_v3',
  ORDERS: 'keswa_orders_v3',
  CART: 'keswa_cart_v3',
  WISHLIST: 'keswa_wishlist_v3',
  LANG: 'keswa_language_v3'
};

export const StoreProvider = ({ children }) => {
  // 0. Language State ('ar' by default, togglable to 'en')
  const [language, setLanguage] = useState(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
      return savedLang ? savedLang : 'ar';
    } catch (e) {
      return 'ar';
    }
  });

  // 1. Site Content with full sectionsVisibility fallback
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSiteContent,
          ...parsed,
          sectionsVisibility: {
            ...initialSiteContent.sectionsVisibility,
            ...(parsed.sectionsVisibility || {})
          }
        };
      }
      return initialSiteContent;
    } catch (e) {
      return initialSiteContent;
    }
  });

  // 2. Products Catalog
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch (e) {
      return initialProducts;
    }
  });

  // 3. Orders List
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch (e) {
      return initialOrders;
    }
  });

  // 4. Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 5. Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  // Sync Language and Direction
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Helper for translations dictionary
  const t = (path) => {
    const keys = path.split('.');
    let res = translations[language];
    for (const k of keys) {
      if (res && res[k] !== undefined) {
        res = res[k];
      } else {
        return path;
      }
    }
    return res;
  };

  // Helper for localized object properties
  const getLocalized = (obj, field) => {
    if (!obj) return '';
    if (language === 'ar') {
      return obj[`${field}_ar`] || obj[`${field}`] || obj[`${field}_en`] || '';
    }
    return obj[`${field}_en`] || obj[`${field}`] || obj[`${field}_ar`] || '';
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Notifications
  const showToast = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Row / Section Visibility Toggle
  const toggleSectionVisibility = (sectionKey) => {
    setSiteContent(prev => {
      const currentVal = prev.sectionsVisibility?.[sectionKey] !== false;
      const updated = {
        ...prev,
        sectionsVisibility: {
          ...prev.sectionsVisibility,
          [sectionKey]: !currentVal
        }
      };
      return updated;
    });
    showToast(language === 'ar' ? "تم تحديث ظهور القسم في الواجهة!" : "Row visibility updated!", "info");
  };

  // Content Management Handlers
  const updateContent = (path, value) => {
    setSiteContent(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
    showToast(language === 'ar' ? "تم حفظ التعديل فورياً!" : "Changes saved in real-time!", "success");
  };

  const updateBanner = (bannerKey, updatedFields) => {
    setSiteContent(prev => ({
      ...prev,
      banners: {
        ...prev.banners,
        [bannerKey]: {
          ...prev.banners[bannerKey],
          ...updatedFields
        }
      }
    }));
    showToast(language === 'ar' ? "تم تحديث البنر بنجاح!" : "Banner updated successfully!", "success");
  };

  const updateSectionHeader = (sectionKey, updatedFields) => {
    setSiteContent(prev => ({
      ...prev,
      sectionHeaders: {
        ...prev.sectionHeaders,
        [sectionKey]: {
          ...prev.sectionHeaders[sectionKey],
          ...updatedFields
        }
      }
    }));
    showToast(language === 'ar' ? "تم تحديث عنوان القسم!" : "Section header updated!", "success");
  };

  // Update Image URL directly
  const updateImage = (path, url) => {
    updateContent(path, url);
    showToast(language === 'ar' ? "تم تحديث الصورة بنجاح!" : "Image updated successfully!", "success");
  };

  // Products CRUD
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `keswa-${Date.now()}`
    };
    setProducts(prev => [productWithId, ...prev]);
    showToast(language === 'ar' ? "تمت إضافة المنتج بنجاح!" : "Product added!", "success");
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast(language === 'ar' ? "تم تحديث بيانات المنتج بنجاح!" : "Product updated successfully!", "success");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(language === 'ar' ? "تم حذف المنتج من المتجر." : "Product deleted from store.", "info");
  };

  // Cart Management
  const addToCart = (product, size = 'L', color = null, quantity = 1) => {
    const selectedColor = color || (product.colors?.[0]?.name_ar || product.colors?.[0]?.name_en || 'Standard');
    const selectedSize = size || (product.sizes?.[0] || 'L');
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;

    const productName = getLocalized(product, 'name');

    setCart(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          name: productName,
          name_ar: product.name_ar,
          name_en: product.name_en,
          price: product.price,
          image: product.images?.[0] || '',
          size: selectedSize,
          color: selectedColor,
          quantity
        }
      ];
    });

    showToast(
      language === 'ar' 
        ? `تمت إضافة ${productName} (${selectedSize}) إلى السلة!` 
        : `Added ${productName} (${selectedSize}) to cart!`, 
      "success"
    );
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Checkout & Orders Management (FIXED)
  const createOrder = (customerDetails) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= (siteContent.general?.freeShippingThreshold || 1500) ? 0 : (siteContent.general?.shippingCost || 50);
    const total = subtotal + shipping;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: { ...customerDetails },
      items: [...cart],
      subtotal,
      shipping,
      total,
      status: "Pending",
      paymentMethod: customerDetails.paymentMethod || "الدفع عند الاستلام (COD)",
      date: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    // NOTE: We do NOT close isCheckoutOpen here so the customer sees the confirmed order screen!
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(
      language === 'ar' 
        ? `تم تحديث حالة الطلب #${orderId} إلى: ${newStatus}` 
        : `Order #${orderId} status changed to: ${newStatus}`, 
      "info"
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(language === 'ar' ? `تم حذف الطلب #${orderId}` : `Order #${orderId} deleted`, "info");
  };

  const clearAllOrders = () => {
    if (window.confirm(language === 'ar' ? "هل تريد مسح كافة الطلبات المسجلة؟" : "Clear all registered orders?")) {
      setOrders([]);
      showToast(language === 'ar' ? "تم مسح كافة الطلبات" : "All orders cleared", "info");
    }
  };

  const addTestOrder = () => {
    const sampleProduct = products[0];
    const testOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        name: "محمد عبد الله (طلب تجريبي)",
        phone: "01023456789",
        address: "24 شارع النصر، سموحة",
        city: "Alexandria",
        notes: "برجاء الاتصال قبل الاستلام",
        paymentMethod: "الدفع عند الاستلام (COD)"
      },
      items: [
        {
          id: sampleProduct.id,
          name: sampleProduct.name_ar || sampleProduct.name,
          size: "L",
          color: "أسود",
          price: sampleProduct.price,
          quantity: 1,
          image: sampleProduct.images?.[0]
        }
      ],
      subtotal: sampleProduct.price,
      shipping: 50,
      total: sampleProduct.price + 50,
      status: "Pending",
      paymentMethod: "الدفع عند الاستلام (COD)",
      date: new Date().toISOString()
    };
    setOrders(prev => [testOrder, ...prev]);
    showToast(language === 'ar' ? "تمت إضافة طلب تجريبي جديد بنجاح!" : "Test order added!", "success");
  };

  // Wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'ar' ? "تمت الإزالة من المفضلة" : "Removed from favorites", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast(language === 'ar' ? "تمت الإضافة إلى المفضلة!" : "Added to favorites!", "success");
        return [...prev, productId];
      }
    });
  };

  // Reset & Backup
  const resetToDefaultData = () => {
    if (window.confirm(language === 'ar' ? "هل أنت متأكد من رغبتك في إعادة ضبط كافة محتويات الموقع والمنتجات والطلبات للوضع الافتراضي؟" : "Are you sure you want to reset all site content, products, and orders to default?")) {
      setSiteContent(initialSiteContent);
      setProducts(initialProducts);
      setOrders(initialOrders);
      localStorage.clear();
      showToast(language === 'ar' ? "تمت إعادة ضبط المتجر بنجاح!" : "Store reset to default state!", "info");
    }
  };

  const exportData = () => {
    const data = {
      siteContent,
      products,
      orders,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keswa-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(language === 'ar' ? "تم تحميل ملف النسخة الاحتياطية!" : "Backup file downloaded!", "success");
  };

  const importData = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.siteContent) setSiteContent(parsed.siteContent);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.orders) setOrders(parsed.orders);
      showToast(language === 'ar' ? "تم استيراد البيانات بنجاح!" : "Data imported successfully!", "success");
    } catch (e) {
      alert(language === 'ar' ? "صيغة الملف غير صالحة" : "Invalid JSON format");
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = siteContent.general?.freeShippingThreshold || 1500;
  const shippingCost = cartSubtotal >= freeShippingThreshold ? 0 : (siteContent.general?.shippingCost || 50);
  const cartTotal = cartSubtotal + shippingCost;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t,
      getLocalized,
      siteContent,
      toggleSectionVisibility,
      updateContent,
      updateBanner,
      updateSectionHeader,
      updateImage,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      createOrder,
      updateOrderStatus,
      deleteOrder,
      clearAllOrders,
      addTestOrder,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartSubtotal,
      shippingCost,
      cartTotal,
      cartItemsCount,
      freeShippingThreshold,
      wishlist,
      toggleWishlist,
      isCartOpen,
      setIsCartOpen,
      isAdminOpen,
      setIsAdminOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      quickViewProduct,
      setQuickViewProduct,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      notification,
      showToast,
      resetToDefaultData,
      exportData,
      importData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
