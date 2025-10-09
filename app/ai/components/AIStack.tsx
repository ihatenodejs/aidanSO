import { TbStack2 } from 'react-icons/tb'
import Link from '@/components/objects/Link'
import type { AITool } from '../types'

interface AIStackProps {
  tools: AITool[]
}

export default function AIStack({ tools }: AIStackProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'primary': return 'text-green-400 border-green-400 bg-green-400/10'
      case 'active': return 'text-green-300 border-green-300 bg-green-300/10'
      case 'occasional': return 'text-orange-300 border-orange-300 bg-orange-300/10'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'primary': return 'Primary'
      case 'active': return 'Active Use'
      case 'occasional': return 'Occasional Use'
      default: return status
    }
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free'
    if (price % 1 === 0) return `$${price}/mo`
    return `$${price.toFixed(2)}/mo`
  }

  return (
    <section className="p-4 sm:p-6 lg:p-8 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 flex items-center gap-2">
          <TbStack2 size={20} className="sm:w-6 sm:h-6" />
          My AI Stack
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">The AI tools I use as a part of my routine and workflow.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {tools.map((tool, index) => (
          <div key={index} className="p-3 sm:p-4 border border-gray-700 rounded-lg hover:border-gray-500 transition-all duration-300 flex flex-col">
            <div className="flex items-start justify-between mb-2 sm:mb-3 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {tool.icon && <tool.icon className="text-xl sm:text-2xl text-gray-300 flex-shrink-0" />}
                {tool.svg && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 fill-current flex-shrink-0">
                    {tool.svg}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-200 truncate">{tool.name}</h3>
                    {tool.price !== undefined && (
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {tool.discountedPrice !== undefined ? (
                          <>
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              {formatPrice(tool.price)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-200">
                              {formatPrice(tool.discountedPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-200">
                            {formatPrice(tool.price)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{tool.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 gap-2">
              <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-full border whitespace-nowrap ${getStatusColor(tool.status)}`}>
                {getStatusLabel(tool.status)}
              </span>
              <span className="flex flex-row items-center gap-2 sm:gap-4">
                {tool.link && (
                  <Link
                    href={tool.link}
                    className="text-xs sm:text-sm hover:text-blue-300 whitespace-nowrap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit →
                  </Link>
                )}
                {(tool.usage || tool.hasUsage) && (
                  <Link
                    href={tool.usage ?? '/ai/usage'}
                    className="text-xs sm:text-sm hover:text-blue-300 whitespace-nowrap"
                  >
                    Usage →
                  </Link>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
