import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import { selectTransactions } from '../features/selectors'
import {
  deleteTransaction,
  updateTransaction,
} from '../features/transactions/transactionsSlice'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategory,
} from '../data/categories'
import { formatCurrency, formatDate } from '../utils/format'

const ALL_CATS = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export default function Transactions() {
  const dispatch = useDispatch()
  const transactions = useSelector(selectTransactions)

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      if (q) {
        const cat = getCategory(t.category)
        const haystack = `${t.note} ${cat.label}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [transactions, search, typeFilter, categoryFilter])

  const filteredTotal = useMemo(
    () =>
      filtered.reduce(
        (acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount),
        0
      ),
    [filtered]
  )

  function handleEditSubmit(values) {
    const { id, ...changes } = values
    dispatch(updateTransaction({ id: editing.id, changes }))
    setEditing(null)
  }

  return (
    <div className="page">
      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="toolbar__search"
            placeholder="Search notes or categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="toolbar__filters">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
              {ALL_CATS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="txn-summary">
          <span>
            {filtered.length} {filtered.length === 1 ? 'transaction' : 'transactions'}
          </span>
          <span className={filteredTotal >= 0 ? 'text-income' : 'text-expense'}>
            Net {formatCurrency(filteredTotal)}
          </span>
        </div>

        <ul className="txn-list txn-list--full">
          {filtered.map((t) => {
            const cat = getCategory(t.category)
            return (
              <li key={t.id} className="txn">
                <span className="txn__icon" style={{ background: `${cat.color}22` }}>
                  {cat.icon}
                </span>
                <div className="txn__main">
                  <span className="txn__title">{t.note || cat.label}</span>
                  <span className="txn__meta">
                    {cat.label} · {formatDate(t.date)}
                  </span>
                </div>
                <span
                  className={`txn__amount ${t.type === 'income' ? 'text-income' : 'text-expense'}`}
                >
                  {t.type === 'income' ? '+' : '−'}
                  {formatCurrency(t.amount)}
                </span>
                <div className="txn__actions">
                  <button
                    type="button"
                    className="icon-btn icon-btn--sm"
                    onClick={() => setEditing(t)}
                    aria-label="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--sm"
                    onClick={() => dispatch(deleteTransaction(t.id))}
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <p className="empty-note">No transactions match your filters.</p>
          )}
        </ul>
      </div>

      <Modal open={Boolean(editing)} title="Edit transaction" onClose={() => setEditing(null)}>
        {editing && (
          <TransactionForm
            initial={editing}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  )
}
