// ============================================
// Dashboard Domain Types
// ============================================

export interface DashboardStats {
  todayRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  memberGrowth: number
  expiringMemberships: number
  todayAttendance: number
  attendanceGrowth: number
  newLeads: number
  pendingPayments: number
  pendingAmount: number
  todayClasses: number
  classOccupancy: number
}

export interface RevenueChartPoint {
  month: string
  revenue: number
  expenses: number
}

export interface AttendanceChartPoint {
  day: string
  checkIns: number
  checkOuts: number
  newMembers: number
}

export interface MembershipGrowthPoint {
  month: string
  total: number
  active: number
}

export interface RecentMember {
  id: string
  name: string
  email: string
  avatar?: string
  plan: string
  planType: 'basic' | 'standard' | 'premium' | 'vip'
  status: 'active' | 'pending' | 'expired'
  joinedAt: string
  amount: number
}

export interface RecentPayment {
  id: string
  memberName: string
  amount: number
  method: 'upi' | 'card' | 'netbanking' | 'cash'
  status: 'paid' | 'pending' | 'unpaid'
  date: string
  invoiceNumber: string
}

export interface TopTrainer {
  id: string
  name: string
  specialization: string
  rating: number
  clients: number
  avatar?: string
  trend: 'up' | 'down' | 'stable'
}

export interface ActivityItem {
  id: string
  type: 'member_joined' | 'payment' | 'class_full' | 'check_in' | 'membership_expired' | 'trainer_assigned'
  message: string
  timestamp: string
  icon: string
}

export interface CalendarEvent {
  id: string
  title: string
  time: string
  type: 'class' | 'appointment' | 'maintenance'
  color: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  type: 'info' | 'warning' | 'success'
  date: string
}

export interface TodayClass {
  id: string
  name: string
  time: string
  trainer: string
  enrolled: number
  capacity: number
  emoji: string
  status: 'upcoming' | 'ongoing' | 'completed'
}
