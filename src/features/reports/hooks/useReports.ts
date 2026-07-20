import { useState, useEffect, useCallback } from 'react'
import type {
  DateRange, ReportPeriod,
  RevenueData, RevenueSummary, AttendanceData, AttendanceSummary,
  AttendanceByDay, AttendanceByHour, MembershipData, MembershipSummary,
  LeadData, LeadSummary, TrainerData, TrainerSummary,
  PaymentData, PaymentSummary,
} from '../types/report.types'
import {
  fetchRevenueData, fetchRevenueSummary, fetchAttendanceData,
  fetchAttendanceSummary, fetchAttendanceByDay, fetchAttendanceByHour,
  fetchMembershipData, fetchMembershipSummary, fetchLeadData,
  fetchLeadSummary, fetchTrainerData, fetchTrainerSummary,
  fetchPaymentData, fetchPaymentSummary,
} from '../utils/mockData'

// ============================================
// Date Range Hook
// ============================================

export function useDateRange() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    period: '30d',
  })

  const setPeriod = useCallback((period: ReportPeriod) => {
    const now = new Date()
    let from: Date
    switch (period) {
      case '7d': from = new Date(now.getTime() - 7 * 86400000); break
      case '30d': from = new Date(now.getTime() - 30 * 86400000); break
      case '90d': from = new Date(now.getTime() - 90 * 86400000); break
      case '12m': from = new Date(now.getTime() - 365 * 86400000); break
      default: from = new Date(now.getTime() - 30 * 86400000)
    }
    setDateRange({
      from: from.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
      period,
    })
  }, [])

  return { dateRange, setPeriod, setDateRange }
}

// ============================================
// Generic Data Hook
// ============================================

function useReportData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const result = await fetcher()
      if (!cancelled) { setData(result); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, isLoading }
}

// ============================================
// Revenue Hooks
// ============================================

export function useRevenueReport() {
  return {
    chart: useReportData(fetchRevenueData),
    summary: useReportData(fetchRevenueSummary),
  }
}

// ============================================
// Attendance Hooks
// ============================================

export function useAttendanceReport() {
  return {
    chart: useReportData(fetchAttendanceData),
    summary: useReportData(fetchAttendanceSummary),
    byDay: useReportData(fetchAttendanceByDay),
    byHour: useReportData(fetchAttendanceByHour),
  }
}

// ============================================
// Membership Hooks
// ============================================

export function useMembershipReport() {
  return {
    chart: useReportData(fetchMembershipData),
    summary: useReportData(fetchMembershipSummary),
  }
}

// ============================================
// Lead Hooks
// ============================================

export function useLeadReport() {
  return {
    chart: useReportData(fetchLeadData),
    summary: useReportData(fetchLeadSummary),
  }
}

// ============================================
// Trainer Hooks
// ============================================

export function useTrainerReport() {
  return {
    data: useReportData(fetchTrainerData),
    summary: useReportData(fetchTrainerSummary),
  }
}

// ============================================
// Payment Hooks
// ============================================

export function usePaymentReport() {
  return {
    chart: useReportData(fetchPaymentData),
    summary: useReportData(fetchPaymentSummary),
  }
}
