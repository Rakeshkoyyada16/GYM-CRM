import type { Member, AttendanceRecord, PaymentRecord } from '../types/member.types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ============================================
// Mock Members Database
// ============================================

export const MOCK_MEMBERS: Member[] = [
  {
    id: '1', memberId: 'GYM-2026-001', firstName: 'Rahul', lastName: 'Sharma',
    email: 'rahul.sharma@email.com', phone: '+91 98765 43210', gender: 'male',
    dateOfBirth: '1992-05-15', joinDate: '2024-01-15', status: 'active',
    membership: { id: 'm1', type: 'premium', planName: 'Premium Annual', startDate: '2026-01-15', endDate: '2027-01-15', price: 24999, currency: 'INR', autoRenew: true, sessionsRemaining: 45, totalSessions: 120 },
    emergencyContact: { name: 'Priya Sharma', relationship: 'Spouse', phone: '+91 98765 43211' },
    address: { street: '123 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', country: 'India' },
    medicalNotes: 'No known allergies. Mild knee issue — avoid heavy squats.',
    assignedTrainer: { id: 't1', name: 'Suresh Kumar', specialization: 'Strength Training' },
    tags: ['premium', 'personal-training'], lastVisit: '2026-07-19', totalVisits: 156,
    notes: 'Prefers morning sessions before 9 AM.', createdAt: '2024-01-15T10:00:00Z', updatedAt: '2026-07-19T08:30:00Z',
  },
  {
    id: '2', memberId: 'GYM-2026-002', firstName: 'Sneha', lastName: 'Patel',
    email: 'sneha.patel@email.com', phone: '+91 98765 43212', gender: 'female',
    dateOfBirth: '1995-08-22', joinDate: '2024-02-01', status: 'active',
    membership: { id: 'm2', type: 'standard', planName: 'Standard Quarterly', startDate: '2026-04-01', endDate: '2026-10-01', price: 8999, currency: 'INR', autoRenew: true, sessionsRemaining: 28, totalSessions: 36 },
    emergencyContact: { name: 'Amit Patel', relationship: 'Father', phone: '+91 98765 43213' },
    tags: ['yoga', 'group-classes'], lastVisit: '2026-07-18', totalVisits: 89,
    assignedTrainer: { id: 't2', name: 'Neha Agarwal', specialization: 'Yoga & Pilates' },
    createdAt: '2024-02-01T10:00:00Z', updatedAt: '2026-07-18T17:00:00Z',
  },
  {
    id: '3', memberId: 'GYM-2026-003', firstName: 'Arjun', lastName: 'Reddy',
    email: 'arjun.reddy@email.com', phone: '+91 98765 43214', gender: 'male',
    dateOfBirth: '1988-12-03', joinDate: '2024-03-10', status: 'active',
    membership: { id: 'm3', type: 'vip', planName: 'VIP Annual', startDate: '2026-03-10', endDate: '2027-03-10', price: 49999, currency: 'INR', autoRenew: true, sessionsRemaining: 200, totalSessions: 200 },
    emergencyContact: { name: 'Lakshmi Reddy', relationship: 'Mother', phone: '+91 98765 43215' },
    medicalNotes: 'Asthmatic — keep inhaler accessible during cardio.',
    assignedTrainer: { id: 't1', name: 'Suresh Kumar', specialization: 'Strength Training' },
    tags: ['vip', 'crossfit', 'personal-training'], lastVisit: '2026-07-20', totalVisits: 234,
    createdAt: '2024-03-10T10:00:00Z', updatedAt: '2026-07-20T06:00:00Z',
  },
  {
    id: '4', memberId: 'GYM-2026-004', firstName: 'Kavya', lastName: 'Nair',
    email: 'kavya.nair@email.com', phone: '+91 98765 43216', gender: 'female',
    dateOfBirth: '1997-03-28', joinDate: '2024-04-05', status: 'active',
    membership: { id: 'm4', type: 'basic', planName: 'Basic Monthly', startDate: '2026-06-05', endDate: '2026-08-05', price: 2999, currency: 'INR', autoRenew: false },
    emergencyContact: { name: 'Suresh Nair', relationship: 'Brother', phone: '+91 98765 43217' },
    tags: ['zumba', 'cardio'], lastVisit: '2026-07-15', totalVisits: 45,
    createdAt: '2024-04-05T10:00:00Z', updatedAt: '2026-07-15T19:00:00Z',
  },
  {
    id: '5', memberId: 'GYM-2026-005', firstName: 'Vikram', lastName: 'Singh',
    email: 'vikram.singh@email.com', phone: '+91 98765 43218', gender: 'male',
    dateOfBirth: '1990-07-19', joinDate: '2024-05-20', status: 'expired',
    membership: { id: 'm5', type: 'standard', planName: 'Standard Semi-Annual', startDate: '2025-05-20', endDate: '2026-05-20', price: 14999, currency: 'INR', autoRenew: false },
    emergencyContact: { name: 'Anita Singh', relationship: 'Spouse', phone: '+91 98765 43219' },
    tags: ['strength'], lastVisit: '2026-05-15', totalVisits: 67,
    createdAt: '2024-05-20T10:00:00Z', updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    id: '6', memberId: 'GYM-2026-006', firstName: 'Ananya', lastName: 'Gupta',
    email: 'ananya.gupta@email.com', phone: '+91 98765 43220', gender: 'female',
    dateOfBirth: '1993-11-08', joinDate: '2024-06-01', status: 'active',
    membership: { id: 'm6', type: 'premium', planName: 'Premium Semi-Annual', startDate: '2026-06-01', endDate: '2026-12-01', price: 19999, currency: 'INR', autoRenew: true, sessionsRemaining: 60, totalSessions: 72 },
    emergencyContact: { name: 'Rajesh Gupta', relationship: 'Father', phone: '+91 98765 43221' },
    assignedTrainer: { id: 't2', name: 'Neha Agarwal', specialization: 'Yoga & Pilates' },
    tags: ['premium', 'pilates', 'yoga'], lastVisit: '2026-07-19', totalVisits: 112,
    createdAt: '2024-06-01T10:00:00Z', updatedAt: '2026-07-19T18:00:00Z',
  },
  {
    id: '7', memberId: 'GYM-2026-007', firstName: 'Ravi', lastName: 'Kumar',
    email: 'ravi.kumar@email.com', phone: '+91 98765 43222', gender: 'male',
    dateOfBirth: '1996-01-25', joinDate: '2025-01-10', status: 'active',
    membership: { id: 'm7', type: 'standard', planName: 'Standard Annual', startDate: '2026-01-10', endDate: '2027-01-10', price: 15999, currency: 'INR', autoRenew: true, sessionsRemaining: 80, totalSessions: 100 },
    emergencyContact: { name: 'Sunita Kumar', relationship: 'Mother', phone: '+91 98765 43223' },
    tags: ['boxing', 'hiit'], lastVisit: '2026-07-20', totalVisits: 178,
    createdAt: '2025-01-10T10:00:00Z', updatedAt: '2026-07-20T07:00:00Z',
  },
  {
    id: '8', memberId: 'GYM-2026-008', firstName: 'Meera', lastName: 'Iyer',
    email: 'meera.iyer@email.com', phone: '+91 98765 43224', gender: 'female',
    dateOfBirth: '1999-06-14', joinDate: '2025-02-15', status: 'active',
    membership: { id: 'm8', type: 'basic', planName: 'Basic Monthly', startDate: '2026-07-15', endDate: '2026-08-15', price: 2999, currency: 'INR', autoRenew: true },
    emergencyContact: { name: 'Ganesh Iyer', relationship: 'Father', phone: '+91 98765 43225' },
    tags: ['spinning', 'cardio'], lastVisit: '2026-07-17', totalVisits: 92,
    createdAt: '2025-02-15T10:00:00Z', updatedAt: '2026-07-17T20:00:00Z',
  },
  {
    id: '9', memberId: 'GYM-2026-009', firstName: 'Deepak', lastName: 'Joshi',
    email: 'deepak.joshi@email.com', phone: '+91 98765 43226', gender: 'male',
    dateOfBirth: '1985-09-30', joinDate: '2025-03-01', status: 'active',
    membership: { id: 'm9', type: 'premium', planName: 'Premium Annual', startDate: '2026-03-01', endDate: '2027-03-01', price: 24999, currency: 'INR', autoRenew: true, sessionsRemaining: 55, totalSessions: 120 },
    emergencyContact: { name: 'Pooja Joshi', relationship: 'Spouse', phone: '+91 98765 43227' },
    medicalNotes: 'Lower back disc issue — no deadlifts, use alternatives.',
    assignedTrainer: { id: 't1', name: 'Suresh Kumar', specialization: 'Strength Training' },
    tags: ['premium', 'strength', 'crossfit'], lastVisit: '2026-07-20', totalVisits: 198,
    createdAt: '2025-03-01T10:00:00Z', updatedAt: '2026-07-20T06:30:00Z',
  },
  {
    id: '10', memberId: 'GYM-2026-010', firstName: 'Priya', lastName: 'Menon',
    email: 'priya.menon@email.com', phone: '+91 98765 43228', gender: 'female',
    dateOfBirth: '1994-04-12', joinDate: '2025-04-20', status: 'active',
    membership: { id: 'm10', type: 'standard', planName: 'Standard Quarterly', startDate: '2026-04-20', endDate: '2026-10-20', price: 8999, currency: 'INR', autoRenew: true, sessionsRemaining: 15, totalSessions: 36 },
    emergencyContact: { name: 'Krishna Menon', relationship: 'Brother', phone: '+91 98765 43229' },
    tags: ['yoga', 'pilates'], lastVisit: '2026-07-19', totalVisits: 67,
    createdAt: '2025-04-20T10:00:00Z', updatedAt: '2026-07-19T09:00:00Z',
  },
  {
    id: '11', memberId: 'GYM-2026-011', firstName: 'Amit', lastName: 'Verma',
    email: 'amit.verma@email.com', phone: '+91 98765 43230', gender: 'male',
    dateOfBirth: '1991-02-14', joinDate: '2025-06-01', status: 'active',
    membership: { id: 'm11', type: 'vip', planName: 'VIP Annual', startDate: '2026-06-01', endDate: '2027-06-01', price: 49999, currency: 'INR', autoRenew: true, sessionsRemaining: 180, totalSessions: 200 },
    emergencyContact: { name: 'Neha Verma', relationship: 'Spouse', phone: '+91 98765 43231' },
    assignedTrainer: { id: 't3', name: 'Raj Malhotra', specialization: 'HIIT & Zumba' },
    tags: ['vip', 'crossfit', 'hiit'], lastVisit: '2026-07-20', totalVisits: 145,
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2026-07-20T07:30:00Z',
  },
  {
    id: '12', memberId: 'GYM-2026-012', firstName: 'Divya', lastName: 'Krishnan',
    email: 'divya.krishnan@email.com', phone: '+91 98765 43232', gender: 'female',
    dateOfBirth: '1998-10-05', joinDate: '2025-08-15', status: 'suspended',
    membership: { id: 'm12', type: 'standard', planName: 'Standard Annual', startDate: '2025-08-15', endDate: '2026-08-15', price: 15999, currency: 'INR', autoRenew: false, sessionsRemaining: 40, totalSessions: 100 },
    emergencyContact: { name: 'Raman Krishnan', relationship: 'Father', phone: '+91 98765 43233' },
    medicalNotes: 'Pregnant — 2nd trimester. Light exercises only. No high-impact.',
    tags: ['yoga', 'light-exercise'], lastVisit: '2026-06-10', totalVisits: 78,
    notes: 'Membership suspended due to medical leave. Resume in September.',
    createdAt: '2025-08-15T10:00:00Z', updatedAt: '2026-06-10T10:00:00Z',
  },
]

