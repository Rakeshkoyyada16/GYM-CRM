import type {
  AttendanceRecord, AttendanceStats, CalendarDay,
  DailyAttendanceSummary, MonthlyStats, CheckInPayload,
} from '../types/attendance.types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ============================================
// Mock Members for check-in
// ============================================

const MEMBERS = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@email.com' },
  { id: '2', name: 'Sneha Patel', email: 'sneha@email.com' },
  { id: '3', name: 'Arjun Reddy', email: 'arjun@email.com' },
  { id: '4', name: 'Kavya Nair', email: 'kavya@email.com' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@email.com' },
  { id: '6', name: 'Ananya Gupta', email: 'ananya@email.com' },
  { id: '7', name: 'Ravi Kumar', email: 'ravi@email.com' },
  { id: '8', name: 'Meera Iyer', email: 'meera@email.com' },
  { id: '9', name: 'Deepak Joshi', email: 'deepak@email.com' },
  { id: '10', name: 'Priya Menon', email: 'priya@email.com' },
  { id: '11', name: 'Amit Verma', email: 'amit@email.com' },
  { id: '12', name: 'Divya Krishnan', email: 'divya@email.com' },
]

const CLASSES = [
  { id: 'c1', name: 'Morning Yoga', trainer: 'Neha Agarwal' },
  { id: 'c2', name: 'HIIT Blast', trainer: 'Raj Malhotra' },
  { id: 'c3', name: 'Strength Lab', trainer: 'Suresh Kumar' },
  { id: 'c4', name: 'Zumba Party', trainer: 'Raj Malhotra' },
  { id: 'c5', name: 'Boxing 101', trainer: 'Divya Prasad' },
  { id: 'c6', name: 'CrossFit WOD', trainer: 'Suresh Kumar' },
]

// ============================================
// Mock Attendance Data
// ============================================

const today = new Date().toISOString().split('T')[0]

function makeTime(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function makeRecord(
  id: string, memberIdx: number, classIdx: number | null,
  checkInH: number, checkInM: number,
  checkOutH?: number, checkOutM?: number,
  status: AttendanceRecord['status'] = 'present',
  date: string = today
): AttendanceRecord {
  const m = MEMBERS[memberIdx]
  const c = classIdx !== null ? CLASSES[classIdx] : null
  const checkIn = makeTime(checkInH, checkInM)
  const checkOut = checkOutH !== undefined ? makeTime(checkOutH, checkOutM!) : undefined
  const duration = checkOutH !== undefined ? (checkOutH - checkInH) * 60 + (checkOutM! - checkInM) : undefined

  return {
    id, memberId: m.id, memberName: m.name, memberEmail: m.email,
    classId: c?.id, className: c?.name, trainerName: c?.trainer,
    checkIn, checkOut, duration, status, method: 'manual', date,
  }
}

const MOCK_TODAY: AttendanceRecord[] = [
  makeRecord('a1', 0, 2, 6, 55, 8, 5, 'present'),
  makeRecord('a2', 2, 5, 5, 58, 7, 5, 'present'),
  makeRecord('a3', 6, 1, 8, 35, undefined, undefined, 'late'),
  makeRecord('a4', 8, 2, 9, 58, 11, 0, 'present'),
  makeRecord('a5', 1, 0, 6, 55, 8, 5, 'present'),
  makeRecord('a6', 5, 0, 7, 10, undefined, undefined, 'late'),
  makeRecord('a7', 3, 3, 17, 0, 18, 0, 'present'),
  makeRecord('a8', 7, 3, 16, 55, 18, 5, 'present'),
  makeRecord('a9', 10, 1, 8, 28, 9, 15, 'present'),
  makeRecord('a10', 4, null, 9, 0, 10, 30, 'present'),
  makeRecord('a11', 11, 0, 7, 0, 8, 0, 'present'),
]

// Generate history for last 30 days
function generateHistory(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  let idCounter = 100

  for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
    const d = new Date()
    d.setDate(d.getDate() - dayOffset)
    const dateStr = d.toISOString().split('T')[0]
    const isWeekend = d.getDay() === 0
    const count = isWeekend ? 3 : Math.floor(Math.random() * 6) + 5

    for (let i = 0; i < count; i++) {
      const memberIdx = Math.floor(Math.random() * MEMBERS.length)
      const classIdx = Math.random() > 0.15 ? Math.floor(Math.random() * CLASSES.length) : null
      const h = 6 + Math.floor(Math.random() * 14)
      const m = Math.floor(Math.random() * 60)
      const statusRoll = Math.random()
      const status: AttendanceRecord['status'] = statusRoll < 0.85 ? 'present' : statusRoll < 0.95 ? 'late' : 'absent'

      records.push(
        makeRecord(`h${idCounter++}`, memberIdx, classIdx, h, m, h + 1, m, status, dateStr)
      )
    }
  }

  return records
}

