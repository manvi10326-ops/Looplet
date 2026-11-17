import React, { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, STORE_CONFIG } from '../config/store';
import { CocoAvatar } from './CocoAvatar';

interface FloatingActionsProps {
  isCocoOpen: boolean;
  isCocoMinimized: boolean;
  onOpenCoco: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  isCocoOpen,
  isCocoMinimized,
  onOpenCoco,
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isCocoOpen && !isCocoMinimized) {
    return null;
  }

  return (
    <div
      className={`fixed right-5 z-40 flex flex-col items-end gap-3 ${
        isCocoOpen && isCocoMinimized ? 'bottom-20' : 'bottom-5'
      }`}
    >
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5BECB] bg-[#FFF9F2] text-[#4A3531] shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#F4DDE5] focus-visible:ring-2 focus-visible:ring-[#B9688A]"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      )}

      <a
        href={buildWhatsAppUrl(STORE_CONFIG.whatsappGreeting)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Looplet on WhatsApp"
        className="group flex items-center gap-2 rounded-full border border-[#B9C9A8] bg-[#D6E2C8] px-3.5 py-2.5 text-xs font-semibold text-[#354328] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C9D8B8] focus-visible:ring-2 focus-visible:ring-[#4A3531]"
      >
        <MessageCircle className="h-4.5 w-4.5 shrink-0 fill-[#354328]/10 text-[#354328]" />
        <span className="hidden whitespace-nowrap sm:inline">WhatsApp</span>
      </a>

      {!isCocoOpen && (
        <div className="group relative flex items-center">
          <div
            role="tooltip"
            className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-[#E5BECB] bg-[#FFF9F2] px-3.5 py-1.5 text-xs font-semibold text-[#4A3531] opacity-0 shadow-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            Chat with Coco 🧶
          </div>

          <button
            type="button"
            onClick={onOpenCoco}
            aria-label="Chat with Coco 🧶"
            title="Chat with Coco 🧶"
            className="animate-coco-float relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D78FAE] bg-gradient-to-br from-[#F4DDE5] via-[#FFF9F2] to-[#F8E9B5]/80 shadow-xl transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#B9688A]"
          >
            <CocoAvatar className="h-11 w-11" />
            <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-[#FFF9F2] bg-[#52995A]" />
          </button>
        </div>
      )}
    </div>
  );
};
