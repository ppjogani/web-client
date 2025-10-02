import React, { useState } from 'react';
import { H2, H3 } from '../../../../components';
import css from './PartnershipPhilosophy.module.css';

const PartnershipPhilosophy = () => {
  const [expandedComparison, setExpandedComparison] = useState(null);
  const [showCommitments, setShowCommitments] = useState(false);

  const comparisons = [
    {
      traditional: 'Brands are vendors',
      mela: 'Brands are equal partners',
      detail: 'We see you as a strategic partner, not just another supplier. Your success is our success.'
    },
    {
      traditional: 'Platform dictates terms',
      mela: 'We build strategy together',
      detail: 'Every major decision is made collaboratively with input from our brand partners.'
    },
    {
      traditional: 'One-size-fits-all',
      mela: 'Collaborative, customized approach',
      detail: 'Each brand has unique needs. We customize our approach to maximize your specific strengths.'
    },
    {
      traditional: 'Brands compete on price',
      mela: 'Brands showcase unique value',
      detail: 'We help customers understand your unique value proposition, not just compare prices.'
    },
    {
      traditional: 'Transactional relationship',
      mela: 'Long-term partnership',
      detail: 'We\'re building relationships that last decades, not just quick transactions.'
    },
    {
      traditional: 'Platform success ≠ Brand success',
      mela: 'Aligned incentives - we win when you win',
      detail: 'Our business model only works when your business thrives. Perfect alignment.'
    }
  ];

  const commitments = [
    {
      title: 'Your voice shapes platform decisions',
      icon: '🗣️',
      description: 'Regular partner feedback sessions influence our roadmap'
    },
    {
      title: 'Transparent communication and data',
      icon: '📊',
      description: 'Full access to your performance metrics and market insights'
    },
    {
      title: 'We invest in your success (marketing)',
      icon: '🎯',
      description: 'We spend our own marketing budget to drive traffic to your products'
    },
    {
      title: 'Performance-based - no fees unless you make sales',
      icon: '💰',
      description: 'Zero upfront costs, we only succeed when you succeed'
    },
    {
      title: 'Regular partner meetings and feedback',
      icon: '🤝',
      description: 'Monthly check-ins and quarterly strategy sessions'
    },
    {
      title: 'Long-term growth, not quick profits',
      icon: '📈',
      description: 'Building sustainable business relationships, not extracting quick value'
    }
  ];

  const toggleComparison = (index) => {
    setExpandedComparison(expandedComparison === index ? null : index);
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.header}>
          <H2 className={css.sectionTitle}>
            We're Not Just a Marketplace. We're Your Export Partners.
          </H2>
          <p className={css.sectionSubtitle}>
            See the difference between traditional marketplace relationships and true partnership
          </p>
        </div>

        {/* Comparison Section */}
        <div className={css.comparisonSection}>
          <H3 className={css.comparisonTitle}>Traditional Marketplace vs. Mela Partnership</H3>

          <div className={css.comparisonList}>
            {comparisons.map((comparison, index) => (
              <div
                key={index}
                className={`${css.comparisonCard} ${expandedComparison === index ? css.expanded : ''}`}
              >
                <button
                  className={css.comparisonButton}
                  onClick={() => toggleComparison(index)}
                  aria-expanded={expandedComparison === index}
                >
                  <div className={css.comparisonRow}>
                    <div className={css.traditionalSide}>
                      <span className={css.traditionalIcon}>❌</span>
                      <span className={css.traditionalText}>{comparison.traditional}</span>
                    </div>
                    <div className={css.arrow}>→</div>
                    <div className={css.melaSide}>
                      <span className={css.melaIcon}>✅</span>
                      <span className={css.melaText}>{comparison.mela}</span>
                    </div>
                  </div>
                  <div className={css.expandIcon}>
                    {expandedComparison === index ? '−' : '+'}
                  </div>
                </button>

                {expandedComparison === index && (
                  <div className={css.comparisonDetail}>
                    <p>{comparison.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Commitments Section */}
        <div className={css.commitmentSection}>
          <div className={css.commitmentHeader}>
            <H3 className={css.commitmentTitle}>
              🤝 OUR COMMITMENT TO YOU
            </H3>
            <button
              className={css.toggleButton}
              onClick={() => setShowCommitments(!showCommitments)}
              aria-expanded={showCommitments}
            >
              {showCommitments ? 'Hide Details' : 'See Our Commitments'}
              <span className={css.toggleIcon}>
                {showCommitments ? '↑' : '↓'}
              </span>
            </button>
          </div>

          {showCommitments && (
            <div className={css.commitmentGrid}>
              {commitments.map((commitment, index) => (
                <div key={index} className={css.commitmentCard}>
                  <div className={css.commitmentIcon}>{commitment.icon}</div>
                  <div className={css.commitmentContent}>
                    <h4 className={css.commitmentCardTitle}>{commitment.title}</h4>
                    <p className={css.commitmentDescription}>{commitment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trust Indicator */}
        <div className={css.trustSection}>
          <div className={css.trustBadge}>
            <span className={css.trustIcon}>🛡️</span>
            <div className={css.trustContent}>
              <div className={css.trustTitle}>Partnership Guarantee</div>
              <div className={css.trustText}>We succeed only when you succeed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipPhilosophy;