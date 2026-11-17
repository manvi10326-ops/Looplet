import React, { useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    navigate({ view: 'shop', category: 'all', query: q || undefined });
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (
    action: () => void
  ) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = (isActive: boolean) =>
    `relative whitespace-nowrap shrink-0 py-1 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-[#9F4E70] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#D78FAE]'
        : 'text-[#4A3531] hover:text-[#9F4E70]'
    }`;

  return (
    <div className="sticky top-0 z-40 w-full">
      {showAnnouncement && (
        <div className="relative flex h-8 items-center justify-center bg-[#B9688A] px-9 text-center text-xs font-medium tracking-wide text-[#FFF9F2] sm:h-9 sm:text-[13px]">
          <p className="truncate">{STORE_CONFIG.announcementText}</p>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Close announcement"
            className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[#FFF9F2]/85 transition-colors hover:bg-white/15 hover:text-[#FFF9F2]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header className="border-b border-[#EED8E0] bg-[#FFF9F2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
          {/* Left: Looplet Official Logo */}
          <button
            type="button"
            onClick={() => handleNavClick(() => navigate({ view: 'home' }))}
            aria-label="Looplet Home"
            className="flex shrink-0 items-center rounded-xl py-1 focus-visible:ring-2 focus-visible:ring-[#B9688A]"
          >
            <img
              src={STORE_CONFIG.logoPath}
              alt="Looplet — Little Loops, Lovely Creations"
              className="h-11 w-auto object-contain sm:h-12"
            />
          </button>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Primary navigation">
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
              Categories
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => navigate({ view: 'about' }))}
              className={navLinkClass(route.view === 'about')}
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => navigate({ view: 'custom-orders' }))}
              className={navLinkClass(route.view === 'custom-orders')}
            >
              Custom Orders
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(() => navigate({ view: 'home' }, 'site-footer'))}
              className={navLinkClass(false)}
            >
              Contact
            </button>
          </nav>

          {/* Right: Search, Wishlist, Cart, Mobile Hamburger */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Search products"
              aria-expanded={isSearchOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[#4A3531] transition-colors hover:border-[#EED8E0] hover:bg-[#F4DDE5]/50"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              aria-label={`Open wishlist (${wishlistCount} saved items)`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-[#4A3531] transition-colors hover:border-[#EED8E0] hover:bg-[#F4DDE5]/50"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="tabular-nums absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B9688A] px-1 text-[11px] font-semibold text-[#FFF9F2]">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag (${cartCount} items)`}
              className="relative flex h-10 items-center gap-2 rounded-full border border-[#EED8E0] bg-[#F4DDE5]/55 px-3 text-sm font-medium text-[#4A3531] transition-colors hover:bg-[#F4DDE5]"
            >
              <ShoppingBag className="h-4.5 w-4.5 text-[#9F4E70]" />
              <span className="hidden sm:inline">Bag</span>
              <span className="tabular-nums flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B9688A] px-1.5 text-[11px] font-semibold text-[#FFF9F2]">
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#4A3531] transition-colors hover:bg-[#F4DDE5]/50 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-[#EED8E0] bg-[#FFF9F2] px-4 py-3 sm:px-6">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-2xl items-center gap-2 rounded-full border border-[#D78FAE] bg-white px-4 py-2 shadow-sm"
            >
              <Search className="h-4 w-4 shrink-0 text-[#9F4E70]" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search crochet tulips, bunny plushies, tote bags, keychains..."
                autoFocus
                className="w-full bg-transparent text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/70 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#B9688A] px-4 py-1.5 text-xs font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-[#EED8E0] bg-[#FFF9F2] px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {[
                { label: 'Home', action: () => navigate({ view: 'home' }) },
                { label: 'Shop Collection', action: () => navigate({ view: 'shop', category: 'all' }) },
                { label: 'Shop by Category', action: () => navigate({ view: 'home' }, 'shop-by-category') },
                { label: 'About Us', action: () => navigate({ view: 'about' }) },
                { label: 'Custom Orders', action: () => navigate({ view: 'custom-orders' }) },
                { label: 'Saved Wishlist', action: () => navigate({ view: 'wishlist' }) },
                { label: 'Contact', action: () => navigate({ view: 'home' }, 'site-footer') },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.action)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 text-left text-sm font-medium text-[#4A3531] transition-colors hover:bg-[#F4DDE5]/50 hover:text-[#9F4E70]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>
    </div>
  );
};
