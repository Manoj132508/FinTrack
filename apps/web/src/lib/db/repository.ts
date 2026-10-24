import "server-only";
import type { QueryResult, QueryResultRow } from "pg";
import { databaseConfigured, getPool } from "./pool";
import { demoDashboard, type DashboardData, type MoneyDirection } from "../finance";

export interface Queryable {
  query<R extends QueryResultRow = QueryResultRow>(text: string, values?: readonly unknown[]): Promise<QueryResult<R>>;
}

interface TotalsRow extends QueryResultRow { income_cents: string; expense_cents: string }
interface BudgetRow extends QueryResultRow { budget_cents: string }
interface CategoryRow extends QueryResultRow { category: string; amount_cents: string }
interface TransactionRow extends QueryResultRow {
  id: string;
  description: string;
  category: string;
  direction: MoneyDirection;
  amount_cents: string;
  occurred_on: Date | string;
}

export async function loadDashboard(queryable: Queryable, userId: string): Promise<DashboardData> {
  const [totals, budgets, categories, recent] = await Promise.all([
    queryable.query<TotalsRow>(
      `SELECT
         COALESCE(SUM(amount_cents) FILTER (WHERE direction = 'income'), 0)::bigint AS income_cents,
         COALESCE(SUM(amount_cents) FILTER (WHERE direction = 'expense'), 0)::bigint AS expense_cents
       FROM transactions
       WHERE user_id = $1 AND occurred_on >= date_trunc('month', CURRENT_DATE)`,
      [userId],
    ),
    queryable.query<BudgetRow>(
      `SELECT COALESCE(SUM(limit_cents), 0)::bigint AS budget_cents
       FROM budgets
       WHERE user_id = $1 AND month = date_trunc('month', CURRENT_DATE)::date`,
      [userId],
    ),
    queryable.query<CategoryRow>(
      `SELECT category, SUM(amount_cents)::bigint AS amount_cents
       FROM transactions
       WHERE user_id = $1 AND direction = 'expense'
         AND occurred_on >= date_trunc('month', CURRENT_DATE)
       GROUP BY category
       ORDER BY SUM(amount_cents) DESC, category ASC
       LIMIT 6`,
      [userId],
    ),
    queryable.query<TransactionRow>(
      `SELECT id::text, description, category, direction, amount_cents::bigint, occurred_on
       FROM transactions
       WHERE user_id = $1
       ORDER BY occurred_on DESC, created_at DESC
       LIMIT 8`,
      [userId],
    ),
  ]);

  const total = totals.rows[0] ?? { income_cents: "0", expense_cents: "0" };
  return {
    source: "postgres",
    incomeCents: Number(total.income_cents),
    expenseCents: Number(total.expense_cents),
    budgetCents: Number(budgets.rows[0]?.budget_cents ?? 0),
    spendingByCategory: categories.rows.map((row) => ({ category: row.category, amountCents: Number(row.amount_cents) })),
    recentTransactions: recent.rows.map((row) => ({
      id: row.id,
      description: row.description,
      category: row.category,
      direction: row.direction,
      amountCents: Number(row.amount_cents),
      occurredOn: typeof row.occurred_on === "string" ? row.occurred_on.slice(0, 10) : row.occurred_on.toISOString().slice(0, 10),
    })),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!databaseConfigured()) return demoDashboard;
  const userId = process.env.FINTRACK_DEMO_USER_ID;
  if (!userId) throw new Error("FINTRACK_DEMO_USER_ID is required when DATABASE_URL is configured");
  return loadDashboard(getPool(), userId);
}
