import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { BackButton } from './BackButton';

interface PolicyPageProps {
  policyType: 'privacy' | 'terms' | 'refund';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ policyType }) => {

  const content = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How Looplet handles your personal details with care',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'When you place a boutique order via WhatsApp or request a custom crochet creation, we only receive the details you choose to share—such as your name, phone number, email address, and delivery address—solely to prepare and ship your handmade pieces.',
        },
        {
          heading: '2. Local Browser Storage',
          body: 'Your shopping bag and wishlist are saved locally in your browser using localStorage so your favourite creations stay right where you left them when you return. We do not sell or share your browsing preferences with third parties.',
        },
        {
          heading: '3. Contact & Updates',
          body: `If you have any questions about how your details are used or would like us to remove order notes, please reach out to us at ${STORE_CONFIG.contactEmail}.`,
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Guidelines for ordering handmade crochet creations from Looplet',
      sections: [
        {
          heading: '1. Handmade Nature of Products',
          body: 'Every Looplet creation is stitched by hand using soft cotton and acrylic-blend yarns. Subtle variations in stitch tension, flower angle, or blush shade make each piece uniquely yours.',
        },
        {
          heading: '2. Order Confirmation & Dispatch',
          body: 'Orders submitted through our checkout form open a WhatsApp summary with our studio. Your order is confirmed only once we reply with availability, payment details, and your estimated dispatch window (typically 3–5 business days for handmade-to-order pieces).',
        },
        {
          heading: '3. Custom Crochet Commissions',
          body: 'Custom colour palettes, bouquet sizes, and personalised plushies begin crafting after design confirmation over WhatsApp. Please allow extra crafting time for bespoke pieces.',
        },
      ],
    },
    refund: {
      title: 'Return & Refund Policy',
      subtitle: 'Gentle care, replacements, and handmade support',
      sections: [
        {
          heading: '1. Damaged or Incorrect Items',
          body: 'We pack every Looplet parcel in protective tissue and sturdy boxes. If an item arrives damaged in transit or differs from your confirmed order, please message us on WhatsApp within 48 hours of delivery with an unboxing photo.',
        },
        {
          heading: '2. Custom & Personalised Creations',
          body: 'Because custom bouquets, personalised dolls, and bespoke colourways are stitched specifically for you, they are non-returnable once crafting has started, unless damaged upon arrival.',
        },
        {
          heading: '3. Care Instructions',
          body: 'To keep your crochet flowers, plushies, and bags looking lovely, gently spot-clean with cool water and mild soap, reshape softly, and air-dry away from direct harsh sunlight.',
        },
      ],
    },
  }[policyType];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-6">
        <BackButton fallbackRoute={{ view: 'home' }} />
      </div>

      <div className="rounded-3xl border border-[#EED8E0] bg-white/85 p-6 shadow-xs sm:p-10">
        <div className="flex items-center gap-3 text-[#9F4E70]">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Looplet Boutique Policy</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-2 text-sm text-[#7D5E5A]">{content.subtitle}</p>

        <div className="mt-8 space-y-6 border-t border-[#F4DDE5] pt-8">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-[#4A3531]">
                {section.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#7D5E5A]">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};
