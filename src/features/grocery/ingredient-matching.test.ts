import { describe, expect, it } from "vitest";
import {
  getRemainingIngredientQuantity,
  isIngredientCoveredByPantry,
  normalizeIngredientName,
} from "./ingredient-matching";

describe("ingredient matching helpers", () => {
  it("normalizes ingredient names for grocery matching", () => {
    expect(normalizeIngredientName("2 cups fresh diced Tomatoes")).toBe(
      "tomatoes",
    );
  });

  it("matches covered pantry ingredients without collapsing nut butters", () => {
    expect(isIngredientCoveredByPantry("fresh basil", ["basil"])).toBe(true);
    expect(isIngredientCoveredByPantry("peanut butter", ["butter"])).toBe(
      false,
    );
  });

  it("subtracts matching pantry quantities without going below zero", () => {
    expect(
      getRemainingIngredientQuantity(
        { name: "fresh basil", quantity: 2, unit: "bunch" },
        [{ name: "basil", quantity: 1, unit: "bunch" }],
      ),
    ).toBe(1);

    expect(
      getRemainingIngredientQuantity(
        { name: "fresh basil", quantity: 2, unit: "bunch" },
        [{ name: "basil", quantity: 4, unit: "bunch" }],
      ),
    ).toBe(0);
  });
});
