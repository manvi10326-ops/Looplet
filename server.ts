import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CATEGORIES, PRODUCTS } from './src/data/catalog.ts';
import { buildWhatsAppUrl, formatINR, STORE_CONFIG } from './src/config/store.ts';
import { getSupabaseServerClient } from './src/lib/supabaseServer.ts';
import type {
  CocoClientContext,
  CocoHistoryTurn,
  CocoStructuredResponse,
} from './src/types/coco.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

const PRODUCT_MAP = new Map(PRODUCTS.map((p) => [p.id, p]));
const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));
const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

function buildCatalogPromptDigest(): string {
  const categorySummary = CATEGORIES.map(
    (c) => `- ${c.slug} (${c.name}): ${c.description}`
  ).join('\n');

  const productSummary = PRODUCTS.map((p) => {
    const tags = [
      p.badge,
      p.isBestseller ? 'Bestseller' : null,
      p.isNewArrival ? 'New Arrival' : null,
    ]
      .filter(Boolean)
      .join(', ');
    const colors = p.colors?.map((c) => c.name).join(' / ') || 'Standard';
    return `[${p.id}] ${p.name} | ₹${p.price} | Cat: ${p.category} (${p.categoryLabel}) | Type: ${p.productType} | Tags: ${tags || 'Handmade'} | Stock: ${p.inStock ? p.availabilityLabel : 'Out of stock'} | Colours: ${colors} | Short: ${p.shortDescription} | Details: ${p.details.join('; ')}`;
  }).join('\n');

  return `
BRAND & STORE FACTS (SINGLE SOURCE OF TRUTH):
- Brand: ${STORE_CONFIG.brandName} ("${STORE_CONFIG.tagline}")
- Location: ${STORE_CONFIG.studioLocation}
- WhatsApp Support & Orders: ${STORE_CONFIG.contactPhoneDisplay}
- Email: ${STORE_CONFIG.contactEmail}
- Shipping: Free shipping on orders ₹${STORE_CONFIG.shipping.freeShippingThreshold} and above; standard shipping ₹${STORE_CONFIG.shipping.standardShippingFee} below ₹${STORE_CONFIG.shipping.freeShippingThreshold}.
- Dispatch Time: ${STORE_CONFIG.shipping.dispatchDays}. Custom Keepsake Portrait Doll takes 7–10 business days; Buttercream Shell Baby Blanket takes 5 days.
- Care Instructions: Gently spot-clean with cool water and mild soap, reshape softly, and air-dry away from direct harsh sunlight (the Crochet Coaster Set also supports a gentle cold wash cycle).
- Returns & Support: Handmade and custom creations are non-returnable once crafting starts unless damaged or incorrect upon delivery. Customers should message WhatsApp within 48 hours of delivery with an unboxing photo.
- Accounts & Order Tracking Reality: There is NO login portal or automated order-tracking database on this website. Orders and custom requests are confirmed and tracked directly via WhatsApp with the studio, while Cart and Wishlist are stored locally in the customer's browser. NEVER invent fake order IDs, tracking numbers, delivery statuses, or login steps.

CATEGORIES (${CATEGORIES.length}):
${categorySummary}

CATALOGUE PRODUCTS (${PRODUCTS.length} real handmade products):
${productSummary}
`.trim();
}

const CATALOG_DIGEST = buildCatalogPromptDigest();

