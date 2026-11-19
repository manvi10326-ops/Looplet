import React, { useState } from 'react';
import { Check, Eye, Heart, Plus } from 'lucide-react';
import { formatINR } from '../config/store';
import { useStore } from '../context/StoreContext';
import { Product, ProductBadge } from '../types/shop';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  badgeOverride?: ProductBadge | string;
  surfaceIndex?: number;
  polaroidTilt?: 'none' | 'left' | 'right';
}

const PASTEL_BACKDROPS = [
  'bg-[#FFFDF9] border-[#EFE0E6]',
  'bg-[#F4DDE5]/35 border-[#E9C9D6]',
  'bg-[#F8E9B5]/30 border-[#EADAA0]',
  'bg-[#D6E2C8]/30 border-[#C6D5B7]',
];

function getDeterministicTintIndex(id: string): number {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  return sum % PASTEL_BACKDROPS.length;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  badgeOverride,
  surfaceIndex,
  polaroidTilt = 'none',
}) => {
  const { addToCart, toggleWishlist, isInWishlist, navigate, setQuickViewProduct } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const wishlisted = isInWishlist(product.id);
  const displayLabel = badgeOverride || product.badge;
  const backdropClass =
    PASTEL_BACKDROPS[
      typeof surfaceIndex === 'number'
        ? surfaceIndex % PASTEL_BACKDROPS.length
        : getDeterministicTintIndex(product.id)
    ];

  const stickerClass =
    displayLabel === 'Bestseller' || displayLabel === 'A LITTLE FAVOURITE'
      ? 'bg-[#F8E9B5] text-[#5B4527]'
      : displayLabel === 'Limited Stock'
      ? 'bg-[#D6E2C8] text-[#354328]'
      : 'bg-[#F4DDE5] text-[#6B374D]';

  const tiltClass =
    polaroidTilt === 'left'
      ? 'hover:-rotate-[0.8deg]'
      : polaroidTilt === 'right'
      ? 'hover:rotate-[0.8deg]'
      : '';

  const handleQuickAdd = () => {
    if (!product.inStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    setHeartPop(true);
    window.setTimeout(() => setHeartPop(false), 280);
  };

  return (
    <article
      className={`group relative flex flex-col rounded-[1.6rem] border p-2.5 shadow-[0_8px_22px_-16px_rgba(74,53,49,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_-14px_rgba(74,53,49,0.22)] ${backdropClass} ${tiltClass}`}
    >
      {/* Framed Scrapbook Image Window */}
      <div className="relative aspect-[4/4] w-full overflow-hidden rounded-[1.2rem] bg-[#FFF9F2]">
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
            className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.05]"
          />
        </button>

        {/* Sticker-Style Handmade Label */}
        {displayLabel && (
          <span
            className={`pointer-events-none absolute left-2.5 top-2.5 -rotate-2 rounded-md px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase shadow-2xs ${stickerClass}`}
          >
            {displayLabel}
          </span>
        )}

        {/* Wishlist Heart & Quick View */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={
              wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Save ${product.name} to wishlist`
            }
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-xs transition-colors duration-150 ${
              wishlisted
                ? 'bg-[#FFF9F2] text-[#B9688A]'
                : 'bg-[#FFF9F2]/90 text-[#7D5E5A] hover:bg-[#F4DDE5] hover:text-[#9F4E70]'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''} ${
                heartPop ? 'animate-heart-pop' : ''
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF9F2]/90 text-[#7D5E5A] shadow-xs transition-all duration-150 hover:bg-[#F8E9B5] hover:text-[#4A3531] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Catalogue Caption Area */}
      <div className="flex flex-1 flex-col justify-between px-2 pb-1.5 pt-3.5">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#7D5E5A]">
            <span className="truncate">{product.productType}</span>
            <span className="font-hand text-sm text-[#9F4E70]">handmade ♡</span>
          </div>

          <h3 className="mt-1 font-display text-[16px] font-semibold leading-snug text-[#4A3531]">
            <button
              type="button"
              onClick={() => navigate({ view: 'product', slug: product.slug })}
              className="text-left transition-colors hover:text-[#9F4E70]"
            >
              {product.name}
            </button>
          </h3>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#7D5E5A]">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-dashed border-[#E5BECB]/80 pt-3">
          <span className="tabular-nums text-[15px] font-semibold text-[#4A3531]">
            {formatINR(product.price)}
          </span>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`inline-flex min-h-[36px] items-center justify-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
              justAdded
                ? 'bg-[#D6E2C8] text-[#354328]'
                : 'bg-[#D78FAE] text-[#FFF9F2] hover:bg-[#B9688A]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">Added ♡</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{product.inStock ? 'Add' : 'Sold Out'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
