import React, { useState } from 'react';
import { H2, H3 } from '../../../../components';
import css from './WhyClothing.module.css';

const WhyClothing = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      title: 'Proven Demand',
      icon: '📈',
      highlights: [
        'Highest search volume',
        'Strong cultural connection',
        'Festival demand',
        'Easy shipping'
      ],
      details: [
        'Highest search volume: "Indian baby clothes USA"',
        'Strong emotional connection to cultural heritage',
        'Parents want authentic traditional outfits for festivals',
        'Low friction: lightweight, easy international shipping',
        'Visual appeal drives social sharing'
      ]
    },
    {
      title: 'Clear Value Proposition',
      icon: '💎',
      highlights: [
        'Unique designs',
        'Quality materials',
        'Festival urgency',
        'Perfect price point'
      ],
      details: [
        'Unique designs not available in US retail',
        'Quality fabrics and safe materials stand out',
        'Festival/occasion wear creates urgency',
        'Price point suitable for online purchase',
        'Easy to showcase through photography'
      ]
    },
    {
      title: 'Strategic Partnership',
      icon: '🤝',
      highlights: [
        'Focused expertise',
        'Better SEO',
        'Premium positioning',
        'Learn together'
      ],
      details: [
        'Focused category = deeper expertise together',
        'Better SEO targeting and content quality',
        'Strong brand partnerships vs. scattered inventory',
        'Prove model before expanding categories',
        'Build community around specific need',
        'Learn together what works in US market'
      ]
    }
  ];

  const nextPillar = () => {
    setActivePillar((prev) => (prev + 1) % pillars.length);
  };

  const prevPillar = () => {
    setActivePillar((prev) => (prev - 1 + pillars.length) % pillars.length);
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.header}>
          <H2 className={css.sectionTitle}>
            Why Baby Clothing? Because We're Proving the Market Together, One Category at a Time.
          </H2>
          <p className={css.sectionSubtitle}>
            Strategic focus on a proven category with massive demand and cultural significance
          </p>
        </div>

        <div className={css.pillarSection}>

          <div className={css.pillarCard}>
            <div className={css.pillarIcon}>
              {pillars[activePillar].icon}
            </div>
            <H3 className={css.pillarTitle}>
              {pillars[activePillar].title}
            </H3>

            {/* Quick highlights for mobile scanning */}
            <div className={css.highlightGrid}>
              {pillars[activePillar].highlights.map((highlight, index) => (
                <div key={index} className={css.highlight}>
                  <span className={css.checkmark}>✓</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Detailed points */}
            <div className={css.detailsList}>
              {pillars[activePillar].details.map((detail, index) => (
                <div key={index} className={css.detail}>
                  <span className={css.bullet}>•</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className={css.navigation}>
            <button
              className={css.navButton}
              onClick={prevPillar}
              disabled={activePillar === 0}
              aria-label="Previous pillar"
            >
              ←
            </button>
            <button
              className={css.navButton}
              onClick={nextPillar}
              disabled={activePillar === pillars.length - 1}
              aria-label="Next pillar"
            >
              →
            </button>
          </div>

          {/* Page Indicators */}
          <div className={css.indicators}>
            {pillars.map((_, index) => (
              <button
                key={index}
                className={`${css.indicator} ${index === activePillar ? css.active : ''}`}
                onClick={() => setActivePillar(index)}
                aria-label={`Go to pillar ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <div className={css.statsSection}>
          <H3 className={css.statsTitle}>Baby Clothing Market Facts</H3>
          <div className={css.statsGrid}>
            <div className={css.statCard}>
              <div className={css.statIcon}>👶</div>
              <div className={css.statNumber}>200K+</div>
              <div className={css.statLabel}>Indian babies born in US annually</div>
            </div>
            <div className={css.statCard}>
              <div className={css.statIcon}>🔍</div>
              <div className={css.statNumber}>#1</div>
              <div className={css.statLabel}>Search volume for "Indian baby clothes"</div>
            </div>
            <div className={css.statCard}>
              <div className={css.statIcon}>🏪</div>
              <div className={css.statNumber}>0</div>
              <div className={css.statLabel}>Indian specialty retailers in US</div>
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className={css.visionSection}>
          <div className={css.visionIcon}>🚀</div>
          <H3 className={css.visionTitle}>Start with Baby Clothes, Expand Together</H3>
          <p className={css.visionDescription}>
            Starting with baby and children's clothing to prove the model, then expanding to home goods and beyond.
            Our founding partners get first access to every new category we launch.
          </p>
          <div className={css.expansionPath}>
            <span className={css.pathStep}>Baby & Children's Clothing (NOW)</span>
            <span className={css.pathArrow}>→</span>
            <span className={css.pathStep}>Home & Lifestyle</span>
            <span className={css.pathArrow}>→</span>
            <span className={css.pathStep}>Other Categories</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyClothing;