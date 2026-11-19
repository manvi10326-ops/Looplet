import React, { useEffect, useState } from 'react';
import { Heart, Instagram, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { YarnBallDoodle } from './ScrapbookDoodles';

export const Navbar: React.FC = () => {
  const {
    route,
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    navigate,
  } = useStore();

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    navigate({ view: 'shop', category: 'all', query: q || undefined });
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = (isActive: boolean) =>
    `relative whitespace-nowrap shrink-0 py-1.5 text-[14px] font-medium tracking-[0.01em] transition-colors duration-200 ${
      isActive
        ? 'text-[#9F4E70] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#D78FAE]'
        : 'text-[#4A3531] hover:text-[#9F4E70] after:absolute after:bottom-0 after:left-1/2 after:h-[1.5px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-[#D78FAE] after:transition-all after:duration-200 hover:after:w-full'
    }`;

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Slim Editable Announcement Bar */}
      {showAnnouncement && (
        <div className="relative flex h-8 items-center justify-center bg-[#F4DDE5] px-9 text-center text-xs font-medium tracking-wide text-[#5C3A45]">
          <p className="truncate">{STORE_CONFIG.announcementText}</p>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Close announcement"
            className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-[#7D5E5A] transition-colors hover:bg-[#FFF9F2]/70 hover:text-[#4A3531]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Boutique Cream Navigation */}
      <header className="border-b border-[#EED8E0] bg-[#FFF9F2]/96 backdrop-blur-md">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-4 px-4 sm:h-[76px] sm:px-6 lg:gap-8 lg:px-8">
          {/* LEFT: Prominent Official Looplet Logo + Subtle Handwritten Tagline */}
          <button
            type="button"
            onClick={() => handleNavClick(() => navigate({ view: 'home' }))}
            aria-label="Looplet Home"
            className="group flex shrink-0 items-center gap-3 rounded-xl py-1 text-left focus-visible:ring-2 focus-visible:ring-[#B9688A]"
          >
            <img
              src={STORE_CONFIG.logoPath}
              alt="Looplet — Little Loops, Lovely Creations"
              className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:h-14"
            />
            <span className="hidden border-l border-dashed border-[#E5BECB] pl-3 font-hand text-[19px] leading-none text-[#9F4E70] xl:inline-block">
              {STORE_CONFIG.tagline}
            </span>
          </button>

          {/* CENTER: Compact 5-Link Boutique Navigation */}
          <nav
            className="hidden items-center gap-6 lg:flex xl:gap-8"
            aria-label="Primary navigation"
          >
            <button
              type="button"
              onClick={() => handleNavClick(() => navigate({ view: 'home' }))}
              className={navLinkClass(route.view === 'home')}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => navigate({ view: 'shop', category: 'all' }))}
              className={navLinkClass(route.view === 'shop')}
            >
              Shop
            </button>
            <button
              type="button"
              onClick={() =>
                handleNavClick(() => navigate({ view: 'home' }, 'shop-by-category'))
              }
              className={navLinkClass(false)}
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => navigate({ view: 'about' }))}
              className={navLinkClass(route.view === 'about')}
            >
              Our Story
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => navigate({ view: 'custom-orders' }))}
              className={navLinkClass(route.view === 'custom-orders')}
            >
              Custom Orders
            </button>
          </nav>

          {/* RIGHT: Clean Search, Wishlist, Cart & Mobile Menu Icons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Search crochet creations"
              aria-expanded={isSearchOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 ${
                isSearchOpen
                  ? 'bg-[#F4DDE5] text-[#9F4E70]'
                  : 'text-[#4A3531] hover:bg-[#F4DDE5]/60 hover:text-[#9F4E70]'
              }`}
            >
              <Search className="h-[19px] w-[19px]" />
            </button>

            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              aria-label={`Open wishlist (${wishlistCount} saved items)`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#4A3531] transition-colors duration-150 hover:bg-[#F4DDE5]/60 hover:text-[#9F4E70]"
            >
              <Heart className="h-[19px] w-[19px]" />
              {wishlistCount > 0 && (
                <span className="tabular-nums absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D78FAE] px-1 text-[10px] font-bold text-[#FFF9F2]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag (${cartCount} items)`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#4A3531] transition-colors duration-150 hover:bg-[#F4DDE5]/60 hover:text-[#9F4E70]"
            >
              <ShoppingBag className="h-[19px] w-[19px]" />
              {cartCount > 0 && (
                <span className="tabular-nums absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#B9688A] px-1 text-[10px] font-bold text-[#FFF9F2]">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4A3531] transition-colors hover:bg-[#F4DDE5]/60 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Expandable Boutique Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-dashed border-[#EED8E0] bg-[#FFF9F2] px-4 py-3 sm:px-6">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-[#D78FAE] bg-white px-4 py-1.5 shadow-xs"
            >
              <Search className="h-4 w-4 shrink-0 text-[#9F4E70]" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tulips, bunny plushies, tote bags, strawberry keychains..."
                autoFocus
                className="w-full bg-transparent py-1 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/70 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#B9688A] px-4 py-1.5 text-xs font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
              >
                Find
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Slide-Out Boutique Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#4A3531]/30 backdrop-blur-[2px] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <button
            type="button"
            aria-label="Close navigation menu overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex-1 cursor-default"
          />

          <aside className="flex h-full w-[min(320px,86vw)] flex-col justify-between border-l border-[#EED8E0] bg-[#FFF9F2] p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-dashed border-[#E5BECB] pb-4">
                <div>
                  <img
                    src={STORE_CONFIG.logoPath}
                    alt="Looplet Logo"
                    className="h-11 w-auto object-contain"
                  />
                  <p className="mt-1 font-hand text-lg text-[#9F4E70]">{STORE_CONFIG.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4DDE5]/70 text-[#4A3531] hover:bg-[#F4DDE5]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-5 flex flex-col gap-1" aria-label="Mobile links">
                {[
                  { label: 'Home', note: 'Start here', action: () => navigate({ view: 'home' }) },
                  {
                    label: 'Shop All',
                    note: '38 handmade pieces',
                    action: () => navigate({ view: 'shop', category: 'all' }),
                  },
                  {
                    label: 'Collections',
                    note: 'Browse by mood',
                    action: () => navigate({ view: 'home' }, 'shop-by-category'),
                  },
                  { label: 'Our Story', note: 'Made with heart', action: () => navigate({ view: 'about' }) },
                  {
                    label: 'Custom Orders',
                    note: 'Made just for you',
                    action: () => navigate({ view: 'custom-orders' }),
                  },
                  {
                    label: 'Saved Wishlist',
                    note: `${wishlistCount} saved`,
                    action: () => navigate({ view: 'wishlist' }),
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.action)}
                    className="flex min-h-[46px] items-center justify-between rounded-2xl px-3.5 py-2 text-left transition-colors hover:bg-[#F4DDE5]/55"
                  >
                    <span className="font-display text-base font-semibold text-[#4A3531]">
                      {item.label}
                    </span>
                    <span className="font-hand text-base text-[#9F4E70]">{item.note}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="rounded-2xl border border-dashed border-[#D78FAE]/70 bg-[#F8E9B5]/35 p-4">
              <div className="flex items-center gap-3">
                <YarnBallDoodle className="h-10 w-10 shrink-0" />
                <div>
                  <p className="font-hand text-lg leading-tight text-[#4A3531]">
                    Little loops, stitched slowly ♡
                  </p>
                  <a
                    href={STORE_CONFIG.social.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#9F4E70] hover:underline"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    <span>{STORE_CONFIG.social.instagramHandle}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
