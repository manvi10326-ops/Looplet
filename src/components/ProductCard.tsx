import React from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { formatINR } from '../config/store';
import { useStore } from '../context/StoreContext';
import { Product, ProductBadge } from '../types/shop';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  badgeOverride?: ProductBadge;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badgeOverride }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigate, setQuickViewProduct } = useStore();
  const wishlisted = isInWishlist(product.id);
  const displayBadge = badgeOverride || product.badge;

  const badgeTone =
    displayBadge === 'Bestseller'
      ? 'bg-[#F8E9B5] text-[#4A3531] border-[#E8D595]'
      : displayBadge === 'Limited Stock'
      ? 'bg-[#D6E2C8] text-[#354328] border-[#B9C9A8]'
      : 'bg-[#F4DDE5] text-[#4A3531] border-[#E5BECB]';

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-[#EED8E0] bg-white/80 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF9F2]">
        <button
          type="button"
          onClick={() => navigate({ view: 'product', slug: product.slug })}
          className="block h-full w-full text-left focus-visible:ring-2 focus-visible:ring-[#B9688A]"
          aria-label={`View ${product.name}`}
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            fallbackTitle={product.name}
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>

        {/* Top-left single badge */}
        {displayBadge && (
          <span
            className={`pointer-events-none absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${badgeTone}`}
          >
            {displayBadge}
          </span>
        )}

        {/* Top-right Quick View & Wishlist buttons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-xs transition-colors ${
              wishlisted
                ? 'border-[#B9688A] bg-[#F4DDE5] text-[#9F4E70]'
                : 'border-[#EED8E0] bg-[#FFF9F2]/95 text-[#7D5E5A] hover:bg-[#F4DDE5] hover:text-[#9F4E70]'
            }`}
          >
            <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EED8E0] bg-[#FFF9F2]/95 text-[#7D5E5A] shadow-xs transition-all hover:bg-[#F4DDE5] hover:text-[#4A3531] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#7D5E5A]">
            {product.categoryLabel}
          </p>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug text-[#4A3531] sm:text-lg">
            <button
              type="button"
              onClick={() => navigate({ view: 'product', slug: product.slug })}
              className="text-left transition-colors hover:text-[#9F4E70]"
            >
              {product.name}
            </button>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#7D5E5A] sm:text-sm">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F4DDE5] pt-3.5">
          <div>
            <span className="tabular-nums text-base font-semibold text-[#4A3531] sm:text-lg">
              {formatINR(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-[#B9688A] px-4 py-2 text-xs font-semibold text-[#FFF9F2] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A45677] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">{product.inStock ? 'Add to Cart' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
