import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { HelmetProvider } from 'react-helmet-async';

import configureStore from '../../store';
import { createListing } from '../../util/testData';
import { ConfigurationProvider } from '../../context/configurationContext';
import { RouteConfigurationProvider } from '../../context/routeConfigurationContext';
import {
  getDefaultConfiguration,
  getHostedConfiguration,
  getRouteConfiguration,
} from '../../util/testHelpers';
import { mergeConfig } from '../../util/configHelpers';

import SavedPage from './SavedPage';

// Topbar/Footer/ListingCard are already covered by their own unit tests —
// stub them here so SavedPage tests stay focused on SavedPage's own logic.
jest.mock('../TopbarContainer/TopbarContainer', () => () => <div data-testid="topbar" />);
jest.mock('../FooterContainer/FooterContainer', () => () => <div data-testid="footer" />);
jest.mock('../../components/ListingCard/ListingCard', () => props => (
  <div data-testid="listing-card">
    {props.listing.attributes.title}
    {props.onShopNow && (
      <button
        type="button"
        onClick={e =>
          props.onShopNow({
            url: 'https://testbrand.example/product',
            brandName: 'TestBrand',
            isVerified: true,
            trackingParams: {},
            triggerElement: e.currentTarget,
          })
        }
      >
        Shop on TestBrand
      </button>
    )}
  </div>
));

const mockMessages = {
  'SavedPage.title': 'Saved',
  'SavedPage.subheading': 'Your personal Mela collection — meri pasand ❤️',
  'SavedPage.emptyHeading': 'Nothing saved yet',
  'SavedPage.emptySubheading': 'your meri pasand waits ❤️',
  'SavedPage.emptyBrowseCta': 'Browse products',
  'SavedPage.loading': 'Loading your saved items…',
  'SavedPage.error': 'Could not load saved items. Please try again.',
  'SavedPage.schemaTitle': 'Saved Items | Mela',
  'SavedPage.schemaDescription': 'Your saved items on Mela.',
  'SavedPage.totalSavedCount': '{count} saved',
  'SavedPage.itemsSummary': '{total} saved · {ready} ready to shop',
  'Page.schemaTitle': '{marketplaceName}',
  'Page.schemaDescription': 'Marketplace',
};

const mockConfig = mergeConfig(getHostedConfiguration(), getDefaultConfiguration());
const mockRoutes = getRouteConfiguration();

const baseSavedListingsState = {
  savedListingIds: [],
  toggleInProgress: {},
  toggleError: null,
  fetchInProgress: false,
  fetchError: null,
  anonSavedItems: [],
};

// isAuthenticated defaults false — pass authOverrides to simulate an authenticated
// shopper. Real savedListingIds only ever populate for authenticated shoppers (anonymous
// ones are tracked via anonSavedItems, see selectEffectiveSavedListingIds), so any test
// that drives the grid via savedListingIds needs isAuthenticated: true to match.
const buildState = (savedListingsOverrides = {}, entities = {}, authOverrides = {}) => ({
  savedListings: { ...baseSavedListingsState, ...savedListingsOverrides },
  marketplaceData: { entities: { listing: {}, ...entities } },
  auth: { isAuthenticated: false, ...authOverrides },
});

// Fetch effect only fires when savedListingIds is non-empty (see SavedPage.js),
// so a no-op sdk is enough for tests that keep the ids list empty.
const noopSdk = { listings: { query: () => new Promise(() => {}) } };

const renderSavedPage = (initialState, sdk = noopSdk) => {
  const store = configureStore({ initialState, sdk });
  return render(
    <HelmetProvider>
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en" messages={mockMessages}>
            <ConfigurationProvider value={mockConfig}>
              <RouteConfigurationProvider value={mockRoutes}>
                <SavedPage />
              </RouteConfigurationProvider>
            </ConfigurationProvider>
          </IntlProvider>
        </MemoryRouter>
      </Provider>
    </HelmetProvider>
  );
};

