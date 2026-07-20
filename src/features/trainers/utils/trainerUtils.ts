import type { TrainerStatus, Specialization, Trainer, TrainerFormData } from '../types/trainer.types'

export const STATUS_LABELS: Record<TrainerStatus, string> = {
  active: 'Active', inactive: 'Inactive', on_leave: 'On Leave',
}

export const SPECIALIZATION_LABELS: Record<Specialization, string> = {
  strength: 'Strength', cardio: 'Cardio', yoga: 'Yoga', pilates: 'Pilates',
  crossfit: 'CrossFit', boxing: 'Boxing', zumba: 'Zumba', hiit: 'HIIT',
  spinning: 'Spinning', nutrition: 'Nutrition', rehabilitation: 'Rehabilitation',
}

export const SPECIALIZATION_EMOJIS: Record<Specialization, string> = {
  strength: '💪', cardio: '🏃', yoga: '🧘', pilates: '🤸',
  crossfit: '🏋️', boxing: '🥊', zumba: '💃', hiit: '🔥',
  spinning: '🚴', nutrition: '🥗', rehabilitation: '🩹',
}

export function getStatusVariant(status: TrainerStatus): 'success' | 'gray' | 'warning' {
  const map: Record<TrainerStatus, 'success' | 'gray' | 'warning'> = {
    active: 'success', inactive: 'gray', on_leave: 'warning',
  }
  return map[status]
}

export function getTrainerName(t: Pick<Trainer, 'firstName' | 'lastName'>): string {
  return `${t.firstName} ${t.lastName}`
}

export function getTrainerInitials(t: Pick<Trainer, 'firstName' | 'lastName'>): string {
  return `${t.firstName[0]}${t.lastName[0]}`.toUpperCase()
}

export function formDataToTrainer(data: TrainerFormData): Partial<Trainer> {
  return {
    firstName: data.firstName, lastName: data.lastName,
    email: data.email, phone: data.phone, gender: data.gender,
    dateOfBirth: data.dateOfBirth, specializations: data.specializations,
    certifications: data.certifications, experience: data.experience,
    salary: data.salary, bio: data.bio,
  }
}

export function trainerToFormData(t: Trainer): TrainerFormData {
  return {
    firstName: t.firstName, lastName: t.lastName,
    email: t.email, phone: t.phone, gender: t.gender,
    dateOfBirth: t.dateOfBirth, specializations: t.specializations,
    certifications: t.certifications, experience: t.experience,
    salary: t.salary, bio: t.bio,
  }
}

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount)
}

export function getRatingStars(rating: number): { full: number; half: boolean; empty: number } {
  const full = Math.floor(rating)
  const half = rating - full >= 0.3 && rating - full < 0.8
  const empty = 5 - full - (half ? 1 : 0)
  return { full, half, empty }
}

export function getTodaySchedule(trainer: Trainer) {
  const today = new Date().getDay()
  return trainer.availability.find(d => d.dayOfWeek === today)
}
