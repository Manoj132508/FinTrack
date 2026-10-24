import { describe, expect, test } from "vitest";
import { formatMoney, summarizeDashboard, type DashboardData } from "./finance";

const base: DashboardData = {
  source: "demo",
  incomeCents: 500_00,
  expenseCents: 175_00,
  budgetCents: 250_00,
  recentTransactions: [],
  spendingByCategory: [],
};

describe("finance summary", () => {
  test("derives balance, savings rate and budget use from integer cents", () => {
    expect(summarizeDashboard(base)).toMatchObject({
      balanceCents: 325_00,
      savingsRate: 65,
      budgetUsedPercent: 70,
    });
  });

  test("avoids division errors when income and budget are zero", () => {
    expect(summarizeDashboard({ ...base, incomeCents: 0, budgetCents: 0 })).toMatchObject({
      savingsRate: 0,
      budgetUsedPercent: 0,
    });
  });

  test("formats cents as GBP without floating-point storage", () => {
    expect(formatMoney(123_45)).toBe("£123.45");
  });
});
