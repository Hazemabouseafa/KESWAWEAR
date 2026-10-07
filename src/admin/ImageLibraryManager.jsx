import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ImageUploader } from '../components/ImageUploader';
import { Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';

export const ImageLibraryManager = () => {
  const { siteContent, updateBanner, showToast, language } = useStore();
  const { banners = {} } = siteContent;

  const [hoodiesBg, setHoodiesBg] = useState(banners.heroHoodies?.image || banners.heroHoodies?.bgImage || '');
  const [tshirtsBg, setTshirtsBg] = useState(banners.heroTshirts?.image || banners.heroTshirts?.bgImage || '');
  const [sweatpantsBg, setSweatpantsBg] = useState(banners.heroSweatpants?.image || banners.heroSweatpants?.bgImage || '');

  const [card1Img, setCard1Img] = useState(banners.categoryGrid?.card1?.image || banners.categoryGrid?.card1?.bgImage || '');
  const [card2Img, setCard2Img] = useState(banners.categoryGrid?.card2?.image || banners.categoryGrid?.card2?.bgImage || '');
  const [card3Img, setCard3Img] = useState(banners.categoryGrid?.card3?.image || banners.categoryGrid?.card3?.bgImage || '');

  const [savedBanner, setSavedBanner] = useState(null);

  const handleSaveHeroBanner = (bannerKey, imgUrl) => {
    updateBanner(bannerKey, { image: imgUrl, bgImage: imgUrl });
    setSavedBanner(bannerKey);
    setTimeout(() => setSavedBanner(null), 2500);
    showToast(language === 'ar' ? 'تم حفظ وتحديث صورة البنر بالواجهة بنجاح! 💾' : 'Banner image saved! 💾', 'success');
  };

  const handleSaveGridCard = (cardKey, imgUrl) => {
    const currentGrid = banners.categoryGrid || {};
    const updatedCard = {
      ...(currentGrid[cardKey] || {}),
      image: imgUrl,
      bgImage: imgUrl
    };
    updateBanner('categoryGrid', {
      ...currentGrid,
      [cardKey]: updatedCard
    });
    setSavedBanner(cardKey);
    setTimeout(() => setSavedBanner(null), 2500);
    showToast(language === 'ar' ? 'تم حفظ وتحديث صورة الكارت بالواجهة بنجاح! 💾' : 'Card image saved! 💾', 'success');
  };

  return (
    <div className="max-w-5xl space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg sm:text-xl font-black text-white mb-1 flex items-center gap-2">
          <ImageIcon size={20} className="text-cyan-400 shrink-0" />
          <span>مكتبة ورفع وتبديل صور واجهة المتجر (Images Management)</span>
        </h2>
        <p className="text-[11px] sm:text-xs text-gray-400">
          يمكنك استبدال أي صورة في الموقع مباشرة من جهازك (كمبيوتر أو هاتف) مع ضغط تلقائي فائق السرعة، ثم الضغط على زر الحفظ لتثبيتها فوراً.
        </p>
      </div>

      {/* Main Hero Banners */}
      <div>
        <h3 className="text-sm font-black text-white mb-3">صور البنرات السينمائية الكبرى:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Hoodies Hero Banner */}
          <div className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white">بنر الهوديز الرئيسي</h4>
              <button
                onClick={() => handleSaveHeroBanner('heroHoodies', hoodiesBg)}
                className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
                  savedBanner === 'heroHoodies' 
                    ? 'bg-emerald-500 text-black font-black' 
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {savedBanner === 'heroHoodies' ? <CheckCircle2 size={13} /> : <Save size={13} />}
                <span>{savedBanner === 'heroHoodies' ? '✓ تم الحفظ!' : '💾 حفظ'}</span>
              </button>
            </div>
            <ImageUploader 
              value={hoodiesBg}
              onChange={(url) => setHoodiesBg(url)}
              label="رفع صورة بنر الهوديز:"
              previewHeight="h-32 sm:h-36"
            />
          </div>

          {/* T-Shirts Hero Banner */}
          <div className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white">بنر التيشرتات الصيفي</h4>
              <button
                onClick={() => handleSaveHeroBanner('heroTshirts', tshirtsBg)}
                className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
                  savedBanner === 'heroTshirts' 
                    ? 'bg-emerald-500 text-black font-black' 
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {savedBanner === 'heroTshirts' ? <CheckCircle2 size={13} /> : <Save size={13} />}
                <span>{savedBanner === 'heroTshirts' ? '✓ تم الحفظ!' : '💾 حفظ'}</span>
              </button>
            </div>
            <ImageUploader 
              value={tshirtsBg}
              onChange={(url) => setTshirtsBg(url)}
              label="رفع صورة بنر التيشرتات:"
              previewHeight="h-32 sm:h-36"
            />
          </div>

          {/* Sweatpants Hero Banner */}
          <div className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white">بنر السويت بانتس الحضري</h4>
              <button
                onClick={() => handleSaveHeroBanner('heroSweatpants', sweatpantsBg)}
                className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
                  savedBanner === 'heroSweatpants' 
                    ? 'bg-emerald-500 text-black font-black' 
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {savedBanner === 'heroSweatpants' ? <CheckCircle2 size={13} /> : <Save size={13} />}
                <span>{savedBanner === 'heroSweatpants' ? '✓ تم الحفظ!' : '💾 حفظ'}</span>
              </button>
            </div>
            <ImageUploader 
              value={sweatpantsBg}
              onChange={(url) => setSweatpantsBg(url)}
              label="رفع صورة بنر السويت بانتس:"
              previewHeight="h-32 sm:h-36"
            />
          </div>
        </div>
      </div>

      {/* 3-Card Grid Category Images */}
      <div>
        <h3 className="text-sm font-black text-white mb-3">صور شبكة الفئات الثلاثية البارزة (3-Card Feature Grid):</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Oversized Hoodies */}
          <div className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white">كارت الهوديز الأوفرسايز</h4>
              <button
                onClick={() => handleSaveGridCard('card1', card1Img)}
                className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
                  savedBanner === 'card1' 
                    ? 'bg-emerald-500 text-black font-black' 
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {savedBanner === 'card1' ? <CheckCircle2 size={13} /> : <Save size={13} />}
                <span>{savedBanner === 'card1' ? '✓ تم الحفظ!' : '💾 حفظ'}</span>
              </button>
            </div>
            <ImageUploader 
              value={card1Img}
              onChange={(url) => setCard1Img(url)}
              label="رفع صورة كارت الهوديز:"
              previewHeight="h-32 sm:h-36"
            />
          </div>

          {/* Card 2: Retro Polo Tees */}
          <div className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white">كارت تيشرتات بولو</h4>
              <button
                onClick={() => handleSaveGridCard('card2', card2Img)}
                className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
                  savedBanner === 'card2' 
                    ? 'bg-emerald-500 text-black font-black' 
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {savedBanner === 'card2' ? <CheckCircle2 size={13} /> : <Save size={13} />}
                <span>{savedBanner === 'card2' ? '✓ تم الحفظ!' : '💾 حفظ'}</span>
              </button>
            </div>
            <ImageUploader 
              value={card2Img}
              onChange={(url) => setCard2Img(url)}
              label="رفع صورة كارت التيشرتات:"
              previewHeight="h-32 sm:h-36"
            />
          </div>

          {/* Card 3: Baggy Sweats */}
          <div className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-bold text-white">كارت سويت بانتس باجي</h4>
              <button
                onClick={() => handleSaveGridCard('card3', card3Img)}
                className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
                  savedBanner === 'card3' 
                    ? 'bg-emerald-500 text-black font-black' 
                    : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                {savedBanner === 'card3' ? <CheckCircle2 size={13} /> : <Save size={13} />}
                <span>{savedBanner === 'card3' ? '✓ تم الحفظ!' : '💾 حفظ'}</span>
              </button>
            </div>
            <ImageUploader 
              value={card3Img}
              onChange={(url) => setCard3Img(url)}
              label="رفع صورة كارت السويت بانتس:"
              previewHeight="h-32 sm:h-36"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
