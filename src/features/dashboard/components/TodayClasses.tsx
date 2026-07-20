import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { TodayClass } from '../types/dashboard.types'

interface TodayClassesProps {
  data: TodayClass[] | null
  isLoading: boolean
}

const statusBadge: Record<string, 'success' | 'info' | 'gray'> = {
  completed: 'gray', ongoing: 'info', upcoming: 'success',
}

export function TodayClasses({ data, isLoading }: TodayClassesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
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
      transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle>Today's Classes</CardTitle>
          <Badge variant="gray">{data.length} classes</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.map((cls, i) => {
              const pct = Math.round((cls.enrolled / cls.capacity) * 100)
              const full = pct >= 100

              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer',
                    cls.status === 'ongoing' ? 'bg-brand-50/50 ring-1 ring-brand-100' : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-lg shrink-0">
                    {cls.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{cls.name}</p>
                      <Badge variant={statusBadge[cls.status]} className="text-[9px] shrink-0">
                        {cls.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-gray-400">{cls.time}</span>
                      <span className="text-[11px] text-gray-400">{cls.trainer}</span>
                      <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
                        <Users className="h-3 w-3" />
                        {cls.enrolled}/{cls.capacity}
                      </span>
                    </div>
                    <Progress
                      value={pct}
                      className="mt-1.5 h-1"
                      indicatorClassName={full ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-brand-400'}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
