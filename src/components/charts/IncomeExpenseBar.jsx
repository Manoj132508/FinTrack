import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { tooltipOptions, gridColor, tickColor } from './chartSetup'
import { formatCurrency, formatCompact } from '../../utils/format'

// Net cash flow per month as bars, colored by surplus/deficit.
export default function IncomeExpenseBar({ data, theme }) {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: 'Net',
          data: data.map((d) => d.net),
          backgroundColor: data.map((d) =>
            d.net >= 0 ? 'rgba(34, 197, 94, 0.75)' : 'rgba(244, 63, 94, 0.75)'
          ),
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 44,
        },
      ],
    }),
    [data, theme]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipOptions(),
          callbacks: {
            label: (ctx) => `Net: ${formatCurrency(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { color: tickColor() },
        },
        y: {
          grid: { color: gridColor(), drawBorder: false },
          ticks: { color: tickColor(), callback: (v) => formatCompact(v) },
        },
      },
    }),
    [theme]
  )

  return <Bar data={chartData} options={options} />
}
