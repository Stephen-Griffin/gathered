import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { groceryListItems } from "@/db/schema";
import { formatIngredientAmount } from "@/features/grocery/ingredient-measurements";
import { MeasuredIngredientFields } from "@/features/grocery/measured-ingredient-fields";
import { addGroceryListItem } from "./actions";

export default async function GroceryListPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const groceries = await getDb().query.groceryListItems.findMany({
    where: eq(groceryListItems.userId, userId),
    orderBy: asc(groceryListItems.name),
  });

  return (
    <section className="w-full max-w-[920px]">
      <div className="mb-7">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
          Shopping list
        </p>
        <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-0.06em] text-black sm:text-[44px]">
          Grocery list
        </h1>
        <p className="mt-4 max-w-[560px] text-[15px] font-medium leading-6 text-black/70">
          Recipe ingredients land here unless they already match something in
          your pantry.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-[28px] border border-line bg-card p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[22px] font-bold tracking-[-0.05em] text-black">
              Items to buy
            </h2>
            <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-black/65">
              {groceries.length} items
            </span>
          </div>

          <form
            action={addGroceryListItem}
            className="mt-5 grid gap-3 sm:grid-cols-[1fr_96px_130px_auto]"
          >
            <MeasuredIngredientFields
              buttonLabel="Add"
              placeholder="Add an ingredient"
            />
          </form>

          {groceries.length > 0 ? (
            <ul className="mt-6 grid gap-3">
              {groceries.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-line bg-white px-4 py-3 text-[14px] font-semibold text-black"
                >
                  {formatIngredientAmount(item)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-line bg-white px-5 py-8 text-center">
              <h2 className="text-[20px] font-bold tracking-[-0.05em] text-black">
                No groceries yet.
              </h2>
              <p className="mt-3 text-[14px] font-medium leading-6 text-black/70">
                Add items manually or send ingredients over from a recipe.
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-[28px] border border-line bg-card p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-7">
          <h2 className="text-[22px] font-bold tracking-[-0.05em] text-black">
            Pantry check
          </h2>
          <p className="mt-3 text-[13px] font-medium leading-5 text-black/70">
            Pantry staples are managed separately and automatically reduce what
            gets added here from recipes.
          </p>
          <Link
            href="/pantry"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#75776b] px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#686a60]"
          >
            Open pantry
          </Link>
        </aside>
      </div>
    </section>
  );
}
