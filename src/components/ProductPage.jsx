import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { WhatsAppIcon } from './FloatingWhatsApp';
import { 
  ShoppingBag, Heart, Check, ArrowRight, ArrowLeft, 
  Truck, ShieldCheck, RefreshCw, Share2, ChevronRight, 
  ChevronLeft, Copy, CheckCircle2, AlertCircle, Eye, Sparkles
} from 'lucide-react';

export const ProductPage = ({ productId, onBackToStore }) => {
  const { 
    products, 
    siteContent, 
    addToCart, 
    setIsCartOpen,
    setIsCheckoutOpen,
    navigateToCheckout,
    wishlist, 
    toggleWishlist, 
    language, 
    t, 
    getLocalized,
    showToast,
    formatWhatsAppNumber,
    navigateToProduct
  } = useStore();

  const product = products.find(p => p.id === productId) || null;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'specs' | 'shipping'

  // Scroll to top and set defaults when productId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (product) {
      setSelectedImageIdx(0);
      setSelectedSize(product.sizes?.[0] || 'L');
      setSelectedColor(product.colors?.[0] || null);
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mb-4 text-2xl">
          🔍
        </div>
        <h2 className="text-xl sm:text-2xl font-black font-display text-neutral-900 mb-2">
          {language === 'ar' ? 'المنتج غير موجود أو تم نقله' : 'Product Not Found'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-md">
          {language === 'ar' 
            ? 'عذراً، لم نتمكن من العثور على المنتج المطلوب. قد يكون تم تغيير رابطه أو نفاد كميته.' 
            : 'Sorry, the requested product could not be found or might have been removed.'}
        </p>
        <button
          onClick={onBackToStore}
          className="px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
        >
          {language === 'ar' ? '← العودة إلى المتجر والصفحة الرئيسية' : '← Back to Storefront'}
        </button>
      </div>
    );
  }

  const productName = getLocalized(product, 'name');
  const productDesc = getLocalized(product, 'description');
  const badge = getLocalized(product, 'badge');
  const isFavorite = wishlist.includes(product.id);
  const currency = t('actions.egp');
  const colorImages = (selectedColor?.images && selectedColor.images.filter(Boolean).length > 0) 
    ? selectedColor.images.filter(Boolean) 
    : null;

  const images = colorImages || (product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop']);

  const categoryItem = siteContent?.categories?.find(c => c.id === product.category);
  const categoryName = categoryItem ? (getLocalized(categoryItem, 'name') || categoryItem.name_en) : product.category;

  // Related products from the same category
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || !product.category))
    .slice(0, 4);

  // WhatsApp configuration for product inquiry
  const whatsappPhone = siteContent?.whatsapp?.phone || siteContent?.footer?.whatsapp || '01023456789';
  const cleanPhone = formatWhatsAppNumber ? formatWhatsAppNumber(whatsappPhone) : whatsappPhone.replace(/[^0-9]/g, '');
  const colorLabel = selectedColor ? getLocalized(selectedColor, 'name') : '';
  const waInquiryMsg = language === 'ar'
    ? `مرحباً KESWA WEAR، أود الاستفسار عن تفاصيل طلب منتج: "${productName}" (كود: ${product.id}) - مقاس: ${selectedSize}${colorLabel ? ` - لون: ${colorLabel}` : ''} - بسعر: ${product.price} ج.م`
    : `Hello KESWA WEAR, I would like to inquire about product: "${productName}" (ID: ${product.id}) - Size: ${selectedSize}${colorLabel ? ` - Color: ${colorLabel}` : ''} - Price: ${product.price} EGP`;
  const whatsappInquiryUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waInquiryMsg)}`;

  const handleAddToCart = () => {
    const colorName = selectedColor ? getLocalized(selectedColor, 'name') : null;
    addToCart(product, selectedSize, colorName, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2200);
    showToast(language === 'ar' ? `تمت إضافة "${productName}" إلى السلة! 🛍️` : `Added "${productName}" to cart! 🛍️`, 'success');
  };

  const handleBuyNow = () => {
    const colorName = selectedColor ? getLocalized(selectedColor, 'name') : null;
    addToCart(product, selectedSize, colorName, quantity);
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
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      navigator.clipboard?.writeText(currentUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        showToast(language === 'ar' ? 'تم نسخ رابط المنتج إلى الحافظة! 📋' : 'Product link copied! 📋', 'info');
      }).catch(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#f8f7f4] min-h-screen text-[#121216] selection:bg-black selection:text-white font-sans animate-fadeIn">
      
      {/* 1. Breadcrumbs & Back Navigation Bar */}
      <div className="border-b border-[#e6e4dc] bg-white/70 backdrop-blur-sm sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          
          {/* Breadcrumb Links */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button 
              onClick={onBackToStore}
              className="hover:text-black transition-colors font-medium cursor-pointer"
            >
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <span>/</span>
            <button 
              onClick={onBackToStore}
              className="hover:text-black transition-colors font-medium cursor-pointer uppercase"
            >
              {categoryName}
            </button>
            <span>/</span>
            <span className="text-neutral-900 font-bold truncate max-w-[150px] sm:max-w-[280px]">
              {productName}
            </span>
          </nav>

          {/* Back button */}
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-black py-1 px-2.5 rounded transition-colors shrink-0 font-sans cursor-pointer"
          >
            {language === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{language === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] bg-[#f1efe9] border border-[#e6e4dc] rounded-sm overflow-hidden group shadow-sm">
              
              {/* Main Image */}
              <img 
                src={images[selectedImageIdx] || images[0]} 
                alt={productName}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badge (NEW / Original - Zero discounts) */}
              {badge && !badge.includes('خصم') && !badge.toUpperCase().includes('SALE') && !badge.includes('%') && (
                <span className="absolute top-4 start-4 bg-black text-white text-[10px] font-black font-sans uppercase tracking-wider px-3 py-1 shadow-md z-10">
                  {badge}
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 end-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md z-10 cursor-pointer ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/85 text-neutral-700 hover:text-black hover:bg-white'
                }`}
                aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>

              {/* Prev / Next Arrows (if multiple images) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute start-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronRight size={18} className="rtl:rotate-0 rotate-180" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute end-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronLeft size={18} className="rtl:rotate-0 rotate-180" />
                  </button>
                </>
              )}

              {/* Image index indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 end-3 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {selectedImageIdx + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-24 shrink-0 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIdx === idx 
                        ? 'border-black ring-2 ring-black/10 scale-102' 
                        : 'border-[#e6e4dc] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${productName} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-top" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Buy Box & Details (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Category & Code Tag */}
              <div className="flex items-center justify-between gap-2 border-b border-[#e6e4dc] pb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                  {categoryName} • KESWA 2026
                </span>
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                  SKU: {product.id}
                </span>
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-neutral-900 tracking-tight leading-tight">
                  {productName}
                </h1>
                
                {/* Product Name in secondary language if available */}
                {product.name_en && language === 'ar' && (
                  <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                    {product.name_en}
                  </p>
                )}

                {/* Price (Strictly NO strike-through discounts) */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-neutral-900 tracking-tight">
                    {product.price} {currency}
                  </span>
                  <span className="text-[11px] font-sans text-neutral-500">
                    {language === 'ar' ? 'شامل الضريبة وكافة الرسوم' : 'Tax included'}
                  </span>
                </div>
              </div>

              {/* In-Stock Indicator */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className={`w-2.5 h-2.5 rounded-full ${product.inStock !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={product.inStock !== false ? 'text-emerald-700' : 'text-rose-600'}>
                  {product.inStock !== false 
                    ? (language === 'ar' ? 'متوفر في المخزون — جاهز للشحن الفوري' : 'In Stock — Ready for immediate shipping')
                    : (language === 'ar' ? 'نفذت الكمية حالياً' : 'Out of stock')}
                </span>
              </div>

              {/* Description Snippet */}
              <p className="text-xs sm:text-sm text-neutral-700 font-sans leading-relaxed bg-white/80 p-3.5 border border-[#e6e4dc] rounded-sm">
                {productDesc || (language === 'ar' 
                  ? 'قطعة ستريت وير أصلية من كولكشن KESWA WEAR مصنوعة من أجود أنواع القطن المصري بقصة مريحة وأكتاف ساقطة.' 
                  : 'Original streetwear garment crafted from premium heavyweight Egyptian cotton.')}
              </p>

              {/* Colors Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">
                      {t('quickView.selectColor')}:
                    </span>
                    <span className="font-bold text-neutral-900 font-sans">
                      {selectedColor ? getLocalized(selectedColor, 'name') : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((c, i) => {
                      const colorTitle = getLocalized(c, 'name');
                      const active = selectedColor?.hex === c.hex;
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedColor(c);
                            setSelectedImageIdx(0);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                            active 
                              ? 'border-black bg-black text-white shadow-sm' 
                              : 'border-[#dedcd4] bg-white text-neutral-800 hover:border-black/50'
                          }`}
                          title={colorTitle}
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" 
                            style={{ backgroundColor: c.hex }} 
                          />
                          <span>{colorTitle}</span>
                          {c.images && c.images.length > 0 && (
                            <span className={`text-[10px] font-mono px-1 rounded ${active ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                              {c.images.length} {language === 'ar' ? 'صور' : 'imgs'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">
                      {t('quickView.selectSize')}: <strong className="text-black font-mono">{selectedSize}</strong>
                    </span>
                    <span className="text-[11px] text-neutral-500 font-sans">
                      {language === 'ar' ? 'قصة أوفرسايز بوكسي واسعة' : 'Oversized Boxy Fit'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-11 py-2 px-3.5 text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                            active
                              ? 'bg-black text-white border-black shadow-md scale-102'
                              : 'bg-white text-neutral-800 border-[#dedcd4] hover:border-black/60 hover:bg-neutral-50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-xs font-bold text-neutral-800">
                  {t('quickView.quantity')}:
                </span>
                <div className="inline-flex items-center border border-[#dedcd4] bg-white rounded">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black font-bold text-sm cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-mono font-black text-neutral-900 border-x border-[#dedcd4]">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-neutral-600 hover:text-black font-bold text-sm cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.inStock === false}
                    className={`w-full py-3.5 px-4 text-xs font-black font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                      product.inStock === false 
                        ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                        : addedAnimation 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-black hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {addedAnimation ? <Check size={16} /> : <ShoppingBag size={16} />}
                    <span>
                      {addedAnimation 
                        ? (language === 'ar' ? 'تمت الإضافة للسلة! ✓' : 'Added to Cart! ✓') 
                        : t('actions.addToCart')}
                    </span>
                  </button>

                  {/* Buy Now (Checkout Immediately) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={product.inStock === false}
                    className={`w-full py-3.5 px-4 text-xs font-black font-sans uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-2 border-black active:scale-98 cursor-pointer ${
                      product.inStock === false
                        ? 'opacity-40 cursor-not-allowed bg-neutral-200 text-neutral-500 border-neutral-300'
                        : 'bg-white hover:bg-neutral-100 text-black shadow-sm'
                    }`}
                  >
                    <Sparkles size={15} />
                    <span>{language === 'ar' ? 'اشتري الآن (دفع فوري)' : 'Buy Now'}</span>
                  </button>
                </div>

                {/* WhatsApp Direct Inquiry Button */}
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <WhatsAppIcon size={16} />
                  <span>{language === 'ar' ? 'طلب أو استفسار فوري عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </a>

                {/* Share Link Button */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    {isCopied ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Share2 size={13} />}
                    <span>{isCopied ? (language === 'ar' ? 'تم نسخ الرابط!' : 'Copied!') : (language === 'ar' ? 'مشاركة رابط المنتج' : 'Share Product')}</span>
                  </button>
                </div>
              </div>

              {/* Trust & Guarantee Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#e6e4dc] text-[11px] text-neutral-700">
                <div className="flex items-center gap-2 p-2 bg-white border border-[#dedcd4] rounded-sm">
                  <Truck size={16} className="text-amber-500 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900">{language === 'ar' ? 'شحن سريع' : 'Fast Delivery'}</strong>
                    <span className="text-[10px] text-neutral-500">{language === 'ar' ? 'لكافة محافظات مصر' : 'All Egypt governorates'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white border border-[#dedcd4] rounded-sm">
                  <Eye size={16} className="text-blue-500 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900">{language === 'ar' ? 'معاينة عند الاستلام' : 'Inspection Allowed'}</strong>
                    <span className="text-[10px] text-neutral-500">{language === 'ar' ? 'افحص المنتج قبل الدفع' : 'Inspect before payment'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-white border border-[#dedcd4] rounded-sm">
                  <RefreshCw size={16} className="text-emerald-500 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900">{language === 'ar' ? 'استبدال واسترجاع' : 'Easy Returns'}</strong>
                    <span className="text-[10px] text-neutral-500">{language === 'ar' ? 'خلال 14 يوماً' : 'Within 14 days'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3. Detailed Specifications & Policies Accordion / Tabs */}
        <div className="mt-14 pt-8 border-t border-[#e6e4dc]">
          <div className="flex border-b border-[#dedcd4] gap-4 sm:gap-8 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'desc' 
                  ? 'border-black text-black font-black' 
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              {language === 'ar' ? 'تفاصيل القطعة والخامة' : 'Description & Material'}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'shipping' 
                  ? 'border-black text-black font-black' 
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              {language === 'ar' ? 'الشحن والتوصيل والاستلام' : 'Shipping & Delivery'}
            </button>

            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'care' 
                  ? 'border-black text-black font-black' 
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              {language === 'ar' ? 'تعليمات العناية والغسيل' : 'Care Instructions'}
            </button>
          </div>

          <div className="bg-white border border-[#dedcd4] p-5 sm:p-7 rounded-sm shadow-xs text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans">
            {activeTab === 'desc' && (
              <div className="space-y-3">
                <p>
                  {productDesc || (language === 'ar' 
                    ? 'تم تصميم هذه القطعة بقصة واسعة ومريحة (Oversized Fit) تعبر عن ثقافة الستريت وير المعاصرة.' 
                    : 'Designed in our signature oversized streetwear silhouette for all-day expression.')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-600 pt-2">
                  <li><strong>{language === 'ar' ? 'نوع القماش' : 'Fabric'}:</strong> {language === 'ar' ? 'قطن مصري 100% ممتاز فائق النعومة والمتانة.' : '100% Premium Egyptian Combed Cotton.'}</li>
                  <li><strong>{language === 'ar' ? 'القصة والتصميم' : 'Silhouette'}:</strong> {language === 'ar' ? 'أكتاف ساقطة بوكسي (Drop Shoulder Boxy Cut).' : 'Drop shoulder relaxed streetwear cut.'}</li>
                  <li><strong>{language === 'ar' ? 'معالجة خاصة' : 'Treatment'}:</strong> {language === 'ar' ? 'معالج مسبقاً ضد الانكماش وفقدان اللون.' : 'Pre-shrunk, colorfast dyed.'}</li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p>
                  {language === 'ar' 
                    ? 'يتم شحن جميع الطلبات عبر شركات شحن معتمدة وموثوقة لضمان وصول طلبك بأعلى سرعة وأمان.' 
                    : 'Orders are shipped nationwide via trusted couriers for maximum speed and safety.'}
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-600 pt-2">
                  <li><strong>{language === 'ar' ? 'مدة التوصيل' : 'Delivery Time'}:</strong> {language === 'ar' ? 'من 2 إلى 4 أيام عمل لكافة المحافظات.' : '2 to 4 business days nationwide.'}</li>
                  <li><strong>{language === 'ar' ? 'المعاينة' : 'Inspection'}:</strong> {language === 'ar' ? 'يحق للعميل فحص المنتج والتأكد من المقاس قبل سداد المبلغ لمندوب الشحن.' : 'Customers are encouraged to inspect garments prior to payment.'}</li>
                  <li><strong>{language === 'ar' ? 'الشحن المجاني' : 'Free Shipping'}:</strong> {language === 'ar' ? 'شحن مجاني لكافة الطلبات فوق 1500 ج.م.' : 'Free shipping on orders above 1500 EGP.'}</li>
                </ul>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3">
                <p>
                  {language === 'ar' 
                    ? 'للحفاظ على جودة القماش والطباعة لأطول فترة ممكنة، ننصح باتباع الإرشادات التالية:' 
                    : 'To maintain premium fabric feel and print longevity:'}
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-600 pt-2">
                  <li>{language === 'ar' ? 'الغسيل بماء بارد (30 درجة مئوية) مع قلب القطعة للداخل.' : 'Wash cold (30°C) inside out.'}</li>
                  <li>{language === 'ar' ? 'عدم استخدام المبيضات أو مساحيق الغسيل القاسية.' : 'Do not bleach or dry clean.'}</li>
                  <li>{language === 'ar' ? 'الكي بدرجة حرارة معتدلة مع تجنب الكي المباشر فوق الطباعة أو التطريز.' : 'Iron at medium temperature; do not iron directly on graphics.'}</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 4. Related Products Section ("منتجات مشابهة قد تعجبك") */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#e6e4dc]">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#e6e4dc]">
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-neutral-900">
                  {language === 'ar' ? 'منتجات مشابهة قد تعجبك' : 'Related Products'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'ar' ? `تشكيلة مختارة من قسم ${categoryName}` : `More from ${categoryName}`}
                </p>
              </div>

              <button
                onClick={onBackToStore}
                className="text-xs font-bold text-neutral-700 hover:text-black underline uppercase"
              >
                {language === 'ar' ? 'عرض كافة المنتجات ←' : 'View All ←'}
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#dedcd4] p-3 z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <span className="block text-[11px] font-bold text-neutral-500 truncate max-w-[120px]">
            {productName}
          </span>
          <span className="block text-base font-black font-mono text-neutral-900">
            {product.price} {currency}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={`py-2 px-3 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              addedAnimation ? 'bg-emerald-600 text-white' : 'bg-black text-white'
            }`}
          >
            {addedAnimation ? <Check size={14} /> : <ShoppingBag size={14} />}
            <span>{addedAnimation ? 'تمت!' : 'السلة'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.inStock === false}
            className="py-2 px-3 text-xs font-black uppercase tracking-wider bg-white border border-black text-black hover:bg-neutral-100 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span>اشتري الآن</span>
          </button>
        </div>
      </div>

    </div>
  );
};
