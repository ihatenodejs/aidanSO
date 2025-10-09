'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { colors, effects } from '@/lib/theme'
import { Search, X } from 'lucide-react'
import type { DocItem } from '@/lib/docs/types'

interface DocsSearchProps {
  items: DocItem[]
  onSearch: (query: string) => void
  className?: string
}

export default function DocsSearch({
  items,
  onSearch,
  className,
}: DocsSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        setQuery('')
        onSearch('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSearch])

  const handleChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center',
          'rounded-lg border-2',
          effects.transitions.colors
        )}
        style={{
          borderColor: isFocused ? colors.borders.hover : colors.borders.default,
          backgroundColor: colors.backgrounds.card
        }}
        onMouseEnter={(e) => {
          if (!isFocused) {
            e.currentTarget.style.borderColor = colors.borders.hover
          }
        }}
        onMouseLeave={(e) => {
          if (!isFocused) {
            e.currentTarget.style.borderColor = colors.borders.default
          }
        }}
      >
        <Search
          className="absolute left-3 h-5 w-5"
          style={{ color: colors.text.disabled }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search documentation..."
          className={cn(
            'w-full bg-transparent px-10 py-3',
            'text-sm outline-none'
          )}
          style={{
            color: colors.text.primary,
            caretColor: colors.text.secondary
          }}
        />
        {query ? (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-3 rounded p-1',
              effects.transitions.colors
            )}
            style={{ color: colors.text.disabled }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgrounds.hover
              e.currentTarget.style.color = colors.text.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = colors.text.disabled
            }}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd
            className={cn(
              'absolute right-3',
              'rounded border px-2 py-1 text-xs font-mono'
            )}
            style={{
              borderColor: colors.borders.default,
              backgroundColor: colors.backgrounds.cardSolid,
              color: colors.text.disabled
            }}
          >
            ⌘K
          </kbd>
        )}
      </div>

      {query && (
        <div
          className="mt-2 text-xs"
          style={{ color: colors.text.disabled }}
        >
          {items.length} result{items.length !== 1 ? 's' : ''} found
        </div>
      )}
    </div>
  )
}