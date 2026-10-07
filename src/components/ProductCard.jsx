import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    setQuickViewProduct, 
    wishlist, 
    toggleWishlist, 
    getLocalized,
    t 
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'L');

  const isFavorite = wishlist.includes(product.id);
  const currency = t('actions.egp');

  const productName = getLocalized(product, 'name');
  const badge = getLocalized(product, 'badge');

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const colorName = selectedColor ? getLocalized(selectedColor, 'name') : null;
    addToCart(product, selectedSize, colorName, 1);
  };

  return (
    <article 
      onClick={() => setQuickViewProduct(product)}
      className="group relative flex flex-col bg-white border border-[#e6e4dc] hover:border-black/30 rounded-sm cursor-pointer select-none transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[3/4] bg-[#f1efe9] overflow-hidden">
        <img 
          src={product.images?.[0] || ''} 
          alt={productName}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105" 
          loading="lazy"
        />

        {/* Badge (New / Premium / Original - no discounts) */}
        {badge && !badge.includes('خصم') && !badge.toUpperCase().includes('SALE') && !badge.includes('%') && (
          <span className="absolute top-2.5 start-2.5 bg-black text-white font-sans text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none shadow-md z-10">
            {badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 end-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-neutral-700 hover:text-black hover:bg-white shadow-sm'
          }`}
          aria-label={isFavorite ? `Remove from wishlist` : `Add to wishlist`}
        >
          <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={handleQuickAdd}
            className="flex-1 bg-black hover:bg-neutral-800 text-white font-extrabold text-[11px] tracking-wider uppercase py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95 font-sans"
          >
            <ShoppingBag size={13} />
            <span>{t('actions.addToCart')}</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-white/90 hover:bg-white text-black p-2.5 shadow-md backdrop-blur-md transition-colors"
            title={t('actions.quickView')}
            aria-label={`Quick view ${productName}`}
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        
        <div>
          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {product.colors.map((c, i) => {
                const colorTitle = getLocalized(c, 'name');
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c);
                    }}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedColor?.hex === c.hex ? 'border-black scale-110 shadow-sm' : 'border-neutral-300 opacity-80'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={colorTitle}
                  />
                );
              })}
              <span className="text-[10px] text-neutral-500 font-sans mx-1">
                {selectedColor ? getLocalized(selectedColor, 'name') : ''}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-black transition-colors line-clamp-1 mb-1.5 font-sans">
            {productName}
          </h3>
        </div>

        {/* Price & Sizes */}
        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#f1efe9]">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-black font-mono text-black">
              {product.price} {currency}
            </span>
          </div>

          {/* Size Pills */}
          <div className="hidden sm:flex items-center gap-1">
            {product.sizes?.slice(0, 3).map((s) => (
              <span key={s} className="text-[9px] font-mono text-neutral-500 px-1 py-0.5 bg-[#f6f5f0] border border-[#e8e6de] rounded-none">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile Direct Add to Cart Action */}
        <button
          onClick={handleQuickAdd}
          className="sm:hidden mt-2.5 w-full bg-black active:bg-neutral-800 text-white font-extrabold text-[11px] py-2 px-2 flex items-center justify-center gap-1.5 transition-transform active:scale-95 font-sans touch-manipulation shadow-xs"
        >
          <ShoppingBag size={12} />
          <span>{t('actions.addToCart')}</span>
        </button>

      </div>
    </article>
  );
};
