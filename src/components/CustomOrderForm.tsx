import React, { useState } from 'react';
import { Check, ExternalLink, ImagePlus, MessageCircle, Sparkles, X } from 'lucide-react';
import { buildWhatsAppUrl } from '../config/store';

interface CustomOrderFormProps {
  compact?: boolean;
}

const PRODUCT_TYPES = [
  'Custom Plushie / Amigurumi',
  'Personalised Crochet Bouquet',
  'Custom Crochet Bag / Tote',
  'Special Occasion Gift Hamper',
  'Personalised Keychain / Bag Charm',
  'Custom Baby Keepsake Set',
  'Other Custom Creation',
];

const COLOUR_SUGGESTIONS = [
  { name: 'Blush Pink & Cream', hex: '#F4DDE5' },
  { name: 'Rose Pink', hex: '#D78FAE' },
  { name: 'Butter Yellow', hex: '#F8E9B5' },
  { name: 'Sage Green', hex: '#D6E2C8' },
  { name: 'Warm Cream', hex: '#FFF2DC' },
];

export const CustomOrderForm: React.FC<CustomOrderFormProps> = ({ compact = false }) => {
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [productType, setProductType] = useState(PRODUCT_TYPES[0]);
  const [preferredColor, setPreferredColor] = useState('Blush Pink & Cream');
  const [preferredSize, setPreferredSize] = useState('Medium / Standard');
  const [description, setDescription] = useState('');
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [referencePreview, setReferencePreview] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedRequestRef, setSavedRequestRef] = useState<string | null>(null);
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Reference image must be under 5 MB.');
      return;
    }
    setErrorMessage('');
    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReferencePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearReferenceImage = () => {
    setReferenceFileName('');
    setReferencePreview('');
  };

  const buildFallbackWhatsAppUrl = (
    trimmedName: string,
    trimmedDesc: string,
    requestRef?: string
  ) => {
    const messageLines = [
      '♡ *New Custom Crochet Request — Looplet* ♡',
      requestRef ? `*Request Ref:* ${requestRef}` : '',
      '',
      `*Customer Name:* ${trimmedName}`,
      `*WhatsApp Number:* ${whatsappNumber.trim()}`,
      `*Creation Type:* ${productType}`,
      `*Preferred Yarn Colours:* ${preferredColor.trim() || 'Open to studio suggestion'}`,
      `*Preferred Size:* ${preferredSize.trim() || 'Standard'}`,
      `*Customisation Details:* ${trimmedDesc}`,
      referenceFileName
        ? `*Reference Image:* "${referenceFileName}" (I will attach this photo directly in our WhatsApp chat!)`
        : '*Reference Image:* None attached',
      '',
      'Please let me know pricing & crafting timeline. Thank you!',
    ].filter(Boolean);

    return buildWhatsAppUrl(messageLines.join('\n'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage('');
    setSavedRequestRef(null);

    const trimmedName = customerName.trim();
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const trimmedDesc = description.trim();
    const sizeNote = preferredSize.trim();
    const combinedDesc = sizeNote ? `[Size: ${sizeNote}] ${trimmedDesc}` : trimmedDesc;

    if (!trimmedName) {
      setErrorMessage('Please enter your name so we know who we are crafting for.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (trimmedDesc.length < 10) {
      setErrorMessage('Please share a short description of your custom crochet idea.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: trimmedName,
          whatsappNumber: whatsappNumber.trim(),
          productType,
          preferredColor: preferredColor.trim(),
          description: combinedDesc,
          referenceFileName,
        }),
      });

      const payload = (await res.json()) as {
        requestReference?: string;
        whatsappUrl?: string;
        error?: string;
      };

      if (!res.ok) {
        setErrorMessage(
          payload.error ||
            'Could not save your custom request right now. You can still send it directly via WhatsApp below.'
        );
        setPreparedWhatsAppUrl(buildFallbackWhatsAppUrl(trimmedName, trimmedDesc));
        return;
      }

      const finalUrl =
        payload.whatsappUrl ||
        buildFallbackWhatsAppUrl(trimmedName, trimmedDesc, payload.requestReference);
      setSavedRequestRef(payload.requestReference || null);
      setPreparedWhatsAppUrl(finalUrl);

      const link = document.createElement('a');
      link.href = finalUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } catch {
      setErrorMessage(
        'Network issue while saving your custom request. You can still send it directly on WhatsApp below.'
      );
      setPreparedWhatsAppUrl(buildFallbackWhatsAppUrl(trimmedName, trimmedDesc));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-[2rem] border border-dashed border-[#D78FAE] bg-[#FFFDF9] shadow-sm ${
        compact ? 'p-6 sm:p-7' : 'p-6 sm:p-10'
      }`}
    >
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 font-hand text-2xl text-[#9F4E70]">
          <Sparkles className="h-4 w-4" />
          <span>Made Just for You</span>
        </span>
        <h3 className="mt-1 font-display text-2xl font-semibold text-[#4A3531]">
          Custom Crochet Sketch &amp; Order Note
        </h3>
        <p className="mt-1.5 text-sm text-[#7D5E5A]">
          Tell us about your dream piece below to prepare a neat WhatsApp brief directly for our studio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="custom-name" className="block text-xs font-semibold text-[#4A3531]">
              Your Name *
            </label>
            <input
              id="custom-name"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., Priya Verma"
              className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/60 focus:border-[#B9688A] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="custom-phone" className="block text-xs font-semibold text-[#4A3531]">
              WhatsApp Number *
            </label>
            <input
              id="custom-phone"
              type="tel"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g., +91 98765 43210"
              className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/60 focus:border-[#B9688A] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="custom-type" className="block text-xs font-semibold text-[#4A3531]">
              Product Type *
            </label>
            <select
              id="custom-type"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
            >
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="custom-size" className="block text-xs font-semibold text-[#4A3531]">
              Preferred Size
            </label>
            <select
              id="custom-size"
              value={preferredSize}
              onChange={(e) => setPreferredSize(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
            >
              <option value="Mini / Pocket-sized (approx. 8–12 cm)">Mini / Pocket-sized (8–12 cm)</option>
              <option value="Medium / Standard">Medium / Standard</option>
              <option value="Large / Statement Piece">Large / Statement Piece</option>
              <option value="Custom dimensions (described below)">Custom dimensions (in notes)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="custom-color" className="block text-xs font-semibold text-[#4A3531]">
            Preferred Colour Palette
          </label>
          <input
            id="custom-color"
            type="text"
            value={preferredColor}
            onChange={(e) => setPreferredColor(e.target.value)}
            placeholder="e.g., Blush pink, sage green & cream"
            className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/60 focus:border-[#B9688A] focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COLOUR_SUGGESTIONS.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                onClick={() => setPreferredColor(swatch.name)}
                className="inline-flex items-center gap-1 rounded-full border border-[#EED8E0] bg-[#FFF9F2] px-2.5 py-0.5 text-[11px] text-[#7D5E5A] transition-colors hover:border-[#D78FAE] hover:text-[#4A3531]"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span>{swatch.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="custom-description" className="block text-xs font-semibold text-[#4A3531]">
            Description of Customisation *
          </label>
          <textarea
            id="custom-description"
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us the size, flower stems, outfit details, gift note, or occasion date..."
            className="mt-1.5 w-full rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/60 focus:border-[#B9688A] focus:outline-none"
          />
        </div>

        <div>
          <span className="block text-xs font-semibold text-[#4A3531]">
            Upload Reference Image (Optional)
          </span>
          {!referencePreview ? (
            <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D78FAE] bg-[#F4DDE5]/20 px-4 py-4 text-xs font-medium text-[#7D5E5A] transition-colors hover:bg-[#F4DDE5]/40">
              <ImagePlus className="h-4 w-4 text-[#9F4E70]" />
              <span>Choose an inspiration photo (JPG/PNG, max 5 MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          ) : (
            <div className="mt-1.5 flex items-center justify-between gap-3 rounded-2xl border border-[#EED8E0] bg-[#FFF9F2] p-2.5">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={referencePreview}
                  alt="Custom reference preview"
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[#4A3531]">{referenceFileName}</p>
                  <p className="text-[11px] text-[#7D5E5A]">
                    Ready to attach in your WhatsApp chat
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearReferenceImage}
                aria-label="Remove reference image"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7D5E5A] hover:bg-[#F4DDE5]/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="rounded-xl border border-[#D78FAE] bg-[#F4DDE5]/50 px-3.5 py-2 text-xs font-medium text-[#7B2E4E]">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#B9688A] px-6 py-3.5 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A45677] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageCircle className="h-4.5 w-4.5" />
          <span>
            {isSubmitting ? 'Saving Custom Request...' : 'Save & Send Custom Request on WhatsApp'}
          </span>
        </button>

        {preparedWhatsAppUrl && (
          <div className="rounded-2xl border border-[#BACCA8] bg-[#D6E2C8]/45 p-3.5 text-xs text-[#354328]">
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                {savedRequestRef ? (
                  <p className="font-semibold">
                    Custom request saved ({savedRequestRef}) &amp; WhatsApp draft ready!
                  </p>
                ) : (
                  <p className="font-semibold">Your WhatsApp request draft is ready!</p>
                )}
                <p className="mt-0.5 leading-relaxed">
                  Please send the pre-filled message in WhatsApp so our crochet artist can confirm
                  your custom design and timeline.
                </p>
                <a
                  href={preparedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-semibold underline"
                >
                  <span>Open WhatsApp Chat</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
