import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ExternalLink,
  Heart,
  MessageCircle,
  Minus,
  RotateCcw,
  Send,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { PRODUCTS, getProductById } from '../data/catalog';
import { buildWhatsAppUrl, formatINR, STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/shop';
import {
  CocoChatMessage,
  CocoCustomOrderDraft,
  CocoNavigationTarget,
  CocoPendingAction,
  CocoStructuredResponse,
} from '../types/coco';
import { CocoAvatar } from './CocoAvatar';
import { SmartImage } from './SmartImage';

interface CocoAssistantProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onRestore: () => void;
}

const STORAGE_KEY = 'looplet_coco_chat_v1';

const WELCOME_MESSAGE =
  "Hey there, cutie! 🌸 Welcome to our little crochet world! I'm Coco, your crochet shopping buddy. Looking for something adorable, a handmade gift or a little something for yourself? Let's find something special!";

const QUICK_ACTIONS = [
  {
    label: 'Explore Crochet Products',
    prompt: 'Show me your crochet categories and popular handmade products.',
  },
  {
    label: 'Find Something Cute',
    prompt: 'Show me your cutest aesthetic pink and pastel crochet picks!',
  },
  {
    label: 'Help Me Choose a Gift',
    prompt: 'Help me choose a thoughtful handmade crochet gift.',
  },
  {
    label: 'Find Products Under My Budget',
    prompt: 'What cute crochet products or gift combos can I get under a budget like ₹500 or ₹1,000?',
  },
  {
    label: 'Explore New Arrivals',
    prompt: 'What are your newest crochet arrivals?',
  },
  {
    label: 'Customize My Crochet Order',
    prompt: 'I want to customize a handmade crochet order with my own colours and details.',
  },
  {
    label: 'Product Details & Care',
    prompt: 'Tell me about crochet product materials, dispatch times, and care instructions.',
  },
  {
    label: 'Track My Order',
    prompt: 'How can I check or track my Looplet crochet order status?',
  },
];

