// ============================================
// Reports Module Types
// ============================================

export type ReportPeriod = '7d' | '30d' | '90d' | '12m' | 'custom'
export type ReportType = 'revenue' | 'attendance' | 'memberships' | 'leads' | 'trainers' | 'payments'

export interface DateRange {
  from: string
  to: string
  period: ReportPeriod
}

export interface KPIMetric {
  label: string
  value: number | string
  change?: number
  changeLabel?: string
  format: 'number' | 'currency' | 'percentage' | 'duration'
  prefix?: string
  suffix?: string
}

// Revenue
export interface RevenueData {
  month: string
  revenue: number
  expenses: number
  profit: number
  memberships: number
  pt: number
  other: number
}

export interface RevenueSummary {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  avgMonthlyRevenue: number
  revenueGrowth: number
  topRevenueSource: string
  revenueBySource: { source: string; amount: number; percentage: number }[]
}

// Attendance
export interface AttendanceData {
  month: string
  avgDaily: number
  totalCheckIns: number
  peakHour: string
  latePercentage: number
}

export interface AttendanceSummary {
  avgDailyAttendance: number
  totalCheckIns: number
  peakDay: string
  peakHour: string
  latePercentage: number
  attendanceGrowth: number
  busiestDay: string
  quietestDay: string
}

export interface AttendanceByDay {
  day: string
  avg: number
  total: number
}

export interface AttendanceByHour {
  hour: string
  count: number
}

// Memberships
export interface MembershipData {
  month: string
  newMembers: number
  churned: number
  net: number
  total: number
}

export interface MembershipSummary {
  totalMembers: number
  activeMembers: number
  newThisPeriod: number
  churnRate: number
  avgLifetimeValue: number
  retentionRate: number
  popularPlan: string
  planBreakdown: { plan: string; count: number; revenue: number; percentage: number }[]
  statusBreakdown: { status: string; count: number; percentage: number }[]
}

// Leads
export interface LeadData {
  month: string
  newLeads: number
  converted: number
  lost: number
  conversionRate: number
}

export interface LeadSummary {
  totalLeads: number
  converted: number
  conversionRate: number
  avgConversionDays: number
  pipelineValue: number
  sourceBreakdown: { source: string; leads: number; converted: number; rate: number }[]
  statusBreakdown: { status: string; count: number; percentage: number }[]
}

// Trainers
export interface TrainerData {
  name: string
  clients: number
  classes: number
  rating: number
  revenue: number
  retention: number
}

export interface TrainerSummary {
  totalTrainers: number
  avgRating: number
  avgClientRetention: number
  totalClassesThisPeriod: number
  topPerformer: string
  utilizationRate: number
}

// Payments
export interface PaymentData {
  month: string
  collected: number
  pending: number
  overdue: number
}

export interface PaymentSummary {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  collectionRate: number
  avgPaymentValue: number
  methodBreakdown: { method: string; count: number; amount: number; percentage: number }[]
  typeBreakdown: { type: string; count: number; amount: number; percentage: number }[]
}

export interface ReportExportData {
  title: string
  period: string
  generatedAt: string
  sections: { heading: string; data: Record<string, string | number>[] }[]
}
