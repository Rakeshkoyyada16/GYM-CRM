import { BarChart, StackedBarChart, HorizontalBarChart } from './ChartCard'
import { KPICards } from './KPICards'
import { useRevenueReport } from '../hooks/useReports'
import type { KPIMetric } from '../types/report.types'

export function RevenueReport() {
  const { chart, summary } = useRevenueReport()

  const kpis: KPIMetric[] = [
    { label: 'Total Revenue', value: summary.data?.totalRevenue || 0, format: 'currency', change: summary.data?.revenueGrowth, changeLabel: 'vs last period' },
    { label: 'Net Profit', value: summary.data?.netProfit || 0, format: 'currency' },
    { label: 'Profit Margin', value: summary.data?.profitMargin || 0, format: 'percentage', suffix: '%' },
    { label: 'Avg Monthly', value: summary.data?.avgMonthlyRevenue || 0, format: 'currency' },
  ]

  return (
    <div className="space-y-4">
      <KPICards metrics={kpis} isLoading={summary.isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <StackedBarChart
            title="Revenue Breakdown"
            subtitle="Revenue by source over time"
            isLoading={chart.isLoading}
            data={(chart.data || []).map(d => ({
              label: d.month,
              segments: [
                { value: d.memberships, color: '#4361ee', label: 'Memberships' },
                { value: d.pt, color: '#37b24d', label: 'Personal Training' },
                { value: d.other, color: '#f59f00', label: 'Other' },
              ],
            }))}
            delay={0.2}
          />
        </div>
        <div className="lg:col-span-4">
          <HorizontalBarChart
            title="Revenue by Source"
            isLoading={summary.isLoading}
            data={(summary.data?.revenueBySource || []).map((s, i) => ({
              label: s.source, value: s.amount,
              color: ['#4361ee', '#37b24d', '#f59f00', '#748ffc', '#868e96'][i],
              rightLabel: `${s.percentage}%`,
            }))}
            delay={0.3}
          />
        </div>
      </div>

      <BarChart
        title="Profit Trend"
        subtitle="Monthly profit over time"
        isLoading={chart.isLoading}
        data={(chart.data || []).map(d => ({ label: d.month, value: d.profit, color: d.profit > 180000 ? '#37b24d' : '#4361ee' }))}
        format="currency"
        delay={0.4}
      />
    </div>
  )
}
