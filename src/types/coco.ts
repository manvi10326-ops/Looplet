export interface CocoClientCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

export interface CocoClientContext {
  cartItems: CocoClientCartItem[];
  cartSubtotal: number;
  wishlistProductIds: string[];
  currentRouteLabel: string;
}

export interface CocoHistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface CocoBudgetCombo {
  title: string;
  productIds: string[];
  totalPrice: number;
  freeShippingEligible: boolean;
  note?: string;
}

export interface CocoComparison {
  productIds: string[];
  highlightNote: string;
}

export interface CocoPendingAction {
  type: 'add_to_cart' | 'add_to_wishlist' | 'remove_from_wishlist';
  productId: string;
  selectedColor?: string;
  quantity?: number;
  promptText: string;
}

export interface CocoCustomOrderDraft {
  productType?: string;
  preferredColor?: string;
  size?: string;
  quantity?: number;
  personalization?: string;
  deliveryDate?: string;
  isReadyForWhatsApp?: boolean;
}

export interface CocoNavigationTarget {
  action: 'shop' | 'checkout' | 'wishlist' | 'custom_orders' | 'track_whatsapp' | 'product';
  label: string;
  slug?: string;
  category?: string;
}

export interface CocoStructuredResponse {
  reply: string;
  recommendedProductIds: string[];
  budgetCombo?: CocoBudgetCombo;
  comparison?: CocoComparison;
  pendingAction?: CocoPendingAction;
  customOrderDraft?: CocoCustomOrderDraft;
  navigationTarget?: CocoNavigationTarget;
  followUpSuggestions: string[];
}

export interface CocoChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  data?: CocoStructuredResponse;
  actionResolved?: 'confirmed' | 'cancelled';
  isError?: boolean;
  retryPrompt?: string;
}
