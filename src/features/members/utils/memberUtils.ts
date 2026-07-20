import type { Member, MemberFormData, MemberStatus, MembershipType } from '../types/member.types'

/** Format member name */
export function getMemberName(member: Pick<Member, 'firstName' | 'lastName'>): string {
  return `${member.firstName} ${member.lastName}`
}

/** Get initials from member name */
export function getMemberInitials(member: Pick<Member, 'firstName' | 'lastName'>): string {
  return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
}

/** Days until membership expires */
export function daysUntilExpiry(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/** Is membership expiring soon (within N days) */
export function isExpiringSoon(endDate: string, days: number = 30): boolean {
  const remaining = daysUntilExpiry(endDate)
  return remaining > 0 && remaining <= days
}

/** Is membership expired */
export function isExpired(endDate: string): boolean {
  return daysUntilExpiry(endDate) <= 0
}

/** Badge variant for member status */
export function getStatusVariant(status: MemberStatus): 'success' | 'gray' | 'error' | 'warning' | 'info' {
  const map: Record<MemberStatus, 'success' | 'gray' | 'error' | 'warning' | 'info'> = {
    active: 'success', inactive: 'gray', expired: 'error', suspended: 'warning', pending: 'info',
  }
  return map[status]
}

/** Badge variant for membership type */
export function getMembershipVariant(type: MembershipType): 'default' | 'gray' | 'premium' | 'vip' {
  const map: Record<MembershipType, 'default' | 'gray' | 'premium' | 'vip'> = {
    basic: 'gray', standard: 'default', premium: 'premium', vip: 'vip', custom: 'default',
  }
  return map[type]
}

/** Convert form data to Member partial */
export function formDataToMember(data: MemberFormData): Partial<Member> {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    membership: {
      id: `m-${Date.now()}`,
      type: data.membershipType,
      planName: data.planName,
      startDate: data.startDate,
      endDate: data.endDate,
      price: data.price,
      currency: 'INR',
      autoRenew: data.autoRenew,
    },
    emergencyContact: {
      name: data.emergencyContactName,
      phone: data.emergencyContactPhone,
      relationship: data.emergencyContactRelationship,
    },
    address: data.address ? {
      street: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: 'India',
    } : undefined,
    medicalNotes: data.medicalNotes || undefined,
    notes: data.notes || undefined,
    tags: data.tags || [],
  }
}

/** Convert Member to form data */
export function memberToFormData(member: Member): MemberFormData {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    gender: member.gender,
    dateOfBirth: member.dateOfBirth,
    membershipType: member.membership.type,
    planName: member.membership.planName,
    startDate: member.membership.startDate,
    endDate: member.membership.endDate,
    price: member.membership.price,
    autoRenew: member.membership.autoRenew,
    emergencyContactName: member.emergencyContact.name,
    emergencyContactPhone: member.emergencyContact.phone,
    emergencyContactRelationship: member.emergencyContact.relationship,
    address: member.address?.street || '',
    city: member.address?.city || '',
    state: member.address?.state || '',
    pincode: member.address?.pincode || '',
    medicalNotes: member.medicalNotes || '',
    notes: member.notes || '',
    tags: member.tags || [],
  }
}

/** Export members to CSV */
export function exportMembersToCSV(members: Member[]): void {
  const headers = [
    'Member ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Gender',
    'Status', 'Plan', 'Plan Type', 'Price', 'Start Date', 'End Date',
    'Total Visits', 'Last Visit', 'Joined Date',
  ]

  const rows = members.map(m => [
    m.memberId, m.firstName, m.lastName, m.email, m.phone, m.gender,
    m.status, m.membership.planName, m.membership.type, m.membership.price,
    m.membership.startDate, m.membership.endDate, m.totalVisits,
    m.lastVisit || 'Never', m.joinDate,
  ])

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `members-export-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

/** Parse CSV to member data (simplified) */
export function parseCSVToMembers(csvText: string): Partial<Member>[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => { obj[h] = values[i] || '' })
    return {
      firstName: obj['First Name'] || obj['firstName'] || '',
      lastName: obj['Last Name'] || obj['lastName'] || '',
      email: obj['Email'] || obj['email'] || '',
      phone: obj['Phone'] || obj['phone'] || '',
      gender: (obj['Gender'] || obj['gender'] || 'male') as Member['gender'],
    }
  })
}
