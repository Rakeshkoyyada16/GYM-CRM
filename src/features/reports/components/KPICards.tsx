import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { KPIMetric } from '../types/report.types'
import { formatCurrency, formatCurrencyShort, getChangeColor, getChangeBg } from '@/lib/utils'

interface KPICardsProps {
  metrics: KPIMetric[]
  isLoading: boolean
  cols?: 2 | 3 | 4 | 5 | 6
}

export function KPICards({ metrics, isLoading, cols = 4 }: KPICardsProps) {
  const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4', 5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5', 6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' }[cols]

  if (isLoading) {
    return (
      <div className={`grid ${colClass} gap-3`}>
        {Array.from({ length: metrics.length || cols }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-14 w-full" /></CardContent></Card>
        ))}
      </div>
    )
  }

  const formatValue = (m: KPIMetric) => {
    const v = m.value
    if (typeof v === 'string') return `${m.prefix || ''}${v}${m.suffix || ''}`
    switch (m.format) {
      case 'currency': return formatCurrencyShort(v)
      case 'percentage': return `${v}${m.suffix || '%'}`
      default: return `${m.prefix || ''}${v.toLocaleString('en-IN')}${m.suffix || ''}`
    }
  }

  return (
    <div className={`grid ${colClass} gap-3`}>
      {metrics.map((metric, i) => (
        <motion.div key={metric.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
          <Card className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <p className="text-[11px] text-gray-400 mb-1">{metric.label}</p>
              <p className="text-[20px] font-bold text-gray-900 tabular-nums leading-none">{formatValue(metric)}</p>
              {metric.change !== undefined && (
                <div className="flex items-center gap-1 mt-1.5">
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getChangeColor(metric.change)} ${getChangeBg(metric.change)}`}>
                    {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                  </span>
                  {metric.changeLabel && <span className="text-[10px] text-gray-400">{metric.changeLabel}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
