import { getDashboardData } from "@/lib/db/repository";
import { formatMoney, summarizeDashboard } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const summary = summarizeDashboard(await getDashboardData());
  const maxCategory = Math.max(...summary.spendingByCategory.map((item) => item.amountCents), 1);

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="FinTrack dashboard home">
          <span className="brandMark">F</span>
          <span>FinTrack</span>
        </a>
        <div className="profile">
          <span className="statusDot" aria-hidden="true" />
          Portfolio preview
        </div>
      </header>

      <section className="hero" id="overview">
        <div>
          <p className="eyebrow">Financial overview</p>
          <h1>Know where your money is going.</h1>
          <p className="lede">A focused view of cash flow, spending pressure and recent activity.</p>
        </div>
        <span className="sourceBadge">{summary.source === "postgres" ? "Live PostgreSQL data" : "Clearly labelled demo data"}</span>
      </section>

      <section className="metrics" aria-label="Monthly financial summary">
        <article className="metricCard"><span>Income</span><strong>{formatMoney(summary.incomeCents)}</strong><small>This month</small></article>
        <article className="metricCard"><span>Spending</span><strong>{formatMoney(summary.expenseCents)}</strong><small>{summary.budgetUsedPercent}% of budget</small></article>
        <article className="metricCard accent"><span>Net balance</span><strong>{formatMoney(summary.balanceCents)}</strong><small>{summary.savingsRate}% savings rate</small></article>
        <article className="metricCard"><span>Budget</span><strong>{formatMoney(summary.budgetCents)}</strong><small>{formatMoney(Math.max(summary.budgetCents - summary.expenseCents, 0))} remaining</small></article>
      </section>

      <section className="dashboardGrid">
        <article className="panel">
          <div className="panelHeading"><div><p className="eyebrow">Analysis</p><h2>Spending by category</h2></div><span>Current month</span></div>
          <div className="categoryList">
            {summary.spendingByCategory.map((item) => (
              <div className="categoryRow" key={item.category}>
                <div className="categoryLabel"><span>{item.category}</span><strong>{formatMoney(item.amountCents)}</strong></div>
                <div className="barTrack"><span style={{ width: `${Math.max((item.amountCents / maxCategory) * 100, 4)}%` }} /></div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeading"><div><p className="eyebrow">Activity</p><h2>Recent transactions</h2></div><span>{summary.recentTransactions.length} shown</span></div>
          <div className="transactionList">
            {summary.recentTransactions.map((transaction) => (
              <div className="transaction" key={transaction.id}>
                <div><strong>{transaction.description}</strong><span>{transaction.category} · {new Date(`${transaction.occurredOn}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span></div>
                <strong className={transaction.direction}>{transaction.direction === "income" ? "+" : "−"}{formatMoney(transaction.amountCents)}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer>Next.js · TypeScript · PostgreSQL · Tested financial domain logic</footer>
    </main>
  );
}
