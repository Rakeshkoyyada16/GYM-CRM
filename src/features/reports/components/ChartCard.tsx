import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatCurrency } from '@/lib/utils'

// ============================================
// Reusable Bar Chart
// ============================================

interface BarChartProps {
  title: string
  subtitle?: string
  badge?: string
  isLoading: boolean
  data: { label: string; value: number; color?: string }[]
  format?: 'currency' | 'number'
  delay?: number
}

export function BarChart({ title, subtitle, badge, isLoading, data, format = 'number', delay = 0 }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  if (isLoading) return <Card><CardHeader><Skeleton className="h-4 w-32" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <div>
            <CardTitle className="text-[13px]">{title}</CardTitle>
            {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {badge && <Badge variant="gray" className="text-[10px]">{badge}</Badge>}
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-end gap-1.5 h-44">
            {data.map((item, i) => {
              const h = (item.value / max) * 100
              const isHovered = hoveredIndex === i
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-1 relative cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                  {isHovered && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 z-10 rounded-md bg-gray-900 px-2 py-1 shadow-lg whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-white">
                        {format === 'currency' ? formatCurrency(item.value) : item.value}
                      </span>
                    </motion.div>
                  )}
                  <div className="flex-1 w-full flex items-end">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: delay + 0.1 + i * 0.04 }}
                      className={cn('w-full rounded-t-md transition-colors',
                        isHovered ? 'bg-brand-500' : item.color || 'bg-brand-200')} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-1.5 mt-2">
            {data.map(d => <div key={d.label} className="flex-1 text-center text-[10px] text-gray-400 font-medium truncate">{d.label}</div>)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// Reusable Stacked Bar Chart
// ============================================

interface StackedBarChartProps {
  title: string
  subtitle?: string
  isLoading: boolean
  data: { label: string; segments: { value: number; color: string; label: string }[] }[]
  delay?: number
}

export function StackedBarChart({ title, subtitle, isLoading, data, delay = 0 }: StackedBarChartProps) {
  if (isLoading) return <Card><CardHeader><Skeleton className="h-4 w-32" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
  if (!data.length) return null
  const maxTotal = Math.max(...data.map(d => d.segments.reduce((s, seg) => s + seg.value, 0)))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-[13px]">{title}</CardTitle>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-end gap-1.5 h-44">
            {data.map((item, i) => {
              const total = item.segments.reduce((s, seg) => s + seg.value, 0)
              const totalH = (total / maxTotal) * 100
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col-reverse items-end" style={{ height: `${totalH}%` }}>
                    {item.segments.map((seg, j) => {
                      const segH = total > 0 ? (seg.value / total) * 100 : 0
                      return (
                        <motion.div key={j} initial={{ height: 0 }} animate={{ height: `${segH}%` }}
                          transition={{ duration: 0.5, delay: delay + 0.1 + i * 0.04 + j * 0.02 }}
                          className="w-full transition-colors" style={{ backgroundColor: seg.color }} />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-1.5 mt-2">
            {data.map(d => <div key={d.label} className="flex-1 text-center text-[10px] text-gray-400 font-medium">{d.label}</div>)}
          </div>
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
            {data[0]?.segments.map((seg, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
                <span className="text-[10px] text-gray-500">{seg.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// Reusable Horizontal Bar Chart
// ============================================

interface HorizontalBarChartProps {
  title: string
  subtitle?: string
  isLoading: boolean
  data: { label: string; value: number; total?: number; color?: string; rightLabel?: string }[]
  delay?: number
}

export function HorizontalBarChart({ title, subtitle, isLoading, data, delay = 0 }: HorizontalBarChartProps) {
  if (isLoading) return <Card><CardHeader><Skeleton className="h-4 w-32" /></CardHeader><CardContent className="space-y-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-8 w-full"/>)}</CardContent></Card>
  const max = Math.max(...data.map(d => d.value))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-[13px]">{title}</CardTitle>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {data.map((item, i) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-gray-700">{item.label}</span>
                <span className="text-[12px] text-gray-500 tabular-nums">{item.rightLabel || item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: delay + 0.2 + i * 0.08 }}
                  className="h-full rounded-full" style={{ backgroundColor: item.color || '#4361ee' }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ============================================
// Reusable Donut Chart (CSS-only)
// ============================================

interface DonutChartProps {
  title: string
  subtitle?: string
  isLoading: boolean
  data: { label: string; value: number; percentage: number; color: string }[]
  centerLabel?: string
  centerValue?: string
  delay?: number
}

export function DonutChart({ title, subtitle, isLoading, data, centerLabel, centerValue, delay = 0 }: DonutChartProps) {
  if (isLoading) return <Card><CardHeader><Skeleton className="h-4 w-28" /></CardHeader><CardContent><Skeleton className="h-40 w-40 rounded-full mx-auto" /></CardContent></Card>

  const gradient = data.map((d, i) => {
    const start = data.slice(0, i).reduce((s, x) => s + x.percentage, 0)
    return `${d.color} ${start}% ${start + d.percentage}%`
  }).join(', ')

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-[13px]">{title}</CardTitle>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4">
          <div className="relative w-36 h-36 mb-4">
            <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${gradient})` }} />
            <div className="absolute inset-6 rounded-full bg-white flex flex-col items-center justify-center">
              {centerValue && <p className="text-[18px] font-bold text-gray-900">{centerValue}</p>}
              {centerLabel && <p className="text-[10px] text-gray-400">{centerLabel}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 w-full">
            {data.map(d => (
              <div key={d.label} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-[11px] text-gray-600 truncate">{d.label}</span>
                <span className="text-[11px] text-gray-400 ml-auto tabular-nums">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
