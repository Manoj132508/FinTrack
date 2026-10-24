import { randomUUID } from "node:crypto";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { loadDashboard } from "./repository";

const enabled = Boolean(process.env.DATABASE_URL);
const suite = enabled ? describe : describe.skip;
const pool = enabled ? new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 }) : undefined;

beforeAll(async () => {
  if (pool) await pool.query("SELECT 1");
});

afterAll(async () => {
  await pool?.end();
});

suite("PostgreSQL finance repository", () => {
  test("isolates totals, budgets, category spend and recent activity by user", async () => {
    const client = await pool!.connect();
    const userId = randomUUID();
    const accountId = randomUUID();
    try {
      await client.query("BEGIN");
      await client.query("INSERT INTO users (id, email, display_name) VALUES ($1, $2, $3)", [userId, `${userId}@example.test`, "Test User"]);
      await client.query("INSERT INTO accounts (id, user_id, name, account_type) VALUES ($1, $2, 'Current', 'current')", [accountId, userId]);
      await client.query(
        `INSERT INTO transactions (id, user_id, account_id, direction, amount_cents, category, description, occurred_on)
         VALUES ($1, $2, $3, 'income', 300000, 'Income', 'Salary', CURRENT_DATE),
                ($4, $2, $3, 'expense', 75000, 'Housing', 'Rent', CURRENT_DATE)`,
        [randomUUID(), userId, accountId, randomUUID()],
      );
      await client.query(
        "INSERT INTO budgets (id, user_id, category, month, limit_cents) VALUES ($1, $2, 'Housing', date_trunc('month', CURRENT_DATE)::date, 100000)",
        [randomUUID(), userId],
      );

      const dashboard = await loadDashboard(client, userId);
      expect(dashboard).toMatchObject({ source: "postgres", incomeCents: 300000, expenseCents: 75000, budgetCents: 100000 });
      expect(dashboard.spendingByCategory).toEqual([{ category: "Housing", amountCents: 75000 }]);
      expect(dashboard.recentTransactions).toHaveLength(2);
    } finally {
      await client.query("ROLLBACK");
      client.release();
    }
  });
});
