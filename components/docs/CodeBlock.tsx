'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'
import { colors, effects } from '@/lib/theme'
import { Copy, Check } from 'lucide-react'

/**
 * Supported syntax highlighting languages for code blocks.
 *
 * @remarks
 * This list includes the most commonly used languages in the codebase.
 * Languages are validated and normalized to ensure proper syntax highlighting.
 */
const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'ts',
  'js',
  'json',
  'bash',
  'shell',
  'css',
  'scss',
  'html',
  'markdown',
  'yaml',
  'sql',
] as const

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

/**
 * Normalizes language identifiers to their canonical forms.
 *
 * @param language - Raw language identifier from code fence
 * @returns Normalized language identifier for syntax highlighting
 *
 * @remarks
 * **Normalization rules:**
 * - 'ts' → 'typescript'
 * - 'js' → 'javascript'
 * - Invalid languages → 'typescript' (safe default)
 * - All other valid languages → unchanged
 *
 * This ensures consistent syntax highlighting even when JSDoc
 * examples use shorthand language identifiers.
 *
 * @example
 * ```ts
 * normalizeLanguage('ts')         // Returns: 'typescript'
 * normalizeLanguage('tsx')        // Returns: 'tsx'
 * normalizeLanguage('invalid')    // Returns: 'typescript'
 * ```
 *
 * @private
 */
function normalizeLanguage(language: string): SupportedLanguage {
  const normalized = language.toLowerCase()

  // Map common shorthands to full names
  if (normalized === 'ts') return 'typescript'
  if (normalized === 'js') return 'javascript'

  // Validate against supported languages
  if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage
  }

  // Default to typescript for unknown languages
  return 'typescript'
}

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  className?: string
}

export default function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const normalizedLanguage = normalizeLanguage(language)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('group relative', className)}>
      {title && (
        <div
          className="flex items-center justify-between rounded-t-lg border-2 border-b-0 px-4 py-2.5"
          style={{
            borderColor: colors.borders.default,
            backgroundColor: colors.backgrounds.card
          }}
        >
          <span className="text-sm font-medium" style={{ color: colors.text.secondary }}>
            {title}
          </span>
          <span className="text-xs font-mono" style={{ color: colors.text.disabled }}>
            {normalizedLanguage}
          </span>
        </div>
      )}
      <div
        className={cn(
          'relative overflow-x-auto',
          title ? 'rounded-b-lg' : 'rounded-lg',
          'border-2'
        )}
        style={{
          borderColor: colors.borders.default,
          backgroundColor: colors.backgrounds.cardSolid
        }}
      >
        <button
          onClick={handleCopy}
          className={cn(
            'absolute right-3 top-3 z-10',
            'rounded-md px-3 py-1.5',
            'text-xs font-medium',
            'flex items-center gap-1.5',
            'opacity-0 transition-all duration-200',
            'group-hover:opacity-100',
            copied && 'opacity-100',
            effects.transitions.all
          )}
          style={{
            backgroundColor: colors.backgrounds.card,
            color: copied ? colors.accents.success : colors.text.muted,
            borderWidth: '2px',
            borderColor: copied ? colors.accents.success : colors.borders.default
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.backgroundColor = colors.backgrounds.hover
              e.currentTarget.style.borderColor = colors.borders.hover
              e.currentTarget.style.color = colors.text.secondary
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.backgroundColor = colors.backgrounds.card
              e.currentTarget.style.borderColor = colors.borders.default
              e.currentTarget.style.color = colors.text.muted
            }
          }}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: 'transparent',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}