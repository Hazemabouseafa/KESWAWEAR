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
  limit = 8 
}) => {
  const { products, setActiveCategory, searchQuery, language, t, getLocalized } = useStore();

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

  if (filtered.length === 0) return null;

  const displayViewAll = viewAllText || t('actions.viewAll');

  return (
    <section id={id} className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase font-display tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm font-sans text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={() => {
            setActiveCategory(category || 'all');
            const shopTarget = document.querySelector('#shop');
            if (shopTarget) shopTarget.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors group self-start sm:self-auto font-sans"
        >
          <span>{displayViewAll}</span>
          {language === 'ar' ? (
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
