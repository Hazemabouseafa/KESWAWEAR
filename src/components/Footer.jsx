import React from 'react';
import { useStore } from '../context/StoreContext';
import { KeswaLogo } from './KeswaLogo';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

export const Footer = () => {
  const { siteContent, setActiveCategory, setIsTrackOrderOpen, getLocalized, language, t } = useStore();
  const { footer, brand } = siteContent;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const aboutText = getLocalized(footer, 'about');
  const copyrightText = getLocalized(footer, 'copyright');
  const addressText = getLocalized(footer, 'address');

  return (
    <footer className="bg-[#070709] border-t border-white/10 pt-16 pb-12 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Centerpiece */}
        <div className="flex flex-col items-center justify-center pb-12 border-b border-white/10 text-center">
          <div className="mb-4">
            <KeswaLogo variant="full" size="lg" />
          </div>
          <p className="max-w-xl text-xs sm:text-sm font-sans text-gray-400 mt-2 leading-relaxed">
            {aboutText}
          </p>
        </div>

        {/* 4 Columns Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/10 text-xs font-sans">
          
          {/* Col 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-display">
              {t('footer.collections')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#hoodies" 
                  onClick={() => setActiveCategory('hoodies')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.hoodies')}
                </a>
              </li>
              <li>
                <a 
                  href="#tshirts" 
                  onClick={() => setActiveCategory('tshirts')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.tshirts')}
                </a>
              </li>
              <li>
                <a 
                  href="#sweatpants" 
                  onClick={() => setActiveCategory('sweatpants')}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.sweatpants')}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-display">
              {t('footer.customerCare')}
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">{t('footer.shippingPolicy')}</li>
              <li className="hover:text-white transition-colors cursor-pointer">{t('footer.returnPolicy')}</li>
              <li className="hover:text-white transition-colors cursor-pointer">{t('footer.sizeGuide')}</li>
              <li onClick={() => setIsTrackOrderOpen(true)} className="hover:text-amber-300 text-amber-400 font-bold transition-colors cursor-pointer flex items-center gap-1.5">
                <span>📦</span>
                <span>{t('footer.trackOrder')}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-display">
              {t('footer.getInTouch')}
            </h4>
            <ul className="space-y-2 text-[11px] font-sans">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-gray-300 shrink-0" />
                <span className="font-mono">{footer?.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-gray-300 shrink-0" />
                <span className="font-mono">{footer?.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-gray-300 shrink-0" />
                <span>{addressText}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Social */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-display">
              {language === 'ar' ? 'تابعنا على منصاتنا' : 'FOLLOW US'}
            </h4>
            <div className="flex gap-3 text-white">
              {footer?.social?.instagram && (
                <a 
                  href={footer.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-neutral-900 border border-white/10 hover:border-white transition-colors" 
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {footer?.social?.facebook && (
                <a 
                  href={footer.social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-neutral-900 border border-white/10 hover:border-white transition-colors" 
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
              {footer?.social?.tiktok && (
                <a 
                  href={footer.social.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 bg-neutral-900 border border-white/10 hover:border-white transition-colors" 
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <TikTokIcon />
                </a>
              )}
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed pt-1">
              {language === 'ar' ? 'أحدث صيحات الستريت وير المصري بجودة عالمية.' : 'Premium Egyptian streetwear designed for daily expression.'}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-gray-500 gap-4">
          <div>
            {copyrightText}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">الدفع عند الاستلام • Visa • InstaPay</span>
            <button 
              onClick={scrollToTop}
              className="p-2 bg-neutral-900 text-gray-300 hover:text-white border border-white/10 transition-colors"
              title="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
