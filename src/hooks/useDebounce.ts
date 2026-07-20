import { useState, useEffect } from 'react'

/**
 * Debounce a value by a specified delay.
 *
 * Useful for search inputs — prevents firing an API call on every keystroke.
 *
 * @param value - The value to debounce.
 * @param delay - Delay in milliseconds (default 300ms).
 * @returns The debounced value.
 *
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 300)
 * // debouncedSearch only updates 300ms after the user stops typing
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
