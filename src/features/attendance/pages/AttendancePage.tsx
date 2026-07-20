import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ClipboardCheck } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'

import { AttendanceStats } from '../components/AttendanceStats'
import { CheckInPanel } from '../components/CheckInPanel'
import { AttendanceTable } from '../components/AttendanceTable'
import { AttendanceFilters } from '../components/AttendanceFilters'
import { AttendanceCalendar } from '../components/AttendanceCalendar'
import { MonthlySummary } from '../components/MonthlySummary'
import { LiveFeed } from '../components/LiveFeed'

import {
  useTodayAttendance, useAttendanceHistory, useAttendanceStats,
  useMonthlyStats, useAttendanceCalendar,
} from '../hooks/useAttendance'
import { exportAttendanceCSV } from '../utils/mockData'
import type { CheckInPayload } from '../types/attendance.types'

export function AttendancePage() {
  const today = useTodayAttendance()
  const history = useAttendanceHistory()
  const stats = useAttendanceStats()
  const monthly = useMonthlyStats()
  const calendar = useAttendanceCalendar()

  const [activeTab, setActiveTab] = useState('today')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const handleCheckIn = useCallback(async (payload: CheckInPayload) => {
    setIsCheckingIn(true)
    try {
      await today.checkIn(payload)
      toast.success('Member checked in successfully')
      stats.stats && (stats.stats.totalCheckedIn += 1)
    } catch {
      toast.error('Failed to check in')
    } finally {
      setIsCheckingIn(false)
    }
  }, [today, stats])

  const handleCheckOut = useCallback(async (recordId: string) => {
    try {
      await today.checkOut(recordId)
      toast.success('Member checked out')
    } catch {
      toast.error('Failed to check out')
    }
  }, [today])

  const handleExport = useCallback(() => {
    const records = activeTab === 'today' ? today.records : history.allRecords
    exportAttendanceCSV(records)
    toast.success(`Exported ${records.length} records`)
  }, [activeTab, today.records, history.allRecords])

  const handleCalendarDateSelect = useCallback((date: string) => {
    setSelectedDate(date)
    setActiveTab('history')
    history.setFilters(prev => ({ ...prev, dateFrom: date, dateTo: date }))
  }, [history])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Attendance</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Track member check-ins, view history, and analyze attendance patterns.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <AttendanceStats stats={stats.stats} isLoading={stats.isLoading} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">Today's Attendance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* ── Today Tab ── */}
        <TabsContent value="today">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            {/* Check-in + Live Feed */}
            <div className="lg:col-span-4 space-y-4">
              <CheckInPanel onCheckIn={handleCheckIn} isCheckingIn={isCheckingIn} />
              <LiveFeed records={today.records} isLoading={today.isLoading} />
            </div>

            {/* Today's Table */}
            <div className="lg:col-span-8">
              <Card>
                <CardContent className="p-0">
                  {today.isLoading ? (
                    <div className="p-5 space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
                      ))}
                    </div>
                  ) : today.records.length === 0 ? (
                    <EmptyState
                      icon={ClipboardCheck}
                      title="No check-ins yet today"
                      description="Members will appear here as they check in."
                    />
                  ) : (
                    <AttendanceTable
                      records={today.records}
                      isLoading={false}
                      onCheckOut={handleCheckOut}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── History Tab ── */}
        <TabsContent value="history">
          <div className="space-y-4 mt-4">
            <AttendanceFilters
              filters={history.filters}
              onFiltersChange={history.setFilters}
              onExport={handleExport}
              resultCount={history.records.length}
            />

            {history.records.length === 0 && !history.isLoading ? (
              <Card><CardContent className="p-0">
                <EmptyState
                  icon={ClipboardCheck}
                  title="No records match your filters"
                  description="Try adjusting your search or date range."
                />
              </CardContent></Card>
            ) : (
              <AttendanceTable
                records={history.records}
                isLoading={history.isLoading}
                showDate={true}
              />
            )}
          </div>
        </TabsContent>

        {/* ── Calendar Tab ── */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <div className="lg:col-span-8">
              <AttendanceCalendar
                days={calendar.days}
                isLoading={calendar.isLoading}
                currentMonth={calendar.currentMonth}
                currentYear={calendar.currentYear}
                onPrevMonth={calendar.goToPrevMonth}
                onNextMonth={calendar.goToNextMonth}
                onToday={calendar.goToToday}
                selectedDate={selectedDate}
                onSelectDate={handleCalendarDateSelect}
              />
            </div>
            <div className="lg:col-span-4">
              <MonthlySummary stats={monthly.stats} isLoading={monthly.isLoading} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
