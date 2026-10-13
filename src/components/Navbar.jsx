import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { KeswaLogo } from './KeswaLogo';
import { ShoppingBag, Search, Heart, Sliders, Menu, X, Globe } from 'lucide-react';

export const Navbar = () => {
  const { 
    siteContent, 
    cartItemsCount, 
    setIsCartOpen, 
    wishlist,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    language,
    toggleLanguage,
    t,
    getLocalized,
    setIsTrackOrderOpen
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { announcement, brand, navigation, sectionsVisibility } = siteContent;

  const isSubPage = () => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/product') || 
           window.location.pathname.startsWith('/products') || 
           window.location.pathname.startsWith('/checkout') || 
           window.location.hash.includes('product') ||
           window.location.hash.includes('checkout');
  };
  const isCurrentProductPage = isSubPage;

  const handleNavClick = (navId, link) => {
    setActiveCategory(navId === 'shop' ? 'all' : navId);
    setMobileMenuOpen(false);

    const onProduct = isCurrentProductPage();
    if (onProduct) {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    setTimeout(() => {
      const target = document.querySelector(link);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, onProduct ? 120 : 0);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setActiveCategory('all');
    if (isCurrentProductPage()) {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistClick = () => {
    const onProduct = isCurrentProductPage();
    if (onProduct) {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setTimeout(() => {
      const target = document.querySelector('#shop');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, onProduct ? 120 : 0);
  };

  const isAnnouncementVisible = sectionsVisibility?.announcement !== false && announcement?.enabled;
  const announcementText = getLocalized(announcement, 'text');

  return (
    <header className="sticky top-0 z-40 w-full shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* Top Announcement Bar */}
      {isAnnouncementVisible && (
        <aside aria-label="Announcement" className="bg-[#121216] text-[10px] sm:text-[11px] font-medium tracking-wider text-gray-200 py-1.5 px-3 sm:px-4 text-center flex items-center justify-center gap-2 relative z-50">
          <a 
            href={announcement.link || "#sale"} 
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5 font-sans truncate max-w-full"
          >
            {announcementText}
          </a>
        </aside>
      )}

      {/* Main Glass Navbar for Off-White Background */}
      <nav className="glass-nav-light transition-all duration-300 relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              {navigation?.map((item) => {
                const label = getLocalized(item, 'label');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.link)}
                    className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black transition-colors py-2 relative group"
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -m-1 text-neutral-800 hover:text-black touch-manipulation"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex items-center justify-center">
              <a 
                href="#top" 
                className="cursor-pointer py-1"
                onClick={handleLogoClick}
              >
                <KeswaLogo variant={brand?.logoStyle === 'badge' ? 'badge' : 'inline'} size="md" />
              </a>
            </div>

            {/* Right: Actions (Language Switcher, Search, Wishlist, Cart) - 100% Zero Admin */}
            <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
              
              {/* Language Switcher Button (عربي / EN) */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 bg-white hover:bg-neutral-100 text-neutral-800 border border-[#dedcd4] px-2 py-1 sm:px-2.5 sm:py-1.5 rounded text-[11px] font-bold transition-all shadow-sm active:scale-95 touch-manipulation"
                title={language === 'ar' ? "Switch to English" : "التحويل للغة العربية"}
              >
                <Globe size={13} className="text-neutral-600" />
                <span className="font-sans">
                  {language === 'ar' ? 'EN' : 'العربية'}
                </span>
              </button>

              {/* Search Toggle / Input */}
              <div className="relative flex items-center">
                {showSearchInput ? (
                  <div className="flex items-center bg-white border border-[#dedcd4] rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-sm max-w-[130px] sm:max-w-none">
                    <input 
                      type="text"
                      placeholder={t('nav.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs text-neutral-800 placeholder-neutral-400 outline-none w-20 sm:w-44 font-sans"
                      autoFocus
                    />
                    <button 
                      onClick={() => setShowSearchInput(false)}
                      className="text-neutral-400 hover:text-neutral-700 ml-1 text-xs p-1 touch-manipulation"
                      aria-label="Close search"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowSearchInput(true)}
                    className="p-1.5 sm:p-2 text-neutral-700 hover:text-black transition-colors touch-manipulation min-w-[38px] min-h-[38px] flex items-center justify-center rounded-full hover:bg-black/5"
                    title={t('nav.searchPlaceholder')}
                    aria-label={t('nav.searchPlaceholder')}
                  >
                    <Search size={19} />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <button 
                onClick={handleWishlistClick}
                className="relative p-1.5 sm:p-2 text-neutral-700 hover:text-black transition-colors hidden sm:block touch-manipulation"
                title={t('nav.favorites')}
              >
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="relative p-2 sm:p-2.5 text-neutral-700 hover:text-black transition-colors group flex items-center justify-center min-w-[42px] min-h-[42px] touch-manipulation cursor-pointer active:scale-95"
                title={t('nav.cart')}
                aria-label={t('nav.cart')}
              >
                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0.5 end-0.5 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu (Enhanced UX & Zero Admin) */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop to dismiss menu */}
            <div 
              className="lg:hidden fixed inset-0 top-[64px] bg-black/40 backdrop-blur-xs z-30"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="lg:hidden relative z-40 bg-[#f8f7f4] border-b border-[#dedcd4] px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fadeIn">
              {/* Mobile Search Input */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#dedcd4] rounded-full px-4 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 outline-none shadow-xs font-sans focus:border-black"
                />
                <Search size={16} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>

              {/* Category Links */}
              <div className="space-y-1">
                {navigation?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.link)}
                    className="block w-full text-left rtl:text-right py-2.5 px-2 text-sm font-bold uppercase tracking-wider text-neutral-800 hover:text-black hover:bg-black/5 rounded transition-colors"
                  >
                    {getLocalized(item, 'label')}
                  </button>
                ))}
              </div>

              {/* Quick Customer Links with Direct Mobile Cart */}
              <div className="pt-2 border-t border-[#dedcd4] grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-[#dedcd4] text-xs font-bold text-neutral-800 rounded shadow-xs active:bg-neutral-100 touch-manipulation cursor-pointer"
                >
                  <ShoppingBag size={14} className="text-black shrink-0" />
                  <span className="truncate">{language === 'ar' ? 'السلة' : 'Cart'} ({cartItemsCount})</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsTrackOrderOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-[#dedcd4] text-xs font-bold text-neutral-800 rounded shadow-xs active:bg-neutral-100 touch-manipulation cursor-pointer"
                >
                  <span>📦</span>
                  <span className="truncate">{language === 'ar' ? 'تتبع طلبي' : 'Track Order'}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleWishlistClick();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-white border border-[#dedcd4] text-xs font-bold text-neutral-800 rounded shadow-xs active:bg-neutral-100 touch-manipulation cursor-pointer"
                >
                  <Heart size={14} className="text-red-500 shrink-0" />
                  <span className="truncate">{language === 'ar' ? 'المفضلة' : 'Wishlist'} ({wishlist.length})</span>
                </button>
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="pt-2 flex justify-between items-center text-xs text-neutral-600 border-t border-[#dedcd4]">
                <button 
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-center gap-2 text-neutral-800 bg-white border border-[#dedcd4] py-2 px-3 rounded font-bold shadow-xs"
                >
                  <Globe size={14} />
                  <span>{language === 'ar' ? 'Switch to English' : 'التحويل للغة العربية'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};
