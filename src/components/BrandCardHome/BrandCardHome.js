import React from 'react';
import { string, arrayOf, shape, func, number } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from '../../util/reactIntl';
import { NamedLink } from '../../components';
import { ListingCardMini } from '../ListingCardMini/ListingCardMini';

import css from './BrandCardHome.module.css';

/**
 * BrandCardHome - Enhanced BrandCard for homepage with trust indicators
 * Extends the Shop-style BrandCard with verification badges, ratings, and taglines
 *
 * @param {Object} props
 * @param {Object} props.brand - Brand user entity
 * @param {Array} props.products - Array of listing entities (up to 4)
 * @param {Function} props.onFavorite - Callback when favorite button clicked
 * @param {number} props.rating - Brand rating (optional)
 * @param {number} props.reviewCount - Number of reviews (optional)
 * @param {number} props.customerCount - Number of customers (optional)
 * @param {string} props.className - Additional CSS class
 * @param {string} props.rootClassName - Root CSS class override
 */
const BrandCardHome = props => {
  const {
    brand,
    products = [],
    onFavorite,
    rating,
    reviewCount,
    customerCount,
    className = null,
    rootClassName = null,
  } = props;

  if (!brand || !brand.id) {
    return null;
  }

  const classes = classNames(rootClassName || css.root, className);

  const { displayName, bio, publicData } = brand.attributes?.profile || {};
  const { certifications = [] } = publicData || {};
  const profileImage = brand.profileImage;

  const logoSrc =
    publicData?.brandLogoUrl || profileImage?.attributes?.variants?.['square-small']?.url;

  const logoInitial = displayName?.charAt(0) || 'B';

  // Extract first sentence from bio as tagline (max 60 chars)
  const tagline = bio
    ? bio.split('.')[0].substring(0, 60) + (bio.split('.')[0].length > 60 ? '...' : '')
    : null;

  // Show up to 4 products in 2x2 grid
  const featuredProducts = products.slice(0, 4);

  // Fill with placeholders if less than 4
  const gridProducts = [...featuredProducts];
  while (gridProducts.length < 4) {
    gridProducts.push(null); // Placeholder
  }

  // Determine if we have trust indicators
  const hasTrustIndicators = rating || customerCount;

  return (
    <div className={classes}>
      {/* Header */}
      <div className={css.header}>
        <div className={css.brandInfo}>
          {logoSrc ? (
            <img src={logoSrc} alt={displayName} className={css.smallLogo} />
          ) : (
            <div className={css.logoPlaceholder}>{logoInitial}</div>
          )}
          <div className={css.brandText}>
            <h3 className={css.brandName}>{displayName}</h3>
            {tagline && <p className={css.tagline}>{tagline}</p>}
          </div>
        </div>
      </div>

      {/* Certification Badge */}
      {certifications.length > 0 && (
        <div className={css.certBadge}>
          {certifications[0] === 'gots_certified' ? 'GOTS' : certifications[0]}
        </div>
      )}

      {/* Trust Indicators */}
      {hasTrustIndicators && (
        <div className={css.trustIndicators}>
          <div className={css.verifiedBadge}>
            <FormattedMessage id="BrandCardHome.verifiedPartner" />
          </div>
          <div className={css.trustStats}>
            {rating && (
              <span className={css.rating}>
                ⭐ {rating.toFixed(1)}
                {reviewCount && ` (${reviewCount})`}
              </span>
            )}
            {customerCount && (
              <span className={css.customers}>
                <FormattedMessage
                  id="BrandCardHome.customerCount"
                  values={{ count: customerCount }}
                />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Product Grid (2x2) */}
      <div className={css.productGrid}>
        {gridProducts.map((product, index) =>
          product ? (
            <ListingCardMini
              key={product.id.uuid}
              listing={product}
              onFavorite={onFavorite}
              showFavorite={true}
            />
          ) : (
            <div key={`placeholder-${index}`} className={css.productPlaceholder}>
              <FormattedMessage id="BrandCard.noProduct" />
            </div>
          )
        )}
      </div>

      {/* Shop All CTA */}
      <NamedLink name="ProfilePage" params={{ id: brand.id.uuid }} className={css.cta}>
        <span className={css.ctaText}>
          <FormattedMessage id="BrandCard.shopAll" />
        </span>
        <span className={css.ctaArrow}>→</span>
      </NamedLink>
    </div>
  );
};

BrandCardHome.propTypes = {
  brand: shape({
    id: shape({
      uuid: string.isRequired,
    }).isRequired,
  }).isRequired,
  products: arrayOf(
    shape({
      id: shape({
        uuid: string.isRequired,
      }).isRequired,
    })
  ),
  onFavorite: func,
  rating: number,
  reviewCount: number,
  customerCount: number,
  className: string,
  rootClassName: string,
};

// Memoize to prevent unnecessary re-renders
export default React.memo(BrandCardHome, (prevProps, nextProps) => {
  return (
    prevProps.brand.id.uuid === nextProps.brand.id.uuid &&
    prevProps.products.length === nextProps.products.length &&
    prevProps.rating === nextProps.rating
  );
});
