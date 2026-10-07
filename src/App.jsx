import React, { useState, useEffect } from 'react';
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
import { AdminPanel } from './admin/AdminPanel';
import { TrackOrderModal } from './components/TrackOrderModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const { 
    siteContent, 
    activeCategory, 
    setActiveCategory, 
    notification, 
    getLocalized,
    language 
  } = useStore();

  // Robust URL Route State
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  });

  const [currentHash, setCurrentHash] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.location.hash;
  });

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentPath(window.location.pathname);
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateTo = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      setCurrentHash('');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const isAdminRoute = 
    currentPath === '/admin' || 
    currentPath.startsWith('/admin/') || 
    currentPath === '/admin.html' || 
    currentHash === '#admin' || 
    currentHash === '#/admin' || 
    currentHash.startsWith('#/admin/');

  // IF ADMIN ROUTE: RENDER STANDALONE ADMIN PORTAL ONLY (No Storefront, No Overlays)
  if (isAdminRoute) {
    return (
      <AdminPanel onBackToStore={() => navigateTo('/')} />
    );
  }

  // OTHERWISE: RENDER PURE CUSTOMER STOREFRONT (Zero Admin buttons on homepage)
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

            {/* ROW 3: Hoodies Products Section */}
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

            {/* ROW 5: T-Shirts Products Section */}
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

            {/* ROW 7: Sweatpants Products Section */}
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

            {/* DYNAMIC CUSTOM CATEGORY BLOCKS */}
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

            {/* ROW 8: Super Sale */}
            {isVisible('superSale') && <SuperSaleSection />}

            {/* ROW 9: Newsletter Section */}
            {isVisible('newsletter') && <NewsletterSection />}
          </>
        )}

      </main>

      {/* 3. Footer with Admin Portal Link */}
      {isVisible('footer') && <Footer onNavigateAdmin={() => navigateTo('/admin')} />}

      {/* 4. Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />
      <TrackOrderModal />

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
