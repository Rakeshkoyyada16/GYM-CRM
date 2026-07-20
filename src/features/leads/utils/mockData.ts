import type { Lead, LeadStats, LeadNote, AssignedStaff } from '../types/lead.types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ============================================
// Staff Data
// ============================================

const STAFF: AssignedStaff[] = [
  { id: 's1', name: 'Priya Mehta', role: 'Sales Manager' },
  { id: 's2', name: 'Arun Kumar', role: 'Front Desk' },
  { id: 's3', name: 'Nisha Singh', role: 'Sales Executive' },
  { id: 's4', name: 'Vikash Raj', role: 'Marketing' },
]

// ============================================
// Mock Leads Database
// ============================================

const MOCK_LEADS: Lead[] = [
  {
    id: '1', leadId: 'LEAD-001', firstName: 'Aarav', lastName: 'Kapoor',
    email: 'aarav.kapoor@email.com', phone: '+91 98700 10001', status: 'new',
    source: 'instagram', priority: 'high', estimatedValue: 24999,
    interestedPlan: 'Premium Annual', notes: 'Saw our Instagram reel, very interested in personal training.',
    tags: ['hot-lead', 'personal-training'], followUpDate: '2026-07-22',
    createdAt: '2026-07-20T08:00:00Z', updatedAt: '2026-07-20T08:00:00Z',
  },
  {
    id: '2', leadId: 'LEAD-002', firstName: 'Simran', lastName: 'Kaur',
    email: 'simran.k@email.com', phone: '+91 98700 10002', status: 'contacted',
    source: 'walk_in', priority: 'medium', estimatedValue: 8999,
    interestedPlan: 'Standard Quarterly', assignedTo: STAFF[0],
    notes: 'Visited gym on July 18. Liked the facilities. Needs to discuss with husband.',
    tags: ['family-plan'], followUpDate: '2026-07-23',
    lastContactedAt: '2026-07-18T14:00:00Z',
    createdAt: '2026-07-18T10:00:00Z', updatedAt: '2026-07-18T14:00:00Z',
  },
  {
    id: '3', leadId: 'LEAD-003', firstName: 'Mohit', lastName: 'Sharma',
    email: 'mohit.s@email.com', phone: '+91 98700 10003', status: 'follow_up',
    source: 'google_ads', priority: 'high', estimatedValue: 49999,
    interestedPlan: 'VIP Annual', assignedTo: STAFF[2],
    notes: 'Converted from Google Ads landing page. Wants VIP amenities. Price-sensitive — offer 10% early bird.',
    tags: ['vip', 'price-sensitive'], followUpDate: '2026-07-21',
    lastContactedAt: '2026-07-19T11:00:00Z',
    createdAt: '2026-07-15T09:00:00Z', updatedAt: '2026-07-19T11:00:00Z',
  },
  {
    id: '4', leadId: 'LEAD-004', firstName: 'Pooja', lastName: 'Reddy',
    email: 'pooja.r@email.com', phone: '+91 98700 10004', status: 'trial_scheduled',
    source: 'referral', priority: 'high', estimatedValue: 19999,
    interestedPlan: 'Premium Semi-Annual', assignedTo: STAFF[0],
    notes: 'Referred by Arjun Reddy (VIP member). Trial class booked for July 22 — Morning Yoga.',
    tags: ['referral', 'yoga'], followUpDate: '2026-07-22',
    lastContactedAt: '2026-07-20T09:00:00Z',
    createdAt: '2026-07-17T16:00:00Z', updatedAt: '2026-07-20T09:00:00Z',
  },
  {
    id: '5', leadId: 'LEAD-005', firstName: 'Rohit', lastName: 'Verma',
    email: 'rohit.v@email.com', phone: '+91 98700 10005', status: 'trial_completed',
    source: 'walk_in', priority: 'medium', estimatedValue: 15999,
    interestedPlan: 'Standard Annual', assignedTo: STAFF[1],
    notes: 'Completed trial HIIT session on July 19. Impressed with trainer Raj. Needs to check schedule.',
    tags: ['hiit', 'schedule-concern'], followUpDate: '2026-07-21',
    lastContactedAt: '2026-07-19T18:00:00Z',
    createdAt: '2026-07-12T11:00:00Z', updatedAt: '2026-07-19T18:00:00Z',
  },
  {
    id: '6', leadId: 'LEAD-006', firstName: 'Nisha', lastName: 'Agarwal',
    email: 'nisha.a@email.com', phone: '+91 98700 10006', status: 'proposal_sent',
    source: 'website', priority: 'high', estimatedValue: 24999,
    interestedPlan: 'Premium Annual', assignedTo: STAFF[0],
    notes: 'Submitted inquiry form on website. Sent proposal with 5% corporate discount. Awaiting response.',
    tags: ['corporate', 'email-proposal'], followUpDate: '2026-07-24',
    lastContactedAt: '2026-07-20T10:00:00Z',
    createdAt: '2026-07-16T08:00:00Z', updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: '7', leadId: 'LEAD-007', firstName: 'Karan', lastName: 'Joshi',
    email: 'karan.j@email.com', phone: '+91 98700 10007', status: 'new',
    source: 'facebook', priority: 'low', estimatedValue: 2999,
    interestedPlan: 'Basic Monthly', notes: 'Commented on Facebook post about monsoon offer. Casual interest.',
    tags: ['social-media', 'casual'],
    createdAt: '2026-07-20T07:00:00Z', updatedAt: '2026-07-20T07:00:00Z',
  },
  {
    id: '8', leadId: 'LEAD-008', firstName: 'Divya', lastName: 'Nair',
    email: 'divya.n@email.com', phone: '+91 98700 10008', status: 'contacted',
    source: 'phone_call', priority: 'medium', estimatedValue: 8999,
    interestedPlan: 'Standard Quarterly', assignedTo: STAFF[1],
    notes: 'Called to inquire about group classes. Interested in Zumba and Yoga. Wants evening slots.',
    tags: ['zumba', 'yoga', 'evening'], followUpDate: '2026-07-23',
    lastContactedAt: '2026-07-19T15:00:00Z',
    createdAt: '2026-07-19T14:00:00Z', updatedAt: '2026-07-19T15:00:00Z',
  },
  {
    id: '9', leadId: 'LEAD-009', firstName: 'Amit', lastName: 'Patel',
    email: 'amit.p@email.com', phone: '+91 98700 10009', status: 'converted',
    source: 'referral', priority: 'high', estimatedValue: 49999,
    interestedPlan: 'VIP Annual', assignedTo: STAFF[0],
    notes: 'Converted! Signed VIP Annual on July 18. Referred by existing VIP member.',
    tags: ['converted', 'vip', 'referral'], convertedMemberId: '11',
    lastContactedAt: '2026-07-18T12:00:00Z',
    createdAt: '2026-07-10T09:00:00Z', updatedAt: '2026-07-18T12:00:00Z',
  },
  {
    id: '10', leadId: 'LEAD-010', firstName: 'Sneha', lastName: 'Gupta',
    email: 'sneha.g@email.com', phone: '+91 98700 10010', status: 'lost',
    source: 'google_ads', priority: 'low', estimatedValue: 8999,
    interestedPlan: 'Standard Quarterly', assignedTo: STAFF[2],
    notes: 'Chose competitor gym — closer to her office. Keep for future re-engagement.',
    tags: ['lost-competitor', 're-engagement'],
    lastContactedAt: '2026-07-15T16:00:00Z',
    createdAt: '2026-07-05T10:00:00Z', updatedAt: '2026-07-15T16:00:00Z',
  },
  {
    id: '11', leadId: 'LEAD-011', firstName: 'Raj', lastName: 'Malhotra',
    email: 'raj.m@email.com', phone: '+91 98700 10011', status: 'new',
    source: 'event', priority: 'medium', estimatedValue: 15999,
    interestedPlan: 'Standard Annual', notes: 'Met at Fitness Expo on July 19. Gave business card.',
    tags: ['event-lead'], followUpDate: '2026-07-22',
    createdAt: '2026-07-19T17:00:00Z', updatedAt: '2026-07-19T17:00:00Z',
  },
  {
    id: '12', leadId: 'LEAD-012', firstName: 'Tanya', lastName: 'Bose',
    email: 'tanya.b@email.com', phone: '+91 98700 10012', status: 'follow_up',
    source: 'social_media', priority: 'medium', estimatedValue: 19999,
    interestedPlan: 'Premium Semi-Annual', assignedTo: STAFF[3],
    notes: 'DM on Instagram asking about women-only classes. Follow up with schedule.',
    tags: ['women-only', 'instagram-dm'], followUpDate: '2026-07-21',
    lastContactedAt: '2026-07-20T11:00:00Z',
    createdAt: '2026-07-20T10:30:00Z', updatedAt: '2026-07-20T11:00:00Z',
  },
]

