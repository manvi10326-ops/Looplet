import React from 'react';
import { Instagram } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { SmartImage } from './SmartImage';

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
  return (
    <section className="bg-[#FFF9F2] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-hand text-2xl text-[#9F4E70]">{STORE_CONFIG.social.instagramHandle}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
              A Little Crochet Inspiration ♡
            </h2>
          </div>

          <a
            href={STORE_CONFIG.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#D78FAE] bg-[#F4DDE5]/40 px-5 py-2.5 text-sm font-semibold text-[#4A3531] transition-colors hover:bg-[#F4DDE5]"
          >
            <Instagram className="h-4 w-4 text-[#9F4E70]" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={STORE_CONFIG.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl border border-[#EED8E0] bg-white shadow-xs"
            >
              <SmartImage
                src={post.image}
                alt={post.alt}
                fallbackTitle={post.caption}
                className="h-full w-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#4A3531]/75 via-[#4A3531]/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <p className="text-xs font-medium text-[#FFF9F2] line-clamp-2">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
