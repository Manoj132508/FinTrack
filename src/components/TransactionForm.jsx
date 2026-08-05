import { useState } from 'react'
import { categoriesFor } from '../data/categories'
import { todayISO } from '../utils/date'

const emptyForm = (type = 'expense') => ({
  type,
  amount: '',
  category: type === 'income' ? 'salary' : 'food',
  note: '',
  date: todayISO(),
})

// Controlled form for creating or editing a transaction. `initial` (when
// editing) pre-fills the fields; otherwise it starts blank.
export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    initial ? { ...emptyForm(initial.type), ...initial, amount: String(initial.amount) } : emptyForm()
  )
  const [error, setError] = useState('')

  const isEditing = Boolean(initial)
  const categories = categoriesFor(form.type)

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // When switching type, snap the category to a valid one for that type.
      if (field === 'type') {
        next.category = categoriesFor(value)[0].id
      }
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!amount || amount <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    if (!form.date) {
      setError('Please choose a date.')
      return
    }
    setError('')
    onSubmit({ ...form, amount })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="type-toggle">
        <button
          type="button"
          className={`type-toggle__btn ${form.type === 'expense' ? 'is-active is-expense' : ''}`}
          onClick={() => update('type', 'expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={`type-toggle__btn ${form.type === 'income' ? 'is-active is-income' : ''}`}
          onClick={() => update('type', 'income')}
        >
          Income
        </button>
      </div>

      <label className="field">
        <span className="field__label">Amount</span>
        <div className="field__money">
          <span>$</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => update('amount', e.target.value)}
            autoFocus
          />
        </div>
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field__label">Category</span>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Date</span>
          <input
            type="date"
            value={form.date}
            max={todayISO()}
            onChange={(e) => update('date', e.target.value)}
          />
        </label>
      </div>

      <label className="field">
        <span className="field__label">Note (optional)</span>
        <input
          type="text"
          placeholder="e.g. Grocery run"
          value={form.note}
          onChange={(e) => update('note', e.target.value)}
          maxLength={80}
        />
      </label>

      {error && <p className="form__error">{error}</p>}

      <div className="form__actions">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary">
          {isEditing ? 'Save changes' : 'Add transaction'}
        </button>
      </div>
    </form>
  )
}
