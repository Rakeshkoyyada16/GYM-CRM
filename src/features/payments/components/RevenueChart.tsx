import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { RevenueByMonth } from '../types/payment.types'
import { formatCurrency, formatCurrencyShort } from '../utils/paymentUtils'

interface RevenueChartProps {
  data: RevenueByMonth[]
  isLoading: boolean
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (isLoading) {
    return <Card><CardHeader><Skeleton className="h-4 w-32" /></CardHeader><CardContent><Skeleton className="h-52 w-full" /></CardContent></Card>
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue))
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const totalProfit = data.reduce((s, d) => s + d.profit, 0)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-[12px] text-gray-400 mt-0.5">Total: {formatCurrency(totalRevenue)} · Profit: {formatCurrency(totalProfit)}</p>
          </div>
          <Badge variant="gray">12 months</Badge>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-end gap-1.5 h-48">
            {data.map((point, i) => {
              const revH = (point.revenue / maxRevenue) * 100
              const expH = (point.expenses / maxRevenue) * 100
              const isHovered = hoveredIndex === i
              return (
                <div key={point.month} className="flex-1 flex flex-col items-center gap-0.5 relative cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                  {isHovered && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-14 z-10 rounded-lg bg-gray-900 px-2.5 py-1.5 shadow-xl whitespace-nowrap">
                      <p className="text-[11px] font-semibold text-white">{formatCurrency(point.revenue)}</p>
                      <p className="text-[10px] text-gray-400">Profit: {formatCurrency(point.profit)}</p>
                    </motion.div>
                  )}
                  <div className="flex-1 w-full flex items-end gap-px">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${revH}%` }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.04 }}
                      className={`flex-1 rounded-t-md transition-colors ${isHovered ? 'bg-brand-500' : 'bg-brand-200'}`} />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${expH}%` }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.04 }}
                      className={`flex-1 rounded-t-md transition-colors ${isHovered ? 'bg-red-400' : 'bg-red-100'}`} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-1.5 mt-2">
            {data.map(d => <div key={d.month} className="flex-1 text-center text-[10px] text-gray-400 font-medium">{d.month}</div>)}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-brand-500" /><span className="text-[11px] text-gray-500">Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-red-400" /><span className="text-[11px] text-gray-500">Expenses</span></div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
