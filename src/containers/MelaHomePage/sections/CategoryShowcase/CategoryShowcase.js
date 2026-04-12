import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from '../../../../util/reactIntl';
import { NamedLink, ListingCard } from '../../../../components';
import { useConfiguration } from '../../../../context/configurationContext';
import { createInstance } from '../../../../util/sdkLoader';
import { denormalisedEntities, updatedEntities } from '../../../../util/data';
import appSettings from '../../../../config/settings';
import * as apiUtils from '../../../../util/api';

import css from './CategoryShowcase.module.css';

// Create SDK instance for fetching listings (matches pattern from index.js)
const baseUrl = appSettings.sdk.baseUrl ? { baseUrl: appSettings.sdk.baseUrl } : {};
const assetCdnBaseUrl = appSettings.sdk.assetCdnBaseUrl
  ? { assetCdnBaseUrl: appSettings.sdk.assetCdnBaseUrl }
  : {};

const sdk = createInstance({
  transitVerbose: appSettings.sdk.transitVerbose,
  clientId: appSettings.sdk.clientId,
  secure: appSettings.usingSSL,
  typeHandlers: apiUtils.typeHandlers,
  ...baseUrl,
  ...assetCdnBaseUrl,
});

/**
 * Get categories for showcase (level 2 subcategories)
 * Returns up to 3 categories to showcase on the homepage
 */
const getShowcaseCategories = (categoryConfig) => {
  if (!categoryConfig || !Array.isArray(categoryConfig)) return [];

  // Since there's only 1 top-level category ('Baby & Kids'),
  // we need to go one level deeper to get the subcategories (level 2)
  const showcaseCategories = [];

  categoryConfig.forEach(topCategory => {
    if (topCategory.subcategories && topCategory.subcategories.length > 0) {
      // Add subcategories (level 2) to showcase
      showcaseCategories.push(...topCategory.subcategories);
    }
  });

  // Return up to 3 subcategories for the showcase (Baby Clothing, Footwear, Accessories)
  return showcaseCategories.slice(0, 3);
};

/**
 * Generate Schema.org structured data for category showcase
 * Helps search engines understand the page structure and display rich results
 */
