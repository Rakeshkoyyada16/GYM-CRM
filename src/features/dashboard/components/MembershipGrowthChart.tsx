import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { MembershipGrowthPoint } from '../types/dashboard.types'

interface MembershipGrowthChartProps {
  data: MembershipGrowthPoint[] | null
  isLoading: boolean
}

export function MembershipGrowthChart({ data, isLoading }: MembershipGrowthChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-4 w-36" /></CardHeader>
        <CardContent><Skeleton className="h-40 w-full" /></CardContent>
      </Card>
    )
  }

  if (!data) return null

  const maxTotal = Math.max(...data.map(d => d.total))
  const minTotal = Math.min(...data.map(d => d.total))
  const range = maxTotal - minTotal

  // Build SVG path
  const width = 100
  const height = 100
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d.total - minTotal) / range) * height,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  const growth = data[data.length - 1].total - data[0].total
  const growthPct = Math.round((growth / data[0].total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <div>
            <CardTitle>Membership Growth</CardTitle>
            <p className="text-[12px] text-gray-400 mt-0.5">
              +{growth} members ({growthPct}%) in 6 months
            </p>
          </div>
          <Badge variant="success">6 months</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Area chart */}
          <div className="relative h-32">
            <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path d={linePath} fill="none" stroke="var(--brand-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke="var(--brand-500)" strokeWidth="2" />
              ))}
            </svg>
          </div>

          {/* Month labels */}
          <div className="flex justify-between mt-2">
            {data.map(d => (
              <span key={d.month} className="text-[10px] text-gray-400 font-medium">{d.month}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
