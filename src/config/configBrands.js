/**
 * Brand Directory Configuration
 *
 * This file contains the curated list of brands featured on Mela.
 * Brands are organized into featured and regular categories.
 *
 * Environment-specific brand IDs are used since UUIDs differ between
 * development/test and production environments.
 *
 * To add a new brand:
 * 1. Get the brand's user UUID from their profile URL (/u/{uuid})
 * 2. Add to both brandConfigurationsByEnv.development and brandConfigurationsByEnv.production
 * 3. Add brand ID to featuredBrandIdsByEnv or allBrandIdsByEnv for each environment
 * 4. Set a unique `slug` (lowercase-hyphenated) — this becomes the permanent /brands/:slug URL
 * 5. Ensure the user has userType='provider' in Sharetribe Console
 *
 * IMPORTANT: Slugs are permanent. Once a brand page is indexed by Google, changing
 * the slug without a redirect will cause a 404 and lose SEO value.
 *
 * Brand data (name, logo, certifications, etc.) is fetched dynamically
 * from the user's profile using the Marketplace API.
 */

// Get current environment (defaults to 'production' if not set)
const getCurrentEnv = () => {
  const env = process.env.REACT_APP_ENV;
  return env === 'development' || env === 'test' ? 'development' : 'production';
};

/**
 * Brand Configurations by Environment
 * Maps brand UUID to their featured products and settings
 */
const brandConfigurationsByEnv = {
  development: {
    '68ebd6d5-ffce-4cb9-9605-3b69f2b67152': {
      // Masilo (Test)
      slug: 'masilo',
      featuredProductIds: [
        '69116f96-9a8e-4e04-8070-dcc99e2e9b02',
        '6911593a-76ac-4f76-8896-e5d15e0f41c1',
        '6904c875-eecf-4633-82f0-19a0ca0173b6',
        '6904c870-d75f-4968-9e61-5c00aca8377b'
      ],
    },
    '68e42d68-8838-48b5-8299-8e01f46280f2': {
      // Baby Forest (Test)
      slug: 'baby-forest',
      featuredProductIds: [
        '68e47a9b-adc6-4952-b1c7-96971df9a746',
        '68e47a73-d735-4256-94c4-acde5796bc79',
        '68e47aa4-2dd4-493e-b140-b8b8d02bbefb',
        '68e47a6a-5b7d-4fce-8bcc-b3c8481a53ad'
      ],
    },
    '68e58e66-4894-4ea8-b858-fc63a6bb85f6': {
      // aagghhoo (Test)
      slug: 'aagghhoo',
      featuredProductIds: [],
    },
    '68d8a4e9-533c-4b9c-914d-8b21edb8ee2d': {
      // mela-admin (Test) — no public slug; admin account
      featuredProductIds: [],
    },
  },
  production: {
    // Add production brand UUIDs here with slugs
    // Example:
    // 'prod-uuid-1': {
    //   slug: 'masilo',
    //   featuredProductIds: ['listing-uuid-1', 'listing-uuid-2'],
    // },
  },
};

/**
 * Featured brands by environment
 * Up to 8 brands for hero carousel; shows all configured brands (works with any count ≥ 1)
 */
const featuredBrandIdsByEnv = {
  development: [
    '68ebd6d5-ffce-4cb9-9605-3b69f2b67152', // Masilo
    '68e42d68-8838-48b5-8299-8e01f46280f2', // Baby Forest
  ],
  production: [
    // Add production featured brand UUIDs here
  ],
};

/**
 * All brands by environment
 * Complete directory of brands on Mela
 */
const allBrandIdsByEnv = {
  development: [
    '68e58e66-4894-4ea8-b858-fc63a6bb85f6', // aagghhoo
    '68d8a4e9-533c-4b9c-914d-8b21edb8ee2d', // mela-admin
  ],
  production: [
    // Add production brand UUIDs here
  ],
};

// Export environment-specific configurations
const currentEnv = getCurrentEnv();
export const brandConfigurations = brandConfigurationsByEnv[currentEnv];
export const featuredBrandIds = featuredBrandIdsByEnv[currentEnv];
export const allBrandIds = allBrandIdsByEnv[currentEnv];

/**
 * Get featured brand IDs
 * @returns {Array<string>} Array of featured brand UUIDs
 */
export const getFeaturedBrandIds = () => featuredBrandIds;

/**
 * Get all brand IDs
 * @returns {Array<string>} Array of all brand UUIDs
 */
export const getAllBrandIds = () => allBrandIds;

/**
 * Check if a brand is featured
 * @param {string} brandId - Brand user UUID
 * @returns {boolean} True if brand is featured
 */
export const isFeaturedBrand = brandId => featuredBrandIds.includes(brandId);

/**
 * Get paginated brand IDs
 * @param {number} page - Page number (1-indexed)
 * @param {number} perPage - Items per page
 * @returns {Object} { brandIds: Array<string>, totalPages: number, totalItems: number }
 */
export const getPaginatedBrandIds = (page = 1, perPage = 24) => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    brandIds: allBrandIds.slice(startIndex, endIndex),
    totalPages: Math.ceil(allBrandIds.length / perPage),
    totalItems: allBrandIds.length,
    page,
    perPage,
  };
};

/**
 * Get all featured product IDs for a set of brands
 * Used for batch fetching products in BrandsPage.duck.js
 * @param {Array<string>} brandIds - Array of brand UUIDs
 * @returns {Array<string>} Array of listing UUIDs
 */
export const getFeaturedProductIds = brandIds => {
  return brandIds.flatMap(brandId => brandConfigurations[brandId]?.featuredProductIds || []);
};

/**
 * Get brand configuration
 * @param {string} brandId - Brand user UUID
 * @returns {Object} Brand configuration object
 */
export const getBrandConfiguration = brandId => {
  return brandConfigurations[brandId] || { featuredProductIds: [] };
};

/**
 * Get brand UUID by slug
 * Used by /brands/:brandSlug route to resolve ProfilePage loadData
 * @param {string} slug - Brand slug (e.g. 'masilo')
 * @returns {string|null} Brand UUID, or null if not found
 */
export const getBrandIdBySlug = slug => {
  if (!slug) return null;
  const entry = Object.entries(brandConfigurations).find(
    ([, config]) => config.slug === slug
  );
  return entry ? entry[0] : null;
};

/**
 * Get brand slug by UUID
 * Used to build canonical URLs from /u/:id for brand users
 * @param {string} brandId - Brand user UUID
 * @returns {string|null} Brand slug, or null if not found
 */
export const getBrandSlugById = brandId => {
  return brandConfigurations[brandId]?.slug || null;
};
