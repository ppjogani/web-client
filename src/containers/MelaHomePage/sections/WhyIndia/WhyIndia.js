import React from 'react';
import { FormattedMessage } from '../../../../util/reactIntl';
import { NamedLink } from '../../../../components';

import css from './WhyIndia.module.css';

const PILLARS = [
  {
    icon: '🧵',
    titleId: 'WhyIndia.craftTitle',
    defaultTitle: 'Centuries of Craft',
    descId: 'WhyIndia.craftDesc',
    defaultDesc: 'Indian artisans have refined textile traditions for over 5,000 years — from hand-block printing to intricate embroidery passed down through generations.',
  },
  {
    icon: '🌿',
    titleId: 'WhyIndia.sustainTitle',
    defaultTitle: 'Rooted in Sustainability',
    descId: 'WhyIndia.sustainDesc',
    defaultDesc: 'Natural fibres, GOTS certified organic cotton, and low-impact dyes are the foundation — not a trend. Indian design has always worked with the land, not against it.',
  },
  {
    icon: '🎨',
    titleId: 'WhyIndia.designTitle',
    defaultTitle: 'Bold, Joyful Design',
    descId: 'WhyIndia.designDesc',
    defaultDesc: 'Vibrant colours, playful motifs, and cultural storytelling make every piece a conversation — not just clothing. Indian design celebrates life at every stage.',
  },
];

const WhyIndia = () => {
  return (
    <div className={css.whyIndia}>
      <div className={css.container}>
        <div className={css.header}>
          <h2 className={css.title}>
            <FormattedMessage
              id="WhyIndia.title"
              defaultMessage="Why Indian Design?"
            />
          </h2>
          <p className={css.subtitle}>
            <FormattedMessage
              id="WhyIndia.subtitle"
              defaultMessage="For families who want products with meaning — not just merchandise."
            />
          </p>
        </div>

        <div className={css.pillars}>
          {PILLARS.map((pillar, index) => (
            <div key={index} className={css.pillar}>
              <span className={css.pillarIcon}>{pillar.icon}</span>
              <h3 className={css.pillarTitle}>
                <FormattedMessage id={pillar.titleId} defaultMessage={pillar.defaultTitle} />
              </h3>
              <p className={css.pillarDesc}>
                <FormattedMessage id={pillar.descId} defaultMessage={pillar.defaultDesc} />
              </p>
            </div>
          ))}
        </div>

        <div className={css.cta}>
          <NamedLink name="SearchPage" className={css.ctaLink}>
            <FormattedMessage id="WhyIndia.cta" defaultMessage="Explore Indian Brands" />
          </NamedLink>
        </div>
      </div>
    </div>
  );
};

export default WhyIndia;
