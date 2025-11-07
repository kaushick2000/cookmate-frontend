/**
 * Image URL Utility
 * 
 * This utility handles different image URL formats:
 * 
 * 1. Full absolute URLs (external or backend):
 *    - https://example.com/image.jpg
 *    - http://localhost:8080/images/recipe.jpg
 * 
 * 2. Relative paths (assumed to be from backend):
 *    - /images/recipe.jpg
 *    - images/recipe.jpg
 *    - /api/images/recipe.jpg
 * 
 * 3. Empty/null values return placeholder
 */

import { config } from '../config';

const BACKEND_BASE_URL = config.BACKEND_URL;
const API_BASE_URL = config.API_URL;

/**
 * Normalizes an image URL to ensure it's a valid, accessible URL.
 * Also adds console logging for debugging image loading issues.
 * @param {string} imageUrl - The image URL from the backend
 * @returns {string} - Normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  // Return placeholder if no image URL
  if (!imageUrl || imageUrl.trim() === '') {
    console.log('No image URL provided, using placeholder');
    return 'https://placehold.co/400x300/e9ecef/495057?text=No+Image';
  }
  console.log('Normalizing image URL:', imageUrl);

  // If it's an unsplash URL or any other full URL, use it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log('Using external URL:', imageUrl);
    return imageUrl;
  }

  // If it's an image ID URL from backend, use full backend URL
  if (imageUrl.match(/^\/api\/recipes\/\d+\/image$/)) {
    console.log('Using backend image endpoint:', imageUrl);
    return `${BACKEND_BASE_URL}${imageUrl}`;
  }

  // If it starts with /, it's an absolute path from backend root
  if (imageUrl.startsWith('/')) {
    // If it starts with /api, use API base URL structure
    if (imageUrl.startsWith('/api/')) {
      const fullUrl = `${BACKEND_BASE_URL}${imageUrl}`;
      console.log('Using backend API URL:', fullUrl);
      return fullUrl;
    }
    // If it starts with /uploads, use backend URL directly
    if (imageUrl.startsWith('/uploads/')) {
      const fullUrl = `${BACKEND_BASE_URL}${imageUrl}`;
      console.log('Using backend uploads URL:', fullUrl);
      return fullUrl;
    }
    // Otherwise, it's from backend root
    const fullUrl = `${BACKEND_BASE_URL}${imageUrl}`;
    console.log('Using backend root URL:', fullUrl);
    return fullUrl;
  }

  // For any other URL, assume it's a mistake and return placeholder
  console.log('Invalid image URL format, using placeholder');
  return 'https://placehold.co/400x300/e9ecef/495057?text=No+Image';
};

/**
 * Gets the image URL for display
 * @param {string} imageUrl - The image URL from the backend
 * @param {string} placeholder - Optional custom placeholder URL
 * @returns {string} - Image URL ready to use in img src
 */
export const getImageUrl = (imageUrl, placeholder = null) => {
  if (!imageUrl || imageUrl.trim() === '') {
    return placeholder || 'https://placehold.co/400x300/e9ecef/495057?text=No+Image';
  }
  return normalizeImageUrl(imageUrl);
};

