import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ImageUploader } from './ImageUploader';
import { InvoiceModal } from './InvoiceModal';
import { 
  X, Save, Plus, Trash2, Edit2, Package, Layout, ShoppingBag, 
  Settings, Download, Upload, RotateCcw, Eye, Check, AlertCircle, 
  Sparkles, Sliders, CheckCircle2, ChevronRight, Globe, Image as ImageIcon,
  Phone, MessageSquare, ToggleLeft, ToggleRight, Search, RefreshCw, Printer,
  FileSpreadsheet, FolderPlus, Layers, DollarSign, Clock, CheckCircle
} from 'lucide-react';

export const AdminPanel = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    siteContent, 
    updateContent, 
    updateBanner,
    updateSectionHeader,
    updateImage,
    toggleSectionVisibility,
    addCategory,
    updateCategory,
    deleteCategory,
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus,
    updateOrderDetails,
    createManualOrder,
    exportOrdersCSV,
    deleteOrder,
    clearAllOrders,
    addTestOrder,
    resetToDefaultData,
    exportData,
    importData,
    showToast,
    language
  } = useStore();

  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'rows' | 'images' | 'orders' | 'products' | 'texts' | 'settings'
  const [textLangTab, setTextLangTab] = useState('ar');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Modals for Orders
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [manualOrderForm, setManualOrderForm] = useState({
    name: '',
    phone: '',
    city: 'Alexandria',
    address: '',
    notes: '',
    paymentMethod: 'الدفع عند الاستلام (COD)',
    total: 850
  });

  // Modal / Form state for Categories & Blocks
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    id: '',
    name_ar: '',
    name_en: '',
    subtitle_ar: '',
    subtitle_en: '',
    bannerImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
    badge_ar: 'تشكيلة جديدة 2026',
    badge_en: 'NEW DROP 2026',
    buttonText_ar: 'تسوق التشكيلة',
    buttonText_en: 'SHOP COLLECTION',
    showBanner: true,
    showProducts: true
  });

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
    const defaultCat = (siteContent.categories && siteContent.categories[0]?.id) || 'hoodies';
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

  // Category creation handler
  const handleSaveNewCategory = (e) => {
    e.preventDefault();
    if (!newCategoryForm.name_ar && !newCategoryForm.name_en) {
      alert("يرجى إدخال اسم القسم بالعربية أو الإنجليزية");
      return;
    }

    addCategory(newCategoryForm);
    setIsAddCategoryOpen(false);
    setNewCategoryForm({
      id: '',
      name_ar: '',
      name_en: '',
      subtitle_ar: '',
      subtitle_en: '',
      bannerImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
      badge_ar: 'تشكيلة جديدة 2026',
      badge_en: 'NEW DROP 2026',
      buttonText_ar: 'تسوق التشكيلة',
      buttonText_en: 'SHOP COLLECTION',
      showBanner: true,
      showProducts: true
    });
  };

  // Orders KPI & Filtering
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const processingCount = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'ALL' && o.status !== orderFilter) return false;
    if (orderSearchQuery) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = (o.id || '').toLowerCase().includes(q);
      const matchName = (o.customer?.name || '').toLowerCase().includes(q);
      const matchPhone = (o.customer?.phone || '').includes(q);
      const matchCity = (o.customer?.city || '').toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchCity;
    }
    return true;
  });

  const { sectionsVisibility, categories = [] } = siteContent;

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
        
        {/* Right Sidebar Tabs */}
        <aside className="w-64 bg-[#0a0a0d] border-l border-white/10 p-4 space-y-1.5 hidden md:block overflow-y-auto shrink-0">
          <div className="text-[11px] font-mono text-gray-500 px-3 py-1 uppercase tracking-wider mb-2">
            الأقسام والتحكم
          </div>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'categories' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers size={17} className={activeTab === 'categories' ? 'text-black' : 'text-purple-400'} />
              <span>الأقسام والبلوكات ({categories.length})</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'categories' ? 'rotate-180' : 'opacity-40'} />
          </button>

          <button
            onClick={() => setActiveTab('rows')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'rows' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ToggleRight size={17} className={activeTab === 'rows' ? 'text-black' : 'text-emerald-400'} />
              <span>ظهور وإخفاء الصفوف (Rows)</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'rows' ? 'rotate-180' : 'opacity-40'} />
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'images' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon size={16} className={activeTab === 'images' ? 'text-black' : 'text-cyan-400'} />
              <span>مكتبة ورفع الصور (Images)</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'images' ? 'rotate-180' : 'opacity-40'} />
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
              activeTab === 'orders' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={16} className={activeTab === 'orders' ? 'text-black' : 'text-amber-400'} />
              <span>طلبات العملاء ({orders.length})</span>
            </div>
            <ChevronRight size={14} className={activeTab === 'orders' ? 'rotate-180' : 'opacity-40'} />
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
          <div className="pt-6 border-t border-white/10 space-y-2">
            <button
              onClick={exportOrdersCSV}
              className="w-full text-right p-2.5 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded"
            >
              <FileSpreadsheet size={14} />
              <span>تصدير الطلبات للـ Excel</span>
            </button>

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
            { id: 'categories', label: 'الأقسام والبلوكات' },
            { id: 'rows', label: 'ظهور الصفوف' },
            { id: 'images', label: 'الصور والرفع' },
            { id: 'orders', label: 'الطلبات' },
            { id: 'products', label: 'المنتجات' },
            { id: 'texts', label: 'النصوص' },
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
          
          {/* TAB 0: CATEGORIES & BLOCKS (إدارة وتعديل الأقسام وإضافة بلوكات جديدة) */}
          {activeTab === 'categories' && (
            <div className="max-w-5xl space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    <Layers size={22} className="text-purple-400" />
                    <span>إدارة وتعديل أقسام وبلوكات المتجر (Categories & Blocks)</span>
                  </h2>
                  <p className="text-xs text-gray-400">
                    يمكنك تعديل مسميات الأقسام الحالية وعناوينها وصور البنرات، أو إضافة بلوك وقسم جديد بالكامل للواجهة.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCategoryOpen(!isAddCategoryOpen)}
                  className="bg-white hover:bg-neutral-200 text-black font-black text-xs px-5 py-2.5 rounded flex items-center gap-2 transition-all shadow-lg self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>{isAddCategoryOpen ? 'إلغاء الإضافة' : 'إضافة قسم / بلوك جديد'}</span>
                </button>
              </div>

              {/* Form to Add New Category Block */}
              {isAddCategoryOpen && (
                <div className="bg-[#181824] border-2 border-purple-500/40 p-6 rounded-lg space-y-4 shadow-2xl animate-fadeIn">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <FolderPlus size={18} className="text-purple-400" />
                      <span>إضافة بلوك وقسم جديد للواجهة</span>
                    </h3>
                    <span className="text-[11px] text-purple-300 font-mono bg-purple-500/10 px-2.5 py-0.5 rounded">
                      سيظهر تلقائياً في الواجهة والنافبار
                    </span>
                  </div>

                  <form onSubmit={handleSaveNewCategory} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">اسم القسم بالعربية *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="مثال: جاكيتات ومعاطف"
                          value={newCategoryForm.name_ar}
                          onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name_ar: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">اسم القسم بالإنجليزية *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. JACKETS & COATS"
                          value={newCategoryForm.name_en}
                          onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name_en: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">الوصف الفرعي بالعربية (Subtitle):</label>
                        <input 
                          type="text" 
                          placeholder="تشكيلة الجاكيتات البامب الفاخرة للدفء والأناقة"
                          value={newCategoryForm.subtitle_ar}
                          onChange={(e) => setNewCategoryForm({ ...newCategoryForm, subtitle_ar: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">الوصف بالإنجليزية:</label>
                        <input 
                          type="text" 
                          placeholder="Premium heavyweight puffer & denim outerwear"
                          value={newCategoryForm.subtitle_en}
                          onChange={(e) => setNewCategoryForm({ ...newCategoryForm, subtitle_en: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    {/* Banner Image Uploader */}
                    <div>
                      <ImageUploader 
                        value={newCategoryForm.bannerImage}
                        onChange={(url) => setNewCategoryForm({ ...newCategoryForm, bannerImage: url })}
                        label="صورة بنر القسم الجديد (رفع من جهازك أو رابط):"
                        description="ستظهر في البنر السينمائي العريض المخصص للقسم في الصفحة"
                        previewHeight="h-40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">نص البادج (العربية):</label>
                        <input 
                          type="text" 
                          value={newCategoryForm.badge_ar}
                          onChange={(e) => setNewCategoryForm({ ...newCategoryForm, badge_ar: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1">نص زر الشراء (العربية):</label>
                        <input 
                          type="text" 
                          value={newCategoryForm.buttonText_ar}
                          onChange={(e) => setNewCategoryForm({ ...newCategoryForm, buttonText_ar: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsAddCategoryOpen(false)}
                        className="px-4 py-2 bg-neutral-800 text-gray-300 hover:text-white rounded"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded transition-colors shadow-lg"
                      >
                        حفظ وإضافة البلوك للواجهة
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* List of Existing Categories for In-Place Editing */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                  <span>الأقسام والبلوكات الحالية في المتجر ({categories.length} أقسام):</span>
                </h3>

                <div className="space-y-6">
                  {categories.map((cat, idx) => (
                    <div key={cat.id} className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-base font-black text-white">{cat.name_ar} ({cat.name_en})</h4>
                            <span className="text-[10px] font-mono text-gray-400">معرّف القسم: #{cat.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!cat.isCore && (
                            <button
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف قسم "${cat.name_ar}" من المتجر؟`)) {
                                  deleteCategory(cat.id);
                                }
                              }}
                              className="text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-xs px-3 py-1.5 rounded flex items-center gap-1 border border-rose-500/20 transition-colors"
                            >
                              <Trash2 size={13} />
                              <span>حذف القسم</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inputs to edit category details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-gray-400 mb-1">الاسم بالعربية:</label>
                          <input 
                            type="text"
                            defaultValue={cat.name_ar}
                            onBlur={(e) => updateCategory(cat.id, { name_ar: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 mb-1">الاسم بالإنجليزية:</label>
                          <input 
                            type="text"
                            defaultValue={cat.name_en}
                            onBlur={(e) => updateCategory(cat.id, { name_en: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono outline-none focus:border-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-gray-400 mb-1">الوصف بالعربية:</label>
                          <input 
                            type="text"
                            defaultValue={cat.subtitle_ar || ''}
                            onBlur={(e) => updateCategory(cat.id, { subtitle_ar: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 mb-1">نص البادج (العربية):</label>
                          <input 
                            type="text"
                            defaultValue={cat.badge_ar || ''}
                            onBlur={(e) => updateCategory(cat.id, { badge_ar: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 mb-1">نص زر الشراء (العربية):</label>
                          <input 
                            type="text"
                            defaultValue={cat.buttonText_ar || ''}
                            onBlur={(e) => updateCategory(cat.id, { buttonText_ar: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
                          />
                        </div>
                      </div>

                      {/* Banner Image with ImageUploader */}
                      <div>
                        <ImageUploader 
                          value={cat.bannerImage || ''}
                          onChange={(url) => updateCategory(cat.id, { bannerImage: url })}
                          label={`صورة بنر قسم ${cat.name_ar} (رفع أو رابط):`}
                          description="الصورة السينمائية المعروضة كخلفية لقسم هذا التصنيف في المتجر"
                          previewHeight="h-36"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ROWS VISIBILITY (التحكم في ظهور وإخفاء كل صف) */}
          {activeTab === 'rows' && (
            <div className="max-w-4xl space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                  <ToggleRight size={22} className="text-emerald-400" />
                  <span>التحكم في ظهور وإخفاء صفوف وأقسام الموقع (Rows Visibility)</span>
                </h2>
                <p className="text-xs text-gray-400">
                  يمكنك تفعيل أو إخفاء أي صف (ROW) في واجهة المتجر بنقرة واحدة وتنعكس التغييرات فوراً.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'announcement', name: 'شريط الإعلانات العلوي', desc: 'شريط الكوبون والشحن المجاني أعلى الصفحة' },
                  { key: 'heroHoodies', name: 'بنر الهوديز الرئيسي الأول', desc: 'البنر العريض للهوديز مع زر Shop Collection' },
                  { key: 'categoryGrid', name: 'شبكة الفئات الثلاثية (3 كروت)', desc: 'الكروت البارزة للهوديز وبولو تيز والسويت بانتس' },
                  { key: 'hoodiesProducts', name: 'صف منتجات الهوديز', desc: 'شبكة عرض منتجات الهوديز مع الأسعار والألوان' },
                  { key: 'heroTshirts', name: 'بنر التيشرتات الصيفي السينمائي', desc: 'بنر تيشيرت بوسطن مع خلفية المدينة الساحلية' },
                  { key: 'tshirtsProducts', name: 'صف منتجات التيشرتات', desc: 'شبكة منتجات التيشرتات البولو والكامو والوافل' },
                  { key: 'heroSweatpants', name: 'بنر السويت بانتس الحضري', desc: 'بنر السويت بانتس الرمادي الواسع بجوار الجدار' },
                  { key: 'sweatpantsProducts', name: 'صف منتجات السويت بانتس', desc: 'شبكة منتجات بناطيل الفليس والكارجو' },
                  { key: 'superSale', name: 'قسم الخصم الكبير والعداد التنازلي', desc: 'خصم 40% مع عداد الثواني والدقائق التفاعلي' },
                  { key: 'newsletter', name: 'قسم النادي البريدي (Newsletter)', desc: 'صندوق الاشتراك بالبريد وكوبون 10% خصم' },
                  { key: 'footer', name: 'الفوتر الكامل أسفل الموقع', desc: 'بيانات التواصل وروابط الفئات وحقوق النشر' }
                ].map(row => {
                  const isShown = sectionsVisibility?.[row.key] !== false;
                  return (
                    <div 
                      key={row.key}
                      onClick={() => toggleSectionVisibility(row.key)}
                      className={`p-4 rounded border transition-all cursor-pointer flex items-center justify-between select-none ${
                        isShown 
                          ? 'bg-[#181822] border-emerald-500/30 hover:border-emerald-500' 
                          : 'bg-[#121217] border-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isShown ? 'bg-emerald-400' : 'bg-neutral-600'}`}></span>
                          <span>{row.name}</span>
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-1">{row.desc}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 mr-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isShown ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {isShown ? 'ظاهر ✓' : 'مخفي ✕'}
                        </span>
                        {isShown ? (
                          <ToggleRight size={26} className="text-emerald-400" />
                        ) : (
                          <ToggleLeft size={26} className="text-neutral-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: IMAGES MANAGER WITH FILE UPLOAD (مكتبة ورفع كافة الصور) */}
          {activeTab === 'images' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                  <ImageIcon size={22} className="text-cyan-400" />
                  <span>مكتبة ورفع كافة صور المتجر (Images Manager & Upload)</span>
                </h2>
                <p className="text-xs text-gray-400">
                  يمكنك رفع صورك الخاصة مباشرة من الكمبيوتر أو الهاتف، أو إدخال روابط خارجية ومعاينتها فورياً.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'شعار البراند (Logo Image)',
                    path: 'brand.logoImage',
                    current: siteContent.brand?.logoImage || '/assets/keswa-logo.jpg',
                    desc: 'الصورة الأصلية للشعار بالخلفية الحجرية الداكنة'
                  },
                  {
                    title: 'صورة بنر الهوديز الرئيسي (Hero Hoodies)',
                    path: 'banners.heroHoodies.image',
                    current: siteContent.banners?.heroHoodies?.image,
                    desc: 'صورة خلفية البنر الأول للهوديز الأوفرسايز'
                  },
                  {
                    title: 'كارت شبكة الفئات 1: هوديز أوفرسايز',
                    path: 'banners.categoryGrid.card1.image',
                    current: siteContent.banners?.categoryGrid?.card1?.image,
                    desc: 'الكارت الكبير الأيمن في شبكة الفئات الثلاثية'
                  },
                  {
                    title: 'كارت شبكة الفئات 2: تيشرتات بولو',
                    path: 'banners.categoryGrid.card2.image',
                    current: siteContent.banners?.categoryGrid?.card2?.image,
                    desc: 'الكارت العلوي الأيسر في شبكة الفئات'
                  },
                  {
                    title: 'كارت شبكة الفئات 3: سويت بانتس باجي',
                    path: 'banners.categoryGrid.card3.image',
                    current: siteContent.banners?.categoryGrid?.card3?.image,
                    desc: 'الكارت السفلي الأيسر لملمس قماش الفليس'
                  },
                  {
                    title: 'صورة بنر التيشرتات الصيفي (Hero T-Shirts)',
                    path: 'banners.heroTshirts.image',
                    current: siteContent.banners?.heroTshirts?.image,
                    desc: 'صورة بنر التيشيرتات بنظارة شمسية وشاطئ'
                  },
                  {
                    title: 'صورة بنر السويت بانتس الحضري (Hero Sweatpants)',
                    path: 'banners.heroSweatpants.image',
                    current: siteContent.banners?.heroSweatpants?.image,
                    desc: 'صورة بنر البنطلون الرمادي الباجي'
                  },
                  {
                    title: 'صورة خلفية الخصم الكبير (Super Sale Background)',
                    path: 'banners.superSale.image',
                    current: siteContent.banners?.superSale?.image,
                    desc: 'خلفية قسم الخصم الكبير 40% والعداد التنازلي'
                  }
                ].map(item => (
                  <div key={item.path} className="space-y-2">
                    <ImageUploader 
                      value={item.current || ''}
                      onChange={(newUrl) => updateImage(item.path, newUrl)}
                      label={item.title}
                      description={item.desc}
                      previewHeight="h-40"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT (إدارة وتصليح طلبات العملاء الشاملة) */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    <ShoppingBag size={22} className="text-amber-400" />
                    <span>إدارة طلبات العملاء ({orders.length} طلب مسجل)</span>
                  </h2>
                  <p className="text-xs text-gray-400">
                    متابعة الطلبات، طباعة بوالص الشحن والفواتير، مراسلة العملاء بالواتساب، وتحديث الحالات.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsManualOrderOpen(true)}
                    className="bg-white hover:bg-neutral-200 text-black text-xs font-black px-3.5 py-2 rounded flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus size={14} />
                    <span>إضافة طلب يدوي</span>
                  </button>

                  <button
                    onClick={addTestOrder}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} />
                    <span>طلب تجريبي</span>
                  </button>

                  <button
                    onClick={exportOrdersCSV}
                    className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-white/10 text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors"
                    title="تصدير ملف إكسل CSV"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-400" />
                    <span>تصدير Excel</span>
                  </button>

                  {orders.length > 0 && (
                    <button
                      onClick={clearAllOrders}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>مسح الكل</span>
                    </button>
                  )}
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#16161f] p-3.5 rounded border border-white/10">
                  <span className="text-[11px] text-gray-400 block mb-1">إجمالي المبيعات</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{totalRevenue.toLocaleString()} ج.م</span>
                </div>
                <div className="bg-[#16161f] p-3.5 rounded border border-white/10">
                  <span className="text-[11px] text-gray-400 block mb-1">طلبات قيد المراجعة</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{pendingCount}</span>
                </div>
                <div className="bg-[#16161f] p-3.5 rounded border border-white/10">
                  <span className="text-[11px] text-gray-400 block mb-1">جاري الشحن والتجهيز</span>
                  <span className="text-xl font-black text-blue-400 font-mono">{processingCount}</span>
                </div>
                <div className="bg-[#16161f] p-3.5 rounded border border-white/10">
                  <span className="text-[11px] text-gray-400 block mb-1">طلبات مكتملة التوصيل</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{deliveredCount}</span>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#16161f] p-3 rounded border border-white/10">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute top-3 right-3 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="ابحث برقم الطلب، اسم العميل، الهاتف، أو المحافظة..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 pr-9 pl-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                  />
                </div>

                {/* Status Pills with Counters */}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {[
                    { id: 'ALL', label: `الكل (${orders.length})` },
                    { id: 'Pending', label: `قيد المراجعة (${pendingCount})` },
                    { id: 'Processing', label: 'جاري التجهيز' },
                    { id: 'Shipped', label: 'تم الشحن' },
                    { id: 'Delivered', label: `مكتمل (${deliveredCount})` },
                    { id: 'Cancelled', label: 'ملغي' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setOrderFilter(f.id)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        orderFilter === f.id ? 'bg-white text-black font-bold' : 'bg-neutral-900 text-gray-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-[#16161f] border border-white/10 p-12 text-center rounded">
                  <ShoppingBag size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-sm font-bold text-gray-300">لا توجد طلبات تطابق بحثك حالياً</p>
                  <p className="text-xs text-gray-500 mt-1">اضغط على زر "إضافة طلب تجريبي" أو "إضافة طلب يدوي" بالأعلى للتجربة الفورية!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-base">#{order.id}</span>
                            <span className="text-[11px] font-mono text-gray-400 bg-neutral-900 px-2 py-0.5 rounded">
                              {new Date(order.date || Date.now()).toLocaleDateString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            العميل: <strong className="text-white">{order.customer?.name}</strong> • الهاتف: <strong className="text-white font-mono">{order.customer?.phone}</strong>
                          </div>
                        </div>

                        {/* Status Switcher & Contact Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          
                          {/* Print Invoice Button */}
                          <button
                            onClick={() => {
                              setSelectedInvoiceOrder(order);
                              setIsInvoiceOpen(true);
                            }}
                            className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors border border-white/10"
                            title="طباعة الفاتورة وبوليصة الشحن"
                          >
                            <Printer size={13} className="text-amber-400" />
                            <span>الفاتورة</span>
                          </button>

                          {/* Edit Order Button */}
                          <button
                            onClick={() => {
                              setEditingOrder(order);
                              setIsEditOrderOpen(true);
                            }}
                            className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors border border-white/10"
                            title="تعديل بيانات الطلب"
                          >
                            <Edit2 size={13} className="text-cyan-400" />
                            <span>تعديل</span>
                          </button>

                          {/* WhatsApp Chat Shortcut */}
                          {order.customer?.phone && (
                            <a
                              href={`https://wa.me/2${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${order.customer.name}، بخصوص طلبك رقم ${order.id} من متجر KESWA WEAR`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors shadow"
                              title="مراسلة واتساب"
                            >
                              <MessageSquare size={13} />
                              <span>واتساب</span>
                            </a>
                          )}

                          {/* Direct Call Shortcut */}
                          {order.customer?.phone && (
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors"
                              title="اتصال هاتفي"
                            >
                              <Phone size={13} />
                              <span>اتصال</span>
                            </a>
                          )}

                          {/* Status Dropdown with explicit dark styling */}
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
                            <option value="Pending" className="bg-neutral-900 text-white">قيد المراجعة (Pending)</option>
                            <option value="Processing" className="bg-neutral-900 text-white">جاري التجهيز (Processing)</option>
                            <option value="Shipped" className="bg-neutral-900 text-white">تم الشحن (Shipped)</option>
                            <option value="Delivered" className="bg-neutral-900 text-white">تم التوصيل بنجاح (Delivered)</option>
                            <option value="Cancelled" className="bg-neutral-900 text-white">ملغي (Cancelled)</option>
                          </select>

                          {/* Delete Order Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`حذف الطلب #${order.id} نهائياً؟`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors"
                            title="حذف الطلب"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-neutral-900/70 p-3 rounded space-y-1.5">
                          <p className="text-gray-400">عنوان التوصيل:</p>
                          <p className="text-white font-bold">{order.customer?.address}، {order.customer?.city}</p>
                          {order.customer?.notes && (
                            <p className="text-amber-300 text-[11px]">ملاحظات العميل: {order.customer.notes}</p>
                          )}
                          <p className="text-gray-400 pt-1">طريقة الدفع: <span className="text-white font-bold">{order.paymentMethod || 'الدفع عند الاستلام (COD)'}</span></p>
                        </div>

                        <div className="bg-neutral-900/70 p-3 rounded space-y-2">
                          <p className="text-gray-400">المنتجات المطلوبة ({order.items?.length || 0}):</p>
                          <div className="space-y-1.5">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-gray-300">
                                <div className="flex items-center gap-2">
                                  {item.image && (
                                    <img src={item.image} alt="" className="w-7 h-9 object-cover rounded border border-white/10 shrink-0" />
                                  )}
                                  <span>{item.quantity}x {item.name_ar || item.name} ({item.size})</span>
                                </div>
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

          {/* TAB 4: PRODUCTS MANAGEMENT */}
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
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              {p.images?.[0] ? (
                                <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded border border-white/10 shrink-0" />
                              ) : (
                                <div className="w-10 h-12 bg-neutral-800 rounded flex items-center justify-center text-gray-500 shrink-0">
                                  <ImageIcon size={16} />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-white text-xs">{p.name_ar || p.name}</p>
                                <p className="text-[11px] text-gray-400 font-mono">{p.name_en || p.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-neutral-800 text-gray-200 px-2 py-0.5 rounded text-[11px] font-mono">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-white font-mono">{p.price} ج.م</td>
                          <td className="p-3.5 text-gray-500 font-mono line-through">{p.oldPrice ? `${p.oldPrice} ج.م` : '-'}</td>
                          <td className="p-3.5">
                            {p.badge_ar ? (
                              <span className="bg-white text-black font-black text-[10px] px-2 py-0.5 rounded">
                                {p.badge_ar}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-3.5 font-mono text-gray-300">
                            {p.sizes ? p.sizes.join(', ') : 'S, M, L, XL'}
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors"
                                title="تعديل المنتج"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`هل أنت متأكد من حذف المنتج: "${p.name_ar || p.name}"؟`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded transition-colors"
                                title="حذف المنتج"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TEXTS AND BUTTONS */}
          {activeTab === 'texts' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white mb-1">
                    تعديل نصوص وأزرار واجهة المتجر
                  </h2>
                  <p className="text-xs text-gray-400">
                    يمكنك تعديل أي نص أو زر في الواجهة باللغتين العربية والإنجليزية.
                  </p>
                </div>

                {/* Sub language tabs */}
                <div className="flex items-center bg-neutral-900 border border-white/10 p-1 rounded">
                  <button
                    onClick={() => setTextLangTab('ar')}
                    className={`px-3 py-1 text-xs font-bold rounded ${
                      textLangTab === 'ar' ? 'bg-white text-black' : 'text-gray-400'
                    }`}
                  >
                    النصوص بالعربية
                  </button>
                  <button
                    onClick={() => setTextLangTab('en')}
                    className={`px-3 py-1 text-xs font-bold rounded ${
                      textLangTab === 'en' ? 'bg-white text-black' : 'text-gray-400'
                    }`}
                  >
                    English Texts
                  </button>
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  شريط الإعلانات العلوي ({textLangTab === 'ar' ? 'العربية' : 'English'})
                </h3>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">نص الإعلان:</label>
                  <input 
                    type="text" 
                    value={textLangTab === 'ar' ? (siteContent.announcement?.text_ar || '') : (siteContent.announcement?.text_en || '')}
                    onChange={(e) => updateContent(textLangTab === 'ar' ? 'announcement.text_ar' : 'announcement.text_en', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Brand Texts */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  اسم البراند والشعار اللفظي
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
                </div>
              </div>

              {/* Footer Texts */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  نصوص الفوتر وبيانات الاتصال ({textLangTab === 'ar' ? 'العربية' : 'English'})
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
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: SETTINGS & BACKUP */}
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
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
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
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                        {c.name_ar} ({c.name_en})
                      </option>
                    ))}
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

                <div className="sm:col-span-1">
                  <ImageUploader 
                    value={productForm.images?.[0] || ''}
                    onChange={(url) => setProductForm({ ...productForm, images: [url] })}
                    label="صورة المنتج (رفع من جهازك أو رابط):"
                    previewHeight="h-28"
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

      {/* MODAL: EDIT CUSTOMER ORDER */}
      {isEditOrderOpen && editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#14141c] border border-white/20 rounded p-6 shadow-2xl my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">تعديل بيانات الطلب #{editingOrder.id}</h3>
              <button onClick={() => setIsEditOrderOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                updateOrderDetails(editingOrder.id, {
                  customer: editingOrder.customer,
                  status: editingOrder.status,
                  total: editingOrder.total
                });
                setIsEditOrderOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-400 mb-1">اسم العميل:</label>
                <input 
                  type="text"
                  value={editingOrder.customer?.name || ''}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, name: e.target.value }
                  })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">رقم الهاتف:</label>
                <input 
                  type="text"
                  value={editingOrder.customer?.phone || ''}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, phone: e.target.value }
                  })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">المحافظة والعنوان التفصيلي:</label>
                <input 
                  type="text"
                  value={editingOrder.customer?.address || ''}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, address: e.target.value }
                  })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">ملاحظات خاصة:</label>
                <input 
                  type="text"
                  value={editingOrder.customer?.notes || ''}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, notes: e.target.value }
                  })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">حالة الطلب:</label>
                  <select 
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded"
                  >
                    <option value="Pending">قيد المراجعة</option>
                    <option value="Processing">جاري التجهيز</option>
                    <option value="Shipped">تم الشحن</option>
                    <option value="Delivered">تم التوصيل</option>
                    <option value="Cancelled">ملغي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">المبلغ الإجمالي (ج.م):</label>
                  <input 
                    type="number"
                    value={editingOrder.total || 0}
                    onChange={(e) => setEditingOrder({ ...editingOrder, total: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditOrderOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-gray-300 rounded"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold rounded"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL ORDER CREATION */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#14141c] border border-white/20 rounded p-6 shadow-2xl my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white">إضافة طلب عميل جديد يدوياً</h3>
              <button onClick={() => setIsManualOrderOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                createManualOrder({
                  name: manualOrderForm.name,
                  phone: manualOrderForm.phone,
                  address: manualOrderForm.address,
                  city: manualOrderForm.city,
                  notes: manualOrderForm.notes,
                  subtotal: manualOrderForm.total,
                  total: manualOrderForm.total,
                  items: [
                    {
                      id: products[0]?.id || 'p-01',
                      name: products[0]?.name_ar || 'طلب يدوي',
                      price: manualOrderForm.total,
                      quantity: 1,
                      size: 'L',
                      color: 'أسود',
                      image: products[0]?.images?.[0]
                    }
                  ]
                });
                setIsManualOrderOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-gray-400 mb-1">اسم العميل *</label>
                <input 
                  type="text"
                  required
                  placeholder="محمد أحمد"
                  value={manualOrderForm.name}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">رقم هاتف العميل *</label>
                <input 
                  type="text"
                  required
                  placeholder="01012345678"
                  value={manualOrderForm.phone}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, phone: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">المحافظة:</label>
                  <input 
                    type="text"
                    value={manualOrderForm.city}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, city: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">المبلغ الإجمالي (ج.م):</label>
                  <input 
                    type="number"
                    value={manualOrderForm.total}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, total: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">العنوان بالتفصيل:</label>
                <input 
                  type="text"
                  required
                  placeholder="شارع الجمهورية، عمارة 15"
                  value={manualOrderForm.address}
                  onChange={(e) => setManualOrderForm({ ...manualOrderForm, address: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-gray-300 rounded"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded"
                >
                  حفظ وتسجيل الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE & SHIPPING SLIP PRINT MODAL */}
      <InvoiceModal 
        order={selectedInvoiceOrder}
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setSelectedInvoiceOrder(null);
        }}
      />

    </div>
  );
};
