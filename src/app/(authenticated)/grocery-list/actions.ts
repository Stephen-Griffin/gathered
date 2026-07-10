"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { groceryListItems, pantryItems, recipes } from "@/db/schema";
import {
  getRemainingIngredientQuantity,
  normalizeIngredientName,
} from "@/features/grocery/ingredient-matching";
import { groupSimilarShoppingItems } from "@/features/grocery/shopping-item-matching";
import {
  getDefaultIngredientUnit,
  ingredientUnits,
  type IngredientUnit,
} from "@/features/grocery/ingredient-measurements";

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function getRequiredQuantity(formData: FormData) {
  const quantity = Number(getRequiredText(formData, "quantity"));

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("quantity must be greater than 0.");
  }

  return quantity;
}

function getRequiredUnit(formData: FormData, name: string): IngredientUnit {
  const unit = getRequiredText(formData, "unit");

  if (ingredientUnits.includes(unit as IngredientUnit)) {
    return unit as IngredientUnit;
  }

  return getDefaultIngredientUnit(name);
}

async function getSignedInUserId() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return userId;
}

export async function addRecipeIngredientsToGroceryList(formData: FormData) {
  const userId = await getSignedInUserId();
  const recipeId = getRequiredText(formData, "recipeId");

  const recipe = await getDb().query.recipes.findFirst({
    where: and(eq(recipes.id, recipeId), eq(recipes.userId, userId)),
  });

  if (!recipe) {
    throw new Error("Recipe not found.");
  }

  const userPantryItems = await getDb().query.pantryItems.findMany({
    where: eq(pantryItems.userId, userId),
  });
  const pantryIngredients = userPantryItems.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unit: item.unit as IngredientUnit,
  }));
  const groceryItemsToAdd = recipe.ingredients
    .map((ingredient) => ({
      ...ingredient,
      quantity: getRemainingIngredientQuantity(ingredient, pantryIngredients),
      normalizedName: normalizeIngredientName(ingredient.name),
    }))
    .filter((ingredient) => ingredient.normalizedName.length > 0)
    .filter((ingredient) => ingredient.quantity > 0);

  const groupedGroceryItems = groupSimilarShoppingItems(
    groceryItemsToAdd.map((item, index) => ({
      id: `${recipe.id}:${index}`,
      name: item.name,
      normalizedName: item.normalizedName,
      quantity: item.quantity,
      unit: item.unit,
      kind: "grocery" as const,
      providerId: "target",
    })),
  );

  if (groupedGroceryItems.length > 0) {
    await getDb()
      .insert(groceryListItems)
      .values(
        groupedGroceryItems.map((item) => ({
          userId,
          sourceRecipeId: recipe.id,
          name: item.name,
          normalizedName: item.normalizedName,
          quantity: item.quantity,
          unit: item.unit,
        })),
      )
      .onConflictDoUpdate({
        target: [
          groceryListItems.userId,
          groceryListItems.normalizedName,
          groceryListItems.unit,
        ],
        set: {
          quantity: sql`${groceryListItems.quantity} + excluded.quantity`,
          updatedAt: new Date(),
        },
      });
  }

  revalidatePath("/grocery-list");
  revalidatePath("/recipes");
  redirect("/grocery-list");
}

export async function addGroceryListItem(formData: FormData) {
  const userId = await getSignedInUserId();
  const name = getRequiredText(formData, "name");
  const normalizedName = normalizeIngredientName(name);
  const quantity = getRequiredQuantity(formData);
  const unit = getRequiredUnit(formData, name);

  if (!normalizedName) {
    throw new Error("Ingredient must include a searchable name.");
  }

  await getDb()
    .insert(groceryListItems)
    .values({ name, normalizedName, quantity, unit, userId })
    .onConflictDoUpdate({
      target: [
        groceryListItems.userId,
        groceryListItems.normalizedName,
        groceryListItems.unit,
      ],
      set: {
        quantity: sql`${groceryListItems.quantity} + excluded.quantity`,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/grocery-list");
}

export async function addPantryItem(formData: FormData) {
  const userId = await getSignedInUserId();
  const name = getRequiredText(formData, "name");
  const normalizedName = normalizeIngredientName(name);
  const quantity = getRequiredQuantity(formData);
  const unit = getRequiredUnit(formData, name);

  if (!normalizedName) {
    throw new Error("Pantry item must include a searchable name.");
  }

  await getDb()
    .insert(pantryItems)
    .values({ name, normalizedName, quantity, unit, userId })
    .onConflictDoUpdate({
      target: [
        pantryItems.userId,
        pantryItems.normalizedName,
        pantryItems.unit,
      ],
      set: {
        quantity: sql`${pantryItems.quantity} + excluded.quantity`,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/grocery-list");
  revalidatePath("/pantry");
}
