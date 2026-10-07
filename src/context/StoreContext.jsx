import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSiteContent, initialProducts, initialOrders } from '../data/initialData';

const StoreContext = createContext();

const STORAGE_KEYS = {
  CONTENT: 'keswa_site_content_v1',
  PRODUCTS: 'keswa_products_v1',
  ORDERS: 'keswa_orders_v1',
  CART: 'keswa_cart_v1',
  WISHLIST: 'keswa_wishlist_v1'
};

export const StoreProvider = ({ children }) => {
  // 1. Site Content (Texts, Banners, Buttons, Footer, Branding)
  const [siteContent, setSiteContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
      return saved ? JSON.parse(saved) : initialSiteContent;
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
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'hoodies', 'tshirts', 'sweatpants', 'sale'
  const [notification, setNotification] = useState(null);

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
    showToast("Changes saved in real-time!", "success");
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
    showToast(`Banner "${bannerKey}" updated!`, "success");
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
    showToast(`Section header updated!`, "success");
  };

  // Products CRUD
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `keswa-${Date.now()}`
    };
    setProducts(prev => [productWithId, ...prev]);
    showToast(`Product "${newProduct.name}" added!`, "success");
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast("Product updated successfully!", "success");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Product deleted from store.", "info");
  };

  // Cart Management
  const addToCart = (product, size = 'L', color = null, quantity = 1) => {
    const selectedColor = color || (product.colors?.[0]?.name || 'Standard');
    const selectedSize = size || (product.sizes?.[0] || 'L');
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;

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
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          size: selectedSize,
          color: selectedColor,
          quantity
        }
      ];
    });

    showToast(`Added ${product.name} (${selectedSize}) to cart!`, "success");
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

  // Checkout & Orders
  const createOrder = (customerDetails) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= (siteContent.general.freeShippingThreshold || 1500) ? 0 : (siteContent.general.shippingCost || 50);
    const total = subtotal + shipping;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerDetails,
      items: [...cart],
      subtotal,
      shipping,
      total,
      status: "Pending",
      paymentMethod: customerDetails.paymentMethod || "Cash on Delivery (COD)",
      date: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} status changed to ${newStatus}`, "info");
  };

  // Wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from favorites", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Added to favorites!", "success");
        return [...prev, productId];
      }
    });
  };

  // Reset & Backup
  const resetToDefaultData = () => {
    if (window.confirm("Are you sure you want to reset all site content, products, and orders to original defaults?")) {
      setSiteContent(initialSiteContent);
      setProducts(initialProducts);
      setOrders(initialOrders);
      localStorage.clear();
      showToast("Store reset to original default state!", "info");
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
    showToast("Backup file downloaded!", "success");
  };

  const importData = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.siteContent) setSiteContent(parsed.siteContent);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.orders) setOrders(parsed.orders);
      showToast("Data imported successfully!", "success");
    } catch (e) {
      alert("Invalid JSON format");
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
      siteContent,
      updateContent,
      updateBanner,
      updateSectionHeader,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      createOrder,
      updateOrderStatus,
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
