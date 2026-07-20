/** Application-wide constants. Any magic value that appears in more than one place lives here. */

export const APP_NAME = 'GymFlow'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Professional Gym Management'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
export const API_TIMEOUT = 30_000

export const AUTH_TOKEN_KEY = 'gymflow_access_token'
export const AUTH_USER_KEY = 'gymflow_user'

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const MAX_FILE_SIZE = 5 * 1024 * 1024

export const MEMBERSHIP_TYPES = ['basic', 'standard', 'premium', 'vip', 'custom'] as const
export const MEMBER_STATUSES = ['active', 'inactive', 'expired', 'suspended', 'pending'] as const
export const CLASS_TYPES = ['yoga', 'zumba', 'hiit', 'strength', 'cardio', 'pilates', 'crossfit', 'boxing', 'spinning', 'other'] as const
export const PAYMENT_METHODS = ['cash', 'card', 'upi', 'netbanking', 'wallet', 'cheque'] as const
export const PAYMENT_STATUSES = ['paid', 'unpaid', 'partial', 'refunded', 'pending'] as const
export const USER_ROLES = ['owner', 'admin', 'staff', 'trainer'] as const

export const CLASS_TYPE_EMOJIS: Record<string, string> = {
  yoga: '🧘', zumba: '💃', hiit: '🔥', strength: '💪', cardio: '🏃',
  pilates: '🤸', crossfit: '🏋️', boxing: '🥊', spinning: '🚴', other: '⭐',
}

export const QUERY_KEYS = {
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    revenue: ['dashboard', 'revenue'] as const,
    activity: ['dashboard', 'activity'] as const,
    classPopularity: ['dashboard', 'classPopularity'] as const,
  },
  members: {
    all: ['members'] as const,
    list: (params: Record<string, unknown>) => ['members', 'list', params] as const,
    detail: (id: string) => ['members', 'detail', id] as const,
  },
  trainers: { all: ['trainers'] as const, list: ['trainers', 'list'] as const, detail: (id: string) => ['trainers', 'detail', id] as const },
  classes: { all: ['classes'] as const, list: ['classes', 'list'] as const, detail: (id: string) => ['classes', 'detail', id] as const },
  payments: { all: ['payments'] as const, list: ['payments', 'list'] as const },
  attendance: { all: ['attendance'] as const, list: (date?: string) => ['attendance', 'list', date] as const },
} as const
