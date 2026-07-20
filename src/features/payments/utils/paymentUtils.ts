import type { PaymentStatus, PaymentMethod, PaymentType } from '../types/payment.types'
import { getStatusVariant as getSharedStatusVariant } from '@/lib/utils'

// Re-export shared utilities so feature components can import from one place
export { formatCurrency, formatCurrencyShort } from '@/lib/utils'

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'Paid', pending: 'Pending', unpaid: 'Unpaid',
  partial: 'Partial', refunded: 'Refunded', overdue: 'Overdue',
}

export const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash', card: 'Card', upi: 'UPI',
  netbanking: 'Net Banking', wallet: 'Wallet', cheque: 'Cheque',
}

export const TYPE_LABELS: Record<PaymentType, string> = {
  membership: 'Membership', personal_training: 'Personal Training',
  class_package: 'Class Package', merchandise: 'Merchandise',
  registration: 'Registration', renewal: 'Renewal', other: 'Other',
}

// Delegate to shared utility — no duplicate logic
export function getStatusVariant(status: PaymentStatus) {
  return getSharedStatusVariant(status)
}

export function getMethodIcon(method: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    cash: '💵', card: '💳', upi: '📱', netbanking: '🏦', wallet: '👛', cheque: '📝',
  }
  return map[method]
}

export function getRenewalStatusVariant(status: string) {
  return getSharedStatusVariant(status)
}

export function getRenewalStatusLabel(status: string): string {
  const map: Record<string, string> = {
    expiring_soon: 'Expiring Soon', expired: 'Expired', renewed: 'Renewed', overdue: 'Overdue',
  }
  return map[status] || status
}
