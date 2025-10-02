import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import BrandPartnershipPage from './BrandPartnershipPage';
import { ConfigurationProvider } from '../../context/configurationContext';
import { RouteConfigurationProvider } from '../../context/routeConfigurationContext';

// Mock the section components
jest.mock('./sections/Hero/Hero', () => {
  return function MockHero({ onFormClick, clothingFormUrl, waitlistFormUrl }) {
    return (
      <div data-testid="hero">
        <button
          data-testid="clothing-form-button"
          onClick={() => onFormClick(clothingFormUrl, 'clothing_application')}
        >
          Apply for Baby Clothing
        </button>
        <button
          data-testid="waitlist-form-button"
          onClick={() => onFormClick(waitlistFormUrl, 'waitlist_application')}
        >
          Join Waitlist (Other Categories)
        </button>
      </div>
    );
  };
});

jest.mock('./sections/MarketOpportunity/MarketOpportunity', () => {
  return function MockMarketOpportunity() {
    return <div data-testid="market-opportunity">Market Opportunity</div>;
  };
});

jest.mock('./sections/WhyClothing/WhyClothing', () => {
  return function MockWhyClothing() {
    return <div data-testid="why-clothing">Why Baby Clothing</div>;
  };
});

jest.mock('./sections/Benefits/Benefits', () => {
  return function MockBenefits() {
    return <div data-testid="benefits">Why Partner with Mela?</div>;
  };
});

jest.mock('./sections/Process/Process', () => {
  return function MockProcess() {
    return <div data-testid="process">How It Works</div>;
  };
});

jest.mock('./sections/MarketTiming/MarketTiming', () => {
  return function MockMarketTiming() {
    return <div data-testid="market-timing">Market Timing</div>;
  };
});

jest.mock('./sections/PartnershipPhilosophy/PartnershipPhilosophy', () => {
  return function MockPartnershipPhilosophy() {
    return <div data-testid="partnership-philosophy">Partnership Philosophy</div>;
  };
});

jest.mock('./sections/SuccessStories/SuccessStories', () => {
  return function MockSuccessStories() {
    return <div data-testid="success-stories">Success Stories</div>;
  };
});

jest.mock('./sections/FAQ/FAQ', () => () => <div data-testid="faq">FAQ</div>);

// Mock containers
jest.mock('../TopbarContainer/TopbarContainer', () => {
  return function MockTopbarContainer() {
    return <div data-testid="topbar">Topbar</div>;
  };
});

jest.mock('../FooterContainer/FooterContainer', () => {
  return function MockFooterContainer() {
    return <div data-testid="footer">Footer</div>;
  };
});

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

// Mock gtag
const mockGtag = jest.fn();
Object.defineProperty(window, 'gtag', {
  writable: true,
  value: mockGtag,
});

const mockConfig = {
  brandPartnership: {
    clothingFormUrl: 'https://test-clothing-form.com',
    waitlistFormUrl: 'https://test-waitlist-form.com'
  },
  branding: {
    facebookImage: 'https://test-facebook-image.com/image.jpg'
  }
};

const mockStore = createStore(() => ({}));

