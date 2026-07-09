import { describe, expect, it } from "vitest";
import {
  shoppingIntegrationProviders,
  shoppingIntegrationSummary,
} from "./shopping-integration-settings";

describe("shopping integration settings content", () => {
  it("shows Target and Amazon as not configured", () => {
    expect(shoppingIntegrationProviders).toMatchObject([
      { id: "target", name: "Target", status: "Not configured" },
      { id: "amazon", name: "Amazon", status: "Not configured" },
    ]);
  });

  it("documents provider defaults and link-out checkout behavior", () => {
    expect(shoppingIntegrationSummary.defaults).toContain(
      "Grocery items will default toward Target",
    );
    expect(shoppingIntegrationSummary.defaults).toContain(
      "household and non-grocery items will default toward Amazon",
    );
    expect(shoppingIntegrationSummary.linkGeneration).toContain(
      "provider links and search links are coming soon",
    );
    expect(shoppingIntegrationSummary.checkout).toContain(
      "Checkout will happen on each retailer site",
    );
  });
});
