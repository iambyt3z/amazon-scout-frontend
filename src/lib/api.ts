/**
 * API Client for Amazon Product Search Backend
 * 
 * Provides functions to interact with the backend API including
 * health checks and product search functionality.
 */

import { getApiUrl } from './config';
import type { AmazonProduct, SearchRequest, SearchResponse, HealthResponse } from '../types/api';

/**
 * Performs a health check on the backend API
 * @returns Promise that resolves to the health response
 * @throws Error if the health check fails
 */
export async function health(): Promise<HealthResponse> {
  try {
    const response = await fetch(getApiUrl('/health'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Searches for products using the backend API
 * @param query The search query string
 * @returns Promise that resolves to an array of AmazonProduct objects
 * @throws Error if the search fails
 */
export async function searchProducts(query: string): Promise<AmazonProduct[]> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  try {
    const searchRequest: SearchRequest = {
      message: query.trim(),
    };

    const response = await fetch(getApiUrl('/v1/search'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const data: SearchResponse = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Search error:', error);
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Searches for products and returns the full response including AI response
 * @param query The search query string
 * @returns Promise that resolves to the complete SearchResponse
 * @throws Error if the search fails
 */
export async function searchProductsWithResponse(query: string): Promise<SearchResponse> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  try {
    const searchRequest: SearchRequest = {
      message: query.trim(),
    };

    const response = await fetch(getApiUrl('/v1/search'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
