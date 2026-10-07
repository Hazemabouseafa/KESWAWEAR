import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Save, Plus, Trash2, Edit2, Package, Layout, ShoppingBag, 
  Settings, Download, Upload, RotateCcw, Eye, Check, AlertCircle, Sparkles, Sliders
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
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('texts'); // 'texts' | 'products' | 'banners' | 'orders' | 'settings'
  
  // Local edit states
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'hoodies',
    price: 850,
    oldPrice: 1100,
    badge: 'NEW',
    inStock: true,
    description: '',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#111111' }]
  });

  if (!isAdminOpen) return null;

  // Handlers for product form
  const handleOpenAddProduct = () => {
    setProductForm({
      name: '',
      category: 'hoodies',
      price: 850,
      oldPrice: 1100,
      badge: 'NEW',
      inStock: true,
      description: 'Heavyweight oversized streetwear fabric.',
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=900&auto=format&fit=crop'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Black', hex: '#111111' }]
    });
    setEditingProduct(null);
    setIsNewProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductForm({ ...prod });
    setEditingProduct(prod.id);
    setIsNewProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert("Please provide product name and price");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct, productForm);
    } else {
      addProduct(productForm);
    }

    setIsNewProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importData(event.target.result);
      } catch (err) {
        alert("Failed to parse JSON backup file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex flex-col animate-fadeIn">
      
      {/* Top Bar */}
      <header className="bg-[#121218] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white text-black font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
            <Sliders size={16} />
            <span>KESWA CMS CONTROL PANEL</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 hidden sm:inline">
            ● LIVE EDIT MODE ACTIVE
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdminOpen(false)}
            className="flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-black uppercase tracking-wider px-4 py-2 transition-colors"
          >
            <Eye size={15} />
            <span>VIEW STORE • معاينة المتجر</span>
          </button>
          <button 
            onClick={() => setIsAdminOpen(false)}
            className="p-2 text-gray-400 hover:text-white"
            aria-label="Close Admin"
          >
            <X size={22} />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Tabs */}
        <aside className="w-64 bg-[#0a0a0d] border-r border-white/10 p-4 space-y-2 hidden md:block overflow-y-auto">
          <button
            onClick={() => setActiveTab('texts')}
            className={`w-full text-left p-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 rounded transition-all ${
              activeTab === 'texts' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Layout size={16} />
            <span>نصوص وأزرار الواجهة (Texts)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left p-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 rounded transition-all ${
              activeTab === 'products' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Package size={16} />
            <span>إدارة المنتجات (Products - {products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full text-left p-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 rounded transition-all ${
              activeTab === 'banners' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Sliders size={16} />
            <span>إدارة البنرات (Banners)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 rounded transition-all ${
              activeTab === 'orders' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <ShoppingBag size={16} />
            <span>طلبات الشراء (Orders - {orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left p-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 rounded transition-all ${
              activeTab === 'settings' ? 'bg-white text-black shadow-lg font-black' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <Settings size={16} />
            <span>الإعدادات والنسخ الاحتياطي</span>
          </button>

          <div className="pt-8 border-t border-white/10 space-y-2">
            <button
              onClick={exportData}
              className="w-full text-left p-2.5 text-[11px] font-mono text-gray-400 hover:text-white flex items-center gap-2 bg-neutral-900/60 border border-white/5"
            >
              <Download size={13} />
              <span>تصدير نسخة JSON</span>
            </button>

            <button
              onClick={resetToDefaultData}
              className="w-full text-left p-2.5 text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20"
            >
              <RotateCcw size={13} />
              <span>إعادة ضبط المصنع</span>
            </button>
          </div>
        </aside>

        {/* Mobile Tab Pills */}
        <div className="md:hidden flex overflow-x-auto bg-[#0a0a0d] border-b border-white/10 p-2 gap-2 shrink-0">
          {[
            { id: 'texts', label: 'نصوص الواجهة' },
            { id: 'products', label: 'المنتجات' },
            { id: 'banners', label: 'البنرات' },
            { id: 'orders', label: 'الطلبات' },
            { id: 'settings', label: 'الإعدادات' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap rounded ${
                activeTab === t.id ? 'bg-white text-black' : 'text-gray-400 bg-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right Main Content Area */}
        <main className="flex-1 bg-[#101015] p-6 lg:p-10 overflow-y-auto">
          
          {/* TAB 1: FRONTEND TEXTS & BUTTONS EDITOR */}
          {activeTab === 'texts' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black font-display uppercase text-white mb-1">
                  محرر نصوص وأزرار الواجهة (Interface Content Editor)
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  قم بتعديل أي نص أو زر في الواجهة وسينعكس فورياً على المتجر مباشرة دون إعادة تحميل.
                </p>
              </div>

              {/* 1. Top Announcement Bar */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    1. شريط الإعلانات العلوي (Announcement Bar)
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer">
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
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">نص الإعلان (Text):</label>
                    <input 
                      type="text"
                      value={siteContent.announcement?.text || ''}
                      onChange={(e) => updateContent('announcement.text', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">رابط الإعلان (Target Link):</label>
                    <input 
                      type="text"
                      value={siteContent.announcement?.link || ''}
                      onChange={(e) => updateContent('announcement.link', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Brand & Logo Settings */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold uppercase text-white font-mono border-b border-white/5 pb-3">
                  2. هوية البراند واللوجو (Brand Identity & Logo)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">اسم البراند (Brand Name):</label>
                    <input 
                      type="text"
                      value={siteContent.brand?.name || ''}
                      onChange={(e) => updateContent('brand.name', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">الشعار اللفظي (Slogan / Tagline):</label>
                    <input 
                      type="text"
                      value={siteContent.brand?.tagline || ''}
                      onChange={(e) => updateContent('brand.tagline', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">نمط عرض اللوجو في الموقع (Logo Style):</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input 
                          type="radio"
                          name="logoStyle"
                          value="metallic"
                          checked={siteContent.brand?.logoStyle !== 'badge'}
                          onChange={() => updateContent('brand.logoStyle', 'metallic')}
                          className="accent-white"
                        />
                        <span>فيكتور معدني حاد فائق الوضوح (Metallic Vector - مستحسن)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                        <input 
                          type="radio"
                          name="logoStyle"
                          value="badge"
                          checked={siteContent.brand?.logoStyle === 'badge'}
                          onChange={() => updateContent('brand.logoStyle', 'badge')}
                          className="accent-white"
                        />
                        <span>صورة الشعار الأصلية بالخلفية الداكنة (Original Dark Badge)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Section Titles & Subtitles */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold uppercase text-white font-mono border-b border-white/5 pb-3">
                  3. عناوين أقسام المنتجات وأزرار العرض (Section Titles & Buttons)
                </h3>
                
                {/* Hoodies Section */}
                <div className="p-3 bg-neutral-900/60 border border-white/5 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400">قسم الهوديز (Hoodies Section):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text"
                      placeholder="Title"
                      value={siteContent.sectionHeaders?.hoodies?.title || ''}
                      onChange={(e) => updateSectionHeader('hoodies', { title: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="Subtitle"
                      value={siteContent.sectionHeaders?.hoodies?.subtitle || ''}
                      onChange={(e) => updateSectionHeader('hoodies', { subtitle: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="Button Text"
                      value={siteContent.sectionHeaders?.hoodies?.viewAllText || ''}
                      onChange={(e) => updateSectionHeader('hoodies', { viewAllText: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded font-bold"
                    />
                  </div>
                </div>

                {/* T-Shirts Section */}
                <div className="p-3 bg-neutral-900/60 border border-white/5 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400">قسم التيشرتات (T-Shirts Section):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text"
                      placeholder="Title"
                      value={siteContent.sectionHeaders?.tshirts?.title || ''}
                      onChange={(e) => updateSectionHeader('tshirts', { title: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="Subtitle"
                      value={siteContent.sectionHeaders?.tshirts?.subtitle || ''}
                      onChange={(e) => updateSectionHeader('tshirts', { subtitle: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="Button Text"
                      value={siteContent.sectionHeaders?.tshirts?.viewAllText || ''}
                      onChange={(e) => updateSectionHeader('tshirts', { viewAllText: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded font-bold"
                    />
                  </div>
                </div>

                {/* Sweatpants Section */}
                <div className="p-3 bg-neutral-900/60 border border-white/5 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400">قسم السويت بانتس (Sweatpants Section):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text"
                      placeholder="Title"
                      value={siteContent.sectionHeaders?.sweatpants?.title || ''}
                      onChange={(e) => updateSectionHeader('sweatpants', { title: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="Subtitle"
                      value={siteContent.sectionHeaders?.sweatpants?.subtitle || ''}
                      onChange={(e) => updateSectionHeader('sweatpants', { subtitle: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded"
                    />
                    <input 
                      type="text"
                      placeholder="Button Text"
                      value={siteContent.sectionHeaders?.sweatpants?.viewAllText || ''}
                      onChange={(e) => updateSectionHeader('sweatpants', { viewAllText: e.target.value })}
                      className="bg-neutral-900 border border-white/15 px-2.5 py-1.5 text-xs text-white rounded font-bold"
                    />
                  </div>
                </div>

              </div>

              {/* 4. Footer & Contacts */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold uppercase text-white font-mono border-b border-white/5 pb-3">
                  4. نصوص الفوتر وبيانات التواصل (Footer & Contacts)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">وصف البراند في الفوتر (About):</label>
                    <textarea 
                      rows={2}
                      value={siteContent.footer?.about || ''}
                      onChange={(e) => updateContent('footer.about', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">رقم الهاتف (Phone):</label>
                    <input 
                      type="text"
                      value={siteContent.footer?.phone || ''}
                      onChange={(e) => updateContent('footer.phone', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">البريد الإلكتروني (Email):</label>
                    <input 
                      type="email"
                      value={siteContent.footer?.email || ''}
                      onChange={(e) => updateContent('footer.email', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">حقوق الملكية (Copyright):</label>
                    <input 
                      type="text"
                      value={siteContent.footer?.copyright || ''}
                      onChange={(e) => updateContent('footer.copyright', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black font-display uppercase text-white mb-1">
                    إدارة منتجات المتجر ({products.length} منتج)
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    إضافة منتجات جديدة، تعديل الأسعار، الخصومات، الصور، والألوان والمقاسات.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>إضافة منتج جديد (Add Product)</span>
                </button>
              </div>

              {/* Products Table/Grid */}
              <div className="bg-[#16161f] border border-white/10 rounded overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900 border-b border-white/10 text-gray-400 font-mono uppercase">
                      <tr>
                        <th className="p-3.5">المنتج</th>
                        <th className="p-3.5">القسم</th>
                        <th className="p-3.5">السعر</th>
                        <th className="p-3.5">السعر الأصلي</th>
                        <th className="p-3.5">البادج</th>
                        <th className="p-3.5">المقاسات</th>
                        <th className="p-3.5 text-right">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover rounded shrink-0 border border-white/10" />
                            <div>
                              <span className="font-bold text-white block">{p.name}</span>
                              <span className="text-[10px] text-gray-500 font-sans">ID: {p.id}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-gray-300 uppercase">{p.category}</td>
                          <td className="p-3.5 font-bold text-white">{p.price} ج.م</td>
                          <td className="p-3.5 text-gray-400 line-through">{p.oldPrice ? `${p.oldPrice} ج.م` : '-'}</td>
                          <td className="p-3.5">
                            {p.badge && (
                              <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold">
                                {p.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-gray-400">{p.sizes?.join(', ')}</td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-gray-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete product "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors"
                              title="Delete"
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

          {/* TAB 3: BANNERS & PROMOTIONS */}
          {activeTab === 'banners' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black font-display uppercase text-white mb-1">
                  إدارة البنرات والعروض (Banners & Hero Sections)
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  تحكم في نصوص وصور وأزرار كافة البنرات الرئيسية وبنر العرض الترويجي.
                </p>
              </div>

              {/* Banner 1: Hoodies Hero */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    بنر الهيدر الرئيسي - هوديز (Main Hero Hoodies)
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer">
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
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">العنوان الرئيسي (Title):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.title || ''}
                      onChange={(e) => updateBanner('heroHoodies', { title: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">العنوان الفرعي (Subtitle):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.subtitle || ''}
                      onChange={(e) => updateBanner('heroHoodies', { subtitle: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">نص الزر (Button Text):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.buttonText || ''}
                      onChange={(e) => updateBanner('heroHoodies', { buttonText: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">رابط الصورة (Image URL):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroHoodies?.image || ''}
                      onChange={(e) => updateBanner('heroHoodies', { image: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Banner 2: T-Shirts Banner */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    بنر التيشرتات (T-Shirts Cinematic Banner)
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer">
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
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">العنوان الرئيسي (Title):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroTshirts?.title || ''}
                      onChange={(e) => updateBanner('heroTshirts', { title: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">نص الزر (Button Text):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroTshirts?.buttonText || ''}
                      onChange={(e) => updateBanner('heroTshirts', { buttonText: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">رابط الصورة (Image URL):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroTshirts?.image || ''}
                      onChange={(e) => updateBanner('heroTshirts', { image: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Banner 3: Sweatpants Banner */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold uppercase text-white font-mono">
                    بنر السويت بانتس (Sweatpants Urban Banner)
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer">
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
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">العنوان الرئيسي (Title):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroSweatpants?.title || ''}
                      onChange={(e) => updateBanner('heroSweatpants', { title: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">نص الزر (Button Text):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.heroSweatpants?.buttonText || ''}
                      onChange={(e) => updateBanner('heroSweatpants', { buttonText: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">رابط الصورة (Image URL):</label>
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
                  <h3 className="text-sm font-bold uppercase text-white font-mono text-rose-400">
                    بنر الخصم الكبير والعداد التنازلي (Super Sale & Countdown)
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer">
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
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">عنوان الخصم (Title):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.superSale?.title || ''}
                      onChange={(e) => updateBanner('superSale', { title: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">نص الزر (Button Text):</label>
                    <input 
                      type="text"
                      value={siteContent.banners?.superSale?.buttonText || ''}
                      onChange={(e) => updateBanner('superSale', { buttonText: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">تاريخ انتهاء العداد التنازلي (Target ISO Date):</label>
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

          {/* TAB 4: ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black font-display uppercase text-white mb-1">
                  إدارة طلبات العملاء ({orders.length} طلب)
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  متابعة الطلبات المكتملة وتحديث حالات الشحن والتوصيل.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-[#16161f] border border-white/10 p-12 text-center rounded">
                  <ShoppingBag size={40} className="mx-auto text-gray-600 mb-3" />
                  <p className="text-sm font-bold text-gray-300">لا توجد طلبات مسجلة حتى الآن</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">قم بتجربة عمل طلب شراء من الواجهة وسيظهر هنا فوراً!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-base">#{order.id}</span>
                            <span className="text-[11px] font-mono text-gray-400">
                              {new Date(order.date).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs text-gray-300">
                            العميل: <strong className="text-white">{order.customer?.name}</strong> • هاتف: <strong className="text-white">{order.customer?.phone}</strong>
                          </span>
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-gray-400">الحالة:</span>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold font-mono px-3 py-1.5 rounded outline-none border ${
                              order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                              order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                              order.status === 'Processing' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                              'bg-neutral-800 text-gray-200 border-white/20'
                            }`}
                          >
                            <option value="Pending">Pending (قيد المراجعة)</option>
                            <option value="Processing">Processing (جاري التجهيز)</option>
                            <option value="Shipped">Shipped (تم الشحن)</option>
                            <option value="Delivered">Delivered (تم التوصيل)</option>
                            <option value="Cancelled">Cancelled (ملغي)</option>
                          </select>
                        </div>
                      </div>

                      {/* Details & Items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="bg-neutral-900/60 p-3 rounded space-y-1">
                          <p className="text-gray-400">عنوان التوصيل:</p>
                          <p className="text-white font-bold">{order.customer?.address}, {order.customer?.city}</p>
                          {order.customer?.notes && (
                            <p className="text-amber-300 text-[11px]">ملاحظات: {order.customer.notes}</p>
                          )}
                          <p className="text-gray-400 pt-1">طريقة الدفع: <span className="text-white">{order.paymentMethod}</span></p>
                        </div>

                        <div className="bg-neutral-900/60 p-3 rounded space-y-2">
                          <p className="text-gray-400">المنتجات المطلوبة:</p>
                          <div className="space-y-1">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-gray-300">
                                <span>{item.quantity}x {item.name} ({item.size})</span>
                                <span className="font-bold text-white">{item.price * item.quantity} ج.م</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-white/10 pt-1.5 flex justify-between font-bold text-white">
                            <span>الإجمالي الكلي:</span>
                            <span className="text-emerald-400 text-sm">{order.total} ج.م</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GENERAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black font-display uppercase text-white mb-1">
                  إعدادات المتجر والعملة والشحن (Store Settings)
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  تعديل تكاليف الشحن والعملة وحد الشحن المجاني.
                </p>
              </div>

              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">العملة (Currency Symbol):</label>
                    <input 
                      type="text"
                      value={siteContent.general?.currency || 'EGP'}
                      onChange={(e) => updateContent('general.currency', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">تكلفة الشحن الافتراضية (Shipping Cost):</label>
                    <input 
                      type="number"
                      value={siteContent.general?.shippingCost || 50}
                      onChange={(e) => updateContent('general.shippingCost', Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">حد الشحن المجاني (Free Shipping Threshold):</label>
                    <input 
                      type="number"
                      value={siteContent.general?.freeShippingThreshold || 1500}
                      onChange={(e) => updateContent('general.freeShippingThreshold', Number(e.target.value))}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Data Import / Export */}
              <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4">
                <h3 className="text-sm font-bold uppercase text-white font-mono border-b border-white/5 pb-2">
                  النسخ الاحتياطي واستيراد البيانات (Backup & Restore)
                </h3>
                <p className="text-xs text-gray-400">
                  يمكنك تحميل نسخة كاملة من كافة المنتجات والطلبات وإعدادات المتجر كملف JSON واستعادتها في أي وقت.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={exportData}
                    className="bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 rounded transition-colors"
                  >
                    <Download size={15} />
                    <span>تحميل نسخة احتياطية (Export JSON)</span>
                  </button>

                  <label className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 rounded transition-colors cursor-pointer border border-white/10">
                    <Upload size={15} />
                    <span>استيراد ملف نسخة (Import JSON)</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleFileImport}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#14141c] border border-white/20 rounded p-6 shadow-2xl my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <h3 className="font-display font-black text-lg uppercase text-white">
                {editingProduct ? "تعديل المنتج • Edit Product" : "إضافة منتج جديد • Add New Product"}
              </h3>
              <button 
                onClick={() => setIsNewProductModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">اسم المنتج (Product Name) *</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">القسم (Category) *</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white uppercase"
                  >
                    <option value="hoodies">Hoodies (هوديز)</option>
                    <option value="tshirts">T-Shirts (تيشرتات)</option>
                    <option value="sweatpants">Sweatpants (سويت بانتس)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">سعر البيع (Price) *</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">السعر القديم قبل الخصم (Old Price)</label>
                  <input 
                    type="number" 
                    value={productForm.oldPrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">بادج العرض (Badge e.g. SALE -20%)</label>
                  <input 
                    type="text" 
                    value={productForm.badge || ''}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">رابط الصورة الرئيسية (Image URL) *</label>
                <input 
                  type="text" 
                  required
                  value={productForm.images?.[0] || ''}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">وصف المنتج (Description)</label>
                <textarea 
                  rows={2}
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-sans text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-gray-300 hover:text-white rounded"
                >
                  إلغاء (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-white hover:bg-neutral-200 text-black font-black uppercase tracking-wider rounded"
                >
                  حفظ المنتج (Save Product)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
