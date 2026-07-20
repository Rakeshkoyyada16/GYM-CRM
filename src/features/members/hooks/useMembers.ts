import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Member, MemberFilters, SortConfig, PaginationConfig, AttendanceRecord, PaymentRecord } from '../types/member.types'
import {
  fetchMembers, fetchMemberById, createMember, updateMember,
  deleteMember, renewMembership, getMemberAttendance, getMemberPayments,
} from '../utils/mockData'

// ============================================
// Members List Hook
// ============================================

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MemberFilters>({
    search: '', status: 'all', membershipType: 'all', gender: 'all', dateRange: 'all',
  })
  const [sort, setSort] = useState<SortConfig>({ field: 'createdAt', direction: 'desc' })
  const [pagination, setPagination] = useState<PaginationConfig>({ page: 1, pageSize: 10, total: 0 })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const loadMembers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchMembers()
      setMembers(data)
      setPagination(prev => ({ ...prev, total: data.length }))
    } catch (err) {
      setError('Failed to load members')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadMembers() }, [loadMembers])

  // ── Filtering ──
  const filteredMembers = useMemo(() => {
    let result = [...members]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(m =>
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.phone.includes(q)
      )
    }

    if (filters.status !== 'all') {
      result = result.filter(m => m.status === filters.status)
    }

    if (filters.membershipType !== 'all') {
      result = result.filter(m => m.membership.type === filters.membershipType)
    }

    if (filters.gender !== 'all') {
      result = result.filter(m => m.gender === filters.gender)
    }

    return result
  }, [members, filters])

  // ── Sorting ──
  const sortedMembers = useMemo(() => {
    const sorted = [...filteredMembers]
    sorted.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sort.field) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase()
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case 'membershipType':
          aVal = a.membership.type
          bVal = b.membership.type
          break
        case 'amount':
          aVal = a.membership.price
          bVal = b.membership.price
          break
        default:
          aVal = (a as unknown as Record<string, unknown>)[sort.field] as string ?? ''
          bVal = (b as unknown as Record<string, unknown>)[sort.field] as string ?? ''
      }

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredMembers, sort])

  // ── Pagination ──
  const paginatedMembers = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    return sortedMembers.slice(start, start + pagination.pageSize)
  }, [sortedMembers, pagination.page, pagination.pageSize])

  const totalPages = Math.ceil(sortedMembers.length / pagination.pageSize)

  // ── Selection ──
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedMembers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedMembers.map(m => m.id)))
    }
  }, [selectedIds.size, paginatedMembers])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  // ── CRUD ──
  const addMember = useCallback(async (data: Partial<Member>) => {
    const newMember = await createMember(data)
    setMembers(prev => [newMember, ...prev])
    setPagination(prev => ({ ...prev, total: prev.total + 1 }))
    return newMember
  }, [])

  const editMember = useCallback(async (id: string, data: Partial<Member>) => {
    const updated = await updateMember(id, data)
    setMembers(prev => prev.map(m => m.id === id ? updated : m))
    return updated
  }, [])

  const removeMember = useCallback(async (id: string) => {
    await deleteMember(id)
    setMembers(prev => prev.filter(m => m.id !== id))
    setPagination(prev => ({ ...prev, total: prev.total - 1 }))
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next })
  }, [])

  const bulkDelete = useCallback(async () => {
    for (const id of selectedIds) {
      await deleteMember(id)
    }
    setMembers(prev => prev.filter(m => !selectedIds.has(m.id)))
    setPagination(prev => ({ ...prev, total: prev.total - selectedIds.size }))
    setSelectedIds(new Set())
  }, [selectedIds])

  return {
    members: paginatedMembers,
    allFilteredMembers: sortedMembers,
    isLoading, error,
    filters, setFilters,
    sort, setSort,
    pagination: { ...pagination, total: sortedMembers.length, totalPages },
    setPagination,
    selectedIds, toggleSelect, toggleSelectAll, clearSelection,
    addMember, editMember, removeMember, bulkDelete,
    refresh: loadMembers,
  }
}

// ============================================
// Single Member Hook
// ============================================

export function useMember(id: string | undefined) {
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setIsLoading(false); return }
    let cancelled = false
    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchMemberById(id)
        if (!cancelled) {
          if (data) setMember(data)
          else setError('Member not found')
        }
      } catch {
        if (!cancelled) setError('Failed to load member')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  return { member, isLoading, error, setMember }
}

// ============================================
// Member Attendance Hook
// ============================================

export function useMemberAttendance(memberId: string | undefined) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!memberId) { setIsLoading(false); return }
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 250))
      if (!cancelled) {
        setRecords(getMemberAttendance(memberId))
        setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [memberId])

  return { records, isLoading }
}

// ============================================
// Member Payments Hook
// ============================================

export function useMemberPayments(memberId: string | undefined) {
  const [records, setRecords] = useState<PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!memberId) { setIsLoading(false); return }
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      await new Promise(r => setTimeout(r, 280))
      if (!cancelled) {
        setRecords(getMemberPayments(memberId))
        setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [memberId])

  return { records, isLoading }
}

// ============================================
// Renew Membership Hook
// ============================================

export function useRenewMembership() {
  const [isRenewing, setIsRenewing] = useState(false)

  const renew = useCallback(async (memberId: string) => {
    setIsRenewing(true)
    try {
      const updated = await renewMembership(memberId)
      return updated
    } finally {
      setIsRenewing(false)
    }
  }, [])

  return { renew, isRenewing }
}
