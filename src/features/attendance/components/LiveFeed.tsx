import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials, cn } from '@/lib/utils'
import type { AttendanceRecord } from '../types/attendance.types'
import { getStatusVariant, STATUS_LABELS, formatTime12 } from '../utils/attendanceUtils'

interface LiveFeedProps {
  records: AttendanceRecord[]
  isLoading: boolean
}

export function LiveFeed({ records, isLoading }: LiveFeedProps) {
  const recent = records.slice(0, 8)

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-2.5 w-16" /></div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle className="text-[13px]">Live Feed</CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[11px] text-gray-400">Live</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recent.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 last:border-0 group cursor-pointer"
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px] font-semibold">
                    {getInitials(record.memberName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{record.memberName}</p>
                  <p className="text-[10px] text-gray-400">
                    {record.className || 'General visit'} · {formatTime12(record.checkIn)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(record.status)} className="text-[9px] shrink-0">
                  {STATUS_LABELS[record.status]}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
