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
    t,
    language 
  } = useStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
      className="group relative flex flex-col bg-[#0e0e12] border border-white/5 hover:border-white/20 transition-all duration-300 rounded-sm cursor-pointer select-none"
    >
      {/* Product Image Container */}
      <div 
        className="relative w-full aspect-[3/4] bg-neutral-900 overflow-hidden"
        onMouseEnter={() => product.images?.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img 
          src={product.images?.[currentImageIndex] || product.images?.[0]} 
          alt={productName}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105" 
          loading="lazy"
        />

        {/* Badge (Sale / New / Limited) */}
        {badge && (
          <span className="absolute top-2.5 start-2.5 bg-red-600 text-white font-sans text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none shadow-md z-10">
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
            isFavorite ? 'bg-red-500 text-white' : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/80'
          }`}
          aria-label={isFavorite ? `Remove from wishlist` : `Add to wishlist`}
        >
          <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button 
            onClick={handleQuickAdd}
            className="flex-1 bg-white hover:bg-neutral-200 text-black font-extrabold text-[11px] tracking-wider uppercase py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95 font-sans"
          >
            <ShoppingBag size={13} />
            <span>{t('actions.addToCart')}</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-black/80 hover:bg-black text-white p-2.5 backdrop-blur-md transition-colors"
            title={t('actions.quickView')}
            aria-label={`Quick view ${productName}`}
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        
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
                      selectedColor?.hex === c.hex ? 'border-white scale-110 shadow-[0_0_5px_rgba(255,255,255,0.6)]' : 'border-neutral-600 opacity-70'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={colorTitle}
                  />
                );
              })}
              <span className="text-[10px] text-gray-400 font-sans mx-1">
                {selectedColor ? getLocalized(selectedColor, 'name') : ''}
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1 mb-1.5 font-sans">
            {productName}
          </h3>
        </div>

        {/* Price & Sizes */}
        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-black font-mono text-white">
              {product.price} {currency}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs font-mono text-gray-500 line-through">
                {product.oldPrice} {currency}
              </span>
            )}
          </div>

          {/* Size Pills */}
          <div className="hidden sm:flex items-center gap-1">
            {product.sizes?.slice(0, 3).map((s) => (
              <span key={s} className="text-[9px] font-mono text-gray-400 px-1 py-0.5 bg-neutral-900 border border-white/5 rounded-none">
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
};
