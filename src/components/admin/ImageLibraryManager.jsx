import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ImageUploader } from '../ImageUploader';
import { Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';

export const ImageLibraryManager = () => {
  const { siteContent, updateBanner, showToast, language } = useStore();
  const { banners = {} } = siteContent;

  const [hoodiesBg, setHoodiesBg] = useState(banners.heroHoodies?.bgImage || '');
  const [tshirtsBg, setTshirtsBg] = useState(banners.heroTshirts?.bgImage || '');
  const [sweatpantsBg, setSweatpantsBg] = useState(banners.heroSweatpants?.bgImage || '');
  const [superSaleBg, setSuperSaleBg] = useState(banners.superSale?.bgImage || '');

  const [savedBanner, setSavedBanner] = useState(null);

  const handleSaveBanner = (bannerKey, bgImage) => {
    updateBanner(bannerKey, { bgImage });
    setSavedBanner(bannerKey);
    setTimeout(() => setSavedBanner(null), 2500);
    showToast(language === 'ar' ? 'تم حفظ وتحديث صورة البنر بالواجهة بنجاح! 💾' : 'Banner image saved! 💾', 'success');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
          <ImageIcon size={22} className="text-cyan-400" />
          <span>مكتبة ورفع وتبديل صور واجهة المتجر (Images Management)</span>
        </h2>
        <p className="text-xs text-gray-400">
          يمكنك استبدال أي صورة في الموقع مباشرة من جهازك (كمبيوتر أو هاتف) مع ضغط تلقائي فائق السرعة، ثم الضغط على زر الحفظ لتثبيتها فوراً.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hoodies Hero Banner */}
        <div className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="text-sm font-bold text-white">صورة بنر الهوديز الرئيسي</h3>
            <button
              onClick={() => handleSaveBanner('heroHoodies', hoodiesBg)}
              className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
                savedBanner === 'heroHoodies' 
                  ? 'bg-emerald-500 text-black font-black' 
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              {savedBanner === 'heroHoodies' ? <CheckCircle2 size={13} /> : <Save size={13} />}
              <span>{savedBanner === 'heroHoodies' ? '✓ تم الحفظ!' : '💾 حفظ الصورة'}</span>
            </button>
          </div>
          <ImageUploader 
            value={hoodiesBg}
            onChange={(url) => setHoodiesBg(url)}
            label="رفع صورة بنر الهوديز:"
            previewHeight="h-44"
          />
        </div>

        {/* T-Shirts Hero Banner */}
        <div className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="text-sm font-bold text-white">صورة بنر التيشرتات الصيفي</h3>
            <button
              onClick={() => handleSaveBanner('heroTshirts', tshirtsBg)}
              className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
                savedBanner === 'heroTshirts' 
                  ? 'bg-emerald-500 text-black font-black' 
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              {savedBanner === 'heroTshirts' ? <CheckCircle2 size={13} /> : <Save size={13} />}
              <span>{savedBanner === 'heroTshirts' ? '✓ تم الحفظ!' : '💾 حفظ الصورة'}</span>
            </button>
          </div>
          <ImageUploader 
            value={tshirtsBg}
            onChange={(url) => setTshirtsBg(url)}
            label="رفع صورة بنر التيشرتات:"
            previewHeight="h-44"
          />
        </div>

        {/* Sweatpants Hero Banner */}
        <div className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="text-sm font-bold text-white">صورة بنر السويت بانتس الحضري</h3>
            <button
              onClick={() => handleSaveBanner('heroSweatpants', sweatpantsBg)}
              className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
                savedBanner === 'heroSweatpants' 
                  ? 'bg-emerald-500 text-black font-black' 
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              {savedBanner === 'heroSweatpants' ? <CheckCircle2 size={13} /> : <Save size={13} />}
              <span>{savedBanner === 'heroSweatpants' ? '✓ تم الحفظ!' : '💾 حفظ الصورة'}</span>
            </button>
          </div>
          <ImageUploader 
            value={sweatpantsBg}
            onChange={(url) => setSweatpantsBg(url)}
            label="رفع صورة بنر السويت بانتس:"
            previewHeight="h-44"
          />
        </div>

        {/* Super Sale Banner */}
        <div className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="text-sm font-bold text-white">صورة قسم الخصم والعداد التنازلي</h3>
            <button
              onClick={() => handleSaveBanner('superSale', superSaleBg)}
              className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
                savedBanner === 'superSale' 
                  ? 'bg-emerald-500 text-black font-black' 
                  : 'bg-white hover:bg-neutral-200 text-black'
              }`}
            >
              {savedBanner === 'superSale' ? <CheckCircle2 size={13} /> : <Save size={13} />}
              <span>{savedBanner === 'superSale' ? '✓ تم الحفظ!' : '💾 حفظ الصورة'}</span>
            </button>
          </div>
          <ImageUploader 
            value={superSaleBg}
            onChange={(url) => setSuperSaleBg(url)}
            label="رفع صورة قسم العروض:"
            previewHeight="h-44"
          />
        </div>
      </div>
    </div>
  );
};