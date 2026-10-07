import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Trash2, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

export const ImageUploader = ({
  value,
  onChange,
  label,
  description,
  aspectRatio = "video", // "video" (16:9), "square" (1:1), "portrait" (3:4)
  previewHeight = "h-36",
  placeholder = "https://images.unsplash.com/..."
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const dataUrl = await processImageFile(file);
      onChange(dataUrl);
      setUrlDraft(dataUrl);
    } catch (err) {
      setErrorMsg(err.message || "حدث خطأ أثناء معالجة الصورة");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSaveUrl = () => {
    if (urlDraft) {
      onChange(urlDraft);
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlDraft('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#14141c] border border-white/10 rounded p-3.5 space-y-3 font-sans text-right select-none">
      {/* Header */}
      {(label || description) && (
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            {label && <h4 className="text-xs font-bold text-white">{label}</h4>}
            {description && <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>}
          </div>
          {value && (
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <Check size={10} />
              <span>الصورة نشطة</span>
            </span>
          )}
        </div>
      )}

      {/* Image Preview & Dropzone */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full ${previewHeight} bg-black/80 rounded overflow-hidden border-2 transition-all flex items-center justify-center group ${
          isDragging 
            ? 'border-cyan-400 bg-cyan-950/30' 
            : value 
              ? 'border-white/10 hover:border-white/30' 
              : 'border-dashed border-white/20 hover:border-white/40'
        }`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2 text-cyan-400">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-xs font-bold">جاري ضغط ومعالجة الصورة...</span>
          </div>
        ) : value ? (
          <>
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop";
              }}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-black hover:bg-neutral-200 text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-lg"
              >
                <Upload size={13} />
                <span>تبديل من الجهاز</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1 shadow-lg"
                title="إزالة الصورة"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-4 text-gray-400 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-200">اسحب وأفلت الصورة هنا، أو اضغط للرفع</p>
              <p className="text-[10px] text-gray-500 mt-0.5">يدعم JPG, PNG, WebP (يتم الضغط تلقائياً للحفاظ على الأداء)</p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20 text-center">
          {errorMsg}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="flex-1 bg-white hover:bg-neutral-200 text-black font-black text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
        >
          <Upload size={14} className="text-black" />
          <span>رفع صورة من جهازك</span>
        </button>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 text-xs py-2 px-3 rounded flex items-center gap-1.5 transition-colors border border-white/10"
          title="أو إدخال رابط خارجي"
        >
          <LinkIcon size={13} />
          <span>{showUrlInput ? 'إخفاء الرابط' : 'أو إدخال رابط (URL)'}</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded border border-rose-500/20"
            title="مسح الصورة"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* URL Input Form when opened */}
      {showUrlInput && (
        <div className="flex items-center gap-1.5 pt-1 animate-fadeIn">
          <input 
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onBlur={handleSaveUrl}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveUrl(); }}
            placeholder={placeholder}
            className="flex-1 bg-neutral-900 border border-white/15 px-3 py-1.5 text-xs text-white rounded outline-none focus:border-white font-mono"
          />
          <button
            type="button"
            onClick={handleSaveUrl}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
          >
            تطبيق
          </button>
        </div>
      )}
    </div>
  );
};
