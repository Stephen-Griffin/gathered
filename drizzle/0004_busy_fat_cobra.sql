ALTER TABLE "recipes" ADD COLUMN "ingredients_json" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "recipes"
SET "ingredients_json" = COALESCE(
	(
		SELECT jsonb_agg(jsonb_build_object('name', ingredient, 'quantity', 1, 'unit', 'piece'))
		FROM unnest("ingredients") AS ingredient
	),
	'[]'::jsonb
);--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "ingredients";--> statement-breakpoint
ALTER TABLE "recipes" RENAME COLUMN "ingredients_json" TO "ingredients";--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "ingredients" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "grocery_list_items" ADD COLUMN "quantity" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "grocery_list_items" ADD COLUMN "unit" text DEFAULT 'piece' NOT NULL;--> statement-breakpoint
ALTER TABLE "pantry_items" ADD COLUMN "quantity" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "pantry_items" ADD COLUMN "unit" text DEFAULT 'piece' NOT NULL;--> statement-breakpoint
ALTER TABLE "grocery_list_items" ALTER COLUMN "quantity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "grocery_list_items" ALTER COLUMN "unit" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "pantry_items" ALTER COLUMN "quantity" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "pantry_items" ALTER COLUMN "unit" DROP DEFAULT;
