import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CalendarDay } from '../types/attendance.types'
import { getMonthName, getHeatmapColor } from '../utils/attendanceUtils'

interface AttendanceCalendarProps {
  days: CalendarDay[]
  isLoading: boolean
  currentMonth: number
  currentYear: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function AttendanceCalendar({
  days, isLoading, currentMonth, currentYear,
  onPrevMonth, onNextMonth, onToday, selectedDate, onSelectDate,
}: AttendanceCalendarProps) {
  const maxTotal = Math.max(...days.map(d => d.total), 1)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle className="flex items-center gap-2 text-[13px]">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            Attendance Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2" onClick={onToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] font-medium text-gray-500 mb-3">
            {getMonthName(currentMonth)} {currentYear}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
          ) : (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAY_LABELS.map(d => (
                  <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  const isSelected = day.date === selectedDate
                  const colorClass = day.isCurrentMonth ? getHeatmapColor(day.total, maxTotal) : 'bg-transparent'
                  const textColor = day.isCurrentMonth
                    ? (day.total > maxTotal * 0.75 ? 'text-white' : 'text-gray-900')
                    : 'text-gray-300'

                  return (
                    <motion.button
                      key={day.date}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.005 }}
                      onClick={() => day.isCurrentMonth && onSelectDate(day.date)}
                      className={cn(
                        'relative flex flex-col items-center justify-center h-12 rounded-lg transition-all duration-150 cursor-pointer',
                        colorClass,
                        day.isToday && 'ring-2 ring-brand-500 ring-offset-1',
                        isSelected && 'ring-2 ring-gray-900 ring-offset-1',
                        !day.isCurrentMonth && 'cursor-default',
                        day.isCurrentMonth && 'hover:ring-1 hover:ring-gray-300'
                      )}
                    >
                      <span className={cn('text-[12px] font-semibold leading-none', textColor)}>
                        {day.dayOfMonth}
                      </span>
                      {day.isCurrentMonth && day.total > 0 && (
                        <span className={cn('text-[8px] mt-0.5 tabular-nums', textColor, day.total > maxTotal * 0.75 ? 'opacity-80' : 'opacity-60')}>
                          {day.total}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">Less</span>
                <div className="flex gap-0.5">
                  {['bg-gray-50', 'bg-brand-50', 'bg-brand-100', 'bg-brand-200', 'bg-brand-400'].map((c, i) => (
                    <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400">More</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