// ============================================
// Mock Attendance for a member
// ============================================

export function getMemberAttendance(_memberId: string): AttendanceRecord[] {
  return [
    { id: 'att-1', date: '2026-07-20', checkIn: '06:55 AM', checkOut: '08:05 AM', className: 'Morning Yoga', status: 'present' },
    { id: 'att-2', date: '2026-07-19', checkIn: '07:02 AM', checkOut: '08:00 AM', className: 'Morning Yoga', status: 'present' },
    { id: 'att-3', date: '2026-07-18', checkIn: '08:35 AM', className: 'HIIT Blast', status: 'late' },
    { id: 'att-4', date: '2026-07-17', checkIn: '06:58 AM', checkOut: '08:10 AM', className: 'Morning Yoga', status: 'present' },
    { id: 'att-5', date: '2026-07-16', checkIn: '10:02 AM', checkOut: '11:00 AM', className: 'Strength Lab', status: 'present' },
    { id: 'att-6', date: '2026-07-15', checkIn: '07:00 AM', checkOut: '08:00 AM', className: 'Morning Yoga', status: 'present' },
    { id: 'att-7', date: '2026-07-14', checkIn: '08:30 AM', className: 'HIIT Blast', status: 'present' },
    { id: 'att-8', date: '2026-07-13', checkIn: '06:50 AM', checkOut: '08:00 AM', className: 'Morning Yoga', status: 'present' },
  ]
}

