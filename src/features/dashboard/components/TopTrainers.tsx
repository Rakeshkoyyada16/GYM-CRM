import { motion } from 'framer-motion'
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials, cn } from '@/lib/utils'
import type { TopTrainer } from '../types/dashboard.types'

interface TopTrainersProps {
  data: TopTrainer[] | null
  isLoading: boolean
}

const trendIcons = { up: TrendingUp, down: TrendingDown, stable: Minus }
const trendColors = { up: 'text-emerald-500', down: 'text-red-500', stable: 'text-gray-400' }

export function TopTrainers({ data, isLoading }: TopTrainersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
              <Skeleton className="h-4 w-8" />
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
      transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Top Trainers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {data.map((trainer, i) => {
              const TrendIcon = trendIcons[trainer.trend]
              return (
                <motion.div
                  key={trainer.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + i * 0.06 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {/* Rank */}
                  <span className="text-[11px] font-bold text-gray-300 w-4 text-center tabular-nums">
                    {i + 1}
                  </span>

                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-[11px] font-semibold">
                      {getInitials(trainer.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{trainer.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{trainer.specialization}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-[13px] font-semibold text-gray-900 tabular-nums">{trainer.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5 justify-end mt-0.5">
                      <TrendIcon className={cn('h-3 w-3', trendColors[trainer.trend])} />
                      <span className="text-[10px] text-gray-400">{trainer.clients} clients</span>
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
