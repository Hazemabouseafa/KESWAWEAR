import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ImageUploader } from '../ImageUploader';
import { 
  Package, Search, Plus, Trash2, Edit2, X, Save, 
  Check, AlertCircle, Image as ImageIcon, DollarSign
} from 'lucide-react';

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

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [productForm, setProductForm] = useState({
    name_ar: '',
    name_en: '',
    category: 'hoodies',
    price: 850,
    oldPrice: 1100,
    badge_ar: 'جديد',
    badge_en: 'NEW',
    inStock: true,
    description_ar: 'قماش قطن مصري فاخر ثقيل وناعم للراحة اليومية.',
    description_en: 'Heavyweight oversized streetwear fabric.',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name_ar: 'أسود', name_en: 'Black', hex: '#111111' },
      { name_ar: 'رمادي', name_en: 'Grey', hex: '#888888' }
    ]
  });

  const handleOpenAddProduct = () => {
    const defaultCat = (categories && categories[0]?.id) || 'hoodies';
    setProductForm({
      name_ar: '',
      name_en: '',
      category: defaultCat,
      price: 850,
      oldPrice: 1100,
      badge_ar: 'جديد',
      badge_en: 'NEW',
      inStock: true,
      description_ar: 'قماش قطن مصري فاخر ثقيل وناعم للراحة اليومية.',
      description_en: 'Heavyweight oversized streetwear fabric.',
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name_ar: 'أسود', name_en: 'Black', hex: '#111111' }
      ]
    });
    setEditingProductId(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductForm({
      name_ar: prod.name_ar || prod.name || '',
      name_en: prod.name_en || prod.name || '',
      category: prod.category || 'hoodies',
      price: prod.price || 0,
      oldPrice: prod.oldPrice || '',
      badge_ar: prod.badge_ar || prod.badge || '',
      badge_en: prod.badge_en || prod.badge || '',
      inStock: prod.inStock !== false,
      description_ar: prod.description_ar || prod.description || '',
      description_en: prod.description_en || prod.description || '',
      images: prod.images && prod.images.length > 0 ? [...prod.images] : [''],
      sizes: prod.sizes ? [...prod.sizes] : ['S', 'M', 'L', 'XL'],
      colors: prod.colors ? prod.colors.map(c => ({
        name_ar: c.name_ar || c.name || 'لون',
        name_en: c.name_en || c.name || 'Color',
        hex: c.hex || '#111111'
      })) : [{ name_ar: 'أسود', name_en: 'Black', hex: '#111111' }]
    });
    setEditingProductId(prod.id);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name_ar && !productForm.name_en) {
      alert("يرجى إدخال اسم المنتج");
      return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      alert("يرجى إدخال سعر صحيح للمنتج");
      return;
    }

    const payload = {
      ...productForm,
      name: productForm.name_ar || productForm.name_en,
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      images: productForm.images.filter(img => img && img.trim().length > 0)
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
    setEditingProductId(null);
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Package size={22} className="text-white" />
            <span>كتالوج وإدارة المنتجات ({products.length} منتج مسجل)</span>
          </h2>
          <p className="text-xs text-gray-400">
            إضافة وتعديل وحذف المنتجات، وتعيين الأسعار، والألوان، والصور، والمقاسات.
          </p>
        </div>

        <button
          onClick={handleOpenAddProduct}
          className="bg-white hover:bg-neutral-200 text-black text-xs font-black px-4 py-2 rounded flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#16161f] p-3 rounded border border-white/10">
        <div className="relative flex-1">
          <Search size={14} className="absolute top-3 right-3 text-gray-400" />
          <input 
            type="text"
            placeholder="ابحث باسم المنتج أو الكود..."
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 pr-9 pl-3 py-2 text-xs text-white rounded outline-none focus:border-white font-sans"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <button
            onClick={() => setProductCategoryFilter('ALL')}
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              productCategoryFilter === 'ALL' ? 'bg-white text-black font-bold' : 'bg-neutral-900 text-gray-400 hover:text-white'
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
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  productCategoryFilter === cat.id ? 'bg-white text-black font-bold' : 'bg-neutral-900 text-gray-400 hover:text-white'
                }`}
              >
                {cat.name_ar} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(prod => (
          <div key={prod.id} className="bg-[#16161f] border border-white/10 p-4 rounded space-y-3 shadow-lg flex flex-col justify-between">
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
                    {prod.oldPrice && (
                      <span className="text-gray-500 font-mono text-xs line-through">{prod.oldPrice} ج.م</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges & Sizes */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                {prod.badge_ar && (
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
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
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => handleOpenEditProduct(prod)}
                className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors border border-white/10"
              >
                <Edit2 size={12} className="text-cyan-400" />
                <span>تعديل</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`حذف المنتج "${prod.name_ar || prod.name}" نهائياً؟`)) {
                    deleteProduct(prod.id);
                  }
                }}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs p-1.5 rounded transition-colors"
                title="حذف المنتج"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#16161f] border border-white/15 rounded-lg max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Package size={18} className="text-amber-400" />
                <span>{editingProductId ? 'تعديل المنتج' : 'إضافة منتج جديد'}</span>
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">الاسم بالعربية *</label>
                  <input 
                    type="text"
                    required
                    value={productForm.name_ar}
                    onChange={(e) => setProductForm({ ...productForm, name_ar: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">الاسم بالإنجليزية *</label>
                  <input 
                    type="text"
                    required
                    value={productForm.name_en}
                    onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">القسم / التصنيف *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name_ar} ({c.name_en})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">السعر (ج.م) *</label>
                  <input 
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">السعر القديم (شطب)</label>
                  <input 
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-gray-300 mb-1.5">المقاسات المتاحة:</label>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL', 'Oversized'].map(size => {
                    const active = productForm.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 rounded font-mono font-bold text-xs transition-colors border ${
                          active ? 'bg-white text-black border-white' : 'bg-neutral-900 text-gray-400 border-white/15 hover:border-white/40'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Uploader */}
              <div>
                <ImageUploader 
                  value={productForm.images[0] || ''}
                  onChange={(url) => {
                    setProductForm(prev => {
                      const updated = [...prev.images];
                      updated[0] = url;
                      return { ...prev, images: updated };
                    });
                  }}
                  label="صورة المنتج الأساسية (رفع من الجهاز أو رابط):"
                  previewHeight="h-36"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-1">الوصف بالعربية:</label>
                <textarea 
                  rows={2}
                  value={productForm.description_ar}
                  onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input 
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="rounded bg-neutral-900 border-white/20 text-white"
                  />
                  <span>المنتج متوفر في المخزون (In Stock)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-gray-300 hover:text-white rounded transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white hover:bg-neutral-200 text-black font-black rounded transition-all shadow-lg flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>💾 {editingProductId ? 'حفظ تعديلات المنتج' : 'إضافة المنتج'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};