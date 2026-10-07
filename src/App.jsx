import React from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { 
  HeroHoodies, 
  CategoryFeatureGrid, 
  HeroTshirts, 
  HeroSweatpants, 
  SuperSaleSection, 
  NewsletterSection,
  DynamicCategoryBanner
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

  const { sectionHeaders, sectionsVisibility, categories = [] } = siteContent;

  const isVisible = (rowKey) => sectionsVisibility?.[rowKey] !== false;

  const hoodiesCat = categories.find(c => c.id === 'hoodies');
  const tshirtsCat = categories.find(c => c.id === 'tshirts');
  const sweatpantsCat = categories.find(c => c.id === 'sweatpants');
  const customCategories = categories.filter(c => c.id !== 'hoodies' && c.id !== 'tshirts' && c.id !== 'sweatpants');

  const getCategoryTitle = (catId) => {
    const found = categories.find(c => c.id === catId);
    if (found) return getLocalized(found, 'name') || found.name_en;
    if (catId === 'hoodies') return language === 'ar' ? 'هوديز' : 'Hoodies';
    if (catId === 'tshirts') return language === 'ar' ? 'تيشرتات' : 'T-Shirts';
    if (catId === 'sweatpants') return language === 'ar' ? 'سويت بانتس' : 'Sweatpants';
    return catId;
  };

  return (
    <div id="top" className="min-h-screen bg-[#f8f7f4] text-[#121216] flex flex-col relative selection:bg-black selection:text-white font-sans">
      
      {/* 1. Header / Navbar */}
      <Navbar />

      {/* Floating Admin Trigger Button for Quick Live Editing */}
      <div className="fixed bottom-6 start-6 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-2 bg-black hover:bg-neutral-800 text-white border border-white/20 px-4 py-3 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-105"
          title="فتح لوحة التحكم"
        >
          <Sliders size={18} className="text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-black uppercase tracking-wider font-sans">
            {language === 'ar' ? 'تحكم بالواجهة (CMS)' : 'Admin CMS'}
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
                <span className="text-xs font-sans text-neutral-500 uppercase">
                  {language === 'ar' ? 'القسم الحالي:' : 'CATEGORY:'}
                </span>
                <span className="text-xl font-black font-display uppercase text-black bg-white px-3.5 py-1 border border-[#dedcd4] shadow-sm">
                  {getCategoryTitle(activeCategory)}
                </span>
              </div>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-xs font-bold font-sans text-neutral-600 hover:text-black underline uppercase"
              >
                {language === 'ar' ? '← عرض كافة الأقسام والصفحة الرئيسية' : '← View All Categories'}
              </button>
            </div>

            {activeCategory === 'hoodies' && isVisible('hoodiesProducts') && (
              <ProductSection
                id="hoodies"
                category="hoodies"
                title={getLocalized(hoodiesCat, 'name') || getLocalized(sectionHeaders?.hoodies, 'title') || "HOODIES"}
                subtitle={getLocalized(hoodiesCat, 'subtitle') || getLocalized(sectionHeaders?.hoodies, 'subtitle')}
                viewAllText={getLocalized(hoodiesCat, 'viewAllText') || getLocalized(sectionHeaders?.hoodies, 'viewAllText')}
                limit={16}
              />
            )}

            {activeCategory === 'tshirts' && isVisible('tshirtsProducts') && (
              <ProductSection
                id="tshirts"
                category="tshirts"
                title={getLocalized(tshirtsCat, 'name') || getLocalized(sectionHeaders?.tshirts, 'title') || "T-SHIRTS"}
                subtitle={getLocalized(tshirtsCat, 'subtitle') || getLocalized(sectionHeaders?.tshirts, 'subtitle')}
                viewAllText={getLocalized(tshirtsCat, 'viewAllText') || getLocalized(sectionHeaders?.tshirts, 'viewAllText')}
                limit={16}
              />
            )}

            {activeCategory === 'sweatpants' && isVisible('sweatpantsProducts') && (
              <ProductSection
                id="sweatpants"
                category="sweatpants"
                title={getLocalized(sweatpantsCat, 'name') || getLocalized(sectionHeaders?.sweatpants, 'title') || "SWEATPANTS"}
                subtitle={getLocalized(sweatpantsCat, 'subtitle') || getLocalized(sectionHeaders?.sweatpants, 'subtitle')}
                viewAllText={getLocalized(sweatpantsCat, 'viewAllText') || getLocalized(sectionHeaders?.sweatpants, 'viewAllText')}
                limit={16}
              />
            )}

            {/* Custom Category Filtered View */}
            {customCategories.some(c => c.id === activeCategory) && (() => {
              const currentCat = customCategories.find(c => c.id === activeCategory);
              return (
                <div>
                  {currentCat.bannerImage && currentCat.showBanner !== false && (
                    <DynamicCategoryBanner category={currentCat} />
                  )}
                  <ProductSection
                    id={currentCat.id}
                    category={currentCat.id}
                    title={getLocalized(currentCat, 'name') || currentCat.name_en}
                    subtitle={getLocalized(currentCat, 'subtitle')}
                    viewAllText={getLocalized(currentCat, 'viewAllText')}
                    limit={16}
                  />
                </div>
              );
            })()}
          </div>
        ) : (
          /* FULL LAYOUT - ALL ROWS CONDITIONALLY RENDERED WITH VISIBILITY CONTROLS */
          <>
            {/* ROW 1: Hero Hoodies Banner */}
            {isVisible('heroHoodies') && <HeroHoodies />}

            {/* ROW 2: 3-Card Category Feature Grid */}
            {isVisible('categoryGrid') && <CategoryFeatureGrid />}

            {/* ROW 3: Hoodies Products Section (8 Products) */}
            {isVisible('hoodiesProducts') && (
              <ProductSection
                id="hoodies"
                category="hoodies"
                title={getLocalized(hoodiesCat, 'name') || getLocalized(sectionHeaders?.hoodies, 'title') || "HOODIES"}
                subtitle={getLocalized(hoodiesCat, 'subtitle') || getLocalized(sectionHeaders?.hoodies, 'subtitle')}
                viewAllText={getLocalized(hoodiesCat, 'viewAllText') || getLocalized(sectionHeaders?.hoodies, 'viewAllText')}
                limit={8}
              />
            )}

            {/* ROW 4: T-Shirts Cinematic Banner */}
            {isVisible('heroTshirts') && <HeroTshirts />}

            {/* ROW 5: T-Shirts Products Section (4 Products) */}
            {isVisible('tshirtsProducts') && (
              <ProductSection
                id="tshirts"
                category="tshirts"
                title={getLocalized(tshirtsCat, 'name') || getLocalized(sectionHeaders?.tshirts, 'title') || "T-SHIRTS"}
                subtitle={getLocalized(tshirtsCat, 'subtitle') || getLocalized(sectionHeaders?.tshirts, 'subtitle')}
                viewAllText={getLocalized(tshirtsCat, 'viewAllText') || getLocalized(sectionHeaders?.tshirts, 'viewAllText')}
                limit={4}
              />
            )}

            {/* ROW 6: Sweatpants Urban Banner */}
            {isVisible('heroSweatpants') && <HeroSweatpants />}

            {/* ROW 7: Sweatpants Products Section (8 Products) */}
            {isVisible('sweatpantsProducts') && (
              <ProductSection
                id="sweatpants"
                category="sweatpants"
                title={getLocalized(sweatpantsCat, 'name') || getLocalized(sectionHeaders?.sweatpants, 'title') || "SWEATPANTS"}
                subtitle={getLocalized(sweatpantsCat, 'subtitle') || getLocalized(sectionHeaders?.sweatpants, 'subtitle')}
                viewAllText={getLocalized(sweatpantsCat, 'viewAllText') || getLocalized(sectionHeaders?.sweatpants, 'viewAllText')}
                limit={8}
              />
            )}

            {/* DYNAMIC CUSTOM CATEGORY BLOCKS (User-Added Rows & Categories) */}
            {customCategories.map(cat => {
              const showBanner = isVisible(`hero_${cat.id}`) && isVisible(`${cat.id}Banner`) && cat.showBanner !== false;
              const showProducts = isVisible(`products_${cat.id}`) && isVisible(`${cat.id}Products`) && cat.showProducts !== false;
              return (
                <React.Fragment key={cat.id}>
                  {showBanner && <DynamicCategoryBanner category={cat} />}
                  {showProducts && (
                    <ProductSection
                      id={cat.id}
                      category={cat.id}
                      title={getLocalized(cat, 'name') || cat.name_en}
                      subtitle={getLocalized(cat, 'subtitle')}
                      viewAllText={getLocalized(cat, 'viewAllText')}
                      limit={8}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {/* ROW 8: Super Sale with Interactive Live Countdown */}
            {isVisible('superSale') && <SuperSaleSection />}

            {/* ROW 9: Newsletter Section */}
            {isVisible('newsletter') && <NewsletterSection />}
          </>
        )}

      </main>

      {/* 3. Footer (ROW 10) */}
      {isVisible('footer') && <Footer />}

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
