import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { useIntl, FormattedMessage } from '../../util/reactIntl';
import { useConfiguration } from '../../context/configurationContext';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { shouldShowRedirectTrust, markRedirectTrustShown } from '../../util/sentimentCapture';
import { openBrandStorefront } from '../../util/analytics/brandClickout';
import {
  selectSavedListingIds,
  selectAnonSavedItems,
  fetchSavedListings,
} from '../../ducks/savedListings.duck';

import {
  Page,
  NamedLink,
  ListingCard,
  LayoutSingleColumn,
  RedirectTrustSheet,
  SavedPageSignupPush,
} from '../../components';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';
import css from './SavedPage.module.css';

/**
 * SavedPage — /saved
 *
 * Client-side only (no SSR loadData). Listings are fetched lazily after paint
 * using the savedListingIds already loaded by fetchCurrentUser.
 *
 * Hosts the brand redirect + RedirectTrustSheet trust/feedback modal relocated here
 * from the PDP (see mela-docs/product/prds/add-to-cart-restoration-prd.md) — each
 * saved item's "Shop on {brand}" CTA routes through the same
 * handleShopNow → RedirectTrustSheet (first click of session) → openBrandStorefront
 * pipeline the PDP used to run directly.
 */
const SavedPageComponent = props => {
  const {
    savedListingIds,
    savedListings,
    fetchInProgress,
    fetchError,
    onFetchSavedListings,
    isAuthenticated,
    anonSavedItems,
  } = props;

  const intl = useIntl();
  const config = useConfiguration();

  const [redirectSheetOpen, setRedirectSheetOpen] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState(null);
  const [pendingTrackingParams, setPendingTrackingParams] = useState(null);
  const [pendingBrandName, setPendingBrandName] = useState(null);
  const [pendingIsVerified, setPendingIsVerified] = useState(false);

  useEffect(() => {
    if (savedListingIds.length > 0) {
      onFetchSavedListings(savedListingIds);
    }
  }, [savedListingIds.join(',')]); // stable string key — avoids re-fetch on same IDs

  const handleShopNow = ({ url, brandName, isVerified, trackingParams }) => {
    if (shouldShowRedirectTrust()) {
      markRedirectTrustShown();
      setPendingRedirectUrl(url);
      setPendingTrackingParams(trackingParams);
      setPendingBrandName(brandName);
      setPendingIsVerified(isVerified);
      setRedirectSheetOpen(true);
    } else {
      openBrandStorefront(url, trackingParams);
    }
  };

  const schemaTitle = intl.formatMessage({ id: 'SavedPage.schemaTitle' });
  const schemaDescription = intl.formatMessage({ id: 'SavedPage.schemaDescription' });

  const isEmpty = savedListingIds.length === 0;
  const hasListings = savedListings.length > 0;
  const shoppableCount = savedListings.filter(
    listing => listing.attributes?.publicData?.brand && listing.attributes?.publicData?.productUrl
  ).length;
  const showSignupPush = !isAuthenticated && anonSavedItems.length > 0;

  const renderSizes = '(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw';

  return (
    <Page title={schemaTitle} description={schemaDescription} scrollingDisabled={false}>
      <LayoutSingleColumn topbar={<TopbarContainer />} footer={<FooterContainer />}>
        <div className={css.root}>
          <div className={css.header}>
            <h1 className={css.title}>
              <FormattedMessage id="SavedPage.title" />
            </h1>
            <p className={css.subheading}>
              <FormattedMessage id="SavedPage.subheading" />
            </p>
          </div>

          {showSignupPush && <SavedPageSignupPush className={css.signupPush} />}

          {fetchError && (
            <div className={css.error}>
              <FormattedMessage id="SavedPage.error" />
            </div>
          )}

          {fetchInProgress && !hasListings && (
            <div className={css.loading}>
              <FormattedMessage id="SavedPage.loading" />
            </div>
          )}

          {!fetchInProgress && isEmpty && (
            <div className={css.emptyState}>
              <h2 className={css.emptyHeading}>
                <FormattedMessage id="SavedPage.emptyHeading" />
              </h2>
              <p className={css.emptySubheading}>
                <FormattedMessage id="SavedPage.emptySubheading" />
              </p>
              <NamedLink name="SearchPage" className={css.browseCta}>
                <FormattedMessage id="SavedPage.emptyBrowseCta" />
              </NamedLink>
            </div>
          )}

          {hasListings && shoppableCount > 0 && (
            <p className={css.itemCount}>
              <FormattedMessage id="SavedPage.itemsReadyToShop" values={{ count: shoppableCount }} />
            </p>
          )}

          {hasListings && (
            <div className={css.grid}>
              {savedListings.map(listing => (
                <ListingCard
                  key={listing.id.uuid}
                  listing={listing}
                  renderSizes={renderSizes}
                  showAuthorInfo
                  showTrustBadges
                  onShopNow={handleShopNow}
                />
              ))}
            </div>
          )}
        </div>
      </LayoutSingleColumn>

      {/* Pre-redirect trust sheet — shown first Shop-CTA click per session (relocated from PDP) */}
      {redirectSheetOpen && pendingRedirectUrl && (
        <RedirectTrustSheet
          isOpen={redirectSheetOpen}
          brandName={pendingBrandName}
          productUrl={pendingRedirectUrl}
          isVerified={pendingIsVerified}
          onContinue={url => openBrandStorefront(url, pendingTrackingParams)}
          onClose={() => setRedirectSheetOpen(false)}
        />
      )}
    </Page>
  );
};

const mapStateToProps = state => {
  const savedListingIds = selectSavedListingIds(state);
  const savedListings = getListingsById(state, savedListingIds.map(id => ({ uuid: id })));
  return {
    savedListingIds,
    savedListings,
    fetchInProgress: state.savedListings.fetchInProgress,
    fetchError: state.savedListings.fetchError,
    isAuthenticated: state.auth.isAuthenticated,
    anonSavedItems: selectAnonSavedItems(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchSavedListings: ids => dispatch(fetchSavedListings(ids)),
});

const SavedPage = compose(connect(mapStateToProps, mapDispatchToProps))(SavedPageComponent);

export default SavedPage;
