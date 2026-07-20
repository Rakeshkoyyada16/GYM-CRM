import { motion } from 'framer-motion'
import { Users, Clock, AlertTriangle, TrendingUp, BarChart3, Timer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { AttendanceStats as Stats } from '../types/attendance.types'

interface AttendanceStatsProps {
  stats: Stats | null
  isLoading: boolean
}

const cards = [
  { key: 'totalCheckedIn' as const, label: 'Checked In', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
  { key: 'onTime' as const, label: 'On Time', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'late' as const, label: 'Late', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'checkedInPercentage' as const, label: 'Attendance %', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', suffix: '%' },
  { key: 'avgCheckInTime' as const, label: 'Avg Check-in', icon: Timer, color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'peakHour' as const, label: 'Peak Hour', icon: BarChart3, color: 'text-teal-600', bg: 'bg-teal-50' },
]

export function AttendanceStats({ stats, isLoading }: AttendanceStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-14 w-full" /></CardContent></Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon
        const value = stats[card.key]
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-[18px] font-bold text-gray-900 tabular-nums leading-none">
                      {value}{card.suffix || ''}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
