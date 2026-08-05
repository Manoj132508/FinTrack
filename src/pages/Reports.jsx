import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectTransactions, selectTheme } from '../features/selectors'
import {
  clearAllTransactions,
  loadSampleData,
} from '../features/transactions/transactionsSlice'
import { computeTotals, spendingByCategory } from '../utils/analytics'
import { isWithin } from '../utils/date'
import CategoryDoughnut from '../components/charts/CategoryDoughnut'
import { formatCurrency, formatPercent } from '../utils/format'

// Default the range to the last 90 days.
function defaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 90)
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

export default function Reports() {
  const dispatch = useDispatch()
  const transactions = useSelector(selectTransactions)
  const theme = useSelector(selectTheme)
  const [range, setRange] = useState(defaultRange)

  const filtered = useMemo(
    () => transactions.filter((t) => isWithin(t.date, range.start, range.end)),
    [transactions, range]
  )

  const totals = useMemo(() => computeTotals(filtered), [filtered])
  const byCategory = useMemo(() => spendingByCategory(filtered), [filtered])

  function exportCsv() {
    const header = ['Date', 'Type', 'Category', 'Note', 'Amount']
    const rows = filtered.map((t) => [
      t.date,
      t.type,
      t.category,
      `"${(t.note || '').replace(/"/g, '""')}"`,
      t.amount,
    ])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${range.start}_to_${range.end}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page">
      <section className="card">
        <div className="toolbar toolbar--wrap">
          <div className="range">
            <label className="field field--inline">
              <span className="field__label">From</span>
              <input
                type="date"
                value={range.start}
                max={range.end}
                onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
              />
            </label>
            <label className="field field--inline">
              <span className="field__label">To</span>
              <input
                type="date"
                value={range.end}
                min={range.start}
                onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
              />
            </label>
          </div>
          <button type="button" className="btn btn--ghost" onClick={exportCsv}>
            ⬇ Export CSV
          </button>
        </div>

        <div className="report-stats">
          <div className="report-stat">
            <span className="report-stat__label">Income</span>
            <span className="report-stat__value text-income">
              {formatCurrency(totals.income)}
            </span>
          </div>
          <div className="report-stat">
            <span className="report-stat__label">Expenses</span>
            <span className="report-stat__value text-expense">
              {formatCurrency(totals.expense)}
            </span>
          </div>
          <div className="report-stat">
            <span className="report-stat__label">Net</span>
            <span
              className={`report-stat__value ${totals.balance >= 0 ? 'text-income' : 'text-expense'}`}
            >
              {formatCurrency(totals.balance)}
            </span>
          </div>
          <div className="report-stat">
            <span className="report-stat__label">Savings Rate</span>
            <span className="report-stat__value">
              {formatPercent(totals.savingsRate, 1)}
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid--split">
        <div className="card card--chart">
          <div className="card__head">
            <div>
              <h3 className="card__title">Spending Distribution</h3>
              <p className="card__sub">Selected date range</p>
            </div>
          </div>
          {byCategory.length > 0 ? (
            <div className="chart-box chart-box--doughnut center">
              <CategoryDoughnut data={byCategory} theme={theme} />
            </div>
          ) : (
            <p className="empty-note">No expenses in this range.</p>
          )}
        </div>

        <div className="card">
          <div className="card__head">
            <div>
              <h3 className="card__title">Category Breakdown</h3>
              <p className="card__sub">Ranked by spend</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="num">Amount</th>
                  <th className="num">Share</th>
                </tr>
              </thead>
              <tbody>
                {byCategory.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="dot" style={{ background: c.color }} /> {c.icon}{' '}
                      {c.label}
                    </td>
                    <td className="num">{formatCurrency(c.value)}</td>
                    <td className="num">{formatPercent(c.share, 1)}</td>
                  </tr>
                ))}
                {byCategory.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-note">
                      No data for this range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="card card--danger-zone">
        <div className="card__head">
          <div>
            <h3 className="card__title">Data</h3>
            <p className="card__sub">Manage your local data (stored in this browser)</p>
          </div>
        </div>
        <div className="data-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => dispatch(loadSampleData())}
          >
            Reload sample data
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => {
              if (window.confirm('Delete all transactions? This cannot be undone.')) {
                dispatch(clearAllTransactions())
              }
            }}
          >
            Clear all transactions
          </button>
        </div>
      </section>
    </div>
  )
}
