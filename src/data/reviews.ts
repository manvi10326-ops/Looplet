export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  productPurchased: string;
  rating: number;
  reviewText: string;
  dateLabel: string;
}

export const SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Ananya Sharma',
    location: 'Bengaluru',
    productPurchased: 'Pink Tulip Crochet Bouquet',
    rating: 5,
    reviewText:
      'Ordered the Pink Tulip Bouquet for my sister’s convocation and it arrived wrapped like a little daydream. Every petal stitch is so neat and sturdy—she keeps it on her desk every day.',
    dateLabel: 'Sample Customer Review',
  },
  {
    id: 'rev-2',
    customerName: 'Meera Nair',
    location: 'Kochi',
    productPurchased: 'Cute Crochet Bunny Plushie',
    rating: 5,
    reviewText:
      'The bunny plushie is unbelievably soft and well-stuffed! You can genuinely feel the patience and care in the tiny embroidered cheeks and ribbon bow.',
    dateLabel: 'Sample Customer Review',
  },
  {
    id: 'rev-3',
    customerName: 'Rhea Kapoor',
    location: 'New Delhi',
    productPurchased: 'Daisy Crochet Sling Bag',
    rating: 5,
    reviewText:
      'I carry my Daisy Sling Bag on weekend coffee runs and get asked about it everywhere. Fits my phone, lip balm, and keys comfortably without losing its shape.',
    dateLabel: 'Sample Customer Review',
  },
  {
    id: 'rev-4',
    customerName: 'Kavya Deshmukh',
    location: 'Pune',
    productPurchased: 'Blossom Gift Hamper Box',
    rating: 5,
    reviewText:
      'The packaging alone made me smile! Soft tissue, satin bow, and the sweetest little keychain inside. Easily the most thoughtful handmade gift I have sent.',
    dateLabel: 'Sample Customer Review',
  },
];
