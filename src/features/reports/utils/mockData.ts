import type {
  RevenueData, RevenueSummary, AttendanceData, AttendanceSummary,
  AttendanceByDay, AttendanceByHour, MembershipData, MembershipSummary,
  LeadData, LeadSummary, TrainerData, TrainerSummary,
  PaymentData, PaymentSummary, ReportExportData,
} from '../types/report.types'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// ============================================
// Revenue
// ============================================

export async function fetchRevenueData(): Promise<RevenueData[]> {
  await delay(300)
  return [
    { month: 'Aug', revenue: 320000, expenses: 180000, profit: 140000, memberships: 260000, pt: 40000, other: 20000 },
    { month: 'Sep', revenue: 335000, expenses: 185000, profit: 150000, memberships: 275000, pt: 38000, other: 22000 },
    { month: 'Oct', revenue: 310000, expenses: 175000, profit: 135000, memberships: 250000, pt: 42000, other: 18000 },
    { month: 'Nov', revenue: 345000, expenses: 190000, profit: 155000, memberships: 285000, pt: 40000, other: 20000 },
    { month: 'Dec', revenue: 380000, expenses: 200000, profit: 180000, memberships: 310000, pt: 48000, other: 22000 },
    { month: 'Jan', revenue: 420000, expenses: 210000, profit: 210000, memberships: 350000, pt: 50000, other: 20000 },
    { month: 'Feb', revenue: 395000, expenses: 205000, profit: 190000, memberships: 325000, pt: 48000, other: 22000 },
    { month: 'Mar', revenue: 410000, expenses: 215000, profit: 195000, memberships: 340000, pt: 50000, other: 20000 },
    { month: 'Apr', revenue: 385000, expenses: 195000, profit: 190000, memberships: 315000, pt: 48000, other: 22000 },
    { month: 'May', revenue: 370000, expenses: 190000, profit: 180000, memberships: 300000, pt: 46000, other: 24000 },
    { month: 'Jun', revenue: 390000, expenses: 200000, profit: 190000, memberships: 320000, pt: 48000, other: 22000 },
    { month: 'Jul', revenue: 385000, expenses: 195000, profit: 190000, memberships: 315000, pt: 50000, other: 20000 },
  ]
}

export async function fetchRevenueSummary(): Promise<RevenueSummary> {
  await delay(200)
  return {
    totalRevenue: 4445000, totalExpenses: 2340000, netProfit: 2105000,
    profitMargin: 47, avgMonthlyRevenue: 370417, revenueGrowth: 12.5,
    topRevenueSource: 'Memberships',
    revenueBySource: [
      { source: 'Memberships', amount: 3625000, percentage: 82 },
      { source: 'Personal Training', amount: 548000, percentage: 12 },
      { source: 'Class Packages', amount: 178000, percentage: 4 },
      { source: 'Merchandise', amount: 54000, percentage: 1 },
      { source: 'Other', amount: 40000, percentage: 1 },
    ],
  }
}

// ============================================
// Attendance
// ============================================

export async function fetchAttendanceData(): Promise<AttendanceData[]> {
  await delay(300)
  return [
    { month: 'Feb', avgDaily: 32, totalCheckIns: 640, peakHour: '7-9 AM', latePercentage: 14 },
    { month: 'Mar', avgDaily: 35, totalCheckIns: 700, peakHour: '7-9 AM', latePercentage: 12 },
    { month: 'Apr', avgDaily: 33, totalCheckIns: 660, peakHour: '7-9 AM', latePercentage: 15 },
    { month: 'May', avgDaily: 38, totalCheckIns: 760, peakHour: '7-9 AM', latePercentage: 11 },
    { month: 'Jun', avgDaily: 36, totalCheckIns: 720, peakHour: '7-9 AM', latePercentage: 13 },
    { month: 'Jul', avgDaily: 39, totalCheckIns: 780, peakHour: '7-9 AM', latePercentage: 10 },
  ]
}

export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  await delay(200)
  return {
    avgDailyAttendance: 39, totalCheckIns: 4260, peakDay: 'Friday',
    peakHour: '7:00 - 9:00 AM', latePercentage: 10, attendanceGrowth: 8.3,
    busiestDay: 'Friday', quietestDay: 'Sunday',
  }
}

export async function fetchAttendanceByDay(): Promise<AttendanceByDay[]> {
  await delay(200)
  return [
    { day: 'Mon', avg: 38, total: 760 },
    { day: 'Tue', avg: 42, total: 840 },
    { day: 'Wed', avg: 40, total: 800 },
    { day: 'Thu', avg: 44, total: 880 },
    { day: 'Fri', avg: 48, total: 960 },
    { day: 'Sat', avg: 52, total: 1040 },
    { day: 'Sun', avg: 22, total: 440 },
  ]
}

