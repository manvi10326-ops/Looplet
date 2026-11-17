import React from 'react';
import { Heart, Instagram, Mail, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { buildWhatsAppUrl, STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { CategorySlug } from '../types/shop';

const FOOTER_CATEGORIES: { label: string; slug: CategorySlug }[] = [
  { label: 'Crochet Flowers & Bouquets', slug: 'crochet-flowers-bouquets' },
  { label: 'Crochet Plushies & Dolls', slug: 'crochet-plushies-dolls' },
  { label: 'Crochet Bags & Purses', slug: 'crochet-bags-purses' },
  { label: 'Crochet Keychains', slug: 'crochet-keychains' },
  { label: 'Crochet Home Decor', slug: 'crochet-home-decor' },
  { label: 'Baby Crochet Collection', slug: 'baby-crochet-collection' },
];

export const Footer: React.FC = () => {
  const { navigate, navigateToCategory } = useStore();

  return (
    <footer
      id="site-footer"
      className="border-t border-[#EED8E0] bg-gradient-to-b from-[#FFF9F2] to-[#F4DDE5]/65 text-[#4A3531]"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Summary */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate({ view: 'home' })}
              className="inline-block rounded-xl focus-visible:ring-2 focus-visible:ring-[#B9688A]"
            >
              <img
                src={STORE_CONFIG.logoPath}
                alt="Looplet Logo"
                className="h-14 w-auto object-contain"
              />
            </button>
            <p className="font-hand text-xl text-[#9F4E70]">
              {STORE_CONFIG.tagline}
            </p>
            <p className="text-sm leading-relaxed text-[#7D5E5A]">
              A cozy handmade crochet boutique crafting heirloom bouquets, amigurumi friends,
              everyday totes, and thoughtful gifts one stitch at a time.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={STORE_CONFIG.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Looplet on Instagram"
                className="flex h-10 items-center gap-2 rounded-full border border-[#E5BECB] bg-[#FFF9F2] px-4 text-xs font-medium text-[#4A3531] transition-colors hover:bg-[#F4DDE5]"
              >
                <Instagram className="h-4 w-4 text-[#9F4E70]" />
                <span>Instagram</span>
              </a>
              <a
                href={STORE_CONFIG.social.pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Looplet on Pinterest"
                className="flex h-10 items-center gap-2 rounded-full border border-[#E5BECB] bg-[#FFF9F2] px-4 text-xs font-medium text-[#4A3531] transition-colors hover:bg-[#F4DDE5]"
              >
                <Sparkles className="h-4 w-4 text-[#9F4E70]" />
                <span>Pinterest</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
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
                  Shop All Creations
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
                  Custom Crochet Orders
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
          <div>
            <h3 className="font-display text-base font-semibold text-[#4A3531]">Shop Categories</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#7D5E5A]">
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

          {/* Contact & Care Policies */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-base font-semibold text-[#4A3531]">Get in Touch</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#7D5E5A]">
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
                Boutique Policies
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

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#E5BECB]/70 pt-6 text-center text-xs text-[#7D5E5A] sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Looplet — Handmade Crochet Boutique. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            <span>Stitched with care</span>
            <Heart className="h-3.5 w-3.5 fill-[#D78FAE] text-[#D78FAE]" />
            <span>Little Loops, Lovely Creations</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
