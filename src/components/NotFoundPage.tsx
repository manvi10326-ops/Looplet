import React from 'react';
import { ArrowLeft, Flower2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

import { BackButton } from './BackButton';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <BackButton fallbackRoute={{ view: 'home' }} />
      </div>
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F4DDE5] text-[#9F4E70] shadow-xs">
        <Flower2 className="h-10 w-10" />
      </div>
      <p className="mt-6 font-hand text-2xl text-[#9F4E70]">Oops, a dropped stitch!</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-[#4A3531] sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#7D5E5A]">
        We couldn’t find the crochet page you were looking for. Let’s take you back to our cozy
        boutique shelves.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ view: 'home' })}
          className="inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>
        <button
          type="button"
          onClick={() => navigate({ view: 'shop', category: 'all' })}
          className="inline-flex items-center gap-2 rounded-full border border-[#D78FAE] bg-white px-6 py-3 text-sm font-semibold text-[#9F4E70] transition-colors hover:bg-[#F4DDE5]/40"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Explore Shop</span>
        </button>
      </div>
      </div>
    </main>
  );
};
