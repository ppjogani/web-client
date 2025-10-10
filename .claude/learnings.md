# Learnings Log

This file tracks patterns, solutions, and insights discovered while working on the Mela project.

## Patterns

### Category Name Resolution
- **Follow CategoryBreadcrumb pattern**: Use `findCategoryById` + `resolveCategoryNames` helpers
- **Data source**: `config.categoryConfiguration?.categories` contains category objects with `name` property
- **Display logic**: `categoryItem?.name || categoryId` resolves IDs to human-readable names
- **Never**: Create custom humanization functions - use the configuration data

### Variable Name Verification
- **Always check actual variable names** before referencing in components
- **Example**: ListingPage components use `currentListing` not `listing`
- **Pattern**: Read component code to verify variable names, don't assume based on other components

### Redux Duck Pattern
- **File Structure**: `src/ducks/[feature].duck.js` - actions, reducer, thunk in one file
- **Registration**: Add to `src/ducks/index.js` import/export
- **Thunk signature**: `(config) => (dispatch, getState, sdk) => Promise`

### Sharetribe SDK Integration
- **Import pattern**: `import { types as sdkTypes } from '../util/sdkLoader'` (never direct `sharetribe-sdk`)
- **API response**: `sdk.listings.query()` returns `{ data: { data: [], included: [] } }`
- **Image handling**: Attach images from `included` array via relationships
- **Query optimization**: Use `fields.listing`, `fields.image`, `imageVariant.*` for efficiency

### Testing Patterns
```javascript
// Redux Duck Tests
describe('feature.duck', () => {
  describe('Reducer', () => { /* test initial state, actions */ });
  describe('Action creators', () => { /* test action functions */ });
  describe('Thunk', () => { /* test async with mocked SDK */ });
});

// Redux Component Tests - Mock store setup
const store = createStore(() => mockState);
store.dispatch = jest.fn();

// Full provider wrapper
<Provider store={store}>
  <MemoryRouter>
    <IntlProvider><ConfigurationProvider>
      <Component />
    </ConfigurationProvider></IntlProvider>
  </MemoryRouter>
</Provider>
```

## Issues & Solutions

### CategoryProducts Display Fix (Product Pages)
- **Issue**: UI showed category IDs ("baby-clothing") instead of readable names ("Baby Clothing")
- **Solution**: Applied CategoryBreadcrumb resolution pattern to convert IDs to display names
- **Additional**: Increased products 6→9, exclude current listing from recommendations
- **Key fix**: Used `currentListing?.id?.uuid` not `listing?.id?.uuid` in both ListingPage variants

### Common Test Issues & Solutions
- **SDK import errors**: Use `../util/sdkLoader` not `sharetribe-sdk`
- **Multiple elements**: Use `getAllByTestId` when elements share test IDs
- **Redux connection**: Always wrap with Provider + mock store
- **State shape**: Match exact Redux state structure in test mocks

## Session Log
2024-10-10: Fixed CategoryProducts to display proper category names + product filtering improvements
2025-10-10: Implemented HeroProducts with real API integration, randomization, and comprehensive testing