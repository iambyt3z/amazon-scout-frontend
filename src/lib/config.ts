/**
 * Configuration utilities for the application
 */

// Get the API base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Validate that the API base URL is configured
if (!API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not configured. Please set it in your .env.local file.');
}

// Export a function to get the full API URL for a given endpoint
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_BASE_URL || 'https://quadrant-09-16-backend-74810133137.us-west1.run.app';
  return `${baseUrl}${endpoint}`;
};
