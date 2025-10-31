/**
 * Card surface styling variants for content containers.
 *
 * Provides consistent styling patterns for card components with various visual treatments.
 * All variants include responsive hover states and smooth transitions.
 *
 * @example
 * ```tsx
 * import { card } from '@/lib/theme/surfaces'
 *
 * // Standard card
 * <div className={card.default}>
 *   <h3>Content</h3>
 * </div>
 *
 * // Domain portfolio card with backdrop blur
 * <div className={card.domain}>
 *   <span>example.com</span>
 * </div>
 *
 * // Featured content with accent border
 * <div className={card.featured}>
 *   <h2>Top Pick</h2>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const card = {
  /** Standard card with bold border and hover effect - use for general content containers */
  default:
    'border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300',

  /** Domain-specific card with glassmorphism effect - used in domain portfolio grid */
  domain:
    'bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-black/20',

  /** Status monitor card with subtle hover border - used on system status page */
  status:
    'rounded-xl border border-gray-800 transition-colors duration-300 hover:border-gray-600',

  /** AI analytics card with padding and hover states - used for usage statistics */
  ai: 'p-6 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300',

  /** Featured/highlighted card with orange accent border and tinted background - used for TopPick component */
  featured: 'p-6 sm:p-8 border-2 border-[#c15f3c] rounded-lg bg-orange-500/5',

  /** Minimal card with thin border only - use for nested or subtle containers */
  simple: 'border border-gray-700 rounded-lg'
} as const

/**
 * Section surface styling variants for page layout containers.
 *
 * Sections are larger content areas that organize page content into logical blocks.
 * Use these for page-level organization and content grouping.
 *
 * @example
 * ```tsx
 * import { section } from '@/lib/theme/surfaces'
 *
 * // Standard section with responsive padding
 * <section className={section.default}>
 *   <h2>Section Title</h2>
 *   <p>Content...</p>
 * </section>
 *
 * // Compact section for tighter layouts
 * <section className={section.compact}>
 *   <div>Dense content</div>
 * </section>
 *
 * // Plain section for nested content (no border)
 * <div className={section.plain}>
 *   <div>Nested content without visual container</div>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const section = {
  /** Standard section with responsive padding, border, and hover effect - use for main content areas */
  default:
    'p-4 sm:p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300',

  /** Compact section with reduced padding - use for sidebar or constrained layouts */
  compact:
    'p-4 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300',

  /** Plain section with padding only (no border) - use for nested content areas */
  plain: 'p-4 sm:p-8'
} as const

/**
 * Panel surface styling variants for overlays and UI elements.
 *
 * Panels are floating or fixed UI elements like dropdowns, modals, and sidebars.
 * These styles provide consistent backdrop effects and layering.
 *
 * @example
 * ```tsx
 * import { panel } from '@/lib/theme/surfaces'
 *
 * // Dropdown menu
 * <div className={panel.dropdown}>
 *   <button>Menu Item 1</button>
 *   <button>Menu Item 2</button>
 * </div>
 *
 * // Modal overlay
 * <div className={panel.overlay}>
 *   <h3>Modal Content</h3>
 * </div>
 *
 * // Sidebar navigation
 * <aside className={panel.sidebar}>
 *   <nav>Links...</nav>
 * </aside>
 * ```
 *
 * @category Theme
 * @public
 */
export const panel = {
  /** Dropdown panel with solid background and shadow - use for menus and popovers */
  dropdown: 'bg-gray-800 rounded-lg shadow-xl border border-gray-700',

  /** Overlay panel with translucent backdrop blur - use for modals and dialogs */
  overlay: 'bg-gray-800/95 backdrop-blur-sm border border-gray-700/50',

  /** Sidebar panel with right border - use for navigation sidebars */
  sidebar: 'bg-gray-900/50 backdrop-blur-sm border-r border-gray-800'
} as const

/**
 * Button surface styling variants for interactive elements.
 *
 * Button styles provide consistent interaction patterns across navigation,
 * CTAs, and other clickable elements.
 *
 * @example
 * ```tsx
 * import { button } from '@/lib/theme/surfaces'
 *
 * // Navigation button
 * <button className={button.nav}>
 *   Home
 * </button>
 *
 * // Primary CTA button
 * <button className={button.primary}>
 *   Get Started
 * </button>
 *
 * // Active state (combine with nav)
 * <button className={cn(button.nav, button.active)}>
 *   Current Page
 * </button>
 *
 * // Icon button
 * <button className={button.icon}>
 *   <IconComponent />
 * </button>
 * ```
 *
 * @category Theme
 * @public
 */
export const button = {
  /** Navigation button with subtle hover - use for header/sidebar navigation links */
  nav: 'text-gray-300 hover:text-white hover:bg-gray-700 rounded-md px-3 py-2 transition-all duration-300',

  /** Dropdown menu item with translucent hover - use for menu items in dropdowns */
  dropdownItem:
    'text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-md transition-all duration-300',

  /** Active state styling - combine with nav for current page indication */
  active: 'text-white bg-gray-700/50',

  /** Icon-only button with fixed size - use for toolbar icons and action buttons */
  icon: 'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-800 text-gray-300',

  /** Primary CTA button with shadow and lift effect - use for main call-to-action elements */
  primary:
    'bg-gray-800 text-white font-bold py-2 px-4 rounded-sm shadow-md transition-all duration-300 ease-in-out hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5'
} as const

