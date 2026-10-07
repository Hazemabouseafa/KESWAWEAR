import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { KeswaLogo } from './KeswaLogo';
import { ShoppingBag, Search, Heart, Sliders, Menu, X, Globe } from 'lucide-react';

export const Navbar = () => {
  const { 
    siteContent, 
    cartItemsCount, 
    setIsCartOpen, 
    setIsAdminOpen, 
    wishlist,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    language,
    toggleLanguage,
    t,
    getLocalized
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { announcement, brand, navigation } = siteContent;

  const handleNavClick = (navId, link) => {
    setActiveCategory(navId === 'shop' ? 'all' : navId);
    setMobileMenuOpen(false);

    const target = document.querySelector(link);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const announcementText = getLocalized(announcement, 'text');

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      {announcement?.enabled && (
        <aside aria-label="Announcement" className="bg-[#121217] border-b border-white/10 text-[11px] font-medium tracking-wider text-gray-300 py-1.5 px-4 text-center flex items-center justify-center gap-2 relative z-50">
          <a 
            href={announcement.link || "#sale"} 
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5 font-sans"
          >
            {announcementText}
          </a>
        </aside>
      )}

      {/* Main Glass Navbar */}
      <nav className="glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              {navigation?.map((item) => {
                const label = getLocalized(item, 'label');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.link)}
                    className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300 hover:text-white transition-colors py-2 relative group"
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-white"
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
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <KeswaLogo variant={brand?.logoStyle === 'badge' ? 'badge' : 'inline'} size="md" />
              </a>
            </div>

            {/* Right: Actions (Language Switcher, Search, Wishlist, Cart, Admin) */}
            <div className="flex items-center space-x-2.5 sm:space-x-4 rtl:space-x-reverse">
              
              {/* Language Switcher Button (عربي / EN) */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-gray-200 border border-white/15 px-2.5 py-1.5 rounded text-xs font-bold font-mono transition-all hover:border-white/40"
                title={language === 'ar' ? "Switch to English" : "التحويل للغة العربية"}
              >
                <Globe size={13} className="text-cyan-400" />
                <span className="text-[11px] font-sans">
                  {language === 'ar' ? 'EN' : 'العربية'}
                </span>
              </button>

              {/* Search Toggle / Input */}
              <div className="relative flex items-center">
                {showSearchInput ? (
                  <div className="flex items-center bg-[#1a1a22] border border-white/20 rounded-full px-3 py-1.5">
                    <input 
                      type="text"
                      placeholder={t('nav.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs text-white placeholder-gray-400 outline-none w-32 sm:w-44"
                      autoFocus
                    />
                    <button 
                      onClick={() => setShowSearchInput(false)}
                      className="text-gray-400 hover:text-white ml-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowSearchInput(true)}
                    className="p-2 text-gray-300 hover:text-white transition-colors"
                    title={t('nav.searchPlaceholder')}
                  >
                    <Search size={19} />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <button 
                onClick={() => {
                  const target = document.querySelector('#shop');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative p-2 text-gray-300 hover:text-white transition-colors hidden sm:block"
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
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors group flex items-center"
                title={t('nav.cart')}
              >
                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Admin Panel Toggle Button */}
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-white hover:to-neutral-200 hover:text-black text-gray-300 border border-white/20 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
                title="Open CMS Admin Dashboard"
              >
                <Sliders size={13} className="text-amber-400 group-hover:text-black" />
                <span className="font-sans">لوحة التحكم</span>
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0c10] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            {navigation?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.link)}
                className="block w-full text-left rtl:text-right py-2 text-sm font-bold uppercase tracking-wider text-gray-200 hover:text-white border-b border-white/5"
              >
                {getLocalized(item, 'label')}
              </button>
            ))}
            <div className="pt-2 flex justify-between items-center text-xs text-gray-400">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-white bg-neutral-800 px-3 py-1.5 rounded"
              >
                <Globe size={13} />
                <span>{language === 'ar' ? 'English Language' : 'اللغة العربية'}</span>
              </button>
              <button 
                onClick={() => { setMobileMenuOpen(false); setIsAdminOpen(true); }}
                className="text-white bg-white/10 px-3 py-1.5 rounded font-bold"
              >
                لوحة التحكم
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
