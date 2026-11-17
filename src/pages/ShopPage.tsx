import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { CategorySlug, PriceRangeKey, SortOption } from '../types/shop';
import { BackButton } from '../components/BackButton';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  initialCategory?: CategorySlug | 'all';
  initialFilter?: 'new' | 'bestsellers';
  initialQuery?: string;
  initialPrice?: PriceRangeKey;
  initialSort?: SortOption;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  initialFilter,
  initialQuery = '',
  initialPrice = 'all',
  initialSort = 'popular',
}) => {
  const { navigate, updateShopRoute } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(initialCategory);
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'new' | 'bestsellers'>(
    initialFilter || 'all'
  );
  const [priceRange, setPriceRange] = useState<PriceRangeKey>(initialPrice);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setCollectionFilter(initialFilter || 'all');
  }, [initialFilter]);

  useEffect(() => {
    setSearchQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    setPriceRange(initialPrice || 'all');
  }, [initialPrice]);

  useEffect(() => {
    setSortBy(initialSort || 'popular');
  }, [initialSort]);

  const syncShopState = (
    overrides: Partial<{
      category: CategorySlug | 'all';
      filter: 'all' | 'new' | 'bestsellers';
      query: string;
      price: PriceRangeKey;
      sort: SortOption;
    }>
  ) => {
    const nextCategory = overrides.category ?? selectedCategory;
    const nextFilter = overrides.filter ?? collectionFilter;
    const nextQuery = overrides.query ?? searchQuery;
    const nextPrice = overrides.price ?? priceRange;
    const nextSort = overrides.sort ?? sortBy;

    updateShopRoute({
      view: 'shop',
      category: nextCategory,
      filter: nextFilter === 'all' ? undefined : nextFilter,
      query: nextQuery.trim() || undefined,
      price: nextPrice,
      sort: nextSort,
    });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (collectionFilter === 'new' && !product.isNewArrival) return false;
      if (collectionFilter === 'bestsellers' && !product.isBestseller) return false;

      if (priceRange === 'under-500' && product.price >= 500) return false;
      if (priceRange === '500-1000' && (product.price < 500 || product.price > 1000)) return false;
      if (priceRange === '1000-1500' && (product.price <= 1000 || product.price > 1500))
        return false;
      if (priceRange === 'over-1500' && product.price <= 1500) return false;

      if (q) {
        const haystack = `${product.name} ${product.categoryLabel} ${product.productType} ${product.shortDescription}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => b.createdAtOrder - a.createdAtOrder);
    } else {
      sorted.sort((a, b) => b.popularityScore - a.popularityScore);
    }

    return sorted;
  }, [selectedCategory, collectionFilter, priceRange, sortBy, searchQuery]);

  const activeCategoryInfo =
    selectedCategory === 'all'
      ? null
      : CATEGORIES.find((c) => c.slug === selectedCategory) || null;

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setCollectionFilter('all');
    setPriceRange('all');
    setSortBy('popular');
    setSearchQuery('');
    syncShopState({
      category: 'all',
      filter: 'all',
      query: '',
      price: 'all',
      sort: 'popular',
    });
  };

  return (
    <main className="bg-[#FFF9F2] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <BackButton
            fallbackRoute={
              selectedCategory !== 'all'
                ? { view: 'home', sectionId: 'shop-by-category' }
                : { view: 'home' }
            }
          />
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-[#EED8E0] bg-gradient-to-r from-[#F4DDE5]/45 via-[#FFF9F2] to-[#F8E9B5]/35 p-6 sm:p-10">
          <p className="font-hand text-2xl text-[#9F4E70]">Looplet Boutique Catalogue</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-[#4A3531] sm:text-4xl">
            {activeCategoryInfo ? activeCategoryInfo.name : 'All Handmade Creations'}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7D5E5A] sm:text-base">
            {activeCategoryInfo
              ? activeCategoryInfo.description
              : 'Explore all 38 handcrafted crochet flowers, plushies, totes, keychains, accessories, and keepsake gifts stitched with love.'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-8 space-y-5 rounded-3xl border border-[#EED8E0] bg-white/85 p-5 shadow-2xs sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9F4E70]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  syncShopState({ query: val });
                }}
                placeholder="Search by product name, flower, plushie, bag..."
                aria-label="Search crochet catalogue"
                className="w-full rounded-full border border-[#EED8E0] bg-[#FFF9F2] py-2.5 pl-11 pr-4 text-sm text-[#4A3531] placeholder:text-[#7D5E5A]/65 focus:border-[#B9688A] focus:outline-none"
              />
            </div>

            {/* Collection Filter */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#EED8E0] bg-[#FFF9F2] p-1 md:col-span-3">
              {[
                { key: 'all', label: 'All' },
                { key: 'new', label: 'New' },
                { key: 'bestsellers', label: 'Bestsellers' },
              ].map((tab) => {
                const active = collectionFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      const next = tab.key as 'all' | 'new' | 'bestsellers';
                      setCollectionFilter(next);
                      syncShopState({ filter: next });
                    }}
                    className={`flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#B9688A] text-[#FFF9F2]'
                        : 'text-[#7D5E5A] hover:text-[#4A3531]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Price Range */}
            <div className="md:col-span-2">
              <select
                value={priceRange}
                onChange={(e) => {
                  const next = e.target.value as PriceRangeKey;
                  setPriceRange(next);
                  syncShopState({ price: next });
                }}
                aria-label="Filter by price range"
                className="w-full rounded-full border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-xs font-medium text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
              >
                <option value="all">All Prices</option>
                <option value="under-500">Under ₹500</option>
                <option value="500-1000">₹500 – ₹1,000</option>
                <option value="1000-1500">₹1,001 – ₹1,500</option>
                <option value="over-1500">Over ₹1,500</option>
              </select>
            </div>

            {/* Sort */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  const next = e.target.value as SortOption;
                  setSortBy(next);
                  syncShopState({ sort: next });
                }}
                aria-label="Sort products"
                className="w-full rounded-full border border-[#EED8E0] bg-[#FFF9F2] px-4 py-2.5 text-xs font-medium text-[#4A3531] focus:border-[#B9688A] focus:outline-none"
              >
                <option value="popular">Sort: Popularity</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 border-t border-[#F4DDE5] pt-4">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7D5E5A]">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Category:</span>
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                syncShopState({ category: 'all' });
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#B9688A] text-[#FFF9F2]'
                  : 'border border-[#EED8E0] bg-[#FFF9F2] text-[#4A3531] hover:bg-[#F4DDE5]/50'
              }`}
            >
              All ({PRODUCTS.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = PRODUCTS.filter((p) => p.category === cat.slug).length;
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    syncShopState({ category: cat.slug });
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#B9688A] text-[#FFF9F2]'
                      : 'border border-[#EED8E0] bg-[#FFF9F2] text-[#4A3531] hover:bg-[#F4DDE5]/50'
                  }`}
                >
                  {cat.shortTitle} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#7D5E5A] sm:text-sm">
          <p className="tabular-nums">
            Showing <strong className="text-[#4A3531]">{filteredProducts.length}</strong> handmade{' '}
            {filteredProducts.length === 1 ? 'creation' : 'creations'}
          </p>

          {(selectedCategory !== 'all' ||
            collectionFilter !== 'all' ||
            priceRange !== 'all' ||
            searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 font-semibold text-[#9F4E70] hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid or Friendly Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-[#EED8E0] bg-white/85 px-6 py-16 text-center shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F4DDE5] text-[#9F4E70]">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-4 font-hand text-2xl text-[#9F4E70]">No matching stitches found</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-[#4A3531]">
              Nothing matched your current filters
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#7D5E5A]">
              Try searching a broader word like &ldquo;tulip&rdquo;, &ldquo;bunny&rdquo;, or
              &ldquo;bag&rdquo;, or reset filters to explore our full boutique shelf.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-2 rounded-full bg-[#B9688A] px-6 py-3 text-sm font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset All Filters</span>
              </button>
              <button
                type="button"
                onClick={() => navigate({ view: 'custom-orders' })}
                className="inline-flex items-center gap-2 rounded-full border border-[#D78FAE] bg-[#FFF9F2] px-6 py-3 text-sm font-semibold text-[#9F4E70] transition-colors hover:bg-[#F4DDE5]/40"
              >
                <span>Request a Custom Piece</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
