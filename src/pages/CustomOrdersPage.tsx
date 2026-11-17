import React from 'react';
import { Sparkles } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CustomOrderForm } from '../components/CustomOrderForm';
import { SmartImage } from '../components/SmartImage';

export const CustomOrdersPage: React.FC = () => {
  return (
    <main className="bg-gradient-to-b from-[#F4DDE5]/35 via-[#FFF9F2] to-[#FFF9F2] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallbackRoute={{ view: 'home' }} />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-hand text-2xl text-[#9F4E70]">Custom Crochet Creations</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-[#4A3531] sm:text-5xl">
            Dream It. We’ll Crochet It.
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#7D5E5A]">
            Have something special in mind? Let us turn your favourite ideas into adorable handmade
            creations—from custom portrait dolls to personalised bouquets and bridesmaid favours.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Inspiration Gallery & Highlights */}
          <div className="space-y-6 lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-[#EED8E0] bg-white p-2.5 shadow-sm">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <SmartImage
                  src="/src/assets/images/prod_custom_portrait_doll_1794842927328.jpg"
                  alt="Bespoke handmade crochet portrait doll holding a tulip"
                  fallbackTitle="Custom Keepsake Doll"
                  loading="eager"
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-[#EED8E0] bg-white/90 p-6 shadow-2xs">
              <h2 className="font-display text-xl font-semibold text-[#4A3531]">
                What We Can Customise
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-[#7D5E5A]">
                {[
                  'Custom plushies & character amigurumi buddies',
                  'Personalised crochet bouquets in wedding or birthday palettes',
                  'Custom tote & sling bag sizes, straps, and floral motifs',
                  'Special occasion gifts, baby shower keepsakes & return favours',
                  'Personalised initial charms & colour-matched keychains',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#9F4E70]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Custom Order Form */}
          <div className="lg:col-span-7">
            <CustomOrderForm />
          </div>
        </div>
      </div>
    </main>
  );
};
