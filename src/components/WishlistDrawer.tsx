import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatINR } from '../config/store';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/catalog';
import { BackButton } from './BackButton';
import { SmartImage } from './SmartImage';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    navigate,
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = wishlist
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#4A3531]/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Wishlist"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-[#EED8E0] bg-[#FFF9F2] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EED8E0] px-5 py-4">
          <div className="flex items-center gap-3">
            <BackButton
              onClick={() => setIsWishlistOpen(false)}
              ariaLabel="Close wishlist and go back"
              className="px-3 py-1.5 min-h-[34px] sm:min-h-[34px]"
            />
            <div className="flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 fill-[#D78FAE] text-[#9F4E70]" />
              <h2 className="font-display text-lg font-semibold text-[#4A3531]">Wishlist</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#7D5E5A] transition-colors hover:bg-[#F4DDE5]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {savedProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4DDE5] text-[#9F4E70]">
                <Heart className="h-8 w-8" />
              </div>
              <p className="mt-4 font-hand text-2xl text-[#9F4E70]">Save what makes you smile</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-[#4A3531]">
                Your wishlist is empty
              </h3>
              <p className="mt-2 max-w-xs text-sm text-[#7D5E5A]">
                Tap the little heart icon on any handmade crochet piece to keep your favourites
                saved right here.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsWishlistOpen(false);
                  navigate({ view: 'shop', category: 'all' });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
              >
                <span>Browse Boutique</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {savedProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-[#EED8E0] bg-white p-3.5 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsWishlistOpen(false);
                      navigate({ view: 'product', slug: product.slug });
                    }}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#FFF9F2]"
                  >
                    <SmartImage
                      src={product.image}
                      alt={product.name}
                      fallbackTitle={product.name}
                      className="h-full w-full"
                    />
                  </button>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate font-display text-sm font-semibold text-[#4A3531]">
                          {product.name}
                        </h4>
                        <p className="tabular-nums mt-0.5 text-sm font-semibold text-[#9F4E70]">
                          {formatINR(product.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="rounded-full p-1 text-[#7D5E5A] transition-colors hover:bg-[#F4DDE5] hover:text-[#9F4E70]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product, 1);
                          toggleWishlist(product);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#B9688A] px-4 py-1.5 text-xs font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {savedProducts.length > 0 && (
          <div className="border-t border-[#EED8E0] bg-white px-6 py-4">
            <button
              type="button"
              onClick={() => {
                setIsWishlistOpen(false);
                navigate({ view: 'wishlist' });
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-5 py-2.5 text-xs font-semibold text-[#9F4E70] transition-colors hover:bg-[#F4DDE5]/50"
            >
              <span>View Full Wishlist Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
