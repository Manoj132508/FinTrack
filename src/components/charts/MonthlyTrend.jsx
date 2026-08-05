import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { tooltipOptions, gridColor, tickColor } from './chartSetup'
import { formatCurrency, formatCompact } from '../../utils/format'

// Income vs expense over the last months. `data` is monthlyTrend() output.
export default function MonthlyTrend({ data, theme }) {
  const chartData = useMemo(() => {
    const labels = data.map((d) => d.label)
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: data.map((d) => d.income),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
        },
        {
          label: 'Expenses',
          data: data.map((d) => d.expense),
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
        },
      ],
    }
  }, [data, theme])

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: tickColor(), usePointStyle: true, boxWidth: 8 },
        },
        tooltip: {
          ...tooltipOptions(),
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor(), drawBorder: false },
          ticks: { color: tickColor() },
        },
        y: {
          grid: { color: gridColor(), drawBorder: false },
          ticks: { color: tickColor(), callback: (v) => formatCompact(v) },
          beginAtZero: true,
        },
      },
    }),
    [theme]
  )

  return <Line data={chartData} options={options} />
}
