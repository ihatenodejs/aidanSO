/**
 * Grayscale color palette used throughout the application.
 *
 * @remarks
 * Provides a complete grayscale from near-white (50) to near-black (950).
 * Each shade has a specific semantic purpose in the dark-themed UI.
 *
 * Common usage:
 * - 50-400: Text colors (lighter is more prominent)
 * - 500-600: Interactive states and borders
 * - 700-950: Backgrounds and surfaces
 *
 * @example
 * ```ts
 * import { gray } from '@/lib/theme/colors'
 *
 * const textColor = gray[100]  // Primary text
 * const cardBg = gray[800]     // Card background
 * ```
 *
 * @category Theme
 * @public
 */
export const gray = {
  /** Near-white, lightest shade - #f9fafb */
  50: '#f9fafb',
  /** Very light gray - Primary text on dark backgrounds - #f3f4f6 */
  100: '#f3f4f6',
  /** Light gray - Secondary headings - #e5e7eb */
  200: '#e5e7eb',
  /** Medium-light gray - Body text - #d1d5db */
  300: '#d1d5db',
  /** Medium gray - Muted text and descriptions - #9ca3af */
  400: '#9ca3af',
  /** Medium-dark gray - Disabled states - #6b7280 */
  500: '#6b7280',
  /** Dark gray - Hover states for borders - #4b5563 */
  600: '#4b5563',
  /** Darker gray - Default borders and cards - #374151 */
  700: '#374151',
  /** Very dark gray - Background gradient start - #1f2937 */
  800: '#1f2937',
  /** Near-black - Background gradient end - #111827 */
  900: '#111827',
  /** Deepest black - #030712 */
  950: '#030712',
} as const

/**
 * Background color tokens for page and surface backgrounds.
 *
 * @remarks
 * Provides consistent background colors with semantic naming:
 * - Page gradients for main background
 * - Surface colors for cards and interactive elements
 * - Hover states for transitions
 *
 * @example
 * ```tsx
 * import { backgrounds } from '@/lib/theme/colors'
 *
 * <div style={{ background: `linear-gradient(${backgrounds.pageGradientStart}, ${backgrounds.pageGradientEnd})` }}>
 *   <div style={{ backgroundColor: backgrounds.card }}>
 *     Card content
 *   </div>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const backgrounds = {
  /** Page background gradient start color (gray-800) - rgb(31, 41, 55) */
  pageGradientStart: 'rgb(31, 41, 55)',
  /** Page background gradient end color (gray-900) - rgb(17, 24, 39) */
  pageGradientEnd: 'rgb(17, 24, 39)',

  /** Semi-transparent card background (gray-900/50) - rgba(31, 41, 55, 0.5) */
  card: 'rgba(31, 41, 55, 0.5)',
  /** Solid card background (gray-800) - #1f2937 */
  cardSolid: '#1f2937',
  /** Hover state background (gray-700 with opacity) - rgba(55, 65, 81, 0.6) */
  hover: 'rgba(55, 65, 81, 0.6)',
} as const

/**
 * Border color tokens for consistent border styling.
 *
 * @remarks
 * Provides border colors with varying opacity levels:
 * - Default: Standard border for cards and sections
 * - Hover: Highlighted border on interactive elements
 * - Subtle/Muted: Lower-contrast borders for nested elements
 *
 * @example
 * ```tsx
 * import { borders } from '@/lib/theme/colors'
 *
 * <div style={{ borderColor: borders.default }}>
 *   // On hover
 *   <div style={{ borderColor: borders.hover }}>
 *     Interactive element
 *   </div>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const borders = {
  /** Default border color (gray-700) - #374151 */
  default: '#374151',
  /** Hover border color (gray-600) - #4b5563 */
  hover: '#4b5563',
  /** Subtle border with low opacity - rgba(75, 85, 99, 0.3) */
  subtle: 'rgba(75, 85, 99, 0.3)',
  /** Muted border with medium opacity - rgba(75, 85, 99, 0.5) */
  muted: 'rgba(75, 85, 99, 0.5)',
} as const

/**
 * Text color tokens organized by semantic meaning and visual hierarchy.
 *
 * @remarks
 * Provides a consistent text color scale from most to least prominent:
 * - Primary: Most important text (headings, key info)
 * - Secondary: Subheadings and emphasized text
 * - Body: Standard paragraph text
 * - Muted: Less important text (descriptions, captions)
 * - Disabled: Inactive or unavailable text
 * - Inverse: Text on light backgrounds (opposite of normal)
 *
 * @example
 * ```tsx
 * import { text } from '@/lib/theme/colors'
 *
 * <h1 style={{ color: text.primary }}>Main Title</h1>
 * <h2 style={{ color: text.secondary }}>Subtitle</h2>
 * <p style={{ color: text.body }}>Paragraph text</p>
 * <small style={{ color: text.muted }}>Caption</small>
 * ```
 *
 * @category Theme
 * @public
 */
export const text = {
  /** Primary text color - Highest contrast (gray-100) - #f3f4f6 */
  primary: '#f3f4f6',
  /** Secondary text color - Headings and emphasis (gray-200) - #e5e7eb */
  secondary: '#e5e7eb',
  /** Body text color - Standard paragraphs (gray-300) - #d1d5db */
  body: '#d1d5db',
  /** Muted text color - Descriptions and captions (gray-400) - #9ca3af */
  muted: '#9ca3af',
  /** Disabled text color - Inactive elements (gray-500) - #6b7280 */
  disabled: '#6b7280',
  /** Inverse text color - For light backgrounds (gray-900) - #111827 */
  inverse: '#111827',
} as const

