import React from 'react';
import { Heart, Instagram, Mail, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { buildWhatsAppUrl, STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { CategorySlug } from '../types/shop';
import { BowDoodle, SageSprigDoodle, StitchedDivider, YarnBallDoodle } from './ScrapbookDoodles';

const FOOTER_CATEGORIES: { label: string; slug: CategorySlug }[] = [
  { label: 'Plushies & Amigurumi', slug: 'crochet-plushies-dolls' },
  { label: 'Crochet Flowers', slug: 'crochet-flowers-bouquets' },
  { label: 'Bags & Purses', slug: 'crochet-bags-purses' },
  { label: 'Keychains', slug: 'crochet-keychains' },
  { label: 'Accessories', slug: 'crochet-accessories' },
  { label: 'Home Decor', slug: 'crochet-home-decor' },
  { label: 'Gifts & Hampers', slug: 'crochet-gifts-hampers' },
  { label: 'Custom Creations', slug: 'custom-crochet-creations' },
];

export const Footer: React.FC = () => {
  const { navigate, navigateToCategory } = useStore();

  return (
    <footer id="site-footer" className="relative overflow-hidden bg-[#FFF9F2] text-[#4A3531]">
      {/* Delicate Stitched Top Edge */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StitchedDivider />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Scrapbook Corner */}
          <div className="space-y-4 lg:col-span-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ view: 'home' })}
                className="inline-block rounded-xl focus-visible:ring-2 focus-visible:ring-[#B9688A]"
              >
                <img
                  src={STORE_CONFIG.logoPath}
                  alt="Looplet Logo"
                  className="h-12 w-auto object-contain"
                />
              </button>
              <YarnBallDoodle className="h-9 w-9 opacity-85" />
            </div>

            <p className="font-hand text-2xl text-[#9F4E70]">{STORE_CONFIG.tagline}</p>

            <p className="max-w-xs text-sm leading-relaxed text-[#7D5E5A]">
              A cozy handmade crochet studio crafting little yarn treasures, everlasting blooms,
              soft amigurumi friends, and heartfelt gifts—one slow stitch at a time.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={STORE_CONFIG.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Looplet on Instagram"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E5BECB] bg-[#F4DDE5]/40 px-4 text-xs font-semibold text-[#4A3531] transition-colors hover:bg-[#F4DDE5]"
              >
                <Instagram className="h-3.5 w-3.5 text-[#9F4E70]" />
                <span>Instagram</span>
              </a>
              <a
                href={STORE_CONFIG.social.pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Looplet on Pinterest"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E8D595] bg-[#F8E9B5]/45 px-4 text-xs font-semibold text-[#4A3531] transition-colors hover:bg-[#F8E9B5]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#9F4E70]" />
                <span>Pinterest</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-[#4A3531]">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#7D5E5A]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'home' })}
                  className="transition-colors hover:text-[#9F4E70]"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'shop', category: 'all' })}
                  className="transition-colors hover:text-[#9F4E70]"
                >
                  Shop Collection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'shop', category: 'all', filter: 'new' })}
                  className="transition-colors hover:text-[#9F4E70]"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'shop', category: 'all', filter: 'bestsellers' })}
                  className="transition-colors hover:text-[#9F4E70]"
                >
                  Bestsellers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'custom-orders' })}
                  className="transition-colors hover:text-[#9F4E70]"
                >
                  Custom Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'about' })}
                  className="transition-colors hover:text-[#9F4E70]"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'wishlist' })}
                  className="transition-colors hover:text-[#9F4E70]"
                >
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-base font-semibold text-[#4A3531]">Shop Categories</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-[#7D5E5A] sm:grid-cols-2 lg:grid-cols-1">
              {FOOTER_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => navigateToCategory(cat.slug)}
                    className="text-left transition-colors hover:text-[#9F4E70]"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Policies */}
          <div className="space-y-6 lg:col-span-3">
            <div>
              <h3 className="font-display text-base font-semibold text-[#4A3531]">Studio Contact</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#7D5E5A]">
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#9F4E70]" />
                  <a
                    href={`mailto:${STORE_CONFIG.contactEmail}`}
                    className="break-all transition-colors hover:text-[#9F4E70]"
                  >
                    {STORE_CONFIG.contactEmail}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#9F4E70]" />
                  <a
                    href={buildWhatsAppUrl(STORE_CONFIG.whatsappGreeting)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#9F4E70]"
                  >
                    WhatsApp: {STORE_CONFIG.contactPhoneDisplay}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9F4E70]" />
                  <span>{STORE_CONFIG.studioLocation}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7D5E5A]">
                Policies
              </h4>
              <ul className="mt-2.5 space-y-2 text-sm text-[#7D5E5A]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'policy', policyType: 'privacy' })}
                    className="transition-colors hover:text-[#9F4E70]"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'policy', policyType: 'terms' })}
                    className="transition-colors hover:text-[#9F4E70]"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'policy', policyType: 'refund' })}
                    className="transition-colors hover:text-[#9F4E70]"
                  >
                    Return &amp; Refund Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Scrapbook Sign-off */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-dashed border-[#E5BECB] pt-6 text-center text-xs text-[#7D5E5A] sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <SageSprigDoodle className="hidden h-6 w-10 sm:block" />
            <p>© {new Date().getFullYear()} Looplet — Handmade Crochet Boutique.</p>
          </div>

          <div className="flex items-center gap-2">
            <BowDoodle className="h-5 w-7" />
            <p className="inline-flex items-center gap-1.5 font-medium">
              <span>Made slowly, stitched with love</span>
              <Heart className="h-3.5 w-3.5 fill-[#D78FAE] text-[#D78FAE]" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
