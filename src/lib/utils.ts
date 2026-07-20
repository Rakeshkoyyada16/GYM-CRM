import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes — the single source of truth. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format number as Indian Rupee: 24999 → "₹24,999" */
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Abbreviate large numbers: 1500000 → "₹15L", 350000 → "₹3.5L", 1200 → "₹1.2K" */
export function formatCurrencyShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
  return `₹${amount}`
}

/** Abbreviate numbers: 1200 → "1.2K", 1500000 → "1.5M" */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString('en-IN')
}

/** Format date: "2026-01-15" → "15 Jan 2026" */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Format datetime with time */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/** Get initials from name: "Rahul Sharma" → "RS" */
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

/** Generate random ID */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/** Debounce a function call */
export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait) }
}

/** Time-appropriate greeting */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Simulate network delay */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Safe JSON parse */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T } catch { return fallback }
}

/** Percentage change: (120, 100) → 20 */
export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

/** Truncate text with ellipsis */
export function truncate(str: string, length: number): string {
  return str.length <= length ? str : str.slice(0, length) + '…'
}

/** Status badge variant — works for ANY status string across the app */
export function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'gray' | 'info' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'error' | 'gray' | 'info' | 'default'> = {
    active: 'success', paid: 'success', present: 'success', converted: 'success', renewed: 'success', completed: 'success', on_time: 'success',
    pending: 'warning', late: 'warning', follow_up: 'warning', partial: 'warning', expiring_soon: 'warning', on_leave: 'warning', proposal_sent: 'warning', overdue: 'warning',
    inactive: 'gray', absent: 'gray', lost: 'gray', refunded: 'gray', cancelled: 'gray', excused: 'gray',
    expired: 'error', unpaid: 'error', suspended: 'error',
    new: 'info', contacted: 'info', scheduled: 'info',
    trial_scheduled: 'default', trial_completed: 'default', ongoing: 'default',
  }
  return map[status.toLowerCase()] || 'gray'
}

/** Change indicator color */
export function getChangeColor(change?: number): string {
  if (!change) return 'text-gray-500'
  return change > 0 ? 'text-green-600' : 'text-red-600'
}

/** Change indicator background */
export function getChangeBg(change?: number): string {
  if (!change) return 'bg-gray-50'
  return change > 0 ? 'bg-green-50' : 'bg-red-50'
}
