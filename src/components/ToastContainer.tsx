import React from 'react';
import { CheckCircle2, Heart, Sparkles, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-24 right-4 z-50 flex max-w-xs flex-col gap-2 sm:bottom-6 sm:right-20 sm:max-w-sm"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const toneClasses =
          toast.tone === 'sage'
            ? 'bg-[#D6E2C8] text-[#354328] border-[#BACCA8]'
            : toast.tone === 'butter'
            ? 'bg-[#F8E9B5] text-[#4A3531] border-[#E7D494]'
            : 'bg-[#F4DDE5] text-[#4A3531] border-[#E5BECB]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-md transition-all duration-200 ${toneClasses}`}
          >
            <span className="shrink-0">
              {toast.tone === 'sage' ? (
                <Heart className="h-4 w-4 fill-current text-[#B9688A]" />
              ) : toast.tone === 'butter' ? (
                <Sparkles className="h-4 w-4 text-[#7D5E5A]" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-[#B9688A]" />
              )}
            </span>
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-full p-1 text-[#7D5E5A] transition-colors hover:bg-black/5 hover:text-[#4A3531]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
