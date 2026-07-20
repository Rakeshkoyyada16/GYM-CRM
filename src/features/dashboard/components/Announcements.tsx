import { motion } from 'framer-motion'
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Announcement } from '../types/dashboard.types'

interface AnnouncementsProps {
  data: Announcement[] | null
  isLoading: boolean
}

const typeStyles = {
  info:    { bg: 'bg-blue-50', border: 'border-blue-100', icon: Info, iconColor: 'text-blue-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-100', icon: AlertTriangle, iconColor: 'text-amber-500' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, iconColor: 'text-emerald-500' },
}

export function Announcements({ data, isLoading }: AnnouncementsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.map((item, i) => {
              const style = typeStyles[item.type]
              const Icon = style.icon
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + i * 0.06 }}
                  className={cn('rounded-lg border p-3 cursor-pointer hover:shadow-xs transition-shadow', style.bg, style.border)}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', style.iconColor)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-gray-900 truncate">{item.title}</p>
                        <span className="text-[10px] text-gray-400 shrink-0">{item.date}</span>
                      </div>
                      <p className="text-[12px] text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{item.body}</p>
                    </div>
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
