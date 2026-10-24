import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const userId = process.env.FINTRACK_DEMO_USER_ID ?? "00000000-0000-4000-8000-000000000001";
const accountId = "00000000-0000-4000-8000-000000000010";
const pool = new pg.Pool({ connectionString, max: 1 });
const month = new Date().toISOString().slice(0, 7);

try {
  await pool.query("BEGIN");
  await pool.query("INSERT INTO users (id, email, display_name) VALUES ($1, 'demo@fintrack.local', 'Portfolio Demo') ON CONFLICT (id) DO NOTHING", [userId]);
  await pool.query("INSERT INTO accounts (id, user_id, name, account_type) VALUES ($1, $2, 'Current account', 'current') ON CONFLICT (id) DO NOTHING", [accountId, userId]);
  await pool.query(
    `INSERT INTO transactions (id, user_id, account_id, direction, amount_cents, category, description, occurred_on)
     VALUES
       ('00000000-0000-4000-8000-000000000101', $1, $2, 'income', 458000, 'Income', 'Salary', $3::date),
       ('00000000-0000-4000-8000-000000000102', $1, $2, 'expense', 125000, 'Housing', 'Rent', ($3::date + 1)),
       ('00000000-0000-4000-8000-000000000103', $1, $2, 'expense', 62100, 'Food', 'Groceries and meals', ($3::date + 8)),
       ('00000000-0000-4000-8000-000000000104', $1, $2, 'expense', 41750, 'Transport', 'Rail and local travel', ($3::date + 12)),
       ('00000000-0000-4000-8000-000000000105', $1, $2, 'expense', 28600, 'Subscriptions', 'Monthly services', ($3::date + 15)),
       ('00000000-0000-4000-8000-000000000106', $1, $2, 'expense', 29000, 'Other', 'Household purchases', ($3::date + 18))
     ON CONFLICT (id) DO NOTHING`,
    [userId, accountId, `${month}-01`],
  );
  const budgets = [
    ["00000000-0000-4000-8000-000000000201", "Housing", 130000],
    ["00000000-0000-4000-8000-000000000202", "Food", 80000],
    ["00000000-0000-4000-8000-000000000203", "Transport", 55000],
    ["00000000-0000-4000-8000-000000000204", "Subscriptions", 35000],
    ["00000000-0000-4000-8000-000000000205", "Other", 50000],
  ] as const;
  for (const [id, category, limit] of budgets) {
    await pool.query("INSERT INTO budgets (id, user_id, category, month, limit_cents) VALUES ($1, $2, $3, $4::date, $5) ON CONFLICT (id) DO NOTHING", [id, userId, category, `${month}-01`, limit]);
  }
  await pool.query("COMMIT");
  console.log("Seeded the labelled FinTrack portfolio demo account");
} catch (error) {
  await pool.query("ROLLBACK");
  throw error;
} finally {
  await pool.end();
}
