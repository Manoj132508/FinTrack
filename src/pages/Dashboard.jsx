import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SummaryCard from '../components/SummaryCard'
import CategoryDoughnut from '../components/charts/CategoryDoughnut'
import MonthlyTrend from '../components/charts/MonthlyTrend'
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar'
import {
  selectCurrentMonthTotals,
  selectSpendingByCategory,
  selectMonthlyTrend,
  selectAverageMonthlySpend,
  selectBudgetProgress,
  selectRecentTransactions,
  selectTheme,
} from '../features/selectors'
import { getCategory } from '../data/categories'
import { formatCurrency, formatPercent, formatDate } from '../utils/format'

export default function Dashboard() {
  const totals = useSelector(selectCurrentMonthTotals)
  const byCategory = useSelector(selectSpendingByCategory)
  const trend = useSelector(selectMonthlyTrend)
  const avgSpend = useSelector(selectAverageMonthlySpend)
  const budgets = useSelector(selectBudgetProgress)
  const recent = useSelector(selectRecentTransactions)
  const theme = useSelector(selectTheme)

  const spendDelta = totals.expense - avgSpend
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' })

  return (
    <div className="page">
      <section className="grid grid--cards">
        <SummaryCard
          label={`Income · ${monthName}`}
          value={formatCurrency(totals.income)}
          icon="💰"
          tone="income"
          hint="Money in this month"
        />
        <SummaryCard
          label={`Spending · ${monthName}`}
          value={formatCurrency(totals.expense)}
          icon="💳"
          tone="expense"
          hint={
            avgSpend > 0
              ? `${spendDelta >= 0 ? '▲' : '▼'} ${formatCurrency(Math.abs(spendDelta))} vs 6-mo avg`
              : 'Money out this month'
          }
        />
        <SummaryCard
          label="Net Balance"
          value={formatCurrency(totals.balance)}
          icon="⚖️"
          tone={totals.balance >= 0 ? 'positive' : 'negative'}
          hint={totals.balance >= 0 ? 'Surplus this month' : 'Overspending this month'}
        />
        <SummaryCard
          label="Savings Rate"
          value={formatPercent(totals.savingsRate, 1)}
          icon="🏦"
          tone="accent"
          hint="Share of income kept"
        />
      </section>

      <section className="grid grid--charts">
        <div className="card card--chart">
          <div className="card__head">
            <div>
              <h3 className="card__title">Cash Flow</h3>
              <p className="card__sub">Income vs expenses, last 6 months</p>
            </div>
          </div>
          <div className="chart-box chart-box--tall">
            <MonthlyTrend data={trend} theme={theme} />
          </div>
        </div>

        <div className="card card--chart">
          <div className="card__head">
            <div>
              <h3 className="card__title">Spending by Category</h3>
              <p className="card__sub">{monthName} breakdown</p>
            </div>
          </div>
          {byCategory.length > 0 ? (
            <div className="doughnut-layout">
              <div className="chart-box chart-box--doughnut">
                <CategoryDoughnut data={byCategory} theme={theme} />
              </div>
              <ul className="legend">
                {byCategory.slice(0, 6).map((c) => (
                  <li key={c.id} className="legend__item">
                    <span className="legend__dot" style={{ background: c.color }} />
                    <span className="legend__label">
                      {c.icon} {c.label}
                    </span>
                    <span className="legend__value">{formatPercent(c.share, 0)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="empty-note">No spending recorded this month yet.</p>
          )}
        </div>
      </section>

      <section className="grid grid--split">
        <div className="card card--chart">
          <div className="card__head">
            <div>
              <h3 className="card__title">Monthly Net</h3>
              <p className="card__sub">Surplus or deficit per month</p>
            </div>
          </div>
          <div className="chart-box">
            <IncomeExpenseBar data={trend} theme={theme} />
          </div>
        </div>

        <div className="card">
          <div className="card__head">
            <div>
              <h3 className="card__title">Budget Watch</h3>
              <p className="card__sub">{monthName} usage</p>
            </div>
            <Link to="/budgets" className="link">
              Manage
            </Link>
          </div>
          <ul className="progress-list">
            {budgets.slice(0, 5).map((b) => (
              <li key={b.id} className="progress-row">
                <div className="progress-row__head">
                  <span>
                    {b.icon} {b.label}
                  </span>
                  <span className={b.over ? 'text-danger' : 'text-muted'}>
                    {formatCurrency(b.used)} / {formatCurrency(b.limit)}
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
            {budgets.length === 0 && (
              <p className="empty-note">No budgets set. Add some on the Budgets page.</p>
            )}
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="card__head">
          <div>
            <h3 className="card__title">Recent Transactions</h3>
            <p className="card__sub">Latest activity</p>
          </div>
          <Link to="/transactions" className="link">
            View all
          </Link>
        </div>
        <ul className="txn-list">
          {recent.map((t) => {
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
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
