import Link from "next/link";
import { IngredientListEditor } from "@/features/grocery/ingredient-list-editor";
import type { RecipeIngredient } from "@/features/grocery/ingredient-measurements";
import { saveRecipe } from "./actions";

type RecipeFormValues = Readonly<{
  id?: string;
  name?: string;
  author?: string;
  description?: string | null;
  ingredients?: RecipeIngredient[];
  directions?: string[];
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  totalTimeMinutes?: number;
  servings?: number;
}>;

type RecipeFormProps = Readonly<{
  title: string;
  eyebrow: string;
  recipe?: RecipeFormValues;
}>;

const servingOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const timeOptions = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 90, 105, 120, 150, 180, 240,
];

function TextField({
  label,
  name,
  defaultValue,
  required = true,
}: Readonly<{
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}>) {
  return (
    <label className="grid gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black/60">
      {label}
      <input
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="h-12 rounded-2xl border border-line bg-white px-4 text-[15px] font-semibold normal-case tracking-normal text-black outline-none transition focus:border-accent"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  required = true,
  helpText,
}: Readonly<{
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  helpText?: string;
}>) {
  return (
    <label className="grid gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black/60">
      {label}
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        rows={5}
        className="resize-y rounded-2xl border border-line bg-white px-4 py-3 text-[15px] font-semibold normal-case leading-6 tracking-normal text-black outline-none transition focus:border-accent"
      />
      {helpText ? (
        <span className="text-[12px] font-medium normal-case tracking-normal text-black/55">
          {helpText}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: Readonly<{
  label: string;
  name: string;
  defaultValue?: number;
  options: number[];
}>) {
  return (
    <label className="grid gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black/60">
      {label}
      <select
        name={name}
        required
        defaultValue={defaultValue ?? ""}
        className="h-12 rounded-2xl border border-line bg-white px-4 text-[15px] font-semibold normal-case tracking-normal text-black outline-none transition focus:border-accent"
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RecipeForm({ title, eyebrow, recipe }: RecipeFormProps) {
  return (
    <section className="w-full max-w-[860px]">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-0.06em] text-black sm:text-[44px]">
            {title}
          </h1>
        </div>
        <Link
          href="/recipes"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-line bg-card px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:-translate-y-0.5 hover:bg-white"
        >
          Back
        </Link>
      </div>

      <form
        action={saveRecipe}
        className="grid gap-5 rounded-[28px] border border-line bg-card p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-7"
      >
        {recipe?.id ? (
          <input type="hidden" name="recipeId" value={recipe.id} />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Recipe name"
            name="name"
            defaultValue={recipe?.name}
          />
          <TextField
            label="Author"
            name="author"
            defaultValue={recipe?.author}
          />
        </div>

        <TextAreaField
          label="Description"
          name="description"
          required={false}
          defaultValue={recipe?.description}
        />

        <IngredientListEditor initialIngredients={recipe?.ingredients} />

        <TextAreaField
          label="Directions"
          name="directions"
          defaultValue={recipe?.directions?.join("\n")}
          helpText="Add one step per line."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            label="Servings"
            name="servings"
            defaultValue={recipe?.servings}
            options={servingOptions}
          />
          <SelectField
            label="Prep minutes"
            name="prepTimeMinutes"
            defaultValue={recipe?.prepTimeMinutes}
            options={timeOptions}
          />
          <SelectField
            label="Cook minutes"
            name="cookTimeMinutes"
            defaultValue={recipe?.cookTimeMinutes}
            options={timeOptions}
          />
          <SelectField
            label="Total minutes"
            name="totalTimeMinutes"
            defaultValue={recipe?.totalTimeMinutes}
            options={timeOptions}
          />
        </div>

        <button className="mt-2 h-13 rounded-full bg-accent px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-secondary sm:justify-self-end">
          Save recipe
        </button>
      </form>
    </section>
  );
}
