import { NextResponse } from "next/server";
import { checkDatabase, databaseConfigured } from "@/lib/db/pool";

export async function GET() {
  if (!databaseConfigured()) {
    return NextResponse.json({ status: "ok", database: "not-configured", mode: "demo" });
  }

  try {
    await checkDatabase();
    return NextResponse.json({ status: "ok", database: "connected", mode: "postgres" });
  } catch {
    return NextResponse.json({ status: "degraded", database: "unavailable" }, { status: 503 });
  }
}
