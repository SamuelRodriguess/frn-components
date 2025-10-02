# FRN Promotion Components

## Overview
`frn-components` is a custom VTEX IO application, developed specifically for teams that need to operationalize promotions and automatically render shelves. Developed to run within the VTEX Store theme, it normalizes catalog data to remain compatible with product-summary and exposes a block.
## Highlights

- **Custom Promotions block** renders one carousel per promotion target (category, collection, or SKU) returned by `/_v/custom-promotions/`.
- **Product normalization** mirrors VTEX's internal `product-summary` mapper to ensure SKU selection, seller picking, and image resizing behave exactly as in first-party shelves.
- **Pagination-first UX** keeps page weight low by querying VTEX Search with server-side paging and slicing items into 5-slot carousels with accessible navigation buttons.
- **Configurable SKU strategy** lets merchandisers decide how the default SKU is chosen: first or last available, lowest price, or highest price.

## Architecture at a Glance

- `react/components/PromotionsShelf` exposes the Store Framework block and schema.
- `react/hooks/usePromotions` fetches promotion groups from the custom backend (`/_v/custom-promotions/?id=...`).
- `react/utils/*` replicates VTEX catalogue normalization logic (`mapCatalogProductToProductSummary`, facet mapping, promotion parsing).
- `react/graphql/PromotionsShelf.graphql` queries VTEX Search (`vtex.search-graphql`) to hydrate the shelf with catalogue data.
- `store/interfaces.json` registers the `custom-promotions-shelf` interface, enforcing that each child is a `product-summary` block.

## Getting Started (Local Development)

1. Install dependencies with `yarn` (root) and let VTEX Toolbelt resolve workspace dependencies with `vtex setup --typical` in your IO workspace.
2. Run quality gates locally:
   - Lint: `yarn lint`
   - Unit tests: `yarn test`
   - Locale equality check: `yarn lint:locales`
3. Link to a development workspace with `vtex use {ws}` and `vtex link`
4. Remember that this app depends on the `frn-promotions-service` service to answer `/_v/custom-promotions/`.

## Storefront Usage

- Add the app as a dependency in your store theme `manifest.json`:

```json
"dependencies": {
  "frncubo.frn-components": "0.x"
}
```

- Declare the block in the desired template (e.g. `store.home.json`):

```json
{
  "custom-promotions-shelf#home": {
    "props": {
      "promotionId": "",
      "maxItems": 12,
      "preferredSKU": "PRICE_ASC"
    }
  }
}
```

- Ensure you place a `product-summary` implementation inside the interface if you need custom cards. By default, the block inherits your theme's `product-summary` configuration.

### Block Reference

`PromotionsShelf` (Interface ID: `custom-promotions-shelf`)

| Prop                   | Type                                                                    | Default           | Description                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                   | `string`                                                                | `undefined`       | Optional DOM id when you need anchor links or scroll targets.                                                                                                |
| `promotionId`          | `string`                                                                | `""`              | Filters the custom promotions endpoint by id (`/_v/custom-promotions/?id=`). When omitted, the shelf renders every active promotion returned by the service. |
| `maxItems`             | `number`                                                                | `8`               | Maximum amount of catalogue items requested from `productSearch`. Items are further paginated client-side in slices of 5.                                    |
| `hideUnavailableItems` | `boolean`                                                               | `true`            | Mirrors VTEX Search's `hideUnavailableItems` flag to remove out-of-stock SKUs from the query.                                                                |
| `preferredSKU`         | `enum` (`FIRST_AVAILABLE`, `LAST_AVAILABLE`, `PRICE_ASC`, `PRICE_DESC`) | `FIRST_AVAILABLE` | Strategy applied by the normalization layer to pick the SKU exposed to `product-summary`.                                                                    |
|                        |

`ProductList` is an internal component and is not exposed as a public block. It consumes normalized products from `PromotionsShelf` and renders the registered `product-summary` extension point.

## Data Flow

1. `usePromotions` calls `/_v/custom-promotions/` (optionally filtered by `promotionId`) and receives data (`categories`, `collections`, `skus`...).
2. `promotionParser` converts targets into `IFacets` so they can be sent as `selectedFacets` to VTEX `productSearch`.
3. `ProductList` requests VTEX Search through `PromotionsShelf.graphql`, normalizes items, and passes them to `product-summary` via the `ExtensionPoint` API.

## Styling and Customization

- Structural classes are provided through the CSS Module `productList.module.css`. The container still receives `frn-shelf-promotions` utility classes for global overrides.
- Available CSS Module hooks: `productListSection`, `productListCard`, `arrowButtonBaseStyles`, `productArrowLeft`, `productArrowRight`.
- For Store Framework theming, prefer global CSS overrides that target `.frn-shelf-promotions` and its descendants, or override the `product-summary` block used inside the shelf.

## Testing and QA

- **Unit tests** live inside `react/__tests__` (add coverage when introducing behavioural changes).
- The repository ships with ESLint (VTEX presets) and Prettier. The Husky pre-commit hook runs lint-staged to keep the codebase consistent.
- When changing GraphQL queries, validate the contract in your workspace using `vtex browse` or the VTEX GraphiQL app; the search provider is `vtex.search-graphql`.

## Release Checklist

- Update `manifest.json` version (SemVer) and document changes in `CHANGELOG.md`.
- Run `vtex validate` and `vtex deploy` targeting the desired workspace/account.
