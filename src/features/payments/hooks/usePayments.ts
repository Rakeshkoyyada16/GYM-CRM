import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  Payment, PaymentStats, PaymentFilters, Invoice,
  RevenueByMonth, PaymentMethodBreakdown, PaymentTypeBreakdown, RenewalRecord,
} from '../types/payment.types'
import {
  fetchPayments, fetchPaymentStats, fetchRevenueByMonth,
  fetchPaymentMethodBreakdown, fetchPaymentTypeBreakdown,
  fetchRenewals, fetchInvoice, exportPaymentsCSV, downloadInvoicePDF,
} from '../utils/mockData'

// ============================================
// Payments List Hook
// ============================================

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<PaymentFilters>({
    search: '', status: 'all', method: 'all', type: 'all', dateFrom: '', dateTo: '',
  })
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setIsLoading(true)
    const data = await fetchPayments()
    setPayments(data)
    setIsLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let result = [...payments]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.memberName.toLowerCase().includes(q) ||
        p.memberEmail.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    if (filters.status !== 'all') result = result.filter(p => p.status === filters.status)
    if (filters.method !== 'all') result = result.filter(p => p.method === filters.method)
    if (filters.type !== 'all') result = result.filter(p => p.type === filters.type)
    if (filters.dateFrom) result = result.filter(p => p.dueDate >= filters.dateFrom)
    if (filters.dateTo) result = result.filter(p => p.dueDate <= filters.dateTo)

    result.sort((a, b) => {
      let aVal: any, bVal: any
      switch (sortField) {
        case 'memberName': aVal = a.memberName; bVal = b.memberName; break
        case 'amount': aVal = a.amount; bVal = b.amount; break
        case 'status': aVal = a.status; bVal = b.status; break
        default: aVal = a.createdAt; bVal = b.createdAt
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [payments, filters, sortField, sortDir])

  const handleSort = useCallback((field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }, [sortField])

  const exportAll = useCallback(() => {
    exportPaymentsCSV(filtered)
  }, [filtered])

  return {
    payments: filtered, allPayments: payments, isLoading, filters, setFilters,
    sortField, sortDir, handleSort, exportAll, refresh: load,
  }
}

// ============================================
// Payment Stats Hook
// ============================================

export function usePaymentStats() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const data = await fetchPaymentStats()
      if (!cancelled) { setStats(data); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { stats, isLoading }
}

// ============================================
// Revenue Chart Hook
// ============================================

export function useRevenueChart() {
  const [data, setData] = useState<RevenueByMonth[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const result = await fetchRevenueByMonth()
      if (!cancelled) { setData(result); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, isLoading }
}

// ============================================
// Payment Method Breakdown Hook
// ============================================

export function usePaymentMethodBreakdown() {
  const [data, setData] = useState<PaymentMethodBreakdown[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const result = await fetchPaymentMethodBreakdown()
      if (!cancelled) { setData(result); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, isLoading }
}

// ============================================
// Payment Type Breakdown Hook
// ============================================

export function usePaymentTypeBreakdown() {
  const [data, setData] = useState<PaymentTypeBreakdown[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const result = await fetchPaymentTypeBreakdown()
      if (!cancelled) { setData(result); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, isLoading }
}

// ============================================
// Renewals Hook
// ============================================

export function useRenewals() {
  const [renewals, setRenewals] = useState<RenewalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const data = await fetchRenewals()
      if (!cancelled) { setRenewals(data); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { renewals, isLoading }
}

// ============================================
// Invoice Hook
// ============================================

export function useInvoice() {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadInvoice = useCallback(async (paymentId: string) => {
    setIsLoading(true)
    const data = await fetchInvoice(paymentId)
    setInvoice(data)
    setIsLoading(false)
  }, [])

  const downloadPDF = useCallback(() => {
    if (invoice) downloadInvoicePDF(invoice)
  }, [invoice])

  return { invoice, isLoading, loadInvoice, downloadPDF, clearInvoice: () => setInvoice(null) }
}
