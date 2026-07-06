import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { recipes } from "@/db/schema";
import { formatIngredientAmount } from "@/features/grocery/ingredient-measurements";
import { addRecipeIngredientsToGroceryList } from "../grocery-list/actions";

export default async function RecipesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userRecipes = await getDb().query.recipes.findMany({
    where: eq(recipes.userId, userId),
    orderBy: asc(recipes.name),
  });

  if (userRecipes.length === 0) {
    return (
      <section className="w-full">
        <div className="mx-auto mb-7 flex max-w-[820px] items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
              Recipe box
            </p>
            <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-0.06em] text-black sm:text-[44px]">
              Recipes
            </h1>
          </div>
          <Link
            href="/recipes/new"
            className="inline-flex size-12 items-center justify-center rounded-full bg-[#74776B] text-[26px] font-bold leading-none text-white shadow-[0_14px_28px_rgba(116,119,107,0.24)] transition hover:-translate-y-0.5 hover:bg-[#676a60]"
            aria-label="Create recipe"
          >
            +
          </Link>
        </div>
        <div className="mx-auto flex min-h-[420px] max-w-md items-center justify-center rounded-[28px] border border-line bg-card px-8 py-10 text-center shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
          <div>
            <h1 className="text-[28px] font-bold leading-tight tracking-[-0.05em] text-black">
              No recipes gathered yet.
            </h1>
            <p className="mt-4 text-[15px] font-medium text-black">
              Add your favorite meals to start building plans and grocery lists.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mx-auto mb-7 flex max-w-[820px] items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
            Recipe box
          </p>
          <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-0.06em] text-black sm:text-[44px]">
            Recipes
          </h1>
        </div>
        <Link
          href="/recipes/new"
          className="inline-flex size-12 items-center justify-center rounded-full bg-[#74776B] text-[26px] font-bold leading-none text-white shadow-[0_14px_28px_rgba(116,119,107,0.24)] transition hover:-translate-y-0.5 hover:bg-[#676a60]"
          aria-label="Create recipe"
        >
          +
        </Link>
      </div>
      <div className="mx-auto grid max-w-[820px] grid-cols-1 gap-5 sm:grid-cols-2">
        {userRecipes.map((recipe) => (
          <article
            key={recipe.id}
            className="grid min-h-32 grid-cols-1 gap-5 rounded-[22px] border border-line bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:grid-cols-[1fr_132px] sm:items-center"
          >
            <div>
              <h1 className="text-[18px] font-bold tracking-[-0.04em] text-black">
                {recipe.name}
              </h1>
              <p className="mt-2 text-[13px] font-medium leading-5 text-black/70">
                By {recipe.author}
              </p>
              <p className="mt-2 text-[13px] font-bold leading-5 text-black">
                {recipe.servings} servings · {recipe.totalTimeMinutes} min total
              </p>
              {recipe.description ? (
                <p className="mt-3 text-[13px] font-medium leading-5 text-black/75">
                  {recipe.description}
                </p>
              ) : null}
              <p className="mt-3 text-[12px] font-medium leading-5 text-black/65">
                {recipe.ingredients
                  .slice(0, 3)
                  .map(formatIngredientAmount)
                  .join(", ")}
                {recipe.ingredients.length > 3 ? "..." : ""}
              </p>
              <p className="mt-2 text-[12px] font-medium leading-5 text-black/65">
                {recipe.directions.length} steps · {recipe.prepTimeMinutes} min
                prep · {recipe.cookTimeMinutes} min cook
              </p>
            </div>
            <div className="grid gap-3">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#74776B] px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition hover:-translate-y-0.5 hover:bg-[#676a60]"
              >
                Edit recipe
              </Link>
              <form action={addRecipeIngredientsToGroceryList}>
                <input type="hidden" name="recipeId" value={recipe.id} />
                <button className="h-12 w-full rounded-full border border-line bg-white px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-black transition hover:-translate-y-0.5">
                  Add to grocery list
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