/**
 * Accent color tokens for links, branding, and semantic states.
 *
 * @remarks
 * Organized into semantic categories:
 * - Link colors: Blue tones for hyperlinks
 * - AI theme: Orange/rust colors for Claude AI branding
 * - Type colors: Purple for documentation type references
 * - Semantic colors: Success, warning, error, info states
 *
 * Each accent color includes hover and background variants where applicable.
 *
 * @example
 * ```tsx
 * import { accents } from '@/lib/theme/colors'
 *
 * <a style={{ color: accents.link }}>Link</a>
 * <div style={{ backgroundColor: accents.linkBg }}>Badge</div>
 * <span style={{ color: accents.success }}>Success!</span>
 * ```
 *
 * @category Theme
 * @public
 */
export const accents = {
  /** Link text color (blue-400) - #60a5fa */
  link: '#60a5fa',
  /** Link hover color (blue-500) - #3b82f6 */
  linkHover: '#3b82f6',
  /** Link badge background (blue-400/10) - rgba(96, 165, 250, 0.1) */
  linkBg: 'rgba(96, 165, 250, 0.1)',

  /** AI/Claude primary brand color - #c15f3c */
  ai: '#c15f3c',
  /** AI/Claude muted variant - #d68b6b */
  aiMuted: '#d68b6b',
  /** AI/Claude high contrast background - #1a100d */
  aiContrast: '#1a100d',

  /** Type/interface color for docs (purple-500) - #a855f7 */
  type: '#a855f7',
  /** Type badge background (purple-500/10) - rgba(168, 85, 247, 0.1) */
  typeBg: 'rgba(168, 85, 247, 0.1)',

  /** Documentation primary accent (blue-400) - #60a5fa */
  docs: '#60a5fa',
  /** Documentation card background (blue-500/8) - rgba(59, 130, 246, 0.08) */
  docsBg: 'rgba(59, 130, 246, 0.08)',
  /** Documentation border (blue-500/25) - rgba(59, 130, 246, 0.25) */
  docsBorder: 'rgba(59, 130, 246, 0.25)',
  /** Documentation glow/shadow (blue-500/12) - rgba(59, 130, 246, 0.12) */
  docsGlow: 'rgba(59, 130, 246, 0.12)',
  /** Documentation icon background (blue-500/20) - rgba(59, 130, 246, 0.2) */
  docsIconBg: 'rgba(59, 130, 246, 0.2)',
  /** Documentation blur effect (blue-500 solid) - #3b82f6 */
  docsBlur: '#3b82f6',

  /** Success state color (green) - #10b981 */
  success: '#10b981',
  /** Warning state color (amber) - #f59e0b */
  warning: '#f59e0b',
  /** Warning badge background (warning/10) - rgba(245, 158, 11, 0.1) */
  warningBg: 'rgba(245, 158, 11, 0.1)',
  /** Error state color (red) - #ef4444 */
  error: '#ef4444',
  /** Info state color (blue) - #3b82f6 */
  info: '#3b82f6',
} as const

/**
 * Effect color tokens for glows, shadows, and other visual effects.
 *
 * @remarks
 * Provides colors specifically for CSS effects like text-shadow and box-shadow.
 * Used to create depth and emphasis in the UI.
 *
 * @example
 * ```tsx
 * import { effectColors } from '@/lib/theme/colors'
 *
 * <h1 style={{ textShadow: `0 0 10px ${effectColors.textGlow}` }}>
 *   Glowing Text
 * </h1>
 * <div style={{ boxShadow: `0 4px 6px ${effectColors.shadowCard}` }}>
 *   Card with shadow
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const effectColors = {
  /** Standard text glow (80% opacity) - rgba(255, 255, 255, 0.8) */
  textGlow: 'rgba(255, 255, 255, 0.8)',
  /** Hover text glow (90% opacity) - rgba(255, 255, 255, 0.9) */
  textGlowHover: 'rgba(255, 255, 255, 0.9)',
  /** Intense text glow (100% opacity) - rgba(255, 255, 255, 1) */
  textGlowIntense: 'rgba(255, 255, 255, 1)',
  /** Card box shadow color - rgba(0, 0, 0, 0.2) */
  shadowCard: 'rgba(0, 0, 0, 0.2)',
} as const

/**
 * Complete color system combining all color token categories.
 *
 * @remarks
 * Central export containing all color tokens organized by purpose:
 * - {@link gray}: Grayscale palette
 * - {@link backgrounds}: Background colors
 * - {@link borders}: Border colors
 * - {@link text}: Text colors
 * - {@link accents}: Accent and semantic colors
 * - {@link effectColors}: Shadow and glow colors
 *
 * @example
 * ```ts
 * import { colors } from '@/lib/theme/colors'
 *
 * // Access any color token
 * const primaryText = colors.text.primary
 * const cardBg = colors.backgrounds.card
 * const linkColor = colors.accents.link
 * ```
 *
 * @category Theme
 * @public
 */
export const colors = {
  gray,
  backgrounds,
  borders,
  text,
  accents,
  effectColors,
} as const

/**
 * TypeScript type representing all available color tokens.
 *
 * @remarks
 * Use this type for type-safe color access in components and utilities.
 *
 * @category Theme
 * @public
 */
export type ColorTokens = typeof colors