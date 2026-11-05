/**
 * Matches the shape of objects returned by GET /api/products.php
 * and stored in backend/data/products.json.
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: 'Floral' | 'Woody' | 'Citrus' | 'Oriental';
  featured: boolean;
  specialOffer: boolean;
  discount?: number;
}
