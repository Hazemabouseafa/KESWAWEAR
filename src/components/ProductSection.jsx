import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const ProductSection = ({ 
  id, 
  category, 
  title, 
  subtitle, 
  viewAllText = "VIEW ALL",
  limit = 8 
}) => {
  const { products, setActiveCategory, activeCategory, searchQuery } = useStore();

  // Filter products by category, search query, or global category selection
  let filtered = products.filter(p => {
    // If specific section category is passed
    if (category && p.category !== category) return false;
    
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  if (filtered.length === 0) return null;

  return (
    <section id={id} className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header Matching Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase font-display tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm font-mono text-gray-400 uppercase tracking-wider mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={() => {
            setActiveCategory(category || 'all');
            const shopTarget = document.querySelector('#shop-all');
            if (shopTarget) shopTarget.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-white transition-colors group self-start sm:self-auto"
        >
          <span>{viewAllText}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Product Grid (4 columns desktop, 2 columns mobile/tablet) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
