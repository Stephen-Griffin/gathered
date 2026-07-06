import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { recipes } from "../../src/db/schema";
import type { RecipeIngredient } from "../../src/features/grocery/ingredient-measurements";

type SeedRecipe = Readonly<{
  name: string;
  author: string;
  description: string;
  ingredients: RecipeIngredient[];
  directions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
}>;

const seedRecipes: SeedRecipe[] = [
  {
    name: "Chicken Biryani",
    author: "Gathered Test Kitchen",
    description:
      "Fragrant rice, tender chicken, and warm spices for a weekend dinner.",
    ingredients: [
      { name: "Chicken thighs", quantity: 1.5, unit: "pound" },
      { name: "Basmati rice", quantity: 2, unit: "cup" },
      { name: "Onion", quantity: 2, unit: "piece" },
      { name: "Yogurt", quantity: 1, unit: "cup" },
      { name: "Chili powder", quantity: 1, unit: "tablespoon" },
    ],
    directions: [
      "Marinate the chicken with yogurt and spices.",
      "Cook onions until deeply golden.",
      "Layer chicken and rice, then steam until tender.",
    ],
    prepTimeMinutes: 25,
    cookTimeMinutes: 45,
    totalTimeMinutes: 70,
    servings: 4,
  },
  {
    name: "Weeknight Ragu",
    author: "Gathered Test Kitchen",
    description:
      "A quick tomato and beef sauce that works with pasta or polenta.",
    ingredients: [
      { name: "Ground beef", quantity: 1, unit: "pound" },
      { name: "Crushed tomatoes", quantity: 1, unit: "can" },
      { name: "Garlic", quantity: 3, unit: "piece" },
      { name: "Onion", quantity: 1, unit: "piece" },
      { name: "Pasta", quantity: 12, unit: "ounce" },
    ],
    directions: [
      "Brown the beef in a large skillet.",
      "Add aromatics and tomatoes, then simmer.",
      "Serve with pasta or polenta.",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    totalTimeMinutes: 40,
    servings: 4,
  },
  {
    name: "Herby Bean Soup",
    author: "Gathered Test Kitchen",
    description: "Creamy white beans, greens, lemon, and plenty of herbs.",
    ingredients: [
      { name: "White beans", quantity: 2, unit: "can" },
      { name: "Vegetable broth", quantity: 4, unit: "cup" },
      { name: "Kale", quantity: 1, unit: "bunch" },
      { name: "Lemon", quantity: 1, unit: "piece" },
      { name: "Parsley", quantity: 1, unit: "bunch" },
    ],
    directions: [
      "Simmer beans with broth until creamy.",
      "Stir in greens until wilted.",
      "Finish with lemon and herbs.",
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    totalTimeMinutes: 35,
    servings: 4,
  },
  {
    name: "Turkey Chili",
    author: "Gathered Test Kitchen",
    description:
      "A hearty one-pot chili with beans, tomatoes, and smoky spices.",
    ingredients: [
      { name: "Ground turkey", quantity: 1, unit: "pound" },
      { name: "Beans", quantity: 2, unit: "can" },
      { name: "Tomatoes", quantity: 2, unit: "can" },
      { name: "Chili powder", quantity: 2, unit: "tablespoon" },
      { name: "Bell pepper", quantity: 2, unit: "piece" },
    ],
    directions: [
      "Brown the turkey with peppers.",
      "Add beans, tomatoes, and spices.",
      "Simmer until thick and flavorful.",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    totalTimeMinutes: 50,
    servings: 6,
  },
  {
    name: "Crispy Rice Bowl",
    author: "Gathered Test Kitchen",
    description: "Crisped rice with vegetables, a fried egg, and spicy sauce.",
    ingredients: [
      { name: "White rice", quantity: 2, unit: "cup" },
      { name: "Eggs", quantity: 2, unit: "piece" },
      { name: "Cucumber", quantity: 1, unit: "piece" },
      { name: "Carrots", quantity: 2, unit: "piece" },
      { name: "Chili crisp", quantity: 2, unit: "tablespoon" },
    ],
    directions: [
      "Crisp cooked rice in a hot skillet.",
      "Prepare vegetables and fry eggs.",
      "Assemble bowls with chili crisp.",
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    totalTimeMinutes: 30,
    servings: 2,
  },
  {
    name: "Lemon Pasta",
    author: "Gathered Test Kitchen",
    description:
      "Bright, buttery pasta with lemon, parmesan, and black pepper.",
    ingredients: [
      { name: "Pasta", quantity: 8, unit: "ounce" },
      { name: "Lemon", quantity: 1, unit: "piece" },
      { name: "Parmesan", quantity: 2, unit: "ounce" },
      { name: "Butter", quantity: 4, unit: "tablespoon" },
      { name: "Black pepper", quantity: 1, unit: "teaspoon" },
    ],
    directions: [
      "Boil pasta until al dente.",
      "Emulsify butter, lemon, parmesan, and pasta water.",
      "Toss pasta in the sauce and serve.",
    ],
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    servings: 3,
  },
];

const connectionString = process.env.DATABASE_URL;
const userId = process.env.SEED_CLERK_USER_ID;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed recipes.");
}

if (!userId) {
  throw new Error(
    "SEED_CLERK_USER_ID is required so seeded recipes belong to a Clerk user.",
  );
}

const queryClient = postgres(connectionString, { max: 1 });
const db = drizzle(queryClient);

const existingRecipes = await db
  .select({ name: recipes.name })
  .from(recipes)
  .where(eq(recipes.userId, userId));
const existingNames = new Set(existingRecipes.map((recipe) => recipe.name));
const recipesToInsert = seedRecipes
  .filter((recipe) => !existingNames.has(recipe.name))
  .map((recipe) => ({ ...recipe, userId }));

for (const recipe of seedRecipes.filter((recipe) =>
  existingNames.has(recipe.name),
)) {
  await db
    .update(recipes)
    .set(recipe)
    .where(and(eq(recipes.userId, userId), eq(recipes.name, recipe.name)));
}

if (recipesToInsert.length > 0) {
  await db.insert(recipes).values(recipesToInsert);
}

await queryClient.end();

console.log(
  `Seeded ${recipesToInsert.length} recipes for ${userId}. Updated ${existingRecipes.length} existing recipes.`,
);
