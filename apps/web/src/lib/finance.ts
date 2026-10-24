export type MoneyDirection = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  category: string;
  direction: MoneyDirection;
  amountCents: number;
  occurredOn: string;
}

export interface CategorySpend {
  category: string;
  amountCents: number;
}

export interface DashboardData {
  source: "demo" | "postgres";
  incomeCents: number;
  expenseCents: number;
  budgetCents: number;
  recentTransactions: Transaction[];
  spendingByCategory: CategorySpend[];
}

export interface DashboardSummary extends DashboardData {
  balanceCents: number;
  savingsRate: number;
  budgetUsedPercent: number;
}

export function summarizeDashboard(data: DashboardData): DashboardSummary {
  const balanceCents = data.incomeCents - data.expenseCents;
  const savingsRate = data.incomeCents === 0 ? 0 : Math.round((balanceCents / data.incomeCents) * 1000) / 10;
  const budgetUsedPercent = data.budgetCents === 0 ? 0 : Math.round((data.expenseCents / data.budgetCents) * 1000) / 10;
  return { ...data, balanceCents, savingsRate, budgetUsedPercent };
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export const demoDashboard: DashboardData = {
  source: "demo",
  incomeCents: 458000,
  expenseCents: 286450,
  budgetCents: 350000,
  spendingByCategory: [
    { category: "Housing", amountCents: 125000 },
    { category: "Food", amountCents: 62100 },
    { category: "Transport", amountCents: 41750 },
    { category: "Subscriptions", amountCents: 28600 },
    { category: "Other", amountCents: 29000 },
  ],
  recentTransactions: [
    { id: "demo-1", description: "Salary", category: "Income", direction: "income", amountCents: 458000, occurredOn: "2026-10-01" },
    { id: "demo-2", description: "Rent", category: "Housing", direction: "expense", amountCents: 125000, occurredOn: "2026-10-02" },
    { id: "demo-3", description: "Weekly groceries", category: "Food", direction: "expense", amountCents: 8230, occurredOn: "2026-10-18" },
    { id: "demo-4", description: "Rail travel", category: "Transport", direction: "expense", amountCents: 4560, occurredOn: "2026-10-20" },
  ],
};
