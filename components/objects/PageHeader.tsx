import { ReactNode } from 'react'

interface PageHeaderProps {
  icon: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  className
}: PageHeaderProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">{icon}</div>
        <h1 className="glow mt-2 text-center text-4xl font-bold text-gray-200">
          {title}
        </h1>
        {subtitle && <p className="text-center text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}
