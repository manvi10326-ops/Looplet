import React, { useEffect, useState } from 'react';
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatINR } from '../config/store';
import { useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setSelectedColor(quickViewProduct.colors?.[0]?.name);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    if (quickViewProduct) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const wishlisted = isInWishlist(quickViewProduct.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4A3531]/40 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#EED8E0] bg-[#FFF9F2] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#EED8E0] bg-[#FFF9F2] text-[#4A3531] shadow-xs transition-colors hover:bg-[#F4DDE5]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[4/3] w-full bg-[#F4DDE5]/20 md:aspect-auto md:h-full">
            <SmartImage
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              fallbackTitle={quickViewProduct.name}
              className="h-full w-full"
            />
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#7D5E5A]">
                {quickViewProduct.categoryLabel} · {quickViewProduct.availabilityLabel}
              </p>
              <h2
                id="quick-view-title"
                className="mt-2 font-display text-2xl font-semibold text-[#4A3531]"
              >
                {quickViewProduct.name}
              </h2>
              <p className="tabular-nums mt-2 text-xl font-semibold text-[#9F4E70]">
                {formatINR(quickViewProduct.price)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#7D5E5A]">
                {quickViewProduct.description}
              </p>

              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-[#4A3531]">
                    Yarn Shade: <span className="font-normal text-[#7D5E5A]">{selectedColor}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c) => {
                      const active = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            active
                              ? 'border-[#B9688A] bg-[#F4DDE5] text-[#4A3531]'
                              : 'border-[#EED8E0] bg-white text-[#7D5E5A] hover:border-[#D78FAE]'
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-semibold text-[#4A3531]">Quantity</span>
                <div className="flex items-center rounded-full border border-[#EED8E0] bg-white px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#4A3531] hover:bg-[#F4DDE5]/60"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="tabular-nums w-8 text-center text-sm font-semibold text-[#4A3531]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#4A3531] hover:bg-[#F4DDE5]/60"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-[#EED8E0] pt-5">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(quickViewProduct, quantity, selectedColor);
                    setQuickViewProduct(null);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#B9688A] px-5 py-3 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct)}
                  aria-label="Toggle wishlist"
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    wishlisted
                      ? 'border-[#B9688A] bg-[#F4DDE5] text-[#9F4E70]'
                      : 'border-[#EED8E0] bg-white text-[#7D5E5A] hover:bg-[#F4DDE5]/50'
                  }`}
                >
                  <Heart className={`h-4.5 w-4.5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate({ view: 'product', slug: quickViewProduct.slug })}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#D78FAE] bg-transparent px-4 py-2.5 text-xs font-semibold text-[#9F4E70] transition-colors hover:bg-[#F4DDE5]/40"
              >
                <span>View Full Product Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
