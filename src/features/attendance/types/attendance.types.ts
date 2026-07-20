// ============================================
// Attendance Module Types
// ============================================

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type CheckInMethod = 'manual' | 'biometric' | 'qr_code' | 'app'

export interface AttendanceRecord {
  id: string
  memberId: string
  memberName: string
  memberEmail: string
  classId?: string
  className?: string
  trainerName?: string
  checkIn: string
  checkOut?: string
  duration?: number // minutes
  status: AttendanceStatus
  method: CheckInMethod
  date: string
  notes?: string
}

export interface AttendanceStats {
  totalCheckedIn: number
  onTime: number
  late: number
  expectedToday: number
  checkedInPercentage: number
  avgCheckInTime: string
  peakHour: string
  totalThisWeek: number
  totalThisMonth: number
  avgDailyThisMonth: number
}

export interface DailyAttendanceSummary {
  date: string
  total: number
  onTime: number
  late: number
  absent: number
}

export interface CalendarDay {
  date: string
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  total: number
  onTime: number
  late: number
}

export interface AttendanceFilters {
  search: string
  status: AttendanceStatus | 'all'
  dateFrom: string
  dateTo: string
  classFilter: string | 'all'
}

export interface CheckInPayload {
  memberId: string
  classId?: string
  method: CheckInMethod
  notes?: string
}

export interface MonthlyStats {
  month: string
  workingDays: number
  avgAttendance: number
  bestDay: string
  worstDay: string
  latePercentage: number
  totalCheckIns: number
}
