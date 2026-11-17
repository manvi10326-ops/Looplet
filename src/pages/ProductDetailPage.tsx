import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { buildWhatsAppUrl, formatINR } from '../config/store';
import { useStore } from '../context/StoreContext';
import { getProductBySlug, PRODUCTS } from '../data/catalog';
import { BackButton } from '../components/BackButton';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigate, navigateToCategory } = useStore();

  const product = getProductBySlug(slug);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0]?.name);
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    const others = PRODUCTS.filter(
      (p) => p.category !== product.category && p.isBestseller
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <BackButton fallbackRoute={{ view: 'shop', category: 'all' }} />
        </div>
        <div className="mx-auto max-w-xl py-10 text-center">
          <p className="font-hand text-2xl text-[#9F4E70]">Product not found</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#4A3531]">
            We couldn’t find that crochet piece
          </h1>
          <button
            type="button"
            onClick={() => navigate({ view: 'shop', category: 'all' })}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] hover:bg-[#A45677]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse All Products</span>
          </button>
        </div>
      </main>
    );
  }

  const images =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const activeImage = images[activeImageIndex] || product.image;
  const wishlisted = isInWishlist(product.id);

  const customWhatsAppInquiry = buildWhatsAppUrl(
    `Hi Looplet! I am looking at "${product.name}" (${formatINR(product.price)}) and had a quick question about custom colours / availability.`
  );

  return (
    <main className="bg-[#FFF9F2] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <BackButton fallbackRoute={{ view: 'shop', category: product.category }} />
        </div>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#7D5E5A]">
          <button
            type="button"
            onClick={() => navigate({ view: 'home' })}
            className="hover:text-[#9F4E70]"
          >
            Home
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => navigateToCategory(product.category)}
            className="hover:text-[#9F4E70]"
          >
            {product.categoryLabel}
          </button>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-[#4A3531]">{product.name}</span>
        </nav>

        {/* Contiguous Two-Column Product Showcase */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Sticky Gallery */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[2rem] border border-[#EED8E0] bg-white p-2.5 shadow-sm">
                <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                  <SmartImage
                    src={activeImage}
                    alt={product.name}
                    fallbackTitle={product.name}
                    loading="eager"
                    className="h-full w-full"
                  />
                </div>
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-20 w-24 overflow-hidden rounded-2xl border-2 bg-white p-1 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#B9688A]'
                          : 'border-[#EED8E0] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <SmartImage
                        src={imgUrl}
                        alt={`${product.name} view ${idx + 1}`}
                        fallbackTitle={product.name}
                        className="h-full w-full rounded-xl"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Purchase Module */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-[#EED8E0] bg-white/85 p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#7D5E5A]">
                <span className="uppercase tracking-wider">{product.categoryLabel}</span>
                <span>{product.availabilityLabel}</span>
              </div>

              <h1 className="mt-2 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="tabular-nums text-2xl font-semibold text-[#9F4E70] sm:text-3xl">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs text-[#7D5E5A]">Inclusive of handmade gift wrapping</span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[#7D5E5A] sm:text-base">
                {product.description}
              </p>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6 border-t border-[#F4DDE5] pt-5">
                  <p className="text-xs font-semibold text-[#4A3531]">
                    Colour Option:{' '}
                    <span className="font-normal text-[#7D5E5A]">{selectedColor}</span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {product.colors.map((c) => {
                      const active = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                            active
                              ? 'border-[#B9688A] bg-[#F4DDE5]/70 text-[#4A3531]'
                              : 'border-[#EED8E0] bg-[#FFF9F2] text-[#7D5E5A] hover:border-[#D78FAE]'
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Primary Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#F4DDE5] pt-6">
                <div className="flex items-center rounded-full border border-[#EED8E0] bg-[#FFF9F2] px-2.5 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#4A3531] hover:bg-[#F4DDE5]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="tabular-nums w-9 text-center text-sm font-semibold text-[#4A3531]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#4A3531] hover:bg-[#F4DDE5]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, quantity, selectedColor)}
                  disabled={!product.inStock}
                  className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-all hover:bg-[#A45677]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`inline-flex h-[46px] items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                    wishlisted
                      ? 'border-[#B9688A] bg-[#F4DDE5] text-[#9F4E70]'
                      : 'border-[#EED8E0] bg-[#FFF9F2] text-[#4A3531] hover:bg-[#F4DDE5]/50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Product Details List */}
              <div className="mt-7 border-t border-[#F4DDE5] pt-6">
                <h2 className="flex items-center gap-2 font-display text-base font-semibold text-[#4A3531]">
                  <Sparkles className="h-4 w-4 text-[#9F4E70]" />
                  <span>Handmade Details &amp; Dimensions</span>
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-[#7D5E5A]">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9F4E70]" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct WhatsApp Inquiry */}
              <div className="mt-6 rounded-2xl border border-[#D6E2C8] bg-[#D6E2C8]/30 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-xs leading-relaxed text-[#354328]">
                    Want this piece in a custom yarn shade or gift bundle?
                  </p>
                  <a
                    href={customWhatsAppInquiry}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#D6E2C8] px-4 py-2 text-xs font-semibold text-[#354328] transition-colors hover:bg-[#C6D5B6]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Ask on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16 border-t border-[#EED8E0] pt-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-hand text-2xl text-[#9F4E70]">Pairs Lovely With</p>
              <h2 className="font-display text-2xl font-semibold text-[#4A3531] sm:text-3xl">
                Related Crochet Creations
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigateToCategory(product.category)}
              className="text-xs font-semibold text-[#9F4E70] hover:underline sm:text-sm"
            >
              View Category
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