// ============================================
// Mock Notes
// ============================================

const MOCK_NOTES: Record<string, LeadNote[]> = {
  '1': [
    { id: 'n1', leadId: '1', content: 'Initial inquiry via Instagram DM. Very enthusiastic.', createdBy: 'Priya Mehta', createdAt: '2026-07-20T08:05:00Z' },
  ],
  '3': [
    { id: 'n2', leadId: '3', content: 'Called and discussed VIP benefits. Asked about spa access.', createdBy: 'Nisha Singh', createdAt: '2026-07-16T10:00:00Z' },
    { id: 'n3', leadId: '3', content: 'Follow-up call: offered 10% early bird discount. Considering.', createdBy: 'Nisha Singh', createdAt: '2026-07-19T11:00:00Z' },
  ],
  '9': [
    { id: 'n4', leadId: '9', content: 'Trial completed. Loved the CrossFit box.', createdBy: 'Priya Mehta', createdAt: '2026-07-14T16:00:00Z' },
    { id: 'n5', leadId: '9', content: 'Signed VIP Annual contract. Payment via netbanking.', createdBy: 'Priya Mehta', createdAt: '2026-07-18T12:00:00Z' },
  ],
}

// ============================================
// API Functions
// ============================================

export function getStaff(): AssignedStaff[] {
  return STAFF
}

