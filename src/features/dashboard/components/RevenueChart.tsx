import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import type { RevenueChartPoint } from '../types/dashboard.types'

interface RevenueChartProps {
  data: RevenueChartPoint[] | null
  isLoading: boolean
}

const CHART_WIDTH = 800
const CHART_HEIGHT = 280
const PADDING = { top: 20, right: 20, bottom: 40, left: 70 }
const INNER_W = CHART_WIDTH - PADDING.left - PADDING.right
const INNER_H = CHART_HEIGHT - PADDING.top - PADDING.bottom

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null)

  const chartData = useMemo(() => {
    if (!data) return null
    const allValues = data.flatMap(d => [d.revenue, d.expenses])
    const maxVal = Math.max(...allValues)
    const minVal = 0
    const range = maxVal - minVal || 1

    const yTicks = 5
    const yTickValues = Array.from({ length: yTicks }, (_, i) =>
      Math.round(minVal + (range / (yTicks - 1)) * i)
    )

    const revenuePoints = data.map((d, i) => ({
      x: PADDING.left + (i / (data.length - 1)) * INNER_W,
      y: PADDING.top + INNER_H - ((d.revenue - minVal) / range) * INNER_H,
    }))

    const expensePoints = data.map((d, i) => ({
      x: PADDING.left + (i / (data.length - 1)) * INNER_W,
      y: PADDING.top + INNER_H - ((d.expenses - minVal) / range) * INNER_H,
    }))

    const profitPoints = data.map((d, i) => ({
      x: PADDING.left + (i / (data.length - 1)) * INNER_W,
      y: PADDING.top + INNER_H - (((d.revenue - d.expenses) - minVal) / range) * INNER_H,
    }))

    const revenuePath = buildSmoothPath(revenuePoints)
    const expensePath = buildSmoothPath(expensePoints)
    const profitPath = buildSmoothPath(profitPoints)

    const revenueArea = `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x} ${PADDING.top + INNER_H} L ${revenuePoints[0].x} ${PADDING.top + INNER_H} Z`
    const expenseArea = `${expensePath} L ${expensePoints[expensePoints.length - 1].x} ${PADDING.top + INNER_H} L ${expensePoints[0].x} ${PADDING.top + INNER_H} Z`
    const profitArea = `${profitPath} L ${profitPoints[profitPoints.length - 1].x} ${PADDING.top + INNER_H} L ${profitPoints[0].x} ${PADDING.top + INNER_H} Z`

    return {
      revenuePoints, expensePoints, profitPoints,
      revenuePath, expensePath, profitPath,
      revenueArea, expenseArea, profitArea,
      yTickValues, maxVal, minVal,
    }
  }, [data])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef || !data) return
    const rect = svgRef.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const scaleX = CHART_WIDTH / rect.width
    const scaledX = mouseX * scaleX
    const stepWidth = INNER_W / (data.length - 1)
    const index = Math.round((scaledX - PADDING.left) / stepWidth)
    if (index >= 0 && index < data.length) {
      setHoveredIndex(index)
    } else {
      setHoveredIndex(null)
    }
  }, [svgRef, data])

  const totalRevenue = data?.reduce((s, d) => s + d.revenue, 0) ?? 0
  const totalProfit = data?.reduce((s, d) => s + (d.revenue - d.expenses), 0) ?? 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (!data || !chartData) return null

  const hovered = hoveredIndex !== null ? data[hoveredIndex] : null
  const hoveredRevenue = hovered ? chartData.revenuePoints[hoveredIndex!] : null
  const hoveredExpense = hovered ? chartData.expensePoints[hoveredIndex!] : null
  const hoveredProfit = hovered ? chartData.profitPoints[hoveredIndex!] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Total: {formatCurrency(totalRevenue)} · Profit: {formatCurrency(totalProfit)}
            </p>
          </div>
          <Badge variant="gray">12 months</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="relative">
            <svg
              ref={setSvgRef}
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="w-full h-auto select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Defs: gradients */}
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4361ee" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4361ee" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y-axis grid lines + labels */}
              {chartData.yTickValues.map((val, i) => {
                const y = PADDING.top + INNER_H - (i / (chartData.yTickValues.length - 1)) * INNER_H
                return (
                  <g key={i}>
                    <line
                      x1={PADDING.left} y1={y}
                      x2={CHART_WIDTH - PADDING.right} y2={y}
                      stroke="#f1f3f5" strokeWidth="1"
                    />
                    <text x={PADDING.left - 12} y={y + 4} textAnchor="end"
                      fontSize="11" fill="#9ca3af" fontFamily="Inter, system-ui">
                      {val >= 1000 ? `₹${(val / 1000).toFixed(0)}K` : `₹${val}`}
                    </text>
                  </g>
                )
              })}

              {/* X-axis labels */}
              {data.map((d, i) => {
                const x = PADDING.left + (i / (data.length - 1)) * INNER_W
                return (
                  <text key={d.month} x={x} y={CHART_HEIGHT - 8} textAnchor="middle"
                    fontSize="11" fill={hoveredIndex === i ? '#1f2937' : '#9ca3af'}
                    fontWeight={hoveredIndex === i ? '600' : '400'}
                    fontFamily="Inter, system-ui">
                    {d.month}
                  </text>
                )
              })}

              {/* Area fills */}
              <path d={chartData.revenueArea} fill="url(#revenueGrad)" />
              <path d={chartData.expenseArea} fill="url(#expenseGrad)" />
              <path d={chartData.profitArea} fill="url(#profitGrad)" />

              {/* Lines */}
              <path d={chartData.revenuePath} fill="none" stroke="#4361ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d={chartData.expensePath} fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />
              <path d={chartData.profitPath} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points — revenue */}
              {chartData.revenuePoints.map((p, i) => (
                <circle key={`r-${i}`} cx={p.x} cy={p.y} r={hoveredIndex === i ? 5 : 3}
                  fill="white" stroke="#4361ee" strokeWidth={hoveredIndex === i ? 2.5 : 2}
                  className="transition-all duration-150" />
              ))}

              {/* Data points — profit */}
              {chartData.profitPoints.map((p, i) => (
                <circle key={`p-${i}`} cx={p.x} cy={p.y} r={hoveredIndex === i ? 4 : 2.5}
                  fill="white" stroke="#34d399" strokeWidth={hoveredIndex === i ? 2 : 1.5}
                  className="transition-all duration-150" />
              ))}

              {/* Hover: vertical crosshair */}
              {hoveredIndex !== null && hoveredRevenue && (
                <line
                  x1={hoveredRevenue.x} y1={PADDING.top}
                  x2={hoveredRevenue.x} y2={PADDING.top + INNER_H}
                  stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 2"
                />
              )}

              {/* Hover: highlighted dots */}
              {hoveredIndex !== null && hoveredRevenue && (
                <>
                  <circle cx={hoveredRevenue.x} cy={hoveredRevenue.y} r="6" fill="#4361ee" stroke="white" strokeWidth="2.5" />
                  {hoveredExpense && <circle cx={hoveredExpense.x} cy={hoveredExpense.y} r="5" fill="#f87171" stroke="white" strokeWidth="2" />}
                  {hoveredProfit && <circle cx={hoveredProfit.x} cy={hoveredProfit.y} r="5" fill="#34d399" stroke="white" strokeWidth="2" />}
                </>
              )}
            </svg>

            {/* Floating tooltip */}
            {hoveredIndex !== null && hovered && hoveredRevenue && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.12 }}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${((hoveredRevenue.x / CHART_WIDTH) * 100)}%`,
                  top: '0px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="rounded-xl bg-gray-900 px-4 py-3 shadow-2xl border border-gray-800 min-w-[180px]">
                  <p className="text-[12px] font-bold text-white mb-2 pb-2 border-b border-gray-700">
                    {hovered.month} 2025
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
                        <span className="text-[11px] text-gray-300">Revenue</span>
                      </div>
                      <span className="text-[12px] font-semibold text-white tabular-nums">
                        {formatCurrency(hovered.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="text-[11px] text-gray-300">Expenses</span>
                      </div>
                      <span className="text-[12px] font-semibold text-white tabular-nums">
                        {formatCurrency(hovered.expenses)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                        <span className="text-[11px] text-gray-300">Profit</span>
                      </div>
                      <span className="text-[12px] font-bold text-green-400 tabular-nums">
                        {formatCurrency(hovered.revenue - hovered.expenses)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="h-[3px] w-5 rounded-full bg-brand-500" />
              <span className="text-[12px] text-gray-500 font-medium">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[3px] w-5 rounded-full bg-red-400 border-dashed" style={{ borderTop: '2px dashed #f87171', height: 0, background: 'none' }} />
              <span className="text-[12px] text-gray-500 font-medium">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[3px] w-5 rounded-full bg-green-400" />
              <span className="text-[12px] text-gray-500 font-medium">Profit</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
