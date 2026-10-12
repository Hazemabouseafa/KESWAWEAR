import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ImageUploader } from '../components/ImageUploader';
import { 
  Package, Search, Plus, Trash2, Edit2, X, Save, 
  Check, AlertCircle, Image as ImageIcon, DollarSign,
  ArrowRight, Palette, Tag, CheckCircle2, ChevronRight
} from 'lucide-react';

const COMMON_SHIRT_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', 'Oversized'];
const COMMON_PANTS_SIZES = ['30', '32', '34', '36', '38', '40', '42', '44', '46'];

const COLOR_PRESETS = [
  { name_ar: 'أسود', name_en: 'Black', hex: '#111111' },
  { name_ar: 'أبيض', name_en: 'White', hex: '#FFFFFF' },
  { name_ar: 'رمادي', name_en: 'Grey', hex: '#888888' },
  { name_ar: 'رمادي داكن', name_en: 'Charcoal', hex: '#333333' },
  { name_ar: 'كحلي', name_en: 'Navy', hex: '#1e293b' },
  { name_ar: 'بيج', name_en: 'Beige', hex: '#d4c5b9' },
  { name_ar: 'زيتي', name_en: 'Olive', hex: '#3f4a3c' },
  { name_ar: 'بني', name_en: 'Brown', hex: '#5c4033' }
];

