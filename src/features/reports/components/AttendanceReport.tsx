import { BarChart, HorizontalBarChart } from './ChartCard'
import { KPICards } from './KPICards'
import { useAttendanceReport } from '../hooks/useReports'
import type { KPIMetric } from '../types/report.types'

export function AttendanceReport() {
  const { chart, summary, byDay, byHour } = useAttendanceReport()

  const kpis: KPIMetric[] = [
    { label: 'Avg Daily', value: summary.data?.avgDailyAttendance || 0, format: 'number', change: summary.data?.attendanceGrowth, changeLabel: 'vs last period' },
    { label: 'Total Check-ins', value: summary.data?.totalCheckIns || 0, format: 'number' },
    { label: 'Late %', value: summary.data?.latePercentage || 0, format: 'percentage', suffix: '%' },
    { label: 'Peak Day', value: summary.data?.peakDay || '—', format: 'number' },
    { label: 'Peak Hour', value: summary.data?.peakHour || '—', format: 'number' },
  ]

  return (
    <div className="space-y-4">
      <KPICards metrics={kpis} isLoading={summary.isLoading} cols={5} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart
          title="Average Daily Attendance"
          subtitle="By month"
          isLoading={chart.isLoading}
          data={(chart.data || []).map(d => ({ label: d.month, value: d.avgDaily }))}
          delay={0.2}
        />
        <BarChart
          title="Check-ins by Day of Week"
          isLoading={byDay.isLoading}
          data={(byDay.data || []).map(d => ({
            label: d.day, value: d.avg,
            color: d.day === 'Sat' || d.day === 'Fri' ? '#4361ee' : '#bac8ff',
          }))}
          delay={0.3}
        />
      </div>

      <HorizontalBarChart
        title="Check-ins by Hour"
        subtitle="Peak hours analysis"
        isLoading={byHour.isLoading}
        data={(byHour.data || []).map(h => ({
          label: h.hour, value: h.count,
          color: h.count >= 40 ? '#4361ee' : h.count >= 25 ? '#748ffc' : '#bac8ff',
          rightLabel: String(h.count),
        }))}
        delay={0.4}
      />
    </div>
  )
}
