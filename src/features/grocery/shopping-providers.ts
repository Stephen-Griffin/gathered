import "server-only";

export type KnownShoppingProviderId = "target" | "amazon" | "manual";
export type ShoppingProviderId =
  KnownShoppingProviderId | (string & Record<never, never>);

export type SupportedShoppingProviderId = Exclude<
  KnownShoppingProviderId,
  "manual"
>;

export type ShoppingProviderMode = "links-only";

export type ShoppingRowKind =
  "grocery" | "household" | "ambiguous" | "unsupported";

export type ProviderAssignmentConfidence =
  "default" | "review_required" | "manual";

export interface ShoppingProviderConfig {
  mode: ShoppingProviderMode;
  target: {
    searchBaseUrl: string;
  };
  amazon: {
    searchBaseUrl: string;
    associatesTag?: string;
  };
}

export interface ShoppingListRow {
  id: string;
  name: string;
  normalizedName?: string;
  quantity?: string;
  notes?: string;
  kind?: ShoppingRowKind;
  pantryDeduped?: boolean;
  productUrl?: string;
  externalId?: string;
}

export interface ProviderAssignment {
  rowId: string;
  providerId: ShoppingProviderId;
  confidence: ProviderAssignmentConfidence;
  reason: string;
}

export interface ProductSearchQuery {
  providerId: SupportedShoppingProviderId;
  term: string;
  quantity?: string;
  categoryHint?: ShoppingRowKind;
}

export interface ProductCandidate {
  providerId: SupportedShoppingProviderId;
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
  id: SupportedShoppingProviderId;
  searchProducts(query: ProductSearchQuery): Promise<ProductCandidate[]>;
  matchItem(row: ShoppingListRow): Promise<ProductCandidate | null>;
  generateLink(input: LinkGenerationInput): string;
}

export interface ProviderSelectionService {
  assignProvider(row: ShoppingListRow): ProviderAssignment;
  generateFallbackLink(input: LinkGenerationInput): string | null;
}

const shoppingProviderModeEnv = "SHOPPING_PROVIDER_MODE";

const groceryTerms = new Set([
  "apple",
  "apples",
  "asparagus",
  "avocado",
  "bacon",
  "beans",
  "beef",
  "berries",
  "bread",
  "broccoli",
  "butter",
  "carrot",
  "carrots",
  "cheese",
  "chicken",
  "cilantro",
  "corn",
  "cream",
  "cucumber",
  "dairy",
  "eggs",
  "fish",
  "flour",
  "fruit",
  "garlic",
  "herbs",
  "lettuce",
  "meat",
  "milk",
  "mushrooms",
  "oil",
  "onion",
  "onions",
  "pasta",
  "pepper",
  "potatoes",
  "produce",
  "rice",
  "salt",
  "sauce",
  "seafood",
  "spice",
  "spices",
  "tomato",
  "tomatoes",
  "vegetables",
  "yogurt",
]);

const householdTerms = new Set([
  "batteries",
  "battery",
  "cleaner",
  "cleaning",
  "detergent",
  "foil",
  "laundry",
  "napkins",
  "paper towels",
  "soap",
  "sponges",
  "storage",
  "trash bags",
  "wipes",
]);

const ambiguousTerms = new Set(["bags", "oil", "paper", "soap", "wipes"]);

