import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { MonthlyStats } from '../types/attendance.types'

interface MonthlySummaryProps {
  stats: MonthlyStats | null
  isLoading: boolean
}

export function MonthlySummary({ stats, isLoading }: MonthlySummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-32" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  const rows = [
    { label: 'Month', value: stats.month },
    { label: 'Working Days', value: String(stats.workingDays) },
    { label: 'Total Check-ins', value: String(stats.totalCheckIns) },
    { label: 'Avg Daily Attendance', value: String(stats.avgAttendance) },
    { label: 'Best Day', value: stats.bestDay },
    { label: 'Slowest Day', value: stats.worstDay },
    { label: 'Late Percentage', value: `${stats.latePercentage}%` },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-[13px]">Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {rows.map(row => (
              <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-[12px] text-gray-500">{row.label}</span>
                <span className="text-[13px] font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
