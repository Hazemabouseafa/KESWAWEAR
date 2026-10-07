import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ImageUploader } from '../ImageUploader';
import { Layers, Plus, Trash2, Edit2, X, Save, CheckCircle2 } from 'lucide-react';

export const CategoriesManager = () => {
  const { 
    siteContent, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    showToast,
    language 
  } = useStore();

  const { categories = [] } = siteContent;
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  
  // Local state for categories edits before hitting Save
  const [editingCats, setEditingCats] = useState(() => {
    const map = {};
    categories.forEach(c => {
      map[c.id] = { ...c };
    });
    return map;
  });

  const [savedCatId, setSavedCatId] = useState(null);

  const [newCategoryForm, setNewCategoryForm] = useState({
    id: '',
    name_ar: '',
    name_en: '',
    subtitle_ar: '',
    subtitle_en: '',
    bannerImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
    badge_ar: 'تشكيلة جديدة 2026',
    badge_en: 'NEW DROP 2026',
    buttonText_ar: 'تسوق التشكيلة',
    buttonText_en: 'SHOP COLLECTION',
    showBanner: true,
    showProducts: true
  });

  const handleFieldChange = (catId, field, value) => {
    setEditingCats(prev => ({
      ...prev,
      [catId]: {
        ...(prev[catId] || categories.find(c => c.id === catId)),
        [field]: value
      }
    }));
  };

  const handleSaveCategory = (catId) => {
    const dataToSave = editingCats[catId];
    if (dataToSave) {
      updateCategory(catId, dataToSave);
      setSavedCatId(catId);
      setTimeout(() => setSavedCatId(null), 2500);
      showToast(language === 'ar' ? `تم حفظ وتثبيت تعديلات قسم "${dataToSave.name_ar}" بنجاح! 💾` : 'Category changes saved! 💾', 'success');
    }
  };

  const handleSaveNewCategory = (e) => {
    e.preventDefault();
    if (!newCategoryForm.name_ar && !newCategoryForm.name_en) {
      alert("يرجى إدخال اسم القسم بالعربية أو الإنجليزية");
      return;
    }

    addCategory(newCategoryForm);
    setIsAddCategoryOpen(false);
    setNewCategoryForm({
      id: '',
      name_ar: '',
      name_en: '',
      subtitle_ar: '',
      subtitle_en: '',
      bannerImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
      badge_ar: 'تشكيلة جديدة 2026',
      badge_en: 'NEW DROP 2026',
      buttonText_ar: 'تسوق التشكيلة',
      buttonText_en: 'SHOP COLLECTION',
      showBanner: true,
      showProducts: true
    });
    showToast(language === 'ar' ? 'تمت إضافة القسم الجديد بنجاح وحفظه بالواجهة! 💾' : 'New category created! 💾', 'success');
  };

  return (
    <div className="max-w-5xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white mb-1 flex items-center gap-2">
            <Layers size={22} className="text-purple-400" />
            <span>إدارة وتعديل أقسام وبلوكات المتجر (Categories & Blocks)</span>
          </h2>
          <p className="text-xs text-gray-400">
            يمكنك تعديل مسميات وعناوين الأقسام وصور البنرات مع زر حفظ مخصص لكل قسم، أو إضافة بلوك جديد بالكامل.
          </p>
        </div>

        <button
          onClick={() => setIsAddCategoryOpen(!isAddCategoryOpen)}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-black px-4 py-2 rounded flex items-center gap-1.5 transition-all shadow-lg self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>{isAddCategoryOpen ? 'إغلاق النموذج' : 'إضافة بلوك / قسم جديد'}</span>
        </button>
      </div>

      {/* Add New Category Box */}
      {isAddCategoryOpen && (
        <div className="bg-[#181824] border border-purple-500/30 p-6 rounded-lg space-y-4 shadow-2xl animate-scaleIn">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Plus size={16} className="text-purple-400" />
              <span>إضافة بلوك وقسم جديد في الصفحة الرئيسية</span>
            </h3>
            <button onClick={() => setIsAddCategoryOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveNewCategory} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">اسم القسم بالعربية *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: جاكيتات ومعاطف"
                  value={newCategoryForm.name_ar}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name_ar: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">اسم القسم بالإنجليزية *</label>
                <input 
                  type="text" 
                  placeholder="e.g. JACKETS & COATS"
                  value={newCategoryForm.name_en}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name_en: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">الوصف الفرعي بالعربية (Subtitle):</label>
                <input 
                  type="text" 
                  placeholder="تشكيلة الجاكيتات الفاخرة للدفء والأناقة"
                  value={newCategoryForm.subtitle_ar}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, subtitle_ar: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">الوصف بالإنجليزية:</label>
                <input 
                  type="text" 
                  placeholder="Premium heavyweight outerwear collection"
                  value={newCategoryForm.subtitle_en}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, subtitle_en: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-mono"
                />
              </div>
            </div>

            {/* Banner Image Uploader */}
            <div>
              <ImageUploader 
                value={newCategoryForm.bannerImage}
                onChange={(url) => setNewCategoryForm({ ...newCategoryForm, bannerImage: url })}
                label="صورة بنر القسم الجديد (رفع من جهازك أو رابط):"
                description="ستظهر في البنر السينمائي العريض المخصص للقسم في الصفحة"
                previewHeight="h-36"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">نص البادج (العربية):</label>
                <input 
                  type="text" 
                  value={newCategoryForm.badge_ar}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, badge_ar: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">نص زر الشراء (العربية):</label>
                <input 
                  type="text" 
                  value={newCategoryForm.buttonText_ar}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, buttonText_ar: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="px-4 py-2 bg-neutral-800 text-gray-300 hover:text-white rounded"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded transition-colors shadow-lg flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>💾 حفظ وإضافة البلوك للواجهة</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Existing Categories for In-Place Editing */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
          <span>الأقسام والبلوكات الحالية في المتجر ({categories.length} أقسام):</span>
        </h3>

        <div className="space-y-6">
          {categories.map((cat, idx) => {
            const currentData = editingCats[cat.id] || cat;
            const isSaved = savedCatId === cat.id;

            return (
              <div key={cat.id} className="bg-[#16161f] border border-white/10 p-5 rounded-lg space-y-4 shadow-xl hover:border-white/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-black text-white">{currentData.name_ar} ({currentData.name_en})</h4>
                      <span className="text-[10px] font-mono text-gray-400">معرّف القسم: #{cat.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Explicit Save Button */}
                    <button
                      onClick={() => handleSaveCategory(cat.id)}
                      className={`text-xs px-4 py-2 rounded flex items-center gap-1.5 font-bold transition-all shadow-md ${
                        isSaved 
                          ? 'bg-emerald-500 text-black font-black' 
                          : 'bg-white hover:bg-neutral-200 text-black'
                      }`}
                    >
                      {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                      <span>{isSaved ? '✓ تم الحفظ!' : '💾 حفظ تعديلات القسم'}</span>
                    </button>

                    {!cat.isCore && (
                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف قسم "${cat.name_ar}" من المتجر؟`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 text-xs px-3 py-2 rounded flex items-center gap-1 border border-rose-500/20 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>حذف</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inputs to edit category details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1">الاسم بالعربية:</label>
                    <input 
                      type="text"
                      value={currentData.name_ar || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'name_ar', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">الاسم بالإنجليزية:</label>
                    <input 
                      type="text"
                      value={currentData.name_en || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'name_en', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-mono outline-none focus:border-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 mb-1">الوصف بالعربية:</label>
                    <input 
                      type="text"
                      value={currentData.subtitle_ar || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'subtitle_ar', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">نص البادج (العربية):</label>
                    <input 
                      type="text"
                      value={currentData.badge_ar || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'badge_ar', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">نص زر الشراء (العربية):</label>
                    <input 
                      type="text"
                      value={currentData.buttonText_ar || ''}
                      onChange={(e) => handleFieldChange(cat.id, 'buttonText_ar', e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 px-3 py-2 text-white rounded font-bold outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Banner Image with ImageUploader */}
                <div>
                  <ImageUploader 
                    value={currentData.bannerImage || ''}
                    onChange={(url) => handleFieldChange(cat.id, 'bannerImage', url)}
                    label={`صورة بنر قسم ${currentData.name_ar} (رفع من جهازك أو رابط):`}
                    description="الصورة السينمائية المعروضة كخلفية لقسم هذا التصنيف في المتجر"
                    previewHeight="h-36"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};