import { createSelector } from '@reduxjs/toolkit'
import { monthKey, currentMonthKey } from '../utils/date'
import {
  computeTotals,
  spendingByCategory,
  monthlyTrend,
  budgetProgress,
  averageMonthlySpend,
} from '../utils/analytics'

// Base selectors ------------------------------------------------------------
export const selectTransactions = (state) => state.transactions.items
export const selectBudgets = (state) => state.budgets.monthly
export const selectTheme = (state) => state.ui.theme

// Memoized derived selectors ------------------------------------------------
export const selectAllTotals = createSelector(selectTransactions, (txns) =>
  computeTotals(txns)
)

export const selectCurrentMonthTransactions = createSelector(
  selectTransactions,
  (txns) => txns.filter((t) => monthKey(t.date) === currentMonthKey())
)

export const selectCurrentMonthTotals = createSelector(
  selectCurrentMonthTransactions,
  (txns) => computeTotals(txns)
)

export const selectSpendingByCategory = createSelector(
  selectCurrentMonthTransactions,
  (txns) => spendingByCategory(txns)
)

export const selectAllTimeSpendingByCategory = createSelector(
  selectTransactions,
  (txns) => spendingByCategory(txns)
)

export const selectMonthlyTrend = createSelector(selectTransactions, (txns) =>
  monthlyTrend(txns, 6)
)

export const selectAverageMonthlySpend = createSelector(
  selectTransactions,
  (txns) => averageMonthlySpend(txns, 6)
)

export const selectBudgetProgress = createSelector(
  [selectTransactions, selectBudgets],
  (txns, budgets) => budgetProgress(txns, budgets, currentMonthKey())
)

export const selectRecentTransactions = createSelector(
  selectTransactions,
  (txns) => [...txns].slice(0, 8)
)
