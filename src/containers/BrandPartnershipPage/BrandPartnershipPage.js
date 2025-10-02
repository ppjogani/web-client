import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useIntl } from '../../util/reactIntl';
import { useConfiguration } from '../../context/configurationContext';

import {
  Page,
  LayoutSingleColumn,
  H2,
  Button,
  ExternalLink,
} from '../../components';

import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

// Import responsive landing page sections
import Hero from './sections/Hero/Hero';
import MarketOpportunity from './sections/MarketOpportunity/MarketOpportunity';
import WhyClothing from './sections/WhyClothing/WhyClothing';
import Benefits from './sections/Benefits/Benefits';
import Process from './sections/Process/Process';
import MarketTiming from './sections/MarketTiming/MarketTiming';
import PartnershipPhilosophy from './sections/PartnershipPhilosophy/PartnershipPhilosophy';
import SuccessStories from './sections/SuccessStories/SuccessStories';
import FAQ from './sections/FAQ/FAQ';

import css from './BrandPartnershipPage.module.css';

const BrandPartnershipPageComponent = () => {
  const intl = useIntl();
  const config = useConfiguration();

  // Form URLs - these can be configured externally
  const clothingFormUrl = config.brandPartnership?.clothingFormUrl || 'https://forms.google.com/clothing-partnership';
  const waitlistFormUrl = config.brandPartnership?.waitlistFormUrl || 'https://forms.google.com/category-waitlist';

  const handleFormClick = (formUrl, formType) => {
    // Track analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_click', {
        event_category: 'Brand Partnership',
        event_label: formType,
        value: 1
      });
    }

    // Open form in new tab
    window.open(formUrl, '_blank', 'noopener,noreferrer');
  };

  const schemaTitle = 'Partner with Mela: Build US Export Marketplace for Indian Baby Brands';
  const schemaDescription = 'Join Mela as a founding partner. Build the US export marketplace together. Zero listing fees, performance-based partnership. Baby clothing & accessories brands apply now.';

  // SEO Keywords for Indian baby clothing export market (updated with tariff resilience)
  const keywords = 'Indian baby clothing export, US marketplace partnership, baby clothing brands, Indian clothing export, diaspora market, baby accessories export, performance-based partnership, zero listing fees, Indian clothing USA, baby clothing wholesale, export partnership program, tariff resilient marketplace, global expansion platform, regulatory uncertainty partnership';

  return (
    <Page
      title={schemaTitle}
      description={schemaDescription}
      keywords={keywords}
      robots="index, follow, max-image-preview:large"
      openGraphType="website"
      schema={[
        {
          '@context': 'http://schema.org',
          '@type': 'WebPage',
          name: schemaTitle,
          description: schemaDescription,
          keywords: keywords,
          mainEntity: {
            '@type': 'Organization',
            name: 'Mela',
            description: 'Premium marketplace for authentic Indian baby clothing in the USA'
          }
        },
        {
          '@context': 'http://schema.org',
          '@type': 'Service',
          name: 'Mela Brand Partnership Program',
          description: 'Export partnership program for Indian baby clothing brands to reach US diaspora families',
          provider: {
            '@type': 'Organization',
            name: 'Mela'
          },
          areaServed: 'United States',
          serviceType: 'Export Marketplace Partnership',
          offers: {
            '@type': 'Offer',
            name: 'Zero Listing Fees Partnership',
            description: 'Performance-based partnership with no upfront costs',
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: '0',
              priceCurrency: 'USD',
              description: 'No listing fees - performance based only'
            }
          }
        },
        {
          '@context': 'http://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What are the requirements to partner with Mela?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We partner with established Indian baby clothing brands that have quality products, manufacturing capabilities, and commitment to authentic Indian designs.'
              }
            },
            {
              '@type': 'Question',
              name: 'Are there any upfront fees?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No, Mela operates on a performance-based model with zero listing fees. We only succeed when our partners succeed.'
              }
            },
            {
              '@type': 'Question',
              name: 'What categories does Mela currently accept?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We are currently accepting baby clothing and accessories brands. Other categories will be available through our waitlist program.'
              }
            }
          ]
        }
      ]}
    >
      <LayoutSingleColumn
        topbar={<TopbarContainer />}
        footer={<FooterContainer />}
        className={css.pageRoot}
      >
        {/* Hero Section */}
        <Hero onFormClick={handleFormClick} clothingFormUrl={clothingFormUrl} waitlistFormUrl={waitlistFormUrl} />

        {/* Market Opportunity Overview */}
        <MarketOpportunity />

        {/* Why Baby Clothing Focus */}
        <WhyClothing />

        {/* Benefits Overview */}
        <Benefits />

        {/* Partnership Process */}
        <Process />

        {/* Market Timing Advantage */}
        <MarketTiming />

        {/* Partnership Philosophy */}
        <PartnershipPhilosophy />

        {/* Success Stories */}
        <SuccessStories />

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <section className={css.finalCta}>
          <div className={css.container}>
            <H2 className={css.ctaTitle}>Ready to Reach Millions of US Families?</H2>
            <p className={css.ctaDescription}>
              Join our founding partnership program and start growing your brand in the US market with zero risk.
            </p>
            <div className={css.ctaButtons}>
              <Button
                className={css.primaryCtaButton}
                onClick={() => handleFormClick(clothingFormUrl, 'clothing_application')}
              >
                Sign Up to Export Baby Clothing
              </Button>
              <Button
                className={css.secondaryCtaButton}
                onClick={() => handleFormClick(waitlistFormUrl, 'waitlist_application')}
              >
                Join Waitlist (Other Categories)
              </Button>
            </div>
          </div>
        </section>
      </LayoutSingleColumn>
    </Page>
  );
};

const BrandPartnershipPage = compose(
  connect(
    null,
    null
  )
)(BrandPartnershipPageComponent);

export default BrandPartnershipPage;