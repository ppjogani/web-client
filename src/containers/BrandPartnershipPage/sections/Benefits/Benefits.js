import React, { useState } from 'react';
import { H2, H3 } from '../../../../components';
import css from './Benefits.module.css';

const Benefits = () => {
  const [activeCard, setActiveCard] = useState(0);

  const benefits = [
    {
      icon: "💰",
      title: "Zero Risk Start",
      headline: "No upfront costs",
      description: "Start selling with zero investment. No listing fees, no monthly costs, no setup charges.",
      details: [
        "Performance-based fees only",
        "No hidden charges",
        "Scale at your own pace",
        "Cancel anytime"
      ],
      color: "#10b981"
    },
    {
      icon: "🎯",
      title: "Targeted Market",
      headline: "Indian diaspora families",
      description: "Connect with Indian families in the USA who value authentic products for their children.",
      details: [
        "4.5M Indian Americans",
        "$126K median income",
        "Strong cultural connection",
        "Growing market demand"
      ],
      color: "#3b82f6"
    },
    {
      icon: "🚀",
      title: "Marketing Boost",
      headline: "We drive the traffic",
      description: "Focus on your products while we handle customer acquisition and marketing campaigns.",
      details: [
        "Targeted marketing",
        "Social media promotion",
        "Influencer partnerships",
        "Community engagement"
      ],
      color: "#8b5cf6"
    },
    {
      icon: "🛡️",
      title: "Risk-Free Start",
      headline: "No upfront investment",
      description: "Complete protection with our performance-based model. You only pay when you succeed.",
      details: [
        "Zero upfront costs",
        "No monthly fees",
        "Performance-based only",
        "Cancel anytime"
      ],
      color: "#10b981"
    },
    {
      icon: "🌍",
      title: "Global Expansion",
      headline: "Beyond just the USA",
      description: "Partner now for the USA and get early access to our expansion into Europe, Middle East, and Australia.",
      details: [
        "Multi-market access",
        "First-mover advantage",
        "Reduced expansion risk",
        "Shared growth strategy"
      ],
      color: "#f59e0b"
    },
    {
      icon: "📊",
      title: "Business Insights",
      headline: "Data-driven growth",
      description: "Get detailed analytics about your customers, sales patterns, and market opportunities.",
      details: [
        "Sales analytics",
        "Customer insights",
        "Market trends",
        "Growth recommendations"
      ],
      color: "#ef4444"
    },
    {
      icon: "🤝",
      title: "Partnership Support",
      headline: "We succeed together",
      description: "Dedicated support team, business guidance, and shared success metrics align our interests.",
      details: [
        "Dedicated account manager",
        "Business consultation",
        "Technical support",
        "Growth planning"
      ],
      color: "#06b6d4"
    }
  ];

  const nextCard = () => {
    setActiveCard((prev) => (prev + 1) % benefits.length);
  };

  const prevCard = () => {
    setActiveCard((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.header}>
          <H2 className={css.title}>Why Partner with Mela?</H2>
          <p className={css.subtitle}>
            Everything you need to succeed in the US market
          </p>
        </div>

        {/* Mobile: Swipeable cards */}
        <div className={css.mobileCarousel}>
          <div className={css.carouselContainer}>
            <div
              className={css.carouselTrack}
              style={{ transform: `translateX(-${activeCard * 100}%)` }}
            >
              {benefits.map((benefit, index) => (
                <div key={index} className={css.benefitCard}>
                  <div
                    className={css.cardIcon}
                    style={{ backgroundColor: benefit.color }}
                  >
                    {benefit.icon}
                  </div>
                  <H3 className={css.cardTitle}>{benefit.title}</H3>
                  <div className={css.cardHeadline}>{benefit.headline}</div>
                  <p className={css.cardDescription}>{benefit.description}</p>
                  <ul className={css.cardDetails}>
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className={css.carouselNav}>
            <button
              className={css.navButton}
              onClick={prevCard}
              disabled={activeCard === 0}
            >
              ←
            </button>
            <div className={css.indicators}>
              {benefits.map((_, index) => (
                <button
                  key={index}
                  className={`${css.indicator} ${index === activeCard ? css.active : ''}`}
                  onClick={() => setActiveCard(index)}
                />
              ))}
            </div>
            <button
              className={css.navButton}
              onClick={nextCard}
              disabled={activeCard === benefits.length - 1}
            >
              →
            </button>
          </div>

        </div>

        {/* Tablet/Desktop: Grid layout */}
        <div className={css.desktopGrid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={css.desktopBenefitCard}>
              <div
                className={css.desktopCardIcon}
                style={{ backgroundColor: benefit.color }}
              >
                {benefit.icon}
              </div>
              <H3 className={css.desktopCardTitle}>{benefit.title}</H3>
              <div className={css.desktopCardHeadline}>{benefit.headline}</div>
              <p className={css.desktopCardDescription}>{benefit.description}</p>
              <ul className={css.desktopCardDetails}>
                {benefit.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className={css.ctaSection}>
          <div className={css.ctaCard}>
            <div className={css.ctaIcon}>⚡</div>
            <div className={css.ctaContent}>
              <H3 className={css.ctaTitle}>Ready to Start?</H3>
              <p className={css.ctaDescription}>
                Be among the founding partners building this marketplace together
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;