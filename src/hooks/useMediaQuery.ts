import { useState, useEffect } from 'react'

/**
 * Track a CSS media query and return whether it matches.
 *
 * @param query - A CSS media query string.
 * @returns `true` if the query matches, `false` otherwise.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/** Shorthand: true when viewport < 768px. */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

/** Shorthand: true when viewport < 1024px. */
export function useIsTablet() {
  return useMediaQuery('(max-width: 1023px)')
}
