"use client";

import { useMemo, useState } from "react";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import {
  getDefaultIngredientUnit,
  getQuantityOptions,
  ingredientMeasurements,
  ingredientUnits,
  type IngredientUnit,
  type RecipeIngredient,
} from "./ingredient-measurements";

type IngredientListEditorProps = Readonly<{
  initialIngredients?: RecipeIngredient[];
}>;

function createBlankIngredient(): RecipeIngredient {
  return { name: "", quantity: 1, unit: "piece" };
}

export function IngredientListEditor({
  initialIngredients,
}: IngredientListEditorProps) {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    initialIngredients && initialIngredients.length > 0
      ? [...initialIngredients]
      : [createBlankIngredient()],
  );
  const serializedIngredients = useMemo(
    () =>
      JSON.stringify(
        ingredients.filter((ingredient) => ingredient.name.trim().length > 0),
      ),
    [ingredients],
  );

  function updateIngredient(index: number, ingredient: RecipeIngredient) {
    setIngredients((currentIngredients) =>
      currentIngredients.map((currentIngredient, currentIndex) =>
        currentIndex === index ? ingredient : currentIngredient,
      ),
    );
  }

  const ingredientOptions = ingredientMeasurements.map((ingredient) => ({
    label: ingredient.name,
    value: ingredient.name,
    description: `Tracked in ${ingredient.unit}`,
  }));
  const unitOptions = ingredientUnits.map((unit) => ({
    label: unit,
    value: unit,
  }));

  return (
    <div className="grid gap-3">
      <input type="hidden" name="ingredients" value={serializedIngredients} />
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60">
          Ingredients
        </p>
        <p className="mt-1 text-[12px] font-medium text-black/55">
          Choose an ingredient and quantity. Known items automatically use their
          preferred tracking unit.
        </p>
      </div>

      <div className="grid gap-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-2xl border border-line bg-white p-3 sm:grid-cols-[1fr_112px_150px_40px]"
          >
            <CustomDropdown
              value={ingredient.name}
              options={ingredientOptions}
              allowCustomValue
              required={index === 0}
              placeholder="Ingredient"
              searchPlaceholder="Search ingredients"
              className="h-11 rounded-xl bg-card px-3"
              onChange={(name) => {
                const unit = getDefaultIngredientUnit(name);

                updateIngredient(index, { ...ingredient, name, unit });
              }}
            />
            <CustomDropdown
              value={ingredient.quantity.toString()}
              options={getQuantityOptions(ingredient.unit).map((quantity) => ({
                label: quantity.toString(),
                value: quantity.toString(),
              }))}
              placeholder="Qty"
              searchPlaceholder="Search qty"
              className="h-11 rounded-xl bg-card px-3"
              onChange={(quantity) =>
                updateIngredient(index, {
                  ...ingredient,
                  quantity: Number(quantity),
                })
              }
            />
            <CustomDropdown
              value={ingredient.unit}
              options={unitOptions}
              placeholder="Unit"
              searchPlaceholder="Search units"
              className="h-11 rounded-xl bg-card px-3"
              onChange={(unit) =>
                updateIngredient(index, {
                  ...ingredient,
                  unit: unit as IngredientUnit,
                })
              }
            />
            <button
              type="button"
              onClick={() =>
                setIngredients((currentIngredients) =>
                  currentIngredients.length === 1
                    ? [createBlankIngredient()]
                    : currentIngredients.filter(
                        (_, currentIndex) => currentIndex !== index,
                      ),
                )
              }
              className="h-11 rounded-xl border border-line bg-card text-[16px] font-bold text-black transition hover:bg-white"
              aria-label="Remove ingredient"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setIngredients((currentIngredients) => [
            ...currentIngredients,
            createBlankIngredient(),
          ])
        }
        className="h-11 rounded-full border border-line bg-white px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:-translate-y-0.5"
      >
        Add ingredient
      </button>
    </div>
  );
}
