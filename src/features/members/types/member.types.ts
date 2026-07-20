// ============================================
// Members Module Types
// ============================================

export type MemberStatus = 'active' | 'inactive' | 'expired' | 'suspended' | 'pending'
export type MembershipType = 'basic' | 'standard' | 'premium' | 'vip' | 'custom'
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking' | 'wallet' | 'cheque'
export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'refunded' | 'pending'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export interface Member {
  id: string
  memberId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  gender: Gender
  dateOfBirth: string
  joinDate: string
  status: MemberStatus
  membership: Membership
  emergencyContact: EmergencyContact
  address?: Address
  medicalNotes?: string
  assignedTrainer?: AssignedTrainer
  notes?: string
  tags: string[]
  lastVisit?: string
  totalVisits: number
  createdAt: string
  updatedAt: string
}

export interface Membership {
  id: string
  type: MembershipType
  planName: string
  startDate: string
  endDate: string
  price: number
  currency: string
  autoRenew: boolean
  sessionsRemaining?: number
  totalSessions?: number
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface AssignedTrainer {
  id: string
  name: string
  specialization: string
}

export interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut?: string
  className?: string
  status: AttendanceStatus
}

export interface PaymentRecord {
  id: string
  invoiceNumber: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  description: string
  date: string
  paidDate?: string
}

export interface MemberFilters {
  search: string
  status: MemberStatus | 'all'
  membershipType: MembershipType | 'all'
  gender: Gender | 'all'
  dateRange: 'all' | '7d' | '30d' | '90d'
}

export interface MemberFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: Gender
  dateOfBirth: string
  membershipType: MembershipType
  planName: string
  startDate: string
  endDate: string
  price: number
  autoRenew: boolean
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  address: string
  city: string
  state: string
  pincode: string
  medicalNotes: string
  notes: string
  tags: string[]
}

export interface SortConfig {
  field: keyof Member | 'name' | 'membershipType' | 'amount'
  direction: 'asc' | 'desc'
}

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
}
