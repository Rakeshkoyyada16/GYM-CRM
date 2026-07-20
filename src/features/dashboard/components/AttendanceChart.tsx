import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { AttendanceChartPoint } from '../types/dashboard.types'

interface AttendanceChartProps {
  data: AttendanceChartPoint[] | null
  isLoading: boolean
}

const CHART_WIDTH = 800
const CHART_HEIGHT = 300
const PADDING = { top: 24, right: 24, bottom: 48, left: 56 }
const INNER_W = CHART_WIDTH - PADDING.left - PADDING.right
const INNER_H = CHART_HEIGHT - PADDING.top - PADDING.bottom
const BAR_GROUP_GAP = 0.3 // 30% of group width as gap
const BAR_GAP = 3 // gap between paired bars

const COLORS = {
  checkIn: { fill: '#4361ee', hover: '#3b52d4', light: '#c7d2fe' },
  checkOut: { fill: '#10b981', hover: '#059669', light: '#a7f3d0' },
}

export function AttendanceChart({ data, isLoading }: AttendanceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null)

  const chartData = useMemo(() => {
    if (!data) return null
    const maxVal = Math.max(...data.flatMap(d => [d.checkIns, d.checkOuts]))
    const roundedMax = Math.ceil(maxVal / 50) * 50
    const yTicks = 5
    const yTickValues = Array.from({ length: yTicks }, (_, i) =>
      Math.round((roundedMax / (yTicks - 1)) * i)
    )

    const groupWidth = INNER_W / data.length
    const barWidth = (groupWidth * (1 - BAR_GROUP_GAP) - BAR_GAP) / 2

    const bars = data.map((d, i) => {
      const groupX = PADDING.left + i * groupWidth + (groupWidth * BAR_GROUP_GAP) / 2
      const checkInHeight = (d.checkIns / roundedMax) * INNER_H
      const checkOutHeight = (d.checkOuts / roundedMax) * INNER_H
      return {
        checkIn: {
          x: groupX,
          y: PADDING.top + INNER_H - checkInHeight,
          width: barWidth,
          height: checkInHeight,
        },
        checkOut: {
          x: groupX + barWidth + BAR_GAP,
          y: PADDING.top + INNER_H - checkOutHeight,
          width: barWidth,
          height: checkOutHeight,
        },
        labelX: groupX + barWidth + BAR_GAP / 2,
      }
    })

    return { bars, yTickValues, maxVal: roundedMax }
  }, [data])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef || !data) return
    const rect = svgRef.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const scaleX = CHART_WIDTH / rect.width
    const scaledX = mouseX * scaleX
    const groupWidth = INNER_W / data.length
    const index = Math.floor((scaledX - PADDING.left) / groupWidth)
    if (index >= 0 && index < data.length) {
      setHoveredIndex(index)
    } else {
      setHoveredIndex(null)
    }
  }, [svgRef, data])

  const totalCheckIns = data?.reduce((s, d) => s + d.checkIns, 0) ?? 0
  const totalCheckOuts = data?.reduce((s, d) => s + d.checkOuts, 0) ?? 0

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
  const hoveredBar = hoveredIndex !== null ? chartData.bars[hoveredIndex] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <div>
            <CardTitle>Weekly Attendance</CardTitle>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Total: {totalCheckIns} check-ins · {totalCheckOuts} check-outs
            </p>
          </div>
          <Badge variant="gray">This week</Badge>
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
              <defs>
                <linearGradient id="checkInGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.checkIn.fill} stopOpacity="1" />
                  <stop offset="100%" stopColor={COLORS.checkIn.fill} stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="checkOutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.checkOut.fill} stopOpacity="1" />
                  <stop offset="100%" stopColor={COLORS.checkOut.fill} stopOpacity="0.7" />
                </linearGradient>
                <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
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
                    <text
                      x={PADDING.left - 10} y={y + 4}
                      textAnchor="end" fontSize="11" fill="#9ca3af"
                      fontFamily="Inter, system-ui"
                    >
                      {val}
                    </text>
                  </g>
                )
              })}

              {/* Baseline */}
              <line
                x1={PADDING.left} y1={PADDING.top + INNER_H}
                x2={CHART_WIDTH - PADDING.right} y2={PADDING.top + INNER_H}
                stroke="#e5e7eb" strokeWidth="1"
              />

              {/* Bar groups */}
              {chartData.bars.map((bar, i) => {
                const isHovered = hoveredIndex === i
                return (
                  <g key={i}>
                    {/* Check-in bar */}
                    <motion.rect
                      initial={{ height: 0, y: PADDING.top + INNER_H }}
                      animate={{
                        height: bar.checkIn.height,
                        y: bar.checkIn.y,
                      }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      x={bar.checkIn.x}
                      width={bar.checkIn.width}
                      rx={4}
                      fill={isHovered ? COLORS.checkIn.hover : COLORS.checkIn.fill}
                      opacity={isHovered ? 1 : hoveredIndex !== null ? 0.5 : 0.9}
                      filter={isHovered ? 'url(#barShadow)' : undefined}
                      className="transition-opacity duration-200"
                    />
                    {/* Check-out bar */}
                    <motion.rect
                      initial={{ height: 0, y: PADDING.top + INNER_H }}
                      animate={{
                        height: bar.checkOut.height,
                        y: bar.checkOut.y,
                      }}
                      transition={{ duration: 0.6, delay: 0.35 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      x={bar.checkOut.x}
                      width={bar.checkOut.width}
                      rx={4}
                      fill={isHovered ? COLORS.checkOut.hover : COLORS.checkOut.fill}
                      opacity={isHovered ? 1 : hoveredIndex !== null ? 0.5 : 0.9}
                      filter={isHovered ? 'url(#barShadow)' : undefined}
                      className="transition-opacity duration-200"
                    />

                    {/* Value labels on hover */}
                    {isHovered && (
                      <>
                        <motion.text
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          x={bar.checkIn.x + bar.checkIn.width / 2}
                          y={bar.checkIn.y - 10}
                          textAnchor="middle" fontSize="11" fontWeight="700"
                          fill={COLORS.checkIn.fill} fontFamily="Inter, system-ui"
                        >
                          {data[i].checkIns}
                        </motion.text>
                        <motion.text
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          x={bar.checkOut.x + bar.checkOut.width / 2}
                          y={bar.checkOut.y - 10}
                          textAnchor="middle" fontSize="11" fontWeight="700"
                          fill={COLORS.checkOut.fill} fontFamily="Inter, system-ui"
                        >
                          {data[i].checkOuts}
                        </motion.text>
                      </>
                    )}
                  </g>
                )
              })}

              {/* X-axis labels */}
              {data.map((d, i) => {
                const isToday = i === 4 // Friday as "today"
                return (
                  <text
                    key={d.day}
                    x={chartData.bars[i].labelX}
                    y={CHART_HEIGHT - 12}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight={isToday || hoveredIndex === i ? '600' : '400'}
                    fill={isToday ? '#4361ee' : hoveredIndex === i ? '#1f2937' : '#9ca3af'}
                    fontFamily="Inter, system-ui"
                  >
                    {d.day}
                    {isToday && (
                      <tspan x={chartData.bars[i].labelX} dy="14" fontSize="9" fill="#4361ee" fontWeight="500">
                        Today
                      </tspan>
                    )}
                  </text>
                )
              })}
            </svg>

            {/* Floating tooltip */}
            {hoveredIndex !== null && hovered && hoveredBar && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.12 }}
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${((hoveredBar.labelX / CHART_WIDTH) * 100)}%`,
                  top: '4px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="rounded-xl bg-gray-900 px-4 py-3 shadow-2xl border border-gray-800 min-w-[190px]">
                  <p className="text-[12px] font-bold text-white mb-2 pb-2 border-b border-gray-700">
                    {hovered.day}{hoveredIndex === 4 ? ' (Today)' : ''}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.checkIn.fill }} />
                        <span className="text-[11px] text-gray-300">Check-ins</span>
                      </div>
                      <span className="text-[12px] font-semibold text-white tabular-nums">
                        {hovered.checkIns}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.checkOut.fill }} />
                        <span className="text-[11px] text-gray-300">Check-outs</span>
                      </div>
                      <span className="text-[12px] font-semibold text-white tabular-nums">
                        {hovered.checkOuts}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="text-[11px] text-gray-300">Still inside</span>
                      </div>
                      <span className="text-[12px] font-bold text-amber-400 tabular-nums">
                        {hovered.checkIns - hovered.checkOuts}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
                        <span className="text-[11px] text-gray-300">New members</span>
                      </div>
                      <span className="text-[12px] font-semibold text-purple-400 tabular-nums">
                        +{hovered.newMembers}
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
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.checkIn.fill }} />
              <span className="text-[12px] text-gray-500 font-medium">Check-ins</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS.checkOut.fill }} />
              <span className="text-[12px] text-gray-500 font-medium">Check-outs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-amber-400" />
              <span className="text-[12px] text-gray-500 font-medium">Still inside</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-purple-400" />
              <span className="text-[12px] text-gray-500 font-medium">New members</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
