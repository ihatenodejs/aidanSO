import { cn } from '@/lib/utils'
import { colors, surfaces, effects } from '@/lib/theme'
import type { DocItem } from '@/lib/docs/types'
import CodeBlock from './CodeBlock'
import TypeLink from './TypeLink'
import { ExternalLink, TriangleAlert } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface TypeDocProps {
  item: DocItem
  className?: string
  availableTypeIds?: Set<string>
}

export default function TypeDoc({ item, className, availableTypeIds }: TypeDocProps) {
  return (
    <div id={item.id} className={cn('scroll-mt-20', className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                {item.name}
              </h3>
              <span
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium'
                )}
                style={{
                  backgroundColor: colors.backgrounds.card,
                  color: colors.text.secondary
                }}
              >
                {item.kind}
              </span>
              <span
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium'
                )}
                style={{
                  backgroundColor: colors.accents.docsBg,
                  color: colors.accents.docs,
                  borderWidth: '1px',
                  borderColor: colors.accents.docsBorder
                }}
              >
                {item.category}
              </span>
              {item.deprecated && (
                <span
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium'
                  )}
                  style={{
                    backgroundColor: colors.accents.warningBg,
                    color: colors.accents.warning
                  }}
                >
                  <TriangleAlert className="h-3 w-3" />
                  Deprecated
                </span>
              )}
            </div>
            {item.description && (
              <p className="leading-relaxed" style={{ color: colors.text.body }}>
                {item.description}
              </p>
            )}
          </div>
          {item.source && (
            <a
              href={`https://github.com/ihatenodejs/aidxnCC/blob/main/${item.source.file}#L${item.source.line}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-2',
                'text-xs border-2',
                effects.transitions.colors,
                'flex-shrink-0'
              )}
              style={{
                color: colors.text.muted,
                borderColor: colors.borders.default
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.borders.hover
                e.currentTarget.style.color = colors.text.secondary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.borders.default
                e.currentTarget.style.color = colors.text.muted
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Source
            </a>
          )}
        </div>

        {/* Remarks */}
        {item.remarks && (
          <div
            className={cn(
              'rounded-lg border-l-4 pl-4 py-2',
              'space-y-2'
            )}
            style={{
              borderColor: colors.accents.ai,
              backgroundColor: colors.backgrounds.card
            }}
          >
            <h4 className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Remarks
            </h4>
            <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none" style={{ color: colors.text.body }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.remarks}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Type Definition */}
        {item.signature && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Definition
            </h4>
            <CodeBlock
              code={item.kind === 'interface' ? `interface ${item.name} ${item.signature}` : `${item.kind} ${item.name} = ${item.signature}`}
              language="typescript"
            />
          </div>
        )}

        {/* Interface Properties */}
        {item.kind === 'interface' && item.parameters && item.parameters.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Properties
            </h4>
            <div className="overflow-x-auto rounded-lg border-2" style={{ borderColor: colors.borders.default }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: colors.borders.default, backgroundColor: colors.backgrounds.card }}>
                    <th className="px-4 py-3 text-left font-medium" style={{ color: colors.text.muted }}>
                      Property
                    </th>
                    <th className="px-4 py-3 text-left font-medium" style={{ color: colors.text.muted }}>
                      Type
                    </th>
                    <th className="px-4 py-3 text-left font-medium" style={{ color: colors.text.muted }}>
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {item.parameters.map((prop, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-0"
                      style={{ borderColor: colors.borders.subtle }}
                    >
                      <td className="px-4 py-3 font-mono" style={{ color: colors.text.secondary }}>
                        {prop.name}
                        {prop.optional && (
                          <span style={{ color: colors.text.disabled }}>?</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <TypeLink type={prop.type} className="text-xs" availableTypeIds={availableTypeIds} />
                      </td>
                      <td className="px-4 py-3" style={{ color: colors.text.body }}>
                        {prop.description || '—'}
                        {prop.defaultValue && (
                          <div className="mt-1 text-xs" style={{ color: colors.text.disabled }}>
                            Default: <code>{prop.defaultValue}</code>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Examples */}
        {item.examples && item.examples.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              Examples
            </h4>
            <div className="space-y-4">
              {item.examples.map((example, index) => (
                <CodeBlock
                  key={index}
                  code={example.code}
                  language={example.language}
                  showLineNumbers
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={cn(surfaces.badge.muted)}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* See Also */}
        {item.see && item.see.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: colors.text.secondary }}>
              See Also
            </h4>
            <div className="space-y-2">
              {item.see.map((ref, index) => (
                <div
                  key={index}
                  className="text-sm"
                  style={{ color: colors.text.body }}
                >
                  {ref}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
