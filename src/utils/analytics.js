// Pure aggregation helpers. Everything here takes a plain array of transactions
// and returns derived numbers — no Redux, no React — so it is trivial to reason
// about and reuse across the dashboard and reports.

import { monthKey, monthLabel, recentMonthKeys } from './date'
import { getCategory } from '../data/categories'

export function sumBy(transactions, type) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0)
}

export function computeTotals(transactions) {
  const income = sumBy(transactions, 'income')
  const expense = sumBy(transactions, 'expense')
  const balance = income - expense
  const savingsRate = income > 0 ? (balance / income) * 100 : 0
  return { income, expense, balance, savingsRate }
}

// [{ id, label, color, icon, value, share }] sorted by value desc.
export function spendingByCategory(transactions) {
  const totals = new Map()
  let grand = 0
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const val = Number(t.amount) || 0
      totals.set(t.category, (totals.get(t.category) || 0) + val)
      grand += val
    })

  return Array.from(totals.entries())
    .map(([id, value]) => {
      const cat = getCategory(id)
      return {
        id,
        label: cat.label,
        color: cat.color,
        icon: cat.icon,
        value,
        share: grand > 0 ? (value / grand) * 100 : 0,
      }
    })
    .sort((a, b) => b.value - a.value)
}

// One row per recent month: { key, label, income, expense, net }.
export function monthlyTrend(transactions, months = 6) {
  const keys = recentMonthKeys(months)
  const buckets = new Map(keys.map((k) => [k, { income: 0, expense: 0 }]))

  transactions.forEach((t) => {
    const k = monthKey(t.date)
    if (!buckets.has(k)) return
    const bucket = buckets.get(k)
    bucket[t.type] += Number(t.amount) || 0
  })

  return keys.map((k) => {
    const b = buckets.get(k)
    return {
      key: k,
      label: monthLabel(k),
      income: b.income,
      expense: b.expense,
      net: b.income - b.expense,
    }
  })
}

// Budget vs actual spend for a given month, one row per budgeted category.
export function budgetProgress(transactions, budgets, forMonthKey) {
  const spent = new Map()
  transactions
    .filter((t) => t.type === 'expense' && monthKey(t.date) === forMonthKey)
    .forEach((t) => {
      spent.set(t.category, (spent.get(t.category) || 0) + (Number(t.amount) || 0))
    })

  return Object.entries(budgets)
    .map(([id, limit]) => {
      const cat = getCategory(id)
      const used = spent.get(id) || 0
      const pct = limit > 0 ? (used / limit) * 100 : 0
      return {
        id,
        label: cat.label,
        color: cat.color,
        icon: cat.icon,
        limit,
        used,
        remaining: limit - used,
        pct,
        over: used > limit,
      }
    })
    .sort((a, b) => b.pct - a.pct)
}

export function averageMonthlySpend(transactions, months = 6) {
  const trend = monthlyTrend(transactions, months)
  const active = trend.filter((m) => m.expense > 0)
  if (active.length === 0) return 0
  return active.reduce((acc, m) => acc + m.expense, 0) / active.length
}
