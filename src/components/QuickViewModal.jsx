import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Plus, Minus, Check, ShieldCheck, RefreshCw } from 'lucide-react';

export const QuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist,
    siteContent 
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(0);
      setSelectedSize(quickViewProduct.sizes?.[0] || 'L');
      setSelectedColor(quickViewProduct.colors?.[0] || null);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorite = wishlist.includes(quickViewProduct.id);
  const currency = siteContent.general?.currency || 'EGP';

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor?.name, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#0e0e12] border border-white/20 rounded-sm shadow-2xl overflow-hidden animate-fadeIn my-6">
        
        {/* Close Button */}
        <button 
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black text-gray-300 hover:text-white rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Images */}
          <div className="p-4 sm:p-6 bg-neutral-900/50 flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full bg-black overflow-hidden rounded-sm border border-white/5">
              <img 
                src={quickViewProduct.images?.[selectedImage] || quickViewProduct.images?.[0]} 
                alt={quickViewProduct.name}
                className="w-full h-full object-cover object-top" 
              />
              {quickViewProduct.badge && (
                <span className="absolute top-3 left-3 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-1">
                  {quickViewProduct.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images?.length > 1 && (
              <div className="flex gap-2">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-20 border rounded-none overflow-hidden transition-all ${
                      selectedImage === idx ? 'border-white' : 'border-white/10 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">
                  KESWA WEAR • {quickViewProduct.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-white">
                  {quickViewProduct.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black font-mono text-white">
                  {quickViewProduct.price} {currency}
                </span>
                {quickViewProduct.oldPrice && quickViewProduct.oldPrice > quickViewProduct.price && (
                  <span className="text-sm font-mono text-gray-500 line-through">
                    {quickViewProduct.oldPrice} {currency}
                  </span>
                )}
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                  IN STOCK • متوفر
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                {quickViewProduct.description}
              </p>

              {/* Colors */}
              {quickViewProduct.colors && (
                <div>
                  <span className="text-[11px] font-mono uppercase text-gray-400 block mb-2">
                    Color: <strong className="text-white">{selectedColor?.name}</strong>
                  </span>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor?.name === c.name ? 'border-white scale-110' : 'border-neutral-700'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor?.name === c.name && <Check size={12} className="text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {quickViewProduct.sizes && (
                <div>
                  <span className="text-[11px] font-mono uppercase text-gray-400 block mb-2">
                    Select Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 py-2 px-3 text-xs font-mono font-bold uppercase border transition-all ${
                          selectedSize === size
                            ? 'bg-white text-black border-white'
                            : 'bg-neutral-900 text-gray-300 border-white/10 hover:border-white/40'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="text-[11px] font-mono uppercase text-gray-400 block mb-2">
                  Quantity:
                </span>
                <div className="inline-flex items-center border border-white/20 bg-neutral-900">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white hover:bg-neutral-200 text-black font-black text-xs tracking-[0.2em] uppercase py-4 flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <ShoppingBag size={15} />
                  <span>ADD TO CART • {quickViewProduct.price * quantity} {currency}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-4 border transition-colors ${
                    isFavorite 
                      ? 'bg-red-500/20 border-red-500 text-red-500' 
                      : 'border-white/20 hover:border-white text-gray-300'
                  }`}
                  title="Wishlist"
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Assurance badges */}
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-400" /> 100% Egyptian Cotton
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw size={12} className="text-blue-400" /> Easy 14-Day Returns
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
