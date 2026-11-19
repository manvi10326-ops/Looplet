import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Mail,
  Plus,
  ShoppingBag,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { formatINR, STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import {
  ABOUT_STUDIO_IMAGE,
  HERO_IMAGE,
  INSTAGRAM_GALLERY_POSTS,
  PRODUCTS,
  getProductById,
} from '../data/catalog';
import { CategorySlug, Product } from '../types/shop';
import { CustomOrderForm } from '../components/CustomOrderForm';
import { InstagramGallery } from '../components/InstagramGallery';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';
import {
  BowDoodle,
  CloudDoodle,
  CrochetHookDoodle,
  DaisyDoodle,
  HeartDoodle,
  SageSprigDoodle,
  StitchedDivider,
  YarnBallDoodle,
} from '../components/ScrapbookDoodles';

interface ScrapbookCategoryTile {
  slug: CategorySlug;
  title: string;
  sticker: string;
  caption: string;
  image: string;
  spanClass: string;
  aspectClass: string;
  tintClass: string;
  stickerTone: string;
}

const SCRAPBOOK_CATEGORIES: ScrapbookCategoryTile[] = [
  {
    slug: 'crochet-plushies-dolls',
    title: 'Plushies & Amigurumi',
    sticker: 'Softest Friends',
    caption: 'Floppy bunnies, honey bears & desk pals',
    image: '/src/assets/images/prod_bunny_plushie_1794842775465.jpg',
    spanClass: 'md:col-span-6 lg:col-span-5 lg:row-span-2',
    aspectClass: 'aspect-[4/4] lg:aspect-auto lg:h-full lg:min-h-[430px]',
    tintClass: 'bg-[#F4DDE5]/40 border-[#E8C8D4]',
    stickerTone: 'bg-[#F8E9B5] text-[#5B4527]',
  },
  {
    slug: 'crochet-flowers-bouquets',
    title: 'Crochet Flowers',
    sticker: 'Never Wilts',
    caption: 'Everlasting tulips, roses & daisies',
    image: '/src/assets/images/prod_pink_tulip_bouquet_1794842775666.jpg',
    spanClass: 'md:col-span-6 lg:col-span-4',
    aspectClass: 'aspect-[4/3]',
    tintClass: 'bg-[#FFFDF9] border-[#EFE0E6]',
    stickerTone: 'bg-[#F4DDE5] text-[#6B374D]',
  },
  {
    slug: 'crochet-bags-purses',
    title: 'Bags & Purses',
    sticker: 'Everyday Cute',
    caption: 'Puff-stitch totes & floral slings',
    image: '/src/assets/images/prod_pastel_tote_bag_1794842779134.jpg',
    spanClass: 'md:col-span-6 lg:col-span-3',
    aspectClass: 'aspect-[4/3]',
    tintClass: 'bg-[#D6E2C8]/40 border-[#C2D3B2]',
    stickerTone: 'bg-[#FFF9F2] text-[#354328]',
  },
  {
    slug: 'crochet-keychains',
    title: 'Keychains',
    sticker: 'Tiny Joy',
    caption: 'Strawberries, puffy hearts & ducklings',
    image: '/src/assets/images/prod_strawberry_keychain_1794842780623.jpg',
    spanClass: 'md:col-span-3 lg:col-span-3',
    aspectClass: 'aspect-square lg:aspect-[5/4]',
    tintClass: 'bg-[#F8E9B5]/35 border-[#E9D79E]',
    stickerTone: 'bg-[#F4DDE5] text-[#6B374D]',
  },
  {
    slug: 'crochet-accessories',
    title: 'Accessories',
    sticker: 'Sweet Details',
    caption: 'Blossom hair clips, bows & scrunchies',
    image: '/src/assets/images/prod_flower_hair_clip_1794842780227.jpg',
    spanClass: 'md:col-span-3 lg:col-span-4',
    aspectClass: 'aspect-square lg:aspect-[16/10]',
    tintClass: 'bg-[#FFFDF9] border-[#EFE0E6]',
    stickerTone: 'bg-[#D6E2C8] text-[#354328]',
  },
  {
    slug: 'crochet-home-decor',
    title: 'Home Decor',
    sticker: 'Cozy Corners',
    caption: 'Scalloped coasters, pots & baskets',
    image: '/src/assets/images/prod_coaster_set_1794842779437.jpg',
    spanClass: 'md:col-span-4 lg:col-span-4',
    aspectClass: 'aspect-[4/3]',
    tintClass: 'bg-[#D6E2C8]/35 border-[#C2D3B2]',
    stickerTone: 'bg-[#F8E9B5] text-[#5B4527]',
  },
  {
    slug: 'crochet-gifts-hampers',
    title: 'Gifts & Hampers',
    sticker: 'Ribbon-Tied',
    caption: 'Ready-to-gift keepsake boxes',
    image: '/src/assets/images/prod_gift_hamper_box_1794842825208.jpg',
    spanClass: 'md:col-span-4 lg:col-span-4',
    aspectClass: 'aspect-[4/3]',
    tintClass: 'bg-[#F4DDE5]/35 border-[#E8C8D4]',
    stickerTone: 'bg-[#FFF9F2] text-[#6B374D]',
  },
  {
    slug: 'custom-crochet-creations',
    title: 'Custom Creations',
    sticker: 'Just for You',
    caption: 'Portrait dolls & bespoke bouquets',
    image: '/src/assets/images/prod_custom_bouquet_box_1794842986046.jpg',
    spanClass: 'md:col-span-4 lg:col-span-4',
    aspectClass: 'aspect-[4/3]',
    tintClass: 'bg-[#F8E9B5]/45 border-[#E8D595]',
    stickerTone: 'bg-[#D78FAE] text-[#FFF9F2]',
  },
];

const NEW_ARRIVAL_STICKERS = ['NEW', 'JUST MADE', 'A LITTLE FAVOURITE'] as const;

const FEATURED_NOTES: Record<string, string> = {
  'lp-flower-01': 'Seven posable blush & cream tulips wrapped like a tiny Parisian flower stall.',
  'lp-plush-01': 'Our most-cuddled floppy bunny—hand-blushed cheeks & a soft ribbon bow.',
  'lp-key-01': 'Tiny cream seeds stitched one by one onto a plump rose strawberry.',
  'lp-bag-01': 'Thick double-stranded puff stitches made for coffee runs & paperbacks.',
  'lp-flower-02': 'A sunny bedside stem that makes ordinary mornings brighter.',
  'lp-plush-03': 'Perches quietly on bookshelves with a sweet hand-stitched smile.',
};

export const HomePage: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, navigate, navigateToCategory } = useStore();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterNotice, setNewsletterNotice] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const newArrivalsTrackRef = useRef<HTMLDivElement>(null);

  // Magazine-style Featured Collection (6 curated real products)
  const magazineFeaturedIds = [
    'lp-flower-01', // Pink Tulip Crochet Bouquet (Lead Hero Editorial)
    'lp-plush-01',  // Cute Crochet Bunny Plushie
    'lp-key-01',    // Strawberry Crochet Keychain
    'lp-bag-01',    // Pastel Crochet Tote Bag
    'lp-flower-02', // Mini Daisy Crochet Flower
    'lp-plush-03',  // Mini Crochet Mushroom Plushie
  ];
  const magazineFeatured = magazineFeaturedIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));

  const leadFeatured = magazineFeatured[0];
  const sideFeatured = magazineFeatured.slice(1, 3);
  const bottomFeatured = magazineFeatured.slice(3, 6);

  const newArrivalProducts = PRODUCTS.filter((p) => p.isNewArrival);
  const bestsellerProducts = PRODUCTS.filter((p) => p.isBestseller).slice(0, 6);

  const handleQuickAdd = (product: Product) => {
    if (!product.inStock) return;
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const scrollNewArrivals = (direction: 'left' | 'right') => {
    const el = newArrivalsTrackRef.current;
    if (!el) return;
    const distance = Math.max(280, Math.round(el.clientWidth * 0.72));
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError(null);
    setNewsletterNotice(null);

    const trimmed = newsletterEmail.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }

    setNewsletterNotice(
      `Our automated studio newsletter isn't connected yet—we never fake sign-ups! Follow ${STORE_CONFIG.social.instagramHandle} or say hello on WhatsApp so you never miss a handmade drop ♡`
    );
  };

  return (
    <main className="overflow-x-clip">
      {/* =====================================================================
          1. ASYMMETRICAL EDITORIAL SCRAPBOOK COLLAGE HERO
      ===================================================================== */}
      <section className="bg-paper-dots relative pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
        {/* Soft organic pastel background washes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#F4DDE5]/55 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-[#F8E9B5]/45 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#D6E2C8]/40 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Asymmetrical Editorial Headline Column */}
            <div className="relative z-10 lg:col-span-5">
              <div className="inline-flex items-center gap-2">
                <BowDoodle className="h-6 w-8" />
                <span className="font-hand text-2xl text-[#9F4E70]">
                  from our crochet table
                </span>
              </div>

              <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.06] tracking-tight text-[#4A3531] sm:text-[3.5rem] lg:text-[3.85rem]">
                Little things,
                <span className="mt-1 block font-hand text-[3.35rem] font-semibold leading-[0.95] text-[#B9688A] sm:text-[4.25rem]">
                  made with love.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-relaxed text-[#7D5E5A] sm:text-[17px]">
                Handmade crochet treasures for your softest moments.
              </p>

              {/* Primary + Secondary CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => navigate({ view: 'shop', category: 'all' })}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#B9688A] px-7 py-3 text-sm font-semibold text-[#FFF9F2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A45677]"
                >
                  <span className="whitespace-nowrap">Explore the Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'custom-orders' })}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-7 py-3 text-sm font-semibold text-[#9F4E70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F4DDE5]/55"
                >
                  <span className="whitespace-nowrap">Make Something Custom</span>
                </button>
              </div>

              {/* Scrapbook Studio Margin Note */}
              <div className="mt-8 flex items-center gap-3 pt-2">
                <YarnBallDoodle className="h-11 w-11 shrink-0" />
                <div className="text-xs leading-relaxed text-[#7D5E5A]">
                  <p className="font-hand text-xl leading-none text-[#4A3531]">
                    Handmade just for you.
                  </p>
                  <p className="mt-1">
                    Soft combed cotton · Small studio batches · Gift-ready wrapping
                  </p>
                </div>
              </div>
            </div>

            {/* Creative 5-Element Scrapbook Collage Canvas */}
            <div className="relative lg:col-span-7">
              {/* Desktop & Tablet Organic Overlapping Collage */}
              <div className="relative mx-auto max-w-[580px] sm:pb-12 sm:pt-4 lg:max-w-none">
                {/* Floating tiny decorative doodles */}
                <DaisyDoodle className="pointer-events-none absolute -left-3 -top-4 z-20 hidden h-12 w-12 sm:block" />
                <HeartDoodle className="animate-heart-drift pointer-events-none absolute right-6 top-2 z-20 hidden h-7 w-7 sm:block" />

                {/* Element 1: Main Featured Crochet Creation (Large Rounded Frame) */}
                <div className="relative z-10 mx-auto w-[92%] sm:ml-auto sm:mr-10 sm:w-[74%]">
                  <span
                    aria-hidden="true"
                    className="washi-tape pointer-events-none absolute -top-3 left-10 z-20 h-6 w-24 -rotate-3 rounded-[2px]"
                  />
                  <div className="polaroid-card rounded-[2rem] border border-[#EFE0E6] p-3 pb-5">
                    <button
                      type="button"
                      onClick={() => navigate({ view: 'shop', category: 'crochet-flowers-bouquets' })}
                      className="group block aspect-[4/3] w-full overflow-hidden rounded-[1.4rem] bg-[#FFF9F2]"
                      aria-label="Explore Looplet signature crochet creations"
                    >
                      <SmartImage
                        src={HERO_IMAGE}
                        alt="Looplet handmade crochet tulip bouquet, cream tote bag, bunny plushie and strawberry charm"
                        fallbackTitle="Looplet Signature Collection"
                        loading="eager"
                        className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                    <div className="mt-3 flex items-center justify-between px-2">
                      <span className="font-hand text-xl text-[#4A3531]">
                        Handmade just for you ♡
                      </span>
                      <span className="text-[11px] font-medium text-[#7D5E5A]">
                        Looplet Studio Table
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Neat 2-Card Row below Main Photo | Desktop Overlapping Polaroids */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-0 sm:block">
                  {/* Element 2: Polaroid of Crochet Flowers (Bottom-Left Overlap on sm+) */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ view: 'product', slug: 'pink-tulip-crochet-bouquet' })
                    }
                    className="polaroid-card group relative z-20 block rounded-2xl border border-[#EFE0E6] p-2 pb-3 text-left sm:absolute sm:bottom-2 sm:left-0 sm:w-[39%] sm:-rotate-3 sm:hover:rotate-0"
                  >
                    <span
                      aria-hidden="true"
                      className="washi-tape-blush pointer-events-none absolute -top-2.5 right-6 h-4 w-14 rotate-6 rounded-[2px]"
                    />
                    <div className="aspect-[4/4] overflow-hidden rounded-xl bg-[#FFF9F2]">
                      <SmartImage
                        src="/src/assets/images/prod_pink_tulip_bouquet_1794842775666.jpg"
                        alt="Handmade pink tulip crochet bouquet"
                        fallbackTitle="Pink Tulip Bouquet"
                        loading="eager"
                        className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 px-1 font-hand text-lg leading-tight text-[#4A3531]">
                      Made by hand ♡
                    </p>
                  </button>

                  {/* Element 3: Small Plushie Polaroid (Top-Right / Side Overlap on sm+) */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ view: 'product', slug: 'cute-crochet-bunny-plushie' })
                    }
                    className="polaroid-card group relative z-20 block rounded-2xl border border-[#EFE0E6] p-2 pb-3 text-left sm:absolute sm:-bottom-4 sm:right-0 sm:w-[35%] sm:rotate-3 sm:hover:rotate-0"
                  >
                    <span
                      aria-hidden="true"
                      className="washi-tape-sage pointer-events-none absolute -top-2.5 left-5 h-4 w-14 -rotate-6 rounded-[2px]"
                    />
                    <div className="aspect-[4/4] overflow-hidden rounded-xl bg-[#FFF9F2]">
                      <SmartImage
                        src="/src/assets/images/prod_bunny_plushie_1794842775465.jpg"
                        alt="Cute cream crochet bunny plushie with blush ribbon"
                        fallbackTitle="Cute Bunny Plushie"
                        loading="eager"
                        className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 px-1 font-hand text-lg leading-tight text-[#4A3531]">
                      Little things, big love.
                    </p>
                  </button>
                </div>

                {/* Element 4: Handwritten Butter-Yellow Note Sticker */}
                <div className="relative z-30 mx-auto mt-4 max-w-xs -rotate-1 rounded-2xl border border-[#E7D493] bg-[#F8E9B5] px-4 py-3 shadow-sm sm:absolute sm:-top-3 sm:left-4 sm:mt-0 sm:max-w-[205px] sm:-rotate-3">
                  <div className="flex items-start gap-2">
                    <SageSprigDoodle className="mt-0.5 h-6 w-9 shrink-0" />
                    <p className="font-hand text-[19px] leading-snug text-[#4A3531]">
                      38+ tiny handmade pieces, stitched slowly in pastel cotton ♡
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. MINI BRAND INTRODUCTION (Compact Editorial Note)
      ===================================================================== */}
      <section className="bg-[#FFF9F2] py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <StitchedDivider className="mb-10" />

          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-dashed border-[#E5BECB] bg-[#FFFDF9] px-6 py-8 text-center sm:flex-row sm:px-10 sm:py-9 sm:text-left">
            <div className="relative shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#F4DDE5] shadow-xs sm:h-28 sm:w-28">
                <SmartImage
                  src={ABOUT_STUDIO_IMAGE}
                  alt="Soft pastel cotton yarns and crochet hook"
                  fallbackTitle="Looplet Yarn Basket"
                  className="h-full w-full"
                />
              </div>
              <YarnBallDoodle className="absolute -bottom-2 -right-2 h-10 w-10" />
            </div>

            <div className="flex-1">
              <p className="font-hand text-xl text-[#9F4E70]">our cozy little studio</p>
              <h2 className="mt-0.5 font-display text-2xl font-semibold text-[#4A3531] sm:text-3xl">
                Welcome to our little world of yarn.
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#7D5E5A] sm:text-[15px]">
                Every loop, every stitch and every little detail is made with love. Discover
                handmade creations designed to make ordinary moments a little more special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CATEGORY SECTION — IRREGULAR CREATIVE LAYOUT
      ===================================================================== */}
      <section id="shop-by-category" className="bg-[#FFF9F2] py-12 lg:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-hand text-2xl text-[#9F4E70]">
                Little treasures for every mood.
              </span>
              <h2 className="mt-0.5 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Find your little favourite.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all' })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9F4E70] transition-colors hover:text-[#4A3531]"
            >
              <span>See all 10 shelves</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Horizontal Quick-Scroll Category Strip + Irregular Scrapbook Grid on md+ */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12 md:gap-5">
            {SCRAPBOOK_CATEGORIES.map((tile, idx) => (
              <button
                key={tile.slug}
                type="button"
                onClick={() => navigateToCategory(tile.slug)}
                className={`group relative flex flex-col overflow-hidden rounded-[1.8rem] border p-2.5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${tile.spanClass} ${tile.tintClass}`}
              >
                <div
                  className={`relative w-full overflow-hidden rounded-[1.3rem] bg-[#FFF9F2] ${tile.aspectClass}`}
                >
                  <SmartImage
                    src={tile.image}
                    alt={tile.title}
                    fallbackTitle={tile.title}
                    className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                  />

                  {/* Soft contrast scrim at bottom of photo for clean legibility */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#4A3531]/40 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                  {/* Sticker Label */}
                  <span
                    className={`pointer-events-none absolute left-3 top-3 rounded-md px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase shadow-2xs ${
                      idx % 2 === 0 ? '-rotate-2' : 'rotate-2'
                    } ${tile.stickerTone}`}
                  >
                    {tile.sticker}
                  </span>

                  {/* Floating Heart on Hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-[#FFF9F2]/90 text-[#B9688A] opacity-0 shadow-xs transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Heart className="h-4 w-4 fill-[#D78FAE] text-[#B9688A]" />
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2 px-2 pb-1 pt-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-snug text-[#4A3531]">
                      {tile.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#7D5E5A]">{tile.caption}</p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF9F2] text-[#9F4E70] transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Gentle access to the remaining two specialty shelves */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-[#7D5E5A]">
            <span>Also on our shelves:</span>
            <button
              type="button"
              onClick={() => navigateToCategory('crochet-jewellery')}
              className="font-semibold text-[#9F4E70] underline decoration-dashed underline-offset-4 hover:text-[#4A3531]"
            >
              Crochet Jewellery
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => navigateToCategory('baby-crochet-collection')}
              className="font-semibold text-[#9F4E70] underline decoration-dashed underline-offset-4 hover:text-[#4A3531]"
            >
              Baby Crochet Collection
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FEATURED COLLECTION — MAGAZINE EDITORIAL STYLE
      ===================================================================== */}
      <section className="relative bg-[#F4DDE5]/30 py-16 lg:py-22">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2">
              <CrochetHookDoodle className="h-7 w-7" />
              <span className="font-hand text-2xl text-[#9F4E70]">handpicked from the studio</span>
            </div>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
              Currently on our crochet table ♡
            </h2>
            <p className="mt-2 text-sm text-[#7D5E5A]">
              Six signature pieces stitched in soft combed cotton—each one photographed right after finishing.
            </p>
          </div>

          {/* Upper Magazine Spread: 1 Large Editorial Spotlight + 2 Stacked Side Cards */}
          {leadFeatured && (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Large Featured Editorial Card */}
              <article className="polaroid-card group relative flex flex-col rounded-[2rem] border border-[#EED8E0] p-4 sm:p-5 lg:col-span-7">
                <span
                  aria-hidden="true"
                  className="washi-tape pointer-events-none absolute -top-3 left-10 z-10 h-6 w-24 -rotate-2 rounded-[2px]"
                />

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.4rem] bg-[#FFF9F2]">
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'product', slug: leadFeatured.slug })}
                    className="block h-full w-full"
                    aria-label={`View ${leadFeatured.name}`}
                  >
                    <SmartImage
                      src={leadFeatured.image}
                      alt={leadFeatured.name}
                      fallbackTitle={leadFeatured.name}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </button>

                  <span className="pointer-events-none absolute left-3.5 top-3.5 -rotate-2 rounded-md bg-[#F8E9B5] px-3 py-1 text-[10px] font-semibold tracking-wider text-[#5B4527] uppercase shadow-2xs">
                    Studio Spotlight
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(leadFeatured)}
                    aria-label={
                      isInWishlist(leadFeatured.id)
                        ? `Remove ${leadFeatured.name} from wishlist`
                        : `Save ${leadFeatured.name} to wishlist`
                    }
                    className={`absolute right-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full shadow-xs transition-colors ${
                      isInWishlist(leadFeatured.id)
                        ? 'bg-[#FFF9F2] text-[#B9688A]'
                        : 'bg-[#FFF9F2]/90 text-[#7D5E5A] hover:bg-[#F4DDE5] hover:text-[#9F4E70]'
                    }`}
                  >
                    <Heart
                      className={`h-4.5 w-4.5 ${
                        isInWishlist(leadFeatured.id) ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-5 flex flex-1 flex-col justify-between px-1">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#7D5E5A]">
                        {leadFeatured.categoryLabel} · {leadFeatured.availabilityLabel}
                      </span>
                      <span className="font-hand text-xl text-[#9F4E70]">editor&rsquo;s pick ♡</span>
                    </div>

                    <h3 className="mt-1 font-display text-2xl font-semibold text-[#4A3531] sm:text-[1.7rem]">
                      <button
                        type="button"
                        onClick={() => navigate({ view: 'product', slug: leadFeatured.slug })}
                        className="text-left transition-colors hover:text-[#9F4E70]"
                      >
                        {leadFeatured.name}
                      </button>
                    </h3>

                    <p className="mt-2 font-hand text-[21px] leading-snug text-[#7D5E5A]">
                      &ldquo;{FEATURED_NOTES[leadFeatured.id] || leadFeatured.shortDescription}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-[#E5BECB] pt-4">
                    <div>
                      <p className="tabular-nums text-xl font-semibold text-[#4A3531]">
                        {formatINR(leadFeatured.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate({ view: 'product', slug: leadFeatured.slug })}
                        className="text-xs font-semibold text-[#9F4E70] hover:underline"
                      >
                        Read stitch details →
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(leadFeatured)}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        addedIds[leadFeatured.id]
                          ? 'bg-[#D6E2C8] text-[#354328]'
                          : 'bg-[#B9688A] text-[#FFF9F2] hover:bg-[#A45677]'
                      }`}
                    >
                      {addedIds[leadFeatured.id] ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Added to Bag ♡</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>

              {/* Right Column: Two Horizontal Scrapbook Feature Cards */}
              <div className="flex flex-col gap-6 lg:col-span-5">
                {sideFeatured.map((item, idx) => {
                  const wishlisted = isInWishlist(item.id);
                  const isAdded = Boolean(addedIds[item.id]);
                  return (
                    <article
                      key={item.id}
                      className={`polaroid-card group relative flex flex-1 flex-col gap-4 rounded-[1.8rem] border p-3.5 sm:flex-row sm:items-center ${
                        idx === 0
                          ? 'border-[#E9D79E] bg-[#FFFDF9]'
                          : 'border-[#C6D5B7] bg-[#FFFDF9]'
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-[#FFF9F2] sm:aspect-square sm:w-40">
                        <button
                          type="button"
                          onClick={() => navigate({ view: 'product', slug: item.slug })}
                          className="block h-full w-full"
                          aria-label={`View ${item.name}`}
                        >
                          <SmartImage
                            src={item.image}
                            alt={item.name}
                            fallbackTitle={item.name}
                            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item)}
                          aria-label={
                            wishlisted
                              ? `Remove ${item.name} from wishlist`
                              : `Save ${item.name} to wishlist`
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF9F2]/90 text-[#9F4E70] shadow-2xs hover:bg-[#F4DDE5]"
                        >
                          <Heart className={`h-3.5 w-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              idx === 0
                                ? 'bg-[#F4DDE5] text-[#6B374D]'
                                : 'bg-[#D6E2C8] text-[#354328]'
                            }`}
                          >
                            {item.badge || 'Handmade'}
                          </span>
                          <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-[#4A3531]">
                            <button
                              type="button"
                              onClick={() => navigate({ view: 'product', slug: item.slug })}
                              className="text-left hover:text-[#9F4E70]"
                            >
                              {item.name}
                            </button>
                          </h3>
                          <p className="mt-1 font-hand text-[17px] leading-snug text-[#7D5E5A]">
                            {FEATURED_NOTES[item.id] || item.shortDescription}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-[#EFE0E6] pt-2.5">
                          <span className="tabular-nums text-base font-semibold text-[#4A3531]">
                            {formatINR(item.price)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigate({ view: 'product', slug: item.slug })}
                              className="text-xs font-medium text-[#7D5E5A] hover:text-[#9F4E70]"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickAdd(item)}
                              className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-semibold transition-colors ${
                                isAdded
                                  ? 'bg-[#D6E2C8] text-[#354328]'
                                  : 'bg-[#D78FAE] text-[#FFF9F2] hover:bg-[#B9688A]'
                              }`}
                            >
                              {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                              <span>{isAdded ? 'Added' : 'Add'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lower Polaroid Trio Row */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bottomFeatured.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                surfaceIndex={idx + 1}
                polaroidTilt={idx % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all' })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-7 py-2.5 text-sm font-semibold text-[#9F4E70] shadow-2xs transition-all hover:-translate-y-0.5 hover:bg-[#F4DDE5]/60"
            >
              <span>Browse All 38 Handmade Pieces</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. NEW ARRIVALS — HORIZONTAL SCROLLING COLLECTION
      ===================================================================== */}
      <section className="bg-[#FFF9F2] py-16 lg:py-22">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-block -rotate-1 rounded-md bg-[#F8E9B5] px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-[#5B4527] uppercase">
                Just Stitched
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Fresh off the crochet hook!
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ view: 'shop', category: 'all', filter: 'new' })}
                className="text-sm font-semibold text-[#9F4E70] hover:text-[#4A3531]"
              >
                View all new →
              </button>

              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => scrollNewArrivals('left')}
                  aria-label="Scroll new arrivals left"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5BECB] bg-[#FFFDF9] text-[#4A3531] transition-colors hover:bg-[#F4DDE5]"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollNewArrivals('right')}
                  aria-label="Scroll new arrivals right"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5BECB] bg-[#FFFDF9] text-[#4A3531] transition-colors hover:bg-[#F4DDE5]"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Snap-Scrolling Shelf */}
          <div
            ref={newArrivalsTrackRef}
            className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0"
          >
            {newArrivalProducts.map((product, idx) => (
              <div
                key={product.id}
                className="w-[78vw] max-w-[300px] shrink-0 snap-start sm:w-[290px]"
              >
                <ProductCard
                  product={product}
                  badgeOverride={NEW_ARRIVAL_STICKERS[idx % NEW_ARRIVAL_STICKERS.length]}
                  surfaceIndex={idx}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. BESTSELLER SECTION — SOFT GINGHAM FEATURED LAYOUT
      ===================================================================== */}
      <section className="bg-gingham-blush border-y border-[#EED8E0] py-16 lg:py-22">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-hand text-2xl text-[#9F4E70]">most loved by our cozy circle</p>
              <h2 className="mt-0.5 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Everyone&rsquo;s little favourites.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all', filter: 'bestsellers' })}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-5 py-2 text-xs font-semibold text-[#9F4E70] shadow-2xs transition-colors hover:bg-[#F4DDE5]"
            >
              <span>Shop All Bestsellers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Distinct Editorial Numbered Bestseller Stationery Grid */}
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {bestsellerProducts.map((product, idx) => {
              const wishlisted = isInWishlist(product.id);
              const isAdded = Boolean(addedIds[product.id]);
              return (
                <article
                  key={product.id}
                  className="group flex items-center gap-4 rounded-[1.6rem] border border-[#EED8E0] bg-[#FFF9F2]/96 p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'product', slug: product.slug })}
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#F4DDE5]/30"
                    aria-label={`View ${product.name}`}
                  >
                    <SmartImage
                      src={product.image}
                      alt={product.name}
                      fallbackTitle={product.name}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="tabular-nums pointer-events-none absolute left-1.5 top-1.5 rounded-md bg-[#FFF9F2]/92 px-1.5 py-0.5 text-[10px] font-bold text-[#9F4E70]">
                      No. 0{idx + 1}
                    </span>
                  </button>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-[15px] font-semibold leading-snug text-[#4A3531]">
                        <button
                          type="button"
                          onClick={() => navigate({ view: 'product', slug: product.slug })}
                          className="text-left hover:text-[#9F4E70]"
                        >
                          {product.name}
                        </button>
                      </h3>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          wishlisted
                            ? `Remove ${product.name} from wishlist`
                            : `Save ${product.name} to wishlist`
                        }
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#9F4E70] hover:bg-[#F4DDE5]/70"
                      >
                        <Heart className={`h-3.5 w-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#7D5E5A]">
                      {product.shortDescription}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="tabular-nums text-sm font-semibold text-[#4A3531]">
                        {formatINR(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-semibold transition-colors ${
                          isAdded
                            ? 'bg-[#D6E2C8] text-[#354328]'
                            : 'bg-[#B9688A] text-[#FFF9F2] hover:bg-[#A45677]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. CUSTOM ORDER SECTION
      ===================================================================== */}
      <section id="custom-orders-section" className="bg-[#FFF9F2] py-16 lg:py-22">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.2rem] border border-[#EED8E0] bg-gradient-to-br from-[#F4DDE5]/45 via-[#FFF9F2] to-[#F8E9B5]/40 p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#9F4E70]" />
                  <span className="font-hand text-2xl text-[#9F4E70]">made just for you</span>
                </div>

                <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                  Have a little idea? Let&rsquo;s make it.
                </h2>

                <p className="mt-4 text-base leading-relaxed text-[#7D5E5A]">
                  From your favourite flower to a tiny plushie with a personality, tell us what you
                  dream of and we&rsquo;ll bring it to life with yarn.
                </p>

                {/* Pastel Yarn Swatch Preview */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-xs font-medium text-[#7D5E5A]">Studio yarn palette:</span>
                  {['#F4DDE5', '#D78FAE', '#FFF9F2', '#F8E9B5', '#D6E2C8'].map((hex) => (
                    <span
                      key={hex}
                      className="h-5 w-5 rounded-full border border-[#4A3531]/15 shadow-2xs"
                      style={{ backgroundColor: hex }}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomForm((prev) => !prev)}
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A45677]"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>
                      {showCustomForm ? 'Close Custom Form' : 'Create My Custom Crochet'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate({ view: 'custom-orders' })}
                    className="inline-flex min-h-[46px] items-center gap-1.5 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-5 py-3 text-sm font-semibold text-[#9F4E70] transition-colors hover:bg-[#F4DDE5]/55"
                  >
                    <span>Custom Gallery</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7">
                {showCustomForm ? (
                  <CustomOrderForm compact />
                ) : (
                  /* Creative Visual Arrangement of Yarn, Hooks & Custom Samples */
                  <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-12">
                    <div className="polaroid-card relative rounded-2xl border border-[#EFE0E6] p-2.5 pb-4 sm:col-span-7 sm:-rotate-1">
                      <span
                        aria-hidden="true"
                        className="washi-tape-sage pointer-events-none absolute -top-2.5 left-8 h-5 w-20 -rotate-2 rounded-[2px]"
                      />
                      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#FFF9F2]">
                        <SmartImage
                          src={ABOUT_STUDIO_IMAGE}
                          alt="Crochet yarns, rose hook, handmade daisies and buttons on studio table"
                          fallbackTitle="Studio Materials"
                          className="h-full w-full"
                        />
                      </div>
                      <p className="mt-2.5 px-1 font-hand text-lg text-[#4A3531]">
                        Soft combed cottons &amp; pastel hooks ready for your colours ♡
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:col-span-5 sm:grid-cols-1">
                      <div className="polaroid-card rounded-2xl border border-[#EFE0E6] p-2 pb-3 sm:rotate-2">
                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#FFF9F2]">
                          <SmartImage
                            src="/src/assets/images/prod_custom_portrait_doll_1794842927328.jpg"
                            alt="Custom crochet portrait doll holding a tulip"
                            fallbackTitle="Custom Portrait Doll"
                            className="h-full w-full"
                          />
                        </div>
                        <p className="mt-1.5 px-1 font-hand text-base text-[#7D5E5A]">
                          bespoke portrait dolls
                        </p>
                      </div>

                      <div className="polaroid-card rounded-2xl border border-[#EFE0E6] p-2 pb-3 sm:-rotate-1">
                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#FFF9F2]">
                          <SmartImage
                            src="/src/assets/images/prod_custom_bouquet_box_1794842986046.jpg"
                            alt="Bespoke mixed pastel crochet flower hatbox"
                            fallbackTitle="Bespoke Hatbox"
                            className="h-full w-full"
                          />
                        </div>
                        <p className="mt-1.5 px-1 font-hand text-base text-[#7D5E5A]">
                          custom flower hatboxes
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. HANDMADE STORY SECTION — JOURNAL PAGE LAYOUT
      ===================================================================== */}
      <section className="bg-[#D6E2C8]/28 py-16 lg:py-22">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-journal-lines relative rounded-[2.2rem] border border-[#C6D5B6] p-6 shadow-sm sm:p-10 lg:p-12">
            {/* Decorative Corner Botanical & Yarn Details */}
            <SageSprigDoodle className="pointer-events-none absolute right-6 top-5 hidden h-10 w-16 sm:block" />

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              {/* Journal Left: Layered Scrapbook Snapshots */}
              <div className="relative lg:col-span-5">
                <div className="polaroid-card relative rounded-2xl border border-[#EFE0E6] p-2.5 pb-4 sm:-rotate-2">
                  <span
                    aria-hidden="true"
                    className="washi-tape-blush pointer-events-none absolute -top-3 left-10 h-5 w-20 rotate-2 rounded-[2px]"
                  />
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#FFF9F2]">
                    <SmartImage
                      src="/src/assets/images/prod_lily_bouquet_1794842926325.jpg"
                      alt="Delicate handmade lily of the valley crochet flowers tied with butter ribbon"
                      fallbackTitle="Handcrafted Blooms"
                      className="h-full w-full"
                    />
                  </div>
                  <p className="mt-2 px-1 font-hand text-lg text-[#4A3531]">
                    slow stitches, morning light &amp; cotton yarn
                  </p>
                </div>

                {/* Pinned Butter-Yellow Handwritten Sticky Note */}
                <div className="mt-4 rounded-2xl border border-[#E7D493] bg-[#F8E9B5] p-4 shadow-xs sm:-mt-6 sm:ml-auto sm:mr-2 sm:w-[82%] sm:rotate-2">
                  <div className="flex items-start gap-2.5">
                    <CrochetHookDoodle className="h-8 w-8 shrink-0" />
                    <p className="font-hand text-[19px] leading-snug text-[#4A3531]">
                      &ldquo;P.S. Every single creation gets a gentle steam-shape, a final stitch
                      check, and a blush ribbon wrap before it leaves our table.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Journal Right: Warm Storytelling */}
              <div className="lg:col-span-7">
                <span className="font-hand text-2xl text-[#9F4E70]">journal entry · looplet studio</span>
                <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                  Made by hand. Made with heart.
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-[1.8] text-[#5B4541]">
                  <p>
                    Looplet started on a quiet afternoon with a single pastel skein, a rose crochet
                    hook, and the simple joy of turning soft yarn into something that makes someone
                    smile.
                  </p>
                  <p>
                    Nothing here is rushed off a factory line. Every petal is shaped by fingers,
                    every bunny ear is sewn slightly playfully, and every gift box is tied like a
                    little letter to a friend. We believe handmade things carry the warmth of the
                    hands that stitched them—and stay special long after the wrapping paper is
                    opened.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate({ view: 'about' })}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#B9C9A8] bg-[#D6E2C8]/75 px-5 py-2 text-sm font-semibold text-[#354328] transition-colors hover:bg-[#C9D8B8]"
                  >
                    <span>Read Our Full Story</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <span className="font-hand text-xl text-[#9F4E70]">— with love, Looplet ♡</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. WHY LOOPLET — COMPACT ILLUSTRATED STATIONERY STRIP
      ===================================================================== */}
      <section className="bg-[#FFF9F2] py-14 lg:py-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-hand text-2xl text-[#9F4E70]">the little things that matter</span>
            <h2 className="mt-0.5 font-display text-2xl font-semibold text-[#4A3531] sm:text-3xl">
              Why Looplet?
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <HeartDoodle className="h-9 w-9" />,
                title: 'Handmade with Love',
                desc: 'Every piece is created with care and attention.',
                cardTone: 'bg-[#F4DDE5]/35 border-[#E9C9D6]',
              },
              {
                icon: <DaisyDoodle className="h-9 w-9" />,
                title: 'One-of-a-kind Creations',
                desc: 'Every little creation has its own personality.',
                cardTone: 'bg-[#F8E9B5]/35 border-[#EADAA0]',
              },
              {
                icon: <BowDoodle className="h-8 w-10" />,
                title: 'Made for Gifting',
                desc: 'Thoughtfully made for your favourite people.',
                cardTone: 'bg-[#FFFDF9] border-[#EFE0E6]',
              },
              {
                icon: <CloudDoodle className="h-8 w-10" />,
                title: 'Soft & Cozy',
                desc: 'Cute little things that bring comfort.',
                cardTone: 'bg-[#D6E2C8]/35 border-[#C6D5B7]',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border border-dashed p-5 text-center transition-transform duration-200 hover:-translate-y-0.5 ${item.cardTone}`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF9F2] shadow-2xs">
                  {item.icon}
                </div>
                <h3 className="mt-3.5 font-display text-base font-semibold text-[#4A3531]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#7D5E5A]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          10. INSTAGRAM GALLERY — PINTEREST-STYLE MASONRY
      ===================================================================== */}
      <InstagramGallery posts={INSTAGRAM_GALLERY_POSTS} />

      {/* =====================================================================
          11. NEWSLETTER POSTCARD SECTION
      ===================================================================== */}
      <section className="bg-[#FFF9F2] pb-16 pt-4 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-dashed border-[#D78FAE] bg-gradient-to-br from-[#F4DDE5]/65 via-[#FFF9F2] to-[#F8E9B5]/60 px-6 py-10 text-center shadow-xs sm:px-12 sm:py-12">
            <DaisyDoodle className="pointer-events-none absolute -left-3 -top-3 h-14 w-14 opacity-80" />
            <BowDoodle className="pointer-events-none absolute -bottom-2 right-5 h-10 w-14 opacity-80" />

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF9F2] text-[#9F4E70] shadow-2xs">
              <Mail className="h-5 w-5" />
            </div>

            <p className="mt-3 font-hand text-2xl text-[#9F4E70]">studio postcards</p>
            <h2 className="mt-0.5 font-display text-2xl font-semibold text-[#4A3531] sm:text-3xl">
              Letters, launches &amp; lovely little things.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#7D5E5A]">
              Be the first to meet our new creations and little surprises.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row sm:items-center"
              noValidate
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="w-full rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-5 py-3 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/65 focus:border-[#B9688A] focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[46px] shrink-0 rounded-full bg-[#B9688A] px-7 py-3 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677]"
              >
                Subscribe
              </button>
            </form>

            {newsletterError && (
              <p className="mt-3 text-xs font-medium text-[#7B2E4E]">{newsletterError}</p>
            )}

            {newsletterNotice && (
              <div className="mx-auto mt-4 inline-flex max-w-lg items-start gap-2 rounded-2xl border border-[#D78FAE] bg-[#FFF9F2] px-4 py-3 text-left text-xs leading-relaxed text-[#4A3531]">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9F4E70]" />
                <span>{newsletterNotice}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
