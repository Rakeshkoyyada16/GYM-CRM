import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActivityItem } from '../types/dashboard.types'

interface ActivityFeedProps {
  data: ActivityItem[] | null
  isLoading: boolean
}

export function ActivityFeed({ data, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
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
      transition={{ duration: 0.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Latest Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {data.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1 + i * 0.05 }}
                className="flex gap-3 py-2.5 group cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-sm shrink-0 group-hover:bg-gray-100 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-700 leading-snug">
                    {item.message}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
