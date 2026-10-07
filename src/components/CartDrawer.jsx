import React, { useState } from 'react';
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
    language,
    t,
    getLocalized
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const currency = t('actions.egp');
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 ${language === 'ar' ? 'left-0 sm:pr-10' : 'right-0 sm:pl-10'} max-w-full flex`}>
        <aside aria-label="Shopping Cart Drawer" className="w-full sm:w-[420px] bg-[#0e0e12] border-x border-white/10 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-white" />
              <h2 className="font-display font-black text-lg uppercase tracking-wider text-white">
                {t('cart.title')} ({cart.length})
              </h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-4 bg-neutral-900 border-b border-white/5">
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

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag size={48} className="text-gray-600 mb-4 stroke-[1]" />
                <p className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-1">
                  {t('cart.emptyTitle')}
                </p>
                <p className="text-xs text-gray-500 font-sans mb-6">
                  {t('cart.emptyDesc')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-white text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 transition-colors hover:bg-neutral-200"
                >
                  {t('cart.startShopping')}
                </button>
              </div>
            ) : (
              cart.map(item => {
                const displayName = language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name);
                return (
                  <div key={item.cartItemId} className="flex gap-4 p-3 bg-neutral-900/60 border border-white/5 rounded-sm">
                    <img 
                      src={item.image} 
                      alt="" 
                      className="w-20 h-24 object-cover object-top rounded-none border border-white/5 shrink-0" 
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-white line-clamp-1 font-sans">
                            {displayName}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-500 hover:text-red-400 p-1"
                            title={t('actions.remove')}
                            aria-label={`Remove ${displayName} from cart`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-sans text-gray-400">
                          <span className="bg-black/60 px-1.5 py-0.5 border border-white/5">
                            {t('cart.size')}: {item.size}
                          </span>
                          <span>•</span>
                          <span>{item.color}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-white/10 rounded-none bg-black">
                          <button 
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 text-gray-400 hover:text-white"
                            aria-label={`Decrease quantity of ${displayName}`}
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 text-gray-400 hover:text-white"
                            aria-label={`Increase quantity of ${displayName}`}
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <span className="text-xs font-black font-mono text-white">
                          {item.price * item.quantity} {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#0a0a0c] space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input 
                  type="text"
                  placeholder={t('cart.couponPlaceholder')}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-white/10 px-3 py-2 text-xs text-white uppercase placeholder-gray-500 outline-none focus:border-white/40"
                />
                <button 
                  type="submit"
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase px-4 py-2"
                >
                  {t('cart.apply')}
                </button>
              </form>

              {promoApplied && (
                <div className="flex justify-between items-center text-xs font-sans text-emerald-400">
                  <span>{t('cart.couponDiscount')}</span>
                  <span>-{discountAmount} {currency}</span>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-xs font-sans text-gray-400 border-t border-white/5 pt-3">
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
                  <span className="font-mono text-lg text-emerald-400">{finalTotal} {currency}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-white hover:bg-neutral-200 text-black font-black text-xs tracking-wider uppercase py-4 flex items-center justify-center gap-2 transition-all shadow-xl font-sans"
              >
                <span>{t('actions.checkout')}</span>
                {language === 'ar' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
              </button>

            </div>
          )}

        </aside>
      </div>
    </div>
  );
};
