import type { RecipeIngredient } from "@/features/grocery/ingredient-measurements";

export type SearchableRecipe = Readonly<{
  name: string;
  ingredients: readonly Pick<RecipeIngredient, "name">[];
}>;

export function getRecipeSearchQuery(
  value: string | string[] | undefined,
): string {
  const rawValue = Array.isArray(value) ? value[0] : value;
  return rawValue?.trim().replace(/\s+/g, " ") ?? "";
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function getRecipeSearchText(recipe: SearchableRecipe) {
  return normalizeSearchText(
    [recipe.name, ...recipe.ingredients.map((ingredient) => ingredient.name)]
      .filter(Boolean)
      .join(" "),
  );
}

export function recipeMatchesSearchQuery(
  recipe: SearchableRecipe,
  query: string,
) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const recipeText = getRecipeSearchText(recipe);
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  return queryTerms.every((term) => recipeText.includes(term));
}

export function filterRecipesBySearchQuery<Recipe extends SearchableRecipe>(
  recipes: readonly Recipe[],
  query: string,
) {
  const normalizedQuery = getRecipeSearchQuery(query);

  if (!normalizedQuery) {
    return [...recipes];
  }

  return recipes.filter((recipe) =>
    recipeMatchesSearchQuery(recipe, normalizedQuery),
  );
}