export async function fetchAttendanceByHour(): Promise<AttendanceByHour[]> {
  await delay(200)
  return [
    { hour: '6 AM', count: 28 }, { hour: '7 AM', count: 52 }, { hour: '8 AM', count: 48 },
    { hour: '9 AM', count: 35 }, { hour: '10 AM', count: 25 }, { hour: '11 AM', count: 18 },
    { hour: '12 PM', count: 12 }, { hour: '1 PM', count: 8 },  { hour: '2 PM', count: 10 },
    { hour: '3 PM', count: 15 }, { hour: '4 PM', count: 22 }, { hour: '5 PM', count: 38 },
    { hour: '6 PM', count: 45 }, { hour: '7 PM', count: 42 }, { hour: '8 PM', count: 30 },
    { hour: '9 PM', count: 15 },
  ]
}

// ============================================
// Memberships
// ============================================

export async function fetchMembershipData(): Promise<MembershipData[]> {
  await delay(300)
  return [
    { month: 'Feb', newMembers: 18, churned: 5, net: 13, total: 720 },
    { month: 'Mar', newMembers: 22, churned: 4, net: 18, total: 738 },
    { month: 'Apr', newMembers: 15, churned: 8, net: 7, total: 745 },
    { month: 'May', newMembers: 20, churned: 6, net: 14, total: 759 },
    { month: 'Jun', newMembers: 25, churned: 7, net: 18, total: 777 },
    { month: 'Jul', newMembers: 34, churned: 5, net: 29, total: 847 },
  ]
}

export async function fetchMembershipSummary(): Promise<MembershipSummary> {
  await delay(200)
  return {
    totalMembers: 847, activeMembers: 623, newThisPeriod: 34,
    churnRate: 2.4, avgLifetimeValue: 42000, retentionRate: 92,
    popularPlan: 'Standard Quarterly',
    planBreakdown: [
      { plan: 'Basic', count: 198, revenue: 594000, percentage: 23 },
      { plan: 'Standard', count: 312, revenue: 2808000, percentage: 37 },
      { plan: 'Premium', count: 245, revenue: 6125000, percentage: 29 },
      { plan: 'VIP', count: 92, revenue: 4596000, percentage: 11 },
    ],
    statusBreakdown: [
      { status: 'Active', count: 623, percentage: 74 },
      { status: 'Inactive', count: 124, percentage: 15 },
      { status: 'Expired', count: 68, percentage: 8 },
      { status: 'Suspended', count: 32, percentage: 3 },
    ],
  }
}

// ============================================
// Leads
// ============================================

export async function fetchLeadData(): Promise<LeadData[]> {
  await delay(300)
  return [
    { month: 'Feb', newLeads: 28, converted: 12, lost: 6, conversionRate: 43 },
    { month: 'Mar', newLeads: 35, converted: 15, lost: 8, conversionRate: 43 },
    { month: 'Apr', newLeads: 22, converted: 10, lost: 5, conversionRate: 45 },
    { month: 'May', newLeads: 30, converted: 14, lost: 7, conversionRate: 47 },
    { month: 'Jun', newLeads: 38, converted: 18, lost: 9, conversionRate: 47 },
    { month: 'Jul', newLeads: 42, converted: 20, lost: 8, conversionRate: 48 },
  ]
}

export async function fetchLeadSummary(): Promise<LeadSummary> {
  await delay(200)
  return {
    totalLeads: 195, converted: 89, conversionRate: 46,
    avgConversionDays: 8, pipelineValue: 1250000,
    sourceBreakdown: [
      { source: 'Walk-in', leads: 42, converted: 22, rate: 52 },
      { source: 'Instagram', leads: 35, converted: 14, rate: 40 },
      { source: 'Google Ads', leads: 30, converted: 12, rate: 40 },
      { source: 'Referral', leads: 28, converted: 18, rate: 64 },
      { source: 'Website', leads: 25, converted: 10, rate: 40 },
      { source: 'Facebook', leads: 20, converted: 8, rate: 40 },
      { source: 'Event', leads: 15, converted: 5, rate: 33 },
    ],
    statusBreakdown: [
      { status: 'New', count: 42, percentage: 22 },
      { status: 'Contacted', count: 28, percentage: 14 },
      { status: 'Follow Up', count: 24, percentage: 12 },
      { status: 'Trial Scheduled', count: 15, percentage: 8 },
      { status: 'Trial Completed', count: 12, percentage: 6 },
      { status: 'Proposal Sent', count: 10, percentage: 5 },
      { status: 'Converted', count: 89, percentage: 46 },
      { status: 'Lost', count: 35, percentage: 18 },
    ],
  }
}

