// Central catalog of expense/income categories. Each has a stable id, label,
// an emoji glyph used across the UI, and a color used consistently in charts.

export const EXPENSE_CATEGORIES = [
  { id: 'housing', label: 'Housing', icon: '🏠', color: '#6366f1' },
  { id: 'food', label: 'Food & Dining', icon: '🍽️', color: '#f59e0b' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#10b981' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: 'utilities', label: 'Utilities', icon: '💡', color: '#06b6d4' },
  { id: 'health', label: 'Health', icon: '🩺', color: '#ef4444' },
  { id: 'education', label: 'Education', icon: '📚', color: '#3b82f6' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: '#14b8a6' },
  { id: 'other', label: 'Other', icon: '📦', color: '#94a3b8' },
]

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', icon: '💼', color: '#22c55e' },
  { id: 'freelance', label: 'Freelance', icon: '🧑‍💻', color: '#84cc16' },
  { id: 'investment', label: 'Investments', icon: '📈', color: '#0ea5e9' },
  { id: 'gift', label: 'Gifts', icon: '🎁', color: '#a855f7' },
  { id: 'other-income', label: 'Other', icon: '➕', color: '#64748b' },
]

const ALL = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
const BY_ID = ALL.reduce((acc, c) => {
  acc[c.id] = c
  return acc
}, {})

export function getCategory(id) {
  return BY_ID[id] || { id, label: id, icon: '❔', color: '#94a3b8' }
}

export function categoriesFor(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}