const generateStructuredData = (categories, categoryProducts) => {
  const itemListElements = categories.flatMap((category, categoryIndex) => {
    const products = categoryProducts[category.id] || [];
    return products.map((product, productIndex) => {
      // Check stock availability following schema.org standard
      const currentStock = product.currentStock?.attributes?.quantity || 0;
      // Always provide availability - default to InStock if no stock tracking
      const schemaAvailability = !product.currentStock
        ? 'https://schema.org/InStock'
        : currentStock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';

      return {
        '@type': 'ListItem',
        position: categoryIndex * 4 + productIndex + 1,
        item: {
          '@type': 'Product',
          name: product.attributes.title,
          image: product.images?.[0]?.attributes?.variants?.default?.url || '',
          description: product.attributes.description || `Sustainable ${category.name.toLowerCase()} for babies`,
          offers: {
            '@type': 'Offer',
            price: product.attributes.price?.amount / 100 || 0,
            priceCurrency: product.attributes.price?.currency || 'USD',
            availability: schemaAvailability,
          },
        },
      };
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: itemListElements,
  };
};

const CategoryShowcase = () => {
  const config = useConfiguration();
  const [categoryProducts, setCategoryProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Get categories from Sharetribe configuration
  const categoryConfig = config?.categoryConfiguration?.categories || [];
  const showcaseCategories = getShowcaseCategories(categoryConfig);

  // Fetch products for each category
  useEffect(() => {
    if (showcaseCategories.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchCategoryProducts = async () => {
      try {
        // Fetch products for each category
        const productPromises = showcaseCategories.map(async (category) => {
          try {
            const response = await sdk.listings.query({
              pub_categoryLevel2: category.id,
              perPage: 4,
              include: ['images', 'author', 'currentStock'],
            });

            // Get listing IDs from response
            const listingIds = response.data.data.map(listing => listing.id);

            return {
              categoryId: category.id,
              listingIds,
              responseData: response.data,
            };
          } catch (error) {
            console.error(`Failed to fetch products for category ${category.id}:`, error);
            return {
              categoryId: category.id,
              listingIds: [],
              responseData: null,
            };
          }
        });

        const results = await Promise.all(productPromises);

        // Now build up entities from all responses
        const listingFields = config?.listing?.listingFields;
        const sanitizeConfig = { listingFields };
        let allEntities = {};

        results.forEach(result => {
          if (result.responseData) {
            allEntities = updatedEntities(allEntities, result.responseData, sanitizeConfig);
          }
        });

        // Denormalize listings for each category
        const productsMap = results.reduce((acc, result) => {
          const { categoryId, listingIds } = result;

          // Convert IDs to entity references
          const entityRefs = listingIds.map(id => ({ id, type: 'listing' }));

          // Denormalize the entities
          const denormalizedListings = denormalisedEntities(allEntities, entityRefs, false);

          acc[categoryId] = denormalizedListings;
          return acc;
        }, {});
        setCategoryProducts(productsMap);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch category products:', error);
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [showcaseCategories.length]);

  // Don't render if no categories available
  if (showcaseCategories.length === 0) {
    return null;
  }

  // Generate structured data for SEO
  const structuredData = !isLoading ? generateStructuredData(showcaseCategories, categoryProducts) : null;

  return (
    <div className={css.showcase}>
      {/* Schema.org structured data for rich search results */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div className={css.container}>
        {/* Section Header */}
        <div className={css.header}>
          <h2 className={css.title}>
            <FormattedMessage
              id="MelaHomePage.categoryTitle"
              defaultMessage="Shop by Category"
            />
          </h2>
          <p className={css.subtitle}>
            <FormattedMessage
              id="MelaHomePage.categorySubtitle"
              defaultMessage="Discover our carefully curated collection of sustainable baby fashion"
            />
          </p>
        </div>

        {/* Age-Based Navigation - SEO Critical */}
        <AgeNavigation config={config} />

        {/* Category Sections with Products */}
        <div className={css.categorySections}>
          {showcaseCategories.map((category, index) => {
            const products = categoryProducts[category.id] || [];
            return (
              <CategorySection
                key={category.id}
                category={category}
                products={products}
                isLoading={isLoading}
                index={index}
              />
            );
          })}
        </div>

        {/* Occasion-Based Navigation — after main categories */}
        <OccasionStrip config={config} />

        {/* View All Categories CTA */}
        <div className={css.viewAll}>
          <Link to="/categories/Baby-Clothes-Accessories" className={css.viewAllButton}>
            <FormattedMessage
              id="MelaHomePage.viewAllCategories"
              defaultMessage="View All Categories"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const OCCASIONS = [
  { option: 'diwali-festivals', label: 'Diwali & Festivals', icon: '🪔' },
  { option: 'new-baby',        label: 'New Baby',            icon: '🌸' },
  { option: 'everyday',        label: 'Everyday',            icon: '☀️' },
  { option: 'gifting',         label: 'Gifting',             icon: '🎁' },
];

const TOP_AGE_GROUPS = [
  { option: 'newborn',     label: 'Newborn',    icon: '👶' },
  { option: '0_6_months',  label: '0-6 Months', icon: '🍼' },
  { option: '6_12_months', label: '6-12 Months', icon: '🧸' },
];

/**
 * ProductCarouselSection — reusable section with title, "View All" link, and
 * a horizontally-swipeable product carousel (mobile) / 4-column grid (desktop).
 * Only renders if products.length >= 2 (prevents empty sections on launch).
 */
const ProductCarouselSection = ({ title, viewAllSearch, products, isLoading }) => {
  const hasEnough = products && products.length >= 2;

  if (!isLoading && !hasEnough) return null;

  return (
    <div className={css.categorySection}>
      <div className={css.categorySectionHeader}>
        <div className={css.categoryHeaderContent}>
          <h3 className={css.sectionCategoryTitle}>{title}</h3>
        </div>
        <NamedLink
          name="SearchPage"
          to={{ search: viewAllSearch }}
          className={css.viewCategoryLink}
        >
          <FormattedMessage id="MelaHomePage.viewAll" defaultMessage="View All" />
          <span className={css.arrow}>→</span>
        </NamedLink>
      </div>

      {isLoading ? (
        <div className={css.productCarousel}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`${css.productSkeleton} ${css.carouselCard}`} />
          ))}
        </div>
      ) : (
        <div className={css.productCarousel}>
          {products.map((listing, productIndex) => (
            <div key={listing.id.uuid} className={css.carouselCard}>
              <ListingCard
                listing={listing}
                showAuthorInfo={false}
                showTrustBadges={true}
                showConversionBadges={true}
                isBestseller={productIndex === 0}
                renderSizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * OccasionStrip — occasion-based product carousels.
 * Fetches products for each occasion in parallel; hides sections with < 2 products.
 */
const OccasionStrip = ({ sdk: sdkInstance, config }) => {
  const [occasionProducts, setOccasionProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const listingFields = config?.listing?.listingFields;
    const sanitizeConfig = { listingFields };

    const fetchOccasionProducts = async () => {
      try {
        const results = await Promise.all(
          OCCASIONS.map(async ({ option }) => {
            try {
              const response = await sdk.listings.query({
                pub_occasion: option,
                perPage: 6,
                include: ['images', 'currentStock'],
              });
              const listingIds = response.data.data.map(l => l.id);
              return { option, listingIds, responseData: response.data };
            } catch {
              return { option, listingIds: [], responseData: null };
            }
          })
        );

        let allEntities = {};
        results.forEach(r => {
          if (r.responseData) {
            allEntities = updatedEntities(allEntities, r.responseData, sanitizeConfig);
          }
        });

        const productsMap = results.reduce((acc, { option, listingIds }) => {
          const refs = listingIds.map(id => ({ id, type: 'listing' }));
          acc[option] = denormalisedEntities(allEntities, refs, false);
          return acc;
        }, {});

        setOccasionProducts(productsMap);
      } catch {
        // leave empty — sections with < 2 products won't render
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccasionProducts();
  }, []);

  return (
    <div className={css.occasionStrip}>
      <h3 className={css.ageNavigationTitle}>
        <FormattedMessage id="MelaHomePage.shopByOccasion" defaultMessage="Shop by Occasion" />
      </h3>
      <div className={css.categorySections}>
        {OCCASIONS.map(({ option, label }) => (
          <ProductCarouselSection
            key={option}
            title={label}
            viewAllSearch={`?pub_occasion=${option}`}
            products={occasionProducts[option] || []}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * AgeNavigation — age-based product carousels (top 3 groups).
 * Uses pub_age_group which is already indexed in Sharetribe.
 */
const AgeNavigation = ({ config }) => {
  const [ageProducts, setAgeProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const listingFields = config?.listing?.listingFields;
    const sanitizeConfig = { listingFields };

    const fetchAgeProducts = async () => {
      try {
        const results = await Promise.all(
          TOP_AGE_GROUPS.map(async ({ option }) => {
            try {
              const response = await sdk.listings.query({
                pub_age_group: option,
                perPage: 6,
                include: ['images', 'currentStock'],
              });
              const listingIds = response.data.data.map(l => l.id);
              return { option, listingIds, responseData: response.data };
            } catch {
              return { option, listingIds: [], responseData: null };
            }
          })
        );

        let allEntities = {};
        results.forEach(r => {
          if (r.responseData) {
            allEntities = updatedEntities(allEntities, r.responseData, sanitizeConfig);
          }
        });

        const productsMap = results.reduce((acc, { option, listingIds }) => {
          const refs = listingIds.map(id => ({ id, type: 'listing' }));
          acc[option] = denormalisedEntities(allEntities, refs, false);
          return acc;
        }, {});

        setAgeProducts(productsMap);
      } catch {
        // leave empty
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgeProducts();
  }, []);

  return (
    <div className={css.ageNavigation}>
      <h3 className={css.ageNavigationTitle}>
        <FormattedMessage id="MelaHomePage.shopByAge" defaultMessage="Shop Baby by Age" />
      </h3>
      <div className={css.categorySections}>
        {TOP_AGE_GROUPS.map(({ option, label }) => (
          <ProductCarouselSection
            key={option}
            title={label}
            viewAllSearch={`?pub_categoryLevel1=Baby-Clothes-Accessories&pub_age_group=${option}`}
            products={ageProducts[option] || []}
            isLoading={isLoading}
          />
        ))}
      </div>
      <div className={css.viewAll}>
        <Link to="/categories/Baby-Clothes-Accessories" className={css.viewAllButton}>
          <FormattedMessage id="MelaHomePage.seeAllAges" defaultMessage="See all ages →" />
        </Link>
      </div>
    </div>
  );
};

/**
 * CategorySection - Product-first category display
 * Shows category header followed by a grid of real product listings
 */
const CategorySection = ({ category, products, isLoading, index }) => {
  const hasProducts = products && products.length > 0;

  return (
    <div className={css.categorySection}>
      {/* Category Header */}
      <div className={css.categorySectionHeader}>
        <div className={css.categoryHeaderContent}>
          <h3 className={css.sectionCategoryTitle}>{category.name}</h3>
          <p className={css.sectionCategoryDescription}>
            {category.subcategories && category.subcategories.length > 0
              ? category.subcategories.slice(0, 3).map(sub => sub.name).join(' • ')
              : `Explore our ${category.name.toLowerCase()} collection`}
          </p>
        </div>
        <Link
          to={`/categories/Baby-Kids/${category.id}`}
          className={css.viewCategoryLink}
        >
          <FormattedMessage
            id="MelaHomePage.viewAll"
            defaultMessage="View All"
          />
          <span className={css.arrow}>→</span>
        </Link>
      </div>

      {/* Product Carousel (mobile swipe) / Grid (desktop) */}
      {isLoading ? (
        <div className={css.productCarousel}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`${css.productSkeleton} ${css.carouselCard}`} />
          ))}
        </div>
      ) : hasProducts ? (
        <div className={css.productCarousel}>
          {products.map((listing, productIndex) => (
            <div key={listing.id.uuid} className={css.carouselCard}>
            <ListingCard
              listing={listing}
              showAuthorInfo={false}
              showTrustBadges={true}
              showConversionBadges={true}
              isBestseller={productIndex === 0}
              renderSizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
            />
            </div>
          ))}
        </div>
      ) : (
        <div className={css.noProducts}>
          <p>
            <FormattedMessage
              id="MelaHomePage.noProducts"
              defaultMessage="No products available in this category yet."
            />
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryShowcase;