import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ArrowLeft, Clock, Sparkles, Flame, Check } from 'lucide-react';

/**
 * 1. Main Hero: Hoodies
 */
export const HeroHoodies = () => {
  const { siteContent, setActiveCategory, getLocalized, language } = useStore();
  const banner = siteContent.banners?.heroHoodies;

  if (!banner || !banner.enabled) return null;

  const title = getLocalized(banner, 'title');
  const subtitle = getLocalized(banner, 'subtitle');
  const badge = getLocalized(banner, 'badge');
  const buttonText = getLocalized(banner, 'buttonText');

  return (
    <section id="hoodies-hero" className="relative w-full h-[75vh] min-h-[440px] sm:min-h-[540px] max-h-[850px] bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image with Streetwear Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image || banner.bgImage} 
          alt={title}
          className="w-full h-full object-cover object-top opacity-75 transform scale-105 transition-transform duration-1000 ease-out hover:scale-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
        {badge && (
          <span className="inline-block bg-white text-black text-[10px] sm:text-[11px] font-black tracking-widest px-3 sm:px-3.5 py-1 mb-3 sm:mb-4 uppercase rounded-sm shadow-lg font-sans">
            {badge}
          </span>
        )}

        <h1 className="text-3xl sm:text-6xl md:text-8xl font-black uppercase font-display tracking-tight text-white mb-2.5 sm:mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] leading-[1.1]">
          {title}
        </h1>

        <p className="text-xs sm:text-base font-medium tracking-wide text-gray-300 max-w-xl mb-6 sm:mb-8 uppercase font-sans">
          {subtitle}
        </p>

        <a
          href={banner.buttonLink || "#hoodies"}
          onClick={() => setActiveCategory('hoodies')}
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-none transition-all duration-300 transform hover:-translate-y-0.5 shadow-2xl active:scale-95 touch-manipulation"
        >
          <span>{buttonText}</span>
          {language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </a>
      </div>

      {/* Subtle Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0c] to-transparent z-10" />
    </section>
  );
};

/**
 * 2. Category Feature 3-Card Masonry Grid (Matching Image 1)
 */
export const CategoryFeatureGrid = () => {
  const { siteContent, setActiveCategory, getLocalized, language } = useStore();
  const grid = siteContent.banners?.categoryGrid;

  if (!grid || !grid.enabled) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[550px]">
        
        {/* Large Left Card: Oversized Hoodies */}
        <div 
          onClick={() => setActiveCategory('hoodies')}
          className="group relative overflow-hidden rounded-sm bg-neutral-900 cursor-pointer h-[320px] md:h-full border border-white/5"
        >
          <img 
            src={grid.card1?.image || grid.card1?.bgImage} 
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rtl:text-right">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block mb-1">
              {getLocalized(grid.card1, 'subtitle')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-display mb-3">
              {getLocalized(grid.card1, 'title')}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:underline">
              <span>{getLocalized(grid.card1, 'buttonText')}</span>
              {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </span>
          </div>
        </div>

        {/* Right Stacked 2 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 h-auto md:h-full">
          
          {/* Card 2: Polo Tees */}
          <div 
            onClick={() => setActiveCategory('tshirts')}
            className="group relative overflow-hidden rounded-sm bg-neutral-900 cursor-pointer h-[240px] md:h-full border border-white/5"
          >
            <img 
              src={grid.card2?.image || grid.card2?.bgImage} 
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rtl:text-right">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block mb-1">
                {getLocalized(grid.card2, 'subtitle')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-display mb-2">
                {getLocalized(grid.card2, 'title')}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:underline">
                <span>{getLocalized(grid.card2, 'buttonText')}</span>
                {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </span>
            </div>
          </div>

          {/* Card 3: Baggy Sweats */}
          <div 
            onClick={() => setActiveCategory('sweatpants')}
            className="group relative overflow-hidden rounded-sm bg-neutral-900 cursor-pointer h-[240px] md:h-full border border-white/5"
          >
            <img 
              src={grid.card3?.image || grid.card3?.bgImage} 
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rtl:text-right">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block mb-1">
                {getLocalized(grid.card3, 'subtitle')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-display mb-2">
                {getLocalized(grid.card3, 'title')}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:underline">
                <span>{getLocalized(grid.card3, 'buttonText')}</span>
                {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

/**
 * 3. T-Shirts Cinematic Banner
 */
export const HeroTshirts = () => {
  const { siteContent, setActiveCategory, getLocalized, language } = useStore();
  const banner = siteContent.banners?.heroTshirts;

  if (!banner || !banner.enabled) return null;

  return (
    <section id="tshirts-banner" className="relative w-full h-[60vh] sm:h-[65vh] min-h-[380px] sm:min-h-[460px] max-h-[700px] my-8 sm:my-14 bg-black overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image || banner.bgImage} 
          alt=""
          className="w-full h-full object-cover object-center opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-l" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-12 w-full">
        <div className="max-w-xl">
          {banner.badge && (
            <span className="inline-block bg-white text-black text-[10px] font-black tracking-widest px-3 py-1 mb-2.5 sm:mb-3 uppercase rounded-sm">
              {getLocalized(banner, 'badge')}
            </span>
          )}
          <h2 className="text-2xl sm:text-5xl md:text-7xl font-black uppercase font-display tracking-tight text-white mb-2 leading-tight">
            {getLocalized(banner, 'title')}
          </h2>
          <p className="text-xs sm:text-sm font-sans tracking-wide text-gray-300 uppercase mb-5 sm:mb-6">
            {getLocalized(banner, 'subtitle')}
          </p>
          <a
            href={banner.buttonLink || "#tshirts"}
            onClick={() => setActiveCategory('tshirts')}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-wider uppercase px-6 sm:px-7 py-3 sm:py-3.5 transition-all active:scale-95 touch-manipulation"
          >
            <span>{getLocalized(banner, 'buttonText')}</span>
            {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </a>
        </div>
      </div>
    </section>
  );
};

/**
 * 4. Sweatpants Urban Banner
 */
export const HeroSweatpants = () => {
  const { siteContent, setActiveCategory, getLocalized, language } = useStore();
  const banner = siteContent.banners?.heroSweatpants;

  if (!banner || !banner.enabled) return null;

  return (
    <section id="sweatpants-banner" className="relative w-full h-[60vh] sm:h-[65vh] min-h-[380px] sm:min-h-[460px] max-h-[700px] my-8 sm:my-14 bg-black overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image || banner.bgImage} 
          alt=""
          className="w-full h-full object-cover object-center opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent rtl:bg-gradient-to-r" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-12 w-full flex justify-end rtl:justify-start">
        <div className="max-w-xl text-right rtl:text-left">
          {banner.badge && (
            <span className="inline-block bg-white text-black text-[10px] font-black tracking-widest px-3 py-1 mb-2.5 sm:mb-3 uppercase rounded-sm">
              {getLocalized(banner, 'badge')}
            </span>
          )}
          <h2 className="text-2xl sm:text-5xl md:text-7xl font-black uppercase font-display tracking-tight text-white mb-2 leading-tight">
            {getLocalized(banner, 'title')}
          </h2>
          <p className="text-xs sm:text-sm font-sans tracking-wide text-gray-300 uppercase mb-5 sm:mb-6">
            {getLocalized(banner, 'subtitle')}
          </p>
          <a
            href={banner.buttonLink || "#sweatpants"}
            onClick={() => setActiveCategory('sweatpants')}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-wider uppercase px-6 sm:px-7 py-3 sm:py-3.5 transition-all active:scale-95 touch-manipulation"
          >
            <span>{getLocalized(banner, 'buttonText')}</span>
            {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </a>
        </div>
      </div>
    </section>
  );
};

/**
 * 5. Super Sale Section with Real-Time Interactive Countdown
 */
export const SuperSaleSection = () => {
  const { siteContent, setActiveCategory, getLocalized, language, t } = useStore();
  const banner = siteContent.banners?.superSale;

  const [timeLeft, setTimeLeft] = useState({
    days: '05',
    hours: '07',
    minutes: '49',
    seconds: '53'
  });

  useEffect(() => {
    if (!banner?.targetDate) return;

    const calculateTime = () => {
      const target = new Date(banner.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [banner?.targetDate]);

  if (!banner || !banner.enabled) return null;

  return (
    <section id="sale" className="relative w-full py-20 my-16 bg-[#0e0e12] overflow-hidden border-y border-white/10">
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image} 
          alt=""
          className="w-full h-full object-cover opacity-30 grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-xl text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center gap-1.5 text-rose-500 font-sans text-xs font-bold tracking-widest uppercase mb-3">
              <Flame size={16} />
              <span>{getLocalized(banner, 'badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase font-display text-white mb-3">
              {getLocalized(banner, 'title')}
            </h2>
            <p className="text-gray-400 font-sans text-xs sm:text-sm tracking-wide uppercase mb-6">
              {getLocalized(banner, 'subtitle')}
            </p>
            <a
              href={banner.buttonLink || "#shop"}
              onClick={() => setActiveCategory('all')}
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-wider uppercase px-8 py-4 transition-all"
            >
              <span>{getLocalized(banner, 'buttonText')}</span>
              {language === 'ar' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
            </a>
          </div>

          {/* Countdown Display */}
          <div className="bg-black/80 border border-white/20 p-6 sm:p-8 rounded-sm backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs font-sans tracking-wide uppercase mb-4">
              <Clock size={14} className="text-amber-400" />
              <span>{t('countdown.offerEndsIn')}</span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-5 text-center">
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-white font-mono">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 mt-1 font-sans">
                  {t('countdown.days')}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-white font-mono">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 mt-1 font-sans">
                  {t('countdown.hours')}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-white font-mono">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 mt-1 font-sans">
                  {t('countdown.minutes')}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-rose-500 font-mono">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 mt-1 font-sans">
                  {t('countdown.seconds')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

/**
 * 6. Newsletter Subscription Section
 */
export const NewsletterSection = () => {
  const { siteContent, showToast, getLocalized, t } = useStore();
  const banner = siteContent.banners?.newsletter;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!banner || !banner.enabled) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast("يرجى إدخال بريد إلكتروني صحيح", "error");
      return;
    }
    setSubscribed(true);
    showToast("🎉 مرحباً بك في عائلة كسوة! كود الخصم: KESWA10", "success");
  };

  return (
    <section className="relative w-full py-20 bg-[#0a0a0c] overflow-hidden border-t border-white/10 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <span className="inline-block text-[11px] font-mono tracking-widest uppercase text-gray-400 mb-2">
          {getLocalized(banner, 'badgeText') || t('newsletter.badge')}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white mb-2">
          {getLocalized(banner, 'title')}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm font-sans tracking-wide uppercase mb-8">
          {getLocalized(banner, 'subtitle')}
        </p>

        {subscribed ? (
          <div className="bg-neutral-900 border border-white/20 p-4 rounded-sm flex items-center justify-center gap-2 text-sm text-green-400 font-sans">
            <Check size={18} />
            <span>{t('newsletter.successMsg')} <strong className="text-white">KESWA10</strong></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={getLocalized(banner, 'placeholder') || "Enter email..."}
              required
              className="w-full bg-[#16161d] border border-white/20 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-white transition-colors"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black font-black text-xs tracking-wider uppercase px-6 py-3 transition-colors shrink-0"
            >
              {getLocalized(banner, 'buttonText')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

/**
 * 7. Dynamic Category Banner for Custom User-Added Blocks
 */
export const DynamicCategoryBanner = ({ category }) => {
  const { setActiveCategory, getLocalized, language } = useStore();
  if (!category) return null;
  const bannerImg = category.bannerImage || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop';
  const title = getLocalized(category, 'name') || category.name_en;
  const subtitle = getLocalized(category, 'subtitle');
  const badge = getLocalized(category, 'badge') || (language === 'ar' ? 'تشكيلة مميزة' : 'EXCLUSIVE DROP');
  const buttonText = getLocalized(category, 'buttonText') || (language === 'ar' ? 'تسوق التشكيلة' : 'SHOP NOW');

  return (
    <section id={`${category.id}-hero`} className="relative w-full h-[60vh] sm:h-[65vh] min-h-[380px] sm:min-h-[460px] max-h-[750px] bg-black overflow-hidden flex items-center justify-center my-6 sm:my-10">
      <div className="absolute inset-0 z-0">
        <img 
          src={bannerImg} 
          alt={title}
          className="w-full h-full object-cover object-center opacity-80 transform scale-105 transition-transform duration-1000 ease-out hover:scale-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/35 to-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        {badge && (
          <span className="inline-block bg-white text-black text-[10px] sm:text-[11px] font-black tracking-widest px-3 sm:px-3.5 py-1 mb-2.5 sm:mb-3 uppercase rounded-sm shadow-lg font-sans">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-5xl md:text-7xl font-black uppercase font-display tracking-tight text-white mb-2.5 sm:mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm font-medium tracking-wide text-gray-300 max-w-xl mb-5 sm:mb-6 uppercase font-sans">
            {subtitle}
          </p>
        )}
        <a
          href={`#${category.id}`}
          onClick={() => setActiveCategory(category.id)}
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-7 py-3 sm:py-3.5 rounded-none transition-all duration-300 shadow-2xl active:scale-95 touch-manipulation"
        >
          <span>{buttonText}</span>
          {language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </a>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8f7f4] to-transparent z-10" />
    </section>
  );
};