export async function fetchLeads(): Promise<Lead[]> {
  await delay(300)
  return [...MOCK_LEADS]
}

export async function fetchLeadById(id: string): Promise<Lead | undefined> {
  await delay(200)
  return MOCK_LEADS.find(l => l.id === id)
}

export async function fetchLeadNotes(leadId: string): Promise<LeadNote[]> {
  await delay(150)
  return MOCK_NOTES[leadId] || []
}

export async function addLeadNote(leadId: string, content: string, createdBy: string): Promise<LeadNote> {
  await delay(200)
  const note: LeadNote = { id: `n-${Date.now()}`, leadId, content, createdBy, createdAt: new Date().toISOString() }
  if (!MOCK_NOTES[leadId]) MOCK_NOTES[leadId] = []
  MOCK_NOTES[leadId].push(note)
  return note
}

export async function createLead(data: Partial<Lead>): Promise<Lead> {
  await delay(350)
  const newLead: Lead = {
    id: String(Date.now()),
    leadId: `LEAD-${String(MOCK_LEADS.length + 1).padStart(3, '0')}`,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    status: data.status || 'new',
    source: data.source || 'other',
    priority: data.priority || 'medium',
    estimatedValue: data.estimatedValue || 0,
    notes: data.notes || '',
    tags: data.tags || [],
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  MOCK_LEADS.unshift(newLead)
  return newLead
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  await delay(300)
  const index = MOCK_LEADS.findIndex(l => l.id === id)
  if (index === -1) throw new Error('Lead not found')
  MOCK_LEADS[index] = { ...MOCK_LEADS[index], ...data, updatedAt: new Date().toISOString() }
  return MOCK_LEADS[index]
}

export async function deleteLead(id: string): Promise<void> {
  await delay(250)
  const index = MOCK_LEADS.findIndex(l => l.id === id)
  if (index !== -1) MOCK_LEADS.splice(index, 1)
}

export async function convertLeadToMember(id: string): Promise<Lead> {
  await delay(400)
  const lead = MOCK_LEADS.find(l => l.id === id)
  if (!lead) throw new Error('Lead not found')
  lead.status = 'converted'
  lead.convertedMemberId = `MEM-${Date.now()}`
  lead.updatedAt = new Date().toISOString()
  return lead
}

export async function fetchLeadStats(): Promise<LeadStats> {
  await delay(200)
  const total = MOCK_LEADS.length
  const converted = MOCK_LEADS.filter(l => l.status === 'converted').length
  return {
    totalLeads: total,
    newLeads: MOCK_LEADS.filter(l => l.status === 'new').length,
    convertedThisMonth: converted,
    conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0,
    avgConversionDays: 8,
    pipelineValue: MOCK_LEADS.reduce((sum, l) => sum + l.estimatedValue, 0),
    followUpsDue: MOCK_LEADS.filter(l => l.followUpDate && new Date(l.followUpDate) <= new Date(Date.now() + 86400000 * 3)).length,
    lostThisMonth: MOCK_LEADS.filter(l => l.status === 'lost').length,
  }
}