const COCO_SYSTEM_INSTRUCTION = `
You are **Coco – Your Crochet Buddy 🧶**, the warm, cute, helpful AI shopping assistant for **Looplet – Handmade Crochet Boutique**.

PERSONALITY & TONE:
- Friendly, cozy, sweet, cheerful, and concise—matching a pastel handmade crochet boutique. Use gentle emojis naturally (🧶, 🌸, ♡, ✨) without cluttering.
- Keep replies crisp, easy to scan, and genuinely helpful (2–5 short sentences or clean bullet points).

STRICT GROUNDING RULES (NEVER BREAK THESE):
1. ONLY recommend, mention, quote prices for, or compare products from the CATALOGUE PRODUCTS list below. NEVER invent products, prices, discounts, colours, stock levels, or dimensions.
2. All prices are in Indian Rupees (₹). Always match exact product IDs when populating \`recommendedProductIds\`, \`budgetCombo.productIds\`, \`comparison.productIds\`, or \`pendingAction.productId\`.
3. If the customer asks for a detail not listed in the product/store facts (e.g., exact weight in grams if not listed, exact current WhatsApp courier tracking number), tell them honestly that it isn't listed and offer to check with the Looplet studio on WhatsApp.
4. BUDGET MODE: When asked for items or combos under a budget (e.g., "under ₹500", "gifts between ₹500 and ₹1000", "combo under ₹1500"), choose real products whose exact sum fits the budget, explain why they pair well, and include \`budgetCombo\` with their IDs. Mention free shipping at ₹1,499+ when helpful!
5. GIFT ASSISTANT: If the user asks to choose a gift without specifying recipient/occasion/budget/aesthetic, warmly ask 2–3 quick questions (who it's for, occasion, budget, pastel vibe) AND optionally show 2–3 versatile favourites or offer quick follow-up chips so they can reply with one tap.
6. CART & WISHLIST CONFIRMATION RULE: Whenever the user asks you to add an item to their cart or save/remove an item in their wishlist, NEVER claim it has already been modified automatically. Always populate \`pendingAction\` with a polite confirmation question (\`promptText\`) so the customer can click Confirm or Cancel in the chat UI!
7. CUSTOM ORDERS: Help collect custom crochet details conversationally (product type, preferred colours, size, quantity, personalization/note, desired delivery date). Populate \`customOrderDraft\` progressively as details are gathered. Set \`isReadyForWhatsApp: true\` once at least productType and some customization/colour details are known. NEVER promise unconfirmed custom pricing or guaranteed delivery dates—explain that the Looplet studio confirms final pricing & crafting timeline on WhatsApp.
8. PRODUCT COMPARISON: When asked to compare two or more items, return \`comparison\` with their exact \`productIds\` and a clear \`highlightNote\` summarizing size/use/price/vibe differences.
9. ORDER TRACKING & ACCOUNTS: Because Looplet confirms and tracks orders directly via WhatsApp (no automated tracking database or login portal exists on the site), honestly explain that and provide \`navigationTarget\` with \`action: "track_whatsapp"\` and label \`"Check Order on WhatsApp"\`. Never pretend an order is saved to a backend or invent tracking statuses.

${CATALOG_DIGEST}
`.trim();

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: 'Coco conversational response in a warm, helpful boutique tone.',
    },
    recommendedProductIds: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Up to 6 exact product IDs from the catalogue to render as visual product cards.',
    },
    budgetCombo: {
      type: Type.OBJECT,
      nullable: true,
      description: 'Optional curated bundle when answering budget or combo requests.',
      properties: {
        title: { type: Type.STRING },
        productIds: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        note: { type: Type.STRING },
      },
      required: ['title', 'productIds'],
    },
    comparison: {
      type: Type.OBJECT,
      nullable: true,
      description: 'Optional side-by-side comparison of 2 to 3 real products.',
      properties: {
        productIds: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        highlightNote: { type: Type.STRING },
      },
      required: ['productIds', 'highlightNote'],
    },
    pendingAction: {
      type: Type.OBJECT,
      nullable: true,
      description:
        'Required confirmation prompt whenever the customer wants to add to cart or modify wishlist.',
      properties: {
        type: {
          type: Type.STRING,
          enum: ['add_to_cart', 'add_to_wishlist', 'remove_from_wishlist'],
        },
        productId: { type: Type.STRING },
        selectedColor: { type: Type.STRING },
        quantity: { type: Type.INTEGER },
        promptText: { type: Type.STRING },
      },
      required: ['type', 'productId', 'promptText'],
    },
    customOrderDraft: {
      type: Type.OBJECT,
      nullable: true,
      description: 'Collected custom crochet order fields during a custom order conversation.',
      properties: {
        productType: { type: Type.STRING },
        preferredColor: { type: Type.STRING },
        size: { type: Type.STRING },
        quantity: { type: Type.INTEGER },
        personalization: { type: Type.STRING },
        deliveryDate: { type: Type.STRING },
        isReadyForWhatsApp: { type: Type.BOOLEAN },
      },
    },
    navigationTarget: {
      type: Type.OBJECT,
      nullable: true,
      description: 'Optional quick navigation button to help the customer jump to a page.',
      properties: {
        action: {
          type: Type.STRING,
          enum: ['shop', 'checkout', 'wishlist', 'custom_orders', 'track_whatsapp', 'product'],
        },
        label: { type: Type.STRING },
        slug: { type: Type.STRING },
        category: { type: Type.STRING },
      },
      required: ['action', 'label'],
    },
    followUpSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 short, natural follow-up prompts the user can tap next.',
    },
  },
  required: ['reply', 'recommendedProductIds', 'followUpSuggestions'],
};

