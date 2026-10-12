import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Truck, Check } from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    shippingCost, 
    cartTotal,
    freeShippingThreshold,
    setIsCheckoutOpen,
    navigateToCheckout,
    language,
    t,
    getLocalized,
    navigateToProduct,
    products
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const currency = t('actions.egp');
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  // Close drawer on ESC key
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll while drawer is open on mobile and desktop
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'KESWA10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else {
      alert(language === 'ar' ? "كود الخصم غير صالح. جرب: KESWA10" : "Invalid coupon code. Try: KESWA10");
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  if (!isCartOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop with light dismiss */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container (Mobile-first: full width on mobile, docked 440px on desktop) */}
      <div className="fixed inset-y-0 end-0 w-full sm:w-[440px] max-w-full flex flex-col pointer-events-none">
        <aside 
          aria-label="Shopping Cart Drawer" 
          className="pointer-events-auto w-full h-full h-[100dvh] max-h-[100dvh] bg-[#0e0e12] border-s border-white/10 flex flex-col shadow-2xl overflow-hidden animate-drawer"
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0e0e12]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={20} className="text-white shrink-0" />
              <h2 id="cart-drawer-title" className="font-display font-black text-base sm:text-lg uppercase tracking-wider text-white">
                {t('cart.title')} ({cart.length})
              </h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 sm:p-2.5 min-w-[42px] min-h-[42px] flex items-center justify-center text-gray-400 hover:text-white transition-colors touch-manipulation cursor-pointer rounded-full hover:bg-white/5 active:scale-95"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-3.5 sm:p-4 bg-neutral-900/90 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2 text-xs font-sans mb-2 text-gray-300">
              <Truck size={15} className="text-amber-400 shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  {t('cart.addMoreForFreeShipping')} <strong className="text-white">{remainingForFreeShipping} {currency}</strong> {t('cart.toGetFreeShipping')}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={14} /> {t('cart.freeShippingUnlocked')}
                </span>
              )}
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-500" 
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List - Internal Scrollable Container */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-3.5 sm:p-5 space-y-3 sm:space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-gray-500 stroke-[1.5]" />
                </div>
                <p className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-1">
                  {t('cart.emptyTitle')}
                </p>
                <p className="text-xs text-gray-400 font-sans mb-6 max-w-xs leading-relaxed">
                  {t('cart.emptyDesc')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-white text-black font-black text-xs uppercase tracking-wider px-6 py-3 transition-transform active:scale-95 hover:bg-neutral-200 cursor-pointer shadow-lg touch-manipulation"
                >
                  {t('cart.startShopping')}
                </button>
              </div>
            ) : (
              cart.map(item => {
                const displayName = language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name);
                const prod = products?.find(p => p.id === item.id);
                const colorObj = item.color ? prod?.colors?.find(c => {
                  const cName = getLocalized(c, 'name');
                  return cName === item.color || c.name === item.color || c.name_ar === item.color || c.name_en === item.color;
                }) : null;
                const itemImg = item.image || colorObj?.images?.[0] || prod?.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop';
                
                return (
                  <div key={item.cartItemId} className="flex gap-3 sm:gap-4 p-3 bg-neutral-900/70 border border-white/5 rounded-sm">
                    <img 
                      src={itemImg} 
                      alt="" 
                      onClick={() => {
                        setIsCartOpen(false);
                        if (navigateToProduct) navigateToProduct(item.id);
                      }}
                      className="w-18 h-22 sm:w-20 sm:h-24 object-cover object-top rounded-none border border-white/5 shrink-0 cursor-pointer hover:opacity-85 transition-opacity" 
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 
                            onClick={() => {
                              setIsCartOpen(false);
                              if (navigateToProduct) navigateToProduct(item.id);
                            }}
                            className="text-xs sm:text-sm font-bold text-white line-clamp-1 font-sans cursor-pointer hover:underline"
                          >
                            {displayName}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-400 hover:text-red-400 p-1.5 -m-1 touch-manipulation cursor-pointer transition-colors"
                            title={t('actions.remove')}
                            aria-label={`Remove ${displayName} from cart`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-sans text-gray-400 flex-wrap">
                          <span className="bg-black/60 px-1.5 py-0.5 border border-white/5">
                            {t('cart.size')}: {item.size}
                          </span>
                          {item.color && (
                            <>
                              <span>•</span>
                              <span>{item.color}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 gap-2">
                        <div className="flex items-center border border-white/10 rounded-none bg-black">
                          <button 
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-white touch-manipulation cursor-pointer active:bg-neutral-800"
                            aria-label={`Decrease quantity of ${displayName}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-white touch-manipulation cursor-pointer active:bg-neutral-800"
                            aria-label={`Increase quantity of ${displayName}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-black font-mono text-white shrink-0">
                          {item.price * item.quantity} {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout (Fixed height guaranteed, iOS safe-area padded) */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0a0a0c] space-y-3 sm:space-y-4 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input 
                  type="text"
                  placeholder={t('cart.couponPlaceholder')}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-white/10 px-3 py-2 text-xs text-white uppercase placeholder-gray-500 outline-none focus:border-white/40 font-mono"
                />
                <button 
                  type="submit"
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase px-3.5 py-2 shrink-0 touch-manipulation cursor-pointer transition-colors active:scale-95"
                >
                  {t('cart.apply')}
                </button>
              </form>

              {promoApplied && (
                <div className="flex justify-between items-center text-xs font-sans text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 border border-emerald-500/20">
                  <span>{t('cart.couponDiscount')}</span>
                  <span className="font-mono font-bold">-{discountAmount} {currency}</span>
                </div>
              )}

              {/* Totals Summary */}
              <div className="space-y-1.5 text-xs font-sans text-gray-400 border-t border-white/5 pt-2.5">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className="text-white font-bold font-mono">{cartSubtotal} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-white font-bold font-mono">
                    {shippingCost === 0 ? <span className="text-emerald-400">{t('actions.freeShipping')}</span> : `${shippingCost} ${currency}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-white border-t border-white/10 pt-2">
                  <span>{t('cart.total')}</span>
                  <span className="font-mono text-base sm:text-lg text-emerald-400">{finalTotal} {currency}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(false);
                  if (navigateToCheckout) {
                    navigateToCheckout();
                  } else if (typeof window !== 'undefined') {
                    const targetPath = '/checkout';
                    if (window.location.pathname !== targetPath) {
                      window.history.pushState(null, '', targetPath);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                    try {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    } catch (e) {
                      window.scrollTo(0, 0);
                    }
                  }
                }}
                className="w-full bg-white hover:bg-neutral-200 active:scale-[0.98] text-black font-black text-xs sm:text-sm tracking-wider uppercase py-3.5 sm:py-4 flex items-center justify-center gap-2 transition-all shadow-xl font-sans cursor-pointer touch-manipulation"
              >
                <span>{t('actions.checkout')}</span>
                {language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </button>

            </div>
          )}

        </aside>
      </div>
    </div>
  );
};
