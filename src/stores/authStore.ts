import { useState, useCallback } from 'react'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/lib/constants'

type UserRole = 'owner' | 'admin' | 'staff' | 'trainer'

/**
 * Minimal auth state stored in memory + localStorage.
 *
 * This is NOT a global store like Zustand — it's a simple hook
 * that manages the current user session. When we add a real backend,
 * this will be replaced with a proper auth context.
 */

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  tenantId: string
}

// Singleton state (persists across renders, not across page reloads)
let _token: string | null = null
let _user: AuthUser | null = null

// Listeners for reactive updates
type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
}

/**
 * Auth hook that provides login state and actions.
 *
 * In the mock phase, login() just sets a fake token.
 * When the real backend is ready, login() will call POST /auth/login.
 */
export function useAuth() {
  const [, setTick] = useState(0)

  // Subscribe to changes
  useState(() => {
    const listener = () => setTick((t) => t + 1)
    listeners.add(listener)
    return () => listeners.delete(listener)
  })

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login — will be replaced with real API call
    _token = 'mock-jwt-token'
    _user = {
      id: '1',
      email,
      firstName: 'Admin',
      lastName: 'Kumar',
      role: 'owner',
      tenantId: 'tenant-1',
    }
    localStorage.setItem(AUTH_TOKEN_KEY, _token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(_user))
    notify()
  }, [])

  const logout = useCallback(() => {
    _token = null
    _user = null
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    notify()
  }, [])

  const isAuthenticated = !!_token

  return {
    user: _user,
    token: _token,
    isAuthenticated,
    login,
    logout,
  }
}
