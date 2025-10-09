import { ReactNode } from 'react'

interface PageHeaderProps {
  icon: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export default function PageHeader({ icon, title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          {icon}
        </div>
        <h1 className="text-4xl font-bold mt-2 text-center text-gray-200 glow">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-center">{subtitle}</p>
        )}
      </div>
    </div>
  )
}