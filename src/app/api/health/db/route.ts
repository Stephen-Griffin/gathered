import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/db/health";

export async function GET() {
  await checkDatabaseConnection();

  return NextResponse.json({ ok: true });
}
