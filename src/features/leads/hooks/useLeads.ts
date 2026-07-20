import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Lead, LeadFilters, LeadStats, LeadNote, LeadFormData } from '../types/lead.types'
import {
  fetchLeads, fetchLeadStats, fetchLeadNotes, addLeadNote,
  createLead, updateLead, deleteLead, convertLeadToMember,
} from '../utils/mockData'

// ============================================
// Leads List Hook
// ============================================

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LeadFilters>({
    search: '', status: 'all', source: 'all', priority: 'all', assignedTo: 'all', dateRange: 'all',
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const loadLeads = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchLeads()
      setLeads(data)
    } catch {
      setError('Failed to load leads')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadLeads() }, [loadLeads])

  // ── Filtering ──
  const filteredLeads = useMemo(() => {
    let result = [...leads]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(l =>
        l.firstName.toLowerCase().includes(q) ||
        l.lastName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.leadId.toLowerCase().includes(q)
      )
    }

    if (filters.status !== 'all') result = result.filter(l => l.status === filters.status)
    if (filters.source !== 'all') result = result.filter(l => l.source === filters.source)
    if (filters.priority !== 'all') result = result.filter(l => l.priority === filters.priority)
    if (filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'unassigned') result = result.filter(l => !l.assignedTo)
      else result = result.filter(l => l.assignedTo?.id === filters.assignedTo)
    }

    return result
  }, [leads, filters])

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
    if (selectedIds.size === filteredLeads.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filteredLeads.map(l => l.id)))
  }, [selectedIds.size, filteredLeads])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  // ── CRUD ──
  const addLead = useCallback(async (data: Partial<Lead>) => {
    const newLead = await createLead(data)
    setLeads(prev => [newLead, ...prev])
    return newLead
  }, [])

  const editLead = useCallback(async (id: string, data: Partial<Lead>) => {
    const updated = await updateLead(id, data)
    setLeads(prev => prev.map(l => l.id === id ? updated : l))
    return updated
  }, [])

  const removeLead = useCallback(async (id: string) => {
    await deleteLead(id)
    setLeads(prev => prev.filter(l => l.id !== id))
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next })
  }, [])

  const bulkDelete = useCallback(async () => {
    for (const id of selectedIds) await deleteLead(id)
    setLeads(prev => prev.filter(l => !selectedIds.has(l.id)))
    setSelectedIds(new Set())
  }, [selectedIds])

  const bulkUpdateStatus = useCallback(async (status: Lead['status']) => {
    for (const id of selectedIds) await updateLead(id, { status })
    setLeads(prev => prev.map(l => selectedIds.has(l.id) ? { ...l, status } : l))
    setSelectedIds(new Set())
  }, [selectedIds])

  const convertLead = useCallback(async (id: string) => {
    const updated = await convertLeadToMember(id)
    setLeads(prev => prev.map(l => l.id === id ? updated : l))
    return updated
  }, [])

  return {
    leads: filteredLeads,
    allLeads: leads,
    isLoading, error, filters, setFilters,
    selectedIds, toggleSelect, toggleSelectAll, clearSelection,
    addLead, editLead, removeLead, bulkDelete, bulkUpdateStatus,
    convertLead, refresh: loadLeads,
  }
}

// ============================================
// Lead Stats Hook
// ============================================

export function useLeadStats() {
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const data = await fetchLeadStats()
      if (!cancelled) { setStats(data); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { stats, isLoading }
}

// ============================================
// Lead Notes Hook
// ============================================

export function useLeadNotes(leadId: string | undefined) {
  const [notes, setNotes] = useState<LeadNote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadNotes = useCallback(async () => {
    if (!leadId) { setIsLoading(false); return }
    setIsLoading(true)
    const data = await fetchLeadNotes(leadId)
    setNotes(data)
    setIsLoading(false)
  }, [leadId])

  useEffect(() => { loadNotes() }, [loadNotes])

  const addNote = useCallback(async (content: string) => {
    if (!leadId) return
    const note = await addLeadNote(leadId, content, 'Admin Kumar')
    setNotes(prev => [...prev, note])
    return note
  }, [leadId])

  return { notes, isLoading, addNote }
}
