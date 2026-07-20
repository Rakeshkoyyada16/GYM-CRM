import type { AttendanceStatus, AttendanceRecord } from '../types/attendance.types'

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'On Time', absent: 'Absent', late: 'Late', excused: 'Excused',
}

export function getStatusVariant(status: AttendanceStatus): 'success' | 'error' | 'warning' | 'gray' {
  const map: Record<AttendanceStatus, 'success' | 'error' | 'warning' | 'gray'> = {
    present: 'success', absent: 'error', late: 'warning', excused: 'gray',
  }
  return map[status]
}

export function getStatusIcon(status: AttendanceStatus): string {
  const map: Record<AttendanceStatus, string> = {
    present: '✓', absent: '✗', late: '⏰', excused: '⊘',
  }
  return map[status]
}

export function formatDuration(minutes: number | undefined): string {
  if (!minutes) return '—'
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function getHeatmapColor(total: number, max: number): string {
  if (total === 0) return 'bg-gray-50'
  const ratio = total / max
  if (ratio < 0.25) return 'bg-brand-50'
  if (ratio < 0.5) return 'bg-brand-100'
  if (ratio < 0.75) return 'bg-brand-200'
  return 'bg-brand-400 text-white'
}

export function getMonthName(month: number): string {
  const names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return names[month]
}

export function getDayOfWeek(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short' })
}

export function isLateCheckIn(checkInTime: string, threshold: string = '10:00'): boolean {
  return checkInTime > threshold
}
