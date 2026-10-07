import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Clock, Sparkles, Flame, Check } from 'lucide-react';

/**
 * 1. Main Hero: Hoodies
 */
export const HeroHoodies = () => {
  const { siteContent, setActiveCategory } = useStore();
  const banner = siteContent.banners?.heroHoodies;

  if (!banner || !banner.enabled) return null;

  return (
    <section id="hoodies-hero" className="relative w-full h-[78vh] min-h-[520px] max-h-[850px] bg-black overflow-hidden flex items-center justify-center">
      {/* Background Image with Streetwear Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image} 
          alt={banner.title}
          className="w-full h-full object-cover object-top opacity-75 transform scale-105 transition-transform duration-1000 ease-out hover:scale-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center flex flex-col items-center">
        {banner.badge && (
          <span className="inline-block bg-white text-black text-[11px] font-black tracking-[0.25em] px-3.5 py-1 mb-4 uppercase rounded-sm shadow-lg">
            {banner.badge}
          </span>
        )}

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase font-display tracking-tight text-white mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          {banner.title}
        </h1>

        <p className="text-sm sm:text-base font-medium tracking-[0.15em] text-gray-300 max-w-xl mb-8 uppercase font-mono">
          {banner.subtitle}
        </p>

        <a
          href={banner.buttonLink || "#hoodies"}
          onClick={() => setActiveCategory('hoodies')}
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase px-8 py-4 rounded-none transition-all duration-300 transform hover:-translate-y-0.5 shadow-2xl"
        >
          <span>{banner.buttonText}</span>
          <ArrowRight size={16} />
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
  const { siteContent, setActiveCategory } = useStore();
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
            src={grid.card1?.image} 
            alt={grid.card1?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block mb-1">
              {grid.card1?.subtitle}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-display mb-3">
              {grid.card1?.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:underline">
              {grid.card1?.buttonText} <ArrowRight size={14} />
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
              src={grid.card2?.image} 
              alt={grid.card2?.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block mb-1">
                {grid.card2?.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-display mb-2">
                {grid.card2?.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:underline">
                {grid.card2?.buttonText} <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* Card 3: Baggy Sweats */}
          <div 
            onClick={() => setActiveCategory('sweatpants')}
            className="group relative overflow-hidden rounded-sm bg-neutral-900 cursor-pointer h-[240px] md:h-full border border-white/5"
          >
            <img 
              src={grid.card3?.image} 
              alt={grid.card3?.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block mb-1">
                {grid.card3?.subtitle}
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-display mb-2">
                {grid.card3?.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:underline">
                {grid.card3?.buttonText} <ArrowRight size={14} />
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
  const { siteContent, setActiveCategory } = useStore();
  const banner = siteContent.banners?.heroTshirts;

  if (!banner || !banner.enabled) return null;

  return (
    <section id="tshirts-banner" className="relative w-full h-[65vh] min-h-[460px] max-h-[700px] my-14 bg-black overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image} 
          alt={banner.title}
          className="w-full h-full object-cover object-center opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full">
        <div className="max-w-xl">
          {banner.badge && (
            <span className="inline-block bg-white text-black text-[10px] font-black tracking-widest px-3 py-1 mb-3 uppercase rounded-sm">
              {banner.badge}
            </span>
          )}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase font-display tracking-tight text-white mb-2">
            {banner.title}
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-gray-300 uppercase mb-6">
            {banner.subtitle}
          </p>
          <a
            href={banner.buttonLink || "#tshirts"}
            onClick={() => setActiveCategory('tshirts')}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-[0.2em] uppercase px-7 py-3.5 transition-all"
          >
            <span>{banner.buttonText}</span>
            <ArrowRight size={14} />
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
  const { siteContent, setActiveCategory } = useStore();
  const banner = siteContent.banners?.heroSweatpants;

  if (!banner || !banner.enabled) return null;

  return (
    <section id="sweatpants-banner" className="relative w-full h-[65vh] min-h-[460px] max-h-[700px] my-14 bg-black overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image} 
          alt={banner.title}
          className="w-full h-full object-cover object-center opacity-80" 
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full flex justify-end">
        <div className="max-w-xl text-right">
          {banner.badge && (
            <span className="inline-block bg-white text-black text-[10px] font-black tracking-widest px-3 py-1 mb-3 uppercase rounded-sm">
              {banner.badge}
            </span>
          )}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase font-display tracking-tight text-white mb-2">
            {banner.title}
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-gray-300 uppercase mb-6">
            {banner.subtitle}
          </p>
          <a
            href={banner.buttonLink || "#sweatpants"}
            onClick={() => setActiveCategory('sweatpants')}
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-[0.2em] uppercase px-7 py-3.5 transition-all"
          >
            <span>{banner.buttonText}</span>
            <ArrowRight size={14} />
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
  const { siteContent, setActiveCategory } = useStore();
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
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <img 
          src={banner.image} 
          alt={banner.title}
          className="w-full h-full object-cover opacity-30 grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left: Headline */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-rose-500 font-mono text-xs font-bold tracking-widest uppercase mb-3">
              <Flame size={16} />
              <span>{banner.badge || "SPECIAL FLASH DROP"}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase font-display text-white mb-3">
              {banner.title}
            </h2>
            <p className="text-gray-400 font-mono text-xs sm:text-sm tracking-wider uppercase mb-6">
              {banner.subtitle}
            </p>
            <a
              href={banner.buttonLink || "#shop"}
              onClick={() => setActiveCategory('all')}
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-[0.2em] uppercase px-8 py-4 transition-all"
            >
              <span>{banner.buttonText}</span>
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Right: Live Countdown Display */}
          <div className="bg-black/80 border border-white/20 p-6 sm:p-8 rounded-sm backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-center gap-1 text-gray-400 text-xs font-mono tracking-widest uppercase mb-4">
              <Clock size={14} className="text-amber-400" />
              <span>OFFER ENDS IN</span>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-5 text-center">
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-white font-mono">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">
                  DAYS
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-white font-mono">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">
                  HOURS
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-white font-mono">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">
                  MINUTES
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-3xl sm:text-5xl text-rose-500 font-mono">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-1">
                  SECONDS
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
  const { siteContent, showToast } = useStore();
  const banner = siteContent.banners?.newsletter;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!banner || !banner.enabled) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    setSubscribed(true);
    showToast("🎉 Welcome to KESWA SQUAD! 10% coupon code: KESWA10", "success");
  };

  return (
    <section className="relative w-full py-20 bg-[#0a0a0c] overflow-hidden border-t border-white/10 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <span className="inline-block text-[11px] font-mono tracking-[0.3em] uppercase text-gray-400 mb-2">
          {banner.badgeText || "STREET CULTURE"}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white mb-2">
          {banner.title}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm font-mono tracking-wider uppercase mb-8">
          {banner.subtitle}
        </p>

        {subscribed ? (
          <div className="bg-neutral-900 border border-white/20 p-4 rounded-sm flex items-center justify-center gap-2 text-sm text-green-400 font-mono">
            <Check size={18} />
            <span>YOU ARE IN! USE CODE <strong className="text-white">KESWA10</strong> AT CHECKOUT.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={banner.placeholder}
              required
              className="w-full bg-[#16161d] border border-white/20 px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-white transition-colors"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black font-black text-xs tracking-widest uppercase px-6 py-3 transition-colors shrink-0"
            >
              {banner.buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
