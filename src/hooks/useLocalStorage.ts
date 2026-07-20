import { useState, useEffect, useCallback } from 'react'
import { safeJsonParse } from '@/lib/utils'

/**
 * Persist a value to localStorage with automatic JSON serialization.
 *
 * @param key - The localStorage key.
 * @param initialValue - The default value if nothing is stored.
 * @returns A stateful value and a setter, just like useState.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light')
 * const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar', false)
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? safeJsonParse<T>(item, initialValue) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(safeJsonParse<T>(e.newValue, initialValue))
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, initialValue])

  return [storedValue, setValue] as const
}
