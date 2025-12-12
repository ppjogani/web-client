import React, { useState } from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { H4 } from '../../components';
import { richText } from '../../util/richText';
import classNames from 'classnames';

import css from './BrandStorySection.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 20;

/**
 * BrandStorySection - Progressive disclosure for long brand stories
 *
 * UX Pattern: "Read More" expansion
 * - Desktop: Show 3-4 lines (~250 chars), expand inline
 * - Mobile: Show 2-3 lines (~150 chars), expand inline
 * - SEO: Full content in DOM (hidden with CSS)
 *
 * Content Guidelines:
 * - Preview should end at natural sentence break
 * - "Read More" vs "Show More" (Read = narrative content)
 * - "Read Less" vs "Show Less" (symmetric language)
 *
 * @param {Object} props
 * @param {string} props.bio - Full brand story text
 * @param {number} props.previewLength - Characters to show before truncation (default: 300)
 * @param {boolean} props.isOwnProfile - True if viewing own profile
 */
const BrandStorySection = ({ bio, previewLength = 300, isOwnProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!bio) return null;

  // Calculate preview text
  const shouldTruncate = bio.length > previewLength;

  // Smart truncation: Find last sentence break before previewLength
  const findLastSentence = (text, maxLength) => {
    if (text.length <= maxLength) return text;

    const preview = text.substring(0, maxLength);
    const lastPeriod = preview.lastIndexOf('.');
    const lastExclamation = preview.lastIndexOf('!');
    const lastQuestion = preview.lastIndexOf('?');

    const sentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);

    // If we found a sentence end, use it; otherwise cut at word boundary
    if (sentenceEnd > maxLength * 0.7) {
      return text.substring(0, sentenceEnd + 1).trim();
    }

    // Fallback: Cut at last space
    const lastSpace = preview.lastIndexOf(' ');
    return text.substring(0, lastSpace > 0 ? lastSpace : maxLength).trim() + '...';
  };

  const previewText = shouldTruncate ? findLastSentence(bio, previewLength) : bio;
  const fullText = bio;

  // Rich text formatting for display
  const displayText = isExpanded ? fullText : previewText;
  const formattedText = richText(displayText, {
    linkify: true,
    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
    longWordClass: css.longWord,
  });

  return (
    <div className={css.brandStory}>
      <H4 className={css.sectionSubtitle}>
        <FormattedMessage id="BrandStorefront.ourStory" />
      </H4>

      <div className={classNames(css.storyContent, {
        [css.storyExpanded]: isExpanded,
        [css.storyCollapsed]: !isExpanded && shouldTruncate,
      })}>
        {formattedText}
      </div>

      {shouldTruncate && (
        <button
          className={css.readMoreButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <FormattedMessage
            id={isExpanded ? 'BrandStorefront.readLess' : 'BrandStorefront.readMore'}
          />
          <span className={css.readMoreIcon} aria-hidden="true">
            {isExpanded ? '↑' : '↓'}
          </span>
        </button>
      )}

      {/* Helper for brand owners */}
      {isOwnProfile && bio.length < 200 && (
        <div className={css.contentTip}>
          <span className={css.tipIcon}>💡</span>
          <FormattedMessage
            id="BrandStorefront.storyTip"
            values={{ currentLength: bio.length, recommendedLength: 300 }}
          />
        </div>
      )}
    </div>
  );
};

export default BrandStorySection;
