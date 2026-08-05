import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectBudgetProgress } from '../features/selectors'
import { setBudget, resetBudgets } from '../features/budgets/budgetsSlice'
import { EXPENSE_CATEGORIES } from '../data/categories'
import { formatCurrency, formatPercent } from '../utils/format'

export default function Budgets() {
  const dispatch = useDispatch()
  const progress = useSelector(selectBudgetProgress)

  const [category, setCategory] = useState('food')
  const [amount, setAmount] = useState('')

  const totalBudget = progress.reduce((a, b) => a + b.limit, 0)
  const totalUsed = progress.reduce((a, b) => a + b.used, 0)
  const overallPct = totalBudget > 0 ? (totalUsed / totalBudget) * 100 : 0

  function handleSet(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return
    dispatch(setBudget({ category, amount: value }))
    setAmount('')
  }

  return (
    <div className="page">
      <section className="grid grid--split">
        <div className="card">
          <div className="card__head">
            <div>
              <h3 className="card__title">Set a Monthly Budget</h3>
              <p className="card__sub">Cap spending per category</p>
            </div>
          </div>
          <form className="form" onSubmit={handleSet}>
            <label className="field">
              <span className="field__label">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Monthly limit</span>
              <div className="field__money">
                <span>$</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </label>
            <div className="form__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => dispatch(resetBudgets())}
              >
                Reset defaults
              </button>
              <button type="submit" className="btn btn--primary">
                Save budget
              </button>
            </div>
          </form>
        </div>

        <div className="card card--accentbar">
          <div className="card__head">
            <div>
              <h3 className="card__title">This Month</h3>
              <p className="card__sub">Overall budget usage</p>
            </div>
          </div>
          <div className="big-stat">
            <span className="big-stat__value">{formatCurrency(totalUsed)}</span>
            <span className="big-stat__sep">of</span>
            <span className="big-stat__limit">{formatCurrency(totalBudget)}</span>
          </div>
          <div className="progress progress--lg">
            <div
              className={`progress__bar ${overallPct > 100 ? 'progress__bar--over' : ''}`}
              style={{ width: `${Math.min(overallPct, 100)}%` }}
            />
          </div>
          <p className="big-stat__hint">
            {formatPercent(overallPct, 0)} of total budget used ·{' '}
            {formatCurrency(Math.max(totalBudget - totalUsed, 0))} remaining
          </p>
        </div>
      </section>

      <section className="card">
        <div className="card__head">
          <div>
            <h3 className="card__title">Category Budgets</h3>
            <p className="card__sub">Spent vs allocated this month</p>
          </div>
        </div>
        <ul className="progress-list">
          {progress.map((b) => (
            <li key={b.id} className="progress-row">
              <div className="progress-row__head">
                <span>
                  {b.icon} {b.label}
                </span>
                <span className={b.over ? 'text-danger' : 'text-muted'}>
                  {formatCurrency(b.used)} / {formatCurrency(b.limit)} ·{' '}
                  {formatPercent(b.pct, 0)}
                </span>
              </div>
              <div className="progress">
                <div
                  className={`progress__bar ${b.over ? 'progress__bar--over' : ''}`}
                  style={{
                    width: `${Math.min(b.pct, 100)}%`,
                    background: b.over ? undefined : b.color,
                  }}
                />
              </div>
            </li>
          ))}
          {progress.length === 0 && (
            <p className="empty-note">No budgets yet — add one above.</p>
          )}
        </ul>
      </section>
    </div>
  )
}
