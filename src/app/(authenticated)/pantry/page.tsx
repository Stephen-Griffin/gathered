import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { pantryItems } from "@/db/schema";
import { formatIngredientAmount } from "@/features/grocery/ingredient-measurements";
import { MeasuredIngredientFields } from "@/features/grocery/measured-ingredient-fields";
import { addPantryItem } from "../grocery-list/actions";

export default async function PantryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const pantry = await getDb().query.pantryItems.findMany({
    where: eq(pantryItems.userId, userId),
    orderBy: asc(pantryItems.name),
  });

  return (
    <section className="w-full max-w-[920px]">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
            Stored staples
          </p>
          <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-0.06em] text-black sm:text-[44px]">
            Pantry
          </h1>
          <p className="mt-4 max-w-[560px] text-[15px] font-medium leading-6 text-black/70">
            Track ingredients you already have so recipe imports only add what
            you still need to buy.
          </p>
        </div>
        <Link
          href="/grocery-list"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-line bg-card px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:-translate-y-0.5 hover:bg-white"
        >
          Grocery list
        </Link>
      </div>

      <div className="rounded-[28px] border border-line bg-card p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold tracking-[-0.05em] text-black">
            Items on hand
          </h2>
          <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-black/65">
            {pantry.length} items
          </span>
        </div>

        <p className="mt-3 max-w-[620px] text-[13px] font-medium leading-5 text-black/70">
          Add staples like salt, pepper, butter, rice, olive oil, or anything in
          your fridge. Matching recipe ingredients are subtracted before they
          reach your shopping list.
        </p>

        <form
          action={addPantryItem}
          className="mt-5 grid gap-3 sm:grid-cols-[1fr_96px_130px_auto]"
        >
          <MeasuredIngredientFields
            buttonLabel="Add pantry item"
            placeholder="Add pantry item"
          />
        </form>

        {pantry.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {pantry.map((item) => (
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
              Your pantry is empty.
            </h2>
            <p className="mt-3 text-[14px] font-medium leading-6 text-black/70">
              Add what you already have before sending recipe ingredients to the
              grocery list.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