// ============================================
// Mock Payments for a member
// ============================================

export function getMemberPayments(_memberId: string): PaymentRecord[] {
  return [
    { id: 'pay-1', invoiceNumber: 'INV-2026-041', amount: 24999, method: 'upi', status: 'paid', description: 'Premium Annual Membership', date: '2026-01-15', paidDate: '2026-01-15' },
    { id: 'pay-2', invoiceNumber: 'INV-2025-089', amount: 24999, method: 'upi', status: 'paid', description: 'Premium Annual Membership', date: '2025-01-15', paidDate: '2025-01-15' },
    { id: 'pay-3', invoiceNumber: 'INV-2025-045', amount: 5000, method: 'card', status: 'paid', description: 'Personal Training (10 sessions)', date: '2025-06-01', paidDate: '2025-06-01' },
    { id: 'pay-4', invoiceNumber: 'INV-2024-112', amount: 19999, method: 'netbanking', status: 'paid', description: 'Premium Semi-Annual', date: '2024-07-15', paidDate: '2024-07-15' },
  ]
}

// ============================================
// API Functions (simulated)
// ============================================

export async function fetchMembers(): Promise<Member[]> {
  await delay(300)
  return [...MOCK_MEMBERS]
}

export async function fetchMemberById(id: string): Promise<Member | undefined> {
  await delay(200)
  return MOCK_MEMBERS.find(m => m.id === id)
}

