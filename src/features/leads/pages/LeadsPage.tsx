import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'

import { LeadStatsBar } from '../components/LeadStatsBar'
import { LeadPipeline } from '../components/LeadPipeline'
import { LeadTable } from '../components/LeadTable'
import { LeadFilters } from '../components/LeadFilters'
import { LeadForm } from '../components/LeadForm'
import { LeadDetailPanel } from '../components/LeadDetailPanel'
import { DeleteDialog } from '@/components/feedback/DeleteDialog'
import { BulkActions } from '../components/BulkActions'

import { useLeads, useLeadStats } from '../hooks/useLeads'
import { formDataToLead } from '../utils/leadUtils'
import type { Lead, LeadFormData, LeadStatus } from '../types/lead.types'

export function LeadsPage() {
  const {
    leads, allLeads, isLoading, error, filters, setFilters,
    selectedIds, toggleSelect, toggleSelectAll, clearSelection,
    addLead, editLead, removeLead, bulkDelete, bulkUpdateStatus,
    convertLead, refresh,
  } = useLeads()

  const { stats, isLoading: statsLoading } = useLeadStats()

  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [viewingLead, setViewingLead] = useState<Lead | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Sort (for table view) ──
  const sortedLeads = [...leads].sort((a, b) => {
    let aVal: any, bVal: any
    switch (sortField) {
      case 'name': aVal = `${a.firstName} ${a.lastName}`; bVal = `${b.firstName} ${b.lastName}`; break
      case 'status': aVal = a.status; bVal = b.status; break
      case 'source': aVal = a.source; bVal = b.source; break
      case 'priority': aVal = a.priority; bVal = b.priority; break
      case 'value': aVal = a.estimatedValue; bVal = b.estimatedValue; break
      case 'assignedTo': aVal = a.assignedTo?.name || ''; bVal = b.assignedTo?.name || ''; break
      case 'followUpDate': aVal = a.followUpDate || ''; bVal = b.followUpDate || ''; break
      default: aVal = a.createdAt; bVal = b.createdAt
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = useCallback((field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }, [sortField])

  // ── Handlers ──
  const handleAddLead = () => { setEditingLead(null); setFormOpen(true) }

  const handleEditLead = useCallback((lead: Lead) => {
    setEditingLead(lead); setFormOpen(true); setDetailOpen(false)
  }, [])

  const handleViewLead = useCallback((lead: Lead) => {
    setViewingLead(lead); setDetailOpen(true)
  }, [])

  const handleDeleteLead = useCallback((lead: Lead) => {
    setDeletingLead(lead); setDeleteOpen(true); setDetailOpen(false)
  }, [])

  const handleFormSubmit = async (data: LeadFormData) => {
    try {
      setIsSubmitting(true)
      const leadData = formDataToLead(data)
      if (editingLead) {
        await editLead(editingLead.id, leadData)
        toast.success('Lead updated')
      } else {
        await addLead(leadData)
        toast.success('Lead created')
      }
    } catch { toast.error('Something went wrong') }
    finally { setIsSubmitting(false) }
  }

  const handleConfirmDelete = async () => {
    if (deletingLead) {
      try {
        await removeLead(deletingLead.id)
        toast.success(`${deletingLead.firstName} ${deletingLead.lastName} deleted`)
        setDeleteOpen(false); setDeletingLead(null)
        if (viewingLead?.id === deletingLead.id) setDetailOpen(false)
      } catch { toast.error('Failed to delete') }
    }
  }

  const handleBulkDelete = async () => {
    try { await bulkDelete(); toast.success(`${selectedIds.size} leads deleted`) }
    catch { toast.error('Failed to delete leads') }
  }

  const handleBulkStatusChange = async (status: LeadStatus) => {
    try { await bulkUpdateStatus(status); toast.success(`Moved ${selectedIds.size} leads to ${status}`) }
    catch { toast.error('Failed to update status') }
  }

  const handleConvert = async (lead: Lead) => {
    try {
      await convertLead(lead.id)
      toast.success(`${lead.firstName} ${lead.lastName} converted to member!`)
      setDetailOpen(false)
    } catch { toast.error('Failed to convert lead') }
  }

  const handleStatusChange = async (lead: Lead, status: LeadStatus) => {
    try {
      await editLead(lead.id, { status })
      toast.success(`Moved to ${status}`)
    } catch { toast.error('Failed to update status') }
  }

  if (error) return <ErrorState title="Failed to load leads" description={error} onRetry={refresh} />

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Lead Management</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Track and convert sales leads into gym members.</p>
      </motion.div>

      {/* Stats */}
      <LeadStatsBar stats={stats} isLoading={statsLoading} />

      {/* Filters */}
      <LeadFilters
        filters={filters}
        onFiltersChange={setFilters}
        onAddLead={handleAddLead}
        resultCount={leads.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Bulk Actions */}
      <BulkActions
        count={selectedIds.size}
        onDelete={handleBulkDelete}
        onStatusChange={handleBulkStatusChange}
        onClear={clearSelection}
      />

      {/* Content */}
      {!isLoading && leads.length === 0 ? (
        <Card><CardContent className="p-0">
          <EmptyState
            icon={Users}
            title={filters.search || filters.status !== 'all' ? 'No leads match your filters' : 'No leads yet'}
            description={filters.search || filters.status !== 'all' ? 'Try adjusting your search or filters.' : 'Start by adding your first sales lead.'}
            actionLabel={filters.search || filters.status !== 'all' ? undefined : 'Add Lead'}
            onAction={filters.search || filters.status !== 'all' ? undefined : handleAddLead}
          />
        </CardContent></Card>
      ) : viewMode === 'pipeline' ? (
        <LeadPipeline
          leads={leads}
          isLoading={isLoading}
          onView={handleViewLead}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          onStatusChange={handleStatusChange}
          onConvert={handleConvert}
        />
      ) : (
        <LeadTable
          leads={sortedLeads}
          isLoading={isLoading}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onView={handleViewLead}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          onConvert={handleConvert}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Form Dialog */}
      <LeadForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingLead} isLoading={isSubmitting} />

      {/* Detail Panel */}
      <LeadDetailPanel lead={viewingLead} open={detailOpen} onClose={() => setDetailOpen(false)} onEdit={handleEditLead} onDelete={handleDeleteLead} onConvert={handleConvert} />

      {/* Delete Dialog */}
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} itemName={deletingLead ? `${deletingLead.firstName} ${deletingLead.lastName}` : undefined} itemCount={selectedIds.size > 0 ? selectedIds.size : undefined} />
    </div>
  )
}
