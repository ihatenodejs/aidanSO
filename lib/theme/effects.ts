/**
 * Text shadow effect tokens for glowing and emphasis effects.
 *
 * Provides white glow effects at varying intensities for creating visual hierarchy
 * and emphasis on text elements in the dark theme.
 *
 * @example
 * ```tsx
 * import { textShadows } from '@/lib/theme/effects'
 *
 * // Standard glow effect
 * <h1 style={{ textShadow: textShadows.glow }}>
 *   Glowing Title
 * </h1>
 *
 * // Hover state with increased glow
 * <button
 *   style={{ textShadow: textShadows.glow }}
 *   onMouseEnter={(e) => e.currentTarget.style.textShadow = textShadows.glowHover}
 * >
 *   Hover Me
 * </button>
 *
 * // Intense glow for hero text
 * <h1 style={{ textShadow: textShadows.glowIntense }}>
 *   Hero Title
 * </h1>
 * ```
 *
 * @category Theme
 * @public
 */
export const textShadows = {
  /** Standard glow effect (80% opacity) - use for headings and emphasized text */
  glow: '0 0 10px rgba(255, 255, 255, 0.8)',

  /** Enhanced glow for hover states (90% opacity) - use with interactive text elements */
  glowHover: '0 0 15px rgba(255, 255, 255, 0.9)',

  /** Intense glow effect (100% opacity) - use sparingly for hero sections and primary headings */
  glowIntense: '0 0 20px rgba(255, 255, 255, 1)',

  /** Subtle glow (50% opacity) - use for secondary text that needs slight emphasis */
  subtle: '0 0 10px rgba(255, 255, 255, 0.5)'
} as const

/**
 * Box shadow effect tokens for depth and elevation.
 *
 * Provides subtle elevation effects for cards, panels, and buttons. All shadows
 * use dark colors appropriate for the dark theme interface.
 *
 * @example
 * ```tsx
 * import { boxShadows } from '@/lib/theme/effects'
 *
 * // Card with elevation shadow
 * <div style={{ boxShadow: boxShadows.card }}>
 *   <h3>Card Content</h3>
 * </div>
 *
 * // Button with hover elevation
 * <button
 *   style={{ boxShadow: boxShadows.button }}
 *   className="hover:shadow-[var(--shadow-button-hover)]"
 * >
 *   Click Me
 * </button>
 *
 * // Panel overlay with shadow
 * <div style={{ boxShadow: boxShadows.panel }}>
 *   <nav>Navigation</nav>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const boxShadows = {
  /** Card shadow for standard elevation - use on card containers */
  card: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

  /** Enhanced card shadow for hover states - creates lifted appearance */
  cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',

  /** Panel shadow for floating UI elements - use on dropdowns, modals, and sidebars */
  panel: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',

  /** Button shadow for default state - subtle depth for clickable elements */
  button: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',

  /** Button shadow for hover state - increased shadow for interactivity feedback */
  buttonHover: '0 6px 8px -1px rgba(0, 0, 0, 0.15)'
} as const

/**
 * Gradient effect tokens for backgrounds and visual interest.
 *
 * Provides pre-configured gradient styles for page backgrounds, widgets, and special
 * UI elements. All gradients follow the dark theme color palette.
 *
 * @example
 * ```tsx
 * import { gradients } from '@/lib/theme/effects'
 *
 * // Page background gradient
 * <div style={{ background: gradients.pageBackground }}>
 *   <main>Page content</main>
 * </div>
 *
 * // Music player widget gradient
 * <div style={{ background: gradients.musicPlayer }}>
 *   <div>Now Playing...</div>
 * </div>
 *
 * // Player button gradient (light variant)
 * <button style={{ background: gradients.playerButton.light }}>
 *   Play
 * </button>
 * ```
 *
 * @category Theme
 * @public
 */
export const gradients = {
  /** Page background gradient from gray-800 to gray-900 - use for main page containers */
  pageBackground:
    'linear-gradient(180deg, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%)',

  /** Music player widget gradient with 4-stop gradient - use for music player components */
  musicPlayer:
    'linear-gradient(to bottom, #4b5563 0%, #374151 30%, #1f2937 70%, #111827 100%)',

  /** Player button gradients - use for music control buttons */
  playerButton: {
    /** Light button gradient with subtle 3D effect - use for play/pause buttons */
    light:
      'linear-gradient(180deg, #f9fafb 0%, #e5e7eb 49%, #6b7280 51%, #d1d5db 100%)'
  }
} as const

