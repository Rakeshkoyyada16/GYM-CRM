import { useState, useEffect } from 'react'
import type {
  DashboardStats, RevenueChartPoint, AttendanceChartPoint,
  MembershipGrowthPoint, RecentMember, RecentPayment,
  TopTrainer, ActivityItem, CalendarEvent, Announcement, TodayClass,
} from '../types/dashboard.types'

/**
 * Simulated API delay
 */
const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ============================================
// Mock Data
// ============================================

const mockStats: DashboardStats = {
  todayRevenue: 42500,
  monthlyRevenue: 385000,
  revenueGrowth: 12.5,
  totalMembers: 847,
  activeMembers: 623,
  inactiveMembers: 224,
  memberGrowth: 8.3,
  expiringMemberships: 8,
  todayAttendance: 156,
  attendanceGrowth: 3.1,
  newLeads: 14,
  pendingPayments: 12,
  pendingAmount: 67800,
  todayClasses: 6,
  classOccupancy: 82,
}

const mockRevenueChart: RevenueChartPoint[] = [
  { month: 'Aug', revenue: 320000, expenses: 180000 },
  { month: 'Sep', revenue: 335000, expenses: 185000 },
  { month: 'Oct', revenue: 310000, expenses: 175000 },
  { month: 'Nov', revenue: 345000, expenses: 190000 },
  { month: 'Dec', revenue: 380000, expenses: 200000 },
  { month: 'Jan', revenue: 420000, expenses: 210000 },
  { month: 'Feb', revenue: 395000, expenses: 205000 },
  { month: 'Mar', revenue: 410000, expenses: 215000 },
  { month: 'Apr', revenue: 385000, expenses: 195000 },
  { month: 'May', revenue: 370000, expenses: 190000 },
  { month: 'Jun', revenue: 390000, expenses: 200000 },
  { month: 'Jul', revenue: 385000, expenses: 195000 },
]

const mockAttendanceChart: AttendanceChartPoint[] = [
  { day: 'Mon', checkIns: 145, checkOuts: 138, newMembers: 5 },
  { day: 'Tue', checkIns: 168, checkOuts: 160, newMembers: 3 },
  { day: 'Wed', checkIns: 152, checkOuts: 147, newMembers: 7 },
  { day: 'Thu', checkIns: 178, checkOuts: 172, newMembers: 4 },
  { day: 'Fri', checkIns: 195, checkOuts: 188, newMembers: 6 },
  { day: 'Sat', checkIns: 210, checkOuts: 205, newMembers: 8 },
  { day: 'Sun', checkIns: 120, checkOuts: 115, newMembers: 2 },
]

const mockMembershipGrowth: MembershipGrowthPoint[] = [
  { month: 'Feb', total: 720, active: 580 },
  { month: 'Mar', total: 745, active: 598 },
  { month: 'Apr', total: 758, active: 605 },
  { month: 'May', total: 780, active: 610 },
  { month: 'Jun', total: 812, active: 618 },
  { month: 'Jul', total: 847, active: 623 },
]

const mockRecentMembers: RecentMember[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@email.com', plan: 'Premium Annual', planType: 'premium', status: 'active', joinedAt: '2h ago', amount: 24999 },
  { id: '2', name: 'Sneha Patel', email: 'sneha@email.com', plan: 'Standard Quarterly', planType: 'standard', status: 'active', joinedAt: '5h ago', amount: 8999 },
  { id: '3', name: 'Arjun Reddy', email: 'arjun@email.com', plan: 'VIP Annual', planType: 'vip', status: 'active', joinedAt: '1d ago', amount: 49999 },
  { id: '4', name: 'Kavya Nair', email: 'kavya@email.com', plan: 'Basic Monthly', planType: 'basic', status: 'pending', joinedAt: '1d ago', amount: 2999 },
  { id: '5', name: 'Deepak Joshi', email: 'deepak@email.com', plan: 'Premium Annual', planType: 'premium', status: 'active', joinedAt: '2d ago', amount: 24999 },
]

const mockRecentPayments: RecentPayment[] = [
  { id: 'p1', memberName: 'Rahul Sharma', amount: 24999, method: 'upi', status: 'paid', date: '2h ago', invoiceNumber: 'INV-2026-041' },
  { id: 'p2', memberName: 'Arjun Reddy', amount: 49999, method: 'netbanking', status: 'paid', date: '5h ago', invoiceNumber: 'INV-2026-040' },
  { id: 'p3', memberName: 'Kavya Nair', amount: 2999, method: 'upi', status: 'pending', date: '1d ago', invoiceNumber: 'INV-2026-039' },
  { id: 'p4', memberName: 'Meera Iyer', amount: 2999, method: 'card', status: 'unpaid', date: '2d ago', invoiceNumber: 'INV-2026-038' },
  { id: 'p5', memberName: 'Deepak Joshi', amount: 24999, method: 'netbanking', status: 'paid', date: '3d ago', invoiceNumber: 'INV-2026-037' },
]

const mockTopTrainers: TopTrainer[] = [
  { id: 't1', name: 'Suresh Kumar', specialization: 'Strength & CrossFit', rating: 4.8, clients: 45, trend: 'up' },
  { id: 't2', name: 'Neha Agarwal', specialization: 'Yoga & Pilates', rating: 4.9, clients: 38, trend: 'up' },
  { id: 't3', name: 'Raj Malhotra', specialization: 'HIIT & Zumba', rating: 4.7, clients: 52, trend: 'stable' },
  { id: 't4', name: 'Divya Prasad', specialization: 'Boxing & Kickboxing', rating: 4.6, clients: 30, trend: 'down' },
]

