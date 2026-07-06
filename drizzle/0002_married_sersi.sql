ALTER TABLE "recipes" ALTER COLUMN "servings" SET DATA TYPE integer USING CASE
	WHEN "servings" ~ '^\d+$' THEN "servings"::integer
	WHEN lower("servings") LIKE 'three to four%' THEN 4
	WHEN lower("servings") LIKE 'two to three%' THEN 3
	WHEN lower("servings") LIKE 'two%' THEN 2
	WHEN lower("servings") LIKE 'three%' THEN 3
	WHEN lower("servings") LIKE 'four%' THEN 4
	WHEN lower("servings") LIKE 'six%' THEN 6
	ELSE 1
END;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "author" text DEFAULT 'Unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "ingredients" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "directions" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "prep_time_minutes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "cook_time_minutes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "total_time_minutes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "author" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "ingredients" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "directions" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "prep_time_minutes" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "cook_time_minutes" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "total_time_minutes" DROP DEFAULT;
