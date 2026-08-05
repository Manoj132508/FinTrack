// Formatting helpers shared across the app.

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const compactFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}

// Compact form for axis ticks / tight spaces, e.g. $1.2K.
export function formatCompact(value) {
  return compactFormatter.format(Number(value) || 0)
}

export function formatPercent(value, digits = 0) {
  const n = Number(value) || 0
  return `${n.toFixed(digits)}%`
}

export function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
