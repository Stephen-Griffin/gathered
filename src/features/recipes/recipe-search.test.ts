import { describe, expect, it } from "vitest";
import {
  filterRecipesBySearchQuery,
  getRecipeSearchQuery,
  recipeMatchesSearchQuery,
  type SearchableRecipe,
} from "./recipe-search";

const recipes = [
  {
    name: "Chicken Tacos",
    ingredients: [{ name: "Chicken breast" }, { name: "Corn tortillas" }],
  },
  {
    name: "Tomato Soup",
    ingredients: [{ name: "Crushed tomatoes" }, { name: "Heavy cream" }],
  },
  {
    name: "Peanut Noodles",
    ingredients: [{ name: "Peanut butter" }, { name: "Soy sauce" }],
  },
] satisfies SearchableRecipe[];

describe("recipe search", () => {
  it("normalizes query params before filtering", () => {
    expect(getRecipeSearchQuery("  tomato   soup  ")).toBe("tomato soup");
    expect(getRecipeSearchQuery([" chicken ", "ignored"])).toBe("chicken");
    expect(getRecipeSearchQuery(undefined)).toBe("");
  });

  it("matches recipe title text case-insensitively", () => {
    expect(recipeMatchesSearchQuery(recipes[0], "tacos")).toBe(true);
    expect(recipeMatchesSearchQuery(recipes[0], "CHICKEN tacos")).toBe(true);
    expect(recipeMatchesSearchQuery(recipes[0], "soup")).toBe(false);
  });

  it("matches ingredient text and requires every query term", () => {
    expect(filterRecipesBySearchQuery(recipes, "heavy")).toEqual([recipes[1]]);
    expect(filterRecipesBySearchQuery(recipes, "peanut sauce")).toEqual([
      recipes[2],
    ]);
    expect(filterRecipesBySearchQuery(recipes, "chicken cream")).toEqual([]);
  });

  it("returns all recipes for an empty query", () => {
    expect(filterRecipesBySearchQuery(recipes, "")).toEqual(recipes);
  });
});
