import React from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatINR, STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/catalog';
import { BackButton } from './BackButton';
import { SmartImage } from './SmartImage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useStore();

  if (!isCartOpen) return null;

  const itemsWithDetails = cart
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = itemsWithDetails.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );
  const qualifiesForFreeShipping = subtotal >= STORE_CONFIG.shipping.freeShippingThreshold;
  const shippingFee =
    itemsWithDetails.length === 0 || qualifiesForFreeShipping
      ? 0
      : STORE_CONFIG.shipping.standardShippingFee;
  const total = subtotal + shippingFee;
  const amountRemaining = Math.max(0, STORE_CONFIG.shipping.freeShippingThreshold - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#4A3531]/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-[#EED8E0] bg-[#FFF9F2] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EED8E0] px-5 py-4">
          <div className="flex items-center gap-3">
            <BackButton
              onClick={() => setIsCartOpen(false)}
              ariaLabel="Close bag and go back"
              className="px-3 py-1.5 min-h-[34px] sm:min-h-[34px]"
            />
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-[#9F4E70]" />
              <h2 className="font-display text-lg font-semibold text-[#4A3531]">Your Bag</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#7D5E5A] transition-colors hover:bg-[#F4DDE5]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free shipping progress note */}
        {itemsWithDetails.length > 0 && (
          <div className="border-b border-[#EED8E0] bg-[#F4DDE5]/45 px-6 py-2.5 text-center text-xs font-medium text-[#4A3531]">
            {qualifiesForFreeShipping ? (
              <span>♡ Yay! Your order qualifies for Free Pan-India Shipping ♡</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">{formatINR(amountRemaining)}</strong> more for
                Free Shipping
              </span>
            )}
          </div>
        )}

        {/* Items List / Empty State */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {itemsWithDetails.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4DDE5] text-[#9F4E70]">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="mt-4 font-hand text-2xl text-[#9F4E70]">Nothing stitched in yet!</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-[#4A3531]">
                Your shopping bag is empty
              </h3>
              <p className="mt-2 max-w-xs text-sm text-[#7D5E5A]">
                Explore our handmade crochet flowers, bunny plushies, totes, and keychains to fill
                your basket with warmth.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate({ view: 'shop', category: 'all' });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {itemsWithDetails.map(({ product, quantity, selectedColor }) => (
                <li
                  key={`${product.id}-${selectedColor || 'default'}`}
                  className="flex gap-4 rounded-2xl border border-[#EED8E0] bg-white p-3.5 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
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
                        {selectedColor && (
                          <p className="mt-0.5 text-xs text-[#7D5E5A]">{selectedColor}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id, selectedColor)}
                        aria-label={`Remove ${product.name}`}
                        className="rounded-full p-1 text-[#7D5E5A] transition-colors hover:bg-[#F4DDE5] hover:text-[#9F4E70]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-[#EED8E0] bg-[#FFF9F2] px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(product.id, selectedColor, quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#4A3531] hover:bg-[#F4DDE5]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="tabular-nums w-7 text-center text-xs font-semibold text-[#4A3531]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(product.id, selectedColor, quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[#4A3531] hover:bg-[#F4DDE5]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="tabular-nums text-sm font-semibold text-[#4A3531]">
                        {formatINR(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Totals */}
        {itemsWithDetails.length > 0 && (
          <div className="border-t border-[#EED8E0] bg-white px-6 py-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#7D5E5A]">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#4A3531]">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#7D5E5A]">
                <span>Shipping</span>
                <span className="tabular-nums font-medium text-[#4A3531]">
                  {shippingFee === 0 ? 'Free' : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#F4DDE5] pt-2 text-base font-semibold text-[#4A3531]">
                <span>Total</span>
                <span className="tabular-nums text-[#9F4E70]">{formatINR(total)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate({ view: 'checkout' });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#B9688A] px-6 py-3.5 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full rounded-full border border-[#EED8E0] bg-[#FFF9F2] px-6 py-2.5 text-xs font-semibold text-[#4A3531] transition-colors hover:bg-[#F4DDE5]/50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
