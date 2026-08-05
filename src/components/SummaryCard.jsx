// Compact KPI card used across the dashboard. `tone` drives the accent color.
export default function SummaryCard({ label, value, icon, hint, tone = 'default' }) {
  return (
    <div className={`summary-card summary-card--${tone}`}>
      <div className="summary-card__top">
        <span className="summary-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="summary-card__label">{label}</span>
      </div>
      <div className="summary-card__value">{value}</div>
      {hint && <div className="summary-card__hint">{hint}</div>}
    </div>
  )
}