/**
 * Transition effect tokens for smooth animations and state changes.
 *
 * Provides Tailwind CSS transition utilities with consistent timing and easing.
 * Combine property transitions with duration and easing tokens for complete control.
 *
 * @example
 * ```tsx
 * import { transitions } from '@/lib/theme/effects'
 *
 * // Color transition on hover
 * <button className={transitions.colors}>
 *   Hover Me
 * </button>
 *
 * // All properties transition with custom duration
 * <div className={cn(transitions.all, transitions.slow)}>
 *   Animates all properties slowly
 * </div>
 *
 * // Shadow transition with easing
 * <div className={cn(transitions.shadow, transitions.easeInOut)}>
 *   Shadow changes smoothly
 * </div>
 *
 * // Fast transition for snappy interactions
 * <button className={cn('bg-gray-800', transitions.fast)}>
 *   Quick feedback
 * </button>
 * ```
 *
 * @remarks
 * Transition tokens are designed to be composable. Combine property transitions
 * (colors, all, shadow) with duration modifiers (fast, normal, slow) and easing
 * functions (easeInOut, ease) to create custom animation behaviors.
 *
 * @category Theme
 * @public
 */
export const transitions = {
  /** Color property transitions with 300ms duration - use for text/background color changes */
  colors: 'transition-colors duration-300',

  /** All property transitions with 300ms duration - use when multiple properties animate */
  all: 'transition-all duration-300',

  /** Shadow property transitions with 300ms duration - use for elevation changes */
  shadow: 'transition-shadow duration-300',

  /** Fast duration (200ms) - use for snappy, responsive interactions */
  fast: 'duration-200',

  /** Normal duration (300ms) - default timing for most animations */
  normal: 'duration-300',

  /** Slow duration (500ms) - use for deliberate, emphasis animations */
  slow: 'duration-500',

  /** Ease-in-out timing function - smooth start and end for polished feel */
  easeInOut: 'ease-in-out',

  /** Standard ease timing function - slight acceleration for natural motion */
  ease: 'ease'
} as const

/**
 * Backdrop blur effect tokens for glassmorphism and depth.
 *
 * Provides backdrop-filter blur utilities for creating frosted glass effects
 * on overlays, modals, and panels. Commonly used with semi-transparent backgrounds.
 *
 * @example
 * ```tsx
 * import { backdrops } from '@/lib/theme/effects'
 *
 * // Subtle blur for card overlays
 * <div className={cn('bg-gray-900/50', backdrops.blur)}>
 *   <h3>Content with backdrop blur</h3>
 * </div>
 *
 * // Medium blur for modals
 * <div className={cn('bg-gray-800/80', backdrops.blurMedium)}>
 *   <dialog>Modal Content</dialog>
 * </div>
 *
 * // Strong blur for emphasized overlays
 * <div className={cn('bg-gray-900/90', backdrops.blurLarge)}>
 *   <div>Strongly blurred background</div>
 * </div>
 * ```
 *
 * @remarks
 * Backdrop blur effects work best when combined with semi-transparent backgrounds
 * (e.g., `bg-gray-900/50`). The blur creates a frosted glass effect by blurring
 * content behind the element.
 *
 * @category Theme
 * @public
 */
export const backdrops = {
  /** Small blur (4px) - use for subtle glassmorphism on cards and overlays */
  blur: 'backdrop-blur-sm',

  /** Medium blur (12px) - use for modals and prominent panels */
  blurMedium: 'backdrop-blur-md',

  /** Large blur (24px) - use for strong separation and emphasis */
  blurLarge: 'backdrop-blur-lg'
} as const

/**
 * Visual effect design tokens for the application theme.
 *
 * Provides a comprehensive set of visual effects including shadows, gradients,
 * transitions, and backdrop filters. All effects are optimized for the dark theme
 * and support smooth animations.
 *
 * @remarks
 * This is the main effects export. Import individual categories or the full effects
 * object depending on your needs. Effects can be combined with surface styles from
 * `lib/theme/surfaces` for complete component styling.
 *
 * @example
 * ```tsx
 * import { effects } from '@/lib/theme/effects'
 * // or
 * import { textShadows, transitions, backdrops } from '@/lib/theme/effects'
 *
 * // Using the full effects object
 * <h1 style={{ textShadow: effects.textShadows.glow }}>
 *   Glowing Title
 * </h1>
 *
 * // Using individual imports
 * <div className={cn(backdrops.blur, transitions.all)}>
 *   <p>Blurred and animated</p>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const effects = {
  textShadows,
  boxShadows,
  gradients,
  transitions,
  backdrops
} as const

/**
 * TypeScript type representing all available effect tokens.
 *
 * Use this type for type-safe access to effect styles in components.
 *
 * @example
 * ```tsx
 * import type { EffectTokens } from '@/lib/theme/effects'
 *
 * function EffectWrapper(props: { effects: EffectTokens }) {
 *   return (
 *     <div style={{ textShadow: props.effects.textShadows.glow }}>
 *       Content
 *     </div>
 *   )
 * }
 * ```
 *
 * @category Theme
 * @public
 */
export type EffectTokens = typeof effects
