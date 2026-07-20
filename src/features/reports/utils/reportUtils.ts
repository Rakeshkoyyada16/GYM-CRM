import type { ReportPeriod } from '../types/report.types'

export const PERIOD_LABELS: Record<ReportPeriod, string> = {
  '7d': 'Last 7 Days', '30d': 'Last 30 Days', '90d': 'Last 90 Days',
  '12m': 'Last 12 Months', 'custom': 'Custom Range',
}

export const CHART_COLORS = ['#4361ee', '#37b24d', '#f59f00', '#748ffc', '#fa5252', '#868e96', '#20c997', '#e64980']

// formatCurrency, formatCurrencyShort, getChangeColor, getChangeBg
// are now imported from @/lib/utils — no duplicates here.