// ============================================
// Trainers
// ============================================

export async function fetchTrainerData(): Promise<TrainerData[]> {
  await delay(300)
  return [
    { name: 'Suresh Kumar', clients: 45, classes: 28, rating: 4.8, revenue: 185000, retention: 92 },
    { name: 'Neha Agarwal', clients: 38, classes: 24, rating: 4.9, revenue: 148000, retention: 95 },
    { name: 'Raj Malhotra', clients: 52, classes: 32, rating: 4.7, revenue: 165000, retention: 88 },
    { name: 'Divya Prasad', clients: 30, classes: 20, rating: 4.6, revenue: 120000, retention: 90 },
    { name: 'Arjun Mehta', clients: 22, classes: 16, rating: 4.4, revenue: 85000, retention: 82 },
    { name: 'Priya Nair', clients: 35, classes: 22, rating: 4.8, revenue: 135000, retention: 93 },
  ]
}

export async function fetchTrainerSummary(): Promise<TrainerSummary> {
  await delay(200)
  return {
    totalTrainers: 6, avgRating: 4.7, avgClientRetention: 90,
    totalClassesThisPeriod: 142, topPerformer: 'Neha Agarwal', utilizationRate: 78,
  }
}

// ============================================
// Payments
// ============================================

export async function fetchPaymentData(): Promise<PaymentData[]> {
  await delay(300)
  return [
    { month: 'Feb', collected: 305000, pending: 25000, overdue: 8000 },
    { month: 'Mar', collected: 330000, pending: 18000, overdue: 5000 },
    { month: 'Apr', collected: 295000, pending: 30000, overdue: 12000 },
    { month: 'May', collected: 340000, pending: 22000, overdue: 7000 },
    { month: 'Jun', collected: 360000, pending: 20000, overdue: 6000 },
    { month: 'Jul', collected: 375000, pending: 15000, overdue: 4000 },
  ]
}

export async function fetchPaymentSummary(): Promise<PaymentSummary> {
  await delay(200)
  return {
    totalCollected: 2005000, totalPending: 130000, totalOverdue: 42000,
    collectionRate: 92, avgPaymentValue: 18500,
    methodBreakdown: [
      { method: 'UPI', count: 180, amount: 780000, percentage: 39 },
      { method: 'Net Banking', count: 95, amount: 620000, percentage: 31 },
      { method: 'Card', count: 72, amount: 380000, percentage: 19 },
      { method: 'Cash', count: 48, amount: 125000, percentage: 6 },
      { method: 'Wallet', count: 22, amount: 60000, percentage: 3 },
      { method: 'Cheque', count: 10, amount: 40000, percentage: 2 },
    ],
    typeBreakdown: [
      { type: 'Membership', count: 320, amount: 1850000, percentage: 85 },
      { type: 'Personal Training', count: 45, amount: 180000, percentage: 8 },
      { type: 'Class Package', count: 28, amount: 85000, percentage: 4 },
      { type: 'Renewal', count: 18, amount: 55000, percentage: 2 },
      { type: 'Other', count: 16, amount: 20000, percentage: 1 },
    ],
  }
}

// ============================================
// Export Functions
// ============================================

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToPDF(reportData: ReportExportData): void {
  const html = `<!DOCTYPE html><html><head><title>${reportData.title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,system-ui,sans-serif;padding:40px;color:#1a1a1a}
h1{font-size:24px;margin-bottom:8px;color:#4361ee}
.subtitle{font-size:13px;color:#666;margin-bottom:32px}
.section{margin-bottom:32px}
.section h2{font-size:16px;font-weight:600;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #eee}
table{width:100%;border-collapse:collapse;margin:12px 0}
th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;border-bottom:2px solid #eee;padding:8px 12px}
td{font-size:13px;color:#333;padding:10px 12px;border-bottom:1px solid #f5f5f5}
td:not(:first-child){text-align:right}
th:not(:first-child){text-align:right}
.footer{margin-top:48px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999}
</style></head><body>
<h1>${reportData.title}</h1>
<p class="subtitle">${reportData.period} · Generated on ${reportData.generatedAt}</p>
${reportData.sections.map(section => `
<div class="section">
<h2>${section.heading}</h2>
<table>
<thead><tr>${Object.keys(section.data[0] || {}).map(k => `<th>${k}</th>`).join('')}</tr></thead>
<tbody>${section.data.map(row => `<tr>${Object.values(row).map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>
</table>
</div>`).join('')}
<div class="footer"><p>Generated by GymFlow CRM</p></div>
<script>window.print()</script></body></html>`
  const win = window.open('', '_blank')
  if (win) { win.document.write(html); win.document.close() }
}
