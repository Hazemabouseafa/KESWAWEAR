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

  // 1. Site Content with full sectionsVisibility fallback & no discounts
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        const nav = (parsed.navigation || initialSiteContent.navigation).filter(n => n.id !== 'sale');
        const ann = parsed.announcement || initialSiteContent.announcement;
        const cleanAnnText = (ann.text_ar && (ann.text_ar.includes('خصم') || ann.text_ar.includes('SALE'))) 
          ? initialSiteContent.announcement.text_ar 
          : ann.text_ar;
        const banners = {
          ...initialSiteContent.banners,
          ...(parsed.banners || {}),
          heroHoodies: {
            ...initialSiteContent.banners.heroHoodies,
            ...(parsed.banners?.heroHoodies || {}),
            image: (parsed.banners?.heroHoodies?.image && !parsed.banners?.heroHoodies?.image.includes('photo-1556905055-8f358a7a47b2')) 
              ? parsed.banners.heroHoodies.image 
              : '/assets/hero_knit_banner.jpg'
          }
        };

        return {
          ...initialSiteContent,
          ...parsed,
          banners,
          navigation: nav,
          announcement: {
            ...ann,
            text_ar: cleanAnnText,
            link: '#shop'
          },
          whatsapp: {
            ...initialSiteContent.whatsapp,
            ...(parsed.whatsapp || {}),
            phone: parsed.whatsapp?.phone || parsed.footer?.whatsapp || initialSiteContent.whatsapp.phone
          },
          categories: (parsed.categories && parsed.categories.length > 0) ? parsed.categories : initialSiteContent.categories,
          sectionsVisibility: {
            ...initialSiteContent.sectionsVisibility,
            ...(parsed.sectionsVisibility || {}),
            superSale: false // permanently eliminate discount row
          }
        };
      }
      return initialSiteContent;
    } catch (e) {
      return initialSiteContent;
    }
  });

  // Helper to remove any oldPrice or discount markings
  const sanitizeProducts = (list) => {
    return (list || [])
      .filter(p => p.id !== 'h-07' && p.id !== 'h-08')
      .map(p => {
        const isDiscount = p.badge_ar && (p.badge_ar.includes('خصم') || p.badge_ar.includes('%'));
        return {
          ...p,
          oldPrice: null,
          badge_ar: isDiscount ? 'جديد' : (p.badge_ar || 'جديد'),
          badge_en: isDiscount ? 'NEW' : (p.badge_en || 'NEW')
        };
      });
  };

  // 2. Products Catalog (with no discounts / oldPrice)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return sanitizeProducts(parsed);
        }
      }
      return sanitizeProducts(initialProducts);
    } catch (e) {
      return sanitizeProducts(initialProducts);
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
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
    }
    return false;
  });
  const [adminTab, setAdminTab] = useState('orders'); // Defaults straight to orders management
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  // Sync /admin URL route
  useEffect(() => {
    const handleLocation = () => {
      if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  const openAdminTab = (tab = 'orders') => {
    setAdminTab(tab);
    setIsAdminOpen(true);
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/admin');
    }
  };

  const closeAdmin = () => {
    setIsAdminOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/');
    }
  };

  // Neon PostgreSQL Database State ('checking' | 'connected' | 'local' | 'error')
  const [neonStatus, setNeonStatus] = useState('checking');
  const [neonDetails, setNeonDetails] = useState({ connected: false, database: 'keswawear', counts: {} });

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

  // Sync to LocalStorage (Immediate offline cache)
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

  // Neon Database Sync on Mount
  useEffect(() => {
    let isMounted = true;
    const checkAndSyncNeon = async () => {
      try {
        const statusRes = await fetch('/api/status').catch(() => null);
        if (!statusRes || !statusRes.ok) {
          if (isMounted) setNeonStatus('local');
          return;
        }

        const statusData = await statusRes.json();
        if (statusData.connected) {
          if (isMounted) {
            setNeonStatus('connected');
            setNeonDetails(statusData);
          }

          // 1. Fetch content from Neon / Backend
          const contentRes = await fetch('/api/content').catch(() => null);
          if (contentRes && contentRes.ok) {
            const contentJson = await contentRes.json();
            if (contentJson.data && isMounted) {
              setSiteContent(prev => {
                const neonCats = contentJson.data.categories || [];
                const localCats = prev.categories || [];

                // Smart Merge: Preserve both Neon and local custom categories
                const catMap = new Map();
                neonCats.forEach(c => catMap.set(c.id, c));
                localCats.forEach(c => {
                  if (!catMap.has(c.id)) {
                    catMap.set(c.id, c);
                  }
                });
                const mergedCategories = Array.from(catMap.values());

                // Smart Merge navigation
                const neonNav = contentJson.data.navigation || [];
                const localNav = prev.navigation || [];
                const navMap = new Map();
                neonNav.forEach(n => navMap.set(n.id, n));
                localNav.forEach(n => {
                  if (!navMap.has(n.id)) {
                    navMap.set(n.id, n);
                  }
                });
                const mergedNav = Array.from(navMap.values());

                const mergedVisibility = {
                  ...initialSiteContent.sectionsVisibility,
                  ...(prev.sectionsVisibility || {}),
                  ...(contentJson.data.sectionsVisibility || {}),
                  superSale: false
                };

                const mergedContent = {
                  ...initialSiteContent,
                  ...prev,
                  ...contentJson.data,
                  categories: mergedCategories.length > 0 ? mergedCategories : initialSiteContent.categories,
                  navigation: mergedNav.length > 0 ? mergedNav : initialSiteContent.navigation,
                  sectionsVisibility: mergedVisibility
                };

                // If local had custom categories that Neon was missing, push merged to Neon!
                const hasLocalNewCats = localCats.some(lc => !neonCats.some(nc => nc.id === lc.id));
                if (hasLocalNewCats) {
                  fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mergedContent)
                  }).catch(() => {});
                }

                return mergedContent;
              });
            }
          }

          // 2. Fetch products from Neon / Backend
          const prodRes = await fetch('/api/products').catch(() => null);
          if (prodRes && prodRes.ok) {
            const prodJson = await prodRes.json();
            if (prodJson.products && Array.isArray(prodJson.products) && prodJson.products.length > 0 && isMounted) {
              setProducts(prev => {
                const neonProds = sanitizeProducts(prodJson.products);
                const localProds = prev || [];
                const prodMap = new Map();
                neonProds.forEach(p => prodMap.set(p.id, p));
                localProds.forEach(p => {
                  if (!prodMap.has(p.id)) prodMap.set(p.id, p);
                });
                return Array.from(prodMap.values());
              });
            }
          }

          // 3. Fetch orders from Neon / Backend
          const orderRes = await fetch('/api/orders').catch(() => null);
          if (orderRes && orderRes.ok) {
            const orderJson = await orderRes.json();
            if (orderJson.orders && orderJson.orders.length > 0 && isMounted) {
              setOrders(orderJson.orders);
            }
          }
        } else {
          if (isMounted) setNeonStatus('local');
        }
      } catch (err) {
        if (isMounted) setNeonStatus('local');
      }
    };

    checkAndSyncNeon();
    return () => { isMounted = false; };
  }, []);

  const syncAllToNeon = async () => {
    try {
      showToast(language === 'ar' ? "جاري مزامنة وتهيئة البيانات في Neon (قاعدة keswawear)..." : "Syncing data to Neon PostgreSQL...", "info");
      const res = await fetch('/api/init-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteContent,
          products,
          orders
        })
      });
      const data = await res.json();
      if (data.success) {
        setNeonStatus('connected');
        showToast(language === 'ar' ? "تمت المزامنة بنجاح في قاعدة بيانات Neon (keswawear)!" : "Successfully synced to Neon PostgreSQL!", "success");
        checkNeonConnection();
      } else {
        showToast(language === 'ar' ? `تنبيه: ${data.message || 'يرجى ربط DATABASE_URL في Vercel'}` : (data.message || 'Failed'), "error");
      }
    } catch (e) {
      showToast(language === 'ar' ? "فشل الاتصال بـ API Neon - يرجى التأكد من نشر المتجر على Vercel وربط DATABASE_URL" : "Failed to connect to Neon API", "error");
    }
  };

  const checkNeonConnection = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setNeonDetails(data);
        setNeonStatus(data.connected ? 'connected' : 'local');
        return data;
      }
      setNeonStatus('local');
      return { connected: false };
    } catch (e) {
      setNeonStatus('local');
      return { connected: false };
    }
  };

  // Centralized async persistence to Backend / Neon / Serverless cache on Vercel
  const persistSiteContent = async (contentToSave) => {
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentToSave)
      });
    } catch (e) {
      console.warn('Backend sync failed, saved in local storage:', e);
    }
  };

  const persistProduct = async (productData, method = 'POST') => {
    try {
      if (method === 'DELETE') {
        await fetch(`/api/products?id=${productData.id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: productData })
        });
      }
    } catch (e) {}
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
      persistSiteContent(updated);
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
    setSiteContent(prev => {
      const existing = prev.banners?.[bannerKey] || {};
      let merged = { ...existing, ...updatedFields };
      if (bannerKey === 'categoryGrid' && updatedFields) {
        merged = {
          ...existing,
          ...updatedFields,
          card1: updatedFields.card1 ? { ...existing.card1, ...updatedFields.card1 } : existing.card1,
          card2: updatedFields.card2 ? { ...existing.card2, ...updatedFields.card2 } : existing.card2,
          card3: updatedFields.card3 ? { ...existing.card3, ...updatedFields.card3 } : existing.card3,
        };
      }
      const updated = {
        ...prev,
        banners: {
          ...prev.banners,
          [bannerKey]: merged
        }
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم تحديث البنر بنجاح!" : "Banner updated successfully!", "success");
  };

  const updateSectionHeader = (sectionKey, updatedFields) => {
    setSiteContent(prev => {
      const updated = {
        ...prev,
        sectionHeaders: {
          ...prev.sectionHeaders,
          [sectionKey]: {
            ...prev.sectionHeaders?.[sectionKey],
            ...updatedFields
          }
        }
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم تحديث عنوان القسم!" : "Section header updated!", "success");
  };

  // Update Image URL directly
  const updateImage = (path, url) => {
    updateContent(path, url);
    showToast(language === 'ar' ? "تم تحديث الصورة بنجاح! 💾" : "Image updated successfully! 💾", "success");
  };

  // Explicit Save Handlers for Admin Panel with Immediate Toast & Persistence
  const saveGeneralSettings = (settings) => {
    setSiteContent(prev => {
      const updated = {
        ...prev,
        general: {
          ...prev.general,
          ...settings
        }
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم حفظ وتثبيت إعدادات الشحن والعملة بنجاح! 💾" : "Shipping and currency settings saved! 💾", "success");
  };

  const saveSectionsVisibility = (visibilityMap) => {
    setSiteContent(prev => {
      const updated = {
        ...prev,
        sectionsVisibility: {
          ...prev.sectionsVisibility,
          ...visibilityMap
        }
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم حفظ وتثبيت حالة ظهور صفوف وأقسام المتجر! 💾" : "Rows visibility settings saved! 💾", "success");
  };

  const formatSocialUrl = (url, platform) => {
    if (!url) return '';
    let trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('@')) {
      trimmed = trimmed.substring(1);
    }
    if (platform === 'facebook') {
      return trimmed.includes('facebook.com') ? `https://${trimmed}` : `https://facebook.com/${trimmed}`;
    }
    if (platform === 'instagram') {
      return trimmed.includes('instagram.com') ? `https://${trimmed}` : `https://instagram.com/${trimmed}`;
    }
    if (platform === 'tiktok') {
      return trimmed.includes('tiktok.com') ? `https://${trimmed}` : `https://tiktok.com/@${trimmed}`;
    }
    return `https://${trimmed}`;
  };

  const saveSocialLinks = (socialMap) => {
    setSiteContent(prev => {
      const currentSocial = prev.footer?.social || {};
      const updatedSocial = {
        ...currentSocial,
        ...(socialMap.instagram !== undefined ? { instagram: formatSocialUrl(socialMap.instagram, 'instagram') } : {}),
        ...(socialMap.facebook !== undefined ? { facebook: formatSocialUrl(socialMap.facebook, 'facebook') } : {}),
        ...(socialMap.tiktok !== undefined ? { tiktok: formatSocialUrl(socialMap.tiktok, 'tiktok') } : {})
      };

      const updated = {
        ...prev,
        footer: {
          ...prev.footer,
          social: updatedSocial
        }
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم حفظ وتثبيت روابط السوشيال ميديا بنجاح! 💾" : "Social media links saved! 💾", "success");
  };

  const formatWhatsAppNumber = (phone) => {
    if (!phone) return '';
    let cleaned = String(phone).replace(/[^0-9]/g, '');
    if (cleaned.startsWith('00')) {
      cleaned = cleaned.substring(2);
    }
    // If Egyptian local number starting with 01 (010, 011, 012, 015)
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      cleaned = '20' + cleaned.substring(1);
    }
    return cleaned;
  };

  const saveWhatsAppSettings = (whatsAppSettings) => {
    setSiteContent(prev => {
      const currentWhatsApp = prev.whatsapp || initialSiteContent.whatsapp;
      const updatedWhatsApp = {
        ...currentWhatsApp,
        ...whatsAppSettings,
        enabled: whatsAppSettings.enabled !== undefined ? Boolean(whatsAppSettings.enabled) : currentWhatsApp.enabled,
        showFloatingButton: whatsAppSettings.showFloatingButton !== undefined ? Boolean(whatsAppSettings.showFloatingButton) : currentWhatsApp.showFloatingButton,
        phone: whatsAppSettings.phone !== undefined ? whatsAppSettings.phone : currentWhatsApp.phone
      };

      const updated = {
        ...prev,
        whatsapp: updatedWhatsApp,
        footer: {
          ...prev.footer,
          whatsapp: updatedWhatsApp.phone
        }
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم حفظ وتثبيت إعدادات الواتساب بنجاح! 💾" : "WhatsApp settings saved! 💾", "success");
  };

  const toggleWhatsApp = (explicitValue) => {
    setSiteContent(prev => {
      const current = prev.whatsapp?.enabled !== false;
      const nextVal = explicitValue !== undefined ? Boolean(explicitValue) : !current;
      const updatedWhatsApp = {
        ...(prev.whatsapp || initialSiteContent.whatsapp),
        enabled: nextVal
      };
      const updated = {
        ...prev,
        whatsapp: updatedWhatsApp
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم تحديث حالة تفعيل الواتساب بنجاح!" : "WhatsApp toggle updated!", "info");
  };

  const saveTexts = (sectionKey, textData) => {
    setSiteContent(prev => {
      const mergedSection = {
        ...prev[sectionKey],
        ...textData
      };
      if (sectionKey === 'footer') {
        if (textData.social) {
          mergedSection.social = {
            ...prev.footer?.social,
            ...textData.social
          };
        }
      }
      const updated = {
        ...prev,
        [sectionKey]: mergedSection,
        ...(sectionKey === 'footer' && textData.whatsapp ? {
          whatsapp: {
            ...(prev.whatsapp || initialSiteContent.whatsapp),
            phone: textData.whatsapp
          }
        } : {})
      };
      persistSiteContent(updated);
      return updated;
    });
    showToast(language === 'ar' ? "تم حفظ نصوص الواجهة وتثبيتها بنجاح! 💾" : "Text changes saved successfully! 💾", "success");
  };

  // Categories & Custom Blocks Management
  const addCategory = (categoryData) => {
    let cleanId = (categoryData.id || categoryData.name_en || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanId || cleanId.length < 2) {
      cleanId = `cat-${Date.now().toString(36)}`;
    }

    const newCategory = {
      id: cleanId,
      name_ar: categoryData.name_ar || 'قسم جديد',
      name_en: categoryData.name_en || 'NEW CATEGORY',
      subtitle_ar: categoryData.subtitle_ar || '',
      subtitle_en: categoryData.subtitle_en || '',
      bannerImage: categoryData.bannerImage || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
      showBanner: categoryData.showBanner !== false,
      showProducts: categoryData.showProducts !== false,
      viewAllText_ar: categoryData.viewAllText_ar || 'عرض الكل',
      viewAllText_en: categoryData.viewAllText_en || 'VIEW ALL',
      badge_ar: categoryData.badge_ar || 'تشكيلة جديدة',
      badge_en: categoryData.badge_en || 'NEW DROP',
      buttonText_ar: categoryData.buttonText_ar || 'تسوق التشكيلة',
      buttonText_en: categoryData.buttonText_en || 'SHOP COLLECTION',
      isCore: false
    };

    setSiteContent(prev => {
      const existingList = prev.categories || initialSiteContent.categories;
      const filteredExisting = existingList.filter(c => c.id !== cleanId);
      const updatedList = [...filteredExisting, newCategory];
      
      const currentNav = prev.navigation || [];
      const updatedNav = [
        ...currentNav.filter(item => item.id !== cleanId),
        {
          id: cleanId,
          label_ar: newCategory.name_ar,
          label_en: newCategory.name_en,
          link: `#${cleanId}`
        }
      ];

      const updatedVisibility = {
        ...prev.sectionsVisibility,
        [`hero_${cleanId}`]: true,
        [`products_${cleanId}`]: true,
        [`${cleanId}Banner`]: true,
        [`${cleanId}Products`]: true
      };

      const updatedContent = {
        ...prev,
        categories: updatedList,
        navigation: updatedNav,
        sectionsVisibility: updatedVisibility
      };

      persistSiteContent(updatedContent);

      return updatedContent;
    });

    showToast(language === 'ar' ? `تمت إضافة قسم "${newCategory.name_ar}" بنجاح للواجهة الرئيسية!` : `Category "${newCategory.name_en}" added to storefront!`, "success");
    return newCategory;
  };

  const updateCategory = (categoryId, updatedData) => {
    setSiteContent(prev => {
      const existingList = prev.categories || initialSiteContent.categories;
      const updatedList = existingList.map(cat => cat.id === categoryId ? { ...cat, ...updatedData } : cat);
      
      const currentNav = prev.navigation || [];
      const updatedNav = currentNav.map(item => {
        if (item.id === categoryId) {
          return {
            ...item,
            label_ar: updatedData.name_ar || item.label_ar,
            label_en: updatedData.name_en || item.label_en
          };
        }
        return item;
      });

      const updatedContent = {
        ...prev,
        categories: updatedList,
        navigation: updatedNav
      };

      persistSiteContent(updatedContent);

      return updatedContent;
    });

    showToast(language === 'ar' ? "تم تحديث بيانات القسم بنجاح!" : "Category updated!", "success");
  };

  const deleteCategory = (categoryId) => {
    setSiteContent(prev => {
      const existingList = prev.categories || initialSiteContent.categories;
      const updatedList = existingList.filter(cat => cat.id !== categoryId);
      const currentNav = prev.navigation || [];
      const updatedNav = currentNav.filter(item => item.id !== categoryId);
      
      const updatedContent = {
        ...prev,
        categories: updatedList,
        navigation: updatedNav
      };

      persistSiteContent(updatedContent);

      return updatedContent;
    });

    showToast(language === 'ar' ? "تم حذف القسم بنجاح" : "Category deleted", "info");
  };

  // Products CRUD
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `keswa-${Date.now()}`
    };
    setProducts(prev => [productWithId, ...prev]);
    persistProduct(productWithId, 'POST');
    showToast(language === 'ar' ? "تمت إضافة المنتج بنجاح!" : "Product added!", "success");
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      const found = next.find(p => p.id === id);
      if (found) persistProduct(found, 'POST');
      return next;
    });
    showToast(language === 'ar' ? "تم تحديث بيانات المنتج بنجاح!" : "Product updated successfully!", "success");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    persistProduct({ id }, 'DELETE');
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

  const updateOrderDetails = (orderId, updatedDetails) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          customer: {
            ...o.customer,
            ...(updatedDetails.customer || {})
          },
          status: updatedDetails.status !== undefined ? updatedDetails.status : o.status,
          paymentMethod: updatedDetails.paymentMethod !== undefined ? updatedDetails.paymentMethod : o.paymentMethod,
          total: updatedDetails.total !== undefined ? Number(updatedDetails.total) : o.total
        };
      }
      return o;
    }));
    showToast(language === 'ar' ? "تم حفظ تعديلات الطلب بنجاح!" : "Order details saved!", "success");
  };

  const createManualOrder = (orderData) => {
    const subtotal = Number(orderData.subtotal) || 0;
    const shipping = Number(orderData.shipping) || 0;
    const total = Number(orderData.total) || (subtotal + shipping);

    const newOrder = {
      id: orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        name: orderData.name || "عميل المتجر",
        phone: orderData.phone || "",
        address: orderData.address || "",
        city: orderData.city || "Alexandria",
        notes: orderData.notes || ""
      },
      items: orderData.items || [],
      subtotal,
      shipping,
      total,
      status: orderData.status || "Pending",
      paymentMethod: orderData.paymentMethod || "الدفع عند الاستلام (COD)",
      date: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    showToast(language === 'ar' ? `تم إنشاء الطلب #${newOrder.id} بنجاح!` : `Manual order #${newOrder.id} created!`, "success");
    return newOrder;
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      alert(language === 'ar' ? "لا توجد طلبات لتصديرها" : "No orders to export");
      return;
    }

    const headers = ["رقم الطلب", "التاريخ", "اسم العميل", "رقم الهاتف", "المحافظة", "العنوان", "المنتجات", "الإجمالي", "حالة الطلب", "طريقة الدفع"];
    const rows = orders.map(o => [
      o.id,
      new Date(o.date).toLocaleDateString('ar-EG'),
      `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.phone || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.city || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.address || '').replace(/"/g, '""')}"`,
      `"${(o.items || []).map(i => `${i.quantity}x ${i.name_ar || i.name} (${i.size})`).join('; ').replace(/"/g, '""')}"`,
      o.total,
      o.status,
      `"${(o.paymentMethod || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keswa-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(language === 'ar' ? "تم تصدير ملف إكسل CSV للطلبات!" : "Exported orders to CSV!", "success");
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
      addCategory,
      updateCategory,
      deleteCategory,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      createOrder,
      updateOrderStatus,
      updateOrderDetails,
      createManualOrder,
      exportOrdersCSV,
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
      adminTab,
      setAdminTab,
      openAdminTab,
      closeAdmin,
      isTrackOrderOpen,
      setIsTrackOrderOpen,
      saveGeneralSettings,
      saveSectionsVisibility,
      saveTexts,
      saveSocialLinks,
      formatSocialUrl,
      saveWhatsAppSettings,
      toggleWhatsApp,
      formatWhatsAppNumber,
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
      importData,
      neonStatus,
      neonDetails,
      syncAllToNeon,
      checkNeonConnection
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