const renderWithProviders = (component) => {
  const messages = {
    'Page.schemaTitle': 'Partner with {marketplaceName}',
    'Page.schemaDescription': 'Join {marketplaceName} - the premium marketplace for authentic Indian products in the US market'
  };

  return render(
    <HelmetProvider>
      <Provider store={mockStore}>
        <BrowserRouter>
          <IntlProvider locale="en" messages={messages}>
            <ConfigurationProvider value={mockConfig}>
              <RouteConfigurationProvider value={[]}>
                {component}
              </RouteConfigurationProvider>
            </ConfigurationProvider>
          </IntlProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
};

describe('BrandPartnershipPage', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
    mockGtag.mockClear();
  });

  it('renders all sections', () => {
    renderWithProviders(<BrandPartnershipPage />);

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('market-opportunity')).toBeInTheDocument();
    expect(screen.getByTestId('why-clothing')).toBeInTheDocument();
    expect(screen.getByTestId('benefits')).toBeInTheDocument();
    expect(screen.getByTestId('process')).toBeInTheDocument();
    expect(screen.getByTestId('market-timing')).toBeInTheDocument();
    expect(screen.getByTestId('partnership-philosophy')).toBeInTheDocument();
    expect(screen.getByTestId('success-stories')).toBeInTheDocument();
    expect(screen.getByTestId('faq')).toBeInTheDocument();
  });

  it('renders responsive content', () => {
    renderWithProviders(<BrandPartnershipPage />);

    // Check for hero content
    expect(screen.getByText('Apply for Baby Clothing')).toBeInTheDocument();
    expect(screen.getAllByText('Join Waitlist (Other Categories)').length).toBeGreaterThan(0);

    // Check for all section content
    expect(screen.getByText('Market Opportunity')).toBeInTheDocument();
    expect(screen.getByText('Why Baby Clothing')).toBeInTheDocument();
    expect(screen.getByText('Why Partner with Mela?')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Market Timing')).toBeInTheDocument();
    expect(screen.getByText('Partnership Philosophy')).toBeInTheDocument();
    expect(screen.getByText('Success Stories')).toBeInTheDocument();
  });

  it('uses configured form URLs', () => {
    renderWithProviders(<BrandPartnershipPage />);

    const clothingButton = screen.getByTestId('clothing-form-button');
    const waitlistButton = screen.getByTestId('waitlist-form-button');

    fireEvent.click(clothingButton);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://test-clothing-form.com',
      '_blank',
      'noopener,noreferrer'
    );

    fireEvent.click(waitlistButton);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://test-waitlist-form.com',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('falls back to default URLs when config is not provided', () => {
    const configWithoutBrandPartnership = {
      branding: {
        facebookImage: 'https://test-facebook-image.com/image.jpg'
      }
    };

    const messages = {
      'Page.schemaTitle': 'Partner with {marketplaceName}',
      'Page.schemaDescription': 'Join {marketplaceName} - the premium marketplace for authentic Indian products in the US market'
    };

    render(
      <HelmetProvider>
        <Provider store={mockStore}>
          <BrowserRouter>
            <IntlProvider locale="en" messages={messages}>
              <ConfigurationProvider value={configWithoutBrandPartnership}>
                <RouteConfigurationProvider value={[]}>
                  <BrandPartnershipPage />
                </RouteConfigurationProvider>
              </ConfigurationProvider>
            </IntlProvider>
          </BrowserRouter>
        </Provider>
      </HelmetProvider>
    );

    const clothingButton = screen.getByTestId('clothing-form-button');
    fireEvent.click(clothingButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://forms.google.com/clothing-partnership',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('tracks analytics events when forms are clicked', () => {
    renderWithProviders(<BrandPartnershipPage />);

    const clothingButton = screen.getByTestId('clothing-form-button');
    fireEvent.click(clothingButton);

    expect(mockGtag).toHaveBeenCalledWith('event', 'form_click', {
      event_category: 'Brand Partnership',
      event_label: 'clothing_application',
      value: 1
    });
  });

  it('handles missing gtag gracefully', () => {
    // Remove gtag to test graceful handling
    delete window.gtag;

    renderWithProviders(<BrandPartnershipPage />);

    const clothingButton = screen.getByTestId('clothing-form-button');

    // Should not throw error
    expect(() => {
      fireEvent.click(clothingButton);
    }).not.toThrow();

    expect(mockWindowOpen).toHaveBeenCalled();
  });

  it('renders with correct page metadata', () => {
    renderWithProviders(<BrandPartnershipPage />);

    // The page should render without errors and have proper content
    expect(screen.getByText('Apply for Baby Clothing')).toBeInTheDocument();
    expect(screen.getByText('Market Opportunity')).toBeInTheDocument();
  });

  it('handles waitlist form clicks with correct analytics', () => {
    renderWithProviders(<BrandPartnershipPage />);

    const waitlistButton = screen.getByTestId('waitlist-form-button');
    fireEvent.click(waitlistButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://test-waitlist-form.com',
      '_blank',
      'noopener,noreferrer'
    );

    expect(mockGtag).toHaveBeenCalledWith('event', 'form_click', {
      event_category: 'Brand Partnership',
      event_label: 'waitlist_application',
      value: 1
    });
  });
});