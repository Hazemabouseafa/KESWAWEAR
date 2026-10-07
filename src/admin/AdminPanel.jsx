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

  const [isMobileShortcutsOpen, setIsMobileShortcutsOpen] = React.useState(false);

  const handleBack = () => {
    if (onBackToStore) {
      onBackToStore();
    } else {
      window.location.href = '/';
    }
  };

  const { categories = [] } = siteContent;

  const tabs = [
    { id: 'orders', label: `الطلبات (${orders.length})`, icon: ShoppingBag, color: 'text-amber-400' },
    { id: 'products', label: `المنتجات (${products.length})`, icon: Package, color: 'text-white' },
    { id: 'categories', label: `الأقسام (${categories.length})`, icon: Layers, color: 'text-purple-400' },
    { id: 'rows', label: 'ظهور الصفوف', icon: ToggleRight, color: 'text-emerald-400' },
    { id: 'images', label: 'مكتبة الصور', icon: ImageIcon, color: 'text-cyan-400' },
    { id: 'texts', label: 'نصوص الواجهة', icon: Layout, color: 'text-blue-400' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, color: 'text-neutral-300' }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0d12] text-[#e5e5e5] flex flex-col font-sans select-none">
      
      {/* Top Header */}
      <header className="bg-[#121218] border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-white text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 rounded shadow-md">
            <Sliders size={15} />
            <span className="sm:hidden">لوحة التحكم • KESWA</span>
            <span className="hidden sm:inline">لوحة تحكم المتجر • KESWA CMS (/admin)</span>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/20 rounded-full hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>بوابة الإدارة نشطة</span>
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
        <div className="flex items-center gap-2">
          {/* Mobile shortcuts trigger */}
          <button
            onClick={() => setIsMobileShortcutsOpen(!isMobileShortcutsOpen)}
            className="md:hidden p-2 bg-neutral-900 border border-white/15 text-gray-300 rounded text-xs flex items-center"
            title="أدوات سريعة"
          >
            <Download size={14} />
          </button>

          <button 
            onClick={handleBack}
            className="flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-black px-3 py-2 sm:px-4 sm:py-2.5 rounded transition-all shadow-md group touch-manipulation"
            title="الانتقال لواجهة المتجر"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">الذهاب لواجهة المتجر (View Store)</span>
            <span className="sm:hidden">عرض المتجر</span>
            <ArrowRight size={13} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Container: Flex-col on mobile, flex-row on desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        
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

        {/* Mobile Horizontal Tabs Bar (Touch-friendly, Scrollable, With Icons) */}
        <div className="md:hidden flex overflow-x-auto bg-[#0a0a0d] border-b border-white/10 p-2 gap-1.5 shrink-0 scrollbar-none sticky top-0 z-20 shadow-md">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`px-3 py-2 text-xs font-bold whitespace-nowrap rounded-lg flex items-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                  isActive 
                    ? 'bg-white text-black font-black shadow-md' 
                    : 'text-gray-300 bg-neutral-900 border border-white/5 hover:text-white'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-black' : tab.color} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Expandable Shortcuts */}
        {isMobileShortcutsOpen && (
          <div className="md:hidden bg-[#14141c] border-b border-white/10 p-3 space-y-2 animate-fadeIn shrink-0">
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
              إجراءات سريعة:
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                onClick={() => { exportOrdersCSV(); setIsMobileShortcutsOpen(false); }}
                className="p-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded flex flex-col items-center gap-1 text-center font-bold touch-manipulation"
              >
                <FileSpreadsheet size={16} />
                <span>إكسل الطلبات</span>
              </button>
              <button
                onClick={() => { exportData(); setIsMobileShortcutsOpen(false); }}
                className="p-2 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded flex flex-col items-center gap-1 text-center font-bold touch-manipulation"
              >
                <Download size={16} />
                <span>نسخة JSON</span>
              </button>
              <button
                onClick={() => { resetToDefaultData(); setIsMobileShortcutsOpen(false); }}
                className="p-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded flex flex-col items-center gap-1 text-center font-bold touch-manipulation"
              >
                <RotateCcw size={16} />
                <span>ضبط المصنع</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body: Full width on mobile, comfortable padding */}
        <main className="flex-1 bg-[#101015] p-3.5 sm:p-6 lg:p-10 overflow-y-auto min-h-0">
          <AdminErrorBoundary>
            {adminTab === 'orders' && <OrdersManager />}
            {adminTab === 'products' && <ProductsManager />}
            {adminTab === 'categories' && <CategoriesManager />}
            {adminTab === 'rows' && <RowsVisibilityManager />}
            {adminTab === 'images' && <ImageLibraryManager />}
            {adminTab === 'texts' && <TextContentManager />}
            {adminTab === 'settings' && <SettingsManager />}
          </AdminErrorBoundary>
        </main>

      </div>
    </div>
  );
};

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Admin Error caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-[#181822] border border-rose-500/30 rounded-lg text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="text-rose-400 font-bold text-base">حدث خطأ أثناء تحميل هذا القسم</div>
          <p className="text-xs text-gray-400">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-white text-black font-bold text-xs rounded hover:bg-neutral-200 transition-colors"
          >
            إعادة المحاولة (Retry)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AdminPanel;
