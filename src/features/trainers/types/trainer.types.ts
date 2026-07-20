// ============================================
// Trainer Module Types
// ============================================

export type TrainerStatus = 'active' | 'inactive' | 'on_leave'
export type Specialization =
  | 'strength' | 'cardio' | 'yoga' | 'pilates' | 'crossfit'
  | 'boxing' | 'zumba' | 'hiit' | 'spinning' | 'nutrition' | 'rehabilitation'

export interface Trainer {
  id: string
  trainerId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  joinDate: string
  status: TrainerStatus
  specializations: Specialization[]
  certifications: string[]
  experience: number // years
  salary: number
  rating: number
  totalClients: number
  totalClasses: number
  bio: string
  availability: DaySchedule[]
  assignedMembers: AssignedMember[]
  performance: PerformanceMetrics
  createdAt: string
  updatedAt: string
}

export interface DaySchedule {
  dayOfWeek: number // 0=Sun, 1=Mon...
  dayName: string
  startTime: string
  endTime: string
  isAvailable: boolean
  classes: ScheduledClass[]
}

export interface ScheduledClass {
  id: string
  name: string
  startTime: string
  endTime: string
  room: string
  enrolled: number
  capacity: number
}

export interface AssignedMember {
  id: string
  name: string
  plan: string
  joinedAt: string
  sessionsCompleted: number
  totalSessions: number
  lastSession: string
}

export interface PerformanceMetrics {
  clientRetention: number // percentage
  avgClientRating: number
  classesThisMonth: number
  classesLastMonth: number
  revenueGenerated: number
  attendanceRate: number
  monthlyTrend: { month: string; classes: number; revenue: number }[]
}

export interface TrainerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  specializations: Specialization[]
  certifications: string[]
  experience: number
  salary: number
  bio: string
}

export interface TrainerFilters {
  search: string
  status: TrainerStatus | 'all'
  specialization: Specialization | 'all'
}
