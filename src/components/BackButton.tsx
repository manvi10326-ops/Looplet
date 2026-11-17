import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/shop';

interface BackButtonProps {
  fallbackRoute?: PageRoute;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallbackRoute = { view: 'home' },
  onClick,
  className = '',
  ariaLabel = 'Go back to previous page',
}) => {
  const { goBack } = useStore();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    goBack(fallbackRoute);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`group inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2 text-xs font-semibold text-[#4A3531] shadow-2xs transition-all duration-200 hover:-translate-x-0.5 hover:border-[#D78FAE] hover:bg-[#F4DDE5]/55 hover:text-[#9F4E70] focus-visible:ring-2 focus-visible:ring-[#B9688A] sm:min-h-[38px] sm:text-sm ${className}`}
    >
      <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span className="whitespace-nowrap">Back</span>
    </button>
  );
};