describe('SavedPage', () => {
  beforeEach(() => {
    // shouldShowRedirectTrust()/markRedirectTrustShown() (util/sentimentCapture.js) key off
    // sessionStorage, which otherwise leaks session-shown state across tests in this file.
    window.sessionStorage.clear();
  });

  it('always renders the Mela header (Topbar) and footer', () => {
    renderSavedPage(buildState());
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the page title and subheading', () => {
    renderSavedPage(buildState());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Saved');
    expect(screen.getByText(mockMessages['SavedPage.subheading'])).toBeInTheDocument();
  });

  it('shows the empty state with a browse CTA when nothing is saved', () => {
    renderSavedPage(buildState());
    expect(screen.getByText('Nothing saved yet')).toBeInTheDocument();
    const cta = screen.getByText('Browse products');
    expect(cta.closest('a')).toHaveAttribute('href', '/s');
  });

  it('shows a loading state while fetching and no listings are loaded yet', () => {
    // sdk.listings.query never resolves, so fetchInProgress stays true for the assertion.
    renderSavedPage(
      buildState({ savedListingIds: ['listing1'], fetchInProgress: true }, {}, { isAuthenticated: true })
    );
    expect(screen.getByText('Loading your saved items…')).toBeInTheDocument();
    expect(screen.queryByText('Nothing saved yet')).not.toBeInTheDocument();
  });

  it('shows an error message when fetching saved listings fails', async () => {
    const failingSdk = { listings: { query: () => Promise.reject(new Error('boom')) } };
    renderSavedPage(
      buildState({ savedListingIds: ['listing1'] }, {}, { isAuthenticated: true }),
      failingSdk
    );
    expect(
      await screen.findByText('Could not load saved items. Please try again.')
    ).toBeInTheDocument();
  });

  it('renders a card for each saved listing once loaded', () => {
    const listing1 = createListing('listing1', { title: 'Buransh Red Jhabla' });
    const listing2 = createListing('listing2', { title: 'Marigold Romper' });

    renderSavedPage(
      buildState(
        { savedListingIds: ['listing1', 'listing2'] },
        { listing: { listing1, listing2 } },
        { isAuthenticated: true }
      )
    );

    const cards = screen.getAllByTestId('listing-card');
    expect(cards).toHaveLength(2);
    expect(screen.getByText('Buransh Red Jhabla')).toBeInTheDocument();
    expect(screen.getByText('Marigold Romper')).toBeInTheDocument();
    expect(screen.queryByText('Nothing saved yet')).not.toBeInTheDocument();
  });

  it('renders a card for each saved listing for anonymous shoppers too', () => {
    // Regression test for the bug found via manual browser verification: SavedPage used
    // to only ever fetch/derive the grid from savedListingIds (authenticated-only), so
    // anonymous shoppers saw "Nothing saved yet" even with items saved via Add to Cart.
    const listing1 = createListing('listing1', { title: 'Buransh Red Jhabla' });

    renderSavedPage(
      buildState(
        { anonSavedItems: [{ id: 'listing1', title: 'Buransh Red Jhabla', imageUrl: '' }] },
        { listing: { listing1 } }
      )
    );

    expect(screen.getByTestId('listing-card')).toBeInTheDocument();
    expect(screen.getByText('Buransh Red Jhabla')).toBeInTheDocument();
    expect(screen.queryByText('Nothing saved yet')).not.toBeInTheDocument();
  });

  it('renders the item-count line and listing grid above the signup push', () => {
    const listing1 = createListing('listing1', { title: 'Buransh Red Jhabla' });

    // The test store's auth slice defaults to unauthenticated (see other tests in this
    // file) — anonSavedItems is what showSignupPush and the total-count selector key off.
    const { container } = renderSavedPage(
      buildState(
        {
          savedListingIds: ['listing1'],
          anonSavedItems: [{ id: 'listing1', title: 'Buransh Red Jhabla', imageUrl: '' }],
        },
        { listing: { listing1 } }
      )
    );

    const itemCountIndex = container.textContent.indexOf('1 saved');
    const gridIndex = container.textContent.indexOf('Buransh Red Jhabla');
    const signupPushIndex = container.textContent.indexOf('SavedPageSignupPush.earlyAccessHeading');

    expect(itemCountIndex).toBeGreaterThan(-1);
    expect(gridIndex).toBeGreaterThan(-1);
    expect(signupPushIndex).toBeGreaterThan(-1);
    expect(itemCountIndex).toBeLessThan(signupPushIndex);
    expect(gridIndex).toBeLessThan(signupPushIndex);
  });

  it('shows a combined total-saved and ready-to-shop count when some items are shoppable', () => {
    const listing1 = createListing('listing1', { title: 'Item One' });
    const listing2 = createListing('listing2', {
      title: 'Item Two',
      publicData: { brand: 'TestBrand', productUrl: 'https://testbrand.example/2' },
    });

    renderSavedPage(
      buildState(
        {
          savedListingIds: ['listing1', 'listing2'],
          anonSavedItems: [
            { id: 'listing1', title: 'Item One', imageUrl: '' },
            { id: 'listing2', title: 'Item Two', imageUrl: '' },
          ],
        },
        { listing: { listing1, listing2 } }
      )
    );

    // 2 total saved, 1 of them (listing2) has brand+productUrl and is ready to shop.
    expect(screen.getByText('2 saved · 1 ready to shop')).toBeInTheDocument();
  });

  it('returns focus to the Shop button that opened RedirectTrustSheet when it closes', async () => {
    const listing1 = createListing('listing1', {
      title: 'Buransh Red Jhabla',
      publicData: { brand: 'TestBrand', productUrl: 'https://testbrand.example/product' },
    });

    renderSavedPage(
      buildState(
        { savedListingIds: ['listing1'] },
        { listing: { listing1 } },
        { isAuthenticated: true }
      )
    );

    const shopButton = await screen.findByText('Shop on TestBrand');
    shopButton.focus();
    fireEvent.click(shopButton);

    // RedirectTrustSheet opens on first click of the session; dismiss it.
    const dismissButton = await screen.findByText('RedirectTrustSheet.dismissLabel');
    fireEvent.click(dismissButton);

    expect(document.activeElement).toBe(shopButton);
  });
});
