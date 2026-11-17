import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { formatINR } from '../config/store';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/catalog';
import { BackButton } from '../components/BackButton';
import { SmartImage } from '../components/SmartImage';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, navigate } = useStore();

  const savedProducts = wishlist
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="bg-[#FFF9F2] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackRoute={{ view: 'home' }} />
        </div>

        <div className="text-center">
          <p className="font-hand text-2xl text-[#9F4E70]">Saved With Love</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
            Your Looplet Wishlist
          </h1>
          <p className="mt-2 text-sm text-[#7D5E5A]">
            Keep track of the handmade blooms, plushies, and accessories you have your eye on.
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-[#EED8E0] bg-white/85 px-6 py-14 text-center shadow-2xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4DDE5] text-[#9F4E70]">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold text-[#4A3531]">
              Your wishlist is currently empty
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7D5E5A]">
              Explore our handmade crochet collections and tap the heart icon on any creation to
              save it for later.
            </p>
            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all' })}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
            >
              <span>Explore Boutique</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map((product) => (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-[#EED8E0] bg-white shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => navigate({ view: 'product', slug: product.slug })}
                  className="aspect-[4/3] w-full overflow-hidden bg-[#FFF9F2]"
                >
                  <SmartImage
                    src={product.image}
                    alt={product.name}
                    fallbackTitle={product.name}
                    className="h-full w-full"
                  />
                </button>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#7D5E5A]">
                      {product.categoryLabel}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold text-[#4A3531]">
                      {product.name}
                    </h2>
                    <p className="tabular-nums mt-1.5 text-base font-semibold text-[#9F4E70]">
                      {formatINR(product.price)}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-[#F4DDE5] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1);
                        toggleWishlist(product);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#B9688A] px-4 py-2.5 text-xs font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#EED8E0] text-[#7D5E5A] transition-colors hover:bg-[#F4DDE5] hover:text-[#9F4E70]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
