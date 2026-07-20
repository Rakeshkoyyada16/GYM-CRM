import { motion } from 'framer-motion'
import { cn, formatNumber, formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardStats } from '../types/dashboard.types'

interface MetricCardProps {
  title: string
  value: number | string
  subtitle?: string
  change?: number
  changeLabel?: string
  icon: React.ElementType
  format?: 'number' | 'currency' | 'percentage' | 'none'
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  index?: number
}

const variantStyles = {
  default: { iconBg: 'bg-brand-50', iconColor: 'text-brand-600' },
  success: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  warning: { iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  danger:  { iconBg: 'bg-red-50',    iconColor: 'text-red-600' },
  info:    { iconBg: 'bg-blue-50',   iconColor: 'text-blue-600' },
}

export function MetricCard({
  title, value, subtitle, change, changeLabel, icon: Icon,
  format = 'number', variant = 'default', index = 0,
}: MetricCardProps) {
  const styles = variantStyles[variant]

  const formattedValue = typeof value === 'string'
    ? value
    : format === 'currency' ? formatCurrency(value)
    : format === 'percentage' ? `${value}%`
    : formatNumber(value)

  const hasTrend = change !== undefined && change !== 0
  const isPositive = (change ?? 0) > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="group hover:shadow-md hover:border-gray-300 transition-all duration-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 min-w-0">
              <p className="text-[13px] font-medium text-gray-500 truncate">{title}</p>
              <p className="text-[22px] font-bold text-gray-900 tracking-tight tabular-nums leading-none">
                {formattedValue}
              </p>
              {(hasTrend || subtitle) && (
                <div className="flex items-center gap-1.5">
                  {hasTrend && (
                    <span className={cn(
                      'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                      isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    )}>
                      {isPositive ? '↑' : '↓'} {Math.abs(change!)}%
                    </span>
                  )}
                  {changeLabel && (
                    <span className="text-[11px] text-gray-400">{changeLabel}</span>
                  )}
                  {subtitle && !hasTrend && (
                    <span className="text-[11px] text-gray-400">{subtitle}</span>
                  )}
                </div>
              )}
            </div>
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shrink-0', styles.iconBg)}>
              <Icon className={cn('h-5 w-5', styles.iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Skeleton loader for MetricCard — shown while data loads.
 */
export function MetricCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}
