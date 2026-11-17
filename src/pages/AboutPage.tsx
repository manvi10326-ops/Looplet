import React from 'react';
import { ArrowRight, Gift, Heart, Package, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ABOUT_STUDIO_IMAGE } from '../data/catalog';
import { BackButton } from '../components/BackButton';
import { SmartImage } from '../components/SmartImage';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <main className="bg-[#FFF9F2] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackRoute={{ view: 'home' }} />
        </div>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="font-hand text-2xl text-[#9F4E70]">About Looplet</p>
            <h1 className="mt-1 font-display text-4xl font-semibold text-[#4A3531] sm:text-5xl">
              Every Stitch Has a Little Story.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#7D5E5A]">
              Looplet is a handmade crochet boutique born from a love for gentle pastel yarns,
              patient craftsmanship, and heartfelt gifting. Each flower bouquet, amigurumi bunny,
              everyday tote, and keepsake charm is stitched entirely by hand—never rushed, never
              mass-produced.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#7D5E5A]">
              We believe the sweetest things in life are made slowly. Whether you are gifting a
              forever bouquet that never wilts or treating yourself to a tiny strawberry keychain,
              every loop carries warmth from our studio table to yours.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate({ view: 'shop', category: 'all' })}
                className="inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] hover:bg-[#A45677]"
              >
                <span>Shop Our Creations</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate({ view: 'custom-orders' })}
                className="inline-flex items-center gap-2 rounded-full border border-[#D78FAE] bg-white px-6 py-3 text-sm font-semibold text-[#9F4E70] hover:bg-[#F4DDE5]/40"
              >
                <span>Request Custom Order</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-[2rem] border border-[#EED8E0] bg-white p-2.5 shadow-md">
              <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <SmartImage
                  src={ABOUT_STUDIO_IMAGE}
                  alt="Looplet crochet studio table with pastel cotton yarn skeins and handmade daisies"
                  fallbackTitle="Looplet Studio Table"
                  loading="eager"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <section className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Heart,
              title: 'Handmade with Love',
              desc: 'Crafted stitch by stitch by skilled hands using soft combed cotton yarns.',
              bg: 'bg-[#F4DDE5]/55',
            },
            {
              icon: Sparkles,
              title: 'Thoughtfully Crafted',
              desc: 'Neat stitch tension, secure finishing, and gentle colour pairings.',
              bg: 'bg-[#F8E9B5]/55',
            },
            {
              icon: Gift,
              title: 'Unique Little Creations',
              desc: 'Small-batch releases and bespoke palettes tailored to your gifting moment.',
              bg: 'bg-[#D6E2C8]/55',
            },
            {
              icon: Package,
              title: 'Made to Spread Happiness',
              desc: 'Wrapped in blush tissue, satin ribbon, and handwritten notes ready to smile over.',
              bg: 'bg-[#F4DDE5]/55',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-[#EED8E0] bg-white/85 p-6 shadow-2xs"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                >
                  <Icon className="h-5 w-5 text-[#9F4E70]" />
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold text-[#4A3531]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#7D5E5A]">{item.desc}</p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
};
