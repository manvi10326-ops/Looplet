export const STORE_CONFIG = {
  brandName: 'Looplet',
  tagline: 'Little Loops, Lovely Creations.',
  announcementText: 'Made slowly, stitched with love ♡',
  logoPath: '/assets/aistudio/Kawaii_Crochet_Looplet_Logo_d3e8bdfa.png',
  brandGuidePath: '/assets/aistudio/Unknown-4_a0013dc8.png',
  // Central WhatsApp configuration — update this single number for all WhatsApp orders & enquiries
  whatsappNumber: '919876543210',
  whatsappGreeting: 'Hi Looplet! I would love to know more about your handmade crochet collection.',
  contactEmail: 'hello@loopletboutique.in',
  contactPhoneDisplay: '+91 98765 43210',
  studioLocation: 'Handcrafted in Jaipur, India · Shipping Pan-India',
  social: {
    instagramUrl: 'https://instagram.com/looplet.crochet',
    instagramHandle: '@looplet.crochet',
    pinterestUrl: 'https://pinterest.com/loopletcrochet',
  },
  shipping: {
    freeShippingThreshold: 1499,
    standardShippingFee: 99,
    dispatchDays: '3–5 business days (handmade to order)',
  },
} as const;

export function buildWhatsAppUrl(message: string): string {
  const cleanPhone = STORE_CONFIG.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
