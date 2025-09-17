/**
 * Data Transformers
 * 
 * Functions to transform data between different formats,
 * particularly from backend API responses to UI models.
 */

import type { AmazonProduct } from '../types/api';

/**
 * UI Product model interface
 * This matches the existing UI structure used in the frontend
 */
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  specifications: {
    sourceUrl?: string;
  };
  // Optional fields that may be derived or set to defaults
  originalPrice?: string;
  features?: string[];
  images?: string[];
  brand?: string;
  category?: string;
}

/**
 * Transforms an AmazonProduct from the backend API to the UI Product model
 * @param amazonProduct The product data from the Amazon API
 * @returns A Product object suitable for the UI
 */
export function transformProduct(amazonProduct: Partial<AmazonProduct>): Product {
  const isBlank = (value: unknown): boolean => {
    return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
  };

  const clamp = (value: number, min: number, max: number): number => {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  };

  const extractAsinFromUrl = (url: string): string | undefined => {
    const match = url.match(/\/dp\/([A-Z0-9]{8,20})/i);
    return match?.[1]?.toUpperCase();
  };

  const rawUrl = (amazonProduct.url ?? '').trim();
  const rawId = (amazonProduct.id ?? '').trim();
  const asin = rawUrl ? extractAsinFromUrl(rawUrl) : undefined;
  const hasAnyId = !!rawId || !!asin;

  // Choose ID: prefer provided id, then ASIN, then generated UUID
  const generatedId = typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const id = rawId || asin || generatedId;

  const name = isBlank(amazonProduct.name) ? 'Unknown product' : String(amazonProduct.name);
  const price = isBlank(amazonProduct.price) ? '' : String(amazonProduct.price);
  const description = isBlank(amazonProduct.description) ? '' : String(amazonProduct.description);
  const image = isBlank(amazonProduct.image_url) ? '' : String(amazonProduct.image_url);

  const maxRatingRaw = typeof amazonProduct.max_rating === 'number'
    ? amazonProduct.max_rating
    : Number(amazonProduct.max_rating);
  const maxRating = !maxRatingRaw || Number.isNaN(maxRatingRaw) ? 5 : maxRatingRaw;

  const ratingRaw = typeof amazonProduct.rating === 'number'
    ? amazonProduct.rating
    : Number(amazonProduct.rating);
  const rating = clamp(Number.isNaN(ratingRaw) ? 0 : ratingRaw, 0, maxRating);

  const reviews = (() => {
    const rc = typeof amazonProduct.review_count === 'string'
      ? amazonProduct.review_count
      : String(amazonProduct.review_count ?? '');
    const parsed = parseInt(rc.replace(/,/g, ''), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  })();

  const inStock = String(amazonProduct.availability ?? '').toLowerCase().includes('in stock');

  return {
    id,
    name,
    price,
    description,
    image,
    rating,
    reviews,
    inStock,
    specifications: {
      sourceUrl: rawUrl || undefined,
    },
    originalPrice: undefined,
    features: undefined,
    images: undefined,
    brand: undefined,
    category: undefined,
  };
}

/**
 * Transforms an array of AmazonProduct objects to UI Product objects
 * @param amazonProducts Array of products from the Amazon API
 * @returns Array of Product objects suitable for the UI
 */
export function transformProducts(amazonProducts: Partial<AmazonProduct>[]): Product[] {
  const isBlank = (value: unknown): boolean => {
    return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
  };

  const prefiltered = amazonProducts.filter((p) => {
    const rawId = (p.id ?? '').trim();
    const rawUrl = (p.url ?? '').trim();
    if (!rawId && !rawUrl) {
      return false; // Drop items without both id and url
    }

    const name = (p.name ?? '').trim();
    const img = (p.image_url ?? '').trim();
    const price = (p.price ?? '').trim();
    if (!rawUrl && !name && !img && !price) {
      return false; // Drop when all key display fields blank and no url
    }
    return true;
  });

  return prefiltered.map(transformProduct);
}

/**
 * Creates a mock Product object for testing or fallback purposes
 * @param overrides Optional properties to override the default mock values
 * @returns A mock Product object
 */
export function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'mock-1',
    name: 'Mock Product',
    price: '$99.99',
    description: 'This is a mock product for testing purposes.',
    image: 'https://via.placeholder.com/400x400?text=Mock+Product',
    rating: 4.5,
    reviews: 100,
    inStock: true,
    specifications: {
      sourceUrl: 'https://example.com/product/mock-1',
    },
    ...overrides,
  };
}
