// Registers only the Chart.js pieces this app actually uses. Importing this
// module once (done by each chart component) wires up the controllers, scales,
// and elements so tree-shaking keeps the bundle lean.
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
)

// Shared look-and-feel helpers, resolved against the active CSS theme so the
// charts recolor automatically when the user toggles light/dark.
export function cssVar(name, fallback) {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}

export function gridColor() {
  return cssVar('--chart-grid', 'rgba(148, 163, 184, 0.15)')
}

export function tickColor() {
  return cssVar('--text-muted', '#94a3b8')
}

export function tooltipOptions() {
  return {
    backgroundColor: cssVar('--surface-2', '#1e293b'),
    titleColor: cssVar('--text', '#e2e8f0'),
    bodyColor: cssVar('--text-muted', '#cbd5e1'),
    borderColor: cssVar('--border', 'rgba(148,163,184,0.2)'),
    borderWidth: 1,
    padding: 12,
    cornerRadius: 8,
    boxPadding: 4,
  }
}
