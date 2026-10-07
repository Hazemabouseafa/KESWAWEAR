import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Settings, Save, CheckCircle2, Download, Upload, 
  RotateCcw, RefreshCw, Database, Share2, ExternalLink,
  Phone, MessageSquare, ToggleLeft, ToggleRight
} from 'lucide-react';
import { WhatsAppIcon } from '../components/FloatingWhatsApp';

const FacebookIcon = ({ className = "text-blue-500", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = ({ className = "text-pink-500", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TikTokIcon = ({ className = "text-white", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

export const SettingsManager = () => {
  const { 
    siteContent, 
    saveGeneralSettings, 
    saveSocialLinks,
    saveWhatsAppSettings,
    toggleWhatsApp,
    formatWhatsAppNumber,
    neonStatus, 
    neonDetails, 
    checkNeonConnection, 
    syncAllToNeon, 
    exportData, 
    importData, 
    resetToDefaultData, 
    showToast, 
    language 
  } = useStore();

  const [shippingCost, setShippingCost] = useState(siteContent.general?.shippingCost ?? 50);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(siteContent.general?.freeShippingThreshold ?? 1500);
  const [currencyAr, setCurrencyAr] = useState(siteContent.general?.currency_ar || 'ج.م');
  const [currencyEn, setCurrencyEn] = useState(siteContent.general?.currency_en || 'EGP');
  const [isSaved, setIsSaved] = useState(false);

  // Social Links State
  const [facebookUrl, setFacebookUrl] = useState(siteContent.footer?.social?.facebook || '');
  const [instagramUrl, setInstagramUrl] = useState(siteContent.footer?.social?.instagram || '');
  const [tiktokUrl, setTiktokUrl] = useState(siteContent.footer?.social?.tiktok || '');
  const [isSocialSaved, setIsSocialSaved] = useState(false);

  // WhatsApp State & Toggle
  const [whatsappEnabled, setWhatsappEnabled] = useState(siteContent.whatsapp?.enabled !== false);
  const [whatsappPhone, setWhatsappPhone] = useState(siteContent.whatsapp?.phone || siteContent.footer?.whatsapp || '01023456789');
  const [whatsappMessageAr, setWhatsappMessageAr] = useState(siteContent.whatsapp?.message_ar || 'مرحباً KESWA WEAR، أود الاستفسار عن تفاصيل الطلب والمنتجات');
  const [whatsappMessageEn, setWhatsappMessageEn] = useState(siteContent.whatsapp?.message_en || 'Hello KESWA WEAR, I would like to inquire about products and orders');
  const [whatsappShowFloating, setWhatsappShowFloating] = useState(siteContent.whatsapp?.showFloatingButton !== false);
  const [isWhatsappSaved, setIsWhatsappSaved] = useState(false);

  // Keep state synchronized if siteContent updates from Neon database or API
  useEffect(() => {
    if (siteContent.general) {
      setShippingCost(siteContent.general.shippingCost ?? 50);
      setFreeShippingThreshold(siteContent.general.freeShippingThreshold ?? 1500);
      setCurrencyAr(siteContent.general.currency_ar || 'ج.م');
      setCurrencyEn(siteContent.general.currency_en || 'EGP');
    }
  }, [siteContent.general]);

  useEffect(() => {
    if (siteContent.footer?.social) {
      setFacebookUrl(siteContent.footer.social.facebook || '');
      setInstagramUrl(siteContent.footer.social.instagram || '');
      setTiktokUrl(siteContent.footer.social.tiktok || '');
    }
  }, [siteContent.footer?.social]);

  const handleSaveShipping = (e) => {
    e.preventDefault();
    saveGeneralSettings({
      shippingCost: Number(shippingCost),
      freeShippingThreshold: Number(freeShippingThreshold),
      currency_ar: currencyAr,
      currency_en: currencyEn
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSaveSocial = (e) => {
    e.preventDefault();
    saveSocialLinks({
      facebook: facebookUrl,
      instagram: instagramUrl,
      tiktok: tiktokUrl
    });
    setIsSocialSaved(true);
    setTimeout(() => setIsSocialSaved(false), 2500);
  };

  useEffect(() => {
    if (siteContent.whatsapp) {
      setWhatsappEnabled(siteContent.whatsapp.enabled !== false);
      setWhatsappPhone(siteContent.whatsapp.phone || siteContent.footer?.whatsapp || '01023456789');
      setWhatsappMessageAr(siteContent.whatsapp.message_ar || 'مرحباً KESWA WEAR، أود الاستفسار عن تفاصيل الطلب والمنتجات');
      setWhatsappMessageEn(siteContent.whatsapp.message_en || 'Hello KESWA WEAR, I would like to inquire about products and orders');
      setWhatsappShowFloating(siteContent.whatsapp.showFloatingButton !== false);
    }
  }, [siteContent.whatsapp]);

  const handleSaveWhatsApp = (e) => {
    e.preventDefault();
    saveWhatsAppSettings({
      enabled: whatsappEnabled,
      phone: whatsappPhone,
      message_ar: whatsappMessageAr,
      message_en: whatsappMessageEn,
      showFloatingButton: whatsappShowFloating
    });
    setIsWhatsappSaved(true);
    setTimeout(() => setIsWhatsappSaved(false), 2500);
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        importData(event.target.result);
      } catch (err) {
        alert("فشل في قراءة ملف النسخة الاحتياطية JSON");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg sm:text-xl font-black text-white mb-1 flex items-center gap-2">
          <Settings size={20} className="text-neutral-300 shrink-0" />
          <span>إعدادات المتجر وقاعدة البيانات والنسخ الاحتياطي</span>
        </h2>
        <p className="text-[11px] sm:text-xs text-gray-400">
          تعديل تكاليف الشحن والعملة مع زر حفظ مخصص، وإدارة اتصال قاعدة بيانات Neon على Vercel، والنسخ الاحتياطي.
        </p>
      </div>

      {/* Shipping & Currency Card with Dedicated Save Button */}
      <form onSubmit={handleSaveShipping} className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
          <h3 className="text-sm font-bold text-white">
            تكاليف الشحن والعملة (Shipping & Currency)
          </h3>
          <button
            type="submit"
            className={`w-full sm:w-auto text-xs px-4 py-2.5 rounded flex items-center justify-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
              isSaved 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black font-black'
            }`}
          >
            {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            <span>{isSaved ? '✓ تم الحفظ والتثبيت!' : '💾 حفظ وتثبيت إعدادات الشحن'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">تكلفة الشحن الافتراضية (بالجنيه):</label>
            <input 
              type="number" 
              required
              value={shippingCost}
              onChange={(e) => {
                setShippingCost(e.target.value);
                setIsSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono font-bold outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">الحد الأدنى للشحن المجاني (بالجنيه):</label>
            <input 
              type="number" 
              required
              value={freeShippingThreshold}
              onChange={(e) => {
                setFreeShippingThreshold(e.target.value);
                setIsSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono font-bold outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">رمز العملة بالعربية:</label>
            <input 
              type="text" 
              value={currencyAr}
              onChange={(e) => {
                setCurrencyAr(e.target.value);
                setIsSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">رمز العملة بالإنجليزية:</label>
            <input 
              type="text" 
              value={currencyEn}
              onChange={(e) => {
                setCurrencyEn(e.target.value);
                setIsSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono outline-none focus:border-white"
            />
          </div>
        </div>
      </form>

      {/* Social Media Links Card with Dedicated Save Button */}
      <form onSubmit={handleSaveSocial} className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 size={16} className="text-blue-400 shrink-0" />
              <span>روابط التواصل الاجتماعي (صفحات فيسبوك وإنستجرام)</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              تعديل روابط صفحات الفيسبوك وحساب الإنستجرام وتيك توك التي تظهر للزوار في أسفل الموقع (الفوتر).
            </p>
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto text-xs px-4 py-2.5 rounded flex items-center justify-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
              isSocialSaved 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black font-black'
            }`}
          >
            {isSocialSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            <span>{isSocialSaved ? '✓ تم الحفظ والتثبيت!' : '💾 حفظ وتثبيت روابط السوشيال ميديا'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          {/* Facebook */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold flex items-center gap-1.5">
                <FacebookIcon className="text-blue-400" size={15} />
                <span>رابط صفحة الفيسبوك (Facebook Page):</span>
              </label>
              {facebookUrl && (
                <a 
                  href={facebookUrl.startsWith('http') ? facebookUrl : `https://${facebookUrl}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-sans"
                >
                  <span>معاينة الرابط</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
            <input 
              type="text" 
              placeholder="https://facebook.com/keswawear أو اسم الصفحة"
              value={facebookUrl}
              onChange={(e) => {
                setFacebookUrl(e.target.value);
                setIsSocialSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono text-xs outline-none focus:border-blue-400"
            />
            <p className="text-[10px] text-gray-500">
              يمكنك كتابة الرابط كاملاً أو اسم الصفحة مباشرة
            </p>
          </div>

          {/* Instagram */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold flex items-center gap-1.5">
                <InstagramIcon className="text-pink-400" size={15} />
                <span>رابط حساب الإنستجرام (Instagram Profile):</span>
              </label>
              {instagramUrl && (
                <a 
                  href={instagramUrl.startsWith('http') ? instagramUrl : `https://${instagramUrl}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-pink-400 hover:underline flex items-center gap-1 font-sans"
                >
                  <span>معاينة الرابط</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
            <input 
              type="text" 
              placeholder="https://instagram.com/keswawear أو @keswawear"
              value={instagramUrl}
              onChange={(e) => {
                setInstagramUrl(e.target.value);
                setIsSocialSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono text-xs outline-none focus:border-pink-400"
            />
            <p className="text-[10px] text-gray-500">
              يمكنك كتابة رابط الإنستجرام أو المعرّف مع @
            </p>
          </div>

          {/* TikTok */}
          <div className="sm:col-span-2 space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold flex items-center gap-1.5">
                <TikTokIcon className="text-neutral-300" size={15} />
                <span>رابط حساب تيك توك (TikTok - اختياري):</span>
              </label>
              {tiktokUrl && (
                <a 
                  href={tiktokUrl.startsWith('http') ? tiktokUrl : `https://${tiktokUrl}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-gray-300 hover:underline flex items-center gap-1 font-sans"
                >
                  <span>معاينة الرابط</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
            <input 
              type="text" 
              placeholder="https://tiktok.com/@keswawear أو @keswawear"
              value={tiktokUrl}
              onChange={(e) => {
                setTiktokUrl(e.target.value);
                setIsSocialSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono text-xs outline-none focus:border-white"
            />
          </div>
        </div>
      </form>

      {/* WhatsApp Customer Service & Toggle Card */}
      <form onSubmit={handleSaveWhatsApp} className="bg-[#16161f] border border-emerald-500/30 p-3.5 sm:p-5 rounded-lg space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <WhatsAppIcon size={18} className="text-emerald-400 shrink-0" />
              <span>خدمة العملاء والتواصل المباشر عبر واتساب (WhatsApp Direct Support)</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              تفعيل أو إيقاف زر الواتساب في المتجر، وتعديل رقم الهاتف ورسالة الترحيب مع إمكانية التجربة الفورية.
            </p>
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto text-xs px-4 py-2.5 rounded flex items-center justify-center gap-1.5 font-bold transition-all shadow-md touch-manipulation ${
              isWhatsappSaved 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white font-black'
            }`}
          >
            {isWhatsappSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            <span>{isWhatsappSaved ? '✓ تم الحفظ والتثبيت!' : '💾 حفظ وتثبيت إعدادات الواتساب'}</span>
          </button>
        </div>

        {/* Toggle Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-neutral-900/60 rounded border border-white/5">
          {/* Main WhatsApp Toggle (قابل للتبديل تشغيل / إيقاف) */}
          <div className="flex items-center justify-between p-2.5 bg-neutral-800/80 rounded border border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">حالة تفعيل الواتساب بالمتجر:</span>
              <span className="text-[11px] text-gray-400">
                {whatsappEnabled ? '🟢 مفعل (يظهر للزوار في الفوتر والصفحات)' : '⚪ معطل (مخفي بالكامل من المتجر)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setWhatsappEnabled(!whatsappEnabled);
                setIsWhatsappSaved(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation ${
                whatsappEnabled 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black' 
                  : 'bg-neutral-700 text-gray-400'
              }`}
            >
              {whatsappEnabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              <span>{whatsappEnabled ? 'مفعل' : 'معطل'}</span>
            </button>
          </div>

          {/* Floating Button Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-neutral-800/80 rounded border border-white/5">
            <div>
              <span className="text-xs font-bold text-white block">الزر العائم في زاوية الشاشة:</span>
              <span className="text-[11px] text-gray-400">
                {whatsappShowFloating ? '🟢 مفعل (زر دائري عائم في الأسفل)' : '⚪ معطل (يظهر في الفوتر فقط)'}
              </span>
            </div>
            <button
              type="button"
              disabled={!whatsappEnabled}
              onClick={() => {
                setWhatsappShowFloating(!whatsappShowFloating);
                setIsWhatsappSaved(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation ${
                !whatsappEnabled
                  ? 'opacity-40 cursor-not-allowed bg-neutral-800 text-gray-500'
                  : whatsappShowFloating 
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black' 
                    : 'bg-neutral-700 text-gray-400'
              }`}
            >
              {whatsappShowFloating ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              <span>{whatsappShowFloating ? 'مفعل' : 'معطل'}</span>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          {/* Phone Number */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 font-bold flex items-center gap-1.5">
                <Phone size={14} className="text-emerald-400" />
                <span>رقم هاتف الواتساب (WhatsApp Number):</span>
              </label>
              {whatsappPhone && (
                <a 
                  href={`https://wa.me/${formatWhatsAppNumber ? formatWhatsAppNumber(whatsappPhone) : whatsappPhone}?text=${encodeURIComponent(whatsappMessageAr)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-sans"
                >
                  <span>معاينة الرابط</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
            <input 
              type="text" 
              placeholder="01023456789 أو +201023456789"
              value={whatsappPhone}
              onChange={(e) => {
                setWhatsappPhone(e.target.value);
                setIsWhatsappSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono text-xs outline-none focus:border-emerald-400"
            />
            <p className="text-[10px] text-gray-500">
              الرابط الدولي المحول: <code className="text-emerald-400 font-mono">wa.me/{formatWhatsAppNumber ? formatWhatsAppNumber(whatsappPhone) : whatsappPhone}</code>
            </p>
          </div>

          {/* Test Chat Button Box */}
          <div className="space-y-1 flex flex-col justify-end">
            <label className="text-gray-300 font-bold block mb-1">فحص الاتصال بالواتساب:</label>
            <a
              href={`https://wa.me/${formatWhatsAppNumber ? formatWhatsAppNumber(whatsappPhone) : whatsappPhone}?text=${encodeURIComponent(whatsappMessageAr)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded flex items-center justify-center gap-2 font-bold text-xs transition-colors"
            >
              <WhatsAppIcon size={16} />
              <span>💬 اختبار فتح محادثة الواتساب الآن</span>
            </a>
            <p className="text-[10px] text-gray-500">
              يفتح مباشرة تطبيق الواتساب أو واتساب ويب للتأكد من وصول الرسائل للرقم
            </p>
          </div>

          {/* Greeting message Arabic */}
          <div className="space-y-1">
            <label className="text-gray-300 font-bold block">نص الرسالة التلقائية (بالعربية):</label>
            <input 
              type="text" 
              value={whatsappMessageAr}
              onChange={(e) => {
                setWhatsappMessageAr(e.target.value);
                setIsWhatsappSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded text-xs outline-none focus:border-emerald-400"
            />
            <p className="text-[10px] text-gray-500">تظهر تلقائياً في مربع كتابة الرسالة عند فتح المحادثة</p>
          </div>

          {/* Greeting message English */}
          <div className="space-y-1">
            <label className="text-gray-300 font-bold block">نص الرسالة التلقائية (English):</label>
            <input 
              type="text" 
              value={whatsappMessageEn}
              onChange={(e) => {
                setWhatsappMessageEn(e.target.value);
                setIsWhatsappSaved(false);
              }}
              className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded text-xs outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      </form>

      {/* Neon PostgreSQL Serverless Database on Vercel */}
      <div className="bg-[#181824] border border-cyan-500/30 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database size={16} className="text-cyan-400 shrink-0" />
              <span>قاعدة بيانات Neon PostgreSQL السحابية (قاعدة: keswawear)</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              قاعدة بيانات سحابية Serverless متصلة مع مسارات Vercel Serverless Functions لحفظ كافة المنتجات والطلبات سحابياً.
            </p>
          </div>

          <span className={`text-xs font-mono px-3 py-1 rounded border self-start sm:self-auto ${
            neonStatus === 'connected' 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
          }`}>
            {neonStatus === 'connected' ? '🟢 متصلة بنجاح (Live)' : '🔵 مجهزة للربط في Vercel'}
          </span>
        </div>

        <div className="bg-neutral-900/80 p-3 sm:p-3.5 rounded border border-white/5 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-gray-300">
            <span>اسم قاعدة البيانات المخصصة (Neon Database):</span>
            <strong className="text-white font-mono bg-neutral-800 px-2 py-0.5 rounded self-start sm:self-auto">keswawear</strong>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-gray-300">
            <span>المزود وخطة التشغيل:</span>
            <span className="text-cyan-300 font-mono text-[11px] sm:text-xs">Neon Serverless PostgreSQL (Node Runtime على Vercel)</span>
          </div>
          {neonDetails?.counts && (
            <div className="flex justify-between items-center text-gray-300 border-t border-white/5 pt-2">
              <span>السجلات المحفوظة في Neon:</span>
              <span className="text-emerald-400 font-mono">
                {neonDetails.counts.products ?? 0} منتجات • {neonDetails.counts.orders ?? 0} طلبات
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
          <button
            onClick={checkNeonConnection}
            className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded flex items-center justify-center gap-2 transition-colors border border-white/10 touch-manipulation"
          >
            <RefreshCw size={14} className="text-cyan-400" />
            <span>فحص الاتصال بـ Neon</span>
          </button>

          <button
            onClick={syncAllToNeon}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs px-5 py-2.5 rounded flex items-center justify-center gap-2 transition-all shadow-lg touch-manipulation"
          >
            <Database size={14} />
            <span>💾 مزامنة وتهيئة البيانات في Neon</span>
          </button>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-[#16161f] border border-white/10 p-3.5 sm:p-5 rounded-lg space-y-3 sm:space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
          النسخ الاحتياطي واستيراد البيانات (Backup & Restore)
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          يمكنك تحميل نسخة كاملة من كافة المنتجات والطلبات والتعديلات التي أجريتها كملف JSON آمن، أو استعادتها في أي وقت بنقرة واحدة.
        </p>
        
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2.5 pt-2">
          <button
            onClick={exportData}
            className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black font-black text-xs px-5 py-2.5 rounded flex items-center justify-center gap-2 transition-all shadow-md touch-manipulation"
          >
            <Download size={16} />
            <span>تحميل نسخة احتياطية (تصدير JSON)</span>
          </button>

          <label className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-5 py-2.5 rounded flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10 shadow-md touch-manipulation text-center">
            <Upload size={16} />
            <span>استيراد ملف نسخة احتياطية (JSON)</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileImport}
              className="hidden" 
            />
          </label>

          <button
            onClick={resetToDefaultData}
            className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs px-4 py-2.5 rounded flex items-center justify-center gap-2 transition-colors sm:mr-auto touch-manipulation"
          >
            <RotateCcw size={16} />
            <span>إعادة ضبط المصنع</span>
          </button>
        </div>
      </div>
    </div>
  );
};
