import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { recipes } from "@/db/schema";
import { RecipeForm } from "../../recipe-form";

export default async function EditRecipePage({
  params,
}: Readonly<{
  params: Promise<{ recipeId: string }>;
}>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { recipeId } = await params;
  const recipe = await getDb().query.recipes.findFirst({
    where: and(eq(recipes.id, recipeId), eq(recipes.userId, userId)),
  });

  if (!recipe) {
    notFound();
  }

  return (
    <RecipeForm eyebrow="Edit recipe" title={recipe.name} recipe={recipe} />
  );
}
