import React from 'react';
import { string } from 'prop-types';

import { Page } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import HeroSection from './sections/HeroSection/HeroSection';
import CategoryShowcase from './sections/CategoryShowcase/CategoryShowcase';
import FeaturedBrandPartnersContainer from './sections/FeaturedBrandPartners/FeaturedBrandPartnersContainer';
import TrustAssurance from './sections/TrustAssurance/TrustAssurance';
import SavedItemsModule from './sections/SavedItems/SavedItemsModule';

import css from './MelaHomePage.module.css';

const MelaHomePage = props => {
  const { currentPage } = props;

  // SEO-optimized meta title targeting primary keywords
  const pageTitle = 'Sustainable Indian Design for Families | Baby, Fashion & More | Mela';

  // SEO-optimized meta description with target keywords
  const pageDescription = 'Discover GOTS certified organic baby clothes, Indian fashion, and home goods from innovative Indian designers. Ethically made, traditional craftsmanship, delivered worldwide.';

  // Social media sharing images
  const socialImage = 'https://sharetribe-assets.imgix.net/68ab648b-6d39-4b2b-bd2c-f99295eeb366/raw/06/5ce7d29d9cfbdfb391af7bc0a744511b9fc1c4?auto=format&fit=clip&h=800&w=800&s=f0fae1b6a833c943e3af463df9cbb484';
  const facebookImages = [{ url: socialImage, width: 800, height: 800 }];
  const twitterImages = [{ url: socialImage, width: 800, height: 800 }];

  return (
    <Page
      title={pageTitle}
      description={pageDescription}
      facebookImages={facebookImages}
      twitterImages={twitterImages}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        name: pageTitle,
        description: 'Curated marketplace for sustainable Indian design — baby clothing, fashion, home goods, and gifts from trusted Indian brands',
        mainEntity: {
          '@type': 'Store',
          name: 'Mela',
          description: 'Sustainable Indian design marketplace for families',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Indian Design & Sustainable Fashion',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Organic Baby Clothing',
                  category: 'Baby & Kids'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Indian Fashion',
                  category: 'Fashion'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: 'Indian Home Goods',
                  category: 'Home & Kitchen'
                }
              }
            ]
          }
        }
      }}
    >
      <TopbarContainer currentSearchParams={{}} />
      <div className={css.root}>
        {/* Hero Section - Product Showcase + Trust Signals */}
        <section className={css.heroSection}>
          <HeroSection />
        </section>

        {/* Saved Items Module — shows only for authenticated users with saves */}
        <SavedItemsModule />

        {/* Category Showcase - Clear Product Navigation */}
        <section className={css.categorySection}>
          <CategoryShowcase />
        </section>

        {/* Featured Brand Partners */}
        <section className={css.brandsSection}>
          <FeaturedBrandPartnersContainer />
        </section>

        {/* Trust & Quality Assurance - Certifications */}
        <section className={css.trustSection}>
          <TrustAssurance />
        </section>
      </div>
      <FooterContainer />
    </Page>
  );
};

MelaHomePage.propTypes = {
  currentPage: string,
};

export default MelaHomePage;