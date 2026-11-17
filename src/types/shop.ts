export type CategorySlug =
  | 'crochet-flowers-bouquets'
  | 'crochet-plushies-dolls'
  | 'crochet-bags-purses'
  | 'crochet-keychains'
  | 'crochet-accessories'
  | 'crochet-home-decor'
  | 'crochet-jewellery'
  | 'crochet-gifts-hampers'
  | 'baby-crochet-collection'
  | 'custom-crochet-creations';

export type ProductBadge = 'Bestseller' | 'New' | 'Handmade' | 'Limited Stock' | 'Cute Pick';

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  categoryLabel: string;
  productType: string;
  price: number;
  shortDescription: string;
  description: string;
  details: string[];
  image: string;
  gallery?: string[];
  badge?: ProductBadge;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  inStock: boolean;
  availabilityLabel: string;
  colors?: ProductColorOption[];
  popularityScore: number;
  createdAtOrder: number;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  shortTitle: string;
  description: string;
  image: string;
  accentBg: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
}

export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc';

export type PriceRangeKey = 'all' | 'under-500' | '500-1000' | '1000-1500' | 'over-1500';

export type PageRoute =
  | { view: 'home'; sectionId?: string }
  | {
      view: 'shop';
      category?: CategorySlug | 'all';
      filter?: 'new' | 'bestsellers';
      query?: string;
      price?: PriceRangeKey;
      sort?: SortOption;
    }
  | { view: 'product'; slug: string }
  | { view: 'wishlist' }
  | { view: 'checkout' }
  | { view: 'custom-orders' }
  | { view: 'about' }
  | { view: 'policy'; policyType: 'privacy' | 'terms' | 'refund' }
  | { view: 'not-found' };

export interface ToastMessage {
  id: string;
  message: string;
  tone: 'rose' | 'sage' | 'butter';
}
