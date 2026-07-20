import { useEffect, useRef, type RefObject } from 'react'

/**
 * Detect clicks outside a referenced element.
 *
 * @param handler - Callback fired when a click outside is detected.
 * @returns A ref to attach to the element you want to "watch".
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
 * return <div ref={ref}>Dropdown content</div>
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler])

  return ref
}
