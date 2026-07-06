const measurementWords = new Set([
  "bag",
  "bags",
  "bottle",
  "bottles",
  "box",
  "boxes",
  "bunch",
  "bunches",
  "can",
  "cans",
  "clove",
  "cloves",
  "cup",
  "cups",
  "dash",
  "dashes",
  "g",
  "gram",
  "grams",
  "kg",
  "lb",
  "lbs",
  "ounce",
  "ounces",
  "oz",
  "package",
  "packages",
  "packet",
  "packets",
  "pinch",
  "pinches",
  "pint",
  "pints",
  "pound",
  "pounds",
  "qt",
  "quart",
  "quarts",
  "tablespoon",
  "tablespoons",
  "tbsp",
  "teaspoon",
  "teaspoons",
  "tsp",
]);

const preparationWords = new Set([
  "chopped",
  "crushed",
  "cubed",
  "diced",
  "fresh",
  "grated",
  "ground",
  "halved",
  "kosher",
  "large",
  "medium",
  "melted",
  "minced",
  "peeled",
  "pinched",
  "ripe",
  "shredded",
  "sliced",
  "small",
  "taste",
  "to",
  "unsalted",
]);

const keepTogetherIngredients = new Set([
  "almond butter",
  "apple butter",
  "cashew butter",
  "peanut butter",
  "sunflower butter",
]);

export function normalizeIngredientName(name: string) {
  const normalized = name
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[¼½¾⅓⅔⅛⅜⅝⅞]/g, " ")
    .replace(/\b\d+[./-]?\d*\b/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !measurementWords.has(word))
    .filter((word) => !preparationWords.has(word))
    .join(" ")
    .trim();

  return normalized.replace(/\s+/g, " ");
}

export function isIngredientCoveredByPantry(
  ingredientName: string,
  pantryIngredientNames: Iterable<string>,
) {
  const normalizedIngredient = normalizeIngredientName(ingredientName);

  if (!normalizedIngredient) {
    return false;
  }

  for (const pantryIngredientName of pantryIngredientNames) {
    const normalizedPantryIngredient =
      normalizeIngredientName(pantryIngredientName);

    if (!normalizedPantryIngredient) {
      continue;
    }

    if (normalizedIngredient === normalizedPantryIngredient) {
      return true;
    }

    if (
      normalizedIngredient.endsWith(` ${normalizedPantryIngredient}`) &&
      !keepTogetherIngredients.has(normalizedIngredient)
    ) {
      return true;
    }
  }

  return false;
}

export function getRemainingIngredientQuantity(
  ingredient: RecipeIngredient,
  pantryIngredients: Iterable<RecipeIngredient>,
) {
  let pantryQuantity = 0;

  for (const pantryIngredient of pantryIngredients) {
    if (pantryIngredient.unit !== ingredient.unit) {
      continue;
    }

    if (
      isIngredientCoveredByPantry(ingredient.name, [
        normalizeIngredientName(pantryIngredient.name),
      ])
    ) {
      pantryQuantity += pantryIngredient.quantity;
    }
  }

  return Math.max(ingredient.quantity - pantryQuantity, 0);
}
import type { RecipeIngredient } from "./ingredient-measurements";