const MOCK_HISTORY = generateHistory()

// ============================================
// API Functions
// ============================================

export function getMembers() {
  return MEMBERS
}

export function getClasses() {
  return CLASSES
}

export async function fetchTodayAttendance(): Promise<AttendanceRecord[]> {
  await delay(250)
  return [...MOCK_TODAY]
}

export async function fetchAttendanceHistory(): Promise<AttendanceRecord[]> {
  await delay(350)
  return [...MOCK_HISTORY]
}

export async function fetchAttendanceStats(): Promise<AttendanceStats> {
  await delay(200)
  const total = MOCK_TODAY.length
  const onTime = MOCK_TODAY.filter(r => r.status === 'present').length
  const late = MOCK_TODAY.filter(r => r.status === 'late').length
  return {
    totalCheckedIn: total,
    onTime,
    late,
    expectedToday: 45,
    checkedInPercentage: Math.round((total / 45) * 100),
    avgCheckInTime: '8:12 AM',
    peakHour: '7:00 - 9:00 AM',
    totalThisWeek: total + 156,
    totalThisMonth: total + 680,
    avgDailyThisMonth: 38,
  }
}

export async function fetchMonthlyStats(): Promise<MonthlyStats> {
  await delay(180)
  return {
    month: 'July 2026',
    workingDays: 22,
    avgAttendance: 38,
    bestDay: 'Saturday, Jul 19',
    worstDay: 'Sunday, Jul 13',
    latePercentage: 12,
    totalCheckIns: 680,
  }
}

export async function checkInMember(payload: CheckInPayload): Promise<AttendanceRecord> {
  await delay(300)
  const member = MEMBERS.find(m => m.id === payload.memberId)!
  const gymClass = payload.classId ? CLASSES.find(c => c.id === payload.classId) : undefined
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const status: AttendanceRecord['status'] = h >= 10 ? 'late' : 'present'

  const record: AttendanceRecord = {
    id: `ci-${Date.now()}`,
    memberId: payload.memberId,
    memberName: member.name,
    memberEmail: member.email,
    classId: gymClass?.id,
    className: gymClass?.name,
    trainerName: gymClass?.trainer,
    checkIn: makeTime(h, m),
    status,
    method: payload.method,
    date: today,
    notes: payload.notes,
  }
  MOCK_TODAY.unshift(record)
  return record
}

export async function checkOutMember(recordId: string): Promise<AttendanceRecord> {
  await delay(200)
  const record = MOCK_TODAY.find(r => r.id === recordId)
  if (!record) throw new Error('Record not found')
  const now = new Date()
  record.checkOut = makeTime(now.getHours(), now.getMinutes())
  const [inH, inM] = record.checkIn.split(':').map(Number)
  record.duration = (now.getHours() - inH) * 60 + (now.getMinutes() - inM)
  return record
}

export async function fetchCalendarDays(year: number, month: number): Promise<CalendarDay[]> {
  await delay(200)
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay()
  const todayDate = new Date().toISOString().split('T')[0]
  const days: CalendarDay[] = []

  // Previous month padding
  const prevLast = new Date(year, month, 0)
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevLast.getDate() - i
    const dateStr = new Date(year, month - 1, d).toISOString().split('T')[0]
    days.push({ date: dateStr, dayOfMonth: d, isCurrentMonth: false, isToday: false, total: 0, onTime: 0, late: 0 })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = new Date(year, month, d).toISOString().split('T')[0]
    const isWeekend = new Date(year, month, d).getDay() === 0
    const total = isWeekend ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 30) + 20
    const late = Math.floor(total * (Math.random() * 0.15))
    days.push({ date: dateStr, dayOfMonth: d, isCurrentMonth: true, isToday: dateStr === todayDate, total, onTime: total - late, late })
  }

  // Next month padding
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const dateStr = new Date(year, month + 1, d).toISOString().split('T')[0]
    days.push({ date: dateStr, dayOfMonth: d, isCurrentMonth: false, isToday: false, total: 0, onTime: 0, late: 0 })
  }

  return days
}

export async function exportAttendanceCSV(records: AttendanceRecord[]): Promise<void> {
  await delay(200)
  const headers = ['Date', 'Member', 'Email', 'Class', 'Trainer', 'Check In', 'Check Out', 'Duration (min)', 'Status', 'Method']
  const rows = records.map(r => [
    r.date, r.memberName, r.memberEmail, r.className || 'General', r.trainerName || '—',
    r.checkIn, r.checkOut || '—', r.duration?.toString() || '—', r.status, r.method,
  ])
  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
