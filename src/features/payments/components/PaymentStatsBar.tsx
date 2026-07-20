import { motion } from 'framer-motion'
import { IndianRupee, TrendingUp, AlertCircle, Clock, CreditCard, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PaymentStats } from '../types/payment.types'
import { formatCurrencyShort } from '../utils/paymentUtils'

interface PaymentStatsBarProps {
  stats: PaymentStats | null
  isLoading: boolean
}

const cards = [
  { key: 'totalRevenue' as const, label: 'Total Revenue', icon: IndianRupee, color: 'text-brand-600', bg: 'bg-brand-50', format: 'currency' as const },
  { key: 'monthlyRevenue' as const, label: 'This Month', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', format: 'currency' as const, change: 12.5 },
  { key: 'collectedThisMonth' as const, label: 'Collected', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', format: 'currency' as const },
  { key: 'pendingAmount' as const, label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', format: 'currency' as const, sub: 'count' as const },
  { key: 'overdueCount' as const, label: 'Overdue', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  { key: 'avgPaymentValue' as const, label: 'Avg Payment', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', format: 'currency' as const },
]

export function PaymentStatsBar({ stats, isLoading }: PaymentStatsBarProps) {
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
          <motion.div key={card.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
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
                    {card.change && <p className="text-[10px] text-green-600">+{card.change}%</p>}
                    {card.sub === 'count' && <p className="text-[10px] text-gray-400">{stats.pendingCount} invoices</p>}
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
