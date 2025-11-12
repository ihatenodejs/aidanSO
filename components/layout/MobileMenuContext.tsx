'use client'

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react'

const MobileMenuStateContext = createContext<boolean | undefined>(undefined)
const MobileMenuDispatchContext = createContext<
  Dispatch<SetStateAction<boolean>> | undefined
>(undefined)

/**
 * Provider component for mobile menu state management.
 *
 * @remarks
 * Manages the open/closed state of the mobile navigation menu using
 * React Context API. Provides state and dispatch values to child components
 * through separate contexts for optimal performance.
 *
 * @param props - Provider properties
 * @param props.children - Child components that will consume the context
 * @returns Context provider wrapper
 *
 * @category Layout
 * @public
 */
export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const stateValue = useMemo(() => isOpen, [isOpen])
  const dispatchValue = useMemo(() => setIsOpen, [])

  return (
    <MobileMenuStateContext.Provider value={stateValue}>
      <MobileMenuDispatchContext.Provider value={dispatchValue}>
        {children}
      </MobileMenuDispatchContext.Provider>
    </MobileMenuStateContext.Provider>
  )
}

/**
 * Hook for accessing mobile menu state.
 *
 * @remarks
 * Returns the current open/closed state of the mobile menu.
 * Must be used within a MobileMenuProvider component.
 *
 * @returns Boolean indicating if mobile menu is open
 * @throws Error if used outside MobileMenuProvider
 *
 * @example
 * ```ts
 * const isOpen = useMobileMenuState()
 * console.log('Menu is open:', isOpen)
 * ```
 *
 * @category Layout
 * @public
 */
export function useMobileMenuState() {
  const context = useContext(MobileMenuStateContext)
  if (context === undefined) {
    throw new Error(
      'useMobileMenuState must be used within a MobileMenuProvider'
    )
  }
  return context
}

/**
 * Hook for accessing mobile menu dispatch function.
 *
 * @remarks
 * Returns the setter function to control mobile menu open/closed state.
 * Must be used within a MobileMenuProvider component.
 *
 * @returns Function to set mobile menu open/closed state
 * @throws Error if used outside MobileMenuProvider
 *
 * @example
 * ```ts
 * const setIsOpen = useMobileMenuDispatch()
 * setIsOpen(true) // Open menu
 * ```
 *
 * @category Layout
 * @public
 */
export function useMobileMenuDispatch() {
  const context = useContext(MobileMenuDispatchContext)
  if (context === undefined) {
    throw new Error(
      'useMobileMenuDispatch must be used within a MobileMenuProvider'
    )
  }
  return context
}

/**
 * Combined hook for mobile menu state and dispatch.
 *
 * @remarks
 * Convenience hook that returns both the mobile menu state and
 * dispatch function in a single object. Must be used within a
 * MobileMenuProvider component.
 *
 * @returns Object with isOpen state and setIsOpen dispatch function
 * @throws Error if used outside MobileMenuProvider
 *
 * @example
 * ```ts
 * const { isOpen, setIsOpen } = useMobileMenu()
 * const toggle = () => setIsOpen(!isOpen)
 * ```
 *
 * @category Layout
 * @public
 */
export function useMobileMenu() {
  const isOpen = useMobileMenuState()
  const setIsOpen = useMobileMenuDispatch()
  return { isOpen, setIsOpen }
}
