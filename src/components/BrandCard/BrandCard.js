import React from 'react';
import { string, number, bool, arrayOf, shape } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage, useIntl } from '../../util/reactIntl';
import { NamedLink, ResponsiveImage } from '../../components';

import css from './BrandCard.module.css';

/**
 * BrandCertificationBadges
 * Component to render certification badges for brand cards
 * @param {Object} props
 * @param {Array<string>} props.certifications array of certification keys
 */
const BrandCertificationBadges = props => {
  const { certifications = [] } = props;

  if (!certifications || certifications.length === 0) {
    return null;
  }

  // Map certification values to display labels
  const certificationLabels = {
    gots_certified: 'GOTS',
    non_toxic_dyes: 'Non-toxic',
    bis_approved: 'BIS',
    organic_cotton: 'Organic',
    handcrafted: 'Handcrafted',
    fair_trade: 'Fair Trade',
    women_owned: 'Women-Owned',
  };

  // Show first certification as primary badge
  const primaryCert = certifications[0];
  const label = certificationLabels[primaryCert] || primaryCert;

  return (
    <div className={css.certificationBadge} title={label}>
      {label}
    </div>
  );
};

/**
 * BrandCard component
 * Displays a brand card with logo, name, certifications, and product count
 *
 * @param {Object} props
 * @param {Object} props.brand - Brand user entity
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.rootClassName - Root CSS class
 */
const BrandCard = props => {
  const { brand, className = null, rootClassName = null } = props;
  const intl = useIntl();

  if (!brand || !brand.id) {
    return null;
  }

  const classes = classNames(rootClassName || css.root, className);

  const { displayName, bio, publicData } = brand.attributes?.profile || {};
  const {
    isFeaturedBrand = false,
    certifications = [],
    brandLogoUrl,
  } = publicData || {};

  // Listing count is in user-level metadata, not profile metadata
  const listingCount = brand.attributes?.metadata?.listingCount || 0;
  const profileImage = brand.profileImage;

  // Debug: Check what data we have
  console.log('Brand data for', displayName, {
    hasMetadata: !!brand.attributes?.metadata,
    metadata: brand.attributes?.metadata,
    listingCount,
    fullBrand: brand,
  });

  // Use profile image or brandLogoUrl as fallback
  const logoSrc = brandLogoUrl || profileImage?.attributes?.variants?.['square-small']?.url;

  // Create slug from displayName for URL
  const slug = displayName
    ? displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : brand.id.uuid;

  // Extract first sentence from bio as tagline
  const tagline = bio ? bio.split('.')[0].substring(0, 80) : '';

  // Link to user profile page
  const linkTo = `/u/${brand.id.uuid}`;

  const productCountMessage = intl.formatMessage(
    { id: 'BrandCard.productCountAvailable' },
    { count: listingCount }
  );

  return (
    <NamedLink name="ProfilePage" params={{ id: brand.id.uuid }} className={classes}>
      <div className={css.imageWrapper}>
        {logoSrc ? (
          <div className={css.logoContainer}>
            <img src={logoSrc} alt={`${displayName} logo`} className={css.logo} />
          </div>
        ) : (
          <div className={css.logoPlaceholder}>
            <span className={css.logoInitial}>{displayName?.charAt(0) || 'B'}</span>
          </div>
        )}

        {/* Certification badge (top-left) */}
        <BrandCertificationBadges certifications={certifications} />

        {/* Featured badge (top-right) */}
        {isFeaturedBrand && (
          <div className={css.featuredBadge}>
            <FormattedMessage id="BrandCard.featuredBadge" />
          </div>
        )}
      </div>

      <div className={css.info}>
        <h3 className={css.brandName}>{displayName}</h3>

        {tagline && <p className={css.tagline}>{tagline}</p>}

        <div className={css.footer}>
          <span className={css.productCount}>{productCountMessage}</span>
        </div>
      </div>
    </NamedLink>
  );
};


BrandCard.propTypes = {
  brand: shape({
    id: shape({
      uuid: string.isRequired,
    }).isRequired,
    attributes: shape({
      profile: shape({
        displayName: string,
        bio: string,
        publicData: shape({
          isFeaturedBrand: bool,
          certifications: arrayOf(string),
          brandLogoUrl: string,
        }),
        metadata: shape({
          listingCount: number,
        }),
      }),
    }),
  }).isRequired,
  className: string,
  rootClassName: string,
};

export default BrandCard;
