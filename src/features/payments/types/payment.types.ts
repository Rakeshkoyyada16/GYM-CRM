// ============================================
// Payment Module Types
// ============================================

export type PaymentStatus = 'paid' | 'pending' | 'unpaid' | 'partial' | 'refunded' | 'overdue'
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'netbanking' | 'wallet' | 'cheque'
export type PaymentType = 'membership' | 'personal_training' | 'class_package' | 'merchandise' | 'registration' | 'renewal' | 'other'

export interface Payment {
  id: string
  invoiceNumber: string
  memberId: string
  memberName: string
  memberEmail: string
  amount: number
  currency: string
  status: PaymentStatus
  method: PaymentMethod
  type: PaymentType
  description: string
  dueDate: string
  paidDate?: string
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  memberName: string
  memberEmail: string
  memberPhone: string
  gymName: string
  gymAddress: string
  gymEmail: string
  gymPhone: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  taxRate: number
  discount: number
  total: number
  status: PaymentStatus
  method: PaymentMethod
  dueDate: string
  paidDate?: string
  createdAt: string
  notes?: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface PaymentStats {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  pendingAmount: number
  pendingCount: number
  overdueCount: number
  collectedThisMonth: number
  avgPaymentValue: number
  totalTransactions: number
}

export interface RevenueByMonth {
  month: string
  revenue: number
  expenses: number
  profit: number
}

export interface PaymentMethodBreakdown {
  method: PaymentMethod
  count: number
  amount: number
  percentage: number
}

export interface PaymentTypeBreakdown {
  type: PaymentType
  count: number
  amount: number
  percentage: number
}

export interface PaymentFilters {
  search: string
  status: PaymentStatus | 'all'
  method: PaymentMethod | 'all'
  type: PaymentType | 'all'
  dateFrom: string
  dateTo: string
}

export interface RenewalRecord {
  id: string
  memberId: string
  memberName: string
  currentPlan: string
  expiryDate: string
  daysUntilExpiry: number
  lastPayment: number
  autoRenew: boolean
  status: 'expiring_soon' | 'expired' | 'renewed' | 'overdue'
}
