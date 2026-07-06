"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { recipes } from "@/db/schema";
import {
  getDefaultIngredientUnit,
  ingredientUnits,
  type RecipeIngredient,
} from "@/features/grocery/ingredient-measurements";

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function getOptionalText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

function getRequiredInteger(formData: FormData, key: string) {
  const value = Number(getRequiredText(formData, key));

  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${key} must be a valid whole number.`);
  }

  return value;
}

function getRequiredList(formData: FormData, key: string) {
  const values = getRequiredText(formData, key)
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);

  if (values.length === 0) {
    throw new Error(`${key} must include at least one item.`);
  }

  return values;
}

function getRequiredIngredients(formData: FormData) {
  const rawIngredients = getRequiredText(formData, "ingredients");
  const parsedIngredients: unknown = JSON.parse(rawIngredients);

  if (!Array.isArray(parsedIngredients)) {
    throw new Error("ingredients must be a list.");
  }

  const ingredients = parsedIngredients
    .map((ingredient) => {
      if (!ingredient || typeof ingredient !== "object") {
        return null;
      }

      const name = "name" in ingredient ? ingredient.name : null;
      const quantity =
        "quantity" in ingredient ? Number(ingredient.quantity) : 0;
      const unit = "unit" in ingredient ? ingredient.unit : null;

      if (typeof name !== "string" || name.trim().length === 0) {
        return null;
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return null;
      }

      const ingredientUnit: RecipeIngredient["unit"] =
        typeof unit === "string" &&
        ingredientUnits.includes(unit as RecipeIngredient["unit"])
          ? (unit as RecipeIngredient["unit"])
          : getDefaultIngredientUnit(name);

      return {
        name: name.trim(),
        quantity,
        unit: ingredientUnit,
      } satisfies RecipeIngredient;
    })
    .filter(
      (ingredient): ingredient is RecipeIngredient => ingredient !== null,
    );

  if (ingredients.length === 0) {
    throw new Error("ingredients must include at least one item.");
  }

  return ingredients;
}

export async function saveRecipe(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const recipeId = getOptionalText(formData, "recipeId");
  const recipeValues = {
    name: getRequiredText(formData, "name"),
    author: getRequiredText(formData, "author"),
    description: getOptionalText(formData, "description"),
    ingredients: getRequiredIngredients(formData),
    directions: getRequiredList(formData, "directions"),
    prepTimeMinutes: getRequiredInteger(formData, "prepTimeMinutes"),
    cookTimeMinutes: getRequiredInteger(formData, "cookTimeMinutes"),
    totalTimeMinutes: getRequiredInteger(formData, "totalTimeMinutes"),
    servings: getRequiredInteger(formData, "servings"),
    updatedAt: new Date(),
  };

  if (recipeValues.servings < 1) {
    throw new Error("servings must be at least 1.");
  }

  if (recipeId) {
    await getDb()
      .update(recipes)
      .set(recipeValues)
      .where(and(eq(recipes.id, recipeId), eq(recipes.userId, userId)));

    revalidatePath("/recipes");
    revalidatePath(`/recipes/${recipeId}/edit`);
    redirect(`/recipes/${recipeId}/edit`);
  }

  const [createdRecipe] = await getDb()
    .insert(recipes)
    .values({ ...recipeValues, userId })
    .returning({ id: recipes.id });

  revalidatePath("/recipes");
  redirect(`/recipes/${createdRecipe.id}/edit`);
}
