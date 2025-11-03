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

const BACKEND_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Normalizes an image URL to ensure it's a valid, accessible URL
 * @param {string} imageUrl - The image URL from the backend
 * @returns {string} - Normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  // Return placeholder if no image URL
  if (!imageUrl || imageUrl.trim() === '') {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // If it's already a full URL (http:// or https://), use it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it starts with /, it's an absolute path from backend root
  if (imageUrl.startsWith('/')) {
    // If it starts with /api, use API base URL structure
    if (imageUrl.startsWith('/api/')) {
      return `${BACKEND_BASE_URL}${imageUrl}`;
    }
    // Otherwise, it's from backend root
    return `${BACKEND_BASE_URL}${imageUrl}`;
  }

  // If it's a relative path without leading slash, assume it's from backend root
  return `${BACKEND_BASE_URL}/${imageUrl}`;
};

/**
 * Gets the image URL for display
 * @param {string} imageUrl - The image URL from the backend
 * @param {string} placeholder - Optional custom placeholder URL
 * @returns {string} - Image URL ready to use in img src
 */
export const getImageUrl = (imageUrl, placeholder = null) => {
  if (!imageUrl || imageUrl.trim() === '') {
    return placeholder || 'https://via.placeholder.com/400x300?text=No+Image';
  }
  return normalizeImageUrl(imageUrl);
};