/**
 * Badge surface styling variants for labels and status indicators.
 *
 * Badges are small inline labels used for categories, tags, and status indicators.
 * All variants use consistent sizing with semantic color coding.
 *
 * @example
 * ```tsx
 * import { badge } from '@/lib/theme/surfaces'
 *
 * // Default badge
 * <span className={badge.default}>Tag</span>
 *
 * // Muted/subtle badge
 * <span className={badge.muted}>Draft</span>
 *
 * // Status badges with semantic colors
 * <span className={badge.success}>Active</span>
 * <span className={badge.warning}>Pending</span>
 * <span className={badge.error}>Error</span>
 * <span className={badge.accent}>Featured</span>
 * ```
 *
 * @category Theme
 * @public
 */
export const badge = {
  /** Default badge with neutral gray background - use for general tags and categories */
  default: 'px-2 py-1 bg-gray-700 rounded text-xs text-gray-300',

  /** Muted badge with darker background - use for secondary or de-emphasized labels */
  muted: 'px-2 py-1 bg-gray-800 rounded text-xs text-gray-400',

  /** Accent badge with orange theme colors - use for featured or highlighted items */
  accent:
    'px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-300',

  /** Success badge with green colors - use for active, completed, or positive status */
  success:
    'px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300',

  /** Warning badge with yellow colors - use for pending, caution, or attention states */
  warning:
    'px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-300',

  /** Error badge with red colors - use for errors, failures, or critical states */
  error:
    'px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300'
} as const

/**
 * Spacing utilities for consistent layout and content organization.
 *
 * Provides responsive spacing patterns for page layouts, sections, grids, and content flow.
 * All spacing values use Tailwind's responsive breakpoints for mobile-first design.
 *
 * @example
 * ```tsx
 * import { spacing } from '@/lib/theme/surfaces'
 *
 * // Page-level container with responsive padding
 * <main className={spacing.page}>
 *   <div>Page content</div>
 * </main>
 *
 * // Section container with vertical spacing
 * <div className={spacing.section}>
 *   <section>Section 1</section>
 *   <section>Section 2</section>
 * </div>
 *
 * // Grid layout with responsive gaps
 * <div className={cn('grid grid-cols-2', spacing.grid)}>
 *   <div>Grid item 1</div>
 *   <div>Grid item 2</div>
 * </div>
 *
 * // Content flow with consistent vertical rhythm
 * <article className={spacing.content}>
 *   <p>Paragraph 1</p>
 *   <p>Paragraph 2</p>
 * </article>
 * ```
 *
 * @category Theme
 * @public
 */
export const spacing = {
  /** Page-level responsive padding - use on main containers and page wrappers */
  page: 'px-4 py-8 sm:px-6 lg:px-8',

  /** Vertical spacing between major sections - creates consistent rhythm on pages */
  section: 'space-y-8',

  /** Grid gap with responsive sizing - use with CSS Grid or flex layouts */
  grid: 'gap-4 sm:gap-6',

  /** Content flow vertical spacing - use for text content and article layouts */
  content: 'space-y-4'
} as const

/**
 * Layout grid utilities for responsive card and content grids.
 *
 * Provides pre-configured responsive grid layouts with mobile-first column breakpoints.
 * All layouts include consistent gap spacing and padding.
 *
 * @example
 * ```tsx
 * import { layout } from '@/lib/theme/surfaces'
 *
 * // 3-column grid (homepage, about page)
 * <div className={layout.grid3col}>
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </div>
 *
 * // 2-column grid
 * <div className={layout.grid2col}>
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 * </div>
 *
 * // 4-column grid (stats, icons)
 * <div className={layout.grid4col}>
 *   <div>Stat 1</div>
 *   <div>Stat 2</div>
 *   <div>Stat 3</div>
 *   <div>Stat 4</div>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const layout = {
  /** 2-column responsive grid - 1 col mobile, 2 cols tablet+ */
  grid2col: 'grid grid-cols-1 md:grid-cols-2 gap-4 p-4',

  /** 3-column responsive grid - 1 col mobile, 2 cols tablet, 3 cols desktop - use for homepage and about page */
  grid3col: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4',

  /** 4-column responsive grid - 2 cols mobile, 4 cols tablet+ */
  grid4col: 'grid grid-cols-2 md:grid-cols-4 gap-4'
} as const

/**
 * Surface design tokens for consistent UI styling across the application.
 *
 * Provides a comprehensive set of pre-configured surface styles for cards, sections,
 * panels, buttons, badges, and spacing. All styles follow the dark theme design system
 * with consistent colors, borders, shadows, and transitions.
 *
 * @remarks
 * This is the main theme export. Import individual categories or the full surfaces object
 * depending on your needs. All variants support responsive design and include smooth
 * hover transitions.
 *
 * @example
 * ```tsx
 * import { surfaces } from '@/lib/theme/surfaces'
 * // or
 * import { card, button, badge } from '@/lib/theme/surfaces'
 *
 * // Using the full surfaces object
 * <div className={surfaces.card.default}>
 *   <h2>Card Title</h2>
 * </div>
 *
 * // Using individual imports
 * <div className={card.domain}>
 *   <span>example.com</span>
 * </div>
 * ```
 *
 * @category Theme
 * @public
 */
export const surfaces = {
  card,
  section,
  panel,
  button,
  badge,
  spacing,
  layout
} as const

/**
 * TypeScript type representing all available surface tokens.
 *
 * Use this type for type-safe access to surface styles in components.
 *
 * @example
 * ```tsx
 * import type { SurfaceTokens } from '@/lib/theme/surfaces'
 *
 * function CustomComponent(props: { surfaces: SurfaceTokens }) {
 *   return <div className={props.surfaces.card.default}>Content</div>
 * }
 * ```
 *
 * @category Theme
 * @public
 */
export type SurfaceTokens = typeof surfaces
