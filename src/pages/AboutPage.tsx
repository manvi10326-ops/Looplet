import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ABOUT_STUDIO_IMAGE, HERO_IMAGE } from '../data/catalog';
import { BackButton } from '../components/BackButton';
import { SmartImage } from '../components/SmartImage';
import {
  BowDoodle,
  DaisyDoodle,
  HeartDoodle,
  SageSprigDoodle,
  StitchedDivider,
  YarnBallDoodle,
} from '../components/ScrapbookDoodles';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <main className="bg-[#FFF9F2] bg-paper-dots py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackRoute={{ view: 'home' }} />
        </div>

        {/* Journal Story Header & Polaroid Spread */}
        <section className="relative overflow-hidden rounded-[2.25rem] border border-[#EED8E0] bg-[#FFFDF9] bg-journal-lines p-6 shadow-sm sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F4DDE5]/75 px-3.5 py-1 text-xs font-semibold text-[#9F4E70]">
                <YarnBallDoodle className="h-4 w-4" />
                <span>Studio Journal — Page 01</span>
              </div>

              <p className="mt-4 font-hand text-3xl text-[#9F4E70]">Our Little Story</p>
              <h1 className="mt-1 font-display text-4xl font-semibold leading-tight text-[#4A3531] sm:text-5xl">
                Made by hand. Made with heart.
              </h1>

              <p className="mt-5 text-base leading-relaxed text-[#7D5E5A]">
                Looplet began on a sunny studio table with a basket of pastel cotton yarn, one
                well-loved crochet hook, and a wish to create soft, thoughtful keepsakes that feel
                personal. Every flower bouquet, amigurumi bunny, everyday tote, and tiny charm is
                stitched entirely by hand—never rushed, never mass-produced.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#7D5E5A]">
                We believe the sweetest things in life are made slowly. Whether you are gifting a
                forever tulip bouquet that never wilts or treating yourself to a tiny strawberry
                keychain, every loop carries warmth from our studio table to yours.
              </p>

              {/* Pinned Butter Sticky Note */}
              <div className="mt-6 inline-block -rotate-1 rounded-2xl border border-[#EED8E0] bg-[#F8E9B5]/80 px-5 py-3.5 shadow-2xs">
                <p className="font-hand text-xl text-[#4A3531]">
                  “Little loops, lovely creations — stitched slowly in small studio batches ♡”
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate({ view: 'shop', category: 'all' })}
                  className="inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] shadow-xs transition-all hover:-translate-y-0.5 hover:bg-[#A45677]"
                >
                  <span>Explore the Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ view: 'custom-orders' })}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFFDF9] px-6 py-3 text-sm font-semibold text-[#9F4E70] transition-colors hover:bg-[#F4DDE5]/50"
                >
                  <span>Make Something Custom</span>
                </button>
              </div>
            </div>

            {/* Layered Polaroid Collage */}
            <div className="relative lg:col-span-6">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="polaroid-card relative rotate-1 p-3 pb-10">
                  <span className="washi-tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" />
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#F4DDE5]/30">
                    <SmartImage
                      src={ABOUT_STUDIO_IMAGE}
                      alt="Looplet crochet studio table with pastel cotton yarn skeins and handmade daisies"
                      fallbackTitle="Looplet Studio Table"
                      loading="eager"
                      className="h-full w-full"
                    />
                  </div>
                  <p className="mt-3 text-center font-hand text-xl text-[#7D5E5A]">
                    morning light &amp; pastel cotton skeins on our crochet table ♡
                  </p>
                </div>

                {/* Inset Mini Packaging Polaroid */}
                <div className="polaroid-card -mt-10 ml-auto mr-2 w-44 -rotate-3 p-2 pb-6 sm:w-52">
                  <span className="washi-tape-sage -top-2.5 right-6 rotate-3" />
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#D6E2C8]/30">
                    <SmartImage
                      src={HERO_IMAGE}
                      alt="Handmade Looplet bouquet, tote, and keepsake charms wrapped for gifting"
                      fallbackTitle="Boutique Gift Wrap"
                      className="h-full w-full"
                    />
                  </div>
                  <p className="mt-2 text-center font-hand text-base text-[#7D5E5A]">
                    wrapped for gifting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <StitchedDivider className="my-12" />

        {/* Studio Values — Illustrated Scrapbook Cards */}
        <section>
          <div className="text-center">
            <p className="font-hand text-2xl text-[#9F4E70]">Little Studio Promises</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531]">
              Why makers &amp; gift-lovers adore Looplet
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                doodle: <HeartDoodle className="h-7 w-7" />,
                title: 'Handmade with Love',
                desc: 'Crafted stitch by stitch by skilled hands using soft combed cotton yarns.',
                bg: 'bg-[#F4DDE5]/60',
                tilt: '-rotate-1',
              },
              {
                doodle: <DaisyDoodle className="h-7 w-7" />,
                title: 'One-of-a-kind Creations',
                desc: 'Small-batch releases and bespoke palettes tailored to your gifting moment.',
                bg: 'bg-[#F8E9B5]/65',
                tilt: 'rotate-1',
              },
              {
                doodle: <BowDoodle className="h-7 w-7" />,
                title: 'Made for Gifting',
                desc: 'Wrapped in blush tissue, satin ribbon, and handwritten notes ready to smile over.',
                bg: 'bg-[#D6E2C8]/60',
                tilt: '-rotate-1',
              },
              {
                doodle: <SageSprigDoodle className="h-7 w-7" />,
                title: 'Soft & Cozy',
                desc: 'Gentle pastel hues, neat stitch tension, and comforting textures meant to last.',
                bg: 'bg-[#F4DDE5]/45',
                tilt: 'rotate-1',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-[1.75rem] border border-[#EED8E0] bg-[#FFFDF9] p-6 shadow-2xs transition-transform duration-300 hover:rotate-0 ${item.tilt}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                >
                  {item.doodle}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-[#4A3531]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#7D5E5A]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
