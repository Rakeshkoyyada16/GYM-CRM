import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'

import { MemberFilters } from '../components/MemberFilters'
import { MemberTable } from '../components/MemberTable'
import { MemberForm } from '../components/MemberForm'
import { MemberProfile } from '../components/MemberProfile'
import { DeleteDialog } from '@/components/feedback/DeleteDialog'
import { BulkActions } from '../components/BulkActions'
import { ImportDialog } from '../components/ImportDialog'

import { useMembers, useRenewMembership } from '../hooks/useMembers'
import { formDataToMember, exportMembersToCSV } from '../utils/memberUtils'
import type { Member, MemberFormData } from '../types/member.types'

export function MembersPage() {
  const {
    members, allFilteredMembers, isLoading, error,
    filters, setFilters, sort, setSort,
    pagination, setPagination,
    selectedIds, toggleSelect, toggleSelectAll, clearSelection,
    addMember, editMember, removeMember, bulkDelete, refresh,
  } = useMembers()

  const { renew, isRenewing } = useRenewMembership()

  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [viewingMember, setViewingMember] = useState<Member | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Handlers ──
  const handleAddMember = () => {
    setEditingMember(null)
    setFormOpen(true)
  }

  const handleEditMember = useCallback((member: Member) => {
    setEditingMember(member)
    setFormOpen(true)
    setProfileOpen(false)
  }, [])

  const handleViewMember = useCallback((member: Member) => {
    setViewingMember(member)
    setProfileOpen(true)
  }, [])

  const handleDeleteMember = useCallback((member: Member) => {
    setDeletingMember(member)
    setDeleteOpen(true)
    setProfileOpen(false)
  }, [])

  const handleFormSubmit = async (data: MemberFormData) => {
    try {
      setIsSubmitting(true)
      const memberData = formDataToMember(data)
      if (editingMember) {
        await editMember(editingMember.id, memberData)
        toast.success('Member updated successfully')
      } else {
        await addMember(memberData)
        toast.success('Member created successfully')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (deletingMember) {
      try {
        await removeMember(deletingMember.id)
        toast.success(`${deletingMember.firstName} ${deletingMember.lastName} deleted`)
        setDeleteOpen(false)
        setDeletingMember(null)
        if (viewingMember?.id === deletingMember.id) setProfileOpen(false)
      } catch {
        toast.error('Failed to delete member')
      }
    }
  }

  const handleBulkDelete = async () => {
    try {
      await bulkDelete()
      toast.success(`${selectedIds.size} members deleted`)
    } catch {
      toast.error('Failed to delete members')
    }
  }

  const handleExport = () => {
    exportMembersToCSV(allFilteredMembers)
    toast.success(`Exported ${allFilteredMembers.length} members`)
  }

  const handleImport = (importedMembers: Partial<Member>[]) => {
    importedMembers.forEach(m => addMember(m))
    toast.success(`Imported ${importedMembers.length} members`)
  }

  const handleRenew = async (member: Member) => {
    try {
      const updated = await renew(member.id)
      if (updated) {
        setViewingMember(updated)
        toast.success('Membership renewed successfully')
        refresh()
      }
    } catch {
      toast.error('Failed to renew membership')
    }
  }

  const handleCheckIn = (member: Member) => {
    toast.success(`${member.firstName} ${member.lastName} checked in`)
  }

  // ── Error state ──
  if (error) {
    return <ErrorState title="Failed to load members" description={error} onRetry={refresh} />
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Members</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Manage your gym members, memberships, and payments.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <MemberFilters
          filters={filters}
          onFiltersChange={setFilters}
          onAddMember={handleAddMember}
          onExport={handleExport}
          onImport={() => setImportOpen(true)}
          resultCount={pagination.total}
        />
      </motion.div>

      {/* Bulk Actions */}
      <BulkActions
        count={selectedIds.size}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />

      {/* Table or Empty State */}
      {!isLoading && members.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Users}
              title={filters.search || filters.status !== 'all' ? 'No members match your filters' : 'No members yet'}
              description={filters.search || filters.status !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first gym member.'
              }
              actionLabel={filters.search || filters.status !== 'all' ? undefined : 'Add Member'}
              onAction={filters.search || filters.status !== 'all' ? undefined : handleAddMember}
            />
          </CardContent>
        </Card>
      ) : (
        <MemberTable
          members={members}
          isLoading={isLoading}
          sort={sort}
          onSortChange={setSort}
          pagination={pagination}
          onPageChange={page => setPagination(prev => ({ ...prev, page }))}
          onPageSizeChange={size => setPagination(prev => ({ ...prev, pageSize: size, page: 1 }))}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onView={handleViewMember}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          onCheckIn={handleCheckIn}
        />
      )}

      {/* Form Dialog */}
      <MemberForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingMember}
        isLoading={isSubmitting}
      />

      {/* Profile Slide-over */}
      <MemberProfile
        member={viewingMember}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onEdit={handleEditMember}
        onDelete={handleDeleteMember}
        onRenew={handleRenew}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={deletingMember ? `${deletingMember.firstName} ${deletingMember.lastName}` : undefined}
        itemCount={selectedIds.size > 0 ? selectedIds.size : undefined}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  )
}
