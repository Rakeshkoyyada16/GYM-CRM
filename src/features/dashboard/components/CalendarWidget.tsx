import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { CalendarEvent } from '../types/dashboard.types'

interface CalendarWidgetProps {
  data: CalendarEvent[] | null
  isLoading: boolean
}

export function CalendarWidget({ data, isLoading }: CalendarWidgetProps) {
  const today = new Date()
  const dayName = today.toLocaleDateString('en-IN', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-32" /></CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <div>
            <CardTitle>Today's Schedule</CardTitle>
            <p className="text-[12px] text-gray-400 mt-0.5">{dayName}, {dateStr}</p>
          </div>
          <Badge variant="default">{data.length} events</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-[13px] font-semibold text-gray-600 shrink-0 group-hover:bg-gray-100 transition-colors">
                  {event.time.split(' ')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{event.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-[11px] text-gray-400">{event.time}</span>
                  </div>
                </div>
                <Badge variant={
                  event.type === 'class' ? 'default' :
                  event.type === 'appointment' ? 'warning' : 'gray'
                } className="text-[9px] capitalize">
                  {event.type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
