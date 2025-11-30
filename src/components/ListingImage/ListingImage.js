import React from 'react';
import { lazyLoadWithDimensions } from '../../util/uiHelpers';
import { AspectRatioWrapper, ResponsiveImage } from '../../components';

const LazyImage = lazyLoadWithDimensions(ResponsiveImage, {
  loadAfterInitialRendering: 3000,
});

/**
 * Shared listing image component
 * Extracted from ListingCard to be reused across ListingCard, ListingCardMini, etc.
 *
 * @param {Object} props
 * @param {Object} props.listing - Listing entity with images
 * @param {string} props.variant - Image variant prefix (e.g., 'listing-card', 'square-small')
 * @param {string} props.sizes - Responsive sizes attribute for img/srcset
 * @param {boolean} props.lazy - Whether to use lazy loading (default: true)
 * @param {number} props.aspectWidth - Aspect ratio width (default: 1)
 * @param {number} props.aspectHeight - Aspect ratio height (default: 1)
 * @param {string} props.className - Additional CSS class for wrapper
 * @param {string} props.alt - Custom alt text (auto-generated if not provided)
 */
export const ListingImage = ({
  listing,
  variant = 'listing-card',
  sizes,
  lazy = true,
  aspectWidth = 1,
  aspectHeight = 1,
  className,
  alt,
}) => {
  const firstImage =
    listing.images && listing.images.length > 0 ? listing.images[0] : null;

  if (!firstImage) {
    return null;
  }

  // Get variants - prefer variant-specific, fall back to all variants if none match
  const availableVariants = Object.keys(firstImage.attributes?.variants || {});
  const prefixedVariants = availableVariants.filter(k => k.startsWith(variant));
  const variants = prefixedVariants.length > 0 ? prefixedVariants : availableVariants;

  const ImageComponent = lazy ? LazyImage : ResponsiveImage;

  // Generate alt text if not provided
  const altText = alt || `${listing.attributes.title} - organic baby product`;

  return (
    <AspectRatioWrapper className={className} width={aspectWidth} height={aspectHeight}>
      <ImageComponent alt={altText} image={firstImage} variants={variants} sizes={sizes} />
    </AspectRatioWrapper>
  );
};

export default ListingImage;