export async function createMember(data: Partial<Member>): Promise<Member> {
  await delay(400)
  const newMember: Member = {
    id: String(Date.now()),
    memberId: `GYM-2026-${String(MOCK_MEMBERS.length + 1).padStart(3, '0')}`,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    gender: data.gender || 'male',
    dateOfBirth: data.dateOfBirth || '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    membership: data.membership || {
      id: `m-new-${Date.now()}`, type: 'standard', planName: 'Standard',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      price: 8999, currency: 'INR', autoRenew: false,
    },
    emergencyContact: data.emergencyContact || { name: '', relationship: '', phone: '' },
    tags: data.tags || [],
    totalVisits: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  }
  MOCK_MEMBERS.unshift(newMember)
  return newMember
}

export async function updateMember(id: string, data: Partial<Member>): Promise<Member> {
  await delay(300)
  const index = MOCK_MEMBERS.findIndex(m => m.id === id)
  if (index === -1) throw new Error('Member not found')
  MOCK_MEMBERS[index] = { ...MOCK_MEMBERS[index], ...data, updatedAt: new Date().toISOString() }
  return MOCK_MEMBERS[index]
}

export async function deleteMember(id: string): Promise<void> {
  await delay(250)
  const index = MOCK_MEMBERS.findIndex(m => m.id === id)
  if (index !== -1) MOCK_MEMBERS.splice(index, 1)
}

export async function renewMembership(memberId: string): Promise<Member> {
  await delay(400)
  const member = MOCK_MEMBERS.find(m => m.id === memberId)
  if (!member) throw new Error('Member not found')
  const newEnd = new Date(member.membership.endDate)
  newEnd.setFullYear(newEnd.getFullYear() + 1)
  member.membership.endDate = newEnd.toISOString().split('T')[0]
  member.membership.sessionsRemaining = member.membership.totalSessions || 120
  member.status = 'active'
  member.updatedAt = new Date().toISOString()
  return member
}