function createWelcomeState(): CocoChatMessage[] {
  return [
    {
      id: 'coco-welcome',
      role: 'assistant',
      text: WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];
}

function renderInlineText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
              <strong key={idx} className="font-semibold text-[#4A3531]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <React.Fragment key={idx}>{part}</React.Fragment>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

function buildCustomOrderWhatsAppUrl(draft: CocoCustomOrderDraft): string {
  const lines = [
    '♡ *Custom Crochet Enquiry via Coco — Looplet* ♡',
    '',
    draft.productType ? `*Product Type:* ${draft.productType}` : null,
    draft.preferredColor ? `*Preferred Yarn Colours:* ${draft.preferredColor}` : null,
    draft.size ? `*Preferred Size:* ${draft.size}` : null,
    draft.quantity ? `*Quantity:* ${draft.quantity}` : null,
    draft.personalization ? `*Personalisation / Notes:* ${draft.personalization}` : null,
    draft.deliveryDate ? `*Desired Delivery Date:* ${draft.deliveryDate}` : null,
    '',
    'Please let me know pricing and crafting availability. Thank you!',
  ].filter(Boolean);
  return buildWhatsAppUrl(lines.join('\n'));
}

interface ProductMiniCardProps {
  product: Product;
  isInWishlist: boolean;
  onViewDetails: (product: Product) => void;
  onConfirmAddToCart: (product: Product) => void;
  onConfirmToggleWishlist: (product: Product) => void;
}

const ProductMiniCard: React.FC<ProductMiniCardProps> = ({
  product,
  isInWishlist,
  onViewDetails,
  onConfirmAddToCart,
  onConfirmToggleWishlist,
}) => {
  const [confirmMode, setConfirmMode] = useState<'none' | 'cart' | 'wishlist'>('none');

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EED8E0] bg-white shadow-2xs transition-colors hover:border-[#D78FAE]">
      <div className="flex gap-3 p-2.5">
        <button
          type="button"
          onClick={() => onViewDetails(product)}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F4DDE5]/40 text-left"
          aria-label={`View ${product.name}`}
        >
          <SmartImage
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="text-left font-display text-[13px] font-semibold leading-snug text-[#4A3531] hover:text-[#9F4E70]"
            >
              {product.name}
            </button>
            <button
              type="button"
              onClick={() => setConfirmMode((prev) => (prev === 'wishlist' ? 'none' : 'wishlist'))}
              aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#9F4E70] hover:bg-[#F4DDE5]/60"
            >
              <Heart className={`h-3.5 w-3.5 ${isInWishlist ? 'fill-[#B9688A] text-[#B9688A]' : ''}`} />
            </button>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span className="tabular-nums text-xs font-semibold text-[#9F4E70]">
              {formatINR(product.price)}
            </span>
            <span className="rounded-full bg-[#F8E9B5]/65 px-2 py-0.5 text-[10px] font-medium text-[#5B4527]">
              {product.availabilityLabel}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#7D5E5A]">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {confirmMode === 'none' ? (
        <div className="flex items-center gap-2 border-t border-[#F4DDE5]/80 bg-[#FFF9F2]/75 px-2.5 py-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="flex-1 rounded-full border border-[#E5BECB] bg-white px-3 py-1.5 text-[11px] font-medium text-[#4A3531] transition-colors hover:bg-[#F4DDE5]/50"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => setConfirmMode('cart')}
            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-[#B9688A] px-3 py-1.5 text-[11px] font-semibold text-[#FFF9F2] transition-colors hover:bg-[#A45677]"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>Add to Cart</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 border-t border-[#E5BECB] bg-[#F4DDE5]/45 px-2.5 py-2 text-[11px]">
          <span className="font-medium text-[#4A3531]">
            {confirmMode === 'cart'
              ? `Add to bag (${formatINR(product.price)})?`
              : isInWishlist
                ? 'Remove from wishlist?'
                : 'Save to wishlist?'}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (confirmMode === 'cart') {
                  onConfirmAddToCart(product);
                } else {
                  onConfirmToggleWishlist(product);
                }
                setConfirmMode('none');
              }}
              className="rounded-full bg-[#B9688A] px-2.5 py-1 font-semibold text-[#FFF9F2] hover:bg-[#A45677]"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmMode('none')}
              className="rounded-full border border-[#E5BECB] bg-white px-2.5 py-1 font-medium text-[#7D5E5A] hover:bg-[#FFF9F2]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const CocoAssistant: React.FC<CocoAssistantProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onRestore,
}) => {
  const {
    cart,
    wishlist,
    route,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    setIsCartOpen,
    setIsWishlistOpen,
  } = useStore();

  const [messages, setMessages] = useState<CocoChatMessage[]>(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CocoChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return createWelcomeState();
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comboConfirmMsgId, setComboConfirmMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-24)));
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  const clientContext = useMemo(() => {
    const productLookup = new Map(PRODUCTS.map((p) => [p.id, p]));
    const cartItems = cart.map((item) => {
      const p = productLookup.get(item.productId);
      return {
        productId: item.productId,
        name: p?.name || item.productId,
        price: p?.price || 0,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
      };
    });
    const cartSubtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const routeLabel =
      route.view === 'home'
        ? 'Home Page'
        : route.view === 'shop'
          ? `Shop (${route.category || 'all'})`
          : route.view === 'product'
            ? `Product (${route.slug})`
            : route.view;

    return {
      cartItems,
      cartSubtotal,
      wishlistProductIds: wishlist,
      currentRouteLabel: routeLabel,
    };
  }, [cart, wishlist, route]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: CocoChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages.filter((m) => !m.isError), userMsg];
    setMessages([...messages, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/coco/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, text: m.text })),
          clientContext,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof payload?.error === 'string'
            ? payload.error
            : 'Coco had a tiny hiccup connecting to the studio.'
        );
      }

      const data = payload as CocoStructuredResponse;
      const assistantMsg: CocoChatMessage = {
        id: `coco-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errText =
        err instanceof Error
          ? err.message
          : 'Coco tangled a little yarn loop! Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: errText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          retryPrompt: trimmed,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(createWelcomeState());
    setComboConfirmMsgId(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleViewProduct = (product: Product) => {
    navigate({ view: 'product', slug: product.slug });
    if (window.innerWidth < 640) {
      onMinimize();
    }
  };

  const handleConfirmPendingAction = (messageId: string, action: CocoPendingAction) => {
    const product = getProductById(action.productId);
    if (!product) return;

    if (action.type === 'add_to_cart') {
      addToCart(product, action.quantity || 1, action.selectedColor);
    } else if (action.type === 'add_to_wishlist') {
      if (!isInWishlist(product.id)) {
        toggleWishlist(product);
      }
    } else if (action.type === 'remove_from_wishlist') {
      if (isInWishlist(product.id)) {
        toggleWishlist(product);
      }
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, actionResolved: 'confirmed' } : m))
    );
  };

  const handleCancelPendingAction = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, actionResolved: 'cancelled' } : m))
    );
  };

  const handleConfirmComboAdd = (productIds: string[]) => {
    productIds.forEach((id) => {
      const product = getProductById(id);
      if (product) addToCart(product, 1);
    });
    setComboConfirmMsgId(null);
  };

  const handleNavigateTarget = (target: CocoNavigationTarget) => {
    if (target.action === 'checkout') {
      navigate({ view: 'checkout' });
    } else if (target.action === 'wishlist') {
      setIsWishlistOpen(true);
    } else if (target.action === 'custom_orders') {
      navigate({ view: 'custom-orders' });
    } else if (target.action === 'product' && target.slug) {
      navigate({ view: 'product', slug: target.slug });
    } else if (target.action === 'shop') {
      navigate({
        view: 'shop',
        category: (target.category as Product['category'] | 'all') || 'all',
      });
    }
    if (window.innerWidth < 640) {
      onMinimize();
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[#E5BECB] bg-[#FFF9F2] py-1.5 pl-2 pr-2 shadow-xl">
        <button
          type="button"
          onClick={onRestore}
          className="flex items-center gap-2 rounded-full px-1.5 py-0.5 text-left transition-colors hover:bg-[#F4DDE5]/50"
          aria-label="Restore Coco chat window"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#F4DDE5]">
            <CocoAvatar className="h-7 w-7" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#FFF9F2] bg-[#5E9C66]" />
          </div>
          <div className="pr-1">
            <p className="text-xs font-semibold text-[#4A3531]">Coco 🧶</p>
            <p className="text-[10px] text-[#7D5E5A]">Tap to resume chat</p>
          </div>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Coco chat"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#7D5E5A] hover:bg-[#F4DDE5] hover:text-[#4A3531]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const showWelcomeQuickActions = messages.length === 1;

  return (
    <section
      role="dialog"
      aria-label="Coco – Your Crochet Buddy"
      className="fixed bottom-3 right-3 z-50 flex h-[min(640px,calc(100vh-1.5rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-[#E5BECB] bg-[#FFF9F2] shadow-2xl sm:bottom-5 sm:right-5 sm:w-[410px]"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-[#EED8E0] bg-gradient-to-r from-[#F4DDE5] via-[#FBF0F4] to-[#F8E9B5]/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D78FAE]/50 bg-[#FFF9F2] shadow-2xs">
            <CocoAvatar className="h-8 w-8" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#FFF9F2] bg-[#52995A]"
              title="Online"
            />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold leading-tight text-[#4A3531]">
              Coco – Your Crochet Buddy 🧶
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[#527456]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#52995A]" />
              <span>Online · Looplet Studio Helper</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            title="Clear conversation"
            aria-label="Clear conversation"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#7D5E5A] transition-colors hover:bg-white/75 hover:text-[#4A3531]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onMinimize}
            title="Minimize chat"
            aria-label="Minimize chat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#7D5E5A] transition-colors hover:bg-white/75 hover:text-[#4A3531]"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close chat"
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#7D5E5A] transition-colors hover:bg-white/75 hover:text-[#4A3531]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Conversation Area */}
      <div className="flex-1 space-y-4 overflow-y-auto px-3.5 py-4">
        {messages.map((msg, msgIndex) => {
          const isUser = msg.role === 'user';
          const isLatestAssistant =
            !isUser && msgIndex === messages.length - 1 && !msg.isError;
          const recommendedProducts = (msg.data?.recommendedProductIds || [])
            .map((id) => getProductById(id))
            .filter((p): p is Product => Boolean(p));

          const comparisonProducts = (msg.data?.comparison?.productIds || [])
            .map((id) => getProductById(id))
            .filter((p): p is Product => Boolean(p));

          const pendingProduct = msg.data?.pendingAction
            ? getProductById(msg.data.pendingAction.productId)
            : undefined;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`flex max-w-[92%] items-end gap-2 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#EED8E0] bg-white">
                    <CocoAvatar className="h-6 w-6" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-2xs ${
                    isUser
                      ? 'rounded-br-sm bg-[#B9688A] text-[#FFF9F2]'
                      : msg.isError
                        ? 'rounded-bl-sm border border-[#D78FAE] bg-[#F4DDE5]/70 text-[#6D2944]'
                        : 'rounded-bl-sm border border-[#EED8E0] bg-white text-[#4A3531]'
                  }`}
                >
                  <div>{renderInlineText(msg.text)}</div>

                  {msg.isError && msg.retryPrompt && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => sendMessage(msg.retryPrompt!)}
                        className="rounded-full bg-[#B9688A] px-3 py-1 text-[11px] font-semibold text-[#FFF9F2] hover:bg-[#A45677]"
                      >
                        Retry
                      </button>
                      <a
                        href={buildWhatsAppUrl(STORE_CONFIG.whatsappGreeting)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[#B9C9A8] bg-[#D6E2C8] px-3 py-1 text-[11px] font-semibold text-[#354328]"
                      >
                        <span>WhatsApp Studio</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <span className="mt-1 px-9 text-[10px] text-[#7D5E5A]/80">{msg.timestamp}</span>

              {/* 8 Quick-Action Buttons right under welcome message */}
              {msg.id === 'coco-welcome' && showWelcomeQuickActions && (
                <div className="mt-2.5 w-full pl-9">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#9F4E70]">
                    Quick Ways Coco Can Help
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ACTIONS.map((qa) => (
                      <button
                        key={qa.label}
                        type="button"
                        disabled={isLoading}
                        onClick={() => sendMessage(qa.prompt)}
                        className="rounded-2xl border border-[#E5BECB] bg-white px-3 py-1.5 text-left text-[11.5px] font-medium text-[#4A3531] shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#B9688A] hover:bg-[#F4DDE5]/55 disabled:opacity-50"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget Combo Summary Card */}
              {msg.data?.budgetCombo && (
                <div className="mt-2 ml-9 w-[calc(100%-2.25rem)] rounded-2xl border border-[#E5BECB] bg-[#F8E9B5]/35 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#7A5928]">
                        <Sparkles className="h-3 w-3" />
                        <span>Budget Combo Total</span>
                      </span>
                      <h4 className="font-display text-sm font-semibold text-[#4A3531]">
                        {msg.data.budgetCombo.title}
                      </h4>
                    </div>
                    <span className="tabular-nums rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#9F4E70] shadow-2xs">
                      {formatINR(msg.data.budgetCombo.totalPrice)}
                    </span>
                  </div>

                  <ul className="mt-2 space-y-1 text-[11.5px] text-[#4A3531]">
                    {msg.data.budgetCombo.productIds.map((pid) => {
                      const prod = getProductById(pid);
                      if (!prod) return null;
                      return (
                        <li key={pid} className="flex items-center justify-between gap-2">
                          <span className="truncate">• {prod.name}</span>
                          <span className="tabular-nums shrink-0 font-medium text-[#7D5E5A]">
                            {formatINR(prod.price)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-2 text-[11px] font-medium text-[#354328]">
                    {msg.data.budgetCombo.freeShippingEligible
                      ? '♡ Qualifies for Free Pan-India Shipping!'
                      : `Add ${formatINR(
                          STORE_CONFIG.shipping.freeShippingThreshold -
                            msg.data.budgetCombo.totalPrice
                        )} more for free shipping (₹99 standard shipping).`}
                  </p>

                  {comboConfirmMsgId === msg.id ? (
                    <div className="mt-2.5 flex items-center justify-between gap-2 rounded-xl bg-white/90 px-2.5 py-2 text-[11px]">
                      <span className="font-medium text-[#4A3531]">
                        Add all {msg.data.budgetCombo.productIds.length} items to bag?
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleConfirmComboAdd(msg.data!.budgetCombo!.productIds)}
                          className="rounded-full bg-[#B9688A] px-2.5 py-1 font-semibold text-[#FFF9F2]"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setComboConfirmMsgId(null)}
                          className="rounded-full border border-[#E5BECB] px-2.5 py-1 text-[#7D5E5A]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setComboConfirmMsgId(msg.id)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#B9688A] px-3 py-1.5 text-[11.5px] font-semibold text-[#FFF9F2] hover:bg-[#A45677]"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add Full Combo to Bag</span>
                    </button>
                  )}
                </div>
              )}

              {/* Side-by-Side Comparison Card */}
              {comparisonProducts.length >= 2 && msg.data?.comparison && (
                <div className="mt-2 ml-9 w-[calc(100%-2.25rem)] overflow-hidden rounded-2xl border border-[#EED8E0] bg-white">
                  <div className="border-b border-[#F4DDE5] bg-[#F4DDE5]/40 px-3 py-2">
                    <p className="text-[11px] font-semibold text-[#4A3531]">
                      Side-by-Side Comparison
                    </p>
                    <p className="text-[11px] text-[#7D5E5A]">
                      {msg.data.comparison.highlightNote}
                    </p>
                  </div>
                  <div
                    className={`grid divide-x divide-[#F4DDE5] ${
                      comparisonProducts.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
                    }`}
                  >
                    {comparisonProducts.map((cp) => (
                      <div key={cp.id} className="flex flex-col p-2.5 text-[11px]">
                        <div className="h-20 w-full overflow-hidden rounded-xl bg-[#FFF9F2]">
                          <SmartImage
                            src={cp.image}
                            alt={cp.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="mt-1.5 font-display text-xs font-semibold text-[#4A3531]">
                          {cp.name}
                        </p>
                        <p className="tabular-nums mt-0.5 font-bold text-[#9F4E70]">
                          {formatINR(cp.price)}
                        </p>
                        <p className="mt-1 text-[10px] text-[#7D5E5A]">
                          <strong className="text-[#4A3531]">Type:</strong> {cp.productType}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#7D5E5A]">
                          <strong className="text-[#4A3531]">Status:</strong> {cp.availabilityLabel}
                        </p>
                        {cp.details[0] && (
                          <p className="mt-1 line-clamp-3 text-[10px] text-[#7D5E5A]">
                            {cp.details[0]}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleViewProduct(cp)}
                          className="mt-auto pt-2 text-left text-[11px] font-semibold text-[#9F4E70] underline"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Product Cards */}
              {recommendedProducts.length > 0 && (
                <div className="mt-2 ml-9 w-[calc(100%-2.25rem)] space-y-2">
                  {recommendedProducts.map((product) => (
                    <ProductMiniCard
                      key={product.id}
                      product={product}
                      isInWishlist={isInWishlist(product.id)}
                      onViewDetails={handleViewProduct}
                      onConfirmAddToCart={(p) => addToCart(p, 1)}
                      onConfirmToggleWishlist={(p) => toggleWishlist(p)}
                    />
                  ))}
                </div>
              )}

              {/* Explicit Cart / Wishlist Confirmation Card */}
              {msg.data?.pendingAction && pendingProduct && (
                <div className="mt-2 ml-9 w-[calc(100%-2.25rem)] rounded-2xl border border-[#D78FAE] bg-[#F4DDE5]/45 p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
                      <SmartImage
                        src={pendingProduct.image}
                        alt={pendingProduct.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#4A3531]">
                        {msg.data.pendingAction.promptText}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#7D5E5A]">
                        {pendingProduct.name} ·{' '}
                        {msg.data.pendingAction.selectedColor || 'Default shade'} ·{' '}
                        {formatINR(pendingProduct.price)}
                      </p>
                    </div>
                  </div>

                  {msg.actionResolved === 'confirmed' ? (
                    <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#354328]">
                      <Check className="h-3.5 w-3.5" />
                      <span>Done! Updated for you ♡</span>
                    </p>
                  ) : msg.actionResolved === 'cancelled' ? (
                    <p className="mt-2 text-[11px] text-[#7D5E5A]">
                      No worries, cancelled without making changes!
                    </p>
                  ) : (
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleConfirmPendingAction(msg.id, msg.data!.pendingAction!)
                        }
                        className="flex-1 rounded-full bg-[#B9688A] px-3 py-1.5 text-[11.5px] font-semibold text-[#FFF9F2] hover:bg-[#A45677]"
                      >
                        Yes, Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelPendingAction(msg.id)}
                        className="flex-1 rounded-full border border-[#E5BECB] bg-white px-3 py-1.5 text-[11.5px] font-medium text-[#7D5E5A] hover:bg-[#FFF9F2]"
                      >
                        No, Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Crochet Order Summary Card */}
              {msg.data?.customOrderDraft && (
                <div className="mt-2 ml-9 w-[calc(100%-2.25rem)] rounded-2xl border border-[#B9C9A8] bg-[#D6E2C8]/35 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#354328]">
                    Custom Order Summary
                  </p>
                  <dl className="mt-1.5 space-y-1 text-[11.5px] text-[#4A3531]">
                    {msg.data.customOrderDraft.productType && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#7D5E5A]">Creation:</dt>
                        <dd className="text-right font-medium">
                          {msg.data.customOrderDraft.productType}
                        </dd>
                      </div>
                    )}
                    {msg.data.customOrderDraft.preferredColor && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#7D5E5A]">Colours:</dt>
                        <dd className="text-right font-medium">
                          {msg.data.customOrderDraft.preferredColor}
                        </dd>
                      </div>
                    )}
                    {msg.data.customOrderDraft.size && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#7D5E5A]">Size:</dt>
                        <dd className="text-right font-medium">
                          {msg.data.customOrderDraft.size}
                        </dd>
                      </div>
                    )}
                    {msg.data.customOrderDraft.quantity && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#7D5E5A]">Quantity:</dt>
                        <dd className="text-right font-medium">
                          {msg.data.customOrderDraft.quantity}
                        </dd>
                      </div>
                    )}
                    {msg.data.customOrderDraft.personalization && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#7D5E5A]">Notes:</dt>
                        <dd className="text-right font-medium">
                          {msg.data.customOrderDraft.personalization}
                        </dd>
                      </div>
                    )}
                    {msg.data.customOrderDraft.deliveryDate && (
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#7D5E5A]">Target Date:</dt>
                        <dd className="text-right font-medium">
                          {msg.data.customOrderDraft.deliveryDate}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-2 text-[10.5px] text-[#354328]">
                    Our crochet artist confirms final custom pricing & crafting dates on WhatsApp.
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <a
                      href={buildCustomOrderWhatsAppUrl(msg.data.customOrderDraft)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#354328] px-3 py-1.5 text-[11px] font-semibold text-[#FFF9F2] hover:bg-[#29351F]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Send on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigate({ view: 'custom-orders' });
                        if (window.innerWidth < 640) onMinimize();
                      }}
                      className="rounded-full border border-[#B9C9A8] bg-white px-3 py-1.5 text-[11px] font-medium text-[#354328] hover:bg-[#FFF9F2]"
                    >
                      Custom Page
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Navigation Target */}
              {msg.data?.navigationTarget && (
                <div className="mt-2 ml-9">
                  {msg.data.navigationTarget.action === 'track_whatsapp' ? (
                    <a
                      href={buildWhatsAppUrl(
                        "Hi Looplet! I'd love to check the status of my crochet order."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#B9C9A8] bg-[#D6E2C8] px-3.5 py-1.5 text-[11.5px] font-semibold text-[#354328] transition-colors hover:bg-[#C9D8B8]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{msg.data.navigationTarget.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavigateTarget(msg.data!.navigationTarget!)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#E5BECB] bg-white px-3.5 py-1.5 text-[11.5px] font-semibold text-[#9F4E70] shadow-2xs transition-colors hover:bg-[#F4DDE5]/50"
                    >
                      <span>{msg.data.navigationTarget.label} →</span>
                    </button>
                  )}
                </div>
              )}

              {/* Follow-up Suggestion Chips on latest assistant turn */}
              {isLatestAssistant &&
                msg.data?.followUpSuggestions &&
                msg.data.followUpSuggestions.length > 0 && (
                  <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                    {msg.data.followUpSuggestions.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        disabled={isLoading}
                        onClick={() => sendMessage(chip)}
                        className="rounded-full border border-[#E5BECB] bg-[#FFF9F2] px-2.5 py-1 text-[11px] font-medium text-[#7D5E5A] transition-colors hover:border-[#B9688A] hover:bg-[#F4DDE5]/45 hover:text-[#4A3531] disabled:opacity-50"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          );
        })}

        {/* Typing Animation */}
        {isLoading && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#EED8E0] bg-white">
              <CocoAvatar className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-[#EED8E0] bg-white px-3.5 py-2.5 shadow-2xs">
              <span className="flex items-center gap-1" aria-label="Coco is typing">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#D78FAE] [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#F2C879] [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#9BB686]" />
              </span>
              <span className="text-[11px] text-[#7D5E5A]">Coco is stitching a reply...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Live Bag Status Strip + Input Box */}
      <div className="shrink-0 border-t border-[#EED8E0] bg-white/95 px-3.5 pb-3 pt-2.5">
        <div className="mb-2 flex items-center justify-between text-[10.5px] text-[#7D5E5A]">
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              if (window.innerWidth < 640) onMinimize();
            }}
            className="inline-flex items-center gap-1 font-medium text-[#9F4E70] hover:underline"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>
              Bag: {clientContext.cartItems.reduce((s, i) => s + i.quantity, 0)} items (
              {formatINR(clientContext.cartSubtotal)})
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (!showWelcomeQuickActions) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `menu-${Date.now()}`,
                    role: 'assistant',
                    text: 'Of course! Pick any quick topic below or ask me anything in your own words 🌸',
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    data: {
                      reply: '',
                      recommendedProductIds: [],
                      followUpSuggestions: [
                        'Explore New Arrivals',
                        'Help Me Choose a Gift',
                        'Find Products Under ₹500',
                      ],
                    },
                  },
                ]);
              }
            }}
            className="font-medium text-[#7D5E5A] hover:text-[#4A3531]"
          >
            {showWelcomeQuickActions ? 'Tap a quick topic ↑' : 'Need ideas?'}
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Coco for gifts, prices, care..."
            disabled={isLoading}
            className="flex-1 rounded-full border border-[#E5BECB] bg-[#FFF9F2] px-4 py-2 text-xs text-[#4A3531] placeholder:text-[#7D5E5A]/65 focus:border-[#B9688A] focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message to Coco"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B9688A] text-[#FFF9F2] shadow-xs transition-colors hover:bg-[#A45677] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
