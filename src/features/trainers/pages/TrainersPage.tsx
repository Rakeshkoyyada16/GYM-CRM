import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Dumbbell } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'

import { TrainerStatsBar } from '../components/TrainerStatsBar'
import { TrainerCard } from '../components/TrainerCard'
import { TrainerTable } from '../components/TrainerTable'
import { TrainerFilters } from '../components/TrainerFilters'
import { TrainerForm } from '../components/TrainerForm'
import { TrainerProfile } from '../components/TrainerProfile'
import { DeleteDialog } from '@/components/feedback/DeleteDialog'

import { useTrainers } from '../hooks/useTrainers'
import { formDataToTrainer } from '../utils/trainerUtils'
import type { Trainer, TrainerFormData } from '../types/trainer.types'

export function TrainersPage() {
  const {
    trainers, allTrainers, isLoading, error, filters, setFilters,
    viewMode, setViewMode, addTrainer, editTrainer, removeTrainer, refresh,
  } = useTrainers()

  const [formOpen, setFormOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [viewingTrainer, setViewingTrainer] = useState<Trainer | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingTrainer, setDeletingTrainer] = useState<Trainer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAdd = () => { setEditingTrainer(null); setFormOpen(true) }

  const handleEdit = useCallback((t: Trainer) => {
    setEditingTrainer(t); setFormOpen(true); setProfileOpen(false)
  }, [])

  const handleView = useCallback((t: Trainer) => {
    setViewingTrainer(t); setProfileOpen(true)
  }, [])

  const handleDelete = useCallback((t: Trainer) => {
    setDeletingTrainer(t); setDeleteOpen(true); setProfileOpen(false)
  }, [])

  const handleFormSubmit = async (data: TrainerFormData) => {
    try {
      setIsSubmitting(true)
      const trainerData = formDataToTrainer(data)
      if (editingTrainer) {
        await editTrainer(editingTrainer.id, trainerData)
        toast.success('Trainer updated')
      } else {
        await addTrainer(trainerData)
        toast.success('Trainer added')
      }
    } catch { toast.error('Something went wrong') }
    finally { setIsSubmitting(false) }
  }

  const handleConfirmDelete = async () => {
    if (deletingTrainer) {
      try {
        await removeTrainer(deletingTrainer.id)
        toast.success(`${deletingTrainer.firstName} ${deletingTrainer.lastName} deleted`)
        setDeleteOpen(false); setDeletingTrainer(null)
        if (viewingTrainer?.id === deletingTrainer.id) setProfileOpen(false)
      } catch { toast.error('Failed to delete') }
    }
  }

  if (error) return <ErrorState title="Failed to load trainers" description={error} onRetry={refresh} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Trainers</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Manage trainers, schedules, and performance.</p>
      </motion.div>

      {/* Stats */}
      <TrainerStatsBar trainers={allTrainers} isLoading={isLoading} />

      {/* Filters */}
      <TrainerFilters
        filters={filters} onFiltersChange={setFilters}
        onAdd={handleAdd} resultCount={trainers.length}
        viewMode={viewMode} onViewModeChange={setViewMode}
      />

      {/* Content */}
      {!isLoading && trainers.length === 0 ? (
        <Card><CardContent className="p-0">
          <EmptyState
            icon={Dumbbell}
            title={filters.search || filters.status !== 'all' ? 'No trainers match your filters' : 'No trainers yet'}
            description={filters.search || filters.status !== 'all' ? 'Try adjusting your filters.' : 'Add your first trainer.'}
            actionLabel={filters.search || filters.status !== 'all' ? undefined : 'Add Trainer'}
            onAction={filters.search || filters.status !== 'all' ? undefined : handleAdd}
          />
        </CardContent></Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((trainer, i) => (
            <TrainerCard key={trainer.id} trainer={trainer} index={i}
              onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <TrainerTable trainers={trainers} isLoading={isLoading}
          onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Form Dialog */}
      <TrainerForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit}
        initialData={editingTrainer} isLoading={isSubmitting} />

      {/* Profile Panel */}
      <TrainerProfile trainer={viewingTrainer} open={profileOpen} onClose={() => setProfileOpen(false)}
        onEdit={handleEdit} onDelete={handleDelete} />

      {/* Delete Dialog */}
      <DeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete}
        itemName={deletingTrainer ? `${deletingTrainer.firstName} ${deletingTrainer.lastName}` : undefined} />
    </div>
  )
}
