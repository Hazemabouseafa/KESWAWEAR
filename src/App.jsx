import React from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { 
  HeroHoodies, 
  CategoryFeatureGrid, 
  HeroTshirts, 
  HeroSweatpants, 
  SuperSaleSection, 
  NewsletterSection 
} from './components/HeroBanners';
import { ProductSection } from './components/ProductSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AdminPanel } from './components/AdminPanel';
import { Sliders, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const { 
    siteContent, 
    activeCategory, 
    setActiveCategory, 
    notification, 
    setIsAdminOpen,
    getLocalized,
    language 
  } = useStore();

  const { sectionHeaders } = siteContent;

  return (
    <div id="top" className="min-h-screen bg-[#0a0a0c] text-white flex flex-col relative selection:bg-white selection:text-black font-sans">
      
      {/* 1. Header / Navbar */}
      <Navbar />

      {/* Floating Admin Trigger Button for Quick Live Editing */}
      <div className="fixed bottom-6 start-6 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-2 bg-neutral-900/90 hover:bg-white hover:text-black text-gray-200 border border-white/20 px-4 py-3 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-105"
          title="Open Admin CMS"
        >
          <Sliders size={18} className="text-amber-400 group-hover:text-black" />
          <span className="text-xs font-black uppercase tracking-wider font-sans">
            {language === 'ar' ? 'لوحة التحكم (CMS)' : 'Admin CMS'}
          </span>
        </button>
      </div>

      {/* 2. Main Storefront Content */}
      <main className="flex-1">
        
        {/* If user filtered specifically to a single category from navbar */}
        {activeCategory !== 'all' ? (
          <div className="pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-sans text-gray-400 uppercase">
                  {language === 'ar' ? 'القسم الحالي:' : 'CATEGORY:'}
                </span>
                <span className="text-xl font-black font-display uppercase text-white bg-neutral-900 px-3 py-1 border border-white/10">
                  {activeCategory === 'hoodies' ? (language === 'ar' ? 'هوديز' : 'Hoodies') :
                   activeCategory === 'tshirts' ? (language === 'ar' ? 'تيشرتات' : 'T-Shirts') :
                   activeCategory === 'sweatpants' ? (language === 'ar' ? 'سويت بانتس' : 'Sweatpants') : activeCategory}
                </span>
              </div>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-xs font-bold font-sans text-gray-400 hover:text-white underline uppercase"
              >
                {language === 'ar' ? '← عرض كافة الأقسام والصفحة الرئيسية' : '← View All Categories'}
              </button>
            </div>

            {activeCategory === 'hoodies' && (
              <ProductSection
                id="hoodies"
                category="hoodies"
                title={getLocalized(sectionHeaders?.hoodies, 'title') || "HOODIES"}
                subtitle={getLocalized(sectionHeaders?.hoodies, 'subtitle')}
                viewAllText={getLocalized(sectionHeaders?.hoodies, 'viewAllText')}
                limit={12}
              />
            )}

            {activeCategory === 'tshirts' && (
              <ProductSection
                id="tshirts"
                category="tshirts"
                title={getLocalized(sectionHeaders?.tshirts, 'title') || "T-SHIRTS"}
                subtitle={getLocalized(sectionHeaders?.tshirts, 'subtitle')}
                viewAllText={getLocalized(sectionHeaders?.tshirts, 'viewAllText')}
                limit={12}
              />
            )}

            {activeCategory === 'sweatpants' && (
              <ProductSection
                id="sweatpants"
                category="sweatpants"
                title={getLocalized(sectionHeaders?.sweatpants, 'title') || "SWEATPANTS"}
                subtitle={getLocalized(sectionHeaders?.sweatpants, 'subtitle')}
                viewAllText={getLocalized(sectionHeaders?.sweatpants, 'viewAllText')}
                limit={12}
              />
            )}
          </div>
        ) : (
          /* FULL LAYOUT - EXACTLY MATCHING IMAGE 1 */
          <>
            {/* Section 1: Hero Hoodies Banner */}
            <HeroHoodies />

            {/* Section 2: 3-Card Category Feature Grid */}
            <CategoryFeatureGrid />

            {/* Section 3: Hoodies Products Section (8 Products) */}
            <ProductSection
              id="hoodies"
              category="hoodies"
              title={getLocalized(sectionHeaders?.hoodies, 'title') || "HOODIES"}
              subtitle={getLocalized(sectionHeaders?.hoodies, 'subtitle')}
              viewAllText={getLocalized(sectionHeaders?.hoodies, 'viewAllText')}
              limit={8}
            />

            {/* Section 4: T-Shirts Cinematic Banner */}
            <HeroTshirts />

            {/* Section 5: T-Shirts Products Section (4 Products) */}
            <ProductSection
              id="tshirts"
              category="tshirts"
              title={getLocalized(sectionHeaders?.tshirts, 'title') || "T-SHIRTS"}
              subtitle={getLocalized(sectionHeaders?.tshirts, 'subtitle')}
              viewAllText={getLocalized(sectionHeaders?.tshirts, 'viewAllText')}
              limit={4}
            />

            {/* Section 6: Sweatpants Urban Banner */}
            <HeroSweatpants />

            {/* Section 7: Sweatpants Products Section (8 Products) */}
            <ProductSection
              id="sweatpants"
              category="sweatpants"
              title={getLocalized(sectionHeaders?.sweatpants, 'title') || "SWEATPANTS"}
              subtitle={getLocalized(sectionHeaders?.sweatpants, 'subtitle')}
              viewAllText={getLocalized(sectionHeaders?.sweatpants, 'viewAllText')}
              limit={8}
            />

            {/* Section 8: Super Sale with Interactive Live Countdown */}
            <SuperSaleSection />

            {/* Section 9: Newsletter Section */}
            <NewsletterSection />
          </>
        )}

      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />
      <AdminPanel />

      {/* 5. Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-[#181824] border border-white/20 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-sans backdrop-blur-md">
            {notification.type === 'error' ? (
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
