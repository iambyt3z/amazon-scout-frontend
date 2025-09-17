/**
 * API Types for Amazon Product Search Backend
 * 
 * These types mirror the backend API schema defined in backend.json
 * and provide type safety for API interactions.
 */

/**
 * Represents a product from Amazon with all its details
 */
export interface AmazonProduct {
  /** Unique identifier for the product */
  id: string;
  /** Product name/title */
  name: string;
  /** Product price as a string (e.g., "$29.99") */
  price: string;
  /** Product description */
  description: string;
  /** URL to the product image */
  image_url: string;
  /** Product rating (e.g., 4.5) */
  rating: number;
  /** Maximum possible rating (e.g., 5.0) */
  max_rating: number;
  /** Number of reviews as a string (e.g., "1,234") */
  review_count: string;
  /** URL to the product page on Amazon */
  url: string;
  /** Product availability status (e.g., "In Stock", "Out of Stock") */
  availability: string;
}

/**
 * Request payload for the search endpoint
 */
export interface SearchRequest {
  /** The search query message */
  message: string;
}

/**
 * Response from the search endpoint
 */
export interface SearchResponse {
  /** Response message from the AI */
  response: string;
  /** Array of products matching the search query */
  products: AmazonProduct[];
}

/**
 * Health check response (can be any JSON object)
 */
export interface HealthResponse {
  [key: string]: any;
}
