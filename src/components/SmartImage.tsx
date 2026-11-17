import React, { useState } from 'react';
import { Flower2 } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4DDE5]/70 via-[#FFF9F2] to-[#F8E9B5]/60 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF9F2] text-[#B9688A] shadow-sm">
          <Flower2 className="h-6 w-6" />
        </div>
        <p className="font-display text-sm font-semibold text-[#4A3531] line-clamp-2">
          {fallbackTitle || alt}
        </p>
        <span className="mt-1 font-hand text-base text-[#7D5E5A]">Handmade by Looplet</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F4DDE5]/30 ${className}`}>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#F4DDE5]/30 via-[#FFF9F2]/60 to-[#F4DDE5]/30"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
