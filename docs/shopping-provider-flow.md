# Target + Amazon shopping provider flow

Issue: [#9](https://github.com/Stephen-Griffin/gathered/issues/9)

## Recommended MVP flow

Gathered++ remains the source of truth for meal plans, pantry context, grocery list generation, provider assignment, and user edits. Retailers are destination sites only.

- Grocery ingredients default to Target.
- Non-grocery household items default to Amazon.
- Ambiguous items are flagged for user review before checkout link generation.
- Unsupported items stay as manual rows with no provider automation.

The MVP checkout flow is link-out only: the user reviews the generated list in Gathered++, sees items grouped by provider, opens provider product/search/affiliate links, and checks out on Target or Amazon directly.

## Official Target findings

Target does not appear to publish a general public product search, cart creation, cart mutation, or customer OAuth API for third-party consumer shopping apps. Do not build against private web APIs, scraped cart endpoints, browser automation, or undocumented Target account flows.

Confirmed public options:

- Target.com search URLs can be opened for item discovery, e.g. `https://www.target.com/s?searchTerm=milk`. The rendered Target search page exposes grocery categories, pickup, same-day delivery, shipping filters, item detail links, and Add to cart controls for the user to operate on Target.com.
- Product deep links can be stored when a user or later approved provider integration selects a specific Target product URL.
- Target Plus is an invite-only, curated third-party marketplace inside Target.com and the Target mobile app, not a public shopping API for Gathered++. Target describes Target Plus as an "invite-only, third-party digital marketplace" and says Shopify merchants can apply to sell through Target Plus.
- No official public Target documentation was found for affiliate link generation or public Target product/search API credentials. Treat Target affiliate tracking as unconfirmed until Target or an approved partner provides official program documentation.
- No official public Target documentation was found for third-party cart creation or cart mutation. The MVP must not attempt to create or modify a Target cart.

Sources:

- [Target.com search for milk](https://www.target.com/s?searchTerm=milk)
- [Target corporate: Target Plus + Shopify marketplace announcement](https://corporate.target.com/news-features/article/2024/06/target-plus-shopify)
- [Target Plus marketplace for sellers](https://plus.target.com/)

## Official Amazon findings

Amazon's Product Advertising API 5.0 documentation is still public, but Amazon states that PA-API is deprecated on May 15, 2026 and directs developers to the Amazon Creators API. Any new build should treat Creators API as the current product API path and use PA-API docs only as legacy capability evidence until Creators API access is approved.

Confirmed public options from PA-API docs:

- `SearchItems` supports keyword/category-style product search and returns up to 10 items per request.
- `SearchItems` can request resources such as browse node info, images, item info, offers, offers v2, and search refinements.
- `SearchItems` requires `PartnerTag` and `PartnerType`; `PartnerType` examples use `Associates`.
- `GetItems` supports lookup by ASIN and can return item details including ASIN, detail page URL, images, item info, offers, offers v2, parent ASIN, and related resources.
- Amazon supports affiliate/deep-link behavior through Associates partner tags and detail page URLs returned by product APIs.
- No current official Amazon documentation reviewed for this ticket confirms third-party cart creation or cart mutation through Creators API/PA-API. The MVP must not attempt to create or modify an Amazon cart.

Sources:

- [Amazon PA-API documentation introduction](https://webservices.amazon.com/paapi5/documentation/)
- [Amazon PA-API SearchItems](https://webservices.amazon.com/paapi5/documentation/search-items.html)
- [Amazon PA-API GetItems](https://webservices.amazon.com/paapi5/documentation/get-items.html)
- [Amazon Creators API introduction](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction)

## Provider-selection strategy

Provider assignment should happen after Gathered++ generates and normalizes shopping rows:

1. Classify each row as `grocery`, `household`, `ambiguous`, or `unsupported`.
2. Assign grocery ingredients to Target by default.
3. Assign non-grocery household rows to Amazon by default.
4. Put ambiguous rows in a user-review state with suggested provider and reason.
5. Leave unsupported rows as manual list entries.
6. Preserve the user's final provider choice as part of the Gathered++ shopping list state.

Initial heuristics:

- Grocery: ingredients, produce, dairy, meat, seafood, bakery, pantry staples, snacks, beverages, frozen, spices, condiments.
- Household: cleaning supplies, paper goods, trash bags, laundry, storage, batteries, kitchen consumables, personal care only when clearly non-food/non-recipe.
- Ambiguous: "soap", "oil", "paper", "wipes", "bags", brand-only rows, or rows with no useful category confidence.
- Unsupported: alcohol where restricted, prescriptions, age-gated items, marketplace-only edge cases, item names too vague to match.

## MVP checkout behavior

- Gathered++ shows one reviewed shopping list with provider groups.
- Each provider group has a clear retailer label, item count, and per-row link.
- Target rows open Target product links when a known URL exists; otherwise they open Target search links using the normalized item name.
- Amazon rows open Amazon product/detail links when a known ASIN or detail URL exists; otherwise they open Amazon search/affiliate links using the normalized item name.
- Manual rows remain copyable checklist rows.
- Checkout happens entirely on the retailer site under the user's retailer account, cart, payment, fulfillment, substitutions, and availability rules.
- If affiliate links are enabled later, show an affiliate disclosure near provider links.

## Limitations

- No direct cart creation or mutation for Target or Amazon.
- No user account OAuth or retailer account connection.
- No store-specific Target inventory guarantee until an approved official integration provides it.
- No automatic substitutions.
- Price, availability, shipping eligibility, pickup eligibility, and grocery fulfillment can drift after Gathered++ generates links.
- Affiliate disclosure is required before monetized links ship.
- Amazon PA-API is deprecated on May 15, 2026, so Creators API access must be validated before implementing Amazon product search.
- Target official public affiliate/API documentation was not found; Target support may remain search/deep-link only.

## Backend abstraction proposal

Keep retailer-specific logic behind provider adapters so generated lists stay portable and Gathered++ remains the source of truth.

```ts
export type ShoppingProviderId = "target" | "amazon" | "manual";

export type ShoppingRowKind =
  "grocery" | "household" | "ambiguous" | "unsupported";

export interface ShoppingListRow {
  id: string;
  name: string;
  quantity?: string;
  notes?: string;
  kind: ShoppingRowKind;
  pantryDeduped: boolean;
}

export interface ProviderAssignment {
  rowId: string;
  providerId: ShoppingProviderId;
  confidence: "default" | "review_required" | "manual";
  reason: string;
}

export interface ProductSearchQuery {
  providerId: Exclude<ShoppingProviderId, "manual">;
  term: string;
  quantity?: string;
  categoryHint?: ShoppingRowKind;
}

export interface ProductCandidate {
  providerId: Exclude<ShoppingProviderId, "manual">;
  externalId?: string;
  title: string;
  detailUrl: string;
  imageUrl?: string;
  priceLabel?: string;
  availabilityLabel?: string;
  affiliateEligible: boolean;
}

export interface LinkGenerationInput {
  row: ShoppingListRow;
  assignment: ProviderAssignment;
  selectedCandidate?: ProductCandidate;
}

export interface ShoppingProviderAdapter {
  id: Exclude<ShoppingProviderId, "manual">;
  searchProducts(query: ProductSearchQuery): Promise<ProductCandidate[]>;
  matchItem(row: ShoppingListRow): Promise<ProductCandidate | null>;
  generateLink(input: LinkGenerationInput): string;
}

export interface ProviderSelectionService {
  assignProvider(row: ShoppingListRow): ProviderAssignment;
  generateFallbackLink(input: LinkGenerationInput): string | null;
}
```

Fallback rules:

- `target.generateLink` returns a known product URL when available, otherwise `https://www.target.com/s?searchTerm=${encodeURIComponent(row.name)}`.
- `amazon.generateLink` returns a known detail URL when available, otherwise an Amazon search URL with the approved Associates/Creators tracking mechanism once credentials exist.
- `manual` returns `null` and renders the row as user-managed.

## Environment variables

No retailer credentials are required for the Sprint 1 documentation-only MVP because the planned behavior is provider assignment plus link-out.

Future implementation should add only confirmed official credentials:

- Amazon: approved Creators API or Associates credentials after account access confirms exact names and requirements.
- Target: approved affiliate/partner credentials only if Target or an approved partner provides official documentation.

Do not add fake API keys, retailer passwords, private cart tokens, browser cookies, or scraped endpoint configuration.

## Risks

- Creators API access and exact credential model may differ from deprecated PA-API docs.
- Target may remain link-only without an approved partnership.
- Search links can produce poor matches for generic grocery rows.
- Affiliate monetization requires disclosure, program approval, and compliance review.
- Retailer availability can change between list generation and checkout.

## Follow-up tickets

- Validate Amazon Creators API access, credential names, rate limits, and product search/link response shape.
- Find or request official Target affiliate/partner documentation and confirm whether link tracking is available.
- Build provider assignment and user review UI behind a feature flag.
- Implement provider adapter interfaces with search-link fallback only.
- Add affiliate disclosure UI before enabling monetized links.
- Add tests for grocery/household/ambiguous/unsupported provider assignment.
