import React from 'react';

/**
 * KESWA Logo Component
 * Renders high-fidelity metallic vector geometry based on Image 2,
 * with support for inline navbar styling, full centered brand lockup,
 * and optional raw asset rendering.
 */
export const KeswaLogo = ({ 
  variant = 'inline', // 'inline' | 'full' | 'icon' | 'badge'
  size = 'md',        // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  light = false 
}) => {
  // If user chooses badge mode, render the original dark textured image
  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-md ${className}`}>
        <img 
          src="/assets/keswa-logo.jpg" 
          alt="KESWA WEAR" 
          className={`object-cover ${
            size === 'sm' ? 'h-10 w-auto' :
            size === 'md' ? 'h-16 w-auto' :
            size === 'lg' ? 'h-24 w-auto' : 'h-36 w-auto'
          }`} 
        />
      </div>
    );
  }

  // Size configurations
  const dimensions = {
    sm: { kSize: 22, text: 'text-base tracking-[0.25em]', tagline: 'text-[7px]', crown: 10 },
    md: { kSize: 32, text: 'text-2xl tracking-[0.3em]', tagline: 'text-[9px]', crown: 14 },
    lg: { kSize: 48, text: 'text-4xl tracking-[0.35em]', tagline: 'text-xs', crown: 18 },
    xl: { kSize: 72, text: 'text-6xl tracking-[0.4em]', tagline: 'text-sm', crown: 24 },
  }[size] || { kSize: 32, text: 'text-2xl tracking-[0.3em]', tagline: 'text-[9px]', crown: 14 };

  // Metallic Sharp K Emblem SVG
  const KSymbol = () => (
    <svg 
      width={dimensions.kSize} 
      height={dimensions.kSize * 1.05} 
      viewBox="0 0 100 105" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)] transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="metallicLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#d1d5db" />
          <stop offset="70%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient id="metallicDark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#f3f4f6" />
        </linearGradient>
        <filter id="chiselGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Vertical Stem of K */}
      <path 
        d="M20 12 L44 12 L44 92 L20 92 Z" 
        fill="url(#metallicLight)" 
        stroke="#475569" 
        strokeWidth="1"
      />
      {/* Vertical Stem Bevel / Highlight */}
      <path 
        d="M20 12 L32 12 L32 92 L20 92 Z" 
        fill="white" 
        fillOpacity="0.25"
      />

      {/* Top Diagonal Blade Arm of K with sliced gap */}
      <path 
        d="M40 54 L78 12 L96 12 L50 64 Z" 
        fill="url(#metallicLight)" 
        stroke="#475569" 
        strokeWidth="0.8"
      />
      {/* Sliced blade accent highlight */}
      <path 
        d="M43 51 L84 12 L78 12 L39 53 Z" 
        fill="#ffffff" 
        fillOpacity="0.7"
      />

      {/* Bottom Diagonal Arm of K */}
      <path 
        d="M42 52 L88 92 L68 92 L34 60 Z" 
        fill="url(#metallicDark)" 
        stroke="#475569" 
        strokeWidth="0.8"
      />
      {/* Bottom faceted bevel */}
      <path 
        d="M34 60 L68 92 L60 92 L30 63 Z" 
        fill="white" 
        fillOpacity="0.2"
      />
    </svg>
  );

  // Crown Icon SVG
  const Crown = () => (
    <svg 
      width={dimensions.crown} 
      height={dimensions.crown * 0.75} 
      viewBox="0 0 24 18" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-300 inline-block drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]"
    >
      <path 
        d="M2 15L4 4L9 9L12 2L15 9L20 4L22 15H2Z" 
        fill="url(#metallicLight)" 
        stroke="#64748b" 
        strokeWidth="0.75" 
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <KSymbol />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center select-none text-center ${className}`}>
        {/* K Emblem */}
        <div className="mb-2">
          <KSymbol />
        </div>

        {/* Brand Name */}
        <div className={`font-black uppercase font-display metallic-text ${dimensions.text} tracking-[0.35em] pl-[0.35em]`}>
          KESWA
        </div>

        {/* Divider with Crown */}
        <div className="flex items-center justify-center gap-3 w-44 my-1.5 opacity-80">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-400 to-gray-200"></div>
          <Crown />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gray-400 to-gray-200"></div>
        </div>

        {/* Tagline */}
        <div className={`uppercase tracking-[0.45em] text-gray-400 font-semibold ${dimensions.tagline} pl-[0.45em]`}>
          CLOTHES <span className="text-gray-600 mx-1">•</span> STYLE <span className="text-gray-600 mx-1">•</span> YOU
        </div>
      </div>
    );
  }

  // Default 'inline' variant (optimized for navbar)
  return (
    <div className={`group inline-flex items-center gap-2.5 select-none ${className}`}>
      <KSymbol />
      <div className="flex flex-col">
        <span className={`font-black uppercase font-display metallic-text ${dimensions.text} leading-none tracking-[0.25em]`}>
          KESWA
        </span>
        <span className="text-[7px] tracking-[0.35em] uppercase text-gray-400 font-semibold leading-tight pl-[1px]">
          WEAR
        </span>
      </div>
    </div>
  );
};
