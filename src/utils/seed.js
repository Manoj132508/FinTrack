// Generates a realistic set of demo transactions spanning the last 6 months so
// the dashboard is populated on first run. Deterministic-ish, but randomized
// amounts keep the charts looking natural.

import { toLocalISO } from './date'

let counter = 0
function id() {
  counter += 1
  return `seed-${Date.now().toString(36)}-${counter}`
}

function rand(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Highest day-of-month we may use for a given month. For the current month
// (monthsAgo === 0) we never schedule beyond today, so no demo transaction is
// dated in the future.
function maxDayFor(monthsAgo) {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0).getDate()
  return monthsAgo === 0 ? now.getDate() : daysInMonth
}

// Build a local-date ISO string, clamped to a sensible day for that month.
function dateInMonthsAgo(monthsAgo, day) {
  const now = new Date()
  const clampedDay = Math.max(1, Math.min(day, maxDayFor(monthsAgo)))
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, clampedDay)
  return toLocalISO(d)
}

// Fixed recurring bills — added exactly once per month so they don't skew the
// category mix.
const FIXED_BILLS = [
  { category: 'housing', note: 'Monthly rent', min: 1200, max: 1200, day: 3 },
  { category: 'utilities', note: 'Internet', min: 45, max: 60, day: 5 },
  { category: 'utilities', note: 'Electricity & water', min: 80, max: 160, day: 7 },
  { category: 'health', note: 'Gym membership', min: 30, max: 45, day: 10 },
  { category: 'entertainment', note: 'Streaming subscription', min: 10, max: 20, day: 12 },
]

// Variable, day-to-day spending — drawn at random to fill out each month.
const VARIABLE_TEMPLATES = [
  { category: 'food', note: 'Groceries', min: 40, max: 120 },
  { category: 'food', note: 'Restaurant', min: 18, max: 75 },
  { category: 'food', note: 'Coffee', min: 4, max: 9 },
  { category: 'transport', note: 'Fuel', min: 35, max: 70 },
  { category: 'transport', note: 'Ride share', min: 10, max: 32 },
  { category: 'shopping', note: 'Clothing', min: 25, max: 180 },
  { category: 'shopping', note: 'Household items', min: 15, max: 90 },
  { category: 'entertainment', note: 'Movie night', min: 15, max: 45 },
  { category: 'health', note: 'Pharmacy', min: 12, max: 60 },
  { category: 'education', note: 'Online course', min: 20, max: 120 },
  { category: 'travel', note: 'Weekend trip', min: 120, max: 480 },
]

export function generateSeedTransactions() {
  const txns = []

  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo -= 1) {
    // Steady salary each month.
    txns.push({
      id: id(),
      type: 'income',
      category: 'salary',
      amount: 4200,
      note: 'Monthly salary',
      date: dateInMonthsAgo(monthsAgo, 1),
    })

    // Occasional freelance income.
    if (Math.random() > 0.5) {
      txns.push({
        id: id(),
        type: 'income',
        category: 'freelance',
        amount: rand(300, 900),
        note: 'Freelance project',
        date: dateInMonthsAgo(monthsAgo, pick([8, 12, 20])),
      })
    }

    const lastDay = maxDayFor(monthsAgo)

    // Fixed monthly bills — once each, only if their billing day has passed.
    FIXED_BILLS.forEach((tpl) => {
      if (tpl.day > lastDay) return
      txns.push({
        id: id(),
        type: 'expense',
        category: tpl.category,
        amount: rand(tpl.min, tpl.max),
        note: tpl.note,
        date: dateInMonthsAgo(monthsAgo, tpl.day),
      })
    })

    // A spread of variable spending across the days available in the month.
    // The current month is partial, so scale the item count to elapsed days.
    const fullMonthItems = 10 + Math.floor(Math.random() * 7)
    const itemCount =
      monthsAgo === 0
        ? Math.max(3, Math.round(fullMonthItems * (lastDay / 30)))
        : fullMonthItems
    for (let i = 0; i < itemCount; i += 1) {
      const tpl = pick(VARIABLE_TEMPLATES)
      const day = 2 + Math.floor(Math.random() * Math.max(1, lastDay - 1))
      txns.push({
        id: id(),
        type: 'expense',
        category: tpl.category,
        amount: rand(tpl.min, tpl.max),
        note: tpl.note,
        date: dateInMonthsAgo(monthsAgo, day),
      })
    }
  }

  return txns.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function defaultBudgets() {
  return {
    housing: 1300,
    food: 650,
    transport: 250,
    shopping: 300,
    entertainment: 150,
    utilities: 250,
    health: 150,
  }
}
