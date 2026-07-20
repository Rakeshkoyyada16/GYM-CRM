import { StackedBarChart, HorizontalBarChart, DonutChart } from './ChartCard'
import { KPICards } from './KPICards'
import { useMembershipReport } from '../hooks/useReports'
import type { KPIMetric } from '../types/report.types'

const PLAN_COLORS = ['#868e96', '#748ffc', '#4361ee', '#364fc7']
const STATUS_COLORS = ['#37b24d', '#868e96', '#fa5252', '#f59f00']

export function MembershipReport() {
  const { chart, summary } = useMembershipReport()

  const kpis: KPIMetric[] = [
    { label: 'Total Members', value: summary.data?.totalMembers || 0, format: 'number' },
    { label: 'Active', value: summary.data?.activeMembers || 0, format: 'number' },
    { label: 'New This Period', value: summary.data?.newThisPeriod || 0, format: 'number' },
    { label: 'Retention Rate', value: summary.data?.retentionRate || 0, format: 'percentage', suffix: '%' },
    { label: 'Churn Rate', value: summary.data?.churnRate || 0, format: 'percentage', suffix: '%' },
    { label: 'Avg LTV', value: summary.data?.avgLifetimeValue || 0, format: 'currency' },
  ]

  return (
    <div className="space-y-4">
      <KPICards metrics={kpis} isLoading={summary.isLoading} cols={6} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <StackedBarChart
            title="Member Growth"
            subtitle="New members vs churned"
            isLoading={chart.isLoading}
            data={(chart.data || []).map(d => ({
              label: d.month,
              segments: [
                { value: d.newMembers, color: '#37b24d', label: 'New' },
                { value: d.churned, color: '#fa5252', label: 'Churned' },
              ],
            }))}
            delay={0.2}
          />
        </div>
        <div className="lg:col-span-4">
          <DonutChart
            title="By Status"
            isLoading={summary.isLoading}
            data={(summary.data?.statusBreakdown || []).map((s, i) => ({
              label: s.status, value: s.count, percentage: s.percentage,
              color: STATUS_COLORS[i % STATUS_COLORS.length],
            }))}
            centerValue={String(summary.data?.totalMembers || 0)}
            centerLabel="Total"
            delay={0.3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HorizontalBarChart
          title="Members by Plan"
          isLoading={summary.isLoading}
          data={(summary.data?.planBreakdown || []).map((p, i) => ({
            label: p.plan, value: p.count, color: PLAN_COLORS[i],
            rightLabel: `${p.count} members`,
          }))}
          delay={0.4}
        />
        <HorizontalBarChart
          title="Revenue by Plan"
          isLoading={summary.isLoading}
          data={(summary.data?.planBreakdown || []).map((p, i) => ({
            label: p.plan, value: p.revenue, color: PLAN_COLORS[i],
            rightLabel: `${p.percentage}%`,
          }))}
          delay={0.5}
        />
      </div>
    </div>
  )
}
