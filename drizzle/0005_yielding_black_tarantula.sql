DROP INDEX "grocery_list_items_user_normalized_name_unique";--> statement-breakpoint
DROP INDEX "pantry_items_user_normalized_name_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "grocery_list_items_user_normalized_name_unit_unique" ON "grocery_list_items" USING btree ("user_id","normalized_name","unit");--> statement-breakpoint
CREATE UNIQUE INDEX "pantry_items_user_normalized_name_unit_unique" ON "pantry_items" USING btree ("user_id","normalized_name","unit");