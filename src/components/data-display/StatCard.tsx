import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatNumber, formatCurrency } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: React.ElementType
  iconColor?: string
  iconBgColor?: string
  format?: 'number' | 'currency' | 'percentage' | 'none'
  index?: number
}

/**
 * Premium KPI metric card.
 * Displays a single metric with trend indicator, icon, and formatted value.
 */
export function StatCard({
  title, value, change, changeLabel, icon: Icon,
  iconColor = 'text-brand-600', iconBgColor = 'bg-brand-50',
  format = 'number', index = 0,
}: StatCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val
    switch (format) {
      case 'currency': return formatCurrency(val)
      case 'percentage': return `${val}%`
      case 'number': return formatNumber(val)
      default: return val.toString()
    }
  }

  const hasTrend = change !== undefined && change !== 0
  const isPositive = change !== undefined && change > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="group hover:shadow-md hover:border-gray-300 transition-all duration-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-[13px] font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight tabular-nums">
                {formatValue(value)}
              </p>
              {hasTrend && (
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                    isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  )}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {isPositive ? '+' : ''}{change}%
                  </div>
                  {changeLabel && (
                    <span className="text-[11px] text-gray-400">{changeLabel}</span>
                  )}
                </div>
              )}
            </div>
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBgColor)}>
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
