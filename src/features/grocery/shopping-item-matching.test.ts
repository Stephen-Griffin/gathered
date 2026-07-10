import { describe, expect, it } from "vitest";
import { groupSimilarShoppingItems } from "./shopping-item-matching";

describe("shopping item matching", () => {
  it("groups duplicate normalized grocery ingredients and sums their quantities", () => {
    expect(
      groupSimilarShoppingItems([
        { id: "a", name: "2 cups fresh tomatoes", quantity: 2, unit: "cup", kind: "grocery", providerId: "target" },
        { id: "b", name: "Tomatoes", quantity: 1, unit: "cup", kind: "grocery", providerId: "target" },
      ]),
    ).toMatchObject([{ itemIds: ["a", "b"], normalizedName: "tomatoes", quantity: 3, requiresReview: false }]);
  });

  it("groups household rows only when their category and provider agree", () => {
    const groups = groupSimilarShoppingItems([
      { id: "a", name: "Paper towels", quantity: 1, unit: "package", kind: "household", providerId: "amazon" },
      { id: "b", name: "paper towels", quantity: 2, unit: "package", kind: "household", providerId: "amazon" },
      { id: "c", name: "paper towels", quantity: 1, unit: "package", kind: "household", providerId: "target" },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ itemIds: ["a", "b"], quantity: 3, providerId: "amazon" });
    expect(groups[1]).toMatchObject({ itemIds: ["c"], quantity: 1, providerId: "target" });
  });

  it("keeps ambiguous and unsupported rows separate for review", () => {
    const groups = groupSimilarShoppingItems([
      { id: "a", name: "soap", quantity: 1, unit: "package", kind: "ambiguous", providerId: "target" },
      { id: "b", name: "soap", quantity: 1, unit: "package", kind: "ambiguous", providerId: "target" },
      { id: "c", name: "wine", quantity: 1, unit: "bottle", kind: "unsupported", providerId: "manual" },
    ]);

    expect(groups).toHaveLength(3);
    expect(groups.every((group) => group.requiresReview)).toBe(true);
    expect(groups.map((group) => group.itemIds)).toEqual([["a"], ["b"], ["c"]]);
  });

  it("does not merge matching names with different categories or units", () => {
    const groups = groupSimilarShoppingItems([
      { id: "a", name: "oil", quantity: 1, unit: "bottle", kind: "grocery", providerId: "target" },
      { id: "b", name: "oil", quantity: 1, unit: "package", kind: "household", providerId: "amazon" },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.itemIds)).toEqual([["a"], ["b"]]);
  });

  it("keeps household package variants separate even with the same provider", () => {
    const groups = groupSimilarShoppingItems([
      { id: "a", name: "toilet paper (12 rolls)", normalizedName: "toilet paper", quantity: 1, unit: "package", kind: "household", providerId: "amazon" },
      { id: "b", name: "toilet paper (24 rolls)", normalizedName: "toilet paper", quantity: 1, unit: "package", kind: "household", providerId: "amazon" },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.itemIds)).toEqual([["a"], ["b"]]);
  });
});
