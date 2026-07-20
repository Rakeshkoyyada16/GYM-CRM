// ============================================
// Lead Management Types
// ============================================

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'follow_up'
  | 'trial_scheduled'
  | 'trial_completed'
  | 'proposal_sent'
  | 'converted'
  | 'lost'

export type LeadSource =
  | 'walk_in'
  | 'website'
  | 'social_media'
  | 'referral'
  | 'google_ads'
  | 'instagram'
  | 'facebook'
  | 'phone_call'
  | 'event'
  | 'other'

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Lead {
  id: string
  leadId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: LeadStatus
  source: LeadSource
  priority: LeadPriority
  assignedTo?: AssignedStaff
  interestedPlan?: string
  estimatedValue: number
  followUpDate?: string
  notes: string
  tags: string[]
  lastContactedAt?: string
  convertedMemberId?: string
  createdAt: string
  updatedAt: string
}

export interface AssignedStaff {
  id: string
  name: string
  avatar?: string
  role: string
}

export interface LeadNote {
  id: string
  leadId: string
  content: string
  createdBy: string
  createdAt: string
}

export interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  status: LeadStatus
  source: LeadSource
  priority: LeadPriority
  assignedToId?: string
  interestedPlan?: string
  estimatedValue: number
  followUpDate?: string
  notes: string
  tags: string[]
}

export interface LeadFilters {
  search: string
  status: LeadStatus | 'all'
  source: LeadSource | 'all'
  priority: LeadPriority | 'all'
  assignedTo: string | 'all'
  dateRange: 'all' | '7d' | '30d' | '90d'
}

export interface PipelineColumn {
  id: LeadStatus
  label: string
  color: string
  bgColor: string
  borderColor: string
}

export interface LeadStats {
  totalLeads: number
  newLeads: number
  convertedThisMonth: number
  conversionRate: number
  avgConversionDays: number
  pipelineValue: number
  followUpsDue: number
  lostThisMonth: number
}
