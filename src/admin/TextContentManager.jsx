import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Layout, Save, CheckCircle2 } from 'lucide-react';

export const TextContentManager = () => {
  const { 
    siteContent, 
    saveTexts, 
    updateBanner, 
    updateSectionHeader, 
    showToast, 
    language 
  } = useStore();

  const [textLangTab, setTextLangTab] = useState('ar');
  const [savedKey, setSavedKey] = useState(null);

  // 1. Announcement Bar
  const [announcementText, setAnnouncementText] = useState(
    textLangTab === 'ar' ? (siteContent.announcement?.text_ar || '') : (siteContent.announcement?.text_en || '')
  );

  // 2. Brand
  const [brandName, setBrandName] = useState(siteContent.brand?.name || 'KESWA');
  const [brandTagline, setBrandTagline] = useState(
    textLangTab === 'ar' ? (siteContent.brand?.tagline_ar || '') : (siteContent.brand?.tagline_en || '')
  );

  // 3. Hero Banners
  const [heroHoodiesTitle, setHeroHoodiesTitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroHoodies?.title_ar || '') : (siteContent.banners?.heroHoodies?.title_en || '')
  );
  const [heroHoodiesSubtitle, setHeroHoodiesSubtitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroHoodies?.subtitle_ar || '') : (siteContent.banners?.heroHoodies?.subtitle_en || '')
  );
  const [heroHoodiesBadge, setHeroHoodiesBadge] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroHoodies?.badge_ar || '') : (siteContent.banners?.heroHoodies?.badge_en || '')
  );
  const [heroHoodiesBtn, setHeroHoodiesBtn] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroHoodies?.buttonText_ar || '') : (siteContent.banners?.heroHoodies?.buttonText_en || '')
  );

  const [heroTshirtsTitle, setHeroTshirtsTitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroTshirts?.title_ar || '') : (siteContent.banners?.heroTshirts?.title_en || '')
  );
  const [heroTshirtsSubtitle, setHeroTshirtsSubtitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroTshirts?.subtitle_ar || '') : (siteContent.banners?.heroTshirts?.subtitle_en || '')
  );
  const [heroTshirtsBtn, setHeroTshirtsBtn] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroTshirts?.buttonText_ar || '') : (siteContent.banners?.heroTshirts?.buttonText_en || '')
  );

  const [heroSweatsTitle, setHeroSweatsTitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroSweatpants?.title_ar || '') : (siteContent.banners?.heroSweatpants?.title_en || '')
  );
  const [heroSweatsSubtitle, setHeroSweatsSubtitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroSweatpants?.subtitle_ar || '') : (siteContent.banners?.heroSweatpants?.subtitle_en || '')
  );
  const [heroSweatsBtn, setHeroSweatsBtn] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.heroSweatpants?.buttonText_ar || '') : (siteContent.banners?.heroSweatpants?.buttonText_en || '')
  );

  // 4. Newsletter
  const [nlTitle, setNlTitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.newsletter?.title_ar || '') : (siteContent.banners?.newsletter?.title_en || '')
  );
  const [nlSubtitle, setNlSubtitle] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.newsletter?.subtitle_ar || '') : (siteContent.banners?.newsletter?.subtitle_en || '')
  );
  const [nlBtn, setNlBtn] = useState(
    textLangTab === 'ar' ? (siteContent.banners?.newsletter?.buttonText_ar || '') : (siteContent.banners?.newsletter?.buttonText_en || '')
  );

  // 5. Footer & Contacts
  const [footerAbout, setFooterAbout] = useState(
    textLangTab === 'ar' ? (siteContent.footer?.about_ar || '') : (siteContent.footer?.about_en || '')
  );
  const [footerPhone, setFooterPhone] = useState(siteContent.footer?.phone || '');
  const [footerEmail, setFooterEmail] = useState(siteContent.footer?.email || '');
  const [footerAddress, setFooterAddress] = useState(
    textLangTab === 'ar' ? (siteContent.footer?.address_ar || '') : (siteContent.footer?.address_en || '')
  );

  // Switch Language subtab
  const handleSwitchTab = (tab) => {
    setTextLangTab(tab);
    if (tab === 'ar') {
      setAnnouncementText(siteContent.announcement?.text_ar || '');
      setBrandTagline(siteContent.brand?.tagline_ar || '');
      setHeroHoodiesTitle(siteContent.banners?.heroHoodies?.title_ar || '');
      setHeroHoodiesSubtitle(siteContent.banners?.heroHoodies?.subtitle_ar || '');
      setHeroHoodiesBadge(siteContent.banners?.heroHoodies?.badge_ar || '');
      setHeroHoodiesBtn(siteContent.banners?.heroHoodies?.buttonText_ar || '');

      setHeroTshirtsTitle(siteContent.banners?.heroTshirts?.title_ar || '');
      setHeroTshirtsSubtitle(siteContent.banners?.heroTshirts?.subtitle_ar || '');
      setHeroTshirtsBtn(siteContent.banners?.heroTshirts?.buttonText_ar || '');

      setHeroSweatsTitle(siteContent.banners?.heroSweatpants?.title_ar || '');
      setHeroSweatsSubtitle(siteContent.banners?.heroSweatpants?.subtitle_ar || '');
      setHeroSweatsBtn(siteContent.banners?.heroSweatpants?.buttonText_ar || '');

      setNlTitle(siteContent.banners?.newsletter?.title_ar || '');
      setNlSubtitle(siteContent.banners?.newsletter?.subtitle_ar || '');
      setNlBtn(siteContent.banners?.newsletter?.buttonText_ar || '');

      setFooterAbout(siteContent.footer?.about_ar || '');
      setFooterAddress(siteContent.footer?.address_ar || '');
    } else {
      setAnnouncementText(siteContent.announcement?.text_en || '');
      setBrandTagline(siteContent.brand?.tagline_en || '');
      setHeroHoodiesTitle(siteContent.banners?.heroHoodies?.title_en || '');
      setHeroHoodiesSubtitle(siteContent.banners?.heroHoodies?.subtitle_en || '');
      setHeroHoodiesBadge(siteContent.banners?.heroHoodies?.badge_en || '');
      setHeroHoodiesBtn(siteContent.banners?.heroHoodies?.buttonText_en || '');

      setHeroTshirtsTitle(siteContent.banners?.heroTshirts?.title_en || '');
      setHeroTshirtsSubtitle(siteContent.banners?.heroTshirts?.subtitle_en || '');
      setHeroTshirtsBtn(siteContent.banners?.heroTshirts?.buttonText_en || '');

      setHeroSweatsTitle(siteContent.banners?.heroSweatpants?.title_en || '');
      setHeroSweatsSubtitle(siteContent.banners?.heroSweatpants?.subtitle_en || '');
      setHeroSweatsBtn(siteContent.banners?.heroSweatpants?.buttonText_en || '');

      setNlTitle(siteContent.banners?.newsletter?.title_en || '');
      setNlSubtitle(siteContent.banners?.newsletter?.subtitle_en || '');
      setNlBtn(siteContent.banners?.newsletter?.buttonText_en || '');

      setFooterAbout(siteContent.footer?.about_en || '');
      setFooterAddress(siteContent.footer?.address_en || '');
    }
  };

  const notifySaved = (key) => {
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2500);
  };

  const handleSaveAnnouncement = () => {
    saveTexts('announcement', {
      [textLangTab === 'ar' ? 'text_ar' : 'text_en']: announcementText
    });
    notifySaved('announcement');
  };

  const handleSaveBrand = () => {
    saveTexts('brand', {
      name: brandName,
      [textLangTab === 'ar' ? 'tagline_ar' : 'tagline_en']: brandTagline
    });
    notifySaved('brand');
  };

  const handleSaveHeroHoodies = () => {
    const isAr = textLangTab === 'ar';
    updateBanner('heroHoodies', {
      [isAr ? 'title_ar' : 'title_en']: heroHoodiesTitle,
      [isAr ? 'subtitle_ar' : 'subtitle_en']: heroHoodiesSubtitle,
      [isAr ? 'badge_ar' : 'badge_en']: heroHoodiesBadge,
      [isAr ? 'buttonText_ar' : 'buttonText_en']: heroHoodiesBtn
    });
    notifySaved('heroHoodies');
    showToast(language === 'ar' ? 'تم حفظ نصوص بنر الهوديز! 💾' : 'Hoodies banner copy saved! 💾', 'success');
  };

  const handleSaveHeroTshirts = () => {
    const isAr = textLangTab === 'ar';
    updateBanner('heroTshirts', {
      [isAr ? 'title_ar' : 'title_en']: heroTshirtsTitle,
      [isAr ? 'subtitle_ar' : 'subtitle_en']: heroTshirtsSubtitle,
      [isAr ? 'buttonText_ar' : 'buttonText_en']: heroTshirtsBtn
    });
    notifySaved('heroTshirts');
    showToast(language === 'ar' ? 'تم حفظ نصوص بنر التيشرتات! 💾' : 'T-shirts banner copy saved! 💾', 'success');
  };

  const handleSaveHeroSweats = () => {
    const isAr = textLangTab === 'ar';
    updateBanner('heroSweatpants', {
      [isAr ? 'title_ar' : 'title_en']: heroSweatsTitle,
      [isAr ? 'subtitle_ar' : 'subtitle_en']: heroSweatsSubtitle,
      [isAr ? 'buttonText_ar' : 'buttonText_en']: heroSweatsBtn
    });
    notifySaved('heroSweats');
    showToast(language === 'ar' ? 'تم حفظ نصوص بنر السويت بانتس! 💾' : 'Sweatpants banner copy saved! 💾', 'success');
  };

  const handleSaveNewsletter = () => {
    const isAr = textLangTab === 'ar';
    updateBanner('newsletter', {
      [isAr ? 'title_ar' : 'title_en']: nlTitle,
      [isAr ? 'subtitle_ar' : 'subtitle_en']: nlSubtitle,
      [isAr ? 'buttonText_ar' : 'buttonText_en']: nlBtn
    });
    notifySaved('newsletter');
    showToast(language === 'ar' ? 'تم حفظ نصوص النشرة البريدية! 💾' : 'Newsletter copy saved! 💾', 'success');
  };

  const handleSaveFooter = () => {
    saveTexts('footer', {
      [textLangTab === 'ar' ? 'about_ar' : 'about_en']: footerAbout,
      phone: footerPhone,
      email: footerEmail,
      [textLangTab === 'ar' ? 'address_ar' : 'address_en']: footerAddress
    });
    notifySaved('footer');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Layout size={22} className="text-blue-400" />
            <span>تعديل نصوص وأزرار واجهة المتجر (Text & Labels)</span>
          </h2>
          <p className="text-xs text-gray-400">
            تعديل كافة نصوص الموقع والعناوين والأزرار باللغتين مع أزرار حفظ مباشرة وتثبيت فوري بالواجهة.
          </p>
        </div>

        {/* Sub language tabs */}
        <div className="flex items-center bg-neutral-900 border border-white/10 p-1 rounded shrink-0">
          <button
            onClick={() => handleSwitchTab('ar')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              textLangTab === 'ar' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            النصوص بالعربية
          </button>
          <button
            onClick={() => handleSwitchTab('en')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              textLangTab === 'en' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            English Texts
          </button>
        </div>
      </div>

      {/* 1. Announcement Bar */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            شريط الإعلانات العلوي ({textLangTab === 'ar' ? 'العربية' : 'English'})
          </h3>
          <button
            onClick={handleSaveAnnouncement}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedKey === 'announcement' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedKey === 'announcement' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedKey === 'announcement' ? '✓ تم الحفظ!' : '💾 حفظ نص الإعلان'}</span>
          </button>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">نص الإعلان والشحن المجاني:</label>
          <input 
            type="text" 
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-sans"
          />
        </div>
      </div>

      {/* 2. Brand Texts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            اسم البراند والشعار اللفظي (Brand & Taglines)
          </h3>
          <button
            onClick={handleSaveBrand}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedKey === 'brand' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedKey === 'brand' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedKey === 'brand' ? '✓ تم الحفظ!' : '💾 حفظ نصوص البراند'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">اسم البراند:</label>
            <input 
              type="text" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-bold"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              الشعار اللفظي ({textLangTab === 'ar' ? 'بالعربية' : 'English'}):
            </label>
            <input 
              type="text" 
              value={brandTagline}
              onChange={(e) => setBrandTagline(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Hero Hoodies Texts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            نصوص وأزرار بنر الهوديز الرئيسي ({textLangTab === 'ar' ? 'العربية' : 'English'})
          </h3>
          <button
            onClick={handleSaveHeroHoodies}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedKey === 'heroHoodies' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedKey === 'heroHoodies' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedKey === 'heroHoodies' ? '✓ تم الحفظ!' : '💾 حفظ بنر الهوديز'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">العنوان الرئيسي:</label>
            <input 
              type="text" 
              value={heroHoodiesTitle}
              onChange={(e) => setHeroHoodiesTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">الوصف الفرعي:</label>
            <input 
              type="text" 
              value={heroHoodiesSubtitle}
              onChange={(e) => setHeroHoodiesSubtitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">نص البادج العلوي:</label>
            <input 
              type="text" 
              value={heroHoodiesBadge}
              onChange={(e) => setHeroHoodiesBadge(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">نص زر التصفح:</label>
            <input 
              type="text" 
              value={heroHoodiesBtn}
              onChange={(e) => setHeroHoodiesBtn(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Hero T-Shirts Texts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            نصوص بنر التيشرتات الصيفي ({textLangTab === 'ar' ? 'العربية' : 'English'})
          </h3>
          <button
            onClick={handleSaveHeroTshirts}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedKey === 'heroTshirts' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedKey === 'heroTshirts' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedKey === 'heroTshirts' ? '✓ تم الحفظ!' : '💾 حفظ بنر التيشرتات'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">العنوان:</label>
            <input 
              type="text" 
              value={heroTshirtsTitle}
              onChange={(e) => setHeroTshirtsTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">الوصف:</label>
            <input 
              type="text" 
              value={heroTshirtsSubtitle}
              onChange={(e) => setHeroTshirtsSubtitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">نص الزر:</label>
            <input 
              type="text" 
              value={heroTshirtsBtn}
              onChange={(e) => setHeroTshirtsBtn(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* 5. Hero Sweatpants Texts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            نصوص بنر السويت بانتس ({textLangTab === 'ar' ? 'العربية' : 'English'})
          </h3>
          <button
            onClick={handleSaveHeroSweats}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedKey === 'heroSweats' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedKey === 'heroSweats' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedKey === 'heroSweats' ? '✓ تم الحفظ!' : '💾 حفظ بنر السويت بانتس'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">العنوان:</label>
            <input 
              type="text" 
              value={heroSweatsTitle}
              onChange={(e) => setHeroSweatsTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">الوصف:</label>
            <input 
              type="text" 
              value={heroSweatsSubtitle}
              onChange={(e) => setHeroSweatsSubtitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">نص الزر:</label>
            <input 
              type="text" 
              value={heroSweatsBtn}
              onChange={(e) => setHeroSweatsBtn(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* 6. Newsletter Texts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            نصوص النشرة البريدية ونادي كسوة ({textLangTab === 'ar' ? 'العربية' : 'English'})
          </h3>
          <button
            onClick={handleSaveNewsletter}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedKey === 'newsletter' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedKey === 'newsletter' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedKey === 'newsletter' ? '✓ تم الحفظ!' : '💾 حفظ نصوص النشرة'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">العنوان:</label>
            <input 
              type="text" 
              value={nlTitle}
              onChange={(e) => setNlTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">الوصف:</label>
            <input 
              type="text" 
              value={nlSubtitle}
              onChange={(e) => setNlSubtitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">نص زر الاشتراك:</label>
            <input 
              type="text" 
              value={nlBtn}
              onChange={(e) => setNlBtn(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* 7. Footer Texts & Contacts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            نصوص الفوتر وبيانات الاتصال والتواصل
          </h3>
          <button
            onClick={handleSaveFooter}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedKey === 'footer' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedKey === 'footer' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedKey === 'footer' ? '✓ تم الحفظ!' : '💾 حفظ بيانات الفوتر'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1">نبذة عن البراند في الفوتر:</label>
            <textarea 
              rows={2}
              value={footerAbout}
              onChange={(e) => setFooterAbout(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">رقم الهاتف لخدمة العملاء:</label>
            <input 
              type="text" 
              value={footerPhone}
              onChange={(e) => setFooterPhone(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">البريد الإلكتروني الرسمي:</label>
            <input 
              type="email" 
              value={footerEmail}
              onChange={(e) => setFooterEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded font-mono"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1">العنوان والمقر ({textLangTab === 'ar' ? 'العربية' : 'English'}):</label>
            <input 
              type="text" 
              value={footerAddress}
              onChange={(e) => setFooterAddress(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
