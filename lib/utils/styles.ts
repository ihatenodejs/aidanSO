/**
 * Props to apply to external links for security and UX best practices.
 *
 * @remarks
 * These props should be spread onto anchor tags that link to external sites:
 * - `target="_blank"`: Opens link in new tab
 * - `rel="noopener noreferrer"`: Prevents security vulnerabilities and referrer leakage
 *
 * @example
 * ```tsx
 * import { externalLinkProps } from '@/lib/utils/styles'
 *
 * <a href="https://external-site.com" {...externalLinkProps}>
 *   Visit Site
 * </a>
 * ```
 *
 * @category Utils
 * @public
 */
export const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
} as const

/**
 * Type guard to check if a URL string is an external link (starts with http/https).
 *
 * @param href - URL string to check
 * @returns Type predicate narrowing href to `http${string}` if external
 *
 * @remarks
 * This function is useful for conditional rendering of external link attributes
 * or icons. It narrows the TypeScript type to indicate an HTTP(S) URL.
 *
 * @example
 * ```tsx
 * import { isExternalHref, externalLinkProps } from '@/lib/utils/styles'
 *
 * function Link({ href, children }) {
 *   const external = isExternalHref(href)
 *
 *   return (
 *     <a href={href} {...(external ? externalLinkProps : {})}>
 *       {children}
 *       {external && <ExternalIcon />}
 *     </a>
 *   )
 * }
 * ```
 *
 * @category Utils
 * @public
 */
export const isExternalHref = (href?: string): href is `http${string}` =>
  typeof href === 'string' && href.startsWith('http')
