import { StackedBarChart, HorizontalBarChart, DonutChart } from './ChartCard'
import { KPICards } from './KPICards'
import { usePaymentReport } from '../hooks/useReports'
import type { KPIMetric } from '../types/report.types'

const METHOD_COLORS = ['#4361ee', '#37b24d', '#f59f00', '#868e96', '#748ffc', '#bac8ff']
const TYPE_COLORS = ['#4361ee', '#37b24d', '#f59f00', '#748ffc', '#868e96']

export function PaymentReport() {
  const { chart, summary } = usePaymentReport()

  const kpis: KPIMetric[] = [
    { label: 'Total Collected', value: summary.data?.totalCollected || 0, format: 'currency' },
    { label: 'Pending', value: summary.data?.totalPending || 0, format: 'currency' },
    { label: 'Overdue', value: summary.data?.totalOverdue || 0, format: 'currency' },
    { label: 'Collection Rate', value: summary.data?.collectionRate || 0, format: 'percentage', suffix: '%' },
    { label: 'Avg Payment', value: summary.data?.avgPaymentValue || 0, format: 'currency' },
  ]

  return (
    <div className="space-y-4">
      <KPICards metrics={kpis} isLoading={summary.isLoading} cols={5} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <StackedBarChart
            title="Payment Collection"
            subtitle="Collected vs pending vs overdue"
            isLoading={chart.isLoading}
            data={(chart.data || []).map(d => ({
              label: d.month,
              segments: [
                { value: d.collected, color: '#37b24d', label: 'Collected' },
                { value: d.pending, color: '#f59f00', label: 'Pending' },
                { value: d.overdue, color: '#fa5252', label: 'Overdue' },
              ],
            }))}
            delay={0.2}
          />
        </div>
        <div className="lg:col-span-4">
          <DonutChart
            title="By Payment Method"
            isLoading={summary.isLoading}
            data={(summary.data?.methodBreakdown || []).filter(m => m.count > 0).map((m, i) => ({
              label: m.method, value: m.amount, percentage: m.percentage,
              color: METHOD_COLORS[i % METHOD_COLORS.length],
            }))}
            centerLabel="Methods"
            delay={0.3}
          />
        </div>
      </div>

      <HorizontalBarChart
        title="Revenue by Payment Type"
        isLoading={summary.isLoading}
        data={(summary.data?.typeBreakdown || []).map((t, i) => ({
          label: t.type, value: t.amount, color: TYPE_COLORS[i % TYPE_COLORS.length],
          rightLabel: `${t.count} txns · ${t.percentage}%`,
        }))}
        delay={0.4}
      />
    </div>
  )
}