const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'member_joined', message: 'Rahul Sharma joined Premium plan', timestamp: '2 min ago', icon: '👤' },
  { id: 'a2', type: 'payment', message: 'Payment of ₹24,999 received from Arjun Reddy', timestamp: '15 min ago', icon: '💳' },
  { id: 'a3', type: 'class_full', message: 'HIIT Blast reached full capacity (20/20)', timestamp: '1 hour ago', icon: '🔥' },
  { id: 'a4', type: 'check_in', message: 'Sneha Patel checked in for Morning Yoga', timestamp: '2 hours ago', icon: '✅' },
  { id: 'a5', type: 'membership_expired', message: "Vikram Singh's membership expired", timestamp: '3 hours ago', icon: '⏰' },
  { id: 'a6', type: 'trainer_assigned', message: 'Raj Malhotra assigned to new class: Evening Cardio', timestamp: '4 hours ago', icon: '🏋️' },
  { id: 'a7', type: 'member_joined', message: 'Ananya Gupta renewed Premium Semi-Annual', timestamp: '5 hours ago', icon: '🔄' },
  { id: 'a8', type: 'payment', message: 'Payment reminder sent to 8 members', timestamp: '6 hours ago', icon: '📧' },
]

const mockCalendarEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Morning Yoga Flow', time: '7:00 AM', type: 'class', color: 'bg-purple-100 text-purple-700' },
  { id: 'e2', title: 'HIIT Blast', time: '8:30 AM', type: 'class', color: 'bg-red-100 text-red-700' },
  { id: 'e3', title: 'Strength & Power', time: '10:00 AM', type: 'class', color: 'bg-blue-100 text-blue-700' },
  { id: 'e4', title: 'Trainer Meeting', time: '12:00 PM', type: 'appointment', color: 'bg-amber-100 text-amber-700' },
  { id: 'e5', title: 'Equipment Maintenance', time: '2:00 PM', type: 'maintenance', color: 'bg-gray-100 text-gray-600' },
  { id: 'e6', title: 'Zumba Party', time: '5:00 PM', type: 'class', color: 'bg-pink-100 text-pink-700' },
  { id: 'e7', title: 'Boxing Fundamentals', time: '6:30 PM', type: 'class', color: 'bg-orange-100 text-orange-700' },
]

const mockAnnouncements: Announcement[] = [
  { id: 'an1', title: 'Monsoon Fitness Challenge', body: 'Join our 30-day challenge starting Aug 1st. ₹500 entry fee, winners get free 3-month membership!', type: 'info', date: 'Today' },
  { id: 'an2', title: 'New Spin Studio Opening', body: 'Our new spinning studio with 30 bikes opens next Monday. Early bird classes at 50% off.', type: 'success', date: 'Yesterday' },
  { id: 'an3', title: 'Maintenance Notice', body: 'Pool area will be closed for maintenance on July 25-26. We apologize for the inconvenience.', type: 'warning', date: 'Jul 18' },
]

const mockTodayClasses: TodayClass[] = [
  { id: 'c1', name: 'Morning Yoga', time: '7:00 AM', trainer: 'Neha A.', enrolled: 18, capacity: 25, emoji: '🧘', status: 'completed' },
  { id: 'c2', name: 'HIIT Blast', time: '8:30 AM', trainer: 'Raj M.', enrolled: 20, capacity: 20, emoji: '🔥', status: 'completed' },
  { id: 'c3', name: 'Strength Lab', time: '10:00 AM', trainer: 'Suresh K.', enrolled: 12, capacity: 15, emoji: '💪', status: 'ongoing' },
  { id: 'c4', name: 'Zumba Party', time: '5:00 PM', trainer: 'Raj M.', enrolled: 22, capacity: 30, emoji: '💃', status: 'upcoming' },
  { id: 'c5', name: 'Boxing 101', time: '6:30 PM', trainer: 'Divya P.', enrolled: 10, capacity: 12, emoji: '🥊', status: 'upcoming' },
  { id: 'c6', name: 'CrossFit WOD', time: '7:30 PM', trainer: 'Suresh K.', enrolled: 8, capacity: 15, emoji: '🏋️', status: 'upcoming' },
]

// ============================================
// Hooks
// ============================================

function useDashboardData<T>(mockData: T, delayMs: number = 300) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      await delay(delayMs)
      if (!cancelled) {
        setData(mockData)
        setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { data, isLoading }
}

export function useDashboardStats() {
  return useDashboardData(mockStats, 200)
}

export function useRevenueChart() {
  return useDashboardData(mockRevenueChart, 400)
}

export function useAttendanceChart() {
  return useDashboardData(mockAttendanceChart, 350)
}

export function useMembershipGrowth() {
  return useDashboardData(mockMembershipGrowth, 300)
}

export function useRecentMembers() {
  return useDashboardData(mockRecentMembers, 250)
}

export function useRecentPayments() {
  return useDashboardData(mockRecentPayments, 280)
}

export function useTopTrainers() {
  return useDashboardData(mockTopTrainers, 320)
}

export function useActivityFeed() {
  return useDashboardData(mockActivity, 200)
}

export function useCalendarEvents() {
  return useDashboardData(mockCalendarEvents, 150)
}

export function useAnnouncements() {
  return useDashboardData(mockAnnouncements, 180)
}

export function useTodayClasses() {
  return useDashboardData(mockTodayClasses, 220)
}
