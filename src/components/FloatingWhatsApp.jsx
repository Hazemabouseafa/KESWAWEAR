import React from 'react';
import { useStore } from '../context/StoreContext';

export const WhatsAppIcon = ({ size = 22, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.08 7.4 8.84 7.66C8.61 7.92 7.96 8.53 7.96 9.77C7.96 11.01 8.87 12.2 9 12.37C9.13 12.54 10.8 15.11 13.35 16.21C13.96 16.47 14.43 16.63 14.8 16.75C15.42 16.95 15.98 16.92 16.42 16.85C16.92 16.78 17.95 16.23 18.16 15.63C18.38 15.03 18.38 14.52 18.31 14.41C18.25 14.3 18.08 14.24 17.83 14.11C17.58 13.98 16.35 13.37 16.12 13.29C15.89 13.2 15.72 13.16 15.56 13.41C15.39 13.66 14.91 14.22 14.76 14.39C14.61 14.56 14.47 14.58 14.22 14.45C13.97 14.32 12.91 13.97 11.66 12.85C10.68 11.98 10.02 10.9 9.89 10.68C9.76 10.46 9.87 10.34 10 10.21C10.11 10.1 10.25 9.92 10.37 9.77C10.5 9.62 10.54 9.51 10.62 9.35C10.7 9.18 10.66 9.04 10.6 8.92C10.54 8.8 10.05 7.6 9.84 7.11C9.64 6.63 9.44 6.69 9.29 6.68C9.14 6.68 8.97 6.67 8.81 6.67" />
  </svg>
);

export const FloatingWhatsApp = () => {
  const { siteContent, language, formatWhatsAppNumber, isAdminOpen } = useStore();

  // If in admin mode or admin route, hide the floating widget
  if (isAdminOpen) return null;
  if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin')) {
    return null;
  }

  const whatsappConfig = siteContent?.whatsapp || {
    enabled: true,
    phone: siteContent?.footer?.whatsapp || '01023456789',
    message_ar: 'مرحباً KESWA WEAR، أود الاستفسار عن تفاصيل الطلب والمنتجات',
    message_en: 'Hello KESWA WEAR, I would like to inquire about products and orders',
    showFloatingButton: true
  };

  // If WhatsApp is toggled OFF by admin, do not render
  if (whatsappConfig.enabled === false) return null;
  if (whatsappConfig.showFloatingButton === false) return null;

  const phone = whatsappConfig.phone || siteContent?.footer?.whatsapp || '01023456789';
  const cleanPhone = formatWhatsAppNumber ? formatWhatsAppNumber(phone) : phone.replace(/[^0-9]/g, '');
  if (!cleanPhone) return null;

  const defaultMessage = language === 'ar' 
    ? (whatsappConfig.message_ar || 'مرحباً KESWA WEAR، أود الاستفسار عن تفاصيل الطلب والمنتجات')
    : (whatsappConfig.message_en || 'Hello KESWA WEAR, I would like to inquire about products and orders');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside 
      aria-label={language === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Support'} 
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 animate-fadeIn select-none"
    >
      <div className="relative group flex items-center">
        {/* Pulse animated ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"></span>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.45)] transition-all duration-300 transform hover:scale-105 active:scale-95 group focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/40"
          title={language === 'ar' ? 'تواصل معنا مباشرة عبر واتساب' : 'Chat with us on WhatsApp'}
        >
          <WhatsAppIcon size={25} className="shrink-0 transition-transform group-hover:rotate-6 drop-shadow-sm" />

          {/* Desktop Call to Action Pill */}
          <span className="hidden sm:inline-block text-xs font-bold font-sans tracking-wide">
            {language === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp'}
          </span>
        </a>
      </div>
    </aside>
  );
};
