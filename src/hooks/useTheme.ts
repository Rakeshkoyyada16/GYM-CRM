import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'gymflow-theme'
const THEME_CHANGE_EVENT = 'gymflow-theme-change'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement
  const hasChanged = !root.classList.contains(resolved)

  if (hasChanged) root.classList.add('theme-changing')
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.dataset.theme = theme
  root.style.colorScheme = resolved

  if (hasChanged) {
    window.setTimeout(() => root.classList.remove('theme-changing'), 250)
  }

  return resolved
}

/**
 * Global theme hook.
 * - Persists selection to localStorage
 * - Detects system preference on first load
 * - Listens for system and cross-tab preference changes
 * - Returns selected and resolved themes with update actions
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === 'system' ? getSystemTheme() : theme
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
    setResolvedTheme(applyTheme(theme))
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = () => {
      if (theme === 'system') setResolvedTheme(applyTheme('system'))
    }

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [theme])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      setThemeState(getStoredTheme())
    }
    const handleThemeChange = (event: Event) => {
      setThemeState((event as CustomEvent<Theme>).detail)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    }
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: newTheme }))
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
