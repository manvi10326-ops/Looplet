import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CartItem, CategorySlug, PageRoute, PriceRangeKey, Product, SortOption, ToastMessage } from '../types/shop';

interface HistoryMetaState {
  loopletIdx: number;
  entryId: string;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  route: PageRoute;
  hasInternalHistory: boolean;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastMessage[];
  cartCount: number;
  wishlistCount: number;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, selectedColor: string | undefined, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  navigate: (nextRoute: PageRoute, scrollToId?: string) => void;
  updateShopRoute: (nextShopRoute: Extract<PageRoute, { view: 'shop' }>) => void;
  goBack: (fallbackRoute?: PageRoute) => void;
  navigateToCategory: (category: CategorySlug) => void;
  showToast: (message: string, tone?: ToastMessage['tone']) => void;
  dismissToast: (id: string) => void;
}

const CART_STORAGE_KEY = 'looplet_cart_v1';
const WISHLIST_STORAGE_KEY = 'looplet_wishlist_v1';

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function createEntryId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const VALID_PRICE_RANGES: PriceRangeKey[] = ['all', 'under-500', '500-1000', '1000-1500', 'over-1500'];
const VALID_SORT_OPTIONS: SortOption[] = ['popular', 'newest', 'price-asc', 'price-desc'];

function parseHashToRoute(): PageRoute {
  if (typeof window === 'undefined') return { view: 'home' };
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || hash === '/' || hash === 'home') return { view: 'home' };

  const [pathPart, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString || '');

  if (pathPart === '/' || pathPart === '' || pathPart === 'home') {
    const section = params.get('section') || undefined;
    return { view: 'home', sectionId: section };
  }

  if (pathPart === '/shop' || pathPart === 'shop') {
    const categoryParam = params.get('category') as CategorySlug | 'all' | null;
    const filterParam = params.get('filter') as 'new' | 'bestsellers' | null;
    const qParam = params.get('q') || undefined;
    const priceParam = params.get('price') as PriceRangeKey | null;
    const sortParam = params.get('sort') as SortOption | null;

    return {
      view: 'shop',
      category: categoryParam || 'all',
      filter: filterParam === 'new' || filterParam === 'bestsellers' ? filterParam : undefined,
      query: qParam,
      price: priceParam && VALID_PRICE_RANGES.includes(priceParam) ? priceParam : 'all',
      sort: sortParam && VALID_SORT_OPTIONS.includes(sortParam) ? sortParam : 'popular',
    };
  }
  if (pathPart.startsWith('/product/')) {
    const slug = pathPart.replace('/product/', '').trim();
    return slug ? { view: 'product', slug } : { view: 'not-found' };
  }
  if (pathPart === '/wishlist') return { view: 'wishlist' };
  if (pathPart === '/checkout') return { view: 'checkout' };
  if (pathPart === '/custom-orders') return { view: 'custom-orders' };
  if (pathPart === '/about') return { view: 'about' };
  if (pathPart === '/privacy-policy') return { view: 'policy', policyType: 'privacy' };
  if (pathPart === '/terms') return { view: 'policy', policyType: 'terms' };
  if (pathPart === '/refund-policy') return { view: 'policy', policyType: 'refund' };

  return { view: 'not-found' };
}

