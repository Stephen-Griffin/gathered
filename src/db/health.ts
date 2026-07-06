import "server-only";

import { sql } from "drizzle-orm";
import { getDb } from "./client";

export async function checkDatabaseConnection() {
  const db = getDb();

  await db.execute(sql`select 1`);
}
