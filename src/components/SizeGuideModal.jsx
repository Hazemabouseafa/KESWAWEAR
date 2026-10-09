import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Check, Ruler, HelpCircle } from 'lucide-react';
import { WhatsAppIcon } from './FloatingWhatsApp';

export const SizeGuideModal = () => {
  const { 
    isSizeGuideOpen, 
    setIsSizeGuideOpen, 
    siteContent, 
    language,
    formatWhatsAppNumber
  } = useStore();

  const [activeTab, setActiveTab] = useState('tops'); // 'tops' | 'pants' | 'measure'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSizeGuideOpen) {
        setIsSizeGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSizeGuideOpen, setIsSizeGuideOpen]);

  if (!isSizeGuideOpen) return null;

  const guide = siteContent?.sizeGuide || {
    enabled: true,
    title_ar: "دليل المقاسات الستريت وير",
    title_en: "Streetwear Size Guide",
    subtitle_ar: "جميع مقاساتنا مصممة بقصة واسعة ومريحة (Oversized Fit). إذا كنت تفضل المقاس المظبوط (Regular Fit) ننصح باختيار مقاس أصغر بدرجة واحدة.",
    subtitle_en: "All garments are cut in our signature relaxed oversized fit. If you prefer a regular fit, consider sizing down.",
    tops: [
      { size: 'S', chest: '58 سم', length: '70 سم', shoulder: '52 سم' },
      { size: 'M', chest: '61 سم', length: '72 سم', shoulder: '54 سم' },
      { size: 'L', chest: '64 سم', length: '74 سم', shoulder: '56 سم' },
      { size: 'XL', chest: '67 سم', length: '76 سم', shoulder: '58 سم' },
      { size: 'XXL', chest: '70 سم', length: '78 سم', shoulder: '60 سم' },
      { size: '3XL', chest: '73 سم', length: '80 سم', shoulder: '62 سم' }
    ],
    pants: [
      { size: '30', waist: '76-80 سم', length: '102 سم', thigh: '62 سم' },
      { size: '32', waist: '81-85 سم', length: '104 سم', thigh: '64 سم' },
      { size: '34', waist: '86-90 سم', length: '106 سم', thigh: '66 سم' },
      { size: '36', waist: '91-95 سم', length: '108 سم', thigh: '68 سم' },
      { size: '38', waist: '96-100 سم', length: '110 سم', thigh: '70 سم' },
      { size: '40', waist: '101-105 سم', length: '112 سم', thigh: '72 سم' },
      { size: '42', waist: '106-110 سم', length: '114 سم', thigh: '74 سم' },
      { size: '44', waist: '111-115 سم', length: '116 سم', thigh: '76 سم' },
      { size: '46', waist: '116-120 سم', length: '118 سم', thigh: '78 سم' }
    ]
  };

  if (guide.enabled === false) return null;

  const title = language === 'ar' ? (guide.title_ar || 'دليل المقاسات الستريت وير') : (guide.title_en || 'Streetwear Size Guide');
  const subtitle = language === 'ar' ? guide.subtitle_ar : guide.subtitle_en;

  // WhatsApp Support Link
  const phone = siteContent?.whatsapp?.phone || siteContent?.footer?.whatsapp || '01023456789';
  const cleanPhone = formatWhatsAppNumber ? formatWhatsAppNumber(phone) : phone.replace(/[^0-9]/g, '');
  const supportMsg = language === 'ar' 
    ? 'مرحباً KESWA WEAR، أحتاج مساعدة في اختيار المقاس المناسب لي'
    : 'Hello KESWA WEAR, I need help picking the right size';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(supportMsg)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="relative bg-[#16161f] border border-white/15 w-full max-w-2xl rounded-xl shadow-2xl p-4 sm:p-6 space-y-4 text-white z-10 max-h-[90vh] overflow-y-auto animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black flex items-center gap-2 font-display">
              <span className="p-1.5 bg-amber-400 text-black rounded-md">
                <Ruler size={18} />
              </span>
              <span>{title}</span>
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-lg">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/10 gap-2">
          <button
            onClick={() => setActiveTab('tops')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tops'
                ? 'border-white text-white font-black'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>👕</span>
            <span>{language === 'ar' ? 'الهوديز والتيشرتات (Tops)' : 'Tops & Hoodies'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pants')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pants'
                ? 'border-amber-400 text-amber-400 font-black'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>👖</span>
            <span>{language === 'ar' ? 'البنطلونات (مقاسات 30 إلى 46)' : 'Pants (30 - 46)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('measure')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'measure'
                ? 'border-cyan-400 text-cyan-400 font-black'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <HelpCircle size={14} />
            <span>{language === 'ar' ? 'طريقة أخذ القياس' : 'How to Measure'}</span>
          </button>
        </div>

        {/* Tab 1: Tops */}
        {activeTab === 'tops' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="overflow-x-auto rounded border border-white/10">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-900/90 text-gray-300 font-bold border-b border-white/10">
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                    <th className="py-2.5 px-3">{language === 'ar' ? 'محيط الصدر' : 'Chest'}</th>
                    <th className="py-2.5 px-3">{language === 'ar' ? 'الطول الكامل' : 'Length'}</th>
                    <th className="py-2.5 px-3">{language === 'ar' ? 'عرض الكتف' : 'Shoulder'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {(guide.tops || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 text-start font-black text-amber-400">{row.size}</td>
                      <td className="py-2.5 px-3 text-gray-200">{row.chest}</td>
                      <td className="py-2.5 px-3 text-gray-200">{row.length}</td>
                      <td className="py-2.5 px-3 text-gray-200">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2.5 bg-neutral-900/50 rounded border border-white/5 text-[11px] text-gray-400 font-sans">
              💡 {language === 'ar' ? 'ملحوظة: تصاميمنا تتميز بقصة أوفرسايز بوكسي (Boxy Drop Shoulder) تعطي مظهراً عصرياً وراحة قصوى.' : 'Note: Our tops feature a streetwear boxy drop-shoulder cut for optimal relaxed comfort.'}
            </div>
          </div>
        )}

        {/* Tab 2: Pants (30 to 46) */}
        {activeTab === 'pants' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="overflow-x-auto rounded border border-white/10">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-900/90 text-gray-300 font-bold border-b border-white/10">
                    <th className="py-2.5 px-3 text-start">{language === 'ar' ? 'المقاس (رقمي)' : 'Size'}</th>
                    <th className="py-2.5 px-3">{language === 'ar' ? 'محيط الخصر (الوسط)' : 'Waist'}</th>
                    <th className="py-2.5 px-3">{language === 'ar' ? 'طول البنطلون' : 'Length'}</th>
                    <th className="py-2.5 px-3">{language === 'ar' ? 'محيط الفخذ' : 'Thigh'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {(guide.pants || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 text-start font-black text-amber-400">{row.size}</td>
                      <td className="py-2.5 px-3 text-gray-200">{row.waist}</td>
                      <td className="py-2.5 px-3 text-gray-200">{row.length}</td>
                      <td className="py-2.5 px-3 text-gray-200">{row.thigh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2.5 bg-neutral-900/50 rounded border border-white/5 text-[11px] text-gray-400 font-sans">
              👖 {language === 'ar' ? 'مقاسات البنطلونات تأتي بالأعداد الزوجية الرسمية من 30 إلى 46 مع خصر مرن وأربطة لضبط القياس.' : 'Pants are sized in standard even numbers from 30 to 46 with elastic waistband and drawstrings.'}
            </div>
          </div>
        )}

        {/* Tab 3: How to measure */}
        {activeTab === 'measure' && (
          <div className="space-y-3.5 text-xs text-gray-300 font-sans leading-relaxed animate-fadeIn">
            <div className="bg-neutral-900/70 p-3.5 rounded border border-white/10 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span>1. قياس الصدر (Chest):</span>
              </h4>
              <p className="text-gray-400">
                ضع شريط القياس حول أعرض نقطة في الصدر تحت الإبطين بشكل أفقي مستوٍ دون شد زائد.
              </p>
            </div>

            <div className="bg-neutral-900/70 p-3.5 rounded border border-white/10 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span>2. قياس الخصر (Waist):</span>
              </h4>
              <p className="text-gray-400">
                قم بالقياس حول محيط الخصر الطبيعي (فوق عظام الحوض بقليل) حيث يرتكز البنطلون أو حزام الخصر.
              </p>
            </div>

            <div className="bg-neutral-900/70 p-3.5 rounded border border-white/10 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span>3. قياس الطول (Length):</span>
              </h4>
              <p className="text-gray-400">
                قم بالقياس من أعلى نقطة في الكتف إلى الحافة السفلية للهودي، أو من الخصر إلى أسفل الكاحل للبنطلون.
              </p>
            </div>
          </div>
        )}

        {/* Footer WhatsApp Help Box */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/40 p-3 rounded-lg">
          <div className="text-center sm:text-start">
            <span className="text-xs font-bold text-white block">
              {language === 'ar' ? 'محتار بين مقاسين؟' : 'Unsure between two sizes?'}
            </span>
            <span className="text-[11px] text-gray-400">
              {language === 'ar' ? 'فريق الدعم الفني جاهز لمساعدتك في اختيار المقاس الأنسب لك' : 'Our team is ready to recommend the perfect fit'}
            </span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <WhatsAppIcon size={16} />
            <span>{language === 'ar' ? 'استشر الدعم الفني عبر واتساب' : 'Ask on WhatsApp'}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
