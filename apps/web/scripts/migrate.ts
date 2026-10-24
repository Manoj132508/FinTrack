import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const pool = new pg.Pool({ connectionString, max: 1 });
const directory = join(process.cwd(), "db", "migrations");

try {
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort();
  const applied = await pool.query<{ version: string }>("SELECT version FROM schema_migrations");
  const completed = new Set(applied.rows.map((row) => row.version));

  for (const file of files) {
    if (completed.has(file)) continue;
    const sql = await readFile(join(directory, file), "utf8");
    const client = await pool.connect();
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING", [file]);
      console.log(`Applied ${file}`);
    } finally {
      client.release();
    }
  }
} finally {
  await pool.end();
}
