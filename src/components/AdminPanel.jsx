import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Save, Plus, Trash2, Edit2, Package, Layout, ShoppingBag, 
  Settings, Download, Upload, RotateCcw, Eye, Check, AlertCircle, 
  Sparkles, Sliders, CheckCircle2, ChevronRight, Globe
} from 'lucide-react';

export const AdminPanel = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    siteContent, 
    updateContent, 
    updateBanner,
    updateSectionHeader,
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus,
    resetToDefaultData,
    exportData,
    importData,
    showToast,
    language
  } = useStore();

  const [activeTab, setActiveTab] = useState('texts'); // 'texts' | 'products' | 'banners' | 'orders' | 'settings'
  const [textLangTab, setTextLangTab] = useState('ar'); // 'ar' | 'en' for editing texts

  // Modal states for products
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

  if (!isAdminOpen) return null;

  // Handlers for product form
  const handleOpenAddProduct = () => {
    setProductForm({
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
      images: productForm.images.filter(img => img.trim().length > 0)
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

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importData(event.target.result);
      } catch (err) {
        alert("فشل في قراءة ملف النسخة الاحتياطية JSON");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-50 overflow-hidden bg-black/95 backdrop-blur-md flex flex-col font-sans select-none animate-fadeIn">
      
      {/* Top Bar */}
      <header className="bg-[#121218] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 rounded-sm shadow-md">
            <Sliders size={16} />
            <span>لوحة تحكم المتجر • KESWA CMS</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 rounded-full hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>وضع التعديل اللحظي نشط (Live Edit)</span>
          </span>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdminOpen(false)}
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs font-black px-4 py-2 rounded-sm transition-all shadow-md"
          >
            <Eye size={15} />
            <span>معاينة المتجر في الواجهة</span>
          </button>
          
          <button 
            onClick={() => setIsAdminOpen(false)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="إغلاق لوحة التحكم"
          >
            <X size={22} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Right Sidebar Tabs (RTL: on the right) */}
        <aside className="w-64 bg-[#0a0a0d] border-l border-white/10 p-4 space-y-2 hidden md:block overflow-y-auto shrink-0">
          <div className="text-[11px] font-mono text-gray-500 px-3 py-1 uppercase tracking-wider mb-2">
            القائمة الرئيسية
          </div>

          <button
            onClick={() => setActiveTab('texts')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'texts' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layout size={16} />
              <span>نصوص وأزرار الواجهة</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'texts' ? 'rotate-180' : 'opacity-40'} />
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'products' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package size={16} />
              <span>إدارة المنتجات ({products.length})</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'products' ? 'rotate-180' : 'opacity-40'} />
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'banners' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders size={16} />
              <span>إدارة البنرات والعروض</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'banners' ? 'rotate-180' : 'opacity-40'} />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'orders' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={16} />
              <span>طلبات العملاء ({orders.length})</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'orders' ? 'rotate-180' : 'opacity-40'} />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'settings' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings size={16} />
              <span>الإعدادات والنسخ الاحتياطي</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'settings' ? 'rotate-180' : 'opacity-40'} />
          </button>

          {/* Quick Backup Shortcuts */}
          <div className="pt-8 border-t border-white/10 space-y-2">
            <button
              onClick={exportData}
              className="w-full text-right p-2.5 text-xs text-gray-300 hover:text-white flex items-center gap-2 bg-neutral-900 border border-white/5 rounded"
            >
              <Download size={14} className="text-cyan-400" />
              <span>تصدير نسخة احتياطية (JSON)</span>
            </button>

            <button
              onClick={resetToDefaultData}
              className="w-full text-right p-2.5 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded"
            >
              <RotateCcw size={14} />
              <span>إعادة ضبط المصنع للمتجر</span>
            </button>
          </div>
        </aside>

        {/* Mobile Tab Nav */}
        <div className="md:hidden flex overflow-x-auto bg-[#0a0a0d] border-b border-white/10 p-2 gap-2 shrink-0">
          {[
            { id: 'texts', label: 'النصوص والأزرار' },
            { id: 'products', label: 'المنتجات' },
            { id: 'banners', label: 'البنرات' },
            { id: 'orders', label: 'الطلبات' },
            { id: 'settings', label: 'الإعدادات' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded ${
                activeTab === t.id ? 'bg-white text-black' : 'text-gray-400 bg-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <main className="flex-1 bg-[#101015] p-6 lg:p-10 overflow-y-auto">
          
          {/* TAB 1: TEXTS & BUTTONS */}
          {activeTab === 'texts' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black uppercase text-white mb-1">
                    تعديل نصوص وأزرار واجهة المتجر
                  </h2>
                  <p className="text-xs text-gray-400">
                    يمكنك تعديل أي نص أو زر، وستنعكس التعديلات لحظياً في الواجهة باللغتين العربية والإنجليزية.
                  </p>
                </div>

                {/* Sub-toggle for Language editing */}
                <div className="flex items-center gap-2 bg-neutral-900 p-1 border border-white/15 rounded">
                  <span className="text-[11px] text-gray-400 px-2 flex items-center gap-1">
                    <Globe size={13} />
                    <span>لغة التعديل:</span>
                  </span>
                  <button
                    onClick={() => setTextLangTab('ar')}
                    className={`px-3 py-1 text-xs font-bold rounded ${
                      textLangTab === 'ar' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    العربية (AR)
                  </button>
                  <button
                    onClick={() => setTextLangTab('en')}
                    className={`px-3 py-1 text-xs font-bold rounded ${
                      textLangTab === 'en' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>

              {/* 1. Announcement Bar */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>1. شريط الإعلانات العلوي (Announcement Bar)</span>
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={siteContent.announcement?.enabled}
                      onChange={(e) => updateContent('announcement.enabled', e.target.checked)}
                      className="accent-white"
                    />
                    <span>إظهار في الموقع</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      نص الإعلان ({textLangTab === 'ar' ? 'بالعربية' : 'English'}):
                    </label>
                    <input 
                      type="text"
                      value={textLangTab === 'ar' ? (siteContent.announcement?.text_ar || '') : (siteContent.announcement?.text_en || '')}
                      onChange={(e) => updateContent(textLangTab === 'ar' ? 'announcement.text_ar' : 'announcement.text_en', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">رابط توجيه الإعلان:</label>
                    <input 
                      type="text"
                      value={siteContent.announcement?.link || ''}
                      onChange={(e) => updateContent('announcement.link', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Brand & Logo */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>2. هوية البراند واللوجو (Brand & Logo)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">اسم البراند:</label>
                    <input 
                      type="text"
                      value={siteContent.brand?.name || 'KESWA'}
                      onChange={(e) => updateContent('brand.name', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      الشعار اللفظي ({textLangTab === 'ar' ? 'بالعربية' : 'English'}):
                    </label>
                    <input 
                      type="text"
                      value={textLangTab === 'ar' ? (siteContent.brand?.tagline_ar || '') : (siteContent.brand?.tagline_en || '')}
                      onChange={(e) => updateContent(textLangTab === 'ar' ? 'brand.tagline_ar' : 'brand.tagline_en', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-2">طريقة عرض لوجو KESWA:</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-xs text-white cursor-pointer bg-neutral-900 p-2.5 border border-white/10 rounded">
                        <input 
                          type="radio"
                          name="logoStyle"
                          value="metallic"
                          checked={siteContent.brand?.logoStyle !== 'badge'}
                          onChange={() => updateContent('brand.logoStyle', 'metallic')}
                          className="accent-white"
                        />
                        <span>فيكتور كروم معدني مشطوب فائق الدقة (Metallic Vector - مستحسن)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-white cursor-pointer bg-neutral-900 p-2.5 border border-white/10 rounded">
                        <input 
                          type="radio"
                          name="logoStyle"
                          value="badge"
                          checked={siteContent.brand?.logoStyle === 'badge'}
                          onChange={() => updateContent('brand.logoStyle', 'badge')}
                          className="accent-white"
                        />
                        <span>صورة الشعار الأصلية بالخلفية الحجرية الداكنة (Original Badge)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Section Headers & View All Buttons */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>3. عناوين أقسام المنتجات وأزرار "عرض الكل" ({textLangTab === 'ar' ? 'العربية' : 'English'})</span>
                </h3>

                {/* Hoodies Section Header */}
                <div className="p-3 bg-neutral-900/80 border border-white/5 rounded space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">قسم الهوديز (Hoodies):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text"
                      placeholder="عنوان القسم"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.hoodies?.title_ar || '') : (siteContent.sectionHeaders?.hoodies?.title_en || '')}
                      onChange={(e) => updateSectionHeader('hoodies', textLangTab === 'ar' ? { title_ar: e.target.value } : { title_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="العنوان الفرعي"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.hoodies?.subtitle_ar || '') : (siteContent.sectionHeaders?.hoodies?.subtitle_en || '')}
                      onChange={(e) => updateSectionHeader('hoodies', textLangTab === 'ar' ? { subtitle_ar: e.target.value } : { subtitle_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="نص زر عرض الكل"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.hoodies?.viewAllText_ar || '') : (siteContent.sectionHeaders?.hoodies?.viewAllText_en || '')}
                      onChange={(e) => updateSectionHeader('hoodies', textLangTab === 'ar' ? { viewAllText_ar: e.target.value } : { viewAllText_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded font-bold"
                    />
                  </div>
                </div>

                {/* T-Shirts Section Header */}
                <div className="p-3 bg-neutral-900/80 border border-white/5 rounded space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">قسم التيشرتات (T-Shirts):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text"
                      placeholder="عنوان القسم"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.tshirts?.title_ar || '') : (siteContent.sectionHeaders?.tshirts?.title_en || '')}
                      onChange={(e) => updateSectionHeader('tshirts', textLangTab === 'ar' ? { title_ar: e.target.value } : { title_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="العنوان الفرعي"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.tshirts?.subtitle_ar || '') : (siteContent.sectionHeaders?.tshirts?.subtitle_en || '')}
                      onChange={(e) => updateSectionHeader('tshirts', textLangTab === 'ar' ? { subtitle_ar: e.target.value } : { subtitle_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="نص زر عرض الكل"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.tshirts?.viewAllText_ar || '') : (siteContent.sectionHeaders?.tshirts?.viewAllText_en || '')}
                      onChange={(e) => updateSectionHeader('tshirts', textLangTab === 'ar' ? { viewAllText_ar: e.target.value } : { viewAllText_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded font-bold"
                    />
                  </div>
                </div>

                {/* Sweatpants Section Header */}
                <div className="p-3 bg-neutral-900/80 border border-white/5 rounded space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">قسم السويت بانتس (Sweatpants):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text"
                      placeholder="عنوان القسم"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.sweatpants?.title_ar || '') : (siteContent.sectionHeaders?.sweatpants?.title_en || '')}
                      onChange={(e) => updateSectionHeader('sweatpants', textLangTab === 'ar' ? { title_ar: e.target.value } : { title_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="العنوان الفرعي"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.sweatpants?.subtitle_ar || '') : (siteContent.sectionHeaders?.sweatpants?.subtitle_en || '')}
                      onChange={(e) => updateSectionHeader('sweatpants', textLangTab === 'ar' ? { subtitle_ar: e.target.value } : { subtitle_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="نص زر عرض الكل"
                      value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.sweatpants?.viewAllText_ar || '') : (siteContent.sectionHeaders?.sweatpants?.viewAllText_en || '')}
                      onChange={(e) => updateSectionHeader('sweatpants', textLangTab === 'ar' ? { viewAllText_ar: e.target.value } : { viewAllText_en: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded font-bold"
                    />
                  </div>
                </div>

              </div>

              {/* 4. Footer & Contact Info */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>4. نصوص الفوتر وبيانات الاتصال ({textLangTab === 'ar' ? 'العربية' : 'English'})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">نبذة عن البراند في الفوتر:</label>
                    <textarea 
                      rows={2}
                      value={textLangTab === 'ar' ? (siteContent.footer?.about_ar || '') : (siteContent.footer?.about_en || '')}
                      onChange={(e) => updateContent(textLangTab === 'ar' ? 'footer.about_ar' : 'footer.about_en', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">رقم الهاتف:</label>
                    <input 
                      type="text"
                      value={siteContent.footer?.phone || ''}
                      onChange={(e) => updateContent('footer.phone', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">البريد الإلكتروني:</label>
                    <input 
                      type="email"
                      value={siteContent.footer?.email || ''}
                      onChange={(e) => updateContent('footer.email', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">حقوق الملكية:</label>
                    <input 
                      type="text"
                      value={textLangTab === 'ar' ? (siteContent.footer?.copyright_ar || '') : (siteContent.footer?.copyright_en || '')}
                      onChange={(e) => updateContent(textLangTab === 'ar' ? 'footer.copyright_ar' : 'footer.copyright_en', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white mb-1">
                    إدارة منتجات المتجر ({products.length} منتج متوفر)
                  </h2>
                  <p className="text-xs text-gray-400">
                    يمكنك إضافة منتج جديد، تعديل الأسعار، تغيير الصور، إضافة ألوان ومقاسات، وحذف أي منتج.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-white hover:bg-neutral-200 text-black font-black text-xs px-5 py-2.5 rounded flex items-center gap-2 transition-all shadow-lg self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-[#16161f] border border-white/10 rounded overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-neutral-900 border-b border-white/10 text-gray-400 font-sans">
                      <tr>
                        <th className="p-3.5">المنتج</th>
                        <th className="p-3.5">القسم</th>
                        <th className="p-3.5">السعر الحالي</th>
                        <th className="p-3.5">السعر القديم</th>
                        <th className="p-3.5">البادج</th>
                        <th className="p-3.5">المقاسات المتاحة</th>
                        <th className="p-3.5 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover rounded shrink-0 border border-white/10" />
                            <div>
                              <span className="font-bold text-white block">{p.name_ar || p.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{p.name_en || p.name}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-gray-300">
                            {p.category === 'hoodies' ? 'هوديز' : p.category === 'tshirts' ? 'تيشرتات' : 'سويت بانتس'}
                          </td>
                          <td className="p-3.5 font-bold text-white font-mono">{p.price} ج.م</td>
                          <td className="p-3.5 text-gray-500 line-through font-mono">
                            {p.oldPrice ? `${p.oldPrice} ج.م` : '-'}
                          </td>
                          <td className="p-3.5">
                            {(p.badge_ar || p.badge) && (
                              <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold rounded">
                                {p.badge_ar || p.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-gray-400 font-mono">
                            {p.sizes?.join(', ')}
                          </td>
                          <td className="p-3.5 text-center space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-gray-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                              title="تعديل المنتج"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف المنتج "${p.name_ar || p.name}"؟`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors"
                              title="حذف المنتج"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANNERS & SECTIONS */}
          {activeTab === 'banners' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-white mb-1">
                  إدارة البنرات والعروض الترويجية
                </h2>
                <p className="text-xs text-gray-400">
                  يمكنك تفعيل أو إخفاء أي بنر وتعديل النصوص والصور وتاريخ العداد التنازلي.
                </p>
              </div>

              {/* Banner 1: Hoodies */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>بنر الهوديز الرئيسي في أول الصفحة (Hero Hoodies)</span>
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={siteContent.banners?.heroHoodies?.enabled}
                      onChange={(e) => updateBanner('heroHoodies', { enabled: e.target.checked })}
                      className="accent-white"
                    />
                    <span>تفعيل البنر</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">العنوان بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.title_ar || ''}
                      onChange={(e) => updateBanner('heroHoodies', { title_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">العنوان بالإنجليزية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.title_en || ''}
                      onChange={(e) => updateBanner('heroHoodies', { title_en: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نص الزر بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.buttonText_ar || ''}
                      onChange={(e) => updateBanner('heroHoodies', { buttonText_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نص الزر بالإنجليزية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.buttonText_en || ''}
                      onChange={(e) => updateBanner('heroHoodies', { buttonText_en: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">رابط صورة البنر (Image URL):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.image || ''}
                      onChange={(e) => updateBanner('heroHoodies', { image: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Banner 2: T-Shirts */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>بنر التيشرتات الصيفي (Hero T-Shirts)</span>
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={siteContent.banners?.heroTshirts?.enabled}
                      onChange={(e) => updateBanner('heroTshirts', { enabled: e.target.checked })}
                      className="accent-white"
                    />
                    <span>تفعيل البنر</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">العنوان بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroTshirts?.title_ar || ''}
                      onChange={(e) => updateBanner('heroTshirts', { title_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نص الزر بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroTshirts?.buttonText_ar || ''}
                      onChange={(e) => updateBanner('heroTshirts', { buttonText_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">رابط صورة البنر (Image URL):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroTshirts?.image || ''}
                      onChange={(e) => updateBanner('heroTshirts', { image: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Banner 3: Sweatpants */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>بنر السويت بانتس الحضري (Hero Sweatpants)</span>
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={siteContent.banners?.heroSweatpants?.enabled}
                      onChange={(e) => updateBanner('heroSweatpants', { enabled: e.target.checked })}
                      className="accent-white"
                    />
                    <span>تفعيل البنر</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">العنوان بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroSweatpants?.title_ar || ''}
                      onChange={(e) => updateBanner('heroSweatpants', { title_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نص الزر بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroSweatpants?.buttonText_ar || ''}
                      onChange={(e) => updateBanner('heroSweatpants', { buttonText_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">رابط صورة البنر (Image URL):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroSweatpants?.image || ''}
                      onChange={(e) => updateBanner('heroSweatpants', { image: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Banner 4: Super Sale & Live Countdown */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>بنر الخصم الكبير والعداد التنازلي التفاعلي (Super Sale)</span>
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={siteContent.banners?.superSale?.enabled}
                      onChange={(e) => updateBanner('superSale', { enabled: e.target.checked })}
                      className="accent-white"
                    />
                    <span>تفعيل قسم الخصم</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">عنوان الخصم بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.superSale?.title_ar || ''}
                      onChange={(e) => updateBanner('superSale', { title_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">نص الزر بالعربية:</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.superSale?.buttonText_ar || ''}
                      onChange={(e) => updateBanner('superSale', { buttonText_ar: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">تاريخ ووقت انتهاء العداد التنازلي (العد الفوري):</label>
                    <input 
                      type="datetime-local"
                      value={siteContent.banners?.superSale?.targetDate ? siteContent.banners.superSale.targetDate.slice(0, 16) : ''}
                      onChange={(e) => updateBanner('superSale', { targetDate: new Date(e.target.value).toISOString() })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white mb-1">
                  إدارة طلبات العملاء المكتملة ({orders.length} طلب)
                </h2>
                <p className="text-xs text-gray-400">
                  متابعة وتحديث حالات الشحن والتوصيل للطلبات الواردة من المتجر.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-[#16161f] border border-white/10 p-12 text-center rounded">
                  <ShoppingBag size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-sm font-bold text-gray-300">لا توجد طلبات مسجلة حالياً</p>
                  <p className="text-xs text-gray-500 mt-1">عندما يقوم العميل بإتمام طلب شراء من المتجر سيظهر هنا فوراً!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-base">#{order.id}</span>
                            <span className="text-[11px] font-mono text-gray-400 bg-neutral-900 px-2 py-0.5 rounded">
                              {new Date(order.date).toLocaleDateString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            العميل: <strong className="text-white">{order.customer?.name}</strong> • الهاتف: <strong className="text-white font-mono">{order.customer?.phone}</strong>
                          </div>
                        </div>

                        {/* Order Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">حالة الطلب:</span>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded outline-none border cursor-pointer ${
                              order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                              order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                              order.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                              order.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                              'bg-neutral-800 text-gray-200 border-white/20'
                            }`}
                          >
                            <option value="Pending">قيد المراجعة (Pending)</option>
                            <option value="Processing">جاري التجهيز (Processing)</option>
                            <option value="Shipped">تم الشحن (Shipped)</option>
                            <option value="Delivered">تم التوصيل بنجاح (Delivered)</option>
                            <option value="Cancelled">ملغي (Cancelled)</option>
                          </select>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-neutral-900/70 p-3 rounded space-y-1.5">
                          <p className="text-gray-400">عنوان التوصيل:</p>
                          <p className="text-white font-bold">{order.customer?.address}، {order.customer?.city}</p>
                          {order.customer?.notes && (
                            <p className="text-amber-300 text-[11px]">ملاحظات: {order.customer.notes}</p>
                          )}
                          <p className="text-gray-400 pt-1">طريقة الدفع: <span className="text-white font-bold">{order.paymentMethod}</span></p>
                        </div>

                        <div className="bg-neutral-900/70 p-3 rounded space-y-2">
                          <p className="text-gray-400">المنتجات المطلوبة:</p>
                          <div className="space-y-1">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-gray-300">
                                <span>{item.quantity}x {item.name_ar || item.name} ({item.size})</span>
                                <span className="font-bold text-white font-mono">{item.price * item.quantity} ج.م</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-white/10 pt-1.5 flex justify-between font-bold text-white">
                            <span>الإجمالي الكلي:</span>
                            <span className="text-emerald-400 text-sm font-mono">{order.total} ج.م</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white mb-1">
                  إعدادات المتجر والنسخ الاحتياطي
                </h2>
                <p className="text-xs text-gray-400">
                  تعديل تكاليف الشحن وتصدير واستيراد بيانات الموقع بالكامل.
                </p>
              </div>

              {/* Shipping & Currency */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  الشحن والعملة
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">تكلفة الشحن الافتراضية (بالجنيه):</label>
                    <input 
                      type="number"
                      value={siteContent.general?.shippingCost || 50}
                      onChange={(e) => updateContent('general.shippingCost', Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">الحد الأدنى للشحن المجاني (بالجنيه):</label>
                    <input 
                      type="number"
                      value={siteContent.general?.freeShippingThreshold || 1500}
                      onChange={(e) => updateContent('general.freeShippingThreshold', Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Backup & Restore */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  النسخ الاحتياطي واستيراد البيانات (Backup & Restore)
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  يمكنك تحميل نسخة كاملة من كافة المنتجات والطلبات والتعديلات التي أجريتها كملف JSON آمن، واستعادته في أي وقت بنقرة واحدة.
                </p>
                
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={exportData}
                    className="bg-white hover:bg-neutral-200 text-black font-black text-xs px-5 py-3 rounded flex items-center gap-2 transition-all shadow-md"
                  >
                    <Download size={16} />
                    <span>تحميل نسخة احتياطية (تصدير JSON)</span>
                  </button>

                  <label className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-5 py-3 rounded flex items-center gap-2 transition-all cursor-pointer border border-white/10 shadow-md">
                    <Upload size={16} />
                    <span>استيراد ملف نسخة احتياطية (JSON)</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleFileImport}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Reset Store */}
              <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded space-y-3">
                <h3 className="text-sm font-bold text-rose-400">
                  إعادة ضبط المصنع (Factory Reset)
                </h3>
                <p className="text-xs text-gray-400">
                  سيقوم هذا الخيار بإعادة كافة إعدادات الموقع ونصوصه ومنتجاته للبيانات الافتراضية الأصلية ومسح التعديلات المحلية.
                </p>
                <button
                  onClick={resetToDefaultData}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>تأكيد إعادة ضبط المصنع</span>
                </button>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#14141c] border border-white/20 rounded p-6 shadow-2xl my-8 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <h3 className="font-display font-black text-lg text-white">
                {editingProductId ? "تعديل بيانات المنتج" : "إضافة منتج جديد للمتجر"}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">اسم المنتج بالعربية *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: هودي أسود ثقيل"
                    value={productForm.name_ar}
                    onChange={(e) => setProductForm({ ...productForm, name_ar: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">اسم المنتج بالإنجليزية (اختياري)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Heavy Black Hoodie"
                    value={productForm.name_en}
                    onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">القسم *</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  >
                    <option value="hoodies">هوديز (Hoodies)</option>
                    <option value="tshirts">تيشرتات (T-Shirts)</option>
                    <option value="sweatpants">سويت بانتس (Sweatpants)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">سعر البيع (ج.م) *</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">السعر القديم قبل الخصم</label>
                  <input 
                    type="number" 
                    placeholder="مثال: 1200"
                    value={productForm.oldPrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value ? Number(e.target.value) : '' })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">بادج العرض (مثال: خصم -20% / جديد)</label>
                  <input 
                    type="text" 
                    placeholder="خصم -20%"
                    value={productForm.badge_ar}
                    onChange={(e) => setProductForm({ ...productForm, badge_ar: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">رابط الصورة الرئيسية *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://..."
                    value={productForm.images?.[0] || ''}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block text-gray-300 mb-2">المقاسات المتاحة:</label>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                    const isSelected = productForm.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 rounded font-mono font-bold text-xs border transition-all ${
                          isSelected ? 'bg-white text-black border-white' : 'bg-neutral-900 text-gray-400 border-white/10'
                        }`}
                      >
                        {size} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-1">وصف المنتج:</label>
                <textarea 
                  rows={2}
                  value={productForm.description_ar}
                  onChange={(e) => setProductForm({ ...productForm, description_ar: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-gray-300 hover:text-white rounded"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white hover:bg-neutral-200 text-black font-black rounded transition-colors shadow-lg"
                >
                  {editingProductId ? "حفظ التعديلات" : "إضافة المنتج للمتجر"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
