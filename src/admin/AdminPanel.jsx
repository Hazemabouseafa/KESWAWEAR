import React from 'react';
import { useStore } from '../context/StoreContext';
import { OrdersManager } from './OrdersManager';
import { ProductsManager } from './ProductsManager';
import { CategoriesManager } from './CategoriesManager';
import { RowsVisibilityManager } from './RowsVisibilityManager';
import { ImageLibraryManager } from './ImageLibraryManager';
import { TextContentManager } from './TextContentManager';
import { SettingsManager } from './SettingsManager';
import { 
  Eye, Sliders, ChevronRight, ShoppingBag, 
  Package, Layers, ToggleRight, Image as ImageIcon, 
  Layout, Settings, FileSpreadsheet, Download, RotateCcw,
  ArrowRight
} from 'lucide-react';

export const AdminPanel = ({ onBackToStore }) => {
  const { 
    adminTab, 
    setAdminTab,
    orders, 
    products, 
    siteContent, 
    neonStatus,
    exportOrdersCSV,
    exportData,
    resetToDefaultData
  } = useStore();

  const handleBack = () => {
    if (onBackToStore) {
      onBackToStore();
    } else {
      window.location.href = '/';
    }
  };

  const { categories = [] } = siteContent;

  const tabs = [
    { id: 'orders', label: `طلبات العملاء (${orders.length})`, icon: ShoppingBag, color: 'text-amber-400' },
    { id: 'products', label: `المنتجات (${products.length})`, icon: Package, color: 'text-white' },
    { id: 'categories', label: `الأقسام والبلوكات (${categories.length})`, icon: Layers, color: 'text-purple-400' },
    { id: 'rows', label: 'ظهور الصفوف (Rows)', icon: ToggleRight, color: 'text-emerald-400' },
    { id: 'images', label: 'مكتبة ورفع الصور', icon: ImageIcon, color: 'text-cyan-400' },
    { id: 'texts', label: 'نصوص وأزرار الواجهة', icon: Layout, color: 'text-blue-400' },
    { id: 'settings', label: 'الإعدادات وقاعدة البيانات', icon: Settings, color: 'text-neutral-300' }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0d12] text-[#e5e5e5] flex flex-col font-sans select-none">
      
      {/* Top Header */}
      <header className="bg-[#121218] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 rounded shadow-md">
            <Sliders size={16} />
            <span>لوحة تحكم المتجر • KESWA CMS (/admin)</span>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 rounded-full hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>بوابة الإدارة المستقلة نشطة</span>
          </span>

          {/* Neon DB Indicator */}
          <div className="hidden lg:flex items-center">
            {neonStatus === 'connected' ? (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 border border-emerald-500/30 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Neon DB: متصلة (keswawear)</span>
              </span>
            ) : (
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 border border-cyan-500/30 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Neon PostgreSQL: جاهزة للربط السحابي</span>
              </span>
            )}
          </div>
        </div>

        {/* Top Actions: Go Back to Store */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs font-black px-4 py-2.5 rounded transition-all shadow-md group"
            title="الانتقال لواجهة المتجر"
          >
            <Eye size={15} />
            <span>الذهاب لواجهة المتجر (View Store)</span>
            <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Tabs */}
        <aside className="w-64 bg-[#0a0a0d] border-l border-white/10 p-4 space-y-1.5 hidden md:block overflow-y-auto shrink-0 min-h-[calc(100vh-65px)]">
          <div className="text-[11px] font-mono text-gray-500 px-3 py-1 uppercase tracking-wider mb-2">
            أقسام لوحة التحكم
          </div>

          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`w-full text-right p-3 text-xs font-bold flex items-center justify-between rounded transition-all ${
                  isActive 
                    ? 'bg-white text-black shadow-lg font-black' 
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={17} className={isActive ? 'text-black' : tab.color} />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight size={14} className={isActive ? 'rotate-180' : 'opacity-40'} />
              </button>
            );
          })}

          {/* Quick Shortcuts */}
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
              className="w-full text-right p-2.5 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded"
            >
              <Download size={14} />
              <span>تصدير نسخة احتياطية (JSON)</span>
            </button>

            <button
              onClick={resetToDefaultData}
              className="w-full text-right p-2.5 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded"
            >
              <RotateCcw size={14} />
              <span>إعادة ضبط المصنع</span>
            </button>
          </div>
        </aside>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden flex overflow-x-auto bg-[#0a0a0d] border-b border-white/10 p-2 gap-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded transition-colors ${
                adminTab === tab.id ? 'bg-white text-black font-black' : 'text-gray-400 bg-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <main className="flex-1 bg-[#101015] p-6 lg:p-10 overflow-y-auto min-h-[calc(100vh-65px)]">
          {adminTab === 'orders' && <OrdersManager />}
          {adminTab === 'products' && <ProductsManager />}
          {adminTab === 'categories' && <CategoriesManager />}
          {adminTab === 'rows' && <RowsVisibilityManager />}
          {adminTab === 'images' && <ImageLibraryManager />}
          {adminTab === 'texts' && <TextContentManager />}
          {adminTab === 'settings' && <SettingsManager />}
        </main>

      </div>
    </div>
  );
};
export default AdminPanel;
