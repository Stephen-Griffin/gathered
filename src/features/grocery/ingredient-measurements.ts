export type IngredientUnit =
  | "piece"
  | "tablespoon"
  | "teaspoon"
  | "cup"
  | "ounce"
  | "pound"
  | "gram"
  | "can"
  | "bottle"
  | "package"
  | "bag"
  | "bunch";

export type RecipeIngredient = Readonly<{
  name: string;
  quantity: number;
  unit: IngredientUnit;
}>;

export type IngredientMeasurement = Readonly<{
  name: string;
  unit: IngredientUnit;
}>;

export const ingredientMeasurements = [
  { name: "All-purpose flour", unit: "cup" },
  { name: "Almond butter", unit: "tablespoon" },
  { name: "Almond milk", unit: "cup" },
  { name: "Apples", unit: "piece" },
  { name: "Apple cider vinegar", unit: "tablespoon" },
  { name: "Asparagus", unit: "bunch" },
  { name: "Avocado", unit: "piece" },
  { name: "Bacon", unit: "ounce" },
  { name: "Baking powder", unit: "teaspoon" },
  { name: "Baking soda", unit: "teaspoon" },
  { name: "Bananas", unit: "piece" },
  { name: "Basil", unit: "bunch" },
  { name: "Basmati rice", unit: "cup" },
  { name: "Bay leaves", unit: "piece" },
  { name: "Beans", unit: "can" },
  { name: "Beef broth", unit: "cup" },
  { name: "Bell pepper", unit: "piece" },
  { name: "Black beans", unit: "can" },
  { name: "Black pepper", unit: "teaspoon" },
  { name: "Blueberries", unit: "cup" },
  { name: "Bread", unit: "package" },
  { name: "Breadcrumbs", unit: "cup" },
  { name: "Broccoli", unit: "piece" },
  { name: "Brown rice", unit: "cup" },
  { name: "Brown sugar", unit: "cup" },
  { name: "Butter", unit: "tablespoon" },
  { name: "Buttermilk", unit: "cup" },
  { name: "Cabbage", unit: "piece" },
  { name: "Carrots", unit: "piece" },
  { name: "Cauliflower", unit: "piece" },
  { name: "Celery", unit: "piece" },
  { name: "Cheddar cheese", unit: "ounce" },
  { name: "Chicken breast", unit: "pound" },
  { name: "Chicken broth", unit: "cup" },
  { name: "Chicken thighs", unit: "pound" },
  { name: "Chickpeas", unit: "can" },
  { name: "Chili crisp", unit: "tablespoon" },
  { name: "Chili powder", unit: "tablespoon" },
  { name: "Cilantro", unit: "bunch" },
  { name: "Cinnamon", unit: "teaspoon" },
  { name: "Coconut milk", unit: "can" },
  { name: "Corn", unit: "cup" },
  { name: "Corn tortillas", unit: "package" },
  { name: "Cream cheese", unit: "ounce" },
  { name: "Crushed tomatoes", unit: "can" },
  { name: "Cucumber", unit: "piece" },
  { name: "Cumin", unit: "teaspoon" },
  { name: "Dijon mustard", unit: "tablespoon" },
  { name: "Dill", unit: "bunch" },
  { name: "Eggs", unit: "piece" },
  { name: "Feta cheese", unit: "ounce" },
  { name: "Fish sauce", unit: "tablespoon" },
  { name: "Garlic", unit: "piece" },
  { name: "Ginger", unit: "tablespoon" },
  { name: "Goat cheese", unit: "ounce" },
  { name: "Granulated sugar", unit: "cup" },
  { name: "Greek yogurt", unit: "cup" },
  { name: "Green beans", unit: "pound" },
  { name: "Green onions", unit: "bunch" },
  { name: "Ground beef", unit: "pound" },
  { name: "Ground pork", unit: "pound" },
  { name: "Ground turkey", unit: "pound" },
  { name: "Heavy cream", unit: "cup" },
  { name: "Honey", unit: "tablespoon" },
  { name: "Hot sauce", unit: "tablespoon" },
  { name: "Jalapeno", unit: "piece" },
  { name: "Kale", unit: "bunch" },
  { name: "Ketchup", unit: "tablespoon" },
  { name: "Lemon", unit: "piece" },
  { name: "Lentils", unit: "cup" },
  { name: "Lettuce", unit: "piece" },
  { name: "Lime", unit: "piece" },
  { name: "Maple syrup", unit: "tablespoon" },
  { name: "Mayonnaise", unit: "tablespoon" },
  { name: "Milk", unit: "cup" },
  { name: "Mushrooms", unit: "ounce" },
  { name: "Mustard", unit: "tablespoon" },
  { name: "Oats", unit: "cup" },
  { name: "Olive oil", unit: "tablespoon" },
  { name: "Onion", unit: "piece" },
  { name: "Orange", unit: "piece" },
  { name: "Oregano", unit: "teaspoon" },
  { name: "Paprika", unit: "teaspoon" },
  { name: "Parmesan", unit: "ounce" },
  { name: "Parsley", unit: "bunch" },
  { name: "Pasta", unit: "ounce" },
  { name: "Peanut butter", unit: "tablespoon" },
  { name: "Peas", unit: "cup" },
  { name: "Pita", unit: "package" },
  { name: "Potatoes", unit: "piece" },
  { name: "Quinoa", unit: "cup" },
  { name: "Red onion", unit: "piece" },
  { name: "Red pepper flakes", unit: "teaspoon" },
  { name: "Rigatoni", unit: "ounce" },
  { name: "Romaine", unit: "piece" },
  { name: "Rosemary", unit: "teaspoon" },
  { name: "Salsa", unit: "cup" },
  { name: "Salt", unit: "teaspoon" },
  { name: "Sausage", unit: "pound" },
  { name: "Sesame oil", unit: "tablespoon" },
  { name: "Shallot", unit: "piece" },
  { name: "Shrimp", unit: "pound" },
  { name: "Sour cream", unit: "cup" },
  { name: "Soy sauce", unit: "tablespoon" },
  { name: "Spinach", unit: "ounce" },
  { name: "Sweet potatoes", unit: "piece" },
  { name: "Thyme", unit: "teaspoon" },
  { name: "Tomato paste", unit: "tablespoon" },
  { name: "Tomatoes", unit: "piece" },
  { name: "Tortilla chips", unit: "bag" },
  { name: "Tortillas", unit: "package" },
  { name: "Tuna", unit: "can" },
  { name: "Vegetable broth", unit: "cup" },
  { name: "White beans", unit: "can" },
  { name: "White rice", unit: "cup" },
  { name: "Worcestershire sauce", unit: "tablespoon" },
  { name: "Yogurt", unit: "cup" },
  { name: "Zucchini", unit: "piece" },
] satisfies IngredientMeasurement[];

export const ingredientUnits: IngredientUnit[] = [
  "piece",
  "tablespoon",
  "teaspoon",
  "cup",
  "ounce",
  "pound",
  "gram",
  "can",
  "bottle",
  "package",
  "bag",
  "bunch",
];

export function getDefaultIngredientUnit(name: string): IngredientUnit {
  const normalizedName = name.trim().toLowerCase();
  const match = ingredientMeasurements.find(
    (ingredient) => ingredient.name.toLowerCase() === normalizedName,
  );

  return match?.unit ?? "piece";
}

export function getQuantityOptions(unit: IngredientUnit) {
  if (["piece", "can", "package", "bag", "bottle", "bunch"].includes(unit)) {
    return Array.from({ length: 20 }, (_, index) => index + 1);
  }

  return [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24, 32];
}

export function formatIngredientAmount(ingredient: {
  name: string;
  quantity: number;
  unit: string;
}) {
  const quantity = Number.isInteger(ingredient.quantity)
    ? ingredient.quantity.toString()
    : ingredient.quantity.toString();
  const unit =
    ingredient.quantity === 1 ? ingredient.unit : `${ingredient.unit}s`;

  return `${quantity} ${unit} ${ingredient.name}`;
}
