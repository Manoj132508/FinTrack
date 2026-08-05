// Date helpers used for grouping and filtering transactions.
//
// Important: we format dates from *local* calendar components rather than
// toISOString(), which converts to UTC and can shift a date to the previous
// day (and thus the previous month) in UTC+ timezones.

export function toLocalISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toLocalISO(new Date())
}

// "2026-08" style key for the current month, from local components.
export function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// "2026-08" style key for month bucketing.
export function monthKey(iso) {
  return String(iso).slice(0, 7)
}

export function monthLabel(key) {
  const [y, m] = String(key).split('-').map(Number)
  const d = new Date(y, (m || 1) - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

// Return the last `count` month keys ending with the current month, ascending.
export function recentMonthKeys(count = 6) {
  const keys = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return keys
}

// Inclusive [start, end] range check on ISO date strings (YYYY-MM-DD).
export function isWithin(iso, start, end) {
  if (start && iso < start) return false
  if (end && iso > end) return false
  return true
}