export const ProductsManager = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    siteContent, 
    showToast,
    language 
  } = useStore();

  const { categories = [] } = siteContent;
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Inline Dedicated View State (No modal/popup)
  const [isFormActive, setIsFormActive] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [customSizeInput, setCustomSizeInput] = useState('');
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [newColorForm, setNewColorForm] = useState({
    name_ar: '',
    name_en: '',
    hex: '#111111'
  });

  const [productForm, setProductForm] = useState({
    name_ar: '',
    name_en: '',
    category: 'hoodies',
    price: 850,
    badge_ar: 'جديد',
    badge_en: 'NEW',
    inStock: true,
    description_ar: 'قماش قطن مصري فاخر ثقيل وناعم للراحة اليومية.',
    description_en: 'Heavyweight oversized streetwear fabric.',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name_ar: 'أسود', name_en: 'Black', hex: '#111111', images: [] }
    ]
  });

  const handleOpenAddProduct = () => {
    const defaultCat = (categories && categories[0]?.id) || 'hoodies';
    setProductForm({
      name_ar: '',
      name_en: '',
      category: defaultCat,
      price: 850,
      badge_ar: 'جديد',
      badge_en: 'NEW',
      inStock: true,
      description_ar: 'قماش قطن مصري فاخر ثقيل وناعم للراحة اليومية.',
      description_en: 'Heavyweight oversized streetwear fabric.',
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name_ar: 'أسود', name_en: 'Black', hex: '#111111', images: [] }
      ]
    });
    setEditingProductId(null);
    setActiveColorIdx(0);
    setIsFormActive(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenEditProduct = (prod) => {
    setProductForm({
      name_ar: prod.name_ar || prod.name || '',
      name_en: prod.name_en || prod.name || '',
      category: prod.category || 'hoodies',
      price: prod.price || 0,
      badge_ar: prod.badge_ar || 'جديد',
      badge_en: prod.badge_en || 'NEW',
      inStock: prod.inStock !== false,
      description_ar: prod.description_ar || prod.description || '',
      description_en: prod.description_en || prod.description || '',
      images: prod.images && prod.images.length > 0 ? [...prod.images] : [''],
      sizes: prod.sizes ? [...prod.sizes] : ['S', 'M', 'L', 'XL'],
      colors: prod.colors && prod.colors.length > 0 ? prod.colors.map(c => ({
        name_ar: c.name_ar || c.name || 'لون',
        name_en: c.name_en || c.name || 'Color',
        hex: c.hex || '#111111',
        images: Array.isArray(c.images) ? [...c.images] : []
      })) : [{ name_ar: 'أسود', name_en: 'Black', hex: '#111111', images: [] }]
    });
    setEditingProductId(prod.id);
    setActiveColorIdx(0);
    setIsFormActive(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseForm = () => {
    setIsFormActive(false);
    setEditingProductId(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveProduct = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!productForm.name_ar && !productForm.name_en) {
      alert("يرجى إدخال اسم المنتج");
      return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      alert("يرجى إدخال سعر صحيح للمنتج");
      return;
    }

    const validImages = productForm.images.filter(img => img && img.trim().length > 0);
    const colorImages = productForm.colors.flatMap(c => (c.images || []).filter(img => img && img.trim().length > 0));
    const finalImages = validImages.length > 0 
      ? validImages 
      : (colorImages.length > 0 
          ? [colorImages[0]] 
          : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop']);

    const payload = {
      ...productForm,
      name: productForm.name_ar || productForm.name_en,
      price: Number(productForm.price),
      oldPrice: null, // Zero discounts
      images: finalImages,
      colors: productForm.colors.map(c => ({
        name_ar: c.name_ar,
        name_en: c.name_en,
        hex: c.hex,
        images: (c.images || []).filter(img => img && img.trim().length > 0)
      }))
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      showToast(language === 'ar' ? 'تم حفظ وتحديث المنتج بنجاح! 💾' : 'Product updated! 💾', 'success');
    } else {
      addProduct(payload);
      showToast(language === 'ar' ? 'تمت إضافة المنتج بنجاح وتثبيته بالواجهة! 💾' : 'Product added! 💾', 'success');
    }

    handleCloseForm();
  };

  const handleToggleSize = (size) => {
    setProductForm(prev => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
      };
    });
  };

  const handleAddCustomSize = (e) => {
    e.preventDefault();
    const trimmed = customSizeInput.trim().toUpperCase();
    if (trimmed && !productForm.sizes.includes(trimmed)) {
      setProductForm(prev => ({
        ...prev,
        sizes: [...prev.sizes, trimmed]
      }));
      setCustomSizeInput('');
    }
  };

  const handleAddColor = (colorObj) => {
    if (!colorObj.hex) return;
    const exists = productForm.colors.some(c => c.hex?.toLowerCase() === colorObj.hex?.toLowerCase());
    if (exists) {
      const existingIdx = productForm.colors.findIndex(c => c.hex?.toLowerCase() === colorObj.hex?.toLowerCase());
      if (existingIdx !== -1) setActiveColorIdx(existingIdx);
      return;
    }
    const newColor = {
      name_ar: colorObj.name_ar || 'لون',
      name_en: colorObj.name_en || 'Color',
      hex: colorObj.hex,
      images: []
    };
    setProductForm(prev => ({
      ...prev,
      colors: [...prev.colors, newColor]
    }));
    setActiveColorIdx(productForm.colors.length);
  };

  const handleRemoveColor = (index) => {
    setProductForm(prev => {
      const remaining = prev.colors.filter((_, i) => i !== index);
      return {
        ...prev,
        colors: remaining.length > 0 ? remaining : [{ name_ar: 'أسود', name_en: 'Black', hex: '#111111', images: [] }]
      };
    });
    setActiveColorIdx(prev => Math.max(0, prev >= index ? prev - 1 : prev));
  };

  const handleAddColorImage = (colorIndex) => {
    setProductForm(prev => {
      const colors = [...prev.colors];
      if (colors[colorIndex]) {
        const currentImgs = colors[colorIndex].images || [];
        colors[colorIndex] = {
          ...colors[colorIndex],
          images: [...currentImgs, '']
        };
      }
      return { ...prev, colors };
    });
  };

  const handleUpdateColorImage = (colorIndex, imgIndex, url) => {
    setProductForm(prev => {
      const colors = [...prev.colors];
      if (colors[colorIndex]) {
        const currentImgs = [...(colors[colorIndex].images || [])];
        currentImgs[imgIndex] = url;
        colors[colorIndex] = {
          ...colors[colorIndex],
          images: currentImgs
        };
      }
      return { ...prev, colors };
    });
  };

  const handleDeleteColorImage = (colorIndex, imgIndex) => {
    setProductForm(prev => {
      const colors = [...prev.colors];
      if (colors[colorIndex]) {
        const currentImgs = (colors[colorIndex].images || []).filter((_, i) => i !== imgIndex);
        colors[colorIndex] = {
          ...colors[colorIndex],
          images: currentImgs
        };
      }
      return { ...prev, colors };
    });
  };

  const filteredProducts = products.filter(p => {
    if (productCategoryFilter !== 'ALL' && p.category !== productCategoryFilter) return false;
    if (productSearchQuery) {
      const q = productSearchQuery.toLowerCase();
      const matchNameAr = (p.name_ar || '').toLowerCase().includes(q);
      const matchNameEn = (p.name_en || '').toLowerCase().includes(q);
      const matchId = (p.id || '').toLowerCase().includes(q);
      return matchNameAr || matchNameEn || matchId;
    }
    return true;
  });

  // =========================================================================
  // VIEW 1: DEDICATED INLINE PRODUCT EDITOR (No Popup / No Modal Overlay)
  // =========================================================================
  if (isFormActive) {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Top Sticky/Header Bar */}
        <div className="bg-[#16161f] border border-white/10 p-4 sm:p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCloseForm}
              className="p-2 sm:px-3 sm:py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-200 hover:text-white rounded transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-bold touch-manipulation"
              title="العودة"
            >
              <ArrowRight size={16} />
              <span>العودة للمنتجات</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  editingProductId 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {editingProductId ? `تعديل منتج #${editingProductId}` : 'إضافة منتج جديد'}
                </span>
                <span className="text-xs text-gray-400 font-sans">
                  {editingProductId ? 'صفحة تعديل المنتج المستقلة' : 'صفحة إنشاء منتج جديد'}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
                {editingProductId ? (productForm.name_ar || productForm.name_en || 'تعديل المنتج') : 'إضافة منتج جديد للمتجر'}
              </h2>
            </div>
          </div>

          {/* Quick Top Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white rounded text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSaveProduct}
              className="px-5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-black rounded flex items-center gap-1.5 transition-all shadow-md touch-manipulation"
            >
              <Save size={14} />
              <span>💾 حفظ التعديلات</span>
            </button>
          </div>
        </div>

        {/* Editor Form Body: Responsive 2-Column Grid */}
        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Primary Data (Left in LTR, Right in RTL) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Names & Basic Info */}
            <div className="bg-[#16161f] border border-white/10 rounded-lg p-4 sm:p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Package size={16} className="text-amber-400" />
                <span>البيانات الأساسية والتصنيف</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">الاسم بالعربية *</label>
                  <input 
                    type="text"
                    required
                    placeholder="مثال: هودي قطني أوفر سايز أسود"
                    value={productForm.name_ar}
                    onChange={(e) => setProductForm({ ...productForm, name_ar: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded outline-none focus:border-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">الاسم بالإنجليزية *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Heavyweight Oversized Black Hoodie"
                    value={productForm.name_en}
                    onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">القسم / التصنيف *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded outline-none focus:border-white font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name_ar} ({c.name_en})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">السعر الصافي (ج.م) *</label>
                  <input 
                    type="number"
                    required
                    placeholder="850"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded outline-none focus:border-white font-mono font-black text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">شارة المنتج (Badge)</label>
                  <input 
                    type="text"
                    placeholder="جديد / الأكثر طلباً / حصري"
                    value={productForm.badge_ar}
                    onChange={(e) => setProductForm({ ...productForm, badge_ar: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Stock Status Toggle */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">حالة توفر المنتج في المخزون</span>
                  <span className="text-[11px] text-gray-400 block">إذا كان غير متوفر سيظهر للعميل أنه نفذ مع تعطيل الشراء</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-neutral-900 px-3 py-1.5 rounded border border-white/10 touch-manipulation">
                  <input 
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="rounded bg-black border-white/20 text-white w-4 h-4 cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${productForm.inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {productForm.inStock ? 'متوفر (In Stock)' : 'نفذت الكمية (Sold Out)'}
                  </span>
                </label>
              </div>
            </div>

            {/* Card 2: Sizes Management (Shirts + Pants) */}
            <div className="bg-[#16161f] border border-white/10 rounded-lg p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Tag size={16} className="text-cyan-400" />
                  <span>المقاسات المتاحة ({productForm.sizes.length} مقاس محدد)</span>
                </h3>
                <span className="text-[11px] text-gray-400">انقر على المقاس لتحديده أو إلغائه</span>
              </div>

              {/* Standard Shirt Sizes */}
              <div>
                <span className="text-[11px] font-mono text-gray-400 block mb-2 font-bold">مقاسات الملابس العادية (Letters):</span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SHIRT_SIZES.map(size => {
                    const active = productForm.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleToggleSize(size)}
                        className={`min-w-11 py-2 px-3 rounded font-mono font-bold text-xs transition-colors border touch-manipulation flex items-center justify-center gap-1 ${
                          active 
                            ? 'bg-white text-black border-white shadow' 
                            : 'bg-neutral-900 text-gray-400 border-white/15 hover:border-white/40'
                        }`}
                      >
                        {active && <Check size={12} className="stroke-[3]" />}
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pants / Sweatpants Sizes (Even numbers 30-46) */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[11px] font-mono text-gray-400 block mb-2 font-bold">مقاسات البنطلونات والسويت بانتس (Numbers 30-46):</span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_PANTS_SIZES.map(size => {
                    const active = productForm.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleToggleSize(size)}
                        className={`min-w-11 py-2 px-3 rounded font-mono font-bold text-xs transition-colors border touch-manipulation flex items-center justify-center gap-1 ${
                          active 
                            ? 'bg-cyan-400 text-black border-cyan-400 shadow' 
                            : 'bg-neutral-900 text-gray-400 border-white/15 hover:border-white/40'
                        }`}
                      >
                        {active && <Check size={12} className="stroke-[3]" />}
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Size Addition */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input 
                  type="text"
                  placeholder="إضافة مقاس مخصص (مثل 48 أو Oversized-2)..."
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs font-bold rounded border border-white/10 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={14} />
                  <span>إضافة المقاس</span>
                </button>
              </div>
            </div>

            {/* Card 3: Product Descriptions */}
            <div className="bg-[#16161f] border border-white/10 rounded-lg p-4 sm:p-5 space-y-4 shadow-lg">
              <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Package size={16} className="text-purple-400" />
                <span>وصف وتفاصيل المنتج</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">الوصف بالعربية:</label>
                <textarea 
                  rows={3}
                  value={productForm.description_ar}
                  onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                  placeholder="اكتب تفاصيل القماش، الجودة، ونوع القطن..."
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded outline-none focus:border-white font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">الوصف بالإنجليزية:</label>
                <textarea 
                  rows={2}
                  value={productForm.description_en}
                  onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
                  placeholder="English product details..."
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 text-xs text-white rounded outline-none focus:border-white font-mono leading-relaxed"
                />
              </div>
            </div>

          </div>

          {/* Column 3: Visuals (Images & Colors) */}
          <div className="space-y-6">
            
            {/* Card 4: Product Images Management (Multiple Images) */}
            <div className="bg-[#16161f] border border-white/10 rounded-lg p-4 sm:p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <ImageIcon size={16} className="text-purple-400" />
                    <span>معرض صور المنتج</span>
                  </h3>
                  <span className="text-[11px] text-gray-400">({productForm.images.filter(Boolean).length} صور مسجلة)</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProductForm(prev => ({
                      ...prev,
                      images: [...prev.images, '']
                    }));
                  }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded border border-cyan-500/20 transition-colors touch-manipulation"
                >
                  <Plus size={13} />
                  <span>إضافة صورة أخرى</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 leading-normal">
                الصورة الأولى تظهر كغلاف رئيسي في المتجر، وباقي الصور تُعرض في المعرض الكامل لصفحة المنتج المستقلة.
              </p>

              <div className="space-y-3.5">
                {productForm.images.map((imgUrl, imgIdx) => (
                  <div key={imgIdx} className="p-3 bg-neutral-900/90 rounded-lg border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono font-bold ${imgIdx === 0 ? 'text-amber-400' : 'text-gray-300'}`}>
                        {imgIdx === 0 ? '★ الغلاف الرئيسي للمنتج:' : `صورة إضافية #${imgIdx + 1}:`}
                      </span>
                      {productForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setProductForm(prev => {
                              const updated = prev.images.filter((_, idx) => idx !== imgIdx);
                              return { ...prev, images: updated.length > 0 ? updated : [''] };
                            });
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 transition-colors touch-manipulation"
                          title="حذف هذه الصورة"
                        >
                          <Trash2 size={12} />
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                    
                    <ImageUploader 
                      value={imgUrl || ''}
                      onChange={(url) => {
                        setProductForm(prev => {
                          const updated = [...prev.images];
                          updated[imgIdx] = url;
                          return { ...prev, images: updated };
                        });
                      }}
                      label=""
                      previewHeight="h-32 sm:h-36"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Card 5: Full-Width Dedicated Colors & Dedicated Color Images Management */}
          <div className="lg:col-span-3 bg-[#16161f] border border-white/10 rounded-lg p-4 sm:p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Palette size={18} className="text-rose-400" />
                  <span>ألوان المنتج ومعرض الصور الخاص بكل لون ({productForm.colors.length} ألوان مضافة)</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  يمكنك تحديد ألوان المنتج ورفع صور مخصصة لكل لون على حدة. عند اختيار العميل لأي لون في المتجر، ستتحول صور المعرض تلقائياً لصور هذا اللون.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-gray-400 bg-neutral-900 px-2.5 py-1 rounded border border-white/10">
                  اللون المحدد حالياً: <strong className="text-white">{productForm.colors[activeColorIdx]?.name_ar || 'اختر لوناً'}</strong>
                </span>
              </div>
            </div>

            {/* Color Selector Tabs */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-300 block">اختر اللون لإضافة أو تعديل صوره الخاصة:</span>
              <div className="flex flex-wrap gap-2">
                {productForm.colors.map((c, i) => {
                  const isActive = activeColorIdx === i;
                  const imgCount = c.images?.filter(Boolean).length || 0;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveColorIdx(i)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all touch-manipulation ${
                        isActive 
                          ? 'bg-white text-black border-white shadow-lg ring-2 ring-white/20 scale-102 font-black' 
                          : 'bg-neutral-900 text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0" 
                        style={{ backgroundColor: c.hex }} 
                      />
                      <span>{c.name_ar || c.name_en}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-black text-white' : imgCount > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-gray-400'
                      }`}>
                        {imgCount} {imgCount === 1 ? 'صورة' : 'صور'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Color Details & Color-Specific Images Panel */}
            {productForm.colors[activeColorIdx] && (() => {
              const currentColor = productForm.colors[activeColorIdx];
              const colorImages = currentColor.images || [];

              return (
                <div className="bg-black/40 border border-white/10 rounded-lg p-4 sm:p-5 space-y-5 animate-fadeIn">
                  
                  {/* Top: Color Details & Delete Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-6 h-6 rounded-full border-2 border-white/40 shadow shrink-0"
                          style={{ backgroundColor: currentColor.hex }}
                        />
                        <span className="text-sm font-black text-white">{currentColor.name_ar}</span>
                        <span className="text-xs font-mono text-gray-400">({currentColor.name_en})</span>
                      </div>

                      {/* Edit Color Name & HEX Inline */}
                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={currentColor.name_ar}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProductForm(prev => {
                              const colors = [...prev.colors];
                              colors[activeColorIdx] = { ...colors[activeColorIdx], name_ar: val };
                              return { ...prev, colors };
                            });
                          }}
                          placeholder="الاسم بالعربية"
                          className="bg-neutral-900 border border-white/15 px-2.5 py-1 text-xs text-white rounded outline-none focus:border-white w-28 font-bold"
                        />
                        <input 
                          type="text"
                          value={currentColor.name_en}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProductForm(prev => {
                              const colors = [...prev.colors];
                              colors[activeColorIdx] = { ...colors[activeColorIdx], name_en: val };
                              return { ...prev, colors };
                            });
                          }}
                          placeholder="Name EN"
                          className="bg-neutral-900 border border-white/15 px-2.5 py-1 text-xs text-white rounded outline-none focus:border-white w-24 font-mono"
                        />
                        <input 
                          type="color"
                          value={currentColor.hex}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProductForm(prev => {
                              const colors = [...prev.colors];
                              colors[activeColorIdx] = { ...colors[activeColorIdx], hex: val };
                              return { ...prev, colors };
                            });
                          }}
                          className="w-8 h-7 rounded bg-transparent cursor-pointer border border-white/20 p-0.5"
                          title="تغيير كود اللون HEX"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddColorImage(activeColorIdx)}
                        className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors touch-manipulation"
                      >
                        <Plus size={13} />
                        <span>إضافة صورة لهذا اللون</span>
                      </button>

                      {productForm.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(activeColorIdx)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors touch-manipulation"
                          title="حذف هذا اللون بالكامل"
                        >
                          <Trash2 size={13} />
                          <span>حذف هذا اللون</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Images Grid for This Color */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                        <ImageIcon size={14} className="text-cyan-400" />
                        <span>معرض صور لون "{currentColor.name_ar}" ({colorImages.filter(Boolean).length} صور):</span>
                      </label>
                      <span className="text-[11px] text-gray-400">
                        {colorImages.length === 0 ? 'لا توجد صور خاصة (يستخدم صور الغلاف العامة)' : 'هذه الصور ستظهر حصرياً عند نقر العميل على هذا اللون'}
                      </span>
                    </div>

                    {colorImages.length === 0 ? (
                      <div className="border border-dashed border-white/15 bg-neutral-900/40 rounded-lg p-6 text-center space-y-3">
                        <ImageIcon size={28} className="text-gray-500 mx-auto" />
                        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                          لم تقم برفع صور خاصة بلون <strong className="text-white">{currentColor.name_ar}</strong> بعد. في هذه الحالة سيعرض المتجر صور المنتج العامة تلقائياً.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAddColorImage(activeColorIdx)}
                          className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded text-xs font-black inline-flex items-center gap-1.5 transition-all shadow"
                        >
                          <Plus size={14} />
                          <span>رفع وإضافة أول صورة لهذا اللون</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {colorImages.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="p-3 bg-neutral-900 rounded-lg border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-mono font-bold ${imgIdx === 0 ? 'text-amber-400' : 'text-gray-300'}`}>
                                {imgIdx === 0 ? `★ غلاف لون ${currentColor.name_ar}:` : `صورة إضافية #${imgIdx + 1}:`}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteColorImage(activeColorIdx, imgIdx)}
                                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 transition-colors touch-manipulation"
                                title="حذف هذه الصورة من اللون"
                              >
                                <Trash2 size={11} />
                                <span>حذف</span>
                              </button>
                            </div>

                            <ImageUploader 
                              value={imgUrl || ''}
                              onChange={(url) => handleUpdateColorImage(activeColorIdx, imgIdx, url)}
                              label=""
                              previewHeight="h-32 sm:h-36"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* Quick Add Presets & Custom Color Form */}
            <div className="pt-3 border-t border-white/10 space-y-4">
              {/* Presets */}
              <div>
                <span className="text-[11px] font-mono text-gray-400 block mb-2 font-bold">
                  إضافة ألوان شائعة سريعة (انقر للإضافة):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleAddColor(preset)}
                      className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-2.5 py-1.5 rounded text-xs text-gray-300 transition-colors touch-manipulation"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.name_ar}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <span className="text-[11px] font-mono text-gray-400 block font-bold">إضافة لون مخصص جديد:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <input 
                    type="text"
                    placeholder="اسم اللون بالعربية (مثال: بترولي)"
                    value={newColorForm.name_ar}
                    onChange={(e) => setNewColorForm({ ...newColorForm, name_ar: e.target.value })}
                    className="bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none font-bold"
                  />
                  <input 
                    type="text"
                    placeholder="English Name (e.g. Teal)"
                    value={newColorForm.name_en}
                    onChange={(e) => setNewColorForm({ ...newColorForm, name_en: e.target.value })}
                    className="bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={newColorForm.hex}
                      onChange={(e) => setNewColorForm({ ...newColorForm, hex: e.target.value })}
                      className="w-12 h-9 rounded bg-transparent cursor-pointer border border-white/20 p-0.5"
                    />
                    <span className="text-xs font-mono text-gray-400">{newColorForm.hex}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (newColorForm.name_ar) {
                        handleAddColor({
                          name_ar: newColorForm.name_ar,
                          name_en: newColorForm.name_en || newColorForm.name_ar,
                          hex: newColorForm.hex
                        });
                        setNewColorForm({ name_ar: '', name_en: '', hex: '#111111' });
                      } else {
                        alert("يرجى كتابة اسم اللون أولاً");
                      }
                    }}
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-black rounded border border-white transition-all shadow flex items-center justify-center gap-1.5 py-2"
                  >
                    <Plus size={14} />
                    <span>إضافة هذا اللون إلى المنتج</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Full-Width Action Bar */}
          <div className="lg:col-span-3 bg-[#16161f] border border-white/10 rounded-lg p-4 sm:p-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shadow-xl">
            <button
              type="button"
              onClick={handleCloseForm}
              className="w-full sm:w-auto px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white rounded text-xs font-bold transition-colors"
            >
              إلغاء والعودة لقائمة المنتجات
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-neutral-200 text-black text-sm font-black rounded flex items-center justify-center gap-2 transition-all shadow-xl touch-manipulation"
            >
              <Save size={16} />
              <span>💾 {editingProductId ? 'حفظ وتثبيت تعديلات المنتج' : 'إضافة المنتج إلى المتجر'}</span>
            </button>
          </div>

        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PRODUCTS CATALOG LIST VIEW
  // =========================================================================
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white mb-1 flex items-center gap-2">
            <Package size={20} className="text-white shrink-0" />
            <span>كتالوج وإدارة المنتجات ({products.length} منتج مسجل)</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400">
            إضافة منتجات جديدة أو تعديل المنتجات الحالية، والأسعار، والألوان، والصور، والمقاسات بدون أي خصومات.
          </p>
        </div>

        <button
          onClick={handleOpenAddProduct}
          className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black text-xs font-black px-4 py-2.5 rounded flex items-center justify-center gap-1.5 transition-all shadow-md touch-manipulation"
        >
          <Plus size={15} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-[#16161f] p-2.5 sm:p-3 rounded border border-white/10">
        <div className="relative flex-1">
          <Search size={14} className="absolute top-2.5 right-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="ابحث باسم المنتج أو الكود..."
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 pr-9 pl-3 py-1.5 text-xs text-white rounded outline-none focus:border-white font-sans"
          />
        </div>

        {/* Scrollable Category Filter Pills on mobile */}
        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 shrink-0 scrollbar-none touch-manipulation">
          <button
            onClick={() => setProductCategoryFilter('ALL')}
            className={`px-2.5 py-1 text-xs rounded whitespace-nowrap transition-colors touch-manipulation ${
              productCategoryFilter === 'ALL' ? 'bg-white text-black font-bold shadow' : 'bg-neutral-900 text-gray-400 hover:text-white'
            }`}
          >
            الكل ({products.length})
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setProductCategoryFilter(cat.id)}
                className={`px-2.5 py-1 text-xs rounded whitespace-nowrap transition-colors touch-manipulation ${
                  productCategoryFilter === cat.id ? 'bg-white text-black font-bold shadow' : 'bg-neutral-900 text-gray-400 hover:text-white'
                }`}
              >
                {cat.name_ar} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredProducts.map(prod => (
          <div key={prod.id} className="bg-[#16161f] border border-white/10 p-3.5 sm:p-4 rounded space-y-3 shadow-lg flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-3">
                <img 
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'} 
                  alt="" 
                  className="w-16 h-20 object-cover rounded border border-white/10 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {prod.category}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate mt-1">{prod.name_ar || prod.name}</h4>
                  <p className="text-[11px] font-mono text-gray-400 truncate">{prod.name_en}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-emerald-400 font-mono font-black text-sm">{prod.price} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Badges & Sizes */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                {prod.badge_ar && !prod.badge_ar.includes('خصم') && (
                  <span className="bg-white/10 text-white border border-white/20 px-1.5 py-0.5 rounded">
                    {prod.badge_ar}
                  </span>
                )}
                <span className={`px-1.5 py-0.5 rounded border ${
                  prod.inStock !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {prod.inStock !== false ? 'متوفر' : 'نفذت الكمية'}
                </span>
                {prod.sizes?.map(s => (
                  <span key={s} className="bg-neutral-900 text-gray-400 px-1.5 py-0.5 rounded border border-white/5">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => handleOpenEditProduct(prod)}
                className="flex-1 sm:flex-initial bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-3 py-2 rounded flex items-center justify-center gap-1 transition-colors border border-white/10 touch-manipulation"
              >
                <Edit2 size={12} className="text-cyan-400" />
                <span>تعديل المنتج</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`حذف المنتج "${prod.name_ar || prod.name}" نهائياً؟`)) {
                    deleteProduct(prod.id);
                  }
                }}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs p-2 rounded transition-colors flex items-center justify-center touch-manipulation"
                title="حذف المنتج"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};