import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Trainer, TrainerFilters, TrainerFormData } from '../types/trainer.types'
import { fetchTrainers, fetchTrainerById, createTrainer, updateTrainer, deleteTrainer } from '../utils/mockData'

// ============================================
// Trainers List Hook
// ============================================

export function useTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TrainerFilters>({
    search: '', status: 'all', specialization: 'all',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchTrainers()
      setTrainers(data)
    } catch { setError('Failed to load trainers') }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let result = [...trainers]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(t =>
        t.firstName.toLowerCase().includes(q) || t.lastName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) || t.specializations.some(s => s.includes(q))
      )
    }
    if (filters.status !== 'all') result = result.filter(t => t.status === filters.status)
    if (filters.specialization !== 'all') result = result.filter(t => t.specializations.includes(filters.specialization as any))
    return result
  }, [trainers, filters])

  const addTrainer = useCallback(async (data: Partial<Trainer>) => {
    const newTrainer = await createTrainer(data)
    setTrainers(prev => [newTrainer, ...prev])
    return newTrainer
  }, [])

  const editTrainer = useCallback(async (id: string, data: Partial<Trainer>) => {
    const updated = await updateTrainer(id, data)
    setTrainers(prev => prev.map(t => t.id === id ? updated : t))
    return updated
  }, [])

  const removeTrainer = useCallback(async (id: string) => {
    await deleteTrainer(id)
    setTrainers(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    trainers: filtered, allTrainers: trainers, isLoading, error,
    filters, setFilters, viewMode, setViewMode,
    addTrainer, editTrainer, removeTrainer, refresh: load,
  }
}

// ============================================
// Single Trainer Hook
// ============================================

export function useTrainer(id: string | undefined) {
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) { setIsLoading(false); return }
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      const data = await fetchTrainerById(id)
      if (!cancelled) { setTrainer(data || null); setIsLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  return { trainer, isLoading, setTrainer }
}
