/**
 * Global shared types.
 *
 * RULE: Only types shared across 2+ features live here.
 * Feature-specific types belong in features/[name]/types/.
 *
 * Each feature module defines its own domain types:
 *   features/members/types/member.types.ts
 *   features/payments/types/payment.types.ts
 *   features/attendance/types/attendance.types.ts
 *   features/trainers/types/trainer.types.ts
 *   features/leads/types/lead.types.ts
 *   features/reports/types/report.types.ts
 */

// ============================================
// API Contract Types (shared across all features)
// ============================================

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: Record<string, string[]>
}

// ============================================
// UI State Types (shared across features)
// ============================================

export type Theme = 'light' | 'dark' | 'system'

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface TableConfig {
  page: number
  limit: number
  sort?: SortConfig
  filters?: Record<string, unknown>
}
