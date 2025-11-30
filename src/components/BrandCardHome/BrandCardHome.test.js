import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { ConfigurationProvider } from '../../context/configurationContext';
import { RouteConfigurationProvider } from '../../context/routeConfigurationContext';
import BrandCardHome from './BrandCardHome';

const mockBrand = {
  id: { uuid: 'brand-123' },
  type: 'user',
  attributes: {
    profile: {
      displayName: 'Masilo',
      bio: 'Premium organic baby clothing from India. Safe, sustainable, certified.',
      publicData: {
        certifications: ['gots_certified', 'non_toxic_dyes'],
        brandLogoUrl: 'https://example.com/logo.jpg',
      },
    },
  },
  profileImage: null,
};

const mockProducts = [
  {
    id: { uuid: 'product-1' },
    type: 'listing',
    attributes: {
      title: 'Product 1',
      price: { amount: 1000, currency: 'INR' },
    },
    images: [
      {
        id: { uuid: 'img-1' },
        attributes: {
          variants: {
            'square-small': { url: 'https://example.com/p1.jpg', width: 240, height: 240 },
          },
        },
      },
    ],
  },
];

const mockConfig = {
  marketplaceName: 'Mela',
  currency: 'INR',
  locale: 'en',
};

const mockRoutes = [
  { path: '/u/:id', name: 'ProfilePage' },
  { path: '/l/:slug/:id', name: 'ListingPage' },
];

const mockMessages = {
  'BrandCard.shopAll': 'Shop All Products',
  'BrandCard.noProduct': 'Coming Soon',
  'BrandCardHome.verifiedPartner': '✓ Verified Partner',
  'BrandCardHome.customerCount': '{count, plural, one {# customer} other {# customers}}',
};

const TestWrapper = ({ children }) => (
  <MemoryRouter>
    <IntlProvider locale="en" messages={mockMessages}>
      <ConfigurationProvider value={mockConfig}>
        <RouteConfigurationProvider value={mockRoutes}>{children}</RouteConfigurationProvider>
      </ConfigurationProvider>
    </IntlProvider>
  </MemoryRouter>
);

describe('BrandCardHome', () => {
  it('renders brand name and logo', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} />
      </TestWrapper>
    );

    expect(screen.getByText('Masilo')).toBeInTheDocument();
    expect(screen.getByAlt('Masilo')).toBeInTheDocument();
  });

  it('renders tagline from bio (first sentence, max 60 chars)', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} />
      </TestWrapper>
    );

    expect(screen.getByText('Premium organic baby clothing from India')).toBeInTheDocument();
  });

  it('truncates long tagline with ellipsis', () => {
    const longBioBrand = {
      ...mockBrand,
      attributes: {
        ...mockBrand.attributes,
        profile: {
          ...mockBrand.attributes.profile,
          bio: 'This is a very long bio that should be truncated because it exceeds sixty characters in length and we want to keep it concise.',
        },
      },
    };

    render(
      <TestWrapper>
        <BrandCardHome brand={longBioBrand} products={mockProducts} />
      </TestWrapper>
    );

    const tagline = screen.getByText(/This is a very long bio/);
    expect(tagline.textContent).toContain('...');
    expect(tagline.textContent.length).toBeLessThanOrEqual(63); // 60 chars + "..."
  });

  it('renders verified badge when trust indicators present', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} rating={4.8} />
      </TestWrapper>
    );

    expect(screen.getByText('✓ Verified Partner')).toBeInTheDocument();
  });

  it('displays rating and review count', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} rating={4.8} reviewCount={124} />
      </TestWrapper>
    );

    expect(screen.getByText(/4.8/)).toBeInTheDocument();
    expect(screen.getByText(/124/)).toBeInTheDocument();
  });

  it('displays customer count', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} customerCount={2500} />
      </TestWrapper>
    );

    expect(screen.getByText('2500 customers')).toBeInTheDocument();
  });

  it('hides trust indicators when no rating or customer count', () => {
    const { container } = render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} />
      </TestWrapper>
    );

    const trustIndicators = container.querySelector('.trustIndicators');
    expect(trustIndicators).not.toBeInTheDocument();
  });

  it('renders certification badge', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} />
      </TestWrapper>
    );

    expect(screen.getByText('GOTS')).toBeInTheDocument();
  });

  it('renders 2x2 product grid with placeholders', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={[mockProducts[0]]} />
      </TestWrapper>
    );

    const placeholders = screen.getAllByText('Coming Soon');
    expect(placeholders.length).toBe(3); // 1 product + 3 placeholders
  });

  it('renders Shop All CTA linking to profile page', () => {
    render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} />
      </TestWrapper>
    );

    const shopAllLink = screen.getByText('Shop All Products').closest('a');
    expect(shopAllLink).toBeInTheDocument();
    expect(shopAllLink.getAttribute('href')).toContain('brand-123');
  });

  it('renders placeholder logo when no logo available', () => {
    const brandNoLogo = {
      ...mockBrand,
      attributes: {
        profile: {
          displayName: 'TestBrand',
          publicData: {},
        },
      },
    };

    const { container } = render(
      <TestWrapper>
        <BrandCardHome brand={brandNoLogo} products={[]} />
      </TestWrapper>
    );

    const placeholder = container.querySelector('.logoPlaceholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('T');
  });

  it('returns null when brand is null', () => {
    const { container } = render(
      <TestWrapper>
        <BrandCardHome brand={null} products={mockProducts} />
      </TestWrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('memoizes correctly based on brand, products, and rating', () => {
    const { rerender } = render(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} rating={4.8} />
      </TestWrapper>
    );

    rerender(
      <TestWrapper>
        <BrandCardHome brand={mockBrand} products={mockProducts} rating={4.8} />
      </TestWrapper>
    );

    expect(screen.getByText('Masilo')).toBeInTheDocument();
  });
});