function sanitizeCocoResponse(raw: Record<string, unknown>): CocoStructuredResponse {
  const reply =
    typeof raw.reply === 'string' && raw.reply.trim()
      ? raw.reply.trim()
      : 'I am right here to help you explore Looplet! 🌸 Tell me what kind of crochet creation you are looking for.';

  const recommendedSet = new Set<string>();
  if (Array.isArray(raw.recommendedProductIds)) {
    for (const id of raw.recommendedProductIds) {
      if (typeof id === 'string' && PRODUCT_MAP.has(id) && recommendedSet.size < 6) {
        recommendedSet.add(id);
      }
    }
  }

  let budgetCombo: CocoStructuredResponse['budgetCombo'];
  if (raw.budgetCombo && typeof raw.budgetCombo === 'object') {
    const comboObj = raw.budgetCombo as Record<string, unknown>;
    const rawIds = Array.isArray(comboObj.productIds) ? comboObj.productIds : [];
    const validIds = rawIds.filter(
      (id): id is string => typeof id === 'string' && PRODUCT_MAP.has(id)
    );
    if (validIds.length > 0) {
      const exactTotal = validIds.reduce(
        (sum, id) => sum + (PRODUCT_MAP.get(id)?.price || 0),
        0
      );
      budgetCombo = {
        title:
          typeof comboObj.title === 'string' && comboObj.title.trim()
            ? comboObj.title.trim()
            : 'Curated Looplet Combo',
        productIds: validIds,
        totalPrice: exactTotal,
        freeShippingEligible: exactTotal >= STORE_CONFIG.shipping.freeShippingThreshold,
        note: typeof comboObj.note === 'string' ? comboObj.note.trim() : undefined,
      };
      for (const id of validIds) {
        if (recommendedSet.size < 6) recommendedSet.add(id);
      }
    }
  }

  let comparison: CocoStructuredResponse['comparison'];
  if (raw.comparison && typeof raw.comparison === 'object') {
    const compObj = raw.comparison as Record<string, unknown>;
    const rawIds = Array.isArray(compObj.productIds) ? compObj.productIds : [];
    const validIds = Array.from(
      new Set(
        rawIds.filter((id): id is string => typeof id === 'string' && PRODUCT_MAP.has(id))
      )
    ).slice(0, 3);
    if (validIds.length >= 2) {
      comparison = {
        productIds: validIds,
        highlightNote:
          typeof compObj.highlightNote === 'string' && compObj.highlightNote.trim()
            ? compObj.highlightNote.trim()
            : 'Here is a side-by-side comparison of these handmade pieces:',
      };
    }
  }

  let pendingAction: CocoStructuredResponse['pendingAction'];
  if (raw.pendingAction && typeof raw.pendingAction === 'object') {
    const act = raw.pendingAction as Record<string, unknown>;
    const actionType = act.type;
    const prodId = typeof act.productId === 'string' ? act.productId : '';
    const product = PRODUCT_MAP.get(prodId);
    if (
      product &&
      (actionType === 'add_to_cart' ||
        actionType === 'add_to_wishlist' ||
        actionType === 'remove_from_wishlist')
    ) {
      const requestedColor =
        typeof act.selectedColor === 'string' ? act.selectedColor.trim() : undefined;
      const validColor =
        requestedColor &&
        product.colors?.some((c) => c.name.toLowerCase() === requestedColor.toLowerCase())
          ? product.colors.find((c) => c.name.toLowerCase() === requestedColor.toLowerCase())?.name
          : product.colors?.[0]?.name;

      const qty =
        typeof act.quantity === 'number' && Number.isFinite(act.quantity)
          ? Math.max(1, Math.min(10, Math.round(act.quantity)))
          : 1;

      pendingAction = {
        type: actionType,
        productId: product.id,
        selectedColor: validColor,
        quantity: qty,
        promptText:
          typeof act.promptText === 'string' && act.promptText.trim()
            ? act.promptText.trim()
            : actionType === 'add_to_cart'
              ? `Would you like me to add ${qty} × ${product.name} (₹${product.price.toLocaleString('en-IN')}) to your crochet bag?`
              : actionType === 'add_to_wishlist'
                ? `Would you like me to save ${product.name} to your wishlist?`
                : `Would you like me to remove ${product.name} from your wishlist?`,
      };
    }
  }

  let customOrderDraft: CocoStructuredResponse['customOrderDraft'];
  if (raw.customOrderDraft && typeof raw.customOrderDraft === 'object') {
    const draft = raw.customOrderDraft as Record<string, unknown>;
    const cleaned: NonNullable<CocoStructuredResponse['customOrderDraft']> = {
      productType:
        typeof draft.productType === 'string' && draft.productType.trim()
          ? draft.productType.trim()
          : undefined,
      preferredColor:
        typeof draft.preferredColor === 'string' && draft.preferredColor.trim()
          ? draft.preferredColor.trim()
          : undefined,
      size:
        typeof draft.size === 'string' && draft.size.trim() ? draft.size.trim() : undefined,
      quantity:
        typeof draft.quantity === 'number' && Number.isFinite(draft.quantity)
          ? Math.max(1, Math.min(50, Math.round(draft.quantity)))
          : undefined,
      personalization:
        typeof draft.personalization === 'string' && draft.personalization.trim()
          ? draft.personalization.trim()
          : undefined,
      deliveryDate:
        typeof draft.deliveryDate === 'string' && draft.deliveryDate.trim()
          ? draft.deliveryDate.trim()
          : undefined,
      isReadyForWhatsApp: Boolean(draft.isReadyForWhatsApp),
    };
    if (
      cleaned.productType ||
      cleaned.preferredColor ||
      cleaned.size ||
      cleaned.personalization ||
      cleaned.deliveryDate
    ) {
      customOrderDraft = cleaned;
    }
  }

  let navigationTarget: CocoStructuredResponse['navigationTarget'];
  if (raw.navigationTarget && typeof raw.navigationTarget === 'object') {
    const nav = raw.navigationTarget as Record<string, unknown>;
    const action = nav.action;
    const validActions = new Set([
      'shop',
      'checkout',
      'wishlist',
      'custom_orders',
      'track_whatsapp',
      'product',
    ]);
    if (typeof action === 'string' && validActions.has(action)) {
      const slug =
        typeof nav.slug === 'string' && PRODUCT_BY_SLUG.has(nav.slug) ? nav.slug : undefined;
      const category =
        typeof nav.category === 'string' &&
        (nav.category === 'all' || CATEGORY_SLUGS.has(nav.category as typeof CATEGORIES[number]['slug']))
          ? nav.category
          : undefined;
      if (action !== 'product' || slug) {
        navigationTarget = {
          action: action as NonNullable<CocoStructuredResponse['navigationTarget']>['action'],
          label:
            typeof nav.label === 'string' && nav.label.trim()
              ? nav.label.trim()
              : 'Explore Boutique',
          slug,
          category,
        };
      }
    }
  }

  const followUpSuggestions: string[] = Array.isArray(raw.followUpSuggestions)
    ? raw.followUpSuggestions
        .filter((s): s is string => typeof s === 'string' && Boolean(s.trim()))
        .map((s) => s.trim())
        .slice(0, 3)
    : [];

  return {
    reply,
    recommendedProductIds: Array.from(recommendedSet),
    budgetCombo,
    comparison,
    pendingAction,
    customOrderDraft,
    navigationTarget,
    followUpSuggestions,
  };
}

