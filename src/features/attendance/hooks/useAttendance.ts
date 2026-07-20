import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  AttendanceRecord, AttendanceStats, AttendanceFilters,
  CalendarDay, MonthlyStats, CheckInPayload,
} from '../types/attendance.types'
import {
  fetchTodayAttendance, fetchAttendanceHistory, fetchAttendanceStats,
  fetchMonthlyStats, fetchCalendarDays, checkInMember, checkOutMember,
} from '../utils/mockData'

// ============================================
// Today's Attendance Hook
// ============================================

export function useTodayAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    const data = await fetchTodayAttendance()
    setRecords(data)
    setIsLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const checkIn = useCallback(async (payload: CheckInPayload) => {
    const record = await checkInMember(payload)
    setRecords(prev => [record, ...prev])
    return record
  }, [])

  const checkOut = useCallback(async (recordId: string) => {
    const updated = await checkOutMember(recordId)
    setRecords(prev => prev.map(r => r.id === recordId ? updated : r))
    return updated
  }, [])

  return { records, isLoading, checkIn, checkOut, refresh: load }
}

// ============================================
// Attendance History Hook
// ============================================

export function useAttendanceHistory() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<AttendanceFilters>({
    search: '', status: 'all', dateFrom: '', dateTo: '', classFilter: 'all',
  })

  const load = useCallback(async () => {
    setIsLoading(true)
    const data = await fetchAttendanceHistory()
    setRecords(data)
    setIsLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let result = [...records]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(r =>
        r.memberName.toLowerCase().includes(q) ||
        r.memberEmail.toLowerCase().includes(q) ||
        (r.className && r.className.toLowerCase().includes(q))
      )
    }

    if (filters.status !== 'all') {
      result = result.filter(r => r.status === filters.status)
    }

    if (filters.classFilter !== 'all') {
      result = result.filter(r => r.classId === filters.classFilter)
    }

    if (filters.dateFrom) {
      result = result.filter(r => r.date >= filters.dateFrom)
    }

    if (filters.dateTo) {
      result = result.filter(r => r.date <= filters.dateTo)
    }

    return result
  }, [records, filters])

  return { records: filtered, allRecords: records, isLoading, filters, setFilters, refresh: load }
}

// ============================================
// Attendance Stats Hook
// ============================================

export function useAttendanceStats() {
  const [stats, setStats] = useState<AttendanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const data = await fetchAttendanceStats()
      if (!cancelled) { setStats(data); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { stats, isLoading }
}

// ============================================
// Monthly Stats Hook
// ============================================

export function useMonthlyStats() {
  const [stats, setStats] = useState<MonthlyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const data = await fetchMonthlyStats()
      if (!cancelled) { setStats(data); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { stats, isLoading }
}

// ============================================
// Calendar Hook
// ============================================

export function useAttendanceCalendar() {
  const [days, setDays] = useState<CalendarDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const load = useCallback(async () => {
    setIsLoading(true)
    const data = await fetchCalendarDays(currentYear, currentMonth)
    setDays(data)
    setIsLoading(false)
  }, [currentYear, currentMonth])

  useEffect(() => { load() }, [load])

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }, [currentMonth])

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }, [currentMonth])

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date().getMonth())
    setCurrentYear(new Date().getFullYear())
  }, [])

  return {
    days, isLoading, currentMonth, currentYear,
    goToPrevMonth, goToNextMonth, goToToday,
  }
}
