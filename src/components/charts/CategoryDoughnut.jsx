import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { tooltipOptions, cssVar } from './chartSetup'
import { formatCurrency } from '../../utils/format'

// Spending split by category. `data` is the output of spendingByCategory().
export default function CategoryDoughnut({ data, theme }) {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.value),
          backgroundColor: data.map((d) => d.color),
          borderColor: cssVar('--surface', '#0f172a'),
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    // theme is a dependency so the border recolors on toggle.
    [data, theme]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipOptions(),
          callbacks: {
            label(ctx) {
              const value = ctx.parsed
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
              const pct = total ? ((value / total) * 100).toFixed(1) : 0
              return `${ctx.label}: ${formatCurrency(value)} (${pct}%)`
            },
          },
        },
      },
    }),
    [theme]
  )

  return <Doughnut data={chartData} options={options} />
}
