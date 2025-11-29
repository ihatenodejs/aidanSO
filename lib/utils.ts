import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines and merges Tailwind CSS class names with conflict resolution.
 *
 * @remarks
 * Uses clsx for conditional class name combination and tailwind-merge
 * for intelligent Tailwind class conflict resolution. This is the preferred
 * method for handling dynamic class names in React components.
 *
 * @param inputs - Class values to combine (strings, objects, arrays)
 * @returns Merged class name string with conflicts resolved
 *
 * @example
 * ```ts
 * cn('px-2 py-1', 'px-4') // Returns 'px-4 py-1' (px-2 overridden)
 * cn('base-class', isActive && 'active-class') // Conditional classes
 * ```
 *
 * @category Utilities
 * @public
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Throttles a function to only execute at most once per specified delay
 * @param func - The function to throttle
 * @param delay - Minimum time between function executions in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastRan: number | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()

    if (lastRan === null || now - lastRan >= delay) {
      func.apply(this, args)
      lastRan = now
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(
        () => {
          func.apply(this, args)
          lastRan = Date.now()
          timeoutId = null
        },
        delay - (now - lastRan)
      )
    }
  }
}
