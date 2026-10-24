import "server-only";
import pg from "pg";

const globalPool = globalThis as typeof globalThis & { fintrackPool?: pg.Pool };

export function databaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): pg.Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  globalPool.fintrackPool ??= new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
  return globalPool.fintrackPool;
}

export async function checkDatabase(): Promise<void> {
  await getPool().query("SELECT 1");
}
