import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ToggleRight, ToggleLeft, Save, CheckCircle2 } from 'lucide-react';

export const RowsVisibilityManager = () => {
  const { siteContent, saveSectionsVisibility, showToast, language } = useStore();
  const { sectionsVisibility = {}, categories = [] } = siteContent;

  const [visibility, setVisibility] = useState({ ...sectionsVisibility });
  const [isSaved, setIsSaved] = useState(false);

  const customCategories = categories.filter(c => c.id !== 'hoodies' && c.id !== 'tshirts' && c.id !== 'sweatpants');

  const coreRowsList = [
    { key: 'announcement', name: 'شريط الإعلانات العلوي', desc: 'شريط الشحن المجاني والرسائل الترحيبية أعلى الصفحة' },
    { key: 'heroHoodies', name: 'بنر الهوديز الرئيسي الأول', desc: 'البنر العريض للهوديز مع زر Shop Collection' },
    { key: 'categoryGrid', name: 'شبكة الفئات الثلاثية (3 كروت)', desc: 'الكروت البارزة للهوديز وبولو تيز والسويت بانتس' },
    { key: 'hoodiesProducts', name: 'صف منتجات الهوديز', desc: 'شبكة عرض منتجات الهوديز مع الأسعار والألوان' },
    { key: 'heroTshirts', name: 'بنر التيشرتات الصيفي السينمائي', desc: 'بنر تيشيرت بوسطن مع خلفية المدينة الساحلية' },
    { key: 'tshirtsProducts', name: 'صف منتجات التيشرتات', desc: 'شبكة منتجات التيشرتات البولو والكامو والوافل' },
    { key: 'heroSweatpants', name: 'بنر السويت بانتس الحضري', desc: 'بنر السويت بانتس الرمادي الواسع بجوار الجدار' },
    { key: 'sweatpantsProducts', name: 'صف منتجات السويت بانتس', desc: 'شبكة منتجات بناطيل الفليس والكارجو' },
    { key: 'newsletter', name: 'قسم النادي البريدي (Newsletter)', desc: 'صندوق الاشتراك بالبريد وعضوية النادي الحصري' },
    { key: 'footer', name: 'الفوتر الكامل أسفل الموقع', desc: 'بيانات التواصل وروابط الفئات وحقوق النشر' }
  ];

  // Dynamic custom rows for added categories
  const dynamicRowsList = [];
  customCategories.forEach(cat => {
    dynamicRowsList.push({
      key: `hero_${cat.id}`,
      name: `بنر قسم: ${cat.name_ar || cat.name_en}`,
      desc: `البنر العريض المخصص لقسم ${cat.name_ar}`
    });
    dynamicRowsList.push({
      key: `products_${cat.id}`,
      name: `صف منتجات: ${cat.name_ar || cat.name_en}`,
      desc: `شبكة منتجات قسم ${cat.name_ar}`
    });
  });

  const allRows = [...coreRowsList, ...dynamicRowsList];

  const handleToggle = (key) => {
    setVisibility(prev => ({
      ...prev,
      [key]: prev[key] === false ? true : false
    }));
    setIsSaved(false);
  };

  const handleSaveAll = () => {
    saveSectionsVisibility(visibility);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white mb-1 flex items-center gap-2">
            <ToggleRight size={20} className="text-emerald-400 shrink-0" />
            <span>التحكم في ظهور وإخفاء صفوف وأقسام الموقع (Rows Visibility)</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400">
            يمكنك تفعيل أو إخفاء أي صف (ROW) في واجهة المتجر بنقرة واحدة ثم حفظ الإعدادات لتثبيتها فوراً.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className={`w-full sm:w-auto text-xs px-5 py-2.5 rounded flex items-center justify-center gap-1.5 font-black transition-all shadow-lg touch-manipulation ${
            isSaved 
              ? 'bg-emerald-500 text-black' 
              : 'bg-white hover:bg-neutral-200 text-black'
          }`}
        >
          {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          <span>{isSaved ? '✓ تم حفظ الصفوف!' : '💾 حفظ وتثبيت ظهور الصفوف'}</span>
        </button>
      </div>

      {/* Grid of Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {allRows.map(row => {
          const isShown = visibility[row.key] !== false;
          return (
            <div 
              key={row.key}
              onClick={() => handleToggle(row.key)}
              className={`p-3.5 sm:p-4 rounded border transition-all cursor-pointer flex items-center justify-between select-none shadow-md touch-manipulation active:scale-[0.99] ${
                isShown 
                  ? 'bg-[#181822] border-emerald-500/30 hover:border-emerald-500' 
                  : 'bg-[#121217] border-white/5 opacity-60 hover:opacity-100'
              }`}
            >
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{row.name}</span>
                  {isShown ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      ظاهر بالواجهة
                    </span>
                  ) : (
                    <span className="text-[10px] bg-neutral-800 text-gray-400 px-2 py-0.5 rounded">
                      مخفي
                    </span>
                  )}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{row.desc}</p>
              </div>

              <div className="shrink-0 mr-3">
                {isShown ? (
                  <ToggleRight size={30} className="text-emerald-400" />
                ) : (
                  <ToggleLeft size={30} className="text-gray-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
