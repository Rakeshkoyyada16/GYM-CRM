import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { Theme } from '@/types'

/**
 * UI preferences hook.
 *
 * Manages sidebar state, theme, and other UI preferences
 * that persist across sessions via localStorage.
 */
export function useUIPreferences() {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    'gymflow_sidebar_collapsed',
    false
  )

  const [theme, setTheme] = useLocalStorage<Theme>(
    'gymflow_theme',
    'light'
  )

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    theme,
    setTheme,
  }
}
