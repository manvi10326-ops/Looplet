import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { ABOUT_STUDIO_IMAGE } from '../data/catalog';
import { SmartImage } from './SmartImage';
import { DaisyDoodle } from './ScrapbookDoodles';

interface GalleryPost {
  id: string;
  caption: string;
  image: string;
  alt: string;
}

interface InstagramGalleryProps {
  posts: GalleryPost[];
}

export const InstagramGallery: React.FC<InstagramGalleryProps> = ({ posts }) => {
  // Enrich with behind-the-scenes studio photo for a fuller Pinterest-style masonry feel
  const displayPosts: (GalleryPost & { aspect: string; tilt: string; tape: string })[] = [
    {
      ...(posts[0] || {
        id: 'ig-1',
        caption: 'Freshly wrapped pink tulip bouquets ready for gifting ♡',
        image: '/src/assets/images/prod_pink_tulip_bouquet_1794842775666.jpg',
        alt: 'Pink tulip crochet bouquet',
      }),
      aspect: 'aspect-[4/5]',
      tilt: 'sm:-rotate-1',
      tape: 'washi-tape',
    },
    {
      id: 'ig-studio',
      caption: 'Morning yarns, pastel cotton & rose hooks on our studio table 🧶',
      image: ABOUT_STUDIO_IMAGE,
      alt: 'Pastel crochet yarns and rose hook behind the scenes',
      aspect: 'aspect-[4/3]',
      tilt: 'sm:rotate-1',
      tape: 'washi-tape-sage',
    },
    {
      ...(posts[1] || {
        id: 'ig-2',
        caption: 'Floppy-eared crochet bunny plushie!',
        image: '/src/assets/images/prod_bunny_plushie_1794842775465.jpg',
        alt: 'Crochet bunny plushie',
      }),
      aspect: 'aspect-square',
      tilt: 'sm:rotate-[0.7deg]',
      tape: 'washi-tape-blush',
    },
    {
      ...(posts[2] || {
        id: 'ig-3',
        caption: 'Everyday cream puff-stitch tote with daisy charm.',
        image: '/src/assets/images/prod_pastel_tote_bag_1794842779134.jpg',
        alt: 'Pastel crochet tote bag',
      }),
      aspect: 'aspect-[4/5]',
      tilt: 'sm:-rotate-[0.8deg]',
      tape: 'washi-tape',
    },
    {
      ...(posts[3] || {
        id: 'ig-4',
        caption: 'Pocket-sized crochet strawberry keychains.',
        image: '/src/assets/images/prod_strawberry_keychain_1794842780623.jpg',
        alt: 'Strawberry crochet keychain',
      }),
      aspect: 'aspect-[4/3]',
      tilt: 'sm:rotate-1',
      tape: 'washi-tape-blush',
    },
    {
      ...(posts[5] || {
        id: 'ig-6',
        caption: 'Packed with blush tissue, satin ribbon & love at Looplet.',
        image: '/src/assets/images/prod_gift_hamper_box_1794842825208.jpg',
        alt: 'Gift hamper packaging box',
      }),
      aspect: 'aspect-square',
      tilt: 'sm:-rotate-1',
      tape: 'washi-tape-sage',
    },
    {
      ...(posts[4] || {
        id: 'ig-5',
        caption: 'Soft floral hair clips & ruffled scrunchies for sunny mornings.',
        image: '/src/assets/images/prod_daisy_scrunchie_1794842923500.jpg',
        alt: 'Ruffled crochet scrunchies',
      }),
      aspect: 'aspect-[5/4]',
      tilt: 'sm:rotate-[0.6deg]',
      tape: 'washi-tape',
    },
    {
      id: 'ig-coasters',
      caption: 'Scalloped pastel coasters stacked beside afternoon tea ♡',
      image: '/src/assets/images/prod_coaster_set_1794842779437.jpg',
      alt: 'Pastel scalloped crochet coasters',
      aspect: 'aspect-[4/5]',
      tilt: 'sm:-rotate-[0.6deg]',
      tape: 'washi-tape-blush',
    },
  ];

  return (
    <section className="bg-[#FFF9F2] py-16 lg:py-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <DaisyDoodle className="h-7 w-7" />
              <span className="font-hand text-2xl text-[#9F4E70]">
                {STORE_CONFIG.social.instagramHandle}
              </span>
            </div>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
              Little loops on our Instagram.
            </h2>
            <p className="mt-1.5 text-sm text-[#7D5E5A]">
              Peek inside our yarn baskets, freshly wrapped parcels, and tiny work-in-progress stitches.
            </p>
          </div>

          <a
            href={STORE_CONFIG.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-full border border-[#D78FAE] bg-[#F4DDE5]/55 px-5 py-2 text-sm font-semibold text-[#4A3531] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F4DDE5]"
          >
            <Instagram className="h-4 w-4 text-[#9F4E70]" />
            <span className="whitespace-nowrap">Follow {STORE_CONFIG.social.instagramHandle}</span>
          </a>
        </div>

        {/* Pinterest-Style Varied Columns Masonry */}
        <div className="mt-10 columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4 lg:gap-5 lg:space-y-5">
          {displayPosts.map((post) => (
            <a
              key={post.id}
              href={STORE_CONFIG.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`polaroid-card group relative block break-inside-avoid rounded-2xl border border-[#EFE0E6] p-2 pb-3 transition-transform duration-200 hover:rotate-0 ${post.tilt}`}
            >
              {/* Tiny decorative washi tape */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 rotate-1 rounded-[2px] ${post.tape}`}
              />

              <div className={`relative overflow-hidden rounded-xl bg-[#FFF9F2] ${post.aspect}`}>
                <SmartImage
                  src={post.image}
                  alt={post.alt}
                  fallbackTitle={post.caption}
                  className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#4A3531]/75 via-[#4A3531]/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <p className="line-clamp-2 text-xs font-medium text-[#FFF9F2]">{post.caption}</p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <p className="truncate font-hand text-[16px] leading-tight text-[#7D5E5A]">
                  {post.caption}
                </p>
                <Heart className="h-3.5 w-3.5 shrink-0 text-[#D78FAE] transition-transform duration-200 group-hover:scale-110 group-hover:fill-[#D78FAE]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