function formatContextBlock(ctx?: CocoClientContext): string {
  if (!ctx) return 'Customer context: Empty bag, empty wishlist.';
  const cartSummary =
    ctx.cartItems && ctx.cartItems.length > 0
      ? ctx.cartItems
          .map(
            (i) =>
              `${i.quantity}× ${i.name} [${i.productId}] (${i.selectedColor || 'Default'}) @ ₹${i.price}`
          )
          .join('; ')
      : 'Empty';

  const wishlistSummary =
    ctx.wishlistProductIds && ctx.wishlistProductIds.length > 0
      ? ctx.wishlistProductIds
          .map((id) => PRODUCT_MAP.get(id)?.name || id)
          .join(', ')
      : 'Empty';

  return `LIVE CUSTOMER STATE:
- Current Page: ${ctx.currentRouteLabel || 'Home'}
- Shopping Bag (${ctx.cartItems?.length || 0} items, subtotal ₹${ctx.cartSubtotal || 0}): ${cartSummary}
- Wishlist (${ctx.wishlistProductIds?.length || 0} items): ${wishlistSummary}`;
}

async function generateCocoReply(
  messages: CocoHistoryTurn[],
  clientContext?: CocoClientContext
): Promise<CocoStructuredResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('MISSING_GEMINI_API_KEY');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });

  const recentTurns = messages.slice(-14).filter((m) => m.text && m.text.trim());
  const contents = recentTurns.map((turn, index) => {
    const isLastUserTurn = index === recentTurns.length - 1 && turn.role === 'user';
    const text = isLastUserTurn
      ? `${formatContextBlock(clientContext)}\n\nCustomer message: ${turn.text.trim()}`
      : turn.text.trim();
    return {
      role: turn.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text }],
    };
  });

  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: `${formatContextBlock(clientContext)}\n\nCustomer message: Hello Coco!` }],
    });
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: COCO_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        throw new Error('Empty model response');
      }

      try {
        const parsed = JSON.parse(rawText) as Record<string, unknown>;
        return sanitizeCocoResponse(parsed);
      } catch {
        return {
          reply: rawText,
          recommendedProductIds: [],
          followUpSuggestions: ['Explore bestsellers', 'Gifts under ₹1,000'],
        };
      }
    } catch (err) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('API_KEY') || errMsg.includes('400') || errMsg.includes('403')) {
        break;
      }
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'looplet-coco-assistant' });
  });

  app.post('/api/coco/chat', async (req, res) => {
    try {
      const body = req.body as {
        messages?: CocoHistoryTurn[];
        clientContext?: CocoClientContext;
      };

      if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
        res.status(400).json({ error: 'Please send a message for Coco to answer.' });
        return;
      }

      const structured = await generateCocoReply(body.messages, body.clientContext);
      res.json(structured);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('[Coco API Error]:', msg);

      if (msg === 'MISSING_GEMINI_API_KEY') {
        res.status(503).json({
          error:
            'Coco needs a Gemini API key configured on the server before she can reply. Please check GEMINI_API_KEY in Secrets or use WhatsApp for studio help.',
        });
        return;
      }

      if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate')) {
        res.status(429).json({
          error:
            'Coco is helping lots of shoppers right now! Please wait a few seconds and try again.',
        });
        return;
      }

      res.status(502).json({
        error:
          'Coco tangled a little loop of yarn just now! Please tap Retry or send your message again.',
      });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const body = req.body as {
        customerName?: string;
        phone?: string;
        email?: string;
        address?: string;
        city?: string;
        stateName?: string;
        pinCode?: string;
        orderNote?: string;
        items?: Array<{ productId?: string; quantity?: number; selectedColor?: string }>;
      };

      const customerName = typeof body?.customerName === 'string' ? body.customerName.trim() : '';
      const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
      const email = typeof body?.email === 'string' ? body.email.trim() : '';
      const address = typeof body?.address === 'string' ? body.address.trim() : '';
      const city = typeof body?.city === 'string' ? body.city.trim() : '';
      const stateName = typeof body?.stateName === 'string' ? body.stateName.trim() : '';
      const pinCode = typeof body?.pinCode === 'string' ? body.pinCode.replace(/\D/g, '') : '';
      const orderNote = typeof body?.orderNote === 'string' ? body.orderNote.trim() : '';

      const cleanPhone = phone.replace(/\D/g, '');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!customerName || cleanPhone.length < 10 || !emailPattern.test(email)) {
        res.status(400).json({ error: 'Please provide valid customer name, phone, and email.' });
        return;
      }
      if (address.length < 6 || !city || !stateName || pinCode.length !== 6) {
        res.status(400).json({ error: 'Please provide a complete delivery address and 6-digit PIN code.' });
        return;
      }
      if (!Array.isArray(body?.items) || body.items.length === 0) {
        res.status(400).json({ error: 'Your bag is empty. Please add at least one product.' });
        return;
      }

      const verifiedItems: Array<{
        product_id: string;
        name: string;
        product_type: string;
        selected_color: string | null;
        quantity: number;
        unit_price: number;
        line_total: number;
      }> = [];

      for (const rawItem of body.items) {
        const product = typeof rawItem?.productId === 'string' ? PRODUCT_MAP.get(rawItem.productId) : undefined;
        if (!product) {
          res.status(400).json({ error: 'One or more items in your bag could not be verified.' });
          return;
        }
        const qty =
          typeof rawItem.quantity === 'number' && Number.isFinite(rawItem.quantity)
            ? Math.max(1, Math.min(20, Math.round(rawItem.quantity)))
            : 1;
        const selectedColor =
          typeof rawItem.selectedColor === 'string' && rawItem.selectedColor.trim()
            ? rawItem.selectedColor.trim()
            : product.colors?.[0]?.name || null;

        verifiedItems.push({
          product_id: product.id,
          name: product.name,
          product_type: product.productType,
          selected_color: selectedColor,
          quantity: qty,
          unit_price: product.price,
          line_total: product.price * qty,
        });
      }

      const subtotal = verifiedItems.reduce((sum, item) => sum + item.line_total, 0);
      const shippingFee =
        subtotal >= STORE_CONFIG.shipping.freeShippingThreshold
          ? 0
          : STORE_CONFIG.shipping.standardShippingFee;
      const total = subtotal + shippingFee;

      const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomTag = Math.random().toString(36).slice(2, 6).toUpperCase();
      const orderReference = `LP-ORD-${dateTag}-${randomTag}`;

      const itemLines = verifiedItems.map(
        (item, index) =>
          `${index + 1}. ${item.name}${item.selected_color ? ` (${item.selected_color})` : ''} × ${item.quantity} — ${formatINR(item.line_total)}`
      );
      const messageLines = [
        '♡ *New Boutique Order — Looplet* ♡',
        `*Order Ref:* ${orderReference}`,
        '',
        '*Order Items:*',
        ...itemLines,
        '',
        `*Subtotal:* ${formatINR(subtotal)}`,
        `*Shipping:* ${shippingFee === 0 ? 'Free' : formatINR(shippingFee)}`,
        `*Total Amount:* ${formatINR(total)}`,
        '',
        '*Customer Delivery Details:*',
        `Name: ${customerName}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Address: ${address}, ${city}, ${stateName} - ${pinCode}`,
        orderNote ? `Gift Note / Instructions: ${orderNote}` : '',
        '',
        'Please confirm availability and share payment details. Thank you!',
      ].filter(Boolean);
      const whatsappUrl = buildWhatsAppUrl(messageLines.join('\n'));

      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from('orders').insert({
        order_reference: orderReference,
        customer_name: customerName,
        phone,
        email,
        address,
        city,
        state: stateName,
        pin_code: pinCode,
        order_note: orderNote || null,
        items: verifiedItems,
        subtotal,
        shipping_fee: shippingFee,
        total,
        status: 'pending_whatsapp',
        whatsapp_url: whatsappUrl,
      });

      if (error) {
        console.error('[Supabase Orders Insert Error]:', error.code, error.message);
        res.status(502).json({
          error:
            'We could not record your order right now. Please make sure the Supabase orders table is set up or send your order directly on WhatsApp.',
        });
        return;
      }

      res.status(201).json({
        orderReference,
        subtotal,
        shippingFee,
        total,
        whatsappUrl,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('[Orders Route Error]:', msg);
      if (msg === 'MISSING_SUPABASE_KEY') {
        res.status(503).json({
          error:
            'Supabase API key is not configured on the server yet. You can still send your order directly on WhatsApp below.',
        });
        return;
      }
      res.status(500).json({
        error: 'Unable to save your order right now. Please try again or continue via WhatsApp.',
      });
    }
  });

  app.post('/api/custom-orders', async (req, res) => {
    try {
      const body = req.body as {
        customerName?: string;
        whatsappNumber?: string;
        productType?: string;
        preferredColor?: string;
        description?: string;
        referenceFileName?: string;
      };

      const customerName = typeof body?.customerName === 'string' ? body.customerName.trim() : '';
      const whatsappNumber =
        typeof body?.whatsappNumber === 'string' ? body.whatsappNumber.trim() : '';
      const productType = typeof body?.productType === 'string' ? body.productType.trim() : '';
      const preferredColor =
        typeof body?.preferredColor === 'string' ? body.preferredColor.trim() : '';
      const description = typeof body?.description === 'string' ? body.description.trim() : '';
      const referenceFileName =
        typeof body?.referenceFileName === 'string' ? body.referenceFileName.trim() : '';

      const cleanPhone = whatsappNumber.replace(/\D/g, '');
      if (!customerName || cleanPhone.length < 10 || !productType || description.length < 10) {
        res.status(400).json({
          error: 'Please fill in your name, valid WhatsApp number, product type, and custom details.',
        });
        return;
      }

      const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomTag = Math.random().toString(36).slice(2, 6).toUpperCase();
      const requestReference = `LP-CUS-${dateTag}-${randomTag}`;

      const messageLines = [
        '♡ *New Custom Crochet Request — Looplet* ♡',
        `*Request Ref:* ${requestReference}`,
        '',
        `*Customer Name:* ${customerName}`,
        `*WhatsApp Number:* ${whatsappNumber}`,
        `*Creation Type:* ${productType}`,
        `*Preferred Yarn Colours:* ${preferredColor || 'Open to studio suggestion'}`,
        `*Customisation Details:* ${description}`,
        referenceFileName
          ? `*Reference Image:* "${referenceFileName}" (I will attach this photo directly in our WhatsApp chat!)`
          : '*Reference Image:* None attached',
        '',
        'Please let me know pricing & crafting timeline. Thank you!',
      ];
      const whatsappUrl = buildWhatsAppUrl(messageLines.join('\n'));

      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from('custom_orders').insert({
        request_reference: requestReference,
        customer_name: customerName,
        whatsapp_number: whatsappNumber,
        product_type: productType,
        preferred_color: preferredColor || null,
        description,
        reference_file_name: referenceFileName || null,
        status: 'pending_review',
        whatsapp_url: whatsappUrl,
      });

      if (error) {
        console.error('[Supabase Custom Orders Insert Error]:', error.code, error.message);
        res.status(502).json({
          error:
            'We could not record your custom request right now. Please make sure the Supabase custom_orders table is set up or send your request directly on WhatsApp.',
        });
        return;
      }

      res.status(201).json({
        requestReference,
        whatsappUrl,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('[Custom Orders Route Error]:', msg);
      if (msg === 'MISSING_SUPABASE_KEY') {
        res.status(503).json({
          error:
            'Supabase API key is not configured on the server yet. You can still send your custom request directly on WhatsApp below.',
        });
        return;
      }
      res.status(500).json({
        error:
          'Unable to save your custom request right now. Please try again or continue via WhatsApp.',
      });
    }
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Looplet storefront + Coco assistant running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
