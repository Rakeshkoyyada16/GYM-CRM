import { motion } from 'framer-motion'
import { Users, UserPlus, TrendingUp, IndianRupee, Clock, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { LeadStats } from '../types/lead.types'
import { formatCurrencyShort } from '../utils/leadUtils'

interface LeadStatsBarProps {
  stats: LeadStats | null
  isLoading: boolean
}

const statCards = [
  { key: 'totalLeads' as const, label: 'Total Leads', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
  { key: 'newLeads' as const, label: 'New Leads', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'convertedThisMonth' as const, label: 'Converted', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'pipelineValue' as const, label: 'Pipeline Value', icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50', format: 'currency' as const },
  { key: 'followUpsDue' as const, label: 'Follow-ups Due', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'lostThisMonth' as const, label: 'Lost', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
]

export function LeadStatsBar({ stats, isLoading }: LeadStatsBarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {statCards.map((card, i) => {
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
                      {card.format === 'currency' ? formatCurrencyShort(value) : value}
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
