import type { Lead, LeadStatus, LeadSource, LeadPriority, PipelineColumn, LeadFormData } from '../types/lead.types'

// ============================================
// Pipeline Column Configuration
// ============================================

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { id: 'new',             label: 'New',            color: 'text-blue-700',    bgColor: 'bg-blue-50',    borderColor: 'border-blue-200' },
  { id: 'contacted',       label: 'Contacted',      color: 'text-indigo-700',  bgColor: 'bg-indigo-50',  borderColor: 'border-indigo-200' },
  { id: 'follow_up',       label: 'Follow Up',      color: 'text-amber-700',   bgColor: 'bg-amber-50',   borderColor: 'border-amber-200' },
  { id: 'trial_scheduled', label: 'Trial Scheduled', color: 'text-purple-700', bgColor: 'bg-purple-50',  borderColor: 'border-purple-200' },
  { id: 'trial_completed', label: 'Trial Done',     color: 'text-teal-700',    bgColor: 'bg-teal-50',    borderColor: 'border-teal-200' },
  { id: 'proposal_sent',   label: 'Proposal Sent',  color: 'text-orange-700',  bgColor: 'bg-orange-50',  borderColor: 'border-orange-200' },
  { id: 'converted',       label: 'Converted',      color: 'text-green-700',   bgColor: 'bg-green-50',   borderColor: 'border-green-200' },
  { id: 'lost',            label: 'Lost',           color: 'text-gray-500',    bgColor: 'bg-gray-50',    borderColor: 'border-gray-200' },
]

// ============================================
// Display Labels
// ============================================

export const SOURCE_LABELS: Record<LeadSource, string> = {
  walk_in: 'Walk-in', website: 'Website', social_media: 'Social Media',
  referral: 'Referral', google_ads: 'Google Ads', instagram: 'Instagram',
  facebook: 'Facebook', phone_call: 'Phone Call', event: 'Event', other: 'Other',
}

export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New', contacted: 'Contacted', follow_up: 'Follow Up',
  trial_scheduled: 'Trial Scheduled', trial_completed: 'Trial Completed',
  proposal_sent: 'Proposal Sent', converted: 'Converted', lost: 'Lost',
}

// ============================================
// Badge Variants
// ============================================

export function getPriorityVariant(priority: LeadPriority): 'gray' | 'info' | 'warning' | 'error' {
  const map: Record<LeadPriority, 'gray' | 'info' | 'warning' | 'error'> = {
    low: 'gray', medium: 'info', high: 'warning', urgent: 'error',
  }
  return map[priority]
}

export function getStatusVariant(status: LeadStatus): 'info' | 'warning' | 'default' | 'success' | 'gray' {
  const map: Record<LeadStatus, 'info' | 'warning' | 'default' | 'success' | 'gray'> = {
    new: 'info', contacted: 'default', follow_up: 'warning',
    trial_scheduled: 'default', trial_completed: 'default',
    proposal_sent: 'warning', converted: 'success', lost: 'gray',
  }
  return map[status]
}

export function getSourceVariant(_source: LeadSource): 'gray' {
  return 'gray'
}

// ============================================
// Helpers
// ============================================

export function getLeadName(lead: Pick<Lead, 'firstName' | 'lastName'>): string {
  return `${lead.firstName} ${lead.lastName}`
}

export function getLeadInitials(lead: Pick<Lead, 'firstName' | 'lastName'>): string {
  return `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase()
}

export function isFollowUpDue(lead: Lead): boolean {
  if (!lead.followUpDate) return false
  return new Date(lead.followUpDate) <= new Date()
}

export function isFollowUpSoon(lead: Lead, days: number = 3): boolean {
  if (!lead.followUpDate) return false
  const followUp = new Date(lead.followUpDate)
  const now = new Date()
  const diff = (followUp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= days
}

export function formDataToLead(data: LeadFormData): Partial<Lead> {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    status: data.status,
    source: data.source,
    priority: data.priority,
    interestedPlan: data.interestedPlan,
    estimatedValue: data.estimatedValue,
    followUpDate: data.followUpDate || undefined,
    notes: data.notes,
    tags: data.tags,
  }
}

export function leadToFormData(lead: Lead): LeadFormData {
  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    source: lead.source,
    priority: lead.priority,
    assignedToId: lead.assignedTo?.id,
    interestedPlan: lead.interestedPlan || '',
    estimatedValue: lead.estimatedValue,
    followUpDate: lead.followUpDate || '',
    notes: lead.notes,
    tags: lead.tags,
  }
}

export function groupLeadsByStatus(leads: Lead[]): Record<LeadStatus, Lead[]> {
  const groups: Record<LeadStatus, Lead[]> = {
    new: [], contacted: [], follow_up: [], trial_scheduled: [],
    trial_completed: [], proposal_sent: [], converted: [], lost: [],
  }
  leads.forEach(lead => { groups[lead.status].push(lead) })
  return groups
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
  return `₹${amount}`
}
