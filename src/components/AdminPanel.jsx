import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Save, Plus, Trash2, Edit2, Package, Layout, ShoppingBag, 
  Settings, Download, Upload, RotateCcw, Eye, Check, AlertCircle, 
  Sparkles, Sliders, CheckCircle2, ChevronRight, Globe, Image as ImageIcon,
  Phone, MessageSquare, ToggleLeft, ToggleRight, Search, RefreshCw
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
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
    addTestOrder,
    resetToDefaultData,
    exportData,
    importData,
    showToast,
    language
  } = useStore();

  const [activeTab, setActiveTab] = useState('rows'); // 'rows' | 'images' | 'orders' | 'products' | 'texts' | 'settings'
  const [textLangTab, setTextLangTab] = useState('ar');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

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

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'ALL' && o.status !== orderFilter) return false;
    if (orderSearchQuery) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = (o.customer?.name || '').toLowerCase().includes(q);
      const matchPhone = (o.customer?.phone || '').includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  const { sectionsVisibility } = siteContent;

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
              <span>مكتبة وتعديل الصور (Images)</span>
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
            { id: 'rows', label: 'ظهور الصفوف' },
            { id: 'images', label: 'الصور' },
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
                  { key: 'hoodiesProducts', name: 'صف منتجات الهوديز (8 منتجات)', desc: 'شبكة عرض منتجات الهوديز مع الأسعار والألوان' },
                  { key: 'heroTshirts', name: 'بنر التيشرتات الصيفي السينمائي', desc: 'بنر تيشيرت بوسطن مع خلفية المدينة الساحلية' },
                  { key: 'tshirtsProducts', name: 'صف منتجات التيشرتات (4 منتجات)', desc: 'شبكة منتجات التيشرتات البولو والكامو والوافل' },
                  { key: 'heroSweatpants', name: 'بنر السويت بانتس الحضري', desc: 'بنر السويت بانتس الرمادي الواسع بجوار الجدار' },
                  { key: 'sweatpantsProducts', name: 'صف منتجات السويت بانتس (8 منتجات)', desc: 'شبكة منتجات بناطيل الفليس والكارجو' },
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

          {/* TAB 2: IMAGES MANAGER (مكتبة وتعديل كافة الصور) */}
          {activeTab === 'images' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                  <ImageIcon size={22} className="text-cyan-400" />
                  <span>مكتبة وتعديل كافة صور المتجر (Images Manager)</span>
                </h2>
                <p className="text-xs text-gray-400">
                  يمكنك استبدال رابط أي صورة في الموقع ومعاينتها فورياً، سواء صور البنرات أو كروت الفئات أو الشعار.
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
                  <div key={item.path} className="bg-[#16161f] border border-white/10 p-4 rounded space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] text-gray-500 font-mono">{item.path}</span>
                    </div>

                    {/* Image Preview */}
                    <div className="w-full h-36 bg-black rounded overflow-hidden border border-white/5 relative group">
                      <img 
                        src={item.current} 
                        alt="" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs text-white">
                        معاينة الصورة الحالية
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400">{item.desc}</p>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">رابط الصورة الجديد (URL):</label>
                      <input 
                        type="text"
                        defaultValue={item.current || ''}
                        onBlur={(e) => updateImage(item.path, e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded outline-none focus:border-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT (إدارة وتصليح طلبات العملاء) */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    <ShoppingBag size={22} className="text-amber-400" />
                    <span>إدارة طلبات العملاء ({orders.length} طلب مسجل)</span>
                  </h2>
                  <p className="text-xs text-gray-400">
                    متابعة الطلبات المكتملة، التواصل مع العملاء عبر واتساب، وتحديث حالة الشحن.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={addTestOrder}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} />
                    <span>إضافة طلب تجريبي</span>
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

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#16161f] p-3 rounded border border-white/10">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute top-3 right-3 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 pr-9 pl-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                  />
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {[
                    { id: 'ALL', label: 'الكل' },
                    { id: 'Pending', label: 'قيد المراجعة' },
                    { id: 'Processing', label: 'جاري التجهيز' },
                    { id: 'Shipped', label: 'تم الشحن' },
                    { id: 'Delivered', label: 'تم التوصيل' },
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
                  <p className="text-xs text-gray-500 mt-1">اضغط على زر "إضافة طلب تجريبي" بالأعلى لاختبار الوظائف مباشرة!</p>
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
                              {new Date(order.date).toLocaleDateString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            العميل: <strong className="text-white">{order.customer?.name}</strong> • الهاتف: <strong className="text-white font-mono">{order.customer?.phone}</strong>
                          </div>
                        </div>

                        {/* Status Switcher & Contact Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* WhatsApp Chat Shortcut */}
                          {order.customer?.phone && (
                            <a
                              href={`https://wa.me/2${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${order.customer.name}، بخصوص طلبك رقم ${order.id} من متجر KESWA WEAR`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors"
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

                          {/* Status Dropdown */}
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

                          {/* Delete Order Button */}
                          <button
                            onClick={() => {
                              if (window.confirm(`حذف الطلب #${order.id}؟`)) {
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
                            <p className="text-amber-300 text-[11px]">ملاحظات: {order.customer.notes}</p>
                          )}
                          <p className="text-gray-400 pt-1">طريقة الدفع: <span className="text-white font-bold">{order.paymentMethod}</span></p>
                        </div>

                        <div className="bg-neutral-900/70 p-3 rounded space-y-2">
                          <p className="text-gray-400">المنتجات المطلوبة ({order.items?.length}):</p>
                          <div className="space-y-1.5">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-gray-300">
                                <div className="flex items-center gap-2">
                                  {item.image && (
                                    <img src={item.image} alt="" className="w-7 h-9 object-cover rounded border border-white/10" />
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

          {/* TAB 5: TEXTS & BUTTONS */}
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

              {/* Top Announcement */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  شريط الإعلانات العلوي
                </h3>
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

              {/* Brand & Slogan */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  هوية وشعار البراند
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

              {/* Section Headers */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  عناوين الأقسام وأزرار عرض الكل ({textLangTab === 'ar' ? 'العربية' : 'English'})
                </h3>

                {['hoodies', 'tshirts', 'sweatpants'].map(sec => (
                  <div key={sec} className="p-3 bg-neutral-900/80 border border-white/5 rounded space-y-2">
                    <span className="text-xs font-bold text-amber-400 block uppercase">قسم {sec}:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input 
                        type="text"
                        placeholder="عنوان القسم"
                        value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.[sec]?.title_ar || '') : (siteContent.sectionHeaders?.[sec]?.title_en || '')}
                        onChange={(e) => updateSectionHeader(sec, textLangTab === 'ar' ? { title_ar: e.target.value } : { title_en: e.target.value })}
                        className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                      />
                      <input 
                        type="text"
                        placeholder="العنوان الفرعي"
                        value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.[sec]?.subtitle_ar || '') : (siteContent.sectionHeaders?.[sec]?.subtitle_en || '')}
                        onChange={(e) => updateSectionHeader(sec, textLangTab === 'ar' ? { subtitle_ar: e.target.value } : { subtitle_en: e.target.value })}
                        className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded"
                      />
                      <input 
                        type="text"
                        placeholder="نص زر عرض الكل"
                        value={textLangTab === 'ar' ? (siteContent.sectionHeaders?.[sec]?.viewAllText_ar || '') : (siteContent.sectionHeaders?.[sec]?.viewAllText_en || '')}
                        onChange={(e) => updateSectionHeader(sec, textLangTab === 'ar' ? { viewAllText_ar: e.target.value } : { viewAllText_en: e.target.value })}
                        className="bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded font-bold"
                      />
                    </div>
                  </div>
                ))}
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

              {/* Image Preview */}
              {productForm.images?.[0] && (
                <div className="flex items-center gap-3 bg-neutral-900 p-2.5 rounded border border-white/10">
                  <img src={productForm.images[0]} alt="" className="w-12 h-16 object-cover rounded border border-white/10 shrink-0" />
                  <span className="text-[11px] text-gray-400">معاينة الصورة المحددة للمنتج</span>
                </div>
              )}

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
