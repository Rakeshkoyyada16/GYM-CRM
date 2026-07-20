import { BarChart, HorizontalBarChart, DonutChart } from './ChartCard'
import { KPICards } from './KPICards'
import { useLeadReport } from '../hooks/useReports'
import type { KPIMetric } from '../types/report.types'

const SOURCE_COLORS = ['#4361ee', '#37b24d', '#f59f00', '#748ffc', '#868e96', '#20c997', '#e64980']
const STATUS_COLORS = ['#4361ee', '#748ffc', '#f59f00', '#91a7ff', '#bac8ff', '#ffa94d', '#37b24d', '#868e96']

export function LeadReport() {
  const { chart, summary } = useLeadReport()

  const kpis: KPIMetric[] = [
    { label: 'Total Leads', value: summary.data?.totalLeads || 0, format: 'number' },
    { label: 'Converted', value: summary.data?.converted || 0, format: 'number' },
    { label: 'Conversion Rate', value: summary.data?.conversionRate || 0, format: 'percentage', suffix: '%' },
    { label: 'Avg Days to Convert', value: summary.data?.avgConversionDays || 0, format: 'number', suffix: ' days' },
    { label: 'Pipeline Value', value: summary.data?.pipelineValue || 0, format: 'currency' },
  ]

  return (
    <div className="space-y-4">
      <KPICards metrics={kpis} isLoading={summary.isLoading} cols={5} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <BarChart
            title="Lead Funnel"
            subtitle="New leads vs converted"
            isLoading={chart.isLoading}
            data={(chart.data || []).map(d => ({ label: d.month, value: d.newLeads }))}
            delay={0.2}
          />
        </div>
        <div className="lg:col-span-4">
          <DonutChart
            title="By Status"
            isLoading={summary.isLoading}
            data={(summary.data?.statusBreakdown || []).slice(0, 6).map((s, i) => ({
              label: s.status, value: s.count, percentage: s.percentage,
              color: STATUS_COLORS[i % STATUS_COLORS.length],
            }))}
            centerValue={`${summary.data?.conversionRate || 0}%`}
            centerLabel="Conversion"
            delay={0.3}
          />
        </div>
      </div>

      <HorizontalBarChart
        title="Leads by Source"
        subtitle="Conversion performance by acquisition channel"
        isLoading={summary.isLoading}
        data={(summary.data?.sourceBreakdown || []).map((s, i) => ({
          label: s.source, value: s.leads, color: SOURCE_COLORS[i % SOURCE_COLORS.length],
          rightLabel: `${s.leads} leads · ${s.rate}% conv`,
        }))}
        delay={0.4}
      />
    </div>
  )
}
