import type {
  ShoppingProviderId,
  ShoppingRowKind,
} from "./shopping-providers";
import { normalizeIngredientName } from "./ingredient-matching";

export type MatchableShoppingItem = Readonly<{
  id: string;
  name: string;
  normalizedName?: string;
  quantity: number;
  unit: string;
  kind: ShoppingRowKind;
  providerId: ShoppingProviderId;
}>;

export type ShoppingItemGroup = Readonly<{
  itemIds: readonly string[];
  name: string;
  normalizedName: string;
  quantity: number;
  unit: string;
  kind: ShoppingRowKind;
  providerId: ShoppingProviderId;
  requiresReview: boolean;
}>;

function normalizeHouseholdName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getShoppingItemMatchName(item: MatchableShoppingItem) {
  const suppliedName = item.normalizedName?.trim();

  if (item.kind === "grocery" && suppliedName) {
    return suppliedName.toLowerCase();
  }

  return item.kind === "grocery"
    ? normalizeIngredientName(item.name)
    : normalizeHouseholdName(item.name);
}

function canGroup(item: MatchableShoppingItem) {
  return item.kind === "grocery" || item.kind === "household";
}

/**
 * Groups only unambiguous rows with the same category and provider. Ambiguous
 * and unsupported rows intentionally remain independent manual-review rows.
 */
export function groupSimilarShoppingItems(
  items: readonly MatchableShoppingItem[],
): ShoppingItemGroup[] {
  const groups = new Map<string, ShoppingItemGroup>();

  for (const item of items) {
    const normalizedName = getShoppingItemMatchName(item);
    const isGroupable = canGroup(item) && normalizedName.length > 0;

    if (!isGroupable) {
      groups.set(`manual:${item.id}`, {
        itemIds: [item.id],
        name: item.name,
        normalizedName,
        quantity: item.quantity,
        unit: item.unit,
        kind: item.kind,
        providerId: item.providerId,
        requiresReview: true,
      });
      continue;
    }

    const key = [item.kind, item.providerId, normalizedName, item.unit]
      .map((part) => part.toLowerCase())
      .join(":");
    const existingGroup = groups.get(key);

    if (existingGroup) {
      groups.set(key, {
        ...existingGroup,
        itemIds: [...existingGroup.itemIds, item.id],
        quantity: existingGroup.quantity + item.quantity,
      });
      continue;
    }

    groups.set(key, {
      itemIds: [item.id],
      name: item.name,
      normalizedName,
      quantity: item.quantity,
      unit: item.unit,
      kind: item.kind,
      providerId: item.providerId,
      requiresReview: false,
    });
  }

  return [...groups.values()];
}
