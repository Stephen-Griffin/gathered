export type ShoppingIntegrationStatus = "Not configured";

export type ShoppingIntegrationProvider = Readonly<{
  id: "target" | "amazon";
  name: string;
  status: ShoppingIntegrationStatus;
  defaultFor: string;
  comingSoon: string;
}>;

export const shoppingIntegrationProviders = [
  {
    id: "target",
    name: "Target",
    status: "Not configured",
    defaultFor: "Grocery ingredients and pantry staples when supported.",
    comingSoon:
      "Target product and search links will open on Target.com for retailer-site checkout.",
  },
  {
    id: "amazon",
    name: "Amazon",
    status: "Not configured",
    defaultFor: "Household and other non-grocery shopping rows when supported.",
    comingSoon:
      "Amazon product and search links will open on Amazon.com for retailer-site checkout.",
  },
] satisfies ShoppingIntegrationProvider[];

export const shoppingIntegrationSummary = {
  defaults:
    "Grocery items will default toward Target, while household and non-grocery items will default toward Amazon when supported.",
  linkGeneration:
    "Shopping-list provider links and search links are coming soon for the current grocery list.",
  checkout:
    "Checkout will happen on each retailer site under the user's retailer account, cart, payment, and fulfillment rules.",
} as const;
