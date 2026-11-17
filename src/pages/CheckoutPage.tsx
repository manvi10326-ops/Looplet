import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { buildWhatsAppUrl, formatINR, STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/catalog';
import { BackButton } from '../components/BackButton';
import { SmartImage } from '../components/SmartImage';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart, navigate } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedOrderRef, setSavedOrderRef] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

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
  const shippingFee =
    itemsWithDetails.length === 0 || subtotal >= STORE_CONFIG.shipping.freeShippingThreshold
      ? 0
      : STORE_CONFIG.shipping.standardShippingFee;
  const total = subtotal + shippingFee;

  const buildLocalWhatsAppFallbackUrl = (cleanPin: string, orderRef?: string) => {
    const itemLines = itemsWithDetails.map(
      ({ product, quantity, selectedColor }, index) =>
        `${index + 1}. ${product.name}${selectedColor ? ` (${selectedColor})` : ''} × ${quantity} — ${formatINR(
          product.price * quantity
        )}`
    );

    const messageLines = [
      '♡ *New Boutique Order — Looplet* ♡',
      orderRef ? `*Order Ref:* ${orderRef}` : '',
      '',
      '*Order Items:*',
      ...itemLines,
      '',
      `*Subtotal:* ${formatINR(subtotal)}`,
      `*Shipping:* ${shippingFee === 0 ? 'Free' : formatINR(shippingFee)}`,
      `*Total Amount:* ${formatINR(total)}`,
      '',
      '*Customer Delivery Details:*',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Email: ${email.trim()}`,
      `Address: ${address.trim()}, ${city.trim()}, ${stateName.trim()} - ${cleanPin}`,
      orderNote.trim() ? `Gift Note / Instructions: ${orderNote.trim()}` : '',
      '',
      'Please confirm availability and share payment details. Thank you!',
    ].filter(Boolean);

    return buildWhatsAppUrl(messageLines.join('\n'));
  };

  const handlePlaceOrderViaWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage('');
    setSavedOrderRef(null);

    const cleanPhone = phone.replace(/\D/g, '');
    const cleanPin = pinCode.replace(/\D/g, '');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (address.trim().length < 6) {
      setErrorMessage('Please enter your complete delivery address.');
      return;
    }
    if (!city.trim() || !stateName.trim()) {
      setErrorMessage('Please enter both your city and state.');
      return;
    }
    if (cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit PIN code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          stateName: stateName.trim(),
          pinCode: cleanPin,
          orderNote: orderNote.trim(),
          items: itemsWithDetails.map(({ product, quantity, selectedColor }) => ({
            productId: product.id,
            quantity,
            selectedColor,
          })),
        }),
      });

      const payload = (await res.json()) as {
        orderReference?: string;
        whatsappUrl?: string;
        error?: string;
      };

      if (!res.ok) {
        setErrorMessage(
          payload.error ||
            'Could not save your order right now. You can still send your order directly via WhatsApp below.'
        );
        setWhatsappUrl(buildLocalWhatsAppFallbackUrl(cleanPin));
        return;
      }

      const finalUrl =
        payload.whatsappUrl || buildLocalWhatsAppFallbackUrl(cleanPin, payload.orderReference);
      setSavedOrderRef(payload.orderReference || null);
      setWhatsappUrl(finalUrl);

      const link = document.createElement('a');
      link.href = finalUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } catch {
      setErrorMessage(
        'Network issue while saving your order. You can still send your order summary directly on WhatsApp below.'
      );
      setWhatsappUrl(buildLocalWhatsAppFallbackUrl(cleanPin));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemsWithDetails.length === 0 && !whatsappUrl) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <BackButton fallbackRoute={{ view: 'shop', category: 'all' }} />
        </div>
        <div className="mx-auto max-w-lg py-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4DDE5] text-[#9F4E70]">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[#4A3531]">
            Your bag is empty
          </h1>
          <p className="mt-2 text-sm text-[#7D5E5A]">
            Add a few lovely handmade crochet pieces to your bag before proceeding to checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate({ view: 'shop', category: 'all' })}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] hover:bg-[#A45677]"
          >
            <span>Shop Collection</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFF9F2] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackRoute={{ view: 'shop', category: 'all' }} />
        </div>

        <div className="mb-8">
          <p className="font-hand text-2xl text-[#9F4E70]">Almost Yours</p>
          <h1 className="font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
            Boutique Checkout via WhatsApp
          </h1>
          <p className="mt-1.5 text-sm text-[#7D5E5A]">
            Fill in your delivery details below to prepare a neat WhatsApp order summary directly
            with our crochet studio. Orders are confirmed only after our team replies on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Delivery Details Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handlePlaceOrderViaWhatsApp}
              noValidate
              className="space-y-4 rounded-3xl border border-[#EED8E0] bg-white/90 p-6 shadow-xs sm:p-8"
            >
              <h2 className="font-display text-xl font-semibold text-[#4A3531]">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="chk-name" className="block text-xs font-semibold text-[#4A3531]">
                    Customer Name *
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chk-phone" className="block text-xs font-semibold text-[#4A3531]">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="chk-email" className="block text-xs font-semibold text-[#4A3531]">
                  Email Address *
                </label>
                <input
                  id="chk-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="chk-address" className="block text-xs font-semibold text-[#4A3531]">
                  Delivery Address *
                </label>
                <textarea
                  id="chk-address"
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No., Building, Street, Landmark"
                  className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="chk-city" className="block text-xs font-semibold text-[#4A3531]">
                    City *
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chk-state" className="block text-xs font-semibold text-[#4A3531]">
                    State *
                  </label>
                  <input
                    id="chk-state"
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State"
                    className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chk-pin" className="block text-xs font-semibold text-[#4A3531]">
                    PIN Code *
                  </label>
                  <input
                    id="chk-pin"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="302001"
                    className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="chk-note" className="block text-xs font-semibold text-[#4A3531]">
                  Gift Note or Special Instructions (Optional)
                </label>
                <input
                  id="chk-note"
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Short handwritten gift card message..."
                  className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
                />
              </div>

              {errorMessage && (
                <p className="rounded-xl border border-[#D78FAE] bg-[#F4DDE5]/50 px-4 py-2.5 text-xs font-medium text-[#7B2E4E]">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#B9688A] px-6 py-3.5 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                <span>
                  {isSubmitting ? 'Saving Order...' : 'Save Order & Send via WhatsApp'}
                </span>
              </button>

              {whatsappUrl && (
                <div className="rounded-2xl border border-[#BACCA8] bg-[#D6E2C8]/45 p-4 text-xs text-[#354328]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="space-y-2">
                      {savedOrderRef ? (
                        <p className="font-semibold">
                          Order saved ({savedOrderRef}) &amp; WhatsApp summary ready!
                        </p>
                      ) : (
                        <p className="font-semibold">
                          WhatsApp order message prepared — please send it in WhatsApp!
                        </p>
                      )}
                      <p className="leading-relaxed">
                        Your order is confirmed once you send the summary in WhatsApp and our
                        studio replies with availability and UPI / payment details.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-1">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold underline"
                        >
                          <span>Open WhatsApp Summary</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        {itemsWithDetails.length > 0 && (
                          <button
                            type="button"
                            onClick={clearCart}
                            className="inline-flex items-center gap-1 font-semibold text-[#7B2E4E] underline"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Clear Bag After Sending</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#EED8E0] bg-white/90 p-6 shadow-xs sm:p-7">
              <h2 className="font-display text-xl font-semibold text-[#4A3531]">Order Summary</h2>
              <p className="mt-1 text-xs text-[#7D5E5A]">{STORE_CONFIG.shipping.dispatchDays}</p>

              <ul className="mt-5 divide-y divide-[#F4DDE5]">
                {itemsWithDetails.map(({ product, quantity, selectedColor }) => (
                  <li
                    key={`${product.id}-${selectedColor || 'default'}`}
                    className="flex items-center gap-3 py-3.5"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#FFF9F2]">
                      <SmartImage
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-[#4A3531]">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#7D5E5A]">
                        Qty {quantity}
                        {selectedColor ? ` · ${selectedColor}` : ''}
                      </p>
                    </div>
                    <span className="tabular-nums text-sm font-semibold text-[#4A3531]">
                      {formatINR(product.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-2 border-t border-[#EED8E0] pt-4 text-sm">
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
                <div className="flex justify-between border-t border-[#F4DDE5] pt-3 text-base font-semibold text-[#4A3531]">
                  <span>Total Amount</span>
                  <span className="tabular-nums text-lg text-[#9F4E70]">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
