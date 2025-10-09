/**
 * Theme system entry point providing centralized access to design tokens.
 *
 * @remarks
 * This module serves as the main entry point for the aidxnCC theme system,
 * providing a unified interface for colors, visual effects, and surface styling.
 * All theme tokens are designed to work seamlessly with Tailwind CSS v4.
 *
 * **Available theme categories:**
 * - **colors**: Semantic color tokens (text, backgrounds, borders, accents)
 * - **effects**: Visual effects (shadows, gradients, transitions, backdrops)
 * - **surfaces**: Pre-composed UI element styles (cards, buttons, badges, sections)
 *
 * **Usage patterns:**
 * - Import individual categories for specific needs
 * - Use helper functions for dynamic variant selection
 * - Combine with cn() utility for class composition
 *
 * @example
 * ```tsx
 * // Import entire theme
 * import { theme } from '@/lib/theme'
 * const textColor = theme.colors.text.primary
 *
 * // Import specific categories
 * import { colors, surfaces } from '@/lib/theme'
 * const cardStyle = surfaces.card.default
 *
 * // Use helper functions for dynamic variants
 * import { getCardStyle, cn } from '@/lib/theme'
 * const Card = ({ variant = 'default', className }) => (
 *   <div className={cn(getCardStyle(variant), className)}>
 *     Content
 *   </div>
 * )
 * ```
 *
 * @module lib/theme
 * @category Theme
 * @public
 */

export * from './colors'
export * from './effects'
export * from './surfaces'

import { colors } from './colors'
import { effects } from './effects'
import { surfaces } from './surfaces'

/**
 * Unified theme object containing all design tokens.
 *
 * @remarks
 * This object provides centralized access to all theme categories.
 * The `as const` assertion ensures type safety and enables TypeScript
 * to infer exact string literals for all token values.
 *
 * @example
 * ```tsx
 * import { theme } from '@/lib/theme'
 *
 * // Access colors
 * const primaryText = theme.colors.text.primary
 *
 * // Access effects
 * const cardShadow = theme.effects.boxShadows.card
 *
 * // Access surfaces
 * const buttonStyle = theme.surfaces.button.primary
 * ```
 *
 * @category Theme
 * @public
 */
export const theme = {
  colors,
  effects,
  surfaces,
} as const

/**
 * Type representing the whole theme structure.
 *
 * @remarks
 * This type enables autocomplete and type checking when working with
 * theme tokens. It's automatically inferred from the theme object.
 *
 * @category Theme
 * @public
 */
export type Theme = typeof theme

/**
 * Utility function for conditionally combining CSS class names.
 *
 * @param classes - Array of class names (can include undefined, null, or false values)
 * @returns Combined class string with falsy values filtered out
 *
 * @remarks
 * This is a lightweight alternative to libraries like `clsx` or `classnames`.
 * It filters out falsy values (undefined, null, false) and joins remaining
 * strings with spaces. Perfect for conditional class application in React.
 *
 * **Compared to alternatives:**
 * - Simpler than the `cn()` utility in lib/utils.ts (which uses tailwind-merge)
 * - Use this for basic class combining without merge logic
 * - Use lib/utils.ts cn() when you need Tailwind conflict resolution
 *
 * @example
 * ```tsx
 * import { cn } from '@/lib/theme'
 *
 * // Basic usage
 * const classes = cn('text-gray-100', 'bg-gray-800')
 * // Result: 'text-gray-100 bg-gray-800'
 *
 * // With conditional classes
 * const isActive = true
 * const classes = cn(
 *   'base-class',
 *   isActive && 'active-class',
 *   undefined,
 *   null
 * )
 * // Result: 'base-class active-class'
 * ```
 *
 * @category Theme
 * @public
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get card surface styles by variant name.
 *
 * @param variant - Card variant name (default, domain, ai, featured, simple)
 * @returns Tailwind CSS class string for the specified card variant
 *
 * @remarks
 * This helper function provides runtime variant selection for card components.
 * Use this when card variant is determined dynamically (e.g., from props or state).
 *
 * **Available variants:**
 * - `default`: Standard card styling
 * - `domain`: Domain-specific card styling
 * - `ai`: AI-themed card styling
 * - `featured`: Featured/highlighted card
 * - `simple`: Minimal card styling
 *
 * @example
 * ```tsx
 * import { getCardStyle } from '@/lib/theme'
 *
 * // Basic usage
 * const Card = ({ variant = 'default', children }) => (
 *   <div className={getCardStyle(variant)}>
 *     {children}
 *   </div>
 * )
 *
 * // Dynamic variant selection
 * const DomainCard = ({ domain }) => {
 *   const variant = domain.featured ? 'featured' : 'domain'
 *   return <div className={getCardStyle(variant)}>...</div>
 * }
 * ```
 *
 * @see {@link surfaces} For all available surface styles
 * @category Theme
 * @public
 */
export function getCardStyle(variant: keyof typeof surfaces.card = 'default'): string {
  return surfaces.card[variant]
}

/**
 * Get section surface styles by variant name.
 *
 * @param variant - Section variant name (default, compact, plain)
 * @returns Tailwind CSS class string for the specified section variant
 *
 * @remarks
 * This helper function provides runtime variant selection for section containers.
 * Use this when section variant is determined dynamically.
 *
 * **Available variants:**
 * - `default`: Standard section with full spacing
 * - `compact`: Reduced spacing for denser layouts
 * - `plain`: Minimal styling without background
 *
 * @example
 * ```tsx
 * import { getSectionStyle } from '@/lib/theme'
 *
 * const Section = ({ compact = false, children }) => {
 *   const variant = compact ? 'compact' : 'default'
 *   return (
 *     <section className={getSectionStyle(variant)}>
 *       {children}
 *     </section>
 *   )
 * }
 * ```
 *
 * @see {@link surfaces} For all available surface styles
 * @category Theme
 * @public
 */
export function getSectionStyle(variant: keyof typeof surfaces.section = 'default'): string {
  return surfaces.section[variant]
}

/**
 * Get button surface styles by variant name.
 *
 * @param variant - Button variant name (nav, dropdownItem, active, icon, primary)
 * @returns Tailwind CSS class string for the specified button variant
 *
 * @remarks
 * This helper function provides runtime variant selection for button components.
 * Use this when button variant is determined dynamically.
 *
 * **Available variants:**
 * - `nav`: Navigation button styling
 * - `dropdownItem`: Dropdown menu item button
 * - `active`: Active/selected state button
 * - `icon`: Icon-only button (e.g., close buttons)
 * - `primary`: Primary call-to-action button
 *
 * @example
 * ```tsx
 * import { getButtonStyle } from '@/lib/theme'
 *
 * const Button = ({ variant = 'nav', active = false, children }) => {
 *   const style = active ? 'active' : variant
 *   return (
 *     <button className={getButtonStyle(style)}>
 *       {children}
 *     </button>
 *   )
 * }
 * ```
 *
 * @see {@link surfaces} For all available surface styles
 * @category Theme
 * @public
 */
export function getButtonStyle(variant: keyof typeof surfaces.button = 'nav'): string {
  return surfaces.button[variant]
}