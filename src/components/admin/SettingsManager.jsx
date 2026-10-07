import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Settings, Save, CheckCircle2, Download, Upload, 
  RotateCcw, RefreshCw, Database
} from 'lucide-react';

export const SettingsManager = () => {
  const { 
    siteContent, 
    saveGeneralSettings, 
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
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
          <Settings size={22} className="text-white" />
          <span>إعدادات المتجر وقاعدة البيانات والنسخ الاحتياطي</span>
        </h2>
        <p className="text-xs text-gray-400">
          تعديل تكاليف الشحن والعملة مع زر حفظ مخصص، وإدارة اتصال قاعدة بيانات Neon على Vercel، والنسخ الاحتياطي.
        </p>
      </div>

      {/* Shipping & Currency Card with Dedicated Save Button */}
      <form onSubmit={handleSaveShipping} className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h3 className="text-sm font-bold text-white">
            تكاليف الشحن والعملة (Shipping & Currency)
          </h3>
          <button
            type="submit"
            className={`text-xs px-4 py-2 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
              isSaved 
                ? 'bg-emerald-500 text-black font-black' 
                : 'bg-white hover:bg-neutral-200 text-black font-black'
            }`}
          >
            {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            <span>{isSaved ? '✓ تم الحفظ والتثبيت!' : '💾 حفظ وتثبيت إعدادات الشحن'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

      {/* Neon PostgreSQL Serverless Database on Vercel */}
      <div className="bg-[#181824] border border-cyan-500/30 p-5 rounded-lg space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database size={16} className="text-cyan-400" />
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

        <div className="bg-neutral-900/80 p-3.5 rounded border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between items-center text-gray-300">
            <span>اسم قاعدة البيانات المخصصة (Neon Database):</span>
            <strong className="text-white font-mono bg-neutral-800 px-2 py-0.5 rounded">keswawear</strong>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>المزود وخطة التشغيل:</span>
            <span className="text-cyan-300 font-mono">Neon Serverless PostgreSQL (Node Runtime على Vercel)</span>
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

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={checkNeonConnection}
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded flex items-center gap-2 transition-colors border border-white/10"
          >
            <RefreshCw size={14} className="text-cyan-400" />
            <span>فحص الاتصال بـ Neon</span>
          </button>

          <button
            onClick={syncAllToNeon}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs px-5 py-2.5 rounded flex items-center gap-2 transition-all shadow-lg"
          >
            <Database size={14} />
            <span>💾 مزامنة وتهيئة البيانات في Neon (قاعدة keswawear)</span>
          </button>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
          النسخ الاحتياطي واستيراد البيانات (Backup & Restore)
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          يمكنك تحميل نسخة كاملة من كافة المنتجات والطلبات والتعديلات التي أجريتها كملف JSON آمن، أو استعادتها في أي وقت بنقرة واحدة.
        </p>
        
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={exportData}
            className="bg-white hover:bg-neutral-200 text-black font-black text-xs px-5 py-3 rounded flex items-center gap-2 transition-all shadow-md"
          >
            <Download size={16} />
            <span>تحميل نسخة احتياطية (تصدير JSON)</span>
          </button>

          <label className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-5 py-3 rounded flex items-center gap-2 transition-all cursor-pointer border border-white/10 shadow-md">
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
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs px-4 py-3 rounded flex items-center gap-2 transition-colors mr-auto"
          >
            <RotateCcw size={16} />
            <span>إعادة ضبط المصنع</span>
          </button>
        </div>
      </div>
    </div>
  );
};