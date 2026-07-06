"use client";

import { useState } from "react";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import {
  getDefaultIngredientUnit,
  getQuantityOptions,
  ingredientMeasurements,
  ingredientUnits,
  type IngredientUnit,
} from "./ingredient-measurements";

type MeasuredIngredientFieldsProps = Readonly<{
  buttonLabel: string;
  placeholder: string;
}>;

export function MeasuredIngredientFields({
  buttonLabel,
  placeholder,
}: MeasuredIngredientFieldsProps) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<IngredientUnit>("piece");
  const [quantity, setQuantity] = useState(1);
  const ingredientOptions = ingredientMeasurements.map((ingredient) => ({
    label: ingredient.name,
    value: ingredient.name,
    description: `Tracked in ${ingredient.unit}`,
  }));
  const quantityOptions = getQuantityOptions(unit).map((option) => ({
    label: option.toString(),
    value: option.toString(),
  }));
  const unitOptions = ingredientUnits.map((option) => ({
    label: option,
    value: option,
  }));

  return (
    <>
      <CustomDropdown
        name="name"
        required
        value={name}
        options={ingredientOptions}
        allowCustomValue
        placeholder={placeholder}
        searchPlaceholder="Search ingredients"
        className="h-12 rounded-full bg-white px-4"
        onChange={(nextName) => {
          const nextUnit = getDefaultIngredientUnit(nextName);

          setName(nextName);
          setUnit(nextUnit);
          setQuantity(getQuantityOptions(nextUnit)[0] ?? 1);
        }}
      />
      <CustomDropdown
        name="quantity"
        required
        value={quantity.toString()}
        options={quantityOptions}
        placeholder="Qty"
        searchPlaceholder="Search qty"
        className="h-12 rounded-full bg-white px-3"
        onChange={(nextQuantity) => setQuantity(Number(nextQuantity))}
      />
      <CustomDropdown
        name="unit"
        required
        value={unit}
        options={unitOptions}
        placeholder="Unit"
        searchPlaceholder="Search units"
        className="h-12 rounded-full bg-white px-3"
        onChange={(nextUnit) => setUnit(nextUnit as IngredientUnit)}
      />
      <button className="h-12 rounded-full bg-[#75776b] px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#686a60]">
        {buttonLabel}
      </button>
    </>
  );
}
