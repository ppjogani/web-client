import React from 'react';
import { FormattedMessage } from '../../../../util/reactIntl';
import { NamedLink, CertificationBadge } from '../../../../components';

import css from './TrustAssurance.module.css';

// certification prop values match CertificationBadge / certificationIcons.js keys
const CERTIFICATIONS = [
  { id: 'gots_certified',  description: 'Global Organic Textile Standard' },
  { id: 'organic_cotton',  description: 'Certified Organic Materials' },
  { id: 'oeko_tex',        description: 'Tested for harmful substances' },
  { id: 'eco_friendly',    description: 'Sustainable Manufacturing' },
];

const SECURITY_FEATURES = [
  {
    icon: '🛍️',
    title: 'Transact on Brand Sites',
    description: "Purchase securely on each brand's own Shopify store — trusted payment infrastructure",
  },
  {
    icon: '📦',
    title: 'Direct from Brands',
    description: 'Products ship directly from verified Indian brand partners to your door',
  },
  {
    icon: '↩️',
    title: 'Brand Return Policies',
    description: "Each partner brand's return policy applies — we help you navigate it",
  },
  {
    icon: '✅',
    title: 'Mela Curation Promise',
    description: 'Every brand on Mela is hand-vetted for quality, authenticity, and values',
  },
];

const QUALITY_GUARANTEES = [
  {
    title: 'Premium Quality',
    description: 'Every product is hand-selected from brands with a proven quality track record',
    icon: '✨',
  },
  {
    title: 'Trusted Indian Brands',
    description: 'We partner only with verified Indian brands known for craftsmanship and integrity',
    icon: '🤝',
  },
  {
    title: 'Sustainably Made',
    description: 'Eco-friendly materials, ethical production, and responsible supply chains',
    icon: '🌱',
  },
];

const TrustAssurance = () => {
  return (
    <div className={css.trust}>
      <div className={css.container}>
        {/* Section Header */}
        <div className={css.header}>
          <h2 className={css.title}>
            <FormattedMessage
              id="MelaHomePage.trustTitle"
              defaultMessage="Why Families Trust Mela"
            />
          </h2>
          <p className={css.subtitle}>
            <FormattedMessage
              id="MelaHomePage.trustSubtitle"
              defaultMessage="Your peace of mind is our priority - from quality to delivery"
            />
          </p>
        </div>

        {/* Quality Guarantees */}
        <div className={css.guarantees}>
          <h3 className={css.sectionTitle}>
            <FormattedMessage
              id="MelaHomePage.qualityGuarantees"
              defaultMessage="Our Quality Promise"
            />
          </h3>
          <div className={css.guaranteeGrid}>
            {QUALITY_GUARANTEES.map((guarantee, index) => (
              <div key={index} className={css.guaranteeCard}>
                <span className={css.guaranteeIcon}>{guarantee.icon}</span>
                <h4 className={css.guaranteeTitle}>{guarantee.title}</h4>
                <p className={css.guaranteeDescription}>{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className={css.certifications}>
          <h3 className={css.sectionTitle}>
            <FormattedMessage
              id="MelaHomePage.certifications"
              defaultMessage="Safety & Sustainability Certifications"
            />
          </h3>
          <div className={css.certGrid}>
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.id} className={css.certCard}>
                <CertificationBadge
                  certification={cert.id}
                  variant="default"
                  size={32}
                  showTooltip={false}
                  className={css.certLogo}
                />
                <div className={css.certInfo}>
                  <p className={css.certDescription}>{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className={css.security}>
          <h3 className={css.sectionTitle}>
            <FormattedMessage
              id="MelaHomePage.securityFeatures"
              defaultMessage="Shopping with Confidence"
            />
          </h3>
          <div className={css.securityGrid}>
            {SECURITY_FEATURES.map((feature, index) => (
              <div key={index} className={css.securityCard}>
                <span className={css.securityIcon}>{feature.icon}</span>
                <div className={css.securityInfo}>
                  <h4 className={css.securityTitle}>{feature.title}</h4>
                  <p className={css.securityDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Service CTA */}
        <div className={css.customerService}>
          <div className={css.serviceContent}>
            <h3 className={css.serviceTitle}>
              <FormattedMessage
                id="MelaHomePage.customerServiceTitle"
                defaultMessage="Need Help? We're Here for You"
              />
            </h3>
            <p className={css.serviceDescription}>
              <FormattedMessage
                id="MelaHomePage.customerServiceDescription"
                defaultMessage="Our expert team is ready to help with sizing, product questions, or anything else you need"
              />
            </p>
            <div className={css.serviceButtons}>
              <NamedLink
                name="ContactDetailsPage"
                className={css.contactButton}
              >
                <FormattedMessage
                  id="MelaHomePage.contactUs"
                  defaultMessage="Contact Us"
                />
              </NamedLink>
              <NamedLink
                name="SearchPage"
                className={css.helpButton}
              >
                <FormattedMessage
                  id="MelaHomePage.helpCenter"
                  defaultMessage="Help Center"
                />
              </NamedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustAssurance;