import { useCallback, useEffect, useMemo, useState } from 'react'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useClickOutside } from '@/hooks/useClickOutside'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Keep the dashboard's initial state aligned with the date shown in the design.
const INITIAL_DATE = new Date(2026, 6, 20)

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatMonth(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function getCalendarDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const firstVisibleDate = new Date(
    month.getFullYear(),
    month.getMonth(),
    1 - firstDay.getDay(),
  )

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisibleDate)
    date.setDate(firstVisibleDate.getDate() + index)
    return date
  })
}

export function DashboardDatePicker() {
  const [selectedDate, setSelectedDate] = useState(() => new Date(INITIAL_DATE))
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(INITIAL_DATE.getFullYear(), INITIAL_DATE.getMonth(), 1),
  )
  const [isOpen, setIsOpen] = useState(false)
  const today = useMemo(() => new Date(), [])

  const closePicker = useCallback(() => setIsOpen(false), [])
  const pickerRef = useClickOutside<HTMLDivElement>(closePicker)
  const calendarDays = getCalendarDays(visibleMonth)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePicker()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closePicker, isOpen])

  const moveMonth = (offset: number) => {
    setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  const selectDate = (date: Date) => {
    setSelectedDate(date)
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    setIsOpen(false)
  }

  const selectToday = () => {
    selectDate(today)
  }

  return (
    <div ref={pickerRef} className="relative w-full sm:w-auto">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-center sm:w-auto sm:justify-start"
        onClick={() => setIsOpen(open => !open)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Choose date, ${formatDate(selectedDate)}`}
      >
        <Calendar className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
        <span>{formatDate(selectedDate)}</span>
        <ChevronDown
          className={cn('ml-1 h-3.5 w-3.5 text-gray-400 transition-transform', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </Button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className="absolute right-0 z-50 mt-2 w-[19rem] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-gray-900">{formatMonth(visibleMonth)}</h2>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7"
                onClick={() => moveMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7"
                onClick={() => moveMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1" aria-label={formatMonth(visibleMonth)}>
            {DAY_LABELS.map(day => (
              <span key={day} className="py-1 text-center text-[10px] font-medium text-gray-400">
                {day}
              </span>
            ))}

            {calendarDays.map(date => {
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
              const isSelected = isSameDay(date, selectedDate)
              const isToday = isSameDay(date, today)

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => selectDate(date)}
                  aria-label={formatDate(date)}
                  aria-pressed={isSelected}
                  aria-current={isToday ? 'date' : undefined}
                  className={cn(
                    'flex h-8 w-full items-center justify-center rounded-lg text-[12px] font-medium transition-colors',
                    'hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    !isCurrentMonth && 'text-gray-300 hover:bg-gray-50 hover:text-gray-500',
                    isCurrentMonth && !isSelected && 'text-gray-700',
                    isSelected && 'bg-gray-900 text-white hover:bg-gray-800 hover:text-white',
                    isToday && !isSelected && 'ring-1 ring-brand-500',
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-[11px] text-gray-500">Selected: {formatDate(selectedDate)}</span>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={selectToday}>
              Today
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
