import React, { useState } from 'react';
import {
  ArrowRight,
  Gift,
  Heart,
  Info,
  Mail,
  Package,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import {
  ABOUT_STUDIO_IMAGE,
  CATEGORIES,
  FEATURED_PRODUCT_IDS,
  HERO_IMAGE,
  INSTAGRAM_GALLERY_POSTS,
  PRODUCTS,
} from '../data/catalog';
import { SAMPLE_REVIEWS } from '../data/reviews';
import { CustomOrderForm } from '../components/CustomOrderForm';
import { InstagramGallery } from '../components/InstagramGallery';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';

export const HomePage: React.FC = () => {
  const { navigate, navigateToCategory } = useStore();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterNotice, setNewsletterNotice] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const featuredProducts = FEATURED_PRODUCT_IDS.map((id) =>
    PRODUCTS.find((p) => p.id === id)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const newArrivalProducts = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 6);
  const bestsellerProducts = PRODUCTS.filter((p) => p.isBestseller).slice(0, 6);

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
      `Automated email newsletters are not yet connected on this preview. Follow ${STORE_CONFIG.social.instagramHandle} or message us on WhatsApp to hear first about new Looplet drops!`
    );
  };

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F2] via-[#FFF9F2] to-[#F4DDE5]/35 pb-14 pt-8 sm:pb-20 sm:pt-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Copy */}
            <div className="text-center lg:col-span-6 lg:text-left">
              <p className="font-hand text-2xl text-[#9F4E70] sm:text-3xl">
                Handmade Crochet Boutique
              </p>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.12] tracking-tight text-[#4A3531] sm:text-5xl lg:text-[3.4rem]">
                Little Loops, Lovely Creations.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#7D5E5A] sm:text-lg lg:mx-0">
                Handcrafted with love, stitched with care, and made to bring a little extra
                happiness into your everyday life.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <button
                  type="button"
                  onClick={() => navigate({ view: 'shop', category: 'all' })}
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#B9688A] px-7 py-3 text-sm font-semibold text-[#FFF9F2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A45677] sm:w-auto"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'custom-orders' })}
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-7 py-3 text-sm font-semibold text-[#9F4E70] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F4DDE5]/55 sm:w-auto"
                >
                  <span>Customise Your Crochet</span>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-[#7D5E5A] lg:justify-start">
                <span>100% Hand-Stitched</span>
                <span aria-hidden="true">·</span>
                <span>Combed Cotton Yarns</span>
                <span aria-hidden="true">·</span>
                <span>Gift-Ready Packaging</span>
              </div>
            </div>

            {/* Right Showcase */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                <div className="overflow-hidden rounded-[2rem] border border-[#EED8E0] bg-white p-2.5 shadow-lg">
                  <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                    <SmartImage
                      src={HERO_IMAGE}
                      alt="Looplet handmade crochet tulip bouquet, cream tote bag, bunny plushie, and strawberry keychain"
                      fallbackTitle="Looplet Signature Collection"
                      loading="eager"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY (All 10 Categories) */}
      <section id="shop-by-category" className="bg-[#FFF9F2] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-hand text-2xl text-[#9F4E70]">Curated Shelves</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Shop by Category
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all' })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9F4E70] transition-colors hover:text-[#4A3531]"
            >
              <span>Browse All 38 Products</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#EED8E0] bg-white/85 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => navigateToCategory(cat.slug)}
                  className="aspect-[4/3] w-full overflow-hidden bg-[#FFF9F2]"
                >
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    fallbackTitle={cat.name}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="font-display text-base font-semibold leading-snug text-[#4A3531]">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#7D5E5A]">
                      {cat.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateToCategory(cat.slug)}
                    className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-[#4A3531] transition-colors ${cat.accentBg} hover:bg-[#F4DDE5]`}
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (12 Products) */}
      <section className="bg-[#F4DDE5]/30 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-hand text-2xl text-[#9F4E70]">Handpicked Favourites</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Featured Crochet Creations
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all' })}
              className="inline-flex items-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-5 py-2.5 text-xs font-semibold text-[#9F4E70] transition-colors hover:bg-[#F4DDE5]/60"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS (6 Products with NEW badge) */}
      <section className="bg-[#FFF9F2] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-hand text-2xl text-[#9F4E70]">Fresh Off the Hook</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                New Arrivals
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all', filter: 'new' })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9F4E70] transition-colors hover:text-[#4A3531]"
            >
              <span>Shop All New Arrivals</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newArrivalProducts.map((product) => (
              <ProductCard key={product.id} product={product} badgeOverride="New" />
            ))}
          </div>
        </div>
      </section>

      {/* 5. BESTSELLERS (6 Products with Bestseller badge) */}
      <section className="bg-[#F8E9B5]/25 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-hand text-2xl text-[#9F4E70]">Most Adored Pieces</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Boutique Bestsellers
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ view: 'shop', category: 'all', filter: 'bestsellers' })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9F4E70] transition-colors hover:text-[#4A3531]"
            >
              <span>Shop All Bestsellers</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bestsellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} badgeOverride="Bestseller" />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOM CROCHET ORDERS */}
      <section id="custom-orders-section" className="bg-[#F4DDE5]/45 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="font-hand text-2xl text-[#9F4E70]">Bespoke Commissions</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Dream It. We’ll Crochet It.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#7D5E5A]">
                Have something special in mind? Let us turn your favourite ideas into adorable
                handmade creations—stitched in your chosen palette and wrapped with care.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-[#4A3531]">
                {[
                  'Custom plushies & character amigurumi',
                  'Personalised crochet flower bouquets',
                  'Custom totes, pouches & shoulder bags',
                  'Special occasion gifts & wedding favours',
                  'Personalised initial & motif keychains',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFF9F2] text-[#9F4E70]">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomForm((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677]"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>{showCustomForm ? 'Hide Request Form' : 'Request a Custom Order'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'custom-orders' })}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-5 py-3 text-sm font-semibold text-[#9F4E70] transition-colors hover:bg-white"
                >
                  <span>Full Custom Guide</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              {showCustomForm ? (
                <CustomOrderForm compact />
              ) : (
                <div className="overflow-hidden rounded-3xl border border-[#EED8E0] bg-[#FFF9F2] p-6 shadow-xs sm:p-8">
                  <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                      <SmartImage
                        src="/src/assets/images/prod_custom_bouquet_box_1794842986046.jpg"
                        alt="Bespoke mixed pastel crochet flower bouquet hatbox"
                        fallbackTitle="Custom Crochet Creations"
                        className="h-full w-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[#4A3531]">
                        How Custom Orders Work
                      </h3>
                      <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-[#7D5E5A] sm:text-sm">
                        <li>
                          <strong className="text-[#4A3531]">1. Share your idea:</strong> Click
                          &ldquo;Request a Custom Order&rdquo; to pick yarn shades and details.
                        </li>
                        <li>
                          <strong className="text-[#4A3531]">2. Confirm on WhatsApp:</strong> We
                          review your inspiration and reply with an exact quote and timeline.
                        </li>
                        <li>
                          <strong className="text-[#4A3531]">3. Hand-stitched for you:</strong>{' '}
                          Every custom piece is photographed before dispatch.
                        </li>
                      </ol>
                      <button
                        type="button"
                        onClick={() => setShowCustomForm(true)}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#9F4E70] hover:underline"
                      >
                        <span>Open Custom Order Form</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT US */}
      <section className="bg-[#D6E2C8]/30 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-[2rem] border border-[#C6D5B6] bg-[#FFF9F2] p-2.5 shadow-sm">
                <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                  <SmartImage
                    src={ABOUT_STUDIO_IMAGE}
                    alt="Pastel cotton yarns, rose crochet hook, handmade daisies, and wooden buttons on linen"
                    fallbackTitle="Looplet Studio Table"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <p className="font-hand text-2xl text-[#9F4E70]">Our Story</p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
                Every Stitch Has a Little Story.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#7D5E5A]">
                Looplet began around a sunlit craft table with a basket of soft pastel yarns and a
                love for slow, intentional making. Each flower petal, plushie ear, and woven tote
                is crocheted by hand with patience, creativity, and genuine care—designed to outlast
                fleeting trends and bring gentle warmth into your home.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {[
                  { title: 'Handmade with Love', desc: 'Zero factory lines—only patient hand-stitching.' },
                  { title: 'Thoughtfully Crafted', desc: 'Soft combed cotton & neat finishing touches.' },
                  { title: 'Unique Little Creations', desc: 'Small-batch palettes & charming motifs.' },
                  { title: 'Made to Spread Happiness', desc: 'Keepsakes built to make gifting heartfelt.' },
                ].map((val) => (
                  <div
                    key={val.title}
                    className="rounded-2xl border border-[#C6D5B6] bg-[#FFF9F2]/90 p-4"
                  >
                    <h3 className="font-display text-sm font-semibold text-[#4A3531]">
                      {val.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#7D5E5A]">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE LOOPLET? */}
      <section className="bg-[#FFF9F2] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-hand text-2xl text-[#9F4E70]">The Boutique Promise</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
              Why Choose Looplet?
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: 'Handmade with Love',
                desc: 'Every single product is carefully handcrafted loop by loop in small studio batches.',
                bg: 'bg-[#F4DDE5]/55',
              },
              {
                icon: Sparkles,
                title: 'Unique Designs',
                desc: 'Cute, creative, and timeless floral & amigurumi designs you won’t find in big-box stores.',
                bg: 'bg-[#F8E9B5]/55',
              },
              {
                icon: Gift,
                title: 'Personalised Gifts',
                desc: 'Custom yarn colours, bouquet mixes, and bespoke keepsakes tailored for special moments.',
                bg: 'bg-[#D6E2C8]/55',
              },
              {
                icon: Package,
                title: 'Thoughtful Packaging',
                desc: 'Arrives nestled in blush tissue paper, satin ribbons, and gift-ready boutique boxes.',
                bg: 'bg-[#F4DDE5]/55',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-3xl border border-[#EED8E0] bg-white/85 p-6 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[#4A3531] ${card.bg}`}
                  >
                    <Icon className="h-5 w-5 text-[#9F4E70]" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-[#4A3531]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7D5E5A]">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS */}
      <section className="bg-[#F4DDE5]/30 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-hand text-2xl text-[#9F4E70]">Kind Words</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
              Loved by Crochet Admirers
            </h2>
            <p className="mt-2 text-xs text-[#7D5E5A]">
              Sample customer testimonials shown below as layout placeholders for genuine boutique
              reviews.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_REVIEWS.map((review) => (
              <article
                key={review.id}
                className="flex flex-col justify-between rounded-3xl border border-[#EED8E0] bg-[#FFF9F2] p-6 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D78FAE]" aria-label="5 out of 5 stars">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-[#F8E9B5] text-[#C89B3C]" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#4A3531]">
                    &ldquo;{review.reviewText}&rdquo;
                  </p>
                </div>

                <div className="mt-5 border-t border-[#F4DDE5] pt-4">
                  <p className="font-display text-sm font-semibold text-[#4A3531]">
                    {review.customerName} · {review.location}
                  </p>
                  <p className="mt-0.5 text-xs text-[#7D5E5A]">{review.productPurchased}</p>
                  <p className="mt-1 text-[11px] italic text-[#7D5E5A]/80">{review.dateLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. INSTAGRAM GALLERY */}
      <InstagramGallery posts={INSTAGRAM_GALLERY_POSTS} />

      {/* 11. NEWSLETTER SECTION */}
      <section className="border-t border-[#EED8E0] bg-[#F8E9B5]/35 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF9F2] text-[#9F4E70] shadow-2xs">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
            Stay in Our Little Crochet Circle.
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#7D5E5A] sm:text-base">
            Get updates about new collections, adorable launches and special offers.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center"
            noValidate
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="w-full rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-5 py-3 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/65 focus:border-[#B9688A] focus:outline-none sm:max-w-xs"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#B9688A] px-7 py-3 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677]"
            >
              Subscribe
            </button>
          </form>

          {newsletterError && (
            <p className="mt-3 text-xs font-medium text-[#7B2E4E]">{newsletterError}</p>
          )}

          {newsletterNotice && (
            <div className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-[#D78FAE] bg-[#FFF9F2] px-4 py-3 text-left text-xs leading-relaxed text-[#4A3531]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9F4E70]" />
              <span>{newsletterNotice}</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