function routeToHash(route: PageRoute): string {
  switch (route.view) {
    case 'home':
      return route.sectionId ? `#/?section=${encodeURIComponent(route.sectionId)}` : '#/';
    case 'shop': {
      const params = new URLSearchParams();
      if (route.category && route.category !== 'all') params.set('category', route.category);
      if (route.filter) params.set('filter', route.filter);
      if (route.query) params.set('q', route.query);
      if (route.price && route.price !== 'all') params.set('price', route.price);
      if (route.sort && route.sort !== 'popular') params.set('sort', route.sort);
      const qs = params.toString();
      return qs ? `#/shop?${qs}` : '#/shop';
    }
    case 'product':
      return `#/product/${route.slug}`;
    case 'wishlist':
      return '#/wishlist';
    case 'checkout':
      return '#/checkout';
    case 'custom-orders':
      return '#/custom-orders';
    case 'about':
      return '#/about';
    case 'policy':
      if (route.policyType === 'privacy') return '#/privacy-policy';
      if (route.policyType === 'terms') return '#/terms';
      return '#/refund-policy';
    case 'not-found':
      return '#/404';
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(CART_STORAGE_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage<string[]>(WISHLIST_STORAGE_KEY, []));
  const [route, setRoute] = useState<PageRoute>(() => parseHashToRoute());
  const [hasInternalHistory, setHasInternalHistory] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const currentIdxRef = useRef<number>(0);
  const currentEntryIdRef = useRef<string>(createEntryId());
  const scrollPositionsRef = useRef<Record<string, number>>({});

  // Initialize history metadata & scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const existingState = window.history.state as Partial<HistoryMetaState> | null;
    if (existingState && typeof existingState.loopletIdx === 'number' && existingState.entryId) {
      currentIdxRef.current = existingState.loopletIdx;
      currentEntryIdRef.current = existingState.entryId;
      setHasInternalHistory(existingState.loopletIdx > 0);
    } else {
      const initialMeta: HistoryMetaState = {
        loopletIdx: 0,
        entryId: currentEntryIdRef.current,
      };
      const initialHash = window.location.hash || '#/';
      window.history.replaceState(initialMeta, '', initialHash);
      currentIdxRef.current = 0;
      setHasInternalHistory(false);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlist]);

  const scrollToTargetOrSaved = useCallback((nextRoute: PageRoute, savedScroll?: number, scrollToId?: string) => {
    if (scrollToId) {
      window.setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return;
    }

    if (typeof savedScroll === 'number') {
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          window.scrollTo({ top: savedScroll, behavior: 'auto' });
        }, 20);
      });
      return;
    }

    if (nextRoute.view === 'home' && nextRoute.sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(nextRoute.sectionId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser Back/Forward (popstate) and manual hash edits
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      // Save scroll of the page we just came from only if needed; note popstate fires after URL changed
      const state = event.state as Partial<HistoryMetaState> | null;
      const nextRoute = parseHashToRoute();

      if (state && typeof state.loopletIdx === 'number' && state.entryId) {
        currentIdxRef.current = state.loopletIdx;
        currentEntryIdRef.current = state.entryId;
        setHasInternalHistory(state.loopletIdx > 0);
        const savedScroll = scrollPositionsRef.current[state.entryId];
        setRoute(nextRoute);
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setQuickViewProduct(null);
        scrollToTargetOrSaved(nextRoute, savedScroll);
      } else {
        // External hash edit or initial state without looplet metadata
        const newEntryId = createEntryId();
        currentIdxRef.current = 0;
        currentEntryIdRef.current = newEntryId;
        setHasInternalHistory(false);
        setRoute(nextRoute);
        setIsCartOpen(false);
        setIsWishlistOpen(false);
        setQuickViewProduct(null);
        scrollToTargetOrSaved(nextRoute);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [scrollToTargetOrSaved]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, tone: ToastMessage['tone'] = 'rose') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedColor?: string) => {
      const colorChoice = selectedColor || product.colors?.[0]?.name;
      setCart((prev) => {
        const idx = prev.findIndex(
          (item) => item.productId === product.id && item.selectedColor === colorChoice
        );
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: Math.min(20, updated[idx].quantity + quantity),
          };
          return updated;
        }
        return [...prev, { productId: product.id, quantity, selectedColor: colorChoice }];
      });
      showToast(`Added "${product.name}" to your crochet bag`, 'rose');
    },
    [showToast]
  );

  const removeFromCart = useCallback((productId: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedColor === selectedColor))
    );
  }, []);

  const updateCartQuantity = useCallback(
    (productId: string, selectedColor: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, selectedColor);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.selectedColor === selectedColor
            ? { ...item, quantity: Math.min(20, quantity) }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          showToast(`Removed "${product.name}" from wishlist`, 'butter');
          return prev.filter((id) => id !== product.id);
        }
        showToast(`Saved "${product.name}" to your wishlist ♡`, 'sage');
        return [...prev, product.id];
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const navigate = useCallback(
    (nextRoute: PageRoute, scrollToId?: string) => {
      // Save current page scroll position before pushing a new entry
      scrollPositionsRef.current[currentEntryIdRef.current] = window.scrollY;

      const normalizedRoute: PageRoute =
        nextRoute.view === 'home' && scrollToId
          ? { ...nextRoute, sectionId: scrollToId }
          : nextRoute;

      const nextHash = routeToHash(normalizedRoute);

      if (window.location.hash !== nextHash) {
        const nextIdx = currentIdxRef.current + 1;
        const nextEntryId = createEntryId();
        const meta: HistoryMetaState = { loopletIdx: nextIdx, entryId: nextEntryId };
        window.history.pushState(meta, '', nextHash);
        currentIdxRef.current = nextIdx;
        currentEntryIdRef.current = nextEntryId;
        setHasInternalHistory(true);
      }

      setRoute(normalizedRoute);
      setIsCartOpen(false);
      setIsWishlistOpen(false);
      setQuickViewProduct(null);

      scrollToTargetOrSaved(normalizedRoute, undefined, scrollToId);
    },
    [scrollToTargetOrSaved]
  );

  // Sync in-page shop filters/search/sort to the current history entry without polluting history stack
  const updateShopRoute = useCallback((nextShopRoute: Extract<PageRoute, { view: 'shop' }>) => {
    const nextHash = routeToHash(nextShopRoute);
    if (window.location.hash !== nextHash) {
      const meta: HistoryMetaState = {
        loopletIdx: currentIdxRef.current,
        entryId: currentEntryIdRef.current,
      };
      window.history.replaceState(meta, '', nextHash);
    }
    setRoute(nextShopRoute);
  }, []);

  // Smart Back: uses browser history.back() when internal history exists; otherwise safely redirects to parent page via replaceState (preventing loops)
  const goBack = useCallback(
    (fallbackRoute: PageRoute = { view: 'home' }) => {
      setIsCartOpen(false);
      setIsWishlistOpen(false);
      setQuickViewProduct(null);

      if (currentIdxRef.current > 0) {
        window.history.back();
        return;
      }

      const nextHash = routeToHash(fallbackRoute);
      const nextEntryId = createEntryId();
      const meta: HistoryMetaState = { loopletIdx: 0, entryId: nextEntryId };
      window.history.replaceState(meta, '', nextHash);
      currentIdxRef.current = 0;
      currentEntryIdRef.current = nextEntryId;
      setHasInternalHistory(false);
      setRoute(fallbackRoute);
      scrollToTargetOrSaved(fallbackRoute);
    },
    [scrollToTargetOrSaved]
  );

  const navigateToCategory = useCallback(
    (category: CategorySlug) => {
      navigate({ view: 'shop', category });
    },
    [navigate]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const wishlistCount = wishlist.length;

  const value: StoreContextValue = {
    cart,
    wishlist,
    route,
    hasInternalHistory,
    isCartOpen,
    isWishlistOpen,
    quickViewProduct,
    toasts,
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setQuickViewProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    updateShopRoute,
    goBack,
    navigateToCategory,
    showToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return ctx;
}
