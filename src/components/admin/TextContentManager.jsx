import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Layout, Save, CheckCircle2 } from 'lucide-react';

export const TextContentManager = () => {
  const { siteContent, saveTexts, showToast, language } = useStore();
  const [textLangTab, setTextLangTab] = useState('ar');

  const [announcementText, setAnnouncementText] = useState(
    textLangTab === 'ar' ? (siteContent.announcement?.text_ar || '') : (siteContent.announcement?.text_en || '')
  );

  const [brandName, setBrandName] = useState(siteContent.brand?.name || 'KESWA');
  const [brandTagline, setBrandTagline] = useState(
    textLangTab === 'ar' ? (siteContent.brand?.tagline_ar || '') : (siteContent.brand?.tagline_en || '')
  );

  const [footerAbout, setFooterAbout] = useState(
    textLangTab === 'ar' ? (siteContent.footer?.about_ar || '') : (siteContent.footer?.about_en || '')
  );
  const [footerPhone, setFooterPhone] = useState(siteContent.footer?.phone || '');
  const [footerEmail, setFooterEmail] = useState(siteContent.footer?.email || '');

  const [savedSection, setSavedSection] = useState(null);

  // Switch subtab
  const handleSwitchTab = (tab) => {
    setTextLangTab(tab);
    if (tab === 'ar') {
      setAnnouncementText(siteContent.announcement?.text_ar || '');
      setBrandTagline(siteContent.brand?.tagline_ar || '');
      setFooterAbout(siteContent.footer?.about_ar || '');
    } else {
      setAnnouncementText(siteContent.announcement?.text_en || '');
      setBrandTagline(siteContent.brand?.tagline_en || '');
      setFooterAbout(siteContent.footer?.about_en || '');
    }
  };

  const handleSaveAnnouncement = () => {
    saveTexts('announcement', {
      [textLangTab === 'ar' ? 'text_ar' : 'text_en']: announcementText
    });
    setSavedSection('announcement');
    setTimeout(() => setSavedSection(null), 2500);
  };

  const handleSaveBrand = () => {
    saveTexts('brand', {
      name: brandName,
      [textLangTab === 'ar' ? 'tagline_ar' : 'tagline_en']: brandTagline
    });
    setSavedSection('brand');
    setTimeout(() => setSavedSection(null), 2500);
  };

  const handleSaveFooter = () => {
    saveTexts('footer', {
      [textLangTab === 'ar' ? 'about_ar' : 'about_en']: footerAbout,
      phone: footerPhone,
      email: footerEmail
    });
    setSavedSection('footer');
    setTimeout(() => setSavedSection(null), 2500);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Layout size={22} className="text-white" />
            <span>تعديل نصوص وأزرار واجهة المتجر (Text & Labels)</span>
          </h2>
          <p className="text-xs text-gray-400">
            تعديل كافة نصوص الموقع باللغتين مع أزرار حفظ مباشرة وتثبيت فوري في الموقع.
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

      {/* Announcement Bar */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            شريط الإعلانات العلوي ({textLangTab === 'ar' ? 'العربية' : 'English'})
          </h3>
          <button
            onClick={handleSaveAnnouncement}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedSection === 'announcement' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedSection === 'announcement' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedSection === 'announcement' ? '✓ تم الحفظ!' : '💾 حفظ نص الإعلان'}</span>
          </button>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">نص الإعلان والعرض:</label>
          <input 
            type="text" 
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-xs text-white rounded outline-none focus:border-white font-sans"
          />
        </div>
      </div>

      {/* Brand Texts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            اسم البراند والشعار اللفظي (Brand & Taglines)
          </h3>
          <button
            onClick={handleSaveBrand}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedSection === 'brand' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedSection === 'brand' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedSection === 'brand' ? '✓ تم الحفظ!' : '💾 حفظ نصوص البراند'}</span>
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

      {/* Footer Texts */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            نصوص الفوتر وبيانات الاتصال والتواصل
          </h3>
          <button
            onClick={handleSaveFooter}
            className={`text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              savedSection === 'footer' 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {savedSection === 'footer' ? <CheckCircle2 size={13} /> : <Save size={13} />}
            <span>{savedSection === 'footer' ? '✓ تم الحفظ!' : '💾 حفظ بيانات الفوتر'}</span>
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
        </div>
      </div>
    </div>
  );
};