const unsupportedTerms = new Set([
  "alcohol",
  "beer",
  "cigarettes",
  "prescription",
  "spirits",
  "tobacco",
  "wine",
]);

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required shopping provider config: ${name}. Set ${name}=links-only for the current link-out MVP.`,
    );
  }

  return value;
}

function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function getRequiredMode(): ShoppingProviderMode {
  const mode = getRequiredEnv(shoppingProviderModeEnv);

  if (mode !== "links-only") {
    throw new Error(
      `Invalid shopping provider config: ${shoppingProviderModeEnv} must be links-only for the current MVP.`,
    );
  }

  return mode;
}

function appendSearchTerm(baseUrl: string, term: string) {
  const url = new URL(baseUrl);
  url.searchParams.set(
    url.hostname.includes("target.com") ? "searchTerm" : "k",
    term,
  );

  return url.toString();
}

function normalizeTerm(row: ShoppingListRow) {
  return row.normalizedName?.trim() || row.name.trim();
}

function hasTerm(row: ShoppingListRow, terms: ReadonlySet<string>) {
  const normalized = normalizeTerm(row).toLowerCase();

  for (const term of terms) {
    if (normalized === term || normalized.includes(term)) {
      return true;
    }
  }

  return false;
}

function inferRowKind(row: ShoppingListRow): ShoppingRowKind {
  if (row.kind) {
    return row.kind;
  }

  const term = normalizeTerm(row);

  if (!term) {
    return "unsupported";
  }

  if (hasTerm(row, unsupportedTerms)) {
    return "unsupported";
  }

  if (hasTerm(row, ambiguousTerms)) {
    return "ambiguous";
  }

  if (hasTerm(row, householdTerms)) {
    return "household";
  }

  if (hasTerm(row, groceryTerms)) {
    return "grocery";
  }

  return "ambiguous";
}

export function loadShoppingProviderConfig(): ShoppingProviderConfig {
  return {
    mode: getRequiredMode(),
    target: {
      searchBaseUrl:
        getOptionalEnv("TARGET_SEARCH_BASE_URL") ?? "https://www.target.com/s",
    },
    amazon: {
      searchBaseUrl:
        getOptionalEnv("AMAZON_SEARCH_BASE_URL") ?? "https://www.amazon.com/s",
      associatesTag: getOptionalEnv("AMAZON_ASSOCIATES_TAG"),
    },
  };
}

export function createShoppingProviderService(
  config = loadShoppingProviderConfig(),
): ProviderSelectionService {
  return {
    assignProvider(row) {
      const kind = inferRowKind(row);

      if (kind === "unsupported") {
        return {
          rowId: row.id,
          providerId: "manual",
          confidence: "manual",
          reason: "Unsupported rows stay as manual checklist items.",
        };
      }

      if (kind === "ambiguous") {
        return {
          rowId: row.id,
          providerId: "target",
          confidence: "review_required",
          reason:
            "Ambiguous rows need user review before generating provider links.",
        };
      }

      if (kind === "household") {
        return {
          rowId: row.id,
          providerId: "amazon",
          confidence: "default",
          reason: "Household rows default to Amazon in the link-out MVP.",
        };
      }

      return {
        rowId: row.id,
        providerId: "target",
        confidence: "default",
        reason: "Grocery rows default to Target in the link-out MVP.",
      };
    },

    generateFallbackLink(input) {
      if (input.assignment.providerId === "manual") {
        return null;
      }

      if (input.assignment.providerId === "amazon") {
        return amazonProviderAdapter(config).generateLink(input);
      }

      if (input.assignment.providerId === "target") {
        return targetProviderAdapter(config).generateLink(input);
      }

      return null;
    },
  };
}

export function targetProviderAdapter(
  config = loadShoppingProviderConfig(),
): ShoppingProviderAdapter {
  return {
    id: "target",

    async searchProducts() {
      return [];
    },

    async matchItem() {
      return null;
    },

    generateLink(input) {
      return (
        input.selectedCandidate?.detailUrl ??
        input.row.productUrl ??
        appendSearchTerm(config.target.searchBaseUrl, normalizeTerm(input.row))
      );
    },
  };
}

export function amazonProviderAdapter(
  config = loadShoppingProviderConfig(),
): ShoppingProviderAdapter {
  return {
    id: "amazon",

    async searchProducts() {
      return [];
    },

    async matchItem() {
      return null;
    },

    generateLink(input) {
      if (input.selectedCandidate?.detailUrl) {
        return input.selectedCandidate.detailUrl;
      }

      if (input.row.productUrl) {
        return input.row.productUrl;
      }

      if (input.row.externalId) {
        const detailUrl = new URL(
          `/dp/${input.row.externalId}`,
          "https://www.amazon.com",
        );

        if (config.amazon.associatesTag) {
          detailUrl.searchParams.set("tag", config.amazon.associatesTag);
        }

        return detailUrl.toString();
      }

      const searchUrl = new URL(
        appendSearchTerm(config.amazon.searchBaseUrl, normalizeTerm(input.row)),
      );

      if (config.amazon.associatesTag) {
        searchUrl.searchParams.set("tag", config.amazon.associatesTag);
      }

      return searchUrl.toString();
    },
  };
}
