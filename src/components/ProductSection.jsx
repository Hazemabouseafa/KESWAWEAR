import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const ProductSection = ({ 
  id, 
  category, 
  title, 
  subtitle, 
  viewAllText,
  limit = 8,
  showEmptyPlaceholder = false
}) => {
  const { products, setActiveCategory, searchQuery, language, t } = useStore();

  let filtered = products.filter(p => {
    if (category && p.category !== category) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameEn = (p.name_en || p.name || '').toLowerCase();
      const nameAr = (p.name_ar || '').toLowerCase();
      const matchName = nameEn.includes(q) || nameAr.includes(q);
      const matchDesc = (p.description_ar || p.description_en || p.description || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  if (filtered.length === 0 && !showEmptyPlaceholder) return null;

  const displayViewAll = viewAllText || t('actions.viewAll');

  return (
    <section id={id} className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e5e3db] gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase font-display tracking-tight text-neutral-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm font-sans text-neutral-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {filtered.length > 0 && (
          <button
            onClick={() => {
              setActiveCategory(category || 'all');
              const shopTarget = document.querySelector('#shop');
              if (shopTarget) shopTarget.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-black transition-colors group self-start sm:self-auto font-sans"
          >
            <span>{displayViewAll}</span>
            {language === 'ar' ? (
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 px-6 text-center border border-dashed border-[#d8d6ce] bg-white/70 rounded-sm">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2 text-base">
            ✨
          </div>
          <h4 className="text-sm font-bold text-neutral-800">
            {language === 'ar' ? 'تشكيلة هذا القسم قادمة قريباً!' : 'Products for this category coming soon!'}
          </h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {language === 'ar' 
              ? 'تمت إضافة هذا القسم وتفعيله بالواجهة الرئيسية. يمكنك إضافة وتعيين منتجات له من لوحة التحكم.' 
              : 'Category is live on the storefront. You can assign products to this category from the Admin Panel.'}
          </p>
        </div>
      )}
    </section>
  );
};
